/**
 * /ai-voice-development/ 문의 폼 전용 상수 — import 가 하나도 없는 모듈.
 *
 * 왜 별도 파일인가
 *  components/LandingInquiryForm.tsx 는 'use client' 다. 여기 있는 값을
 *  lib/ai-voice.ts 에서 가져오면 lib/seo.ts(1,124줄) → lib/pricing.ts 가
 *  모든 랜딩 페이지의 클라이언트 번들에 딸려 들어간다.
 *  (같은 이유로 lib/ai-search-form.ts 가 먼저 분리돼 있다 — 같은 규칙을 따른다.)
 *
 * ★ 이 파일에는 import 를 추가하지 말 것.
 *
 * 저장되는 필드 이름은 기존 접수 시스템(Netlify Forms `main-apply`)에 그대로 들어간다.
 * 이름을 바꾸면 과거 접수 내역과 열이 갈라진다 — public/__forms.html 과 함께 고칠 것.
 */

/** 업종 — 데모 시나리오 6종 + 미정/기타. 화면 라벨과 저장 값이 같다. */
export const VOICE_INDUSTRY_CHOICES = [
  '미정',
  '학원',
  '병원·의원',
  '미용실·뷰티',
  '부동산',
  'B2B·전문서비스',
  '고객센터',
  '기타',
] as const;
export type VoiceIndustryChoice = (typeof VOICE_INDUSTRY_CHOICES)[number];

/**
 * 데모 업종 ID → 폼 업종 값.
 * 데모 탭을 누르는 것만으로는 적용하지 않는다. "이 업종으로 도입 상담" 버튼을
 * 명시적으로 눌렀을 때만 쓴다(§10.2).
 */
export const INDUSTRY_BY_DEMO_ID: Record<string, VoiceIndustryChoice> = {
  b2b: 'B2B·전문서비스',
  academy: '학원',
  clinic: '병원·의원',
  beauty: '미용실·뷰티',
  'real-estate': '부동산',
  support: '고객센터',
};

/** 하루 전화량 — 계산기의 CALL_VOLUME_CHOICES 와 같은 구간이어야 한다 */
export const VOICE_CALL_VOLUME_CHOICES = ['미정', '10건 미만', '10~30건', '31~100건', '101건 이상'] as const;
export type VoiceCallVolumeChoice = (typeof VOICE_CALL_VOLUME_CHOICES)[number];

/** 관심 구축 범위 — 결제형 요금제가 아니라 상담 범위 제안이다 */
export const VOICE_PACKAGE_CHOICES = ['미정', 'Starter', 'Business', 'Enterprise'] as const;
export type VoicePackageChoice = (typeof VOICE_PACKAGE_CHOICES)[number];

/**
 * analytics 로 보낼 수 있는 비식별 ASCII enum.
 * 한글 라벨을 그대로 보내면 문구를 고칠 때마다 GA4 값이 갈라진다.
 */
export const VOICE_PACKAGE_TIER: Record<VoicePackageChoice, string> = {
  미정: 'UNDECIDED',
  Starter: 'STARTER',
  Business: 'BUSINESS',
  Enterprise: 'ENTERPRISE',
};

/** 데모 업종 ID → analytics 용 ASCII enum (한글 라벨을 보내지 않는다) */
export const VOICE_INDUSTRY_ENUM: Record<string, string> = {
  b2b: 'B2B',
  academy: 'ACADEMY',
  clinic: 'CLINIC',
  beauty: 'BEAUTY',
  'real-estate': 'REAL_ESTATE',
  support: 'SUPPORT',
};

/** 지금 전화 응대 방식 — 기존 `현재응대방식` 필드를 그대로 쓴다 */
export const VOICE_HANDLING_CHOICES = [
  '선택 안 함',
  '직원이 직접 받음',
  'ARS·자동응답 사용',
  '놓치는 전화가 많음',
  '콜센터 위탁',
  '아직 전화 응대 없음',
] as const;

/** 연동 대상 자유 입력 길이 상한 */
export const INTEGRATION_MAX = 200;
/** "AI가 맡았으면 하는 전화 업무" 자유 입력 길이 상한 (§10.1) */
export const VOICE_TASK_MAX = 1000;

export const VOICE_TASK_LABEL = 'AI가 맡았으면 하는 전화 업무';
export const VOICE_TASK_PLACEHOLDER = '예: 영업시간·위치 문의, 예약 접수·변경, 견적 문의, 담당자 연결 요청';
/** 민감정보를 적지 말라는 안내 — 폼 화면에 그대로 표시한다 */
export const VOICE_TASK_HINT =
  '실제 고객 이름·연락처·상담 원문처럼 민감한 정보는 적지 말아 주세요. 어떤 종류의 전화인지만 알려주시면 됩니다.';

/** 폼에 저장되는 필드 이름 — public/__forms.html 의 감지 스켈레톤과 반드시 같아야 한다 */
export const VOICE_FIELD_NAMES = {
  industry: '음성_업종',
  callVolume: '음성_하루전화량',
  package: '음성_관심상품',
} as const;

/** CTA 가 폼 값을 제안할 때 쓰는 data-* 속성 이름 */
export const VOICE_DATA_ATTR = {
  package: 'data-voice-package',
  industry: 'data-voice-industry',
  callVolume: 'data-voice-volume',
} as const;

/** data-voice-package 값(소문자 slug) → 폼 선택지 */
export const PACKAGE_BY_SLUG: Record<string, VoicePackageChoice> = {
  starter: 'Starter',
  business: 'Business',
  enterprise: 'Enterprise',
};
