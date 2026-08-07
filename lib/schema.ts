/**
 * 구조화 데이터(JSON-LD) 노드 단일 출처.
 *
 * 왜 이 파일이 있나
 *  이전에는 Organization 이 네 곳(components/JsonLd.tsx, index.html, purpose landing 생성기,
 *  ReumHomeGraphJsonLd)에서 따로 선언됐고, 그중 셋은 `@id` 가 없어 서로 다른 엔티티로 읽혔다.
 *  동시에 Service/ProfessionalService 노드들은 `provider: {"@id": ".../#organization"}` 를
 *  참조했는데 정작 그 페이지에 `#organization` 노드가 없어 참조가 끊겨 있었다(dangling @id).
 *  → 노드 정의를 여기 한 곳에 두고, 모든 페이지가 같은 `@id` 를 참조하게 한다.
 *
 * 규칙
 *  - 이 파일은 순수 데이터만 만든다. 렌더(<script>)는 components/JsonLd.tsx 담당.
 *  - 값은 전부 lib/seo.ts 의 SITE(= 화면·계약에 실제로 쓰이는 정보)에서 가져온다.
 *    사이트에 근거가 없는 사업 정보는 여기서 만들어 내지 않는다.
 *  - 평점·리뷰수·수상 등 근거 없는 신뢰 신호 필드는 넣지 않는다.
 *
 * 정적 HTML(index.html)과 목적별 랜딩 생성기(scripts/generate-purpose-landings.mjs)는
 * Next 번들 밖이라 이 파일을 import 할 수 없다. 그쪽은 같은 @id·같은 값을 손으로 맞추고,
 * 각 파일 주석에 이 파일을 출처로 적어 두었다. @id 문자열을 바꾸면 그 두 곳도 함께 고칠 것.
 */
import { SITE } from './seo';

/** 사이트 전역 엔티티의 고정 @id — 페이지가 달라도 이 값은 절대 변하지 않는다. */
export const SCHEMA_ID = {
  website: `${SITE.domain}/#website`,
  organization: `${SITE.domain}/#organization`,
  /** 사업체(ProfessionalService) 노드. 지점이 아니라 단 하나의 사업장이다. */
  business: `${SITE.domain}/#business`,
} as const;

/**
 * 서비스 제공 범위 — 름랩은 동탄 사업장 한 곳에서 전국 비대면으로 진행한다.
 * 지역 랜딩페이지가 많다는 이유로 지점을 여러 개 가진 것처럼 쓰지 않는다.
 */
export const AREA_KOREA = { '@type': 'Country', name: '대한민국' } as const;

/**
 * 스키마에 넣을 절대 URL 정규화.
 *
 * 한글 슬러그 페이지(/웹개발/ 등)는 Next 가 canonical 을 퍼센트 인코딩해 내보내는데,
 * lib/seo.ts 의 canonical 문자열은 원문(한글) 그대로다. 그대로 쓰면 같은 페이지의
 * canonical 과 스키마 URL 이 표기만 다른 두 문자열이 된다.
 * → 비ASCII 문자만 인코딩한다. 인코딩 후에는 순수 ASCII 라 여러 번 통과해도 안전(멱등).
 */
export function schemaUrl(url: string): string {
  return url.replace(/[^\x00-\x7F]+/g, (s) => encodeURIComponent(s));
}

/** 사업장 주소 — 실제 공개된 단일 사업장(경기 화성 동탄). */
export function postalAddressNode() {
  return { '@type': 'PostalAddress', ...SITE.addressParts };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': SCHEMA_ID.website,
    url: SITE.domain + '/',
    name: SITE.name,
    alternateName: SITE.nameEn,
    inLanguage: 'ko-KR',
    publisher: { '@id': SCHEMA_ID.organization },
    // SearchAction 없음 — 정적 export 라 사이트 내 검색 기능이 실제로 없다.
    // 화면에 없는 기능을 스키마로 주장하지 않는다(검색 붙이면 그때 선언).
  };
}

