import type { MetadataRoute } from 'next';
import { PAGE_SEO_MAP, SITE, REDIRECTED_PILLAR_SLUGS, NOINDEX_PILLAR_SLUGS } from '@/lib/seo';
import { getLandings, getClusters, landingIndexable, hubShouldIndex } from '../lib/data';
import { BLOG_POSTS, blogCanonical, blogShouldIndex } from '@/lib/blog-posts';
import { allRegionServiceParams, regionServiceCanonical, regionServiceDecision } from '@/lib/pseo';
import { INDUSTRIES, industryCanonical, industryDecision } from '@/lib/industries';
import { COSTS, costCanonical, costDecision } from '@/lib/cost';
import { GUIDES, guideCanonical, guideDecision } from '@/lib/guides';
import { COMPARES, compareCanonical, compareDecision } from '@/lib/compare';
import { PORTFOLIO, hasPortfolio, portfolioCanonical } from '@/lib/portfolio';
import { gitLastModified } from '../lib/lastmod';

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];

  // lastmod는 빌드시각(new Date())이 아니라 각 콘텐츠 소스의 git 커밋 날짜를 쓴다.
  // → 같은 커밋을 재배포해도 lastmod가 그대로라 크롤 예산 churn이 없다(§4-1).
  const seoMod = gitLastModified('lib/seo.ts');
  const blogMod = gitLastModified('lib/blog-posts.ts');
  const pseoMod = gitLastModified('lib/pseo.ts');
  const industryMod = gitLastModified('lib/industries.ts');
  const clustersMod = gitLastModified('content/clusters.json');
  const landingsMod = gitLastModified('content/landings.json');
  const portfolioMod = gitLastModified('lib/portfolio.ts');
  const sohoMod = gitLastModified('app/soho/page.tsx');

  for (const [slug, seo] of Object.entries(PAGE_SEO_MAP)) {
    // 얇은 한글 pillar는 301(정적 생성 제외) 또는 noindex → 사이트맵에서 제외
    if (REDIRECTED_PILLAR_SLUGS.has(slug) || NOINDEX_PILLAR_SLUGS.has(slug)) continue;
    out.push({
      url: seo.canonical,
      lastModified: seoMod,
      changeFrequency: slug === '' ? 'weekly' : 'monthly',
      priority: slug === '' ? 1 : 0.8,
    });
  }

  out.push({
    url: `${SITE.domain}/blog/`,
    lastModified: blogMod,
    changeFrequency: 'weekly',
    priority: 0.78,
  });

  for (const b of BLOG_POSTS) {
    if (!blogShouldIndex(b.slug)) continue; // 얇은·중복 글은 사이트맵 제외
    out.push({
      url: blogCanonical(b.slug),
      lastModified: new Date(b.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.68,
    });
  }

  out.push({
    url: `${SITE.domain}/soho/`,
    lastModified: sohoMod,
    changeFrequency: 'monthly',
    priority: 0.85,
  });

  // 포트폴리오 — 실제 진행 사례가 있을 때만 색인 (빈 목록은 noindex)
  if (hasPortfolio) {
    out.push({
      url: `${SITE.domain}/portfolio/`,
      lastModified: portfolioMod,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
    for (const p of PORTFOLIO) {
      out.push({
        url: portfolioCanonical(p.slug),
        lastModified: new Date(p.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.72,
      });
    }
  }

  // 프로그래매틱 1축 — 지역×서비스 (색인 게이트 통과분만 포함)
  // 본거지(동탄·화성)와 핵심 인접지(수원)는 크롤 우선순위·갱신빈도를 높여 노출 강화
  const HOME_BASE_REGIONS = new Set(['dongtan', 'hwaseong', 'suwon']);
  for (const { slug, region } of allRegionServiceParams()) {
    const decision = regionServiceDecision(slug, region);
    if (decision && !decision.inSitemap) continue;
    const homeBase = HOME_BASE_REGIONS.has(region);
    out.push({
      url: regionServiceCanonical(slug, region),
      lastModified: pseoMod,
      changeFrequency: homeBase ? 'weekly' : 'monthly',
      priority: homeBase ? 0.8 : 0.7,
    });
  }

  // 프로그래매틱 2축 — 업종×앱개발 (색인 게이트 통과분만 포함)
  for (const ind of INDUSTRIES) {
    const decision = industryDecision(ind.slug);
    if (decision && !decision.inSitemap) continue;
    out.push({
      url: industryCanonical(ind.slug),
      lastModified: industryMod,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // 4축 — 업종별 앱개발 비용/견적 (색인 게이트 통과분만 포함)
  // /app/[industry] 와 검색 의도 분리(무엇을 만드나 vs 얼마가 드나) — 자기잠식 방지
  const costMod = gitLastModified('lib/cost.ts');
  for (const c of COSTS) {
    const decision = costDecision(c.slug);
    if (decision && !decision.inSitemap) continue;
    out.push({
      url: costCanonical(c.slug),
      lastModified: costMod,
      changeFrequency: 'monthly',
      priority: 0.72,
    });
  }

  // 3축 — 비용·견적·가이드 (색인 게이트 통과분만 포함)
  for (const g of GUIDES) {
    const decision = guideDecision(g.slug);
    if (decision && !decision.inSitemap) continue;
    out.push({
      url: guideCanonical(g.slug),
      lastModified: new Date(g.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.72,
    });
  }

  // 3축 — 비교 (색인 게이트 통과분만 포함)
  for (const c of COMPARES) {
    const decision = compareDecision(c.slug);
    if (decision && !decision.inSitemap) continue;
    out.push({
      url: compareCanonical(c.slug),
      lastModified: new Date(c.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  for (const hubSlug of Object.keys(getClusters())) {
    if (hubSlug === 'mobile-app') continue; // /h/app-dev/ 와 중복 → canonical 통합, 사이트맵 제외
    if (!hubShouldIndex(hubSlug)) continue; // 도어웨이·앱 pSEO 대체 허브 제외 — robots noindex와 동기화
    out.push({
      url: `${SITE.domain}/h/${hubSlug}/`,
      lastModified: clustersMod,
      changeFrequency: 'weekly',
      priority: 0.75,
    });
  }

  for (const l of getLandings()) {
    if (!landingIndexable(l)) continue; // near-duplicate 랜딩은 사이트맵 제외 (robots noindex와 동기화)
    out.push({
      url: `${SITE.domain}/l/${l.slug}/`,
      lastModified: landingsMod,
      changeFrequency: 'monthly',
      priority: 0.65,
    });
  }

  // URL 중복 제거(마지막 방어선) — 데이터에 중복 slug가 있어도 사이트맵엔 URL당 1개만.
  // (예: 여러 블로그 글이 같은 slug를 가지면 실제 렌더 페이지는 1개인데 loc가 중복됨)
  const seen = new Set<string>();
  return out.filter((e) => {
    const url = String(e.url);
    if (seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}
