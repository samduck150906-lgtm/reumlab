'use client';

import { useMemo, useState } from 'react';
import type { MultimodalIndustry } from '@/lib/multimodal-ai-worker';
import styles from './multimodal-ai-worker.module.css';

export default function MultimodalIndustrySelector({
  industries,
  defaultIndustryId,
}: {
  industries: MultimodalIndustry[];
  defaultIndustryId: string;
}) {
  const fallback = industries.find((item) => item.id === defaultIndustryId) ?? industries[0];
  const [selectedId, setSelectedId] = useState(fallback?.id ?? '');
  const selected = useMemo(
    () => industries.find((item) => item.id === selectedId) ?? fallback,
    [fallback, industries, selectedId],
  );

  if (!selected) return null;

  return (
    <section className={styles.example} aria-label="Interactive Example">
      <div className={styles.exampleHeading}>
        <span>Interactive Example</span>
        <p>업종을 선택하면 입력부터 사람 검수까지의 예시 흐름이 바뀝니다.</p>
      </div>
      <div className={styles.selectorButtons} aria-label="업종 선택">
        {industries.map((industry) => (
          <button
            key={industry.id}
            type="button"
            aria-pressed={selected.id === industry.id}
            onClick={() => setSelectedId(industry.id)}
          >
            {industry.label}
          </button>
        ))}
      </div>
      <div className={styles.exampleResult} aria-live="polite" aria-atomic="true">
        <p className={styles.exampleTitle}>{selected.label} 예시</p>
        <dl className={styles.exampleGrid}>
          <div><dt>입력</dt><dd>{selected.input}</dd></div>
          <div><dt>판단</dt><dd>{selected.judgement}</dd></div>
          <div><dt>처리</dt><dd>{selected.process}</dd></div>
          <div><dt>결과</dt><dd>{selected.result}</dd></div>
        </dl>
        <p className={styles.exampleNote}><strong>사람 확인:</strong> {selected.note}</p>
      </div>
    </section>
  );
}
