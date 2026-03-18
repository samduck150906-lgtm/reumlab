import type { Metadata } from 'next';
import Link from 'next/link';
import { PORTFOLIO_SEO, SITE } from '@/lib/seo';
import { OrganizationJsonLd, BreadcrumbJsonLdCustom } from '@/components/JsonLd';

const naver = process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION;

export const metadata: Metadata = {
  title: PORTFOLIO_SEO.title,
  description: PORTFOLIO_SEO.description,
  keywords: PORTFOLIO_SEO.keywords,
  alternates: { canonical: PORTFOLIO_SEO.canonical },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: PORTFOLIO_SEO.canonical,
    siteName: SITE.name,
    title: PORTFOLIO_SEO.ogTitle,
    description: PORTFOLIO_SEO.ogDescription,
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: PORTFOLIO_SEO.ogTitle }],
  },
  twitter: {
    card: 'summary_large_image',
    title: PORTFOLIO_SEO.ogTitle,
    description: PORTFOLIO_SEO.ogDescription,
    images: [SITE.defaultOgImage],
  },
  robots: { index: true, follow: true },
  ...(naver ? { other: { 'naver-site-verification': naver } } : {}),
};

const APP_ITEMS = [
  { t: '교육 추천 슈퍼앱', d: 'PostgreSQL RPC 대규모 매칭 · Flutter · Supabase' },
  { t: '제휴 서비스 플랫폼', d: 'RN(Expo) + Next.js + Supabase 트리플 플랫폼' },
  { t: '콘텐츠 검색·SaaS', d: 'Flutter · Supabase · 구독형 서비스' },
];

const WEB_ITEMS = [
  { t: '개인 브랜딩 포트폴리오', d: '스크롤 애니메이션 · 반응형 갤러리' },
  { t: 'D2C 랜딩페이지', d: 'AIDA 카피 · CTA 최적화 · SEO' },
  { t: '예약·결제 통합 사이트', d: '타임슬롯 · PG 연동 · 카카오 알림' },
];

export default function PortfolioPage() {
  return (
    <>
      <OrganizationJsonLd />
      <BreadcrumbJsonLdCustom seo={PORTFOLIO_SEO} />
      <main>
        <section className="hero" style={{ minHeight: 'auto', padding: '120px 0 48px' }}>
          <div className="container">
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>
              {PORTFOLIO_SEO.h1}
            </h1>
            <p className="hero-sub" style={{ maxWidth: 680, marginTop: 16 }}>
              {PORTFOLIO_SEO.description}
            </p>
            <div className="hero-btns" style={{ marginTop: 28 }}>
              <Link href="/consultation/" className="btn-primary">
                프로젝트 상담
              </Link>
              <Link href="/" className="btn-secondary">
                메인으로
              </Link>
            </div>
          </div>
        </section>

        <section className="sec sec-cream" id="app-portfolio">
          <div className="container">
            <div className="sec-label">APP</div>
            <h2 className="sec-title">앱 개발 레퍼런스</h2>
            <div className="services-grid" style={{ marginTop: 32 }}>
              {APP_ITEMS.map((x) => (
                <div key={x.t} className="svc rv">
                  <h3 className="svc-title" style={{ fontSize: '1.15rem' }}>
                    {x.t}
                  </h3>
                  <p className="svc-desc">{x.d}</p>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 24, textAlign: 'center' }}>
              <Link href="/앱개발/">앱 개발 서비스 상세 →</Link>
            </p>
          </div>
        </section>

        <section className="sec sec-warm" id="web-portfolio">
          <div className="container">
            <div className="sec-label">WEB</div>
            <h2 className="sec-title">웹 개발 레퍼런스</h2>
            <div className="services-grid" style={{ marginTop: 32 }}>
              {WEB_ITEMS.map((x) => (
                <div key={x.t} className="svc rv">
                  <h3 className="svc-title" style={{ fontSize: '1.15rem' }}>
                    {x.t}
                  </h3>
                  <p className="svc-desc">{x.d}</p>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 24, textAlign: 'center' }}>
              <Link href="/웹개발/">웹 개발 서비스 상세 →</Link>
            </p>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="container">
          <p className="footer-info">
            {SITE.address} · {SITE.phone} ·{' '}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
        </div>
      </footer>
    </>
  );
}
