import type { Metadata } from 'next';
import Link from 'next/link';
import { PORTFOLIO, hasPortfolio, portfolioCanonical } from '@/lib/portfolio';
import { SITE } from '@/lib/seo';
import { BreadcrumbJsonLdTrail } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

const canonical = `${SITE.domain}/portfolio/`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: '포트폴리오 · 진행 사례 | 앱·웹 MVP 개발 — 름랩 REUMLAB',
  description:
    '름랩이 실제로 진행한 앱·웹·AI 개발 사례. 문제 → 해결 → 결과 → 산출물(소스코드·저장소·권한 이관)까지 투명하게 정리합니다.',
  alternates: { canonical },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: canonical,
    siteName: SITE.nameEn,
    title: '름랩 포트폴리오 · 진행 사례',
    description: '앱·웹·AI 개발 사례 — 문제→해결→결과→산출물.',
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: '름랩 포트폴리오' }],
  },
  // 실제 사례가 등록되기 전에는 색인하지 않는다 (빈 페이지 색인 방지)
  robots: hasPortfolio
    ? { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } }
    : { index: false, follow: true },
};

const CATEGORY_LABEL: Record<string, string> = { app: '앱', web: '웹', ai: 'AI' };

export default function PortfolioIndexPage() {
  return (
    <>
      <BreadcrumbJsonLdTrail
        items={[
          { name: '홈', url: `${SITE.domain}/` },
          { name: '포트폴리오', url: canonical },
        ]}
      />
      <main>
        <section className="hero" style={{ minHeight: 'auto', padding: '120px 0 40px' }}>
          <div className="container">
            <p className="section-tag">Portfolio</p>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>
              진행 사례
            </h1>
            <p className="hero-desc" style={{ maxWidth: 720 }}>
              실제로 진행한 앱·웹·AI 개발 사례를 문제 → 해결 → 결과 → 산출물 순으로 정리합니다.
              소스코드·저장소·배포 권한을 통째로 넘기는 방식 그대로의 결과물입니다.
            </p>
          </div>
        </section>

        <section className="sec sec-cream">
          <div className="container">
            {hasPortfolio ? (
              <ul className="link-grid" style={{ marginTop: 8 }}>
                {PORTFOLIO.map((p) => (
                  <li key={p.slug} style={{ listStyle: 'none' }}>
                    <Link href={portfolioCanonical(p.slug).replace(SITE.domain, '')} style={{ display: 'block', minHeight: '100%' }}>
                      <article className="svc" style={{ height: '100%', margin: 0, display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 11, color: 'var(--green)', marginBottom: 8 }}>
                          {CATEGORY_LABEL[p.category] ?? p.category}
                          {p.durationDays ? ` · 약 ${p.durationDays}일` : ''}
                        </span>
                        <h2 className="svc-title" style={{ fontSize: '1.05rem' }}>{p.title}</h2>
                        <p className="svc-desc" style={{ flex: 1 }}>{p.summary}</p>
                        <span className="mono" style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                          {p.stack.join(' · ')}
                        </span>
                      </article>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0 8px', maxWidth: 640, margin: '0 auto' }}>
                <p className="hub-intro">
                  공개 동의를 받은 사례를 정리해 곧 올립니다. 지금 진행 중인 프로젝트나
                  참고 사례가 궁금하시면 상담에서 비공개로 보여 드립니다.
                </p>
              </div>
            )}

            <p style={{ marginTop: 32, textAlign: 'center' }}>
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_portfolio_call">
                📞 {SITE.phone} 전화 상담
              </a>
            </p>
          </div>
        </section>
      </main>
      <BusinessFooter />
    </>
  );
}
