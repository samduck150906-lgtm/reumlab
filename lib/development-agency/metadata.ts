import type { Metadata } from 'next';
import { SITE } from '@/lib/seo';
import { AGENCY_DOMAIN, agencyHref, type AgencyPage } from './types';

export function agencyMetadata(page: AgencyPage): Metadata {
  const url = `${AGENCY_DOMAIN}${agencyHref(page)}`;
  return {
    title: { absolute: page.title },
    description: page.description,
    keywords: [...page.keywordVariants],
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website', locale: 'ko_KR', siteName: SITE.name, url,
      title: page.title, description: page.description,
      images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: '름랩 REUMLAB' }],
    },
    twitter: {
      card: 'summary_large_image', title: page.title,
      description: page.description, images: [SITE.defaultOgImage],
    },
  };
}
