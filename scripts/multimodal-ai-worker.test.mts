import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MULTIMODAL_CANONICAL,
  MULTIMODAL_FLOW,
  MULTIMODAL_ENGINE,
  MULTIMODAL_PRODUCTS,
  MULTIMODAL_INDUSTRIES,
  MULTIMODAL_FAQS,
  MULTIMODAL_PERMISSIONS,
  getMultimodalIndustry,
  multimodalDecision,
} from '../lib/multimodal-ai-worker';

test('멀티모달 서비스는 하나의 self-canonical과 색인 가능한 독립 답변을 제공한다', () => {
  assert.equal(MULTIMODAL_CANONICAL, 'https://reumlab.com/ai-worker/multimodal/');
  const decision = multimodalDecision();
  assert.equal(decision.shouldIndex, true, decision.reasons.join(', '));
  assert.equal(decision.inSitemap, true, decision.reasons.join(', '));
});

test('핵심 흐름과 엔진은 입력부터 결과까지 빠짐없이 순서대로 이어진다', () => {
  assert.deepEqual(
    MULTIMODAL_FLOW.map((step) => step.id),
    ['input', 'perceive', 'understand', 'worker', 'connect', 'result'],
  );
  assert.deepEqual(
    MULTIMODAL_ENGINE.map((step) => step.id),
    ['input', 'understanding', 'reasoning', 'rules', 'permission', 'action', 'result'],
  );
});

test('상품 10종은 중복 없이 각자의 입력·판단·결과·한계를 설명한다', () => {
  assert.equal(MULTIMODAL_PRODUCTS.length, 10);
  assert.equal(new Set(MULTIMODAL_PRODUCTS.map((item) => item.id)).size, 10);
  for (const item of MULTIMODAL_PRODUCTS) {
    assert.ok(item.input.length > 0, `${item.id}: input`);
    assert.ok(item.judgement.length > 0, `${item.id}: judgement`);
    assert.ok(item.output.length > 0, `${item.id}: output`);
    assert.ok(item.guardrail.length > 0, `${item.id}: guardrail`);
  }
});

test('업종 10종은 중복 없이 있고 알 수 없는 값은 B2B 기본 예시로 안전하게 돌아간다', () => {
  assert.equal(MULTIMODAL_INDUSTRIES.length, 10);
  assert.equal(new Set(MULTIMODAL_INDUSTRIES.map((item) => item.id)).size, 10);
  const fallback = getMultimodalIndustry('not-a-real-industry');
  assert.equal(fallback.id, 'b2b');
  assert.equal(getMultimodalIndustry('academy').id, 'academy');
});

test('권한 모델은 READ·WRITE·CONFIRM·HUMAN_ONLY 네 단계만 제공한다', () => {
  assert.deepEqual(
    MULTIMODAL_PERMISSIONS.map((item) => item.level),
    ['READ', 'WRITE', 'CONFIRM', 'HUMAN_ONLY'],
  );
});

test('FAQ 10개는 첫 문장에서 직접 답하고 모호한 말로 시작하지 않는다', () => {
  assert.equal(MULTIMODAL_FAQS.length, 10);
  const vagueStart = /^(경우에 따라|상황에 따라|그럴 수|아마|보통은)/;
  for (const item of MULTIMODAL_FAQS) {
    const firstSentence = item.a.split(/[.!?]/)[0].trim();
    assert.ok(firstSentence.length >= 8 && firstSentence.length <= 100, `${item.q}: ${firstSentence}`);
    assert.doesNotMatch(firstSentence, vagueStart, item.q);
  }
});

test('공개 문구에는 고객·정확도·절감·검색 성과를 보장하는 표현이 없다', () => {
  const allCopy = JSON.stringify({
    products: MULTIMODAL_PRODUCTS,
    industries: MULTIMODAL_INDUSTRIES,
    faqs: MULTIMODAL_FAQS,
  });
  for (const forbidden of ['100% 정확', '완벽한 보안', '순위 보장', '매출 보장', '인건비 절감 보장', '실제 고객사']) {
    assert.equal(allCopy.includes(forbidden), false, `금지 표현: ${forbidden}`);
  }
});
