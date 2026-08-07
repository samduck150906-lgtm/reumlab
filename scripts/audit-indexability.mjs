/**
 * 색인 품질 전수 감사 (빌드 후 실행, 프로덕션 런타임 코드 아님)
 *
 *   npm run seo:audit:index
 *   node scripts/audit-indexability.mjs [outDir] [--json <path>]
 *
 * 기존 seo:verify 가 "사이트맵에 든 835개"만 본다면, 이 스크립트는 산출물의
 * 모든 공개 URL(사이트맵 밖 포함)을 대상으로 색인 신호의 모순을 찾는다.
 *
 * 검사 항목
 *   1. URL 인벤토리 — INDEX / NOINDEX / REDIRECT / 404 / REVIEW 분류
 *   2. canonical — 누락·상대경로·도메인 오류·http·self 아님·체인
 *   3. canonical ↔ sitemap ↔ redirect 정합성
 *   4. 중복 URL — trailing slash, 대소문자, 퍼센트 인코딩 변형
 *   5. 메타데이터 중복 — 색인 대상끼리 title·description 완전 중복
 *   6. soft 404 — 404 문구를 내면서 noindex 가 아닌 페이지
 *   7. 리다이렉트 — 체인·루프, 사이트맵에 든 리다이렉트 대상
 *   8. 내부링크 — 깨진 링크, 리다이렉트되는 URL 을 가리키는 링크
 *   9. 고아 페이지 — 사이트맵에 있으나 어디에서도 링크되지 않는 색인 페이지
 *  10. og:url ↔ canonical, Service/Breadcrumb 스키마 URL ↔ canonical
 *  11. 쿼리 파라미터·테스트 경로 노출
 *
 * 정적 호스팅(publish=out)이라 "URL → 파일"이 1:1이므로 네트워크 없이 판정한다.
 * 실제 프로덕션 응답 헤더(www/http 리다이렉트 등)는 이 방식으로 확인할 수 없다 —
 * 그 부분은 보고서에 한계로 명시한다.
 */
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';

const args = process.argv.slice(2);
const OUT = args.find((a) => !a.startsWith('--')) || 'out';
const jsonIdx = args.indexOf('--json');
const JSON_PATH = jsonIdx >= 0 ? args[jsonIdx + 1] : null;
const ORIGIN = 'https://reumlab.com';

const fail = [];
const warn = [];
const add = (a, kind, msg) => a.push(`[${kind}] ${msg}`);

const strip = (h) =>
  h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();

// ─────────────────────────────── 1. 산출물 URL 인벤토리
const pages = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (e.endsWith('.html')) pages.push(p);
  }
})(OUT);

