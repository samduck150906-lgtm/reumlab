/**
 * 서브페이지 영향 검사 — 홈 전용 CSS 가 다른 템플릿에 새로 적용되지 않았는지 본다.
 *
 *   node tools/home-redesign/subpage-audit.mjs --base http://127.0.0.1:4321 --label before --out <dir>
 *
 * 홈(index.html)은 /styles.css 를 목적별 랜딩 8개와 공유한다(scripts/generate-purpose-landings.mjs).
 * 따라서 "파일이 홈 전용"이라는 전제는 성립하지 않는다 — 실제 렌더 값으로 확인한다.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const require_ = createRequire(import.meta.url);
function loadPlaywright() {
  const cands = ['playwright', process.env.PLAYWRIGHT_MODULE_PATH,
    ...(process.env.NODE_PATH || '').split(':').filter(Boolean).map((d) => join(d, 'playwright')),
    '/opt/node22/lib/node_modules/playwright'].filter(Boolean);
  for (const c of cands) { try { return require_(c); } catch { /* next */ } }
  throw new Error('playwright 미설치');
}
const { chromium } = loadPlaywright();

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const BASE = opt('--base', 'http://127.0.0.1:4321');
const LABEL = opt('--label', 'run');
const OUT = opt('--out', `./subpages-${LABEL}`);
mkdirSync(join(OUT, 'shots'), { recursive: true });

/** 템플릿별 대표 1개씩 — 전수가 아니라 표본이라는 점을 보고서에 명시한다. */
const PATHS = [
  ['/mvp/', 'purpose-landing(styles.css 공유)'],
  ['/erp/', 'purpose-landing(styles.css 공유)'],
  ['/website/', 'purpose-landing(styles.css 공유)'],
  ['/portfolio/', 'Next app router'],
  ['/source-handover/', 'Next app router'],
  ['/app-development/dongtan/', 'Next app router(지역×서비스)'],
  ['/guide/', 'Next app router'],
  ['/blog/', 'Next app router'],
  ['/cost/', 'Next app router'],
  ['/soho/', 'Next app router(전용 CSS)'],
  ['/geo-website/', 'Next app router(CSS module)'],
  ['/enterprise-ai/', 'Next app router'],
  ['/app/', 'Next app router'],
  ['/privacy/', '정적 법적 고지'],
  ['/terms/', '정적 법적 고지'],
];

const PROBE = () => {
  const norm = (s) => String(s).replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
  const cs = (sel, props) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const c = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const o = { _box: { w: +r.width.toFixed(2), h: +r.height.toFixed(2) } };
    for (const p of props) o[p] = c[p];
    return o;
  };
  const bodyCS = getComputedStyle(document.body);
  return {
    title: document.title,
    canonical: document.querySelector('link[rel=canonical]')?.getAttribute('href') ?? null,
    robots: document.querySelector('meta[name=robots]')?.getAttribute('content') ?? null,
    stylesheets: [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => l.getAttribute('href')),
    bodyAttrs: Object.fromEntries([...document.body.attributes].map((a) => [a.name, a.value])),
    body: { fontFamily: bodyCS.fontFamily, fontSize: bodyCS.fontSize, lineHeight: bodyCS.lineHeight, color: bodyCS.color, background: bodyCS.backgroundColor },
    h1: [...document.querySelectorAll('h1')].map((h) => norm(h.textContent)),
    headingCount: document.querySelectorAll('h1,h2,h3,h4,h5,h6').length,
    linkCount: document.querySelectorAll('a[href]').length,
    bodyTextLength: norm(document.body.innerText).length,
    docWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    // 홈 리디자인이 건드릴 가능성이 있는 공용 선택자들의 계산값 — 서브페이지에서 변하면 누출이다
    probes: {
      '.wrap': cs('.wrap', ['maxWidth', 'paddingLeft', 'paddingRight', 'marginLeft']),
      '.hero': cs('.hero', ['paddingTop', 'paddingBottom', 'background']),
      'h1': cs('h1', ['fontSize', 'lineHeight', 'letterSpacing', 'fontWeight', 'color']),
      '.sec-title': cs('.sec-title', ['fontSize', 'lineHeight', 'letterSpacing', 'fontWeight', 'color']),
      '.btn--primary': cs('.btn--primary', ['minHeight', 'fontSize', 'borderRadius', 'backgroundColor', 'color', 'padding']),
      '.btn--ghost': cs('.btn--ghost', ['minHeight', 'fontSize', 'borderRadius', 'backgroundColor', 'color']),
      '.section': cs('.section', ['paddingTop', 'paddingBottom']),
      '.logo': cs('.logo', ['fontSize', 'fontWeight', 'letterSpacing', 'color', 'gap']),
      '.logo__mark': cs('.logo__mark', ['width', 'height', 'filter', 'opacity', 'objectFit']),
      '.header': cs('.header', ['height', 'paddingTop', 'paddingBottom', 'backgroundColor', 'position']),
      '.card': cs('.card', ['borderRadius', 'backgroundColor', 'boxShadow']),
      '.faq-q': cs('.faq-q', ['fontSize', 'minHeight', 'padding']),
      ':root': cs(':root', ['fontSize']),
    },
    rootVars: (() => {
      const c = getComputedStyle(document.documentElement);
      const names = ['--bg', '--bg-soft', '--ink', '--ink-2', '--ink-3', '--accent', '--accent-d', '--line', '--maxw', '--gutter', '--r', '--r-lg', '--sans'];
      return Object.fromEntries(names.map((n) => [n, c.getPropertyValue(n).trim()]));
    })(),
  };
};

const browser = await chromium.launch();
const report = { label: LABEL, base: BASE, startedAt: new Date().toISOString(), pages: {} };

for (const [path, template] of PATHS) {
  report.pages[path] = { template };
  for (const vp of [{ n: '1280', w: 1280, h: 900 }, { n: '390', w: 390, h: 844, m: true }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: !!vp.m, hasTouch: !!vp.m });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(String(e.message).slice(0, 200)));
    await page.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1') ? r.continue() : r.abort()));
    const resp = await page.goto(BASE + path, { waitUntil: 'load' });
    await page.waitForTimeout(500);
    const data = await page.evaluate(PROBE);
    data.status = resp?.status() ?? null;
    data.pageErrors = errs;
    report.pages[path][vp.n] = data;
    const slug = path.replace(/\//g, '_') || '_root';
    await page.screenshot({ path: join(OUT, 'shots', `${LABEL}${slug}${vp.n}.png`), fullPage: false });
    await ctx.close();
  }
  console.log(`  · ${path} (${template}) 수집 완료`);
}

await browser.close();
report.finishedAt = new Date().toISOString();
writeFileSync(join(OUT, `subpages-${LABEL}.json`), JSON.stringify(report, null, 2), 'utf8');
console.log(`✓ subpage-audit(${LABEL}) → ${join(OUT, `subpages-${LABEL}.json`)} (표본 ${PATHS.length}개 · 전수 아님)`);
