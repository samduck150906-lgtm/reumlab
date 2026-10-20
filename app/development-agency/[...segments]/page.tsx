import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AgencyArticle from '@/components/development-agency/AgencyArticle';
import { agencyPages } from '@/lib/development-agency/catalog';
import { agencyMetadata } from '@/lib/development-agency/metadata';
import { agencySlugFromSegments } from '@/lib/development-agency/types';

type Props = { params: { segments: string[] } };
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return agencyPages.map(page => ({ segments: page.slug.split('/') }));
}

function findPage(segments: string[]) {
  const slug = agencySlugFromSegments(segments);
  return agencyPages.find(page => page.slug === slug);
}

export function generateMetadata({ params }: Props): Metadata {
  const page = findPage(params.segments);
  if (!page) notFound();
  return agencyMetadata(page);
}

export default function DevelopmentAgencyPage({ params }: Props) {
  const page = findPage(params.segments);
  if (!page) notFound();
  return <AgencyArticle page={page} />;
}
