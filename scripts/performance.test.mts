import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

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
