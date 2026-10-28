import assert from 'node:assert/strict';
import test from 'node:test';
import { AUTOMATION_WORKFLOWS } from '../lib/automation-workflows.ts';
import {
  AUTOMATION_DOMAINS,
  PRIORITY_S_DOMAINS,
  automationCanonical,
  automationDecision,
  getAutomationDomain,
} from '../lib/automation-domains.ts';

test('업무자동화 연구 범위는 중복 없는 70개 분야다', () => {
  assert.equal(AUTOMATION_DOMAINS.length, 70);
  assert.equal(new Set(AUTOMATION_DOMAINS.map((item) => item.slug)).size, 70);
  assert.equal(new Set(AUTOMATION_DOMAINS.map((item) => item.name)).size, 70);
});

test('Priority S 33개는 검색어 치환이 아닌 독립 업무 정보를 갖는다', () => {
  assert.equal(PRIORITY_S_DOMAINS.length, 33);
  for (const domain of PRIORITY_S_DOMAINS) {
    assert.ok(domain.tools.length >= 5, `${domain.slug}: tools`);
    assert.ok(domain.tasks.length >= 5, `${domain.slug}: tasks`);
    if (domain.publishMode === 'generated') {
      assert.ok(AUTOMATION_WORKFLOWS[domain.slug], `${domain.slug}: individually authored workflows`);
      assert.ok(domain.workflows.length >= 2, `${domain.slug}: complete workflows`);
      assert.equal(new Set(domain.workflows.map(flow => flow.title)).size, domain.workflows.length, `${domain.slug}: distinct workflow titles`);
      for (const flow of domain.workflows) {
        for (const key of ['input', 'process', 'output', 'humanReview'] as const) {
          assert.ok(flow[key].length >= 15, `${domain.slug}/${flow.title}: meaningful ${key}`);
          assert.doesNotMatch(flow[key], /현재 사용하는 .* 자료와 처리 기준|규칙을 실행하고 처리 근거와 예외를 함께 기록|확신도가 낮거나 권한이 필요한 항목만 담당자가 확인/, `${domain.slug}: no keyword-substitution boilerplate`);
        }
      }
    } else {
      assert.ok(domain.workflows.length >= 5, `${domain.slug}: existing service research workflows`);
    }
    assert.ok(domain.constraints.length >= 2, `${domain.slug}: constraints`);
    // 공개 분야(generated)는 분야 고유 질문 4개만 갖는다 — 공통 질문(비용·기간·보안 등)은 /ai-automation/ 허브 FAQ 로 옮겨
    // 30개 페이지가 같은 FAQ 를 반복하지 않도록 했다(scripts/generate-purpose-landings.mjs FAQ_BY_SLUG).
    assert.ok(domain.faqs.length >= (domain.publishMode === 'generated' ? 4 : 6), `${domain.slug}: faqs`);
    assert.ok(domain.directAnswer.length >= 80, `${domain.slug}: directAnswer`);
    assert.ok(domain.description.length >= 70, `${domain.slug}: description`);
    assert.ok(domain.implementationTypes.length >= 3, `${domain.slug}: implementationTypes`);
    assert.ok(domain.relatedDomains.length >= 2, `${domain.slug}: relatedDomains`);
  }
});

test('공개 상세 URL은 품질 게이트를 통과하고 기존 전용 서비스와 충돌하지 않는다', () => {
  const generated = PRIORITY_S_DOMAINS.filter((domain) => domain.publishMode === 'generated');
  assert.ok(generated.length >= 25);
  for (const domain of generated) {
    assert.equal(automationCanonical(domain), `https://reumlab.com/ai-automation/${domain.slug}/`);
    const decision = automationDecision(domain.slug);
    assert.equal(decision?.shouldIndex, true, `${domain.slug}: ${decision?.reasons.join(', ')}`);
    assert.equal(decision?.inSitemap, true, domain.slug);
    assert.equal(getAutomationDomain(domain.slug)?.slug, domain.slug);
  }

  assert.equal(getAutomationDomain('ai-voice')?.targetPage, '/ai-voice-development/');
  assert.equal(getAutomationDomain('enterprise-rag')?.targetPage, '/enterprise-ai/');
  assert.equal(getAutomationDomain('seo-geo-aeo')?.targetPage, '/ai-search-optimization/');
});

test('Priority A/B 분야는 연구 자산에만 남고 얇은 URL을 만들지 않는다', () => {
  for (const domain of AUTOMATION_DOMAINS.filter((item) => item.priority !== 'S')) {
    assert.equal(domain.publishMode, 'research-only', domain.slug);
    assert.equal(automationDecision(domain.slug)?.shouldIndex, false, domain.slug);
  }
});
