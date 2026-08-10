import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/seo';
import {
  WEBSITE_INDUSTRIES,
  WEBSITE_ARCHETYPES,
  websiteCanonical,
  type WebsiteCategory,
} from '@/lib/website-industries';
import { BreadcrumbJsonLdTrail } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

const CANONICAL = `${SITE.domain}/website/`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: { absolute: '업종별 홈페이지 제작 | 병원·학원·카페부터 제조·법률까지 — 름랩' },
  description:
    '업종별 홈페이지 제작 가이드. 병원·학원·헬스장·카페·쇼핑몰부터 제조·건설·법률·자동차까지, 업종마다 필요한 페이지 구성·검색 노출·제작 비용(98만 원부터)을 정리했습니다. 월 관리비 없이 소스코드 이관·직접 수정.',
  keywords: ['업종별 홈페이지 제작', '홈페이지 제작', '홈페이지 제작 비용', '홈페이지 제작 업체', '반응형 홈페이지 제작', '소상공인 홈페이지'],
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: CANONICAL,
    siteName: SITE.name,
    title: '업종별 홈페이지 제작 | 름랩',
    description: '업종마다 필요한 페이지 구성·검색 노출·비용을 정리한 업종별 홈페이지 제작 인덱스. 정액·소스코드 이관.',
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: '업종별 홈페이지 제작 — 름랩' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '업종별 홈페이지 제작 | 름랩',
    description: '업종마다 필요한 페이지 구성·검색 노출·비용을 정리한 업종별 홈페이지 제작 인덱스.',
    images: [SITE.defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

// 카테고리 표시 순서 (인덱스 페이지 그룹핑)
const CATEGORY_ORDER: WebsiteCategory[] = [
  'medical', 'care', 'funeral', 'education', 'fitness', 'beauty', 'fashion',
  'food', 'lodging', 'retail', 'manufacturing', 'construction', 'realestate',
  'professional', 'automotive', 'event', 'living', 'it', 'general',
];

export default function WebsiteHubPage() {
  const crumbs = [
    { name: '홈', url: `${SITE.domain}/` },
    { name: '업종별 홈페이지 제작', url: CANONICAL },
  ];

  const byCat = new Map<WebsiteCategory, typeof WEBSITE_INDUSTRIES>();
  for (const cat of CATEGORY_ORDER) byCat.set(cat, []);
  for (const d of WEBSITE_INDUSTRIES) byCat.get(d.category)!.push(d);

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${CANONICAL}#collection`,
    name: '업종별 홈페이지 제작',
    url: CANONICAL,
    inLanguage: 'ko-KR',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: WEBSITE_INDUSTRIES.length,
      itemListElement: WEBSITE_INDUSTRIES.map((d, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `${d.ko} 홈페이지 제작`,
        url: websiteCanonical(d.slug),
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
            <span>업종별 홈페이지 제작</span>
          </nav>

          <div className="section-inner">
            <p className="section-tag">홈페이지 제작 인덱스</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)' }}>
              업종별 홈페이지 제작 — {WEBSITE_INDUSTRIES.length}개 업종
            </h1>
            <p className="hub-intro" style={{ marginTop: 12 }}>
              업종마다 손님이 검색으로 확인하는 정보와 필요한 페이지가 다릅니다. 병원은 진료시간·예약이,
              식당은 메뉴·위치가, 제조업은 생산 품목·인증이 먼저입니다. 름랩은 업종별로 꼭 필요한 페이지 구성과
              검색 노출 포인트, 제작 비용을 정리했습니다. 월 관리비 없이 소스코드를 이관해 만든 뒤 직접 수정하실 수 있습니다.
            </p>
            <ul className="hub-intro" style={{ marginTop: 14, paddingLeft: 18, lineHeight: 2 }}>
              <li><strong>원페이지 홈페이지</strong> — VAT 포함 98만 원부터, 소상공인·소규모 사업자 맞춤</li>
              <li><strong>멀티페이지+예약·블로그</strong> — 380만 원·약 14일, 검색 노출·문의 전환 중심</li>
              <li><strong>월 관리비 0원</strong> — 소스코드·도메인·호스팅 대표님 명의 이관, 직접 수정 1:1 교육</li>
            </ul>
            <div className="cta-buttons" style={{ marginTop: 20 }}>
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_website_hub_call">
                📞 {SITE.phone} 제작 상담
              </a>
              <a href={`mailto:${SITE.email}`} className="btn-outline" data-analytics="cta_website_hub_email">
                ✉️ 이메일 문의
              </a>
            </div>
          </div>

          {CATEGORY_ORDER.map((cat) => {
            const list = byCat.get(cat)!;
            if (!list.length) return null;
            const a = WEBSITE_ARCHETYPES[cat];
            return (
              <div className="section-inner" key={cat} style={{ paddingTop: 8 }}>
                <h2 className="section-title" style={{ fontSize: '1.25rem' }}>
                  {a.label} 홈페이지 제작 <span style={{ color: 'var(--muted, #667085)', fontWeight: 400, fontSize: '0.9rem' }}>({list.length})</span>
                </h2>
                <div className="link-grid">
                  {list.map((d) => (
                    <Link key={d.slug} href={`/website/${d.slug}/`}>{d.ko} 홈페이지 제작</Link>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>관련 인덱스·서비스</h2>
            <div className="link-grid">
              <Link href="/web-development/">웹사이트 제작 — 패키지·프로세스</Link>
              <Link href="/website-agency/">홈페이지 제작 업체 선택 기준</Link>
              <Link href="/app/">업종별 앱 개발</Link>
              <Link href="/app-development/">앱개발 외주</Link>
              <Link href="/guide/">개발·제작 가이드</Link>
            </div>
          </div>

          <div className="cta" style={{ marginTop: 24 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>업종에 맞는 홈페이지, 작게 시작하세요</h2>
            <p className="hub-intro">원페이지로 시작해 검증 후 확장할 수 있습니다. 월 관리비 없이 정액으로 진행하고 소스코드를 이관합니다.</p>
            <div className="cta-buttons">
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_website_hub_call_bottom">
                📞 {SITE.phone} 상담하기
              </a>
              <Link href="/#pricing" className="btn-outline" data-analytics="cta_website_hub_pricing">
                패키지 요금 보기
              </Link>
            </div>
          </div>
        </article>
      </main>
      <BusinessFooter topExtra={<Link href="/web-development">← 웹사이트 제작 서비스로</Link>} />
    </>
  );
}
