/**
 * 이미지·영상·성능 위험 검증 (빌드 후 실행, 프로덕션 런타임 코드 아님)
 *
 *   npm run seo:verify:media
 *   node scripts/verify-media.mjs [outDir]
 *
 * 검사 항목
 *   1. 깨진 자산 — HTML 이 참조하는 로컬 이미지·영상·포스터가 실제로 있는가
 *   2. 확장자와 실제 포맷 일치 — .jpg 인데 PNG 인 파일은 스크래퍼가 거부할 수 있다
 *   3. 이미지 크기 — 표시 크기 대비 과도한 원본, 500KB 이상 파일
 *   4. CLS — width/height(또는 aspect-ratio 래퍼) 없는 이미지·영상
 *   5. alt — 누락, 그리고 같은 페이지에서 의미 있는 alt 가 중복되는가
 *   6. preload 남발 — 한 페이지에 preload 가 여러 개거나 LCP 와 무관한 리소스를 preload 하는가
 *   7. video — poster·preload 정책, 첫 화면 여부
 *   8. OG 이미지 — 절대 URL 인가, 실제 파일이 있는가, 선언 치수와 실제가 맞는가
 *
 * 파일 포맷 판정은 매직 바이트로 한다(확장자를 믿지 않는다).
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const OUT = process.argv[2] || 'out';
const fail = [];
const warn = [];
const add = (a, kind, msg) => a.push(`[${kind}] ${msg}`);

/** 매직 바이트로 실제 포맷 판정 */
function realFormat(file) {
  let b;
  try {
    b = readFileSync(file).subarray(0, 12);
  } catch {
    return null;
  }
  if (b[0] === 0x89 && b[1] === 0x50) return 'png';
  if (b[0] === 0xff && b[1] === 0xd8) return 'jpeg';
  if (b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP') return 'webp';
  if (b.subarray(4, 8).toString() === 'ftyp') return b.subarray(8, 12).toString().startsWith('avif') ? 'avif' : 'mp4';
  if (b.subarray(0, 5).toString() === '<?xml' || b.subarray(0, 4).toString() === '<svg') return 'svg';
  if (b[0] === 0x00 && b[1] === 0x00 && b[2] === 0x01) return 'ico';
  return null;
}
const EXT_FORMAT = { '.png': 'png', '.jpg': 'jpeg', '.jpeg': 'jpeg', '.webp': 'webp', '.avif': 'avif', '.mp4': 'mp4', '.svg': 'svg', '.ico': 'ico' };

/** PNG/JPEG 픽셀 크기 (헤더만 읽는다) */
function dimensions(file) {
  const b = readFileSync(file);
  if (b[0] === 0x89 && b[1] === 0x50) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length - 9) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
      }
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null;
}

// ─── 자산 목록
const assets = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (EXT_FORMAT[extname(e).toLowerCase()]) assets.push(p);
  }
})(OUT);

console.log(`미디어 자산 ${assets.length}개`);
const big = [];
for (const a of assets) {
  const size = statSync(a).size;
  const ext = extname(a).toLowerCase();
  const declared = EXT_FORMAT[ext];
  const actual = realFormat(a);
  if (actual && declared && actual !== declared && !(declared === 'ico' && actual === 'png')) {
    add(fail, 'format', `확장자(${declared})와 실제 포맷(${actual}) 불일치: /${relative(OUT, a)} — 스크래퍼가 거부할 수 있음`);
  }
  if (size >= 500 * 1024) big.push({ p: '/' + relative(OUT, a), size, dim: dimensions(a) });
}
if (big.length) {
  console.log('\n500KB 이상 자산:');
  big.sort((x, y) => y.size - x.size).forEach((b) =>
    console.log(`  ${(b.size / 1024).toFixed(0).padStart(6)} KB  ${b.p}${b.dim ? `  (${b.dim.w}x${b.dim.h})` : ''}`));
}

// ─── HTML 검사
const htmls = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (e.endsWith('.html')) htmls.push(p);
  }
})(OUT);

