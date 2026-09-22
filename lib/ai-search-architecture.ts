/**
 * AI Search Architecture — 기존 홈페이지 검색 구조 개선
 * 라우트: /ai-search-optimization/
 * ------------------------------------------------------------------
 * 왜 별도 페이지인가 — /geo-website/ 와의 역할 분리
 *
 *  /geo-website/ 는 "GEO 홈페이지 제작" 이다. 신규 제작이 주 축이고 기존 사이트 개선을
 *  선택지 중 하나로 안내한다. 이 페이지는 반대로 **이미 운영 중인 홈페이지만** 대상으로 하는
 *  고가 B2B 개선 상품이다. 진단으로 끝내지 않고 합의한 페이지·템플릿을 실제 코드에 반영하고
 *  변경 내역·QA·운영 문서까지 넘긴다.
 *
 *  두 페이지는 서로 삭제·canonical 통합하지 않고 문맥 링크로 연결한다.
 *  /data-seo/ 는 데이터 수집·자동화 시스템 구축 역할을 그대로 유지한다 —
 *  이 페이지를 대량 SEO 페이지 생성 상품으로 설명하지 않는다.
 *
 * 이 파일의 역할
 *  가격·범위·기간·FAQ·폼 선택값·구조화 데이터가 **전부 여기서 파생**된다.
 *  화면과 schema 가 갈리지 않도록 숫자를 다른 곳에 다시 쓰지 않는다.
 *
 * 콘텐츠 원칙 (고칠 때 반드시 지킬 것)
 *  - 근거 없는 점수·순위·백분위(상위 1%, GEO 9점 …), 검색 순위·AI 추천 보장 표현 금지.
 *  - 확인되지 않은 고객 수·상담 건수·매출·ROI·수상·인증·협력사 금지.
 *  - 가짜 ChatGPT/Gemini 답변 화면, 신규 후기·고객 로고·파트너 배지 금지.
 *  - 무제한·절대 표현(사이트 전체 개선, 무제한 수정, 평생 유지보수, 100% 보존) 금지.
 *  - GPTBot 허용이나 llms.txt 추가만으로 학습·추천·노출이 보장된다고 설명하지 않는다.
 *  - 자체 구축 경험은 "구현 경험"으로만 쓰고 검색 개선 "성과"로 바꾸지 않는다.
 */
import { decideFromContent, type IndexDecision } from './index-quality';
import { SITE } from './seo';

export const AISA_PATH = '/ai-search-optimization/';
export const AISA_CANONICAL = `${SITE.domain}${AISA_PATH}`;

/** 서비스 데이터 식별자 — 폼·분석 이벤트·schema 에서 같은 값을 쓴다 */
export const AISA_SERVICE_ID = 'ai-search-architecture';

export const AISA_PRODUCT_NAME_EN = 'AI Search Architecture';
export const AISA_PRODUCT_NAME_KO = '기존 홈페이지 검색 구조 개선';
export const AISA_MENU_LABEL = 'AI 검색 구조 개선';

// ── 메타 ──────────────────────────────────────────────────────
export const AISA_TITLE = '기존 홈페이지 AI 검색 최적화 | SEO·GEO·AEO 구조 개선 · 름랩';

export const AISA_DESCRIPTION =
  '기존 홈페이지의 URL과 콘텐츠를 점검하고 SEO·GEO·AEO·네이버 검색 대응을 실제 코드에 반영합니다. 기술 진단부터 질문·근거·문의 구조 개선과 검수까지. VAT 포함 250만 원부터, 범위 확인 후 견적을 안내합니다.';

export const AISA_KEYWORDS = [
  '기존 홈페이지 SEO 개선',
  'AI 검색 최적화',
  'GEO 최적화',
  'AEO 구조 개선',
  '네이버 웹검색 최적화',
  '홈페이지 구조 개선 컨설팅',
  'B2B 사이트 검색 개선',
];

/**
 * 공유 카드 — public/og-ai-search-architecture.jpg (1200×630, 실제 파일).
 * 원본은 scripts/og/ai-search-architecture.html 이고 헤드리스 크로미움으로 렌더한다.
 * PNG 로 뽑으면 그라데이션 때문에 380KB 가 넘어 기존 og-image.jpg(23KB) 관례와 어긋난다
 * → 같은 JPEG 관례를 따라 품질 88 로 저장(43KB).
 */
export const AISA_OG_IMAGE = `${SITE.domain}/og-ai-search-architecture.jpg`;

// ── 7-2. Hero ────────────────────────────────────────────────
export const HERO = {
  eyebrow: 'REUMLAB · AI SEARCH ARCHITECTURE',
  /** H1 은 두 줄 고정 — 폰트가 늦게 적용돼도 줄 수가 뒤집히지 않게 한다 */
  h1Lines: ['기존 홈페이지에,', '검색과 AI가 이해할 구조를 더합니다.'],
  sub: 'SEO·GEO·AEO와 네이버 웹검색 대응을, 실제 코드와 콘텐츠에 반영합니다.',
  body: '홈페이지를 새로 만드는 대신, 유지할 URL과 콘텐츠부터 확인합니다. 검색 접근성, 서비스 설명, 고객 질문, 검증 가능한 근거와 문의 동선을 정리하고 변경 내역까지 검수해 전달합니다.',
  ctaPrimary: { label: '우리 홈페이지 개선 상담하기', href: '#inquiry' },
  ctaSecondary: { label: '범위와 비용 확인하기', href: '#pricing' },
  priceNote: '250만 원부터 · VAT 포함 · 범위 확인 후 최종 견적',
  trust: ['기존 자산 우선 점검', '코드 직접 반영', '변경 내역·QA 전달'],
} as const;

