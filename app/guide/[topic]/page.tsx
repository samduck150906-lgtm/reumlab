import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/seo';
import { GUIDES, getGuide, guideCanonical, guideDecision, sectionAnchor } from '@/lib/guides';
import { robotsFor } from '@/lib/index-quality';
import { GuideArticleJsonLd } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

type Props = { params: { topic: string } };

export function generateStaticParams() {
  return GUIDES.map((g) => ({ topic: g.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuide(params.topic);
  if (!guide) notFound();
  const canonical = guideCanonical(guide.slug);

  return {
    metadataBase: new URL(SITE.domain),
    title: { absolute: `${guide.title} | 름랩` },
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      url: canonical,
      siteName: SITE.name,
      title: guide.title,
      description: guide.description,
      publishedTime: guide.publishedAt,
      images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: guide.title }],
    },
    twitter: { card: 'summary_large_image', title: guide.title, description: guide.description.slice(0, 200), images: [SITE.defaultOgImage] },
    // 색인 품질 게이트: 80점↑만 index (사이트맵과 동일 판정)
    robots: robotsFor(guideDecision(guide.slug)!),
  };
}

export default function GuidePage({ params }: Props) {
  const guide = getGuide(params.topic);
  if (!guide) notFound();
  const canonical = guideCanonical(guide.slug);
  const crumbs = [
    { name: '홈', url: `${SITE.domain}/` },
    { name: '가이드', url: `${SITE.domain}/guide/` },
    { name: guide.h1.slice(0, 48), url: canonical },
  ];

  return (
    <>
      <GuideArticleJsonLd
        title={guide.title}
        description={guide.description}
        url={canonical}
        publishedAt={guide.publishedAt}
        updatedAt={guide.updatedAt}
        keywords={guide.keywords}
        faqs={guide.faqs}
        crumbs={crumbs}
      />
      <main>
        <article className="dynamic-page">
          <nav className="breadcrumb" aria-label="breadcrumb">
            <Link href="/">홈</Link>
            {' / '}
            <span>가이드</span>
            {' / '}
            <span>{guide.h1.slice(0, 24)}…</span>
          </nav>

          <div className="section-inner">
            <p className="section-tag">{guide.tag}</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)' }}>{guide.h1}</h1>
            {/*
              작성 주체와 날짜를 화면에도 보여준다. 구조화 데이터에는 있었지만 화면에는 없어서
              사람이 인용할 때 출처·시점을 확인할 방법이 없었다(§42·§43).
              날짜는 lib/guides.ts 의 실제 값이며 빌드 시각이 아니다.
            */}
            <p className="guide-byline">
              작성 {SITE.name}
              <span aria-hidden="true"> · </span>
              <time dateTime={guide.publishedAt}>{guide.publishedAt} 발행</time>
              {guide.updatedAt && guide.updatedAt !== guide.publishedAt && (
                <>
                  <span aria-hidden="true"> · </span>
                  <time dateTime={guide.updatedAt}>{guide.updatedAt} 수정</time>
                </>
              )}
            </p>
            <p className="hub-intro">{guide.intro}</p>

            {guide.summary && guide.summary.length > 0 && (
              /* 핵심 요약 — 본문을 읽지 않아도 결론을 가져갈 수 있게. 본문과 내용이 일치해야 한다. */
              <aside className="guide-summary" aria-label="핵심 요약">
                <h2 id="summary" style={{ scrollMarginTop: 80 }}>핵심 요약</h2>
                <ul>
                  {guide.summary.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </aside>
            )}

            {guide.sections.length >= 6 && (
              /* 목차 — 항목이 많은 가이드에만. 모든 글에 억지로 붙이지 않는다(§52). */
              <nav className="guide-toc" aria-label="목차">
                <h2 style={{ scrollMarginTop: 80 }}>목차</h2>
                <ol>
                  {guide.sections.map((sec, i) => (
                    <li key={sec.h}>
                      <a href={`#${sectionAnchor(sec, i)}`}>{sec.h}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {guide.sections.map((sec, i) => {
              const anchor = sectionAnchor(sec, i);
              return (
                <div key={sec.h} style={{ marginTop: 28 }}>
                  {/*
                    섹션마다 안정적인 앵커를 준다 — 외부에서 특정 항목만 인용·링크할 수 있게.
                    ID 는 lib/guides.ts 의 명시값을 쓰고, 없으면 순서 기반이라 문구를 다듬어도 안 깨진다.
                  */}
                  <h2 id={anchor} className="section-title" style={{ fontSize: '1.2rem', scrollMarginTop: 80 }}>
                    <a href={`#${anchor}`} className="guide-anchor" aria-label={`${sec.h} 섹션 링크`}>
                      {sec.h}
                    </a>
                  </h2>
                  <p className="hub-intro">{sec.body}</p>
                  {sec.items && sec.items.length > 0 && (
                    <ul className="guide-checklist">
                      {sec.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}

            {guide.table && (
              /* 표는 이미지가 아니라 실제 HTML table 이어야 검색엔진·AI·스크린리더가 읽는다.
                 모바일에서는 바깥 래퍼가 가로 스크롤을 흡수한다(본문이 밀리지 않게). */
              <div className="guide-table-wrap" style={{ marginTop: 32 }}>
                <table className="guide-table">
                  <caption>{guide.table.caption}</caption>
                  <thead>
                    <tr>
                      {guide.table.head.map((h) => (
                        <th key={h} scope="col">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {guide.table.rows.map((row) => (
                      <tr key={row[0]}>
                        <th scope="row">{row[0]}</th>
                        {row.slice(1).map((cell, ci) => (
                          <td key={`${row[0]}-${ci}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>자주 묻는 질문</h2>
            <div className="faq-grid">
              {guide.faqs.map((f) => (
                <div className="faq-item" key={f.q}>
                  <p className="faq-q">{f.q}</p>
                  <p className="faq-a">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>함께 보면 좋은 글</h2>
            <div className="link-grid">
              {guide.related.map((r) => (
                <Link key={r.href} href={r.href}>{r.label}</Link>
              ))}
            </div>
          </div>

          <div className="cta" style={{ marginTop: 24 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>견적·일정이 궁금하시면</h2>
            <p className="hub-intro">가격을 선공개합니다. 30분 무료 상담으로 범위와 견적을 안내해 드립니다.</p>
            <div className="cta-buttons">
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_guide_call">📞 무료 상담</a>
              {/* 카카오는 전화보다 문턱이 낮은 기존 채널이다. 새 채널을 만든 것이 아니라 이미 쓰는 링크를 노출한다. */}
              <a
                href={SITE.kakaoChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                data-analytics="cta_guide_kakao"
              >
                💬 카카오톡 상담
              </a>
              <Link href="/#pricing" className="btn-outline" data-analytics="cta_guide_pricing">패키지 요금 보기</Link>
            </div>
          </div>
        </article>
      </main>
      <BusinessFooter topExtra={<Link href="/">← 메인으로</Link>} />
    </>
  );
}
