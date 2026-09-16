/**
 * 업종별 통화 시뮬레이션 데이터 + 순수 상태 계산 — 의존성이 하나도 없는 독립 모듈.
 *
 * 왜 lib/ai-voice.ts 에서 분리했나
 *  데모 UI(app/ai-voice-development/ConversationDemo.tsx)는 'use client' 다.
 *  그 파일이 lib/ai-voice.ts 를 import 하면 번들러가 lib/ai-voice.ts → lib/seo.ts(1,124줄) →
 *  lib/pricing.ts 까지 전부 클라이언트 번들에 끌어온다. 실제로 이 라우트의 First Load JS 가
 *  같은 폼을 쓰는 /geo-website/ 보다 31KB 더 컸다.
 *  → 대사·항목만 여기로 떼어 두고, 서버 쪽(lib/ai-voice.ts)은 이 모듈을 다시 내보낸다.
 *    화면과 색인 채점이 같은 배열을 쓰는 구조는 그대로다.
 *
 * ★ 이 파일에는 import 를 추가하지 말 것. 추가하는 순간 위 문제가 그대로 돌아온다.
 *
 * ── 이 데이터가 지키는 진실성 규칙 ─────────────────────────────
 *  1. 전부 가상 시나리오다. `simulated: true` 가 타입으로 강제된다.
 *  2. 초기 요약은 모든 항목이 "아직 확인 전"(값 null)이다.
 *     묻지 않은 항목을 '미정'으로 채우지 않는다 — '미정'(undecided)은 고객이 직접
 *     "아직 정하지 않았다"고 말한 뒤에만 쓴다.
 *  3. speaker: 'system' 은 통신사·외부 API 를 실제로 호출했다는 뜻이 아니다.
 *     화면에서 항상 "가상 시스템 단계"로 표시한다.
 *  4. 예약 '확정' 예시는 고객 재확인(customer-confirmed) → 가상 성공(simulated-tool-success)
 *     순서를 거친 뒤에만 나온다. 상담 시작부터 성공 상태를 미리 노출하지 않는다.
 *  5. 사람 이관(needs-human) 시나리오의 최종 상태는 '담당자 처리 필요'다.
 *     'AI 처리 완료'로 합산하지 않는다.
 *  6. 이름·전화번호·주민번호·증상은 대본 어디에도 수집 항목으로 두지 않는다.
 *  7. 대본은 고정 문자열이다. 프런트에서 LLM 을 호출해 매번 생성하지 않는다.
 */

// ── 타입 ────────────────────────────────────────────────────────

export type VoiceIndustry = 'b2b' | 'academy' | 'clinic' | 'beauty' | 'real-estate' | 'support';

/** confirmed = 고객이 말한 값 · undecided = 고객이 "아직 정하지 않았다"고 밝힌 상태 */
export type FieldStatus = 'confirmed' | 'undecided';

export interface FieldValue {
  value: string;
  status: FieldStatus;
}

/**
 * 발화에 붙는 상태 행동.
 *  confirm-request         AI 가 고객에게 재확인을 요청함
 *  customer-confirmed      고객이 명시적으로 재확인함
 *  simulated-tool-success  가상 시스템 처리 성공 (실제 API 호출 아님)
 *  needs-human             사람이 처리해야 할 요청으로 분류됨
 */
export type TurnAction = 'confirm-request' | 'customer-confirmed' | 'simulated-tool-success' | 'needs-human';

export interface DemoTurn {
  id: string;
  speaker: 'ai' | 'customer' | 'system';
  text: string;
  /** 이 발화 "이후" 반영되는 항목 */
  updates?: Record<string, FieldValue>;
  action?: TurnAction;
}

export interface DemoField {
  key: string;
  label: string;
}

export type OutcomeType = 'intake-example' | 'reservation-example' | 'handoff-example';

