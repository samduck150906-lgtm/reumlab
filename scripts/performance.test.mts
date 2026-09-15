import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { isStaticOverride } from '../lib/static-routes';

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
  // 예전에는 Nav.js 가 자체 Set(STATIC_HTML_SERVICE_PATHS)으로 경로마다 prefetch 를
  // 켜고 껐다. 그 방식은 (a) 목록이 생성기와 갈릴 수 있고 (b) Next 라우트 쪽 메뉴 항목은
  // prefetch 가 켜져 있어 모든 페이지가 서비스 메뉴 4곳의 RSC 페이로드 327KB 를
  // 미리 받게 만들었다. 지금은 components/SiteLink 가 한곳에서 처리한다.
  const nav = read('components/Nav.js');
  assert.doesNotMatch(nav, /prefetch=\{/, 'Nav 가 prefetch 를 직접 제어하면 SiteLink 정책이 우회된다');
  assert.match(nav, /from '@\/components\/SiteLink'/);

  // 정적 생성 랜딩으로 가는 링크는 SiteLink 가 <a> 로 내보낸다(= 존재하지 않는 RSC 요청 없음).
  for (const path of ['/data-seo/', '/service-renewal/', '/mvp/', '/website/', '/']) {
    assert.equal(isStaticOverride(path), true, `${path} 가 정적 덮어쓰기 목록에 없다`);
  }
  // 반대로 순수 Next 라우트는 걸리면 안 된다(불필요하게 전체 리로드가 된다)
  for (const path of ['/guide/', '/portfolio/', '/ai-search-optimization/', '/geo-website/']) {
    assert.equal(isStaticOverride(path), false, `${path} 가 잘못 정적 경로로 분류됐다`);
  }
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

test('every route links through SiteLink, never next/link directly', () => {
  // SiteLink 가 prefetch 기본값(끔)과 "정적 HTML 로 덮어써지는 경로는 실제 이동" 규칙을
  // 한곳에서 강제한다. 어느 파일 하나가 next/link 를 직접 import 하면 그 파일만
  // 조용히 예전 동작(뷰포트 prefetch + 잘못된 클라이언트 내비)으로 돌아간다.
  const files = execFileSync('grep', ['-rl', "from 'next/link'", '--include=*.tsx', '--include=*.js', 'app/', 'components/'], { encoding: 'utf8' })
    .split('\n').filter(Boolean).filter((f) => f !== 'components/SiteLink.tsx');
  assert.deepEqual(files, [], `next/link 직접 import: ${files.join(', ')} → @/components/SiteLink 를 쓰세요`);

  const siteLink = read('components/SiteLink.tsx');
  assert.match(siteLink, /prefetch \?\? false/, 'SiteLink 의 prefetch 기본값이 false 가 아니다');
  assert.match(siteLink, /isStaticOverride/, 'SiteLink 가 정적 덮어쓰기 경로를 걸러내지 않는다');
});

test('static-override path list matches the generator that overwrites them', () => {
  // lib/static-routes.ts 와 실제 후처리 스크립트가 갈리면, 새로 추가된 정적 랜딩이
  // 클라이언트 내비게이션으로 진입할 때 Next 컴포넌트를 그린다(배포본과 다른 화면).
  const routes = read('lib/static-routes.ts');
  const listed = [...routes.matchAll(/^\s*'([a-z0-9-]+)',$/gm)].map((m) => m[1]).sort();

  const generator = read('scripts/generate-purpose-landings.mjs');
  const landingsBlock = generator.slice(generator.indexOf('const LANDINGS = ['));
  const generated = [...landingsBlock.matchAll(/^\s*slug: '([a-z0-9-]+)',\s*navLabel:/gm)].map((m) => m[1]).sort();

  assert.ok(generated.length >= 8, `생성기에서 슬러그를 못 읽었다 (${generated.length}개)`);
  assert.deepEqual(listed, generated,
    'lib/static-routes.ts 의 PURPOSE_LANDING_SLUGS 가 generate-purpose-landings.mjs 의 LANDINGS 와 다르다');

  // 홈도 copy-home-assets 가 덮어쓴다 — 목록에 반드시 있어야 한다
  assert.match(routes, /'\/'/, "STATIC_OVERRIDE_PATHS 에 '/' 가 없다");
  assert.match(read('scripts/copy-home-assets.mjs'), /index\.html/);
});
