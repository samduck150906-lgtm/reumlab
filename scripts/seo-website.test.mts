import assert from 'node:assert/strict';
import test from 'node:test';
import {
  SEO_WEBSITE_CANONICAL,
  SEO_WEBSITE_PAGES,
  SEO_WEBSITE_GUIDES,
  SEO_WEBSITE_INDUSTRIES,
  getSeoWebsitePage,
  getSeoWebsiteGuide,
  getSeoWebsiteIndustryByPageId,
  seoWebsiteCanonical,
} from '../lib/seo-website.ts';

test('대표 서비스와 신규 5개 하위 페이지는 중복 없는 정규 URL을 제공한다', () => {
  assert.equal(SEO_WEBSITE_CANONICAL, 'https://reumlab.com/seo-website/');
  assert.deepEqual(
    SEO_WEBSITE_PAGES.map((page) => page.canonical),
    [
      'https://reumlab.com/seo-website/',
      'https://reumlab.com/seo-website/regional/',
      'https://reumlab.com/seo-website/cost/',
      'https://reumlab.com/seo-website/staffing/',
    ],
  );
  assert.deepEqual(
    SEO_WEBSITE_GUIDES.map((guide) => guide.canonical),
    [
      'https://reumlab.com/seo-website/guides/search-registration/',
      'https://reumlab.com/seo-website/guides/seo-checklist/',
    ],
  );
  const urls = [...SEO_WEBSITE_PAGES, ...SEO_WEBSITE_GUIDES].map((page) => page.canonical);
  assert.equal(new Set(urls).size, 6);
});

test('기존 색인 가치가 있는 9개 업종 URL을 재사용하고 인력업체만 새 URL을 쓴다', () => {
  assert.deepEqual(
    SEO_WEBSITE_INDUSTRIES.map(({ pageId, href }) => [pageId, href]),
    [
      ['CLEANING', '/website/cheongsoeobche/'],
      ['MOVING', '/website/isaeobche/'],
      ['DEMOLITION', '/website/cheolgeoeobche/'],
      ['LEAK', '/website/nusutamjieobche/'],
      ['WATERPROOF', '/website/bangsueobche/'],
      ['INTERIOR', '/website/interieoeobche/'],
      ['AIRCON', '/website/eeokeoneobche/'],
      ['WASTE', '/website/pyegimulcheorieobche/'],
      ['STAFFING', '/seo-website/staffing/'],
      ['MANUFACTURING', '/website/jejoeob/'],
    ],
  );
  assert.equal(new Set(SEO_WEBSITE_INDUSTRIES.map((item) => item.href)).size, 10);
});

test('업종 프로필은 이름 치환이 아닌 서로 다른 의사결정 정보와 문의 예시를 가진다', () => {
  const signatures = SEO_WEBSITE_INDUSTRIES.map((item) => [
    item.decisionInfo.join('|'),
    item.menuExample.join('|'),
    item.formExample.join('|'),
  ].join('::'));
  assert.equal(new Set(signatures).size, SEO_WEBSITE_INDUSTRIES.length);
  for (const item of SEO_WEBSITE_INDUSTRIES) {
    assert.ok(item.decisionInfo.length >= 3, `${item.pageId}: decisionInfo`);
    assert.ok(item.materials.length >= 3, `${item.pageId}: materials`);
    assert.ok(item.faqs.length >= 4 && item.faqs.length <= 6, `${item.pageId}: faqs`);
  }
});

test('알 수 없는 slug와 page id는 안전하게 undefined를 반환한다', () => {
  assert.equal(getSeoWebsitePage('not-a-page'), undefined);
  assert.equal(getSeoWebsiteGuide('not-a-guide'), undefined);
  assert.equal(getSeoWebsiteIndustryByPageId('UNKNOWN'), undefined);
  assert.equal(seoWebsiteCanonical('regional'), 'https://reumlab.com/seo-website/regional/');
});

