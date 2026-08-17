/**
 * 서비스 허브 품질 검증 (빌드 후 실행, 프로덕션 런타임 코드 아님)
 *
 *   npm run seo:verify:services
 *   node scripts/verify-service-hubs.mjs [outDir]
 *
 * 대상: 사이트맵의 1-depth URL 중 서비스성 페이지(인덱스·법적고지·블로그 제외).
 *
 * 검사 항목
 *   1. title / description 완전 중복
 *   2. H1 개수(1개여야 함)·빈 H1·렌더 사고 문자열
 *   3. canonical 자기참조
 *   4. JS 실행 전 HTML 에 실제 서비스 설명이 들어 있는가 (정적 렌더 확인)
 *   5. Service JSON-LD 의 name·url 이 화면 H1·canonical 과 일치하는가
 *      (스키마만 옛 문구로 남는 사고 방지)
 *   6. 내부링크 — 링크 0개 / 산출물에 없는 href
 *   7. 허브 간 본문 유사도 (서로 같은 문장으로 채워지지 않았는지)
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { readSitemapLocs } from './read-sitemap.mjs';

const OUT = process.argv[2] || 'out';
/** 서비스 허브가 아닌 1-depth URL */
// 인덱스 허브(목록 페이지)는 서비스 허브가 아니다 — CollectionPage 로 나가고 Service 스키마를 두지 않는다.
const NOT_SERVICE = new Set(['blog', 'privacy', 'terms', 'refund', 'guide', 'app', 'website', 'cost', 'solution', 'system']);
const MIN_BODY = 900;

const fail = [];
const warn = [];
const add = (a, kind, msg) => a.push(`[${kind}] ${msg}`);

const strip = (h) =>
  h.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const sitemapPath = join(OUT, 'sitemap.xml');
if (!existsSync(sitemapPath)) {
  console.error(`✗ ${sitemapPath} 없음. 먼저 npm run build 를 실행하세요.`);
  process.exit(1);
}
const locs = readSitemapLocs(OUT);

