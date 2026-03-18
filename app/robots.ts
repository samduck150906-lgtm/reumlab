import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/seo';

/** 네이버·구글 등 전체 경로 수집 허용 + 사이트맵 (전략 페이지·메인 등 신규 구조 반영) */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE.domain}/sitemap.xml`,
    host: SITE.domain.replace(/^https?:\/\//, ''),
  };
}
