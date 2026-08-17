/**
 * 정보성 콘텐츠(블로그·가이드·비교·비용) 검증 (빌드 후 실행, 프로덕션 런타임 코드 아님)
 *
 *   npm run seo:verify:content
 *   node scripts/verify-content.mjs [outDir]
 *
 * 검사 항목
 *   1. metadata — title·description·canonical·H1·og:url 누락과 중복
 *   2. 검색의도 중복(cannibalization) — 같은 의도를 두 페이지가 나눠 갖고 있지 않은가
 *   3. 클러스터 배선 — 서비스 허브가 관련 가이드로, 가이드가 서비스로 링크하는가
 *   4. 고아 — 사이트맵에는 있는데 어디에서도 링크되지 않는 정보성 페이지
 *   5. 깨진 링크 — 정보성 페이지가 가리키는 내부 URL 실재 여부
 *   6. Article 스키마 — 날짜가 실제 데이터인가, 빌드 시각이 섞이지 않았는가
 *   7. 금지 신호 — 지어낸 통계·검색량·시장 평균가, AI 티 나는 상투구
 *   8. draft — 사이트맵에 draft/noindex 가 섞이지 않았는가
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { readSitemapXml } from './read-sitemap.mjs';

const OUT = process.argv[2] || 'out';
const fail = [];
const warn = [];
const add = (a, kind, msg) => a.push(`[${kind}] ${msg}`);
const read = (p) => readFileSync(p, 'utf8');
const bodyText = (html) => {
  const b = (html.match(/<body[\s\S]*<\/body>/) || [''])[0]
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '');
  return b.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
};

// ─── 페이지 수집
const CONTENT_PREFIX = /^\/(blog|guide|compare|cost)\//;
const all = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (e === 'index.html') {
      const pathname = '/' + relative(OUT, p).replace(/index\.html$/, '');
      const html = read(p);
      all.push({
        pathname,
        html,
        noindex: /<meta name="robots" content="[^"]*noindex/i.test(html),
        isContent: CONTENT_PREFIX.test(pathname) && pathname.split('/').length > 3,
      });
    }
  }
})(OUT);

const content = all.filter((p) => p.isContent && !p.noindex);
const byPrefix = (pre) => content.filter((p) => p.pathname.startsWith(pre));

// ─── 1. metadata
const titles = new Map();
const descs = new Map();
for (const p of content) {
  const title = (p.html.match(/<title>([^<]*)<\/title>/) || [, ''])[1];
  const desc = (p.html.match(/<meta name="description" content="([^"]*)"/) || [, ''])[1];
  const canon = (p.html.match(/<link rel="canonical" href="([^"]*)"/) || [, ''])[1];
  const ogUrl = (p.html.match(/<meta property="og:url" content="([^"]*)"/) || [, ''])[1];
  const h1 = (p.html.match(/<h1\b/g) || []).length;

  if (!title) add(fail, 'meta', `title 없음: ${p.pathname}`);
  if (!desc) add(fail, 'meta', `description 없음: ${p.pathname}`);
  if (!canon) add(fail, 'meta', `canonical 없음: ${p.pathname}`);
  if (ogUrl && canon && ogUrl !== canon) add(fail, 'meta', `og:url ≠ canonical: ${p.pathname}`);
  if (h1 !== 1) add(fail, 'heading', `H1 ${h1}개: ${p.pathname}`);

  if (title) titles.set(title, [...(titles.get(title) || []), p.pathname]);
  if (desc) descs.set(desc, [...(descs.get(desc) || []), p.pathname]);
}
for (const [label, map] of [['title', titles], ['description', descs]]) {
  for (const [v, list] of map) {
    if (list.length > 1) add(fail, 'dup', `중복 ${label} (${list.length}): ${list.join(', ')} — ${v.slice(0, 50)}`);
  }
}

// ─── 2. 검색의도 중복
// H1 을 정규화(조사·기호 제거)해 같은 질문을 두 페이지가 나눠 갖고 있는지 본다.
const normalize = (s) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/[^가-힣a-zA-Z0-9]/g, '')
    .replace(/(은|는|이|가|을|를|의|에|와|과|로|으로)$/g, '')
    .toLowerCase();
const h1Map = new Map();
for (const p of content) {
  const m = p.html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (!m) continue;
  const key = normalize(m[1]);
  if (!key) continue;
  h1Map.set(key, [...(h1Map.get(key) || []), p.pathname]);
}
for (const [k, list] of h1Map) {
  if (list.length > 1) add(fail, 'intent', `같은 H1 을 여러 페이지가 사용: ${list.join(', ')}`);
}

// ─── 3. 클러스터 배선
const cluster = existsSync('content/content-cluster.json')
  ? JSON.parse(read('content/content-cluster.json'))
  : {};
let hubsWired = 0;
const hubsMissing = [];
for (const [hubPath, links] of Object.entries(cluster)) {
  if (hubPath === '__region__' || !links.length) continue;
  const f = join(OUT, hubPath.replace(/^\//, ''), 'index.html');
  if (!existsSync(f)) continue; // 존재하지 않는 허브는 다른 검사기가 잡는다
  const html = read(f);
  const missing = links.filter((l) => !html.includes(`href="${l.href}"`));
  if (missing.length) hubsMissing.push(`${hubPath} — ${missing.map((m) => m.href).join(', ')}`);
  else hubsWired++;
}
for (const m of hubsMissing) add(fail, 'cluster', `허브에 매핑된 가이드 링크가 없음: ${m}`);

// 역방향 — 가이드가 상업 페이지로 링크하는가 (§16)
const COMMERCIAL = /^\/(flutter|app-development|app-agency|website|web-development|website-agency|mvp|mvp-development|erp|ai-automation|ai-development|admin-page-development|platform|reservation-commerce|data-seo|service-renewal|source-handover|maintenance|renewal|soho|app|cost|portfolio)\//;
let noCta = 0;
for (const p of byPrefix('/guide/')) {
  const body = (p.html.match(/<body[\s\S]*<\/body>/) || [''])[0];
  const outs = [...body.matchAll(/<a\b[^>]*\shref="(\/[^"#?]*)"/g)].map((m) => m[1]);
  if (!outs.some((u) => COMMERCIAL.test(u))) {
    noCta++;
    add(fail, 'cluster', `상업 페이지로 가는 링크가 없음: ${p.pathname}`);
  }
}

// ─── 4~5. 고아 · 깨진 링크
const inbound = new Map();
let broken = 0;
for (const p of all) {
  const body = (p.html.match(/<body[\s\S]*<\/body>/) || [p.html])[0];
  for (const m of body.matchAll(/<a\b[^>]*\shref="(\/[^"#?]*)"/g)) {
    const to = m[1];
    if (to === p.pathname) continue;
    if (CONTENT_PREFIX.test(to)) {
      if (!existsSync(join(OUT, to.replace(/^\//, ''), 'index.html'))) {
        broken++;
        add(fail, 'link', `깨진 정보성 링크: ${to} (출처 ${p.pathname})`);
        continue;
      }
      inbound.set(to, (inbound.get(to) || 0) + 1);
    }
  }
}
let orphan = 0;
for (const p of content) {
  if (!inbound.get(p.pathname)) {
    orphan++;
    add(fail, 'orphan', `어디에서도 링크되지 않음: ${p.pathname}`);
  }
}

// ─── 6. Article 스키마와 날짜
const BUILD_DAY = new Date().toISOString().slice(0, 10);
let articles = 0;
const dates = new Set();
for (const p of content) {
  for (const m of p.html.matchAll(/"datePublished":"([^"]*)"/g)) dates.add(m[1].slice(0, 10));
  if (/"@type":"(Article|BlogPosting)"/.test(p.html)) articles++;
  // Organization 을 글마다 다시 선언하면 엔티티가 중복된다(§58)
  const orgs = (p.html.match(/"@type":"Organization","@id":"[^"]*#organization"/g) || []).length;
  if (orgs > 1) add(fail, 'schema', `Organization 노드 ${orgs}개 중복: ${p.pathname}`);
  for (const bad of ['"@type":"Review"', 'aggregateRating', 'ratingValue']) {
    if (p.html.includes(bad)) add(fail, 'schema', `검증 불가한 리뷰 스키마(${bad}): ${p.pathname}`);
  }
}
// 모든 글의 날짜가 오늘이면 빌드 시각을 넣고 있다는 뜻이다(§27)
if (dates.size === 1 && dates.has(BUILD_DAY) && content.length > 5) {
  add(fail, 'date', `모든 글의 datePublished 가 빌드 당일(${BUILD_DAY}) — 실제 날짜를 쓰지 않고 있음`);
}

// ─── 7. 금지 신호
const FABRICATED = [
  /월간\s*[\d,]+\s*(회|건)?\s*검색/,
  /검색량[이가]?\s*(높|많)/,
  /검색량\s*[\d,]+/,
  /시장\s*평균\s*(가격|비용|단가)/,
  /업계\s*평균\s*[\d,]+/,
  /[\d,]+\s*%\s*의?\s*(기업|고객|업체)(이|가|은|는)?\s*/,
];
const AI_TELL = [
  '오늘날 빠르게 변화하는',
  '급변하는 디지털 환경',
  '성공적인 앱 개발을 위해서는',
  '결론적으로,',
  '본 글에서는',
  '아무쪼록',
];
for (const p of content) {
  const t = bodyText(p.html);
  for (const re of FABRICATED) {
    const m = t.match(re);
    if (m) add(fail, 'claim', `근거 없는 수치·통계 가능성: ${p.pathname} — "${m[0]}"`);
  }
  for (const w of AI_TELL) {
    if (t.includes(w)) add(warn, 'style', `기계적 상투구(${w}): ${p.pathname}`);
  }
}

