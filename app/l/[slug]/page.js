import { getLandings, getLandingBySlug, getHubBySlug, landingIndexable, landingRedirectTarget } from '../../../lib/data';
import LandingPage from '../../../components/LandingPage';
import { LandingServiceJsonLd } from '../../../components/JsonLd';
import { SITE } from '../../../lib/seo';
import { buildLandingMeta } from '../../../lib/search-intent';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://reumlab.com';

export async function generateStaticParams() {
  const landings = getLandings();
  // 앱 pSEO로 301 통합되는 랜딩은 정적 생성 제외 → out/에 파일이 없어 _redirects 301이 그대로 발동
  return landings.filter((l) => !landingRedirectTarget(l.slug)).map((l) => ({ slug: l.slug }));
}

/**
 * 검색결과 문구는 landings.json 에 굳어 있던 문장 대신 검색 의도로 조립한다.
 *
 * 굳어 있던 값은 title "앱개발 비용 | 름랩 REUMLAB"(평균 22자), description
 * "앱개발 비용 문의하세요. 앱 개발 견적·상담 - 름랩."(평균 35자)였다. 이 축은 '앱개발 비용'
 * '앱개발외주 가격'처럼 계약에 가장 가까운(BOFU) 검색어를 받는 자리인데, 스니펫이
 * 아무 정보(금액·범위·기간)도 주지 못해 노출 대비 클릭이 붙지 않았다.
 * H1 은 그대로 landing.keyword 를 쓴다 — title 과 H1 이 같을 필요는 없다.
 */
function metaFor(landing) {
  return buildLandingMeta({
    keyword: landing.keyword,
    serviceKo: landing.serviceKo || landing.keyword,
    intentKey: landing.intentKey,
    svcType: landing.svcType,
    regionKo: landing.regionKo,
    industryKo: landing.industryKo,
    slug: landing.slug,
  });
}

export async function generateMetadata({ params }) {
  const landing = getLandingBySlug(params.slug);
  if (!landing) return { title: { absolute: '름랩 REUMLAB' } };
  const url = `${BASE}/l/${params.slug}/`;
  const { title: metaTitle, description: metaDescription } = metaFor(landing);
  return {
    title: { absolute: metaTitle },
    description: metaDescription,
    // ⚠️ 페이지 metadata 의 openGraph 는 루트 layout 의 openGraph 를 "대체"한다(병합이 아니다).
    //    여기서 type·locale·siteName 을 다시 적지 않으면 이 라우트에서만 통째로 사라진다.
    //    실제로 /l/ 311개 · /h/ 38개에서 og:type·og:locale·og:site_name 이 빠져 있었다.
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      siteName: SITE.name,
      title: metaTitle,
      description: metaDescription,
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
  // 중복 허브(mobile-app)는 canonical 이 대표 허브(app-dev)를 가리킨다.
  // breadcrumb item 이 canonical 과 다른 URL 을 가리키면 계층 신호가 갈린다.
  // app/h/[hubSlug]/page.js 의 DUP_HUB_CANONICAL 과 같은 표를 쓴다.
  const DUP_HUB_CANONICAL = { 'mobile-app': 'app-dev' };
  const hubSlug = landing.hubId ? DUP_HUB_CANONICAL[landing.hubId] || landing.hubId : null;
  const crumbs = [
    { name: '홈', url: `${BASE}/` },
    ...(hub ? [{ name: hub.ko, url: `${BASE}/h/${hubSlug}/` }] : []),
    { name: landing.keyword || landing.title, url },
  ];

  return (
    <>
      <LandingServiceJsonLd
        name={landing.keyword || landing.title}
        description={landing.description}
        url={url}
        crumbs={crumbs}
      />
      <LandingPage slug={params.slug} />
    </>
  );
}
