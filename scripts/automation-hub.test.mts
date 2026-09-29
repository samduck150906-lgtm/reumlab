import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { AUTOMATION_DOMAINS } from '../lib/automation-domains.ts';
import { automationHubDomains } from '../lib/automation-hub.ts';

test('허브 디렉터리는 70개 분야를 보여 주되 공개 가능한 분야만 링크한다', () => {
  const items = automationHubDomains();
  assert.equal(items.length, 70);
  for (const item of items) {
    const source = AUTOMATION_DOMAINS.find((domain) => domain.slug === item.slug);
    assert.ok(source);
    assert.equal(item.published, source.publishMode !== 'research-only');
    assert.equal(item.href, item.published ? source.targetPage : null);
    assert.ok(item.shortDescription.length >= 25);
    assert.ok(item.tools.length >= 3);
  }
});

test('기존 정적 /ai-automation/ 생성기는 검색·카테고리 필터와 무JS 전체 목록을 포함한다', () => {
  const source = readFileSync('scripts/generate-purpose-landings.mjs', 'utf8');
  assert.match(source, /automationDirectory\(land\)/);
  assert.match(source, /automation-search/);
  assert.match(source, /data-automation-category/);
  assert.match(source, /AUTOMATION_DOMAINS/);
  assert.match(source, /어떤 업무를 자동화하고 싶으세요/);
});
