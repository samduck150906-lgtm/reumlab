import assert from 'node:assert/strict';
import test from 'node:test';
import { aggregate, formatRate, isOfficialSiteUrl, normalizeEntity, promptHash } from './lib.mjs';
import manifest from './prompts-v1.json' with { type: 'json' };

const base = (overrides = {}) => ({
  run_id: `run-${Math.random()}`,
  dataset_version: manifest.dataset_version,
  prompt_id: 'Q01',
  prompt_text: manifest.prompts[0].text,
  prompt_hash: promptHash(manifest.prompts[0].text),
  surface: 'chatgpt-web-search',
  timestamp: '2026-09-13T00:00:00+09:00',
  repeat_index: 1,
  execution_status: 'ANSWER_CAPTURED',
  raw_response_path: 'raw/test.txt',
  raw_response_hash: 'abc',
  review_status: 'REVIEWED',
  is_synthetic: false,
  brand_mentioned_in_body: false,
  brand_recommended: false,
  official_site_cited: false,
  citation_urls: [],
  competitor_entities: [],
  ...overrides,
});

test('이름은 언급됐지만 추천은 아닌 경우를 분리한다', () => {
  const m = aggregate([base({ brand_mentioned_in_body: true, brand_recommended: false })], manifest);
  assert.equal(m.mentioned, 1); assert.equal(m.recommended, 0);
});

test('공식 사이트 인용은 있지만 본문 언급은 없는 경우를 분리한다', () => {
  const m = aggregate([base({ official_site_cited: true, citation_urls: ['https://reumlab.com/mvp/'] })], manifest);
  assert.equal(m.cited, 1); assert.equal(m.mentioned, 0);
});

test('부정적 언급을 추천으로 계산하지 않는다', () => {
  const m = aggregate([base({ brand_mentioned_in_body: true, brand_recommended: false, recommendation_context: '비추천' })], manifest);
  assert.equal(m.mentioned, 1); assert.equal(m.recommended, 0);
});

test('순위 없는 추천 목록은 추천으로만 집계한다', () => {
  const m = aggregate([base({ brand_recommended: true, unranked_recommendation: true })], manifest);
  assert.equal(m.recommended, 1); assert.equal(m.unranked, 1); assert.equal(m.rankable, 0);
});

test('유사 도메인을 공식 사이트로 오탐하지 않는다', () => {
  assert.equal(isOfficialSiteUrl('https://reumlab.example.com/'), false);
  assert.equal(isOfficialSiteUrl('https://notreumlab.com/'), false);
});

test('별도 브랜드 서브도메인을 자동으로 공식 사이트에 포함하지 않는다', () => {
  assert.equal(isOfficialSiteUrl('https://demo.reumlab.com/'), false);
  assert.equal(isOfficialSiteUrl('https://www.reumlab.com/guide/'), true);
});

test('동일 업체의 중복 표기를 정규화한다', () => {
  assert.equal(normalizeEntity('름랩'), 'REUMLAB');
  assert.equal(normalizeEntity('reum lab'), 'REUMLAB');
  const m = aggregate([base({ brand_recommended: true, competitor_entities: ['름랩', 'REUMLAB', '경쟁사A', '경쟁사A'] })], manifest);
  assert.equal(m.recommendationShare.entities.REUMLAB, 1);
  assert.equal(m.recommendationShare.entities['경쟁사A'], 1);
});

test('AI 답변이 없는 조회는 유효 답변 분모에서 제외한다', () => {
  const m = aggregate([base({ execution_status: 'NO_AI_FEATURE', raw_response_path: '', raw_response_hash: '', review_status: '' })], manifest);
  assert.equal(m.attempted, 1); assert.equal(m.valid, 0);
});

test('실행 오류를 미노출로 계산하지 않는다', () => {
  const m = aggregate([base({ execution_status: 'NETWORK_ERROR', raw_response_path: '', raw_response_hash: '', review_status: '' })], manifest);
  assert.equal(m.valid, 0); assert.equal(m.unresolved, 1);
});

test('미측정 데이터를 0점 답변으로 넣지 않는다', () => {
  const m = aggregate([base({ execution_status: 'NOT_RUN', raw_response_path: '', raw_response_hash: '', review_status: '' })], manifest);
  assert.equal(m.attempted, 0); assert.equal(m.valid, 0);
});

test('합성 데이터는 실측 집계에서 제외한다', () => {
  const m = aggregate([base({ is_synthetic: true, brand_recommended: true })], manifest);
  assert.equal(m.attempted, 0); assert.equal(m.valid, 0);
});

test('분모가 0이면 0%가 아닌 N/A를 표시한다', () => {
  assert.equal(formatRate(0, 0), 'N/A');
});
