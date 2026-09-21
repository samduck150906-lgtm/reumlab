import type { Metadata } from 'next';
import Link from '@/components/SiteLink';
import { SITE } from '@/lib/seo';
import {
  AI_WORKER_CANONICAL,
  AI_WORKER_TITLE,
  AI_WORKER_DESCRIPTION,
  AI_WORKER_H1,
  AI_WORKER_EYEBROW,
  AI_WORKER_LEAD,
  AI_WORKER_KEYWORDS,
  AI_WORKER_ENTITY_STATEMENT,
  PROBLEMS_LEAD,
  PROBLEMS,
  DEFINITION_HEADING,
  DEFINITION_BODY,
  CHATBOT_COMPARE,
  CHATBOT_COMPARE_NOTE,
  WORKER_CARDS,
  WORKER_CARDS_NOTE,
  BEFORE_AFTER,
  BEFORE_AFTER_NOTE,
  BUILD_STEPS,
  CONNECTION_LEAD,
  CONNECTION_MODES,
  CONNECTION_NOTE,
  PERMISSION_LEVELS,
  PERMISSION_NOTE,
  INDUSTRY_CASES,
  INDUSTRY_CASES_NOTE,
  PROCESS,
  PROCESS_NOTE,
  COST_FACTORS,
  COST_NOTE,
  FAQS,
  CTA_LEAD,
  RELATED_LINKS,
  aiWorkerDecision,
} from '@/lib/ai-worker';
import { robotsFor } from '@/lib/index-quality';
import { IndustryServiceJsonLd } from '@/components/JsonLd';
import { guidesForService, resolveCluster } from '@/lib/content-cluster';
import { getGuide } from '@/lib/guides';
import { getCompare } from '@/lib/compare';
import { getBlogPostBySlug } from '@/lib/blog-posts';
import BusinessFooter from '@/components/BusinessFooter';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: { absolute: AI_WORKER_TITLE },
  description: AI_WORKER_DESCRIPTION,
  keywords: AI_WORKER_KEYWORDS,
  // "업무를 수행하는 AI" 라는 독립 검색 의도를 갖는다. /ai-automation/ 이나
  // /enterprise-ai/ 로 canonical 을 보내지 않는다 — 서로 다른 질문에 답하는 페이지다.
  alternates: { canonical: AI_WORKER_CANONICAL },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: AI_WORKER_CANONICAL,
    siteName: SITE.name,
    title: AI_WORKER_TITLE,
    description: AI_WORKER_DESCRIPTION,
    // 전용 이미지가 없으므로 사이트 대표 OG 를 재사용한다(없는 경로를 만들지 않는다).
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: 'AI Worker 구축 — 름랩' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: AI_WORKER_TITLE,
    description: AI_WORKER_DESCRIPTION,
    images: [SITE.defaultOgImage],
  },
  robots: robotsFor(aiWorkerDecision()),
};

const H2 = { fontSize: '1.3rem' } as const;
const H2_SMALL = { fontSize: '1.15rem' } as const;
const SECTION = { paddingTop: 8 } as const;
const LIST = { marginTop: 8, paddingLeft: 18, lineHeight: 2 } as const;
const TH = {
  textAlign: 'left',
  padding: '10px 12px',
  borderBottom: '2px solid var(--green)',
} as const;
const TD = {
  padding: '10px 12px',
  borderBottom: '1px solid rgba(128,128,128,0.2)',
} as const;

