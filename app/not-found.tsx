import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/seo';
import BusinessFooter from '@/components/BusinessFooter';

/**
 * 404는 루트 layout의 metadata(홈 title·description·canonical=홈·index,follow)를 그대로
 * 상속하고 있었다. 그 결과 out/404.html 과 200으로 열리는 out/404/index.html 이
 * "홈과 동일한 title·description + canonical=홈"을 들고 나가 soft-404·중복으로 보였다.
 * → 오류 페이지 고유 메타로 덮고 noindex를 명시한다(canonical은 상속하지 않도록 자기 URL 지정).
 */
export const metadata: Metadata = {
  title: { absolute: '페이지를 찾을 수 없습니다 (404) | 름랩 REUMLAB' },
  description:
    '요청하신 주소가 바뀌었거나 삭제된 페이지입니다. 름랩의 앱 MVP·Flutter 앱개발·웹사이트 제작·AI 개발 페이지에서 필요한 서비스를 찾아보세요.',
  alternates: { canonical: `${SITE.domain}/404` },
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function NotFound() {
  return (
    <>
      <main>
        <section className="hero" style={{ minHeight: 'auto', padding: '140px 0 60px', textAlign: 'center' }}>
          <div className="container">
            <p className="section-tag">404</p>
            <h1 className="hero-title" style={{ fontSize: 'clamp(26px, 4vw, 38px)' }}>
              페이지를 찾을 수 없습니다
            </h1>
            <p className="hero-desc" style={{ maxWidth: 560, margin: '0 auto 28px' }}>
              주소가 바뀌었거나 삭제된 페이지일 수 있습니다. 아래에서 필요한 서비스를 찾아보세요.
            </p>
            <div className="hero-btns" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/" className="btn-primary">홈으로</Link>
              <a href={SITE.phoneHref} className="btn-secondary">📞 {SITE.phone} 전화 상담</a>
            </div>
            <nav
              aria-label="주요 서비스"
              style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: '8px 16px', justifyContent: 'center', fontSize: 14 }}
            >
              <Link href="/mvp/">앱 MVP 개발</Link>
              <Link href="/flutter/">Flutter 앱개발</Link>
              <Link href="/ai-development/">AI 외주개발</Link>
              <Link href="/source-handover/">소스코드 이관</Link>
              <Link href="/web-development/">웹사이트 제작</Link>
              <Link href="/blog/">블로그</Link>
            </nav>
          </div>
        </section>
      </main>
      <BusinessFooter />
    </>
  );
}
