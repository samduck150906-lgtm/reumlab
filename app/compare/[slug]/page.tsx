import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/seo';
import { COMPARES, getCompare, compareCanonical, compareDecision } from '@/lib/compare';
import { robotsFor } from '@/lib/index-quality';
import { GuideArticleJsonLd } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return COMPARES.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cmp = getCompare(params.slug);
  if (!cmp) notFound();
  const canonical = compareCanonical(cmp.slug);

  return {
    metadataBase: new URL(SITE.domain),
    title: { absolute: `${cmp.title} | 름랩` },
    description: cmp.description,
    keywords: cmp.keywords,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      url: canonical,
      siteName: SITE.name,
      title: cmp.title,
      description: cmp.description,
      publishedTime: cmp.publishedAt,
      images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: cmp.title }],
    },
    twitter: { card: 'summary_large_image', title: cmp.title, description: cmp.description.slice(0, 200), images: [SITE.defaultOgImage] },
    // 색인 품질 게이트: 80점↑만 index (사이트맵과 동일 판정)
    robots: robotsFor(compareDecision(cmp.slug)!),
  };
}

export default function ComparePage({ params }: Props) {
  const cmp = getCompare(params.slug);
  if (!cmp) notFound();
  const canonical = compareCanonical(cmp.slug);
  const crumbs = [
    { name: '홈', url: `${SITE.domain}/` },
    // /compare/ 허브 페이지는 없다(비교 글이 3건뿐이라 만들지 않았다 — 빈약한 카테고리 페이지 금지).
    // 비교 글 3건을 실제로 나열하는 곳은 /guide/ 허브이므로 그쪽을 가리킨다.
    // 존재하지 않는 URL 을 BreadcrumbList item 으로 내보내면 안 된다.
    { name: '가이드', url: `${SITE.domain}/guide/` },
    { name: cmp.h1.slice(0, 48), url: canonical },
  ];

  return (
    <>
      <GuideArticleJsonLd
        title={cmp.title}
        description={cmp.description}
        url={canonical}
        publishedAt={cmp.publishedAt}
        keywords={cmp.keywords}
        faqs={cmp.faqs}
        crumbs={crumbs}
      />
      <main>
        <article className="dynamic-page">
          <nav className="breadcrumb" aria-label="breadcrumb">
            <Link href="/">홈</Link>
            {' / '}
            <span>비교</span>
            {' / '}
            <span>{cmp.optionA} vs {cmp.optionB}</span>
          </nav>

          <div className="section-inner">
            <p className="section-tag">Compare · {cmp.optionA} vs {cmp.optionB}</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)' }}>{cmp.h1}</h1>
            <p className="hub-intro">{cmp.intro}</p>

            <div style={{ overflowX: 'auto', marginTop: 24 }}>
              <table className="compare-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '12px 14px', borderBottom: '2px solid var(--border)' }}>구분</th>
                    <th style={{ textAlign: 'left', padding: '12px 14px', borderBottom: '2px solid var(--border)', color: 'var(--green)' }}>{cmp.optionA}</th>
                    <th style={{ textAlign: 'left', padding: '12px 14px', borderBottom: '2px solid var(--border)' }}>{cmp.optionB}</th>
                  </tr>
                </thead>
                <tbody>
                  {cmp.rows.map((r) => (
                    <tr key={r.aspect}>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>{r.aspect}</td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>{r.a}</td>
                      <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>{r.b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>름랩의 결론</h2>
            <p className="hub-intro">{cmp.verdict}</p>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>자주 묻는 질문</h2>
            <div className="faq-grid">
              {cmp.faqs.map((f) => (
                <div className="faq-item" key={f.q}>
                  <p className="faq-q">{f.q}</p>
                  <p className="faq-a">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>함께 보면 좋은 글</h2>
            <div className="link-grid">
              {cmp.related.map((r) => (
                <Link key={r.href} href={r.href}>{r.label}</Link>
              ))}
            </div>
          </div>

          <div className="cta" style={{ marginTop: 24 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>어떤 선택이 맞을지 함께 정리해 드립니다</h2>
            <p className="hub-intro">팀 상황과 목표에 맞춰 30분 무료 상담으로 안내해 드립니다.</p>
            <div className="cta-buttons">
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_compare_call">📞 무료 상담</a>
              <Link href="/#pricing" className="btn-outline" data-analytics="cta_compare_pricing">패키지 요금 보기</Link>
            </div>
          </div>
        </article>
      </main>
      <BusinessFooter topExtra={<Link href="/">← 메인으로</Link>} />
    </>
  );
}
