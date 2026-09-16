/**
 * 전화 업무량 계산기 테스트.
 *
 *   node --import tsx --test scripts/ai-voice-workload.test.mts
 *
 * 명세 §8 의 기준값·엣지 케이스를 그대로 옮긴 것이다.
 * 계산이 틀리면 화면의 숫자가 곧바로 거짓이 되므로 여기서 막는다.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  CALL_VOLUME_CHOICES,
  WORKLOAD_DEFAULTS,
  WORKLOAD_FIELDS,
  callVolumeBucket,
  computeWorkload,
  formatCalls,
  formatHours,
  parseWorkload,
  toHours,
  validateWorkload,
  type WorkloadInput,
} from '../lib/ai-voice-workload';

/** 부동소수 오차 허용 비교 */
const near = (actual: number, expected: number, tol = 1e-9, msg?: string) =>
  assert.ok(Math.abs(actual - expected) < tol, msg ?? `${actual} ≈ ${expected} 이어야 한다`);

const raw = (v: Partial<WorkloadInput>) =>
  Object.fromEntries(
    Object.entries({ ...WORKLOAD_DEFAULTS, ...v }).map(([k, n]) => [k, String(n)]),
  ) as Record<keyof WorkloadInput, string>;

test('기본값 계산 — 명세 §8 의 기준 수치와 일치한다', () => {
  const r = computeWorkload(WORKLOAD_DEFAULTS);
  assert.equal(r.totalCalls, 440, 'N = 20 × 22');
  near(r.totalMinutes, 1320, 1e-9, 'T = 440 × 3');
  near(toHours(r.totalMinutes), 22);
  near(r.aiHandledCalls, 184.8, 1e-9, 'K = 440 × 0.6 × 0.7');
  near(r.reducedMinutes, 554.4, 1e-9, 'G = 184.8 × 3');
  near(r.reviewTotalMinutes, 92.4, 1e-9, 'Q = 184.8 × 0.5');
  near(r.netMinutes, 462, 1e-9, 'S = 554.4 − 92.4');
  near(toHours(r.netMinutes), 7.7, 1e-9);
  assert.equal(r.netIsNegative, false);
});

test('건수는 기대값이라 소수를 유지하고, 표시할 때만 "약 N건"으로 다듬는다', () => {
  const r = computeWorkload(WORKLOAD_DEFAULTS);
  assert.notEqual(r.aiHandledCalls, Math.round(r.aiHandledCalls), '중간 반올림을 하지 않는다');
  assert.equal(formatCalls(r.aiHandledCalls), '약 185건');
  assert.equal(formatCalls(440), '440건');
});

test('엣지 — 전화 0건이면 모든 결과가 0이다', () => {
  const r = computeWorkload({ ...WORKLOAD_DEFAULTS, callsPerDay: 0 });
  assert.equal(r.totalCalls, 0);
  assert.equal(r.totalMinutes, 0);
  assert.equal(r.aiHandledCalls, 0);
  assert.equal(r.reducedMinutes, 0);
  assert.equal(r.reviewTotalMinutes, 0);
  assert.equal(r.netMinutes, 0);
  assert.equal(r.netIsNegative, false);
});

test('엣지 — 반복 업무 0% 면 감소가 0이다', () => {
  const r = computeWorkload({ ...WORKLOAD_DEFAULTS, repeatRatio: 0 });
  assert.equal(r.aiHandledCalls, 0);
  assert.equal(r.reducedMinutes, 0);
  assert.equal(r.netMinutes, 0);
});

test('엣지 — AI 완결 처리 0% 면 감소가 0이다', () => {
  const r = computeWorkload({ ...WORKLOAD_DEFAULTS, aiHandleRatio: 0 });
  assert.equal(r.aiHandledCalls, 0);
  assert.equal(r.netMinutes, 0);
});

test('엣지 — 확인시간이 통화시간과 같으면 순감소가 0이다', () => {
  const r = computeWorkload({ ...WORKLOAD_DEFAULTS, reviewMinutes: WORKLOAD_DEFAULTS.minutesPerCall });
  near(r.netMinutes, 0);
  assert.equal(r.netIsNegative, false);
});

test('엣지 — 확인시간이 통화시간보다 크면 순증가를 숨기지 않고 표시한다', () => {
  const r = computeWorkload({ ...WORKLOAD_DEFAULTS, reviewMinutes: 5 });
  assert.ok(r.netMinutes < 0, '음수여야 한다');
  assert.equal(r.netIsNegative, true);
  near(r.netMinutes, 184.8 * 3 - 184.8 * 5);
});

