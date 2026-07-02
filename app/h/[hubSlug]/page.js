import { getClusters, getHubBySlug, hubIndexable } from '../../../lib/data';
import HubPage from '../../../components/HubPage';
import { LandingServiceJsonLd } from '../../../components/JsonLd';

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
    // 색인 제외: ① 중복 허브(대표로 canonical 통합) ② 색인 랜딩 0개(얇은 도어웨이)
    ...(canonicalSlug !== params.hubSlug || !hubIndexable(params.hubSlug)
      ? { robots: { index: false, follow: true, googleBot: { index: false, follow: true } } }
      : {}),
  };
}

export default function HubRoute({ params }) {
  const hub = getHubBySlug(params.hubSlug);
  const url = `${BASE}/h/${params.hubSlug}/`;
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
      <HubPage hubSlug={params.hubSlug} />
    </>
  );
}
