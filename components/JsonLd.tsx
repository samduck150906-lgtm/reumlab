import type { PageSeo } from '@/lib/seo';
import type { BlogPost } from '@/lib/blog-posts';
import { PAGE_SEO_MAP, SITE } from '@/lib/seo';

/**
 * JSON-LD 안전 직렬화.
 *
 * JSON.stringify 결과를 dangerouslySetInnerHTML로 그대로 넣으면, 값 안에 `</script>` 나
 * `<!--` 가 섞이는 순간 script 블록이 조기 종료돼 (1) 구조화 데이터가 통째로 깨지고
 * (2) 뒤따르는 문자열이 마크업으로 해석된다. 지금 콘텐츠에는 해당 문자열이 없지만,
 * FAQ·포트폴리오 본문이 계속 늘어나는 구조라 한 번만 섞여도 조용히 깨진다.
 * → HTML 파서가 반응하는 문자만 유니코드 이스케이프한다(JSON 의미는 그대로).
 */
function ldJson(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/** VAT 포함 정액 패키지 — 화면 표기와 1:1 일치 (price rich result 대응) */
const PACKAGE_OFFERS = [
  {
    '@type': 'Offer',
    name: '웹 스타터',
    price: '980000',
    priceCurrency: 'KRW',
    description: '원페이지 랜딩 · 모바일 반응형 · 약 5일 · 소스코드 전체 이관 · VAT 포함 정액',
    itemOffered: { '@type': 'Service', name: '웹 MVP 개발', serviceType: '웹사이트·랜딩페이지 제작' },
  },
  {
    '@type': 'Offer',
    name: '앱 라이트 MVP',
    price: '5800000',
    priceCurrency: 'KRW',
    description: 'Flutter iOS·Android 앱 MVP · 핵심 화면 3~5개 · 약 14일 · 소스코드 전체 이관 · VAT 포함 정액',
    itemOffered: { '@type': 'Service', name: '앱 MVP 개발', serviceType: 'Flutter 앱개발' },
  },
  {
    '@type': 'Offer',
    name: '앱 AI',
    price: '13800000',
    priceCurrency: 'KRW',
    description: 'AI 기능 1종(챗봇·추천·요약) + 업무 자동화 · 약 30일 · 소스코드 전체 이관 + 직접 운영 교육 · VAT 포함 정액',
    itemOffered: { '@type': 'Service', name: 'AI 외주개발·고도화', serviceType: 'AI 기능 개발' },
  },
];

export function OrganizationJsonLd() {
  const home = PAGE_SEO_MAP[''];
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    alternateName: SITE.nameEn,
    url: SITE.domain + '/',
    logo: SITE.defaultOgImage,
    founder: { '@type': 'Person', name: SITE.representative, jobTitle: '대표' },
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
      streetAddress: '동탄첨단산업1로 58, 307호',
      addressLocality: '화성시',
      addressRegion: '경기도',
      addressCountry: 'KR',
    },
    description: home.description,
    sameAs: SITE.sameAs,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: ldJson(data) }}
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
      dangerouslySetInnerHTML={{ __html: ldJson(data) }}
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
      founder: { '@type': 'Person', name: SITE.representative, jobTitle: '대표' },
      description: home.description,
      sameAs: SITE.sameAs,
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
        streetAddress: '동탄첨단산업1로 58, 307호',
        addressLocality: '화성시',
        addressRegion: '경기도',
        addressCountry: 'KR',
      },
      url: SITE.domain + '/',
      priceRange: '₩₩',
      makesOffer: PACKAGE_OFFERS,
      openingHours: ['Mo-Fr 10:00-18:00'],
      areaServed: ['KR', '서울', '경기', '수원', '화성', '용인', '동탄'],
      sameAs: SITE.sameAs,
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
      dangerouslySetInnerHTML={{ __html: ldJson({ '@context': 'https://schema.org', '@graph': graph }) }}
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
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(data) }} />
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
      dangerouslySetInnerHTML={{ __html: ldJson(data) }}
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
        streetAddress: '동탄첨단산업1로 58, 307호',
        addressLocality: '화성시',
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
      dangerouslySetInnerHTML={{ __html: ldJson({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.domain}/#website`,
    name: SITE.name,
    alternateName: SITE.nameEn,
    url: SITE.domain + '/',
    inLanguage: 'ko-KR',
    publisher: { '@id': `${SITE.domain}/#organization` },
    // SearchAction(`/blog?q=`)을 선언하고 있었으나 정적 export라 사이트 검색 기능 자체가 없다.
    // 동작하지 않는 기능을 스키마로 주장하면 "화면에 없는 정보를 스키마에 넣는" 위반이라 제거.
    // 사이트 내 검색을 실제로 붙이면 그때 다시 선언한다.
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(data) }} />
  );
}

