/**
 * AI 전화상담 직원 구축 서비스
 * 라우트: /ai-voice-development/  (기존 경로 유지 — 같은 의도의 새 URL 을 만들지 않는다)
 * ------------------------------------------------------------------
 * 이 페이지가 파는 것
 *  "AI 전화상담 직원을 구축해 주는 개발 서비스" 다.
 *  실제 전화망·음성 AI 서버·CRM SaaS 를 운영하는 제품이 아니다.
 *  화면의 통화 예시는 전부 가상 시뮬레이션이며, 실제 문의 폼만 기존 접수 경로를 쓴다.
 *
 * 왜 별도 페이지인가 — 기존 AI 페이지 3종과의 검색 의도 분리
 *  · /ai-development/  "AI 챗봇 개발"   — 텍스트 챗봇·상담 자동화
 *  · /ai-automation/   "AI 업무 자동화" — 반복 업무 흐름을 AI 가 대신 실행
 *  · /enterprise-ai/   "사내 AI 구축"   — 사내 문서 검색·질의응답(RAG)
 *  셋 다 입력이 "텍스트"이거나 대상이 "임직원"이다. 이 페이지는 음성(voice)·실시간(realtime)·
 *  전화망(telephony)이 핵심이라 구현 방식도, 비용 구조도, 검색어도 다르다.
 *  네 페이지의 관계는 경쟁이 아니라 보완이며, 페이지 안에서 차이를 명시하고 서로 링크한다.
 *
 * 콘텐츠 원칙 (이 파일을 고칠 때 반드시 지킬 것)
 *  - 실제 고객사·구축 실적·성과 수치·파트너십·인증·수상·후기를 만들지 않는다.
 *  - "100% 정확", "완벽한 보안", "모든 법령 준수", "직원 대체 보장", "상담 90% 자동화",
 *    "300ms 응답", "99.9% 정확도" 같은 출처 없는 수치·절대 표현을 쓰지 않는다.
 *  - 임의의 구축 가격·월 요금·무료 제공량·확정 납기·반환 정책을 정하지 않는다.
 *    ★ 다른 상품(앱 AI 패키지 등)의 금액을 이 서비스의 시작가로 가져오지 않는다.
 *      그래서 이 파일은 lib/pricing.ts 를 import 하지 않는다.
 *  - 모든 시스템에 무조건 연동된다고 쓰지 않는다. 공식 API·권한·계약 확인이 선행한다.
 *  - 기존 대표번호 사용 / 실시간 직원 연결 / 24시간 운영 / 의료기관 도입은 각각 조건을 표시한다.
 *  - FAQ 답변 첫 문장은 질문에 대한 직접 답이어야 한다(AEO). 홍보 도입부로 시작하지 않는다.
 *  - 이 파일의 FAQS 는 화면과 FAQPage 구조화 데이터에 같은 배열이 그대로 쓰인다.
 *    한쪽만 고치면 scripts/verify-faq.mjs 가 실패한다.
 *
 * 구조화 데이터에서 FAQPage 를 유지하는 이유 (2026-09-16 판단)
 *  Google 은 2026-05-07 부터 FAQ 리치 결과를 표시하지 않는다. 그래서 이 페이지 어디에도
 *  "FAQ 리치 결과를 얻는다"는 목표·보장을 쓰지 않는다. 다만 마크업 자체는 여전히 유효하고,
 *  사이트의 다른 30여 페이지가 같은 helper 로 FAQPage 를 내보내고 있으며
 *  scripts/verify-faq.mjs 가 화면↔스키마 일치를 전수 검사한다. 이 페이지만 빼면
 *  검사 대상에서 이탈해 오히려 불일치를 놓치게 된다 → 유지한다.
 */
import { SITE } from './seo';
import { decideFromContent, type IndexDecision } from './index-quality';
import { DEMO_SCENARIOS as SCENARIOS_FOR_SCORING } from './ai-voice-demo';

export const AI_VOICE_PATH = '/ai-voice-development/';
export const AI_VOICE_CANONICAL = `${SITE.domain}${AI_VOICE_PATH}`;

// 데모·폼·계산기 데이터는 의존성 0 모듈에 있다. 서버 쪽 사용처를 위해 다시 내보내기만 한다
// (여기서 직접 들고 있으면 클라이언트 번들에 lib/seo.ts 가 딸려 간다).
export {
  DEMO_SCENARIOS,
  DEFAULT_INDUSTRY,
  getScenario,
  stateAfter,
  initialState,
  outcomeStatus,
  displayValue,
  canShowReservationConfirmed,
  validateScenarios,
  NOT_YET_LABEL,
  UNRESOLVED_LABEL,
  OUTCOME_STATUS,
  SIMULATION_NOTICE,
  SYSTEM_SPEAKER_LABEL,
  type DemoScenario,
  type DemoTurn,
  type DemoField,
  type DemoState,
  type VoiceIndustry,
  type FieldValue,
  type OutcomeStatus,
} from './ai-voice-demo';

export {
  WORKLOAD_FIELDS,
  WORKLOAD_DEFAULTS,
  WORKLOAD_ASSUMPTION_NOTE,
  WORKLOAD_LIMIT_NOTE,
  computeWorkload,
  formatHours,
  formatCalls,
  CALL_VOLUME_CHOICES,
  type WorkloadInput,
} from './ai-voice-workload';

export {
  VOICE_INDUSTRY_CHOICES,
  VOICE_CALL_VOLUME_CHOICES,
  VOICE_PACKAGE_CHOICES,
  VOICE_FIELD_NAMES,
  VOICE_DATA_ATTR,
  INDUSTRY_BY_DEMO_ID,
} from './ai-voice-form';

// ── 메타 ──────────────────────────────────────────────────────

