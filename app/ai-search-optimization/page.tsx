import type { Metadata } from 'next';
import Link from '@/components/SiteLink';
import BusinessFooter from '@/components/BusinessFooter';
import LandingInquiryForm from '@/components/LandingInquiryForm';
import { ServiceWebPageJsonLd, HOME_CRUMB } from '@/components/JsonLd';
import { getProject, portfolioCanonical } from '@/lib/portfolio';
import { SITE } from '@/lib/seo';
import {
  ACRONYMS,
  ACRONYM_NOTE,
  AISA_CANONICAL,
  AISA_DESCRIPTION,
  AISA_KEYWORDS,
  AISA_OG_IMAGE,
  AISA_MENU_LABEL,
  AISA_PRODUCT_NAME_EN,
  AISA_PRODUCT_NAME_KO,
  AISA_TITLE,
  BEFORE_AFTER,
  CARE_LIMIT_NOTE,
  CARE_NOTE,
  CARE_PLANS,
  EXTRA_QUOTE,
  FAQS,
  FINAL_CTA,
  FIT,
  FREE_PAID_NOTE,
  HERO,
  HERO_FLOW,
  HOW_WE_WORK,
  NEO_DISCLAIMER,
  PACKAGES,
  PLATFORMS,
  PLATFORM_NOTE,
  PREPARE_ITEMS,
  PRESERVATION,
  PRICING_NOTES,
  PROCESS,
  REFERENCES,
  REFERENCES_NOTE,
  RELATED_CASE_IDS,
  RELATED_CASE_NOTE,
  RELATED_LINKS,
  SCOPE_AREAS,
  SCOPE_NOTE,
  SECURITY_NOTE,
  SUMMARY,
  TOC,
  VERIFY_COLUMNS,
  aisaOfferNodes,
  fromText,
  monthlyText,
} from '@/lib/ai-search-architecture';
import '../reum-sales.css';
import styles from './ai-search.module.css';

