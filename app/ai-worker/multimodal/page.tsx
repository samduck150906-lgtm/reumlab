import type { Metadata } from 'next';
import Link from '@/components/SiteLink';
import BusinessFooter from '@/components/BusinessFooter';
import { IndustryServiceJsonLd } from '@/components/JsonLd';
import LandingInquiryForm from '@/components/LandingInquiryForm';
import { robotsFor } from '@/lib/index-quality';
import { SITE } from '@/lib/seo';
import { guidesForService, resolveCluster } from '@/lib/content-cluster';
import { getGuide } from '@/lib/guides';
import { getCompare } from '@/lib/compare';
import { getBlogPostBySlug } from '@/lib/blog-posts';
import {
  MULTIMODAL_BUSINESS_MODEL,
  MULTIMODAL_CANONICAL,
  MULTIMODAL_COMPUTER_USE_LIMITS,
  MULTIMODAL_CONNECTIONS,
  MULTIMODAL_DELIVERABLES,
  MULTIMODAL_DESCRIPTION,
  MULTIMODAL_ENGINE,
  MULTIMODAL_ENTITY_STATEMENT,
  MULTIMODAL_FAQS,
  MULTIMODAL_FLOW,
  MULTIMODAL_H1,
  MULTIMODAL_INDUSTRIES,
  MULTIMODAL_KEYWORDS,
  MULTIMODAL_LEAD,
  MULTIMODAL_PERMISSIONS,
  MULTIMODAL_PROCESS,
  MULTIMODAL_PRODUCTS,
  MULTIMODAL_RELATED_LINKS,
  MULTIMODAL_SECURITY,
  MULTIMODAL_TITLE,
  multimodalDecision,
} from '@/lib/multimodal-ai-worker';
import MultimodalIndustrySelector from './MultimodalIndustrySelector';
import styles from './multimodal-ai-worker.module.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: { absolute: MULTIMODAL_TITLE },
  description: MULTIMODAL_DESCRIPTION,
  keywords: MULTIMODAL_KEYWORDS,
  alternates: { canonical: MULTIMODAL_CANONICAL },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: MULTIMODAL_CANONICAL,
    siteName: SITE.name,
    title: MULTIMODAL_TITLE,
    description: MULTIMODAL_DESCRIPTION,
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: '멀티모달 AI Worker 개발 — 름랩' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: MULTIMODAL_TITLE,
    description: MULTIMODAL_DESCRIPTION,
    images: [SITE.defaultOgImage],
  },
  robots: robotsFor(multimodalDecision()),
};

const crumbs = [
  { name: '홈', url: `${SITE.domain}/` },
  { name: 'AI Worker', url: `${SITE.domain}/ai-worker/` },
  { name: '멀티모달 AI Worker', url: MULTIMODAL_CANONICAL },
];