export const AI_VOICE_TITLE = 'AI 전화상담 직원 구축 | 예약·문의·견적 접수 자동화 | 름랩';

export const AI_VOICE_DESCRIPTION =
  '반복 전화응대부터 상담·예약·견적 접수까지. 름랩이 기업별 업무 규칙과 CRM·예약 시스템 연동 범위에 맞춰 AI 전화상담 직원을 구축합니다. 기능·비용 구조·도입 절차를 확인하세요.';

/** H1 — 화면에서는 두 줄로 끊어 렌더한다(줄 수가 흔들리면 CLS 가 생긴다) */
export const AI_VOICE_H1 = '전화 업무까지 처리하는 AI 전화상담 직원 구축';
export const AI_VOICE_H1_LINES = ['전화 업무까지 처리하는', 'AI 전화상담 직원 구축'] as const;

export const AI_VOICE_EYEBROW = '기업별 맞춤형 VOICE AI 구축';

/** 서비스 분류 — Service.serviceType 과 화면 소개에 같은 문장을 쓴다 */
export const AI_VOICE_SERVICE_TYPE = 'AI 전화상담 시스템 구축·개발';

/** 히어로 한 줄 요약 */
export const AI_VOICE_LEAD = '전화를 받는 AI가 아니라, 전화 업무를 처리하는 AI 직원.';

export const AI_VOICE_BODY =
  '반복 문의에 답하고, 필요한 정보를 확인해 상담·예약·견적 접수로 연결합니다. 름랩은 고객사의 업무 규칙과 기존 시스템에 맞춘 AI 전화상담 시스템을 설계하고 개발합니다.';

export const AI_VOICE_SUB_NOTE =
  '처음에는 한 가지 전화 업무부터 시작합니다. 실제 예약 확정이나 CRM 입력은 연동 범위와 처리 규칙을 확인한 뒤 구축합니다.';

/**
 * 엔티티 문장 — 생성형 검색이 "름랩은 누구인가"를 이 페이지만 읽고도 답할 수 있게 한다.
 * SITE.description(사업 설명 단일 출처)과 어긋나지 않는 범위에서 이 서비스 맥락만 덧붙인다.
 */
export const AI_VOICE_ENTITY_STATEMENT =
  '름랩(REUMLAB)은 웹·앱·AI 시스템을 설계·개발하는 소프트웨어 개발 스튜디오로, 고객사의 전화 업무 규칙에 맞춘 AI 전화상담 시스템 구축을 제공합니다.';

/** 인용 가능한 서비스 정의 — 정적 HTML 로 제공한다(§6-01) */
export const DEFINITION_HEADING = 'AI 전화상담 직원이란 무엇인가요?';
export const DEFINITION_ANSWER =
  'AI 전화상담 직원은 전화로 들어온 문의의 목적을 파악하고 필요한 정보를 확인해, 허용된 업무를 처리하거나 담당자가 이어받을 수 있는 접수 정보로 정리하는 맞춤형 음성 AI 시스템입니다.';

export const AI_VOICE_KEYWORDS = [
  'AI 전화상담 직원 구축',
  'AI 전화상담 시스템 개발',
  'AI 상담원 구축',
  'AI 전화응대',
  '음성 AI 개발',
  'Voice AI',
  'AI 예약 상담',
  '전화 업무 자동화',
];

/** 히어로 핵심 특성 — 4개만 (§6-01) */
export const HERO_FEATURES = [
  '기업별 맞춤 구축',
  '상담 내용 구조화',
  '기존 시스템 연동 검토',
  '담당자 연결·콜백 설계',
] as const;

export const HERO_CTA_PRIMARY = '우리 회사 도입 상담하기';
export const HERO_CTA_SECONDARY = '통화 흐름 예시 보기';

/** 히어로 오른쪽 흐름 도식 — 실시간·LIVE·현재 통화 중 배지를 쓰지 않는다 */
export const HERO_FLOW = ['전화', '대화', '업무 접수', '담당자 전달'] as const;

/** 히어로 카드 — "가상 구성 예시"라고 명시한다 */
export const HERO_CARD = {
  badge: '가상 구성 예시',
  title: '상담 결과 카드',
  rows: [
    { label: '문의 유형', value: '예약 문의' },
    { label: '확인된 정보', value: '희망 시간 · 담당자 선호' },
    { label: '미확인 항목', value: '실제 연락처' },
    { label: '다음 행동', value: '담당자 확인 후 회신' },
  ],
} as const;

// ── 02. 문제와 방식 비교 ──────────────────────────────────────

export const PROBLEM_HEADING = '전화 한 통 때문에, 하던 업무를 매번 멈추고 있나요?';

export const PROBLEMS = [
  {
    title: '반복 문의로 업무 중단',
    body: '영업시간·위치·가격처럼 답이 정해진 질문이 하루에도 몇 번씩 걸려 옵니다. 그때마다 하던 일을 멈춰야 합니다.',
  },
  {
    title: '부재 중 접수 공백',
    body: '자리를 비우거나 다른 통화 중일 때 걸려 온 전화는 기록이 남지 않습니다. 누가 왜 걸었는지 알 수 없습니다.',
  },
  {
    title: '통화 후 기록·전달 누락',
    body: '통화로 들은 내용을 다시 입력해야 기록이 됩니다. 바쁠수록 입력이 밀리고, 담당자 전달이 늦어집니다.',
  },
] as const;

export const COMPARE_HEADING = '세 가지 운영 방식은 무엇이 다른가요?';

/** 경쟁 제품 전체의 능력을 단정하지 않는다 — "구성 방식"을 비교한다 */
export const COMPARE_MODES = ['직접 응대 중심 운영', '버튼 선택형 ARS', '업무 연동형 Voice AI'] as const;

