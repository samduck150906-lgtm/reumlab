/**
 * /ai-voice-development/ 회귀 게이트 (빌드 후 실행, 프로덕션 런타임 코드 아님)
 *
 *   npm run seo:verify:ai-voice
 *   node scripts/verify-ai-voice-service.mjs [outDir] [--json <path>]
 *
 * 왜 이 스크립트가 있나
 *  이 페이지는 "가상 시뮬레이션"과 "실제 문의 접수"를 한 화면에 함께 둔다. 둘의 경계가
 *  흐려지는 순간(가상 데모가 실제처럼 보이거나, 시뮬레이션 고지가 사라지거나,
 *  폼 필드가 감지 스켈레톤에서 빠지거나) 사람 눈으로는 거의 안 잡힌다.
 *  또 상호작용을 CSS(radio + :checked, details)로 만들었기 때문에, 누가 JS 로 바꾸면
 *  "JS 꺼지면 내용이 사라지는" 상태가 조용히 생긴다.
 *  → 최종 out/ HTML 을 파서로 읽어 실패로 막는다. 소스 문자열을 보지 않는다.
 *
 * 무엇을 보나
 *  01 파일·파싱                02 title/description/canonical 1개씩·값 일치
 *  03 OG·트위터·robots          04 ld+json 파싱·안전 직렬화
 *  05 WebPage/Service/Breadcrumb 관계와 고정 @id · 전역 @id 재선언 금지
 *  06 스키마에 가짜 가격·평점·리뷰가 없다 (전부 개별 견적이므로 offers 자체가 없어야 한다)
 *  07 FAQPage ↔ 화면 details 16개 일치
 *  08 업종 6종의 설명·전체 대본 48발화가 초기 HTML 에 있다
 *  09 시뮬레이션 고지 ↔ 실제 문의 CTA 구분
 *  10 업종별 업무 범위 표 6행 · 사람이 맡을 업무 열 존재
 *  11 관리자 예시가 CSS 전용(radio 3 + 상세 3)이고 상태 enum 이 유효하다
 *  12 보장·순위·실적 금지어 (면책 문장은 통과시킨다)
 *  13 계산기 정적 설명 + noscript fallback 존재
 *  14 상담 폼 필드가 정적 감지 스켈레톤과 동기화
 *  15 사이트맵·메뉴·llms 등록 · 내부 링크 실재
 *  16 h1 1개 · 헤딩 계층 · 표 caption/th scope · id 중복 없음
 *  17 title·canonical 에 localhost·테스트 도메인이 없다
 *
 * 범위를 좁힌 부분
 *  사이트 전체 canonical·자기잠식·가격 일관성·FAQ 전수 패리티는 seo:audit:index ·
 *  seo:verify · seo:verify:pricing · seo:verify:faq 가 이미 담당한다. 복제하지 않는다.
 */
import { parse } from 'node-html-parser';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const args = process.argv.slice(2);
const OUT = args.find((a) => !a.startsWith('--')) || 'out';
const jsonIdx = args.indexOf('--json');
const JSON_PATH = jsonIdx >= 0 ? args[jsonIdx + 1] : null;

const DOMAIN = 'https://reumlab.com';
const PATHNAME = '/ai-voice-development/';
const FILE = 'ai-voice-development/index.html';

const fail = [];
const warn = [];
const info = [];
const add = (bucket, kind, msg) => bucket.push(`[${kind}] ${msg}`);

// ── 01. 파일·파싱 ────────────────────────────────────────────
const path = join(OUT, FILE);
if (!existsSync(path)) {
  console.error(`✖ ${path} 이 없습니다. 먼저 npm run build 를 실행하세요.`);
  process.exit(1);
}
const html = readFileSync(path, 'utf8');
const doc = parse(html, { comment: false });

const attr = (sel, name) => doc.querySelector(sel)?.getAttribute(name) ?? '';
const all = (sel) => doc.querySelectorAll(sel);
/** 화면에 실제로 보이는 텍스트 — script/style 을 먼저 걷어낸다(스키마 JSON 혼입 방지) */
const visible = (() => {
  const clone = parse(html, { comment: false });
  clone.querySelectorAll('script,style').forEach((n) => n.remove());
  return clone.textContent.replace(/\s+/g, ' ').trim();
})();

