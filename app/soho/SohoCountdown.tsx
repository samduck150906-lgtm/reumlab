'use client';

import { useEffect, useState } from 'react';

/**
 * 프로모션 카운트다운 — 이번 달 말일 23:59:59(로컬)까지, 매월 자동 갱신.
 * 정적 export 후 클라이언트에서 매초 갱신됩니다. SSR/초기 렌더 시엔 플레이스홀더(—/00)로 표시.
 */
export default function SohoCountdown({ className = '' }: { className?: string }) {
  const [t, setT] = useState<{ d: number; h: string; m: string; s: string } | null>(null);

  useEffect(() => {
    const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
    function tick() {
      const now = new Date();
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      let diff = end.getTime() - Date.now();
      if (diff < 0) diff = 0;
      const DAY = 86400000,
        HOUR = 3600000,
        MIN = 60000;
      setT({
        d: Math.floor(diff / DAY),
        h: pad(Math.floor((diff % DAY) / HOUR)),
        m: pad(Math.floor((diff % HOUR) / MIN)),
        s: pad(Math.floor((diff % MIN) / 1000)),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={`s-cd ${className}`.trim()}>
      <span className="s-cd-lead">마감까지</span>
      <b className="s-cd-dday">D-{t ? t.d : '—'}</b>
      <span className="s-cd-clock" aria-hidden="true">
        <b>{t ? t.h : '00'}</b>
        <i>:</i>
        <b>{t ? t.m : '00'}</b>
        <i>:</i>
        <b>{t ? t.s : '00'}</b>
      </span>
    </span>
  );
}
