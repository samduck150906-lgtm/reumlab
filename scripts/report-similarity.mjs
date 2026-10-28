/**
 * 사이트 전체 유사문서 보고 (빌드 후 실행)
 *
 *   npm run seo:report:similarity
 *   node scripts/report-similarity.mjs [outDir] [--threshold 0.5] [--json 경로]
 *
 * scripts/verify-near-duplicate.mjs 가 묶음(업종 홈페이지 등) 안에서만 재는 것과 달리, 색인 대상 HTML 전부를
 * 서로 비교한다(3,200여 페이지 ≈ 510만 쌍). 전부를 정확히 재면 느리므로
 *   1) 페이지마다 <main> 본문(스크립트·스타일·태그 제외, h1 의 대상명 가림)의 5어절 슁글 집합을 만들고
 *   2) MinHash 128개로 Jaccard 를 추정해 추정치 ≥ (임계 − 0.15) 인 후보 쌍만 고른 뒤
 *   3) 후보 쌍은 정확한 Jaccard 를 다시 계산한다.
 * 결과: 묶음(첫 경로 조각)별 평균·최대, 임계 이상 쌍 목록(묶음 안·묶음 사이), 가장 비슷한 쌍 상위 목록.
 * 네이버 유사문서 판정 기준은 공개돼 있지 않다 — 여기서는 0.5 이상을 "묶일 위험", 0.35~0.5 를 "주시" 로 본다.
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const OUT = args.find((a) => !a.startsWith('--')) || 'out';
const THRESHOLD = Number(args[args.indexOf('--threshold') + 1]) || 0.5;
const JSON_OUT = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;
const WATCH = Math.max(0.3, THRESHOLD - 0.15);
const K = 128;

function walk(dir, base = dir, out = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, base, out);
    else if (p.endsWith('.html')) out.push(p.slice(base.length + 1));
  }
  return out;
}
const unescape = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&nbsp;/g, ' ');
function mainText(html) {
  const main = (html.match(/<main\b[\s\S]*?<\/main>/i) || [html])[0];
  const h1 = unescape((main.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || [, ''])[1].replace(/<[^>]+>/g, ' ')).trim();
  let text = unescape(main.replace(/<(script|style|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
  const name = h1.replace(/\s*(홈페이지 제작|앱 개발|앱개발|솔루션|AI 자동화|개발 비용|홈페이지|관리 프로그램|플랫폼 개발|현장 관리 앱|AI 개발).*$/, '').trim();
  if (name.length >= 2 && name.length <= 20) text = text.split(name).join('■');
  return text;
}
function shingles(text, k = 5) {
  const w = text.split(/\s+/).filter(Boolean);
  const set = new Set();
  for (let i = 0; i + k <= w.length; i++) set.add(w.slice(i, i + k).join(' '));
  return set;
}
// FNV-1a 32bit + K 개의 선형 해시 (a*h + b) mod 2^32
function fnv(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h >>> 0; }
const A = [], B = [];
let seed = 20261028;
const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed; };
for (let i = 0; i < K; i++) { A.push((rnd() | 1) >>> 0); B.push(rnd()); }
function minhash(set) {
  const sig = new Uint32Array(K).fill(0xffffffff);
  for (const s of set) {
    const h = fnv(s);
    for (let i = 0; i < K; i++) { const v = (Math.imul(A[i], h) + B[i]) >>> 0; if (v < sig[i]) sig[i] = v; }
  }
  return sig;
}
function jaccard(a, b) { let inter = 0; for (const x of a) if (b.has(x)) inter++; return inter / (a.size + b.size - inter || 1); }

if (!existsSync(OUT)) { console.error(`${OUT}/ 이 없습니다.`); process.exit(1); }
const t0 = Date.now();
const pages = [];
for (const f of walk(OUT)) {
  const html = readFileSync(join(OUT, f), 'utf8');
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue;
  if (!/<link rel="canonical"/.test(html)) continue;
  const set = shingles(mainText(html));
  if (set.size < 20) continue;
  const family = f.includes('/') ? f.split('/')[0] : '(root)';
  pages.push({ f, family, set, sig: minhash(set) });
}
console.log(`\n사이트 전체 유사문서 보고 (${OUT}/) — 색인 대상 ${pages.length}p · 5어절 슁글 · MinHash ${K} · 임계 ${THRESHOLD} · ${((Date.now() - t0) / 1000).toFixed(0)}s 준비`);

// 후보 쌍 — 추정 Jaccard ≥ WATCH
const cand = [];
for (let i = 0; i < pages.length; i++) {
  const si = pages[i].sig;
  for (let j = i + 1; j < pages.length; j++) {
    const sj = pages[j].sig;
    let eq = 0;
    for (let k = 0; k < K; k++) if (si[k] === sj[k]) eq++;
    if (eq / K >= WATCH) cand.push([i, j]);
  }
}
const exact = cand.map(([i, j]) => ({ a: pages[i], b: pages[j], v: jaccard(pages[i].set, pages[j].set) })).filter((x) => x.v >= WATCH).sort((x, y) => y.v - x.v);
const risky = exact.filter((x) => x.v >= THRESHOLD);

// 묶음별 요약 — 후보에서 평균은 못 내므로(전수 아님) 묶음 안 전수 평균은 묶음 크기 ≤ 400 일 때만 정확히 낸다
const byFamily = new Map();
for (const p of pages) byFamily.set(p.family, [...(byFamily.get(p.family) || []), p]);
console.log('─'.repeat(78));
console.log('묶음'.padEnd(22) + '페이지'.padStart(6) + '  평균 Jaccard(묶음 안)  ≥임계 쌍(묶음 안)  ≥임계 쌍(묶음 밖)');
const famRows = [];
for (const [fam, list] of [...byFamily].sort((x, y) => y[1].length - x[1].length)) {
  let avg = null;
  if (list.length >= 2 && list.length <= 400) {
    let s = 0, n = 0;
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) { s += jaccard(list[i].set, list[j].set); n++; }
    avg = s / n;
  }
  const inFam = risky.filter((x) => x.a.family === fam && x.b.family === fam).length;
  const outFam = risky.filter((x) => (x.a.family === fam) !== (x.b.family === fam)).length;
  famRows.push({ family: fam, pages: list.length, avg, riskyIn: inFam, riskyOut: outFam });
  console.log(fam.padEnd(22) + String(list.length).padStart(6) + '  ' + (avg === null ? '(전수 생략)'.padEnd(20) : avg.toFixed(3).padEnd(20)) + String(inFam).padStart(10) + String(outFam).padStart(16));
}
console.log('─'.repeat(78));
console.log(`임계 ${THRESHOLD} 이상 쌍: ${risky.length} · 주시(${WATCH}~${THRESHOLD}) 쌍: ${exact.length - risky.length}`);
const involved = new Set(risky.flatMap((x) => [x.a.f, x.b.f]));
console.log(`임계 이상 쌍에 들어간 페이지: ${involved.size} / ${pages.length}`);
console.log('\n가장 비슷한 쌍 상위 25');
for (const x of exact.slice(0, 25)) console.log(`  ${x.v.toFixed(2)}  /${x.a.f.replace(/index\.html$/, '')}  ↔  /${x.b.f.replace(/index\.html$/, '')}`);
if (JSON_OUT) {
  writeFileSync(JSON_OUT, JSON.stringify({ pages: pages.length, threshold: THRESHOLD, families: famRows, risky: risky.map((x) => ({ a: x.a.f, b: x.b.f, jaccard: +x.v.toFixed(3) })), watch: exact.filter((x) => x.v < THRESHOLD).map((x) => ({ a: x.a.f, b: x.b.f, jaccard: +x.v.toFixed(3) })) }, null, 1));
  console.log(`\n전체 목록: ${JSON_OUT}`);
}
console.log(`\n${((Date.now() - t0) / 1000).toFixed(0)}s`);
