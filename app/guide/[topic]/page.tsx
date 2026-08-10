import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/seo';
import { GUIDES, getGuide, guideCanonical, guideDecision } from '@/lib/guides';
import { robotsFor } from '@/lib/index-quality';
import { GuideArticleJsonLd } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

type Props = { params: { topic: string } };

export function generateStaticParams() {
  return GUIDES.map((g) => ({ topic: g.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuide(params.topic);
  if (!guide) notFound();
  const canonical = guideCanonical(guide.slug);

  return {
    metadataBase: new URL(SITE.domain),
    title: { absolute: `${guide.title} | 름랩` },
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      url: canonical,
      siteName: SITE.name,
      title: guide.title,
      description: guide.description,
      publishedTime: guide.publishedAt,
      images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: guide.title }],
    },
    twitter: { card: 'summary_large_image', title: guide.title, description: guide.description.slice(0, 200), images: [SITE.defaultOgImage] },
    // 색인 품질 게이트: 80점↑만 index (사이트맵과 동일 판정)
    robots: robotsFor(guideDecision(guide.slug)!),
  };
}

export default function GuidePage({ params }: Props) {
  const guide = getGuide(params.topic);
  if (!guide) notFound();
  const canonical = guideCanonical(guide.slug);
  const crumbs = [
    { name: '홈', url: `${SITE.domain}/` },
    { name: '가이드', url: `${SITE.domain}/guide/` },
    { name: guide.h1.slice(0, 48), url: canonical },
  ];

  return (
    <>
      <GuideArticleJsonLd
        title={guide.title}
        description={guide.description}
        url={canonical}
        publishedAt={guide.publishedAt}
        keywords={guide.keywords}
        faqs={guide.faqs}
        crumbs={crumbs}
      />
      <main>
        <article className="dynamic-page">
          <nav className="breadcrumb" aria-label="breadcrumb">
            <Link href="/">홈</Link>
            {' / '}
            <span>가이드</span>
            {' / '}
            <span>{guide.h1.slice(0, 24)}…</span>
          </nav>

          <div className="section-inner">
            <p className="section-tag">{guide.tag}</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)' }}>{guide.h1}</h1>
            <p className="hub-intro">{guide.intro}</p>

            {guide.sections.map((s) => (
              <div key={s.h} style={{ marginTop: 28 }}>
                <h2 className="section-title" style={{ fontSize: '1.2rem' }}>{s.h}</h2>
                <p className="hub-intro">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>자주 묻는 질문</h2>
            <div className="faq-grid">
              {guide.faqs.map((f) => (
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
              {guide.related.map((r) => (
                <Link key={r.href} href={r.href}>{r.label}</Link>
              ))}
            </div>
          </div>

          <div className="cta" style={{ marginTop: 24 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>견적·일정이 궁금하시면</h2>
            <p className="hub-intro">가격을 선공개합니다. 30분 무료 상담으로 범위와 견적을 안내해 드립니다.</p>
            <div className="cta-buttons">
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_guide_call">📞 무료 상담</a>
              {/* 카카오는 전화보다 문턱이 낮은 기존 채널이다. 새 채널을 만든 것이 아니라 이미 쓰는 링크를 노출한다. */}
              <a
                href={SITE.kakaoChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                data-analytics="cta_guide_kakao"
              >
                💬 카카오톡 상담
              </a>
              <Link href="/#pricing" className="btn-outline" data-analytics="cta_guide_pricing">패키지 요금 보기</Link>
            </div>
          </div>
        </article>
      </main>
      <BusinessFooter topExtra={<Link href="/">← 메인으로</Link>} />
    </>
  );
}