/** 히어로 구조도 — 실제 AI 추천 화면이 아니라 "구조 예시" 임을 라벨로 밝힌다 */
export const HERO_FLOW = [
  { key: 'site', label: '기존 사이트', detail: '유지할 URL·콘텐츠' },
  { key: 'access', label: '검색 접근성', detail: '렌더링·색인·canonical' },
  { key: 'answer', label: '설명·질문', detail: '서비스 범위·FAQ' },
  { key: 'evidence', label: '근거', detail: '출처·사례·수행 범위' },
  { key: 'contact', label: '문의·측정', detail: 'CTA·접수·관찰' },
] as const;

// ── 7-1. 페이지 내 목차 ───────────────────────────────────────
export const TOC = [
  { id: 'scope', label: '개선 범위' },
  { id: 'example', label: '적용 예시' },
  { id: 'pricing', label: '비용' },
  { id: 'process', label: '진행 방식' },
  { id: 'faq', label: '자주 묻는 질문' },
] as const;

// ── 7-3. 서비스 한눈에 보기 ───────────────────────────────────
export const SUMMARY = {
  heading: 'AI Search Architecture는 어떤 서비스인가요?',
  answer:
    '이미 운영 중인 홈페이지를 대상으로 검색·답변·브랜드 정보 구조를 진단하고, 필요한 변경을 실제 웹사이트에 적용하는 서비스입니다. 단순 설정이나 보고서 제공을 넘어, 합의한 페이지와 템플릿을 수정하고 문의·검수·운영 기준까지 정리합니다.',
  facts: [
    { k: '대상', v: '운영 중인 기업·브랜드 홈페이지' },
    { k: '방식', v: '기존 자산 점검 → 범위 확정 → 구현 → 검수' },
    { k: '비용', v: '250만·390만·690만 원부터, VAT 포함' },
    { k: '납품', v: '적용 코드·콘텐츠·변경 내역·QA·운영 문서' },
  ],
} as const;

// ── 7-4. 적합 / 부적합 ────────────────────────────────────────
export const FIT = {
  heading: '이런 상태라면, 새로 만들기 전에 구조부터 점검하세요.',
  items: [
    '사이트는 있지만 제공 서비스·가격·진행 방식 설명이 흩어진 기업',
    '광고와 소개 외에 검색을 통한 문의 기반을 키우려는 B2B 업체',
    '디자인은 유지하면서 중요 페이지와 문의 흐름을 개선하려는 브랜드',
    '회사 정보·사례·FAQ가 서로 맞지 않아 정리가 필요한 서비스',
  ],
  notFit:
    '단기간 1위, AI 추천 보장, 대량 백링크, 기사·후기 조작을 원하시는 경우에는 적합하지 않습니다.',
} as const;

// ── 7-5. 무엇을 실제로 바꾸는가 (문제 → 작업 → 납품) ──────────
export interface ScopeArea {
  key: string;
  title: string;
  problem: string;
  work: string;
  deliverable: string;
}

export const SCOPE_AREAS: readonly ScopeArea[] = [
  {
    key: 'access',
    title: '검색 접근성',
    problem: '본문이 늦게 그려지거나 색인 지시·canonical·사이트맵이 서로 어긋나 검색엔진이 페이지를 제대로 읽지 못합니다.',
    work: '렌더링 방식과 응답, 색인 지시, 대표 URL, 사이트맵 등록 상태를 점검하고 합의한 항목을 코드에 반영합니다.',
    deliverable: '점검표와 합의한 코드 변경 내역',
  },
  {
    key: 'brand',
    title: '브랜드·서비스 정보',
    problem: '회사명·서비스 범위·지역·연락처가 페이지마다 다르게 적혀 있어 무엇이 맞는 정보인지 판단하기 어렵습니다.',
    work: '공개 가능한 사실을 기준으로 정보 원본을 하나로 정리하고, 화면 내용과 맞는 구조화 데이터를 적용합니다.',
    deliverable: '정리된 정보 원본과 적절한 구조화 데이터',
  },
  {
    key: 'answer',
    title: '질문과 답변',
    problem: '대상 고객·제공 범위·비용 조건·기간이 본문에 없어 방문자가 문의 전에 판단할 수 없습니다.',
    work: '실제로 많이 묻는 질문을 기준으로 기존 페이지의 설명과 FAQ를 정비합니다.',
    deliverable: '기존 페이지의 설명 개선과 FAQ 정비본',
  },
  {
    key: 'evidence',
    title: '근거와 사례',
    problem: '주장은 있는데 그 옆에 확인할 수 있는 출처·사례·실제 수행 범위가 붙어 있지 않습니다.',
    work: '공개 가능한 자료를 주장 가까이에 연결하고, 무엇까지 공개할지 표시 기준을 정합니다.',
    deliverable: '확인 가능한 증거 연결과 표시 기준',
  },
  {
    key: 'link',
    title: '페이지 간 연결',
    problem: '관련 서비스·비교·사례·문의가 서로 이어지지 않아 방문자가 다음 단계로 넘어가지 못합니다.',
    work: '검토 흐름에 맞게 내부 링크와 탐색 순서를 다시 배치합니다.',
    deliverable: '내부 링크 구조와 탐색 흐름 정리안',
  },
  {
    key: 'measure',
    title: '문의와 관찰',
    problem: 'CTA 클릭·폼 시작·실제 접수가 구분되지 않아 무엇이 문의를 만들었는지 알 수 없습니다.',
    work: '기존 분석 환경에서 이벤트를 구분해 정의하고, 검색형 AI 관찰은 조건과 한계를 함께 정합니다.',
    deliverable: '이벤트 정의서와 측정 조건·한계 문서',
  },
] as const;

