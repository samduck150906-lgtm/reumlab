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
  AI_VOICE_H1_LINES,
  AI_VOICE_EYEBROW,
  AI_VOICE_LEAD,
  AI_VOICE_BODY,
  AI_VOICE_SUB_NOTE,
  AI_VOICE_ENTITY_STATEMENT,
  AI_VOICE_KEYWORDS,
  AI_VOICE_SERVICE_TYPE,
  HERO_FEATURES,
  HERO_CTA_PRIMARY,
  HERO_CTA_SECONDARY,
  HERO_FLOW,
  HERO_CARD,
  DEFINITION_HEADING,
  DEFINITION_ANSWER,
  PROBLEM_HEADING,
  PROBLEMS,
  COMPARE_HEADING,
  COMPARE_MODES,
  COMPARE_ROWS,
  COMPARE_NOTE,
  DEMO_HEADING,
  DEMO_LEAD,
  SCOPE_HEADING,
  INDUSTRY_SCOPES,
  SCOPE_NOTE,
  FEATURES_HEADING,
  FEATURES,
  FEATURES_NOTE,
  ADMIN_HEADING,
  ADMIN_BADGE,
  ADMIN_ROWS,
  ADMIN_NOTE,
  ARCH_HEADING,
  ARCH_FLOW,
  ARCHITECTURE,
  INTEGRATION_CATEGORIES,
  INTEGRATION_NOTE,
  CONTROL_HEADING,
  CONTROL_LEVELS,
  HANDOFF_CONDITIONS,
  PRIVACY_HEADING,
  PRIVACY_NOTE,
  MEDICAL_NOTE,
  COMPLIANCE_NOTE,
  PACKAGE_HEADING,
  PACKAGE_LEAD,
  VOICE_PACKAGES,
  PACKAGE_BASELINE_NOTE,
  COST_HEADING,
  COST_ANSWER,
  COST_GROUPS,
  COST_SUPPLEMENT,
  COST_FACTORS,
  WORKLOAD_HEADING,
  WORKLOAD_LEAD,
  PROCESS_HEADING,
  PROCESS,
  FIRST_DELIVERABLE,
  EXPANSION_SCOPE,
  EXPANSION_NOTE,
  DURATION_NOTE,
  CASES_HEADING,
  RELATED_LINKS,
  RELATED_CASE_IDS,
  RELATED_CASE_NOTE,
  FAQ_HEADING,
  FAQS,
  INQUIRY_HEADING,
  INQUIRY_LEAD,
  INQUIRY_SUBMIT_LABEL,
  INQUIRY_PHONE_NOTE,
  INQUIRY_ASSURANCE,
  DEMO_SCENARIOS,
  SIMULATION_NOTICE,
  SYSTEM_SPEAKER_LABEL,
  VOICE_DATA_ATTR,
  aiVoiceDecision,
} from '@/lib/ai-voice';
import '../reum-sales.css';
import styles from './ai-voice.module.css';
import ConversationDemo from './ConversationDemo';
import WorkloadCalculator from './WorkloadCalculator';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: { absolute: AI_VOICE_TITLE },
  description: AI_VOICE_DESCRIPTION,
  keywords: AI_VOICE_KEYWORDS,
  /*
    독립적인 검색 의도(음성·전화·실시간)를 가지므로 self-canonical 이다.
    /ai-development/(텍스트 챗봇)나 /ai-automation/(업무 실행)으로 canonical 을 보내지 않는다 —
    다른 질문에 답하는 페이지다. 경로도 바꾸지 않는다(기존 색인·내부 링크 보존).
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
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: 'AI 전화상담 직원 구축 — 름랩' }],
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

const speakerLabel = (speaker: 'ai' | 'customer' | 'system') =>
  speaker === 'ai' ? 'AI 상담원' : speaker === 'system' ? SYSTEM_SPEAKER_LABEL : '고객';

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
        /*
          offers 를 넘기지 않는다 — 구축 범위는 전부 개별 견적이라 화면에 금액이 없다.
          price=0 이나 임의 offers 를 만들면 화면에 없는 가격을 스키마로 주장하게 된다.
        */
        faqs={FAQS.map((f) => ({ q: f.q, a: f.a }))}
      />

      {/*
        JS 가 꺼져 있으면 상호작용 위젯(데모·계산기)을 감추고, 같은 내용을 담은
        정적 대본·계산 설명이 그대로 읽히게 한다. 반응 없는 버튼을 남기지 않는다.
      */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              '[data-voice-demo-interactive],[data-voice-calc-interactive]{display:none !important}' +
              '[data-voice-nojs]{display:block !important}',
          }}
        />
      </noscript>

      <main className={`reum-landing ${styles.page}`}>
        {/* ── SECTION 01 — HERO + 서비스 정의 ─────────────── */}
        <section className={styles.hero} aria-labelledby="voice-title">
          <div className={styles.wrap}>
            <nav className={styles.breadcrumb} aria-label="현재 위치">
              <Link href="/">홈</Link>
              <span aria-hidden="true">/</span>
              <Link href="/ai-development/">AI 개발</Link>
              <span aria-hidden="true">/</span>
              <span>AI 전화상담 직원 구축</span>
            </nav>
            <div className={styles.heroGrid}>
              <div>
                <p className={styles.eyebrow}>{AI_VOICE_EYEBROW}</p>
                {/*
                  H1 은 데이터(AI_VOICE_H1)와 같은 문장이지만 줄바꿈 위치를 고정한다.
                  폰트가 늦게 적용되면 폭이 달라져 모바일에서 2줄 ↔ 3줄로 뒤집히고,
                  그 한 줄만큼 아래 전체가 밀려 CLS 가 생긴다.
                */}
                <h1 id="voice-title">
                  {AI_VOICE_H1_LINES[0]}
                  <br />
                  {AI_VOICE_H1_LINES[1]}
                </h1>
                <p className={styles.heroLead}>{AI_VOICE_LEAD}</p>
                <p className={styles.heroBody}>{AI_VOICE_BODY}</p>
                <p className={styles.heroSub}>{AI_VOICE_SUB_NOTE}</p>

                <div className={styles.actions}>
                  <a className={styles.primaryButton} href="#voice-inquiry">
                    {HERO_CTA_PRIMARY}
                  </a>
                  <a className={styles.secondaryButton} href="#voice-demo">
                    {HERO_CTA_SECONDARY}
                  </a>
                </div>

                <ul className={styles.featureStrip}>
                  {HERO_FEATURES.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.heroFigure}>
                <ol className={styles.heroFlow} aria-label="전화 업무가 처리되는 순서">
                  {HERO_FLOW.map((s, i) => (
                    <li key={s}>
                      <span className={styles.heroFlowNo} aria-hidden="true">
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
                <div className={styles.heroCard}>
                  <p className={styles.heroCardBadge}>{HERO_CARD.badge}</p>
                  <h2 className={styles.heroCardTitle}>{HERO_CARD.title}</h2>
                  <dl className={styles.heroCardList}>
                    {HERO_CARD.rows.map((r) => (
                      <div key={r.label}>
                        <dt>{r.label}</dt>
                        <dd>{r.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>

            <div className={styles.answerBlock} id="voice-define">
              <h2>{DEFINITION_HEADING}</h2>
              <p>{DEFINITION_ANSWER}</p>
              <p className={styles.entityStatement}>{AI_VOICE_ENTITY_STATEMENT}</p>
            </div>
          </div>
        </section>

        {/* ── SECTION 02 — 문제와 방식 비교 ────────────────── */}
        <section className={styles.section} id="voice-problem" aria-labelledby="voice-problem-title">
          <div className={styles.wrap}>
            <h2 id="voice-problem-title">{PROBLEM_HEADING}</h2>
            <div className={styles.problemGrid}>
              {PROBLEMS.map((p) => (
                <article key={p.title} className={styles.problemCard}>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </article>
              ))}
            </div>

            <h3 className={styles.subHeading} id="voice-compare">
              {COMPARE_HEADING}
            </h3>
            <div className={styles.tableWrap}>
              <table className={styles.compareTable}>
                <caption>운영 방식 세 가지의 구성 비교 — 제품 성능이 아니라 구성 방식을 비교한 표입니다.</caption>
                <thead>
                  <tr>
                    <th scope="col">비교 기준</th>
                    {COMPARE_MODES.map((m) => (
                      <th key={m} scope="col">
                        {m}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((r) => (
                    <tr key={r.item}>
                      <th scope="row">{r.item}</th>
                      <td>{r.direct}</td>
                      <td>{r.ars}</td>
                      <td>{r.voice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.note}>{COMPARE_NOTE}</p>
          </div>
        </section>

        {/* ── SECTION 03 — 업종별 인터랙티브 통화 예시 ─────── */}
        <section className={`${styles.section} ${styles.dark}`} id="voice-demo" aria-labelledby="voice-demo-title">
          <div className={styles.wrap}>
            <h2 id="voice-demo-title">{DEMO_HEADING}</h2>
            <p className={styles.sectionIntro}>{DEMO_LEAD}</p>

            {/* 항상 보이는 고지 — 데모의 모든 상태에서 가상임을 알 수 있어야 한다 */}
            <p className={styles.simNotice} role="note">
              <b>{SIMULATION_NOTICE}</b>
            </p>

            <ConversationDemo />

            {/*
              정적 fallback — 6개 업종의 전체 대본과 결과가 초기 HTML 에 그대로 들어간다.
              JS 가 꺼져 있어도, 스크린리더로 순서대로 읽어도 내용이 빠지지 않는다.
              (위 위젯은 진행 중인 대사, 여기는 전체 대본 — 둘의 역할을 구분한다.)
            */}
            <div className={styles.transcripts} data-voice-nojs>
              <h3 className={styles.subHeading}>업종별 전체 대본 (가상 예시)</h3>
              <p className={styles.note}>
                아래는 위 예시와 같은 대본 전문입니다. 자바스크립트 없이도 모든 업종의 대화와 결과를 읽을 수 있습니다.
              </p>
              {DEMO_SCENARIOS.map((s) => (
                <details key={s.id} className={styles.transcript}>
                  <summary>
                    {s.label} — {s.outcome.title}
                  </summary>
                  <p className={styles.transcriptIntro}>{s.introduction}</p>
                  <ol className={styles.transcriptList}>
                    {s.turns.map((t) => (
                      <li key={t.id} data-speaker={t.speaker}>
                        <b>{speakerLabel(t.speaker)}</b>
                        <span>{t.text}</span>
                      </li>
                    ))}
                  </ol>
                  <dl className={styles.transcriptResult}>
                    <div>
                      <dt>결과 유형</dt>
                      <dd>{s.outcome.title}</dd>
                    </div>
                    <div>
                      <dt>다음 행동</dt>
                      <dd>{s.outcome.nextStep}</dd>
                    </div>
                    <div>
                      <dt>끝까지 미확인</dt>
                      <dd>
                        {s.unresolved.length
                          ? s.unresolved.map((k) => s.fields.find((f) => f.key === k)?.label ?? k).join(' · ')
                          : '없음'}
                      </dd>
                    </div>
                  </dl>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 04 — 업종별 업무 범위 ────────────────── */}
        <section className={styles.section} id="voice-scope" aria-labelledby="voice-scope-title">
          <div className={styles.wrap}>
            <h2 id="voice-scope-title">{SCOPE_HEADING}</h2>
            <div className={styles.tableWrap}>
              <table className={styles.scopeTable}>
                <caption>업종별로 맡길 수 있는 업무 범위 — 설계 가능 범위이며 기본 제공 기능 목록이 아닙니다.</caption>
                <thead>
                  <tr>
                    <th scope="col">업종</th>
                    <th scope="col">먼저 맡길 업무</th>
                    <th scope="col">연동 후 검토할 업무</th>
                    <th scope="col">사람이 맡을 업무</th>
                  </tr>
                </thead>
                <tbody>
                  {INDUSTRY_SCOPES.map((i) => (
                    <tr key={i.key}>
                      <th scope="row">{i.label}</th>
                      <td>{i.first}</td>
                      <td>{i.afterIntegration}</td>
                      <td>{i.human}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.note}>{SCOPE_NOTE}</p>
          </div>
        </section>

        {/* ── SECTION 05 — AI가 맡는 업무와 처리 결과 ──────── */}
        <section className={`${styles.section} ${styles.soft}`} id="voice-features" aria-labelledby="voice-features-title">
          <div className={styles.wrap}>
            <h2 id="voice-features-title">{FEATURES_HEADING}</h2>
            <div className={styles.featureGrid}>
              {FEATURES.map((f, i) => (
                <article key={f.title} className={styles.featureCard}>
                  <span className={styles.featureIcon} aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </article>
              ))}
            </div>
            <p className={styles.limitNotice}>{FEATURES_NOTE}</p>
          </div>
        </section>

        {/* ── SECTION 06 — 통화 후 관리자 화면 예시 ────────── */}
        <section className={styles.section} id="voice-admin" aria-labelledby="voice-admin-title">
          <div className={styles.wrap}>
            <h2 id="voice-admin-title">{ADMIN_HEADING}</h2>
            <p className={styles.simNotice} role="note">
              <b>{ADMIN_BADGE}</b>
            </p>

            {/*
              행 선택은 radio + :checked 로만 동작한다(JS 0바이트).
              3건의 상세가 모두 초기 HTML 에 들어가므로 JS 가 없어도 내용이 빠지지 않고,
              전환에서 레이아웃이 튀지 않는다.
            */}
            <div className={styles.adminBoard}>
              {ADMIN_ROWS.map((r, i) => (
                <input
                  key={r.id}
                  className={styles.adminRadio}
                  type="radio"
                  name="voice-admin-row"
                  id={r.id}
                  defaultChecked={i === 0}
                />
              ))}

              <div className={styles.tableWrap}>
                <table className={styles.adminTable}>
                  <caption>가상 상담 3건 — 실제 고객 정보가 아닙니다.</caption>
                  <thead>
                    <tr>
                      <th scope="col">업종</th>
                      <th scope="col">문의 유형</th>
                      <th scope="col">핵심 요청</th>
                      <th scope="col">후속 조치</th>
                      <th scope="col">상태</th>
                    </tr>
                  </thead>
                  <tbody className={styles.adminRows}>
                    {ADMIN_ROWS.map((r) => (
                      <tr key={r.id} className={styles.adminRow}>
                        <th scope="row">
                          <label htmlFor={r.id}>{r.industry}</label>
                        </th>
                        <td>{r.inquiryType}</td>
                        <td>{r.summary}</td>
                        <td>{r.nextAction}</td>
                        <td>
                          <span className={styles.adminStatus} data-voice-status={r.status}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.adminDetails}>
                {ADMIN_ROWS.map((r) => (
                  <article key={r.id} className={styles.adminDetail}>
                    <h3>
                      {r.industry} · {r.inquiryType}
                    </h3>
                    <div className={styles.adminDetailGrid}>
                      <div>
                        <h4>확인된 정보</h4>
                        <ul>
                          {r.confirmed.map((c) => (
                            <li key={c}>{c}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4>확인하지 못한 정보</h4>
                        <ul>
                          {r.unconfirmed.map((c) => (
                            <li key={c}>
                              {c} <span className={styles.adminUnknown}>미확인</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4>다음 행동</h4>
                        <ol>
                          {r.steps.map((c) => (
                            <li key={c}>{c}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <p className={styles.note}>{ADMIN_NOTE}</p>
          </div>
        </section>

        {/* ── SECTION 07 — 기존 시스템 연결 구조 ───────────── */}
        <section className={styles.section} id="voice-arch" aria-labelledby="voice-arch-title">
          <div className={styles.wrap}>
            <h2 id="voice-arch-title">{ARCH_HEADING}</h2>

            <ol className={styles.archFlow} aria-label="통화가 업무로 이어지는 순서">
              {ARCH_FLOW.map((step, i) => (
                <li key={step}>
                  <span className={styles.archFlowNo} aria-hidden="true">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>

            <div className={styles.archList}>
              {ARCHITECTURE.map((layer, i) => (
                <article key={layer.title} className={styles.archLayer}>
                  <span className={styles.archNo} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3>{layer.title}</h3>
                    <p>{layer.detail}</p>
                    <ul className={styles.archParts}>
                      {layer.parts.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>

            <h3 className={styles.subHeading}>연동을 검토하는 대상</h3>
            <ul className={styles.integrationList}>
              {INTEGRATION_CATEGORIES.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className={styles.limitNotice}>{INTEGRATION_NOTE}</p>
          </div>
        </section>

        {/* ── SECTION 08 — 통제와 개인정보 ─────────────────── */}
        <section className={styles.section} id="voice-control" aria-labelledby="voice-control-title">
          <div className={styles.wrap}>
            <h2 id="voice-control-title">{CONTROL_HEADING}</h2>
            <div className={styles.controlGrid}>
              {CONTROL_LEVELS.map((c, i) => (
                <article key={c.title} className={styles.controlCard}>
                  <span className={styles.controlNo} aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </article>
              ))}
            </div>

            <h3 className={styles.subHeading}>사람에게 넘기는 조건</h3>
            <ul className={styles.handoffList}>
              {HANDOFF_CONDITIONS.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>

            <div className={styles.answerBlock} id="voice-privacy">
              <h3>{PRIVACY_HEADING}</h3>
              <p>{PRIVACY_NOTE}</p>
              <p className={styles.limitNotice}>{MEDICAL_NOTE}</p>
              <p className={styles.limitNotice}>{COMPLIANCE_NOTE}</p>
            </div>
          </div>
        </section>

        {/* ── SECTION 09 — 상품 범위 + 비용 구조 ───────────── */}
        <section className={`${styles.section} ${styles.soft}`} id="voice-package" aria-labelledby="voice-package-title">
          <div className={styles.wrap}>
            <h2 id="voice-package-title">{PACKAGE_HEADING}</h2>
            <p className={styles.sectionIntro}>{PACKAGE_LEAD}</p>

            <div className={styles.packageGrid}>
              {VOICE_PACKAGES.map((p) => (
                <article key={p.slug} className={styles.packageCard}>
                  <h3>{p.name}</h3>
                  <p className={styles.packagePurpose}>{p.purpose}</p>
                  <dl className={styles.packageList}>
                    <div>
                      <dt>기본 구성</dt>
                      <dd>{p.composition}</dd>
                    </div>
                    <div>
                      <dt>사람에게 넘기기</dt>
                      <dd>{p.handoff}</dd>
                    </div>
                    <div>
                      <dt>관리자</dt>
                      <dd>{p.admin}</dd>
                    </div>
                    <div>
                      <dt>비용</dt>
                      <dd className={styles.packagePrice}>{p.price}</dd>
                    </div>
                  </dl>
                  {/*
                    평범한 앵커다. JS 가 없으면 그냥 문의 폼으로 이동하고 방문자가 직접 고른다.
                    JS 가 있으면 폼의 '관심 구축 범위' enum 만 맞춰 준다(자동 접수 아님).
                  */}
                  <a
                    className={styles.packageCta}
                    href="#voice-inquiry"
                    {...{ [VOICE_DATA_ATTR.package]: p.slug }}
                  >
                    {p.cta}
                  </a>
                </article>
              ))}
            </div>
            <p className={styles.note}>{PACKAGE_BASELINE_NOTE}</p>

            <div className={styles.answerBlock} id="voice-cost">
              <h3>{COST_HEADING}</h3>
              <p>{COST_ANSWER}</p>
            </div>

            <div className={styles.costGroups}>
              {COST_GROUPS.map((g, i) => (
                <article key={g.title} className={styles.costGroup}>
                  <span className={styles.archNo} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3>{g.title}</h3>
                  <p>{g.lead}</p>
                  <ul className={styles.costItems}>
                    {g.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <p className={styles.limitNotice}>{COST_SUPPLEMENT}</p>

            <h3 className={styles.subHeading}>견적에 영향을 주는 요소</h3>
            <ul className={styles.integrationList}>
              {COST_FACTORS.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── SECTION 10 — 전화 업무량 계산 ────────────────── */}
        <section className={styles.section} id="voice-workload" aria-labelledby="voice-workload-title">
          <div className={styles.wrap}>
            <h2 id="voice-workload-title">{WORKLOAD_HEADING}</h2>
            <p className={styles.sectionIntro}>{WORKLOAD_LEAD}</p>

            <div data-voice-calc-interactive>
              <WorkloadCalculator />
            </div>

            {/*
              계산 원리와 예시 가정은 정적 HTML 로도 읽혀야 한다(§8).
              JS 가 없으면 위 위젯이 감춰지고 이 설명만 남는다.
            */}
            <div className={styles.calcStatic} data-voice-nojs>
              <h3 className={styles.subHeading}>계산 방식</h3>
              <ol className={styles.calcFormula}>
                <li>월 전체 전화 건수 = 하루 전화 수 × 월 운영일</li>
                <li>현재 통화시간 = 월 전체 전화 건수 × 평균 통화시간</li>
                <li>가정상 AI 완결 처리 건수 = 월 전체 전화 건수 × 반복 업무 비율 × AI 완결 처리 비율</li>
                <li>직접 응대 감소시간 = AI 완결 처리 건수 × 평균 통화시간</li>
                <li>사람 확인시간 = AI 완결 처리 건수 × 건당 확인시간</li>
                <li>순감소 추정시간 = 직접 응대 감소시간 − 사람 확인시간</li>
              </ol>
              <p className={styles.note}>
                예시 가정(하루 20건, 통화 3분, 월 22일, 반복 60%, AI 완결 70%, 확인 0.5분)으로 계산하면 월 440건,
                현재 통화시간 22시간, AI 완결 약 185건, 순감소 추정 7.7시간입니다. 이 값은 실측 성과가 아니라 입력한
                가정의 결과입니다.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 11 — 구축 절차와 첫 검증 범위 ────────── */}
        <section className={`${styles.section} ${styles.dark}`} id="voice-process" aria-labelledby="voice-process-title">
          <div className={styles.wrap}>
            <h2 id="voice-process-title">{PROCESS_HEADING}</h2>
            <ol className={styles.processList}>
              {PROCESS.map((p, i) => (
                <li key={p.title}>
                  <span className={styles.stepNo} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className={styles.firstDeliverable}>{FIRST_DELIVERABLE}</p>

            <h3 className={styles.subHeading}>이후에 넓힐 수 있는 범위</h3>
            <ul className={styles.integrationList}>
              {EXPANSION_SCOPE.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
            <p className={styles.note}>
              {EXPANSION_NOTE} 새 서비스를 최소 기능으로 먼저 검증하려면{' '}
              <Link href="/mvp/">앱·SaaS MVP 개발</Link> 범위를 함께 검토합니다.
            </p>
            <p className={styles.limitNotice}>{DURATION_NOTE}</p>
          </div>
        </section>

        {/* ── SECTION 12 — 관련 구현 경험 + 관련 서비스 ────── */}
        <section className={styles.section} id="voice-cases" aria-labelledby="voice-cases-title">
          <div className={styles.wrap}>
            <h2 id="voice-cases-title">{CASES_HEADING}</h2>
            <p className={styles.sectionIntro}>{RELATED_CASE_NOTE}</p>

            {cases.length > 0 ? (
              <div className={styles.caseGrid}>
                {cases.map((project) => (
                  <Link key={project.id} className={styles.caseCard} href={portfolioCanonical(project.id)}>
                    <span className={styles.caseChip}>{project.chip}</span>
                    <h3>{project.title}</h3>
                    <p>{project.problem}</p>
                  </Link>
                ))}
              </div>
            ) : null}

            {clusterLinks.length > 0 ? (
              <>
                <h3 className={styles.subHeading}>판단에 도움이 되는 글</h3>
                <ul className={styles.clusterList}>
                  {clusterLinks.map((c) => (
                    <li key={c.href}>
                      <Link href={c.href}>{c.label}</Link>
                      <span className={styles.clusterKind}>{c.kind}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <h3 className={styles.subHeading} id="voice-related">
              관련 서비스
            </h3>
            <div className={styles.relatedGrid}>
              {RELATED_LINKS.map((r) => (
                <Link key={r.href} className={styles.relatedCard} href={r.href}>
                  <b>{r.label}</b>
                  <span>{r.note}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 13 — FAQ ─────────────────────────────── */}
        <section className={`${styles.section} ${styles.soft}`} id="voice-faq" aria-labelledby="voice-faq-title">
          <div className={styles.wrap}>
            <h2 id="voice-faq-title">{FAQ_HEADING}</h2>
            {/*
              답변은 전부 초기 HTML 에 있다. 열기 전에도 크롤러·스크린리더가 읽는다.
              이 배열은 위 FAQPage 구조화 데이터와 같은 원본이다(한쪽만 고치면 검사 실패).
            */}
            <div className={styles.faqList}>
              {FAQS.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 14 — 실제 도입 문의 ──────────────────── */}
        <section className={`${styles.section} ${styles.inquiry}`} id="voice-inquiry" aria-labelledby="voice-inquiry-title">
          <div className={styles.wrap}>
            <div className={styles.inquiryIntro}>
              <h2 id="voice-inquiry-title">{INQUIRY_HEADING}</h2>
              <p>{INQUIRY_LEAD}</p>
            </div>

            <LandingInquiryForm
              landingSlug="ai-voice-development"
              variant="ai-voice"
              submitLabel={INQUIRY_SUBMIT_LABEL}
            />

            <p className={styles.contactLinks}>
              {INQUIRY_PHONE_NOTE}{' '}
              <a href={SITE.phoneHref}>{SITE.phone}</a>
            </p>
            <p className={styles.assurance}>{INQUIRY_ASSURANCE}</p>
          </div>
        </section>
      </main>

      <BusinessFooter />
    </>
  );
}
