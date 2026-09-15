'use client';

import { useMemo, useState } from 'react';
// lib/ai-voice.ts 가 아니라 의존성 0 모듈에서 가져온다 — 클라이언트 번들 크기 때문(해당 파일 주석 참고).
import { DEMO_FIELDS, DEMO_TURNS } from '@/lib/ai-voice-demo';
import styles from './ai-voice.module.css';

/**
 * 상담 통화 UI 시연 — 실제 음성 API 를 호출하지 않는다.
 *
 * 왜 이렇게 만들었나
 *  · 대사 14줄이 항상 DOM 에 있다. 상태는 강조(opacity)만 바꾸므로 높이가 변하지 않는다
 *    → 하이드레이션 전후로 레이아웃이 움직이지 않는다(CLS 0).
 *  · JS 가 실행되지 않으면 page.tsx 의 <noscript> 스타일이 흐림 처리를 해제해
 *    전체 대화가 그대로 읽힌다.
 *  · 상태 갱신은 전부 함수형이라 버튼을 빠르게 연타해도 단계가 어긋나지 않는다.
 */
const TOTAL = DEMO_TURNS.length;

export default function ConversationDemo() {
  const [step, setStep] = useState(1);
  const done = step >= TOTAL;

  /** 현재 단계까지 AI 가 구조화한 상담 항목 */
  const captured = useMemo(() => {
    const map = new Map<string, string>();
    for (let i = 0; i < Math.min(step, TOTAL); i++) {
      const capture = DEMO_TURNS[i].capture;
      if (capture) map.set(capture[0], capture[1]);
    }
    return map;
  }, [step]);

  return (
    <>
      <div className={styles.demoHead}>
        <span className={styles.demoBadge}>AI 음성 상담 예시 · Demo Conversation</span>
        <div className={styles.demoControls}>
          <button
            type="button"
            className={`${styles.demoBtn} ${styles.demoBtnPrimary}`}
            onClick={() => setStep((s) => Math.min(s + 1, TOTAL))}
            disabled={done}
          >
            {done ? '대화가 끝났습니다' : '다음 대화 보기'}
          </button>
          <button type="button" className={styles.demoBtn} onClick={() => setStep(TOTAL)} disabled={done}>
            전체 보기
          </button>
          <button type="button" className={styles.demoBtn} onClick={() => setStep(1)} disabled={step === 1}>
            처음부터
          </button>
        </div>
      </div>

      <div className={styles.demoGrid}>
        <ol className={styles.demoThread}>
          {DEMO_TURNS.map((turn, i) => (
            <li
              key={`${turn.role}-${i}`}
              data-voice-turn={i < step ? 'on' : 'pending'}
              className={`${styles.demoTurn} ${turn.role === 'ai' ? styles.demoAi : styles.demoCustomer}`}
            >
              <b>{turn.role === 'ai' ? 'AI 상담원' : '고객'}</b>
              <p>{turn.text}</p>
            </li>
          ))}
        </ol>

        <div className={styles.demoPanel}>
          <h3>AI가 정리한 상담 항목</h3>
          <p>통화 중에 확인된 내용이 그대로 상담 데이터가 됩니다. 담당자는 통화를 다시 듣지 않아도 됩니다.</p>
          <dl className={styles.demoFields}>
            {DEMO_FIELDS.map((field) => {
              const value = captured.get(field);
              return (
                <div key={field} className={value ? undefined : styles.demoEmpty}>
                  <dt>{field}</dt>
                  <dd>{value ?? '확인 중'}</dd>
                </div>
              );
            })}
          </dl>
          <p className={styles.demoStatus} role="status">
            {Math.min(step, TOTAL)} / {TOTAL}번째 대화 · 확인된 항목 {captured.size} / {DEMO_FIELDS.length}개
          </p>
        </div>
      </div>
    </>
  );
}