export const SCOPE_NOTE =
  '모든 항목이 모든 사이트에서 똑같이 필요하지는 않습니다. 현재 상태를 확인한 뒤 계약 범위에 따라 적용할 항목을 정합니다.';

// ── 7-6. 적용 전후 구조 예시 ──────────────────────────────────
export const BEFORE_AFTER = {
  heading: '같은 회사 소개도, 검토에 필요한 정보가 보이도록.',
  label: '정보 구조 예시 · 실제 고객 성과나 AI 추천 결과가 아닙니다',
  before: {
    title: '정리 전 예시',
    lines: ['좋은 서비스를 제공합니다.', '회사 소개 / 사진 / 문의하기'],
    note: '대상 고객·제공 범위·제외 항목·비용 조건·근거가 서로 연결되지 않은 상태',
  },
  after: {
    title: '정리 후 예시',
    lines: [
      '어떤 고객의 어떤 문제를 해결하는지',
      '제공 범위와 하지 않는 일',
      '가격에 영향을 주는 조건',
      '실제 작업 과정과 공개 가능한 근거',
      '자주 묻는 질문과 다음 상담 단계',
    ],
  },
} as const;

// ── 7-7. 름랩의 구현 방식 ─────────────────────────────────────
export const HOW_WE_WORK = {
  heading: '보고서로 끝내지 않고, 반영한 결과까지 전달합니다.',
  body: '진단에서 확인한 문제를 그대로 개발자에게 넘기지 않습니다. 합의한 범위는 름랩이 직접 구현하고, 바뀐 파일·페이지·검수 결과를 연결해 전달합니다. 고객의 코드와 콘텐츠를 다른 담당자가 이어받을 수 있는 상태까지 정리합니다.',
  deliverables: ['현황 진단', '우선순위 맵', '구현 변경 내역', '기술 QA', '운영 가이드'],
} as const;

/** 관련 있는 공개 사례만 연결한다. 썸네일·실적 수치·후기를 새로 만들지 않는다. */
export const RELATED_CASE_IDS = ['pseo-engine', 'gov-search', 'quote-doc'] as const;
export const RELATED_CASE_NOTE =
  '공개된 실제 구축 사례 중 검색 구조·정보 탐색·문서 데이터 정리와 직접 관련된 것만 연결했습니다. 검색 순위나 AI 추천 개선 성과로 바꾸어 표현하지 않습니다.';

// ── 7-8. 기존 검색 자산 보호 ──────────────────────────────────
export const PRESERVATION = {
  heading: '잘 작동하는 부분은 남기고, 변경이 필요한 부분을 구분합니다.',
  steps: [
    { no: '01', title: '현재 URL·콘텐츠 기록', detail: '지금 공개된 주소와 주요 본문을 먼저 기록합니다.' },
    { no: '02', title: '유지/개선 범위 구분', detail: '그대로 둘 것과 바꿀 것을 나눠 계약 범위로 확정합니다.' },
    { no: '03', title: '테스트 환경 검증', detail: '운영에 올리기 전에 같은 조건에서 확인합니다.' },
    { no: '04', title: '변경 내역·복구 기준 전달', detail: '무엇을 왜 바꿨는지와 되돌리는 방법을 함께 넘깁니다.' },
  ],
  note: '기존 URL과 주요 콘텐츠를 임의로 없애지 않습니다. 주소 변경이 필요한 경우에는 별도 합의와 이전 계획을 세웁니다. 검색 결과 자체를 고정할 수는 없으므로, 기술적 회귀 점검과 이후 관찰을 구분해 진행합니다.',
} as const;

// ── 7-9. 적용 가능 환경 ───────────────────────────────────────
export const PLATFORMS = [
  { env: '소스·배포 권한이 있는 코드 기반 사이트', scope: '구현 구조를 검토해 합의 범위를 직접 수정합니다.' },
  { env: 'WordPress 등 CMS', scope: '테마·플러그인·관리자 권한에 따라 적용 범위를 정합니다.' },
  { env: '아임웹·카페24·Wix 등 호스팅형 빌더', scope: '플랫폼이 허용하는 메타·콘텐츠·코드 삽입·URL 제어 범위 안에서 진행합니다.' },
  { env: '타 업체 소유·접근 권한 미확보·폐쇄형 시스템', scope: '먼저 권한과 변경 가능 범위를 확인한 뒤 가능한 범위를 안내합니다.' },
] as const;

export const PLATFORM_NOTE =
  '플랫폼마다 수정할 수 있는 항목이 다릅니다. 모든 환경에서 동일하게 전면 수정할 수 있다고 보장하지 않으며, 확인이 필요한 기능은 조건부로 안내합니다.';

// ── 4. 패키지 (가격·범위 단일 원본) ───────────────────────────
export interface AisaPackage {
  id: 'start' | 'growth' | 'enterprise';
  /** 폼·분석 이벤트에서 쓰는 비식별 enum */
  value: 'START' | 'GROWTH' | 'ENTERPRISE';
  name: string;
  tagline: string;
  /** VAT 포함 시작가(원) */
  priceWon: number;
  duration: string;
  target: string;
  recommended?: boolean;
  /** 비교표 수치 — 진단 URL 과 실제 수정 페이지는 다른 개념이다 */
  auditUrls: number;
  editPages: number;
  templates: number;
  includes: readonly string[];
  /** 이 패키지에서 명시적으로 제외되는 범위 */
  excludes?: readonly string[];
}

