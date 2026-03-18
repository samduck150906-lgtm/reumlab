import type { PageSeo } from '@/lib/seo';
import { PAGE_SEO_MAP, SITE } from '@/lib/seo';

export function OrganizationJsonLd() {
  const home = PAGE_SEO_MAP[''];
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    alternateName: SITE.nameEn,
    url: SITE.domain + '/',
    logo: SITE.defaultOgImage,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE.phone,
      contactType: 'customer service',
      email: SITE.email,
      areaServed: 'KR',
      availableLanguage: ['Korean'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '삼성로 186-1 4층',
      addressLocality: '영통구 수원시',
      addressRegion: '경기도',
      addressCountry: 'KR',
    },
    description: home.description,
    sameAs: [SITE.kakao],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({ slug }: { slug: string }) {
  const seo = slug === '' ? PAGE_SEO_MAP[''] : PAGE_SEO_MAP[slug];
  if (!seo) return null;

  const homeUrl = SITE.domain + '/';
  const items =
    slug === ''
      ? [{ '@type': 'ListItem' as const, position: 1, name: '홈', item: homeUrl }]
      : [
          { '@type': 'ListItem' as const, position: 1, name: '홈', item: homeUrl },
          { '@type': 'ListItem' as const, position: 2, name: seo.h1.slice(0, 100), item: seo.canonical },
        ];

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** /portfolio 등 PAGE_SEO_MAP 밖 페이지 */
export function BreadcrumbJsonLdCustom({ seo }: { seo: PageSeo }) {
  const homeUrl = SITE.domain + '/';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem' as const, position: 1, name: '홈', item: homeUrl },
      { '@type': 'ListItem' as const, position: 2, name: seo.h1.slice(0, 100), item: seo.canonical },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
