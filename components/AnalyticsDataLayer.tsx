'use client';

import { useEffect } from 'react';

/** GTM dataLayer: data-analytics="event_name" 속성이 있는 요소 클릭 시 push */
export function AnalyticsDataLayer() {
  useEffect(() => {
    const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
    const push = (obj: Record<string, unknown>) => {
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push(obj);
    };

    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-analytics]');
      if (!el) return;
      const name = el.getAttribute('data-analytics');
      if (!name) return;
      push({ event: 'reum_click', reum_action: name });
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
