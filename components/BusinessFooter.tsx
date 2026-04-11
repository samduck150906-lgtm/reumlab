import Link from 'next/link';
import type { ReactNode } from 'react';
import { SITE } from '@/lib/seo';

type Props = {
  /** true면 메인 랜딩과 동일하게 포트폴리오·블로그·상담 링크 포함 */
  withNavLinks?: boolean;
  /** 사업자 정보 위에 보조 링크 한 줄 (예: 목록으로) */
  topExtra?: ReactNode;
};

export default function BusinessFooter({ withNavLinks = false, topExtra }: Props) {
  return (
    <footer className="footer">
      <div className="container">
        {topExtra ? <p className="footer-info" style={{ marginBottom: 12 }}>{topExtra}</p> : null}
        <p className="footer-info" style={{ lineHeight: 1.85 }}>
          {SITE.company}
          <br />
          대표자: {SITE.representative} · 사업자등록번호: {SITE.bizNo}
          <br />
          통신판매업: {SITE.mailOrderSalesNo} · 연락처: {SITE.phone}
          <br />
          주소: {SITE.address} · 이메일:{' '}
          <a href={`mailto:${SITE.email}`} style={{ color: 'var(--text-dim)' }}>
            {SITE.email}
          </a>
        </p>
        {withNavLinks ? (
          <p className="footer-info" style={{ marginTop: 12 }}>
            <Link href="/">홈</Link>
            <span> · </span>
            <Link href="/portfolio/">포트폴리오</Link>
            <span> · </span>
            <Link href="/blog/">블로그</Link>
            <span> · </span>
            <Link href="/consultation/">상담</Link>
          </p>
        ) : null}
      </div>
    </footer>
  );
}
