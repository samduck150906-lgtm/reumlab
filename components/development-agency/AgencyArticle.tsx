import type { AgencyPage } from '@/lib/development-agency/types';
import { AGENCY_BASE, AGENCY_DOMAIN, agencyHref } from '@/lib/development-agency/types';
import { SITE } from '@/lib/seo';
import BusinessFooter from '@/components/BusinessFooter';
import styles from './agency.module.css';
import AgencyContactVisibility from './AgencyContactVisibility';
import { agencySiblings } from '@/lib/development-agency/siblings';
import { AGENCY_CATEGORIES, AGENCY_UNCATEGORIZED, agencyCardSummary, agencyCategoryHref, agencyCategoryOf, agencyCategoryPages } from '@/lib/development-agency/categories';

export default function AgencyArticle({ page, directory }: { page: AgencyPage; directory?: readonly AgencyPage[] }) {
  const isHub = page.slug === '';
  // 같은 업종의 다른 범위·같은 범위의 이웃 업종 — 허브 한 곳에만 매달린 상세 페이지를 서로 잇는다(siblings.ts 참고)
  const siblings = isHub ? null : agencySiblings(page);
  /*
    루트 허브는 범위 10개(하위 허브)와 범위 밖 안내만 싣는다. 예전에는 directory(상세 1,795개 전부)를
    접힌 목록으로 여기 다 그려 HTML 이 2.4MB 였다 — lib/development-agency/categories.ts 머리말 참고.
    directory 는 "루트 허브로 렌더한다"는 표시로만 쓴다.
  */
  const uncategorized = directory ? [...AGENCY_UNCATEGORIZED].sort((a, b) => a.primaryKeyword.localeCompare(b.primaryKeyword, 'ko')) : [];
  const category = isHub ? undefined : agencyCategoryOf(page);
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
          ...(category ? [{ '@type': 'ListItem', position: 3, name: category.label, item: `${AGENCY_DOMAIN}${agencyCategoryHref(category)}` }] : []),
          ...(!isHub ? [{ '@type': 'ListItem', position: category ? 4 : 3, name: page.h1, item: canonical }] : []),
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
            {isHub ? <span>개발 의뢰 범위 안내</span> : <><a href={AGENCY_BASE}>개발 의뢰 범위 안내</a><span aria-hidden="true">/</span>{category && <><a href={agencyCategoryHref(category)}>{category.label}</a><span aria-hidden="true">/</span></>}<span>{page.primaryKeyword}</span></>}
          </nav>
          <p className={styles.eyebrow}>개발사 름랩 · {page.serviceAxis} 개발 범위</p>
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
                {!isHub && <li><a href="#agency-scope">름랩이 맡는 개발 범위</a></li>}
                {page.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.heading}</a></li>)}
                <li><a href="#agency-faq">자주 묻는 질문</a></li>
                <li><a href="#agency-related">함께 검토할 개발 범위</a></li>
              </ol>
            </nav>
          </aside>
          <article className={styles.article} aria-label={page.h1}>
            {directory && <section id="agency-directory" className={styles.section}>
              <h2>업무별 개발 범위 찾기</h2>
              <p>개발 범위를 먼저 고르고, 그 안에서 업종을 찾으세요. 각 범위 안내에 업종별 상세 {directory.length - uncategorized.length}건이 나뉘어 있고, 상세마다 필요한 자료와 역할, 실패 상황, 검수·인수 항목을 확인할 수 있습니다.</p>
              <nav aria-label="개발 범위별 안내">
                <ul className={styles.hubGrid}>{AGENCY_CATEGORIES.map(c => <li key={c.key} className={styles.hubCard}>
                  <h3><a href={agencyCategoryHref(c)}>{c.label} 개발 범위 — 업종별 {agencyCategoryPages(c.key).length}건</a></h3>
                  <p>{c.intro}</p>
                </li>)}</ul>
              </nav>
              <h3 style={{ marginTop: 32 }}>범위에 묶이지 않는 기술·운영 주제 {uncategorized.length}건</h3>
              <p>특정 업종보다 기술 선택과 운영 인수에 관한 안내입니다. 기존 코드 점검, 서버 이전, 다국어·CMS 홈페이지, 앱 출시·운영 인수처럼 업종을 가리지 않는 주제를 모았습니다.</p>
              <ul className={styles.hubGrid}>{uncategorized.map(item => <li key={item.slug} className={styles.hubCard}>
                <h3><a href={agencyHref(item)}>{item.primaryKeyword}</a></h3>
                <p>{agencyCardSummary(item.description)}</p>
              </li>)}</ul>
            </section>}
            {!isHub && <section id="agency-scope" className={styles.section}>
              <h2>{page.primaryKeyword}, 름랩이 맡는 개발 범위</h2>
              <p>름랩은 {page.industry} {page.serviceAxis} 개발을 맡아 화면과 권한·예외·연동 범위를 글로 먼저 확정한 뒤 만듭니다. 이 글에 적은 {page.sections.length}개 항목이 그대로 {page.industry} {page.serviceAxis} 견적 근거이자 검수 기준이 되고, 합의하지 않은 기능은 넣지 않습니다.</p>
              <ul className={styles.cards}>
                <li><strong>진행 순서</strong> — {page.industry}에서 지금 쓰는 양식과 담당자 확인 순서를 받고, 공식 자료를 확인하고, {page.serviceAxis} 범위를 글로 확정한 뒤 개발하고, 검수 기준으로 함께 확인하고 인수합니다.</li>
                <li><strong>드리는 산출물</strong> — {page.primaryKeyword} 범위에서 동작하는 화면과 권한표, 예외 처리 목록, 연동 항목과 실패 처리, 검수 기준표, 인수 문서를 함께 드립니다.</li>
                <li><strong>설계 전에 확인한 자료</strong> — {page.industry} {page.serviceAxis} 설계에 앞서 공식 자료 {page.evidenceSources.length}건을 읽고, 쓴 범위와 쓰지 않은 범위를 이 글 아래에 그대로 적었습니다.</li>
                <li><strong>범위에 넣지 않는 것</strong> — {page.industry} 운영 대행과 콘텐츠 작성·광고 집행은 {page.serviceAxis} 개발 범위에 넣지 않고, 법령 해당 여부를 화면이 판정하게 만들지 않습니다.</li>
              </ul>
              <p>지금 {page.primaryKeyword} 범위를 정하는 중이라면 쓰고 있는 양식과 자주 되돌아가는 예외를 알려 주시면 름랩이 그 자료로 범위를 좁혀 드립니다.</p>
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
                {category && <li><a href={agencyCategoryHref(category)}>{category.label} 개발 범위 안내 — 업종별 {agencyCategoryPages(category.key).length}건</a><p>{page.industry} 외 다른 업종의 {category.label} 개발 범위를 한 목록에서 볼 수 있습니다.</p></li>}
              </ul>
            </section>
            {siblings && siblings.sameIndustry.length > 0 && <section className={styles.section} aria-labelledby="agency-same-industry">
              <h2 id="agency-same-industry">{page.industry} — 다른 개발 범위</h2>
              <ul className={styles.related}>
                {siblings.sameIndustry.map(item => <li key={item.slug}><a href={agencyHref(item)}>{item.primaryKeyword}</a><p>{item.serviceAxis}</p></li>)}
              </ul>
            </section>}
            {siblings && siblings.sameAxis.length > 0 && <section className={styles.section} aria-labelledby="agency-same-axis">
              <h2 id="agency-same-axis">{page.serviceAxis} — 다른 업종</h2>
              <ul className={styles.related}>
                {siblings.sameAxis.map(item => <li key={item.slug}><a href={agencyHref(item)}>{item.primaryKeyword}</a><p>{item.industry}</p></li>)}
              </ul>
            </section>}
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
