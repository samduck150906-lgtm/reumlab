import { getLandings, getLandingBySlug, getHubBySlug, landingIndexable, landingRedirectTarget } from '../../../lib/data';
import LandingPage from '../../../components/LandingPage';
import { LandingServiceJsonLd } from '../../../components/JsonLd';
import { SITE } from '../../../lib/seo';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://reumlab.com';

export async function generateStaticParams() {
  const landings = getLandings();
  // 앱 pSEO로 301 통합되는 랜딩은 정적 생성 제외 → out/에 파일이 없어 _redirects 301이 그대로 발동
  return landings.filter((l) => !landingRedirectTarget(l.slug)).map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }) {
  const landing = getLandingBySlug(params.slug);
  if (!landing) return { title: { absolute: '름랩 REUMLAB' } };
  const url = `${BASE}/l/${params.slug}/`;
  return {
    title: { absolute: landing.title },
    description: landing.description,
    // ⚠️ 페이지 metadata 의 openGraph 는 루트 layout 의 openGraph 를 "대체"한다(병합이 아니다).
    //    여기서 type·locale·siteName 을 다시 적지 않으면 이 라우트에서만 통째로 사라진다.
    //    실제로 /l/ 311개 · /h/ 38개에서 og:type·og:locale·og:site_name 이 빠져 있었다.
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      siteName: SITE.name,
      title: landing.title,
      description: landing.description,
      url,
      images: ['/og-default.png'],
    },
    alternates: { canonical: url },
    // 지역/업종만 치환한 near-duplicate 랜딩은 색인 제외(noindex,follow) — 사이트 전체 품질 보호
    robots: landingIndexable(landing)
      ? { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } }
      : { index: false, follow: true, googleBot: { index: false, follow: true } },
  };
}

export default function LandingRoute({ params }) {
  const landing = getLandingBySlug(params.slug);
  if (!landing) return null;

  const url = `${BASE}/l/${params.slug}/`;
  const hub = landing.hubId ? getHubBySlug(landing.hubId) : null;
  const crumbs = [
    { name: '홈', url: `${BASE}/` },
    ...(hub ? [{ name: hub.ko, url: `${BASE}/h/${landing.hubId}/` }] : []),
    { name: landing.keyword || landing.title, url },
  ];

  return (
    <>
      <LandingServiceJsonLd
        name={landing.title}
        description={landing.description}
        url={url}
        crumbs={crumbs}
      />
      <LandingPage slug={params.slug} />
    </>
  );
}
