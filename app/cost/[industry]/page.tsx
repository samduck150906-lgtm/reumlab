import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/seo';
import { getIndustry } from '@/lib/industries';
import { COSTS, getCost, costCanonical, costDecision, costTitleName } from '@/lib/cost';
import { robotsFor } from '@/lib/index-quality';
import { IndustryServiceJsonLd } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

type Props = { params: { industry: string } };

export function generateStaticParams() {
  return COSTS.map((c) => ({ industry: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCost(params.industry);
  if (!c) notFound();

  const name = costTitleName(c.slug);
  const title = `${name} | 가격대·비용 구성·절감 방법 — 름랩`;
  const description = `${name} 얼마나 들까요? 간단형·표준형·고급형 가격대와 비용을 좌우하는 요인, 유지비, 절감 방법까지 정리했습니다. 소스코드 이관·월 관리비 없음.`;
  const canonical = costCanonical(c.slug);
  const ind = getIndustry(c.slug);

  return {
    metadataBase: new URL(SITE.domain),
    title,
    description,
    keywords: [name, `${ind?.ko ?? ''} 앱 견적`, `${ind?.ko ?? ''} 앱 제작 비용`, '앱개발 비용', 'MVP 개발 견적', '소스코드 이관'],
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
    robots: robotsFor(costDecision(c.slug)!),
  };
}

export default function CostPage({ params }: Props) {
  const c = getCost(params.industry);
  if (!c) notFound();

  const ind = getIndustry(c.slug);
  const name = costTitleName(c.slug);
  const canonical = costCanonical(c.slug);
  const crumbs = [
    { name: '홈', url: `${SITE.domain}/` },
    { name: '업종별 앱개발', url: `${SITE.domain}/app-development/` },
    { name, url: canonical },
  ];
  const others = COSTS.filter((x) => x.slug !== c.slug).slice(0, 6);

  return (
    <>
      <IndustryServiceJsonLd
        name={name}
        description={`${name} — 간단형·표준형·고급형 가격대와 비용 요인·유지비·절감 방법. 소스코드 이관 포함.`}
        url={canonical}
        faqs={c.faqs}
        crumbs={crumbs}
      />
      <main>
        <article className="dynamic-page">
          <nav className="breadcrumb" aria-label="breadcrumb">
            <Link href="/">홈</Link>
            {' / '}
            <Link href="/app-development">앱개발</Link>
            {' / '}
            <span>{name}</span>
          </nav>

          <div className="section-inner">
            <p className="section-tag">업종 × 비용·견적</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)' }}>
              {name}
            </h1>
            <p className="hub-intro">{c.lead}</p>

            <div className="cta-buttons" style={{ marginTop: 24 }}>
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_cost_call">
                📞 {SITE.phone} 견적 상담
              </a>
              <a href={`mailto:${SITE.email}`} className="btn-outline" data-analytics="cta_cost_email">
                ✉️ 이메일 문의
              </a>
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>{ind?.ko ?? ''} 앱 개발 가격대</h2>
            <div className="link-grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
              {c.tiers.map((t) => (
                <div key={t.name} className="faq-item">
                  <p className="faq-q" style={{ color: 'var(--green)' }}>{t.name} · {t.range}</p>
                  <p className="faq-a">{t.scope}</p>
                </div>
              ))}
            </div>
            <p className="hub-intro" style={{ marginTop: 8, fontSize: '0.92rem', opacity: 0.85 }}>
              * 모든 금액은 VAT 포함, 소스코드 전체 이관 기준입니다. 정확한 금액은 기능 범위에 따라 상담 후 확정됩니다.
            </p>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>{ind?.ko ?? ''} 앱 비용을 좌우하는 요인</h2>
            <ul className="hub-intro" style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
              {c.drivers.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>완성 후 유지·운영비</h2>
            <p className="hub-intro">{c.running}</p>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>비용을 낮추는 방법</h2>
            <ul className="hub-intro" style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
              {c.save.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>{ind?.ko ?? ''} 앱 개발 비용 자주 묻는 질문</h2>
            <div className="faq-grid">
              {c.faqs.map((f) => (
                <div className="faq-item" key={f.q}>
                  <p className="faq-q">{f.q}</p>
                  <p className="faq-a">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          {ind && (
            <div className="section-inner" style={{ paddingTop: 8 }}>
              <h2 className="section-title" style={{ fontSize: '1.15rem' }}>{ind.ko} 앱, 무엇을 만드나</h2>
              <div className="link-grid">
                <Link href={`/app/${ind.slug}/`}>{ind.keyword} — 핵심 기능·시나리오 보기</Link>
              </div>
            </div>
          )}

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>다른 업종 앱 개발 비용</h2>
            <div className="link-grid">
              {others.map((x) => (
                <Link key={x.slug} href={`/cost/${x.slug}/`}>{costTitleName(x.slug)}</Link>
              ))}
            </div>
          </div>

          <div className="cta" style={{ marginTop: 24 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>정확한 견적, 30분이면 나옵니다</h2>
            <p className="hub-intro">기획서가 없어도 꼭 필요한 기능만 알려 주시면 범위에 맞는 정액 견적을 안내해 드립니다.</p>
            <div className="cta-buttons">
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_cost_call_bottom">
                무료 견적 상담
              </a>
              <Link href="/#pricing" className="btn-outline" data-analytics="cta_cost_pricing">
                패키지 요금 보기
              </Link>
            </div>
          </div>
        </article>
      </main>
      <BusinessFooter topExtra={<Link href="/app-development">← 업종별 앱개발로</Link>} />
    </>
  );
}
