/**
 * 전환 경로·측정 정합 검증 (빌드 후 실행, 프로덕션 런타임 코드 아님)
 *
 *   npm run seo:verify:conversion
 *   node scripts/verify-conversion.mjs [outDir]
 *
 * 검사 항목
 *   1. Analytics 중복 설치 — 한 페이지에서 GTM·GA4·픽셀이 두 번 실행되는가
 *   2. 네이버 공통 스크립트 — 전환추적 공통 스크립트를 모든 색인 페이지가 부르는가
 *   3. CTA 존재 — 상업 의도가 강한 페이지에 다음 행동 수단이 있는가
 *   4. CTA 목적지 — tel/mailto 형식, 내부 링크 404, 리다이렉트 대상 여부
 *   5. 내부 UTM — 내부 링크에 utm_* 를 붙여 acquisition 을 덮어쓰고 있지 않은가
 *   6. 전환 정확도(소스 정적 분석) — 제출 클릭이 아니라 서버 성공 이후에만 전환이 나가는가
 *   7. 중복 발화 — 한 번의 성공에서 같은 이벤트가 두 번 나가지 않는가
 *   8. PII — 이벤트 파라미터 이름에 개인정보성 키가 섞이지 않았는가
 *   9. 페이지 컨텍스트 — 정적 문서가 page_type 을 선언하는가
 *  10. Netlify Forms — 정적 감지 스키마와 모든 동일 이름 폼의 필드가 일치하고 제출이 그 스켈레톤을 향하는가
 *
 * 한계: 정적 검사다. 실제 브라우저에서 무엇이 전송되는지까지 보장하지 못한다.
 *       개인정보 미전송을 이 스크립트만으로 "보장"한다고 말할 수 없다.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const OUT = process.argv[2] || 'out';
const fail = [];
const warn = [];
const add = (a, kind, msg) => a.push(`[${kind}] ${msg}`);
const read = (p) => readFileSync(p, 'utf8');

// ─── 페이지 수집
const pages = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (e === 'index.html') {
      const html = read(p);
      pages.push({
        pathname: '/' + relative(OUT, p).replace(/\\/g, '/').replace(/index\.html$/, ''),
        html,
        noindex: /<meta name="robots" content="[^"]*noindex/i.test(html),
      });
    }
  }
})(OUT);
const indexed = pages.filter((p) => !p.noindex);

// ─── 1. Analytics 중복 설치
// 주의: Next 의 <Script> 는 preload link 와 RSC 페이로드에도 URL 을 남긴다.
// 실제 "실행"되는 것만 세려면 <script src=…> 태그와 인라인 초기화만 본다.
let dupGtm = 0, dupGa = 0, dupPixel = 0, gtmWithDirectGa = 0;
for (const p of indexed) {
  const gtmInit = (p.html.match(/'gtm\.start'/g) || []).length;
  const gaSrc = (p.html.match(/<script[^>]+src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=/g) || []).length;
  const gaConfig = (p.html.match(/gtag\('config'/g) || []).length;
  const pixelInit = (p.html.match(/fbq\('init'/g) || []).length;
  if (gtmInit > 1) { dupGtm++; add(fail, 'dup-analytics', `GTM 컨테이너 ${gtmInit}회 초기화: ${p.pathname}`); }
  if (gaSrc > 1 || gaConfig > 1) { dupGa++; add(fail, 'dup-analytics', `GA4 ${Math.max(gaSrc, gaConfig)}회 로드/설정: ${p.pathname}`); }
  if (pixelInit > 1) { dupPixel++; add(fail, 'dup-analytics', `Meta 픽셀 ${pixelInit}회 init: ${p.pathname}`); }
  if (gtmInit && (gaSrc || gaConfig)) {
    gtmWithDirectGa++;
    add(fail, 'dup-analytics', `GTM과 직접 GA4가 함께 설치됨: ${p.pathname}`);
  }
}

// ─── 2. 네이버 공통 스크립트
// 네이버 전환추적은 "공통 스크립트를 모든 페이지에" 넣는 것이 전제다. 한 페이지라도 빠지면
// 그 페이지로 들어온 광고 클릭(inflow)이 기록되지 않아 전환이 광고에 붙지 않는다.
// 정적 문서는 <script src>, Next 라우트는 next/script 가 남기는 참조라 태그 모양이 다르다 —
// 실행 여부까지는 정적 검사로 알 수 없으므로 "파일을 참조하는가"까지만 본다.
let noNaverWcs = 0;
for (const p of indexed) {
  if (!p.html.includes('/naver-wcs.js')) {
    noNaverWcs++;
    add(fail, 'naver-wcs', `네이버 공통 스크립트 미설치: ${p.pathname}`);
  }
}

// ─── 3~4. CTA 존재와 목적지
const NO_CTA_NEEDED = /^\/(privacy|terms|refund)\/$/;
let noCta = 0, badTel = 0, brokenCta = 0;
const telPattern = /^tel:\+?[0-9]+$/;
for (const p of indexed) {
  const body = (p.html.match(/<body[\s\S]*<\/body>/) || [''])[0];
  const tel = [...body.matchAll(/<a\b[^>]*\shref="(tel:[^"]*)"/g)].map((m) => m[1]);
  const mail = [...body.matchAll(/<a\b[^>]*\shref="(mailto:[^"]*)"/g)].map((m) => m[1]);
  const kakao = [...body.matchAll(/<a\b[^>]*\shref="(https?:\/\/[^"]*kakao[^"]*)"/g)].map((m) => m[1]);
  const hasForm = /data-netlify="true"/.test(p.html);

  if (!NO_CTA_NEEDED.test(p.pathname) && !tel.length && !mail.length && !kakao.length && !hasForm) {
    noCta++;
    add(fail, 'cta', `다음 행동 수단이 없음(전화·이메일·카카오·폼): ${p.pathname}`);
  }
  for (const t of tel) {
    if (!telPattern.test(t)) { badTel++; add(fail, 'cta', `tel: 형식 오류 ${t} — ${p.pathname}`); }
  }
  // 내부 CTA 목적지가 실제로 존재하는가 (앵커·외부 링크 제외)
  for (const m of body.matchAll(/<a\b[^>]*\sdata-(?:analytics|cta)[^>]*\shref="(\/[^"#?]*)"/g)) {
    const to = m[1];
    const f = join(OUT, to.replace(/^\//, ''), 'index.html');
    if (!existsSync(f) && !existsSync(join(OUT, to.replace(/^\//, '')))) {
      brokenCta++;
      add(fail, 'cta', `CTA 목적지 없음: ${to} (출처 ${p.pathname})`);
    }
  }
}

// ─── 5. 내부 UTM
let internalUtm = 0;
for (const p of pages) {
  const body = (p.html.match(/<body[\s\S]*<\/body>/) || [''])[0];
  for (const m of body.matchAll(/<a\b[^>]*\shref="(\/[^"]*utm_[^"]*)"/g)) {
    internalUtm++;
    add(fail, 'utm', `내부 링크에 UTM — acquisition 을 덮어쓴다: ${m[1]} (출처 ${p.pathname})`);
  }
}

// ─── 6~8. 소스 정적 분석 (전환 정확도·PII)
const FORM_SOURCES = [
  'components/LandingInquiryForm.tsx',
  'app/soho/SohoForm.tsx',
  'script.js',
];
const PII_KEYS = ['이름', '이메일', '연락처', '휴대폰번호', '회사', '문의내용', '핵심기능', '참고서비스'];

/** 주석을 걷어낸다 — 문서 주석에 적힌 이벤트 이름을 실제 호출로 오인하지 않기 위해 */
function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

