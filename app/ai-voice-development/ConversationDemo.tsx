'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// lib/ai-voice.ts 가 아니라 의존성 0 모듈에서 가져온다 — 클라이언트 번들 크기 때문(해당 파일 주석 참고).
import {
  DEMO_SCENARIOS,
  DEFAULT_INDUSTRY,
  getScenario,
  stateAfter,
  outcomeStatus,
  displayValue,
  canShowReservationConfirmed,
  SYSTEM_SPEAKER_LABEL,
  type VoiceIndustry,
} from '@/lib/ai-voice-demo';
import { INDUSTRY_BY_DEMO_ID, VOICE_INDUSTRY_ENUM, VOICE_DATA_ATTR } from '@/lib/ai-voice-form';
import { EVENT, pushEvent } from '@/lib/analytics';
import styles from './ai-voice.module.css';

/**
 * 업종별 통화 시뮬레이션 — 실제 음성 API·전화망을 호출하지 않는다.
 *
 * 설계 결정
 *  · 상태는 "몇 번째 발화까지 진행했나"(step) 하나뿐이다. 요약 패널은 그 step 으로부터
 *    순수 함수 stateAfter() 로 계산한다. 단계 진행과 '전체 결과 보기'가 같은 함수를 쓰므로
 *    두 경로에서 화면이 갈라질 수 없다.
 *  · 선택한 업종의 모든 대사가 항상 DOM 에 있다. 진행 여부는 강조만 바꾸므로
 *    버튼을 눌러도 컨테이너 높이가 변하지 않는다(CLS 0).
 *  · 아직 진행되지 않은 대사는 aria-hidden 이다 — 스크린리더가 미래 발화를 미리 읽지 않게.
 *    JS 가 꺼져 있으면 page.tsx 의 <noscript> 가 이 위젯을 감추고,
 *    같은 대본을 담은 정적 <details> 전체 대본이 그대로 읽힌다.
 *  · 업종을 바꾸면 step 이 1 로 돌아간다. 이전 업종의 필드·상태가 섞이지 않는다.
 *  · 데모 탭 클릭만으로는 문의 폼에 아무것도 반영하지 않는다. 폼 제안은
 *    "이 업종으로 도입 상담" 버튼(아래 anchor)의 data-* 속성으로만 일어난다.
 */

/** 첫 AI 인사까지 보여 준 상태에서 시작한다 (§7.1) */
const INITIAL_STEP = 1;

