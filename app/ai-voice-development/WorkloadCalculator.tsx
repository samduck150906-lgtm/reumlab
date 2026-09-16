'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
// 의존성 0 모듈에서만 가져온다 — lib/ai-voice.ts 를 부르면 lib/seo.ts 가 번들에 딸려 온다.
import {
  WORKLOAD_FIELDS,
  WORKLOAD_DEFAULTS,
  WORKLOAD_ASSUMPTION_NOTE,
  WORKLOAD_LIMIT_NOTE,
  computeWorkload,
  validateWorkload,
  parseWorkload,
  formatHours,
  formatCalls,
  callVolumeBucket,
  type WorkloadInput,
} from '@/lib/ai-voice-workload';
import { VOICE_DATA_ATTR } from '@/lib/ai-voice-form';
import { EVENT, pushEvent } from '@/lib/analytics';
import styles from './ai-voice.module.css';

/**
 * 전화 업무량 계산기 — 시간 계산이지 금전 ROI·견적이 아니다.
 *
 * 지키는 것
 *  · 입력값은 이 컴포넌트 밖으로 나가지 않는다. analytics·URL·sessionStorage 어디에도 쓰지 않는다.
 *    보내는 것은 "상호작용이 있었다"는 사실(interaction 종류)뿐이다.
 *  · 잘못된 입력이 하나라도 있으면 결과를 아예 렌더하지 않는다 — NaN·범위 밖 값으로 계산한
 *    숫자를 화면에 띄우지 않기 위해서다.
 *  · 순감소가 음수여도 0으로 숨기지 않는다. "가정상 검토 부담이 더 큽니다"로 표시한다.
 *  · 값이 바뀔 때마다 포커스를 옮기지 않는다. 스크린리더 알림은 입력에서 포커스가 빠질 때
 *    한 줄만 갱신한다(키 입력마다 낭독하지 않는다).
 *  · 결과 영역은 항상 자리를 차지한다 — 오류/정상 전환에서 페이지 높이가 요동하지 않는다.
 */

type RawInput = Record<keyof WorkloadInput, string>;

const toRaw = (v: WorkloadInput): RawInput =>
  Object.fromEntries(Object.entries(v).map(([k, n]) => [k, String(n)])) as RawInput;

export default function WorkloadCalculator() {
  const [raw, setRaw] = useState<RawInput>(() => toRaw(WORKLOAD_DEFAULTS));
  /** 스크린리더용 한 줄 — 포커스가 빠질 때만 갱신한다 */
  const [announced, setAnnounced] = useState('');
  const interactedRef = useRef(false);

  const errors = useMemo(() => validateWorkload(raw), [raw]);
  const errorByKey = useMemo(() => new Map(errors.map((e) => [e.key, e.message])), [errors]);
  const result = useMemo(() => (errors.length ? null : computeWorkload(parseWorkload(raw))), [errors, raw]);

  const onChange = useCallback((key: keyof WorkloadInput, value: string) => {
    setRaw((prev) => ({ ...prev, [key]: value }));
    if (!interactedRef.current) {
      interactedRef.current = true;
      // 입력값은 싣지 않는다 — "계산기를 만졌다"는 사실만 남긴다.
      pushEvent(EVENT.voiceWorkloadInteract, { interaction: 'input-change' });
    }
  }, []);

  const onBlur = useCallback(() => {
    if (!result) {
      setAnnounced('입력값을 확인해 주세요.');
      return;
    }
    setAnnounced(
      result.netIsNegative
        ? `가정상 검토 부담이 ${formatHours(result.netMinutes)} 더 큽니다.`
        : `순감소 추정 ${formatHours(result.netMinutes)}입니다.`,
    );
  }, [result]);

  const volumeBucket = result ? callVolumeBucket(Number(raw.callsPerDay)) : '미정';

  return (
    <div className={styles.calc}>
      <p className={styles.calcAssumption}>{WORKLOAD_ASSUMPTION_NOTE}</p>

      <div className={styles.calcGrid}>
        {WORKLOAD_FIELDS.map((f) => {
          const id = `voice-calc-${f.key}`;
          const error = errorByKey.get(f.key);
          return (
            <div key={f.key} className={styles.calcField}>
              <label htmlFor={id}>
                {f.label} <span className={styles.calcUnit}>({f.unit})</span>
              </label>
              <input
                id={id}
                type="number"
                inputMode="decimal"
                value={raw[f.key]}
                min={f.min}
                max={f.max}
                step={f.integer ? 1 : 'any'}
                onChange={(e) => onChange(f.key, e.currentTarget.value)}
                onBlur={onBlur}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : `${id}-note`}
                className={error ? styles.calcInputError : undefined}
              />
              {error ? (
                <p id={`${id}-error`} className={styles.calcError} role="alert">
                  {error}
                </p>
              ) : (
                <p id={`${id}-note`} className={styles.calcNote}>
                  {f.note}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.calcResult}>
        {result ? (
          <>
            <dl className={styles.calcResultList}>
              <div>
                <dt>월 전체 전화 건수</dt>
                <dd>{result.totalCalls.toLocaleString('ko-KR')}건</dd>
              </div>
              <div>
                <dt>현재 통화시간</dt>
                <dd>{formatHours(result.totalMinutes)}</dd>
              </div>
              <div>
                <dt>가정상 AI 완결 처리</dt>
                <dd>{formatCalls(result.aiHandledCalls)}</dd>
              </div>
              <div>
                <dt>직접 응대 감소시간</dt>
                <dd>{formatHours(result.reducedMinutes)}</dd>
              </div>
              <div>
                <dt>사람 확인시간</dt>
                <dd>{formatHours(result.reviewTotalMinutes)}</dd>
              </div>
              <div className={result.netIsNegative ? styles.calcNegative : styles.calcNet}>
                <dt>{result.netIsNegative ? '가정상 검토 부담 증가' : '순감소 추정시간'}</dt>
                <dd>{formatHours(result.netMinutes)}</dd>
              </div>
            </dl>
            {result.netIsNegative ? (
              <p className={styles.calcWarn}>
                입력한 가정에서는 AI 처리 건을 사람이 확인하는 시간이 통화시간보다 큽니다. 이 조건에서는 자동화 범위를
                다시 좁히는 편이 낫습니다.
              </p>
            ) : (
              <p className={styles.calcWarn}>
                이 숫자는 전화에 묶여 있던 시간이 줄어든다는 뜻이며, 그만큼 인건비가 줄어든다는 뜻이 아닙니다.
              </p>
            )}
          </>
        ) : (
          <p className={styles.calcWarn}>
            입력값에 오류가 있어 결과를 표시하지 않습니다. 위에서 표시된 항목을 확인해 주세요.
          </p>
        )}
      </div>

      <p className={styles.calcLimit}>{WORKLOAD_LIMIT_NOTE}</p>

      <p className={styles.calcStatus} role="status" aria-live="polite">
        {announced}
      </p>

      <a
        className={styles.calcCta}
        href="#voice-inquiry"
        {...{ [VOICE_DATA_ATTR.callVolume]: volumeBucket }}
        onClick={() => pushEvent(EVENT.voiceWorkloadInteract, { interaction: 'cta' })}
      >
        이 업무량으로 도입 상담
      </a>
      <p className={styles.calcCtaHint}>
        누르면 아래 문의 폼의 “하루 전화량”만 <b>{volumeBucket}</b>으로 맞춰집니다. 입력한 통화시간·가정 비율은
        전송되지 않습니다.
      </p>
    </div>
  );
}
