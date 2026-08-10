'use client';

import { useEffect } from 'react';
import { EVENT, pageContext, pushEvent } from '@/lib/analytics';

/**
 * GTM dataLayer 이벤트 브리지.
 *
 * 왜 전역 위임(delegation)으로 처리하나:
 *  검색 유입은 대부분 홈이 아니라 서비스·업종·지역 페이지(1,400+)로 들어온다.
 *  홈(index.html + script.js)에는 phone_click·email_click·kakao_or_chat_click 이벤트가
 *  있었지만, Next 라우트 쪽에는 `data-analytics` 가 붙은 일부 링크만 잡히고
 *  전화·이메일 CTA 상당수가 무계측이었다 → 실제 상담 전환의 대부분이 측정에서 누락.
 *  각 컴포넌트에 속성을 일일이 다는 대신, tel:/mailto:/카카오 링크를 href 기준으로
 *  전역에서 잡아 홈과 "같은 이벤트 이름"으로 push 한다(GTM 전환 트리거 하나로 통일).
 *
 * 중복 집계 방지:
 *  - 한 번의 클릭에서 reum_click(범용)과 타입별 이벤트를 각각 1회씩만 push 한다.
 *  - script.js가 이미 동작하는 홈에서는 이 컴포넌트가 마운트되지 않으므로
 *    (홈은 정적 index.html로 서빙) 이중 push가 생기지 않는다.
 */
export function AnalyticsDataLayer() {
  useEffect(() => {
    const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
    const push = (obj: Record<string, unknown>) => {
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push(obj);
    };

    /*
      페이지 공통 컨텍스트.
      이게 없으면 GA4 에서 "지역 랜딩에서 온 문의"와 "가이드에서 온 문의"를 구분하려고
      URL 을 정규식으로 파싱해야 한다. 경로에서 한 번 계산해 모든 이벤트에 실어 보낸다.
      개인정보는 들어가지 않는다 — 경로 기반 분류값뿐이다.
    */
    const ctx = pageContext(window.location.pathname);
    push({ event: 'page_context', ...ctx });

    /** 링크 href로 상담 채널 종류를 판별 */
    const channelOf = (el: Element | null): 'phone' | 'email' | 'kakao' | null => {
      const a = el?.closest('a');
      const href = a?.getAttribute('href') || '';
      if (href.startsWith('tel:')) return 'phone';
      if (href.startsWith('mailto:')) return 'email';
      if (/pf\.kakao\.com|open\.kakao\.com/.test(href)) return 'kakao';
      return null;
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // 1) 기존 범용 클릭 이벤트 (data-analytics 속성)
      const tagged = target.closest('[data-analytics]');
      const name = tagged?.getAttribute('data-analytics');
      if (name) push({ event: 'reum_click', reum_action: name, ...ctx });

      // 2) 상담 채널 전환 이벤트 — 홈(script.js)과 동일한 이벤트 이름 사용
      const channel = channelOf(target);
      if (!channel) return;
      const location = tagged?.getAttribute('data-analytics') || 'page';
      // 기존 GTM 전환 트리거가 쓰는 이름은 그대로 둔다(이름을 바꾸면 운영 중인 전환이 끊긴다).
      if (channel === 'phone') push({ event: 'phone_click', cta_location: location, ...ctx });
      if (channel === 'email') push({ event: 'email_click', cta_location: location, ...ctx });
      if (channel === 'kakao') push({ event: 'kakao_or_chat_click', cta_location: location, ...ctx });
      // 상담 채널 클릭은 secondary conversion 이다 — 문의 완료(generate_lead)로 집계하지 않는다.
      pushEvent(EVENT.ctaClick, { cta_type: channel, cta_location: location, ...ctx });

      // Meta 픽셀 Contact — 홈과 동일 기준(전화·카카오)만 집계
      try {
        const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
        if (typeof fbq === 'function' && (channel === 'phone' || channel === 'kakao')) {
          fbq('track', 'Contact', { method: channel });
        }
      } catch {
        /* 픽셀 미로드 시 무시 */
      }
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
