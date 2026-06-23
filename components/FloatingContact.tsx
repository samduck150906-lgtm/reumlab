'use client';

import { useState } from 'react';
import { SITE } from '@/lib/seo';

/** 우하단 플로팅 상담 버튼: 전화·이메일 */
export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 10,
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
        aria-label={open ? '상담 메뉴 닫기' : '상담 메뉴 열기'}
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
          background: '#3d7cff',
          color: '#fff',
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(61,124,255,.4)',
        }}
      >
        {open ? '✕ 닫기' : '💬 빠른 상담'}
      </button>
    </div>
  );
}