export const COMPARE_ROWS = [
  {
    item: '고객 입력 방식',
    direct: '자유로운 말',
    ars: '번호 버튼 선택',
    voice: '자유로운 말',
  },
  {
    item: '정보 수집',
    direct: '담당자가 듣고 메모',
    ars: '미리 정한 분기까지만',
    voice: '필요한 항목을 대화로 확인',
  },
  {
    item: '업무 시스템 연동',
    direct: '사람이 직접 입력',
    ars: '설계에 따라 가능',
    voice: '계약된 범위의 공식 API 로 실행',
  },
  {
    item: '통화 이후 기록',
    direct: '별도 입력 필요',
    ars: '선택 경로 위주로 기록',
    voice: '대화 내용을 항목으로 정리',
  },
  {
    item: '사람의 판단이 필요한 상황',
    direct: '바로 대응 가능',
    ars: '대표번호·상담원 연결로 전환',
    voice: '이관 조건에 따라 담당자 연결·콜백 접수',
  },
] as const;

export const COMPARE_NOTE =
  'ARS와 텍스트 챗봇도 설계에 따라 업무 시스템과 연결할 수 있습니다. 이 서비스의 초점은 ‘음성 대화로 정보를 확인하고 실제 전화 업무 흐름에 연결하는 것’입니다.';

// ── 03. 업종별 인터랙티브 통화 예시 ───────────────────────────

export const DEMO_HEADING = '통화가 끝나면, 이런 업무 정보가 남습니다';
export const DEMO_LEAD =
  '업종을 선택하고 대화를 진행해 보세요. 고객이 말한 내용이 어떻게 접수 항목으로 정리되는지 확인할 수 있습니다.';

// ── 04. 업종별 업무 범위 ──────────────────────────────────────

export const SCOPE_HEADING = '우리 업종에서는 어디까지 맡길 수 있나요?';

export interface IndustryScope {
  /** 데모 시나리오 id 와 같은 값 — 두 섹션이 같은 업종을 가리킨다는 것을 코드로 보장한다 */
  key: string;
  label: string;
  first: string;
  afterIntegration: string;
  human: string;
}

export const INDUSTRY_SCOPES: readonly IndustryScope[] = [
  {
    key: 'academy',
    label: '학원',
    first: '학년·과목·목표·희망 시간 확인, 상담 접수',
    afterIntegration: '상담 일정 등록, 담당자 배정',
    human: '학습 진단, 할인·환불 판단',
  },
  {
    key: 'clinic',
    label: '병원·의원',
    first: '진료시간·위치·주차 등 승인된 행정 안내',
    afterIntegration: '허용된 예약 접수·변경',
    human: '진단, 치료·약물 판단, 응급 판단',
  },
  {
    key: 'beauty',
    label: '미용실·뷰티',
    first: '시술 종류·담당자·희망 시간 확인',
    afterIntegration: '예약 가능 시간 조회·예약 확정',
    human: '예외 가격, 시술 적합성, 분쟁',
  },
  {
    key: 'real-estate',
    label: '부동산',
    first: '지역·거래 유형·예산·입주 조건 접수',
    afterIntegration: '허용된 매물 정보 조회',
    human: '계약·법률·투자 판단, 매물 보증',
  },
  {
    key: 'b2b',
    label: 'B2B·전문서비스',
    first: '프로젝트·기능·예산·희망 일정 접수',
    afterIntegration: 'CRM 입력, 상담 일정 등록',
    human: '최종 견적, 납기·계약 확약',
  },
  {
    key: 'support',
    label: '고객센터',
    first: '문의 유형 분류, 승인된 안내, 콜백 접수',
    afterIntegration: '본인 확인 후 주문·상태 조회',
    human: '환불 승인, 보상·예외 정책 판단',
  },
];

export const SCOPE_NOTE =
  '이 표는 가능한 설계 범위입니다. 모든 기능이 기본 제공되거나 모든 시스템에 즉시 연동되는 것은 아닙니다.';

// ── 05. AI가 맡는 업무와 처리 결과 ────────────────────────────

export const FEATURES_HEADING = '답변에서 끝내지 않고, 다음 업무로 이어지게';

export const FEATURES = [
  {
    title: '기업 정보 기반 안내',
    body: '승인된 영업시간·서비스·가격 정책 등으로 응대 범위를 구성합니다. 승인하지 않은 내용은 답하지 않도록 제한합니다.',
  },
  {
    title: '필요한 정보만 질문',
    body: '이미 확인한 내용은 반복해서 묻지 않고, 누락된 항목만 확인합니다. 고객이 같은 말을 두 번 하지 않게 하는 것이 목표입니다.',
  },
  {
    title: '상담·견적 접수',
    body: '요청 사항을 항목별로 정리하고 고객이 말한 원문과 구분해 남깁니다. 정리된 항목과 원문을 함께 확인할 수 있습니다.',
  },
  {
    title: '예약·업무 처리',
    body: '공식 연동 수단이 있고 계약된 범위일 때 조회·등록·변경을 수행합니다. 연결되지 않은 시스템의 업무를 임의로 확정하지 않습니다.',
  },
  {
    title: '담당자 연결·콜백',
    body: '실시간 연결이 가능한지와 별개로, 사람에게 이어지는 대안을 함께 설계합니다. 연결이 어려우면 후속 연락 요청으로 접수합니다.',
  },
  {
    title: '통화 후 기록·알림',
    body: '보관 정책에 따라 요약·처리 결과를 남기고 승인된 채널로 전달합니다. 영구적인 원문 녹취 보관이 기본 구성은 아닙니다.',
  },
] as const;

export const FEATURES_NOTE =
  '음성 인식 정확도, 끼어들기 처리 성능, 응답 속도는 사용하는 공급사 구성과 통화 환경에 따라 달라집니다. 측정하지 않은 수치를 보장하지 않습니다.';

