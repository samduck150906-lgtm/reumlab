import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE, pillarServiceType } from '@/lib/seo';
import {
  SERVICES,
  REGIONS,
  getService,
  getRegion,
  siblingRegions,
  hasRealNearby,
  regionServiceCanonical,
  regionServiceDecision,
  regionServiceMedia,
} from '@/lib/pseo';
import { robotsFor } from '@/lib/index-quality';
import { regionServiceProfile, remoteWorkNote } from '@/lib/region-service';
import { RegionServiceJsonLd } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

type Props = { params: { slug: string; region: string } };

/**
 * 지역 페이지 title/description — 서비스마다 꼬리말이 다르다.
 * 앞부분 `{지역} {서비스}` 는 기존 타깃 키워드라 그대로 두고(색인된 페이지 보호),
 * 뒤에 그 서비스 고유의 강점을 붙여 350개가 한 패턴으로 찍히지 않게 한다.
 */
function regionServiceTitle(regionFull: string, service: { ko: string; titleTail: string }): string {
  return `${regionFull} ${service.ko} | ${service.titleTail}`;
}
/**
 * description 은 서비스 훅(고유) + 지역 상권 한 줄(고유) + 가격 한 줄(고유) 로 구성한다.
 * 지역명만 치환된 문장이 되지 않게 세 축을 모두 넣되, 한국어 검색결과에서 잘리지 않도록
 * 120자 안팎으로 유지한다(이전 버전은 160자를 넘어 뒷부분이 노출되지 않았다).
 */
