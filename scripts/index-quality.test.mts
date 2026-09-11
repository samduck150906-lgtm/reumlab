import test from 'node:test';
import assert from 'node:assert/strict';
import { reviewEvidence, scoreIndexability } from '../lib/index-quality';

test('reviewEvidence — 검증 근거·방법·한계·출처를 함께 평가한다', () => {
  const result = reviewEvidence({
    firstPartyEvidence: 'verified',
    independentSources: 2,
    hasMethodology: true,
    hasLimitations: true,
    reviewedAt: '2026-09-11',
    hasOriginalMedia: false,
  });
  assert.equal(result.score, 90);
  assert.equal(result.verdict, 'verified');
  assert.deepEqual(result.reasons, ['페이지 고유 시각 자료 없음']);
});

test('reviewEvidence — 글자 수와 FAQ가 많아도 근거가 없으면 부족으로 분리한다', () => {
  const evidence = reviewEvidence({
    firstPartyEvidence: 'none',
    independentSources: 0,
    hasMethodology: false,
    hasLimitations: false,
    hasOriginalMedia: false,
  });
  assert.equal(evidence.verdict, 'insufficient');

  const decision = scoreIndexability({
    title: '충분히 긴 고유한 페이지 제목',
    description: '사용자에게 필요한 내용을 설명하는 충분히 긴 메타 설명입니다. 실제 페이지 내용을 정확하게 요약합니다.',
    h1: '충분히 긴 페이지 제목',
    uniqueBodyText: '가격 기간 산출물 프로세스 '.repeat(80),
    faqQuestions: ['질문 하나', '질문 둘', '질문 셋'],
    internalLinks: 5,
    hasConsultCta: true,
    hasDecisionInfo: true,
    hasUniqueMedia: true,
    evidence: {
      firstPartyEvidence: 'none',
      independentSources: 0,
      hasMethodology: false,
      hasLimitations: false,
    },
  });
  assert.equal(decision.shouldIndex, true);
  assert.equal(decision.evidenceReview?.verdict, 'insufficient');
});
