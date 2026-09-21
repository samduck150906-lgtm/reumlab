import type { Metadata } from 'next';
import Link from '@/components/SiteLink';
import BusinessFooter from '@/components/BusinessFooter';
import { ServiceWebPageJsonLd } from '@/components/JsonLd';
import LandingInquiryForm from '@/components/LandingInquiryForm';
import { robotsFor } from '@/lib/index-quality';
import { SITE } from '@/lib/seo';
import { guidesForService, resolveCluster } from '@/lib/content-cluster';
import { getGuide } from '@/lib/guides';
import { getCompare } from '@/lib/compare';
import { getBlogPostBySlug } from '@/lib/blog-posts';
import * as E from '@/lib/enternal-ai';
import styles from './enternal-ai.module.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: { absolute: E.ENTERNAL_TITLE },
  description: E.ENTERNAL_DESCRIPTION,
  keywords: E.ENTERNAL_KEYWORDS,
  alternates: { canonical: E.ENTERNAL_CANONICAL },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: E.ENTERNAL_CANONICAL,
    siteName: SITE.name,
    title: E.ENTERNAL_TITLE,
    description: E.ENTERNAL_DESCRIPTION,
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: 'Enternal AI by ReumLab' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: E.ENTERNAL_TITLE,
    description: E.ENTERNAL_DESCRIPTION,
    images: [SITE.defaultOgImage],
  },
  robots: robotsFor(E.enternalAiDecision()),
};

const crumbs = [
  { name: '홈', url: `${SITE.domain}/` },
  { name: 'Enternal AI', url: E.ENTERNAL_CANONICAL },
];

const statusById = new Map(E.ENTERNAL_STATUSES.map((status) => [status.id, status]));

