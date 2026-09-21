import test from 'node:test';
import assert from 'node:assert/strict';
import sitemap from '../app/sitemap';
import { guidesForService } from '../lib/content-cluster';
import { ENTERNAL_CANONICAL } from '../lib/enternal-ai';
import { ENTERNAL_LLMS_PAGE } from '../lib/llms-service-pages';
import { RELATED_LINKS as ENTERPRISE_LINKS } from '../lib/enterprise-ai';
import { RELATED_LINKS as WORKER_LINKS } from '../lib/ai-worker';

test('사이트맵·가이드·LLM 인덱스와 기존 AI 서비스가 Enternal canonical을 한 번 연결한다', () => {
  assert.equal(sitemap().filter((item) => item.url === ENTERNAL_CANONICAL).length, 1);
  assert.ok(guidesForService('/enternal-ai/').length >= 3);
  assert.equal(ENTERNAL_LLMS_PAGE[0], 'enternal-ai');
  assert.match(ENTERNAL_LLMS_PAGE[2], /PoC/);
  assert.match(ENTERNAL_LLMS_PAGE[2], /목표/);
  assert.equal(ENTERPRISE_LINKS.filter((item) => item.href === '/enternal-ai/').length, 1);
  assert.equal(WORKER_LINKS.filter((item) => item.href === '/enternal-ai/').length, 1);
});
