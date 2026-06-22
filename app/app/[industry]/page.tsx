import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/seo';
import { INDUSTRIES, getIndustry, industryCanonical } from '@/lib/industries';
import { IndustryServiceJsonLd } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

type Props = { params: { industry: string } };

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ industry: i.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ind = getIndustry(params.industry);
  if (!ind) notFound();

  const title = `${ind.keyword} | ${ind.coreFeatures} MVP — 름랩`;
  const description = `${ind.keyword}. ${ind.coreFeatures} 등 ${ind.ko} 운영에 필요한 핵심 기능부터 MVP로. 소스코드 이관·직접 운영 교육 포함.`;
  const canonical = industryCanonical(ind.slug);

  return {
    metadataBase: new URL(SITE.domain),
    title,
    description,
    keywords: [ind.keyword, `${ind.ko} 앱`, `${ind.ko} 앱 제작`, 'MVP 개발', '앱개발 외주', '소스코드 이관'],
    alternates: { canonical },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      url: canonical,
      siteName: SITE.nameEn,
      title,
      description,
      images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [SITE.defaultOgImage] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

export default function IndustryPage({ params }: Props) {
  const ind = getIndustry(params.industry);
  if (!ind) notFound();

  const canonical = industryCanonical(ind.slug);
  const crumbs = [
    { name: '홈', url: `${SITE.domain}/` },
    { name: '업종별 앱개발', url: `${SITE.domain}/app-development/` },
    { name: ind.keyword, url: canonical },
  ];
  const others = INDUSTRIES.filter((i) => i.slug !== ind.slug).slice(0, 8);

  return (
    <>
      <IndustryServiceJsonLd
        name={ind.keyword}
        description={`${ind.keyword} — ${ind.coreFeatures}. ${ind.ko} 운영에 필요한 핵심 기능 MVP. 소스코드 이관 포함.`}
        url={canonical}
        faqs={ind.faqs}
        crumbs={crumbs}
      />
      <main>
        <article className="dynamic-page">
          <nav className="breadcrumb" aria-label="breadcrumb">
            <Link href="/">홈</Link>
            {' / '}
            <Link href="/app-development">앱개발</Link>
            {' / '}
            <span>{ind.ko}</span>
          </nav>

          <div className="section-inner">
            <p className="section-tag">업종 × 앱개발</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)' }}>
              {ind.keyword}
            </h1>
            <p className="hub-intro" style={{ fontWeight: 600, color: 'var(--green)' }}>
              핵심 기능: {ind.coreFeatures}
            </p>
            <p className="hub-intro">{ind.intro}</p>

            <div className="cta-buttons" style={{ marginTop: 24 }}>
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_industry_call">
                📞 {SITE.phone} 전화 상담
              </a>
              <a href={`mailto:${SITE.email}`} className="btn-outline" data-analytics="cta_industry_email">
                ✉️ 이메일 문의
              </a>
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>{ind.ko} 앱 핵심 기능</h2>
            <ul className="hub-intro" style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
              {ind.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p className="hub-intro" style={{ marginTop: 16 }}><strong>예상 비용</strong> — {ind.costRange}</p>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>{ind.ko}에서 어떻게 쓰이나</h2>
            <p className="hub-intro">{ind.scenario}</p>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>{ind.ko} 앱 개발 자주 묻는 질문</h2>
            <div className="faq-grid">
              {ind.faqs.map((f) => (
                <div className="faq-item" key={f.q}>
                  <p className="faq-q">{f.q}</p>
                  <p className="faq-a">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>다른 업종 앱개발</h2>
            <div className="link-grid">
              {others.map((i) => (
                <Link key={i.slug} href={`/app/${i.slug}/`}>{i.ko} 앱 개발</Link>
              ))}
            </div>
          </div>

          <div className="cta" style={{ marginTop: 24 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>{ind.ko} 앱, 핵심부터 시작하세요</h2>
            <p className="hub-intro">기획서가 없어도 핵심 기능 한두 가지만 있으면 상담을 시작할 수 있습니다.</p>
            <div className="cta-buttons">
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_industry_call_bottom">
                무료 30분 상담
              </a>
              <Link href="/#pricing" className="btn-outline" data-analytics="cta_industry_pricing">
                패키지 요금 보기
              </Link>
            </div>
          </div>
        </article>
      </main>
      <BusinessFooter topExtra={<Link href="/app-development">← 앱개발 서비스로</Link>} />
    </>
  );
}
