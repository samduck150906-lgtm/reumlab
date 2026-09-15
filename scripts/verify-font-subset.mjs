/**
 * 폰트 서브셋 회귀 게이트 (빌드 후 실행)
 *
 *   npm run seo:verify:font
 *   node scripts/verify-font-subset.mjs [outDir]
 *
 * 왜 필요한가
 *  본문에 서브셋 밖 글자가 하나만 새로 들어가도 그 페이지는 2.0MB 원본을 다시
 *  내려받는다. 화면은 멀쩡해서 사람 눈에는 안 보이고, LCP 만 조용히 5초 늘어난다.
 *  (실제로 textarea placeholder 의 '옴' 한 글자 때문에 한 페이지가 그랬다.)
 *
 * 무엇을 보나
 *  1) out/ 의 화면 글자(본문 + 보이는 속성값 + CSS content) 를 전부 모은다
 *  2) CSS 의 서브셋 unicode-range 와 대조해, 범위 밖 글자가 쓰인 페이지를 찾는다
 *  3) @font-face 선언 11곳이 서로 같은 파일·같은 range 를 가리키는지 확인한다
 *
 * 범위 밖 글자가 폰트에 아예 없는 문자(이모지 등)면 문제가 아니다 — 원래부터
 * 폴백으로 그려지고, 두 face 의 range 어디에도 없어서 다운로드를 유발하지 않는다.
 * 그래서 "폰트가 가진 글자인데 서브셋 밖" 인 경우만 실패로 잡는다.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const OUT = process.argv.find((a) => !a.startsWith('--') && a !== process.argv[0] && a !== process.argv[1]) || 'out';
const META_PATH = 'public/fonts/subset.json';
const fail = [];

if (!existsSync(OUT)) {
  console.error(`${OUT}/ 이 없습니다. 먼저 npm run build 를 실행하세요.`);
  process.exit(1);
}
if (!existsSync(META_PATH)) {
  console.error(`${META_PATH} 이 없습니다. python3 scripts/build-font-subsets.py 를 먼저 실행하세요.`);
  process.exit(1);
}
const META = JSON.parse(readFileSync(META_PATH, 'utf8'));

/** "U+0020-007E, U+00A0" → 코드포인트 Set */
function parseRange(str) {
  const set = new Set();
  for (const part of str.split(',')) {
    const m = part.trim().match(/^U\+([0-9A-Fa-f]{1,6})(?:-([0-9A-Fa-f]{1,6}))?$/);
    if (!m) { fail.push(`[range] 해석할 수 없는 unicode-range 조각: ${part.trim()}`); continue; }
    const a = parseInt(m[1], 16);
    const b = m[2] ? parseInt(m[2], 16) : a;
    for (let c = a; c <= b; c++) set.add(c);
  }
  return set;
}
const SUBSET = parseRange(META.unicode_range);
const REST = parseRange(META.rest_unicode_range);
const FONT_HAS = new Set([...SUBSET, ...REST]);

// ── 1) out/ 화면 글자 수집 ────────────────────────────────────────
const SKIP_TAGS = /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi;
const TAGS = /<[^>]+>/g;
const VISIBLE_ATTRS = /\b(?:placeholder|alt|title|aria-label|aria-description|label|value)\s*=\s*"([^"]*)"/g;
const CSS_CONTENT = /content\s*:\s*(['"])([\s\S]*?)\1/g;
const unescapeHtml = (s) => s
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&amp;/g, '&');
const unescapeCss = (s) => s.replace(/\\([0-9a-fA-F]{1,6})\s?/g, (_, h) => String.fromCodePoint(parseInt(h, 16)));

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (['.html', '.css', '.txt', '.xml'].includes(extname(p))) out.push(p);
  }
  return out;
}