// ── 02. 메타 ─────────────────────────────────────────────────
const titles = all('title');
const descs = all('meta[name="description"]');
const canons = all('link[rel="canonical"]');
if (titles.length !== 1) add(fail, 'meta', `title 이 ${titles.length}개`);
if (descs.length !== 1) add(fail, 'meta', `description 이 ${descs.length}개`);
if (canons.length !== 1) add(fail, 'meta', `canonical 이 ${canons.length}개`);

const title = titles[0]?.textContent?.trim() ?? '';
const description = descs[0]?.getAttribute('content') ?? '';
const canonical = canons[0]?.getAttribute('href') ?? '';

if (!title.includes('AI 전화상담')) add(fail, 'meta', `title 에 주요 검색 의도가 없다: ${title}`);
if (!title.includes('름랩')) add(fail, 'meta', 'title 브랜드 자리에 대표 상호가 없다');
if (title.length > 70) add(warn, 'meta', `title 이 ${title.length}자 (검색결과에서 잘릴 수 있다)`);
if (description.length < 70 || description.length > 165) {
  add(warn, 'meta', `description 이 ${description.length}자 (70~165자 권장)`);
}
if (canonical !== `${DOMAIN}${PATHNAME}`) add(fail, 'meta', `canonical 이 기존 정규 URL 과 다르다: ${canonical}`);

// ── 03. OG·트위터·robots ────────────────────────────────────
for (const [sel, label] of [
  ['meta[property="og:type"]', 'og:type'],
  ['meta[property="og:locale"]', 'og:locale'],
  ['meta[property="og:site_name"]', 'og:site_name'],
  ['meta[property="og:url"]', 'og:url'],
  ['meta[property="og:title"]', 'og:title'],
  ['meta[property="og:description"]', 'og:description'],
  ['meta[property="og:image"]', 'og:image'],
]) {
  if (!doc.querySelector(sel)) add(fail, 'og', `${label} 누락`);
}
const ogUrl = attr('meta[property="og:url"]', 'content');
if (ogUrl && ogUrl !== canonical) add(fail, 'og', `og:url(${ogUrl}) 이 canonical 과 다르다`);
const ogImage = attr('meta[property="og:image"]', 'content');
if (ogImage.startsWith(DOMAIN)) {
  const rel = ogImage.slice(DOMAIN.length).replace(/^\//, '');
  if (!existsSync(join(OUT, rel))) add(fail, 'og', `og:image 파일이 산출물에 없다: ${rel}`);
}
if (all('meta[name="robots"]').length !== 1) add(fail, 'robots', 'robots meta 가 1개가 아니다');
const robots = attr('meta[name="robots"]', 'content');
if (/noindex/.test(robots)) add(fail, 'robots', `운영 페이지가 noindex 다: ${robots}`);

// ── 04~06. 구조화 데이터 ─────────────────────────────────────
const nodes = [];
for (const s of all('script[type="application/ld+json"]')) {
  const raw = s.textContent ?? '';
  // 안전 직렬화 — 원문에 닫는 태그나 줄 구분자가 그대로 있으면 문서가 깨진다
  if (/<\/script/i.test(raw)) add(fail, 'schema', 'ld+json 안에 </script 가 이스케이프되지 않았다');
  // 줄 구분자(U+2028/2029)는 소스에 리터럴로 두면 이 파일 자체가 깨진다 → 코드로 만든다
  const LINE_SEP = new RegExp('[\\u2028\\u2029]');
  if (LINE_SEP.test(raw)) add(fail, 'schema', 'ld+json 안에 U+2028/2029 가 이스케이프되지 않았다');
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    add(fail, 'schema', `ld+json 파싱 실패: ${e.message}`);
    continue;
  }
  const graph = parsed['@graph'] ?? [parsed];
  for (const n of graph) nodes.push(n);
}
const byType = (t) => nodes.filter((n) => n['@type'] === t);
const typeNames = [...new Set(nodes.map((n) => n['@type']))];

