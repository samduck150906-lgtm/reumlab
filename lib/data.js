import landingsData from '../content/landings.json';
import clustersData from '../content/clusters.json';
import templatesData from '../content/templates.json';

const { site } = templatesData;
const faqPool = templatesData.faqPool || [];
const pricingSnippets = templatesData.pricingSnippets || {};
const hubBodyTemplates = templatesData.hubBodyTemplates || {};

const SERVICE_TO_PRICING_KEY = {
  'app-dev': 'app', 'mobile-app': 'app', 'app-dev-out': 'app',
  'homepage-dev': 'web', 'web-dev': 'web', 'landing-page': 'web', 'website-dev': 'web',
  'responsive-web': 'web', 'web-dev-simple': 'web', 'shopping-mall': 'web',
  'service-plan': 'plan', 'mvp-dev': 'plan',
};

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function getSite() {
  return site;
}

export function getLandings() {
  return landingsData;
}

export function getLandingBySlug(slug) {
  return landingsData.find((l) => l.slug === slug) || null;
}

/**
 * /l/ 랜딩 색인 게이트.
 * 328개 랜딩 중 지역/업종명만 치환한 near-duplicate(본문 98%+ 동일)는
 * noindex,follow + 사이트맵 제외 처리한다. 대표 키워드(service_intent)·본거지
 * 로컬·실적 확인 페이지만 색인 대상으로 남긴다. 다른 프로그래매틱 축의 색인
 * 게이트와 동일한 철학이며, 되돌리려면 아래 규칙만 완화하면 된다.
 */
const KEEP_LANDING_REGIONS = new Set(['suwon', 'dongtan', 'hwaseong']); // 본거지·인접 로컬
const KEEP_LANDING_SLUGS = new Set([
  // GSC·네이버에서 클릭/노출 실적이 확인된 페이지 (지역/업종 페이지라도 유지)
  'app-dev-out-price', 'academy-shopping-mall', 'cafe-app-dev-out', 'web-dev-cost',
  'landing-page-out-source-cost', 'suwon-website-dev', 'suwon-app-dev',
  'gangnam-landing-page-quote', 'mobile-app-price', 'restaurant-website-dev',
  'bundang-app-dev', 'gym-web-dev',
]);

/**
 * /l/ 지역 랜딩 → 앱 pSEO 지역×서비스 페이지 301 통합 (자기잠식 제거).
 * 같은 지역·같은 핵심 서비스를 노리던 얇은 /l/ 랜딩을, 색인 게이트를 통과한
 * 더 풍부한 앱 pSEO 페이지로 합쳐 링크 자산을 한곳에 모은다.
 * (앱 pSEO에 대응 서비스가 없는 것 — 예: 쇼핑몰제작 — 은 고유 키워드 보존 위해 제외)
 * 실제 301 규칙은 public/_redirects 에 있고, 여기서는 색인·생성 제외의 단일 소스다.
 */
export const REDIRECTED_LANDING_SLUGS = new Map([
  // 앱개발 → /app-development/{region}/
  ['suwon-app-dev', '/app-development/suwon/'],
  ['suwon-app-dev-out', '/app-development/suwon/'],
  ['suwon-app-dev-cost', '/app-development/suwon/'],
  ['suwon-app-dev-quote', '/app-development/suwon/'],
  ['bundang-app-dev', '/app-development/bundang/'],
  // 웹/홈페이지/웹사이트/랜딩페이지 → /web-development/{region}/
  ['suwon-web-dev', '/web-development/suwon/'],
  ['suwon-web-dev-cost', '/web-development/suwon/'],
  ['suwon-web-dev-quote', '/web-development/suwon/'],
  ['suwon-homepage-dev', '/web-development/suwon/'],
  ['suwon-homepage-dev-cost', '/web-development/suwon/'],
  ['suwon-homepage-dev-quote', '/web-development/suwon/'],
  ['suwon-website-dev', '/web-development/suwon/'],
  ['suwon-landing-page', '/web-development/suwon/'],
  ['suwon-landing-page-cost', '/web-development/suwon/'],
  ['suwon-landing-page-quote', '/web-development/suwon/'],
  ['gangnam-landing-page-quote', '/web-development/gangnam/'],
  // MVP → /mvp/{region}/
  ['suwon-mvp-dev', '/mvp/suwon/'],
]);

/** 이 랜딩이 앱 pSEO로 301 통합되는가 → 대상 경로 (아니면 null) */
export function landingRedirectTarget(slug) {
  return REDIRECTED_LANDING_SLUGS.get(slug) || null;
}

