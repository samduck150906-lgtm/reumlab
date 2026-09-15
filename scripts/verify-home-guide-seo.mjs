/**
 * 홈·가이드 인덱스 SEO 회귀 게이트 (빌드 후 실행, 프로덕션 런타임 코드 아님)
 *
 *   npm run seo:verify:home-guide
 *   node scripts/verify-home-guide-seo.mjs [outDir] [--json <path>]
 *
 * 왜 이 스크립트가 있나
 *  홈은 Next 렌더가 아니라 정적 index.html 이 copy:home 단계에서 out/ 을 덮어쓴다.
 *  그래서 app/page.tsx·app/layout.tsx 만 고치면 실제 배포 홈에는 반영되지 않는다.
 *  반대로 index.html 의 head 를 건드리면 Next 쪽 검사는 통과하는데 배포 홈만 깨진다.
 *  → 판정 대상은 언제나 "모든 후처리가 끝난 out/" 이다. 소스 문자열을 보지 않는다.
 *
 * 무엇을 보나 (README 가 아니라 실제 실패로 막는다)
 *  01 대상 HTML 존재·파싱      02 description 1개          03 canonical 1개·전파 검출
 *  04 title/OG/트위터/검증·RSS  05 ld+json 전부 파싱 가능    06 전역 @id 일관·충돌 없음
 *  07 사업체 타입 동기화        08 홈 FAQ 화면↔스키마 일치   09 가이드 FAQ 동일 원본
 *  10 빈·중복 문항, id 충돌     11 CollectionPage/ItemList/Breadcrumb 보존
 *  12 홈·가이드 색인 정책       13 FAQ 내부링크 실재         14 가격·CTA·폼 보존
 *  15 JSON-LD 안전 직렬화        16 홈 FAQ 의 no-JS 접근성(접힘 CSS ↔ noscript 대비)
 *
 * 범위를 일부러 좁힌 부분
 *  사이트맵 전수 정합·가격표 전수 대조·자기잠식은 이미 seo:audit:index · seo:verify ·
 *  seo:verify:pricing 이 담당한다. 여기서 같은 검사를 복제하지 않고 홈·가이드에 한정한다.
 *
 * 기준선 상수(BASELINE)는 "현재 승인된 값"이다. 의도적으로 바꿀 때만 같이 고친다.
 * 통과시키려고 값을 현재 출력으로 맞추는 용도가 아니다.
 */