for (const t of ['WebPage', 'Service', 'BreadcrumbList', 'FAQPage']) {
  if (byType(t).length !== 1) add(fail, 'schema', `${t} 노드가 ${byType(t).length}개 (1개여야 한다)`);
}
const webpage = byType('WebPage')[0];
const service = byType('Service')[0];
if (webpage && webpage.url !== canonical) add(fail, 'schema', 'WebPage.url 이 canonical 과 다르다');
if (webpage && webpage['@id'] !== `${canonical}#webpage`) add(fail, 'schema', `WebPage @id 가 고정값과 다르다: ${webpage?.['@id']}`);
if (service && service.url !== canonical) add(fail, 'schema', 'Service.url 이 canonical 과 다르다');
if (webpage && service && webpage.mainEntity?.['@id'] !== service['@id']) {
  add(fail, 'schema', 'WebPage.mainEntity 가 Service 를 가리키지 않는다');
}
// 전역 엔티티는 참조만 하고 이 페이지에서 다시 정의하지 않는다
for (const t of ['WebSite', 'Organization', 'LocalBusiness']) {
  if (byType(t).length > 1) add(fail, 'schema', `전역 ${t} 가 ${byType(t).length}번 선언됐다`);
}
if (service && service.provider?.['@id'] !== `${DOMAIN}/#business`) {
  add(fail, 'schema', `Service.provider 가 사업체 @id 를 참조하지 않는다: ${JSON.stringify(service?.provider)}`);
}
// 화면에 없는 가격·평점·리뷰를 스키마로 주장하지 않는다
const SCHEMA_BANNED = ['offers', 'aggregateRating', 'review', 'award', 'priceRange'];
for (const n of nodes) {
  for (const key of SCHEMA_BANNED) {
    if (key in n) {
      // 사업체 노드의 priceRange 는 사이트 공통 자산이라 이 페이지 책임이 아니다
      if (key === 'priceRange' && n['@type'] === 'LocalBusiness') continue;
      add(fail, 'schema', `${n['@type']} 에 ${key} 가 있다 — 이 페이지는 전부 개별 견적이라 근거가 없다`);
    }
  }
}
const bc = byType('BreadcrumbList')[0];
const crumbs = bc?.itemListElement ?? [];
if (crumbs.length !== 3) add(fail, 'schema', `Breadcrumb 항목이 ${crumbs.length}개 (홈/AI 개발/현재 = 3)`);
for (const c of crumbs) {
  const url = c.item?.['@id'] ?? c.item;
  if (typeof url !== 'string' || !url.startsWith(DOMAIN)) continue;
  const rel = url.slice(DOMAIN.length).replace(/^\/|\/$/g, '');
  const target = rel ? join(OUT, rel, 'index.html') : join(OUT, 'index.html');
  if (!existsSync(target)) add(fail, 'schema', `Breadcrumb 대상이 실재하지 않는다: ${url}`);
}

// ── 07. FAQ 화면 ↔ 스키마 ───────────────────────────────────
const faqNode = byType('FAQPage')[0];
const schemaFaqs = (faqNode?.mainEntity ?? []).map((q) => ({
  q: String(q.name ?? '').trim(),
  a: String(q.acceptedAnswer?.text ?? '').trim(),
}));
const faqSection = doc.querySelector('#voice-faq');
const screenFaqs = (faqSection?.querySelectorAll('details') ?? []).map((d) => ({
  q: d.querySelector('summary')?.textContent?.trim() ?? '',
  a: d.querySelector('p')?.textContent?.trim() ?? '',
}));
if (schemaFaqs.length !== 16) add(fail, 'faq', `스키마 FAQ 가 ${schemaFaqs.length}개 (명세 16개)`);
if (screenFaqs.length !== schemaFaqs.length) {
  add(fail, 'faq', `화면 FAQ ${screenFaqs.length}개 ↔ 스키마 ${schemaFaqs.length}개 불일치`);
}
for (const f of schemaFaqs) {
  if (/<[a-z/]/i.test(f.a)) add(fail, 'faq', `acceptedAnswer 에 HTML 태그가 섞였다: ${f.q}`);
  if (!visible.includes(f.q)) add(fail, 'faq', `스키마에만 있고 화면에 없는 질문: ${f.q}`);
  if (f.a && !visible.includes(f.a.slice(0, 40))) add(fail, 'faq', `스키마에만 있고 화면에 없는 답변: ${f.q}`);
  if (f.a.length < 40) add(fail, 'faq', `답변이 ${f.a.length}자로 너무 짧다: ${f.q}`);
}