export function landingIndexable(landing) {
  if (!landing) return false;
  if (REDIRECTED_LANDING_SLUGS.has(landing.slug)) return false; // 301 통합분은 색인·사이트맵 제외
  if (landing.pattern === 'service_intent') return true; // 지역/업종 없는 대표 키워드
  if (landing.regionKey && KEEP_LANDING_REGIONS.has(landing.regionKey)) return true; // 본거지 로컬
  if (KEEP_LANDING_SLUGS.has(landing.slug)) return true; // 실적 earner
  return false; // near-duplicate → noindex + 사이트맵 제외
}

export function getClusters() {
  return clustersData;
}

export function getHubBySlug(hubSlug) {
  const hub = clustersData[hubSlug];
  return hub ? { slug: hubSlug, ...hub } : null;
}

/**
 * /h/ 허브 색인 게이트.
 * 허브는 "키워드 랜딩 모음(aggregator)"이므로, 정작 색인되는 랜딩을 하나도
 * surfacing 하지 못하면(=색인 랜딩 0개) 얇은 도어웨이 페이지다. 이런 허브는
 * noindex,follow + 사이트맵 제외한다. (빈 composite 허브·죽은 지역/업종 허브 해당)
 * 다른 축과 동일한 "실제 색인 콘텐츠 기준" 게이트 철학.
 *
 * NOTE: 콘텐츠를 가진 service 허브(app-dev·web-dev·mvp-dev 등)는 이 게이트를
 * 통과하지만 앱 pSEO 서비스 페이지(/app-development·/mvp 등)와 키워드가 겹친다.
 * 이 자기잠식의 301 통합 vs noindex 판단은 백링크 실적을 아는 운영자 몫으로
 * 남겨 둔다(docs §5-1). 여기서는 "색인 콘텐츠 0" 허브만 자동 정리한다.
 */
export function hubIndexedLandingCount(hubSlug) {
  const hub = clustersData[hubSlug];
  if (!hub) return 0;
  return (hub.landings || []).filter((s) => landingIndexable(getLandingBySlug(s))).length;
}

export function hubIndexable(hubSlug) {
  return hubIndexedLandingCount(hubSlug) >= 1;
}

/**
 * 앱 pSEO 서비스 페이지가 대체하는 레거시 service 허브 → 자기잠식 제거 위해 noindex,follow.
 * 같은 head 키워드(앱개발/웹개발/MVP)를 색인 게이트 통과한 더 풍부한 앱 pSEO 페이지가
 * 이미 노리고 있어, 얇은 키워드-그리드 허브까지 색인하면 서로 갉아먹는다.
 *
 * noindex,follow 이므로 허브는 살아 있고(사용자 내비게이션·하위 롱테일 랜딩 전달) 색인만 빠진다.
 * 되돌리려면 이 집합만 비우면 된다. 백링크 실적이 확인된 허브는 개별적으로 301 통합으로
 * 승격 가능(값 = 통합 대상 경로, docs §5-1). 대응 앱 페이지가 없는 shopping-mall·service-plan은 제외.
 */
export const SUPERSEDED_SERVICE_HUBS = new Map([
  ['app-dev', '/app-development/'],
  ['app-dev-out', '/app-development/'],
  ['homepage-dev', '/web-development/'],
  ['web-dev', '/web-development/'],
  ['web-dev-simple', '/web-development/'],
  ['website-dev', '/web-development/'],
  ['responsive-web', '/web-development/'],
  ['landing-page', '/web-development/'],
  ['mvp-dev', '/mvp/'],
]);

/** 허브 최종 색인 판정 — 앱 pSEO 대체분 제외 + 색인 랜딩 ≥1 (route robots·사이트맵 공통) */
export function hubShouldIndex(hubSlug) {
  if (SUPERSEDED_SERVICE_HUBS.has(hubSlug)) return false; // 앱 pSEO가 대체 → 자기잠식 제거
  return hubIndexable(hubSlug); // 색인 랜딩 0개 도어웨이 제외
}

export function pickFaqs(slug, n = 4) {
  const h = hash(slug);
  const indices = [];
  for (let i = 0; i < n; i++) indices.push((h + i * 7) % faqPool.length);
  return [...new Set(indices)].slice(0, n).map((i) => faqPool[i]).filter(Boolean);
}

export function getPricingSnippet(landing) {
  const key = landing.serviceKey && SERVICE_TO_PRICING_KEY[landing.serviceKey];
  return key && pricingSnippets[key] ? pricingSnippets[key] : null;
}

export function getHubBodyTemplate(hub) {
  const t = hubBodyTemplates[hub.type] || hubBodyTemplates.service || '';
  return t.replace(/\s+/g, ' ').trim();
}

const slugToKeyword = Object.fromEntries(landingsData.map((l) => [l.slug, l.keyword]));
export function getKeywordBySlug(slug) {
  return slugToKeyword[slug] || slug;
}

export { faqPool, pricingSnippets };
