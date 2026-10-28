import raw from '../content/automation-copy.json';

/**
 * AI 자동화 분야 페이지(/ai-automation/<slug>/) 고유 문구 — content/automation-copy.json 단일 출처.
 *
 * 왜 (2026-10 사이트 전체 유사문서 보고)
 *  공개 분야 30개의 본문은 lib/automation-domains.ts 의 틀 문장(직답·작업 설명·FAQ 6개 중 4개·절차·비용 고지)이
 *  이름만 바꿔 반복돼 5어절 슁글 Jaccard 평균 0.46, 0.5 이상 쌍 49개였다. 분야마다 따로 쓴 장면·직답·작업별
 *  메모·범위 함정·질문 2개·상담 문장을 넣고, 공통 절차·비용·일반 질문은 /ai-automation/ 허브로 옮긴다.
 *  규칙: 새 사실·금액·실적 없음, 보장·절감률 없음, 분야 간 같은 문장 틀 금지(검수 스크립트로 확인).
 */
export interface AutomationCopy {
  /** 담당자가 반복하는 실제 장면과 자동화가 바꾸는 지점 */
  scene: string;
  /** "○○도 자동화할 수 있나요?" 직답 */
  directAnswer: string;
  /** 작업(tasks 항목 그대로) → 입력·규칙·예외 메모 */
  taskNotes: Record<string, string>;
  /** 범위를 잘못 잡기 쉬운 지점 */
  pitfalls: string;
  /** 분야 질문 2개 */
  faqs: { q: string; a: string }[];
  /** 상담 유도 — 무엇을 보내면 무엇을 먼저 검토하는지 */
  cta: string;
}

export const AUTOMATION_COPY: Record<string, AutomationCopy> = raw as unknown as Record<string, AutomationCopy>;

export function getAutomationCopy(slug: string): AutomationCopy {
  const c = AUTOMATION_COPY[slug];
  if (!c) throw new Error(`Missing automation copy: ${slug} (content/automation-copy.json)`);
  return c;
}