// ── 08. 업종 6종 · 전체 대본이 초기 HTML 에 ─────────────────
const INDUSTRY_LABELS = ['B2B·개발 문의', '학원', '병원·의원', '미용실·뷰티', '부동산', '고객센터'];
for (const label of INDUSTRY_LABELS) {
  if (!visible.includes(label)) add(fail, 'demo', `업종 "${label}" 이 초기 HTML 에 없다`);
}
const transcripts = doc.querySelectorAll('#voice-demo details');
if (transcripts.length !== 6) add(fail, 'demo', `정적 전체 대본이 ${transcripts.length}개 (업종 6종)`);
// 대사 총 48발화가 실제로 들어 있는지 — 데이터 원본과 대조한다
/*
  데이터 원본을 스크립트 위치 기준으로 찾는다.
  process.cwd() 를 쓰면 다른 디렉터리에서 실행할 때 import 가 조용히 실패하고,
  그러면 이 검사기의 핵심(대사 48개 전수 대조)이 통째로 건너뛰어진다.
  실제로 주입 시험에서 "대본 발화 삭제"가 이 경로 때문에 잡히지 않았다.
  → 경로를 고정하고, 불러오지 못하면 경고가 아니라 실패로 처리한다.
*/
const demoModule = await import(new URL('../lib/ai-voice-demo.ts', import.meta.url).href).catch((e) => {
  add(fail, 'demo', `lib/ai-voice-demo.ts 를 불러오지 못해 대사 전수 대조를 할 수 없다: ${e.message}`);
  return null;
});
if (demoModule) {
  const scenarios = demoModule.DEMO_SCENARIOS;
  const problems = demoModule.validateScenarios(scenarios);
  for (const p of problems) add(fail, 'demo', `데이터 무결성: ${p}`);
  let turnCount = 0;
  for (const s of scenarios) {
    if (!visible.includes(s.introduction)) add(fail, 'demo', `${s.id}: 업종 설명이 초기 HTML 에 없다`);
    if (!visible.includes(s.outcome.title)) add(fail, 'demo', `${s.id}: 결과 유형이 초기 HTML 에 없다`);
    if (!visible.includes(s.outcome.nextStep)) add(fail, 'demo', `${s.id}: 다음 행동이 초기 HTML 에 없다`);
    for (const t of s.turns) {
      turnCount++;
      if (!visible.includes(t.text)) add(fail, 'demo', `${t.id}: 대사가 초기 HTML 에 없다`);
    }
  }
  if (turnCount !== 48) add(fail, 'demo', `대본 총 발화가 ${turnCount}개 (부록 A 48개)`);
  info.push(`업종 ${scenarios.length}종 · 발화 ${turnCount}개 초기 HTML 확인`);

  // 폼 필드 이름의 단일 출처와 스켈레톤 대조 (아래 14번에서 쓴다)
}

// ── 09. 시뮬레이션 고지 ↔ 실제 문의 CTA 구분 ────────────────
const SIM_NOTICE = '가상 시나리오로 만든 화면 예시입니다. 실제 전화·음성 AI·예약·CRM 전송은 실행되지 않습니다.';
if (!visible.includes(SIM_NOTICE)) add(fail, 'truth', '데모 시뮬레이션 고지 문구가 없다');
if (!visible.includes('관리자 화면 구성 예시 · 실제 운영 데이터 아님')) {
  add(fail, 'truth', '관리자 예시 고지 문구가 없다');
}
if (!visible.includes('이 문의는 구축 가능성·범위 검토를 위한 상담 신청이며')) {
  add(fail, 'truth', '문의 섹션의 안심 문구가 없다');
}
// 실제 접수는 폼 하나뿐이다 — 데모가 폼처럼 보이면 안 된다
const forms = all('form');
if (forms.length !== 1) add(fail, 'form', `페이지에 form 이 ${forms.length}개 (실제 문의 폼 1개여야 한다)`);
// 가상 데모가 실제 통화처럼 보이는 배지를 쓰지 않는다
for (const bad of ['LIVE', '실시간 수신', '현재 통화 중', '통화 연결됨']) {
  if (visible.includes(bad)) add(fail, 'truth', `실제 통화처럼 보이는 표시가 있다: ${bad}`);
}

