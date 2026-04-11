import type { MetadataRoute } from 'next';
import { PAGE_SEO_MAP, PORTFOLIO_SEO, SITE } from '@/lib/seo';
import { getLandings, getClusters } from '../lib/data';
import { BLOG_POSTS, blogCanonical } from '@/lib/blog-posts';
import { PORTFOLIO_CASES, portfolioCanonical } from '@/lib/portfolio-cases';

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
    url: `${PORTFOLIO_SEO.canonical}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  });

  for (const p of PORTFOLIO_CASES) {
    out.push({
      url: portfolioCanonical(p.slug),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.72,
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
    url: `${SITE.domain}/consultation/`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  });

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
