import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ALL_SLUGS, PAGE_SEO_MAP, SITE } from '@/lib/seo';
import { OrganizationJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import SeoServicePage from '@/components/SeoServicePage';

type Props = { params: { slug: string } };

function resolveSlug(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = resolveSlug(params.slug);
  const seo = PAGE_SEO_MAP[slug];
  if (!seo) notFound();

  const naver = process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION;

  return {
    metadataBase: new URL(SITE.domain),
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: seo.canonical },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      url: seo.canonical,
      siteName: SITE.nameEn,
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: [
        {
          url: SITE.defaultOgImage,
          width: 1200,
          height: 630,
          alt: seo.ogTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: [SITE.defaultOgImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    ...(naver ? { other: { 'naver-site-verification': naver } } : {}),
  };
}

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export default function SeoSlugPage({ params }: Props) {
  const slug = resolveSlug(params.slug);
  const seo = PAGE_SEO_MAP[slug];
  if (!seo) notFound();

  return (
    <>
      <OrganizationJsonLd />
      <BreadcrumbJsonLd slug={slug} />
      <SeoServicePage seo={seo} pageSlug={slug} />
    </>
  );
}