export default function ConversationDemo() {
  const [industry, setIndustry] = useState<VoiceIndustry>(DEFAULT_INDUSTRY);
  const [step, setStep] = useState(INITIAL_STEP);
  /** 업종별로 "진행 시작" 이벤트를 한 번만 보내기 위한 기록 */
  const startedRef = useRef<Set<string>>(new Set());
  const completedRef = useRef<Set<string>>(new Set());

  const scenario = useMemo(() => getScenario(industry), [industry]);
  const total = scenario.turns.length;
  const state = useMemo(() => stateAfter(scenario, step), [scenario, step]);
  const status = outcomeStatus(scenario, state);
  const done = step >= total;

  const changeIndustry = useCallback((next: VoiceIndustry) => {
    setIndustry(next);
    setStep(INITIAL_STEP); // 이전 업종의 진행·필드·결과를 완전히 되돌린다
    pushEvent(EVENT.voiceDemoSelect, { industry: VOICE_INDUSTRY_ENUM[next] });
  }, []);

  const advance = useCallback(() => {
    setStep((s) => Math.min(s + 1, total));
  }, [total]);

  const showAll = useCallback(() => setStep(total), [total]);
  const reset = useCallback(() => setStep(INITIAL_STEP), []);

  // 진행 시작·완료는 step 변화에서 파생한다 — 버튼 핸들러마다 중복 발화하지 않게.
  useEffect(() => {
    const key = scenario.id;
    if (step > INITIAL_STEP && !startedRef.current.has(key)) {
      startedRef.current.add(key);
      pushEvent(EVENT.voiceDemoStart, { industry: VOICE_INDUSTRY_ENUM[key] });
    }
    if (step >= total && !completedRef.current.has(key)) {
      completedRef.current.add(key);
      pushEvent(EVENT.voiceDemoComplete, { industry: VOICE_INDUSTRY_ENUM[key] });
    }
  }, [scenario.id, step, total]);

  const reservationConfirmed = canShowReservationConfirmed(scenario, state);

  return (
    <div className={styles.demo} data-voice-demo-interactive>
      {/* 업종 선택 — radio group. 좌우/상하 화살표 이동이 브라우저 기본으로 동작한다. */}
      <fieldset className={styles.demoPicker}>
        <legend className={styles.demoPickerLegend}>업종 선택</legend>
        <div className={styles.demoPickerRow}>
          {DEMO_SCENARIOS.map((s) => (
            <label key={s.id} className={styles.demoPickerItem}>
              <input
                type="radio"
                name="voice-demo-industry"
                value={s.id}
                checked={industry === s.id}
                onChange={() => changeIndustry(s.id)}
                className={styles.demoPickerInput}
              />
              <span>{s.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <p className={styles.demoIntro}>{scenario.introduction}</p>

      <div className={styles.demoControls}>
        <button
          type="button"
          className={`${styles.demoBtn} ${styles.demoBtnPrimary}`}
          onClick={advance}
          disabled={done}
        >
          다음 대화
        </button>
        <button type="button" className={styles.demoBtn} onClick={showAll} disabled={done}>
          전체 결과 보기
        </button>
        <button type="button" className={styles.demoBtn} onClick={reset} disabled={step === INITIAL_STEP}>
          처음부터
        </button>
      </div>

      <div className={styles.demoGrid}>
        <ol className={styles.demoThread} aria-label={`${scenario.label} 가상 통화 대화`}>
          {scenario.turns.map((turn, i) => {
            const revealed = i < step;
            return (
              <li
                key={turn.id}
                aria-hidden={revealed ? undefined : true}
                data-voice-turn={revealed ? 'on' : 'pending'}
                className={`${styles.demoTurn} ${
                  turn.speaker === 'ai'
                    ? styles.demoAi
                    : turn.speaker === 'system'
                      ? styles.demoSystem
                      : styles.demoCustomer
                }`}
              >
                <b>{turn.speaker === 'ai' ? 'AI 상담원' : turn.speaker === 'system' ? SYSTEM_SPEAKER_LABEL : '고객'}</b>
                <p>{turn.text}</p>
              </li>
            );
          })}
        </ol>

        <div className={styles.demoPanel}>
          <h3 className={styles.demoPanelTitle}>상담 정리 예시</h3>
          <p className={styles.demoPanelLead}>
            지금까지 고객이 실제로 말한 내용만 반영합니다. 묻지 않은 항목은 채우지 않습니다.
          </p>

          <dl className={styles.demoFields}>
            {scenario.fields.map((field) => {
              const value = state.values[field.key];
              const text = displayValue(scenario, state, field.key);
              return (
                <div key={field.key} className={value ? undefined : styles.demoEmpty}>
                  <dt>{field.label}</dt>
                  <dd>{text}</dd>
                </div>
              );
            })}
          </dl>

          <div className={styles.demoOutcome}>
            <p className={styles.demoOutcomeRow}>
              <span>처리 구분</span>
              <b data-voice-status={status}>{status}</b>
            </p>
            <p className={styles.demoOutcomeRow}>
              <span>결과 유형</span>
              <b>{done ? scenario.outcome.title : '진행 중'}</b>
            </p>
            <p className={styles.demoOutcomeRow}>
              <span>다음 행동</span>
              <b>{done ? scenario.outcome.nextStep : '대화를 더 진행해 주세요'}</b>
            </p>
            {reservationConfirmed ? (
              <p className={styles.demoReservation}>
                고객 재확인과 가상 시스템 성공 단계를 모두 지났으므로 예약 확정 예시를 표시합니다. 실제 예약은
                발생하지 않았습니다.
              </p>
            ) : null}
            {state.awaitingConfirmation ? (
              <p className={styles.demoReservation}>고객 재확인을 기다리는 단계입니다. 아직 확정하지 않았습니다.</p>
            ) : null}
          </div>

          {/* 짧은 상태만 알린다 — 전체 대본을 매 클릭마다 재낭독하지 않는다 */}
          <p className={styles.demoStatus} role="status" aria-live="polite">
            {Math.min(step, total)} / {total}번째 발화 · 확인 항목 {state.filled}개
          </p>

          <a
            className={styles.demoFormLink}
            href="#voice-inquiry"
            {...{ [VOICE_DATA_ATTR.industry]: INDUSTRY_BY_DEMO_ID[scenario.id] }}
          >
            이 업종으로 도입 상담
          </a>
          <p className={styles.demoFormHint}>
            누르면 아래 문의 폼의 업종만 “{INDUSTRY_BY_DEMO_ID[scenario.id]}”으로 맞춰집니다. 직접 바꿀 수 있고,
            자동으로 접수되지 않습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
