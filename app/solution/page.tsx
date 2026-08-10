import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/seo';
import { INDUSTRIES } from '@/lib/industries';
import { hasCost } from '@/lib/cost';
import { hasSolution, solutionTitleName } from '@/lib/solution';
import { BreadcrumbJsonLdTrail } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

const CANONICAL = `${SITE.domain}/solution/`;
const LIST = INDUSTRIES.filter((i) => hasSolution(i.slug));

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: { absolute: '업종별 솔루션·시스템 구축 100개 업종 | 모듈·연동 — 름랩' },
  description:
    '병원·학원·헬스장·커머스부터 제조·전문서비스까지 100개 업종별 솔루션 구축 가이드. 업종마다 어떤 기능 모듈로, 어떤 기술 스택과 연동으로, 어떤 단계로 시스템을 구축하는지 정리했습니다. 소스코드 전체 이관·직접 운영.',
  keywords: ['업종별 솔루션', '업종 시스템 구축', '업종별 관리 시스템', '디지털 전환', '업무 시스템 개발', '맞춤 솔루션 개발'],
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: CANONICAL,
    siteName: SITE.name,
    title: '업종별 솔루션·시스템 구축 100개 업종 | 름랩',
    description: '업종마다 기능 모듈·기술 스택·연동·도입 단계를 정리한 업종별 솔루션 구축 인덱스.',
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: '업종별 솔루션 구축 — 름랩' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '업종별 솔루션·시스템 구축 100개 업종 | 름랩',
    description: '업종마다 모듈·기술 스택·연동·도입 단계를 정리한 업종별 솔루션 구축 인덱스.',
    images: [SITE.defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function SolutionHubPage() {
  const crumbs = [
    { name: '홈', url: `${SITE.domain}/` },
    { name: '업종별 솔루션 구축', url: CANONICAL },
  ];
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${CANONICAL}#collection`,
    name: '업종별 솔루션·시스템 구축',
    url: CANONICAL,
    inLanguage: 'ko-KR',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: LIST.length,
      itemListElement: LIST.map((ind, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `${solutionTitleName(ind.slug)} 구축`,
        url: `${SITE.domain}/solution/${ind.slug}/`,
      })),
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
            <span>업종별 솔루션 구축</span>
          </nav>

          <div className="section-inner">
            <p className="section-tag">업종 솔루션 인덱스</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)' }}>
              업종별 솔루션·시스템 구축 — 100개 업종 모듈·연동
            </h1>
            <p className="hub-intro" style={{ marginTop: 12 }}>
              &lsquo;무엇을 만드나&rsquo;(기능)나 &lsquo;얼마가 드나&rsquo;(비용)와 달리, 여기서는 업종마다 <strong>어떻게 구축하는지</strong>를 정리했습니다.
              어떤 기능 모듈을 조합하고, 어떤 기술 스택·관리자 웹으로 구성하며, 어떤 외부 시스템과 연동하고, 1차 MVP부터 고도화까지
              어떤 단계로 도입하는지를 업종별로 볼 수 있습니다. 완성 후 소스코드를 통째로 이관해 직접 운영·확장하도록 합니다.
            </p>
            <div className="cta-buttons" style={{ marginTop: 20 }}>
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_solution_hub_call">
                📞 {SITE.phone} 구축 상담
              </a>
              <a href={`mailto:${SITE.email}`} className="btn-outline" data-analytics="cta_solution_hub_email">
                ✉️ 이메일 문의
              </a>
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>업종별 솔루션 ({LIST.length})</h2>
            <div style={{ display: 'grid', gap: 14, marginTop: 12 }}>
              {LIST.map((ind) => (
                <div key={ind.slug} style={{ padding: '12px 14px', border: '1px solid var(--border, #e5e8eb)', borderRadius: 10 }}>
                  <Link href={`/solution/${ind.slug}/`} style={{ fontWeight: 700 }}>
                    {solutionTitleName(ind.slug)} 구축
                  </Link>
                  <span style={{ color: 'var(--muted, #667085)', fontSize: '0.9rem' }}> — {ind.coreFeatures} 모듈</span>
                  <div style={{ marginTop: 6, fontSize: '0.9rem', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    <Link href={`/solution/${ind.slug}/`}>솔루션 구축</Link>
                    <Link href={`/app/${ind.slug}/`}>기능·시나리오</Link>
                    {hasCost(ind.slug) && <Link href={`/cost/${ind.slug}/`}>비용·견적</Link>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>관련 인덱스·서비스</h2>
            <div className="link-grid">
              <Link href="/app/">업종별 앱개발(기능)</Link>
              <Link href="/cost/">업종별 앱 개발 비용</Link>
              <Link href="/guide/">개발 가이드 모음</Link>
              <Link href="/admin-page-development/">관리자 페이지 개발</Link>
              <Link href="/source-handover/">소스코드 이관</Link>
            </div>
          </div>

          <div className="cta" style={{ marginTop: 24 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>업종에 맞는 시스템, 핵심 모듈부터 구축하세요</h2>
            <p className="hub-intro">전부 한 번에 만들지 않고 1차 MVP로 핵심 모듈을 검증한 뒤 단계적으로 확장합니다. 소스코드 전체 이관이 기본입니다.</p>
            <div className="cta-buttons">
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_solution_hub_call_bottom">
                📞 {SITE.phone} 전화 상담
              </a>
              <Link href="/#pricing" className="btn-outline" data-analytics="cta_solution_hub_pricing">
                패키지 요금 보기
              </Link>
            </div>
          </div>
        </article>
      </main>
      <BusinessFooter topExtra={<Link href="/app/">← 업종별 앱개발 인덱스로</Link>} />
    </>
  );
}
