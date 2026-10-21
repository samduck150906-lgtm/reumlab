import type { AgencyPage } from '@/lib/development-agency/types';
import { AGENCY_BASE, AGENCY_DOMAIN, agencyHref } from '@/lib/development-agency/types';
import { SITE } from '@/lib/seo';
import BusinessFooter from '@/components/BusinessFooter';
import styles from './agency.module.css';
import AgencyContactVisibility from './AgencyContactVisibility';

export default function AgencyArticle({ page, directory }: { page: AgencyPage; directory?: readonly AgencyPage[] }) {
  const isHub = page.slug === '';
  const directoryGroups = directory ? [...new Set(directory.map(item => item.serviceAxis))].map(axis => ({
    axis, pages: directory.filter(item => item.serviceAxis === axis).sort((a, b) => a.primaryKeyword.localeCompare(b.primaryKeyword, 'ko')),
  })) : [];
  const canonical = `${AGENCY_DOMAIN}${agencyHref(page)}`;
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage', '@id': `${canonical}#webpage`, url: canonical,
        name: page.h1, description: page.description, inLanguage: 'ko-KR',
        dateModified: page.updatedAt,
        isPartOf: { '@id': `${AGENCY_DOMAIN}/#website` },
        about: { '@id': `${canonical}#service` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
      },
      {
        '@type': 'Service', '@id': `${canonical}#service`, url: canonical,
        name: page.primaryKeyword, description: page.summary,
        provider: { '@id': `${AGENCY_DOMAIN}/#organization` },
        serviceType: page.serviceAxis,
      },
      {
        '@type': 'BreadcrumbList', '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '름랩', item: `${AGENCY_DOMAIN}/` },
          { '@type': 'ListItem', position: 2, name: '개발 의뢰 범위 안내', item: `${AGENCY_DOMAIN}${AGENCY_BASE}` },
          ...(!isHub ? [{ '@type': 'ListItem', position: 3, name: page.h1, item: canonical }] : []),
        ],
      },
      {
        '@type': 'FAQPage', '@id': `${canonical}#faq`,
        mainEntity: page.faq.map(item => ({
          '@type': 'Question', name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };
  return (
    <>
      <AgencyContactVisibility pageKey={page.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, '\\u003c') }} />
      <a href="#agency-main" className={styles.skip}>본문으로 이동</a>
      <main id="agency-main" tabIndex={-1} className={styles.page}>
        <header id="agency-hero" className={styles.hero}>
          <nav aria-label="현재 위치" className={styles.breadcrumb}>
            <a href="/">름랩</a><span aria-hidden="true">/</span>
            {isHub ? <span>개발 의뢰 범위 안내</span> : <><a href={AGENCY_BASE}>개발 의뢰 범위 안내</a><span aria-hidden="true">/</span><span>{page.primaryKeyword}</span></>}
          </nav>
          <p className={styles.eyebrow}>{page.serviceAxis} · 기획과 검수 기준</p>
          <h1>{page.h1}</h1>
          <p className={styles.summary}>{page.summary}</p>
          <div className={styles.actions}>
            <a href="/#contact" className={styles.primary}>필요한 개발 범위 상담하기</a>
            <a href="#agency-outline" className={styles.secondary}>확인할 항목 보기</a>
          </div>
          <p className={styles.caption}>기능과 연동 범위는 현재 운영 자료를 확인한 뒤 정합니다.</p>
        </header>
        <div className={styles.reading}>
          <aside id="agency-outline" className={styles.outline}>
            <nav aria-label="이 글의 목차">
              <strong>이 글에서 확인할 내용</strong>
              <ol>
                {directory && <li><a href="#agency-directory">업무별 개발 범위 찾기</a></li>}
                {page.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.heading}</a></li>)}
                <li><a href="#agency-faq">자주 묻는 질문</a></li>
                <li><a href="#agency-related">함께 검토할 개발 범위</a></li>
              </ol>
            </nav>
          </aside>
          <article className={styles.article} aria-label={page.h1}>
            {directory && <section id="agency-directory" className={styles.section}>
              <h2>업무별 개발 범위 찾기</h2>
              <p>서비스별 목록을 펼쳐 지금 결정해야 할 운영 문제를 선택하세요. 각 안내에서 필요한 자료와 역할, 실패 상황, 검수·인수 항목을 확인할 수 있습니다.</p>
              <nav aria-label="업무별 개발 안내">
              {directoryGroups.map(group => <details key={group.axis} className={styles.directoryGroup}>
                <summary><span>{group.axis}</span><span className={styles.directoryCount}>{group.pages.length}개 안내</span></summary>
                <ul className={styles.hubGrid}>{group.pages.map(item => <li key={item.slug} className={styles.hubCard}>
                  <h3><a href={agencyHref(item)}>{item.primaryKeyword}</a></h3>
                  <p>{item.description}</p>
                </li>)}</ul>
              </details>)}
              </nav>
            </section>}
            {page.sections.map((section, index) => {
              const paragraphs = section.fields.flatMap(field => [...page[field]]);
              return (
                <section key={section.id} id={section.id} className={styles.section}>
                  <p className={styles.sectionNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')}</p>
                  <h2>{section.heading}</h2>
                  {section.format === 'steps'
                    ? <ol className={styles.steps}>{paragraphs.map((text, i) => <li key={i}>{text}</li>)}</ol>
                    : section.format === 'cards'
                      ? <ul className={styles.cards}>{paragraphs.map((text, i) => <li key={i}>{text}</li>)}</ul>
                      : paragraphs.map((text, i) => <p key={i}>{text}</p>)}
                </section>
              );
            })}
            <section id="agency-faq" className={styles.section}>
              <h2>{page.primaryKeyword} 자주 묻는 질문</h2>
              <div className={styles.faq}>
                {page.faq.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
              </div>
            </section>
            <section id="agency-related" className={styles.section}>
              <h2>함께 검토할 개발 범위</h2>
              <ul className={styles.related}>
                {page.relatedRoutes.map(link => <li key={link.href}><a href={link.href}>{link.label}</a><p>{link.reason}</p></li>)}
              </ul>
            </section>
            {page.evidenceSources.length > 0 && <section className={styles.sources} aria-label="설계 전 확인할 공식 자료">
              <h2>설계 전 확인할 공식 자료</h2>
              <ul>{page.evidenceSources.map(source => <li key={source.url}><a href={source.url} rel="noopener noreferrer" target="_blank">{source.title}</a><p>{source.use}</p></li>)}</ul>
            </section>}
            <section className={styles.contact} aria-labelledby="agency-contact-title">
              <h2 id="agency-contact-title">현재 업무 자료로 개발 범위를 정리해 보세요</h2>
              <p>{page.ctaContext}</p>
              <a href="/#contact" className={styles.primary}>프로젝트 상담하기</a>
              <p className={styles.phone}><a href={SITE.phoneHref}>{SITE.phone}</a></p>
            </section>
          </article>
        </div>
      </main>
      <BusinessFooter topExtra={isHub ? <span>개발 의뢰 범위 안내</span> : <a href={AGENCY_BASE}>개발 의뢰 범위 안내로 돌아가기</a>} />
    </>
  );
}
