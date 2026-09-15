import type { Metadata } from 'next';
import Link from '@/components/SiteLink';
import { SITE } from '@/lib/seo';
import { GUIDES, guideCanonical, guideDecision } from '@/lib/guides';
import { COMPARES, compareCanonical, compareDecision } from '@/lib/compare';
import { getClusters, hubShouldIndex } from '@/lib/data';
import { GUIDE_FAQS, guideFaqMainEntity } from '@/lib/guide-faq';
import { getGuide } from '@/lib/guides';
import { getCompare } from '@/lib/compare';
import { BreadcrumbJsonLdTrail, JsonLdScript } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

const CANONICAL = `${SITE.domain}/guide/`;
const GUIDE_LIST = GUIDES.filter((g) => guideDecision(g.slug)?.shouldIndex);
const COMPARE_LIST = COMPARES.filter((c) => compareDecision(c.slug)?.shouldIndex);
// 색인 허용 허브(7)뿐 아니라 noindex,follow 허브(30)까지 전부 링크한다.
// noindex 허브는 자신은 색인되지 않지만 그 아래 /l/ 랜딩(색인 허용분 포함)으로
// 링크 자산을 전달하는 것이 설계 의도(docs/PROGRAMMATIC_SEO_ROUTING_INDEXING.md §4-4).
// 여기서 어떤 허브를 "링크"할지 고르는 것이지 그 허브 자체의 색인 여부를 바꾸는 게 아니다.
const HUB_SLUGS = Object.keys(getClusters())
  .filter((h) => h !== 'mobile-app') // canonical 통합 대상(→ /h/app-dev/)만 제외
  .sort();