export default function AiWorkerPage() {
  const crumbs = [
    { name: '홈', url: `${SITE.domain}/` },
    { name: 'AI 개발', url: `${SITE.domain}/ai-development/` },
    { name: 'AI Worker 구축', url: AI_WORKER_CANONICAL },
  ];

  return (
    <>
      <IndustryServiceJsonLd
        /* Service.name 은 H1 에 실제로 들어 있는 문구를 쓴다 — 스키마와 화면이 어긋나면
           구조화 데이터 정책 위반이고, 검사기(seo:verify:services)도 이 일치를 본다. */
        name="AI Worker 구축"
        serviceType="AI 업무 자동화 시스템 개발"
        description={AI_WORKER_DESCRIPTION}
        url={AI_WORKER_CANONICAL}
        faqs={FAQS}
        crumbs={crumbs}
      />
      <main>
        <article className="dynamic-page">
          <nav className="breadcrumb" aria-label="breadcrumb">
            <Link href="/">홈</Link>
            {' / '}
            <Link href="/ai-development/">AI 개발</Link>
            {' / '}
            <span>AI Worker 구축</span>
          </nav>

          {/* ── 1. Hero ── */}
          <div className="section-inner">
            <p className="section-tag">{AI_WORKER_EYEBROW}</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)' }}>
              {AI_WORKER_H1}
            </h1>
            <p className="hub-intro">{AI_WORKER_LEAD}</p>

            <div className="cta-buttons" style={{ marginTop: 24 }}>
              <a
                href={SITE.phoneHref}
                className="btn-primary"
                data-analytics="cta_ai_worker_call"
                data-service="ai_worker"
              >
                📞 {SITE.phone} · AI Worker 구축 상담하기
              </a>
              <a href="#process" className="btn-outline" data-analytics="cta_ai_worker_process">
                구축 방식 확인하기
              </a>
            </div>

            {/* 생성형 검색이 그대로 인용하는 정의 문장 — 본문·스키마·llms.txt 가 같은 문장을 쓴다 */}
            <div className="faq-item" style={{ borderLeft: '3px solid var(--green)', marginTop: 24 }}>
              <p className="faq-a">{AI_WORKER_ENTITY_STATEMENT}</p>
            </div>
          </div>

          {/* ── 2. 문제 ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>사람이 화면을 오가며 처리하는 업무</h2>
            <p className="hub-intro">{PROBLEMS_LEAD}</p>
            <div className="faq-grid" style={{ marginTop: 12 }}>
              {PROBLEMS.map((p) => (
                <div className="faq-item" key={p.title}>
                  <p className="faq-q">{p.title}</p>
                  <p className="faq-a">{p.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── 3. 정의와 챗봇 차이 ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>{DEFINITION_HEADING}</h2>
            <p className="hub-intro">{DEFINITION_BODY}</p>

            <h3 className="section-title" style={{ ...H2_SMALL, marginTop: 24 }}>AI 챗봇과의 차이</h3>
            <div style={{ overflowX: 'auto', marginTop: 8 }}>
              <table style={{ width: '100%', minWidth: 560, borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                <thead>
                  <tr>
                    <th scope="col" style={TH}>항목</th>
                    <th scope="col" style={TH}>AI 챗봇</th>
                    <th scope="col" style={TH}>AI Worker</th>
                  </tr>
                </thead>
                <tbody>
                  {CHATBOT_COMPARE.map((c) => (
                    <tr key={c.item}>
                      <th scope="row" style={{ ...TD, textAlign: 'left', fontWeight: 600 }}>{c.item}</th>
                      <td style={TD}>{c.chatbot}</td>
                      <td style={TD}>{c.worker}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="hub-intro" style={{ marginTop: 12 }}>{CHATBOT_COMPARE_NOTE}</p>
          </div>

          {/* ── 4. 다섯 가지 Worker ── */}
          <div className="section-inner" style={SECTION} id="workers">
            <h2 className="section-title" style={H2}>다섯 가지 AI Worker</h2>
            <div className="faq-grid" style={{ marginTop: 12 }}>
              {WORKER_CARDS.map((w) => (
                <div className="faq-item" key={w.href}>
                  <p className="faq-q">
                    <Link href={w.href}>{w.name}</Link>
                    {w.external ? <span style={{ fontWeight: 400, opacity: 0.8 }}> · 이미 운영 중인 서비스</span> : null}
                  </p>
                  <p className="faq-a">{w.tagline}</p>
                  <ul className="hub-intro" style={LIST}>
                    {w.tasks.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <p className="hub-intro" style={{ marginTop: 8, fontSize: '0.92rem', opacity: 0.85 }}>
                    연결 시스템: {w.systems}
                  </p>
                </div>
              ))}
            </div>
            <p className="hub-intro" style={{ marginTop: 12 }}>{WORKER_CARDS_NOTE}</p>
          </div>

          {/* ── 5. Before / After ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>업무 흐름이 어떻게 바뀌나</h2>
            {BEFORE_AFTER.map((f) => (
              <div key={f.label} style={{ marginTop: 20 }}>
                <h3 className="section-title" style={H2_SMALL}>{f.label}</h3>
                <div style={{ overflowX: 'auto', marginTop: 8 }}>
                  <table style={{ width: '100%', minWidth: 520, borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                    <thead>
                      <tr>
                        <th scope="col" style={TH}>지금 (사람)</th>
                        <th scope="col" style={TH}>AI Worker 도입 후</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: Math.max(f.before.length, f.after.length) }).map((_, i) => (
                        <tr key={`${f.label}-${i}`}>
                          <td style={TD}>{f.before[i] ?? ''}</td>
                          <td style={TD}>{f.after[i] ?? ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="hub-intro" style={{ marginTop: 8 }}>
                  <strong>사람이 계속 맡는 것</strong> — {f.humanLeft}
                </p>
              </div>
            ))}
            <p className="hub-intro" style={{ marginTop: 12, fontSize: '0.92rem', opacity: 0.85 }}>
              {BEFORE_AFTER_NOTE}
            </p>
          </div>

          {/* ── 6. 구축 방식 6단계 ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>
              업무분석 → 도구연결 → 권한설계 → 실행 → 검증 → 예외만 사람
            </h2>
            <ol className="hub-intro" style={LIST}>
              {BUILD_STEPS.map((s) => (
                <li key={s.title}>
                  <strong>{s.title}</strong> — {s.detail}
                </li>
              ))}
            </ol>
          </div>

          {/* ── 7. API vs Computer Use ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>API가 있는 시스템과 없는 시스템</h2>
            <p className="hub-intro">{CONNECTION_LEAD}</p>
            <div className="faq-grid" style={{ marginTop: 12 }}>
              {CONNECTION_MODES.map((m) => (
                <div className="faq-item" key={m.title}>
                  <p className="faq-q">{m.title}</p>
                  <p className="faq-a"><strong>어떤 경우</strong> — {m.when}</p>
                  <p className="faq-a"><strong>연결 방식</strong> — {m.how}</p>
                  <p className="faq-a"><strong>주의</strong> — {m.caution}</p>
                </div>
              ))}
            </div>
            <p className="hub-intro" style={{ marginTop: 12 }}>{CONNECTION_NOTE}</p>
          </div>

          {/* ── 8. 권한 4단계 ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>권한은 네 단계로 나눕니다</h2>
            <div style={{ overflowX: 'auto', marginTop: 8 }}>
              <table style={{ width: '100%', minWidth: 560, borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                <thead>
                  <tr>
                    <th scope="col" style={TH}>단계</th>
                    <th scope="col" style={TH}>무엇을 허용하나</th>
                    <th scope="col" style={TH}>예</th>
                  </tr>
                </thead>
                <tbody>
                  {PERMISSION_LEVELS.map((p) => (
                    <tr key={p.level}>
                      <th scope="row" style={{ ...TD, textAlign: 'left', fontWeight: 600 }}>
                        {p.level} · {p.name}
                      </th>
                      <td style={TD}>{p.meaning}</td>
                      <td style={TD}>{p.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="hub-intro" style={{ marginTop: 12 }}>{PERMISSION_NOTE}</p>
          </div>

          {/* ── 9. 업종별 활용 구성 ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>업종별로 어떤 업무를 맡기나</h2>
            <div style={{ overflowX: 'auto', marginTop: 8 }}>
              <table style={{ width: '100%', minWidth: 560, borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                <thead>
                  <tr>
                    <th scope="col" style={TH}>업종</th>
                    <th scope="col" style={TH}>맡기는 업무</th>
                    <th scope="col" style={TH}>처리 흐름</th>
                  </tr>
                </thead>
                <tbody>
                  {INDUSTRY_CASES.map((c) => (
                    <tr key={c.industry}>
                      <th scope="row" style={{ ...TD, textAlign: 'left', fontWeight: 600 }}>{c.industry}</th>
                      <td style={TD}>{c.task}</td>
                      <td style={TD}>{c.flow}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="hub-intro" style={{ marginTop: 12, fontSize: '0.92rem', opacity: 0.85 }}>
              {INDUSTRY_CASES_NOTE}
            </p>
          </div>

          {/* ── 10. 구축 프로세스 ── */}
          <div className="section-inner" style={SECTION} id="process">
            <h2 className="section-title" style={H2}>구축 프로세스</h2>
            <ol className="hub-intro" style={LIST}>
              {PROCESS.map((p) => (
                <li key={p.title}>
                  <strong>{p.title}</strong> — {p.detail}
                </li>
              ))}
            </ol>
            <p className="hub-intro" style={{ marginTop: 12 }}>{PROCESS_NOTE}</p>
          </div>

          {/* ── 11. 비용 결정요소 ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>비용을 좌우하는 것</h2>
            <ul className="hub-intro" style={LIST}>
              {COST_FACTORS.map((c) => (
                <li key={c.factor}>
                  <strong>{c.factor}</strong> — {c.detail}
                </li>
              ))}
            </ul>
            <p className="hub-intro" style={{ marginTop: 12 }}>{COST_NOTE}</p>
          </div>

          {/* ── 12. FAQ ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>AI Worker 구축 자주 묻는 질문</h2>
            <div className="faq-grid">
              {FAQS.map((f) => (
                <div className="faq-item" key={f.q}>
                  <p className="faq-q">{f.q}</p>
                  <p className="faq-a">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── 판단에 필요한 가이드 (lib/content-cluster.ts 배선을 그대로 렌더) ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2_SMALL}>결정 전에 읽어 두면 좋은 글</h2>
            <div className="link-grid">
              {resolveCluster(guidesForService('/ai-worker/'), {
                guide: getGuide,
                compare: getCompare,
                blog: getBlogPostBySlug,
              }).map((g) => (
                <Link key={g.href} href={g.href}>{g.label}</Link>
              ))}
            </div>
          </div>

          {/* ── 14. Related Services ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2_SMALL}>함께 확인하면 좋은 서비스</h2>
            <ul className="hub-intro" style={LIST}>
              {RELATED_LINKS.map((r) => (
                <li key={r.href}>
                  <Link href={r.href}>{r.label}</Link> — {r.note}
                </li>
              ))}
            </ul>
          </div>

          {/* ── 13. 하단 CTA ── */}
          <div className="cta" style={{ marginTop: 24 }}>
            <h2 className="section-title" style={H2_SMALL}>AI Worker 구축 상담하기</h2>
            <p className="hub-intro">{CTA_LEAD}</p>
            <div className="cta-buttons">
              <a
                href={SITE.phoneHref}
                className="btn-primary"
                data-analytics="cta_ai_worker_call_bottom"
                data-service="ai_worker"
              >
                📞 {SITE.phone} 상담
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="btn-outline"
                data-analytics="cta_ai_worker_email"
                data-service="ai_worker"
              >
                ✉️ 업무 흐름 보내고 가능 범위 확인
              </a>
            </div>
          </div>
        </article>
      </main>
      <BusinessFooter topExtra={<Link href="/ai-development/">← AI 외주개발로</Link>} />
    </>
  );
}
