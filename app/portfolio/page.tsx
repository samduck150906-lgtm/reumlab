import type { Metadata } from 'next';
import Link from 'next/link';
import { PORTFOLIO_SEO, SITE } from '@/lib/seo';
import { PORTFOLIO_CASES } from '@/lib/portfolio-cases';
import { OrganizationJsonLd, BreadcrumbJsonLdCustom } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

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

const APP_SLUGS = ['gyoyug-chucheon-syupeo-eib', 'jehyu-seobiseu-peulraespom', 'koneten-chu-sa-saas'] as const;
const WEB_SLUGS = ['gaein-beuraending-peutpolrio', 'd2c-raending-peiji', 'yeyag-gyeolje-tonghab'] as const;

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
              <Link href="/consultation/" className="btn-primary" data-analytics="cta_portfolio_index_consult">
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
              {APP_SLUGS.map((slug) => {
                const c = PORTFOLIO_CASES.find((x) => x.slug === slug);
                if (!c) return null;
                return (
                  <Link key={slug} href={`/portfolio/${slug}/`} className="svc rv" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <h3 className="svc-title" style={{ fontSize: '1.15rem' }}>
                      {c.title}
                    </h3>
                    <p className="svc-desc">{c.summary}</p>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--green)' }}>
                      상세 보기 →
                    </span>
                  </Link>
                );
              })}
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
              {WEB_SLUGS.map((slug) => {
                const c = PORTFOLIO_CASES.find((x) => x.slug === slug);
                if (!c) return null;
                return (
                  <Link key={slug} href={`/portfolio/${slug}/`} className="svc rv" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <h3 className="svc-title" style={{ fontSize: '1.15rem' }}>
                      {c.title}
                    </h3>
                    <p className="svc-desc">{c.summary}</p>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--green)' }}>
                      상세 보기 →
                    </span>
                  </Link>
                );
              })}
            </div>
            <p style={{ marginTop: 24, textAlign: 'center' }}>
              <Link href="/웹개발/">웹 개발 서비스 상세 →</Link>
            </p>
          </div>
        </section>
      </main>
      <BusinessFooter />
    </>
  );
}
