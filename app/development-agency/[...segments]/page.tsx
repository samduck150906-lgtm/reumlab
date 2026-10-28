import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AgencyArticle from '@/components/development-agency/AgencyArticle';
import AgencyCategoryHub from '@/components/development-agency/AgencyCategoryHub';
import { agencyPages } from '@/lib/development-agency/catalog';
import { AGENCY_CATEGORIES, agencyCategory, agencyCategoryHref } from '@/lib/development-agency/categories';
import { agencyMetadata } from '@/lib/development-agency/metadata';
import { AGENCY_DOMAIN, agencySlugFromSegments } from '@/lib/development-agency/types';
import { SITE } from '@/lib/seo';

type Props = { params: { segments: string[] } };
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    // 범위별 하위 허브 — /development-agency/<key>/ (lib/development-agency/categories.ts)
    ...AGENCY_CATEGORIES.map((c) => ({ segments: [c.key] })),
    ...agencyPages.map((page) => ({ segments: page.slug.split('/') })),
  ];
}

function findCategory(segments: string[]) {
  return segments.length === 1 ? agencyCategory(segments[0]) : undefined;
}

function findPage(segments: string[]) {
  const slug = agencySlugFromSegments(segments);
  return agencyPages.find((page) => page.slug === slug);
}

export function generateMetadata({ params }: Props): Metadata {
  const category = findCategory(params.segments);
  if (category) {
    const url = `${AGENCY_DOMAIN}${agencyCategoryHref(category)}`;
    return {
      title: { absolute: category.title },
      description: category.description,
      alternates: { canonical: url },
      robots: { index: true, follow: true },
      openGraph: {
        type: 'website', locale: 'ko_KR', siteName: SITE.name, url,
        title: category.title, description: category.description,
        images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: '름랩 REUMLAB' }],
      },
      twitter: { card: 'summary_large_image', title: category.title, description: category.description, images: [SITE.defaultOgImage] },
    };
  }
  const page = findPage(params.segments);
  if (!page) notFound();
  return agencyMetadata(page);
}

export default function DevelopmentAgencyPage({ params }: Props) {
  const category = findCategory(params.segments);
  if (category) return <AgencyCategoryHub category={category} />;
  const page = findPage(params.segments);
  if (!page) notFound();
  return <AgencyArticle page={page} />;
}