export default function EnternalAiPage() {
  const decisionGuides = resolveCluster(guidesForService('/enternal-ai/'), {
    guide: getGuide,
    compare: getCompare,
    blog: getBlogPostBySlug,
  });

  return (
    <>
      <ServiceWebPageJsonLd
        url={E.ENTERNAL_CANONICAL}
        name="Enternal AI 기업용 Private AI PoC"
        description={E.ENTERNAL_DESCRIPTION}
        serviceType="기업용 Private AI 설계·PoC"
        crumbs={crumbs}
        faqs={E.ENTERNAL_FAQS}
      />

      <main className={styles.page}>
        <section className={styles.heroShell} aria-labelledby="enternal-hero-title">
          <nav className={styles.breadcrumb} aria-label="breadcrumb">
            <Link href="/">홈</Link>
            <span aria-hidden="true">/</span>
            <span>Enternal AI</span>
          </nav>

          <header className={styles.hero}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>ENTERNAL AI BY REUMLAB</p>
              <h1 id="enternal-hero-title">{E.ENTERNAL_H1}</h1>
              <p className={styles.lead}>{E.ENTERNAL_LEAD}</p>
              <p className={styles.stageNotice}>
                <strong>현재 제공</strong> 기업 환경 진단·PoC <span aria-hidden="true">·</span>{' '}
                <strong>목표 구조</strong> 로컬 추론·자체 사전학습 기반
              </p>
              <div className={styles.heroActions}>
                <a className={styles.primaryButton} href="#inquiry" data-analytics="cta_enternal_hero_inquiry">
                  기업 도입 상담하기 <span aria-hidden="true">→</span>
                </a>
                <a className={styles.secondaryButton} href="#architecture" data-analytics="cta_enternal_architecture">
                  목표 구조 확인하기
                </a>
              </div>
            </div>

            <div className={styles.heroVisual} aria-hidden="true">
              <div className={styles.visualGrid} />
              <div className={styles.dataArchitecture}>
                <div className={styles.systemBar}>
                  <span>ENTERNAL / CONTROLLED DATA PATH</span>
                  <span className={styles.systemStatus}>PoC architecture</span>
                </div>
                <div className={styles.dataCanvas}>
                  <div className={`${styles.dataNode} ${styles.dataSource}`}>
                    <small>01 · INPUT</small>
                    <strong>사내 문서·업무 데이터</strong>
                    <span>Documents · ERP · CRM</span>
                  </div>
                  <div className={`${styles.dataNode} ${styles.dataPolicy}`}>
                    <small>02 · CONTROL</small>
                    <strong>권한·정책 계층</strong>
                    <span>Identity · Policy · Audit</span>
                  </div>
                  <div className={`${styles.dataNode} ${styles.dataInference}`}>
                    <small>03 · PROCESS</small>
                    <strong>Private inference</strong>
                    <span>Approved model path</span>
                  </div>
                  <div className={`${styles.dataNode} ${styles.dataOutput}`}>
                    <small>04 · OUTPUT</small>
                    <strong>검증된 답변·업무 연결</strong>
                    <span>Evidence · Review · Action</span>
                  </div>
                  <span className={`${styles.dataLink} ${styles.linkTop}`} />
                  <span className={`${styles.dataLink} ${styles.linkRight}`} />
                  <span className={`${styles.dataLink} ${styles.linkBottom}`} />
                </div>
                <div className={styles.telemetry}>
                  <span>LOCAL-FIRST</span>
                  <span>TRACEABLE</span>
                  <span>HUMAN CONTROL</span>
                </div>
              </div>
            </div>
          </header>
        </section>

        <section className={styles.definition} aria-labelledby="definition-title">
          <p className={styles.sectionKicker}>한 문장 정의</p>
          <h2 id="definition-title">Enternal AI란?</h2>
          <p>{E.ENTERNAL_ENTITY_STATEMENT}</p>
          <div className={styles.statusGrid} aria-label="제품 단계">
            {E.ENTERNAL_STATUSES.map((status) => (
              <article className={styles.statusCard} data-status={status.id} key={status.id}>
                <strong>{status.label}</strong>
                <p>{status.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="problem-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionKicker}>Why Enternal</p>
            <h2 id="problem-title">기업용 AI는 답변보다 데이터 경로부터 설명할 수 있어야 합니다</h2>
            <p>외부 AI가 위험하다고 단정하지 않습니다. 어떤 자료가 어디를 거치고 누가 책임지는지 확인할 수 있어야 도입 여부를 판단할 수 있습니다.</p>
          </div>
          <div className={styles.problemGrid}>
            {E.ENTERNAL_PROBLEMS.map((problem, index) => (
              <article className={styles.problemCard} key={problem.id}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{problem.title}</h3>
                <p>{problem.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.architecture} id="architecture" aria-labelledby="architecture-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionKicker}>Target architecture</p>
            <h2 id="architecture-title">직원의 질문에서 근거가 연결된 답변까지</h2>
            <p className={styles.targetLabel}>목표 구조 · PoC에서 검증</p>
            <p>최종 모델, 통신 경로와 배포 방식은 고객 환경과 선택 모델에 따라 달라집니다.</p>
          </div>
          <ol className={styles.flow}>
            {E.ENTERNAL_FLOW.map((step, index) => (
              <li data-enternal-flow key={step.id}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.label}</h3>
                <p>{step.detail}</p>
                <small>{step.limit}</small>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section} aria-labelledby="capability-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionKicker}>Capability</p>
            <h2 id="capability-title">현재 범위와 개발 방향을 구분한 기능</h2>
            <p>기능 이름만 나열하지 않고 필요한 입력, 기대 결과와 사람의 책임 경계를 함께 설명합니다.</p>
          </div>
          <div className={styles.capabilityGrid}>
            {E.ENTERNAL_CAPABILITIES.map((capability) => {
              const status = statusById.get(capability.status)!;
              return (
                <article className={styles.capabilityCard} key={capability.id}>
                  <span className={styles.statusBadge} data-status={capability.status}>{status.label}</span>
                  <h3>{capability.title}</h3>
                  <dl>
                    <div><dt>입력</dt><dd>{capability.input}</dd></div>
                    <div><dt>결과</dt><dd>{capability.output}</dd></div>
                    <div><dt>책임 경계</dt><dd>{capability.boundary}</dd></div>
                  </dl>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.comparisonSection} aria-labelledby="comparison-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionKicker}>Architecture comparison</p>
            <h2 id="comparison-title">외부 API형 AI와 Enternal 목표 구조의 차이</h2>
            <p>두 방식은 목적과 조건이 다릅니다. 빠른 시작과 통제 범위를 함께 비교한 뒤 업무에 맞는 경로를 정합니다.</p>
          </div>
          <div className={styles.comparisonLegend} aria-hidden="true">
            <span>일반 외부 API형</span><span>Enternal 목표 구조</span>
          </div>
          <div className={styles.comparisonGrid}>
            {E.ENTERNAL_COMPARISON.map((item) => (
              <article data-enternal-comparison key={item.id}>
                <h3>{item.item}</h3>
                <div><strong>일반 외부 API형</strong><p>{item.externalApi}</p></div>
                <div><strong>Enternal 목표 구조</strong><p>{item.enternalTarget}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="process-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionKicker}>PoC process</p>
            <h2 id="process-title">한 가지 업무를 측정한 뒤 도입을 결정합니다</h2>
          </div>
          <ol className={styles.processList}>
            {E.ENTERNAL_PROCESS.map((step, index) => (
              <li key={step.id}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><h3>{step.title}</h3><p>{step.detail}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section} aria-labelledby="scenario-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionKicker}>Example scenarios</p>
            <h2 id="scenario-title">업종별 적용 예시</h2>
            <p>아래 내용은 가능성을 설명하는 일반 예시이며 고객 사례나 운영 성과가 아닙니다.</p>
          </div>
          <div className={styles.scenarioGrid}>
            {E.ENTERNAL_SCENARIOS.map((scenario) => (
              <article key={scenario.id}>
                <p className={styles.exampleLabel}>적용 예시</p>
                <h3>{scenario.title}</h3>
                <p>{scenario.example}</p>
                <p className={styles.boundary}><strong>적용 경계</strong>{scenario.boundary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.technologySection} aria-labelledby="technology-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionKicker}>Technology direction</p>
            <h2 id="technology-title">Private AI를 위한 기술 개발 방향</h2>
            <p>완성된 기능과 연구 방향을 섞지 않습니다. 각 항목의 현재 단계를 함께 표시합니다.</p>
          </div>
          <div className={styles.technologyGrid}>
            {E.ENTERNAL_TECH_DIRECTIONS.map((item) => {
              const status = statusById.get(item.status)!;
              return (
                <article key={item.id}>
                  <span className={styles.statusBadge} data-status={item.status}>{status.label}</span>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="faq-title">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionKicker}>FAQ</p>
            <h2 id="faq-title">Enternal AI 자주 묻는 질문</h2>
          </div>
          <div className={styles.faqList}>
            {E.ENTERNAL_FAQS.map((faq) => (
              <details data-enternal-faq key={faq.q}>
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={styles.related} aria-labelledby="guides-title">
          <div><p className={styles.sectionKicker}>Decision guides</p><h2 id="guides-title">PoC 전에 확인할 판단 자료</h2></div>
          <nav aria-label="Enternal AI 판단 가이드">
            {decisionGuides.map((item) => <Link href={item.href} key={item.href}>{item.label}<span aria-hidden="true">→</span></Link>)}
          </nav>
        </section>

        <section className={styles.related} aria-labelledby="related-title">
          <div><p className={styles.sectionKicker}>Related services</p><h2 id="related-title">현재 필요한 서비스부터 확인하세요</h2></div>
          <nav aria-label="관련 AI 서비스">
            {E.ENTERNAL_RELATED_LINKS.map((item) => <Link href={item.href} key={item.href}>{item.label}<span aria-hidden="true">→</span></Link>)}
          </nav>
        </section>

        <section className={styles.inquiry} id="inquiry" aria-labelledby="inquiry-title">
          <div className={styles.inquiryIntro}>
            <p className={styles.sectionKicker}>Enterprise PoC inquiry</p>
            <h2 id="inquiry-title">기업 환경 진단 및 PoC 상담</h2>
            <p>검증하고 싶은 업무, 사용할 수 있는 데이터와 외부 통신 정책을 알려 주세요. 현재 가능한 범위와 먼저 확인해야 할 조건을 구분해 안내합니다.</p>
            <ul>
              <li>문의만으로 계약이나 데이터 제공이 진행되지 않습니다.</li>
              <li>민감정보를 제거한 대표 질문과 문서 유형부터 확인합니다.</li>
              <li>환경 진단 뒤 PoC 범위, 기간, 산출물과 견적을 제안합니다.</li>
            </ul>
          </div>
          <LandingInquiryForm
            landingSlug="enternal-ai"
            defaultServiceType="AI 기능·업무 자동화"
            variant="enternal-ai"
            submitLabel="Enternal AI PoC 검토 요청하기"
          />
        </section>
      </main>

      <BusinessFooter topExtra={<Link href="/enterprise-ai/">← 현재 가능한 사내 AI 구축으로</Link>} />
    </>
  );
}
