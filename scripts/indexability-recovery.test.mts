import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'node-html-parser';
import { getLandingBySlug, landingIndexable, landingRedirectTarget, hubShouldIndex } from '../lib/data';
import sitemap from '../app/sitemap';

const recovered = ['/h/app-dev/', '/l/pangyo-mvp-dev/'];

test('reviewed app decision guide and Pangyo MVP brief regain indexability at their existing URLs', () => {
  assert.equal(hubShouldIndex('app-dev'), true, 'canonical app hub must not exclude itself');
  assert.equal(landingIndexable(getLandingBySlug('pangyo-mvp-dev')), true);
  assert.equal(landingRedirectTarget('pangyo-mvp-dev'), null, 'existing URL must remain a page');
  const urls = new Set(sitemap().map(row => row.url));
  for (const path of recovered) assert.ok(urls.has('https://reumlab.com' + path), path);
  for (const hub of ['shopping-mall', 'service-plan', 'suwon', 'cafe', 'restaurant', 'academy', 'gym']) {
    assert.ok(urls.has(`https://reumlab.com/h/${hub}/`), `preserve previously indexed ${hub} hub`);
  }
});

test('recovery does not open aliases, thin aggregators or unreviewed location variants', () => {
  for (const slug of ['mobile-app', 'pangyo', 'startup', 'web-dev', 'not-a-hub']) {
    assert.equal(hubShouldIndex(slug), false, slug);
  }
  for (const slug of ['cafe-web-dev', 'gym-landing-page', 'ilsan-app-dev-out', 'suwon-app-dev']) {
    assert.equal(landingIndexable(getLandingBySlug(slug)), false, slug);
  }
  assert.equal(landingIndexable(null), false);
  assert.equal(landingRedirectTarget('suwon-app-dev'), '/app-development/suwon/');
});

test('exported recovered pages have crawlable robots, self canonicals and distinct usable content', () => {
  for (const path of recovered) {
    const doc = parse(readFileSync(new URL('../out' + path + 'index.html', import.meta.url), 'utf8'));
    for (const tag of doc.querySelectorAll('meta[name="robots"],meta[name="googlebot"]')) {
      assert.doesNotMatch(tag.getAttribute('content') ?? '', /noindex|none/i, path);
    }
    assert.deepEqual(doc.querySelectorAll('link[rel="canonical"]').map(n => n.getAttribute('href')), ['https://reumlab.com' + path]);
    assert.equal(doc.querySelectorAll('h1').length, 1);
    assert.ok((doc.querySelector('main')?.textContent.length ?? 0) > 1200, path);
    const headings = doc.querySelectorAll('h2').map(n => n.textContent.trim());
    const required = path.startsWith('/h/')
      ? ['앱이 필요한지부터 판단하는 순서', '비교 가능한 견적을 만드는 기능 목록', '업체 선정과 인수에서 확인할 증거']
      : ['판교 MVP 의뢰: 피칭 데모와 고객 검증을 나눕니다', '첫 검증 범위를 한 장으로 정리하는 방법', '실제 사용자 투입 전에 확인할 자료와 권한', '검수 후 고도화 여부를 결정하는 인수 기준'];
    for (const heading of required) assert.ok(headings.includes(heading), `${path}: missing reviewed decision content: ${heading}`);
  }
  const duplicate = parse(readFileSync(new URL('../out/h/mobile-app/index.html', import.meta.url), 'utf8'));
  assert.match(duplicate.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '', /noindex/);
  assert.equal(duplicate.querySelector('link[rel="canonical"]')?.getAttribute('href'), 'https://reumlab.com/h/app-dev/');
  const notFound = parse(readFileSync(new URL('../out/404.html', import.meta.url), 'utf8'));
  assert.ok(notFound.querySelectorAll('meta[name="robots"]').some(n => /noindex/.test(n.getAttribute('content') ?? '')));
});