export interface DemoScenario {
  id: VoiceIndustry;
  label: string;
  /** 타입 수준에서 가상임을 못 박는다 */
  simulated: true;
  /** 상호작용 없이도 읽히는 업종 설명 (초기 HTML 에 그대로 들어간다) */
  introduction: string;
  fields: readonly DemoField[];
  turns: readonly DemoTurn[];
  /** 대본이 끝나도 확인되지 않은 채 남는 항목의 field key — 없는 정보를 채워 보이지 않기 위함 */
  unresolved: readonly string[];
  outcome: {
    type: OutcomeType;
    title: string;
    nextStep: string;
  };
}

// ── 화면 라벨 (단일 출처) ───────────────────────────────────────

/** 아직 한 번도 나오지 않은 항목에 쓰는 문구 */
export const NOT_YET_LABEL = '아직 확인 전';
/** 대본이 끝나도 확인되지 않는 항목 */
export const UNRESOLVED_LABEL = '미확인';

/** 관리자 화면·결과 패널이 공유하는 상태 enum */
export const OUTCOME_STATUS = {
  intake: '접수 예시',
  review: '추가 확인 필요',
  human: '담당자 처리 필요',
} as const;

export type OutcomeStatus = (typeof OUTCOME_STATUS)[keyof typeof OUTCOME_STATUS];

export const SIMULATION_NOTICE =
  '가상 시나리오로 만든 화면 예시입니다. 실제 전화·음성 AI·예약·CRM 전송은 실행되지 않습니다.';

export const SYSTEM_SPEAKER_LABEL = '가상 시스템 단계';

// ── 시나리오 ────────────────────────────────────────────────────

const B2B: DemoScenario = {
  id: 'b2b',
  label: 'B2B·개발 문의',
  simulated: true,
  introduction:
    '개발 가능 여부·견적·납기를 확정하지 않고 문의 내용을 구조화하는 예시입니다. 예산과 일정은 고객이 말한 희망 조건이며 확정 견적이나 납기가 아닙니다.',
  fields: [
    { key: 'project', label: '프로젝트' },
    { key: 'platform', label: '플랫폼' },
    { key: 'features', label: '핵심 기능' },
    { key: 'budget', label: '고객 희망 예산' },
    { key: 'timeline', label: '고객 희망 일정' },
    { key: 'role', label: '의사결정 역할' },
    { key: 'followup', label: '희망 후속 연락' },
    { key: 'contact', label: '실제 연락처' },
  ],
  turns: [
    { id: 'b2b-1', speaker: 'ai', text: '안녕하세요. 름랩 AI 상담원입니다. 어떤 개발 문의인지 말씀해 주세요.' },
    {
      id: 'b2b-2',
      speaker: 'customer',
      text: '학원 예약 플랫폼을 만들고 싶어서요.',
      updates: { project: { value: '학원 예약 플랫폼', status: 'confirmed' } },
    },
    { id: 'b2b-3', speaker: 'ai', text: '고객이 사용할 앱과 학원에서 관리할 화면은 어떤 형태로 필요하신가요?' },
    {
      id: 'b2b-4',
      speaker: 'customer',
      text: '학부모는 아이폰이랑 안드로이드 앱을 쓰고, 학원에서는 웹 관리자 화면이 필요해요.',
      updates: { platform: { value: 'iOS + Android + 웹 관리자', status: 'confirmed' } },
    },
    { id: 'b2b-5', speaker: 'ai', text: '우선 포함하려는 핵심 기능을 알려주실 수 있을까요?' },
    {
      id: 'b2b-6',
      speaker: 'customer',
      text: '회원가입, 학원 검색, 예약, 결제가 필요해요.',
      updates: { features: { value: '회원가입 / 학원 검색 / 예약 / 결제', status: 'confirmed' } },
    },
    {
      id: 'b2b-7',
      speaker: 'ai',
      text: '고려 중인 예산과 희망 일정이 있으신가요? 정해지지 않은 항목은 미정으로 남길 수 있습니다.',
    },
    {
      id: 'b2b-8',
      speaker: 'customer',
      text: '예산은 2,000만원 내외고, 4개월 정도 생각하고 있어요.',
      updates: {
        budget: { value: '2,000만원 내외 · 고객 희망', status: 'confirmed' },
        timeline: { value: '4개월 · 고객 희망', status: 'confirmed' },
      },
    },
    { id: 'b2b-9', speaker: 'ai', text: '프로젝트 결정은 직접 담당하시나요? 후속 연락을 받기 편한 시간도 알려주세요.' },
    {
      id: 'b2b-10',
      speaker: 'customer',
      text: '네, 제가 대표고 오늘 오후에 연락받으면 좋겠어요.',
      updates: {
        role: { value: '대표 · 고객 진술', status: 'confirmed' },
        followup: { value: '오늘 오후 · 예시 대본의 희망 시간', status: 'confirmed' },
      },
    },
    {
      id: 'b2b-11',
      speaker: 'ai',
      text: '학원 예약 플랫폼, 학부모 앱과 웹 관리자, 네 가지 핵심 기능으로 정리했습니다. 예산과 일정은 희망 조건이며, 개발 범위와 최종 견적은 담당자 검토가 필요합니다.',
    },
    {
      id: 'b2b-12',
      speaker: 'system',
      text: '가상 정리 단계입니다. 실제 고객 정보 등록이나 담당자 알림은 발송하지 않습니다. 연락처는 이 예시에서 확인하지 않았습니다.',
    },
  ],
  unresolved: ['contact'],
  outcome: {
    type: 'intake-example',
    title: '개발 문의 정리 예시',
    nextStep: '실제 연락처 확인 후 담당자가 범위·견적·일정 검토',
  },
};