// ── 06. 통화 후 관리자 화면 예시 ──────────────────────────────

export const ADMIN_HEADING = '담당자는 통화를 다시 듣기 전에 핵심을 확인합니다';
export const ADMIN_BADGE = '관리자 화면 구성 예시 · 실제 운영 데이터 아님';

export interface AdminRow {
  id: string;
  industry: string;
  inquiryType: string;
  summary: string;
  nextAction: string;
  /** lib/ai-voice-demo.ts 의 OUTCOME_STATUS 와 같은 값만 쓴다 */
  status: string;
  confirmed: readonly string[];
  unconfirmed: readonly string[];
  steps: readonly string[];
}

/**
 * 가상 상담 3건. 실제 고객명·전화번호를 쓰지 않는다.
 * 없는 값은 '미확인'으로 두고, 채워 보이지 않는다.
 */
export const ADMIN_ROWS: readonly AdminRow[] = [
  {
    id: 'admin-1',
    industry: '학원',
    inquiryType: '상담 접수',
    summary: '중2 수학 내신 대비 상담 희망',
    nextAction: '상담 가능 시간 확인 후 회신',
    status: '접수 예시',
    confirmed: ['학년: 중학교 2학년', '과목: 수학', '목표: 이번 학기 내신 대비', '희망 시간: 평일 19시 이후'],
    unconfirmed: ['연락처', '상담 일정 확정 여부'],
    steps: ['담당자가 상담 가능 시간 확인', '고객에게 후속 연락', '확정 후 일정 등록'],
  },
  {
    id: 'admin-2',
    industry: '미용실·뷰티',
    inquiryType: '예약 문의',
    summary: '토요일 오후 커트 · 담당자 지정 없음',
    nextAction: '예약 시스템 저장 상태 재확인',
    status: '추가 확인 필요',
    confirmed: ['시술: 커트', '희망 시간: 토요일 오후', '담당자: 지정 없음', '고객 재확인: 완료(예시)'],
    unconfirmed: ['실제 예약 시스템 저장 결과'],
    steps: ['가상 성공 단계 이후 실제 저장 여부 확인', '불일치 시 고객에게 재안내'],
  },
  {
    id: 'admin-3',
    industry: '고객센터',
    inquiryType: '환불 관련 문의',
    summary: '직원 상담 요청 · 환불 판단 필요',
    nextAction: '본인 확인 후 담당자 응대',
    status: '담당자 처리 필요',
    confirmed: ['문의 유형: 환불 관련', '고객 요청: 실제 직원 상담', '처리 방향: 담당자 설명·후속 연락 희망'],
    unconfirmed: ['환불 승인 상태', '주문 정보'],
    steps: ['본인 확인 절차 진행', '담당자가 환불 정책 확인', '결과 안내'],
  },
];

export const ADMIN_NOTE =
  '이 화면은 구성 예시입니다. 로그인·수정 저장·녹취 파일 다운로드 기능은 이 페이지에 없습니다. 실제 관리자 범위는 계약한 구축 범위에 따라 정합니다.';

// ── 07. 기존 시스템 연결 구조 ─────────────────────────────────

export const ARCH_HEADING = '지금 쓰는 시스템을 확인하고, 필요한 지점부터 연결합니다';

export const ARCH_FLOW = [
  '전화 또는 웹 음성 채널',
  '실시간 대화',
  '업무 규칙',
  '허용된 API 실행',
  '결과 확인',
  '기록·담당자 전달',
] as const;

export interface ArchLayer {
  title: string;
  detail: string;
  parts: readonly string[];
}

export const ARCHITECTURE: readonly ArchLayer[] = [
  {
    title: '음성 처리',
    detail:
      '직접 음성을 입출력하는 모델을 쓰거나, 음성 인식(STT) → 대화 모델 → 음성 합성(TTS) 을 조합합니다. 요구하는 지연 시간·비용·품질에 따라 구성이 달라집니다.',
    parts: ['실시간 음성 모델', 'STT + 대화 모델 + TTS 조합'],
  },
  {
    title: '채널 연결',
    detail:
      '브라우저 음성 데모와 실제 전화망 연동은 서로 다른 검증 대상입니다. 회선 종류와 통신사 지원 방식을 먼저 확인합니다.',
    parts: ['웹 음성 채널', '전화망 연동', '동시 통화 요구'],
  },
  {
    title: '업무 규칙',
    detail:
      '무엇을 답하고 무엇을 실행할 수 있는지 미리 정합니다. API 를 실행하기 전에 권한·입력값·고객 확인 조건을 검증합니다.',
    parts: ['응대 범위', '수집 항목', '실행 조건', '이관 조건'],
  },
  {
    title: '결과 확인',
    detail:
      'API 가 실패하거나 상태가 불명확하면 성공했다고 안내하지 않도록 설계합니다. 예약·변경의 중복 실행 방지와 처리 결과 재확인은 실제 구축 시 검수 대상입니다.',
    parts: ['성공 응답 확인', '중복 실행 방지', '실패 시 대안 흐름'],
  },
];

/** 연동 대상은 개별 제품명이 아니라 범주로 제시한다 */
export const INTEGRATION_CATEGORIES = ['예약 시스템', 'CRM', 'ERP', 'Google Calendar', '사내 API·DB'] as const;

/** ★ 이 문장은 반드시 화면에 남긴다 (§6-07) */
export const INTEGRATION_NOTE =
  '연동 가능 여부는 사용 중인 서비스의 공식 API, 계정 권한, 계약 조건을 확인한 뒤 확정합니다. 이름이 알려진 서비스라도 임의 접근이나 비공식 우회 연동을 전제로 제안하지 않습니다.';

