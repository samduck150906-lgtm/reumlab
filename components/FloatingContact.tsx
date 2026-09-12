'use client';

import { useEffect, useState } from 'react';
import { SITE } from '@/lib/seo';

/** 우하단 플로팅 상담 버튼: 전화·이메일 */
export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [suppressed, setSuppressed] = useState(false);

  useEffect(() => {
    // 작은 화면에서 플로팅 버튼이 문의 폼의 입력·동의·제출 버튼이나 푸터 링크를
    // 가리지 않게 한다. 관찰 대상이 화면을 벗어나면 버튼은 다시 나타난다.
    const targets = Array.from(document.querySelectorAll('form, footer'));
    if (!targets.length || typeof IntersectionObserver === 'undefined') return;

    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      setSuppressed(visible.size > 0);
    }, { threshold: 0.01 });

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="floating-contact"
      aria-hidden={suppressed || undefined}
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 10,
        opacity: suppressed ? 0 : 1,
        visibility: suppressed ? 'hidden' : 'visible',
        pointerEvents: suppressed ? 'none' : 'auto',
        transition: 'opacity 160ms ease',
      }}
    >
      {open ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 14,
            padding: 12,
            boxShadow: '0 12px 32px rgba(15,31,58,.18)',
            minWidth: 200,
          }}
        >
          <a
            href={SITE.kakaoChannel}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics="float_kakao"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: '#FEE500', color: '#191919', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}
          >
            💬 카카오톡 상담
          </a>
          <a
            href={SITE.phoneHref}
            data-analytics="float_call"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: '#0f1f3a', color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
          >
            📞 전화 상담 {SITE.phone}
          </a>
          <a
            href={`mailto:${SITE.email}`}
            data-analytics="float_mail"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: '#f1f5f9', color: '#0f1f3a', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
          >
            ✉️ 이메일 문의
          </a>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? '✕ 닫기 — 상담 메뉴 닫기' : '💬 빠른 상담 — 상담 메뉴 열기'}
        aria-expanded={open}
        data-analytics="float_toggle"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          height: 52,
          padding: '0 20px',
          borderRadius: 999,
          border: 'none',
          // 흰 글자와 4.5:1 이상 대비를 확보한다(기존 #3d7cff는 3.8:1).
          background: '#245fc7',
          color: '#fff',
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(36,95,199,.4)',
        }}
      >
        {open ? '✕ 닫기' : '💬 빠른 상담'}
      </button>
    </div>
  );
}