const ACADEMY: DemoScenario = {
  id: 'academy',
  label: '학원',
  simulated: true,
  introduction:
    '이미 나온 학년·과목을 다시 묻지 않는 상담 접수 예시입니다. 상담 접수만 보여 주며 수강 등록·성적 향상·수강료 할인은 확정하지 않습니다.',
  fields: [
    { key: 'grade', label: '학년' },
    { key: 'subject', label: '과목' },
    { key: 'goal', label: '상담 목표' },
    { key: 'time', label: '희망 상담 시간' },
    { key: 'appointment', label: '상담 일정 확정 여부' },
  ],
  turns: [
    { id: 'academy-1', speaker: 'ai', text: '안녕하세요. 학원 AI 상담원입니다. 어떤 상담을 원하시나요?' },
    {
      id: 'academy-2',
      speaker: 'customer',
      text: '중학교 2학년 수학 상담을 받고 싶어요.',
      updates: {
        grade: { value: '중학교 2학년', status: 'confirmed' },
        subject: { value: '수학', status: 'confirmed' },
      },
    },
    {
      id: 'academy-3',
      speaker: 'ai',
      text: '중2 수학 상담이시군요. 내신 대비와 선행학습 중 어떤 부분을 주로 상담하고 싶으신가요?',
    },
    {
      id: 'academy-4',
      speaker: 'customer',
      text: '이번 학기 내신 대비가 필요해요.',
      updates: { goal: { value: '이번 학기 내신 대비', status: 'confirmed' } },
    },
    { id: 'academy-5', speaker: 'ai', text: '상담받기 편한 요일이나 시간대가 있으실까요?' },
    {
      id: 'academy-6',
      speaker: 'customer',
      text: '평일 저녁 7시 이후면 좋아요.',
      updates: { time: { value: '평일 19시 이후 희망', status: 'confirmed' } },
    },
    {
      id: 'academy-7',
      speaker: 'ai',
      text: '중2 수학 내신 대비, 평일 저녁 7시 이후 상담 희망으로 정리하겠습니다. 실제 상담 가능 일정은 담당자 확인 후 확정합니다.',
    },
    {
      id: 'academy-8',
      speaker: 'system',
      text: '상담 접수 항목을 보여 주는 가상 예시입니다. 수강 등록이나 상담 예약은 실행되지 않았습니다.',
    },
  ],
  unresolved: ['appointment'],
  outcome: {
    type: 'intake-example',
    title: '학원 상담 정리 예시',
    nextStep: '연락처와 실제 상담 가능 시간 확인',
  },
};

