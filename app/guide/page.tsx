import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/seo';
import { GUIDES, guideCanonical, guideDecision } from '@/lib/guides';
import { COMPARES, compareCanonical, compareDecision } from '@/lib/compare';
import { getClusters, hubShouldIndex } from '@/lib/data';
import { BreadcrumbJsonLdTrail } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

const CANONICAL = `${SITE.domain}/guide/`;
const GUIDE_LIST = GUIDES.filter((g) => guideDecision(g.slug)?.shouldIndex);
const COMPARE_LIST = COMPARES.filter((c) => compareDecision(c.slug)?.shouldIndex);
const HUB_SLUGS = Object.keys(getClusters())
  .filter((h) => h !== 'mobile-app' && hubShouldIndex(h))
  .sort();

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: '개발 가이드 모음 | 비용·업종별 앱 만들기 — 름랩',
  description:
    '앱개발 비용, 외주 견적, 스타트업 MVP, 업종별 앱 만들기까지 개발 전 확인할 실전 가이드를 모았습니다. Flutter vs React Native 같은 선택 비교도 함께 정리했습니다.',
  keywords: ['앱개발 비용 가이드', '외주 견적', '업종별 앱 만들기', 'MVP 개발 가이드', '개발 비교'],
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: CANONICAL,
    siteName: SITE.nameEn,
    title: '개발 가이드 모음 | 름랩',
    description: '앱개발 비용·견적·MVP·업종별 앱 만들기까지 실전 가이드 모음.',
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: '개발 가이드 모음 — 름랩' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '개발 가이드 모음 | 름랩',
    description: '앱개발 비용·견적·MVP·업종별 앱 만들기까지 실전 가이드 모음.',
    images: [SITE.defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function GuideHubPage() {
  const crumbs = [
    { name: '홈', url: `${SITE.domain}/` },
    { name: '개발 가이드', url: CANONICAL },
  ];
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${CANONICAL}#collection`,
    name: '개발 가이드 모음',
    url: CANONICAL,
    inLanguage: 'ko-KR',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: GUIDE_LIST.length + COMPARE_LIST.length,
      itemListElement: [
        ...GUIDE_LIST.map((g, i) => ({ '@type': 'ListItem', position: i + 1, name: g.title, url: guideCanonical(g.slug) })),
        ...COMPARE_LIST.map((c, i) => ({
          '@type': 'ListItem',
          position: GUIDE_LIST.length + i + 1,
          name: c.title,
          url: compareCanonical(c.slug),
        })),
      ],
    },
  };

  return (
    <>
      <BreadcrumbJsonLdTrail items={crumbs} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <main>
        <article className="dynamic-page">
          <nav className="breadcrumb" aria-label="breadcrumb">
            <Link href="/">홈</Link>
            {' / '}
            <span>개발 가이드</span>
          </nav>

          <div className="section-inner">
            <p className="section-tag">가이드 인덱스</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)' }}>
              개발 가이드 모음 — 비용·견적·업종별 앱 만들기
            </h1>
            <p className="hub-intro" style={{ marginTop: 12 }}>
              앱·웹 개발을 맡기기 전에 확인하면 좋은 실전 가이드를 모았습니다. 비용이 어떻게 정해지는지, 견적을 빨리 받으려면
              무엇을 준비해야 하는지, 업종별로 앱을 만들 때 무엇부터 봐야 하는지를 정리했습니다. Flutter vs React Native처럼
              선택이 갈리는 주제는 비교 글로 따로 정리했습니다.
            </p>
            <div className="cta-buttons" style={{ marginTop: 20 }}>
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_guide_hub_call">
                📞 {SITE.phone} 전화 상담
              </a>
              <Link href="/app/" className="btn-outline" data-analytics="cta_guide_hub_industry">
                업종별 앱개발 보기
              </Link>
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>가이드 ({GUIDE_LIST.length})</h2>
            <div className="link-grid">
              {GUIDE_LIST.map((g) => (
                <Link key={g.slug} href={`/guide/${g.slug}/`}>{g.h1}</Link>
              ))}
            </div>
          </div>

          {COMPARE_LIST.length > 0 && (
            <div className="section-inner" style={{ paddingTop: 8 }}>
              <h2 className="section-title" style={{ fontSize: '1.3rem' }}>비교 ({COMPARE_LIST.length})</h2>
              <div className="link-grid">
                {COMPARE_LIST.map((c) => (
                  <Link key={c.slug} href={`/compare/${c.slug}/`}>{c.h1}</Link>
                ))}
              </div>
            </div>
          )}

          {HUB_SLUGS.length > 0 && (
            <div className="section-inner" style={{ paddingTop: 8 }}>
              <h2 className="section-title" style={{ fontSize: '1.15rem' }}>주제별 모음 더 보기</h2>
              <div className="link-grid">
                {HUB_SLUGS.map((h) => (
                  <Link key={h} href={`/h/${h}/`}>{h} 관련 글 모음</Link>
                ))}
              </div>
            </div>
          )}

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>관련 인덱스·서비스</h2>
            <div className="link-grid">
              <Link href="/app/">업종별 앱개발(기능)</Link>
              <Link href="/cost/">업종별 앱 개발 비용</Link>
              <Link href="/solution/">업종별 솔루션 구축</Link>
              <Link href="/blog/">블로그</Link>
            </div>
          </div>

          <div className="cta" style={{ marginTop: 24 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>궁금한 점, 바로 여쭤보세요</h2>
            <p className="hub-intro">가이드로 감이 안 잡히면 지금 상태만 알려 주셔도 견적·방향을 함께 잡아 드립니다.</p>
            <div className="cta-buttons">
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_guide_hub_call_bottom">
                📞 {SITE.phone} 전화 상담
              </a>
              <a href={`mailto:${SITE.email}`} className="btn-outline" data-analytics="cta_guide_hub_email">
                ✉️ 이메일 문의
              </a>
            </div>
          </div>
        </article>
      </main>
      <BusinessFooter topExtra={<Link href="/app/">← 업종별 앱개발 인덱스로</Link>} />
    </>
  );
}
