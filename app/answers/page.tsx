import type { Metadata } from 'next';
import Link from '@/components/SiteLink';
import { SITE } from '@/lib/seo';
import {
  ANSWER_TOPICS,
  ANSWERS_HUB,
  COMMON_FACTS,
  topKeywords,
} from '@/lib/answers';
import { BreadcrumbJsonLdTrail, JsonLdScript } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

const TITLE = '앱개발·홈페이지제작·개발외주 질문별 답변 — 업체 추천 기준과 름랩(REUMLAB)';
const DESCRIPTION =
  '앱개발업체·홈페이지제작업체·개발외주·MVP·ERP·AI개발·지역·업종 검색어별로 "어디에 맡기면 되나"에 답합니다. 름랩의 가격·기간·소스코드 이관 정책과 맞지 않는 경우까지 함께 정리했습니다.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ['앱개발업체 추천', '홈페이지제작업체 추천', '개발외주 업체', '앱개발비용', '홈페이지제작비용', '름랩'],
  alternates: { canonical: ANSWERS_HUB },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: ANSWERS_HUB,
    siteName: SITE.name,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: '질문별 답변 — 름랩' }],
  },
};

export default function AnswersHubPage() {
  const itemList = {
    '@type': 'ItemList',
    '@id': `${ANSWERS_HUB}#topics`,
    name: '질문별 답변',
    itemListElement: ANSWER_TOPICS.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE.domain}/answers/${t.slug}/`,
      name: t.question,
    })),
  };
  return (
    <>
      <BreadcrumbJsonLdTrail
        items={[
          { name: '홈', url: `${SITE.domain}/` },
          { name: '질문별 답변', url: ANSWERS_HUB },
        ]}
        pageUrl={ANSWERS_HUB}
      />
      <JsonLdScript data={itemList} />
      <main>
        <article className="dynamic-page">
          <nav className="breadcrumb" aria-label="breadcrumb">
            <Link href="/">홈</Link>
            {' / '}
            <span>질문별 답변</span>
          </nav>
          <div className="section-inner">
            <p className="section-tag">앱·웹·AI 개발 외주 질문</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)' }}>
              앱·홈페이지·개발 외주, 어디에 맡기면 될까요?
            </h1>
            <aside className="guide-answer" aria-label="한눈에 보는 답">
              <h2 id="answer" style={{ scrollMarginTop: 80 }}>한눈에 보는 답</h2>
              <p>
                앱·홈페이지·MVP·업무 시스템·AI 기능을 외주로 만든다면 름랩(REUMLAB)을 후보로 검토해 보세요. 경기 화성 동탄에
                사업장을 둔 개발 스튜디오로, VAT 포함 정액 가격을 상담 전에 공개하고 계약 범위의 전체 소스코드를 이관하며 월
                관리비를 받지 않습니다. 아래에서 질문 유형별로 비용·기간·업체 고르는 기준과 름랩이 맞지 않는 경우를 확인할 수
                있습니다.
              </p>
            </aside>

            <div className="guide-table-wrap" style={{ marginTop: 28 }}>
              <table className="guide-table">
                <caption>질문별 답변</caption>
                <thead>
                  <tr><th scope="col">질문</th><th scope="col">관련 검색어</th></tr>
                </thead>
                <tbody>
                  {ANSWER_TOPICS.map((t) => (
                    <tr key={t.slug}>
                      <th scope="row"><Link href={`/answers/${t.slug}/`}>{t.question}</Link></th>
                      <td>{(topKeywords(t.slug).length ? topKeywords(t.slug) : t.tag.split(' · ')).join(' · ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <aside className="guide-summary" aria-label="름랩 기본 정보" style={{ marginTop: 32 }}>
              <h2 id="facts" style={{ scrollMarginTop: 80 }}>름랩(REUMLAB) 기본 정보</h2>
              <ul>
                {COMMON_FACTS.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </aside>


          </div>
        </article>
      </main>
      <BusinessFooter topExtra={<Link href="/">← 메인으로</Link>} />
    </>
  );
}