/** 서브셋 밖 글자 → 그 글자를 쓰는 파일 (최대 3개) */
const offenders = new Map();
let files = 0;
for (const file of walk(OUT)) {
  files++;
  const raw = readFileSync(file, 'utf8');
  const pieces = [];
  if (extname(file) !== '.css') {
    pieces.push(unescapeHtml(raw.replace(SKIP_TAGS, ' ').replace(TAGS, ' ')));
    for (const m of raw.matchAll(VISIBLE_ATTRS)) pieces.push(unescapeHtml(m[1]));
  }
  for (const m of raw.matchAll(CSS_CONTENT)) pieces.push(unescapeCss(m[2]));
  for (const text of pieces) {
    for (const ch of text) {
      const c = ch.codePointAt(0);
      if (c <= 0x20) continue;
      if (!FONT_HAS.has(c)) continue;   // 폰트에 없는 문자(이모지 등)는 다운로드를 유발하지 않는다
      if (SUBSET.has(c)) continue;
      const rel = file.slice(OUT.length + 1);
      const list = offenders.get(ch) || [];
      if (list.length < 3 && !list.includes(rel)) list.push(rel);
      offenders.set(ch, list);
    }
  }
}

// ── 2) @font-face 선언 11곳 동기화 ────────────────────────────────
const DECL_FILES = [
  'app/globals.css', 'styles.css', 'reum.css',
  'privacy.html', 'terms.html', 'refund.html', 'vvip/index.html',
  'public/privacy/index.html', 'public/terms/index.html', 'public/refund/index.html',
  'public/assets/admin-guide-example.html',
];
let declOk = 0;
for (const f of DECL_FILES) {
  if (!existsSync(f)) { fail.push(`[decl] ${f} 없음`); continue; }
  const s = readFileSync(f, 'utf8');
  if (!s.includes(META.subset)) { fail.push(`[decl] ${f}: 서브셋 파일(${META.subset}) 참조 없음`); continue; }
  if (!s.includes(META.unicode_range)) { fail.push(`[decl] ${f}: 서브셋 unicode-range 가 subset.json 과 다름`); continue; }
  if (!s.includes(META.rest_unicode_range)) { fail.push(`[decl] ${f}: 나머지 unicode-range 가 subset.json 과 다름`); continue; }
  declOk++;
}

// ── 3) 산출물에 폰트 파일이 실제로 있는지 ─────────────────────────
for (const f of [META.subset, META.source]) {
  const p = join(OUT, 'fonts', f);
  if (!existsSync(p)) fail.push(`[file] ${p} 없음 — CSS 가 가리키는 폰트가 배포되지 않는다`);
}

if (offenders.size) {
  for (const [ch, where] of offenders) {
    fail.push(`[subset] '${ch}' (U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}) 가 서브셋 밖 — ` +
      `이 글자가 있는 페이지는 ${(META.source_bytes / 1024 / 1024).toFixed(1)}MB 원본을 추가로 받는다: ${where.join(', ')}`);
  }
  fail.push('[subset] 해결: npm run build 후 `python3 scripts/build-font-subsets.py && node scripts/apply-font-subset-css.mjs` 를 다시 실행하고 커밋하세요.');
}

const line = '─'.repeat(52);
console.log(`\n폰트 서브셋 검사 (${OUT}/)`);
console.log(line);
console.log(`  서브셋   ${META.subset}  ${(META.subset_bytes / 1024).toFixed(0)}KB · ${META.glyphs}자`);
console.log(`  원본     ${META.source}  ${(META.source_bytes / 1024 / 1024).toFixed(1)}MB · 폰트 전체 ${META.font_glyphs}자`);
console.log(`  검사      산출물 ${files.toLocaleString('ko-KR')}개 · @font-face 선언 ${declOk}/${DECL_FILES.length}곳 동기화`);
console.log(line);

if (fail.length) {
  console.error(`\n✖ 실패 ${fail.length}건`);
  fail.forEach((f) => console.error('  ' + f));
  process.exitCode = 1;
} else {
  console.log('\n✓ 폰트 서브셋 검사 통과 — 서브셋 밖 글자 0, 선언 동기화 정상');
}