// ── 10. 업종별 업무 범위 표 ─────────────────────────────────
const scopeTable = doc.querySelector('#voice-scope table');
if (!scopeTable) add(fail, 'scope', '업종별 업무 범위 표가 없다');
else {
  const rows = scopeTable.querySelectorAll('tbody tr');
  if (rows.length !== 6) add(fail, 'scope', `업종 범위 표가 ${rows.length}행 (6개 업종)`);
  const head = scopeTable.querySelectorAll('thead th').map((th) => th.textContent.trim());
  for (const col of ['업종', '먼저 맡길 업무', '연동 후 검토할 업무', '사람이 맡을 업무']) {
    if (!head.includes(col)) add(fail, 'scope', `범위 표에 "${col}" 열이 없다`);
  }
}

// ── 11. 관리자 예시 — CSS 전용 + 상태 enum ──────────────────
const adminRadios = doc.querySelectorAll('#voice-admin input[type="radio"]');
const adminDetails = doc.querySelectorAll('#voice-admin article');
if (adminRadios.length !== 3) add(fail, 'admin', `관리자 예시 radio 가 ${adminRadios.length}개 (가상 상담 3건)`);
if (adminDetails.length !== 3) add(fail, 'admin', `관리자 예시 상세가 ${adminDetails.length}개`);
const VALID_STATUS = ['접수 예시', '추가 확인 필요', '담당자 처리 필요'];
for (const el of doc.querySelectorAll('[data-voice-status]')) {
  const v = el.getAttribute('data-voice-status');
  if (!VALID_STATUS.includes(v)) add(fail, 'admin', `상태 enum 이 유효하지 않다: ${v}`);
}
if (!visible.includes('미확인')) add(fail, 'admin', '확인하지 못한 항목 표시("미확인")가 없다');
/*
  없는 기능의 "버튼"을 만들지 않았는지 본다.
  본문 문자열 검색으로 하면 "로그인·수정 저장 기능은 이 페이지에 없습니다" 같은
  면책 문장이 그대로 걸린다(실제로 걸렸다). 그래서 텍스트가 아니라
  조작 가능한 요소(button/a/input)의 라벨만 검사한다.
*/
const ABSENT_FEATURES = ['녹취 다운로드', '녹취 파일', '로그인', '저장하기', '수정 저장', '회원가입'];
const adminSection = doc.querySelector('#voice-admin');
for (const el of adminSection?.querySelectorAll('button,a,input[type="submit"],input[type="button"]') ?? []) {
  const label = (el.textContent || el.getAttribute('value') || '').replace(/\s+/g, ' ').trim();
  for (const bad of ABSENT_FEATURES) {
    if (label.includes(bad)) add(fail, 'admin', `구현되지 않은 기능의 조작 요소가 있다: "${label}"`);
  }
}

// ── 12. 금지어 (면책 문장은 통과) ───────────────────────────
const BANNED = [
  /업계\s?1위/, /국내\s?1위/, /100%\s?(정확|자동|보장)/, /99\.9\s?%/,
  /단기간\s?(1위|상위)/, /무조건/, /완벽(한|히)\s?(보안|준수|처리)/,
  /직원\s?대체\s?보장/, /상담\s?90%\s?자동화/, /300ms/, /즉시\s?연동/,
  /모든\s?법령\s?준수/, /개인정보보호법\s?완벽/,
];
const DISCLAIMER = /(하지 않습니다|않으며|아닙니다|보장하지|약속하지|적합하지|쓰지 않|말하지|제안하지|표시하지|없습니다)/;
/*
  본문(<main>)만 본다 — GTM iframe title 이나 <title> 까지 한 덩어리로 들어오면
  어느 문장이 문제인지 보고서에서 읽을 수 없다(주입 시험에서 그렇게 나왔다).
  또 면책 문장은 통과시킨다 — "단기간 1위를 보장하지 않습니다" 는 정반대 문장이다.
*/
const mainEl = doc.querySelector('main');
const mainClone = parse(mainEl?.outerHTML ?? html, { comment: false });
mainClone.querySelectorAll('script,style').forEach((n) => n.remove());
const mainText = mainClone.textContent.replace(/\s+/g, ' ').trim();
for (const sentence of mainText.split(/(?<=[.!?])\s+|(?<=다\.)\s*|(?<=요\.)\s*/)) {
  const s = sentence.trim();
  if (!s || s.length > 200) continue; // 문장으로 안 갈라진 덩어리는 따로 잡지 않는다
  for (const re of BANNED) {
    if (re.test(s) && !DISCLAIMER.test(s)) add(fail, 'truth', `금지 표현: "${s.slice(0, 90)}"`);
  }
}
// 실적·고객사 수를 만들지 않았는지
if (/(도입\s?\d+\s?(개|곳|건)|고객사\s?\d+)/.test(visible)) {
  add(fail, 'truth', '검증되지 않은 도입 실적 수치가 있다');
}

