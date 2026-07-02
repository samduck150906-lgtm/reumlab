import { getLandings, getLandingBySlug, getHubBySlug, landingIndexable } from '../../../lib/data';
import LandingPage from '../../../components/LandingPage';
import { LandingServiceJsonLd } from '../../../components/JsonLd';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://reumlab.com';

export async function generateStaticParams() {
  const landings = getLandings();
  return landings.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }) {
  const landing = getLandingBySlug(params.slug);
  if (!landing) return { title: '름랩 REUMLAB' };
  const url = `${BASE}/l/${params.slug}/`;
  return {
    title: landing.title,
    description: landing.description,
    openGraph: {
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
