import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/seo';
import {
  SERVICES,
  REGIONS,
  getService,
  getRegion,
  siblingRegions,
  regionServiceCanonical,
  regionServiceDecision,
} from '@/lib/pseo';
import { robotsFor } from '@/lib/index-quality';
import { RegionServiceJsonLd } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

type Props = { params: { slug: string; region: string } };

export function generateStaticParams() {
  const out: { slug: string; region: string }[] = [];
  for (const s of SERVICES) for (const r of REGIONS) out.push({ slug: s.slug, region: r.slug });
  return out;
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService(params.slug);
  const region = getRegion(params.region);
  if (!service || !region) notFound();

  const title = `${region.full} ${service.ko} | 소스코드 이관·정액 패키지 — 름랩`;
  const description = `${region.full} ${service.ko}. ${region.access} ${service.priceLine}. 소스코드 전체 이관과 직접 운영 교육 포함.`;
  const canonical = regionServiceCanonical(service.slug, region.slug);

  // 색인 품질 게이트: 고유성 80점↑만 index + 사이트맵 포함 (사이트맵과 동일 판정)
  const decision = regionServiceDecision(service.slug, region.slug);

  return {
    metadataBase: new URL(SITE.domain),
    title,
    description,
    keywords: [
      `${region.full} ${service.short}`,
      `${region.full} ${service.ko}`,
      service.ko,
      '소스코드 이관',
      '정액 패키지',
      `${region.full} 외주개발`,
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
    robots: decision ? robotsFor(decision) : { index: true, follow: true },
  };
}

export default function RegionServicePage({ params }: Props) {
  const service = getService(params.slug);
  const region = getRegion(params.region);
  if (!service || !region) notFound();

  const canonical = regionServiceCanonical(service.slug, region.slug);
  const h1 = `${region.full} ${service.ko}`;

  // 고유 FAQ 3개: 지역 FAQ + 서비스 FAQ + 지역×서비스 결합 FAQ
  const combinedFaq = {
    q: `${region.full}에서 ${service.ko}, 어떻게 진행되나요?`,
    a: `${region.access} ${service.intro.split('.')[0]}. ${service.priceLine}이며, 소스코드 전체와 실행 문서를 이관해 ${region.full}에서도 종속 없이 직접 운영하실 수 있습니다.`,
  };
  const faqs = [region.faq, service.faq, combinedFaq];

  const siblings = siblingRegions(service.slug, region.slug, 6);
  const crumbs = [
    { name: '홈', url: `${SITE.domain}/` },
    { name: service.ko, url: `${SITE.domain}${service.hubHref === '/' ? '' : service.hubHref}/` },
    { name: h1, url: canonical },
  ];

  return (
    <>
      <RegionServiceJsonLd
        serviceName={service.ko}
        regionName={region.full}
        description={`${region.full} ${service.ko} — ${service.priceLine}. 소스코드 이관·직접 운영 교육 포함.`}
        url={canonical}
        faqs={faqs}
        crumbs={crumbs}
      />
      <main>
        <article className="dynamic-page">
          <nav className="breadcrumb" aria-label="breadcrumb">
            <Link href="/">홈</Link>
            {' / '}
            <Link href={service.hubHref}>{service.ko}</Link>
            {' / '}
            <span>{region.full}</span>
          </nav>

          <div className="section-inner">
            <p className="section-tag">{region.full} · {service.short}</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)' }}>
              {h1}
            </h1>
            <p className="hub-intro" style={{ fontWeight: 600, color: 'var(--green)' }}>
              {service.priceLine}
            </p>
            <p className="hub-intro">{region.intro}</p>

            <div className="cta-buttons" style={{ marginTop: 24 }}>
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_region_call">
                📞 {SITE.phone} 전화 상담
              </a>
              <a href={`mailto:${SITE.email}`} className="btn-outline" data-analytics="cta_region_email">
                ✉️ 이메일 문의
              </a>
            </div>
          </div>

          {/* 왜 이 지역에서 름랩인가 — 지역 고유 블록 */}
          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>
              왜 {region.full}에서 름랩인가
            </h2>
            <p className="hub-intro">{region.access}</p>
            <p className="hub-intro" style={{ marginTop: 14 }}>{region.scene}</p>
          </div>

          {/* 서비스 진행 방식 — 서비스 고유 블록 */}
          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>
              {service.ko}, 이렇게 진행합니다
            </h2>
            <p className="hub-intro">{service.intro}</p>
            <ul className="hub-intro" style={{ marginTop: 14, paddingLeft: 18, lineHeight: 2 }}>
              {service.deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>

          {/* FAQ */}
          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>
              {region.full} {service.short} 자주 묻는 질문
            </h2>
            <div className="faq-grid">
              {faqs.map((f) => (
                <div className="faq-item" key={f.q}>
                  <p className="faq-q">{f.q}</p>
                  <p className="faq-a">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 내부링크 — 허브 & 다른 지역 스포크 */}
          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>
              다른 지역 {service.short}
            </h2>
            <div className="link-grid">
              {siblings.map((r) => (
                <Link key={r.slug} href={`/${service.slug}/${r.slug}/`}>
                  {r.full} {service.short}
                </Link>
              ))}
            </div>
            <p className="hub-intro" style={{ marginTop: 18 }}>
              <Link href={service.hubHref} style={{ color: 'var(--green)' }}>
                ← {service.ko} 서비스 전체 보기
              </Link>
            </p>
          </div>

          <div className="cta" style={{ marginTop: 24 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>{region.full}에서 시작해 볼까요?</h2>
            <p className="hub-intro">기획서가 없어도 아이디어와 핵심 기능만 있으면 상담을 시작할 수 있습니다.</p>
            <div className="cta-buttons">
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_region_call_bottom">
                무료 30분 상담
              </a>
              <Link href="/#pricing" className="btn-outline" data-analytics="cta_region_pricing">
                패키지 요금 보기
              </Link>
            </div>
          </div>
        </article>
      </main>
      <BusinessFooter topExtra={<Link href={service.hubHref}>← {service.ko} 허브로</Link>} />
    </>
  );
}