// ── 13. 계산기 정적 설명 + noscript ─────────────────────────
if (!doc.querySelector('#voice-workload')) add(fail, 'calc', '계산기 섹션이 없다');
for (const phrase of ['월 전체 전화 건수 = 하루 전화 수 × 월 운영일', '순감소 추정시간 = 직접 응대 감소시간 − 사람 확인시간']) {
  if (!visible.includes(phrase)) add(fail, 'calc', `계산 원리가 정적 HTML 에 없다: ${phrase}`);
}
if (!visible.includes('실측 성과가 아니라 입력한')) add(fail, 'calc', '예시 가정 고지가 정적 HTML 에 없다');
if (!/설명을 위한 임의의 가정이며/.test(visible)) add(fail, 'calc', '기본값이 가정임을 알리는 문구가 없다');
if (!/인건비가 줄어든다는 뜻이 아닙니다/.test(visible)) add(fail, 'calc', '효과 오인 방지 문구가 없다');
const noscripts = all('noscript');
if (!noscripts.length) add(fail, 'nojs', 'noscript 블록이 없다');
const noscriptHtml = noscripts.map((n) => n.innerHTML).join(' ');
if (!/data-voice-demo-interactive/.test(noscriptHtml)) add(fail, 'nojs', 'JS 없을 때 데모 위젯을 감추는 처리가 없다');
if (!/data-voice-calc-interactive/.test(noscriptHtml)) add(fail, 'nojs', 'JS 없을 때 계산기를 감추는 처리가 없다');
if (!/tel:01081119370/.test(noscriptHtml)) add(fail, 'nojs', 'JS 없을 때의 검증된 연락 경로가 없다');

// ── 14. 폼 필드 ↔ 정적 감지 스켈레톤 ────────────────────────
const form = forms[0];
if (form) {
  if (form.getAttribute('name') !== 'main-apply') add(fail, 'form', `폼 이름이 main-apply 가 아니다: ${form.getAttribute('name')}`);
  if (form.querySelector('input[name="form-name"]')?.getAttribute('value') !== 'main-apply') {
    add(fail, 'form', 'hidden form-name 이 없거나 값이 다르다');
  }
  if (!form.querySelector('input[name="bot-field"]')) add(fail, 'form', '허니팟 bot-field 가 없다');
  if (form.getAttribute('data-netlify') !== 'true') add(fail, 'form', 'data-netlify 속성이 없다');

  const formFields = [...new Set(
    form.querySelectorAll('input,select,textarea').map((el) => el.getAttribute('name')).filter(Boolean),
  )];
  const skeletonPath = join(OUT, '__forms.html');
  if (!existsSync(skeletonPath)) add(fail, 'form', 'out/__forms.html 이 생성되지 않았다');
  else {
    const skel = parse(readFileSync(skeletonPath, 'utf8'));
    const mainApply = skel.querySelectorAll('form').find((f) => f.getAttribute('name') === 'main-apply');
    if (!mainApply) add(fail, 'form', '감지 스켈레톤에 main-apply 폼이 없다');
    else {
      const known = new Set(
        mainApply.querySelectorAll('input,select,textarea').map((el) => el.getAttribute('name')).filter(Boolean),
      );
      for (const f of formFields) {
        if (!known.has(f)) add(fail, 'form', `폼 필드 "${f}" 가 감지 스켈레톤에 없다 — 접수에서 버려질 수 있다`);
      }
    }
  }
  // 이번 고도화로 추가된 필드가 실제로 렌더됐는가
  for (const f of ['음성_업종', '음성_하루전화량', '음성_관심상품', '현재응대방식', '연동대상시스템']) {
    if (!formFields.includes(f)) add(fail, 'form', `ai-voice 필드가 렌더되지 않았다: ${f}`);
  }
  // 개인정보·민감정보를 요구하는 필드를 만들지 않았는가
  for (const bad of ['주민등록번호', '증상', '카드번호', '비밀번호', 'API키']) {
    if (formFields.some((f) => f.includes(bad))) add(fail, 'form', `민감정보 필드가 있다: ${bad}`);
  }
  // 개인정보 동의는 사전 체크되지 않아야 한다
  const consent = form.querySelector('input[name="개인정보동의"]');
  if (!consent) add(fail, 'form', '개인정보 동의 체크박스가 없다');
  else if (consent.hasAttribute('checked')) add(fail, 'form', '개인정보 동의가 사전 체크돼 있다');
  if (!doc.querySelector('a[href="/privacy/"]')) add(fail, 'form', '개인정보 처리방침 링크가 없다');
  info.push(`상담 폼 필드 ${formFields.length}개 (감지 스켈레톤 동기화 확인)`);
}

