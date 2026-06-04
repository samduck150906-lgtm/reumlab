import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllPortfolioSlugs,
  getPortfolioCaseBySlug,
  portfolioCanonical,
} from '@/lib/portfolio-cases';
import { PORTFOLIO_SEO, SITE } from '@/lib/seo';
import { BreadcrumbJsonLdTrail, PortfolioCreativeWorkJsonLd } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getAllPortfolioSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getPortfolioCaseBySlug(params.slug);
  if (!item) notFound();
  const canonical = portfolioCanonical(item.slug);
  const title = `${item.title} | 포트폴리오 | ${SITE.name}`;
  const description = `${item.summary} ${item.stack.join(', ')}.`;

  return {
    metadataBase: new URL(SITE.domain),
    title,
    description,
    keywords: [...item.stack, '포트폴리오', '외주 개발', '름랩'],
    alternates: { canonical },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      url: canonical,
      siteName: SITE.nameEn,
      title,
      description,
      images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: item.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [SITE.defaultOgImage],
    },
    robots: { index: true, follow: true },
  };
}

export default function PortfolioCasePage({ params }: Props) {
  const item = getPortfolioCaseBySlug(params.slug);
  if (!item) notFound();
  const url = portfolioCanonical(item.slug);

  return (
    <>
      <PortfolioCreativeWorkJsonLd item={item} url={url} />
      <BreadcrumbJsonLdTrail
        items={[
          { name: '홈', url: `${SITE.domain}/` },
          { name: PORTFOLIO_SEO.h1, url: PORTFOLIO_SEO.canonical + '/' },
          { name: item.title, url },
        ]}
      />
      <main>
        <section className="hero" style={{ minHeight: 'auto', padding: '120px 0 32px' }}>
          <div className="container">
            <nav className="breadcrumb" style={{ paddingTop: 0 }}>
              <Link href="/">홈</Link>
              {' / '}
              <Link href="/portfolio/">포트폴리오</Link>
              {' / '}
              <span>{item.title}</span>
            </nav>
            <h1 className="hero-title" style={{ fontSize: 'clamp(26px, 4vw, 38px)', marginTop: 16 }}>
              {item.title}
            </h1>
            <p className="hero-sub" style={{ maxWidth: 720, marginTop: 14, textAlign: 'left' }}>
              {item.summary}
            </p>
            <p className="mono" style={{ marginTop: 12, fontSize: 12, color: 'var(--green)' }}>
              {item.role} · {item.clientLabel}
            </p>
            <ul className="web-card-taglist" style={{ marginTop: 16 }}>
              {item.stack.map((t) => (
                <span key={t}>
                  {t}
                </span>
              ))}
            </ul>
          </div>
        </section>

        <section className="sec sec-cream">
          <div className="container">
            <div className="section-inner">
              <dl style={{ display: 'grid', gap: 20, marginBottom: 8 }}>
                <div>
                  <dt className="mono" style={{ fontSize: 12, color: 'var(--green)', marginBottom: 6 }}>문제</dt>
                  <dd className="hub-intro" style={{ margin: 0 }}>{item.problem}</dd>
                </div>
                <div>
                  <dt className="mono" style={{ fontSize: 12, color: 'var(--green)', marginBottom: 6 }}>우리가 만든 것</dt>
                  <dd className="hub-intro" style={{ margin: 0 }}>{item.built}</dd>
                </div>
                <div>
                  <dt className="mono" style={{ fontSize: 12, color: 'var(--green)', marginBottom: 6 }}>결과</dt>
                  <dd className="hub-intro" style={{ margin: 0 }}>{item.result}</dd>
                </div>
              </dl>

              {item.clientNote ? (
                <blockquote
                  style={{
                    margin: '24px 0 0',
                    padding: '16px 20px',
                    borderLeft: '3px solid var(--green)',
                    background: 'rgba(58,140,92,.06)',
                    borderRadius: 8,
                    fontStyle: 'italic',
                  }}
                >
                  “{item.clientNote}”
                </blockquote>
              ) : null}

              <h2 className="section-title" style={{ marginTop: 36 }}>상세</h2>
              {item.paragraphs.map((p, i) => (
                <p key={i} className="hub-intro" style={{ marginTop: 16 }}>
                  {p}
                </p>
              ))}
              <div className="hero-cta" style={{ marginTop: 28 }}>
                <Link href="/consultation/" className="btn-primary" data-analytics="cta_portfolio_case_consult">
                  비슷한 프로젝트 상담
                </Link>
                <Link href="/portfolio/" className="btn-outline">
                  포트폴리오 목록
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <BusinessFooter topExtra={<Link href="/portfolio/">← 포트폴리오</Link>} />
    </>
  );
}
