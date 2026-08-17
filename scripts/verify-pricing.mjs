/**
 * 가격 회귀 검사 — 빌드 결과물(out/**.html)에 과거 가격이 남아 있는지 전수 검사한다.
 *
 * 왜 스크립트인가
 *  가격은 index.html · lib/*.ts · content/*.json · 컴포넌트 네 군데에서 문장 안에 녹아 있다.
 *  타입 시스템으로는 "문장 속 숫자"를 강제할 수 없어서, 실제로 배포되는 HTML 을 훑는
 *  방식이 유일하게 믿을 수 있는 검사다. (docs/SEO_GEO_감사_2026-07.md — 홈과 나머지
 *  965개 페이지의 가격이 정확히 2배 어긋난 채로 배포됐던 사고의 재발 방지선)
 *
 * 검사 항목
 *  1) 폐기된 가격(RETIRED_PRICES)이 어느 HTML 에도 없을 것
 *  2) 소상공인 프로모션가(49만원)는 /soho/ 밖에서 쓰이지 않을 것
 *  3) 홈(index.html)의 정액 패키지 금액이 lib/pricing.ts 와 일치할 것
 *  4) 앱/웹 진입가 문구("580만 원부터"·"98만 원부터")가 서로 어긋나지 않을 것
 *
 * 사용: npm run seo:verify:pricing (빌드 후)
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'out';
if (!fs.existsSync(OUT)) {
  console.error('out/ 이 없습니다. 먼저 npm run build 를 실행하세요.');
  process.exit(1);
}

// lib/pricing.ts 를 파싱해 기준값을 읽는다(빌드 산출물에 의존하지 않기 위해 정규식 파싱).
const src = fs.readFileSync('lib/pricing.ts', 'utf8');
const PACKAGES = [...src.matchAll(/\{\s*name:\s*'([^']+)',\s*line:\s*'(web|app)',\s*price:\s*([\d_]+)/g)].map((m) => ({
  name: m[1],
  line: m[2],
  price: Number(m[3].replace(/_/g, '')),
}));
const RETIRED = [...src.matchAll(/\{\s*text:\s*'([^']+)',\s*note:\s*'([^']+)'\s*\}/g)].map((m) => ({ text: m[1], note: m[2] }));
if (!PACKAGES.length || !RETIRED.length) {
  console.error('lib/pricing.ts 파싱 실패 — 표 형식이 바뀌었는지 확인하세요.');
  process.exit(1);
}

const webFrom = Math.min(...PACKAGES.filter((p) => p.line === 'web').map((p) => p.price));
const appFrom = Math.min(...PACKAGES.filter((p) => p.line === 'app').map((p) => p.price));
const man = (won) => (won / 10000 >= 1000 ? (won / 10000).toLocaleString('en-US') : String(won / 10000));

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) files.push(p);
  }
})(OUT);

const urlOf = (f) => '/' + path.relative(OUT, f).replace(/index\.html$/, '').replace(/\\/g, '/');
const errors = [];
const warn = [];

// ── 1) 폐기 가격 ──
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  for (const r of RETIRED) {
    if (html.includes(r.text)) errors.push(`[폐기가격] ${urlOf(f)} — "${r.text}" (${r.note})`);
  }
}

// ── 2) 소상공인 프로모션가 격리 ──
const SOHO_ONLY = ['490,000', '49만'];
for (const f of files) {
  const url = urlOf(f);
  if (url.startsWith('/soho')) continue;
  const html = fs.readFileSync(f, 'utf8');
  for (const t of SOHO_ONLY) {
    if (html.includes(t)) errors.push(`[프로모션가 유출] ${url} — "${t}" 는 /soho/ 전용 표기`);
  }
}

// ── 3) 홈 요금표 대조 ──
const home = fs.existsSync(path.join(OUT, 'index.html')) ? fs.readFileSync(path.join(OUT, 'index.html'), 'utf8') : '';
for (const p of PACKAGES) {
  const amount = p.price.toLocaleString('en-US');
  if (!home.includes(p.name)) {
    warn.push(`[홈 요금표] "${p.name}" 카드가 홈에 없습니다`);
    continue;
  }
  if (!home.includes(amount)) {
    errors.push(`[홈 요금표] "${p.name}" 금액 ${amount} 이 홈(index.html)에 없습니다 — lib/pricing.ts 와 불일치`);
  }
}

// ── 4) 진입가 문구 일관성 ──
// "앱 ___만 원부터" / "웹 ___만 원부터" 로 등장하는 모든 금액이 기준 진입가와 같아야 한다.
const entryRe = /(앱|웹)\s*(?:MVP\s*)?([\d,]+)만\s?원부터/g;
const expect = { 앱: man(appFrom), 웹: man(webFrom) };
for (const f of files) {
  const url = urlOf(f);
  const html = fs.readFileSync(f, 'utf8').replace(/<script[\s\S]*?<\/script>/gi, '');
  for (const m of html.matchAll(entryRe)) {
    const [, line, value] = m;
    if (value.replace(/,/g, '') !== expect[line].replace(/,/g, '')) {
      errors.push(`[진입가 불일치] ${url} — "${line} ${value}만 원부터" (기준 ${expect[line]}만 원)`);
    }
  }
}

// ── 5) 배포되지 않는 콘텐츠 자산도 검사 ──
// GBP(구글 비즈니스 프로필) 붙여넣기용 데이터는 out/ 에 들어가지 않지만, 사람이 복사해
// 검색 표면(GBP 상품·게시물)에 그대로 올린다. 여기 남은 구가격은 사이트와 어긋난 금액이
// 검색결과에 다시 뜨는 경로가 된다 — 소스 단계에서 함께 막는다.
const CONTENT_ASSETS = ['content/gbp.json', 'content/gbp/gbp-content.json', 'content/gbp/GBP-PASTE-GUIDE.md'];
for (const f of CONTENT_ASSETS) {
  if (!fs.existsSync(f)) continue;
  const txt = fs.readFileSync(f, 'utf8');
  for (const r of RETIRED) {
    if (txt.includes(r.text)) errors.push(`[폐기가격/콘텐츠자산] ${f} — "${r.text}" (${r.note})`);
  }
}

// ── 결과 ──
const uniq = [...new Set(errors)];
console.log(`가격 검사: HTML ${files.length}개 · 패키지 ${PACKAGES.length}종 · 폐기가격 ${RETIRED.length}종`);
console.log(`기준 진입가 — 웹 ${man(webFrom)}만 원 / 앱 ${man(appFrom)}만 원`);
for (const w of [...new Set(warn)]) console.log('  경고:', w);
if (uniq.length) {
  console.error(`\n✖ 가격 불일치 ${uniq.length}건`);
  for (const e of uniq.slice(0, 40)) console.error('  ' + e);
  if (uniq.length > 40) console.error(`  … 외 ${uniq.length - 40}건`);
  process.exit(1);
}
console.log('✓ 가격 일관성 통과 — 폐기가격 0건, 프로모션가 격리 정상, 홈 요금표 일치');