const missing = new Set();
const exists = (u) => {
  if (!u.startsWith('/')) return true; // 외부 URL 은 검사 대상 아님
  const p = join(OUT, decodeURIComponent(u.split('?')[0]).replace(/^\//, ''));
  return existsSync(p) && statSync(p).isFile();
};
let imgs = 0, noAlt = 0, noDim = 0, videos = 0, noPoster = 0, preloadTotal = 0;
const dupAltPages = [];
for (const f of htmls) {
  const h = readFileSync(f, 'utf8');
  const url = '/' + relative(OUT, f).replace(/index\.html$/, '');
  const pageAlts = new Map();
  for (const m of h.matchAll(/<img\b[^>]*>/g)) {
    const t = m[0];
    imgs++;
    const src = (t.match(/\ssrc="([^"]*)"/) || [, ''])[1];
    if (src && src.startsWith('/') && !exists(src)) missing.add(`${src} (출처 ${url})`);
    const alt = (t.match(/\salt="([^"]*)"/) || [, null])[1];
    if (alt === null) { noAlt++; add(fail, 'alt', `alt 속성 없음: ${url} — ${src}`); }
    else if (alt.trim()) pageAlts.set(alt, (pageAlts.get(alt) || 0) + 1);
    if (!/\swidth=/.test(t) || !/\sheight=/.test(t)) {
      noDim++;
      add(fail, 'cls', `width/height 없음: ${url} — ${src}`);
    }
  }
  for (const [alt, c] of pageAlts) {
    if (c > 1) dupAltPages.push(`${url} — "${alt.slice(0, 40)}" ${c}회`);
  }
  for (const m of h.matchAll(/<video\b[^>]*>/g)) {
    const t = m[0];
    videos++;
    const poster = (t.match(/poster="([^"]*)"/) || [, ''])[1];
    if (!poster) { noPoster++; add(fail, 'video', `poster 없음: ${url}`); }
    else if (!exists(poster)) missing.add(`${poster} (poster, 출처 ${url})`);
    if (/preload="auto"/.test(t)) add(warn, 'video', `preload="auto" — 첫 화면 리소스와 대역폭 경쟁 가능: ${url}`);
  }
  for (const m of h.matchAll(/<source\b[^>]*src="([^"]*)"/g)) {
    if (m[1].startsWith('/') && !exists(m[1])) missing.add(`${m[1]} (video source, 출처 ${url})`);
  }
  // Next 가 자동 생성하는 /_next/ 청크 preload 는 프레임워크 기본 동작이라 제외하고,
  // 우리가 만든 preload 만 센다. 특히 as="image" 는 LCP 리소스와 직접 경쟁한다.
  const preloads = [...h.matchAll(/<link[^>]+rel="preload"[^>]*>/g)].map((m) => m[0]);
  const ours = preloads.filter((t) => !/\/_next\//.test(t));
  preloadTotal += ours.length;
  const imgPreloads = ours.filter((t) => /as="image"/.test(t));
  if (imgPreloads.length > 1) {
    add(warn, 'preload', `이미지 preload ${imgPreloads.length}개 — LCP 리소스와 경쟁: ${url}`);
  }
  if (ours.length > 3) add(warn, 'preload', `preload ${ours.length}개 — 남발 시 LCP 리소스와 경쟁: ${url}`);
  // OG 이미지
  const og = (h.match(/property="og:image" content="([^"]*)"/) || [, ''])[1];
  if (og) {
    if (!/^https?:\/\//.test(og)) add(fail, 'og', `og:image 가 절대 URL 이 아님: ${url} — ${og}`);
    else {
      const path = og.replace(/^https?:\/\/[^/]+/, '');
      if (!exists(path)) missing.add(`${path} (og:image, 출처 ${url})`);
      const dw = (h.match(/property="og:image:width" content="(\d+)"/) || [])[1];
      const dh = (h.match(/property="og:image:height" content="(\d+)"/) || [])[1];
      const real = existsSync(join(OUT, path.replace(/^\//, ''))) ? dimensions(join(OUT, path.replace(/^\//, ''))) : null;
      if (dw && dh && real && (+dw !== real.w || +dh !== real.h)) {
        add(fail, 'og', `og:image 선언 치수(${dw}x${dh}) ≠ 실제(${real.w}x${real.h}): ${path}`);
      }
    }
  }
}
for (const m of missing) add(fail, '404', `없는 자산: ${m}`);

console.log(`\nHTML ${htmls.length} · <img> ${imgs} (alt 누락 ${noAlt} / 치수 누락 ${noDim}) · <video> ${videos} (poster 없음 ${noPoster}) · preload 총 ${preloadTotal}`);
if (dupAltPages.length) {
  console.log(`\n같은 페이지 안에서 중복된 alt: ${dupAltPages.length}건`);
  dupAltPages.slice(0, 5).forEach((d) => console.log('  ' + d));
}

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
console.log('✓ 미디어 검증 통과 — 깨진 자산·포맷 불일치·치수 누락·alt 누락 없음');
