/**
 * 보호 manifest 전/후 비교 — 이번 변경이 만든 손실만 FAIL 로 표시한다.
 *
 *   node tools/home-redesign/diff-manifest.mjs <before.json> <after.json> [--out diff.json]
 *
 * 마스터 프롬프트 9절의 정규화 규칙을 따른다.
 *  · 텍스트는 줄바꿈·연속 공백만 정규화(추출 단계에서 이미 적용).
 *  · 숫자·부호·금액·조사·항목 순서는 무시하지 않는다.
 *  · 링크는 집합이 아니라 영역별 개수까지 비교한다.
 *  · JSON key 순서는 무시하되 값과 배열 순서는 보존한다.
 *  · preview/local origin 보정은 여기(검사 도구) 안에서만 한다.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const [beforePath, afterPath] = process.argv.slice(2);
const outPath = process.argv.includes('--out') ? process.argv[process.argv.indexOf('--out') + 1] : null;
if (!beforePath || !afterPath) {
  console.error('사용법: node tools/home-redesign/diff-manifest.mjs <before.json> <after.json> [--out diff.json]');
  process.exit(1);
}
const A = JSON.parse(readFileSync(beforePath, 'utf8'));
const B = JSON.parse(readFileSync(afterPath, 'utf8'));

const results = [];
const add = (status, area, detail, extra) => results.push({ status, area, detail, ...(extra ? { extra } : {}) });

const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function cmp(area, a, b, { describe = (x) => x } = {}) {
  if (eq(a, b)) { add('PASS', area, '동일'); return true; }
  add('FAIL', area, '변경됨', { before: describe(a), after: describe(b) });
  return false;
}

/* --------------------------------------------------------- 1. 메타 */
for (const key of ['title', 'lang', 'charset', 'viewport', 'canonical', 'robots']) {
  cmp(`head.${key}`, A.head[key], B.head[key]);
}
{
  const keys = [...new Set([...Object.keys(A.head.meta), ...Object.keys(B.head.meta)])].sort();
  const changed = keys.filter((k) => !eq(A.head.meta[k], B.head.meta[k]));
  if (changed.length === 0) add('PASS', 'head.meta (전체)', `${keys.length}개 필드 동일`);
  for (const k of changed) add('FAIL', `head.meta[${k}]`, '변경됨', { before: A.head.meta[k] ?? null, after: B.head.meta[k] ?? null });
}
cmp('head.linkRels', A.head.linkRels, B.head.linkRels);

/* -------------------------------------------------- 2. 구조화 데이터 */
cmp('jsonLd', A.jsonLd, B.jsonLd, { describe: (x) => `${x.length}개 블록` });

/* -------------------------------------------------------- 3. 헤딩 */
cmp('headings (텍스트·레벨·순서)', A.headings, B.headings, { describe: (x) => `${x.length}개` });

/* ------------------------------------------------- 4. 섹션 순서·앵커 */
cmp('anchors (id 목록·순서)', A.anchors, B.anchors, { describe: (x) => x.map((y) => y.id).join(',') });
{
  const shape = (m) => m.sections.map((s) => ({ tag: s.tag, id: s.id, headings: s.headings, textSha256: s.textSha256 }));
  cmp('sections (순서·id·헤딩·본문해시)', shape(A), shape(B), { describe: (x) => x.map((s) => `${s.tag}#${s.id}`).join(' > ') });
}

/* --------------------------------------------------- 5. 링크·영역별 */
cmp('links (href·문구·rel·target·data-cta, 순서 포함)', A.links, B.links, { describe: (x) => `${x.length}개` });
cmp('linkCountByArea', A.linkCountByArea, B.linkCountByArea);
cmp('linkCountTotal', A.linkCountTotal, B.linkCountTotal);

/* ------------------------------------------------------- 6. 이미지 */
cmp('images (src·alt·크기·loading)', A.images, B.images, { describe: (x) => `${x.length}개` });
cmp('media (video/source·poster)', A.media, B.media);
cmp('figcaptions', A.figcaptions, B.figcaptions);

/* --------------------------------------------------------- 7. 로고 */
cmp('logos (마크업·참조·문구)', A.logos, B.logos, { describe: (x) => x.map((l) => `${l.area}:${l.text}`).join(' | ') });

/* ------------------------------------------------- 8. 폼·버튼·계측 */
cmp('forms (필드·이름·required·옵션·라벨)', A.forms, B.forms);
cmp('buttons (문구·role·aria·data)', A.buttons, B.buttons, { describe: (x) => `${x.length}개` });
cmp('analyticsHooks (data-cta/loc/전체 data-*)', A.analyticsHooks, B.analyticsHooks);

/* ----------------------------------------------- 9. 표·FAQ·가격·본문 */
cmp('tables (비교표 값·행·열)', A.tables, B.tables);
cmp('faq (질문·답변·순서)', A.faq, B.faq, { describe: (x) => `${x.length}개` });
cmp('prices (금액·기간·포함·제외·CTA)', A.prices, B.prices, { describe: (x) => x.map((p) => `${p.name}=${p.amount}`).join(' | ') });
cmp('noscriptText', A.noscriptText, B.noscriptText);
cmp('textBlocks (DOM 읽기 순서 그대로의 본문)', A.textBlocks, B.textBlocks, { describe: (x) => `${x.length}블록` });
cmp('fullTextSha256', A.fullTextSha256, B.fullTextSha256);

/* ------------------------------------------ 본문 차이가 있으면 상세 */
if (A.fullTextSha256 !== B.fullTextSha256) {
  const a = A.textBlocks, b = B.textBlocks;
  const setA = new Set(a), setB = new Set(b);
  const removed = a.filter((x) => !setB.has(x));
  const added = b.filter((x) => !setA.has(x));
  add(removed.length ? 'FAIL' : 'PASS', '본문 블록 사라짐', `${removed.length}개`, removed.slice(0, 40));
  add(added.length ? 'FAIL' : 'PASS', '본문 블록 새로 생김', `${added.length}개`, added.slice(0, 40));
  if (!removed.length && !added.length) add('FAIL', '본문 블록 순서', '내용은 같지만 순서가 다름');
}

const fails = results.filter((r) => r.status === 'FAIL');
const summary = {
  before: A.label, after: B.label,
  total: results.length, pass: results.length - fails.length, fail: fails.length,
  verdict: fails.length ? 'FAIL' : 'PASS',
};
const out = { summary, results };
if (outPath) writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');

console.log(`\n보호 항목 diff: ${summary.pass}/${summary.total} PASS · ${summary.fail} FAIL  → ${summary.verdict}`);
for (const r of results) {
  const mark = r.status === 'PASS' ? '✓' : '✖';
  console.log(`  ${mark} ${r.area} — ${r.detail}`);
  if (r.status === 'FAIL' && r.extra) {
    const s = JSON.stringify(r.extra, null, 1);
    console.log(`      ${s.length > 1600 ? s.slice(0, 1600) + ' …(생략)' : s}`);
  }
}
if (outPath) console.log(`\n기계 판독용: ${outPath}`);
process.exit(fails.length ? 1 : 0);
