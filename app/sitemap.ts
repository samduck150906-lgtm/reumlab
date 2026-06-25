import type { MetadataRoute } from 'next';
import { PAGE_SEO_MAP, SITE } from '@/lib/seo';
import { getLandings, getClusters } from '../lib/data';
import { BLOG_POSTS, blogCanonical } from '@/lib/blog-posts';
import { allRegionServiceParams, regionServiceCanonical, regionServiceDecision } from '@/lib/pseo';
import { INDUSTRIES, industryCanonical } from '@/lib/industries';
import { GUIDES, guideCanonical } from '@/lib/guides';
import { COMPARES, compareCanonical } from '@/lib/compare';
import { PORTFOLIO, hasPortfolio, portfolioCanonical } from '@/lib/portfolio';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const out: MetadataRoute.Sitemap = [];

  for (const [slug, seo] of Object.entries(PAGE_SEO_MAP)) {
    out.push({
      url: seo.canonical,
      lastModified: now,
      changeFrequency: slug === '' ? 'weekly' : 'monthly',
      priority: slug === '' ? 1 : 0.8,
    });
  }

  out.push({
    url: `${SITE.domain}/blog/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.78,
  });

  for (const b of BLOG_POSTS) {
    out.push({
      url: blogCanonical(b.slug),
      lastModified: new Date(b.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.68,
    });
  }

  out.push({
    url: `${SITE.domain}/soho/`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  });

  // 포트폴리오 — 실제 진행 사례가 있을 때만 색인 (빈 목록은 noindex)
  if (hasPortfolio) {
    out.push({
      url: `${SITE.domain}/portfolio/`,
      lastModified: now,
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
  for (const { slug, region } of allRegionServiceParams()) {
    const decision = regionServiceDecision(slug, region);
    if (decision && !decision.inSitemap) continue;
    out.push({
      url: regionServiceCanonical(slug, region),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // 프로그래매틱 2축 — 업종×앱개발
  for (const ind of INDUSTRIES) {
    out.push({
      url: industryCanonical(ind.slug),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  // 3축 — 비용·견적·가이드
  for (const g of GUIDES) {
    out.push({
      url: guideCanonical(g.slug),
      lastModified: new Date(g.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.72,
    });
  }

  // 3축 — 비교
  for (const c of COMPARES) {
    out.push({
      url: compareCanonical(c.slug),
      lastModified: new Date(c.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  for (const hubSlug of Object.keys(getClusters())) {
    out.push({
      url: `${SITE.domain}/h/${hubSlug}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.75,
    });
  }

  for (const l of getLandings()) {
    out.push({
      url: `${SITE.domain}/l/${l.slug}/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.65,
    });
  }

  return out;
}