function regionServiceDescription(
  region: { full: string; access: string },
  service: { ko: string; descLead: string; priceLine: string },
): string {
  return `${service.descLead} ${region.full} ${service.ko} — ${region.access} ${service.priceLine}.`;
}

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

  const title = regionServiceTitle(region.full, service);
  const description = regionServiceDescription(region, service);
  const canonical = regionServiceCanonical(service.slug, region.slug);

  // 색인 품질 게이트: 고유성 80점↑만 index + 사이트맵 포함 (사이트맵과 동일 판정)
  const decision = regionServiceDecision(service.slug, region.slug);

  return {
    metadataBase: new URL(SITE.domain),
    title: { absolute: title },
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
  const media = regionServiceMedia(service.slug, region.slug)!;

  // 지역×서비스 조합 고유 콘텐츠 (거점 3곳 × 서비스 5종에만 존재).
  // 없으면 기존 조합 FAQ 로 대체 — 없는 지역 사정을 지어내지 않는다.
  const profile = regionServiceProfile(region.slug, service.slug);

  // FAQ 3개 — 지역 FAQ(지역 고유) + 서비스 FAQ + 세 번째.
  // 세 번째는 거점이면 조합 고유 FAQ, 그 외는 서비스 FAQ 2번째를 쓴다.
  // 이전에는 "{지역}에서 {서비스}, 어떻게 진행되나요?" 라는 지역명 치환 질문이
  // 335개 페이지에 똑같이 깔려 있었다.
  const combinedFaq = profile?.faq ?? service.faq2;
  const faqs = [region.faq, service.faq, combinedFaq];

  // 같은 지역의 다른 서비스 — 지역 페이지가 서비스 허브 하나로만 이어지던 고립을 푼다.
  // 거점 지역이면 이 링크들도 모두 색인 대상이라 지역 단위 클러스터가 만들어진다.
  const siblingServices = SERVICES.filter((s) => s.slug !== service.slug);

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
        serviceType={pillarServiceType(service.slug)}
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
              <a href={SITE.kakaoChannel} target="_blank" rel="noopener noreferrer" className="btn-outline" data-analytics="cta_region_kakao" style={{ background: '#FEE500', color: '#191919', borderColor: '#FEE500', fontWeight: 700 }}>
                💬 카카오톡 상담
              </a>
              <a href={`mailto:${SITE.email}`} className="btn-outline" data-analytics="cta_region_email">
                ✉️ 이메일 문의
              </a>
            </div>
          </div>

          {/* 지역×서비스 고유 미디어 — 외부 이미지 없이 페이지마다 다른 인라인 SVG 히어로 */}
          <figure className="region-hero" style={{ margin: '4px 0 8px' }}>
            <svg
              viewBox="0 0 1200 300"
              role="img"
              aria-label={media.alt}
              preserveAspectRatio="xMidYMid slice"
              style={{ width: '100%', height: 'auto', borderRadius: 14, display: 'block' }}
            >
              {/* 접근성 이름은 svg의 aria-label과 아래 figcaption으로 제공.
                  SVG <title> 요소는 네이버 크롤러가 문서 <title>로 중복 집계해
                  "title 요소 2개 이상" 오류를 유발하므로 사용하지 않음. */}
              <defs>
                <linearGradient id="regionHeroBg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={`hsl(${media.hue} 68% 40%)`} />
                  <stop offset="100%" stopColor={`hsl(${(media.hue + 38) % 360} 62% 26%)`} />
                </linearGradient>
              </defs>
              <rect width="1200" height="300" fill="url(#regionHeroBg)" />
              <circle cx="1040" cy="60" r="220" fill="rgba(255,255,255,0.07)" />
              <circle cx="160" cy="280" r="160" fill="rgba(255,255,255,0.05)" />
              <text x="64" y="150" fontSize="68" fontWeight="800" fill="#ffffff">
                {media.label}
              </text>
              <text x="66" y="206" fontSize="30" fill="rgba(255,255,255,0.88)">
                {media.sub}
              </text>
              <text x="66" y="252" fontSize="24" fill="rgba(255,255,255,0.78)">
                소스코드 전체 이관 · 직접 운영 교육 포함
              </text>
            </svg>
            <figcaption style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
              {media.alt}
            </figcaption>
          </figure>

          {/*
            H2 구성 원칙 — 지역명을 여러 H2에 반복해 넣지 않는다.
            H1 과 "지역 상황" H2 두 곳에만 두고, 나머지는 정보 구조(무엇을 만드나 /
            어떻게 진행하나 / 비대면 / FAQ / 관련 서비스)로 나눈다.
          */}

          {/* 어떤 것을 만들 수 있나 — 서비스 고유(모든 지역 공통이지만 서비스마다 다름) */}
          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>
              {service.buildQuestion}
            </h2>
            {/*
              조합 고유 콘텐츠가 있는 거점 지역만 전문(리드 + 유형별 설명)을 렌더한다.

              useCases 본문은 서비스마다는 다르지만 지역 간에는 같은 글이다. 이걸 70개 지역에
              전부 펼치면 "지역 고유 / 전체 본문" 비율이 오히려 떨어져 지역명만 바뀐 페이지처럼
              보인다(실측: 치환 문장 비율 61% → 75%). 그래서 거점 밖 지역은 같은 정보를
              목록으로만 제시해 정보는 유지하되 중복 분량을 늘리지 않는다.
            */}
            {profile ? (
              <>
                <p className="hub-intro">{profile.lead}</p>
                {service.useCases.map((u) => (
                  <div key={u.h} style={{ marginTop: 16 }}>
                    <h3 className="section-title" style={{ fontSize: '1.05rem', marginBottom: 6 }}>{u.h}</h3>
                    <p className="hub-intro">{u.body}</p>
                  </div>
                ))}
              </>
            ) : (
              <ul className="hub-intro" style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
                {service.useCases.map((u) => (
                  <li key={u.h}>{u.h}</li>
                ))}
              </ul>
            )}
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

          {/* 비대면 진행 — 거리에 따라 실제로 달라지는 내용만 다르게 쓴다 */}
          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>
              방문 없이 진행할 수 있나요?
            </h2>
            <p className="hub-intro">{remoteWorkNote(region.group, region.full)}</p>
          </div>

          {/* 지역 맥락 — 지역 고유 블록 (지역명이 들어가는 유일한 H2) */}
          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>
              {region.full} 지역 상황
            </h2>
            <p className="hub-intro">{region.access}</p>
            <p className="hub-intro" style={{ marginTop: 14 }}>{region.scene}</p>
          </div>

          {/* FAQ */}
          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>
              자주 묻는 질문
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

          {/*
            내부링크 — 같은 지역의 다른 서비스가 먼저다.
            "이 지역에서 무엇을 더 맡길 수 있나"가 방문자에게도, 크롤러에게도
            "다른 지역 같은 서비스"보다 자연스러운 다음 단계다.
          */}
          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>
              함께 보면 좋은 서비스
            </h2>
            <div className="link-grid">
              {siblingServices.map((s) => (
                <Link key={s.slug} href={`/${s.slug}/${region.slug}/`}>
                  {region.full} {s.short}
                </Link>
              ))}
              {service.relatedLinks.map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </div>
            <p className="hub-intro" style={{ marginTop: 18 }}>
              <Link href={service.hubHref} style={{ color: 'var(--green)' }}>
                ← {service.ko} 서비스 전체 보기
              </Link>
            </p>
          </div>

          {/* 인근·관련 지역 — 상권 그룹이 같은 몇 곳만. 전국 링크를 뿌리지 않는다. */}
          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>
              {hasRealNearby(region.slug) ? '인근 지역' : '다른 지역'} {service.short}
            </h2>
            <div className="link-grid">
              {siblings.map((r) => (
                <Link key={r.slug} href={`/${service.slug}/${r.slug}/`}>
                  {r.full} {service.short}
                </Link>
              ))}
            </div>
          </div>

          <div className="cta" style={{ marginTop: 24 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>{region.full}에서 시작해 볼까요?</h2>
            <p className="hub-intro">기획서가 없어도 아이디어와 핵심 기능만 있으면 상담을 시작할 수 있습니다.</p>
            <div className="cta-buttons">
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_region_call_bottom">
                무료 30분 상담
              </a>
              <a href={SITE.kakaoChannel} target="_blank" rel="noopener noreferrer" className="btn-outline" data-analytics="cta_region_kakao_bottom" style={{ background: '#FEE500', color: '#191919', borderColor: '#FEE500', fontWeight: 700 }}>
                💬 카카오톡 상담
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
