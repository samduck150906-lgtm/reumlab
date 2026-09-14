/**
 * logo-manifest — 기존 로고·브랜드 부자산의 파일 바이트와 구현값을 고정한다.
 *
 *   node tools/home-redesign/logo-manifest.mjs [--out logo-manifest.json] [--root .]
 *
 * 마스터 프롬프트 2절: 파일명·경로·바이트(SHA-256), 텍스트형 로고 구현,
 * favicon·앱 아이콘·OG 자산과 "참조 URL"까지 전후 비교 대상이다.
 * 해시가 같아도 CSS 때문에 외형이 달라질 수 있으므로 화면 비교는 별도로 한다.
 */
import { readFileSync, existsSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const args = process.argv.slice(2);
const root = args.includes('--root') ? args[args.indexOf('--root') + 1] : '.';
const outPath = args.includes('--out') ? args[args.indexOf('--out') + 1] : null;

/** 브랜드 자산 — 로고 원본과 파생 아이콘, 공유 이미지 */
const ASSETS = [
  'public/logo.png',
  'public/favicon.ico',
  'public/favicon-16x16.png',
  'public/favicon-32x32.png',
  'public/apple-touch-icon.png',
  'public/icon-192.png',
  'public/icon-512.png',
  'public/og-image.jpg',
  'public/og-default.png',
  'public/site.webmanifest',
];

/** 로고 외형을 좌우하는 CSS 규칙 — 텍스트형 워드마크라 서체·자간·크기가 곧 로고다 */
const LOGO_CSS_SELECTORS = [
  '.logo',
  '.logo__mark',
  '.logo__ko',
  '.footer .logo',
  '.footer .logo__ko',
];

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

const files = ASSETS.map((rel) => {
  const p = join(root, rel);
  if (!existsSync(p)) return { path: rel, exists: false, note: '파일 없음 — 확인 실패가 아니라 부재' };
  const buf = readFileSync(p);
  return { path: rel, exists: true, bytes: buf.length, sha256: sha256(buf), mtimeIgnored: true };
});

/**
 * styles.css 에서 로고 관련 선언을 원문 그대로 뽑는다.
 * 셀렉터 목록 단위로 정확히 일치하는 규칙만 수집한다(부분 일치로 오탐하지 않도록).
 */
function extractLogoRules(cssPath) {
  if (!existsSync(cssPath)) return { exists: false };
  const css = readFileSync(cssPath, 'utf8');
  const rules = {};
  // 아주 단순한 규칙 스캐너: `셀렉터 { 선언 }` 단위
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const selectorList = m[1].trim().replace(/\s+/g, ' ');
    const body = m[2].trim().replace(/\s+/g, ' ');
    for (const sel of selectorList.split(',').map((s) => s.trim())) {
      if (LOGO_CSS_SELECTORS.includes(sel)) {
        (rules[sel] ||= []).push({ selectorList, declarations: body });
      }
    }
  }
  return {
    exists: true,
    path: cssPath,
    sha256: sha256(readFileSync(cssPath)),
    rules,
    ruleCount: Object.values(rules).reduce((a, v) => a + v.length, 0),
  };
}

/** HTML 안의 로고 마크업과 브랜드 자산 참조 URL */
function extractRefs(htmlPath) {
  if (!existsSync(htmlPath)) return { exists: false };
  const html = readFileSync(htmlPath, 'utf8');
  const grab = (re) => [...html.matchAll(re)].map((x) => x[0]);
  return {
    exists: true,
    path: htmlPath,
    logoMarkup: grab(/<a class="logo"[\s\S]*?<\/a>/g).map((s) => s.replace(/\s+/g, ' ').trim()),
    iconLinks: grab(/<link[^>]+rel="(?:icon|apple-touch-icon|manifest|mask-icon)"[^>]*>/g),
    ogImage: grab(/<meta[^>]+property="og:image[^"]*"[^>]*>/g),
    twitterImage: grab(/<meta[^>]+name="twitter:image"[^>]*>/g),
    schemaLogoUrls: [...html.matchAll(/"logo"\s*:\s*"([^"]+)"/g)].map((x) => x[1]),
    schemaImageUrls: [...html.matchAll(/"image"\s*:\s*"([^"]+)"/g)].map((x) => x[1]),
  };
}

const manifest = {
  generatedAt: new Date().toISOString(),
  root,
  files,
  cssImplementation: extractLogoRules(join(root, 'styles.css')),
  htmlImplementation: extractRefs(join(root, 'index.html')),
  builtHtmlImplementation: extractRefs(join(root, 'out/index.html')),
  rules: [
    '파일 바이트를 바꾸지 않는다(최적화·minify·재인코딩 포함).',
    '텍스트형 워드마크의 서체·자간·굵기·크기·심벌과의 간격을 바꾸지 않는다.',
    'CSS filter/invert/hue-rotate/opacity/blend-mode 로 변색하지 않는다.',
    '허용: 비율 유지 표시 크기, 주변 여백, 배치.',
  ],
};

const json = JSON.stringify(manifest, null, 2);
if (outPath) {
  writeFileSync(outPath, json, 'utf8');
  const ok = files.filter((f) => f.exists).length;
  console.log(`✓ logo-manifest: ${outPath} (자산 ${ok}/${files.length}개 해시 · 로고 CSS 규칙 ${manifest.cssImplementation.ruleCount ?? 0}개)`);
} else {
  process.stdout.write(json);
}
