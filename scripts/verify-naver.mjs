/**
 * 네이버 검색 노출 관점 검증 (빌드 후 실행, 프로덕션 런타임 코드 아님)
 *
 *   npm run seo:verify:naver
 *   node scripts/verify-naver.mjs [outDir]
 *
 * 네이버는 자바스크립트를 실행하지 않는 것을 전제로 봐야 안전하다. 그래서 이 검사기는
 * "브라우저가 JS 를 한 줄도 실행하지 않았을 때 HTML 에 무엇이 남아 있는가" 만 본다.
 *
 * 검사 항목
 *   1. 사이트 소유확인 — 루트 문서에 naver-site-verification 이 정확히 1개인가, 값이 갈리지 않는가
 *   2. Yeti 접근 — robots.txt 에 Yeti 그룹이 있고, 렌더링 리소스(CSS/JS/이미지/폰트/_next)를 막지 않는가
 *   3. 사이트명 신호 — og:site_name · WebSite.name · Organization.name 이 한 값인가,
 *                     title 의 브랜드 자리에 대표 상호가 들어 있는가
 *   4. SSR 본문 — 색인 페이지의 초기 HTML 에 title·description·canonical·H1·본문·내부링크가 있는가
 *   5. Open Graph — og:type·og:locale·og:site_name·og:url·og:title·og:description·og:image 누락
 *   6. 문서 구조 — H1 이 정확히 1개인가, lang="ko" 인가
 *   7. RSS — 선언·필수 필드·링크 실재·미래 날짜(가짜 최신일) 여부
 *
 * 클로킹 검사는 하지 않는다 — 이 프로젝트는 정적 export 라 봇/사람에게 같은 파일이 나간다.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const OUT = process.argv[2] || 'out';
const DOMAIN = 'https://reumlab.com';
/** 대표 상호 — lib/seo.ts SITE.name 과 같아야 한다 */
const BRAND = '름랩';

const fail = [];
const warn = [];
const add = (a, kind, msg) => a.push(`[${kind}] ${msg}`);
const read = (p) => readFileSync(p, 'utf8');

// ─── 페이지 수집 (시스템 문서 제외)
const NOT_A_PAGE = /^\/(404\.html|__forms\.html|google[\w-]*\.html|naver[\w-]*\.html)$/;
const pages = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (e.endsWith('.html')) {
      const pathname = '/' + relative(OUT, p).replace(/index\.html$/, '');
      if (NOT_A_PAGE.test(pathname)) continue;
      const html = read(p);
      pages.push({
        pathname,
        html,
        noindex: /<meta name="robots" content="[^"]*noindex/i.test(html),
      });
    }
  }
})(OUT);
const indexed = pages.filter((p) => !p.noindex);

// ─── 1. 사이트 소유확인
const VERIF = /<meta name="naver-site-verification" content="([^"]*)"/gi;
const values = new Set();
let rootVerified = false;
for (const p of pages) {
  const found = [...p.html.matchAll(VERIF)].map((m) => m[1]);
  found.forEach((v) => values.add(v));
  if (found.length > 1) {
    add(fail, 'verify', `naver-site-verification ${found.length}개 중복: ${p.pathname}`);
  }
  if (p.pathname === '/' && found.length === 1) rootVerified = true;
}
// 네이버 meta 방식은 루트 문서 하나만 검사한다. 하위 페이지에 없는 것은 문제가 아니다.
if (!rootVerified) {
  add(fail, 'verify', '루트 문서(/)에 naver-site-verification meta 가 없다 — meta 방식 소유확인 불가');
}
if (values.size > 1) {
  add(fail, 'verify', `인증값이 ${values.size}종으로 갈림 — 하나만 남겨야 한다`);
}
const htmlVerifyFile = readdirSync(OUT).find((f) => /^naver[0-9a-f]+\.html$/.test(f));