// ── 08. 통제와 개인정보 ───────────────────────────────────────

export const CONTROL_HEADING = 'AI가 모든 판단을 하도록 맡기지 않습니다';

export const CONTROL_LEVELS = [
  { title: '조회', body: '승인된 정보만 안내합니다. 확인되지 않은 내용은 답하지 않습니다.' },
  { title: '제한된 실행', body: '허용한 접수·등록 업무만 실행합니다. 범위 밖 업무는 실행하지 않습니다.' },
  { title: '재확인', body: '예약 변경·확정처럼 되돌리기 어려운 업무는 중요한 값을 고객에게 다시 확인합니다.' },
  { title: '사람 이관', body: '불만·민감 문의·규칙 밖 요청·불확실한 상황은 담당자에게 전달합니다.' },
] as const;

/**
 * 이관 조건은 "관찰 가능한 상황"으로만 쓴다.
 * 'confidence 80% 이하' 처럼 측정되지 않은 수치를 구현 사실로 쓰지 않는다.
 */
export const HANDOFF_CONDITIONS = [
  '고객이 직원 연결을 직접 요청한 경우',
  '업무 처리에 필요한 정보가 끝내 확인되지 않은 경우',
  '승인된 지식 범위에 답의 근거가 없는 경우',
  '연동 시스템이 오류를 돌려주거나 처리 결과가 불명확한 경우',
  '같은 내용을 여러 번 되물어도 인식이 반복 실패한 경우',
] as const;

export const PRIVACY_HEADING = '통화 기록과 개인정보는 어떻게 정하나요?';
export const PRIVACY_NOTE =
  '통화 녹음 여부, 기록 범위, 보관기간, 관리자 접근권한, 외부 AI·통신 서비스로 전달되는 데이터는 고객사의 운영 환경에 맞춰 정합니다. 이 소개 페이지의 시뮬레이션은 실제 통화나 마이크 입력을 수집하지 않습니다.';

export const MEDICAL_NOTE =
  '병원·의원은 승인된 행정 안내와 예약 관련 업무를 중심으로 범위를 정하며, 진단·치료·약물 판단을 AI가 대신하는 용도로 제안하지 않습니다.';

export const COMPLIANCE_NOTE =
  '실제 운영 환경의 적법성 검토는 수집·전송·보관 구성을 확인해 별도로 진행합니다. 이 페이지의 구현 검수로 인증되는 사항이 아닙니다.';

// ── 09. 상품 범위 + 비용 구조 ─────────────────────────────────

export const PACKAGE_HEADING = '필요한 전화 업무부터, 구축 범위를 나눕니다';
export const PACKAGE_LEAD =
  '아래 구분은 상담 범위를 정하기 위한 제안입니다. 자동 결제되는 SaaS 요금제가 아닙니다.';

export interface VoicePackage {
  /** data-voice-package 속성에 쓰는 slug */
  slug: string;
  name: string;
  purpose: string;
  composition: string;
  handoff: string;
  admin: string;
  /** 임의 금액을 만들지 않는다 — 전부 개별 견적이다 */
  price: string;
  cta: string;
}

export const VOICE_PACKAGES: readonly VoicePackage[] = [
  {
    slug: 'starter',
    name: 'AI Voice Starter',
    purpose: '반복 안내와 문의 접수',
    composition: '승인 정보, 대화 시나리오, 접수 항목, 요약·담당자 전달',
    handoff: '담당자 후속 연락·콜백 흐름',
    admin: '계약한 접수 확인 범위',
    price: '범위 확인 후 개별 견적',
    cta: 'Starter 범위 상담',
  },
  {
    slug: 'business',
    name: 'AI Voice Business',
    purpose: '예약·CRM 등 업무 처리',
    composition: 'Starter + 계약한 API 연동·작업 확인·예외 처리',
    handoff: '회선이 지원하면 실시간 연결 추가 검토',
    admin: '처리 상태·연동 결과 확인 범위',
    price: '범위 확인 후 개별 견적',
    cta: '업무 연동 상담',
  },
  {
    slug: 'enterprise',
    name: 'AI Voice Enterprise',
    purpose: '복수 시스템·복잡한 운영',
    composition: 'Business + 복수 지점·세분화 권한·운영 체계',
    handoff: '조직·시간대별 분기와 이관 규칙',
    admin: '감사·접근 정책·조직별 운영 요구',
    price: '요구사항 확인 후 개별 견적',
    cta: '복수 시스템 상담',
  },
];

/** 기본 보호를 Enterprise 전용처럼 쓰지 않는다 */
export const PACKAGE_BASELINE_NOTE =
  '모든 구성에서 개인정보 접근통제와 오류 기록 등 필요한 기본 보호를 전제로 합니다. SSO, 복잡한 감사 요구, 가동률 보장(SLA)은 별도 범위로 구분해 협의합니다.';

export interface CostGroup {
  title: string;
  lead: string;
  items: readonly string[];
}

export const COST_HEADING = 'AI 전화상담 구축 비용은 어떻게 나뉘나요?';
export const COST_ANSWER =
  '비용은 초기 구축비, 월 운영·유지관리비, 통화·AI·인프라 사용량 비용 세 가지로 나뉩니다. 세 가지를 합쳐 하나의 월 요금으로 제시하지 않고, 견적서에서 구분해 안내합니다.';

export const COST_GROUPS: readonly CostGroup[] = [
  {
    title: '초기 구축비',
    lead: '한 번 발생하는 개발 비용입니다.',
    items: ['요구 분석', '대화 시나리오 설계', '개발', '필요한 시스템 연동', '테스트', '인수 범위'],
  },
  {
    title: '월 운영·유지관리비',
    lead: '계약으로 선택한 범위만 발생합니다.',
    items: ['모니터링', '안내 정보 갱신', '장애 대응', '합의한 개선 범위'],
  },
  {
    title: '사용량·인프라 비용',
    lead: '실제 구성과 사용량에 따라 달라집니다.',
    items: ['통화 회선', 'AI 모델 사용량', '음성 처리', '서버·저장소'],
  },
];

