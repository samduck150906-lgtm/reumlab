/**
 * 색인 품질 게이트 (Index-Quality Gate)
 * ------------------------------------------------------------------
 * 프로그래매틱 페이지(지역×서비스, 업종, 비교, 가이드 등)가 무조건
 * `index: true` 로 나가지 않도록, 페이지가 "검색에 노출될 자격(고유성)"을
 * 갖췄는지 점수화한다.
 *
 * 설계 의도 — 름랩은 B2B 외주개발이므로 도어웨이/얇은 콘텐츠 페널티가
 * 가장 큰 리스크다. 키워드/지역명만 치환한 페이지는 색인하지 않는다.
 *
 *  - 80점 이상 : index (사이트맵 포함)
 *  - 60~79점  : 보강 후 index (사이트맵 제외, noindex,follow)
 *  - 60점 미만 : noindex,follow (사이트맵 제외)
 *
 * 이 모듈은 순수 함수만 제공한다. 라우트/사이트맵에서 import 해 사용한다.
 * 사용 예시는 docs/SEO_STRATEGY_2026.md "색인 게이트 배선" 참고.
 */

export interface IndexSignals {
  /** 페이지 고유 title (다른 페이지와 동일하면 0점) */
  title: string;
  /** 페이지 고유 meta description */
  description: string;
  /** 페이지 고유 H1 */
  h1: string;
  /** 화면에 실제로 렌더되는 본문 텍스트(치환문 제외, 고유 단락만) */
  uniqueBodyText: string;
  /** 이 페이지 고유 FAQ (질문 문자열 배열) */
  faqQuestions: string[];
  /** 페이지에 실제 존재하는 내부링크 수 (허브/관련/상담) */
  internalLinks: number;
  /** 상담 CTA(전화/이메일/상담) 존재 여부 */
  hasConsultCta: boolean;
  /** 본문에 의사결정 정보(가격/기간/산출물/프로세스/적합성)가 있는가 */
  hasDecisionInfo: boolean;
  /** 지역 페이지일 때: 지역 상권 등 그 지역 고유 정보가 있는가 */
  hasLocalAccessInfo?: boolean;
  /** 페이지 고유 이미지/스크린샷(alt 포함)이 1개 이상 있는가 */
  hasUniqueMedia?: boolean;
  /**
   * 이미 색인된 다른 페이지들의 "지문(fingerprint)" 집합.
   * 본문 토큰 Jaccard 유사도가 0.7 이상이면 중복으로 간주해 감점.
   */
  peerFingerprints?: Set<string>[];
}

export interface IndexDecision {
  score: number;
  /** 'index' | 'soft-noindex'(보강 후) | 'noindex' */
  verdict: 'index' | 'soft-noindex' | 'noindex';
  shouldIndex: boolean;
  /** 사이트맵 포함 여부 (index 일 때만 true) */
  inSitemap: boolean;
  /** 감점/탈락 사유 (운영자 검수용) */
  reasons: string[];
}

const STOPWORDS = new Set([
  '그리고', '하지만', '또한', '있습니다', '합니다', '입니다', '수', '및', '등',
  'the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'for', 'is', 'are',
]);

/** 한글/영문/숫자 토큰화 → 2자 이상, 불용어 제외 */
export function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9]+|[가-힣]+/g) || [])
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

/** 본문 토큰 집합 = 중복 검사용 지문 */
export function fingerprint(text: string): Set<string> {
  return new Set(tokenize(text));
}

/** 두 지문의 Jaccard 유사도 (0~1) */
export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter);
}

/** 한글 포함 본문 길이(공백 제외 문자 수) */
export function visibleLength(text: string): number {
  return text.replace(/\s+/g, '').length;
}

/**
 * 색인 자격 점수 계산.
 * 만점 100. 각 항목은 "보이는 콘텐츠 기준"으로만 채점한다.
 */
export function scoreIndexability(s: IndexSignals): IndexDecision {
  const reasons: string[] = [];
  let score = 0;

  // 고유 메타 3종 (각 10점)
  if (s.title.trim().length >= 10) score += 10;
  else reasons.push('title 부족');
  if (s.description.trim().length >= 40) score += 10;
  else reasons.push('description 부족');
  if (s.h1.trim().length >= 6) score += 10;
  else reasons.push('h1 부족');

  // 본문 분량 (최대 20점) — 800자 이상 만점, 500자 미만 탈락 가중
  const bodyLen = visibleLength(s.uniqueBodyText);
  if (bodyLen >= 800) score += 20;
  else if (bodyLen >= 500) score += 12;
  else reasons.push(`본문 ${bodyLen}자 (<500자, 얇은 콘텐츠)`);

  // 고유 FAQ (최대 15점) — 3개 이상 만점
  const faqCount = new Set(s.faqQuestions.map((q) => q.trim()).filter(Boolean)).size;
  if (faqCount >= 3) score += 15;
  else if (faqCount >= 1) score += 6;
  else reasons.push('고유 FAQ 없음');

  // 내부링크 (최대 10점) — 3개 이상 만점
  if (s.internalLinks >= 3) score += 10;
  else if (s.internalLinks >= 1) score += 5;
  else reasons.push('내부링크 없음');

  // 의사결정 정보 (10점)
  if (s.hasDecisionInfo) score += 10;
  else reasons.push('가격/기간/산출물/프로세스 정보 없음');

  // 상담 CTA (5점)
  if (s.hasConsultCta) score += 5;
  else reasons.push('상담 CTA 없음');

  // 고유 미디어 (5점)
  if (s.hasUniqueMedia) score += 5;

  // 지역 페이지 접근성 (5점) — undefined면 비지역 페이지로 보고 가산
  if (s.hasLocalAccessInfo === undefined) score += 5;
  else if (s.hasLocalAccessInfo) score += 5;
  else reasons.push('지역 접근성/상담 동선 정보 없음');

  // 중복 검사 — peer 중 하나라도 Jaccard ≥ 0.7 이면 강한 감점 + 사유
  if (s.peerFingerprints && s.peerFingerprints.length) {
    const fp = fingerprint(s.uniqueBodyText);
    const dup = s.peerFingerprints.find((p) => jaccard(fp, p) >= 0.7);
    if (dup) {
      score -= 40;
      reasons.push('기존 페이지와 본문 70% 이상 중복');
    }
  }

  score = Math.max(0, Math.min(100, score));

  let verdict: IndexDecision['verdict'];
  if (score >= 80) verdict = 'index';
  else if (score >= 60) verdict = 'soft-noindex';
  else verdict = 'noindex';

  return {
    score,
    verdict,
    shouldIndex: verdict === 'index',
    inSitemap: verdict === 'index',
    reasons,
  };
}

/** Next.js Metadata.robots 로 변환 (라우트 generateMetadata 에서 사용) */
export function robotsFor(decision: IndexDecision) {
  const index = decision.shouldIndex;
  return {
    index,
    follow: true,
    googleBot: index
      ? { index: true, follow: true, 'max-image-preview': 'large' as const, 'max-snippet': -1 }
      : { index: false, follow: true },
  };
}
