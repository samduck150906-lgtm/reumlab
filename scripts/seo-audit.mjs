#!/usr/bin/env node
/**
 * SEO 자동 검증 — 정적 export 결과(out/)의 실제 렌더링 HTML을 검사합니다.
 * 네이버 서치어드바이저 "title 요소 2개 이상" 재발 방지가 1차 목적입니다.
 *
 * 사용: node scripts/seo-audit.mjs [dir]   (기본 dir = out)
 * 종료코드: title 중복 등 치명 오류가 1건이라도 있으면 1, 없으면 0.
 *
 * 검사 항목(페이지당 실제 HTML 기준):
 *   - <title> 요소 개수 (정확히 1개여야 함 — SVG <title> 포함 전수 집계 = 네이버와 동일 관점)
 *   - <title> 비어 있음 / 사이트 전역 중복
 *   - <meta name="description"> 존재 / 중복
 *   - <h1> 개수 (1개 권장)
 *   - <link rel="canonical"> 존재
 * 외부 의존성 없이 표준 라이브러리만 사용합니다.
 */
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.argv[2] || 'out';
if (!existsSync(ROOT)) {
  console.error(`[seo-audit] 대상 폴더가 없습니다: ${ROOT} — 먼저 빌드하세요 (npm run build).`);
  process.exit(2);
}

/** out/ 안의 모든 *.html 수집 */
function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (name === '_next' || name === 'assets') continue; // 정적 자산 스킵
      walk(p, acc);
    } else if (name.endsWith('.html')) {
      // 검색엔진 소유확인 토큰·Netlify 폼감지 파일은 콘텐츠 페이지가 아니므로 제외
      if (/^google[0-9a-f]/.test(name) || name === 'google-site-verification.html'
        || /^naver[0-9a-f]/.test(name) || name === '__forms.html'
        || name === '404.html' || dir.split(/[\\/]/).pop() === '404') continue;
      acc.push(p);
    }
  }
  return acc;
}

const files = walk(ROOT);
const urlOf = (f) => '/' + relative(ROOT, f).replace(/index\.html$/, '').replace(/\\/g, '/');

const count = (html, re) => (html.match(re) || []).length;
const titleRe = /<title[\s>]/gi;
const h1Re = /<h1[\s>]/gi;
const descRe = /<meta[^>]+name=["']description["'][^>]*>/i;
const canonRe = /<link[^>]+rel=["']canonical["'][^>]*>/i;
const titleTextRe = /<title[^>]*>([\s\S]*?)<\/title>/i;

const rows = [];
const titleSeen = new Map();
const descSeen = new Map();

for (const f of files) {
  const html = readFileSync(f, 'utf8');
  const titleCount = count(html, titleRe);
  const h1Count = count(html, h1Re);
  const hasDesc = descRe.test(html);
  const hasCanon = canonRe.test(html);
  const titleText = (html.match(titleTextRe)?.[1] || '').trim();
  const descText = (html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] || '').trim();

  const fails = [];
  const warns = [];
  if (titleCount === 0) fails.push('title 없음');
  else if (titleCount > 1) fails.push(`title ${titleCount}개(중복)`);
  if (titleCount === 1 && !titleText) fails.push('title 비어 있음');
  if (!hasDesc) warns.push('description 없음');
  if (h1Count === 0) warns.push('h1 없음');
  else if (h1Count > 1) warns.push(`h1 ${h1Count}개`);
  if (!hasCanon) warns.push('canonical 없음');

  if (titleText) titleSeen.set(titleText, (titleSeen.get(titleText) || 0) + 1);
  if (descText) descSeen.set(descText, (descSeen.get(descText) || 0) + 1);

  rows.push({ url: urlOf(f), titleCount, h1Count, hasDesc, hasCanon, fails, warns, titleText, descText });
}

// 사이트 전역 중복 title/description 표시 (1차 패스에서 저장한 값 재사용)
for (const r of rows) {
  if (r.titleText && titleSeen.get(r.titleText) > 1) r.warns.push(`title 중복(${titleSeen.get(r.titleText)}개 페이지)`);
  if (r.descText && descSeen.get(r.descText) > 1) r.warns.push(`description 중복(${descSeen.get(r.descText)}개)`);
}

const failed = rows.filter((r) => r.fails.length);
const warned = rows.filter((r) => r.warns.length);

console.log(`\n[seo-audit] 검사 페이지: ${rows.length}개  (대상: ${ROOT})`);
console.log(`  치명 오류(FAIL): ${failed.length}개   경고(WARN): ${warned.length}개\n`);

for (const r of failed) console.log(`[FAIL] ${r.url} — ${r.fails.join(', ')} (title=${r.titleCount})`);
if (failed.length && warned.length) console.log('');
for (const r of warned.slice(0, 40)) console.log(`[WARN] ${r.url} — ${r.warns.join(', ')}`);
if (warned.length > 40) console.log(`  …외 ${warned.length - 40}건 경고`);

// title 개수 요약
const dist = {};
for (const r of rows) dist[r.titleCount] = (dist[r.titleCount] || 0) + 1;
console.log(`\n  title 개수 분포: ${JSON.stringify(dist)}`);

// 사이트 전역 중복 요약 (2개 이상 페이지가 공유하는 title/description)
const dupTitles = [...titleSeen.entries()].filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]);
const dupDescs = [...descSeen.entries()].filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]);
const noDesc = rows.filter((r) => !r.hasDesc).length;
console.log(`\n  중복 title: ${dupTitles.length}종 · 중복 description: ${dupDescs.length}종 · description 없음: ${noDesc}개`);
if (dupTitles.length) {
  console.log('  ── 중복 title (상위) ──');
  for (const [t, n] of dupTitles.slice(0, 15)) console.log(`    ×${n}  ${t}`);
}
if (dupDescs.length) {
  console.log('  ── 중복 description (상위) ──');
  for (const [d, n] of dupDescs.slice(0, 15)) console.log(`    ×${n}  ${d.slice(0, 70)}…`);
}
console.log(failed.length ? `\n[seo-audit] 실패: title 오류 ${failed.length}건\n` : `\n[seo-audit] 통과: 모든 페이지 title 정확히 1개\n`);

process.exit(failed.length ? 1 : 0);
