/**
 * /ai-search-optimization/ 회귀 게이트 (빌드 후 실행, 프로덕션 런타임 코드 아님)
 *
 *   npm run seo:verify:ai-search
 *   node scripts/verify-ai-search-page.mjs [outDir] [--json <path>]
 *
 * 왜 이 스크립트가 있나
 *  이 페이지는 가격(250/390/690만·VAT 포함)·범위(진단 URL, 수정 페이지, 템플릿 수)·제외
 *  조건을 화면과 구조화 데이터 양쪽에 싣는다. 둘 중 하나만 고치면 "화면과 다른 가격이
 *  검색·AI 에 노출되는" 상태가 되는데, 사람 눈으로는 거의 안 잡힌다.
 *  또 상호작용을 전부 CSS(radio+:checked, details)로 만들었기 때문에, 누가 JS 로 바꾸면
 *  "JS 꺼지면 내용이 사라지는" 상태가 조용히 생긴다.
 *  → 최종 out/ HTML 을 파서로 읽어 실패로 막는다. 소스 문자열을 보지 않는다.
 *
 * 무엇을 보나
 *  01 파일·파싱               02 title/description/canonical 1개씩·값 일치
 *  03 OG·트위터·robots         04 OG 이미지가 실제 파일로 존재하고 1200×630
 *  05 ld+json 파싱·안전 직렬화  06 WebPage/Service/BreadcrumbList 관계와 고정 @id
 *  07 전역 @id 재선언 금지      08 Offer 3개의 통화·minPrice·VAT 가 화면 가격과 일치
 *  09 FAQPage ↔ 화면 details    10 화면 가격·범위 숫자가 lib 데이터와 일치
 *  11 제외 조건이 화면에 존재    12 보장·순위 약속 금지어
 *  13 CSS 전용 상호작용 유지     14 상담 폼 필드·정적 감지 폼 동기화
 *  15 사이트맵·메뉴·llms 등록    16 /geo-website/ 양방향 링크
 *  17 H1 1개·헤딩 계층          18 표 caption/th scope
 *
 * 범위를 좁힌 부분
 *  사이트 전체 canonical·자기잠식·전역 가격 일관성은 seo:audit:index · seo:verify ·
 *  seo:verify:pricing · seo:verify:cannibalization 이 이미 담당한다. 복제하지 않는다.
 */
import { parse } from 'node-html-parser';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const OUT = args.find((a) => !a.startsWith('--')) || 'out';
const jsonIdx = args.indexOf('--json');
const JSON_PATH = jsonIdx >= 0 ? args[jsonIdx + 1] : null;

const DOMAIN = 'https://reumlab.com';
const PATHNAME = '/ai-search-optimization/';
const FILE = 'ai-search-optimization/index.html';
const CANONICAL = `${DOMAIN}${PATHNAME}`;

const fail = [];
const warn = [];
const add = (bucket, kind, msg) => bucket.push(`[${kind}] ${msg}`);

/**
 * 기대값의 단일 출처는 lib/ai-search-form.ts(=import 없는 모듈)와 아래 BASELINE 이다.
 * 가격·범위 숫자는 tsx 없이 읽어야 하므로 lib/ai-search-architecture.ts 를 텍스트로
 * 파싱한다 — 화면과 lib 이 갈렸는지 보는 게 목적이라, lib 을 "정답"으로 삼는다.
 */