const INDEXED_HUB_SLUGS = new Set(HUB_SLUGS.filter(hubShouldIndex));

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: { absolute: '개발 가이드 모음 | 비용·업종별 앱 만들기 — 름랩' },
  description:
    '앱개발 비용, 외주 견적, 스타트업 MVP, 업종별 앱 만들기까지 개발 전 확인할 실전 가이드를 모았습니다. Flutter vs React Native 같은 선택 비교도 함께 정리했습니다.',
  keywords: ['앱개발 비용 가이드', '외주 견적', '업종별 앱 만들기', 'MVP 개발 가이드', '개발 비교'],
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: CANONICAL,
    siteName: SITE.name,
    title: '개발 가이드 모음 | 름랩',
    description: '앱개발 비용·견적·MVP·업종별 앱 만들기까지 실전 가이드 모음.',
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: '개발 가이드 모음 — 름랩' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '개발 가이드 모음 | 름랩',
    description: '앱개발 비용·견적·MVP·업종별 앱 만들기까지 실전 가이드 모음.',
    images: [SITE.defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function GuideHubPage() {
  const crumbs = [
    { name: '홈', url: `${SITE.domain}/` },
    { name: '개발 가이드', url: CANONICAL },
  ];
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${CANONICAL}#collection`,
    name: '개발 가이드 모음',
    url: CANONICAL,
    inLanguage: 'ko-KR',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: GUIDE_LIST.length + COMPARE_LIST.length,
      itemListElement: [
        ...GUIDE_LIST.map((g, i) => ({ '@type': 'ListItem', position: i + 1, name: g.title, url: guideCanonical(g.slug) })),
        ...COMPARE_LIST.map((c, i) => ({
          '@type': 'ListItem',
          position: GUIDE_LIST.length + i + 1,
          name: c.title,
          url: compareCanonical(c.slug),
        })),
      ],
    },
    // 이 페이지의 FAQ 를 별도 노드로 두고 여기서 참조만 한다.
    // ItemList(가이드 목록)를 Question 배열로 덮어쓰지 않는다 — 목록이 이 페이지의 주 콘텐츠다.
    hasPart: { '@id': `${CANONICAL}#faq` },
  };

  /**
   * 본문 FAQ 와 같은 배열(lib/guide-faq.ts)에서 만든다.
   * 화면에 없는 질문이 스키마에만 생기지 않도록 원본을 하나로 유지한다.
   */
  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${CANONICAL}#faq`,
    inLanguage: 'ko-KR',
    isPartOf: { '@id': `${CANONICAL}#collection` },
    mainEntity: guideFaqMainEntity(),
  };

  /** relatedLinks 의 slug 를 실제 가이드·비교 글로 해석한다. 없는 slug 는 렌더하지 않는다. */
  const resolveFaqLink = (link: { kind: 'guide' | 'compare'; slug: string }) => {
    if (link.kind === 'guide') {
      const g = getGuide(link.slug);
      return g ? { href: `/guide/${link.slug}/`, label: g.h1 } : null;
    }
    const c = getCompare(link.slug);
    return c ? { href: `/compare/${link.slug}/`, label: c.h1 } : null;
  };

  return (
    <>
      <BreadcrumbJsonLdTrail items={crumbs} />
      <JsonLdScript data={itemList} />
      <JsonLdScript data={faqPage} />
      <main>
        <article className="dynamic-page">
          <nav className="breadcrumb" aria-label="breadcrumb">
            <Link href="/">홈</Link>
            {' / '}
            <span>개발 가이드</span>
          </nav>

          <div className="section-inner">
            <p className="section-tag">가이드 인덱스</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)' }}>
              개발 가이드 모음 — 비용·견적·업종별 앱 만들기
            </h1>
            <p className="hub-intro" style={{ marginTop: 12 }}>
              앱·웹 개발을 맡기기 전에 확인하면 좋은 실전 가이드를 모았습니다. 비용이 어떻게 정해지는지, 견적을 빨리 받으려면
              무엇을 준비해야 하는지, 업종별로 앱을 만들 때 무엇부터 봐야 하는지를 정리했습니다. Flutter vs React Native처럼
              선택이 갈리는 주제는 비교 글로 따로 정리했습니다.
            </p>
            <div className="cta-buttons" style={{ marginTop: 20 }}>
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_guide_hub_call">
                📞 {SITE.phone} 전화 상담
              </a>
              <Link href="/app/" className="btn-outline" data-analytics="cta_guide_hub_industry">
                업종별 앱개발 보기
              </Link>
            </div>
          </div>

          <section className="section-inner" style={{ paddingTop: 8 }} aria-labelledby="editorial-policy">
            <h2 id="editorial-policy" className="section-title" style={{ fontSize: '1.15rem' }}>작성·검수 원칙</h2>
            <p className="hub-intro">
              가격과 기간은 름랩이 공개한 패키지 원문을 기준으로 쓰고, 외부 정책은 운영사의 공식 문서를
              연결합니다. 근거가 없는 시장 평균·성공률·성과 수치는 만들지 않으며, 실제로 본문이나 출처를
              고친 날만 수정일로 표시합니다. 정정이 필요하면 <a href={`mailto:${SITE.email}`}>{SITE.email}</a>로 알려 주세요.
            </p>
          </section>

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.3rem' }}>가이드 ({GUIDE_LIST.length})</h2>
            <div className="link-grid">
              {GUIDE_LIST.map((g) => (
                <Link key={g.slug} href={`/guide/${g.slug}/`}>{g.h1}</Link>
              ))}
            </div>
          </div>

          {COMPARE_LIST.length > 0 && (
            <div className="section-inner" style={{ paddingTop: 8 }}>
              <h2 className="section-title" style={{ fontSize: '1.3rem' }}>비교 ({COMPARE_LIST.length})</h2>
              <div className="link-grid">
                {COMPARE_LIST.map((c) => (
                  <Link key={c.slug} href={`/compare/${c.slug}/`}>{c.h1}</Link>
                ))}
              </div>
            </div>
          )}

          {HUB_SLUGS.length > 0 && (
            <div className="section-inner" style={{ paddingTop: 8 }}>
              <h2 className="section-title" style={{ fontSize: '1.15rem' }}>주제별 모음 더 보기</h2>
              <div className="link-grid">
                {[...HUB_SLUGS]
                  .sort((a, b) => Number(INDEXED_HUB_SLUGS.has(b)) - Number(INDEXED_HUB_SLUGS.has(a)))
                  .map((h) => (
                    <Link key={h} href={`/h/${h}/`}>{h} 관련 글 모음</Link>
                  ))}
              </div>
            </div>
          )}

          <div className="section-inner" style={{ paddingTop: 8 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>관련 인덱스·서비스</h2>
            <div className="link-grid">
              <Link href="/app/">업종별 앱개발(기능)</Link>
              <Link href="/cost/">업종별 앱 개발 비용</Link>
              <Link href="/solution/">업종별 솔루션 구축</Link>
              <Link href="/blog/">블로그</Link>
            </div>
          </div>

          {/*
            본문 FAQ — 위 faqPage 노드와 같은 배열(GUIDE_FAQS)에서 렌더한다.
            기존 .faq-grid/.faq-item/.faq-q/.faq-a 스타일을 그대로 쓴다(새 색·폰트·카드 없음).
            항상 펼쳐진 정적 마크업이라 JS 없이도 질문과 답변을 모두 읽을 수 있다.
            ".faq-q::before" 의 "Q." 는 CSS 장식이라 본문 텍스트에 섞이지 않는다.
          */}
          <section className="section-inner" style={{ paddingTop: 8 }} aria-labelledby="guide-faq">
            <h2 id="guide-faq" className="section-title" style={{ fontSize: '1.3rem' }}>
              가이드를 읽기 전 자주 묻는 질문
            </h2>
            <div className="faq-grid" style={{ marginTop: 20 }}>
              {GUIDE_FAQS.map((f) => {
                const links = (f.relatedLinks ?? []).map(resolveFaqLink).filter(Boolean) as {
                  href: string;
                  label: string;
                }[];
                return (
                  <div className="faq-item" key={f.id} id={f.id}>
                    <p className="faq-q">{f.q}</p>
                    <p className="faq-a">{f.a}</p>
                    {links.length > 0 && (
                      <p className="faq-a" style={{ marginTop: 10 }}>
                        {links.map((l, i) => (
                          <span key={l.href}>
                            {i > 0 ? ' · ' : ''}
                            <Link href={l.href}>{l.label}</Link>
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <div className="cta" style={{ marginTop: 24 }}>
            <h2 className="section-title" style={{ fontSize: '1.15rem' }}>궁금한 점, 바로 여쭤보세요</h2>
            <p className="hub-intro">가이드로 감이 안 잡히면 지금 상태만 알려 주셔도 견적·방향을 함께 잡아 드립니다.</p>
            <div className="cta-buttons">
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_guide_hub_call_bottom">
                📞 {SITE.phone} 전화 상담
              </a>
              <a href={`mailto:${SITE.email}`} className="btn-outline" data-analytics="cta_guide_hub_email">
                ✉️ 이메일 문의
              </a>
            </div>
          </div>
        </article>
      </main>
      <BusinessFooter topExtra={<Link href="/app/">← 업종별 앱개발 인덱스로</Link>} />
    </>
  );
}
