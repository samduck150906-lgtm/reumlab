import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { parse } from 'node-html-parser';
import reviews from '../content/public-page-review.json';
import { evidenceAnchor, publicEvidence, type PublicReview } from '../lib/public-evidence';
import { JsonLdScript } from '../components/JsonLd';

const review: PublicReview = {
  heading: '검토 기준', rows: [{ label: '인계 범위', basis: '공개한 인계 조건', check: '계정 소유자를 대조하세요.', source: '본문 근거', href: '#handover' }], navigation: [],
};

test('all published review rows have unambiguous anchors and canonical source URLs', () => {
  assert.equal(Object.keys(reviews).length, 2844);
  for (const [path, record] of Object.entries(reviews)) {
    const evidence = publicEvidence(path, record);
    assert.equal(new Set(evidence.parts.map(row => row.id)).size, record.rows.length);
    assert.equal(evidence.page, new URL(path, 'https://reumlab.com').href);
    for (const row of evidence.parts) assert.equal(new URL(row.sourceUrl).origin, 'https://reumlab.com');
  }
});

test('public citations retain their anchors after excerpt and procedure edits', () => {
  const before = publicEvidence('/웹개발/', review);
  const changed = structuredClone(review);
  changed.rows[0].basis = '갱신된 공개 조건'; changed.rows[0].check = '추가된 확인 절차';
  const after = publicEvidence('/웹개발/', changed);
  assert.equal(before.parts[0].id, after.parts[0].id);
  assert.equal(before.parts[0].sourceUrl, 'https://reumlab.com/%EC%9B%B9%EA%B0%9C%EB%B0%9C/#handover');
  assert.equal(evidenceAnchor('인계 범위'), evidenceAnchor('인계 범위'.normalize('NFD')));
});

test('external lookalike sources and ambiguous canonical paths cannot become site evidence', () => {
  assert.throws(() => publicEvidence('//other.test/', review));
  assert.throws(() => publicEvidence('/page/?preview=1', review));
  const changed = structuredClone(review); changed.rows[0].href = 'https://reumlab.com.attacker.test/';
  assert.throws(() => publicEvidence('/page/', changed));
});

test('excerpt text cannot close the JSON-LD script or create executable markup', () => {
  const changed = structuredClone(review); changed.rows[0].basis = '</script><script>alert(1)</script>';
  const evidence = publicEvidence('/page/', changed);
  const html = renderToStaticMarkup(React.createElement(JsonLdScript, { data: evidence.schema }));
  const document = parse(html); const scripts = document.querySelectorAll('script');
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].getAttribute('type'), 'application/ld+json');
  assert.equal(JSON.parse(scripts[0].textContent).hasPart[0].text, changed.rows[0].basis + '\n' + changed.rows[0].check);
});
