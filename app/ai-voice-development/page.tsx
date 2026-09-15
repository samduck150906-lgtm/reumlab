import type { Metadata } from 'next';
import Link from '@/components/SiteLink';
import LandingInquiryForm from '@/components/LandingInquiryForm';
import BusinessFooter from '@/components/BusinessFooter';
import { ServiceWebPageJsonLd } from '@/components/JsonLd';
import { getProject, portfolioCanonical } from '@/lib/portfolio';
import { guidesForService, resolveCluster } from '@/lib/content-cluster';
import { getGuide } from '@/lib/guides';
import { getCompare } from '@/lib/compare';
import { getBlogPostBySlug } from '@/lib/blog-posts';
import { robotsFor } from '@/lib/index-quality';
import { SITE } from '@/lib/seo';
import {
  AI_VOICE_CANONICAL,
  AI_VOICE_TITLE,
  AI_VOICE_DESCRIPTION,
  AI_VOICE_H1,
  AI_VOICE_EYEBROW,
  AI_VOICE_LEAD,
  AI_VOICE_ENTITY_STATEMENT,
  AI_VOICE_KEYWORDS,
  AI_VOICE_SERVICE_TYPE,
  HERO_FEATURES,
  HERO_CTA_PRIMARY,
  HERO_CTA_SECONDARY,
  FLOW_LEGACY,
  FLOW_AI,
  DEFINITION_HEADING,
  DEFINITION_ANSWER,
  DEFINITION_SUPPORT,
  HOW_HEADING,
  HOW_ANSWER,
  HOW_STEPS,
  FEATURES,
  DEMO_NOTE,
  INDUSTRY_CASES,
  VS_CHATBOT,
  VS_ARS_HEADING,
  VS_ARS_ANSWER,
  ARCHITECTURE,
  ARCHITECTURE_NOTE,
  PROCESS,
  COST_HEADING,
  COST_ANSWER,
  COST_GROUPS,
  COST_RUNNING,
  COST_REFERENCE,
  COST_MVP,
  COST_CTA,
  FAQS,
  FINAL_CTA,
  RELATED_LINKS,
  RELATED_CASE_IDS,
  RELATED_CASE_NOTE,
  aiVoiceDecision,
} from '@/lib/ai-voice';
import '../reum-sales.css';
import styles from './ai-voice.module.css';
import ConversationDemo from './ConversationDemo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: { absolute: AI_VOICE_TITLE },
  description: AI_VOICE_DESCRIPTION,
  keywords: AI_VOICE_KEYWORDS,
  /*
    독립적인 검색 의도(음성·전화·실시간)를 가지므로 self-canonical 이다.
    /ai-development/(텍스트 챗봇)나 /ai-automation/(업무 실행)으로 canonical 을 보내지 않는다 —
    다른 질문에 답하는 페이지다.
  */
  alternates: { canonical: AI_VOICE_CANONICAL },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: AI_VOICE_CANONICAL,
    siteName: SITE.name,
    title: AI_VOICE_TITLE,
    description: AI_VOICE_DESCRIPTION,
    // 전용 이미지가 없으므로 사이트 대표 OG 를 재사용한다(없는 경로를 만들지 않는다).
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: 'AI 음성 상담·전화 자동화 개발 — 름랩' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: AI_VOICE_TITLE,
    description: AI_VOICE_DESCRIPTION,
    images: [SITE.defaultOgImage],
  },
  robots: robotsFor(aiVoiceDecision()),
};

const cases = RELATED_CASE_IDS.map((id) => getProject(id)).filter(
  (item): item is NonNullable<typeof item> => Boolean(item),
);

/** 정보성 근거로 이어지는 길 — 실재하는 가이드만 연결한다(lib/content-cluster.ts 가 단일 출처) */
const clusterLinks = resolveCluster(guidesForService('/ai-voice-development/'), {
  guide: getGuide,
  compare: getCompare,
  blog: getBlogPostBySlug,
});

