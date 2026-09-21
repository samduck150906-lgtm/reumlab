import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import LandingInquiryForm from '../components/LandingInquiryForm';

// Next.js는 automatic JSX runtime을 쓰지만 tsx 단독 테스트는 classic runtime으로 변환한다.
(globalThis as unknown as { React: typeof React }).React = React;

test('멀티모달 문의 변형은 main-apply 계약과 정확한 유입·서비스 값을 렌더한다', () => {
  const html = renderToStaticMarkup(
    React.createElement(LandingInquiryForm, {
      landingSlug: 'multimodal-ai-worker',
      defaultServiceType: 'AI 기능·업무 자동화',
      variant: 'multimodal-ai-worker' as never,
    }),
  );

  assert.match(html, /name="main-apply"/);
  assert.match(html, /name="form-name" value="main-apply"/);
  assert.match(html, /name="유입_랜딩" value="\/ai-worker\/multimodal\/"/);
  assert.match(html, /name="문의서비스" value="멀티모달 AI Worker 구축"/);
  assert.match(html, />AI가 맡았으면 하는 멀티모달 업무<\/label>/);
  assert.match(html, /placeholder="예: 현장 사진 검수, 통화 분석, 견적 초안, ERP·CRM 업무 등록"/);
  assert.match(html, /name="bot-field"/);
});

test('멀티모달 문의 폼은 분석 파라미터가 아닌 실제 상담 입력으로만 업무 설명을 받는다', () => {
  const html = renderToStaticMarkup(
    React.createElement(LandingInquiryForm, {
      landingSlug: 'multimodal-ai-worker',
      variant: 'multimodal-ai-worker' as never,
    }),
  );

  assert.match(html, /name="핵심기능"/);
  assert.doesNotMatch(html, /name="(이름|이메일|휴대폰번호|핵심기능)"[^>]*type="hidden"/);
});
