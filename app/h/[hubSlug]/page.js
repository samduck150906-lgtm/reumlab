import { getClusters, getHubBySlug, hubShouldIndex } from '../../../lib/data';
import { getHubContent } from '../../../lib/hub-content';
import HubPage from '../../../components/HubPage';
import { LandingServiceJsonLd, FAQPageJsonLd } from '../../../components/JsonLd';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://reumlab.com';

export async function generateStaticParams() {
  const clusters = getClusters();
  return Object.keys(clusters).map((hubSlug) => ({ hubSlug }));
}

// 중복 허브 → 대표 허브로 canonical 통합 (예: mobile-app 은 app-dev 와 동일)
const DUP_HUB_CANONICAL = { 'mobile-app': 'app-dev' };

export async function generateMetadata({ params }) {
  const hub = getHubBySlug(params.hubSlug);
  if (!hub) return { title: '름랩 REUMLAB' };
  const title = `${hub.ko} | 름랩 REUMLAB`;
  const description = `${hub.ko} 견적·외주 - 름랩 앱·웹 개발. 키워드별 상담 페이지 모음.`;
  const url = `${BASE}/h/${params.hubSlug}/`;
  const canonicalSlug = DUP_HUB_CANONICAL[params.hubSlug] || params.hubSlug;
  const canonical = `${BASE}/h/${canonicalSlug}/`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
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
  const url = `${BASE}/h/${params.hubSlug}/`;
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