export const PACKAGES: readonly AisaPackage[] = [
  {
    id: 'start',
    value: 'START',
    name: 'START · 검색 기반 정비',
    tagline: '핵심 서비스가 명확하고 우선 개선할 페이지가 적은 기존 홈페이지',
    priceWon: 2_500_000,
    duration: '약 2주 · 자료와 접근 권한 수령 후, 범위 확정 기준',
    target: '핵심 서비스가 명확하고 우선 개선할 페이지가 적은 기존 홈페이지.',
    auditUrls: 100,
    editPages: 3,
    templates: 1,
    includes: [
      '단일 도메인·한국어 사이트 1개',
      '공개 HTML 최대 100 URL 표본·범위 내 기술 진단',
      '계약으로 지정한 핵심 페이지 최대 3개 실제 개선',
      '공통 페이지 템플릿 최대 1종의 합의된 검색 구조 개선',
      'title·description·canonical·색인 가능성·내부 링크 점검 및 합의 항목 적용',
      '필요한 구조화 데이터와 브랜드·서비스 기본 정보 정리',
      '네이버 웹검색을 위한 기본 접근성·사이트맵 점검',
      '핵심 페이지의 질문·답변 및 문의 동선 개선',
      '변경 내역, 빌드·기술 QA 기록, 운영 인수인계 문서',
    ],
    excludes: [
      '신규 사이트 제작',
      '도메인 이전',
      '로그인 영역',
      '앱 내부',
      '신규 CMS·DB',
      '대량 원고 생산',
      '지속 모니터링',
    ],
  },
  {
    id: 'growth',
    value: 'GROWTH',
    name: 'GROWTH · 검색·답변·문의 통합',
    tagline: '여러 서비스의 설명과 고객 질문·근거·문의 흐름을 함께 정리할 B2B 홈페이지',
    priceWon: 3_900_000,
    duration: '약 3~4주 · 자료와 접근 권한 수령 후, 범위 확정 기준',
    target: '여러 서비스의 설명과 고객 질문·근거·문의 흐름을 함께 정리할 B2B 홈페이지.',
    recommended: true,
    auditUrls: 300,
    editPages: 7,
    templates: 2,
    includes: [
      '단일 도메인·한국어 사이트 1개',
      '공개 HTML 최대 300 URL 기술 진단',
      '계약으로 지정한 핵심 페이지 최대 7개 실제 개선',
      '공통 템플릿 최대 2종의 합의된 검색 구조 개선',
      'START의 기본 진단·적용·검수 항목',
      '고객 질문·검색 의도와 기존 URL을 연결하는 우선순위 맵',
      '서비스·회사·사례를 연결하는 정보 구조 및 내부 링크 정리',
      '제공 자료 기반 핵심 페이지 문구·FAQ 정비',
      '공개 가능한 근거와 관련 주장 연결',
      '기존 분석 환경을 활용한 CTA·폼 시작·접수 이벤트 정리',
      '비브랜드 질문 최대 20개, 접근 가능한 검색형 AI 서비스 최대 2곳의 기준선 관찰 1회',
      '변경 전후 기술 검증표와 다음 운영 우선순위',
    ],
  },
  {
    id: 'enterprise',
    value: 'ENTERPRISE',
    name: 'ENTERPRISE · 복합 사이트 구조 개선',
    tagline: '서비스·콘텐츠 유형이 많고 여러 템플릿의 일관성과 운영 기준이 필요한 사이트',
    priceWon: 6_900_000,
    duration: '약 4~6주 · 기술 구조와 범위 확정 후 안내',
    target: '서비스·콘텐츠 유형이 많고 여러 템플릿의 일관성과 운영 기준이 필요한 사이트.',
    auditUrls: 1000,
    editPages: 12,
    templates: 3,
    includes: [
      '단일 도메인·한국어 사이트 1개',
      '공개 HTML 최대 1,000 URL 기술 진단',
      '계약으로 지정한 핵심 페이지 최대 12개 실제 개선',
      '공통 템플릿 최대 3종의 합의된 검색 구조 개선',
      'GROWTH의 진단·적용·검수 항목',
      '콘텐츠 유형별 서비스·사례·FAQ 운영 템플릿',
      '브랜드·서비스 데이터의 단일 출처와 구조화 데이터 일관성 설계',
      '90일 측정·콘텐츠 운영 계획서 (90일 유지보수나 실측 대행이 자동 포함되지는 않습니다)',
      '비브랜드 질문 최대 30개, 접근 가능한 검색형 AI 서비스 최대 3곳의 기준선 관찰 1회',
      '우선 개선 페이지의 문의·표시 성능 점검',
      '변경 범위별 QA, 배포·복구·인수인계 문서',
    ],
  },
] as const;

/** 추가 견적이 필요한 범위 — 어느 패키지에도 자동 포함되지 않는다 */
export const EXTRA_QUOTE = [
  '다국어',
  '여러 도메인',
  '수천 URL 이상의 별도 데이터 정비',
  '쇼핑몰 상품 DB',
  '복잡한 CSR 구조의 전환',
  '플랫폼 이전',
  '새로운 CMS·서버 기능',
  '외부 시스템 연동',
] as const;