const CLINIC: DemoScenario = {
  id: 'clinic',
  label: '병원·의원',
  simulated: true,
  introduction:
    '의료 판단이나 증상 수집 없이 예약 관련 행정 정보만 확인하는 예시입니다. 진단·치료·약물 판단을 AI가 대신하지 않으며, 증상·주민등록번호를 받는 칸을 두지 않습니다.',
  fields: [
    { key: 'purpose', label: '문의 유형' },
    { key: 'department', label: '희망 진료과' },
    { key: 'time', label: '희망 시간' },
    { key: 'reservation', label: '실제 예약 상태' },
  ],
  turns: [
    {
      id: 'clinic-1',
      speaker: 'ai',
      text: '안녕하세요. 병원 AI 행정 안내입니다. 예약과 이용 안내를 도와드리는 예시입니다. 어떤 문의이신가요?',
    },
    {
      id: 'clinic-2',
      speaker: 'customer',
      text: '진료 예약이 가능한지 문의하고 싶어요.',
      updates: { purpose: { value: '진료 예약 가능 여부 문의', status: 'confirmed' } },
    },
    {
      id: 'clinic-3',
      speaker: 'ai',
      text: '희망하시는 진료과와 방문 시간대를 알려주세요. 이 접수에서는 증상이나 주민등록번호를 말씀하지 않으셔도 됩니다.',
    },
    {
      id: 'clinic-4',
      speaker: 'customer',
      text: '내과로 평일 오후에 방문하고 싶어요.',
      updates: {
        department: { value: '내과', status: 'confirmed' },
        time: { value: '평일 오후 희망', status: 'confirmed' },
      },
    },
    {
      id: 'clinic-5',
      speaker: 'ai',
      text: '내과, 평일 오후 예약 문의로 정리하겠습니다. 실제 예약 가능 여부는 병원의 예약 절차에 따라 담당자가 확인합니다.',
    },
    {
      id: 'clinic-6',
      speaker: 'system',
      text: '예약 행정 접수의 가상 예시입니다. 진단·치료 판단이나 실제 예약 처리는 하지 않았습니다.',
    },
  ],
  unresolved: ['reservation'],
  outcome: {
    type: 'intake-example',
    title: '예약 행정 문의 예시',
    nextStep: '담당자가 예약 절차와 가능 여부 확인',
  },
};

