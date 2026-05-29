import type { ReactNode } from 'react';
import { SITE } from '@/lib/seo';

type Props = {
  /** 사업자 정보 위에 보조 링크 한 줄 (예: 목록으로) */
  topExtra?: ReactNode;
};

export default function BusinessFooter({ topExtra }: Props) {
  return (
    <footer className="footer">
      <div className="container">
        {topExtra ? <p className="footer-info" style={{ marginBottom: 12 }}>{topExtra}</p> : null}
        <p className="footer-info" style={{ lineHeight: 1.85 }}>
          {SITE.company}
          <br />
          대표자: {SITE.representative} · 사업자등록번호: {SITE.bizNo}
          <br />
          연락처:{' '}
          <a href={SITE.phoneHref} style={{ color: 'var(--text-dim)' }}>
            {SITE.phone}
          </a>{' '}
          · 이메일:{' '}
          <a href={`mailto:${SITE.email}`} style={{ color: 'var(--text-dim)' }}>
            {SITE.email}
          </a>
          <br />
          주소: {SITE.address}
        </p>
      </div>
    </footer>
  );
}
