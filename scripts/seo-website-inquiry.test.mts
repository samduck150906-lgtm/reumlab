import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import LandingInquiryForm from '../components/LandingInquiryForm.tsx';
import {
  SEO_WEBSITE_FIELD_NAMES,
  SEO_WEBSITE_INDUSTRY_CHOICES,
  SEO_WEBSITE_SCOPE_CHOICES,
  SEO_WEBSITE_STATUS_CHOICES,
  SEO_WEBSITE_SERVICE_KEY,
} from '../lib/seo-website-form.ts';
import { pageContext, pageTypeOf, serviceOf } from '../lib/analytics.ts';

(globalThis as unknown as { React: typeof React }).React = React;

test('검색형 홈페이지 문의 변형은 main-apply와 실제 상담·유입 필드를 렌더한다', () => {
  const html = renderToStaticMarkup(React.createElement(LandingInquiryForm, {
    landingSlug: 'seo-website/cleaning',
    defaultServiceType: '검색 잘되는 홈페이지 제작',
    variant: 'seo-website',
    defaultIndustry: '청소',
    submitLabel: '제작 범위 검토 요청하기',
  }));

  assert.match(html, /name="main-apply"/);
  assert.match(html, /name="유입_랜딩" value="\/seo-website\/cleaning\/"/);
  assert.match(html, new RegExp(`name="${SEO_WEBSITE_FIELD_NAMES.serviceKey}" value="${SEO_WEBSITE_SERVICE_KEY}"`));
  assert.match(html, /name="requested_service" value="검색 잘되는 홈페이지 제작"/);
  assert.match(html, /name="inquiry_type"/);
  assert.match(html, /name="source_landing"/);
  assert.match(html, /name="current_page"/);
  assert.match(html, /name="cta_location"/);
  assert.match(html, /name="industry"/);
  assert.match(html, /name="site_status"/);
  assert.match(html, /name="current_site_url"/);
  assert.match(html, /name="service_region"/);
  assert.match(html, /name="interest_scope"/);
  assert.match(html, /name="개인정보동의"/);
  assert.match(html, /name="bot-field"/);
  assert.match(html, /<option value="청소" selected="">청소<\/option>/);
});

test('검색형 홈페이지 선택지는 미정과 기타를 포함한 닫힌 enum이다', () => {
  assert.deepEqual(SEO_WEBSITE_INDUSTRY_CHOICES, ['미정', '청소', '이사', '철거', '누수·설비', '방수', '인테리어', '에어컨', '폐기물', '인력', '제조·산업용 제품', '기타']);
  assert.deepEqual(SEO_WEBSITE_STATUS_CHOICES, ['잘 모르겠음', '홈페이지 없음', '홈페이지 있음', '신규 제작 검토']);
  assert.deepEqual(SEO_WEBSITE_SCOPE_CHOICES, ['아직 미정', '신규 홈페이지', '지역·서비스 페이지 구성', '문의 연결', '관리자']);
});

test('정적 Netlify 감지 폼은 검색형 홈페이지 변형의 모든 필드를 보존한다', () => {
  const skeleton = readFileSync(new URL('../public/__forms.html', import.meta.url), 'utf8');
  for (const name of Object.values(SEO_WEBSITE_FIELD_NAMES)) {
    assert.match(skeleton, new RegExp(`name="${name}"`), name);
  }
});

test('검색형 홈페이지 경로는 지역 랜딩으로 오분류하지 않고 web 서비스로 측정한다', () => {
  assert.equal(pageTypeOf('/seo-website/'), 'service');
  assert.equal(pageTypeOf('/seo-website/regional/'), 'service');
  assert.equal(pageTypeOf('/seo-website/guides/seo-checklist/'), 'guide');
  assert.equal(serviceOf('/seo-website/cost/?utm_source=naver'), 'web');
  assert.deepEqual(pageContext('/seo-website/staffing/'), { page_type: 'service', service: 'web' });
});