/** 가격표 근처에 읽을 수 있는 크기로 함께 보여 준다 */
export const PRICING_NOTES = [
  '모든 가격은 VAT 포함 시작가입니다. 진단 URL 수는 실제 개별 수정 페이지 수와 다릅니다. 공통 템플릿 수정이 여러 URL에 반영될 수 있지만, 모든 URL의 개별 원고 작성·개별 최적화를 의미하지는 않습니다. 페이지 수·기술 구조·접근 권한·자료 상태를 확인해 포함 범위와 최종 견적을 계약 전에 확정합니다.',
  '계약 범위 밖의 기능·새로운 페이지·외부 도구 이용료·유료 광고·호스팅 실비는 자동 포함되지 않습니다. 검색 순위, 색인, AI 추천·인용 및 매출 성과는 보장하지 않습니다.',
] as const;

// ── 선택형 AI Search Care (자동 결제·가입 기능 없음) ──────────
export interface CarePlan {
  id: 'care' | 'care-plus';
  value: 'CARE' | 'CARE_PLUS';
  name: string;
  /** VAT 포함 월 요금(원) */
  monthlyWon: number;
  items: readonly string[];
}

export const CARE_PLANS: readonly CarePlan[] = [
  {
    id: 'care',
    value: 'CARE',
    name: 'CARE',
    monthlyWon: 390_000,
    items: [
      '구축을 마친 단일 사이트·한국어 기준',
      '주요 페이지 최대 10개 검색 기술 상태 월 1회 확인',
      '고정 질문 10개 × 검색형 서비스 2곳 × 1회, 최대 20개 응답 관찰',
      '월간 리포트 1회',
      '기존 페이지 1개의 경미한 문구·메타 수정 (신규 페이지·새 템플릿·구조 변경 제외)',
    ],
  },
  {
    id: 'care-plus',
    value: 'CARE_PLUS',
    name: 'CARE PLUS',
    monthlyWon: 690_000,
    items: [
      '주요 페이지 최대 20개 월 1회 확인',
      '고정 질문 20개 × 검색형 서비스 3곳 × 1회, 최대 60개 응답 관찰',
      '월간 리포트와 우선순위 제안 각 1회',
      '기존 페이지 최대 2개의 경미한 문구·메타 수정',
    ],
  },
] as const;

export const CARE_NOTE =
  '구축 계약과 별도 선택 사항입니다. 이 페이지에서 결제나 구독이 진행되지 않으며, 상담에서 관심 여부만 확인합니다. 서비스 접근 제한이나 사용량 제한이 있으면 다른 환경의 결과와 섞지 않습니다. 이용 가능한 서비스·관찰 조건·실비·운영 시작일은 계약에서 정합니다.';

export const CARE_LIMIT_NOTE =
  '월 1회 관찰은 고정 표본 모니터링이며, 전체 AI 노출률을 통계적으로 추정하는 방식이 아닙니다. 기간·해지·환불·추가 작업 조건은 실제 계약으로 정합니다.';

// ── 6. SEO·GEO·AEO·NEO 설명 기준 ─────────────────────────────
export const ACRONYMS = [
  { key: 'SEO', work: '검색 접근성·페이지 설명·URL·사이트맵·내부 링크·표시 성능', public: '검색엔진이 페이지를 발견하고 내용을 이해할 수 있는 기본 구조' },
  { key: 'GEO', work: '생성형 검색에서 참고 가능한 서비스 설명·근거·출처·브랜드 일관성', public: 'AI가 참고할 만한 정확한 정보와 검증 가능한 근거를 정리하는 작업' },
  { key: 'AEO', work: '고객 질문과 직접적인 답변·조건·비용·범위의 명확화', public: '방문자가 궁금한 질문에 페이지 자체가 명확히 답하도록 정리하는 작업' },
  { key: 'NEO', work: '네이버 웹검색 최적화 작업 분류', public: '네이버 검색로봇 접근, 메타정보, 사이트맵·수집 상태 점검' },
] as const;

export const NEO_DISCLAIMER =
  '이 페이지에서 NEO는 름랩의 내부 작업 분류인 Naver Engine Optimization을 뜻하며, 네이버의 공식 서비스명이나 인증명이 아닙니다.';

export const ACRONYM_NOTE =
  '네 가지는 서로 독립된 인증 체계나 검색엔진 내부 알고리즘이 아닙니다. 실제로는 겹치는 작업이 많아, 고객이 이해하기 쉽게 나눈 분류입니다. Google 검색의 AI 기능을 위한 별도 전용 스키마나 필수 등록 파일이 있는 것도 아닙니다.';

// ── 7-12. 진행 방식과 제출 자료 ───────────────────────────────
export const PROCESS = [
  { no: '01', title: '주소·목표·권한 확인', detail: '현재 사이트 주소와 원하는 목표, 수정 권한을 확인해 가능한 범위를 검토합니다.' },
  { no: '02', title: '대상 URL·템플릿·산출물 합의', detail: '진단 범위와 실제 수정 대상, 납품물을 정하고 견적과 일정을 확정합니다.' },
  { no: '03', title: '정보 구조·개선안 설계', detail: '개선안을 설계하고 사실 확인이 필요한 자료를 정리합니다.' },
  { no: '04', title: '실제 구현과 검수', detail: '합의한 범위를 구현하고 테스트 환경에서 확인합니다.' },
  { no: '05', title: '배포·인수인계', detail: '합의된 방식으로 반영하고 변경 내역과 운영 기준을 전달합니다.' },
] as const;

export const PREPARE_ITEMS = [
  '현재 사이트 주소',
  '원하는 목표',
  '소스·관리자·배포 접근 가능 여부',
  '서비스 소개 자료',
  '공개 가능한 사례',
  '검색 분석 계정 접근 여부(가능한 경우)',
] as const;

