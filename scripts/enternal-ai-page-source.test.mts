import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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

test('Enternal AI 히어로 제목은 한글 단어 중간에서 끊기지 않는다', () => {
  const css = readFileSync(new URL('../app/enternal-ai/enternal-ai.module.css', import.meta.url), 'utf8');
  const heroTitleRule = css.match(/\.hero h1\s*\{([^}]+)\}/)?.[1] ?? '';
  assert.match(heroTitleRule, /word-break:\s*keep-all/);
});

test('Enternal AI의 어두운 섹션과 비교 라벨은 접근 가능한 명도 대비 색을 사용한다', () => {
  const css = readFileSync(new URL('../app/enternal-ai/enternal-ai.module.css', import.meta.url), 'utf8');
  assert.match(css, /\.definition \.sectionKicker,[\s\S]*color:\s*#75ddd4/);
  assert.match(css, /\.inquiry \.sectionKicker\s*\{[^}]*color:\s*#08716d/s);
  const comparisonLabelRule = css.match(/\.comparisonGrid strong\s*\{([^}]+)\}/)?.[1] ?? '';
  assert.match(comparisonLabelRule, /color:\s*#08716d/);
});

test('Enternal AI 첫 화면은 어두운 전용 히어로와 시각 코어를 사용한다', () => {
  const page = readFileSync(new URL('../app/enternal-ai/page.tsx', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../app/enternal-ai/enternal-ai.module.css', import.meta.url), 'utf8');
  assert.match(page, /styles\.heroShell/);
  assert.match(page, /styles\.heroVisual/);
  assert.match(page, /styles\.aiCore/);
  assert.doesNotMatch(page, /styles\.brandPanel/);
  assert.match(css, /\.heroShell\s*\{[^}]*background:/s);
  assert.match(css, /\.heroVisual\s*\{/);
  assert.match(css, /@media \(max-width: 800px\)[\s\S]*\.heroVisual/);
});

test('Enternal AI 경로의 상단 메뉴는 공동 브랜드와 확대된 메뉴를 제공한다', () => {
  const nav = readFileSync(new URL('../components/Nav.js', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
  assert.match(nav, /usePathname/);
  assert.match(nav, /enternal-nav/);
  assert.match(nav, /enternal-ai-wordmark\.png/);
  assert.doesNotMatch(nav, /enternal-ai-logo\.png/);
  assert.match(nav, /nav-enternal-wordmark/);
  assert.match(css, /\.nav\.enternal-nav \.nav-links a[^{]*\{[^}]*font-size:\s*15px/s);
  assert.match(css, /\.nav-enternal-wordmark\s*\{/);
  assert.match(css, /@media \(max-width: 360px\)[\s\S]*\.nav\.enternal-nav \.container\s*\{/);
});

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
