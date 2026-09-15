import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';

const read = (path: string) => readFileSync(path, 'utf8');

test('home does not block LCP on remote fonts or duplicate GA4 loader', () => {
  const html = read('index.html');
  assert.doesNotMatch(html, /fonts\.googleapis|cdn\.jsdelivr\.net\/gh\/orioncactus/);
  assert.doesNotMatch(html, /googletagmanager\.com\/gtag\/js/);
  assert.match(html, /requestIdleCallback/);
  assert.match(html, /GTM-WHLMP8ZD/);
});

test('Next routes load one analytics owner after LCP', () => {
  const analytics = read('components/Analytics.tsx');
  assert.match(analytics, /const directGa4Id = gtmId \? '' : ga4Id/);
  assert.match(analytics, /id="analytics-loader" strategy="afterInteractive"/);
  assert.match(analytics, /},8000\)/);
  assert.doesNotMatch(read('app/layout.tsx'), /fonts\.googleapis|fonts\.gstatic/);
});

test('large CMS video is user initiated and limited to relevant services', () => {
  for (const path of ['index.html', 'components/ReumSalesLanding.tsx', 'components/SeoServicePage.tsx']) {
    const source = read(path);
    assert.doesNotMatch(source, /autoPlay|\sautoplay(?:\s|>)/);
    assert.match(source, /preload=(?:"none"|\{'none'\})/);
  }
  const services = read('components/SeoServicePage.tsx');
  assert.match(services, /ADMIN_DEMO_SERVICES/);
  assert.match(services, /고객사 사례 화면이나 성과 수치를 대신하지 않습니다/);
});

test('purpose landing hero cannot expand beyond a mobile viewport', () => {
  const css = read('styles.css');
  assert.match(css, /\.hero__grid\s*\{\s*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(css, /\.hero__text,\s*\.hero__stage\s*\{\s*min-width:\s*0/);
  assert.match(css, /\.hero h1 \.hl\s*\{\s*white-space:\s*normal/);
  assert.match(css, /\.hero__cta \.btn\s*\{\s*flex:\s*1 1 100%/);
  assert.match(css, /\.lx-hero-stage\s*\{\s*width:\s*100%/);
});

test('hybrid static service links do not request missing RSC payloads', () => {
  const nav = read('components/Nav.js');
  const geo = read('app/geo-website/page.tsx');
  assert.match(nav, /const STATIC_HTML_SERVICE_PATHS = new Set/);
  assert.equal((nav.match(/prefetch=\{!STATIC_HTML_SERVICE_PATHS\.has\(item\.slug\)\}/g) || []).length, 2);
  assert.match(geo, /href="\/data-seo\/" prefetch=\{false\}/);
  assert.match(geo, /href="\/service-renewal\/" prefetch=\{false\}/);
});

test('Next inquiry honeypot stays in the payload but never appears to visitors', () => {
  const form = read('components/LandingInquiryForm.tsx');
  const css = read('app/globals.css');
  assert.match(form, /data-netlify-honeypot="bot-field"/);
  assert.match(form, /className="netlify-honeypot"/);
  assert.match(form, /name="bot-field" tabIndex=\{-1\}/);
  assert.match(css, /\.netlify-honeypot\s*\{[^}]*position:\s*absolute\s*!important/s);
  assert.match(css, /\.netlify-honeypot\s*\{[^}]*clip-path:\s*inset\(50%\)\s*!important/s);
});

test('static legal pages do not trigger missing Next RSC prefetches', () => {
  const footer = read('components/BusinessFooter.tsx');
  for (const path of ['privacy', 'terms', 'refund']) {
    assert.doesNotMatch(footer, new RegExp(`<Link href="/${path}/">`));
    assert.match(footer, new RegExp(`<a href="/${path}/">`));
  }
});

test('public routes use the self-hosted Pretendard pair in the right order', () => {
  const meta = JSON.parse(read('public/fonts/subset.json'));
  const original = `public/fonts/${meta.source}`;
  const subset = `public/fonts/${meta.subset}`;

  // 원본은 그대로 남아 있어야 한다 — 서브셋의 입력이자 희귀 글자용 폴백이다.
  assert.equal(existsSync(original), true);
  assert.ok(statSync(original).size > 2_000_000 && statSync(original).size < 2_100_000);
  assert.equal(existsSync(subset), true);
  assert.ok(statSync(subset).size < 400_000, '서브셋이 400KB 를 넘으면 분리 의미가 사라진다');

  for (const file of ['styles.css', 'app/globals.css', 'reum.css']) {
    const css = read(file);
    assert.doesNotMatch(css, /fonts\.googleapis\.com|fonts\.gstatic\.com/, `${file}: 외부 폰트 호스트`);
    assert.match(css, /font-family:\s*['"]Pretendard['"]/, `${file}: Pretendard 선언 없음`);
    assert.match(css, /font-display:\s*swap/, `${file}: font-display swap 없음`);

    // 두 face 가 다 있어야 하고, **서브셋이 나중**이어야 한다.
    // 순서가 뒤집히면 범위가 겹치는 흔한 글자까지 원본(2MB)이 이겨 전 페이지가 2MB 를 받는다.
    const origAt = css.indexOf(meta.source);
    const subAt = css.indexOf(meta.subset);
    assert.ok(origAt >= 0, `${file}: 원본 face 없음`);
    assert.ok(subAt >= 0, `${file}: 서브셋 face 없음`);
    assert.ok(subAt > origAt, `${file}: 서브셋 face 가 원본보다 먼저 선언됐다 — 전 페이지가 2MB 를 받게 된다`);

    // 두 범위가 subset.json 과 일치해야 한다(둘 중 하나만 고치면 글자가 폴백으로 샌다).
    assert.ok(css.includes(meta.unicode_range), `${file}: 서브셋 unicode-range 가 subset.json 과 다름`);
    assert.ok(css.includes(meta.rest_unicode_range), `${file}: 원본 unicode-range 가 subset.json 과 다름`);
  }
});
