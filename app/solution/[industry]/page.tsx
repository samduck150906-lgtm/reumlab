import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/seo';
import { getIndustry } from '@/lib/industries';
import { SOLUTIONS, getSolution, solutionCanonical, solutionDecision, solutionTitleName, solutionTitle, solutionDescription } from '@/lib/solution';
import { systemsForIndustry } from '@/lib/systems';
import { hasCost } from '@/lib/cost';
import { robotsFor } from '@/lib/index-quality';
import { IndustryServiceJsonLd } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';
import { ctaPrimary, operatorNote } from '@/lib/voice';
import { pickSiblings } from '@/lib/sibling-picker';

type Props = { params: { industry: string } };

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ industry: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getSolution(params.industry);
  if (!s) notFound();

  const name = solutionTitleName(s.slug);
  // 색인 게이트(solutionDecision)와 같은 문자열을 쓴다 — lib/solution.ts 단일 출처.
  const title = solutionTitle(s.slug);
  const description = solutionDescription(s.slug);
  const canonical = solutionCanonical(s.slug);
  const ind = getIndustry(s.slug);

  return {
    metadataBase: new URL(SITE.domain),
    title: { absolute: title },
    description,
    keywords: [name, `${ind?.ko ?? ''} 시스템 구축`, `${ind?.ko ?? ''} 디지털 전환`, `${ind?.ko ?? ''} 관리 시스템`, '소스코드 이관'],
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
    robots: robotsFor(solutionDecision(s.slug)!),
  };
}

export default function SolutionPage({ params }: Props) {
  const s = getSolution(params.industry);
  if (!s) notFound();

  const ind = getIndustry(s.slug);
  const name = solutionTitleName(s.slug);
  const canonical = solutionCanonical(s.slug);
  const crumbs = [
    { name: '홈', url: `${SITE.domain}/` },
    { name: '업종별 앱개발', url: `${SITE.domain}/app-development/` },
    { name: `${name} 구축`, url: canonical },
  ];
  const others = pickSiblings(SOLUTIONS, s.slug, 6);
  // 기능/시스템 축으로 넘어가는 문맥 앵커 — /system 페이지가 고아로 뜨지 않게 한다.
  const relatedSystems = systemsForIndustry(s.slug);

  return (
    <>
      <IndustryServiceJsonLd
        name={`${name} 구축`}
        serviceType="업무 시스템 구축"
        description={`${name} — 기능 모듈·기술 스택·연동·단계별 도입 로드맵. 소스코드 이관 포함.`}
        url={canonical}
        faqs={s.faqs}
        crumbs={crumbs}
      />
      <main>
        <article className="dynamic-page">
          <nav className="breadcrumb" aria-label="breadcrumb">
            <Link href="/">홈</Link>
            {' / '}
            <Link href="/app-development">앱개발</Link>
            {' / '}
            <span>{name} 구축</span>
          </nav>

          <div className="section-inner">
            <p className="section-tag">업종 × 솔루션·시스템 구축</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)' }}>
              {name} 구축
            </h1>
            <p className="hub-intro">{s.lead}</p>
            <p className="hub-intro" style={{ marginTop: 12, fontSize: '0.95rem', color: 'var(--muted, #667085)', borderLeft: '3px solid var(--green)', paddingLeft: 12 }}>
              {operatorNote('sol-' + s.slug)}
            </p>

            <div className="cta-buttons" style={{ marginTop: 24 }}>
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_solution_call">
                📞 {SITE.phone} 구축 상담
              </a>
              <a href={`mailto:${SITE.email}`} className="btn-outline" data-analytics="cta_solution_email">
                ✉️ 이메일 문의
              </a>
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>기능 모듈 구성</h2>
            <ul className="hub-intro" style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
              {s.modules.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>기술 스택·구성</h2>
            <p className="hub-intro">{s.stack}</p>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>연동 포인트</h2>
            <ul className="hub-intro" style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
              {s.integrations.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>

          {s.why && (
            <div className="section-inner" style={{ paddingTop: 8 }}>
              <h2 className="section-title" style={{ fontSize: '1.3rem' }}>왜 단계적으로 구축하나</h2>
              <p className="hub-intro">{s.why}</p>
            </div>
          )}

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>단계별 도입 로드맵</h2>
            <div className="link-grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
              {s.roadmap.map((p) => (
                <div key={p.phase} className="faq-item">
                  <p className="faq-q" style={{ color: 'var(--green)' }}>{p.phase}</p>
                  <p className="faq-a">{p.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>{ind?.ko ?? ''} 솔루션 구축 자주 묻는 질문</h2>
            <div className="faq-grid">
              {s.faqs.map((f) => (
                <div className="faq-item" key={f.q}>
                  <p className="faq-q">{f.q}</p>
                  <p className="faq-a">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>{ind?.ko ?? ''} — 함께 보기</h2>
            <div className="link-grid">
              {ind && <Link href={`/app/${ind.slug}/`}>{ind.keyword} — 핵심 기능·시나리오</Link>}
              {hasCost(s.slug) && <Link href={`/cost/${s.slug}/`}>{ind?.ko ?? ''} 앱 개발 비용·견적</Link>}
            </div>
          </div>

          {relatedSystems.length > 0 && (
            <div className="section-inner" style={{ paddingTop: 8 }}>
              <h2 className="section-title" style={{ fontSize: '1.15rem' }}>이 업종에서 자주 함께 찾는 기능</h2>
              <div className="link-grid">
                {relatedSystems.map((sys) => (
                  <Link key={sys.slug} href={`/system/${sys.slug}/`}>{sys.primary}</Link>
                ))}
              </div>
            </div>
          )}

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>함께 보면 좋은 서비스</h2>
            <div className="link-grid">
              <Link href="/admin-page-development/">관리자 페이지 개발</Link>
              <Link href="/app-agency/">앱개발 업체 — 견적·업체 선택 기준</Link>
              <Link href="/source-handover/">소스코드 이관</Link>
              {(params.industry === 'academy' || params.industry.endsWith('-academy')) && (
                <Link href="/academy-shopping-mall/">학원 쇼핑몰 제작 — 수강신청·결제</Link>
              )}
              {params.industry === 'realestate' && (
                <Link href="/realestate-landing/">부동산 랜딩페이지 — 문의 전환형</Link>
              )}
              <Link href="/solution/">업종별 솔루션 구축 전체 보기</Link>
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>다른 업종 솔루션</h2>
            <div className="link-grid">
              {others.map((x) => (
                <Link key={x.slug} href={`/solution/${x.slug}/`}>{solutionTitleName(x.slug)} 구축</Link>
              ))}
            </div>
          </div>

          <div className="cta" style={{ marginTop: 24 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>필요한 모듈만, 단계적으로 구축하세요</h2>
            <p className="hub-intro">전체를 한 번에 만들지 않아도 됩니다. 꼭 필요한 모듈부터 1차로 구축하고 검증 후 확장합니다.</p>
            <div className="cta-buttons">
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_solution_call_bottom">
                {ctaPrimary('sol-' + s.slug)}
              </a>
              <Link href="/#pricing" className="btn-outline" data-analytics="cta_solution_pricing">
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
