/**
 * 전화 업무량 계산 — 순수 함수. import 0개 (클라이언트 번들에 들어간다).
 *
 * 이것이 무엇인가
 *  사용자가 "지금 전화 업무에 얼마나 쓰고 있는지" 스스로 가늠해 보게 돕는 도구다.
 *
 * 이것이 무엇이 아닌가 (이 구분을 화면에도 그대로 쓴다)
 *  · 금전 ROI·투자 회수 기간 계산이 아니다.
 *  · 인건비 절감액 계산이 아니다. 시간이 줄어드는 것과 비용이 줄어드는 것은 다르다.
 *  · 견적 산출이 아니다. 여기 숫자로 금액을 제안하지 않는다.
 *  · 실측 성과가 아니다. 기본값은 전부 설명을 위한 임의의 가정이다.
 *  · 실패 통화·후속 업무·품질 관리·구축 비용을 반영하지 않은 계산이다.
 *
 * 계산 결과는 로컬에서만 쓴다. analytics·URL·localStorage 어디에도 보내지 않는다.
 */

export interface WorkloadInput {
  /** D — 하루 전화 수 (건) */
  callsPerDay: number;
  /** M — 평균 통화시간 (분) */
  minutesPerCall: number;
  /** W — 월 운영일 (일) */
  daysPerMonth: number;
  /** R — 반복 업무 비율 가정 (%) */
  repeatRatio: number;
  /** A — 그중 AI 완결 처리 비율 가정 (%) */
  aiHandleRatio: number;
  /** H — AI 처리 건당 사람 확인시간 가정 (분) */
  reviewMinutes: number;
}

export interface WorkloadField {
  key: keyof WorkloadInput;
  label: string;
  unit: string;
  min: number;
  max: number;
  /** 정수만 허용하는가 */
  integer: boolean;
  /** 화면에 그대로 읽히는 가정 설명 */
  note: string;
}

/** 입력 정의 — 화면 라벨·허용 범위의 단일 출처 (§8) */
export const WORKLOAD_FIELDS: readonly WorkloadField[] = [
  { key: 'callsPerDay', label: '하루 전화 수', unit: '건', min: 0, max: 1000, integer: true, note: '영업일 하루 평균으로 받는 전화 건수' },
  { key: 'minutesPerCall', label: '평균 통화시간', unit: '분', min: 0.5, max: 30, integer: false, note: '한 통화에 실제로 쓰는 평균 시간' },
  { key: 'daysPerMonth', label: '월 운영일', unit: '일', min: 1, max: 31, integer: true, note: '한 달에 전화를 받는 날의 수' },
  { key: 'repeatRatio', label: '반복 업무 비율(가정)', unit: '%', min: 0, max: 100, integer: false, note: '같은 안내·접수가 반복되는 통화의 비율' },
  { key: 'aiHandleRatio', label: 'AI 완결 처리 비율(가정)', unit: '%', min: 0, max: 100, integer: false, note: '반복 통화 중 AI가 끝까지 처리한다고 가정하는 비율' },
  { key: 'reviewMinutes', label: 'AI 처리 건당 사람 확인시간(가정)', unit: '분', min: 0, max: 30, integer: false, note: 'AI가 처리한 건을 사람이 확인·보완하는 데 드는 시간' },
];

/** 기본값 — 실측이 아니라 설명을 위한 임의의 가정 (§8) */
export const WORKLOAD_DEFAULTS: WorkloadInput = {
  callsPerDay: 20,
  minutesPerCall: 3,
  daysPerMonth: 22,
  repeatRatio: 60,
  aiHandleRatio: 70,
  reviewMinutes: 0.5,
};

export const WORKLOAD_ASSUMPTION_NOTE =
  '아래 기본값은 설명을 위한 임의의 가정이며 름랩 또는 고객사의 실측 성과가 아닙니다.';

export const WORKLOAD_LIMIT_NOTE =
  '이 계산은 실패한 통화, 통화 이후 후속 업무, 품질 관리, 구축·운영 비용을 반영하지 않습니다. 줄어드는 것은 전화에 묶여 있던 시간이며, 그만큼 인건비가 줄어든다는 뜻이 아닙니다.';

export interface WorkloadResult {
  /** N = D × W — 월 전체 전화 건수 */
  totalCalls: number;
  /** T = N × M — 현재 통화시간(분) */
  totalMinutes: number;
  /** K = N × (R/100) × (A/100) — 가정상 AI 완결 처리 건수 (기대값이라 소수가 나온다) */
  aiHandledCalls: number;
  /** G = K × M — 직접 응대 감소시간(분) */
  reducedMinutes: number;
  /** Q = K × H — 사람 확인시간(분) */
  reviewTotalMinutes: number;
  /** S = G − Q — 순감소 추정시간(분). 음수면 검토 부담이 더 크다는 뜻 */
  netMinutes: number;
  /** S < 0 — 숨기지 않고 "가정상 검토 부담이 더 큽니다"로 표시한다 */
  netIsNegative: boolean;
}

