/**
 * 사이트맵·robots 산출물 검증 (빌드 후 실행, 프로덕션 런타임 코드 아님)
 *
 *   npm run seo:verify        # out/ 을 검사
 *   node scripts/verify-sitemap.mjs [outDir]
 *
 * 정적 호스팅(Netlify, publish=out)에서는 "URL → out/ 안의 파일"이 1:1이므로,
 * 네트워크 요청 없이도 사이트맵의 각 URL 이 200 으로 열리는지 오프라인으로 판정할 수 있다.
 * 확인 항목:
 *   1. XML 파싱 · <loc> 개수 · 중복 URL
 *   2. 도메인 정규화 (전부 https://reumlab.com, www·http 혼용 없음)
 *   3. trailing slash 정책 일관성
 *   4. 200 여부 — out/<path>/index.html 이 실제로 존재하는가
 *   5. 301 여부 — public/_redirects 규칙에 걸려 리다이렉트되는 URL 이 섞였는가
 *   6. noindex 여부 — 해당 페이지가 meta robots noindex 인가 (사이트맵과 모순)
 *   7. canonical 일치 — 페이지의 <link rel="canonical"> 이 사이트맵 URL 과 같은가
 *   8. robots.txt — 사이트맵 선언·문법·사이트맵 URL 이 robots 규칙에 막히는지
 *
 * 종료 코드: 문제 0건이면 0, 하나라도 있으면 1.
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const OUT = process.argv[2] || 'out';
import { readSitemapXml } from './read-sitemap.mjs';

const ORIGIN = 'https://reumlab.com';

const fail = [];
const warn = [];
const note = (arr, kind, msg) => arr.push(`[${kind}] ${msg}`);

// ─────────────────────────────────────────── sitemap 읽기
const sitemapPath = join(OUT, 'sitemap.xml');
if (!existsSync(sitemapPath)) {
  console.error(`✗ ${sitemapPath} 가 없습니다. 먼저 npm run build 를 실행하세요.`);
  process.exit(1);
}
const xml = readFileSync(sitemapPath, 'utf8');

// gzip 매직 바이트(1f 8b)로 시작하면 .xml 경로에 압축 바이너리가 놓인 것
const rawHead = readFileSync(sitemapPath).subarray(0, 2);
if (rawHead[0] === 0x1f && rawHead[1] === 0x8b) {
  note(fail, 'gzip', 'sitemap.xml 내용이 gzip 바이너리입니다 (크롤러가 XML로 파싱 불가)');
}
if (!/^﻿?\s*<\?xml/.test(xml)) note(fail, 'xml', 'XML 선언(<?xml ...?>)으로 시작하지 않습니다');
if (!xml.includes('http://www.sitemaps.org/schemas/sitemap/0.9')) {
  note(fail, 'xml', 'sitemap 0.9 네임스페이스가 없습니다');
}
// 태그 균형 — 파서 없이도 잡히는 대표적 파손
// 루트가 sitemapindex 면 urlset·url 은 루트에 없고 자식에 있다 — 태그 짝은 형식에 맞춰 검사한다.
for (const tag of xml.includes('<sitemapindex') ? ['sitemapindex', 'sitemap', 'loc'] : ['urlset', 'url', 'loc']) {
  const open = (xml.match(new RegExp(`<${tag}[\\s>]`, 'g')) || []).length;
  const close = (xml.match(new RegExp(`</${tag}>`, 'g')) || []).length;
  if (open !== close) note(fail, 'xml', `<${tag}> 태그 짝이 맞지 않습니다 (열림 ${open} / 닫힘 ${close})`);
}
const isIndex = xml.includes('<sitemapindex');

// URL 목록은 항상 "사이트맵 전체" 기준이다 — index 면 자식 사이트맵까지 합쳐서 읽는다.
const locs = [...readSitemapXml(OUT).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
  m[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
);

// ─────────────────────────────────────────── _redirects 규칙
const redirectsPath = join(OUT, '_redirects');
const redirectRules = [];
if (existsSync(redirectsPath)) {
  for (const line of readFileSync(redirectsPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const [from, to, code] = t.split(/\s+/);
    if (!from || !to) continue;
    redirectRules.push({ from, to, forced: /!$/.test(code || ''), code: (code || '').replace('!', '') });
  }
}
/** Netlify 규칙 매칭 — 정확히 일치하거나 `/prefix/*` 글롭에 걸리는가 */
function matchRedirect(pathname) {
  for (const r of redirectRules) {
    if (r.from === pathname) return r;
    if (r.from.endsWith('*') && pathname.startsWith(r.from.slice(0, -1))) return r;
  }
  return null;
}

