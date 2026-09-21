import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  ENTERNAL_CANONICAL,
  ENTERNAL_ENTITY_STATEMENT,
  ENTERNAL_FAQS,
  ENTERNAL_H1,
} from '../lib/enternal-ai';

(globalThis as unknown as { React: typeof React }).React = React;
registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith('.module.css')) return {
      format: 'module',
      source: "export default new Proxy({}, { get: (_target, property) => String(property) });",
      shortCircuit: true,
    };
    return nextLoad(url, context);
  },
});

const { default: EnternalAiPage, metadata } = await import('../app/enternal-ai/page');

test('Enternal AI 페이지는 self-canonical과 제품 단계를 서버 HTML에 제공한다', () => {
  assert.deepEqual(metadata.alternates, { canonical: ENTERNAL_CANONICAL });
  const warnings: string[] = [];
  const previousError = console.error;
  console.error = (...args: unknown[]) => warnings.push(String(args[0]));
  let html = '';
  try {
    html = renderToStaticMarkup(React.createElement(EnternalAiPage));
  } finally {
    console.error = previousError;
  }
  assert.deepEqual(warnings, [], warnings.join('\n'));
  assert.match(html, new RegExp(`<h1[^>]*>${ENTERNAL_H1}</h1>`));
  assert.ok(html.includes(ENTERNAL_ENTITY_STATEMENT));
  assert.match(html, /현재 제공/);
  assert.match(html, /PoC 검증/);
  assert.match(html, /개발 방향/);
  assert.match(html, /목표 구조/);
  assert.match(html, /name="유입_랜딩" value="\/enternal-ai\/"/);
  assert.match(html, /"@type":"WebPage"/);
  assert.match(html, /"@type":"Service"/);
  assert.match(html, /"@type":"BreadcrumbList"/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.doesNotMatch(html, /"@type":"SoftwareApplication"/);
  assert.equal((html.match(/"@type":"Organization"/g) || []).length, 0);
  assert.doesNotMatch(html, /<table/i);
  for (const faq of ENTERNAL_FAQS) {
    assert.ok(html.includes(faq.q), faq.q);
    assert.ok(html.includes(faq.a), faq.q);
  }
});