/**
 * 계산. 중간 단계에서 반올림하지 않는다 —
 * 건수 K 는 기대값이므로 소수 그대로 두고 표시할 때만 다듬는다.
 */
export function computeWorkload(input: WorkloadInput): WorkloadResult {
  const totalCalls = input.callsPerDay * input.daysPerMonth;
  const totalMinutes = totalCalls * input.minutesPerCall;
  const aiHandledCalls = totalCalls * (input.repeatRatio / 100) * (input.aiHandleRatio / 100);
  const reducedMinutes = aiHandledCalls * input.minutesPerCall;
  const reviewTotalMinutes = aiHandledCalls * input.reviewMinutes;
  const netMinutes = reducedMinutes - reviewTotalMinutes;
  return {
    totalCalls,
    totalMinutes,
    aiHandledCalls,
    reducedMinutes,
    reviewTotalMinutes,
    netMinutes,
    netIsNegative: netMinutes < 0,
  };
}

/** 분 → 시간. 표시 전용이며 계산 중간에는 쓰지 않는다. */
export const toHours = (minutes: number): number => minutes / 60;

/** 시간 표시 문구 — 소수 1자리. 0.05시간 미만은 '0시간'으로 뭉개지 않고 분으로 보여 준다. */
export function formatHours(minutes: number): string {
  const abs = Math.abs(minutes);
  if (abs < 6) return `${Math.round(abs * 10) / 10}분`;
  return `${(Math.round(toHours(abs) * 10) / 10).toLocaleString('ko-KR')}시간`;
}

/** 건수 표시 — 기대값이라 소수가 나온다. '약 185건' 형태. */
export function formatCalls(calls: number): string {
  const rounded = Math.round(calls);
  return Number.isInteger(calls) ? `${calls.toLocaleString('ko-KR')}건` : `약 ${rounded.toLocaleString('ko-KR')}건`;
}

export interface FieldError {
  key: keyof WorkloadInput;
  message: string;
}

/**
 * 입력 검증. 잘못된 값이 하나라도 있으면 결과를 렌더하지 않는다 —
 * NaN 이나 범위 밖 값으로 계산한 숫자를 화면에 띄우지 않기 위해서다.
 */
export function validateWorkload(raw: Record<keyof WorkloadInput, string | number>): FieldError[] {
  const errors: FieldError[] = [];
  for (const f of WORKLOAD_FIELDS) {
    const source = raw[f.key];
    const text = typeof source === 'number' ? String(source) : (source ?? '').trim();
    if (text === '') {
      errors.push({ key: f.key, message: `${f.label}을(를) 입력해 주세요.` });
      continue;
    }
    const n = Number(text);
    if (!Number.isFinite(n)) {
      errors.push({ key: f.key, message: `${f.label}은(는) 숫자로 입력해 주세요.` });
      continue;
    }
    if (f.integer && !Number.isInteger(n)) {
      errors.push({ key: f.key, message: `${f.label}은(는) 정수로 입력해 주세요.` });
      continue;
    }
    if (n < f.min || n > f.max) {
      errors.push({
        key: f.key,
        message: `${f.label}은(는) ${f.min}${f.unit} 이상 ${f.max}${f.unit} 이하로 입력해 주세요.`,
      });
    }
  }
  return errors;
}

/** 검증을 통과한 문자열 입력을 숫자로 바꾼다. 검증 전에 부르지 말 것. */
export function parseWorkload(raw: Record<keyof WorkloadInput, string | number>): WorkloadInput {
  const out = {} as WorkloadInput;
  for (const f of WORKLOAD_FIELDS) out[f.key] = Number(raw[f.key]);
  return out;
}

/**
 * 계산기 → 문의 폼으로 넘길 수 있는 유일한 값: 전화량 "범주" 하나뿐이다.
 * 상세 입력값(통화시간·가정 비율 등)은 어디로도 보내지 않는다(§8, §10.2).
 */
export const CALL_VOLUME_CHOICES = ['미정', '10건 미만', '10~30건', '31~100건', '101건 이상'] as const;
export type CallVolumeChoice = (typeof CALL_VOLUME_CHOICES)[number];

export function callVolumeBucket(callsPerDay: number): CallVolumeChoice {
  if (!Number.isFinite(callsPerDay) || callsPerDay <= 0) return '미정';
  if (callsPerDay < 10) return '10건 미만';
  if (callsPerDay <= 30) return '10~30건';
  if (callsPerDay <= 100) return '31~100건';
  return '101건 이상';
}