export const SECURITY_NOTE =
  '계정 비밀번호와 API 키는 상담 폼에 입력하지 마세요. 필요한 권한은 계약 이후 안전한 초대 방식으로 받습니다.';

export const FREE_PAID_NOTE =
  '첫 상담은 적용 가능성과 예상 범위 확인입니다. 상세 기술 진단 보고서와 실제 개선 작업은 계약 범위에 포함됩니다.';

// ── 7-13. 성과를 어떻게 확인하는가 ────────────────────────────
export const VERIFY_COLUMNS = {
  heading: '적용 완료와 실제 검색 성과를 구분해 봅니다.',
  implementation: {
    title: '구현 검수',
    subtitle: '작업이 끝나면 바로 확인할 수 있는 항목',
    items: ['페이지 응답', '본문 렌더링', '메타 정보', 'canonical', '구조화 데이터', '내부 링크', '문의 접수 동작'],
  },
  observation: {
    title: '이후 관찰',
    subtitle: '시간이 지나야 확인되고, 보장할 수 없는 항목',
    items: ['검색 노출', '클릭', '비브랜드 유입', '문의 수', 'AI 브랜드 언급', '자사 URL 인용'],
  },
  note: 'AI 답변은 질문, 날짜, 서비스, 검색 사용 여부 등에 따라 달라집니다. 고정 질문과 실행 조건을 기록해 관찰하며, API 응답과 실제 검색 화면을 같은 결과로 취급하지 않습니다.',
  /** 실제 측정 데이터가 없으므로 숫자를 채우지 않고 문서 구조만 보여 준다 */
  reportColumns: ['질문', '실행 조건', '확인한 출처', '관찰 결과', '다음 작업'],
} as const;

// ── 7-14. FAQ — 질문·답변 전부 실제 HTML 로 제공 ──────────────
export interface AisaFaq {
  id: string;
  q: string;
  a: string;
}

export const FAQS: readonly AisaFaq[] = [
  { id: 'faq-rebuild', q: '홈페이지를 새로 만들어야 하나요?', a: '반드시 그렇지는 않습니다. 현재 구조와 접근 권한을 확인해 기존 사이트에서 개선 가능한 범위를 먼저 정합니다. 전면 재구축이 더 적절한 경우에는 이유와 별도 범위를 안내합니다.' },
  { id: 'faq-vs-seo', q: 'SEO만 설정하는 서비스와 무엇이 다른가요?', a: '메타데이터 등 기술 설정에 더해 서비스 설명, 고객 질문, 공개 가능한 근거, 내부 링크와 문의 흐름을 함께 검토합니다. 계약으로 정한 범위는 실제 코드와 콘텐츠에 반영하고 변경 내역을 전달합니다.' },
  { id: 'faq-guarantee', q: 'ChatGPT나 Google AI 검색에 나오게 보장하나요?', a: '보장하지 않습니다. 검색·AI 서비스의 최종 선택은 통제할 수 없습니다. 읽을 수 있는 기술 구조와 정확한 설명·근거를 개선하고, 구현 검수와 이후 노출 관찰을 구분해 진행합니다.' },
  { id: 'faq-rank-risk', q: '기존 검색 순위가 떨어질 위험은 없나요?', a: '검색 순위를 고정할 수는 없습니다. 기존 URL·콘텐츠·검색 설정을 기록하고 변경 범위를 제한하며, 배포 전 회귀검사와 복구 계획으로 기술적 위험을 줄입니다.' },
  { id: 'faq-platform', q: '아임웹·카페24·WordPress도 가능한가요?', a: '플랫폼이 허용하는 기능과 관리자·코드 접근 권한에 따라 다릅니다. 수정 가능한 항목과 불가능한 항목을 확인한 후 범위를 안내합니다.' },
  { id: 'faq-neo', q: 'NEO는 무엇인가요?', a: '이 페이지에서는 름랩의 네이버 웹검색 최적화 작업 분류를 뜻합니다. 네이버의 공식 서비스나 인증 명칭이 아니며, 검색로봇 접근·메타정보·사이트맵·수집 상태 등을 점검합니다.' },
  { id: 'faq-start-scope', q: '250만 원부터라는 금액에 무엇이 포함되나요?', a: 'START 패키지의 확정 범위가 기준입니다. 단일 도메인·한국어 사이트 1개를 대상으로 공개 HTML 최대 100 URL 기술 진단, 계약으로 지정한 핵심 페이지 최대 3개와 공통 템플릿 최대 1종의 합의 항목 개선, 기술 검수와 인수인계 문서가 포함됩니다. 실제 범위와 최종 견적은 페이지 수·기술 구조·접근 권한을 확인한 뒤 계약 전에 확정합니다.' },
  { id: 'faq-audit-vs-edit', q: '진단 300 URL과 실제 수정 7페이지는 어떻게 다른가요?', a: '진단은 사이트에서 기술 상태를 확인하는 범위이고, 실제 수정 페이지는 개별 콘텐츠와 구조를 직접 개선하는 계약 대상입니다. 공통 템플릿 수정이 여러 페이지에 반영되더라도 모든 페이지의 개별 원고 작성이 포함되는 것은 아닙니다.' },
  { id: 'faq-content', q: '콘텐츠도 대신 작성해 주나요?', a: '계약 범위의 핵심 페이지 설명과 FAQ를 제공 자료에 맞게 정리할 수 있습니다. 고객이 사실관계를 확인한 내용만 게시하며, 신규 장문 원고·대량 콘텐츠·법률 및 의학적 검토는 별도 범위입니다.' },
  { id: 'faq-timing', q: '언제 효과를 볼 수 있나요?', a: '구현 일정과 검색·AI 서비스 반영 시점은 다릅니다. 색인·노출·인용 반영 시점은 보장할 수 없으며, 작업 완료 이후 같은 조건으로 변화와 문의를 관찰합니다.' },
  { id: 'faq-deliverable', q: '작업 이후 무엇을 받나요?', a: '계약 범위에 반영한 코드·콘텐츠, 수정 페이지 및 파일 목록, 기술 QA 결과, 운영·복구 가이드를 전달합니다. 기존 제3자 소프트웨어나 고객 소유가 아닌 자산의 권리를 새로 이전하는 것은 아닙니다.' },
  { id: 'faq-care-required', q: '월 관리가 필수인가요?', a: '아닙니다. 구축 계약과 별도 선택 사항입니다. 운영 빈도·관찰 표본·수정 범위·실비 등을 확인한 뒤 별도로 정합니다.' },
  { id: 'faq-no-access', q: '소스 접근 권한이 없으면 어떻게 하나요?', a: '먼저 무엇을 바꿀 수 있는지부터 확인합니다. 관리자 화면만 있는 경우와 제작 업체 협의가 필요한 경우에 가능한 범위가 다르므로, 권한 상태를 확인한 뒤 적용 가능한 항목과 협의가 필요한 항목을 나눠 안내합니다.' },
  { id: 'faq-extra-cost', q: '추가 비용은 어떤 경우에 생기나요?', a: '계약 범위 밖의 새로운 페이지·기능, 다국어, 여러 도메인, 플랫폼 이전, 외부 시스템 연동처럼 처음 합의에 없던 작업이 생길 때입니다. 외부 도구 이용료·유료 광고·호스팅 실비도 자동 포함되지 않습니다. 범위를 벗어나는 요청은 진행 전에 비용과 일정을 먼저 안내합니다.' },
  { id: 'faq-confidential', q: '회사 기밀 자료는 어떻게 다루나요?', a: '공개 게시가 필요한 정보와 내부 확인용 자료를 나눠서 받습니다. 공개 여부가 정해지지 않은 내용은 화면에 쓰지 않으며, 계약 전 단계에서는 비밀번호·인증코드·API 키·고객 명단을 받지 않습니다. 필요한 접근 권한은 계약 이후 안전한 초대 방식으로 요청합니다.' },
] as const;

