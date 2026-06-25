import { SITE } from './seo';

/**
 * 포트폴리오 / 사례 데이터 모델 (E-E-A-T "Experience" 신호).
 *
 * 원칙 — 실제로 진행한 프로젝트만 등록한다.
 *  · 가짜 사례·과장된 결과·미동의 스크린샷/실명 금지 (블랙햇).
 *  · 공개 동의를 못 받았으면 consent: 'anonymous' 로 익명화("B2B 예약 플랫폼 MVP" 식).
 *  · result 에는 추정·희망 수치가 아니라 실제 확인된 사실만 적는다.
 *    (지어낸 "전환율 20%↑" 류 금지 — 화면/산출물에서 확인되는 범위만 기술)
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
  /** 화면에서 확인되는 핵심 기능·특징 (불릿) */
  highlights?: string[];
  /** /public 기준 실제 작업 화면 이미지 (없으면 생략) */
  images?: { src: string; alt: string }[];
  durationDays?: number;
  /** ISO 날짜 (YYYY-MM-DD) */
  publishedAt: string;
  /** 공개 동의 상태 — 미동의면 익명 처리 */
  consent?: 'named' | 'anonymous';
  /** 상세 페이지 검색 키워드 (메타 keywords) */
  keywords?: string[];
  /** 상세 페이지 title 오버라이드 (없으면 자동 생성) */
  metaTitle?: string;
  /** 상세 페이지 description 오버라이드 (없으면 summary 사용) */
  metaDescription?: string;
}

const CATEGORY_NOUN: Record<PortfolioItem['category'], string> = {
  app: '앱',
  web: '웹',
  ai: 'AI',
};

/**
 * ── 실제 진행 사례 ──
 * 화면(랜딩/앱)에서 확인되는 기능·구성·산출물만 사실대로 기술한다.
 * 운영 수치(매출/전환율 등)는 고객 확인 전까지 적지 않는다.
 */
