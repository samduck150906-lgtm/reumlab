import type { PageSeo } from '@/lib/seo';
import type { BlogPost } from '@/lib/blog-posts';
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
      streetAddress: '인계로124번길 19, 12층 1208호',
      addressLocality: '수원시 팔달구',
      addressRegion: '경기도',
      addressCountry: 'KR',
    },
    description: home.description,
    sameAs: [],
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

/** PAGE_SEO_MAP 밖 페이지 */
/** 홈: Organization + LocalBusiness + 교육/개발 서비스(ProfessionalService) 그래프 */
export function ReumHomeGraphJsonLd() {
  const home = PAGE_SEO_MAP[''];
  const graph = [
    {
      '@type': 'Organization',
      '@id': `${SITE.domain}/#organization`,
      name: SITE.name,
      alternateName: SITE.nameEn,
      url: SITE.domain + '/',
      logo: SITE.defaultOgImage,
      description: home.description,
      sameAs: [],
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE.domain}/#localbusiness`,
      name: SITE.company,
      image: SITE.defaultOgImage,
      telephone: SITE.phone,
      email: SITE.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '인계로124번길 19, 12층 1208호',
        addressLocality: '수원시 팔달구',
        addressRegion: '경기도',
        addressCountry: 'KR',
      },
      url: SITE.domain + '/',
      priceRange: '₩₩',
      identifier: {
        '@type': 'PropertyValue',
        name: '사업자등록번호',
        value: SITE.bizNo,
      },
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE.domain}/#service`,
      name: `${SITE.name} 앱·웹 개발 및 유지보수 교육`,
      image: SITE.defaultOgImage,
      url: SITE.domain + '/',
      telephone: SITE.phone,
      description:
        'AI 보조 개발과 1:1 교육으로 비전공자 대표도 앱·웹을 직접 운영·수정할 수 있도록 돕는 개발 에이전시 서비스.',
      areaServed: 'KR',
      provider: { '@id': `${SITE.domain}/#organization` },
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  );
}

export function ArticleJsonLd({ post, url }: { post: BlogPost; url: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.domain + '/',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: SITE.defaultOgImage },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: post.keywords.join(', '),
    inLanguage: 'ko-KR',
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

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

/** 프로그래매틱 랜딩·허브 페이지용 ProfessionalService + BreadcrumbList 그래프 */
export function LandingServiceJsonLd({
  name,
  description,
  url,
  crumbs,
}: {
  name: string;
  description: string;
  url: string;
  crumbs: { name: string; url: string }[];
}) {
  const graph = [
    {
      '@type': 'ProfessionalService',
      '@id': `${url}#service`,
      name,
      description,
      url,
      image: SITE.defaultOgImage,
      telephone: SITE.phone,
      email: SITE.email,
      areaServed: 'KR',
      priceRange: '₩₩',
      provider: { '@id': `${SITE.domain}/#organization` },
      address: {
        '@type': 'PostalAddress',
        streetAddress: '인계로124번길 19, 12층 1208호',
        addressLocality: '수원시 팔달구',
        addressRegion: '경기도',
        addressCountry: 'KR',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: c.url,
      })),
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  );
}

type Crumb = { name: string; url: string };

export function BreadcrumbJsonLdTrail({ items }: { items: Crumb[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem' as const,
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
