import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ALL_SLUGS, PAGE_SEO_MAP, SITE, NOINDEX_PILLAR_SLUGS, pillarServiceType } from '@/lib/seo';
import { ServiceJsonLd, HOME_CRUMB } from '@/components/JsonLd';
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
    title: { absolute: seo.title },
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: seo.canonical },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      url: seo.canonical,
      siteName: SITE.name,
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
    // 얇은(meta-only) 한글 pillar는 색인 제외 — 사이트 전체 품질 보호(본문 보강 시 해제)
    robots: NOINDEX_PILLAR_SLUGS.has(slug)
      ? { index: false, follow: true, googleBot: { index: false, follow: true } }
      : {
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

  // Organization·사업체 노드는 루트 레이아웃(SiteEntityJsonLd)이 이미 내보낸다.
  // 여기서는 이 페이지가 파는 서비스 하나만 선언하고 provider 로 #business 를 참조한다.
  return (
    <>
      <ServiceJsonLd
        url={seo.canonical}
        name={seo.h1}
        description={seo.serviceDesc || seo.description}
        serviceType={pillarServiceType(slug)}
        crumbs={[HOME_CRUMB, { name: seo.h1.slice(0, 100), url: seo.canonical }]}
      />
      <SeoServicePage seo={seo} pageSlug={slug} />
    </>
  );
}
