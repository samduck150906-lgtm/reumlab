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

export function landingIndexable(landing) {
  if (!landing) return false;
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
