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
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: '36px 0 0',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px 28px',
              }}
            >
              {[
                ['납품', '소스코드 전체 이관'],
                ['개발', 'Flutter · iOS·안드로이드 동시'],
                ['가격', 'VAT 포함 정액 선공개'],
                ['보안', 'NDA 준수 · 클라이언트명 비공개'],
              ].map(([k, v]) => (
                <li key={k} style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--green)' }}>{k}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{v}</span>
                </li>
              ))}
            </ul>
            <p style={{ marginTop: 16, fontSize: 12, color: 'var(--text-dim)', maxWidth: 620 }}>
              ※ 클라이언트와의 비밀유지(NDA)로 실명·로고는 비공개합니다. 정량 성과 지표는 고객 동의 후 순차 공개 예정입니다.
            </p>
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
                    <span className="mono" style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                      {c.clientLabel}
                    </span>
                    <h3 className="svc-title" style={{ fontSize: '1.15rem', marginTop: 6 }}>
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
                    <span className="mono" style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                      {c.clientLabel}
                    </span>
                    <h3 className="svc-title" style={{ fontSize: '1.15rem', marginTop: 6 }}>
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
