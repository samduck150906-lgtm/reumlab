/**
 * 리뷰용 Before/After 캡처 — 저장소에 넣을 수 있도록 JPEG 로 줄여서 찍는다.
 *
 *   NODE_PATH=... node tools/home-redesign/capture-compare.mjs \
 *     --before http://127.0.0.1:4321 --after http://127.0.0.1:4322 --out docs/home-redesign/shots
 *
 * 외부 요청은 차단한다. 고객 비공개 화면·개인정보는 홈에 없다(공개 목업만).
 */
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
const require_ = createRequire(import.meta.url);
function loadPlaywright() {
  const c = ['playwright', process.env.PLAYWRIGHT_MODULE_PATH,
    ...(process.env.NODE_PATH || '').split(':').filter(Boolean).map((d) => join(d, 'playwright')),
    '/opt/node22/lib/node_modules/playwright'].filter(Boolean);
  for (const x of c) { try { return require_(x); } catch { /* next */ } }
  throw new Error('playwright 미설치');
}
const { chromium } = loadPlaywright();

const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const OUT = opt('--out', 'docs/home-redesign/shots');
const SIDES = [['before', opt('--before')], ['after', opt('--after')]];
mkdirSync(OUT, { recursive: true });

const SECTIONS = [['hero', '.hero'], ['purpose', '#purpose'], ['pricing', '#pricing'], ['contact', '#contact']];
const browser = await chromium.launch();

for (const [label, base] of SIDES) {
  for (const vp of [{ n: '1280', w: 1280, h: 900 }, { n: '390', w: 390, h: 844, m: true }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: !!vp.m, hasTouch: !!vp.m });
    const page = await ctx.newPage();
    await page.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1') ? r.continue() : r.abort()));
    await page.goto(base + '/', { waitUntil: 'load' });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: join(OUT, `${vp.n}-fold-${label}.jpg`), type: 'jpeg', quality: 72 });

    if (vp.n === '1280') {
      for (const [n, sel] of SECTIONS) {
        const el = await page.$(sel);
        if (el) await el.screenshot({ path: join(OUT, `sec-${n}-${label}.jpg`), type: 'jpeg', quality: 70 });
      }
    }
    await ctx.close();

    // 전체 페이지는 훑어보는 용도이므로 절반 해상도로 찍어 저장소 용량을 줄인다.
    const ctx2 = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: !!vp.m, hasTouch: !!vp.m, deviceScaleFactor: 0.5 });
    const page2 = await ctx2.newPage();
    await page2.route('**/*', (r) => (r.request().url().startsWith('http://127.0.0.1') ? r.continue() : r.abort()));
    await page2.goto(base + '/', { waitUntil: 'load' });
    await page2.waitForTimeout(1000);
    await page2.screenshot({ path: join(OUT, `${vp.n}-full-${label}.jpg`), type: 'jpeg', quality: 65, fullPage: true });
    await ctx2.close();
    console.log(`  · ${label} ${vp.n}px 캡처`);
  }
}
await browser.close();
console.log(`✓ Before/After 캡처 → ${OUT}`);