// ─── 2. Yeti 접근
const robotsPath = join(OUT, 'robots.txt');
let robots = '';
if (!existsSync(robotsPath)) add(fail, 'robots', 'robots.txt 가 없다');
else {
  robots = read(robotsPath);
  const groups = {};
  let current = [];
  for (const raw of robots.split('\n')) {
    const line = raw.trim();
    const ua = line.match(/^User-Agent:\s*(.+)$/i);
    if (ua) {
      if (current.done) current = [];
      current.push(ua[1].trim());
      current.forEach((n) => (groups[n] ||= []));
      continue;
    }
    const rule = line.match(/^(Allow|Disallow):\s*(.*)$/i);
    if (rule) {
      current.forEach((n) => groups[n].push([rule[1].toLowerCase(), rule[2].trim()]));
      current.done = true;
    }
  }
  if (!groups.Yeti) {
    add(warn, 'robots', 'robots.txt 에 Yeti 그룹이 없다 — 와일드카드로 통과하지만 서치어드바이저는 명시를 권장한다');
  }
  // Yeti 가 읽어야 하는 것들이 막혀 있지 않은지
  const rules = groups.Yeti || groups['*'] || [];
  const blocked = (path) =>
    rules.some(([kind, pattern]) => {
      if (kind !== 'disallow' || !pattern) return false;
      const re = new RegExp('^' + pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\$$/, '$'));
      return re.test(path) || pattern === '/';
    });
  for (const path of ['/', '/app-development/', '/l/app-dev-cost/', '/h/app-dev/',
    '/_next/static/chunk.js', '/styles.css', '/script.js', '/og-image.jpg', '/logo.png']) {
    if (blocked(path)) add(fail, 'robots', `Yeti 가 차단됨: ${path} — 렌더링·수집에 필요한 경로다`);
  }
  if (!/^Sitemap:\s*\S+/im.test(robots)) add(fail, 'robots', 'robots.txt 에 Sitemap 선언이 없다');
}

// ─── 3. 사이트명 신호
const siteNames = new Set();
const schemaWebsiteNames = new Set();
const schemaOrgNames = new Set();
let noBrandTitle = 0;
for (const p of indexed) {
  const og = p.html.match(/<meta property="og:site_name" content="([^"]*)"/i);
  if (og) siteNames.add(og[1]);
  for (const m of p.html.matchAll(/"@type":"WebSite","@id":"[^"]*","url":"[^"]*","name":"([^"]*)"/g)) schemaWebsiteNames.add(m[1]);
  for (const m of p.html.matchAll(/"@type":"Organization","@id":"[^"]*","name":"([^"]*)"/g)) schemaOrgNames.add(m[1]);
  const t = (p.html.match(/<title>([^<]*)<\/title>/) || [, ''])[1];
  if (t && !t.includes(BRAND)) {
    noBrandTitle++;
    add(warn, 'sitename', `title 에 대표 상호("${BRAND}")가 없다: ${p.pathname} — ${t}`);
  }
}
for (const [label, set] of [['og:site_name', siteNames], ['WebSite.name', schemaWebsiteNames], ['Organization.name', schemaOrgNames]]) {
  if (set.size > 1) add(fail, 'sitename', `${label} 이 ${set.size}종으로 갈림: ${[...set].join(' | ')}`);
}
const allNames = new Set([...siteNames, ...schemaWebsiteNames, ...schemaOrgNames]);
if (allNames.size > 1) {
  add(fail, 'sitename', `og:site_name·WebSite.name·Organization.name 이 서로 다름: ${[...allNames].join(' | ')}`);
}

// ─── 4~6. 초기 HTML(= JS 미실행) 기준 검사
const OG_REQUIRED = ['og:type', 'og:locale', 'og:site_name', 'og:url', 'og:title', 'og:description', 'og:image'];
/** 본문 최소 글자수 — 이보다 짧으면 껍데기만 나간 것으로 본다 */
const MIN_BODY = 600;
let thin = 0, noH1 = 0, multiH1 = 0, noLinks = 0, ogMissing = 0, badLang = 0;
for (const p of indexed) {
  const body = (p.html.match(/<body[\s\S]*<\/body>/) || [''])[0]
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '');
  const text = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const h1 = (p.html.match(/<h1\b/g) || []).length;
  const links = new Set([...body.matchAll(/<a\b[^>]*\shref="(\/[^"#][^"]*)"/g)].map((m) => m[1]));

  if (!/<title>[^<]/.test(p.html)) add(fail, 'ssr', `초기 HTML 에 title 없음: ${p.pathname}`);
  if (!/<meta name="description" content="[^"]/.test(p.html)) add(fail, 'ssr', `초기 HTML 에 description 없음: ${p.pathname}`);
  if (!/<link rel="canonical"/.test(p.html)) add(fail, 'ssr', `초기 HTML 에 canonical 없음: ${p.pathname}`);
  if (h1 === 0) { noH1++; add(fail, 'heading', `H1 없음: ${p.pathname}`); }
  else if (h1 > 1) { multiH1++; add(fail, 'heading', `H1 ${h1}개: ${p.pathname}`); }
  if (text.length < MIN_BODY) { thin++; add(fail, 'ssr', `초기 HTML 본문 ${text.length}자 — JS 없이 읽을 내용이 없다: ${p.pathname}`); }
  if (links.size === 0) { noLinks++; add(fail, 'ssr', `초기 HTML 에 <a href> 내부링크 0개 — 크롤 경로 없음: ${p.pathname}`); }

  const missing = OG_REQUIRED.filter((k) => !p.html.includes(`property="${k}"`));
  if (missing.length) { ogMissing++; add(fail, 'og', `${missing.join(', ')} 누락: ${p.pathname}`); }
  const locale = p.html.match(/<meta property="og:locale" content="([^"]*)"/);
  if (locale && locale[1] !== 'ko_KR') add(fail, 'og', `og:locale 이 ko_KR 이 아님(${locale[1]}): ${p.pathname}`);
  if (!/<html lang="ko"/.test(p.html)) { badLang++; add(fail, 'lang', `lang="ko" 아님: ${p.pathname}`); }
}

