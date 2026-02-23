import landingsData from '../content/landings.json';
import clustersData from '../content/clusters.json';
import templatesData from '../content/templates.json';

const { site } = templatesData;
const faqPool = templatesData.faqPool || [];
const reviewPool = templatesData.reviewPool || [];
const portfolioPool = templatesData.portfolioPool || [];
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

export function pickReviews(slug, n = 3) {
  const h = hash(slug + 'r');
  const indices = [];
  for (let i = 0; i < n; i++) indices.push((h + i * 11) % reviewPool.length);
  return [...new Set(indices)].slice(0, n).map((i) => reviewPool[i]).filter(Boolean);
}

export function pickPortfolios(landing, n = 3) {
  if (!portfolioPool.length) return [];
  const serviceType = landing.serviceKey && SERVICE_TO_PRICING_KEY[landing.serviceKey] || null;
  const hub = clustersData[landing.hubId];
  const industry = hub && hub.type === 'industry' ? landing.hubId : null;
  let pool = portfolioPool.filter((p) => p.serviceType === serviceType);
  if (industry && pool.length > 0) {
    const byIndustry = pool.filter((p) => p.industry === industry || !p.industry);
    if (byIndustry.length > 0) pool = byIndustry;
  }
  if (pool.length === 0) pool = portfolioPool.filter((p) => p.serviceType === serviceType || !p.serviceType);
  if (pool.length === 0) pool = portfolioPool;
  const h = hash(landing.slug + 'p');
  const indices = [];
  for (let i = 0; i < n; i++) indices.push((h + i * 13) % pool.length);
  return [...new Set(indices)].slice(0, n).map((i) => pool[i]).filter(Boolean);
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

export { faqPool, reviewPool, pricingSnippets };
