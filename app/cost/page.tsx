import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/seo';
import { INDUSTRIES } from '@/lib/industries';
import { hasCost, costTitleName } from '@/lib/cost';
import { hasSolution } from '@/lib/solution';
import { BreadcrumbJsonLdTrail } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';
import { guidesForService, resolveCluster } from '@/lib/content-cluster';
import { getGuide } from '@/lib/guides';
import { getCompare } from '@/lib/compare';
import { getBlogPostBySlug } from '@/lib/blog-posts';

const CANONICAL = `${SITE.domain}/cost/`;
const LIST = INDUSTRIES.filter((i) => hasCost(i.slug));

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: { absolute: '업종별 앱 개발 비용 100개 업종 | 가격대·견적 기준 — 름랩' },
  description:
    '병원·학원·헬스장·카페·쇼핑몰부터 법무·세무까지 100개 업종별 앱 개발 비용을 정리했습니다. 업종마다 간단형·표준형·고급형 가격대와 비용을 좌우하는 요인, 절감 방법까지. VAT 포함 정액·소스코드 이관·월 관리비 없음.',
  keywords: ['업종별 앱 개발 비용', '업종별 앱 견적', '앱 개발 비용', '앱 제작 비용', 'MVP 개발 비용', '앱개발 견적'],
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: CANONICAL,
    siteName: SITE.name,
    title: '업종별 앱 개발 비용 100개 업종 | 름랩',
    description: '업종마다 가격대·비용 요인·절감 방법을 정리한 업종별 앱 개발 비용 인덱스. VAT 포함 정액.',
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: '업종별 앱 개발 비용 — 름랩' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '업종별 앱 개발 비용 100개 업종 | 름랩',
    description: '업종마다 가격대·비용 요인·절감 방법을 정리한 업종별 앱 개발 비용 인덱스.',
    images: [SITE.defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function CostHubPage() {
  const crumbs = [
    { name: '홈', url: `${SITE.domain}/` },
    { name: '업종별 앱 개발 비용', url: CANONICAL },
  ];
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${CANONICAL}#collection`,
    name: '업종별 앱 개발 비용',
    url: CANONICAL,
    inLanguage: 'ko-KR',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: LIST.length,
      itemListElement: LIST.map((ind, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: costTitleName(ind.slug),
        url: `${SITE.domain}/cost/${ind.slug}/`,
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
            <span>업종별 앱 개발 비용</span>
          </nav>

          <div className="section-inner">
            <p className="section-tag">업종 비용 인덱스</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)' }}>
              업종별 앱 개발 비용 — 100개 업종 가격대·견적 기준
            </h1>
            <p className="hub-intro" style={{ marginTop: 12 }}>
              같은 &lsquo;앱 개발&rsquo;이라도 업종마다 비용을 좌우하는 요인이 다릅니다. 병원은 전자차트 연동, 커머스는 결제·정산, 학원은 알림 발송량이
              비용의 핵심 변수입니다. 아래에서 업종을 골라 간단형·표준형·고급형 가격대와 비용 요인, 절감 방법을 확인하세요. 모든 견적은 VAT 포함
              정액으로 상담 단계에서 먼저 공개하고, 소스코드 이관·월 관리비 없음이 기본입니다.
            </p>
            <div className="cta-buttons" style={{ marginTop: 20 }}>
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_cost_hub_call">
                📞 {SITE.phone} 견적 상담
              </a>
              <Link href="/#pricing" className="btn-outline" data-analytics="cta_cost_hub_pricing">
                패키지 요금 보기
              </Link>
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>업종별 비용 ({LIST.length})</h2>
            <div style={{ display: 'grid', gap: 14, marginTop: 12 }}>
              {LIST.map((ind) => (
                <div key={ind.slug} style={{ padding: '12px 14px', border: '1px solid var(--border, #e5e8eb)', borderRadius: 10 }}>
                  <Link href={`/cost/${ind.slug}/`} style={{ fontWeight: 700 }}>
                    {costTitleName(ind.slug)}
                  </Link>
                  <span style={{ color: 'var(--muted, #667085)', fontSize: '0.9rem' }}> — {ind.costRange}</span>
                  <div style={{ marginTop: 6, fontSize: '0.9rem', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    <Link href={`/cost/${ind.slug}/`}>비용·견적</Link>
                    <Link href={`/app/${ind.slug}/`}>기능·시나리오</Link>
                    {hasSolution(ind.slug) && <Link href={`/solution/${ind.slug}/`}>솔루션 구축</Link>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
          {/* 문의 전 판단에 필요한 정보성 가이드 — 매핑은 lib/content-cluster.ts 단일 출처 */}
          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>문의 전에 확인하면 좋은 가이드</h2>
            <div className="link-grid">
              {resolveCluster(guidesForService('/cost/'), {
                guide: getGuide,
                compare: getCompare,
                blog: getBlogPostBySlug,
              }).map((g) => (
                <Link key={g.href} href={g.href}>
                  {g.label}
                </Link>
              ))}
            </div>
          </div>

            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>관련 인덱스·서비스</h2>
            <div className="link-grid">
              <Link href="/app/">업종별 앱개발(기능)</Link>
              <Link href="/system/">기능·시스템별 개발 — QR 주문·웨이팅·정기배송</Link>
              <Link href="/solution/">업종별 솔루션 구축</Link>
              <Link href="/guide/">개발 가이드 모음</Link>
              <Link href="/mvp-development/">MVP 개발 비용</Link>
              <Link href="/app-agency/">앱개발 업체</Link>
            </div>
          </div>

          <div className="cta" style={{ marginTop: 24 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>정확한 견적, 30분이면 나옵니다</h2>
            <p className="hub-intro">기획서가 없어도 업종과 꼭 필요한 기능만 알려 주시면 범위에 맞는 정액 견적을 안내해 드립니다.</p>
            <div className="cta-buttons">
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_cost_hub_call_bottom">
                📞 {SITE.phone} 전화 상담
              </a>
              <a href={`mailto:${SITE.email}`} className="btn-outline" data-analytics="cta_cost_hub_email">
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
