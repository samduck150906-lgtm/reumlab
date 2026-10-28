import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import Link from '@/components/SiteLink';
import BusinessFooter from '@/components/BusinessFooter';
import LandingInquiryForm from '@/components/LandingInquiryForm';
import { ServiceWebPageJsonLd } from '@/components/JsonLd';
import {
  GENERATED_AUTOMATION_DOMAINS,
  PRIORITY_S_DOMAINS,
  automationCanonical,
  automationDecision,
  getAutomationDomain,
} from '@/lib/automation-domains';
import { robotsFor } from '@/lib/index-quality';
import { SITE } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return GENERATED_AUTOMATION_DOMAINS.map((domain) => ({ slug: domain.slug }));
}

type PageProps = { params: { slug: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const domain = getAutomationDomain(params.slug);
  if (!domain || domain.publishMode !== 'generated') return {};
  const canonical = automationCanonical(domain);
  const decision = automationDecision(domain.slug);
  if (!decision) return {};
  return {
    metadataBase: new URL(SITE.domain),
    title: { absolute: domain.metadata.title },
    description: domain.metadata.description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      url: canonical,
      siteName: SITE.name,
      title: domain.metadata.title,
      description: domain.metadata.description,
      images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: `${domain.name} 개발 — 름랩` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: domain.metadata.title,
      description: domain.metadata.description,
      images: [SITE.defaultOgImage],
    },
    robots: robotsFor(decision),
  };
}

const H2 = { fontSize: 'clamp(1.35rem, 3vw, 1.8rem)', marginBottom: 12 } as const;
const LIST = { marginTop: 10, paddingLeft: 20, lineHeight: 1.85 } as const;
const NOTE = {
  borderLeft: '3px solid var(--green)',
  background: 'var(--bg-card)',
  padding: '18px 20px',
  borderRadius: '0 14px 14px 0',
  boxShadow: '0 10px 30px rgba(11,27,51,.06)',
} as const;

