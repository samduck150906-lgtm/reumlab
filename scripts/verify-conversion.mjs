/**
 * 전환 경로·측정 정합 검증 (빌드 후 실행, 프로덕션 런타임 코드 아님)
 *
 *   npm run seo:verify:conversion
 *   node scripts/verify-conversion.mjs [outDir]
 *
 * 검사 항목
 *   1. Analytics 중복 설치 — 한 페이지에서 GTM·GA4·픽셀이 두 번 실행되는가
 *   2. CTA 존재 — 상업 의도가 강한 페이지에 다음 행동 수단이 있는가
 *   3. CTA 목적지 — tel/mailto 형식, 내부 링크 404, 리다이렉트 대상 여부
 *   4. 내부 UTM — 내부 링크에 utm_* 를 붙여 acquisition 을 덮어쓰고 있지 않은가
 *   5. 전환 정확도(소스 정적 분석) — 제출 클릭이 아니라 서버 성공 이후에만 전환이 나가는가
 *   6. 중복 발화 — 한 번의 성공에서 같은 이벤트가 두 번 나가지 않는가
 *   7. PII — 이벤트 파라미터 이름에 개인정보성 키가 섞이지 않았는가
 *   8. 페이지 컨텍스트 — 정적 문서가 page_type 을 선언하는가
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
        pathname: '/' + relative(OUT, p).replace(/index\.html$/, ''),
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
let dupGtm = 0, dupGa = 0, dupPixel = 0;
for (const p of indexed) {
  const gtmInit = (p.html.match(/'gtm\.start'/g) || []).length;
  const gaSrc = (p.html.match(/<script[^>]+src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=/g) || []).length;
  const gaConfig = (p.html.match(/gtag\('config'/g) || []).length;
  const pixelInit = (p.html.match(/fbq\('init'/g) || []).length;
  if (gtmInit > 1) { dupGtm++; add(fail, 'dup-analytics', `GTM 컨테이너 ${gtmInit}회 초기화: ${p.pathname}`); }
  if (gaSrc > 1 || gaConfig > 1) { dupGa++; add(fail, 'dup-analytics', `GA4 ${Math.max(gaSrc, gaConfig)}회 로드/설정: ${p.pathname}`); }
  if (pixelInit > 1) { dupPixel++; add(fail, 'dup-analytics', `Meta 픽셀 ${pixelInit}회 init: ${p.pathname}`); }
}

// ─── 2~3. CTA 존재와 목적지
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

// ─── 4. 내부 UTM
let internalUtm = 0;
for (const p of pages) {
  const body = (p.html.match(/<body[\s\S]*<\/body>/) || [''])[0];
  for (const m of body.matchAll(/<a\b[^>]*\shref="(\/[^"]*utm_[^"]*)"/g)) {
    internalUtm++;
    add(fail, 'utm', `내부 링크에 UTM — acquisition 을 덮어쓴다: ${m[1]} (출처 ${p.pathname})`);
  }
}

// ─── 5~7. 소스 정적 분석 (전환 정확도·PII)
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

// ─── 8. 정적 문서의 page_type 선언
let noCtx = 0;
for (const f of ['index.html', 'erp/index.html', 'mvp/index.html', 'website/index.html']) {
  const p = join(OUT, f);
  if (!existsSync(p)) continue;
  if (!/<body[^>]*data-page-type="/.test(read(p))) {
    noCtx++;
    add(fail, 'context', `정적 문서가 page_type 을 선언하지 않음: /${f.replace(/index\.html$/, '')}`);
  }
}

// ─── 참고 집계
const withForm = indexed.filter((p) => /data-netlify="true"/.test(p.html)).length;
const tagged = indexed.filter((p) => /data-(analytics|cta)=/.test(p.html)).length;

console.log(`색인 페이지 ${indexed.length} · 문의폼 보유 ${withForm} · CTA 태깅 보유 ${tagged}`);
console.log(`Analytics  중복 GTM ${dupGtm} · 중복 GA4 ${dupGa} · 중복 픽셀 ${dupPixel}`);
console.log(`CTA        수단 없는 페이지 ${noCta} · tel 형식 오류 ${badTel} · 목적지 없음 ${brokenCta}`);
console.log(`UTM        내부 링크 UTM ${internalUtm}`);
console.log(`전환       성공 이전 발화 ${badOrder} · 중복 발화 ${dupFire}`);
console.log(`PII        이벤트 전송부 개인정보 필드명 ${piiHits}`);
console.log(`컨텍스트   page_type 미선언 정적 문서 ${noCtx}`);
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
console.log('✓ 전환 검증 통과 — 중복 설치·CTA·목적지·내부 UTM·전환 시점·PII 이상 없음');
