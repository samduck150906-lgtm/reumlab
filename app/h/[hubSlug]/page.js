import { getClusters, getHubBySlug, hubShouldIndex } from '../../../lib/data';
import { getHubContent } from '../../../lib/hub-content';
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
  // '총정리' 접미로 정보형 의도를 명확히 하고 중복 title을 방지한다.
  const title = `${hub.ko} 총정리 | 지역별 견적·업체 — 름랩 REUMLAB`;
  const description = `${hub.ko} 견적·외주 - 름랩 앱·웹 개발. 키워드별 상담 페이지 모음.`;
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