export const PORTFOLIO: PortfolioItem[] = [
  {
    slug: 'academy-matching-app',
    title: '우리 아이 맞춤 학원 — 학원 검색·결제 앱',
    summary:
      '과목·지역·수강료·평점을 조건별로 검색하고, 결제 인증 리뷰만 모아 보고, 앱 안에서 수강료까지 결제하는 학부모용 학원 매칭 앱. 원장이 ERP에 등록한 학원 정보가 학부모 앱에 실시간 반영됩니다.',
    category: 'app',
    stack: ['Flutter (iOS·Android)', '앱 내 결제', '출결·수납 ERP 연동', '관리자 웹'],
    problem:
      '학부모는 입소문과 근거리만으로 학원을 고르다 보니 아이에게 맞는 학원을 놓치기 쉬웠고, 허위·과장 리뷰까지 섞여 신뢰하기 어려웠습니다. 원장은 ERP에 등록한 학원 정보를 학부모에게 실시간으로 보여 줄 채널이 없었습니다.',
    solution:
      '과목·지역·수강료·평점 조건 검색, 결제를 인증한 후기만 노출하는 “결제 인증 리뷰”(허위 리뷰 차단), 앱 내 수강료 결제, 그리고 원장이 ERP에 등록한 정보를 학부모 앱에 실시간 반영하는 흐름을 핵심 기능으로 설계했습니다. 출결·수납 ERP와 학부모 앱을 한 줄기로 연결한 것이 핵심입니다.',
    result:
      '학부모는 조건으로 학원을 비교하고 결제까지 앱 하나로 끝낼 수 있고, 원장은 ERP에 한 번 등록한 정보가 학부모 앱에 그대로 노출됩니다. Android·iOS 동시 출시를 목표로 사전등록 단계까지 진행했습니다.',
    deliverables: [
      'Flutter 앱 (Android·iOS 단일 코드)',
      '원장용 출결·수납 ERP / 관리자',
      '앱 내 결제·결제 인증 리뷰 로직',
      '소스코드·저장소·배포 권한 전체 이관',
    ],
    highlights: [
      '과목·지역·수강료·평점 조건별 검색',
      '결제 인증 리뷰 — 허위 후기 0%를 지향',
      '앱 내 수강료 결제',
      '출결·수납 ERP ↔ 학부모 앱 실시간 연동',
    ],
    keywords: [
      '학원 추천 앱',
      '학원 매칭 앱 개발',
      '학원 결제 앱',
      '교육 앱 개발 사례',
      '학원 ERP 연동 앱',
      'Flutter 앱개발 사례',
    ],
    publishedAt: '2026-06-05',
    consent: 'named',
  },
  {
    slug: 'ute-studio-rental',
    title: '우트스튜디오 — 무인 렌탈스튜디오 랜딩페이지',
    summary:
      '수원 영통의 30평 단독 자연광 촬영공간을 사진·가격표·이용안내·FAQ로 정리하고, 카카오톡·문자 예약으로 바로 연결하는 무인 렌탈스튜디오 랜딩페이지. 름랩 대표가 직접 운영하는 매장입니다.',
    category: 'web',
    stack: ['반응형 웹', '검색 노출 기본 세팅', '카카오톡·문자 예약 연결'],
    problem:
      '쇼핑몰·의류·뷰티 사장님들은 매번 비싼 촬영공간 대여료에 부담을 느꼈지만, 정작 공간·가격·예약 방법을 한 곳에서 명확히 보여 주는 채널이 없었습니다.',
    solution:
      '대표 공간·소파/테이블 등 공간 사진, 가격표, 이용안내, FAQ를 검색에 잘 잡히는 구조로 정리하고, 별도 예약 시스템 없이 카카오톡·문자로 바로 예약을 받도록 단일 랜딩으로 제작했습니다.',
    result:
      '공간 소개부터 예약 문의까지 한 페이지에서 끝나고, 네이버 플레이스와 함께 검색에서 매장이 노출됩니다. 개발자 본인이 직접 운영하며 검색 노출을 만들어 본 매장입니다.',
    deliverables: [
      '반응형 랜딩페이지',
      '검색 노출(메타·구조화 데이터·사이트맵) 기본 세팅',
      '소스코드 전체 이관',
    ],
    highlights: [
      '30평 단독 자연광 공간 사진 구성',
      '가격표·이용안내·FAQ 한 페이지 정리',
      '카카오톡·문자 예약 바로 연결',
      '검색 노출을 고려한 단일 랜딩 구조',
    ],
    keywords: [
      '렌탈스튜디오 홈페이지',
      '촬영공간 대여 랜딩페이지',
      '무인 스튜디오 예약 페이지',
      '수원 영통 스튜디오',
      '소상공인 홈페이지 제작 사례',
    ],
    publishedAt: '2026-05-12',
    consent: 'named',
  },
  {
    slug: 'ai-handler',
    title: 'AI Handler — 역할별 프롬프트 엔진 앱',
    summary:
      '마케터·콘텐츠 크리에이터 등 “어떤 목적으로 AI를 쓰는가(모드)”를 고르면, 역할에 맞는 프롬프트 엔진과 AI 툴 허브가 자동으로 연결되는 AI 핸들러 앱.',
    category: 'ai',
    stack: ['Flutter', 'LLM·AI 툴 연동', '역할별 프롬프트 엔진'],
    problem:
      'AI를 쓰고 싶어도 역할마다 어떤 프롬프트와 도구를 조합해야 할지 막막했습니다. 매번 프롬프트를 새로 짜는 일 자체가 진입 장벽이었습니다.',
    solution:
      '“MARKETER” 같은 모드를 고르면 후킹 카피·광고문구 자동 생성, 타겟/채널별 맞춤 프롬프트, 인스타·유튜브·블로그 최적화까지 한 흐름으로 이어지도록 설계했습니다. 좌우 스와이프로 역할을 바꾸면 그에 맞는 프롬프트 엔진과 툴 허브가 자동으로 붙습니다.',
    result:
      '사용자는 프롬프트를 직접 설계할 필요 없이, 목적(모드)만 고르면 역할 맞춤 프롬프트와 도구가 자동으로 연결되는 흐름을 손에 넣었습니다.',
    deliverables: [
      '앱 UI / 역할 선택(모드) UX',
      '역할별 프롬프트 엔진·AI 툴 허브 연동',
      '소스코드·권한 이관',
    ],
    highlights: [
      '목적(모드) 선택형 UX — 좌우 스와이프 역할 전환',
      '후킹 카피·광고문구 자동 생성',
      '타겟/채널별 맞춤 프롬프트',
      '인스타·유튜브·블로그 최적화 흐름',
    ],
    keywords: [
      'AI 앱 개발 사례',
      '프롬프트 엔진 앱',
      'AI 핸들러',
      'LLM 앱 외주개발',
      'AI 기능 개발 사례',
    ],
    publishedAt: '2026-05-28',
    consent: 'named',
  },
  {
    slug: 'marbee-marketer-matching',
    title: 'Marbee — 마케터 매칭 플랫폼',
    summary:
      '프로젝트 공고를 한 번 올리면 검증된 마케터들의 맞춤 제안서가 도착하고, 사장님은 편하게 비교·선택만 하면 되는 마케팅 외주 매칭 플랫폼.',
    category: 'web',
    stack: ['웹 풀스택', '데이터베이스', '제안서·매칭 관리', '관리자'],
    problem:
      '사장님은 마케터를 찾으려 일일이 발품을 팔아야 했고, 받은 제안을 객관적으로 비교할 기준도 마땅치 않았습니다.',
    solution:
      '프로젝트(공고) 등록 → 검증된 마케터의 맞춤 제안서 도착 → 비교·선택으로 이어지는 흐름을 설계했습니다. 마케터 등록·검색, 제안서 관리까지 갖춰 의뢰자와 마케터 양쪽을 잇는 양면 매칭 구조로 만들었습니다.',
    result:
      '발품 없이 공고 등록만으로 여러 제안서를 받아 비교·선택할 수 있고, 매칭까지 별도 수수료가 발생하지 않는 구조로 운영됩니다.',
    deliverables: [
      '양면 매칭 웹 플랫폼(프로젝트·마케터·제안서)',
      '마케터 등록·검증·검색',
      '관리자 / 운영 도구',
      '소스코드·권한 이관',
    ],
    highlights: [
      '프로젝트 공고 등록 → 맞춤 제안서 도착',
      '검증된 마케터 등록·검색',
      '제안서 비교·선택 흐름',
      '수수료 0원 매칭 구조',
    ],
    keywords: [
      '매칭 플랫폼 개발',
      '마케터 매칭 플랫폼',
      '외주 매칭 플랫폼 개발 사례',
      '양면 마켓플레이스 MVP',
      '웹 플랫폼 제작 사례',
    ],
    publishedAt: '2026-06-12',
    consent: 'named',
  },
];

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

/** 상세 페이지 메타 title (오버라이드 없으면 자동 생성) */
export function portfolioMetaTitle(p: PortfolioItem): string {
  if (p.metaTitle) return p.metaTitle;
  return `${p.title} — 앱·웹 개발 사례 | 름랩 REUMLAB`;
}

/** 상세 페이지 메타 description */
export function portfolioMetaDescription(p: PortfolioItem): string {
  return p.metaDescription ?? p.summary;
}

/** 카테고리 한글 라벨 */
export function portfolioCategoryLabel(category: PortfolioItem['category']): string {
  return CATEGORY_NOUN[category];
}
