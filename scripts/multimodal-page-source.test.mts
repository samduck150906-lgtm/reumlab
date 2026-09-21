import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  MULTIMODAL_CANONICAL,
  MULTIMODAL_ENTITY_STATEMENT,
  MULTIMODAL_FAQS,
  MULTIMODAL_H1,
  MULTIMODAL_INDUSTRIES,
  MULTIMODAL_PRODUCTS,
} from '../lib/multimodal-ai-worker';

(globalThis as unknown as { React: typeof React }).React = React;

// Node의 단위 테스트 러너에는 Next.js CSS Module 로더가 없으므로 스타일 값만 대체한다.
// 실제 CSS 번들링은 npm run build에서 별도로 검증한다.
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

const [{ default: MultimodalPage, metadata }, { default: MultimodalIndustrySelector }] = await Promise.all([
  import('../app/ai-worker/multimodal/page'),
  import('../app/ai-worker/multimodal/MultimodalIndustrySelector'),
]);

test('멀티모달 페이지는 self-canonical과 독립 서비스 답변을 서버 HTML에 제공한다', () => {
  assert.deepEqual(metadata.alternates, { canonical: MULTIMODAL_CANONICAL });
  const html = renderToStaticMarkup(React.createElement(MultimodalPage));

  assert.match(html, new RegExp(`<h1[^>]*>${MULTIMODAL_H1}</h1>`));
  assert.ok(html.includes(MULTIMODAL_ENTITY_STATEMENT));
  assert.match(html, /VIDEO · IMAGE · VOICE · DOCUMENT · TEXT/);
  assert.match(html, /READ/);
  assert.match(html, /HUMAN_ONLY/);
  assert.match(html, /name="유입_랜딩" value="\/ai-worker\/multimodal\/"/);
  assert.match(html, /"@type":"Service"/);
  assert.match(html, /href="\/guide\/ai-automation-guide\/?"/);

  for (const product of MULTIMODAL_PRODUCTS) assert.ok(html.includes(product.title), product.title);
  for (const faq of MULTIMODAL_FAQS) assert.ok(html.includes(faq.q), faq.q);
});

test('업종 선택 예시는 버튼·선택 상태·라이브 결과를 자바스크립트 전에도 제공한다', () => {
  const html = renderToStaticMarkup(
    React.createElement(MultimodalIndustrySelector, {
      industries: MULTIMODAL_INDUSTRIES,
      defaultIndustryId: 'b2b',
    }),
  );

  assert.match(html, /aria-label="Interactive Example"/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /aria-live="polite"/);
  assert.ok(html.includes('B2B 사무업무'));
  assert.ok(html.includes('회의 음성, 계약·발주 문서, 이메일'));
});
