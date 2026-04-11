/**
 * 롱테일 키워드·프로그래매틱 SEO 시드 (블로그 slug와 1:1 매칭 권장)
 */
export const LONG_TAIL_KEYWORDS = [
  { slug: 'app-gaebal-biyong-julineun-bab', query: '앱 개발 비용 줄이는 법' },
  { slug: 'oeju-gaebal-silphae-an-haneun-bab', query: '외주 개발 실패 안 하는 법' },
  { slug: 'mvp-gaebal-bijeongongja-daehyo', query: '비전공자 대표 MVP 개발' },
  { slug: 'yujibosu-biyong-jeolgam-ai', query: '앱 유지보수 비용 절감 AI' },
  { slug: 'landing-peiji-seo-chamsa', query: '스타트업 랜딩페이지 SEO 참사' },
  { slug: 'flutter-mvp-sijang-gamjeong', query: 'Flutter MVP 시장 검증' },
  { slug: 'hoe-ui-seo-jae-gaebal-sigan', query: '외주 개발사 회의 없이 수정' },
  { slug: 'sosub-gongneung-mvp-beomwi', query: '소수 기능 MVP 범위 정하기' },
  { slug: 'ronching-hu-tekseuteu-byeongyeong', query: '론칭 후 텍스트 변경 외주 없이' },
  { slug: 'gaebal-myeongseo-hwak-in-bangbeob', query: '외주 개발 명세서 확인 방법' },
] as const;

export type LongTailSlug = (typeof LONG_TAIL_KEYWORDS)[number]['slug'];

/** 프로그래매틱 SEO 구조 기획 (실행 가이드) */
export const PROGRAMMATIC_SEO_PLAN = {
  template: 'URL 패턴 /blog/[slug] + generateStaticParams로 전 칼럼 정적 생성',
  dataSource: 'lib/blog-posts.ts (CMS·노션 API로 교체 가능)',
  internalLinking: '홈 패키지·/consultation·관련 서비스 페이지(/앱개발 등)로 상호 링크',
  freshness: '월 1~2편 갱신 시 lastModified 반영 → sitemap priority 조정',
  avoidThinContent: '본문 최소 800자, FAQ 1블록, CTA 2곳 이상',
} as const;
