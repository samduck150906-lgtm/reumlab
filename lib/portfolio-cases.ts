import { SITE } from '@/lib/seo';

export interface PortfolioCase {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  role: string;
  /** 상세 단락 */
  paragraphs: string[];
}

const base = `${SITE.domain}/portfolio`;

export const PORTFOLIO_CASES: PortfolioCase[] = [
  {
    slug: 'gyoyug-chucheon-syupeo-eib',
    title: '교육 추천 슈퍼앱',
    summary: 'PostgreSQL RPC 기반 대규모 매칭, Flutter, Supabase로 안정적인 추천·결제 흐름을 구축했습니다.',
    stack: ['Flutter', 'Supabase', 'PostgreSQL'],
    role: '크로스플랫폼 앱 · 백엔드 연동',
    paragraphs: [
      '대량 데이터 매칭이 핵심인 서비스로, 클라이언트에서 무거운 연산을 하지 않도록 RPC와 인덱스 설계에 집중했습니다.',
      'Flutter 단일 코드베이스로 iOS·Android 동시 출시 일정을 맞추고, 스토어 심사 대응 문구와 권한 흐름을 정리했습니다.',
    ],
  },
  {
    slug: 'jehyu-seobiseu-peulraespom',
    title: '제휴 서비스 플랫폼',
    summary: 'React Native(Expo)와 Next.js, Supabase를 연결한 멀티 클라이언트 구조입니다.',
    stack: ['Expo', 'Next.js', 'Supabase'],
    role: '앱·웹 · 실시간 동기화',
    paragraphs: [
      '제휴사·사용자·관리자 뷰가 분리된 구조로, 공통 도메인 로직을 서버에 두고 클라이언트는 표현 계층에 집중했습니다.',
      '푸시·딥링크·앱 내 웹뷰를 조합해 마케팅 캠페인 전환을 추적할 수 있게 했습니다.',
    ],
  },
  {
    slug: 'koneten-chu-sa-saas',
    title: '콘텐츠 검색·SaaS',
    summary: 'Flutter 클라이언트와 구독 결제, 검색 UX를 결합한 B2C SaaS 형태입니다.',
    stack: ['Flutter', '구독 결제', '검색'],
    role: 'MVP ~ 스케일업',
    paragraphs: [
      '검색 필터와 오프라인 캐시 전략으로 체감 속도를 개선하고, 구독 상태에 따른 기능 게이팅을 명확히 했습니다.',
    ],
  },
  {
    slug: 'gaein-beuraending-peutpolrio',
    title: '개인 브랜딩 포트폴리오 웹',
    summary: '스크롤 인터랙션과 반응형 갤러리로 퍼스널 브랜드를 강조한 정적 중심 웹입니다.',
    stack: ['Next.js', '반응형', 'SEO'],
    role: '랜딩 · 퍼포먼스',
    paragraphs: [
      'LCP를 고려해 히어로 이미지 최적화와 폰트 로딩 전략을 적용했고, 공유 시 OG 메타를 페이지별로 구성했습니다.',
    ],
  },
  {
    slug: 'd2c-raending-peiji',
    title: 'D2C 랜딩페이지',
    summary: 'AIDA 구조의 카피와 CTA 배치, 전환 이벤트 트래킹을 고려한 단일 목적 페이지입니다.',
    stack: ['Next.js', 'GTM', 'SEO'],
    role: '그로스 랜딩',
    paragraphs: [
      '첫 화면에서 가치 제안을 한 문장으로 고정하고, 사회적 증거·FAQ·하단 CTA를 동일 액션으로 연결했습니다.',
    ],
  },
  {
    slug: 'yeyag-gyeolje-tonghab',
    title: '예약·결제 통합 사이트',
    summary: '타임슬롯, PG 연동, 카카오 알림까지 포함한 예약 비즈니스 웹입니다.',
    stack: ['Next.js', 'PG', '알림'],
    role: '풀스택',
    paragraphs: [
      '예약 충돌 방지와 환불 규칙을 서버에서 강제해, 프론트 조작에 덜 민감한 구조로 설계했습니다.',
    ],
  },
];

export function getPortfolioCaseBySlug(slug: string): PortfolioCase | undefined {
  return PORTFOLIO_CASES.find((c) => c.slug === slug);
}

export function getAllPortfolioSlugs(): string[] {
  return PORTFOLIO_CASES.map((c) => c.slug);
}

export function portfolioCanonical(slug: string): string {
  return `${base}/${slug}/`;
}