export function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': SCHEMA_ID.organization,
    name: SITE.name,
    alternateName: SITE.nameEn,
    legalName: SITE.company,
    url: SITE.domain + '/',
    logo: SITE.defaultOgImage,
    email: SITE.email,
    telephone: SITE.phone,
    address: postalAddressNode(),
    founder: { '@type': 'Person', name: SITE.representative, jobTitle: '대표' },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: SITE.phone,
      email: SITE.email,
      areaServed: 'KR',
      availableLanguage: ['Korean'],
    },
    description: SITE.description,
    // 사업자등록번호 — 공개 정보이며 화면(BusinessFooter)에도 표기된다.
    identifier: {
      '@type': 'PropertyValue',
      name: '사업자등록번호',
      value: SITE.bizNo,
    },
    // 실제로 개설·운영 중인 채널만. 추정 URL 금지(lib/seo.ts SITE.sameAs 가 단일 출처).
    sameAs: SITE.sameAs,
  };
}

/**
 * 사업체 노드 — 앱·웹 개발 외주라는 전문 서비스업이므로 ProfessionalService.
 * (ProfessionalService 는 LocalBusiness 의 하위 타입이라 둘을 함께 선언할 필요가 없다.)
 * 사업장은 동탄 한 곳뿐이므로 이 노드는 사이트 전체에서 이 @id 하나만 존재한다.
 */
export function businessNode(description: string = SITE.description) {
  return {
    '@type': 'ProfessionalService',
    '@id': SCHEMA_ID.business,
    name: SITE.name,
    alternateName: SITE.nameEn,
    url: SITE.domain + '/',
    image: SITE.defaultOgImage,
    description,
    telephone: SITE.phone,
    email: SITE.email,
    address: postalAddressNode(),
    areaServed: AREA_KOREA,
    priceRange: '₩₩',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '10:00',
      closes: '18:00',
    },
    parentOrganization: { '@id': SCHEMA_ID.organization },
    sameAs: SITE.sameAs,
    // aggregateRating / review / award 없음 — 근거가 될 실제 데이터가 사이트에 없다.
    // 패키지 가격(Offer)은 가격표가 실제로 렌더되는 홈(index.html)에서만 선언한다.
  };
}

/**
 * 사이트 전역 그래프 — 루트 레이아웃에서 1회만 출력한다.
 * 설명은 SITE.description(사업 설명 단일 출처)을 쓴다 — 페이지별 meta description 과
 * 섞이면 같은 @id 노드가 페이지마다 다른 소개 문장을 갖게 된다.
 */
export function siteGraph(description: string = SITE.description) {
  return [websiteNode(), organizationNode(), businessNode(description)];
}

export interface ServiceNodeInput {
  /** 이 서비스 페이지의 canonical URL (절대 URL, trailing slash 포함) */
  url: string;
  /** 화면 H1 또는 서비스명 */
  name: string;
  description: string;
  /** 서비스 분류 (lib/seo.ts PILLAR_SERVICE_TYPE 등). 없으면 생략 */
  serviceType?: string;
  /**
   * 서비스 제공 지역. 기본은 전국(대한민국).
   * 지역 페이지는 그 지역을 Place 로 넘긴다 — 사업장이 아니라 "대응 가능 지역"이다.
   */
  areaServed?: Record<string, unknown>;
}

/** 서비스 페이지용 Service 노드. provider 는 항상 단일 사업체(#business)를 가리킨다. */
export function serviceNode(input: ServiceNodeInput) {
  const url = schemaUrl(input.url);
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: input.name,
    ...(input.serviceType ? { serviceType: input.serviceType } : {}),
    url,
    description: input.description,
    provider: { '@id': SCHEMA_ID.business },
    areaServed: input.areaServed ?? AREA_KOREA,
  };
}

export interface Crumb {
  name: string;
  url: string;
}

/**
 * BreadcrumbList 노드.
 * `item` 은 화면 breadcrumb UI 및 각 단계의 canonical URL 과 일치해야 한다(절대 URL).
 */
export function breadcrumbNode(items: Crumb[], pageUrl?: string) {
  return {
    '@type': 'BreadcrumbList',
    ...(pageUrl ? { '@id': `${schemaUrl(pageUrl)}#breadcrumb` } : {}),
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: schemaUrl(c.url),
    })),
  };
}