// CTA 가 폼 값을 제안하는 data-* 가 붙어 있는가
const pkgCtas = doc.querySelectorAll('[data-voice-package]');
if (pkgCtas.length !== 3) add(fail, 'form', `패키지 CTA 가 ${pkgCtas.length}개 (Starter/Business/Enterprise 3개)`);
for (const a of pkgCtas) {
  if (a.getAttribute('href') !== '#voice-inquiry') add(fail, 'form', '패키지 CTA 가 문의 앵커를 가리키지 않는다');
  if (!['starter', 'business', 'enterprise'].includes(a.getAttribute('data-voice-package'))) {
    add(fail, 'form', `패키지 CTA 값이 유효하지 않다: ${a.getAttribute('data-voice-package')}`);
  }
}

// ── 15. 등록·링크 ───────────────────────────────────────────
const sitemapDir = join(OUT, 'sitemap.xml');
if (existsSync(sitemapDir)) {
  const index = readFileSync(sitemapDir, 'utf8');
  const children = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  let found = 0;
  for (const child of children) {
    const rel = child.replace(DOMAIN + '/', '');
    const p = join(OUT, rel);
    if (!existsSync(p)) continue;
    const xml = readFileSync(p, 'utf8');
    found += [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].filter((m) => m[1] === canonical).length;
  }
  if (found !== 1) add(fail, 'sitemap', `사이트맵에 canonical 이 ${found}번 (정확히 1번이어야 한다)`);
}
const llms = join(OUT, 'llms.txt');
if (existsSync(llms) && !readFileSync(llms, 'utf8').includes(PATHNAME)) {
  add(fail, 'llms', 'llms.txt 에 이 페이지가 등록되지 않았다');
}
const homeHtml = join(OUT, 'index.html');
if (existsSync(homeHtml) && !readFileSync(homeHtml, 'utf8').includes(`href="${PATHNAME}"`)) {
  add(fail, 'menu', '홈 서비스 메뉴에 이 페이지 링크가 없다');
}
// 내부 링크 실재 확인
let internal = 0;
for (const a of all('a[href^="/"]')) {
  const href = a.getAttribute('href').split('#')[0];
  if (!href || href === '/') continue;
  internal++;
  const rel = href.replace(/^\/|\/$/g, '');
  if (!existsSync(join(OUT, rel, 'index.html')) && !existsSync(join(OUT, rel))) {
    add(fail, 'link', `내부 링크 대상이 없다: ${href}`);
  }
}
// 페이지 내 앵커가 실재하는가
const ids = all('[id]').map((el) => el.getAttribute('id'));
for (const a of all('a[href^="#"]')) {
  const id = a.getAttribute('href').slice(1);
  if (id && !ids.includes(id)) add(fail, 'link', `깨진 앵커: #${id}`);
}
for (const keep of ['voice-demo', 'voice-inquiry', 'voice-faq', 'voice-cost', 'voice-process', 'voice-related']) {
  if (!ids.includes(keep)) add(fail, 'link', `보존해야 할 앵커가 사라졌다: #${keep}`);
}

