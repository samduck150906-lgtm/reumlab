import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/seo';
import {
  PORTFOLIO,
  getPortfolioBySlug,
  portfolioCanonical,
  portfolioMetaTitle,
  portfolioMetaDescription,
  portfolioCategoryLabel,
} from '@/lib/portfolio';
import { PortfolioCreativeWorkJsonLd } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return PORTFOLIO.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

/** 카테고리별 “함께 보면 좋은” 필러 링크 */
const CATEGORY_PILLAR: Record<string, { href: string; label: string }> = {
  app: { href: '/mvp/', label: '앱 MVP 개발 자세히 보기' },
  web: { href: '/web-development/', label: '웹사이트·랜딩 제작 자세히 보기' },
  ai: { href: '/ai-development/', label: 'AI 외주개발 자세히 보기' },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getPortfolioBySlug(params.slug);
  if (!item) notFound();
  const canonical = portfolioCanonical(item.slug);
  const title = portfolioMetaTitle(item);
  const description = portfolioMetaDescription(item);

  return {
    metadataBase: new URL(SITE.domain),
    // 브랜드명이 이미 title 에 포함됨 → 레이아웃 템플릿의 "| 름랩" 중복 방지
    title: { absolute: title },
    description,
    keywords: item.keywords,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      url: canonical,
      siteName: SITE.nameEn,
      title: item.title,
      description,
      publishedTime: item.publishedAt,
      images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: item.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: item.title,
      description: description.slice(0, 200),
      images: [SITE.defaultOgImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
  };
}

export default function PortfolioDetailPage({ params }: Props) {
  const item = getPortfolioBySlug(params.slug);
  if (!item) notFound();

  const canonical = portfolioCanonical(item.slug);
  const categoryLabel = portfolioCategoryLabel(item.category);
  const pillar = CATEGORY_PILLAR[item.category];
  const others = PORTFOLIO.filter((p) => p.slug !== item.slug);

  const crumbs = [
    { name: '홈', url: `${SITE.domain}/` },
    { name: '포트폴리오', url: `${SITE.domain}/portfolio/` },
    { name: item.title.slice(0, 48), url: canonical },
  ];

  const blocks: { h: string; body: string }[] = [
    { h: '문제', body: item.problem },
    { h: '해결', body: item.solution },
    { h: '결과', body: item.result },
  ];

  return (
    <>
      <PortfolioCreativeWorkJsonLd
        name={item.title}
        description={item.summary}
        url={canonical}
        category={categoryLabel}
        keywords={item.keywords}
        datePublished={item.publishedAt}
        crumbs={crumbs}
      />
      <main>
        <article className="dynamic-page">
          <nav className="breadcrumb" aria-label="breadcrumb">
            <Link href="/">홈</Link>
            {' / '}
            <Link href="/portfolio/">포트폴리오</Link>
            {' / '}
            <span>{item.title.slice(0, 24)}…</span>
          </nav>

          <div className="section-inner">
            <p className="section-tag">
              {categoryLabel} 개발 사례
              {item.durationDays ? ` · 약 ${item.durationDays}일` : ''}
            </p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)' }}>
              {item.title}
            </h1>
            <p className="hub-intro">{item.summary}</p>
            <p className="mono" style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 8 }}>
              {item.stack.join(' · ')}
            </p>
          </div>

          {item.highlights && item.highlights.length > 0 ? (
            <div className="section-inner" style={{ paddingTop: 8 }}>
              <h2 className="section-title" style={{ fontSize: '1.2rem' }}>핵심 기능</h2>
              <ul className="hub-intro" style={{ paddingLeft: '1.1em', listStyle: 'disc' }}>
                {item.highlights.map((h) => (
                  <li key={h} style={{ marginTop: 6 }}>{h}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {blocks.map((b) => (
            <div className="section-inner" key={b.h} style={{ paddingTop: 8 }}>
              <h2 className="section-title" style={{ fontSize: '1.2rem' }}>{b.h}</h2>
              <p className="hub-intro">{b.body}</p>
            </div>
          ))}

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.2rem' }}>산출물</h2>
            <ul className="hub-intro" style={{ paddingLeft: '1.1em', listStyle: 'disc' }}>
              {item.deliverables.map((d) => (
                <li key={d} style={{ marginTop: 6 }}>{d}</li>
              ))}
            </ul>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>다른 진행 사례</h2>
            <div className="link-grid">
              {others.map((p) => (
                <Link key={p.slug} href={portfolioCanonical(p.slug).replace(SITE.domain, '')}>
                  {p.title}
                </Link>
              ))}
              {pillar ? <Link href={pillar.href}>{pillar.label}</Link> : null}
              <Link href="/portfolio/">전체 포트폴리오 보기</Link>
            </div>
          </div>

          <div className="cta" style={{ marginTop: 24 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>이런 결과물이 필요하시면</h2>
            <p className="hub-intro">
              소스코드·저장소·배포 권한을 통째로 넘기고, 직접 운영하는 법까지 1:1로 알려드립니다.
              가격은 선공개합니다 — 30분 무료 상담으로 범위와 견적을 안내해 드립니다.
            </p>
            <div className="cta-buttons">
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_portfolio_detail_call">
                📞 {SITE.phone} 무료 상담
              </a>
              <Link href="/#pricing" className="btn-outline" data-analytics="cta_portfolio_detail_pricing">
                패키지 요금 보기
              </Link>
            </div>
          </div>
        </article>
      </main>
      <BusinessFooter topExtra={<Link href="/portfolio/">← 포트폴리오 목록으로</Link>} />
    </>
  );
}
