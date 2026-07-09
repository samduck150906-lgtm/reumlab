/**
 * File2 연관키워드(관련 검색어) 반영 — 필러별 보조 키워드 세트.
 *
 * 네이버 키워드 리서치(월간검색수 기준)에서 학습·언어·비구매 의도 키워드
 * (SQLD·파이썬·MYSQL·React 등)를 걷어내고, 실제 구매 의도가 있는 연관 검색어만
 * 골라 필러 페이지의 meta keywords 보조 신호로 병합한다. (검색수 내림차순)
 *
 * seo.ts 가 이 세트를 PAGE_SEO_MAP[slug].keywords 에 중복 제거 병합한다.
 */
export const RELATED_KEYWORDS_BY_PILLAR: Record<string, string[]> = {
  'web-development': ['상세페이지제작', '상세페이지', '웹사이트만들기', '홈페이지제작비용', '웹사이트제작', '반응형홈페이지제작', '사이트만들기', '웹페이지제작', '홈페이지제작업체추천', '홈페이지개발', '웹사이트제작업체', '홈페이지제작사이트', '홈페이지제작지원', '홈페이지제작지원사업', '디자인홈페이지', '반응형웹사이트', '반응형홈페이지제작비용', '홈페이지유지보수업체', '홈페이지제작회사', '홈페이지견적', '홈페이지제작방법', '회사홈페이지제작업체', '홈페이지리뉴얼업체', '홈페이지지원사업', '홈페이지구축비용', '웹제작'],
  'app-development': ['SI', '앱개발', '앱만들기', '어플만드는법', 'SI업체', '웹에이전시', '어플만들기', '앱제작', 'SI기업', '외주업체', '앱개발업체', '어플제작', '웹앱만들기', '어플개발', '앱개발비용', '모바일앱개발', 'SI회사', '외주사이트', 'SI개발', '외주개발', '어플제작비용', '어플개발비용', '개발외주', '앱개발프로그램', '앱개발회사', '어플만드는비용'],
};

/** 병합 유틸 — 기존 keywords 뒤에 연관키워드를 중복 없이 덧붙인다. */
export function mergeRelatedKeywords(slug: string, base: string[]): string[] {
  const extra = RELATED_KEYWORDS_BY_PILLAR[slug];
  if (!extra) return base;
  const seen = new Set(base.map((k) => k.replace(/\s+/g, '')));
  const out = [...base];
  for (const k of extra) {
    const key = k.replace(/\s+/g, '');
    if (!seen.has(key)) { seen.add(key); out.push(k); }
  }
  return out;
}
