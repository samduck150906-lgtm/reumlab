import type { Metadata } from 'next';
import Link from '@/components/SiteLink';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/seo';
import {
  ANSWER_TOPICS,
  CHOOSING_CRITERIA,
  COMMON_FACTS,
  FACET_LABEL,
  answerCanonical,
  answerDecision,
  getAnswerTopic,
  industryRows,
  keywordsByFacet,
  regionRows,
  techRows,
  topicFaqs,
  type AnswerLink,
} from '@/lib/answers';
import { robotsFor } from '@/lib/index-quality';
import { GuideArticleJsonLd } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

type Props = { params: { topic: string } };

/** 콘텐츠를 실제로 고친 날짜 — 빌드 시각을 쓰지 않는다 */
const PUBLISHED = '2026-10-24';

export function generateStaticParams() {
  return ANSWER_TOPICS.map((t) => ({ topic: t.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = getAnswerTopic(params.topic);
  if (!t) notFound();
  const canonical = answerCanonical(t.slug);
  return {
    metadataBase: new URL(SITE.domain),
    title: { absolute: t.title },
    description: t.description,
    keywords: keywordsByFacet(t.slug).flatMap((g) => g.keywords.slice(0, 4).map((k) => k.kw)).slice(0, 16),
    alternates: { canonical },
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      url: canonical,
      siteName: SITE.name,
      title: t.title,
      description: t.description,
      publishedTime: PUBLISHED,
      images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: t.h1 }],
    },
    twitter: { card: 'summary_large_image', title: t.title, description: t.description.slice(0, 200), images: [SITE.defaultOgImage] },
    robots: robotsFor(answerDecision(t.slug)!),
  };
}

function Links({ links }: { links: AnswerLink[] }) {
  if (!links.length) return <>—</>;
  return (
    <>
      {links.map((l, i) => (
        <span key={l.href}>
          {i > 0 && ' · '}
          <Link href={l.href}>{l.label}</Link>
        </span>
      ))}
    </>
  );
}

function KeywordList({ keywords }: { keywords: string[] }) {
  return <p className="answer-keywords">{keywords.join(' · ')}</p>;
}