import { parse } from 'node-html-parser';
import { readFileSync, existsSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';

const args = process.argv.slice(2);
const OUT = args.find((a) => !a.startsWith('--')) || 'out';
const jsonIdx = args.indexOf('--json');
const JSON_PATH = jsonIdx >= 0 ? args[jsonIdx + 1] : null;

const DOMAIN = 'https://reumlab.com';
const fail = [];
const warn = [];
const add = (bucket, kind, msg) => bucket.push(`[${kind}] ${msg}`);

// ── 기준선: 의도치 않은 변경을 잡기 위한 승인된 값 ────────────────
const BASELINE = {
  home: {
    path: '/',
    file: 'index.html',
    canonical: `${DOMAIN}/`,
    title: '름랩 REUMLAB | 앱·웹·AI MVP 개발 스튜디오',
    /** 홈 FAQ 는 줄어들면 안 된다(추가는 허용). 확인 시점 12문항. */
    faqMin: 12,
  },
  guide: {
    path: '/guide/',
    file: 'guide/index.html',
    canonical: `${DOMAIN}/guide/`,
    title: '개발 가이드 모음 | 비용·업종별 앱 만들기 — 름랩',
    /** lib/guide-faq.ts 의 GUIDE_FAQS 길이. 화면·스키마가 함께 이 수를 만족해야 한다. */
    faqExact: 6,
  },
  /** 사업체 노드의 현행 타입. lib/schema.ts businessNode() 주석에 전환 근거가 있다. */
  businessType: 'LocalBusiness',
  ids: {
    website: `${DOMAIN}/#website`,
    organization: `${DOMAIN}/#organization`,
    business: `${DOMAIN}/#business`,
  },
  naverVerification: '651783cd19f26e41ad3c77876597082cd6ec823e',
  rss: `${DOMAIN}/feed.xml`,
};

if (!existsSync(OUT)) {
  console.error(`${OUT}/ 이 없습니다. 먼저 npm run build 를 실행하세요.`);
  process.exit(1);
}

/** 비교용 정규화 — HTML 엔티티는 파서가 이미 풀어 준다. 공백·구두점 차이만 흡수한다. */
const norm = (s) => String(s ?? '').replace(/[\s.,·…"'"'()?!]/g, '');

function load(file) {
  const full = join(OUT, file);
  if (!existsSync(full)) return null;
  const html = readFileSync(full, 'utf8');
  const root = parse(html, { blockTextElements: { script: true, style: true } });
  return { html, root, head: root.querySelector('head'), body: root.querySelector('body') };
}

/** script/style 을 걷어낸 화면 텍스트. JS 번들·주석 속 문자열을 본문으로 세지 않기 위함. */
function visibleText(node) {
  if (!node) return '';
  const clone = parse(node.outerHTML, { blockTextElements: { script: true, style: true } });
  clone.querySelectorAll('script,style,template').forEach((n) => n.remove());
  return (clone.structuredText || '').replace(/\s+/g, ' ');
}

function ldNodes(root, pathname) {
  const out = [];
  for (const [i, s] of root.querySelectorAll('script[type="application/ld+json"]').entries()) {
    // 15. 안전 직렬화 — 이스케이프되지 않은 </script 가 그대로 있으면 블록이 조기 종료된다.
    if (/<\/script/i.test(s.rawText)) {
      add(fail, 'jsonld-escape', `${pathname}: ld+json 블록 ${i + 1} 에 이스케이프되지 않은 </script 존재`);
    }
    let data;
    try {
      data = JSON.parse(s.rawText);
    } catch (e) {
      add(fail, 'jsonld-parse', `${pathname}: ld+json 블록 ${i + 1} JSON 파싱 실패 — ${String(e.message).slice(0, 80)}`);
      continue;
    }
    for (const n of data['@graph'] ?? [data]) out.push(n);
  }
  return out;
}

/** 값이 실린 정의 노드와 @id 참조만 한 객체를 구분한다. */
const isDefinition = (n) => Object.keys(n).some((k) => k !== '@id' && k !== '@context');

// ────────────────────────────────────────────────────────────────
// 페이지별 검사
// ────────────────────────────────────────────────────────────────
const report = { pages: {}, sitewide: {} };

for (const key of ['home', 'guide']) {
  const B = BASELINE[key];
  const doc = load(B.file);
  // 01
  if (!doc) {
    add(fail, 'missing', `${B.path}: ${join(OUT, B.file)} 없음`);
    continue;
  }
  if (!doc.head || !doc.body) {
    add(fail, 'parse', `${B.path}: head 또는 body 를 파싱하지 못함`);
    continue;
  }
  const P = (report.pages[B.path] = {});

  // 02 description — head 안에, 비어 있지 않게, 정확히 1개
  const descs = doc.head.querySelectorAll('meta[name="description"]');
  P.descriptionCount = descs.length;
  if (descs.length !== 1) add(fail, 'description', `${B.path}: head meta description ${descs.length}개 (기대 1개)`);
  const descValue = (descs[0]?.getAttribute('content') ?? '').trim();
  P.descriptionLength = descValue.length;
  if (descs.length === 1 && descValue === '') add(fail, 'description', `${B.path}: description 값이 비어 있음`);
  if (doc.body.querySelectorAll('meta[name="description"]').length > 0) {
    add(fail, 'description', `${B.path}: body 에 description 이 잘못 출력됨`);
  }

  // 03 canonical — head 안에 정확히 1개, 대상 URL 일치
  const canons = doc.head.querySelectorAll('link[rel="canonical"]');
  P.canonicalCount = canons.length;
  P.canonical = canons[0]?.getAttribute('href') ?? null;
  if (canons.length !== 1) add(fail, 'canonical', `${B.path}: head canonical ${canons.length}개 (기대 1개)`);
  if (P.canonical !== B.canonical) add(fail, 'canonical', `${B.path}: canonical=${P.canonical} (기대 ${B.canonical})`);
  if (doc.body.querySelectorAll('link[rel="canonical"]').length > 0) {
    add(fail, 'canonical', `${B.path}: body 에 canonical 이 잘못 출력됨`);
  }
  for (const bad of ['localhost', '127.0.0.1', 'netlify.app', 'http://']) {
    if (P.canonical && P.canonical.includes(bad)) add(fail, 'canonical', `${B.path}: canonical 에 '${bad}' 혼입`);
  }

  // 04 title / OG / Twitter / 소유확인 / RSS / robots
  const title = doc.head.querySelector('title')?.text?.trim() ?? '';
  P.title = title;
  if (title !== B.title) add(fail, 'title', `${B.path}: title 이 기준선과 다름\n      현재: ${title}\n      기준: ${B.title}`);
  const og = Object.fromEntries(
    doc.head.querySelectorAll('meta[property^="og:"]').map((m) => [m.getAttribute('property'), m.getAttribute('content')]),
  );
  for (const need of ['og:title', 'og:description', 'og:url', 'og:image', 'og:site_name']) {
    if (!og[need]) add(fail, 'og', `${B.path}: ${need} 누락`);
  }
  if (og['og:url'] && og['og:url'] !== P.canonical) {
    add(fail, 'og', `${B.path}: og:url(${og['og:url']}) 과 canonical(${P.canonical}) 불일치`);
  }
  P.ogUrl = og['og:url'] ?? null;
  const tw = doc.head.querySelectorAll('meta[name^="twitter:"]').length;
  P.twitterTags = tw;
  if (tw === 0) add(fail, 'twitter', `${B.path}: twitter 카드 메타가 모두 사라짐`);
  const naver = doc.head.querySelector('meta[name="naver-site-verification"]')?.getAttribute('content');
  if (naver !== BASELINE.naverVerification) {
    add(fail, 'verification', `${B.path}: 네이버 소유확인 값이 기준선과 다름 (현재 ${naver ?? '없음'})`);
  }
  const rss = doc.head
    .querySelectorAll('link[rel="alternate"]')
    .find((l) => (l.getAttribute('type') || '').includes('rss'));
  if (!rss || rss.getAttribute('href') !== BASELINE.rss) {
    add(fail, 'rss', `${B.path}: RSS alternate 링크 누락/변경 (현재 ${rss?.getAttribute('href') ?? '없음'})`);
  }
  const robots = doc.head.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '';
  P.robots = robots || '(없음 = index,follow)';
  if (/noindex/i.test(robots)) add(fail, 'robots', `${B.path}: noindex 로 바뀜 — 색인 대상 페이지다`);

  // 05·06 JSON-LD
  const nodes = ldNodes(doc.root, B.path);
  P.ldNodeCount = nodes.length;
  const defs = nodes.filter(isDefinition);
  const byId = new Map();
  for (const n of defs) {
    if (!n['@id']) continue;
    if (!byId.has(n['@id'])) byId.set(n['@id'], []);
    byId.get(n['@id']).push(Array.isArray(n['@type']) ? n['@type'].join('+') : n['@type']);
  }
  for (const [id, types] of byId) {
    if (types.length > 1) add(fail, 'entity-dup', `${B.path}: @id ${id} 가 ${types.length}회 정의됨 (${types.join(', ')})`);
  }
  for (const [name, id] of Object.entries(BASELINE.ids)) {
    const found = byId.get(id);
    if (!found) add(fail, 'entity-missing', `${B.path}: 전역 엔티티 ${name}(${id}) 정의 노드 없음`);
  }
  // 07 사업체 타입 — @id 는 그대로, 타입은 현행 값으로 동기화돼 있어야 한다
  const businessTypes = byId.get(BASELINE.ids.business) ?? [];
  P.businessType = businessTypes[0] ?? null;
  if (businessTypes[0] && businessTypes[0] !== BASELINE.businessType) {
    add(fail, 'business-type', `${B.path}: #business 타입 ${businessTypes[0]} (기대 ${BASELINE.businessType})`);
  }
  const bizNode = defs.find((n) => n['@id'] === BASELINE.ids.business);
  if (bizNode) {
    if (!bizNode.address) add(fail, 'business-field', `${B.path}: #business 에 address 없음`);
    if (!bizNode.telephone) add(fail, 'business-field', `${B.path}: #business 에 telephone 없음`);
    if (bizNode.parentOrganization?.['@id'] !== BASELINE.ids.organization) {
      add(fail, 'business-field', `${B.path}: #business.parentOrganization 이 #organization 을 가리키지 않음`);
    }
  }
  // 같은 사업장을 새 @id 로 또 만들지 않았는지
  const strayBiz = defs.filter(
    (n) => /LocalBusiness|ProfessionalService/.test(String(n['@type'])) && n['@id'] !== BASELINE.ids.business,
  );
  if (strayBiz.length) {
    add(fail, 'business-dup', `${B.path}: #business 외의 사업체 노드 ${strayBiz.length}개 (${strayBiz.map((n) => n['@id']).join(', ')})`);
  }

  // 08·09·10 FAQ — 스키마와 화면이 같아야 한다
  const faqPages = defs.filter((n) => n['@type'] === 'FAQPage');
  const questions = faqPages.flatMap((n) => n.mainEntity ?? []);
  P.faqPageNodes = faqPages.length;
  P.faqQuestions = questions.length;
  const expectMin = key === 'home' ? B.faqMin : B.faqExact;
  if (faqPages.length !== 1) add(fail, 'faq', `${B.path}: FAQPage 노드 ${faqPages.length}개 (기대 1개)`);
  if (questions.length < expectMin) {
    add(fail, 'faq', `${B.path}: FAQ 문항 ${questions.length}개 (기준선 ${expectMin}개 미만 — 문항이 사라졌는지 확인)`);
  }
  if (key === 'guide' && questions.length !== B.faqExact) {
    add(fail, 'faq', `${B.path}: FAQ 문항 ${questions.length}개 (기대 정확히 ${B.faqExact}개)`);
  }
  const vis = visibleText(doc.body);
  const nvis = norm(vis);
  const seenQ = new Set();
  for (const q of questions) {
    const name = q?.name ?? '';
    const answer = q?.acceptedAnswer?.text ?? '';
    if (!String(name).trim()) add(fail, 'faq', `${B.path}: 빈 질문이 스키마에 있음`);
    if (!String(answer).trim()) add(fail, 'faq', `${B.path}: 빈 답변이 스키마에 있음 (질문: ${name})`);
    if (/undefined|null|TODO|lorem/i.test(`${name} ${answer}`)) {
      add(fail, 'faq', `${B.path}: 미완성 placeholder 가 FAQ 에 있음 (질문: ${name})`);
    }
    if (seenQ.has(norm(name))) add(fail, 'faq', `${B.path}: 중복 질문 — ${name}`);
    seenQ.add(norm(name));
    if (!nvis.includes(norm(name))) add(fail, 'faq-sync', `${B.path}: 스키마에만 있고 화면에 없는 질문 — ${name}`);
    if (!nvis.includes(norm(answer))) {
      add(fail, 'faq-sync', `${B.path}: 스키마 답변이 화면 본문과 일치하지 않음 — ${name}`);
    }
  }
  // 10 HTML id 충돌
  const ids = doc.body.querySelectorAll('[id]').map((n) => n.getAttribute('id'));
  const dupIds = [...new Set(ids.filter((v, i) => ids.indexOf(v) !== i))];
  P.htmlIdCount = ids.length;
  if (dupIds.length) add(fail, 'html-id', `${B.path}: 중복 HTML id — ${dupIds.join(', ')}`);

  // 14 상담 CTA·가격 안내 보존
  const tel = doc.body.querySelectorAll('a[href^="tel:"]').length;
  P.telCtaCount = tel;
  if (tel === 0) add(fail, 'cta', `${B.path}: 전화 상담 CTA(tel:) 가 사라짐`);
}

// ── 가이드 전용: FAQ 섹션 화면 개수 ↔ 스키마 개수, 링크 실재 ──────
{
  const doc = load(BASELINE.guide.file);
  if (doc?.body) {
    const section = doc.body.querySelector('section[aria-labelledby="guide-faq"]');
    const P = report.pages['/guide/'] ?? (report.pages['/guide/'] = {});
    if (!section) {
      add(fail, 'guide-faq', '/guide/: 본문 FAQ 섹션(aria-labelledby="guide-faq") 이 렌더되지 않음');
    } else {
      const items = section.querySelectorAll('.faq-item');
      P.faqItemsRendered = items.length;
      if (items.length !== BASELINE.guide.faqExact) {
        add(fail, 'guide-faq', `/guide/: 화면 FAQ 항목 ${items.length}개 (기대 ${BASELINE.guide.faqExact}개)`);
      }
      const nodes = ldNodes(doc.root, '/guide/').filter(isDefinition);
      const faq = nodes.find((n) => n['@type'] === 'FAQPage');
      if (faq && (faq.mainEntity ?? []).length !== items.length) {
        add(fail, 'guide-faq', `/guide/: 화면 ${items.length}개 ↔ FAQPage ${(faq.mainEntity ?? []).length}개 불일치`);
      }
      // 11 기존 페이지 노드 보존 + FAQ 와의 연결
      const coll = nodes.find((n) => n['@type'] === 'CollectionPage');
      if (!coll) add(fail, 'guide-schema', '/guide/: CollectionPage 노드가 사라짐');
      else {
        const list = coll.mainEntity;
        if (!list || list['@type'] !== 'ItemList') add(fail, 'guide-schema', '/guide/: CollectionPage.mainEntity 가 ItemList 가 아님');
        else {
          P.itemListCount = (list.itemListElement ?? []).length;
          if (P.itemListCount < 1) add(fail, 'guide-schema', '/guide/: ItemList 가 비어 있음');
          if (list.numberOfItems !== P.itemListCount) {
            add(fail, 'guide-schema', `/guide/: ItemList.numberOfItems(${list.numberOfItems}) 와 항목 수(${P.itemListCount}) 불일치`);
          }
        }
      }
      if (!nodes.some((n) => n['@type'] === 'BreadcrumbList')) add(fail, 'guide-schema', '/guide/: BreadcrumbList 가 사라짐');

      // 13 FAQ 안의 내부 링크가 실제 산출물에 존재하는가
      const links = section.querySelectorAll('a[href^="/"]').map((a) => a.getAttribute('href'));
      P.faqInternalLinks = links.length;
      for (const href of [...new Set(links)]) {
        const target = join(OUT, href.replace(/^\//, ''), 'index.html');
        if (!existsSync(target)) add(fail, 'faq-link', `/guide/: FAQ 내부 링크 대상 없음 — ${href}`);
      }
      // 주요 목록 링크 보존 (가이드/비교/허브)
      const allLinks = doc.body.querySelectorAll('a[href^="/guide/"], a[href^="/compare/"], a[href^="/h/"]').length;
      P.listLinkCount = allLinks;
      if (allLinks < 40) add(fail, 'guide-links', `/guide/: 가이드·비교·허브 링크 ${allLinks}개 — 일괄 제거 의심(기준선 40 이상)`);
    }
  }
}

// ── 03(전파) · 12(색인 정책) 사이트 전역 ────────────────────────
{
  const files = [];
  (function walk(d) {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) walk(p);
      else if (e === 'index.html') files.push(p);
    }
  })(OUT);
  let noCanon = 0;
  let multiCanon = 0;
  const homeCanonical = [];
  for (const f of files) {
    const pathname = '/' + relative(OUT, f).replace(/index\.html$/, '').replace(/\\/g, '/');
    const head = parse(readFileSync(f, 'utf8')).querySelector('head');
    const cs = head?.querySelectorAll('link[rel="canonical"]') ?? [];
    if (cs.length === 0) { noCanon++; add(fail, 'canonical', `${pathname}: canonical 없음`); }
    if (cs.length > 1) { multiCanon++; add(fail, 'canonical', `${pathname}: canonical ${cs.length}개`); }
    if (pathname !== '/' && cs.some((c) => c.getAttribute('href') === `${DOMAIN}/`)) {
      homeCanonical.push(pathname);
    }
  }
  report.sitewide = { pages: files.length, noCanonical: noCanon, multiCanonical: multiCanon, homeCanonicalPropagation: homeCanonical.length };
  if (homeCanonical.length) {
    add(fail, 'canonical-propagation', `홈 canonical 이 하위 ${homeCanonical.length}개 페이지로 전파됨 — ${homeCanonical.slice(0, 5).join(', ')}`);
  }
  // 12 홈·가이드가 사이트맵에 살아 있는가 (전수 정합은 seo:audit:index 담당)
  const smFiles = readdirSync(OUT).filter((f) => /^sitemap.*\.xml$/.test(f));
  const locs = new Set(
    smFiles.flatMap((f) => [...readFileSync(join(OUT, f), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])),
  );
  for (const u of [`${DOMAIN}/`, `${DOMAIN}/guide/`]) {
    if (!locs.has(u)) add(fail, 'sitemap', `사이트맵에서 ${u} 가 빠짐`);
  }
  report.sitewide.sitemapUrls = locs.size;
}

// ── 홈 전용: JS 없이도 FAQ 답변을 읽을 수 있는가 ─────────────────
// styles.css 가 .faq-a 를 max-height:0 으로 접고, 펼치는 동작은 script.js 클릭 핸들러뿐이다.
// 그래서 접힘 규칙이 살아 있는 한 <noscript> 펼침 스타일이 반드시 함께 있어야 한다.
// 둘 중 하나만 사라지면(스타일 정리·noscript 삭제) 조용히 되돌아가므로 여기서 묶어 검사한다.
{
  const cssPath = join(OUT, 'styles.css');
  const doc = load(BASELINE.home.file);
  if (existsSync(cssPath) && doc?.root) {
    const css = readFileSync(cssPath, 'utf8');
    const collapsed = /\.faq-a\s*\{[^}]*max-height\s*:\s*0/.test(css);
    const noscript = doc.root.querySelectorAll('noscript').map((n) => n.rawText ?? n.innerHTML).join('\n');
    const hasFallback = /\.faq-a\s*\{[^}]*max-height\s*:\s*(none|unset|[1-9])/.test(noscript);
    const P = report.pages['/'] ?? (report.pages['/'] = {});
    P.faqCollapsedByCss = collapsed;
    P.faqNoscriptFallback = hasFallback;
    if (collapsed && !hasFallback) {
      add(fail, 'faq-nojs', '/: .faq-a 가 CSS 로 접혀 있는데 <noscript> 펼침 스타일이 없음 — JS 없이 답변을 읽을 수 없다');
    }
  }
}

// ── 14 홈 전용: 가격·VAT 안내와 문의 폼 규약 보존 ─────────────────
{
  const doc = load(BASELINE.home.file);
  if (doc?.body) {
    const P = report.pages['/'] ?? (report.pages['/'] = {});
    const vis = visibleText(doc.body);
    if (!/VAT/i.test(vis)) add(fail, 'pricing', '/: 화면에서 VAT 안내가 사라짐');
    if (!/만\s?원/.test(vis)) add(fail, 'pricing', '/: 화면에서 금액 표기가 사라짐');
    const forms = doc.body.querySelectorAll('form[name="main-apply"]');
    P.applyForms = forms.length;
    if (forms.length === 0) add(fail, 'form', '/: 상담 폼(main-apply) 이 사라짐');
    for (const form of forms) {
      for (const field of ['이름', '휴대폰번호', '개인정보동의']) {
        if (!form.querySelector(`[name="${field}"]`)) {
          add(fail, 'form', `/: main-apply 폼에 ${field} 필드 없음`);
        }
      }
    }
  }
}

// ── 결과 ────────────────────────────────────────────────────────
const line = '─'.repeat(43);
console.log(`\n홈·가이드 SEO 회귀 검사 (${OUT}/)`);
console.log(line);
for (const [p, v] of Object.entries(report.pages)) {
  console.log(`  ${p}`);
  console.log(`    description ${v.descriptionCount ?? '-'}개(${v.descriptionLength ?? '-'}자) · canonical ${v.canonicalCount ?? '-'}개 ${v.canonical ?? ''}`);
  console.log(`    robots ${v.robots ?? '-'} · og:url ${v.ogUrl ?? '-'} · twitter ${v.twitterTags ?? '-'}개`);
  console.log(`    ld+json 노드 ${v.ldNodeCount ?? '-'} · #business 타입 ${v.businessType ?? '-'}`);
  console.log(`    FAQPage ${v.faqPageNodes ?? 0}개 · 문항 ${v.faqQuestions ?? 0}개${v.faqItemsRendered !== undefined ? ` (화면 ${v.faqItemsRendered}개)` : ''}`);
  if (v.itemListCount !== undefined) console.log(`    ItemList ${v.itemListCount}개 · 목록 링크 ${v.listLinkCount}개 · FAQ 링크 ${v.faqInternalLinks}개`);
  console.log(`    HTML id ${v.htmlIdCount ?? '-'}개(중복 없음) · tel CTA ${v.telCtaCount ?? '-'}개${v.applyForms !== undefined ? ` · 상담폼 ${v.applyForms}개` : ''}`);
  if (v.faqCollapsedByCss !== undefined) {
    console.log(`    FAQ 접힘(CSS) ${v.faqCollapsedByCss ? '예' : '아니오'} · noscript 펼침 대비 ${v.faqNoscriptFallback ? '있음' : '없음'}`);
  }
}
console.log(line);
console.log(`  전역: HTML ${report.sitewide.pages}개 · canonical 누락 ${report.sitewide.noCanonical} · 중복 ${report.sitewide.multiCanonical} · 홈 전파 ${report.sitewide.homeCanonicalPropagation} · 사이트맵 ${report.sitewide.sitemapUrls} URL`);
console.log(line);

if (JSON_PATH) {
  mkdirSync(dirname(JSON_PATH), { recursive: true });
  writeFileSync(JSON_PATH, JSON.stringify({ report, fail, warn }, null, 2) + '\n');
  console.log(`  리포트: ${JSON_PATH}`);
}

if (warn.length) {
  console.log(`\n⚠ 경고 ${warn.length}건`);
  warn.forEach((w) => console.log('  ' + w));
}
if (fail.length) {
  console.error(`\n✖ 실패 ${fail.length}건`);
  fail.forEach((f) => console.error('  ' + f));
  process.exitCode = 1;
} else {
  console.log('\n✓ 홈·가이드 회귀 검사 통과 — 메타·캐노니컬·엔티티·FAQ·링크·폼 이상 없음');
}
