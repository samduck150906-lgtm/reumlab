import { SITE } from '@/lib/seo';

export interface PortfolioCase {
  slug: string;
  title: string;
  /** 목록 카드용 한 줄 요약 */
  summary: string;
  /** NDA 대응: 익명 클라이언트 표기 (예: '교육 분야 스타트업') */
  clientLabel: string;
  /** 한 줄 문제정의 */
  problem: string;
  /** 우리가 만든 것 */
  built: string;
  /** 사용 기술 */
  stack: string[];
  role: string;
  /**
   * 결과. 측정 지표가 확보되기 전까지는 '지어낸 숫자' 대신
   * 실제로 납품·구현한 사실만 정직하게 적습니다.
   * (수치형 KPI는 고객 동의·측정 후 채울 자리 — docs/marketing 참고)
   */
  result: string;
  /** 고객 후기 1줄. 확보 전에는 undefined (가짜 후기 금지) */
  clientNote?: string;
  /** 상세 단락 */
  paragraphs: string[];
}

const base = `${SITE.domain}/portfolio`;

export const PORTFOLIO_CASES: PortfolioCase[] = [
  {
    slug: 'gyoyug-chucheon-syupeo-eib',
    title: '교육 추천 슈퍼앱',
    summary: '대규모 매칭·추천·결제 흐름을 담은 Flutter 크로스플랫폼 앱.',
    clientLabel: '교육 분야 스타트업 (NDA)',
    problem: '대량 데이터를 추천·매칭해야 하는데, 앱이 무거워지고 양대 스토어 동시 출시 일정이 빠듯했습니다.',
    built: 'PostgreSQL RPC 기반 매칭 엔진과 Flutter 단일 코드베이스로 추천·결제 흐름을 갖춘 슈퍼앱.',
    stack: ['Flutter', 'Supabase', 'PostgreSQL'],
    role: '크로스플랫폼 앱 · 백엔드 연동',
    result: 'iOS·Android를 단일 코드베이스로 동시 출시. 무거운 연산을 서버 RPC로 옮겨 클라이언트 부담을 낮춤.',
    paragraphs: [
      '대량 데이터 매칭이 핵심인 서비스로, 클라이언트에서 무거운 연산을 하지 않도록 RPC와 인덱스 설계에 집중했습니다.',
      'Flutter 단일 코드베이스로 iOS·Android 동시 출시 일정을 맞추고, 스토어 심사 대응 문구와 권한 흐름을 정리했습니다.',
    ],
  },
  {
    slug: 'jehyu-seobiseu-peulraespom',
    title: '제휴 서비스 플랫폼',
    summary: '제휴사·사용자·관리자 뷰가 분리된 앱·웹 멀티 클라이언트 구조.',
    clientLabel: '제휴 마케팅 플랫폼 (NDA)',
    problem: '제휴사·사용자·관리자가 같은 데이터를 다르게 봐야 하고, 캠페인 전환을 추적할 방법이 필요했습니다.',
    built: 'React Native(Expo) 앱과 Next.js 웹, Supabase 백엔드를 묶은 역할별 멀티 클라이언트 플랫폼.',
    stack: ['Expo', 'Next.js', 'Supabase'],
    role: '앱·웹 · 실시간 동기화',
    result: '공통 도메인 로직을 서버에 통합해 중복 제거. 푸시·딥링크로 캠페인 유입~전환을 한 흐름으로 추적 가능하게 구성.',
    paragraphs: [
      '제휴사·사용자·관리자 뷰가 분리된 구조로, 공통 도메인 로직을 서버에 두고 클라이언트는 표현 계층에 집중했습니다.',
      '푸시·딥링크·앱 내 웹뷰를 조합해 마케팅 캠페인 전환을 추적할 수 있게 했습니다.',
    ],
  },
  {
    slug: 'koneten-chu-sa-saas',
    title: '콘텐츠 검색·SaaS',
    summary: '구독 결제와 검색 UX를 결합한 Flutter 기반 B2C SaaS.',
    clientLabel: '콘텐츠 SaaS 스타트업 (NDA)',
    problem: '검색 체감 속도가 느리고, 구독 여부에 따라 기능을 명확히 나눌 구조가 없었습니다.',
    built: '검색 필터·오프라인 캐시와 구독 상태 기반 기능 게이팅을 갖춘 Flutter SaaS 앱.',
    stack: ['Flutter', '구독 결제', '검색'],
    role: 'MVP ~ 스케일업',
    result: '오프라인 캐시 전략으로 체감 검색 속도 개선. 구독 상태에 따른 기능 게이팅을 명확히 분리.',
    paragraphs: [
      '검색 필터와 오프라인 캐시 전략으로 체감 속도를 개선하고, 구독 상태에 따른 기능 게이팅을 명확히 했습니다.',
    ],
  },
  {
    slug: 'gaein-beuraending-peutpolrio',
    title: '개인 브랜딩 포트폴리오 웹',
    summary: '스크롤 인터랙션과 반응형 갤러리 중심의 퍼스널 브랜드 웹.',
    clientLabel: '1인 크리에이터 (NDA)',
    problem: '퍼스널 브랜드를 보여줄 웹이 필요했고, 공유 시 링크 미리보기와 로딩 속도가 중요했습니다.',
    built: 'Next.js 정적 중심으로 만든 반응형 포트폴리오 웹. 스크롤 인터랙션과 페이지별 OG 메타 구성.',
    stack: ['Next.js', '반응형', 'SEO'],
    role: '랜딩 · 퍼포먼스',
    result: 'LCP를 고려한 히어로 이미지·폰트 로딩 최적화 적용. 페이지별 OG 메타로 공유 미리보기 정비.',
    paragraphs: [
      'LCP를 고려해 히어로 이미지 최적화와 폰트 로딩 전략을 적용했고, 공유 시 OG 메타를 페이지별로 구성했습니다.',
    ],
  },
  {
    slug: 'd2c-raending-peiji',
    title: 'D2C 랜딩페이지',
    summary: 'AIDA 구조 카피와 전환 트래킹을 고려한 단일 목적 랜딩.',
    clientLabel: 'D2C 브랜드 (NDA)',
    problem: '광고 유입을 한 페이지에서 전환으로 연결하고, 어디서 이탈하는지 측정할 구조가 필요했습니다.',
    built: '가치 제안을 한 문장으로 고정하고 사회적 증거·FAQ·CTA를 하나의 액션으로 잇는 D2C 랜딩.',
    stack: ['Next.js', 'GTM', 'SEO'],
    role: '그로스 랜딩',
    result: 'GTM 기반 전환 이벤트 트래킹을 붙여 유입 대비 행동을 측정 가능하게 구성.',
    paragraphs: [
      '첫 화면에서 가치 제안을 한 문장으로 고정하고, 사회적 증거·FAQ·하단 CTA를 동일 액션으로 연결했습니다.',
    ],
  },
  {
    slug: 'yeyag-gyeolje-tonghab',
    title: '예약·결제 통합 사이트',
    summary: '타임슬롯·PG 연동·카카오 알림을 포함한 예약 비즈니스 웹.',
    clientLabel: '오프라인 예약 비즈니스 (NDA)',
    problem: '예약이 겹치거나 환불 규칙이 흔들리면 바로 매출·신뢰 문제로 이어지는 구조였습니다.',
    built: '타임슬롯 예약, PG 결제, 카카오 알림을 통합하고 충돌 방지·환불 규칙을 서버에서 강제한 풀스택 웹.',
    stack: ['Next.js', 'PG', '알림'],
    role: '풀스택',
    result: '예약 충돌 방지와 환불 규칙을 서버에서 강제해 프론트 조작에 덜 민감한 구조로 설계.',
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