// ─────────────────────────────────────────── URL 하나씩 검증
const seen = new Map();
let missing = 0;
let redirected = 0;
let noindexed = 0;
let canonMismatch = 0;

const decodePath = (p) => {
  try {
    return decodeURIComponent(p);
  } catch {
    return p;
  }
};

/** 정적 호스팅 기준으로 이 URL 을 서빙할 파일 경로 */
function fileFor(pathname) {
  const rel = decodePath(pathname).replace(/^\//, '');
  const candidates = rel === '' ? ['index.html'] : [join(rel, 'index.html'), rel];
  for (const c of candidates) {
    const p = join(OUT, c);
    if (existsSync(p) && statSync(p).isFile()) return p;
  }
  return null;
}

for (const loc of locs) {
  if (seen.has(loc)) {
    note(fail, 'duplicate', `사이트맵에 중복 URL: ${loc}`);
    continue;
  }
  seen.set(loc, true);

  let u;
  try {
    u = new URL(loc);
  } catch {
    note(fail, 'url', `URL 파싱 실패: ${loc}`);
    continue;
  }
  if (u.origin !== ORIGIN) {
    note(fail, 'origin', `도메인 정책 위반(기준 ${ORIGIN}): ${loc}`);
    continue;
  }
  if (u.search || u.hash) note(fail, 'url', `쿼리·프래그먼트 포함 URL: ${loc}`);
  if (!u.pathname.endsWith('/')) note(fail, 'slash', `trailing slash 없음(사이트 정책은 trailingSlash: true): ${loc}`);

  const hit = matchRedirect(u.pathname);

  const file = fileFor(u.pathname);
  if (!file) {
    // 파일이 없고 리다이렉트 규칙에 걸리면 301, 아니면 404
    missing++;
    if (hit) {
      redirected++;
      note(fail, '301', `리다이렉트되는 URL이 사이트맵에 있음 → ${hit.to} : ${loc}`);
    } else {
      note(fail, '404', `out/ 에 해당 파일이 없음(404): ${loc}`);
    }
    continue;
  }
  // 파일이 있어도 강제 리다이렉트(!)면 파일보다 규칙이 우선한다
  if (hit && hit.forced) {
    redirected++;
    note(fail, '301', `강제 리다이렉트(!)되는 URL이 사이트맵에 있음 → ${hit.to} : ${loc}`);
    continue;
  }

  const html = readFileSync(file, 'utf8');

  const robotsMeta = html.match(/<meta name="robots" content="([^"]*)"/i);
  if (robotsMeta && /noindex/i.test(robotsMeta[1])) {
    noindexed++;
    note(fail, 'noindex', `noindex 페이지가 사이트맵에 있음: ${loc}`);
  }

  const canon = html.match(/<link rel="canonical" href="([^"]+)"/i);
  if (!canon) {
    note(warn, 'canonical', `canonical 태그 없음: ${loc}`);
  } else if (decodePath(canon[1]) !== decodePath(loc)) {
    canonMismatch++;
    note(fail, 'canonical', `canonical 불일치 — sitemap ${loc} / canonical ${canon[1]}`);
  }
}