const inv = [];
for (const file of pages) {
  const rel = relative(OUT, file).replace(/\\/g, '/');
  // out/foo/index.html → /foo/ , out/404.html → /404.html
  const pathname = rel === 'index.html' ? '/' : rel.endsWith('/index.html') ? '/' + rel.slice(0, -'index.html'.length) : '/' + rel;
  const h = readFileSync(file, 'utf8');
  const robotsMeta = (h.match(/<meta name="robots" content="([^"]*)"/i) || [, ''])[1];
  const body = strip((h.match(/<main[^>]*>([\s\S]*?)<\/main>/i) || [, h])[1]);
  inv.push({
    file,
    pathname,
    url: ORIGIN + pathname,
    title: (h.match(/<title>([^<]*)<\/title>/i) || [, ''])[1],
    desc: (h.match(/<meta name="description" content="([^"]*)"/i) || [, ''])[1],
    canonical: (h.match(/<link rel="canonical" href="([^"]+)"/i) || [, ''])[1],
    ogUrl: (h.match(/property="og:url" content="([^"]*)"/i) || [, ''])[1],
    robotsMeta,
    noindex: /noindex/i.test(robotsMeta),
    h1: strip((h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [, ''])[1]),
    body,
    links: [...new Set([...h.matchAll(/<a[^>]+href="([^"]+)"/g)].map((m) => m[1]))],
    html: h,
  });
}

// ─────────────────────────────── 사이트맵
const smPath = join(OUT, 'sitemap.xml');
const sitemap = existsSync(smPath)
  ? new Set([...readFileSync(smPath, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decodeURIComponent(m[1])))
  : new Set();

// ─────────────────────────────── 리다이렉트 규칙
const redirects = [];
const rdPath = join(OUT, '_redirects');
if (existsSync(rdPath)) {
  for (const line of readFileSync(rdPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const [from, to, code] = t.split(/\s+/);
    if (!from || !to) continue;
    redirects.push({ from, to, forced: /!$/.test(code || ''), code: (code || '301').replace('!', '') });
  }
}
const matchRedirect = (pathname) =>
  redirects.find((r) => r.from === pathname || (r.from.endsWith('*') && pathname.startsWith(r.from.slice(0, -1)))) || null;

/** 산출물에 실제 파일이 있는가 (= 정적 호스팅에서 200) */
const served = (pathname) => {
  const rel = decodeURIComponent(pathname.split('#')[0].split('?')[0]).replace(/^\//, '');
  if (!rel) return existsSync(join(OUT, 'index.html'));
  return [join(OUT, rel, 'index.html'), join(OUT, rel)].some((c) => existsSync(c) && statSync(c).isFile());
};

// ─────────────────────────────── 2. 상태 분류
const NOT_A_PAGE = /^\/(404\.html|__forms\.html|google[\w-]*\.html|naver[\w-]*\.html)$/;
for (const p of inv) {
  const hit = matchRedirect(p.pathname);
  if (NOT_A_PAGE.test(p.pathname)) p.status = 'SYSTEM';
  else if (hit && hit.forced) p.status = 'REDIRECT';
  else if (p.noindex) p.status = 'NOINDEX';
  else if (!p.canonical) p.status = 'REVIEW';
  else p.status = 'INDEX';
}
// 파일이 없는데 리다이렉트만 있는 경로 = REDIRECT (인벤토리에 없음)
const redirectOnly = redirects.filter((r) => !r.from.includes('*') && !served(r.from));

const counts = inv.reduce((a, p) => ((a[p.status] = (a[p.status] || 0) + 1), a), {});

// ─────────────────────────────── 3. canonical 전수검사
let cMissing = 0, cRelative = 0, cWrongHost = 0, cHttp = 0, cNotSelf = 0, cChain = 0;
const canonTargets = new Map();
for (const p of inv) {
  if (p.status === 'SYSTEM') continue;
  if (!p.canonical) {
    cMissing++;
    add(p.status === 'INDEX' ? fail : warn, 'canonical', `canonical 없음 (${p.status}): ${p.pathname}`);
    continue;
  }
  if (!/^https?:\/\//.test(p.canonical)) { cRelative++; add(fail, 'canonical', `상대 URL: ${p.pathname} → ${p.canonical}`); continue; }
  if (p.canonical.startsWith('http://')) { cHttp++; add(fail, 'canonical', `http canonical: ${p.pathname}`); }
  let u;
  try { u = new URL(p.canonical); } catch { add(fail, 'canonical', `파싱 실패: ${p.pathname} → ${p.canonical}`); continue; }
  if (u.origin !== ORIGIN) { cWrongHost++; add(fail, 'canonical', `도메인 불일치(${u.origin}): ${p.pathname}`); }
  const canonPath = decodeURIComponent(u.pathname);
  if (canonPath !== decodeURIComponent(p.pathname)) {
    canonTargets.set(p.pathname, canonPath);
    if (p.status === 'INDEX') { cNotSelf++; add(fail, 'canonical', `색인 페이지인데 self-canonical 아님: ${p.pathname} → ${canonPath}`); }
  }
  // canonical 대상이 다시 다른 곳을 canonical 하는가(체인)
  const target = inv.find((q) => decodeURIComponent(q.pathname) === canonPath);
  if (target && target.canonical) {
    const t2 = decodeURIComponent(new URL(target.canonical).pathname);
    if (t2 !== canonPath) { cChain++; add(fail, 'canonical', `canonical 체인: ${p.pathname} → ${canonPath} → ${t2}`); }
  }
  // canonical 이 리다이렉트되는 URL 을 가리키는가
  const rHit = matchRedirect(canonPath);
  if (rHit && !served(canonPath)) add(fail, 'canonical', `canonical 목적지가 리다이렉트됨: ${p.pathname} → ${canonPath} → ${rHit.to}`);
  // canonical 목적지가 실제로 존재하는가
  if (!served(canonPath)) add(fail, 'canonical', `canonical 목적지가 없음(404): ${p.pathname} → ${canonPath}`);
}

// ─────────────────────────────── 4. 사이트맵 정합성
let smNoindex = 0, smRedirect = 0, sm404 = 0, smCanonMismatch = 0;
for (const loc of sitemap) {
  const path = decodeURIComponent(new URL(loc).pathname);
  const p = inv.find((q) => decodeURIComponent(q.pathname) === path);
  if (!p) {
    const hit = matchRedirect(path);
    if (hit) { smRedirect++; add(fail, 'sitemap', `리다이렉트 URL 이 사이트맵에: ${path} → ${hit.to}`); }
    else { sm404++; add(fail, 'sitemap', `없는 URL 이 사이트맵에: ${path}`); }
    continue;
  }
  if (p.noindex) { smNoindex++; add(fail, 'sitemap', `noindex 페이지가 사이트맵에: ${path}`); }
  if (p.canonical && decodeURIComponent(new URL(p.canonical).pathname) !== path) {
    smCanonMismatch++;
    add(fail, 'sitemap', `사이트맵 URL 과 canonical 불일치: ${path} vs ${p.canonical}`);
  }
}
// 색인 대상인데 사이트맵에 없는 경우
const indexNotInSitemap = inv.filter((p) => p.status === 'INDEX' && !sitemap.has(decodeURIComponent(p.url)));

// ─────────────────────────────── 5. 중복 URL 변형
const byNorm = new Map();
for (const p of inv) {
  if (p.status === 'SYSTEM') continue;
  const key = decodeURIComponent(p.pathname).toLowerCase().replace(/\/+$/, '/') || '/';
  (byNorm.get(key) || byNorm.set(key, []).get(key)).push(p.pathname);
}
const dupUrlVariants = [...byNorm].filter(([, v]) => v.length > 1);
for (const [k, v] of dupUrlVariants) add(fail, 'duplicate-url', `같은 URL 의 변형이 함께 서빙됨: ${v.join(' , ')} (정규화: ${k})`);

// ─────────────────────────────── 6. 메타데이터 중복 (색인 대상만)
const idx = inv.filter((p) => p.status === 'INDEX');
const dupOf = (key) => {
  const m = new Map();
  for (const p of idx) {
    const v = (p[key] || '').trim();
    if (!v) continue;
    (m.get(v) || m.set(v, []).get(v)).push(p.pathname);
  }
  return [...m].filter(([, v]) => v.length > 1);
};
const dupTitle = dupOf('title'), dupDesc = dupOf('desc'), dupH1 = dupOf('h1');
for (const [t, u] of dupTitle) add(fail, 'duplicate-meta', `title 중복 ${u.length}건: "${t.slice(0, 44)}" — ${u.slice(0, 3).join(', ')}`);
for (const [, u] of dupDesc) add(fail, 'duplicate-meta', `description 중복 ${u.length}건: ${u.slice(0, 3).join(', ')}`);

// ─────────────────────────────── 7. soft 404
const NOT_FOUND_TEXT = /페이지를 찾을 수 없|찾을 수 없습니다|Not Found|404/i;
for (const p of inv) {
  if (p.status === 'SYSTEM' || p.pathname === '/404/' || p.pathname === '/404.html') continue;
  if (NOT_FOUND_TEXT.test(p.h1) && !p.noindex) {
    add(fail, 'soft404', `404 문구를 내면서 noindex 아님: ${p.pathname}`);
  }
}
// /404/ 가 200 으로 서빙되는지 (정적 export + trailingSlash 조합에서 생김)
const has404Dir = served('/404/');

// ─────────────────────────────── 8. 리다이렉트 체인·루프
let chains = 0, loops = 0;
for (const r of redirects) {
  if (r.from.includes('*') || r.to.startsWith('http') || r.to.includes('#')) continue;
  const seen = [r.from];
  let cur = r.to;
  for (let i = 0; i < 6; i++) {
    if (seen.includes(cur)) { loops++; add(fail, 'redirect', `루프: ${[...seen, cur].join(' → ')}`); break; }
    seen.push(cur);
    if (served(cur)) break; // 최종 목적지 도달
    const next = matchRedirect(cur);
    if (!next) break;
    chains++;
    add(fail, 'redirect', `체인: ${r.from} → ${cur} → ${next.to}`);
    cur = next.to;
  }
  if (!served(r.to) && !matchRedirect(r.to) && !r.to.includes('#')) {
    add(fail, 'redirect', `목적지가 존재하지 않음: ${r.from} → ${r.to}`);
  }
}

// ─────────────────────────────── 9. 내부링크
const linkTargets = new Map(); // path -> Set(출처)
let brokenLinks = 0, linksToRedirect = 0;
for (const p of inv) {
  for (const href of p.links) {
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const clean = href.split('#')[0].split('?')[0];
    if (!clean) continue;
    (linkTargets.get(clean) || linkTargets.set(clean, new Set()).get(clean)).add(p.pathname);
  }
}
for (const [href, sources] of linkTargets) {
  if (served(href)) continue;
  const hit = matchRedirect(href);
  if (hit) {
    linksToRedirect++;
    add(warn, 'internal-redirect', `리다이렉트되는 URL 로 링크: ${href} → ${hit.to} (출처 ${sources.size}개, 예: ${[...sources][0]})`);
  } else {
    brokenLinks++;
    add(fail, 'broken-link', `깨진 내부링크: ${href} (출처 ${sources.size}개, 예: ${[...sources][0]})`);
  }
}

// ─────────────────────────────── 10. 고아 페이지
const linked = new Set([...linkTargets.keys()].map((h) => decodeURIComponent(h)));
const orphans = idx.filter((p) => !linked.has(decodeURIComponent(p.pathname)) && p.pathname !== '/');

// ─────────────────────────────── 11. og:url / 스키마 URL ↔ canonical
let ogMismatch = 0, schemaMismatch = 0;
for (const p of inv) {
  if (!p.canonical) continue;
  const c = decodeURIComponent(new URL(p.canonical).pathname);
  if (p.ogUrl) {
    const o = decodeURIComponent(new URL(p.ogUrl, ORIGIN).pathname);
    if (o !== c) { ogMismatch++; add(fail, 'og', `og:url ≠ canonical: ${p.pathname} — og ${o} / canonical ${c}`); }
  }
  for (const m of p.html.matchAll(/"@type":"Service","@id":"([^"]+)"/g)) {
    const s = decodeURIComponent(new URL(m[1].replace(/#service$/, '')).pathname);
    if (s !== c) { schemaMismatch++; add(fail, 'schema', `Service @id ≠ canonical: ${p.pathname} — ${s}`); }
  }
}

// ─────────────────────────────── 11b. robots meta 중복
// layout·page·컴포넌트가 각각 robots 를 내면 한 문서에 meta robots 가 여러 개 생긴다.
// 값이 서로 다르면 크롤러가 어느 쪽을 따를지 불확실해진다.
let dupRobots = 0;
for (const p of inv) {
  const metas = [...p.html.matchAll(/<meta name="robots" content="([^"]*)"/gi)].map((m) => m[1]);
  if (metas.length > 1) {
    dupRobots++;
    const conflicting = new Set(metas.map((m) => /noindex/i.test(m))).size > 1;
    add(conflicting ? fail : warn, 'robots-meta',
      `meta robots ${metas.length}개${conflicting ? ' (index/noindex 충돌)' : ''}: ${p.pathname} — ${metas.join(' | ')}`);
  }
}

// ─────────────────────────────── 12. 쿼리·테스트 경로
const TEST_PATH = /^\/(test|demo|dev|debug|preview|sample|temp|old|staging)(\/|$)/i;
for (const p of inv) if (TEST_PATH.test(p.pathname)) add(warn, 'test-route', `테스트성 경로가 배포됨: ${p.pathname}`);
const queryLinks = [...linkTargets.keys()].filter((h) => h.includes('?'));

// ─────────────────────────────── 리포트
console.log('── URL 인벤토리 ───────────────────────────');
console.log(`  산출물 HTML          ${inv.length}`);
for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(`    ${k.padEnd(10)} ${v}`);
console.log(`  파일 없이 리다이렉트만 ${redirectOnly.length}`);
console.log(`  사이트맵 URL         ${sitemap.size}`);
console.log(`  색인 대상인데 사이트맵에 없음 ${indexNotInSitemap.length}`);
console.log('── canonical ──────────────────────────────');
console.log(`  누락 ${cMissing} · 상대URL ${cRelative} · 도메인오류 ${cWrongHost} · http ${cHttp} · self아님 ${cNotSelf} · 체인 ${cChain}`);
console.log('── 사이트맵 정합성 ────────────────────────');
console.log(`  noindex 포함 ${smNoindex} · 리다이렉트 ${smRedirect} · 404 ${sm404} · canonical 불일치 ${smCanonMismatch}`);
console.log('── 중복 ───────────────────────────────────');
console.log(`  URL 변형 ${dupUrlVariants.length} · title ${dupTitle.length}종 · description ${dupDesc.length}종 · H1 ${dupH1.length}종`);
console.log('── 리다이렉트 ─────────────────────────────');
console.log(`  규칙 ${redirects.length} · 체인 ${chains} · 루프 ${loops} · 내부링크가 리다이렉트 대상 ${linksToRedirect}`);
console.log('── 링크 ───────────────────────────────────');
console.log(`  내부링크 대상 ${linkTargets.size} · 깨짐 ${brokenLinks} · 고아 색인페이지 ${orphans.length} · 쿼리 링크 ${queryLinks.length}`);
console.log('── 기타 ───────────────────────────────────');
console.log(`  og:url 불일치 ${ogMismatch} · Service 스키마 URL 불일치 ${schemaMismatch} · meta robots 중복 ${dupRobots} · /404/ 200 서빙 ${has404Dir ? 'YES' : 'NO'}`);

if (orphans.length) {
  console.log(`\n고아 색인 페이지 ${orphans.length}개 (상위 10):`);
  orphans.slice(0, 10).forEach((p) => console.log('  ' + p.pathname));
}

if (JSON_PATH) {
  mkdirSync(dirname(JSON_PATH), { recursive: true });
  writeFileSync(JSON_PATH, JSON.stringify({
    generatedFrom: OUT,
    counts, sitemap: sitemap.size,
    canonical: { missing: cMissing, relative: cRelative, wrongHost: cWrongHost, http: cHttp, notSelf: cNotSelf, chain: cChain },
    sitemapAlignment: { noindex: smNoindex, redirect: smRedirect, notFound: sm404, canonicalMismatch: smCanonMismatch },
    duplicates: { urlVariants: dupUrlVariants.length, title: dupTitle.length, description: dupDesc.length, h1: dupH1.length },
    redirectRules: redirects.length, chains, loops, linksToRedirect, brokenLinks,
    orphans: orphans.map((p) => p.pathname),
    inventory: inv.map((p) => ({ url: p.url, status: p.status, canonical: p.canonical, inSitemap: sitemap.has(decodeURIComponent(p.url)), title: p.title })),
  }, null, 2));
  console.log(`\n인벤토리 저장: ${JSON_PATH}`);
}

console.log('───────────────────────────────────────────');
if (warn.length) {
  console.log(`⚠ 경고 ${warn.length}건`);
  warn.slice(0, 15).forEach((w) => console.log('  ' + w));
}
if (fail.length) {
  console.log(`✗ 문제 ${fail.length}건`);
  fail.slice(0, 30).forEach((f) => console.log('  ' + f));
  if (fail.length > 30) console.log(`  ... 외 ${fail.length - 30}건`);
  process.exit(1);
}
console.log('✓ 색인 감사 통과 — canonical·사이트맵·리다이렉트·중복·링크 모순 없음');
