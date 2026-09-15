/**
 * public/fonts/subset.json 의 unicode-range 를 모든 @font-face 선언부에 반영한다.
 * (수동 실행 — build-font-subsets.py 를 다시 돌린 뒤 한 번)
 *
 *   node scripts/apply-font-subset-css.mjs [--check]
 *
 * @font-face 가 CSS 3곳 + 정적 HTML 8곳에 흩어져 있어서, 손으로 고치면 반드시
 * 어딘가 하나가 옛 선언으로 남는다. 여기서 한 번에 맞추고, --check 로 대조한다.
 *
 * 두 face 모두 unicode-range 를 명시한다:
 *   1) 서브셋(222KB)  — 실제 사용 글자
 *   2) 원본(2.0MB)    — 폰트 cmap 에서 서브셋을 뺀 나머지
 * 합집합이 원본 cmap 과 같으므로 어떤 글자도 폴백 글꼴로 떨어지지 않는다.
 *
 * 원본 쪽 range 를 생략하면 안 된다. range 없는 face 는 '모든 문자'의 후보라,
 * 페이지에 폰트가 갖고 있지도 않은 이모지(📞 ✕ 💬)가 하나만 있어도 브라우저가
 * 2.0MB 를 받아 확인한 뒤 폴백한다(실측으로 확인했다).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const META = JSON.parse(readFileSync('public/fonts/subset.json', 'utf8'));
const RANGE = META.unicode_range;
const REST_RANGE = META.rest_unicode_range;
const ORIG = '/fonts/PretendardVariable-1.3.9.woff2';
const SUB = `/fonts/${META.subset}`;
const CHECK = process.argv.includes('--check');

const TARGETS = [
  'app/globals.css', 'styles.css', 'reum.css',
  'privacy.html', 'terms.html', 'refund.html', 'vvip/index.html',
  'public/privacy/index.html', 'public/terms/index.html', 'public/refund/index.html',
  'public/assets/admin-guide-example.html',
];

const MARK_START = '/* reumlab:font-face:start */';
const MARK_END = '/* reumlab:font-face:end */';

function block(indent, pretty) {
  const nl = pretty ? `\n${indent}` : '';
  const pad = pretty ? `\n${indent}  ` : '';
  const face = (src, range) =>
    `@font-face {${pad}font-family: 'Pretendard';${pad}src: url('${src}') format('woff2-variations');` +
    `${pad}font-style: normal;${pad}font-weight: 45 920;${pad}font-display: swap;` +
    (range ? `${pad}unicode-range: ${range};` : '') + `${nl}}`;
  // 순서가 핵심이다. 같은 family·같은 굵기에서 범위가 겹치면 **나중 선언이 이긴다**.
  // 원본을 먼저, 서브셋을 나중에 둬야 흔한 글자가 222KB 쪽으로 간다.
  // (반대로 두면 전 페이지가 2.0MB 를 받는다 — 실제로 한 번 그렇게 만들었다가 잡았다.)
  return [
    `${MARK_START}`,
    `/* 1) 원본 ${(META.source_bytes / 1024 / 1024).toFixed(1)}MB · 범위는 폰트 cmap 전체(${META.font_glyphs}자).`,
    `   서브셋에 없는 글자(희귀 한글·한자 등)일 때만 실제로 내려받는다.`,
    `   범위를 비우면 폰트에 있지도 않은 이모지(📞 ✕ 💬) 하나 때문에 2MB 를 받는다(실측 확인). */`,
    face(ORIG, REST_RANGE),
    `/* 2) 실제 사용 글자 서브셋 ${(META.subset_bytes / 1024).toFixed(0)}KB · ${META.glyphs}자.`,
    `   나중 선언이라 범위 안 글자는 전부 이쪽으로 간다 — 평소 받는 건 이 파일뿐이다. */`,
    face(SUB, RANGE),
    `${MARK_END}`,
  ].join(`\n${indent}`);
}

// 기존 Pretendard @font-face 선언 1개(또는 이전에 넣은 블록)를 통째로 찾는다
const EXISTING = new RegExp(
  `(?:${MARK_START.replace(/[*/]/g, '\\$&')}[\\s\\S]*?${MARK_END.replace(/[*/]/g, '\\$&')})` +
  `|(?:@font-face\\s*\\{[^}]*Pretendard[^}]*\\})`,
  'g',
);

let changed = 0, missing = 0, stale = 0;
for (const file of TARGETS) {
  if (!existsSync(file)) { console.log(`  ? ${file} 없음`); missing++; continue; }
  const src = readFileSync(file, 'utf8');
  const hits = src.match(EXISTING);
  if (!hits) { console.log(`  ✖ ${file}: Pretendard @font-face 를 찾지 못함`); missing++; continue; }
  // 첫 선언의 들여쓰기를 따른다
  const idx = src.indexOf(hits[0]);
  const lineStart = src.lastIndexOf('\n', idx) + 1;
  const indent = src.slice(lineStart, idx).match(/^[ \t]*/)[0];
  const pretty = file.endsWith('.css') || /\n\s{2,}@font-face/.test(src);
  let out = src, first = true;
  out = out.replace(EXISTING, (m) => (first ? ((first = false), block(indent, pretty)) : ''));
  if (out === src) { console.log(`  = ${file} 변경 없음`); continue; }
  if (CHECK) { console.log(`  ✖ ${file}: 선언이 최신이 아님`); stale++; continue; }
  writeFileSync(file, out);
  console.log(`  ✓ ${file} (선언 ${hits.length}개 → 2개)`);
  changed++;
}
console.log(CHECK
  ? (stale || missing ? `\n✖ 최신이 아닌 파일 ${stale}개 / 못 찾은 파일 ${missing}개` : '\n✓ 모든 @font-face 선언이 최신')
  : `\n✓ ${changed}개 파일 갱신 (못 찾음 ${missing}개)`);
process.exitCode = (CHECK && (stale || missing)) || (!CHECK && missing) ? 1 : 0;
