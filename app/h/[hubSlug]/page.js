import { getClusters, getHubBySlug, hubShouldIndex } from '../../../lib/data';
import { getHubContent } from '../../../lib/hub-content';
import { clampTitle, composeDescription, pickVariant } from '../../../lib/search-intent';
import HubPage from '../../../components/HubPage';
import { LandingServiceJsonLd, FAQPageJsonLd } from '../../../components/JsonLd';
import { SITE } from '../../../lib/seo';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://reumlab.com';

export async function generateStaticParams() {
  const clusters = getClusters();
  return Object.keys(clusters).map((hubSlug) => ({ hubSlug }));
}

// 중복 허브 → 대표 허브로 canonical 통합 (예: mobile-app 은 app-dev 와 동일)
const DUP_HUB_CANONICAL = { 'mobile-app': 'app-dev' };

export async function generateMetadata({ params }) {
  const hub = getHubBySlug(params.hubSlug);
  if (!hub) return { title: { absolute: '름랩 REUMLAB' } };
  // 허브는 키워드 모음(집합) 페이지 → 개별 랜딩(/l/*)과 제목이 겹치지 않도록
  // 정보형 의도를 제목에 명시하고 중복 title을 방지한다.
  // description 은 이 허브에 고유 본문(HUB_CONTENT)이 있으면 그 도입부를 쓴다.
  // 예전 문구("… 견적·외주 - 름랩 앱·웹 개발. 키워드별 상담 페이지 모음.")는 37자짜리
  // 상수라 검색결과에서 이 허브가 무엇을 모아 둔 곳인지 전혀 알려 주지 못했다.
  const hubTitles = [
    `${hub.ko} 총정리 | 비용·업체 선택 기준 한 번에 | 름랩`,
    `${hub.ko} | 무엇부터 정해야 하나·얼마나 드나 | 름랩`,
    `${hub.ko} 가이드 | 기능 범위별 견적과 진행 순서 | 름랩`,
  ];
  const title = clampTitle(pickVariant(hubTitles, params.hubSlug, 'hub-title'));
  const hubBody = getHubContent(params.hubSlug);
  const description = composeDescription(
    hubBody
      ? [hubBody.intro]
      : [
          `${hub.ko}을(를) 어떤 범위로, 얼마에 만들 수 있는지 정리했습니다.`,
          '기능별 견적 기준과 진행 순서, 관련 상담 페이지를 한곳에 모았습니다.',
          'VAT 포함 정액 · 소스코드 이관 · 월 관리비 없음.',
        ],
  );
  const url = `${BASE}/h/${params.hubSlug}/`;
  const canonicalSlug = DUP_HUB_CANONICAL[params.hubSlug] || params.hubSlug;
  const canonical = `${BASE}/h/${canonicalSlug}/`;
  return {
    title: { absolute: title },
    description,
    // ⚠️ 페이지 openGraph 는 루트 layout 의 것을 대체한다 — type·locale·siteName 을 다시 적지 않으면
    //    이 라우트에서만 사라진다(실제로 허브 38개에서 빠져 있었다).
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      siteName: SITE.name,
      title,
      description,
      // og:url 은 canonical 과 같아야 한다. 중복 허브(mobile-app)는 canonical 이
      // 대표 허브를 가리키므로 og:url 도 같은 URL 을 쓴다(이전엔 자기 자신을 가리켜 신호가 갈렸다).
      url: canonical,
      images: ['/og-default.png'],
    },
    alternates: { canonical },
    // 색인 제외: ① 중복 허브(대표로 canonical 통합) ② 색인 랜딩 0개 도어웨이 ③ 앱 pSEO 대체 service 허브
    ...(canonicalSlug !== params.hubSlug || !hubShouldIndex(params.hubSlug)
      ? { robots: { index: false, follow: true, googleBot: { index: false, follow: true } } }
      : {}),
  };
}

export default function HubRoute({ params }) {
  const hub = getHubBySlug(params.hubSlug);
  // 구조화 데이터 URL은 metadata의 canonical과 같아야 한다.
  // 중복 허브(mobile-app)는 canonical이 대표 허브를 가리키므로 스키마도 같은 URL을 쓴다.
  const canonicalSlug = DUP_HUB_CANONICAL[params.hubSlug] || params.hubSlug;
  const url = `${BASE}/h/${canonicalSlug}/`;
  // 색인되는 허브에만 고유 본문/FAQ가 있으므로, 그 경우에만 FAQPage 스키마를 낸다
  const content = hubShouldIndex(params.hubSlug) ? getHubContent(params.hubSlug) : undefined;
  return (
    <>
      {hub ? (
        <LandingServiceJsonLd
          name={`${hub.ko} | 름랩 REUMLAB`}
          description={`${hub.ko} 견적·외주 - 름랩 앱·웹 개발 전문. 키워드별 상담 페이지 모음.`}
          url={url}
          crumbs={[
            { name: '홈', url: `${BASE}/` },
            { name: hub.ko, url },
          ]}
        />
      ) : null}
      {content ? <FAQPageJsonLd items={content.faqs} /> : null}
      <HubPage hubSlug={params.hubSlug} />
    </>
  );
}