export default function MultimodalAiWorkerPage() {
  const decisionGuides = resolveCluster(guidesForService('/ai-worker/multimodal/'), {
    guide: getGuide,
    compare: getCompare,
    blog: getBlogPostBySlug,
  });

  return (
    <>
      <IndustryServiceJsonLd
        name="멀티모달 AI Worker 개발"
        serviceType="멀티모달 AI 업무 자동화 시스템 개발"
        description={MULTIMODAL_DESCRIPTION}
        url={MULTIMODAL_CANONICAL}
        faqs={MULTIMODAL_FAQS}
        crumbs={crumbs}
      />

      <main className={styles.page}>
        <article>
          <nav className={styles.breadcrumb} aria-label="breadcrumb">
            <Link href="/">홈</Link><span aria-hidden="true">/</span>
            <Link href="/ai-worker/">AI Worker</Link><span aria-hidden="true">/</span>
            <span>멀티모달 AI Worker</span>
          </nav>

          <header className={styles.hero}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>MULTIMODAL AI WORKER</p>
              <h1>{MULTIMODAL_H1}</h1>
              <p className={styles.lead}>{MULTIMODAL_LEAD}</p>
              <div className={styles.heroActions}>
                <a className={styles.primaryButton} href="#inquiry" data-analytics="cta_multimodal_hero_form">
                  우리 업무 AI 자동화 상담하기
                </a>
                <a className={styles.secondaryButton} href="#examples" data-analytics="cta_multimodal_examples">
                  적용 사례 보기
                </a>
              </div>
              <p className={styles.heroNote}>특정 고객사 실적이 아닌, 구축 가능한 일반 업무 예시를 설명합니다.</p>
            </div>

            <div className={styles.heroPanel} aria-label="멀티모달 AI Worker 핵심 흐름">
              <p>입력을 읽는 AI에서</p>
              <strong>업무를 안전하게 연결하는 AI로</strong>
              <ul>
                <li>비정형 입력 이해</li>
                <li>업무 기준 적용</li>
                <li>권한별 시스템 실행</li>
                <li>사람 승인과 이력 기록</li>
              </ul>
            </div>
          </header>

          <section className={styles.definition} aria-labelledby="definition-title">
            <p className={styles.sectionKicker}>한 문장 정의</p>
            <h2 id="definition-title">멀티모달 AI Worker란?</h2>
            <p>{MULTIMODAL_ENTITY_STATEMENT}</p>
          </section>

          <section className={styles.section} aria-labelledby="flow-title">
            <div className={styles.sectionHeading}>
              <p className={styles.sectionKicker}>Core workflow</p>
              <h2 id="flow-title">보고, 듣고, 읽은 뒤 실제 업무로 연결합니다</h2>
              <p>각 단계는 원인과 결과가 추적되도록 분리합니다. 입력이 불명확하거나 권한을 벗어나면 자동 실행하지 않습니다.</p>
            </div>
            <ol className={styles.flow}>
              {MULTIMODAL_FLOW.map((step, index) => (
                <li key={step.id}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{step.label}</strong>
                  <p>{step.detail}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className={styles.section} id="examples" aria-labelledby="products-title">
            <div className={styles.sectionHeading}>
              <p className={styles.sectionKicker}>Product patterns</p>
              <h2 id="products-title">만들 수 있는 멀티모달 AI Worker 10가지</h2>
              <p>완성품 목록이 아니라, 현재 업무·데이터·시스템에 맞춰 설계하는 대표 패턴입니다.</p>
            </div>
            <div className={styles.productGrid}>
              {MULTIMODAL_PRODUCTS.map((product, index) => (
                <article className={styles.productCard} key={product.id} data-multimodal-product>
                  <div className={styles.cardTopline}><span>{String(index + 1).padStart(2, '0')}</span><h3>{product.title}</h3></div>
                  <dl>
                    <div><dt>입력</dt><dd>{product.input}</dd></div>
                    <div><dt>판단</dt><dd>{product.judgement}</dd></div>
                    <div><dt>결과</dt><dd>{product.output}</dd></div>
                  </dl>
                  <p className={styles.guardrail}><strong>사람 확인:</strong> {product.guardrail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.section} aria-labelledby="engine-title">
            <div className={styles.sectionHeading}>
              <p className={styles.sectionKicker}>System design</p>
              <h2 id="engine-title">AI의 판단과 시스템 실행 사이에 규칙과 권한을 둡니다</h2>
            </div>
            <ol className={styles.engine}>
              {MULTIMODAL_ENGINE.map((step, index) => (
                <li key={step.id}>
                  <span>{index + 1}</span>
                  <div><strong>{step.label}</strong><p>{step.detail}</p></div>
                </li>
              ))}
            </ol>
          </section>

          <section className={styles.section} aria-labelledby="industry-title">
            <div className={styles.sectionHeading}>
              <p className={styles.sectionKicker}>Industry explorer</p>
              <h2 id="industry-title">내 업종에서는 어떤 흐름이 가능한가</h2>
              <p>아래 예시는 가능성을 빠르게 이해하기 위한 시뮬레이션이며 실제 연동이나 처리 결과가 아닙니다.</p>
            </div>
            <MultimodalIndustrySelector industries={MULTIMODAL_INDUSTRIES} defaultIndustryId="b2b" />
          </section>

          <section className={styles.splitSection} aria-labelledby="connection-title">
            <div>
              <p className={styles.sectionKicker}>Connection</p>
              <h2 id="connection-title">API를 우선하고 화면 조작은 조건부로 사용합니다</h2>
              <div className={styles.stackCards}>
                {MULTIMODAL_CONNECTIONS.map((item) => (
                  <article key={item.title}><h3>{item.title}</h3><p>{item.detail}</p></article>
                ))}
              </div>
            </div>
            <aside className={styles.limitPanel}>
              <p className={styles.panelLabel}>Computer Use 한계</p>
              <ul>{MULTIMODAL_COMPUTER_USE_LIMITS.map((item) => <li key={item}>{item}</li>)}</ul>
            </aside>
          </section>

          <section className={styles.section} aria-labelledby="permission-title">
            <div className={styles.sectionHeading}>
              <p className={styles.sectionKicker}>Permission model</p>
              <h2 id="permission-title">AI가 할 수 있는 일을 네 단계로 제한합니다</h2>
            </div>
            <div className={styles.permissionGrid}>
              {MULTIMODAL_PERMISSIONS.map((permission) => (
                <article key={permission.level}>
                  <code>{permission.level}</code><h3>{permission.title}</h3><p>{permission.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.securitySection} aria-labelledby="security-title">
            <div className={styles.sectionHeading}>
              <p className={styles.sectionKicker}>Security &amp; privacy</p>
              <h2 id="security-title">영상·음성·문서를 다루기 전에 먼저 정할 것</h2>
              <p>보안을 단정적으로 약속하지 않습니다. 실제 환경에서 아래 항목을 확인하고 기록합니다.</p>
            </div>
            <ul>{MULTIMODAL_SECURITY.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>

          <section className={styles.threeColumns} aria-label="구축 범위와 진행 방식">
            <article>
              <p className={styles.sectionKicker}>Deliverables</p><h2>구축 산출물</h2>
              <ul>{MULTIMODAL_DELIVERABLES.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article>
              <p className={styles.sectionKicker}>Process</p><h2>진행 순서</h2>
              <ol>{MULTIMODAL_PROCESS.map((item) => <li key={item}>{item}</li>)}</ol>
            </article>
            <article>
              <p className={styles.sectionKicker}>Scope &amp; cost</p><h2>비용과 범위</h2>
              <ul>{MULTIMODAL_BUSINESS_MODEL.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </section>

          <section className={styles.section} aria-labelledby="faq-title">
            <div className={styles.sectionHeading}>
              <p className={styles.sectionKicker}>FAQ</p>
              <h2 id="faq-title">멀티모달 AI Worker 자주 묻는 질문</h2>
            </div>
            <div className={styles.faqList}>
              {MULTIMODAL_FAQS.map((faq) => (
                <details key={faq.q} data-multimodal-faq>
                  <summary>{faq.q}</summary><p>{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className={styles.related} aria-labelledby="guides-title">
            <div><p className={styles.sectionKicker}>Decision guides</p><h2 id="guides-title">구축 전에 확인할 판단 자료</h2></div>
            <nav aria-label="멀티모달 AI Worker 판단 가이드">
              {decisionGuides.map((item) => <Link href={item.href} key={item.href}>{item.label}<span aria-hidden="true">→</span></Link>)}
            </nav>
          </section>

          <section className={styles.related} aria-labelledby="related-title">
            <div><p className={styles.sectionKicker}>Related services</p><h2 id="related-title">함께 확인하면 좋은 서비스</h2></div>
            <nav aria-label="관련 서비스">
              {MULTIMODAL_RELATED_LINKS.map((item) => <Link href={item.href} key={item.href}>{item.label}<span aria-hidden="true">→</span></Link>)}
            </nav>
          </section>

          <section className={styles.inquiry} id="inquiry" aria-labelledby="inquiry-title">
            <div className={styles.inquiryIntro}>
              <p className={styles.sectionKicker}>Project inquiry</p>
              <h2 id="inquiry-title">우리 업무를 AI Worker로 바꿀 수 있는지 확인하세요</h2>
              <p>현재 사람이 반복하는 업무와 입력 자료의 형태만 알려 주세요. 가능한 범위와 사람 확인이 필요한 지점을 함께 정리합니다.</p>
              <ul>
                <li>문의만으로 계약이 진행되지 않습니다.</li>
                <li>실제 자료는 민감정보를 제거한 샘플부터 확인합니다.</li>
                <li>연동 가능 여부를 확인한 뒤 기간·산출물·견적을 제안합니다.</li>
              </ul>
            </div>
            <LandingInquiryForm
              landingSlug="multimodal-ai-worker"
              defaultServiceType="AI 기능·업무 자동화"
              variant="multimodal-ai-worker"
              submitLabel="멀티모달 AI Worker 검토 요청하기"
            />
          </section>
        </article>
      </main>

      <BusinessFooter topExtra={<Link href="/ai-worker/">← AI Worker 전체 서비스로</Link>} />
    </>
  );
}