// ── 7-15. 최종 상담 ──────────────────────────────────────────
export const FINAL_CTA = {
  heading: '지금 홈페이지에서, 무엇부터 바꾸면 좋을까요?',
  body: '사이트 주소와 개선하고 싶은 점을 남겨 주세요. 접근 가능한 구조와 필요한 범위를 확인한 뒤, 맞는 진행 방식과 예상 비용을 안내드립니다.',
  notices: [
    '문의만으로 계약이나 결제가 진행되지 않습니다.',
    '첫 상담은 적용 가능 범위 확인이며, 상세 진단 보고서와 구현은 유료 계약 범위입니다.',
  ],
  submitLabel: '홈페이지 개선 상담 보내기',
} as const;

// ── 7-16. 관련 서비스 / 참고한 공개 기준 ──────────────────────
export const RELATED_LINKS = [
  { href: '/seo-website/', label: '검색 잘되는 홈페이지 제작', note: '업종·지역 검색 유입과 문의 전환을 고려해 홈페이지를 새로 제작할 때의 범위입니다.' },
  { href: '/geo-website/', label: 'GEO 홈페이지 제작', note: '홈페이지를 새로 만들어야 한다면 신규 제작 범위를 확인하세요.' },
  { href: '/data-seo/', label: '데이터·SEO 자동화 구축', note: '수집·검색·자동화 시스템이 필요한 경우의 별도 서비스입니다.' },
  { href: '/service-renewal/', label: '기존 서비스 개선·인수 개발', note: '검색 구조가 아니라 앱·웹 기능 자체를 고쳐야 할 때의 범위입니다.' },
  { href: '/portfolio/', label: '개발 사례 전체 보기', note: '공개 가능한 범위로 정리한 실제 구축 사례입니다.' },
] as const;

/** 공식 문서만 연결한다. 제휴·인증처럼 보이는 로고 행은 만들지 않는다. */
export const REFERENCES = [
  { label: 'Google — AI features and your website', href: 'https://developers.google.com/search/docs/appearance/ai-features' },
  { label: 'Google — 구조화 데이터 소개', href: 'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data' },
  { label: 'OpenAI — 크롤러 안내', href: 'https://developers.openai.com/api/docs/bots' },
  { label: '네이버 서치어드바이저 — 사이트 제작 가이드', href: 'https://searchadvisor.naver.com/guide/seo-basic-create' },
] as const;

export const REFERENCES_NOTE =
  '공개된 공식 문서를 참고 기준으로 연결한 것이며, 해당 기업과의 제휴·인증 관계를 뜻하지 않습니다.';

// ── 표시 헬퍼 — 화면·schema·폼이 같은 값을 쓰게 한다 ──────────
/** 6,900,000 → "690만" */
export function manwon(won: number): string {
  const man = won / 10_000;
  return man >= 1000 ? man.toLocaleString('ko-KR') : String(man);
}
/** 6,900,000 → "690만 원부터" */
export function fromText(won: number): string {
  return `${manwon(won)}만 원부터`;
}
/** 390,000 → "월 39만 원" */
export function monthlyText(won: number): string {
  return `월 ${manwon(won)}만 원`;
}