const BEAUTY: DemoScenario = {
  id: 'beauty',
  label: '미용실·뷰티',
  simulated: true,
  introduction:
    '고객 재확인 뒤에만 가상 예약 성공 상태를 보여 주는 흐름입니다. 화면의 예약 가능 시간은 고정된 예시이며 실제 매장의 빈자리가 아닙니다.',
  fields: [
    { key: 'service', label: '희망 시술' },
    { key: 'requestedTime', label: '희망 시간' },
    { key: 'designer', label: '담당자 선호' },
    { key: 'confirmation', label: '고객 재확인' },
    { key: 'reservation', label: '예약 결과' },
  ],
  turns: [
    { id: 'beauty-1', speaker: 'ai', text: '안녕하세요. 뷰티 매장 AI 상담원입니다. 어떤 예약을 원하시나요?' },
    {
      id: 'beauty-2',
      speaker: 'customer',
      text: '토요일 오후에 커트 가능한가요?',
      updates: {
        service: { value: '커트', status: 'confirmed' },
        requestedTime: { value: '토요일 오후 희망', status: 'confirmed' },
      },
    },
    { id: 'beauty-3', speaker: 'ai', text: '희망하는 담당자가 있으신가요?' },
    {
      id: 'beauty-4',
      speaker: 'customer',
      text: '담당자는 상관없어요.',
      updates: { designer: { value: '지정 없음 · 고객 선택', status: 'confirmed' } },
    },
    {
      id: 'beauty-5',
      speaker: 'system',
      text: '가상 예약표 조회 예시: 토요일 오후 3시 한 자리를 제시합니다. 실제 매장의 빈자리가 아닙니다.',
    },
    {
      id: 'beauty-6',
      speaker: 'ai',
      text: '이 예시에서는 토요일 오후 3시로 선택할 수 있습니다. 커트, 담당자 지정 없음으로 예약하는 흐름을 진행할까요?',
      action: 'confirm-request',
    },
    {
      id: 'beauty-7',
      speaker: 'customer',
      text: '네, 그 시간으로 해주세요.',
      updates: { confirmation: { value: '토요일 15시 · 커트 · 담당자 지정 없음 재확인', status: 'confirmed' } },
      action: 'customer-confirmed',
    },
    {
      id: 'beauty-8',
      speaker: 'system',
      text: '고객 재확인 후 가상 예약 처리 성공 단계를 보여 줍니다. 실제 API 호출이나 예약은 발생하지 않습니다.',
      updates: { reservation: { value: '예약 확정 예시 · 실제 예약 아님', status: 'confirmed' } },
      action: 'simulated-tool-success',
    },
    {
      id: 'beauty-9',
      speaker: 'ai',
      text: '예약 확정 후 시간과 시술 내용을 다시 안내하는 흐름입니다. 화면의 결과는 가상 예시입니다.',
    },
  ],
  unresolved: [],
  outcome: {
    type: 'reservation-example',
    title: '예약 확정 흐름 예시',
    nextStep: '실제 구축에서는 예약 시스템의 성공 응답과 저장 상태 확인',
  },
};

const REAL_ESTATE: DemoScenario = {
  id: 'real-estate',
  label: '부동산',
  simulated: true,
  introduction:
    '고객이 말한 매물 조건만 정리하는 예시입니다. 실제 매물 보유·추천·계약을 보장하지 않으며, 조건에 맞는 매물이 있다고 답하지 않습니다.',
  fields: [
    { key: 'region', label: '희망 지역' },
    { key: 'type', label: '거래 유형' },
    { key: 'deposit', label: '희망 보증금' },
    { key: 'rent', label: '희망 월세' },
    { key: 'rooms', label: '방 조건' },
    { key: 'move', label: '희망 입주' },
    { key: 'extra', label: '기타 조건' },
  ],
  turns: [
    { id: 'estate-1', speaker: 'ai', text: '안녕하세요. 부동산 AI 접수입니다. 희망하는 거래 유형과 지역을 말씀해 주세요.' },
    {
      id: 'estate-2',
      speaker: 'customer',
      text: '동탄에서 월세를 찾고 있어요.',
      updates: {
        region: { value: '동탄', status: 'confirmed' },
        type: { value: '월세', status: 'confirmed' },
      },
    },
    { id: 'estate-3', speaker: 'ai', text: '생각하시는 보증금과 월세 범위를 알려주세요.' },
    {
      id: 'estate-4',
      speaker: 'customer',
      text: '보증금은 3,000만원 이하, 월세도 120만원 이하였으면 해요.',
      updates: {
        deposit: { value: '3,000만원 이하 희망', status: 'confirmed' },
        rent: { value: '120만원 이하 희망', status: 'confirmed' },
      },
    },
    { id: 'estate-5', speaker: 'ai', text: '방 개수, 입주 시기와 꼭 필요한 조건이 있으신가요?' },
    {
      id: 'estate-6',
      speaker: 'customer',
      text: '방은 3개 이상이고 10월에 들어가고 싶어요. 반려동물도 가능해야 해요.',
      updates: {
        rooms: { value: '3개 이상', status: 'confirmed' },
        move: { value: '10월 희망 · 가상 예시', status: 'confirmed' },
        extra: { value: '반려동물 가능 조건', status: 'confirmed' },
      },
    },
    {
      id: 'estate-7',
      speaker: 'ai',
      text: '동탄 월세, 보증금 3,000만원과 월 120만원 이하, 방 3개 이상, 10월 입주와 반려동물 조건으로 정리했습니다. 해당 매물의 실제 존재와 계약 조건은 중개사가 확인합니다.',
    },
    {
      id: 'estate-8',
      speaker: 'system',
      text: '조건을 정리하는 가상 예시입니다. 실제 매물 조회·추천·계약은 실행되지 않았습니다.',
    },
  ],
  unresolved: [],
  outcome: {
    type: 'intake-example',
    title: '매물 조건 접수 예시',
    nextStep: '중개사가 매물 존재·계약 조건 확인',
  },
};