// ─── 7-b. 인용 구조 (14단계) — 앵커 안정성·표·출처·날짜
let brokenAnchor = 0, noAnchor = 0, imgTable = 0;
const guides = byPrefix('/guide/');
for (const p of guides) {
  const ids = new Set([...p.html.matchAll(/<h[1-6][^>]*\sid="([^"]+)"/g)].map((m) => m[1]));
  // 페이지 안의 #앵커 링크가 실제 heading 을 가리키는가 (목차·인용 링크가 죽으면 안 된다)
  for (const m of p.html.matchAll(/href="#([a-zA-Z0-9_-]+)"/g)) {
    if (m[1] === 'top' || ids.has(m[1])) continue;
    brokenAnchor++;
    add(fail, 'anchor', `깨진 앵커: ${p.pathname}#${m[1]}`);
  }
  // 외부에서 특정 섹션만 인용하려면 H2 에 안정적인 ID 가 있어야 한다
  if (!ids.size) {
    noAnchor++;
    add(fail, 'anchor', `섹션 앵커가 하나도 없음(특정 항목 링크 불가): ${p.pathname}`);
  }
  // 작성 주체 — 인용할 때 출처를 확인할 수 있어야 한다
  if (!/작성 름랩|guide-byline/.test(p.html)) {
    add(fail, 'citation', `화면에 작성 주체 표시가 없음: ${p.pathname}`);
  }
  // 표를 이미지로만 만들지 않았는가
  if (/<img[^>]+alt="[^"]*(비교|표|차트)[^"]*"/.test(p.html) && !/<table/.test(p.html)) {
    imgTable++;
    add(fail, 'citation', `표를 이미지로만 제공(검색엔진·스크린리더가 못 읽음): ${p.pathname}`);
  }
}

// 정보성 페이지의 dateModified 가 빌드 시각으로 덮이지 않았는가는 아래 §6 검사와 함께 본다.
// 여기서는 실제 수정일이 발행일보다 앞서는 모순만 잡는다.
let badDate = 0;
for (const p of content) {
  const pub = (p.html.match(/"datePublished":"([^"]{10})/) || [])[1];
  const mod = (p.html.match(/"dateModified":"([^"]{10})/) || [])[1];
  if (pub && mod && mod < pub) {
    badDate++;
    add(fail, 'date', `dateModified(${mod}) 가 datePublished(${pub}) 보다 이름: ${p.pathname}`);
  }
}

