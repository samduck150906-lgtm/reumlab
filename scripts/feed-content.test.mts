import test from 'node:test';
import assert from 'node:assert/strict';
import { parse } from 'node-html-parser';
import { articleForFeed, cdata, validContentDate } from './lib/feed-content.mjs';
test('feed preserves complete headings, tables, FAQs and source text while resolving links', () => {
  const page = parse('<main><article><h1>검증 가이드</h1><p>'+ '검증할 실제 본문입니다. '.repeat(15) +'</p><table><tr><td>380만 원</td></tr></table><h2>질문</h2><p>전체 답변</p><a href="../other/?a=1&amp;b=2">근거</a><a href="#scope">범위</a><script>doNotPublish()</script></article></main>');
  const html = articleForFeed(page, 'https://reumlab.com/guide/test/');
  assert.ok(html.includes('전체 답변')); assert.ok(html.includes('380만 원'));
  assert.ok(html.includes('https://reumlab.com/guide/other/?a=1&amp;b=2'));
  assert.ok(html.includes('https://reumlab.com/guide/test/#scope'));
  assert.ok(!html.includes('doNotPublish'));
});
test('CDATA terminators cannot truncate or inject XML', () => {
  assert.equal(cdata('a]]>b'), '<![CDATA[a]]]]><![CDATA[>b]]>');
});
test('missing body and unsupported URLs fail closed', () => {
  assert.throws(() => articleForFeed(parse('<main/>'), 'https://reumlab.com/guide/test/'), /Missing/);
  assert.throws(() => articleForFeed(parse('<main><article><h1>x</h1><a href="javascript:alert(1)">bad</a></article></main>'), 'https://reumlab.com/guide/test/'), /Unsupported/);
});
test('content dates are real calendar dates and never arbitrary build times', () => {
  assert.equal(validContentDate('2026-10-20').toISOString(), '2026-10-20T00:00:00.000Z');
  assert.throws(() => validContentDate('2026-02-30')); assert.throws(() => validContentDate('not-a-date'));
});