/**
 * 화면 가격 카드를 그대로 schema.org Offer 로 옮긴다.
 *
 * 왜 price 가 아니라 PriceSpecification.minPrice 인가
 *  화면 문구는 "250만 원부터"다. price 로 쓰면 그 금액이 확정가라는 뜻이 되어 화면과
 *  어긋난다. minPrice 는 "이 범위의 최저가"라는 뜻이라 '부터'와 정확히 같다.
 *  valueAddedTaxIncluded: true 도 화면의 'VAT 포함'과 같은 사실을 가리킨다.
 *  없는 속성(할인 정가·재고·평점)은 만들지 않는다.
 */
export function aisaOfferNodes(): Record<string, unknown>[] {
  return PACKAGES.map((pkg) => ({
    '@type': 'Offer',
    name: pkg.name,
    description: pkg.target,
    url: `${AISA_CANONICAL}#pricing`,
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'KRW',
      minPrice: pkg.priceWon,
      valueAddedTaxIncluded: true,
    },
  }));
}

/**
 * 폼 선택지는 lib/ai-search-form.ts(‘import 없는 모듈’)에 있고 여기서 다시 내보낸다.
 * 클라이언트 컴포넌트가 이 파일을 import 하면 lib/seo.ts 전체가 브라우저 번들에 딸려
 * 들어가므로, 폼 쪽은 반드시 lib/ai-search-form.ts 를 직접 import 한다.
 */
export {
  PACKAGE_CHOICES,
  PACKAGE_TIER,
  CARE_CHOICES,
  PLATFORM_CHOICES,
  ACCESS_CHOICES,
  SITE_URL_MAX,
  IMPROVE_MAX,
  normalizeSiteUrl,
} from './ai-search-form';
export type { PackageChoice } from './ai-search-form';

/**
 * 색인 품질 게이트 — 다른 서비스 상세페이지(lib/ai-voice.ts)와 같은 기준을 쓴다.
 *
 * 화면에 실제로 렌더되는 본문·FAQ·내부링크만 넣는다. 점수를 올리려고 화면에 없는
 * 텍스트를 여기에 추가하면 게이트가 거짓말을 하게 된다.
 * internalLinks: breadcrumb 1 + 목차 5 + 사례 3 + 관련 서비스 4 + 최종 CTA 영역 3
 */
export function aisaDecision(): IndexDecision {
  return decideFromContent({
    title: AISA_TITLE,
    description: AISA_DESCRIPTION,
    h1: HERO.h1Lines.join(' '),
    bodyParts: [
      HERO.sub,
      HERO.body,
      HERO_FLOW.map((f) => `${f.label} ${f.detail}`),
      SUMMARY.answer,
      SUMMARY.facts.map((f) => `${f.k} ${f.v}`),
      [...FIT.items],
      FIT.notFit,
      SCOPE_AREAS.map((s) => `${s.title} ${s.problem} ${s.work} ${s.deliverable}`),
      SCOPE_NOTE,
      [...BEFORE_AFTER.before.lines],
      BEFORE_AFTER.before.note,
      [...BEFORE_AFTER.after.lines],
      HOW_WE_WORK.body,
      [...HOW_WE_WORK.deliverables],
      RELATED_CASE_NOTE,
      PRESERVATION.steps.map((s) => `${s.title} ${s.detail}`),
      PRESERVATION.note,
      PLATFORMS.map((p) => `${p.env} ${p.scope}`),
      PLATFORM_NOTE,
      PACKAGES.map((p) => `${p.name} ${p.tagline} ${p.target} ${p.includes.join(' ')} ${(p.excludes ?? []).join(' ')}`),
      [...EXTRA_QUOTE],
      [...PRICING_NOTES],
      CARE_PLANS.map((c) => `${c.name} ${c.items.join(' ')}`),
      CARE_NOTE,
      CARE_LIMIT_NOTE,
      ACRONYMS.map((a) => `${a.key} ${a.work} ${a.public}`),
      NEO_DISCLAIMER,
      ACRONYM_NOTE,
      PROCESS.map((p) => `${p.title} ${p.detail}`),
      [...PREPARE_ITEMS],
      SECURITY_NOTE,
      FREE_PAID_NOTE,
      [...VERIFY_COLUMNS.implementation.items],
      [...VERIFY_COLUMNS.observation.items],
      VERIFY_COLUMNS.note,
      FAQS.map((f) => f.a),
      FINAL_CTA.body,
      [...FINAL_CTA.notices],
      RELATED_LINKS.map((l) => `${l.label} ${l.note}`),
      REFERENCES_NOTE,
    ],
    faqQuestions: FAQS.map((f) => f.q),
    internalLinks: 1 + TOC.length + RELATED_CASE_IDS.length + RELATED_LINKS.length + 3,
    // 페이지 고유 이미지는 없다 — 구조도·전후 예시는 전부 HTML/CSS 로 그린다.
    hasUniqueMedia: false,
    evidence: {
      // 공개 가격표·납품 범위·제외 항목은 름랩이 직접 확인할 수 있는 1차 근거다.
      // 다만 이 서비스의 검색 개선 '성과' 데이터는 아직 없으므로 partial 로 둔다.
      firstPartyEvidence: 'partial',
      // 7-16 의 공식 문서 4건(Google 2, OpenAI 1, 네이버 1)
      independentSources: REFERENCES.length,
      hasMethodology: true,
      hasLimitations: true,
      reviewedAt: '2026-09-15',
      hasOriginalMedia: false,
    },
  });
}
