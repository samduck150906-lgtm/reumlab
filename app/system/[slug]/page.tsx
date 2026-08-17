import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/seo';
import {
  SYSTEMS,
  getSystem,
  systemCanonical,
  systemTitle,
  systemDescription,
  systemDecision,
} from '@/lib/systems';
import { robotsFor } from '@/lib/index-quality';
import { IndustryServiceJsonLd } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';
import { ctaPrimary, operatorNote } from '@/lib/voice';
import { pickSiblings } from '@/lib/sibling-picker';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return SYSTEMS.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getSystem(params.slug);
  if (!s) notFound();

  const title = systemTitle(s);
  const description = systemDescription(s);
  const canonical = systemCanonical(s.slug);

  return {
    metadataBase: new URL(SITE.domain),
    title: { absolute: title },
    description,
    keywords: [s.primary, ...s.secondary],
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
    robots: robotsFor(systemDecision(s.slug)!),
  };
}

export default function SystemPage({ params }: Props) {
  const s = getSystem(params.slug);
  if (!s) notFound();

  const canonical = systemCanonical(s.slug);
  const crumbs = [
    { name: '홈', url: `${SITE.domain}/` },
    { name: '시스템·기능별 개발', url: SITE.domain + '/system/' },
    { name: s.name, url: canonical },
  ];
  const others = pickSiblings(SYSTEMS, s.slug, 6);
  const seed = `system-${s.slug}`;

  return (
    <>
      <IndustryServiceJsonLd
        name={s.primary}
        serviceType="소프트웨어 시스템 개발"
        description={`${s.name} — 기능 구성, 사용자 유형, 관리자 기능, 기술 구조, 예상 비용·기간.`}
        url={canonical}
        faqs={s.faqs}
        crumbs={crumbs}
      />
      <main>
        <article className="dynamic-page">
          <nav className="breadcrumb" aria-label="breadcrumb">
            <Link href="/">홈</Link>
            {' / '}
            <Link href="/system/">시스템·기능별 개발</Link>
            {' / '}
            <span>{s.name}</span>
          </nav>

          {/* 1. Hero — 무엇을·얼마에·얼마나 걸려서 */}
          <div className="section-inner">
            <p className="section-tag">기능·시스템 × 개발</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)' }}>
              {s.name} 개발
            </h1>
            <p className="hub-intro">{s.lead}</p>

            <div className="link-grid" style={{ gridTemplateColumns: '1fr', gap: 12, marginTop: 16 }}>
              <div className="faq-item">
                <p className="faq-q" style={{ color: 'var(--green)' }}>예상 비용</p>
                <p className="faq-a">{s.costLine}</p>
              </div>
              <div className="faq-item">
                <p className="faq-q" style={{ color: 'var(--green)' }}>예상 기간</p>
                <p className="faq-a">{s.durationLine}</p>
              </div>
            </div>

            <p className="hub-intro" style={{ marginTop: 12, fontSize: '0.95rem', color: 'var(--muted, #667085)', borderLeft: '3px solid var(--green)', paddingLeft: 12 }}>
              {operatorNote(seed)}
            </p>

            <div className="cta-buttons" style={{ marginTop: 24 }}>
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_system_call">
                📞 {SITE.phone} · 만들 수 있는지부터 확인
              </a>
              <a href={`mailto:${SITE.email}`} className="btn-outline" data-analytics="cta_system_email">
                ✉️ 기능 목록 보내고 견적 받기
              </a>
            </div>
          </div>

          {/* 2. 실제 필요한 기능 */}
          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>{s.name}에 실제로 들어가는 기능</h2>
            <ul className="hub-intro" style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
              {s.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>

          {/* 3. 사용자 유형 */}
          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>누가 어떤 화면을 쓰나</h2>
            <div className="link-grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
              {s.userTypes.map((u) => (
                <div key={u.who} className="faq-item">
                  <p className="faq-q" style={{ color: 'var(--green)' }}>{u.who}</p>
                  <p className="faq-a">{u.does}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. 관리자 기능 */}
          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>관리자에서 할 수 있는 것</h2>
            <ul className="hub-intro" style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
              {s.adminFeatures.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>

          {/* 5. 기술 구조 */}
          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>추천 기술 구조와 그 이유</h2>
            <p className="hub-intro">{s.stack}</p>
          </div>

          {/* 중간 CTA — 기능 기준 견적 (하단 CTA와 문구가 겹치지 않게 한다) */}
          <div className="section-inner" style={{ paddingTop: 8 }}>
            <div className="faq-item" style={{ borderLeft: '3px solid var(--green)' }}>
              <p className="faq-q">위 기능 기준으로 우리 예산에 맞을까요?</p>
              <p className="faq-a" style={{ marginBottom: 12 }}>
                필요한 기능만 골라 알려 주시면 그 범위 기준으로 예상 견적을 먼저 안내해 드립니다. 기획서는 없어도 됩니다.
              </p>
              <div className="cta-buttons">
                <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_system_mid">
                  이 기능 기준 예상 견적 확인
                </a>
              </div>
            </div>
          </div>

          {/* 6. 개발 과정 */}
          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>개발은 이 순서로 진행합니다</h2>
            <div className="link-grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
              {s.process.map((p) => (
                <div key={p.step} className="faq-item">
                  <p className="faq-q" style={{ color: 'var(--green)' }}>{p.step}</p>
                  <p className="faq-a">{p.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 7. 비용이 올라가는 조건 */}
          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>이런 조건이면 비용이 올라갑니다</h2>
            <ul className="hub-intro" style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
              {s.costDrivers.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>

          {/* 8. MVP 범위 */}
          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>MVP로 시작한다면 어디까지</h2>
            <p className="hub-intro">{s.mvpScope}</p>
          </div>

          {/* 9. 구현 가능한 구성 — 실제 고객사·실적을 주장하지 않는다 */}
          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>이런 구성으로 만들 수 있습니다</h2>
            <ul className="hub-intro" style={{ marginTop: 8, paddingLeft: 18, lineHeight: 2 }}>
              {s.buildable.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <p className="hub-intro" style={{ marginTop: 8, fontSize: '0.92rem', opacity: 0.85 }}>
              * 위 목록은 구현 가능한 기능 구성이며 특정 고객사의 실적을 뜻하지 않습니다. 실제 진행한 작업은{' '}
              <Link href="/portfolio/">개발 사례</Link>에서 확인하실 수 있습니다.
            </p>
          </div>

          {/* 10. FAQ */}
          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>{s.name} 자주 묻는 질문</h2>
            <div className="faq-grid">
              {s.faqs.map((f) => (
                <div className="faq-item" key={f.q}>
                  <p className="faq-q">{f.q}</p>
                  <p className="faq-a">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 11. 문맥 앵커 내부링크 */}
          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>이 시스템과 함께 검토하는 것들</h2>
            <div className="link-grid">
              {s.related.map((r) => (
                <Link key={r.href} href={r.href}>{r.label}</Link>
              ))}
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>다른 시스템 개발</h2>
            <div className="link-grid">
              {others.map((x) => (
                <Link key={x.slug} href={`/system/${x.slug}/`}>{x.primary}</Link>
              ))}
              <Link href="/system/">시스템·기능별 개발 전체 보기</Link>
            </div>
          </div>

          {/* 12. 하단 CTA */}
          <div className="cta" style={{ marginTop: 24 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>프로젝트 상담하기</h2>
            <p className="hub-intro">
              지금 쓰는 방식(엑셀·카톡·기존 프로그램)과 가장 불편한 지점을 알려 주시면, 어디부터 시스템으로 옮기는 게 맞는지부터 말씀드립니다.
            </p>
            <div className="cta-buttons">
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_system_call_bottom">
                {ctaPrimary(seed)}
              </a>
              <Link href="/#pricing" className="btn-outline" data-analytics="cta_system_pricing">
                패키지 요금 보기
              </Link>
            </div>
          </div>
        </article>
      </main>
      <BusinessFooter topExtra={<Link href="/system/">← 시스템·기능별 개발로</Link>} />
    </>
  );
}