// ─── 7. RSS
const feedPath = join(OUT, 'feed.xml');
let feedItems = 0;
if (existsSync(feedPath)) {
  const feed = read(feedPath);
  feedItems = (feed.match(/<item>/g) || []).length;
  for (const tag of ['title', 'link', 'description']) {
    if (!feed.includes(`<${tag}>`)) add(fail, 'rss', `채널 <${tag}> 없음`);
  }
  const pub = (feed.match(/<pubDate>/g) || []).length;
  const guid = (feed.match(/<guid/g) || []).length;
  if (pub !== feedItems) add(fail, 'rss', `pubDate ${pub}개 ≠ item ${feedItems}개`);
  if (guid !== feedItems) add(fail, 'rss', `guid ${guid}개 ≠ item ${feedItems}개`);
  // 실제로 서빙되는 문서를 가리키는가
  for (const m of feed.matchAll(/<link>([^<]+)<\/link>/g)) {
    const u = m[1].replace(DOMAIN, '');
    if (u === '/blog/' || u === '/') continue;
    if (!existsSync(join(OUT, u.replace(/^\//, ''), 'index.html'))) {
      add(fail, 'rss', `없는 페이지를 가리킴: ${u}`);
    }
  }
  // 가짜 최신일 방지 — 미래 날짜는 만들어낸 값이다
  for (const m of feed.matchAll(/<pubDate>([^<]+)<\/pubDate>/g)) {
    if (new Date(m[1]).getTime() > Date.now() + 86400000) {
      add(fail, 'rss', `미래 날짜: ${m[1]}`);
    }
  }
  const declared = pages.filter((p) => p.html.includes('application/rss+xml')).length;
  if (!declared) add(warn, 'rss', 'feed.xml 이 있지만 어떤 HTML 에서도 <link rel="alternate"> 로 선언되지 않는다');
} else {
  add(warn, 'rss', 'feed.xml 없음 — 블로그·가이드가 있다면 네이버 수집 채널로 유용하다');
}

// ─── 결과
console.log(`문서 ${pages.length} · 색인 대상 ${indexed.length}`);
console.log(`소유확인   루트 meta ${rootVerified ? 'O' : 'X'} · 인증값 ${values.size}종 · HTML 파일 ${htmlVerifyFile ? 'O' : 'X'}`);
console.log(`Yeti       robots.txt Yeti 그룹 ${/User-Agent:\s*Yeti/i.test(robots) ? 'O' : 'X'} · 차단된 필수 경로 ${fail.filter((f) => f.startsWith('[robots]')).length}`);
console.log(`사이트명   og:site_name ${[...siteNames].join('|') || '-'} · WebSite.name ${[...schemaWebsiteNames].join('|') || '-'} · 상호 없는 title ${noBrandTitle}`);
console.log(`SSR        본문 ${MIN_BODY}자 미만 ${thin} · H1 없음 ${noH1} · H1 복수 ${multiH1} · 내부링크 0 ${noLinks}`);
console.log(`OG         필수 태그 누락 ${ogMissing} · lang 오류 ${badLang}`);
console.log(`RSS        item ${feedItems}`);
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
console.log('✓ 네이버 검증 통과 — 소유확인·Yeti 접근·사이트명·SSR 본문·OG·RSS 정상');
