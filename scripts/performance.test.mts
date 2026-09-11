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
