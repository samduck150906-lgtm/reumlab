import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { inflateSync } from 'node:zlib';
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

function pngAlphaValues(png: Buffer) {
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  assert.equal(png[24], 8, 'wordmark PNG must use 8-bit channels');
  assert.equal(png[25], 6, 'wordmark PNG must be RGBA');

  const idat: Buffer[] = [];
  for (let offset = 8; offset < png.length;) {
    const length = png.readUInt32BE(offset);
    const type = png.toString('ascii', offset + 4, offset + 8);
    if (type === 'IDAT') idat.push(png.subarray(offset + 8, offset + 8 + length));
    offset += 12 + length;
  }

  const raw = inflateSync(Buffer.concat(idat));
  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel;
  const pixels = Buffer.alloc(stride * height);
  const paeth = (a: number, b: number, c: number) => {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  };

  let sourceOffset = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = raw[sourceOffset++];
    const rowOffset = y * stride;
    for (let x = 0; x < stride; x += 1) {
      const value = raw[sourceOffset++];
      const left = x >= bytesPerPixel ? pixels[rowOffset + x - bytesPerPixel] : 0;
      const up = y > 0 ? pixels[rowOffset - stride + x] : 0;
      const upLeft = y > 0 && x >= bytesPerPixel ? pixels[rowOffset - stride + x - bytesPerPixel] : 0;
      const predictor = filter === 0 ? 0
        : filter === 1 ? left
          : filter === 2 ? up
            : filter === 3 ? Math.floor((left + up) / 2)
              : filter === 4 ? paeth(left, up, upLeft)
                : -1;
      assert.notEqual(predictor, -1, `unsupported PNG filter: ${filter}`);
      pixels[rowOffset + x] = (value + predictor) & 0xff;
    }
  }

  const alpha = Array.from({ length: width * height }, (_, index) => pixels[index * 4 + 3]);
  return { alpha, width, height };
}

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

test('Enternal AI 첫 화면은 장식용 AI 큐브 대신 기업 데이터 흐름을 설명한다', () => {
  const page = readFileSync(new URL('../app/enternal-ai/page.tsx', import.meta.url), 'utf8');
  const css = readFileSync(new URL('../app/enternal-ai/enternal-ai.module.css', import.meta.url), 'utf8');
  assert.match(page, /styles\.heroShell/);
  assert.match(page, /styles\.heroVisual/);
  assert.match(page, /styles\.dataArchitecture/);
  assert.match(page, /사내 문서·업무 데이터/);
  assert.match(page, /권한·정책 계층/);
  assert.match(page, /Private inference/);
  assert.match(page, /검증된 답변·업무 연결/);
  assert.doesNotMatch(page, /styles\.aiCore|styles\.aiCube|styles\.orbit|styles\.visualLabels/);
  assert.doesNotMatch(page, />Private<|>Secure<|>Scalable<|>Your AI</);
  assert.doesNotMatch(page, /styles\.brandPanel/);
  assert.match(css, /\.heroShell\s*\{[^}]*background:/s);
  assert.match(css, /\.heroVisual\s*\{/);
  assert.match(css, /\.dataArchitecture\s*\{/);
  assert.match(css, /\.dataLink::after\s*\{[^}]*animation:/s);
  assert.match(css, /@media \(max-width: 800px\)[\s\S]*\.heroVisual/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*animation-duration:/);
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

test('상단 Enternal AI 워드마크는 흰 사각 배경 없이 투명하게 합성된다', () => {
  const png = readFileSync(new URL('../public/enternal-ai/enternal-ai-wordmark.png', import.meta.url));
  const { alpha, width, height } = pngAlphaValues(png);
  const corners = [0, width - 1, (height - 1) * width, width * height - 1];
  assert.deepEqual(corners.map((index) => alpha[index]), [0, 0, 0, 0]);
  assert.ok(alpha.filter((value) => value === 0).length > alpha.length / 2);
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
