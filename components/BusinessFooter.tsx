import type { ReactNode } from 'react';
import Link from 'next/link';
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
        <nav className="footer-info" aria-label="주요 서비스" style={{ marginBottom: 14, display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
          <Link href="/mvp/">앱 MVP 개발</Link>
          <Link href="/flutter/">Flutter 앱개발</Link>
          <Link href="/ai-development/">AI 외주개발</Link>
          <Link href="/source-handover/">소스코드 이관</Link>
          <Link href="/web-development/">웹사이트 제작</Link>
          <Link href="/portfolio/">포트폴리오</Link>
          <Link href="/blog/">블로그</Link>
        </nav>
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
          <br />
          <a
            href="https://naver.me/FORRCoFc"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-dim)' }}
          >
            네이버 플레이스 보기
          </a>
        </p>
      </div>
    </footer>
  );
}