const SUPPORT: DemoScenario = {
  id: 'support',
  label: '고객센터',
  simulated: true,
  introduction:
    '환불 승인 대신 사람이 처리해야 할 요청으로 분류하는 예시입니다. 환불 금액·적용 여부를 AI가 판단하지 않고, 실제 주문·고객 조회도 하지 않습니다.',
  fields: [
    { key: 'intent', label: '문의 유형' },
    { key: 'request', label: '고객 요청' },
    { key: 'handling', label: '처리 방향' },
    { key: 'refund', label: '환불 승인 상태' },
  ],
  turns: [
    { id: 'support-1', speaker: 'ai', text: '안녕하세요. 고객센터 AI 접수입니다. 어떤 문의를 남기시겠어요?' },
    {
      id: 'support-2',
      speaker: 'customer',
      text: '환불 문제 때문에 직원하고 직접 이야기하고 싶어요.',
      updates: {
        intent: { value: '환불 관련 문의', status: 'confirmed' },
        request: { value: '실제 직원 상담 요청', status: 'confirmed' },
      },
    },
    {
      id: 'support-3',
      speaker: 'ai',
      text: '환불 여부나 금액은 제가 확정하지 않고 담당자가 확인하도록 정리하겠습니다. 실시간 연결이 어려울 때는 후속 연락을 받는 방식으로 접수할 수 있습니다.',
    },
    {
      id: 'support-4',
      speaker: 'customer',
      text: '네, 담당자 설명을 듣고 싶어요.',
      updates: { handling: { value: '담당자 설명·후속 연락 희망', status: 'confirmed' } },
    },
    {
      id: 'support-5',
      speaker: 'system',
      text: '직원 요청과 환불 관련 문의를 사람 이관 대상으로 분류한 가상 예시입니다. 실시간 연결·콜백 발신·환불 처리는 실행되지 않았습니다.',
      action: 'needs-human',
    },
  ],
  unresolved: ['refund'],
  outcome: {
    type: 'handoff-example',
    title: '담당자 처리 필요 예시',
    nextStep: '실제 운영에서는 본인 확인과 담당자 응대 절차 진행',
  },
};

/** 기본 선택은 름랩 자체 적용을 설명할 수 있는 B2B 다 (§6-03) */
export const DEMO_SCENARIOS: readonly DemoScenario[] = [B2B, ACADEMY, CLINIC, BEAUTY, REAL_ESTATE, SUPPORT];

export const DEFAULT_INDUSTRY: VoiceIndustry = 'b2b';

export function getScenario(id: VoiceIndustry): DemoScenario {
  return DEMO_SCENARIOS.find((s) => s.id === id) ?? B2B;
}

// ── 순수 상태 계산 ──────────────────────────────────────────────

export interface DemoState {
  /** field key → 값. 아직 안 나온 항목은 null (= "아직 확인 전") */
  values: Record<string, FieldValue | null>;
  /** 값이 채워진 항목 수 */
  filled: number;
  /** AI 가 재확인을 요청했고 고객이 아직 답하지 않은 상태 */
  awaitingConfirmation: boolean;
  customerConfirmed: boolean;
  /** 가상 시스템 처리 성공 단계를 지났는가 */
  toolSucceeded: boolean;
  needsHuman: boolean;
  /** 대본을 끝까지 진행했는가 */
  finished: boolean;
}