export const COST_SUPPLEMENT =
  '포함 사용량, 초과 과금, 외부 사업자 비용, VAT, 지원 범위는 견적서와 계약서에서 구분해 안내합니다. 모든 비용이 통화 시간만으로 계산되는 것은 아니며, 공급사에 따라 고정비·토큰·분당 비용이 함께 발생할 수 있습니다.';

export const COST_FACTORS = [
  '문의 시나리오 수',
  '동시 통화 요구',
  '실제 실행 업무',
  '연동 시스템 수',
  '인증·저장 정책',
  '관리자 범위',
  '운영 지원 수준',
] as const;

// ── 10. 전화 업무량 계산 ──────────────────────────────────────

export const WORKLOAD_HEADING = '지금 전화 업무에 쓰는 시간을 가늠해 보세요';
export const WORKLOAD_LEAD =
  '입력한 전화량과 가정에 따라 한 달 통화시간이 얼마나 되는지 계산합니다. 금전 절감액이나 견적이 아니라 시간 계산입니다.';
export const WORKLOAD_CTA = '이 업무량으로 도입 상담';

// ── 11. 구축 절차와 첫 검증 범위 ──────────────────────────────

export const PROCESS_HEADING = '처음부터 콜센터 전체를 바꾸지 않습니다';

export const PROCESS = [
  {
    title: '현재 전화 업무 파악',
    detail: '어떤 문의가 반복되는지, 무엇을 AI가 처리하면 안 되는지, 연동 후보가 무엇인지 정리합니다.',
  },
  {
    title: '첫 업무 선택',
    detail: '상담 시나리오, 수집 항목, 사람 이관 조건을 합의합니다. 한 가지 업무로 좁혀 시작합니다.',
  },
  {
    title: '테스트 환경 구현',
    detail: '실제 음성·회선이 필요한 계약이라면 테스트 채널을 준비합니다.',
  },
  {
    title: '예외 상황 검수',
    detail: '오인식, 침묵, 끼어들기, 연동 실패, 중복 요청, 콜백 확인을 점검합니다.',
  },
  {
    title: '운영 전환·인수',
    detail: '합의된 계정, 소스, 운영 문서, 지원 범위를 전달합니다.',
  },
] as const;

export const FIRST_DELIVERABLE =
  '첫 구축에서 권장하는 결과물은 “한 가지 대표 문의 접수 → 정보 정리 → 담당자 전달”입니다.';

export const EXPANSION_SCOPE = [
  '예약 확정·변경',
  '양방향 CRM 연동',
  '다지점 운영',
  '다국어 응대',
  '아웃바운드 발신',
] as const;

export const EXPANSION_NOTE = '위 항목은 후속 확장 범위입니다. 기본 포함 기능이 아닙니다.';

export const DURATION_NOTE =
  '일정은 회선 준비, 자료 상태, 연동 권한, 검수 범위에 따라 달라집니다. 범위를 확인한 뒤 일정과 결과물을 제안합니다.';

// ── 12. 관련 구현 경험 + 관련 서비스 ──────────────────────────

export const CASES_HEADING = '음성 대화 뒤의 업무 시스템까지 함께 설계합니다';

/** 인접 구현 경험 — 음성 AI 구축 사례로 바꿔 말하지 않는다(실제로 공개된 것만 연결) */
export const RELATED_CASE_IDS = ['ai-work-hub', 'space-booking', 'quote-doc'] as const;

export const RELATED_CASE_NOTE =
  '아래는 업무 자동화·예약·관리자 시스템과 관련된 공개 구현 사례입니다. AI 전화상담 납품 사례를 의미하지 않습니다.';

/**
 * 관련 서비스 — §6-12 가 지정한 4축(AI 개발 / 사내 AI / 예약·결제 / 관리자·업무 시스템)에
 * 사례 인덱스를 더한 5개다. 기존에 있던 /mvp/ 링크는 본문(확장 범위 설명) 안에서 유지해
 * 내부 링크를 잃지 않는다.
 */
export const RELATED_LINKS = [
  {
    href: '/ai-development/',
    label: 'AI 외주개발 (챗봇·상담 자동화)',
    note: '텍스트 챗봇과 업무용 AI 기능을 최소 범위로 시작하는 서비스입니다.',
  },
  {
    href: '/enterprise-ai/',
    label: '사내 AI·기업용 AI 구축',
    note: '사내 문서를 검색해 임직원 질문에 답하는 AI입니다. 고객 응대가 아니라 내부 지식 검색 축입니다.',
  },
  {
    href: '/reservation-commerce/',
    label: '예약·결제·회원제 서비스 개발',
    note: '전화로 접수한 예약이 실제로 저장될 시스템이 아직 없을 때 함께 검토합니다.',
  },
  {
    href: '/admin-page-development/',
    label: '관리자 페이지·업무 시스템 개발',
    note: '상담 내역을 직원이 직접 확인·수정하는 화면이 필요할 때 함께 진행합니다.',
  },
  {
    href: '/portfolio/',
    label: '개발 사례 전체 보기',
    note: '공개 가능한 범위로 정리한 실제 구축 사례입니다.',
  },
] as const;

// ── 13. FAQ (§9 — 실제 게시용 답변 16개) ──────────────────────

export const FAQ_HEADING = 'AI 전화상담 직원 구축, 자주 묻는 질문';