const pages = [];
for (const loc of locs) {
  const pathname = new URL(loc).pathname;
  const segs = pathname.split('/').filter(Boolean);
  if (segs.length !== 1) continue;
  const slug = decodeURIComponent(segs[0]);
  if (NOT_SERVICE.has(slug)) continue;
  const f = join(OUT, slug, 'index.html');
  if (!existsSync(f)) continue;
  const html = readFileSync(f, 'utf8');
  const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => strip(m[1]));
  const svc = [...html.matchAll(/"@type":"Service","@id":"([^"]+)","name":"((?:[^"\\]|\\.)*)"/g)].map((m) => ({
    id: m[1],
    name: JSON.parse(`"${m[2]}"`),
  }));
  pages.push({
    url: loc,
    pathname,
    slug,
    html,
    title: (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || '',
    desc: (html.match(/<meta name="description" content="([^"]*)"/i) || [])[1] || '',
    canonical: (html.match(/<link rel="canonical" href="([^"]+)"/i) || [])[1] || '',
    h1s,
    body: strip(main ? main[1] : html),
    links: [...new Set([...html.matchAll(/<a[^>]+href="(\/[^"#?]*)"/g)].map((m) => m[1]))],
    svc,
    h2n: [...html.matchAll(/<h2[^>]*>/gi)].length,
    faq: /"@type":"FAQPage"/.test(html),
  });
}
if (!pages.length) {
  console.error('✗ 서비스 허브를 찾지 못했습니다.');
  process.exit(1);
}

// 1. 중복 metadata
for (const key of ['title', 'desc']) {
  const m = new Map();
  for (const p of pages) (m.get(p[key]) || m.set(p[key], []).get(p[key])).push(p.pathname);
  for (const [, urls] of m) if (urls.length > 1) add(fail, 'duplicate', `${key} 중복: ${urls.join(', ')}`);
}

// 2~6. 페이지별
const BAD = /\bundefined\b|\bnull\b|\[object Object\]|\bNaN\b/;
const exists = (href) => {
  const rel = decodeURIComponent(href).replace(/^\//, '');
  return [join(OUT, rel, 'index.html'), join(OUT, rel)].some((c) => existsSync(c) && statSync(c).isFile());
};
const linkCache = new Map();
for (const p of pages) {
  p.len = p.body.replace(/\s/g, '').length;
  if (!p.h1s.length || !p.h1s[0]) add(fail, 'h1', `H1 없음: ${p.pathname}`);
  if (p.h1s.length > 1) add(fail, 'h1', `H1 ${p.h1s.length}개: ${p.pathname}`);
  if (!p.title) add(fail, 'title', `title 없음: ${p.pathname}`);
  if (!p.desc) add(fail, 'desc', `description 없음: ${p.pathname}`);
  if (BAD.test(p.title) || BAD.test(p.desc) || BAD.test(p.body)) add(fail, 'render', `렌더 사고 문자열: ${p.pathname}`);
  if (decodeURIComponent(p.canonical) !== decodeURIComponent(p.url)) {
    add(fail, 'canonical', `canonical 불일치 — ${p.pathname} → ${p.canonical}`);
  }
  // JS 실행 전 HTML 에 본문이 있는가
  if (p.len < MIN_BODY) add(fail, 'thin', `정적 HTML 본문 ${p.len}자 (<${MIN_BODY}): ${p.pathname}`);
  // Service 스키마와 화면 일치
  if (p.svc.length) {
    const self = p.svc.find((x) => decodeURIComponent(x.id) === `${decodeURIComponent(p.url)}#service`);
    if (!self) add(fail, 'schema', `Service @id 가 canonical 과 다름: ${p.pathname} (${p.svc.map((x) => x.id).join(', ')})`);
    else if (!p.h1s[0].includes(self.name) && !self.name.includes(p.h1s[0].split(' · ')[0])) {
      add(warn, 'schema', `Service.name "${self.name}" 이 H1 "${p.h1s[0]}" 과 다름: ${p.pathname}`);
    }
  } else {
    add(warn, 'schema', `Service 스키마 없음: ${p.pathname}`);
  }
  if (!p.links.length) add(fail, 'links', `내부링크 0개: ${p.pathname}`);
  for (const href of p.links) {
    if (!linkCache.has(href)) linkCache.set(href, exists(href));
    if (!linkCache.get(href)) add(fail, '404', `없는 링크 ${href} (출처 ${p.pathname})`);
  }
}

// 7. 허브 간 유사도
const shingles = (t, n = 4) => {
  const k = t.toLowerCase().match(/[a-z0-9]+|[가-힣]+/g) || [];
  const s = new Set();
  for (let i = 0; i + n <= k.length; i++) s.add(k.slice(i, i + n).join(' '));
  return s;
};
const jac = (a, b) => { if (!a.size || !b.size) return 0; let i = 0; for (const x of a) if (b.has(x)) i++; return i / (a.size + b.size - i); };
for (const p of pages) p.sh = shingles(p.body);
let sum = 0, cnt = 0, max = 0, maxPair = '';
const high = [];
for (let i = 0; i < pages.length; i++) for (let j = i + 1; j < pages.length; j++) {
  const v = jac(pages[i].sh, pages[j].sh);
  sum += v; cnt++;
  if (v > max) { max = v; maxPair = `${pages[i].pathname} ↔ ${pages[j].pathname}`; }
  if (v >= 0.7) high.push(`${(v * 100).toFixed(0)}%  ${pages[i].pathname} ↔ ${pages[j].pathname}`);
}
for (const h of high) add(warn, 'similar', `허브 간 본문 유사도 70%↑ — ${h}`);

// 리포트
console.log(`서비스 허브 ${pages.length}개`);
console.log(`  본문 길이   최소 ${Math.min(...pages.map((p) => p.len))} / 평균 ${Math.round(pages.reduce((a, b) => a + b.len, 0) / pages.length)} / 최대 ${Math.max(...pages.map((p) => p.len))}`);
console.log(`  H2          평균 ${(pages.reduce((a, b) => a + b.h2n, 0) / pages.length).toFixed(1)}개`);
console.log(`  내부링크    평균 ${Math.round(pages.reduce((a, b) => a + b.links.length, 0) / pages.length)}개`);
console.log(`  Service 스키마 ${pages.filter((p) => p.svc.length).length}/${pages.length} · FAQ ${pages.filter((p) => p.faq).length}/${pages.length}`);
console.log(`  허브 간 유사도  평균 ${(sum / cnt * 100).toFixed(1)}%  최대 ${(max * 100).toFixed(1)}%  (${maxPair})`);
console.log('\n가장 얇은 5개:');
[...pages].sort((a, b) => a.len - b.len).slice(0, 5).forEach((p) => console.log(`  ${String(p.len).padStart(5)}자  ${p.pathname}`));

console.log('───────────────────────────────────────────');
if (warn.length) {
  console.log(`⚠ 경고 ${warn.length}건`);
  warn.slice(0, 15).forEach((w) => console.log('  ' + w));
}
if (fail.length) {
  console.log(`✗ 문제 ${fail.length}건`);
  fail.slice(0, 30).forEach((f) => console.log('  ' + f));
  process.exit(1);
}
console.log('✓ 서비스 허브 검증 통과 — 문제 없음');
