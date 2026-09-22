import assert from 'node:assert/strict';
import test from 'node:test';
import { registerHooks } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  SEO_WEBSITE_CANONICAL,
  SEO_WEBSITE_INDUSTRIES,
  SEO_WEBSITE_PAGES,
  SEO_WEBSITE_GUIDES,
} from '../lib/seo-website.ts';

(globalThis as unknown as { React: typeof React }).React = React;
registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith('.module.css')) {
      return {
        format: 'module',
        source: "export default new Proxy({}, { get: (_target, property) => String(property) });",
        shortCircuit: true,
      };
    }
    return nextLoad(url, context);
  },
});

const [mainModule, detailModule, guideModule, enhancementModule] = await Promise.all([
  import('../app/seo-website/page'),
  import('../app/seo-website/[slug]/page'),
  import('../app/seo-website/guides/[slug]/page'),
  import('../components/SeoWebsiteIndustryEnhancement'),
]);

test('대표 페이지는 self-canonical과 핵심 답변·업종 링크·실제 문의폼을 초기 HTML에 제공한다', () => {
  assert.deepEqual(mainModule.metadata.alternates, { canonical: SEO_WEBSITE_CANONICAL });
  const html = renderToStaticMarkup(React.createElement(mainModule.default));
  assert.match(html, /<h1[^>]*>검색 잘되는 홈페이지 제작<\/h1>/);
  assert.match(html, /검색 순위나 노출을 보장하지 않습니다/);
  assert.match(html, /회사 소개에서 한 걸음 더/);
  assert.match(html, /범위 확인 후 개별 견적/);
  assert.match(html, /name="main-apply"/);
  assert.match(html, /"@type":"WebPage"/);
  assert.match(html, /"@type":"Service"/);
  assert.doesNotMatch(html, /"@type":"FAQPage"/);
  for (const industry of SEO_WEBSITE_INDUSTRIES) {
    assert.ok(html.includes(`href="${industry.href.replace(/\/$/, '')}"`), industry.pageId);
  }
});

test('지역·비용·인력 라우트는 각자 고유 H1·canonical·FAQ와 상위 링크를 제공한다', async () => {
  for (const page of SEO_WEBSITE_PAGES.filter((item) => item.slug)) {
    const html = renderToStaticMarkup(React.createElement(detailModule.default, { params: { slug: page.slug } }));
    assert.ok(html.includes(page.h1), page.pageId);
    assert.ok(html.includes(page.lead), page.pageId);
    assert.match(html, /href="\/seo-website\/?"/);
    assert.match(html, /<details/);
    assert.doesNotMatch(html, /"@type":"FAQPage"/);
    const metadata = await detailModule.generateMetadata({ params: { slug: page.slug } });
    assert.deepEqual(metadata.alternates, { canonical: page.canonical });
  }
});

test('가이드 2개는 반복 랜딩이 아닌 Article 본문·출처·서비스 연결을 제공한다', async () => {
  for (const guide of SEO_WEBSITE_GUIDES) {
    const html = renderToStaticMarkup(React.createElement(guideModule.default, { params: { slug: guide.slug } }));
    assert.ok(html.includes(guide.h1), guide.pageId);
    for (const section of guide.sections) assert.ok(html.includes(section.heading), section.heading);
    assert.match(html, /"@type":"Article"/);
    assert.doesNotMatch(html, /"@type":"FAQPage"/);
    assert.match(html, /href="\/seo-website\/?"/);
    const metadata = await guideModule.generateMetadata({ params: { slug: guide.slug } });
    assert.deepEqual(metadata.alternates, { canonical: guide.canonical });
  }
});

test('기존 업종 보강 컴포넌트는 고유 의사결정 정보와 검색형 서비스 CTA를 렌더한다', () => {
  for (const industry of SEO_WEBSITE_INDUSTRIES.filter((item) => item.existingWebsiteSlug)) {
    const html = renderToStaticMarkup(React.createElement(enhancementModule.default, { profile: industry }));
    assert.ok(html.includes(industry.summary), industry.pageId);
    assert.ok(html.includes(industry.decisionInfo[0]), industry.pageId);
    assert.ok(html.includes(industry.materials[0]), industry.pageId);
    assert.match(html, /href="\/seo-website\/\?industry=/);
  }
});