/**
 * /ai-search-optimization/ — AI Search Architecture (기존 홈페이지 검색 구조 개선).
 *
 * 이 파일은 "화면"만 담당한다. 가격·범위·기간·FAQ 문구는 전부
 * lib/ai-search-architecture.ts 에서 읽어 오고, 여기서 숫자나 문장을 다시 쓰지 않는다
 * (화면과 구조화 데이터가 갈리지 않게 하기 위한 규칙).
 *
 * Server Component 다. 클라이언트로 내려가는 것은 상담 폼 하나뿐이고,
 * 목차·범위 탭·FAQ 는 전부 JS 없이 동작한다(앵커 / radio+:checked / details).
 * → 가격·FAQ·제외 조건이 초기 HTML 에 전부 들어간다.
 */

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  // absolute — 루트 레이아웃의 title 템플릿이 브랜드명을 한 번 더 붙이지 않게 한다
  title: { absolute: AISA_TITLE },
  description: AISA_DESCRIPTION,
  keywords: [...AISA_KEYWORDS],
  alternates: { canonical: AISA_CANONICAL },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: AISA_CANONICAL,
    siteName: SITE.name,
    title: AISA_TITLE,
    description: AISA_DESCRIPTION,
    images: [{ url: AISA_OG_IMAGE, width: 1200, height: 630, alt: '기존 홈페이지 AI 검색 구조 개선 — 름랩' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: AISA_TITLE,
    description: AISA_DESCRIPTION,
    images: [AISA_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

const cases = RELATED_CASE_IDS.map((id) => getProject(id)).filter(
  (item): item is NonNullable<ReturnType<typeof getProject>> => Boolean(item),
);

export default function AiSearchOptimizationPage() {
  return (
    <>
      {/*
        구조화 데이터 — 전역 WebSite/Organization/LocalBusiness 는 루트 레이아웃의 고정 @id 를
        참조만 한다(여기서 조직 노드를 다시 선언하지 않는다).
        FAQPage 는 화면에 실제로 렌더되는 FAQS 배열 그대로를 넘긴다. FAQ 리치 결과는
        더 이상 노출되지 않지만, 페이지 내용을 그대로 기술하는 유효한 구조화 데이터라
        기존 서비스 상세페이지와 같은 방식을 유지한다 — 노출 보장의 근거로 쓰지 않는다.
      */}
      <ServiceWebPageJsonLd
        url={AISA_CANONICAL}
        name={`${AISA_PRODUCT_NAME_EN} — ${AISA_PRODUCT_NAME_KO}`}
        description={AISA_DESCRIPTION}
        serviceType="기존 홈페이지 검색 구조 개선 (SEO·GEO·AEO)"
        crumbs={[HOME_CRUMB, { name: AISA_MENU_LABEL, url: AISA_CANONICAL }]}
        offers={aisaOfferNodes()}
        faqs={FAQS.map((f) => ({ q: f.q, a: f.a }))}
      />

      <main className={styles.page}>
        {/* ── 7-1 breadcrumb + 7-2 Hero ───────────────────────── */}
        <header className={styles.hero}>
          <div className={styles.wrap}>
            <nav className={styles.breadcrumb} aria-label="현재 위치">
              <Link href="/">홈</Link>
              <span aria-hidden="true">›</span>
              <span aria-current="page">AI 검색 구조 개선</span>
            </nav>

            <div className={styles.heroGrid}>
              <div>
                <p className={styles.eyebrow}>{HERO.eyebrow}</p>
                {/* H1 은 데이터의 두 줄을 그대로 쓴다 — 폰트 교체로 줄 수가 뒤집혀
                    레이아웃이 밀리는 것을 막기 위해 줄바꿈을 고정한다 */}
                <h1>
                  {HERO.h1Lines[0]}
                  <br />
                  {HERO.h1Lines[1]}
                </h1>
                <p className={styles.heroSub}>{HERO.sub}</p>
                <p className={styles.heroBody}>{HERO.body}</p>

                <div className={styles.actions}>
                  <a
                    href={HERO.ctaPrimary.href}
                    className={styles.btnPrimary}
                    data-analytics="cta_aisa_hero_form"
                    data-cta-type="form"
                    data-cta-location="hero"
                  >
                    {HERO.ctaPrimary.label}
                  </a>
                  <a
                    href={HERO.ctaSecondary.href}
                    className={styles.btnSecondary}
                    data-analytics="cta_aisa_hero_pricing"
                    data-cta-location="hero"
                  >
                    {HERO.ctaSecondary.label}
                  </a>
                </div>

                <p className={styles.priceNote}>{HERO.priceNote}</p>
                <ul className={styles.trustStrip}>
                  {HERO.trust.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>

              {/* 구조 예시. 실제 AI 추천 화면·수치 대시보드·외부 AI 로고를 쓰지 않는다. */}
              <figure className={styles.heroFigure}>
                <figcaption>정보 구조 예시 · 실제 AI 답변 화면이나 측정 대시보드가 아닙니다</figcaption>
                <ol>
                  {HERO_FLOW.map((step, i) => (
                    <li key={step.key}>
                      <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                      <b>{step.label}</b>
                      <small>{step.detail}</small>
                    </li>
                  ))}
                </ol>
              </figure>
            </div>
          </div>
        </header>

        {/* ── 7-1 페이지 내 목차 — JS 없이 동작하는 앵커 ────────── */}
        <nav className={styles.toc} aria-label="이 페이지의 주요 섹션">
          <div className={`${styles.wrap} ${styles.tocInner}`}>
            <span className={styles.tocLabel}>바로 가기</span>
            {TOC.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* ── 7-3 서비스 한눈에 보기 ────────────────────────────── */}
        <section className={styles.section} aria-labelledby="aisa-summary">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>WHAT IT IS</p>
            <h2 id="aisa-summary">{SUMMARY.heading}</h2>
            {/* 질문 바로 다음에 한 문단 답변 — 발췌해도 뜻이 통하게 한다 */}
            <p className={styles.answerBlock}>{SUMMARY.answer}</p>
            <dl className={styles.factGrid}>
              {SUMMARY.facts.map((f) => (
                <div key={f.k}>
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── 7-4 적합 / 맞지 않는 요구 ─────────────────────────── */}
        <section className={`${styles.section} ${styles.soft}`} aria-labelledby="aisa-fit">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>WHO IT IS FOR</p>
            <h2 id="aisa-fit">{FIT.heading}</h2>
            <ul className={styles.fitList}>
              {FIT.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className={styles.caution}>{FIT.notFit}</p>
          </div>
        </section>

        {/* ── 7-5 무엇을 실제로 바꾸는가 (개선 범위 구조도) ─────── */}
        <section id="scope" className={`${styles.section} ${styles.dark}`} aria-labelledby="aisa-scope">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>SCOPE</p>
            <h2 id="aisa-scope">무엇을 실제로 바꾸나요?</h2>
            <p className={styles.lead}>
              여섯 개 영역을 같은 기준으로 봅니다. 각 영역마다 지금 어떤 문제가 있는지, 름랩이 무엇을 하는지, 무엇을 받는지 먼저 정하고 시작합니다.
            </p>

            {/*
              구조도 상호작용 — radio + :checked 만 쓴다(자바스크립트 0줄).
              · 여섯 장의 카드 설명이 전부 초기 HTML 에 있고, 선택은 강조만 바꾼다.
              · 라디오 그룹이라 ←/→ 키 이동·포커스·스크린리더 안내가 브라우저 기본으로 동작한다.
              · 선택 상태가 꺼져도(=JS·CSS 실패) 여섯 장 모두 그대로 읽힌다.
            */}
            <fieldset className={styles.scopeWrap}>
              <legend className={styles.srOnly}>강조해서 볼 개선 영역 선택</legend>
              {SCOPE_AREAS.map((area, i) => (
                <input
                  key={`r-${area.key}`}
                  className={styles.scopeRadio}
                  type="radio"
                  name="aisa-scope"
                  id={`aisa-scope-${area.key}`}
                  defaultChecked={i === 0}
                />
              ))}
              <div className={styles.scopeTabs}>
                {SCOPE_AREAS.map((area) => (
                  <label key={`l-${area.key}`} className={styles.scopeTab} htmlFor={`aisa-scope-${area.key}`}>
                    {area.title}
                  </label>
                ))}
              </div>
              <div className={styles.scopeGrid}>
                {SCOPE_AREAS.map((area) => (
                  <article key={area.key} className={styles.scopeCard}>
                    <h3>{area.title}</h3>
                    <dl>
                      <div>
                        <dt>지금 생기는 문제</dt>
                        <dd>{area.problem}</dd>
                      </div>
                      <div>
                        <dt>름랩이 하는 일</dt>
                        <dd>{area.work}</dd>
                      </div>
                      <div>
                        <dt>받는 것</dt>
                        <dd className={styles.out}>{area.deliverable}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            </fieldset>

            <p className={styles.lead}>{SCOPE_NOTE}</p>
          </div>
        </section>

        {/* ── 7-6 적용 전후 구조 예시 ───────────────────────────── */}
        <section id="example" className={styles.section} aria-labelledby="aisa-example">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>BEFORE / AFTER</p>
            <h2 id="aisa-example">{BEFORE_AFTER.heading}</h2>
            <p className={styles.exampleLabel}>{BEFORE_AFTER.label}</p>
            <div className={styles.baGrid}>
              <div className={styles.baCol}>
                <h3>{BEFORE_AFTER.before.title}</h3>
                <ul>
                  {BEFORE_AFTER.before.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <p className={styles.baNote}>{BEFORE_AFTER.before.note}</p>
              </div>
              <div className={`${styles.baCol} ${styles.baAfter}`}>
                <h3>{BEFORE_AFTER.after.title}</h3>
                <ul>
                  {BEFORE_AFTER.after.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7-7 름랩의 구현 방식 + 관련 구현 경험 ─────────────── */}
        <section className={`${styles.section} ${styles.soft}`} aria-labelledby="aisa-how">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>HOW WE WORK</p>
            <h2 id="aisa-how">{HOW_WE_WORK.heading}</h2>
            <p className={styles.lead}>{HOW_WE_WORK.body}</p>
            <ul className={styles.deliverStrip}>
              {HOW_WE_WORK.deliverables.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>

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
            <p className={styles.note}>{RELATED_CASE_NOTE}</p>
          </div>
        </section>

        {/* ── 7-8 기존 검색 자산 보호 ───────────────────────────── */}
        <section className={styles.section} aria-labelledby="aisa-preserve">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>PRESERVATION</p>
            <h2 id="aisa-preserve">{PRESERVATION.heading}</h2>
            <ol className={styles.stepList}>
              {PRESERVATION.steps.map((s) => (
                <li key={s.no}>
                  <span aria-hidden="true">{s.no}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className={styles.note}>{PRESERVATION.note}</p>
          </div>
        </section>

        {/* ── 7-9 적용 가능 환경 ────────────────────────────────── */}
        <section className={`${styles.section} ${styles.soft}`} aria-labelledby="aisa-platform">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>PLATFORMS</p>
            <h2 id="aisa-platform">어떤 홈페이지에 적용할 수 있나요?</h2>
            <div className={styles.tableWrap}>
              <table className={styles.dataTable}>
                <caption>홈페이지 환경별 적용 범위</caption>
                <thead>
                  <tr>
                    <th scope="col">홈페이지 환경</th>
                    <th scope="col">적용 범위</th>
                  </tr>
                </thead>
                <tbody>
                  {PLATFORMS.map((p) => (
                    <tr key={p.env}>
                      <th scope="row">{p.env}</th>
                      <td>{p.scope}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.note}>{PLATFORM_NOTE}</p>
          </div>
        </section>

        {/* ── 7-10 패키지와 비교표 ──────────────────────────────── */}
        <section id="pricing" className={styles.section} aria-labelledby="aisa-pricing">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>PRICING</p>
            <h2 id="aisa-pricing">필요한 깊이만큼, 범위가 보이는 견적.</h2>
            <p className={styles.lead}>
              세 패키지 모두 VAT 포함 시작가입니다. 카드에서 범위를 확인하고 상담에서 최종 견적을 정합니다.
            </p>

            <div className={styles.priceGrid}>
              {PACKAGES.map((pkg) => (
                <article
                  key={pkg.id}
                  className={pkg.recommended ? `${styles.priceCard} ${styles.priceCardRec}` : styles.priceCard}
                  aria-labelledby={`aisa-pkg-${pkg.id}`}
                >
                  {pkg.recommended ? <span className={styles.recBadge}>가장 많이 선택하는 범위</span> : null}
                  <h3 id={`aisa-pkg-${pkg.id}`}>{pkg.name}</h3>
                  <p className={styles.priceTagline}>{pkg.tagline}</p>
                  <p className={styles.priceAmount}>{fromText(pkg.priceWon)}</p>
                  <p className={styles.priceVat}>VAT 포함 · {pkg.priceWon.toLocaleString('ko-KR')}원</p>
                  <p className={styles.priceDuration}>{pkg.duration}</p>
                  <ul className={styles.priceSpecs}>
                    <li>진단 {pkg.auditUrls.toLocaleString('ko-KR')} URL</li>
                    <li>실제 수정 {pkg.editPages}페이지</li>
                    <li>공통 템플릿 {pkg.templates}종</li>
                  </ul>
                  <ul className={styles.priceIncludes}>
                    {pkg.includes.map((inc) => (
                      <li key={inc}>{inc}</li>
                    ))}
                  </ul>
                  {pkg.excludes ? (
                    <p className={styles.priceExcludes}>제외: {pkg.excludes.join(' · ')}</p>
                  ) : null}
                  <p className={styles.priceCta}>
                    {/*
                      JS 가 없어도 #inquiry 로 이동한다. JS 가 있으면 상담 폼의
                      '관심 패키지' 가 이 값으로 맞춰진다(LandingInquiryForm 이 위임 처리).
                    */}
                    <a
                      href="#inquiry"
                      className={styles.btnPrimary}
                      data-aisa-package={pkg.value}
                      data-analytics="cta_aisa_pricing_form"
                      data-cta-type="form"
                      data-cta-location="pricing"
                      data-cta-package={pkg.value}
                    >
                      {pkg.value} 범위 상담
                    </a>
                  </p>
                </article>
              ))}
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.dataTable}>
                <caption>패키지 범위 비교 — 모든 금액은 VAT 포함 시작가</caption>
                <thead>
                  <tr>
                    <th scope="col">항목</th>
                    {PACKAGES.map((pkg) => (
                      <th key={pkg.id} scope="col">
                        {pkg.value}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">시작가 (VAT 포함)</th>
                    {PACKAGES.map((pkg) => (
                      <td key={pkg.id}>{fromText(pkg.priceWon)}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">기술 진단 범위</th>
                    {PACKAGES.map((pkg) => (
                      <td key={pkg.id}>공개 HTML 최대 {pkg.auditUrls.toLocaleString('ko-KR')} URL</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">실제 수정 페이지</th>
                    {PACKAGES.map((pkg) => (
                      <td key={pkg.id}>최대 {pkg.editPages}개</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">공통 템플릿 개선</th>
                    {PACKAGES.map((pkg) => (
                      <td key={pkg.id}>최대 {pkg.templates}종</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">예상 기간</th>
                    {PACKAGES.map((pkg) => (
                      <td key={pkg.id}>{pkg.duration}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">적합한 사이트</th>
                    {PACKAGES.map((pkg) => (
                      <td key={pkg.id}>{pkg.target}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">제외 범위</th>
                    {PACKAGES.map((pkg) => (
                      <td key={pkg.id}>
                        {pkg.excludes ? pkg.excludes.join(' · ') : '아래 별도 견적 항목과 동일'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.extraQuote}>
              <h3>별도 견적이 필요한 범위</h3>
              <ul>
                {EXTRA_QUOTE.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>

            <div className={styles.compareNote}>
              {PRICING_NOTES.map((n) => (
                <p key={n}>{n}</p>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7-11 선택형 지속 관리 ─────────────────────────────── */}
        <section className={`${styles.section} ${styles.soft}`} aria-labelledby="aisa-care">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>OPTIONAL</p>
            <h2 id="aisa-care">구축 이후에도, 같은 기준으로 관찰할 수 있습니다.</h2>
            <p className={styles.lead}>{CARE_NOTE}</p>
            <div className={styles.careGrid}>
              {CARE_PLANS.map((plan) => (
                <article key={plan.id} className={styles.careCard} aria-labelledby={`aisa-care-${plan.id}`}>
                  <div className={styles.careHead}>
                    <h3 id={`aisa-care-${plan.id}`}>{plan.name}</h3>
                    <span className={styles.carePrice}>{monthlyText(plan.monthlyWon)}</span>
                    <span className={styles.priceVat}>VAT 포함</span>
                  </div>
                  <ul>
                    {plan.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <p className={styles.caution}>{CARE_LIMIT_NOTE}</p>
          </div>
        </section>

        {/* ── 6. SEO·GEO·AEO·NEO 설명 기준 ──────────────────────── */}
        <section className={styles.section} aria-labelledby="aisa-terms">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>TERMS</p>
            <h2 id="aisa-terms">SEO·GEO·AEO·NEO는 각각 무슨 작업인가요?</h2>
            <div className={styles.tableWrap}>
              <table className={styles.dataTable}>
                <caption>름랩이 쓰는 작업 분류와 실제로 하는 일</caption>
                <thead>
                  <tr>
                    <th scope="col">분류</th>
                    <th scope="col">실제 작업</th>
                    <th scope="col">쉽게 말하면</th>
                  </tr>
                </thead>
                <tbody>
                  {ACRONYMS.map((a) => (
                    <tr key={a.key}>
                      <th scope="row">{a.key}</th>
                      <td>{a.work}</td>
                      <td>{a.public}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.caution}>{NEO_DISCLAIMER}</p>
            <p className={styles.note}>{ACRONYM_NOTE}</p>
          </div>
        </section>

        {/* ── 7-12 진행 방식과 제출 자료 ────────────────────────── */}
        <section id="process" className={`${styles.section} ${styles.soft}`} aria-labelledby="aisa-process">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>PROCESS</p>
            <h2 id="aisa-process">상담부터 인수인계까지, 5단계로 진행합니다.</h2>
            <ol className={styles.stepList}>
              {PROCESS.map((p) => (
                <li key={p.no}>
                  <span aria-hidden="true">{p.no}</span>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className={styles.extraQuote}>
              <h3>상담 전에 준비하면 좋은 것</h3>
              <ul>
                {PREPARE_ITEMS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <p className={styles.caution}>{SECURITY_NOTE}</p>
            <p className={styles.note}>{FREE_PAID_NOTE}</p>
          </div>
        </section>

        {/* ── 7-13 성과를 어떻게 확인하는가 ─────────────────────── */}
        <section className={styles.section} aria-labelledby="aisa-verify">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>VERIFICATION</p>
            <h2 id="aisa-verify">{VERIFY_COLUMNS.heading}</h2>
            <div className={styles.verifyGrid}>
              <div className={styles.verifyCol}>
                <h3>{VERIFY_COLUMNS.implementation.title}</h3>
                <p>{VERIFY_COLUMNS.implementation.subtitle}</p>
                <ul>
                  {VERIFY_COLUMNS.implementation.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.verifyCol}>
                <h3>{VERIFY_COLUMNS.observation.title}</h3>
                <p>{VERIFY_COLUMNS.observation.subtitle}</p>
                <ul>
                  {VERIFY_COLUMNS.observation.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className={styles.note}>{VERIFY_COLUMNS.note}</p>
            {/* 실제 측정 데이터가 없으므로 숫자를 채운 샘플 리포트를 만들지 않는다 —
                어떤 항목을 기록하는지 문서 구조만 보여 준다. */}
            <p className={styles.lead}>관찰 리포트는 다음 항목으로 기록합니다.</p>
            <ul className={styles.reportCols}>
              {VERIFY_COLUMNS.reportColumns.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── 7-14 FAQ — 질문·답변 모두 초기 HTML 에 포함 ───────── */}
        <section id="faq" className={`${styles.section} ${styles.soft}`} aria-labelledby="aisa-faq">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>FAQ</p>
            <h2 id="aisa-faq">자주 묻는 질문</h2>
            <div className={styles.faqList}>
              {FAQS.map((faq) => (
                <details key={faq.id} id={faq.id}>
                  <summary>{faq.q}</summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>

            {/* 7-16 참고한 공개 기준 — 공식 문서 링크만. 제휴·인증처럼 보이는 로고 행을 만들지 않는다. */}
            <div className={styles.refs}>
              <h3>참고한 공개 기준</h3>
              <ul>
                {REFERENCES.map((ref) => (
                  <li key={ref.href}>
                    <a href={ref.href} target="_blank" rel="noopener noreferrer">
                      {ref.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p>{REFERENCES_NOTE}</p>
            </div>
          </div>
        </section>

        {/* ── 7-15 최종 상담 ────────────────────────────────────── */}
        <section id="inquiry" className={`${styles.section} ${styles.inquiry}`} aria-labelledby="aisa-inquiry">
          <div className={styles.wrap}>
            <div className={styles.inquiryIntro}>
              <p className={styles.eyebrow}>CONTACT</p>
              <h2 id="aisa-inquiry">{FINAL_CTA.heading}</h2>
              <p>{FINAL_CTA.body}</p>
              <ul className={styles.inquiryNotices}>
                {FINAL_CTA.notices.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
              {/* 연락처는 SITE 단일 출처에서 읽는다 — 이 페이지에서 새 번호를 만들지 않는다 */}
              <div className={styles.contactLinks}>
                <a href={SITE.phoneHref} data-analytics="cta_aisa_final_call" data-cta-type="phone">
                  전화 {SITE.phone}
                </a>
                <a
                  href={SITE.kakaoChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-analytics="cta_aisa_final_kakao"
                  data-cta-type="kakao"
                >
                  카카오톡 상담
                </a>
                <a href={`mailto:${SITE.email}`} data-analytics="cta_aisa_final_email" data-cta-type="email">
                  이메일 문의
                </a>
              </div>
            </div>
            <LandingInquiryForm
              landingSlug="ai-search-optimization"
              defaultServiceType="데이터·SEO 시스템"
              variant="ai-search-architecture"
              submitLabel={FINAL_CTA.submitLabel}
            />
          </div>
        </section>

        {/* ── 7-16 관련 서비스 ──────────────────────────────────── */}
        <section className={styles.section} aria-labelledby="aisa-related">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>RELATED</p>
            <h2 id="aisa-related">이 서비스가 맞지 않는다면</h2>
            <p className={styles.lead}>
              {AISA_PRODUCT_NAME_EN}는 이미 운영 중인 홈페이지를 개선하는 서비스입니다. 목적이 다르면 아래 서비스를 확인해 주세요.
            </p>
            <div className={styles.relatedGrid}>
              {RELATED_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className={styles.relatedCard}>
                  <b>{link.label}</b>
                  <span>{link.note}</span>
                  <em>자세히 보기 →</em>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <BusinessFooter topExtra={<Link href="/geo-website/">← 홈페이지를 새로 만들어야 한다면 GEO 홈페이지 제작</Link>} />
    </>
  );
}
