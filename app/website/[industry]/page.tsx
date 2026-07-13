import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/seo';
import {
  WEBSITE_INDUSTRIES,
  WEBSITE_ARCHETYPES,
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
      siteName: SITE.nameEn,
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

  const a = WEBSITE_ARCHETYPES[d.category];
  const c = buildWebsiteContent(d);
  const canonical = websiteCanonical(d.slug);
  const crumbs = [
    { name: '홈', url: `${SITE.domain}/` },
    { name: '업종별 홈페이지 제작', url: `${SITE.domain}/website/` },
    { name: `${d.ko} 홈페이지 제작`, url: canonical },
  ];
  const others = pickSiblings(WEBSITE_INDUSTRIES, d.slug, 8);

  return (
    <>
      <IndustryServiceJsonLd
        name={`${d.ko} 홈페이지 제작`}
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
            <p className="section-tag">업종 × 홈페이지 제작 · {a.label}</p>
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
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>{d.ko}, 검색에 잡히게 만들기</h2>
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
              <Link href="/app-development/">앱개발 — 앱까지 필요할 때</Link>
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
