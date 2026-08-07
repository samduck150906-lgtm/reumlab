import type { BlogPost } from '@/lib/blog-posts';
import { SITE } from '@/lib/seo';
import {
  SCHEMA_ID,
  AREA_KOREA,
  breadcrumbNode,
  serviceNode,
  siteGraph,
  type Crumb,
} from '@/lib/schema';

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

/** 단일 노드 스크립트 */
function LdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: ldJson({ '@context': 'https://schema.org', ...data }) }}
    />
  );
}

/** @graph 스크립트 — 여러 노드를 하나의 블록으로 묶어 @id 참조가 같은 문서 안에서 풀리게 한다 */
function LdGraph({ graph }: { graph: Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: ldJson({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  );
}

/**
 * 사이트 전역 엔티티 — WebSite + Organization + ProfessionalService.
 *
 * 루트 레이아웃(app/layout.tsx)에서만 호출한다. 개별 페이지에서 또 부르면
 * 같은 @id 노드가 한 문서에 두 번 나온다. 서비스·랜딩·지역 페이지는 이 노드를 다시
 * 선언하지 말고 `provider: {"@id": SCHEMA_ID.business}` 로 참조만 하면 된다.
 */
export function SiteEntityJsonLd({ description }: { description?: string } = {}) {
  return <LdGraph graph={siteGraph(description)} />;
}

/** 서비스 페이지: Service + BreadcrumbList */
export function ServiceJsonLd({
  url,
  name,
  description,
  serviceType,
  areaServed,
  crumbs,
}: {
  url: string;
  name: string;
  description: string;
  serviceType?: string;
  areaServed?: Record<string, unknown>;
  crumbs: Crumb[];
}) {
  return (
    <LdGraph
      graph={[
        serviceNode({ url, name, description, serviceType, areaServed }),
        breadcrumbNode(crumbs, url),
      ]}
    />
  );
}

/** BreadcrumbList 단독 (임의 깊이) */
export function BreadcrumbJsonLdTrail({ items, pageUrl }: { items: Crumb[]; pageUrl?: string }) {
  return <LdScript data={breadcrumbNode(items, pageUrl)} />;
}

export function ArticleJsonLd({ post, url }: { post: BlogPost; url: string }) {
  return (
    <LdScript
      data={{
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: post.title,
        description: post.description,
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        // 사이트 전역 그래프(루트 레이아웃)의 Organization 을 참조 — 별도 조직 노드를 만들지 않는다
        author: { '@id': SCHEMA_ID.organization },
        publisher: { '@id': SCHEMA_ID.organization },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        keywords: post.keywords.join(', '),
        inLanguage: 'ko-KR',
      }}
    />
  );
}

/**
 * 랜딩·허브 페이지(/l/*, /h/*, /soho) — Service + BreadcrumbList.
 *
 * 이전에는 페이지마다 ProfessionalService 를 주소·전화까지 붙여 선언했다. 그러면 지역
 * 랜딩 수백 개가 각각 별도 사업장으로 읽힌다(실제 사업장은 동탄 한 곳뿐).
 * → 사업체 노드는 루트의 #business 하나만 두고, 여기서는 provider 로 참조만 한다.
 */
export function LandingServiceJsonLd({
  name,
  description,
  url,
  serviceType,
  areaServed,
  crumbs,
}: {
  name: string;
  description: string;
  url: string;
  serviceType?: string;
  areaServed?: Record<string, unknown>;
  crumbs: Crumb[];
}) {
  return (
    <ServiceJsonLd
      url={url}
      name={name}
      description={description}
      serviceType={serviceType}
      areaServed={areaServed}
      crumbs={crumbs}
    />
  );
}

type FaqItem = { q: string; a: string };

export function FAQPageJsonLd({ items }: { items: FaqItem[] }) {
  return (
    <LdScript
      data={{
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }}
    />
  );
}

/**
 * 지역×서비스 페이지 — Service + BreadcrumbList (+ 기존 FAQPage 유지).
 *
 * 지역 페이지는 지점이 아니다. 예전에는 페이지마다 LocalBusiness 를 같은 동탄 주소로
 * 복제해 350개 지점이 있는 것처럼 보였다 → 제거하고, 지역은 Service.areaServed(Place)로만
 * 표현한다. 사업장 정보는 루트의 #business 하나가 담당한다.
 */
export function RegionServiceJsonLd({
  serviceName,
  serviceType,
  regionName,
  description,
  url,
  faqs,
  crumbs,
}: {
  serviceName: string;
  serviceType?: string;
  regionName: string;
  description: string;
  url: string;
  faqs: FaqItem[];
  crumbs: Crumb[];
}) {
  const graph: Record<string, unknown>[] = [
    serviceNode({
      url,
      name: `${regionName} ${serviceName}`,
      description,
      serviceType: serviceType ?? serviceName,
      areaServed: { '@type': 'Place', name: regionName },
    }),
    breadcrumbNode(crumbs, url),
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
  return <LdGraph graph={graph} />;
}

/** 업종×서비스 페이지 — Service + BreadcrumbList (+ 기존 FAQPage 유지) */
export function IndustryServiceJsonLd({
  name,
  serviceType,
  description,
  url,
  faqs,
  crumbs,
}: {
  name: string;
  serviceType?: string;
  description: string;
  url: string;
  faqs: FaqItem[];
  crumbs: Crumb[];
}) {
  const graph: Record<string, unknown>[] = [
    serviceNode({ url, name, description, serviceType: serviceType ?? name, areaServed: AREA_KOREA }),
    breadcrumbNode(crumbs, url),
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
  return <LdGraph graph={graph} />;
}

/** 가이드·비교 페이지 — Article + BreadcrumbList (+ 기존 FAQPage 유지) */
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
  faqs?: FaqItem[];
  crumbs: Crumb[];
}) {
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: title,
      description,
      datePublished: publishedAt,
      dateModified: publishedAt,
      author: { '@id': SCHEMA_ID.organization },
      publisher: { '@id': SCHEMA_ID.organization },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      keywords: keywords.join(', '),
      inLanguage: 'ko-KR',
    },
    breadcrumbNode(crumbs, url),
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
  return <LdGraph graph={graph} />;
}

/** 홈 URL — 브레드크럼 1단계 공용 */
export const HOME_CRUMB: Crumb = { name: '홈', url: SITE.domain + '/' };