export default function AiVoiceDevelopmentPage() {
  return (
    <>
      <ServiceWebPageJsonLd
        url={AI_VOICE_CANONICAL}
        name={AI_VOICE_H1}
        description={AI_VOICE_DESCRIPTION}
        serviceType={AI_VOICE_SERVICE_TYPE}
        crumbs={[
          { name: '홈', url: `${SITE.domain}/` },
          { name: 'AI 개발', url: `${SITE.domain}/ai-development/` },
          { name: AI_VOICE_H1, url: AI_VOICE_CANONICAL },
        ]}
        faqs={FAQS.map((f) => ({ q: f.q, a: f.a }))}
      />

      {/*
        JS 가 꺼져 있으면 대화 데모의 "아직 진행 안 됨" 흐림 처리를 해제한다.
        (데모는 클라이언트 컴포넌트지만 대사 전체가 초기 HTML 에 들어 있다.)
      */}
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: `[data-voice-turn]{opacity:1 !important}` }} />
      </noscript>

      <main className={`reum-landing ${styles.page}`}>
        {/* ── SECTION 01 — HERO ───────────────────────────── */}
        <section className={styles.hero} aria-labelledby="voice-title">
          <div className={styles.wrap}>
            <nav className={styles.breadcrumb} aria-label="현재 위치">
              <Link href="/">홈</Link>
              <span aria-hidden="true">/</span>
              <Link href="/ai-development/">AI 개발</Link>
              <span aria-hidden="true">/</span>
              <span>AI 음성 상담·전화 자동화</span>
            </nav>
            <div className={styles.heroGrid}>
              <div>
                <p className={styles.eyebrow}>{AI_VOICE_EYEBROW}</p>
                {/*
                  H1 은 데이터(AI_VOICE_H1)와 같은 문장이지만 줄바꿈 위치를 고정한다.
                  Pretendard 가 늦게 적용되면 폰트 폭이 달라져 모바일에서 1줄 ↔ 2줄로 뒤집히고,
                  그 한 줄만큼 아래 전체가 밀려 CLS 가 생겼다. 끊는 위치를 지정하면 두 폰트 모두 2줄이다.
                  (320px 에서 마지막 한 글자만 다음 줄로 떨어지던 문제도 함께 없어진다.)
                */}
                <h1 id="voice-title">
                  AI 음성 상담·<br />
                  전화 자동화 개발
                </h1>
                <p className={styles.heroLead}>{AI_VOICE_LEAD}</p>
                <p className={styles.entityStatement}>{AI_VOICE_ENTITY_STATEMENT}</p>
                <div className={styles.actions}>
                  <a
                    href="#voice-inquiry"
                    className={styles.primaryButton}
                    data-analytics="cta_voice_hero_form"
                    data-cta-type="form"
                    data-cta-location="hero"
                  >
                    {HERO_CTA_PRIMARY}
                  </a>
                  <a href="#voice-how" className={styles.secondaryButton} data-analytics="cta_voice_hero_how">
                    {HERO_CTA_SECONDARY}
                  </a>
                </div>
                <ul className={styles.featureStrip} aria-label="핵심 특징">
                  {HERO_FEATURES.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              <figure className={styles.heroFigure}>
                <figcaption>통화 한 건이 처리되는 순서 · 구성 예시</figcaption>
                <ol>
                  <li>
                    <span>01</span>
                    <strong>고객이 전화로 말합니다</strong>
                    <small>&ldquo;토요일 오후에 예약 되나요?&rdquo;</small>
                  </li>
                  <li>
                    <span>02</span>
                    <strong>AI가 듣고 되묻습니다</strong>
                    <small>빠진 항목만 골라 확인합니다</small>
                  </li>
                  <li>
                    <span>03</span>
                    <strong>시스템을 호출합니다</strong>
                    <small>가능한 시간을 실제로 조회합니다</small>
                  </li>
                  <li>
                    <span>04</span>
                    <strong>업무가 끝납니다</strong>
                    <small>예약 등록 · 상담 기록 저장 · 필요 시 담당자 연결</small>
                  </li>
                </ol>
              </figure>
            </div>
          </div>
        </section>

        {/* ── SECTION 02 — 기존 전화 상담 vs AI 음성 상담 ──── */}
        <section className={`${styles.section} ${styles.soft}`} aria-labelledby="voice-flow-title">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>BEFORE &amp; AFTER</p>
            <h2 id="voice-flow-title">기존 전화 상담과 AI 음성 상담은 무엇이 다른가요?</h2>
            <p className={styles.sectionIntro}>
              가장 큰 차이는 &ldquo;통화가 끝난 뒤에 무엇이 남는가&rdquo;입니다. 기존 방식은 사람이 받아야 시작되고 기록은
              나중에 다시 입력해야 남지만, AI 음성 상담은 통화 중에 업무가 처리되고 기록이 대화에서 바로 만들어집니다.
            </p>

            <fieldset className={styles.flowSwitch}>
              <legend className={styles.srOnly}>비교할 상담 흐름 선택</legend>
              <input
                className={styles.flowRadio}
                type="radio"
                name="voice-flow"
                id="voice-flow-legacy"
                defaultChecked
              />
              <input className={styles.flowRadio} type="radio" name="voice-flow" id="voice-flow-ai" />
              <div className={styles.flowTabs}>
                <label className={styles.flowTab} htmlFor="voice-flow-legacy">
                  {FLOW_LEGACY.label}
                </label>
                <label className={styles.flowTab} htmlFor="voice-flow-ai">
                  {FLOW_AI.label}
                </label>
              </div>
              <div className={styles.flowGrid}>
                <article className={styles.flowCol}>
                  <h3>{FLOW_LEGACY.label}</h3>
                  <p>{FLOW_LEGACY.note}</p>
                  <ol className={styles.flowSteps}>
                    {FLOW_LEGACY.steps.map((s) => (
                      <li key={s.title}>
                        <b>{s.title}</b>
                        <span>{s.detail}</span>
                      </li>
                    ))}
                  </ol>
                </article>
                <article className={`${styles.flowCol} ${styles.flowAiCol}`}>
                  <h3>{FLOW_AI.label}</h3>
                  <p>{FLOW_AI.note}</p>
                  <ol className={styles.flowSteps}>
                    {FLOW_AI.steps.map((s) => (
                      <li key={s.title}>
                        <b>{s.title}</b>
                        <span>{s.detail}</span>
                      </li>
                    ))}
                  </ol>
                </article>
              </div>
            </fieldset>
          </div>
        </section>

        {/* ── SECTION 03 — AI 음성 상담이란? (인용 가능한 정의) ── */}
        <section className={styles.section} aria-labelledby="voice-define-title">
          <div className={`${styles.wrap} ${styles.narrow}`}>
            <p className={styles.eyebrow}>DEFINITION</p>
            <h2 id="voice-define-title">{DEFINITION_HEADING}</h2>
            <p className={styles.answerBlock}>{DEFINITION_ANSWER}</p>
            <p className={styles.answerSupport}>{DEFINITION_SUPPORT}</p>

            {/* 엔티티 관계를 화면에서도 읽히게 한다 — 구조화 데이터에만 존재하는 관계를 만들지 않는다 */}
            <div className={styles.note}>
              <strong>서비스 관계</strong>
              <br />
              름랩(소프트웨어 개발 스튜디오) → <Link href="/ai-development/">AI 시스템 개발</Link> → AI 음성 상담(Voice
              AI) → 상담 · <Link href="/reservation-commerce/" prefetch={false}>예약</Link> · 문의 접수 · 견적 접수 →{' '}
              <Link href="/admin-page-development/">CRM · ERP · 데이터베이스 · API 연동</Link>
            </div>
          </div>
        </section>

        {/* ── SECTION 04 — HOW IT WORKS ───────────────────── */}
        <section className={`${styles.section} ${styles.dark}`} id="voice-how" aria-labelledby="voice-how-title">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>HOW IT WORKS</p>
            <h2 id="voice-how-title">{HOW_HEADING}</h2>
            <p className={styles.sectionIntro}>{HOW_ANSWER}</p>
            <ol className={styles.stepGrid}>
              {HOW_STEPS.map((s) => (
                <li key={s.no} className={styles.stepCard}>
                  <span className={styles.stepNo}>{s.no}</span>
                  <h3>{s.title}</h3>
                  <p>{s.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── SECTION 05 — 핵심 기능 ──────────────────────── */}
        <section className={styles.section} aria-labelledby="voice-features-title">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>FEATURES</p>
            <h2 id="voice-features-title">AI 음성 상담으로 무엇을 할 수 있나요?</h2>
            <p className={styles.sectionIntro}>
              아래 항목을 기준으로 필요한 것만 계약 범위에 확정합니다. 모든 기능이 모든 프로젝트에 자동 포함되지는
              않습니다.
            </p>
            <div className={styles.featureGrid}>
              {FEATURES.map((f) => (
                <article key={f.title} className={styles.featureCard}>
                  <span className={styles.featureIcon} aria-hidden="true">
                    {f.icon}
                  </span>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 06 — 대화 데모 ──────────────────────── */}
        <section className={`${styles.section} ${styles.dark}`} aria-labelledby="voice-demo-title">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>DEMO</p>
            <h2 id="voice-demo-title">실제 통화는 이렇게 흘러갑니다</h2>
            <p className={styles.sectionIntro}>
              름랩이 외주 문의 전화를 AI로 받는다면 어떤 순서로 진행되는지 보여 주는 예시입니다. 버튼을 눌러 한 대사씩
              확인해 보세요.
            </p>
            <ConversationDemo />
            <p className={styles.demoFoot}>{DEMO_NOTE}</p>
          </div>
        </section>

        {/* ── SECTION 07 — 산업별 USE CASE ────────────────── */}
        <section className={`${styles.section} ${styles.soft}`} aria-labelledby="voice-industry-title">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>USE CASES</p>
            <h2 id="voice-industry-title">업종별 AI 전화상담 활용 예시</h2>
            <p className={styles.sectionIntro}>
              업종을 선택하면 그 업종에서 AI가 받는 전화와 처리 흐름이 바뀝니다. 아래는 업무 흐름 예시이며 특정 고객사의
              실제 구축 사례가 아닙니다.
            </p>

            <fieldset className={styles.industry}>
              <legend className={styles.srOnly}>업종 선택</legend>
              {INDUSTRY_CASES.map((ind, i) => (
                <input
                  key={ind.key}
                  className={styles.indRadio}
                  type="radio"
                  name="voice-industry"
                  id={`voice-ind-${ind.key}`}
                  defaultChecked={i === 0}
                />
              ))}
              <div className={styles.indTabs}>
                {INDUSTRY_CASES.map((ind) => (
                  <label key={ind.key} className={styles.indTab} htmlFor={`voice-ind-${ind.key}`}>
                    {ind.label}
                  </label>
                ))}
              </div>
              <div className={styles.indPanels}>
                {INDUSTRY_CASES.map((ind) => (
                  <article key={ind.key} className={styles.indPanel}>
                    <div className={styles.indBody}>
                      <p className={styles.indAsk}>
                        <span className={styles.indAskLabel}>{ind.label} · AI가 받는 전화</span>
                        {ind.ask}
                      </p>
                      <ol className={styles.indFlow}>
                        {ind.flow.map((step) => (
                          <li key={step}>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                      {ind.guard ? <p className={styles.indGuard}>{ind.guard}</p> : null}
                    </div>
                  </article>
                ))}
              </div>
            </fieldset>

            <div className={styles.costCta}>
              <p>
                우리 업종에서는 어떤 전화가 가장 많이 오는지만 알려주셔도 됩니다. 자동화할 수 있는 문의와 사람이 받아야
                할 문의를 나눠 정리해 드립니다.
              </p>
              <a
                href="#voice-inquiry"
                className={styles.primaryButton}
                data-analytics="cta_voice_usecase_form"
                data-cta-type="form"
                data-cta-location="usecase"
              >
                우리 업종 적용 상담하기
              </a>
            </div>
          </div>
        </section>

        {/* ── SECTION 08 — 챗봇 · ARS 와의 차이 ───────────── */}
        <section className={styles.section} aria-labelledby="voice-compare-title">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>COMPARISON</p>
            <h2 id="voice-compare-title">AI 음성 상담은 챗봇·ARS와 무엇이 다른가요?</h2>
            <div className={styles.tableWrap} tabIndex={0} aria-label="일반 챗봇과 AI 음성 상담 비교표">
              <table className={styles.compareTable}>
                <thead>
                  <tr>
                    <th scope="col">비교 기준</th>
                    <th scope="col">일반 챗봇</th>
                    <th scope="col">AI 음성 상담</th>
                  </tr>
                </thead>
                <tbody>
                  {VS_CHATBOT.rows.map((r) => (
                    <tr key={r.item}>
                      <th scope="row">{r.item}</th>
                      <td>{r.chatbot}</td>
                      <td>{r.voice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.note}>
              {VS_CHATBOT.note} 텍스트 챗봇만 먼저 필요하시다면{' '}
              <Link href="/ai-development/">AI 외주개발(챗봇·상담 자동화)</Link> 쪽이 맞습니다.
            </p>

            <h3 style={{ marginTop: 44, fontSize: 22, letterSpacing: '-0.02em' }} id="voice-ars-title">
              {VS_ARS_HEADING}
            </h3>
            <p className={styles.answerBlock}>{VS_ARS_ANSWER}</p>
          </div>
        </section>

        {/* ── SECTION 09 — ARCHITECTURE ───────────────────── */}
        <section className={`${styles.section} ${styles.dark}`} aria-labelledby="voice-arch-title">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>ARCHITECTURE</p>
            <h2 id="voice-arch-title">AI 음성 상담 시스템 기술 구조</h2>
            <p className={styles.sectionIntro}>
              음성이 들어와 업무가 끝나고 다시 안내로 돌아가기까지 일곱 계층을 지납니다. 각 계층에서 무엇을 쓸지는
              프로젝트 요구사항에 따라 정합니다.
            </p>
            <ol className={styles.archList}>
              {ARCHITECTURE.map((layer) => (
                <li key={layer.no} className={styles.archLayer}>
                  <span className={styles.archNo}>{layer.no}</span>
                  <div>
                    <h3>{layer.title}</h3>
                    <p>{layer.detail}</p>
                  </div>
                  <ul className={styles.archParts}>
                    {layer.parts.map((part) => (
                      <li key={part}>{part}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
            <p className={styles.note}>{ARCHITECTURE_NOTE}</p>
          </div>
        </section>

        {/* ── SECTION 10 — 진행 방식 ──────────────────────── */}
        <section className={styles.section} aria-labelledby="voice-process-title">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>PROCESS</p>
            <h2 id="voice-process-title">AI 음성 상담 개발은 이렇게 진행합니다</h2>
            <ol className={styles.processList}>
              {PROCESS.map((p) => (
                <li key={p.no}>
                  <span>{p.no}</span>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.detail}</p>
                    <small>
                      <b>확인할 결과물</b>
                      {p.output}
                    </small>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── 관련 구현 경험 (공개된 실제 사례만) ─────────── */}
        <section className={`${styles.section} ${styles.soft}`} aria-labelledby="voice-cases-title">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>EXPERIENCE</p>
            <h2 id="voice-cases-title">관련 구현 경험</h2>
            <p className={styles.sectionIntro}>{RELATED_CASE_NOTE}</p>
            <div className={styles.caseGrid}>
              {cases.map((project) => (
                <article key={project.id} className={styles.caseCard}>
                  <p>{project.chip}</p>
                  <h3>{project.title}</h3>
                  <span>{project.problem}</span>
                  <Link href={portfolioCanonical(project.id).replace(SITE.domain, '')}>구현 내용 확인하기 →</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 11 — 비용 ───────────────────────────── */}
        <section className={styles.section} id="voice-cost" aria-labelledby="voice-cost-title">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>COST</p>
            <h2 id="voice-cost-title">{COST_HEADING}</h2>
            <p className={styles.answerBlock}>{COST_ANSWER}</p>

            <div className={styles.costGroups}>
              {COST_GROUPS.map((group) => (
                <article key={group.title} className={styles.costGroup}>
                  <h3>{group.title}</h3>
                  <p>{group.lead}</p>
                  <ul className={styles.costItems}>
                    {group.items.map((item) => (
                      <li key={item.name}>
                        <b>{item.name}</b>
                        <span>{item.why}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className={styles.costSplit}>
              <div className={styles.costPanel}>
                <h3>개발비와 따로 발생하는 운영 실비</h3>
                <ul>
                  {COST_RUNNING.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p>통화량에 비례해 매달 발생합니다. 견적서에서 개발비와 구분해 표기하고, 계정은 고객사 명의로 만들어 사용량을 직접 확인하실 수 있게 합니다.</p>
              </div>
              <div className={styles.costPanel}>
                <h3>참고 기준과 범위 좁히기</h3>
                <p>{COST_REFERENCE}</p>
                <p>{COST_MVP}</p>
              </div>
            </div>

            <div className={styles.costCta}>
              <p>{COST_CTA}</p>
              <a
                href="#voice-inquiry"
                className={styles.primaryButton}
                data-analytics="cta_voice_cost_form"
                data-cta-type="form"
                data-cta-location="cost"
              >
                MVP 범위 검토 요청하기
              </a>
            </div>
          </div>
        </section>

        {/* ── SECTION 12 — FAQ ────────────────────────────── */}
        <section className={`${styles.section} ${styles.soft}`} id="voice-faq" aria-labelledby="voice-faq-title">
          <div className={`${styles.wrap} ${styles.narrow}`}>
            <p className={styles.eyebrow}>FAQ</p>
            <h2 id="voice-faq-title">자주 묻는 질문</h2>
            {/*
              화면에 보이는 이 목록과 FAQPage 구조화 데이터가 lib/ai-voice.ts 의 FAQS 배열
              하나를 공유한다. <details> 는 JS 없이 열리고 접근성 트리에 expanded 상태가 그대로 노출된다.
            */}
            <div className={styles.faqList}>
              {FAQS.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
            <p className={styles.limitNotice}>
              음성 인식 정확도, 응답 속도, 통화 품질은 회선 환경과 선택한 모델, 통화 상황에 따라 달라집니다. 특정 정확도
              수치나 완전한 보안·전 법령 준수를 보장하지 않으며, 계약으로 확정한 범위와 검증 가능한 구현 항목을 기준으로
              진행합니다.
            </p>
          </div>
        </section>

        {/* ── SECTION 13 — FINAL CTA + 문의 ───────────────── */}
        <section className={`${styles.section} ${styles.inquiry}`} id="voice-inquiry" aria-labelledby="voice-inquiry-title">
          <div className={styles.wrap}>
            <div className={styles.inquiryIntro}>
              <p className={styles.eyebrow}>START</p>
              <h2 id="voice-inquiry-title">{FINAL_CTA.heading}</h2>
              <p>{FINAL_CTA.body}</p>
              <div className={styles.contactLinks}>
                <a href={SITE.phoneHref} data-analytics="cta_voice_final_call" data-cta-type="tel" data-cta-location="final">
                  전화 {SITE.phone}
                </a>
                <a
                  href={SITE.kakaoChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics="cta_voice_final_kakao"
                  data-cta-type="kakao"
                  data-cta-location="final"
                >
                  카카오톡 상담
                </a>
                <a href={`mailto:${SITE.email}`} data-analytics="cta_voice_final_email" data-cta-type="email" data-cta-location="final">
                  이메일 문의
                </a>
              </div>
            </div>
            <LandingInquiryForm
              landingSlug="ai-voice-development"
              defaultServiceType="AI 기능·업무 자동화"
              variant="ai-voice"
              submitLabel={FINAL_CTA.button}
            />
          </div>
        </section>

        {/* ── SECTION 14 — 관련 서비스 ────────────────────── */}
        <section className={styles.section} aria-labelledby="voice-related-title">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>RELATED</p>
            <h2 id="voice-related-title">관련 서비스</h2>
            <p className={styles.sectionIntro}>
              찾으시는 것이 음성이 아니라면 아래 페이지가 더 맞을 수 있습니다. 같은 팀이 진행하므로 범위를 섞어 한
              프로젝트로 묶는 것도 가능합니다.
            </p>
            <div className={styles.relatedGrid}>
              {RELATED_LINKS.map((r) => (
                <Link key={r.href} href={r.href} className={styles.relatedCard}>
                  <b>{r.label}</b>
                  <span>{r.note}</span>
                  <em>자세히 보기 →</em>
                </Link>
              ))}
            </div>
            {clusterLinks.length > 0 ? (
              <p className={styles.sectionIntro}>
                판단에 필요한 자료:{' '}
                {clusterLinks.map((link, i) => (
                  <span key={link.href}>
                    {i > 0 ? ' · ' : ''}
                    <Link href={link.href}>{link.label}</Link>
                  </span>
                ))}
              </p>
            ) : null}
          </div>
        </section>
      </main>
      <BusinessFooter topExtra={<Link href="/ai-development/">← AI 개발 서비스 전체 보기</Link>} />
    </>
  );
}
