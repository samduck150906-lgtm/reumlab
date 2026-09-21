import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import LandingInquiryForm from '../components/LandingInquiryForm';

(globalThis as unknown as { React: typeof React }).React = React;

test('Enternal AI 문의 변형은 기존 main-apply 계약과 전용 유입 문맥을 렌더한다', () => {
  const html = renderToStaticMarkup(React.createElement(LandingInquiryForm, {
    landingSlug: 'enternal-ai',
    defaultServiceType: 'AI 기능·업무 자동화',
    variant: 'enternal-ai' as never,
  }));
  assert.match(html, /name="main-apply"/);
  assert.match(html, /name="form-name" value="main-apply"/);
  assert.match(html, /name="유입_랜딩" value="\/enternal-ai\/"/);
  assert.match(html, /name="문의서비스" value="Enternal AI 기업 도입·PoC"/);
  assert.match(html, />PoC에서 확인하고 싶은 업무와 데이터 범위<\/label>/);
  assert.match(html, /placeholder="예: 사내 문서 검색, 로컬 추론 가능성, 외부 전송 범위, 검증할 업무"/);
  assert.match(html, /name="bot-field"/);
  assert.match(html, /name="핵심기능"/);
});

test('Enternal 문의 원문은 hidden 분석 파라미터로 복제되지 않는다', () => {
  const html = renderToStaticMarkup(React.createElement(LandingInquiryForm, {
    landingSlug: 'enternal-ai',
    variant: 'enternal-ai' as never,
  }));
  assert.doesNotMatch(html, /name="(이름|이메일|휴대폰번호|핵심기능)"[^>]*type="hidden"/);
});
