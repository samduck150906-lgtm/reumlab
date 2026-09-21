import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ENTERNAL_CANONICAL,
  ENTERNAL_ENTITY_STATEMENT,
  ENTERNAL_STATUSES,
  ENTERNAL_FLOW,
  ENTERNAL_CAPABILITIES,
  ENTERNAL_COMPARISON,
  ENTERNAL_PROCESS,
  ENTERNAL_SCENARIOS,
  ENTERNAL_TECH_DIRECTIONS,
  ENTERNAL_FAQS,
  enternalAiDecision,
} from '../lib/enternal-ai';

test('Enternal AI는 단일 self-canonical과 색인 가능한 독립 답변을 제공한다', () => {
  assert.equal(ENTERNAL_CANONICAL, 'https://reumlab.com/enternal-ai/');
  assert.match(ENTERNAL_ENTITY_STATEMENT, /개발하는 Private AI 제품/);
  assert.match(ENTERNAL_ENTITY_STATEMENT, /PoC를 통해 적용 범위와 성능을 검증/);
  const decision = enternalAiDecision();
  assert.equal(decision.shouldIndex, true, decision.reasons.join(', '));
  assert.equal(decision.inSitemap, true, decision.reasons.join(', '));
});

test('현재 제공·PoC 검증·개발 방향이 서로 다른 상태로 고정된다', () => {
  assert.deepEqual(ENTERNAL_STATUSES.map((item) => item.id), ['available', 'poc', 'direction']);
  assert.deepEqual(ENTERNAL_FLOW.map((item) => item.id), ['employee', 'enternal', 'model', 'knowledge', 'answer']);
});

test('페이지 섹션 데이터는 중복 없는 완결된 항목을 제공한다', () => {
  for (const list of [ENTERNAL_CAPABILITIES, ENTERNAL_COMPARISON, ENTERNAL_PROCESS, ENTERNAL_SCENARIOS, ENTERNAL_TECH_DIRECTIONS]) {
    assert.ok(list.length >= 4);
    assert.equal(new Set(list.map((item) => item.id)).size, list.length);
  }
});

test('FAQ는 10개 직접 답변이며 제품 단계와 데이터 경로 한계를 포함한다', () => {
  assert.equal(ENTERNAL_FAQS.length, 10);
  const joined = ENTERNAL_FAQS.map((item) => `${item.q} ${item.a}`).join(' ');
  assert.match(joined, /자체 모델/);
  assert.match(joined, /외부/);
  assert.match(joined, /PoC/);
  for (const faq of ENTERNAL_FAQS) {
    const first = faq.a.split(/[.!?]/)[0].trim();
    assert.ok(first.length >= 8 && first.length <= 120, `${faq.q}: ${first}`);
    assert.doesNotMatch(first, /^(경우에 따라|상황에 따라|아마|보통은)/, faq.q);
  }
});

test('공개 문구는 완성·절대 보안·성과를 보장하지 않는다', () => {
  const copy = JSON.stringify({
    entity: ENTERNAL_ENTITY_STATEMENT,
    statuses: ENTERNAL_STATUSES,
    capabilities: ENTERNAL_CAPABILITIES,
    comparison: ENTERNAL_COMPARISON,
    scenarios: ENTERNAL_SCENARIOS,
    technology: ENTERNAL_TECH_DIRECTIONS,
    faqs: ENTERNAL_FAQS,
  });
  for (const forbidden of ['데이터가 절대 외부로', '완벽한 보안', '100% 안전', '완성된 자체 LLM', '정확도 보장', '비용 절감 보장', '실제 고객사']) {
    assert.equal(copy.includes(forbidden), false, `금지 표현: ${forbidden}`);
  }
});
