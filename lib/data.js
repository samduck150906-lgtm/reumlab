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