export const FAQS: readonly { q: string; a: string }[] = [
  {
    q: 'AI가 실제로 걸려 오는 전화를 받을 수 있나요?',
    a: '전화망과 음성 AI를 연결하는 방식으로 구축할 수 있습니다. 사용하는 번호와 회선, 통신사 지원 방식, 동시 통화 요구를 먼저 확인해야 합니다. 이 페이지의 대화 예시는 실제 전화 서비스가 아니라 화면 시뮬레이션입니다.',
  },
  {
    q: '지금 쓰는 대표번호를 그대로 사용할 수 있나요?',
    a: '기존 번호를 활용할 수 있는지는 통신사, 번호 종류, 착신전환 또는 전화 시스템 연동 지원에 따라 달라집니다. 번호 유지가 가능하다고 먼저 확약하지 않고 현재 회선 환경을 확인한 뒤 방법과 비용을 안내합니다.',
  },
  {
    q: '어떤 전화 업무부터 시작하는 것이 좋나요?',
    a: '반복되는 안내와 상담·문의 접수처럼 범위와 처리 결과를 명확히 정할 수 있는 업무부터 검토합니다. 고객이 무엇을 원하는지 확인하고 담당자에게 정리해 전달하는 한 가지 흐름을 먼저 검증한 뒤 범위를 넓힐 수 있습니다.',
  },
  {
    q: '실제 예약 생성이나 변경도 가능한가요?',
    a: '예약 시스템이 허용하는 공식 연동 수단과 권한이 있는 경우 해당 업무를 구축 범위에 포함할 수 있습니다. 고객 재확인, 중복 처리 방지, 연동 실패 시 대처까지 함께 설계합니다. 연결되지 않은 시스템의 예약을 AI가 임의로 확정하지 않습니다.',
  },
  {
    q: '기존 CRM·ERP와 연결할 수 있나요?',
    a: '공식 API, 웹훅, 허용된 데이터 접근 방식과 계정 권한을 확인한 뒤 판단합니다. 연동이 어려운 환경에서는 담당자에게 정리된 문의를 전달하는 방식부터 검토할 수 있습니다. 특정 제품을 쓴다는 이유만으로 연동을 보장하지 않습니다.',
  },
  {
    q: '네이버 예약이나 병원 EMR도 기본 연결되나요?',
    a: '기본 연결된다고 안내하지 않습니다. 각 서비스의 공식 지원 범위와 계약·권한을 확인해야 합니다. 직접 연동이 어렵다면 해당 시스템의 사용 조건을 지키는 별도 접수·후속 처리 방식이 가능한지 검토합니다.',
  },
  {
    q: 'AI가 잘못된 답변을 하거나 알아듣지 못하면 어떻게 하나요?',
    a: '답할 수 있는 정보와 실행할 수 있는 업무를 제한하고, 필요한 정보를 재확인하도록 설계합니다. 근거가 없거나 반복 인식 실패, 업무 처리 오류가 발생하면 담당자 연결 또는 콜백 접수로 넘기는 흐름을 준비합니다. 오류가 전혀 없다고 보장하지는 않습니다.',
  },
  {
    q: '고객이 원하면 실제 직원과 통화할 수 있나요?',
    a: '실시간 전환은 회선·전화 시스템이 지원하고 직원이 응대할 수 있는 경우에 설계할 수 있습니다. 연결이 어렵거나 영업시간 밖이라면 후속 연락 요청을 남기는 콜백 흐름을 준비합니다. 실시간 연결과 콜백 접수는 서로 다른 기능입니다.',
  },
  {
    q: '24시간 운영할 수 있나요?',
    a: '24시간 접수를 목표로 구성할 수 있지만, 통신·AI 공급사·서버의 운영 조건과 장애 대응 범위를 함께 정해야 합니다. 사람이 처리해야 할 업무까지 24시간 해결되는 것은 아니며, 야간 접수는 다음 응대 시간의 후속 연락으로 이어질 수 있습니다.',
  },
  {
    q: '병원에서도 사용할 수 있나요?',
    a: '진료시간, 위치, 주차, 예약 관련 행정 업무를 중심으로 검토할 수 있습니다. 진단·치료·약물 판단을 AI가 대신하도록 제안하지 않으며, 필요한 개인정보 처리 기준과 기존 시스템 연동 조건은 도입 전에 별도로 확인합니다.',
  },
  {
    q: '통화 녹음과 대화 내용은 어디에 보관되나요?',
    a: '녹음 여부, 텍스트 기록 범위, 보관 위치와 기간은 선택하는 구성과 고객사의 정책에 따라 정합니다. 외부 AI·통신·저장 서비스에 전달되는 정보와 접근권한도 함께 확인합니다. 모든 통화를 반드시 녹음하는 방식만 제공하는 것은 아닙니다.',
  },
  {
    q: '구축비 외에 매달 비용이 발생하나요?',
    a: '선택한 운영·유지관리 범위와 통신·AI 모델·인프라 사용에 따른 비용이 발생할 수 있습니다. 초기 개발비, 월 운영비, 포함 사용량과 초과 비용, 외부 사업자 비용을 구분해 견적서에 안내합니다. 정확한 금액은 필요한 구성과 예상 사용량을 확인한 뒤 산정합니다.',
  },
  {
    q: '구축 기간은 얼마나 걸리나요?',
    a: '시나리오 수, 회선 준비, 자료 상태, 연동 권한과 검수 범위에 따라 달라집니다. 최초 상담에서 자동화할 업무를 좁힌 뒤 일정과 단계별 결과물을 제안합니다. 환경을 확인하기 전에는 확정 납기를 안내하지 않습니다.',
  },
  {
    q: '소스코드와 계정도 넘겨받을 수 있나요?',
    a: '름랩의 기존 소스코드·계정 이관 정책과 개별 계약 범위에 따라 안내합니다. 고객사 소유 계정으로 운영할 범위, 전달할 소스·문서, 외부 유료 서비스와 라이선스 조건을 구분합니다. 타사 라이선스나 소유할 수 없는 외부 서비스까지 이관된다고 설명하지 않습니다.',
  },
  {
    q: '지금 이 화면의 AI에게 실제로 전화할 수 있나요?',
    a: '현재 이 페이지는 구축 서비스를 설명하기 위한 가상 대화 예시를 제공합니다. 실제 AI 전화 체험 번호가 검증·운영 중인 경우에만 별도로 안내합니다. 페이지의 전화 상담 버튼은 름랩 담당자에게 연결하는 문의 수단입니다.',
  },
  {
    q: '상담하려면 무엇을 준비해야 하나요?',
    a: '가장 자주 받는 전화의 종류, 하루 전화량의 대략적인 범위, 사용 중인 예약·고객관리 시스템을 알려주시면 됩니다. 아직 정리되지 않았거나 시스템 이름을 모르는 경우에도 현재 업무 방식부터 설명하실 수 있습니다. 실제 고객 명단이나 민감한 상담 자료를 먼저 보내실 필요는 없습니다.',
  },
];

