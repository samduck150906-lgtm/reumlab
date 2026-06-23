import { SITE } from './seo';

/**
 * 포트폴리오 / 사례 데이터 모델 (E-E-A-T "Experience" 신호).
 *
 * 원칙 — 실제로 진행한 프로젝트만 등록한다.
 *  · 가짜 사례·과장된 결과·미동의 스크린샷/실명 금지 (블랙햇).
 *  · 공개 동의를 못 받았으면 consent: 'anonymous' 로 익명화("B2B 예약 플랫폼 MVP" 식).
 *  · result 에는 추정·희망 수치가 아니라 실제 확인된 사실만 적는다.
 *
 * 배열이 비어 있으면 /portfolio 는 noindex 로 나가고, 채워지는 순간 색인된다.
 */
export interface PortfolioItem {
  /** URL 슬러그 (로마자, 케밥케이스) */
  slug: string;
  /** 프로젝트명 (익명 가능) */
  title: string;
  /** 한 줄 요약 */
  summary: string;
  category: 'app' | 'web' | 'ai';
  /** 기술 스택 */
  stack: string[];
  /** 문제 → 해결 → 결과 (사례 페이지 본문 골격) */
  problem: string;
  solution: string;
  result: string;
  /** 산출물 (소스코드/저장소/문서/교육/권한 등) */
  deliverables: string[];
  /** /public 기준 실제 작업 화면 이미지 (없으면 생략) */
  images?: { src: string; alt: string }[];
  durationDays?: number;
  /** ISO 날짜 (YYYY-MM-DD) */
  publishedAt: string;
  /** 공개 동의 상태 — 미동의면 익명 처리 */
  consent?: 'named' | 'anonymous';
}

/*
 * ── 등록 예시 (이 형식 그대로 채우면 사례 페이지·스키마·사이트맵이 자동 생성됩니다) ──
 * {
 *   slug: 'b2b-reservation-mvp',
 *   title: 'B2B 예약 플랫폼 MVP',
 *   summary: '수기 예약을 앱으로 옮겨 노쇼와 응대 시간을 줄인 Flutter MVP',
 *   category: 'app',
 *   stack: ['Flutter', 'Supabase', '관리자 웹'],
 *   problem: '전화·메신저로만 받던 예약이 누락·중복·노쇼로 이어졌다.',
 *   solution: '예약·확정·알림·노쇼 방지 흐름을 핵심 기능만 추려 21일에 출시.',
 *   result: '출시 후 예약 누락 0건, 운영자 응대 시간 하루 약 2시간 절감(고객 확인).',
 *   deliverables: ['Flutter 앱(iOS·Android)', '관리자 웹', '소스코드·저장소·배포 권한 이관', '1:1 운영 교육'],
 *   images: [{ src: '/assets/images/img1.png', alt: 'B2B 예약 플랫폼 관리자 화면' }],
 *   durationDays: 21,
 *   publishedAt: '2026-05-20',
 *   consent: 'anonymous',
 * }
 */
export const PORTFOLIO: PortfolioItem[] = [];

export const hasPortfolio = PORTFOLIO.length > 0;

export function getAllPortfolioSlugs(): string[] {
  return PORTFOLIO.map((p) => p.slug);
}

export function getPortfolioBySlug(slug: string): PortfolioItem | undefined {
  return PORTFOLIO.find((p) => p.slug === slug);
}

export function portfolioCanonical(slug: string): string {
  return `${SITE.domain}/portfolio/${slug}/`;
}