/**
 * step 발화까지 진행했을 때의 상태.
 *
 * step = 0  → 아무 대사도 표시되지 않은 상태. 모든 항목이 null.
 * step = n  → 앞에서 n개의 발화가 표시된 상태.
 *
 * 단계별 진행과 '전체 결과 보기'가 같은 함수를 쓴다 — 두 경로가 갈라지면
 * 화면에 보이는 대사와 요약이 어긋난다.
 */
export function stateAfter(scenario: DemoScenario, step: number): DemoState {
  const values: Record<string, FieldValue | null> = {};
  for (const f of scenario.fields) values[f.key] = null;

  const total = scenario.turns.length;
  const n = Math.max(0, Math.min(step, total));

  let awaitingConfirmation = false;
  let customerConfirmed = false;
  let toolSucceeded = false;
  let needsHuman = false;

  for (let i = 0; i < n; i++) {
    const turn = scenario.turns[i];
    if (turn.updates) {
      for (const [key, value] of Object.entries(turn.updates)) {
        // fields 에 없는 key 는 무시한다 — 화면에 없는 항목이 조용히 생기지 않게.
        if (key in values) values[key] = value;
      }
    }
    switch (turn.action) {
      case 'confirm-request':
        awaitingConfirmation = true;
        break;
      case 'customer-confirmed':
        awaitingConfirmation = false;
        customerConfirmed = true;
        break;
      case 'simulated-tool-success':
        toolSucceeded = true;
        break;
      case 'needs-human':
        needsHuman = true;
        break;
      default:
        break;
    }
  }

  let filled = 0;
  for (const key of Object.keys(values)) if (values[key]) filled++;

  return { values, filled, awaitingConfirmation, customerConfirmed, toolSucceeded, needsHuman, finished: n >= total };
}

/** 대본 시작 전 상태 — 모든 항목이 "아직 확인 전" 임을 보장한다 */
export function initialState(scenario: DemoScenario): DemoState {
  return stateAfter(scenario, 0);
}

/**
 * 현재 상태의 처리 구분.
 *
 * · 사람 이관이 발생했으면 무조건 '담당자 처리 필요' — AI 처리 완료로 합산하지 않는다.
 * · 대본이 끝나지 않았거나 확인 못 한 항목이 남았으면 '추가 확인 필요'.
 * · 예약 예시는 고객 재확인 + 가상 성공 단계를 모두 지나야 '접수 예시'가 된다.
 */
export function outcomeStatus(scenario: DemoScenario, state: DemoState): OutcomeStatus {
  if (state.needsHuman) return OUTCOME_STATUS.human;
  if (!state.finished) return OUTCOME_STATUS.review;
  if (scenario.outcome.type === 'reservation-example' && !(state.customerConfirmed && state.toolSucceeded)) {
    return OUTCOME_STATUS.review;
  }
  if (scenario.unresolved.length > 0) return OUTCOME_STATUS.review;
  return OUTCOME_STATUS.intake;
}

/** 예약 '확정' 표기를 보여도 되는 시점인가 (§7.1) */
export function canShowReservationConfirmed(scenario: DemoScenario, state: DemoState): boolean {
  return scenario.outcome.type === 'reservation-example' && state.customerConfirmed && state.toolSucceeded;
}

/** 항목의 화면 표시 문구 — 없는 정보를 채워 보이지 않는다 */
export function displayValue(scenario: DemoScenario, state: DemoState, key: string): string {
  const v = state.values[key];
  if (v) return v.value;
  if (state.finished && scenario.unresolved.includes(key)) return UNRESOLVED_LABEL;
  return NOT_YET_LABEL;
}