const BASELINE = {
  title: '기존 홈페이지 AI 검색 최적화 | SEO·GEO·AEO 구조 개선 · 름랩',
  ogImage: `${DOMAIN}/og-ai-search-architecture.jpg`,
  ogImageFile: 'og-ai-search-architecture.jpg',
  ogImageSize: { w: 1200, h: 630 },
  /** 최소 FAQ 문항 수 — 명세가 12개를 요구하고 현재 15개다. 줄어들면 실패. */
  faqMin: 12,
  /** 개선 범위 카드 수 (radio 탭과 같아야 한다) */
  scopeAreas: 6,
  packages: [
    { value: 'START', won: 2_500_000, man: '250만', audit: 100, edit: 3, tpl: 1 },
    { value: 'GROWTH', won: 3_900_000, man: '390만', audit: 300, edit: 7, tpl: 2 },
    { value: 'ENTERPRISE', won: 6_900_000, man: '690만', audit: 1000, edit: 12, tpl: 3 },
  ],
  care: [
    { name: 'CARE', won: 390_000, man: '39만' },
    { name: 'CARE PLUS', won: 690_000, man: '69만' },
  ],
  ids: {
    website: `${DOMAIN}/#website`,
    organization: `${DOMAIN}/#organization`,
    business: `${DOMAIN}/#business`,
  },
  /** 상담 폼이 이 페이지에서 반드시 실어 보내야 하는 필드 */
  formFields: ['이름', '휴대폰번호', '개인정보동의', '현재홈페이지주소', '홈페이지환경', '수정권한', '관심패키지', '지속관리관심'],
  /**
   * 금지 표현 — 검색 순위·AI 노출·무제한을 "약속하는" 문장.
   *
   * 같은 단어라도 부정·거절 문맥에서는 정상이다.
   *   ✗ "AI 추천을 보장합니다"            ← 막아야 함
   *   ✓ "추천·인용은 보장하지 않습니다"    ← 정상 고지
   *   ✓ "단기간 1위, AI 추천 보장 … 을 원하시는 경우에는 적합하지 않습니다" ← 정상 거절
   * 단어 뒤 몇 글자만 보는 lookahead 로는 두 번째·세 번째를 구분할 수 없어서,
   * 매치가 들어 있는 "문장 전체"를 꺼내 부정 표지가 있는지로 판정한다.
   */
  bannedPatterns: [
    { re: /순위\s*(를|을)?\s*보장/, label: '순위 보장' },
    { re: /(노출|인용|추천)\s*(를|을)?\s*보장/, label: '노출·추천 보장' },
    { re: /(1위|상위\s*\d+\s*%|상위노출)\s*(보장|확정|약속)/, label: '상위노출 보장' },
    { re: /무제한\s*(수정|작업|페이지|문의)/, label: '무제한 약속' },
    { re: /평생\s*(무료|유지보수|관리)/, label: '평생 약속' },
    { re: /100\s*%\s*(보존|보장|성공)/, label: '100% 약속' },
  ],
  /** 위 표현이 이 표지와 같은 문장에 있으면 "약속"이 아니라 "고지·거절"로 본다 */
  disclaimerMarkers: [
    '보장하지 않', '보장할 수 없', '약속하지 않', '적합하지 않', '만들지 않',
    '쓰지 않', '하지 않습니다', '불가능', '아닙니다',
  ],
};

if (!existsSync(OUT)) {
  console.error(`${OUT}/ 이 없습니다. 먼저 npm run build 를 실행하세요.`);
  process.exit(1);
}

