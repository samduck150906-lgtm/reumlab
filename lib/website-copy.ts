import raw from '../content/website-copy.json';

/**
 * 업종 홈페이지(/website/<업종>/) 고유 문구 — content/website-copy.json 단일 출처.
 *
 * 왜 따로 두나 (2026-10 네이버 색인 감사)
 *  294개 페이지가 업종명만 바꾼 같은 문장(5어절 슁글 Jaccard 평균 0.62, 쌍의 99% 가 0.5 이상)이라
 *  네이버 유사문서로 묶일 위험이 컸다. lib/website-editorial.ts 의 기획 메모 6칸은 문장 틀에 끼워 넣는
 *  짧은 구절이라 틀 자체의 반복을 없애지 못한다. 업종마다 따로 쓴 문단(머리글·업종 특유 페이지 3개·
 *  놓치기 쉬운 점·업종 질문 2개)을 본문에 넣고, 294개 공통 문장은 /website/ 허브 한 곳으로 옮겼다.
 *  회귀 게이트: scripts/verify-near-duplicate.mjs (빌드 체인), scripts/website-industry-copy.test.mts.
 *
 * 작성 규칙(문구를 고칠 때도 같다): 새 사실·금액·기간·실적 없음, 보장·우위 표현 없음, 의료·법률 효과 단정 없음,
 *  업종명 띄어쓰기, 받침에 맞는 조사, 다른 업종과 같은 문장 틀 금지.
 */
export interface WebsiteCopy {
  /** 2~3문장 머리글 — 방문자가 누구이고 무엇을 결정하려 하는지 */
  lead: string;
  /** 업종 특유 페이지 3개 — "페이지명: 설명" */
  pages: string[];
  /** 2문장 — 흔히 놓치는 점과 대신 어떻게 구성할지 */
  pitfalls: string;
  /** 업종 질문 2개 — 비용·기간·이관·검색·직접 수정은 공통 FAQ 가 맡는다 */
  faqs: { q: string; a: string }[];
}

export const WEBSITE_COPY: Record<string, WebsiteCopy> = raw as Record<string, WebsiteCopy>;

export function getWebsiteCopy(slug: string): WebsiteCopy {
  const c = WEBSITE_COPY[slug];
  if (!c) throw new Error(`Missing website copy: ${slug} (content/website-copy.json)`);
  return c;
}