test('검증 — 빈칸·NaN·음수·범위 초과·소수 정수필드를 각각 잡는다', () => {
  const only = (v: Partial<Record<keyof WorkloadInput, string>>) =>
    validateWorkload({ ...raw({}), ...v } as Record<keyof WorkloadInput, string>);

  assert.equal(only({ callsPerDay: '' }).length, 1, '빈칸');
  assert.equal(only({ callsPerDay: 'abc' })[0].key, 'callsPerDay', 'NaN');
  assert.equal(only({ callsPerDay: '-3' })[0].key, 'callsPerDay', '음수');
  assert.equal(only({ callsPerDay: '1001' })[0].key, 'callsPerDay', '상한 초과');
  assert.equal(only({ callsPerDay: '3.5' })[0].key, 'callsPerDay', '정수 필드에 소수');
  assert.equal(only({ daysPerMonth: '0' })[0].key, 'daysPerMonth', '하한 미만');
  assert.equal(only({ daysPerMonth: '32' })[0].key, 'daysPerMonth', '상한 초과');
  assert.equal(only({ minutesPerCall: '0.4' })[0].key, 'minutesPerCall', '통화시간 하한');
  assert.equal(only({ repeatRatio: '101' })[0].key, 'repeatRatio', '비율 상한');
  assert.equal(only({ reviewMinutes: '-0.1' })[0].key, 'reviewMinutes', '확인시간 음수');
});

test('검증 — 소수를 허용하는 필드는 소수를 통과시킨다', () => {
  assert.deepEqual(validateWorkload(raw({ minutesPerCall: 2.5, repeatRatio: 55.5, reviewMinutes: 0.25 })), []);
});

test('검증 — 기본값은 오류가 없다', () => {
  assert.deepEqual(validateWorkload(raw({})), []);
});

test('오류 메시지에 라벨과 허용 범위가 들어 있다', () => {
  const [err] = validateWorkload(raw({ callsPerDay: '5000' }));
  assert.match(err.message, /하루 전화 수/);
  assert.match(err.message, /1000건/);
});

test('parseWorkload 는 문자열 입력을 숫자로 바꾼다', () => {
  const parsed = parseWorkload(raw({}));
  assert.deepEqual(parsed, WORKLOAD_DEFAULTS);
  for (const v of Object.values(parsed)) assert.equal(typeof v, 'number');
});

test('시간 표시 — 6분 미만은 분으로, 그 이상은 시간으로', () => {
  assert.equal(formatHours(462), '7.7시간');
  assert.equal(formatHours(0), '0분');
  assert.equal(formatHours(3), '3분');
  assert.equal(formatHours(-462), '7.7시간', '부호는 문구로 구분하고 숫자는 절댓값으로 보여 준다');
});

test('전화량 범주는 폼 선택지와 같은 값만 돌려준다', () => {
  assert.equal(callVolumeBucket(0), '미정');
  assert.equal(callVolumeBucket(-1), '미정');
  assert.equal(callVolumeBucket(NaN), '미정');
  assert.equal(callVolumeBucket(5), '10건 미만');
  assert.equal(callVolumeBucket(10), '10~30건');
  assert.equal(callVolumeBucket(30), '10~30건');
  assert.equal(callVolumeBucket(31), '31~100건');
  assert.equal(callVolumeBucket(100), '31~100건');
  assert.equal(callVolumeBucket(101), '101건 이상');
  for (let n = 0; n <= 1000; n += 7) {
    assert.ok(CALL_VOLUME_CHOICES.includes(callVolumeBucket(n)), `${n} 이 선택지 밖 값을 냈다`);
  }
});

test('입력 정의가 화면 계약과 맞는다 — 6개 필드·라벨·단위·범위', () => {
  assert.equal(WORKLOAD_FIELDS.length, 6);
  for (const f of WORKLOAD_FIELDS) {
    assert.ok(f.label.trim(), `${f.key} 라벨`);
    assert.ok(f.unit.trim(), `${f.key} 단위`);
    assert.ok(f.note.trim(), `${f.key} 설명`);
    assert.ok(f.min < f.max, `${f.key} 범위`);
    assert.ok(f.key in WORKLOAD_DEFAULTS, `${f.key} 기본값`);
  }
});
