import type { MetadataRoute } from 'next';
import { PAGE_SEO_MAP, SITE, REDIRECTED_PILLAR_SLUGS, NOINDEX_PILLAR_SLUGS } from '@/lib/seo';
import { getLandings, getClusters, landingIndexable, hubShouldIndex } from '../lib/data';
import { BLOG_POSTS, blogCanonical, blogShouldIndex } from '@/lib/blog-posts';
import { allRegionServiceParams, regionServiceCanonical, regionServiceDecision } from '@/lib/pseo';
import { INDUSTRIES, industryCanonical, industryDecision } from '@/lib/industries';
import { WEBSITE_INDUSTRIES, websiteCanonical, websiteDecision } from '@/lib/website-industries';
import { COSTS, costCanonical, costDecision } from '@/lib/cost';
import { SOLUTIONS, solutionCanonical, solutionDecision } from '@/lib/solution';
import { GUIDES, guideCanonical, guideDecision } from '@/lib/guides';
import { COMPARES, compareCanonical, compareDecision } from '@/lib/compare';
import { PROJECTS, portfolioCanonical, PORTFOLIO_HUB } from '@/lib/portfolio';
import { gitLastModified } from '../lib/lastmod';

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];

  // lastmod는 빌드시각(new Date())이 아니라 각 콘텐츠 소스의 git 커밋 날짜를 쓴다.
  // → 같은 커밋을 재배포해도 lastmod가 그대로라 크롤 예산 churn이 없다(§4-1).
  const seoMod = gitLastModified('lib/seo.ts');
  // 홈(/)은 Next 렌더가 아니라 정적 index.html(+styles.css/script.js)로 서빙된다(copy:home).
  // 홈 lastmod가 lib/seo.ts 커밋만 따라가면, 실제 홈 콘텐츠(index.html)가 바뀐 배포에서도
  // 프레시 신호가 전진하지 않아 크롤러가 옛 홈을 계속 캐시한다(색인 stale 원인).
  // → 홈 lastmod는 실제 배포되는 홈 소스 파일들의 최신 git 날짜를 함께 반영한다.
  const latest = (...ds: Date[]) => new Date(Math.max(...ds.map((d) => d.getTime())));
  const homeMod = latest(
    seoMod,
    gitLastModified('index.html'),
    gitLastModified('styles.css'),
    gitLastModified('script.js'),
  );
  const blogMod = gitLastModified('lib/blog-posts.ts');
  const pseoMod = gitLastModified('lib/pseo.ts');
  const industryMod = gitLastModified('lib/industries.ts');
  const clustersMod = gitLastModified('content/clusters.json');
  const landingsMod = gitLastModified('content/landings.json');
  const sohoMod = gitLastModified('app/soho/page.tsx');

  for (const [slug, seo] of Object.entries(PAGE_SEO_MAP)) {
    // 얇은 한글 pillar는 301(정적 생성 제외) 또는 noindex → 사이트맵에서 제외
    if (REDIRECTED_PILLAR_SLUGS.has(slug) || NOINDEX_PILLAR_SLUGS.has(slug)) continue;
    out.push({
      url: seo.canonical,
      lastModified: slug === '' ? homeMod : seoMod,
      changeFrequency: slug === '' ? 'weekly' : 'monthly',
      priority: slug === '' ? 1 : 0.8,
    });
  }

  // 목적별 랜딩 허브 — 정적 생성(scripts/generate-purpose-landings.mjs → out/<slug>/).
  // mvp·website 는 PAGE_SEO_MAP 에 이미 포함되어(같은 URL을 리치 랜딩으로 덮어씀) 위에서 추가됨.
  // 여기서는 신규 6종만 사이트맵에 추가한다.
  const purposeMod = gitLastModified('scripts/generate-purpose-landings.mjs');
  for (const slug of ['erp', 'ai-automation', 'platform', 'reservation-commerce', 'data-seo', 'service-renewal']) {
    out.push({
      url: `${SITE.domain}/${slug}/`,
      lastModified: purposeMod,
      changeFrequency: 'monthly',
      priority: 0.82,
    });
  }

  out.push({
    url: `${SITE.domain}/blog/`,
    lastModified: blogMod,
    changeFrequency: 'weekly',
    priority: 0.78,
  });

  // 법적 고지 페이지 — public/{privacy,terms,refund}/index.html 로 서빙되는 정적 페이지.
  // Next 라우트가 아니라 사이트맵에서 누락돼 있었다. 색인 자체보다 사업자·환불·개인정보
  // 처리 주체가 공개돼 있다는 신뢰(E-E-A-T) 신호가 크롤러·생성형 검색에 닿게 한다.
  const legalMod = gitLastModified('public/privacy/index.html');
  for (const slug of ['privacy', 'terms', 'refund']) {
    out.push({
      url: `${SITE.domain}/${slug}/`,
      lastModified: legalMod,
      changeFrequency: 'yearly',
      priority: 0.3,
    });
  }

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

  // 업종 인덱스 허브 — 100개 업종을 3축으로 잇는 크롤 진입점
  out.push({
    url: `${SITE.domain}/app/`,
    lastModified: industryMod,
    changeFrequency: 'weekly',
    priority: 0.85,
  });

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

  // 6축 — 업종별 홈페이지 제작 (파워링크 키워드 294종, 색인 게이트 통과분만 포함)
  // /app(앱개발)와 검색 의도 분리(홈페이지 페이지구성·검색노출·제작비용) — 자기잠식 방지
  const websiteMod = gitLastModified('lib/website-industries.ts');
  out.push({
    url: `${SITE.domain}/website/`,
    lastModified: websiteMod,
    changeFrequency: 'weekly',
    priority: 0.82,
  });
  for (const d of WEBSITE_INDUSTRIES) {
    const decision = websiteDecision(d.slug);
    if (decision && !decision.inSitemap) continue;
    out.push({
      url: websiteCanonical(d.slug),
      lastModified: websiteMod,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // 4축 — 업종별 앱개발 비용/견적 (색인 게이트 통과분만 포함)
  // /app/[industry] 와 검색 의도 분리(무엇을 만드나 vs 얼마가 드나) — 자기잠식 방지
  const costMod = gitLastModified('lib/cost.ts');
  out.push({
    url: `${SITE.domain}/cost/`,
    lastModified: costMod,
    changeFrequency: 'weekly',
    priority: 0.82,
  });
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

  // 5축 — 업종별 솔루션·시스템 구축 (색인 게이트 통과분만 포함)
  // /app(무엇)·/cost(얼마)와 검색 의도 분리(어떻게 구축) — 자기잠식 방지
  const solutionMod = gitLastModified('lib/solution.ts');
  out.push({
    url: `${SITE.domain}/solution/`,
    lastModified: solutionMod,
    changeFrequency: 'weekly',
    priority: 0.82,
  });
  for (const s of SOLUTIONS) {
    const decision = solutionDecision(s.slug);
    if (decision && !decision.inSitemap) continue;
    out.push({
      url: solutionCanonical(s.slug),
      lastModified: solutionMod,
      changeFrequency: 'monthly',
      priority: 0.72,
    });
  }

  // 가이드 인덱스 허브 — 가이드·비교·레거시 허브(h)로 이어지는 크롤 진입점
  out.push({
    url: `${SITE.domain}/guide/`,
    lastModified: gitLastModified('lib/guides.ts'),
    changeFrequency: 'weekly',
    priority: 0.78,
  });

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

  // 개발 사례 — 허브 + 상세 15건.
  // 데이터 출처가 script.js(PROJECTS)이므로 lastmod 도 그 파일의 커밋 날짜를 따른다.
  // 사례에는 발행일 개념이 없어(원본에 날짜 필드 없음) 임의 날짜를 만들지 않는다.
  const portfolioMod = gitLastModified('script.js');
  out.push({
    url: PORTFOLIO_HUB,
    lastModified: portfolioMod,
    changeFrequency: 'monthly',
    priority: 0.85,
  });
  for (const p of PROJECTS) {
    out.push({
      url: portfolioCanonical(p.id),
      lastModified: portfolioMod,
      changeFrequency: 'monthly',
      priority: 0.7,
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
