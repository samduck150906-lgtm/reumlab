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
          <Link href="/enterprise-ai/">사내 AI 구축</Link>
          <Link href="/source-handover/">소스코드 이관</Link>
          <Link href="/windows-app-development/">윈도우 앱 개발</Link>
          <Link href="/web-development/">웹사이트 제작</Link>
          <Link href="/website/">업종별 홈페이지 제작</Link>
          <Link href="/blog/">블로그</Link>
        </nav>
        {/*
          정보성·신뢰 콘텐츠 허브.
          가이드 40건과 개발 사례 15건이 있는데도 /guide/ 허브 인바운드가 12개뿐이었다
          (블로그 허브는 여기에 있어 1,400여 개). 발견 경로를 같은 수준으로 맞춘다.
        */}
        <nav className="footer-info" aria-label="자료" style={{ marginBottom: 14, display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
          <Link href="/guide/">개발 가이드</Link>
          <Link href="/portfolio/">개발 사례</Link>
          <Link href="/cost/">업종별 개발 비용</Link>
          <Link href="/system/">기능·시스템별 개발</Link>
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
        </p>
        <nav aria-label="공식 채널" style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: '6px 14px', fontSize: 13 }}>
          {[
            { href: 'https://naver.me/FORRCoFc', label: '네이버 플레이스' },
            { href: 'https://blog.naver.com/reumlab', label: '네이버 블로그' },
            { href: 'https://www.instagram.com/reumlab/', label: '인스타그램' },
            { href: 'https://pf.kakao.com/_xkxjQxgn', label: '카카오톡 채널' },
            { href: 'https://maps.app.goo.gl/rkKTdHCvhSyYrEkq8', label: '구글 지도' },
          ].map((c) => (
            <a key={c.href} href={c.href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-dim)' }}>
              {c.label}
            </a>
          ))}
        </nav>
        <nav aria-label="법적 고지" style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: '6px 16px', fontSize: 13 }}>
          <Link href="/privacy/">개인정보처리방침</Link>
          <Link href="/terms/">이용약관</Link>
          <Link href="/refund/">환불정책</Link>
        </nav>
      </div>
    </footer>
  );
}