type FaqItem = { q: string; a: string };

export function FAQPageJsonLd({ items }: { items: FaqItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(data) }} />
  );
}

/** 지역×서비스 페이지: LocalBusiness + Service + FAQPage + BreadcrumbList 그래프 */
export function RegionServiceJsonLd({
  serviceName,
  regionName,
  description,
  url,
  faqs,
  crumbs,
}: {
  serviceName: string;
  regionName: string;
  description: string;
  url: string;
  faqs: { q: string; a: string }[];
  crumbs: { name: string; url: string }[];
}) {
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'LocalBusiness',
      '@id': `${url}#localbusiness`,
      name: `${SITE.company} — ${regionName} ${serviceName}`,
      image: SITE.defaultOgImage,
      url,
      telephone: SITE.phone,
      email: SITE.email,
      priceRange: '₩₩',
      openingHours: ['Mo-Fr 10:00-18:00'],
      address: {
        '@type': 'PostalAddress',
        streetAddress: '동탄첨단산업1로 58, 307호',
        addressLocality: '화성시',
        addressRegion: '경기도',
        addressCountry: 'KR',
      },
      areaServed: { '@type': 'Place', name: regionName },
      sameAs: SITE.sameAs,
      identifier: {
        '@type': 'PropertyValue',
        name: '사업자등록번호',
        value: SITE.bizNo,
      },
    },
    {
      '@type': 'Service',
      '@id': `${url}#service`,
      name: `${regionName} ${serviceName}`,
      serviceType: serviceName,
      description,
      url,
      areaServed: { '@type': 'Place', name: regionName },
      provider: { '@id': `${SITE.domain}/#organization` },
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
  if (faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: ldJson({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  );
}

/** 업종×앱개발 페이지: Service + FAQPage + BreadcrumbList 그래프 */
export function IndustryServiceJsonLd({
  name,
  description,
  url,
  faqs,
  crumbs,
}: {
  name: string;
  description: string;
  url: string;
  faqs: { q: string; a: string }[];
  crumbs: { name: string; url: string }[];
}) {
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Service',
      '@id': `${url}#service`,
      name,
      serviceType: name,
      description,
      url,
      areaServed: 'KR',
      provider: { '@id': `${SITE.domain}/#organization` },
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
  if (faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: ldJson({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  );
}

/** 가이드·비교 페이지: Article (+ FAQPage) + BreadcrumbList 그래프 */
export function GuideArticleJsonLd({
  title,
  description,
  url,
  publishedAt,
  keywords,
  faqs,
  crumbs,
}: {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  keywords: string[];
  faqs?: { q: string; a: string }[];
  crumbs: { name: string; url: string }[];
}) {
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: title,
      description,
      datePublished: publishedAt,
      dateModified: publishedAt,
      author: { '@type': 'Organization', name: SITE.name, url: SITE.domain + '/' },
      publisher: {
        '@type': 'Organization',
        name: SITE.name,
        logo: { '@type': 'ImageObject', url: SITE.defaultOgImage },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      keywords: keywords.join(', '),
      inLanguage: 'ko-KR',
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
  if (faqs && faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: ldJson({ '@context': 'https://schema.org', '@graph': graph }) }}
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
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(data) }} />
  );
}
