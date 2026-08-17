import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/seo';
import { SYSTEMS } from '@/lib/systems';
import { BreadcrumbJsonLdTrail } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

const CANONICAL = `${SITE.domain}/system/`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: { absolute: '기능·시스템별 개발 | QR 주문·웨이팅·정기배송·업무관리 | 름랩' },
  description:
    '업종이 아니라 기능 이름으로 찾는 분들을 위한 인덱스입니다. QR 주문, 웨이팅·대기번호, 공간대여 예약, 정기배송 구독, 인력·근태 관리, 무역·통관 업무, 차량 랩핑 시뮬레이션까지 필요한 기능과 예상 비용·기간을 정리했습니다.',
  keywords: [
    'QR 주문 시스템 개발',
    '웨이팅 시스템 개발',
    '공간대여 앱 개발',
    '정기배송 시스템 개발',
    '업무관리 앱 개발',
    '무역 업무 시스템 개발',
    '자동차 랩핑 시뮬레이션 개발',
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: CANONICAL,
    siteName: SITE.name,
    title: '기능·시스템별 개발 | 름랩',
    description: 'QR 주문·웨이팅·공간대여·정기배송·업무관리·무역 업무 시스템의 기능 구성과 예상 비용·기간.',
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: '기능·시스템별 개발 — 름랩' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '기능·시스템별 개발 | 름랩',
    description: 'QR 주문·웨이팅·공간대여·정기배송·업무관리 시스템의 기능 구성과 예상 비용·기간.',
    images: [SITE.defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function SystemHubPage() {
  const crumbs = [
    { name: '홈', url: `${SITE.domain}/` },
    { name: '시스템·기능별 개발', url: CANONICAL },
  ];
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${CANONICAL}#collection`,
    name: '기능·시스템별 개발',
    url: CANONICAL,
    inLanguage: 'ko-KR',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: SYSTEMS.length,
      itemListElement: SYSTEMS.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: s.primary,
        url: `${SITE.domain}/system/${s.slug}/`,
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
            <span>시스템·기능별 개발</span>
          </nav>

          <div className="section-inner">
            <p className="section-tag">기능·시스템 × 개발</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)' }}>
              기능 이름으로 찾는 개발
            </h1>
            <p className="hub-intro">
              상담은 대체로 업종이 아니라 기능 이름으로 시작합니다 — &ldquo;QR로 주문받게 해 주세요&rdquo;,
              &ldquo;대기 손님을 앉히지 않고 부르고 싶어요&rdquo;, &ldquo;세탁물 정기배송을 자동으로 돌리고 싶어요&rdquo;.
              업종 페이지는 &ldquo;우리 업종에 무엇이 필요한가&rdquo;를, 이 페이지들은 &ldquo;그 기능을 어떻게 만드나&rdquo;를 다룹니다.
              각 페이지에 필요한 기능, 사용자별 화면, 관리자 범위, 기술 구조, 비용이 올라가는 조건, MVP 범위를 정리했습니다.
            </p>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>시스템 목록</h2>
            <div className="link-grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
              {SYSTEMS.map((s) => (
                <div key={s.slug} className="faq-item">
                  <p className="faq-q">
                    <Link href={`/system/${s.slug}/`}>{s.primary}</Link>
                  </p>
                  <p className="faq-a">{s.lead}</p>
                  <p className="faq-a" style={{ marginTop: 6, fontSize: '0.9rem', opacity: 0.85 }}>
                    함께 찾는 말: {s.secondary.join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>업종으로 찾으신다면</h2>
            <div className="link-grid">
              <Link href="/app/">업종별 앱 개발 — 무엇을 만드나</Link>
              <Link href="/cost/">업종별 앱 개발 비용 — 얼마가 드나</Link>
              <Link href="/solution/">업종별 솔루션 구축 — 어떻게 구축하나</Link>
              <Link href="/website/">업종별 홈페이지 제작</Link>
              <Link href="/기업용ERP/">맞춤형 ERP·업무 시스템</Link>
              <Link href="/admin-page-development/">관리자 페이지 개발</Link>
            </div>
          </div>

          <div className="cta" style={{ marginTop: 24 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>찾는 기능이 목록에 없다면</h2>
            <p className="hub-intro">
              여기 없는 기능도 대부분 만들 수 있습니다. 지금 어떤 방식으로 처리하고 계신지와 가장 불편한 지점을 알려 주시면
              만들 수 있는지, 지금 만드는 게 맞는지부터 말씀드립니다.
            </p>
            <div className="cta-buttons">
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_system_hub_call">
                📞 {SITE.phone} · 개발 가능 여부 확인
              </a>
              <a href={`mailto:${SITE.email}`} className="btn-outline" data-analytics="cta_system_hub_email">
                ✉️ 이메일로 문의
              </a>
            </div>
          </div>
        </article>
      </main>
      <BusinessFooter topExtra={<Link href="/app/">← 업종별 앱개발로</Link>} />
    </>
  );
}