// ── 14. 실제 도입 문의 ────────────────────────────────────────

export const INQUIRY_HEADING = '가장 많이 걸려 오는 전화부터 알려주세요';
export const INQUIRY_LEAD =
  '기획서가 없어도 괜찮습니다. 지금 어떤 문의를 받고 있는지 알려주시면, AI가 맡을 범위와 사람이 맡을 범위부터 함께 정리합니다.';
export const INQUIRY_SUBMIT_LABEL = 'AI 전화상담 도입 검토 요청';
export const INQUIRY_PHONE_NOTE = '직접 설명하고 싶으신가요? 름랩 담당자에게 전화 상담';
export const INQUIRY_ASSURANCE =
  '이 문의는 구축 가능성·범위 검토를 위한 상담 신청이며, 자동 결제나 서비스 계약으로 이어지지 않습니다.';

/** 모바일 하단 CTA — 전화 버튼이 담당자 연결임을 명시한다 */
export const MOBILE_CTA = {
  primary: '도입 상담',
  secondary: '전화 상담',
  phoneNote: '름랩 담당자 연결',
} as const;

// ── 색인 품질 게이트 ─────────────────────────────────────────
export function aiVoiceDecision(): IndexDecision {
  return decideFromContent({
    title: AI_VOICE_TITLE,
    description: AI_VOICE_DESCRIPTION,
    h1: AI_VOICE_H1,
    bodyParts: [
      AI_VOICE_LEAD,
      AI_VOICE_BODY,
      AI_VOICE_SUB_NOTE,
      AI_VOICE_ENTITY_STATEMENT,
      DEFINITION_ANSWER,
      [...HERO_FEATURES],
      HERO_CARD.rows.map((r) => `${r.label} ${r.value}`),
      PROBLEMS.map((p) => `${p.title} ${p.body}`),
      COMPARE_ROWS.map((r) => `${r.item} ${r.direct} ${r.ars} ${r.voice}`),
      COMPARE_NOTE,
      DEMO_LEAD,
      SCENARIOS_FOR_SCORING.map((s) => `${s.label} ${s.introduction} ${s.turns.map((t) => t.text).join(' ')}`),
      INDUSTRY_SCOPES.map((i) => `${i.label} ${i.first} ${i.afterIntegration} ${i.human}`),
      SCOPE_NOTE,
      FEATURES.map((f) => `${f.title} ${f.body}`),
      FEATURES_NOTE,
      ADMIN_ROWS.map(
        (r) => `${r.industry} ${r.inquiryType} ${r.summary} ${r.nextAction} ${r.confirmed.join(' ')} ${r.steps.join(' ')}`,
      ),
      ADMIN_NOTE,
      [...ARCH_FLOW],
      ARCHITECTURE.map((a) => `${a.title} ${a.detail} ${a.parts.join(' ')}`),
      INTEGRATION_NOTE,
      CONTROL_LEVELS.map((c) => `${c.title} ${c.body}`),
      [...HANDOFF_CONDITIONS],
      PRIVACY_NOTE,
      MEDICAL_NOTE,
      COMPLIANCE_NOTE,
      PACKAGE_LEAD,
      VOICE_PACKAGES.map((p) => `${p.name} ${p.purpose} ${p.composition} ${p.handoff} ${p.admin} ${p.price}`),
      PACKAGE_BASELINE_NOTE,
      COST_ANSWER,
      COST_GROUPS.map((g) => `${g.title} ${g.lead} ${g.items.join(' ')}`),
      COST_SUPPLEMENT,
      [...COST_FACTORS],
      WORKLOAD_LEAD,
      PROCESS.map((p) => `${p.title} ${p.detail}`),
      FIRST_DELIVERABLE,
      [...EXPANSION_SCOPE],
      DURATION_NOTE,
      RELATED_CASE_NOTE,
      RELATED_LINKS.map((r) => `${r.label} ${r.note}`),
      INQUIRY_LEAD,
      INQUIRY_ASSURANCE,
    ],
    faqQuestions: FAQS.map((f) => f.q),
    // 브레드크럼 2 + 관련 서비스 5 + 사례 3 + 본문 교차링크 4
    internalLinks: 14,
    // 페이지 고유 이미지는 없다(다이어그램·데모는 HTML/CSS 로 만든다). 없는 것을 있다고 채점하지 않는다.
    hasUniqueMedia: false,
    evidence: {
      firstPartyEvidence: 'partial',
      independentSources: 0,
      hasMethodology: true,
      hasLimitations: true,
      reviewedAt: '2026-09-16',
      hasOriginalMedia: false,
    },
  });
}