// ─────────────────────────────────────────── robots.txt
const robotsPath = join(OUT, 'robots.txt');
let robotsTxt = '';
if (!existsSync(robotsPath)) {
  note(fail, 'robots', 'out/robots.txt 가 없습니다');
} else {
  robotsTxt = readFileSync(robotsPath, 'utf8');
  const sitemapLines = [...robotsTxt.matchAll(/^Sitemap:\s*(\S+)$/gim)].map((m) => m[1]);
  if (sitemapLines.length === 0) note(fail, 'robots', 'robots.txt 에 Sitemap 선언이 없습니다');
  if (new Set(sitemapLines).size !== sitemapLines.length) {
    note(fail, 'robots', `robots.txt 에 중복 Sitemap 선언: ${sitemapLines.join(', ')}`);
  }
  for (const s of sitemapLines) {
    if (!s.startsWith(ORIGIN + '/')) note(fail, 'robots', `Sitemap 선언 도메인이 기준과 다름: ${s}`);
    const rel = s.slice(ORIGIN.length).replace(/^\//, '');
    if (!existsSync(join(OUT, rel))) note(fail, 'robots', `선언된 sitemap 파일이 산출물에 없음: ${s}`);
  }
  if (!/^User-agent:/im.test(robotsTxt)) note(fail, 'robots', 'User-agent 그룹이 없습니다');

  // 렌더링에 필요한 정적 리소스를 막고 있지 않은지
  const disallows = [...robotsTxt.matchAll(/^Disallow:\s*(\S+)\s*$/gim)].map((m) => m[1]);
  const mustBeCrawlable = ['/_next/', '/_next/static/', '/assets/images/', '/styles.css', '/script.js', '/logo.png'];
  for (const d of disallows) {
    for (const p of mustBeCrawlable) {
      if (p.startsWith(d) || d === '/') {
        note(fail, 'robots', `렌더링 리소스를 차단하는 Disallow: ${d} (막히는 경로 예: ${p})`);
      }
    }
  }
  // 사이트맵 URL 이 Disallow 에 걸리면 크롤러가 못 읽는다
  for (const d of disallows) {
    const blocked = [...seen.keys()].filter((l) => new URL(l).pathname.startsWith(d));
    if (blocked.length) {
      note(fail, 'robots', `Disallow: ${d} 가 사이트맵 URL ${blocked.length}개를 차단합니다 (예: ${blocked[0]})`);
    }
  }
}

// ─────────────────────────────────────────── 리포트
console.log('── sitemap ────────────────────────────────');
console.log(`  파일        : ${sitemapPath} (${(Buffer.byteLength(xml) / 1024).toFixed(1)} KB, 평문 XML)`);
console.log(`  형식        : ${isIndex ? 'sitemap index' : '단일 urlset'}`);
console.log(`  <loc> 개수  : ${locs.length}  (고유 ${seen.size})`);
console.log(`  도메인      : ${ORIGIN} 단일`);
console.log(`  200 확인    : ${seen.size - missing} / ${seen.size}`);
console.log(`  301 포함    : ${redirected}`);
console.log(`  noindex 포함: ${noindexed}`);
console.log(`  canonical 불일치: ${canonMismatch}`);
console.log('── robots ─────────────────────────────────');
for (const line of robotsTxt.split('\n')) if (line.trim()) console.log('  ' + line);
console.log('───────────────────────────────────────────');

if (warn.length) {
  console.log(`\n⚠ 경고 ${warn.length}건`);
  warn.slice(0, 20).forEach((w) => console.log('  ' + w));
}
if (fail.length) {
  console.log(`\n✗ 문제 ${fail.length}건`);
  fail.slice(0, 40).forEach((f) => console.log('  ' + f));
  if (fail.length > 40) console.log(`  ... 외 ${fail.length - 40}건`);
  process.exit(1);
}
console.log('\n✓ 사이트맵·robots 검증 통과 — 문제 없음');