// ── 16. 문서 구조 ───────────────────────────────────────────
const h1s = all('h1');
if (h1s.length !== 1) add(fail, 'a11y', `h1 이 ${h1s.length}개`);
const dupIds = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dupIds.length) add(fail, 'a11y', `중복 id: ${[...new Set(dupIds)].join(', ')}`);
const sections = all('main section');
if (sections.length !== 14) add(fail, 'structure', `섹션이 ${sections.length}개 (명세 14개)`);
for (const s of sections) {
  const labelled = s.getAttribute('aria-labelledby');
  if (labelled && !ids.includes(labelled)) add(fail, 'a11y', `aria-labelledby 대상이 없다: ${labelled}`);
}
for (const table of all('table')) {
  if (!table.querySelector('caption')) add(fail, 'a11y', '표에 caption 이 없다');
  for (const th of table.querySelectorAll('th')) {
    if (!th.getAttribute('scope')) add(fail, 'a11y', `th 에 scope 가 없다: ${th.textContent.trim().slice(0, 20)}`);
  }
}
// 라벨 없는 입력이 없는가
for (const input of all('input,select,textarea')) {
  const type = input.getAttribute('type');
  if (type === 'hidden') continue;
  const id = input.getAttribute('id');
  const hasLabel =
    (id && doc.querySelector(`label[for="${id}"]`)) ||
    input.parentNode?.tagName === 'LABEL' ||
    input.getAttribute('aria-label');
  if (!hasLabel) add(fail, 'a11y', `라벨 없는 입력: name=${input.getAttribute('name')}`);
}

// ── 17. 잘못된 도메인 ───────────────────────────────────────
for (const bad of ['localhost', '127.0.0.1', 'netlify.app', 'example.com', 'vercel.app']) {
  if (title.includes(bad) || canonical.includes(bad)) add(fail, 'meta', `title/canonical 에 ${bad} 가 들어 있다`);
  if (ogUrl.includes(bad)) add(fail, 'og', `og:url 에 ${bad} 가 들어 있다`);
}

// ── 보고 ────────────────────────────────────────────────────
console.log('\nAI 전화상담 직원 구축 페이지 회귀 검사 (out/ai-voice-development/)');
console.log('────────────────────────────────────────────────────');
console.log(`  title        ${title}`);
console.log(`  description  1개(${description.length}자) · canonical ${canonical}`);
console.log(`  robots       ${robots} · og:url ${ogUrl}`);
console.log(`  ld+json      블록 ${all('script[type="application/ld+json"]').length} · 노드 ${nodes.length} (${typeNames.join(',')})`);
console.log(`  가격 표기    스키마 offers 없음 (전부 개별 견적)`);
console.log(`  FAQ          화면 ${screenFaqs.length}개 ↔ 스키마 ${schemaFaqs.length}개`);
for (const line of info) console.log(`  데모/폼      ${line}`);
console.log(`  구조         섹션 ${sections.length} · h1 ${h1s.length} · 표 ${all('table').length} · id ${ids.length} · 내부 링크 ${internal}`);
console.log(`  상호작용     관리자 radio ${adminRadios.length} · 패키지 CTA ${pkgCtas.length} · 정적 대본 ${transcripts.length}`);
console.log('────────────────────────────────────────────────────');

if (JSON_PATH) {
  mkdirSync(dirname(JSON_PATH), { recursive: true });
  writeFileSync(JSON_PATH, JSON.stringify({ title, description, canonical, robots, fail, warn, info }, null, 2));
}

if (warn.length) {
  console.log(`\n⚠ 경고 ${warn.length}건`);
  for (const w of warn) console.log(`  ${w}`);
}
if (fail.length) {
  console.error(`\n✖ 실패 ${fail.length}건`);
  for (const f of fail) console.error(`  ${f}`);
  process.exit(1);
}
console.log('\n✓ AI 전화상담 페이지 검사 통과 — 메타·스키마·FAQ·데모 진실성·폼·접근성 이상 없음');
