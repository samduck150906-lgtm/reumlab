import { SITE } from '@/lib/seo';
import BusinessFooter from '@/components/BusinessFooter';
import { AGENCY_BASE, AGENCY_DOMAIN, agencyHref } from '@/lib/development-agency/types';
import {
  AGENCY_CATEGORIES,
  agencyCardSummary,
  agencyCategoryHref,
  agencyCategoryPages,
  type AgencyCategory,
} from '@/lib/development-agency/categories';
import styles from './agency.module.css';
import AgencyContactVisibility from './AgencyContactVisibility';

/**
 * 범위별 하위 허브 — /development-agency/<key>/
 * 그 범위의 상세 안내 전부를 한 목록으로 싣는다(상세가 루트 허브 한 곳에만 매달리지 않게).
 * 이유·구조는 lib/development-agency/categories.ts 머리말 참고.
 */
export default function AgencyCategoryHub({ category }: { category: AgencyCategory }) {
  const pages = agencyCategoryPages(category.key);
  const canonical = `${AGENCY_DOMAIN}${agencyCategoryHref(category)}`;
  const industries = new Set(pages.map((p) => p.industry)).size;
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage', '@id': `${canonical}#webpage`, url: canonical,
        name: category.title, description: category.description, inLanguage: 'ko-KR',
        isPartOf: { '@id': `${AGENCY_DOMAIN}/#website` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
        about: { '@id': `${AGENCY_DOMAIN}/#organization` },
      },
      {
        '@type': 'BreadcrumbList', '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '름랩', item: `${AGENCY_DOMAIN}/` },
          { '@type': 'ListItem', position: 2, name: '개발 의뢰 범위 안내', item: `${AGENCY_DOMAIN}${AGENCY_BASE}` },
          { '@type': 'ListItem', position: 3, name: category.label, item: canonical },
        ],
      },
    ],
  };
  const others = AGENCY_CATEGORIES.filter((c) => c.key !== category.key);

  return (
    <>
      <AgencyContactVisibility pageKey={`category:${category.key}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, '\\u003c') }} />
      <a href="#agency-main" className={styles.skip}>본문으로 이동</a>
      <main id="agency-main" tabIndex={-1} className={styles.page}>
        <header id="agency-hero" className={styles.hero}>
          <nav aria-label="현재 위치" className={styles.breadcrumb}>
            <a href="/">름랩</a><span aria-hidden="true">/</span>
            <a href={AGENCY_BASE}>개발 의뢰 범위 안내</a><span aria-hidden="true">/</span>
            <span>{category.label}</span>
          </nav>
          <p className={styles.eyebrow}>개발사 름랩 · {category.label} 개발 범위</p>
          <h1>{category.label} 개발 범위 — 업종별 안내 {pages.length}건</h1>
          <p className={styles.summary}>{category.intro}</p>
          <div className={styles.actions}>
            <a href="/#contact" className={styles.primary}>필요한 개발 범위 상담하기</a>
            <a href={category.service.href} className={styles.secondary}>{category.service.label} 서비스 보기</a>
          </div>
          <p className={styles.caption}>업종 {industries}개 · 각 안내는 필요한 자료와 역할, 실패 상황, 검수·인수 항목을 담고 있습니다. 기능과 연동 범위는 현재 운영 자료를 확인한 뒤 정합니다.</p>
        </header>
        <div className={styles.article} style={{ maxWidth: 1180, margin: '0 auto' }}>
          <section id="agency-list" className={styles.section} aria-labelledby="agency-list-title">
            <h2 id="agency-list-title">{category.label} — 업종별 개발 범위 안내</h2>
            <p>업종을 고르면 그 업종에서 지금 결정해야 할 운영 문제와 개발 범위를 확인할 수 있습니다. 같은 업종의 다른 범위(홈페이지·앱·관리 프로그램 등)는 각 안내 아래에서 이어집니다.</p>
            <ul className={styles.hubGrid}>
              {pages.map((item) => (
                <li key={item.slug} className={styles.hubCard}>
                  <h3><a href={agencyHref(item)}>{item.primaryKeyword}</a></h3>
                  <p>{agencyCardSummary(item.description)}</p>
                </li>
              ))}
            </ul>
          </section>
          <section className={styles.section} aria-labelledby="agency-other-categories">
            <h2 id="agency-other-categories">다른 개발 범위</h2>
            <ul className={styles.related}>
              {others.map((c) => (
                <li key={c.key}><a href={agencyCategoryHref(c)}>{c.label} 개발 범위 안내 — {agencyCategoryPages(c.key).length}건</a><p>{c.description}</p></li>
              ))}
              <li><a href={AGENCY_BASE}>개발 의뢰 범위 안내 전체</a><p>범위를 정하기 전에 읽는 안내와, 범위에 묶이지 않는 기술·운영 주제 안내입니다.</p></li>
            </ul>
          </section>
          <section className={styles.contact} aria-labelledby="agency-contact-title">
            <h2 id="agency-contact-title">현재 업무 자료로 개발 범위를 정리해 보세요</h2>
            <p>지금 쓰는 양식과 자주 되돌아가는 예외를 알려 주시면 {category.label} 범위를 그 자료로 좁혀 드립니다. 확정된 범위는 VAT 포함 정액으로 진행하고, 계약 범위의 소스코드와 운영 권한을 이관합니다.</p>
            <a href="/#contact" className={styles.primary}>프로젝트 상담하기</a>
            <p className={styles.phone}><a href={SITE.phoneHref}>{SITE.phone}</a></p>
          </section>
        </div>
      </main>
      <BusinessFooter topExtra={<a href={AGENCY_BASE}>← 개발 의뢰 범위 안내로</a>} />
    </>
  );
}
