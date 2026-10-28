/**
 * 템플릿 유사문서 게이트 (빌드 후 실행)
 *
 *   npm run seo:verify:near-duplicate
 *   node scripts/verify-near-duplicate.mjs [outDir] [--report]
 *
 * 왜 필요한가 (2026-10 네이버 색인 감사)
 *  /website/<업종>/ 294개는 업종명만 바꾼 같은 문장이 본문의 80% 였다(5어절 슁글 Jaccard 평균 0.51,
 *  페이지 쌍의 91% 가 0.5 이상). 네이버는 이런 묶음을 유사문서로 접어 한 페이지만 남기거나 전부 내린다.
 *  lib/index-quality.ts 의 색인 게이트는 낱말 집합(Jaccard ≥ 0.7)만 봐서 반복 문장 틀을 잡지 못한다.
 *  → 렌더된 본문에서 업종명을 가린 5어절 슁글로 같은 묶음끼리 비교해, 평균이 임계를 넘으면 빌드를 막는다.
 *
 * 무엇을 보나
 *  <main> 안의 보이는 글자(스크립트·스타일·태그 제외)에서 h1 의 업종명을 ■ 로 바꾸고 5어절 슁글 집합을 만든다.
 *  묶음 안 모든 쌍의 Jaccard 평균·0.5 이상 비율·페이지 고유 슁글 비율을 낸다.
 *  임계는 묶음마다 다르다 — 업종 홈페이지는 고유 문단을 넣은 뒤 기준(0.35)으로 잠근다.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const OUT = args.find((a) => !a.startsWith('--')) || 'out';
const REPORT = args.includes('--report');

/** [묶음 이름, 경로 판정, 실패 임계(평균 Jaccard) — null 이면 보고만] */
const FAMILIES = [
  ['website', (p) => /^website\/[^/]+\/index\.html$/.test(p), 0.35],
  ['ai-automation', (p) => /^ai-automation\/[^/]+\/index\.html$/.test(p), 0.35],
  // 색인 키워드 랜딩(/l/) — 쇼핑몰·웹 계열이 틀을 공유했다(2026-10 보고)
  ['landings', (p) => /^l\/[^/]+\/index\.html$/.test(p), 0.35],
  // 거점 지역×서비스 25조합 — 같은 서비스의 다른 지역끼리 비교
  ['region-service', (p) => /^(app-development|web-development|mvp|flutter|ai-development)\/[^/]+\/index\.html$/.test(p), 0.35],
  ['cost', (p) => /^cost\/[^/]+\/index\.html$/.test(p), null],
  ['solution', (p) => /^solution\/[^/]+\/index\.html$/.test(p), null],
  ['app', (p) => /^app\/[^/]+\/index\.html$/.test(p), null],
];

function walk(dir, base = dir, out = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, base, out);
    else if (p.endsWith('.html')) out.push(p.slice(base.length + 1));
  }
  return out;
}

const unescape = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&nbsp;/g, ' ');

/** <main> 본문 텍스트 — 업종명(h1 의 첫 어절 묶음)을 가린다 */
function mainText(html) {
  const main = (html.match(/<main\b[\s\S]*?<\/main>/i) || [html])[0];
  const h1 = unescape((main.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || [, ''])[1].replace(/<[^>]+>/g, ' ')).trim();
  let text = unescape(main.replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
  // h1 "치과 홈페이지 제작" → 업종명 "치과" (뒤의 공통 접미를 뗀 앞부분)
  const name = h1.replace(/\s*(홈페이지 제작|앱 개발|앱개발|솔루션|AI 자동화|개발 비용|홈페이지).*$/, '').trim();
  if (name.length >= 2) text = text.split(name).join('■');
  return text;
}

function shingles(text, k = 5) {
  const w = text.split(/\s+/).filter(Boolean);
  const set = new Set();
  for (let i = 0; i + k <= w.length; i++) set.add(w.slice(i, i + k).join(' '));
  return set;
}

function jaccard(a, b) {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter || 1);
}

if (!existsSync(OUT)) {
  console.error(`${OUT}/ 이 없습니다. 먼저 npm run build 를 실행하세요.`);
  process.exit(1);
}
const files = walk(OUT);
const fail = [];
console.log(`\n템플릿 유사문서 검사 (${OUT}/) — 5어절 슁글, 업종명 가림`);
console.log('─'.repeat(72));
for (const [name, test, limit] of FAMILIES) {
  const pages = files.filter(test).map((f) => ({ f, s: shingles(mainText(readFileSync(join(OUT, f), 'utf8'))) }));
  if (pages.length < 2) continue;
  let sum = 0, n = 0, hi = 0;
  const freq = new Map();
  for (const p of pages) for (const x of p.s) freq.set(x, (freq.get(x) || 0) + 1);
  let uniqueShare = 0;
  for (const p of pages) {
    let u = 0;
    for (const x of p.s) if (freq.get(x) === 1) u++;
    uniqueShare += p.s.size ? u / p.s.size : 0;
  }
  uniqueShare /= pages.length;
  for (let i = 0; i < pages.length; i++)
    for (let j = i + 1; j < pages.length; j++) {
      const v = jaccard(pages[i].s, pages[j].s);
      sum += v; n++;
      if (v >= 0.5) hi++;
    }
  const avg = sum / n;
  const line = `${name.padEnd(14)} ${String(pages.length).padStart(4)}p  평균 Jaccard ${avg.toFixed(3)}  ≥0.5 쌍 ${((hi / n) * 100).toFixed(0)}%  페이지 고유 슁글 ${(uniqueShare * 100).toFixed(0)}%` + (limit !== null ? `  (임계 ${limit})` : '  (보고만)');
  console.log(line);
  if (limit !== null && avg >= limit) fail.push(`[${name}] 평균 Jaccard ${avg.toFixed(3)} ≥ ${limit} — 업종별 고유 문단이 빠졌거나 템플릿 문장이 다시 늘었다`);
  if (REPORT) {
    const worst = [];
    for (let i = 0; i < pages.length; i++) for (let j = i + 1; j < pages.length; j++) worst.push([jaccard(pages[i].s, pages[j].s), pages[i].f, pages[j].f]);
    worst.sort((a, b) => b[0] - a[0]);
    for (const [v, a, b] of worst.slice(0, 3)) console.log(`    ${v.toFixed(2)}  ${a}  ↔  ${b}`);
  }
}
console.log('─'.repeat(72));
if (fail.length) {
  for (const f of fail) console.error('✗ ' + f);
  process.exit(1);
}
console.log('✓ 템플릿 유사문서 검사 통과');
