import type { Metadata } from 'next';
import Link from '@/components/SiteLink';
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
    '업종별 홈페이지 제작 가이드. 병원·학원·헬스장·카페·쇼핑몰부터 제조·건설·법률·자동차까지, 업종마다 필요한 페이지 구성·검색 노출·제작 비용(98만 원부터)을 정리했습니다. 소스코드 이관·직접 수정. 외부 실비·선택 유지보수 별도.',
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
              검색 노출 포인트, 제작 비용을 정리했습니다. 소스코드를 이관해 만든 뒤 직접 수정하실 수 있습니다. 외부 운영 실비와 선택 유지보수는 별도입니다.
            </p>
            <ul className="hub-intro" style={{ marginTop: 14, paddingLeft: 18, lineHeight: 2 }}>
              <li><strong>원페이지 홈페이지</strong> — VAT 포함 98만 원부터, 소상공인·소규모 사업자 맞춤</li>
              <li><strong>멀티페이지+예약·블로그</strong> — 380만 원·약 14일, 검색 노출·문의 전환 중심</li>
              <li><strong>유지보수 계약은 선택</strong> — 호스팅·도메인 등 실비 별도, 소스코드·계정 이관과 직접 수정 교육</li>
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

          {/*
            294개 업종 페이지가 똑같이 되풀이하던 공통 원칙·공통 FAQ 를 여기 한 곳으로 옮겼다(2026-10 유사문서 정비).
            업종 페이지에는 그 업종의 문구만 남는다 — lib/website-copy.ts 머리말 참고.
          */}
          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.25rem' }}>모든 업종에 공통인 제작 원칙</h2>
            <ul className="hub-intro" style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
              <li>실제 제공 범위와 이용 조건을 확인한 뒤 안내·자료·문의 페이지를 구성합니다. 각 업종 페이지의 구성은 설계 예시이며, 기능과 연동의 계약 범위는 상담에서 정합니다.</li>
              <li>사진에는 대상과 제공 범위를 설명하고, 실제 사업자의 자료와 공개 권한이 확인된 이미지만 씁니다. 공개할 수 없는 사례는 넣지 않습니다.</li>
              <li>자료의 예시와 실제 판매·제공 조건이 다르면 차이를 설명합니다. 첨부 문서에만 중요한 내용을 넣지 않고 비교 기준과 이용 조건을 본문에도 제공합니다.</li>
              <li>문의는 방문자가 안내를 읽고 필요한 항목을 고른 뒤 연락 방법을 남기도록 구성합니다. 접수 완료를 계약·예약 확정으로 표시하지 않고, 상세 개인정보나 비공개 자료가 필요한 단계는 초기 공개 문의와 분리합니다.</li>
              <li>검색에 필요한 설명을 이미지 안에만 넣지 않고 읽을 수 있는 본문으로 제공합니다. 검색 순위는 검색엔진이 정하므로 보장하지 않지만, 검색엔진이 내용을 정확히 읽을 수 있는 구조를 기본으로 갖춥니다.</li>
              <li>예약·결제·회원 같은 업무 기능은 사용자 권한·데이터·업무 규칙이 필요한 별도 구축 범위입니다. 기존 서비스로 연결할지 별도 화면과 데이터를 만들지 정한 뒤 제작비·운영 실비·추가 개발을 구분합니다.</li>
            </ul>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.25rem' }}>업종 홈페이지 공통 질문</h2>
            <div className="faq-grid">
              <div className="faq-item">
                <p className="faq-q">만든 뒤 정보를 직접 수정할 수 있나요?</p>
                <p className="faq-a">네. 소스코드를 이관하고, 가격·소식·이미지를 대표님이 직접 고칠 수 있도록 관리 화면과 1:1 교육을 제공합니다. 수정할 때마다 제작사에 요청하지 않아도 됩니다.</p>
              </div>
              <div className="faq-item">
                <p className="faq-q">소개 홈페이지와 별도 업무 시스템은 어떻게 구분하나요?</p>
                <p className="faq-a">비교 정보와 문의 접수가 중심이면 소개 홈페이지의 범위를 먼저 정합니다. 예약·결제·회원·진료기록처럼 권한과 데이터가 필요한 기능은 별도 구축 범위이며, 필요한 외부 서비스의 API와 이용 권한을 확인한 뒤 포함 기능과 비용을 협의합니다.</p>
              </div>
              <div className="faq-item">
                <p className="faq-q">결제가 필요한 홈페이지도 만들 수 있나요?</p>
                <p className="faq-a">네. 름랩은 토스페이먼츠 협력사로, 결제가 필요하면 가입부터 연동·테스트까지 개발 과정에서 함께 진행합니다. 름랩 고객사는 가입비·수수료 혜택을 받을 수 있습니다.</p>
              </div>
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>관련 인덱스·서비스</h2>
            <div className="link-grid">
              <Link href="/web-development/">웹사이트 제작 — 패키지·프로세스</Link>
              <Link href="/seo-website/">업종·지역 검색 유입을 고려한 홈페이지 제작</Link>
              <Link href="/geo-website/">AI 검색까지 고려한 GEO 홈페이지 제작</Link>
              <Link href="/website-agency/">홈페이지 제작 업체 선택 기준</Link>
              <Link href="/app/">업종별 앱 개발</Link>
              <Link href="/app-development/">앱개발 외주</Link>
              <Link href="/guide/">개발·제작 가이드</Link>
            </div>
          </div>

          <div className="cta" style={{ marginTop: 24 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>업종에 맞는 홈페이지, 작게 시작하세요</h2>
            <p className="hub-intro">원페이지로 시작해 검증 후 확장할 수 있습니다. 계약 범위는 정액으로 진행하고 소스코드를 이관합니다. 외부 실비·선택 유지보수·추가 개발비는 별도입니다.</p>
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