// ─── 8. draft / 사이트맵
const sitemap = readSitemapXml(OUT);
let noindexInSitemap = 0;
for (const p of all) {
  if (!p.isContent || !p.noindex) continue;
  if (sitemap.includes(`<loc>https://reumlab.com${p.pathname}</loc>`)) {
    noindexInSitemap++;
    add(fail, 'sitemap', `noindex 인데 사이트맵에 있음: ${p.pathname}`);
  }
}
let missingFromSitemap = 0;
for (const p of content) {
  if (!sitemap.includes(`<loc>https://reumlab.com${p.pathname}</loc>`)) {
    missingFromSitemap++;
    add(fail, 'sitemap', `색인 대상인데 사이트맵에 없음: ${p.pathname}`);
  }
}

// ─── 결과
console.log(
  `정보성 색인 페이지 ${content.length} ` +
    `(블로그 ${byPrefix('/blog/').length} · 가이드 ${byPrefix('/guide/').length} · ` +
    `비교 ${byPrefix('/compare/').length} · 비용 ${byPrefix('/cost/').length})`,
);
console.log(`metadata  중복 title ${[...titles.values()].filter((v) => v.length > 1).length} · 중복 description ${[...descs.values()].filter((v) => v.length > 1).length}`);
console.log(`검색의도  같은 H1 을 쓰는 묶음 ${[...h1Map.values()].filter((v) => v.length > 1).length}`);
console.log(`클러스터  가이드가 배선된 허브 ${hubsWired}/${Object.keys(cluster).filter((k) => k !== '__region__' && cluster[k].length).length} · 상업 링크 없는 가이드 ${noCta}`);
console.log(`링크      깨짐 ${broken} · 고아 ${orphan}`);
console.log(`스키마    Article/BlogPosting ${articles} · datePublished 종류 ${dates.size}`);
console.log(`인용구조  가이드 ${guides.length} · 앵커 없음 ${noAnchor} · 깨진 앵커 ${brokenAnchor} · 이미지 전용 표 ${imgTable} · 날짜 모순 ${badDate}`);
console.log(`사이트맵  noindex 혼입 ${noindexInSitemap} · 누락 ${missingFromSitemap}`);
console.log('───────────────────────────────────────────');
if (warn.length) {
  console.log(`⚠ 경고 ${warn.length}건`);
  warn.slice(0, 10).forEach((w) => console.log('  ' + w));
}
if (fail.length) {
  console.log(`✗ 문제 ${fail.length}건`);
  fail.slice(0, 25).forEach((f) => console.log('  ' + f));
  process.exit(1);
}
console.log('✓ 콘텐츠 검증 통과 — metadata·검색의도·클러스터 배선·링크·스키마·사이트맵 이상 없음');