// ── 데이터 무결성 검사 (테스트·빌드 검증기가 함께 쓴다) ─────────

/**
 * 시나리오 배열의 구조 문제를 전부 모아 돌려준다. 빈 배열이면 이상 없음.
 * 던지지 않는 이유: 테스트에서 "무엇이 몇 개 틀렸는지"를 한 번에 보기 위해서다.
 */
export function validateScenarios(list: readonly DemoScenario[] = DEMO_SCENARIOS): string[] {
  const problems: string[] = [];
  const seenIndustry = new Set<string>();
  const seenTurnId = new Set<string>();
  const validActions: TurnAction[] = ['confirm-request', 'customer-confirmed', 'simulated-tool-success', 'needs-human'];
  const validOutcomes: OutcomeType[] = ['intake-example', 'reservation-example', 'handoff-example'];

  for (const s of list) {
    if (seenIndustry.has(s.id)) problems.push(`업종 ID 중복: ${s.id}`);
    seenIndustry.add(s.id);

    if (s.simulated !== true) problems.push(`${s.id}: simulated 가 true 가 아님`);
    if (!s.introduction.trim()) problems.push(`${s.id}: introduction 이 비어 있음`);
    if (!validOutcomes.includes(s.outcome.type)) problems.push(`${s.id}: 결과 enum 이 유효하지 않음 (${s.outcome.type})`);
    if (!s.outcome.title.trim() || !s.outcome.nextStep.trim()) problems.push(`${s.id}: outcome 문구 누락`);

    const fieldKeys = new Set<string>();
    for (const f of s.fields) {
      if (fieldKeys.has(f.key)) problems.push(`${s.id}: field key 중복 (${f.key})`);
      fieldKeys.add(f.key);
      if (!f.label.trim()) problems.push(`${s.id}: ${f.key} 라벨 누락`);
    }

    for (const key of s.unresolved) {
      if (!fieldKeys.has(key)) problems.push(`${s.id}: unresolved 의 ${key} 가 fields 에 없음`);
    }

    for (const t of s.turns) {
      if (seenTurnId.has(t.id)) problems.push(`발화 ID 중복: ${t.id}`);
      seenTurnId.add(t.id);
      if (!t.text.trim()) problems.push(`${t.id}: 대사가 비어 있음`);
      if (t.action && !validActions.includes(t.action)) problems.push(`${t.id}: action enum 이 유효하지 않음`);
      for (const key of Object.keys(t.updates ?? {})) {
        if (!fieldKeys.has(key)) problems.push(`${t.id}: updates 의 ${key} 가 fields 에 없음`);
      }
      for (const [key, value] of Object.entries(t.updates ?? {})) {
        if (value.status !== 'confirmed' && value.status !== 'undecided') {
          problems.push(`${t.id}: ${key} 의 status 가 유효하지 않음`);
        }
        if (!value.value.trim()) problems.push(`${t.id}: ${key} 의 값이 비어 있음`);
      }
    }

    // 예약 예시는 반드시 confirm-request → customer-confirmed → simulated-tool-success 순서다.
    if (s.outcome.type === 'reservation-example') {
      const order = s.turns.map((t) => t.action).filter(Boolean) as TurnAction[];
      const iReq = order.indexOf('confirm-request');
      const iOk = order.indexOf('customer-confirmed');
      const iTool = order.indexOf('simulated-tool-success');
      if (iReq < 0 || iOk < 0 || iTool < 0 || !(iReq < iOk && iOk < iTool)) {
        problems.push(`${s.id}: 예약 예시의 재확인 → 고객 확인 → 가상 성공 순서가 성립하지 않음`);
      }
    }

    // 사람 이관 예시는 needs-human 을 반드시 포함한다.
    if (s.outcome.type === 'handoff-example' && !s.turns.some((t) => t.action === 'needs-human')) {
      problems.push(`${s.id}: handoff 예시인데 needs-human 이 없음`);
    }
  }
  return problems;
}