export default function AutomationDomainPage({ params }: PageProps) {
  const domain = getAutomationDomain(params.slug);
  if (!domain || domain.publishMode !== 'generated' || !domain.copy) notFound();
  const copy = domain.copy;

  const canonical = automationCanonical(domain);
  const h1 = `${domain.name} 프로그램 개발`;
  const publishedRelated = PRIORITY_S_DOMAINS
    .filter((candidate) => candidate.slug !== domain.slug && candidate.category === domain.category && candidate.publishMode !== 'research-only')
    .slice(0, 4);
  const crumbs = [
    { name: '홈', url: `${SITE.domain}/` },
    { name: 'AI 업무자동화 개발', url: `${SITE.domain}/ai-automation/` },
    { name: domain.name, url: canonical },
  ];

  return (
    <>
      <ServiceWebPageJsonLd
        url={canonical}
        name={h1}
        description={domain.description}
        serviceType={domain.name}
        crumbs={crumbs}
        faqs={domain.faqs}
      />
      <main>
        <article className="dynamic-page">
          <nav className="breadcrumb" aria-label="breadcrumb">
            <Link href="/">홈</Link>{' / '}
            <Link href="/ai-automation/">AI 업무자동화</Link>{' / '}
            <span>{domain.name}</span>
          </nav>

          <header className="section-inner" style={{ paddingTop: 54 }}>
            <p className="section-tag">{domain.category} · 맞춤 업무자동화</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', wordBreak: 'keep-all' }}>
              {h1}
            </h1>
            <p className="hub-intro" style={{ maxWidth: 820, fontSize: '1.08rem' }}>{domain.description}</p>
            <div className="cta-buttons" style={{ marginTop: 24 }}>
              <a className="btn-primary" href="#inquiry" data-analytics="cta_automation_domain_inquiry" data-service="ai">
                자동화 가능 여부 문의
              </a>
              <a className="btn-outline" href="#workflow">업무 흐름 보기</a>
            </div>
          </header>

          <section className="section-inner" aria-labelledby="direct-answer">
            <div style={NOTE}>
              <h2 id="direct-answer" className="section-title" style={H2}>{domain.name}도 자동화할 수 있나요?</h2>
              <p className="hub-intro">{domain.directAnswer}</p>
            </div>
          </section>

          <section className="section-inner" aria-labelledby="scene">
            <h2 id="scene" className="section-title" style={H2}>지금 반복되는 장면</h2>
            <p className="hub-intro">{copy.scene}</p>
          </section>

          <section className="section-inner" aria-labelledby="tasks">
            <h2 id="tasks" className="section-title" style={H2}>이런 작업을 자동화할 수 있습니다</h2>
            <div className="faq-grid">
              {domain.tasks.map((task, index) => (
                <div className="faq-item" key={task}>
                  <p className="faq-q">{task}</p>
                  <p className="faq-a">{copy.taskNotes[task]}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="section-inner" aria-labelledby="keep-tools">
            {/* 연결 방식의 일반 원칙(API·플러그인·파일 순서 검토, 화면 조작의 한계, 개발 절차, 비용 고지)은 /ai-automation/ 허브가 맡는다 */}
            <h2 id="keep-tools" className="section-title" style={H2}>지금 쓰는 프로그램과 연결합니다</h2>
            <ul style={LIST}>
              {domain.tools.map((tool) => <li key={tool}>{tool}</li>)}
            </ul>
            <p className="hub-intro" style={{ marginTop: 12 }}>{copy.pitfalls}</p>
          </section>

          <section className="section-inner" id="workflow" aria-labelledby="workflow-title">
            <h2 id="workflow-title" className="section-title" style={H2}>구현 가능한 업무 흐름</h2>
            <p className="section-desc">아래는 입력 자료와 승인·예외 처리를 설명하기 위한 설계 예시입니다. 실제 납품 실적이나 모든 도구의 기본 연동을 뜻하지 않으며, 고객 환경의 권한과 샘플 검증 결과에 따라 범위를 정합니다.</p>
            <div className="faq-grid">
              {domain.workflows.map((flow) => (
                <article className="faq-item" key={flow.title}>
                  <h3 className="faq-q">{flow.title}</h3>
                  <p className="faq-a"><strong>입력</strong> — {flow.input}</p>
                  <p className="faq-a"><strong>처리</strong> — {flow.process}</p>
                  <p className="faq-a"><strong>결과</strong> — {flow.output}</p>
                  <p className="faq-a"><strong>사람 검수</strong> — {flow.humanReview}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="section-inner" aria-labelledby="implementation">
            <h2 id="implementation" className="section-title" style={H2}>업무에 맞는 구현 방식을 고릅니다</h2>
            <div className="link-grid">
              {domain.implementationTypes.map((type) => <span key={type}>{type}</span>)}
            </div>
          </section>

          <section className="section-inner" aria-labelledby="constraints">
            <h2 id="constraints" className="section-title" style={H2}>기술적 제약과 사람 검수</h2>
            <ul style={LIST}>
              {domain.constraints.map((constraint) => <li key={constraint}>{constraint}</li>)}
              <li>의사결정에 영향을 주는 금액·계약·대외 발송은 담당자 승인 뒤 실행하도록 설계합니다.</li>
            </ul>
          </section>

          <section className="section-inner" aria-labelledby="process">
            <h2 id="process" className="section-title" style={H2}>진행과 비용</h2>
            <p className="hub-intro">
              업무 관찰 → 작은 PoC → 권한 설계 → 개발·QA → 소스코드·운영 방법 이관 순서로 진행합니다. 비용과 기간은 연동할 프로그램 수,
              데이터 상태, 처리 건수, 예외와 승인 단계에 따라 달라지며 범위를 확인하기 전 고정 가격이나 절감률을 약속하지 않습니다.
              단계별 설명은 <Link href="/ai-automation/#process">AI 업무자동화 진행 절차</Link>에 있습니다.
            </p>
          </section>

          <section className="section-inner" aria-labelledby="faq-title">
            <h2 id="faq-title" className="section-title" style={H2}>자주 묻는 질문</h2>
            <div className="faq-grid">
              {domain.faqs.map((faq) => (
                <div className="faq-item" key={faq.q}>
                  <h3 className="faq-q">{faq.q}</h3>
                  <p className="faq-a">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="section-inner" aria-labelledby="related-title">
            <h2 id="related-title" className="section-title" style={H2}>함께 검토할 자동화 서비스</h2>
            <div className="link-grid">
              <Link href="/ai-automation/">AI 업무자동화 전체 분야</Link>
              <Link href="/ai-worker/">업무를 실행하는 AI Worker</Link>
              {publishedRelated.map((related) => (
                <Link key={related.slug} href={related.targetPage}>{related.name}</Link>
              ))}
            </div>
          </section>

          <section className="section-inner" id="inquiry" aria-labelledby="inquiry-title">
            <h2 id="inquiry-title" className="section-title" style={H2}>지금 반복하는 업무를 설명해 주세요</h2>
            <p className="hub-intro">{copy.cta}</p>
            <div style={{ marginTop: 22 }}>
              <LandingInquiryForm
                landingSlug={`ai-automation/${domain.slug}`}
                defaultServiceType="AI 기능·업무 자동화"
                submitLabel="자동화 가능 여부 확인하기"
              />
            </div>
          </section>
        </article>
      </main>
      <BusinessFooter topExtra={<Link href="/ai-automation/">AI 업무자동화 전체 분야 보기</Link>} />
    </>
  );
}