/**
 * 이벤트가 "실제로 전송되는 지점"만 찾는다.
 * 세 가지 표기를 모두 인식한다.
 *   pushEvent(EVENT.lead, …)        ← TS 폼 (lib/analytics.ts 상수)
 *   pushDL({ event: "generate_lead" …})  ← 정적 script.js
 *   dataLayer.push({ event: '…' })
 * once("key", …) 의 첫 인자처럼 키로만 쓰인 문자열은 세지 않는다.
 */
const EVENT_ALIAS = {
  generate_lead: ['EVENT.lead'],
  form_error: ['EVENT.formError'],
  inquiry_form_start: ['EVENT.formStart'],
  form_submit_success: [],
};
function firePositions(src, name) {
  const pos = [];
  for (const m of src.matchAll(new RegExp(`event:\\s*["'\`]${name}["'\`]`, 'g'))) pos.push(m.index);
  for (const alias of EVENT_ALIAS[name] || []) {
    for (const m of src.matchAll(new RegExp(`pushEvent\\(\\s*${alias.replace('.', '\\.')}`, 'g'))) pos.push(m.index);
  }
  return pos.sort((a, b) => a - b);
}

let badOrder = 0, dupFire = 0, piiHits = 0;
for (const f of FORM_SOURCES) {
  if (!existsSync(f)) { add(fail, 'source', `파일 없음: ${f}`); continue; }
  const raw = read(f);
  const src = stripComments(raw);

  // (a) 성공 이벤트가 서버 성공 확인(res.ok) 이후에 나오는가
  const okIdx = src.search(/!res\.ok/);
  if (okIdx === -1) add(fail, 'conversion', `${f}: 서버 성공 확인(res.ok)이 없다`);
  for (const name of ['generate_lead', 'form_submit_success']) {
    const pos = firePositions(src, name);
    if (!pos.length) { add(fail, 'conversion', `${f}: ${name} 전송 지점이 없음`); continue; }
    if (okIdx !== -1 && pos[0] < okIdx) {
      badOrder++;
      add(fail, 'conversion', `${f}: ${name} 가 res.ok 확인보다 먼저 전송된다 — 실패도 전환으로 집계됨`);
    }
    if (pos.length > 1) {
      dupFire++;
      add(fail, 'conversion', `${f}: ${name} 전송 지점 ${pos.length}곳 — 한 번의 성공에서 중복 발화`);
    }
  }

  // (b) form_start 는 전송 지점이 1곳이고 1회 가드를 가져야 한다
  const startPos = firePositions(src, 'inquiry_form_start');
  if (startPos.length > 1) {
    dupFire++;
    add(fail, 'conversion', `${f}: inquiry_form_start 전송 지점 ${startPos.length}곳`);
  }
  if (startPos.length && !/(started|fired\[|once\()/.test(src)) {
    add(fail, 'conversion', `${f}: inquiry_form_start 에 1회 가드가 없다`);
  }

  // (c) 실패 진단 이벤트
  if (!firePositions(src, 'form_error').length) {
    add(fail, 'conversion', `${f}: form_error 진단 이벤트가 없다`);
  }

  // (d) 이벤트 전송 줄에 개인정보 필드명이 섞이지 않았는가
  for (const line of src.split('\n')) {
    if (!/dataLayer|pushEvent|pushDL|gtag\(/.test(line)) continue;
    for (const k of PII_KEYS) {
      if (line.includes(k)) {
        piiHits++;
        add(fail, 'pii', `${f}: 이벤트 전송 줄에 개인정보 필드명("${k}") — ${line.trim().slice(0, 70)}`);
      }
    }
  }
}

// ─── 9. 정적 문서의 page_type 선언
let noCtx = 0;
for (const f of ['index.html', 'erp/index.html', 'mvp/index.html', 'website/index.html']) {
  const p = join(OUT, f);
  if (!existsSync(p)) continue;
  if (!/<body[^>]*data-page-type="/.test(read(p))) {
    noCtx++;
    add(fail, 'context', `정적 문서가 page_type 을 선언하지 않음: /${f.replace(/\\/g, '/').replace(/index\.html$/, '')}`);
  }
}

// ─── 10. Netlify Forms 정적 감지 스키마·제출 엔드포인트
let formSchemaIssues = 0;
const skeletonPath = 'public/__forms.html';
if (!existsSync(skeletonPath)) {
  formSchemaIssues++;
  add(fail, 'forms', `Netlify 감지용 정적 폼 없음: ${skeletonPath}`);
} else {
  const skeleton = read(skeletonPath);
  for (const formName of ['main-apply', 'soho-diagnosis']) {
    const form = skeleton.match(new RegExp(`<form[^>]+name=["']${formName}["'][\\s\\S]*?<\\/form>`, 'i'))?.[0] || '';
    if (!form) {
      formSchemaIssues++;
      add(fail, 'forms', `${skeletonPath}: ${formName} 폼을 찾을 수 없음`);
      continue;
    }
    for (const field of ['최초_유입_페이지', '유입_채널']) {
      if (!new RegExp(`name=["']${field}["']`).test(form)) {
        formSchemaIssues++;
        add(fail, 'forms', `${skeletonPath}: ${formName} 스키마에 ${field} 필드 없음`);
      }
    }
  }
}
for (const f of FORM_SOURCES) {
  if (!existsSync(f)) continue;
  if (!/fetch\(\s*["']\/__forms\.html["']/.test(stripComments(read(f)))) {
    formSchemaIssues++;
    add(fail, 'forms', `${f}: Netlify 감지 스켈레톤(/__forms.html)으로 제출하지 않음`);
  }
}

// 같은 `main-apply` 이름을 쓰는 페이지가 많다. Netlify 배포 파서가 먼저 본 축약형
// 스키마를 채택할 수 있으므로 모든 변형에 필드명이 빠짐없이 있어야 한다.
const requiredMainFields = [
  '유입_랜딩', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid',
  '유입_경로', '페이지_유형', '관심_서비스축', '유입_출처', '최초_유입_페이지', '유입_채널',
  '이름', '휴대폰번호', '이메일', '서비스유형', '핵심기능', '예상예산', '희망일정', '참고서비스', '개인정보동의',
];
for (const p of pages) {
  const forms = [...p.html.matchAll(/<form[^>]+name=["']main-apply["'][\s\S]*?<\/form>/gi)];
  for (const match of forms) {
    for (const field of requiredMainFields) {
      if (!new RegExp(`name=["']${field}["']`).test(match[0])) {
        formSchemaIssues++;
        add(fail, 'forms', `${p.pathname}: main-apply 스키마에 ${field} 필드 없음`);
      }
    }
  }
}

// ─── 참고 집계
const withForm = indexed.filter((p) => /data-netlify="true"/.test(p.html)).length;
const tagged = indexed.filter((p) => /data-(analytics|cta)=/.test(p.html)).length;

console.log(`색인 페이지 ${indexed.length} · 문의폼 보유 ${withForm} · CTA 태깅 보유 ${tagged}`);
console.log(`Analytics  중복 GTM ${dupGtm} · 중복 GA4 ${dupGa} · 중복 픽셀 ${dupPixel} · GTM+직접 GA4 ${gtmWithDirectGa}`);
console.log(`네이버     공통 스크립트 미설치 ${noNaverWcs}`);
console.log(`CTA        수단 없는 페이지 ${noCta} · tel 형식 오류 ${badTel} · 목적지 없음 ${brokenCta}`);
console.log(`UTM        내부 링크 UTM ${internalUtm}`);
console.log(`전환       성공 이전 발화 ${badOrder} · 중복 발화 ${dupFire}`);
console.log(`PII        이벤트 전송부 개인정보 필드명 ${piiHits}`);
console.log(`컨텍스트   page_type 미선언 정적 문서 ${noCtx}`);
console.log(`Forms      정적 스키마·제출 엔드포인트 문제 ${formSchemaIssues}`);
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
console.log('✓ 전환 검증 통과 — 중복 설치·네이버 공통 스크립트·CTA·목적지·내부 UTM·전환 시점·PII 이상 없음');
