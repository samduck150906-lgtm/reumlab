import assert from 'node:assert/strict';
import test from 'node:test';
import { AUTOMATION_DOMAINS } from '../lib/automation-domains.ts';
import {
  generateAutomationKeywords,
  generateAutomationQuestions,
} from '../lib/automation-keywords.ts';

test('검색어 연구 자산은 70개 분야에 100개 이상씩, 전체 7천 개 이상이다', () => {
  const rows = generateAutomationKeywords();
  assert.ok(rows.length >= 7_000, `actual: ${rows.length}`);
  assert.equal(new Set(rows.map((row) => row.normalizedKeyword)).size, rows.length);

  for (const domain of AUTOMATION_DOMAINS) {
    const count = rows.filter((row) => row.domain === domain.slug).length;
    assert.ok(count >= 100, `${domain.slug}: ${count}`);
  }
});

test('키워드는 연구 필드와 유효한 공개 targetPage를 모두 가진다', () => {
  const rows = generateAutomationKeywords();
  const validTargets = new Set([
    '/ai-automation/',
    ...AUTOMATION_DOMAINS
      .filter((domain) => domain.publishMode !== 'research-only')
      .map((domain) => domain.targetPage),
  ]);

  for (const row of rows) {
    assert.ok(row.keyword);
    assert.ok(row.tool || row.task);
    assert.match(row.clusterId, /^automation:/);
    assert.ok(['commercial', 'transactional', 'informational'].includes(row.intent));
    assert.ok(['TOFU', 'MOFU', 'BOFU'].includes(row.funnel));
    assert.ok(validTargets.has(row.targetPage), `${row.keyword}: ${row.targetPage}`);
    assert.equal(row.indexableCandidate, row.targetPage !== '/ai-automation/');
  }
});

test('AEO 자연어 질문은 분야별 30개 이상이며 질문형으로 끝난다', () => {
  const rows = generateAutomationQuestions();
  assert.ok(rows.length >= 2_100, `actual: ${rows.length}`);
  assert.equal(new Set(rows.map((row) => `${row.domain}:${row.question}`)).size, rows.length);
  for (const domain of AUTOMATION_DOMAINS) {
    const domainRows = rows.filter((row) => row.domain === domain.slug);
    assert.ok(domainRows.length >= 30, `${domain.slug}: ${domainRows.length}`);
    assert.ok(domainRows.every((row) => row.question.endsWith('?')));
  }
});