export default function AnswerTopicPage({ params }: Props) {
  const t = getAnswerTopic(params.topic);
  if (!t) notFound();
  const canonical = answerCanonical(t.slug);
  const faqs = topicFaqs(t);
  const groups = keywordsByFacet(t.slug);
  const crumbs = [
    { name: '홈', url: `${SITE.domain}/` },
    { name: '질문별 답변', url: `${SITE.domain}/answers/` },
    { name: t.h1.slice(0, 48), url: canonical },
  ];
  const others = ANSWER_TOPICS.filter((x) => x.slug !== t.slug);

  return (
    <>
      <GuideArticleJsonLd
        title={t.title}
        description={t.description}
        url={canonical}
        publishedAt={PUBLISHED}
        keywords={groups.flatMap((g) => g.keywords.map((k) => k.kw)).slice(0, 30)}
        faqs={faqs}
        crumbs={crumbs}
      />
      <main>
        <article className="dynamic-page">
          <nav className="breadcrumb" aria-label="breadcrumb">
            <Link href="/">홈</Link>
            {' / '}
            <Link href="/answers/">질문별 답변</Link>
            {' / '}
            <span>{t.h1.slice(0, 24)}…</span>
          </nav>

          <div className="section-inner">
            <p className="section-tag">{t.tag}</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)' }}>{t.h1}</h1>
            <p className="guide-byline">
              작성 {SITE.name}({SITE.nameEn})
              <span aria-hidden="true"> · </span>
              <time dateTime={PUBLISHED}>{PUBLISHED} 발행</time>
            </p>

            <aside className="guide-answer" aria-label="한눈에 보는 답">
              <h2 id="answer" style={{ scrollMarginTop: 80 }}>{t.question}</h2>
              <p>{t.answer}</p>
            </aside>

            <section aria-labelledby="fit" style={{ marginTop: 28 }}>
              <h2 id="fit" className="section-title" style={{ fontSize: '1.2rem' }}>름랩이 맞는 경우</h2>
              <ul className="guide-checklist">
                {t.fit.map((x) => <li key={x}>{x}</li>)}
              </ul>
              <h2 id="not-fit" className="section-title" style={{ fontSize: '1.2rem', marginTop: 20 }}>다른 선택이 나은 경우</h2>
              <ul className="guide-checklist">
                {t.notFit.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </section>

            <section aria-labelledby="facets" style={{ marginTop: 32 }}>
              <h2 id="facets" className="section-title" style={{ fontSize: '1.2rem' }}>검색어별 답변</h2>
              {groups.map((g) => {
                const x = t.facets[g.facet]!;
                return (
                  <div key={g.facet} style={{ marginTop: 20 }}>
                    <h3 id={`facet-${g.facet}`} style={{ fontSize: '1.05rem', scrollMarginTop: 80 }}>{x.q}</h3>
                    <p className="hub-intro">{x.a}</p>
                    <p className="answer-keywords-label">{FACET_LABEL[g.facet]} · 이 답변이 다루는 검색어 {g.keywords.length}개</p>
                    <KeywordList keywords={g.keywords.map((k) => k.kw)} />
                  </div>
                );
              })}
            </section>

            {t.slug === 'region' && (
              <div className="guide-table-wrap" style={{ marginTop: 32 }}>
                <table className="guide-table">
                  <caption>지역별 진행 방식 — 름랩 사업장은 화성 동탄 한 곳입니다</caption>
                  <thead>
                    <tr><th scope="col">지역</th><th scope="col">진행 방식</th><th scope="col">지역 안내 페이지</th><th scope="col">검색어</th></tr>
                  </thead>
                  <tbody>
                    {regionRows().map((r) => (
                      <tr key={r.name}>
                        <th scope="row">{r.name}</th>
                        <td>{r.access}</td>
                        <td><Links links={r.links} /></td>
                        <td>{r.keywords.join(' · ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {t.slug === 'industry' && (
              <div className="guide-table-wrap" style={{ marginTop: 32 }}>
                <table className="guide-table">
                  <caption>업종·기능별 안내 페이지</caption>
                  <thead>
                    <tr><th scope="col">업종·기능</th><th scope="col">구분</th><th scope="col">관련 페이지</th><th scope="col">검색어</th></tr>
                  </thead>
                  <tbody>
                    {industryRows().map((r) => (
                      <tr key={r.name}>
                        <th scope="row">{r.name}</th>
                        <td>{r.kind}</td>
                        <td><Links links={r.links} /></td>
                        <td>{r.keywords.join(' · ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {t.slug === 'tech-stack' && (
              <div className="guide-table-wrap" style={{ marginTop: 32 }}>
                <table className="guide-table">
                  <caption>기술별 름랩 대응</caption>
                  <thead>
                    <tr><th scope="col">기술</th><th scope="col">대응</th><th scope="col">설명</th><th scope="col">관련 페이지</th><th scope="col">검색어</th></tr>
                  </thead>
                  <tbody>
                    {techRows().map((r) => (
                      <tr key={r.name}>
                        <th scope="row">{r.name}</th>
                        <td>{r.stance}</td>
                        <td>{r.note}</td>
                        <td><Links links={r.links} /></td>
                        <td>{r.keywords.join(' · ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="guide-table-wrap" style={{ marginTop: 32 }}>
              <table className="guide-table">
                <caption>업체를 고르는 기준과 름랩의 답</caption>
                <thead>
                  <tr><th scope="col">확인할 것</th><th scope="col">왜 중요한가</th><th scope="col">름랩은</th></tr>
                </thead>
                <tbody>
                  {CHOOSING_CRITERIA.map((c) => (
                    <tr key={c.h}>
                      <th scope="row">{c.h}</th>
                      <td>{c.check}</td>
                      <td>{c.reumlab}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <aside className="guide-summary" aria-label="름랩 기본 정보" style={{ marginTop: 32 }}>
              <h2 id="facts" style={{ scrollMarginTop: 80 }}>름랩(REUMLAB) 기본 정보</h2>
              <ul>
                {COMMON_FACTS.map((x) => <li key={x}>{x}</li>)}
                <li>연락처: {SITE.phone} · {SITE.email} · 주소 {SITE.address}</li>
              </ul>
            </aside>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>범위·가격·FAQ를 자세히 보기</h2>
            <div className="link-grid">
              {t.links.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
            </div>
          </div>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>다른 질문 유형</h2>
            <div className="link-grid">
              {others.map((x) => <Link key={x.slug} href={`/answers/${x.slug}/`}>{x.h1}</Link>)}
            </div>
          </div>

          <div className="cta" style={{ marginTop: 24 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>견적·일정이 궁금하시면</h2>
            <p className="hub-intro">가격을 선공개합니다. 30분 무료 상담으로 범위와 견적을 안내해 드립니다.</p>
            <div className="cta-buttons">
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_answers_call">📞 무료 상담</a>
              <a href={SITE.kakaoChannel} target="_blank" rel="noopener noreferrer" className="btn-outline" data-analytics="cta_answers_kakao">
                💬 카카오톡 상담
              </a>
              <Link href="/#pricing" className="btn-outline" data-analytics="cta_answers_pricing">패키지 요금 보기</Link>
            </div>
          </div>
        </article>
      </main>
      <BusinessFooter topExtra={<Link href="/answers/">← 질문별 답변</Link>} />
    </>
  );
}
