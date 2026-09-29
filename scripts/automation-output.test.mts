import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { AUTOMATION_DOMAINS, GENERATED_AUTOMATION_DOMAINS } from '../lib/automation-domains.ts';
import { verifyAutomationOutput } from './verify-automation-pages.mjs';

function makeFixture() {
  const root = mkdtempSync(join(tmpdir(), 'reum-automation-'));
  const hubDir = join(root, 'ai-automation');
  mkdirSync(hubDir, { recursive: true });
  const hubItems = Array.from({ length: 70 }, (_, index) => `<article data-automation-category="c${index}"></article>`).join('');
  const links = AUTOMATION_DOMAINS
    .filter((domain) => domain.publishMode !== 'research-only')
    .map((domain) => `<a href="${domain.targetPage}">${domain.name}</a>`)
    .join('');
  writeFileSync(join(hubDir, 'index.html'), `<input id="automation-search">${hubItems}${links}`, 'utf8');

  for (const domain of GENERATED_AUTOMATION_DOMAINS) {
    const dir = join(root, 'ai-automation', domain.slug);
    mkdirSync(dir, { recursive: true });
    const canonical = `https://reumlab.com/ai-automation/${domain.slug}/`;
    writeFileSync(join(dir, 'index.html'), [
      `<link rel="canonical" href="${canonical}">`,
      `<h1>${domain.name} 프로그램 개발</h1>`,
      '<script type="application/ld+json">{"@type":"Service"}</script>',
      '<input type="hidden" name="form-name" value="main-apply">',
    ].join(''), 'utf8');
  }
  return root;
}

test('자동화 빌드 산출물 검증기는 완전한 허브와 상세 페이지를 통과시킨다', () => {
  const root = makeFixture();
  try {
    assert.deepEqual(verifyAutomationOutput(root), []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('상세 canonical·폼과 허브 항목이 빠지면 한 번에 보고한다', () => {
  const root = makeFixture();
  try {
    const first = GENERATED_AUTOMATION_DOMAINS[0];
    writeFileSync(join(root, 'ai-automation', first.slug, 'index.html'), '<h1>broken</h1>', 'utf8');
    writeFileSync(join(root, 'ai-automation', 'index.html'), '<input id="automation-search">', 'utf8');
    const issues = verifyAutomationOutput(root);
    assert.ok(issues.some((issue: string) => issue.includes('허브 분야 70개')));
    assert.ok(issues.some((issue: string) => issue.includes(first.slug) && issue.includes('canonical')));
    assert.ok(issues.some((issue: string) => issue.includes(first.slug) && issue.includes('main-apply')));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
