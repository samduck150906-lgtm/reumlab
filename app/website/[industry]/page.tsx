import type { Metadata } from 'next';
import Link from '@/components/SiteLink';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/seo';
import {
  WEBSITE_INDUSTRIES,
  getWebsiteIndustry,
  websiteCanonical,
  websiteTitle,
  websiteDescription,
  websiteDecision,
  buildWebsiteContent,
} from '@/lib/website-industries';
import { robotsFor } from '@/lib/index-quality';
import { IndustryServiceJsonLd } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';
import { ctaPrimary, operatorNote } from '@/lib/voice';
import { pickSiblings } from '@/lib/sibling-picker';
import { getSeoWebsiteIndustryByExistingSlug } from '@/lib/seo-website';
import SeoWebsiteIndustryEnhancement from '@/components/SeoWebsiteIndustryEnhancement';
import { WEBSITE_SERVICE_FAMILY } from '@/lib/website-editorial';
import { getIndustry } from '@/lib/industries';
import { hasCost } from '@/lib/cost';
import { hasSolution } from '@/lib/solution';

type Props = { params: { industry: string } };

export function generateStaticParams() {
  return WEBSITE_INDUSTRIES.map((d) => ({ industry: d.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = getWebsiteIndustry(params.industry);
  if (!d) notFound();

  const title = websiteTitle(d);
  const description = websiteDescription(d);
  const canonical = websiteCanonical(d.slug);

  return {
    metadataBase: new URL(SITE.domain),
    title: { absolute: title },
    description,
    keywords: [
      `${d.ko} 홈페이지 제작`,
      `${d.ko} 홈페이지`,
      `${d.ko}홈페이지`,
      `${d.ko} 홈페이지 제작 비용`,
      `${d.ko} 홈페이지 제작 업체`,
      '홈페이지 제작',
      '홈페이지 제작 비용',
      '반응형 홈페이지 제작',
    ],
    alternates: { canonical },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      url: canonical,
      siteName: SITE.name,
      title,
      description,
      images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [SITE.defaultOgImage] },
    // 색인 품질 게이트: 80점↑만 index (사이트맵과 동일 판정)
    robots: robotsFor(websiteDecision(d.slug)!),
  };
}

export default function WebsiteIndustryPage({ params }: Props) {
  const d = getWebsiteIndustry(params.industry);
  if (!d) notFound();

  const c = buildWebsiteContent(d);
  const canonical = websiteCanonical(d.slug);
  const crumbs = [
    { name: '홈', url: `${SITE.domain}/` },
    { name: '업종별 홈페이지 제작', url: `${SITE.domain}/website/` },
    { name: `${d.ko} 홈페이지 제작`, url: canonical },
  ];
  const others = pickSiblings(WEBSITE_INDUSTRIES, d.slug, 8);
  const seoWebsiteProfile = getSeoWebsiteIndustryByExistingSlug(d.slug);
  const serviceSlug = WEBSITE_SERVICE_FAMILY[d.slug];
  const relatedService = serviceSlug ? getIndustry(serviceSlug) : undefined;

  return (
    <>
      <IndustryServiceJsonLd
        name={`${d.ko} 홈페이지 제작`}
        serviceType="웹사이트 개발"
        description={`${d.ko} 홈페이지 제작 — 페이지 구성·검색 노출·비용. 월 관리비 없이 소스코드 이관·직접 수정.`}
        url={canonical}
        faqs={c.faqs}
        crumbs={crumbs}
      />
      <main>
        <article className="dynamic-page">
          <nav className="breadcrumb" aria-label="breadcrumb">
            <Link href="/">홈</Link>
            {' / '}
            <Link href="/website">업종별 홈페이지 제작</Link>
            {' / '}
            <span>{d.ko} 홈페이지 제작</span>
          </nav>

          <div className="section-inner">
            <p className="section-tag">업종별 홈페이지 제작 · 안내·문의 설계</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)' }}>
              {d.ko} 홈페이지 제작
            </h1>
            <p className="hub-intro">{c.intro}</p>
            <p className="hub-intro" style={{ marginTop: 12, fontSize: '0.95rem', color: 'var(--muted, #667085)', borderLeft: '3px solid var(--green)', paddingLeft: 12 }}>
              {operatorNote('web-' + d.slug)}
            </p>

            <div className="cta-buttons" style={{ marginTop: 24 }}>
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_website_call">
                📞 {SITE.phone} 제작 상담
              </a>
              <a href={`mailto:${SITE.email}`} className="btn-outline" data-analytics="cta_website_email">
                ✉️ 이메일 문의
              </a>
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>{d.ko} 홈페이지 페이지 구성</h2>
            <ul className="hub-intro" style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
              {c.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p className="hub-intro" style={{ marginTop: 16 }}><strong>제작 비용·기간</strong> — {c.priceLine}</p>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>제작 전에 준비할 사진·자료</h2>
            <p className="hub-intro">{c.editorial.materials} 자료를 준비합니다. 사진에는 대상과 제공 범위를 설명하고, 실제 사업자의 자료와 공개 권한이 확인된 이미지를 사용합니다. 공개할 수 없는 사례는 넣지 않고, 부족한 사진은 촬영할 대상부터 정합니다.</p>
            <p className="hub-intro" style={{ marginTop: 12 }}>자료의 예시와 실제 판매·제공 조건이 다르면 차이를 설명합니다. 첨부 문서에만 중요한 내용을 넣지 않고 비교 기준과 이용 조건을 본문에도 제공합니다.</p>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>운영자가 갱신할 정보</h2>
            <p className="hub-intro">수정 대상은 {c.editorial.maintain}입니다. 항목별 담당자와 갱신 시점을 정하고, 변경된 조건이 소개·문의 안내에도 함께 반영되도록 구성합니다. 직접 수정할 화면과 수정 시 필요한 검수 절차는 제작 범위를 정할 때 확인합니다.</p>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>소개 홈페이지와 업무 시스템의 범위</h2>
            <p className="hub-intro">비교 정보와 문의 접수가 중심이면 소개 홈페이지의 범위를 먼저 정합니다. {c.editorial.system} 기능은 사용자 권한·데이터·업무 규칙이 필요한 별도 구축 범위입니다. 필요한 외부 서비스의 API와 이용 권한을 확인한 뒤 포함 기능과 비용을 협의합니다.</p>
            <p className="hub-intro" style={{ marginTop: 12 }}>위 기능이 홈페이지 기본 패키지에 모두 포함되는 것은 아닙니다. 기존 서비스로 연결할지, 별도 화면과 데이터를 만들지 결정한 뒤 제작비·운영 실비·추가 개발을 구분합니다.</p>
          </div>

          {seoWebsiteProfile ? <SeoWebsiteIndustryEnhancement profile={seoWebsiteProfile} /> : null}

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>{d.ko} 정보를 검색에서 이해할 수 있도록</h2>
            <p className="hub-intro">{c.searchLine}</p>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>{d.ko} 홈페이지, 어떻게 문의로 이어지나</h2>
            <p className="hub-intro">{c.scenario}</p>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>{d.ko} 홈페이지 제작 자주 묻는 질문</h2>
            <div className="faq-grid">
              {c.faqs.map((f) => (
                <div className="faq-item" key={f.q}>
                  <p className="faq-q">{f.q}</p>
                  <p className="faq-a">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>함께 보면 좋은 서비스</h2>
            <div className="link-grid">
              <Link href="/web-development/">웹사이트 제작 — 패키지·프로세스</Link>
              <Link href="/website-agency/">홈페이지 제작 업체 — 선택 기준·비용</Link>
              <Link href="/seo-website/">검색 잘되는 홈페이지 제작 — 검색·문의 구조</Link>
              <Link href="/app-development/">앱개발 — 앱까지 필요할 때</Link>
              {relatedService && (
                <>
                  <Link href={`/app/${relatedService.slug}/`}>{relatedService.ko} 앱 — 사용자·운영자 기능</Link>
                  {hasCost(relatedService.slug) && <Link href={`/cost/${relatedService.slug}/`}>{relatedService.ko} 앱·시스템 비용 — 범위별 견적</Link>}
                  {hasSolution(relatedService.slug) && <Link href={`/solution/${relatedService.slug}/`}>{relatedService.ko} 솔루션 — 운영 데이터·도입</Link>}
                </>
              )}
              {/* 검색 의도가 맞닿은 전용 서비스로 컨텍스트 내부링크 */}
              {d.category === 'education' && (
                <Link href="/academy-shopping-mall/">학원 쇼핑몰 제작 — 수강신청·결제 구축</Link>
              )}
              {d.category === 'realestate' && (
                <Link href="/realestate-landing/">부동산 랜딩페이지 — 분양·매물 문의 전환형</Link>
              )}
              <Link href="/website/">업종별 홈페이지 제작 전체 보기</Link>
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>다른 업종 홈페이지 제작</h2>
            <div className="link-grid">
              {others.map((x) => (
                <Link key={x.slug} href={`/website/${x.slug}/`}>{x.ko} 홈페이지 제작</Link>
              ))}
            </div>
          </div>

          <div className="cta" style={{ marginTop: 24 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>{d.ko} 홈페이지, 꼭 필요한 페이지부터 시작하세요</h2>
            <p className="hub-intro">전체를 한 번에 만들지 않아도 됩니다. 원페이지로 작게 시작해 검증 후 확장할 수 있습니다. 월 관리비 없이 정액으로 진행합니다.</p>
            <div className="cta-buttons">
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_website_call_bottom">
                {ctaPrimary('web-' + d.slug)}
              </a>
              <Link href="/#pricing" className="btn-outline" data-analytics="cta_website_pricing">
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