const norm = (s) => String(s ?? '').replace(/[\s.,·…"'“”‘’()?!]/g, '');

const full = join(OUT, FILE);
if (!existsSync(full)) {
  console.error(`✖ ${full} 없음 — 페이지가 빌드되지 않았습니다.`);
  process.exit(1);
}
const html = readFileSync(full, 'utf8');
const root = parse(html, { blockTextElements: { script: true, style: true } });
const head = root.querySelector('head');
const body = root.querySelector('body');
const main = root.querySelector('main');
if (!head || !body || !main) {
  console.error('✖ head/body/main 을 찾지 못했습니다 — 마크업이 깨졌습니다.');
  process.exit(1);
}

/** script/style 을 걷어낸 화면 텍스트 (JS 번들 속 문자열을 본문으로 세지 않기 위함) */
const mainClone = parse(main.outerHTML, { blockTextElements: { script: true, style: true } });
mainClone.querySelectorAll('script,style,template').forEach((n) => n.remove());
const mainText = (mainClone.structuredText || '').replace(/\s+/g, ' ');

const report = {};

// ── 02 title / description / canonical ───────────────────────────
{
  const titles = head.querySelectorAll('title');
  if (titles.length !== 1) add(fail, 'title', `title 태그 ${titles.length}개 (1개여야 함)`);
  const title = titles[0]?.text?.trim() ?? '';
  report.title = title;
  if (title !== BASELINE.title) add(fail, 'title', `title 불일치\n      기대: ${BASELINE.title}\n      실제: ${title}`);
  // 루트 템플릿이 브랜드명을 한 번 더 붙였는지
  if ((title.match(/름랩/g) || []).length > 1) add(fail, 'title', 'title 에 브랜드명이 두 번 들어감(템플릿 중복)');

  const descs = head.querySelectorAll('meta[name="description"]');
  report.descriptionCount = descs.length;
  if (descs.length !== 1) add(fail, 'description', `description ${descs.length}개 (1개여야 함)`);
  const desc = descs[0]?.getAttribute('content') ?? '';
  report.descriptionLength = desc.length;
  if (desc.length < 70 || desc.length > 200) add(fail, 'description', `description 길이 ${desc.length}자 (70~200 권장 범위 밖)`);
  if (!desc.includes('250만')) add(fail, 'description', 'description 에 시작가(250만)가 없음 — 화면 가격과 어긋남');

  const canons = head.querySelectorAll('link[rel="canonical"]');
  report.canonicalCount = canons.length;
  if (canons.length !== 1) add(fail, 'canonical', `canonical ${canons.length}개 (1개여야 함)`);
  const canon = canons[0]?.getAttribute('href') ?? '';
  report.canonical = canon;
  if (canon !== CANONICAL) add(fail, 'canonical', `canonical 불일치: ${canon}`);
  if (/[?#]/.test(canon)) add(fail, 'canonical', 'canonical 에 query/fragment 가 들어감');
}

// ── 03 OG / 트위터 / robots ───────────────────────────────────────
{
  const og = (p) => head.querySelector(`meta[property="og:${p}"]`)?.getAttribute('content') ?? '';
  report.ogUrl = og('url');
  if (og('url') !== CANONICAL) add(fail, 'og', `og:url 불일치: ${og('url')}`);
  if (og('title') !== BASELINE.title) add(fail, 'og', 'og:title 이 title 과 다름');
  if (og('image') !== BASELINE.ogImage) add(fail, 'og', `og:image 불일치: ${og('image')}`);
  if (og('image:width') !== '1200' || og('image:height') !== '630') add(fail, 'og', 'og:image 크기 선언이 1200×630 이 아님');
  const tw = head.querySelectorAll('meta[name^="twitter:"]');
  report.twitterTags = tw.length;
  if (tw.length < 4) add(fail, 'og', `twitter 메타 ${tw.length}개 (4개 이상)`);

  const robots = head.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '';
  report.robots = robots || '(없음)';
  if (/noindex|none/i.test(robots)) add(fail, 'robots', `프로덕션 산출물에 noindex 가 섞임: ${robots}`);
}

// ── 04 OG 이미지 실제 파일 ────────────────────────────────────────
{
  const imgPath = join(OUT, BASELINE.ogImageFile);
  if (!existsSync(imgPath)) {
    add(fail, 'og-file', `공유 이미지 파일 없음: ${imgPath} (가상 경로만 지정되어 있음)`);
  } else {
    const buf = readFileSync(imgPath);
    report.ogImageBytes = buf.length;
    // JPEG SOF 마커에서 실제 픽셀 크기를 읽는다(선언값과 파일이 다른 사고를 막는다)
    let w = 0, h = 0;
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2;
      while (i < buf.length - 9) {
        if (buf[i] !== 0xff) { i++; continue; }
        const marker = buf[i + 1];
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          h = buf.readUInt16BE(i + 5); w = buf.readUInt16BE(i + 7); break;
        }
        i += 2 + buf.readUInt16BE(i + 2);
      }
    } else if (buf.slice(1, 4).toString() === 'PNG') {
      w = buf.readUInt32BE(16); h = buf.readUInt32BE(20);
    }
    report.ogImageSize = `${w}×${h}`;
    if (w !== BASELINE.ogImageSize.w || h !== BASELINE.ogImageSize.h) {
      add(fail, 'og-file', `공유 이미지 실제 크기 ${w}×${h} (선언 1200×630 과 다름)`);
    }
    if (buf.length > 600 * 1024) add(warn, 'og-file', `공유 이미지 ${Math.round(buf.length / 1024)}KB — 과도하게 큼`);
  }
}

// ── 05·06·07 JSON-LD ─────────────────────────────────────────────
const nodes = [];
{
  const scripts = root.querySelectorAll('script[type="application/ld+json"]');
  report.ldBlocks = scripts.length;
  scripts.forEach((s, i) => {
    if (/<\/script/i.test(s.rawText)) add(fail, 'jsonld-escape', `ld+json 블록 ${i + 1} 에 이스케이프되지 않은 </script 존재`);
    let data;
    try { data = JSON.parse(s.rawText); }
    catch (e) { add(fail, 'jsonld-parse', `ld+json 블록 ${i + 1} JSON 파싱 실패 — ${String(e.message).slice(0, 80)}`); return; }
    for (const n of data['@graph'] ?? [data]) nodes.push(n);
  });
  report.ldNodes = nodes.length;

  const byId = (id) => nodes.filter((n) => n['@id'] === id);
  const isDef = (n) => Object.keys(n).some((k) => k !== '@id' && k !== '@context');

  const webpage = nodes.find((n) => n['@type'] === 'WebPage');
  const service = nodes.find((n) => n['@type'] === 'Service');
  const crumbs = nodes.find((n) => n['@type'] === 'BreadcrumbList');
  const faqPage = nodes.find((n) => n['@type'] === 'FAQPage');
  report.ldTypes = nodes.map((n) => n['@type']).join(',');

  if (!webpage) add(fail, 'schema', 'WebPage 노드 없음');
  if (!service) add(fail, 'schema', 'Service 노드 없음');
  if (!crumbs) add(fail, 'schema', 'BreadcrumbList 노드 없음');

  if (webpage) {
    if (webpage['@id'] !== `${CANONICAL}#webpage`) add(fail, 'schema', `WebPage @id 고정값 아님: ${webpage['@id']}`);
    if (webpage.url !== CANONICAL) add(fail, 'schema', `WebPage.url 이 canonical 과 다름: ${webpage.url}`);
    if (webpage.isPartOf?.['@id'] !== BASELINE.ids.website) add(fail, 'schema', 'WebPage.isPartOf 가 전역 WebSite @id 를 참조하지 않음');
    if (webpage.mainEntity?.['@id'] !== `${CANONICAL}#service`) add(fail, 'schema', 'WebPage.mainEntity 가 Service @id 를 가리키지 않음');
    if (webpage.inLanguage !== 'ko-KR') add(fail, 'schema', `WebPage.inLanguage=${webpage.inLanguage}`);
  }
  if (service) {
    if (service['@id'] !== `${CANONICAL}#service`) add(fail, 'schema', `Service @id 고정값 아님: ${service['@id']}`);
    if (service.provider?.['@id'] !== BASELINE.ids.business) add(fail, 'schema', 'Service.provider 가 전역 사업체 @id 를 참조하지 않음');
  }
  if (crumbs) {
    if (crumbs['@id'] !== `${CANONICAL}#breadcrumb`) add(fail, 'schema', `BreadcrumbList @id 고정값 아님: ${crumbs['@id']}`);
    const items = crumbs.itemListElement ?? [];
    if (items.length !== 2) add(fail, 'schema', `BreadcrumbList 단계 ${items.length}개 (홈 > 현재 페이지 = 2단계)`);
    if (items[1]?.item !== CANONICAL) add(fail, 'schema', 'BreadcrumbList 마지막 단계가 canonical 이 아님');
    // 화면 breadcrumb 과 같은 단계여야 한다
    const visible = main.querySelector('nav[aria-label="현재 위치"]');
    const visibleSteps = visible ? visible.childNodes.filter((n) => n.nodeType === 1 && n.rawTagName !== 'span' || (n.rawTagName === 'span' && !n.getAttribute?.('aria-hidden'))).length : 0;
    if (!visible) add(fail, 'schema', '화면 breadcrumb 이 없음 (스키마에만 존재)');
    else if (visibleSteps !== items.length) add(warn, 'schema', `화면 breadcrumb ${visibleSteps}단계 ↔ 스키마 ${items.length}단계`);
    if (/\/services\//.test(JSON.stringify(items))) add(fail, 'schema', '존재하지 않는 /services/ 중간 경로가 breadcrumb 에 있음');
  }

  // 07 전역 엔티티를 이 페이지에서 다시 "정의"하면 같은 @id 가 두 번 선언된다.
  //    루트 레이아웃이 1회 선언하므로 여기서는 참조만 있어야 한다.
  for (const [k, id] of Object.entries(BASELINE.ids)) {
    const defs = byId(id).filter(isDef);
    if (defs.length > 1) add(fail, 'schema-id', `${k}(@id ${id}) 정의가 ${defs.length}번 — 중복 엔티티`);
    if (defs.length === 0) add(fail, 'schema-id', `${k}(@id ${id}) 전역 노드가 이 페이지에 없음 — 참조가 끊김`);
  }

  // 08 Offer ↔ 화면 가격
  const offers = service?.offers ?? [];
  report.offers = offers.length;
  if (offers.length !== BASELINE.packages.length) {
    add(fail, 'offer', `Offer ${offers.length}개 (화면 가격 카드 ${BASELINE.packages.length}개와 달라짐)`);
  }
  for (const pkg of BASELINE.packages) {
    const o = offers.find((x) => String(x.name ?? '').startsWith(pkg.value));
    if (!o) { add(fail, 'offer', `${pkg.value} Offer 없음`); continue; }
    const ps = o.priceSpecification ?? {};
    if (ps.priceCurrency !== 'KRW') add(fail, 'offer', `${pkg.value} 통화 ${ps.priceCurrency} (KRW 여야 함)`);
    if (Number(ps.minPrice) !== pkg.won) add(fail, 'offer', `${pkg.value} minPrice ${ps.minPrice} ≠ 화면 ${pkg.won}`);
    if (ps.valueAddedTaxIncluded !== true) add(fail, 'offer', `${pkg.value} valueAddedTaxIncluded 가 true 가 아님 (화면은 VAT 포함)`);
    // '부터' 를 확정가로 바꿔 쓰지 않았는지
    if (o.price !== undefined) add(fail, 'offer', `${pkg.value} 에 확정가(price)가 들어감 — 화면은 '부터' 표기`);
  }
  // 이 페이지를 상품으로 오인시키지 않는다
  if (nodes.some((n) => n['@type'] === 'Product')) add(fail, 'offer', 'Product 노드가 있음 — 서비스 페이지를 상품으로 선언하지 않는다');
  if (nodes.some((n) => n.aggregateRating || n.review)) add(fail, 'schema', '근거 없는 aggregateRating/review 가 있음');

  // 09 FAQPage ↔ 화면
  const details = main.querySelectorAll('details');
  const screenQ = details.map((d) => norm(d.querySelector('summary')?.structuredText));
  const screenA = details.map((d) => norm(d.querySelector('p')?.structuredText));
  report.faqRendered = details.length;
  if (details.length < BASELINE.faqMin) add(fail, 'faq', `화면 FAQ ${details.length}개 (최소 ${BASELINE.faqMin}개)`);
  if (screenA.some((a) => !a || a.length < 20)) add(fail, 'faq', '답변 본문이 비어 있거나 너무 짧은 FAQ 가 있음 (질문만 HTML 에 있으면 안 됨)');
  if (new Set(screenQ).size !== screenQ.length) add(fail, 'faq', '중복된 FAQ 질문이 있음');
  if (faqPage) {
    const schemaQ = (faqPage.mainEntity ?? []).map((q) => norm(q.name));
    const schemaA = (faqPage.mainEntity ?? []).map((q) => norm(q.acceptedAnswer?.text));
    report.faqSchema = schemaQ.length;
    if (faqPage['@id'] !== `${CANONICAL}#faq`) add(fail, 'faq', `FAQPage @id 고정값 아님: ${faqPage['@id']}`);
    for (const q of schemaQ) if (!screenQ.includes(q)) add(fail, 'faq', `스키마에만 있고 화면에 없는 FAQ 질문: ${q.slice(0, 30)}`);
    for (const a of schemaA) if (!screenA.includes(a)) add(fail, 'faq', `스키마 답변이 화면 답변과 다름: ${a.slice(0, 30)}`);
    if (schemaQ.length !== screenQ.length) add(fail, 'faq', `FAQ 수 불일치 — 화면 ${screenQ.length} ↔ 스키마 ${schemaQ.length}`);
  }
}

// ── 10·11 화면 가격·범위 숫자 ────────────────────────────────────
{
  for (const pkg of BASELINE.packages) {
    if (!mainText.includes(`${pkg.man} 원부터`)) add(fail, 'price', `화면에 "${pkg.man} 원부터" 가 없음 (${pkg.value})`);
    if (!mainText.includes(`${pkg.won.toLocaleString('ko-KR')}원`)) add(fail, 'price', `화면에 ${pkg.value} 원 단위 금액(${pkg.won.toLocaleString('ko-KR')}원)이 없음`);
    if (!mainText.includes(`최대 ${pkg.audit.toLocaleString('ko-KR')} URL`)) add(fail, 'scope', `${pkg.value} 진단 URL(${pkg.audit}) 표기 없음`);
    if (!mainText.includes(`최대 ${pkg.edit}개`)) add(fail, 'scope', `${pkg.value} 실제 수정 페이지(${pkg.edit}) 표기 없음`);
    if (!mainText.includes(`최대 ${pkg.tpl}종`)) add(fail, 'scope', `${pkg.value} 템플릿 수(${pkg.tpl}) 표기 없음`);
  }
  for (const c of BASELINE.care) {
    if (!mainText.includes(`월 ${c.man} 원`)) add(fail, 'price', `화면에 ${c.name} 월 요금(${c.man} 원)이 없음`);
  }
  if (!/VAT 포함/.test(mainText)) add(fail, 'price', '화면에 VAT 포함 표기가 없음');
  if (!/제외/.test(mainText)) add(fail, 'scope', '화면에 제외 범위 표기가 없음');
  // 별표 조건을 읽을 수 없게 숨기지 않았는지 — 제외/주의 문구가 본문에 실제로 있어야 한다
  for (const must of ['별도 견적', '보장하지 않습니다', '계약 전에 확정']) {
    if (!mainText.includes(must)) add(fail, 'scope', `필수 고지 문구 누락: "${must}"`);
  }
  report.priceLines = BASELINE.packages.map((p) => `${p.value} ${p.man}`).join(' / ');
}

// ── 12 금지 표현 ─────────────────────────────────────────────────
{
  // 마침표 기준으로 문장을 나눠, 매치가 속한 문장에 부정 표지가 있는지 본다.
  const sentences = mainText.split(/(?<=[.!?])\s+/);
  for (const { re, label } of BASELINE.bannedPatterns) {
    for (const sentence of sentences) {
      if (!re.test(sentence)) continue;
      if (BASELINE.disclaimerMarkers.some((d) => sentence.includes(d))) continue;
      add(fail, 'claim', `금지 표현(${label}) 발견: "${sentence.slice(0, 90)}"`);
    }
  }
  // NEO 는 네이버 공식 명칭이 아니라는 고지가 반드시 함께 있어야 한다
  if (mainText.includes('NEO') && !mainText.includes('공식 서비스명이나 인증명이 아닙니다')) {
    add(fail, 'claim', 'NEO 를 쓰면서 "네이버 공식 명칭이 아니다" 고지가 없음');
  }
}

// ── 13 CSS 전용 상호작용 ─────────────────────────────────────────
{
  const radios = main.querySelectorAll('input[type="radio"][name="aisa-scope"]');
  const cards = main.querySelectorAll('[class*="scopeCard"]');
  const tabs = main.querySelectorAll('label[class*="scopeTab"]');
  report.scopeRadios = radios.length;
  report.scopeCards = cards.length;
  if (radios.length !== BASELINE.scopeAreas) add(fail, 'interaction', `범위 radio ${radios.length}개 (${BASELINE.scopeAreas}개여야 함)`);
  if (cards.length !== BASELINE.scopeAreas) add(fail, 'interaction', `범위 카드 ${cards.length}개 — JS 없이도 전부 HTML 에 있어야 함`);
  if (tabs.length !== BASELINE.scopeAreas) add(fail, 'interaction', `범위 탭 label ${tabs.length}개`);
  if (radios.filter((r) => r.hasAttribute('checked')).length !== 1) add(fail, 'interaction', '초기 선택된 범위 radio 가 정확히 1개가 아님');
  for (const r of radios) {
    const id = r.getAttribute('id');
    if (!id || !tabs.some((t) => t.getAttribute('for') === id)) add(fail, 'a11y', `radio ${id} 를 가리키는 label[for] 이 없음`);
  }
  // 목차 앵커의 대상이 실제로 존재하는가
  const toc = main.querySelectorAll('nav a[href^="#"]');
  report.tocLinks = toc.length;
  for (const a of toc) {
    const id = a.getAttribute('href').slice(1);
    if (!root.querySelector(`#${id}`)) add(fail, 'anchor', `목차 앵커 대상 없음: #${id}`);
  }
  // 가격 카드 CTA — JS 가 없어도 이동 가능한 평범한 앵커여야 한다
  const pkgCtas = main.querySelectorAll('a[data-aisa-package]');
  report.packageCtas = pkgCtas.length;
  if (pkgCtas.length !== BASELINE.packages.length) add(fail, 'interaction', `패키지 CTA ${pkgCtas.length}개`);
  for (const a of pkgCtas) {
    if (a.getAttribute('href') !== '#inquiry') add(fail, 'interaction', `패키지 CTA href 가 #inquiry 가 아님: ${a.getAttribute('href')}`);
    const v = a.getAttribute('data-aisa-package');
    if (!BASELINE.packages.some((p) => p.value === v)) add(fail, 'interaction', `패키지 CTA 값이 비식별 enum 이 아님: ${v}`);
  }
  // 화면에서 사라진 본문이 없는지 — 인라인 style 로 숨긴 요소 금지
  const hidden = main.querySelectorAll('[style*="opacity:0"], [style*="opacity: 0"], [style*="display:none"]');
  if (hidden.length) add(fail, 'interaction', `인라인 style 로 숨긴 요소 ${hidden.length}개 — JS 실패 시 영구히 사라진다`);
}

// ── 14 상담 폼 ───────────────────────────────────────────────────
{
  const form = body.querySelector('form[name="main-apply"]');
  if (!form) {
    add(fail, 'form', '상담 폼(main-apply) 이 없음');
  } else {
    const names = form.querySelectorAll('[name]').map((n) => n.getAttribute('name'));
    report.formFields = names.length;
    for (const f of BASELINE.formFields) {
      if (!names.includes(f)) add(fail, 'form', `상담 폼에 ${f} 필드 없음`);
    }
    if (!names.includes('bot-field')) add(fail, 'form', 'honeypot(bot-field) 이 사라짐');
    if (form.querySelector('[name="form-name"]')?.getAttribute('value') !== 'main-apply') add(fail, 'form', 'form-name hidden 값이 main-apply 가 아님');
    // 계약 전에 받으면 안 되는 필드
    for (const bad of ['password', '비밀번호', 'api', 'apikey', 'api_key', '인증코드']) {
      if (names.some((n) => n.toLowerCase().includes(bad))) add(fail, 'privacy', `상담 폼에 민감 필드가 있음: ${bad}`);
    }
    // 동의 체크박스가 미리 체크되어 있으면 안 된다
    const consent = form.querySelector('[name="개인정보동의"]');
    if (consent?.hasAttribute('checked')) add(fail, 'privacy', '개인정보 동의가 미리 체크된 상태로 렌더됨');
    // 모든 입력에 label 이 붙어 있는가
    for (const el of form.querySelectorAll('input:not([type=hidden]), select, textarea')) {
      const id = el.getAttribute('id');
      const inLabel = el.closest && el.closest('label');
      if (!id && !inLabel) { add(fail, 'a11y', `label 없는 입력: name=${el.getAttribute('name')}`); continue; }
      if (id && !form.querySelector(`label[for="${id}"]`) && !inLabel) add(fail, 'a11y', `label[for=${id}] 없음`);
    }
  }
  // 정적 감지 폼(Netlify)이 같은 필드를 갖고 있는가 — 여기가 어긋나면 접수 값이 통째로 누락된다
  const detect = join(OUT, '__forms.html');
  if (!existsSync(detect)) add(fail, 'form', 'out/__forms.html 이 없음 (Netlify 폼 감지 파일)');
  else {
    const dRoot = parse(readFileSync(detect, 'utf8'));
    const dForm = dRoot.querySelector('form[name="main-apply"]');
    const dNames = dForm ? dForm.querySelectorAll('[name]').map((n) => n.getAttribute('name')) : [];
    for (const f of BASELINE.formFields) {
      if (!dNames.includes(f)) add(fail, 'form', `__forms.html 의 main-apply 에 ${f} 필드가 없음 — 접수 값이 누락된다`);
    }
  }
}

// ── 15 사이트맵 · 메뉴 · llms ────────────────────────────────────
{
  const maps = ['sitemap-pages.xml', 'sitemap.xml'];
  let found = false;
  for (const m of maps) {
    const p = join(OUT, m);
    if (existsSync(p) && readFileSync(p, 'utf8').includes(CANONICAL)) { found = true; break; }
  }
  report.inSitemap = found;
  if (!found) add(fail, 'sitemap', `사이트맵에 ${CANONICAL} 이 없음`);

  // 운영 보조 페이지가 SEO 사이트맵에 섞이지 않았는지
  const smIdx = join(OUT, 'sitemap-pages.xml');
  if (existsSync(smIdx) && /__forms\.html/.test(readFileSync(smIdx, 'utf8'))) {
    add(fail, 'sitemap', '__forms.html 이 사이트맵에 들어감');
  }

  for (const f of ['llms.txt', 'llms-full.txt']) {
    const p = join(OUT, f);
    if (!existsSync(p)) { add(fail, 'llms', `${f} 없음`); continue; }
    if (!readFileSync(p, 'utf8').includes(PATHNAME)) add(fail, 'llms', `${f} 에 ${PATHNAME} 항목이 없음`);
  }

  const home = join(OUT, 'index.html');
  if (existsSync(home) && !readFileSync(home, 'utf8').includes(PATHNAME)) {
    add(fail, 'menu', `홈 서비스 메뉴에 ${PATHNAME} 링크가 없음`);
  }
}

// ── 16 /geo-website/ 양방향 링크 ─────────────────────────────────
{
  const outLinks = main.querySelectorAll('a[href]').map((a) => a.getAttribute('href'));
  report.internalLinks = outLinks.filter((h) => h.startsWith('/')).length;
  if (!outLinks.some((h) => h.startsWith('/geo-website'))) add(fail, 'link', '/geo-website/ 로 가는 문맥 링크가 없음');
  const geo = join(OUT, 'geo-website/index.html');
  if (!existsSync(geo)) add(fail, 'link', 'out/geo-website/index.html 없음');
  else if (!readFileSync(geo, 'utf8').includes(PATHNAME)) add(fail, 'link', `/geo-website/ 에서 ${PATHNAME} 로 돌아오는 링크가 없음 (양방향 아님)`);

  // 죽은 내부 링크
  for (const href of new Set(outLinks.filter((h) => h.startsWith('/') && !h.startsWith('//')))) {
    const clean = href.split(/[?#]/)[0];
    if (clean === '/') continue;
    const candidate = join(OUT, decodeURIComponent(clean), 'index.html');
    const asFile = join(OUT, decodeURIComponent(clean.replace(/\/$/, '')));
    if (!existsSync(candidate) && !existsSync(asFile)) add(fail, 'link', `존재하지 않는 내부 링크: ${href}`);
  }
}

// ── 17·18 헤딩 · 표 ──────────────────────────────────────────────
{
  const h1s = main.querySelectorAll('h1');
  report.h1 = h1s.length;
  if (h1s.length !== 1) add(fail, 'heading', `main 안의 h1 ${h1s.length}개 (1개여야 함)`);
  const levels = main.querySelectorAll('h1,h2,h3,h4').map((h) => Number(h.rawTagName[1]));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) { add(fail, 'heading', `헤딩 계층 건너뜀: h${levels[i - 1]} → h${levels[i]}`); break; }
  }
  report.headings = levels.length;

  const tables = main.querySelectorAll('table');
  report.tables = tables.length;
  for (const t of tables) {
    if (!t.querySelector('caption')) add(fail, 'a11y', 'caption 없는 표가 있음');
    const ths = t.querySelectorAll('th');
    if (!ths.length) add(fail, 'a11y', 'th 없는 표가 있음');
    for (const th of ths) if (!th.getAttribute('scope')) add(fail, 'a11y', 'scope 없는 th 가 있음');
  }

  // id 중복 (앵커·label[for] 이 조용히 깨진다)
  const ids = root.querySelectorAll('[id]').map((e) => e.getAttribute('id'));
  const dup = ids.filter((v, i) => ids.indexOf(v) !== i);
  report.htmlIds = ids.length;
  if (dup.length) add(fail, 'a11y', `중복 id: ${[...new Set(dup)].join(', ')}`);
}

// ── 결과 ─────────────────────────────────────────────────────────
const line = '─'.repeat(52);
console.log(`\nAI Search Architecture 페이지 회귀 검사 (${OUT}${PATHNAME})`);
console.log(line);
console.log(`  title        ${report.title}`);
console.log(`  description  ${report.descriptionCount}개(${report.descriptionLength}자) · canonical ${report.canonicalCount}개 ${report.canonical}`);
console.log(`  robots       ${report.robots} · og:url ${report.ogUrl} · twitter ${report.twitterTags}개`);
console.log(`  og 이미지    ${report.ogImageSize} · ${Math.round((report.ogImageBytes ?? 0) / 1024)}KB`);
console.log(`  ld+json      블록 ${report.ldBlocks} · 노드 ${report.ldNodes} (${report.ldTypes})`);
console.log(`  Offer        ${report.offers}개 — ${report.priceLines}`);
console.log(`  FAQ          화면 ${report.faqRendered}개 ↔ 스키마 ${report.faqSchema ?? '-'}개`);
console.log(`  상호작용     범위 radio ${report.scopeRadios}/카드 ${report.scopeCards} · 목차 ${report.tocLinks} · 패키지 CTA ${report.packageCtas}`);
console.log(`  상담 폼      필드 ${report.formFields}개 (정적 감지 폼과 동기화 확인)`);
console.log(`  링크·구조    내부 링크 ${report.internalLinks} · h1 ${report.h1} · 헤딩 ${report.headings} · 표 ${report.tables} · id ${report.htmlIds}`);
console.log(`  등록         사이트맵 ${report.inSitemap ? '예' : '아니오'} · llms.txt · 홈 메뉴`);
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
  console.log('\n✓ AI Search 페이지 검사 통과 — 메타·스키마·가격·FAQ·상호작용·폼·링크 이상 없음');
}
