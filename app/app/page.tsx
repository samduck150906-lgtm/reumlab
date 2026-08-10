import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/seo';
import { INDUSTRIES } from '@/lib/industries';
import { hasCost } from '@/lib/cost';
import { hasSolution } from '@/lib/solution';
import { BreadcrumbJsonLdTrail } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

const CANONICAL = `${SITE.domain}/app/`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: { absolute: '업종별 앱 개발 100개 업종 | 기능·비용·솔루션 한눈에 — 름랩' },
  description:
    '병원·학원·헬스장·카페·쇼핑몰부터 법무·세무·부동산까지 100개 업종별 앱 개발 가이드. 업종마다 무엇을 만드나(기능)·얼마가 드나(비용)·어떻게 구축하나(솔루션)를 정리했습니다. Flutter MVP·소스코드 이관·직접 운영.',
  keywords: ['업종별 앱개발', '업종별 앱 제작', '업종 맞춤 앱', '앱개발 외주', '업종별 솔루션', 'MVP 개발'],
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: CANONICAL,
    siteName: SITE.name,
    title: '업종별 앱 개발 100개 업종 | 름랩',
    description: '업종마다 기능·비용·솔루션을 정리한 업종별 앱 개발 인덱스. Flutter MVP·소스코드 이관.',
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: '업종별 앱 개발 — 름랩' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '업종별 앱 개발 100개 업종 | 름랩',
    description: '업종마다 기능·비용·솔루션을 정리한 업종별 앱 개발 인덱스.',
    images: [SITE.defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function IndustryHubPage() {
  const crumbs = [
    { name: '홈', url: `${SITE.domain}/` },
    { name: '업종별 앱 개발', url: CANONICAL },
  ];

  // ItemList 구조화 데이터 — 업종 컬렉션을 검색엔진이 목록으로 이해하도록
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${CANONICAL}#collection`,
    name: '업종별 앱 개발',
    url: CANONICAL,
    inLanguage: 'ko-KR',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: INDUSTRIES.length,
      itemListElement: INDUSTRIES.map((ind, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: ind.keyword,
        url: `${SITE.domain}/app/${ind.slug}/`,
      })),
    },
  };

  return (
    <>
      <BreadcrumbJsonLdTrail items={crumbs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <main>
        <article className="dynamic-page">
          <nav className="breadcrumb" aria-label="breadcrumb">
            <Link href="/">홈</Link>
            {' / '}
            <span>업종별 앱 개발</span>
          </nav>

          <div className="section-inner">
            <p className="section-tag">업종 인덱스</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)' }}>
              업종별 앱 개발 — 100개 업종 맞춤 MVP·솔루션
            </h1>
            <p className="hub-intro" style={{ marginTop: 12 }}>
              름랩은 업종마다 실제 운영 흐름이 다르다는 전제에서 출발합니다. 병원·학원·헬스장·카페·쇼핑몰부터
              법무·세무·부동산·제조까지, 100개 업종별로 무엇을 만들고(기능) 얼마가 들며(비용) 어떻게 구축하는지(솔루션)를
              나눠 정리했습니다. 아래에서 업종을 골라 세 관점을 함께 확인하세요.
            </p>
            <ul className="hub-intro" style={{ marginTop: 14, paddingLeft: 18, lineHeight: 2 }}>
              <li><strong>기능(/app)</strong> — 그 업종 앱이 무엇을 하는지: 핵심 기능·운영 시나리오</li>
              <li><strong>비용(/cost)</strong> — 얼마가 드는지: 가격대·비용을 좌우하는 요인·절감 방법</li>
              <li><strong>솔루션(/solution)</strong> — 어떻게 구축하는지: 기능 모듈·기술 스택·연동·도입 단계</li>
            </ul>
            <div className="cta-buttons" style={{ marginTop: 20 }}>
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_industry_hub_call">
                📞 {SITE.phone} 전화 상담
              </a>
              <a href={`mailto:${SITE.email}`} className="btn-outline" data-analytics="cta_industry_hub_email">
                ✉️ 이메일 문의
              </a>
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>업종 전체 ({INDUSTRIES.length})</h2>
            <div style={{ display: 'grid', gap: 14, marginTop: 12 }}>
              {INDUSTRIES.map((ind) => (
                <div
                  key={ind.slug}
                  style={{
                    padding: '12px 14px',
                    border: '1px solid var(--border, #e5e8eb)',
                    borderRadius: 10,
                  }}
                >
                  <Link href={`/app/${ind.slug}/`} style={{ fontWeight: 700 }}>
                    {ind.keyword}
                  </Link>
                  <span style={{ color: 'var(--muted, #667085)', fontSize: '0.9rem' }}> — {ind.coreFeatures}</span>
                  <div style={{ marginTop: 6, fontSize: '0.9rem', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    <Link href={`/app/${ind.slug}/`}>기능·시나리오</Link>
                    {hasCost(ind.slug) && <Link href={`/cost/${ind.slug}/`}>비용·견적</Link>}
                    {hasSolution(ind.slug) && <Link href={`/solution/${ind.slug}/`}>솔루션 구축</Link>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>관련 인덱스·서비스</h2>
            <div className="link-grid">
              <Link href="/cost/">업종별 앱 개발 비용</Link>
              <Link href="/solution/">업종별 솔루션 구축</Link>
              <Link href="/website/">업종별 홈페이지 제작</Link>
              <Link href="/guide/">개발 가이드 모음</Link>
              <Link href="/app-development/">앱개발 외주</Link>
              <Link href="/app-agency/">앱개발 업체</Link>
              <Link href="/admin-page-development/">관리자 페이지 개발</Link>
              <Link href="/source-handover/">소스코드 이관</Link>
            </div>
          </div>

          <div className="cta" style={{ marginTop: 24 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>업종에 딱 맞는 앱, 핵심부터 시작하세요</h2>
            <p className="hub-intro">
              기획서가 없어도 업종과 꼭 필요한 기능 한두 가지만 있으면 상담을 시작할 수 있습니다. 소스코드 전체 이관과 직접 운영 교육이 기본 포함입니다.
            </p>
            <div className="cta-buttons">
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_industry_hub_call_bottom">
                📞 {SITE.phone} 전화 상담
              </a>
              <Link href="/#pricing" className="btn-outline" data-analytics="cta_industry_hub_pricing">
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
