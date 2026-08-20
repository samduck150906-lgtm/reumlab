import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/seo';
import {
  ENTERPRISE_AI_CANONICAL,
  ENTERPRISE_AI_TITLE,
  ENTERPRISE_AI_DESCRIPTION,
  ENTERPRISE_AI_H1,
  ENTERPRISE_AI_EYEBROW,
  ENTERPRISE_AI_LEAD,
  ENTERPRISE_AI_KEYWORDS,
  SUMMARY,
  PROBLEMS,
  DEFINITION,
  DEFINITION_BODY,
  COMPARISON,
  COMPARISON_NOTE,
  USE_CASES,
  USE_CASES_DISCLAIMER,
  RAG_DEFINITION,
  RAG_FLOW,
  RAG_LIMITS,
  SOURCE_DISPLAY,
  DATA_TYPES,
  DATA_TYPES_NOTE,
  INTEGRATIONS,
  INTEGRATIONS_NOTE,
  PERMISSIONS,
  PERMISSIONS_NOTE,
  SECURITY_CHECKS,
  MODEL_SELECTION,
  PROCESS,
  POC,
  COST_FACTORS,
  COST_NOTE,
  VS_AUTOMATION,
  FAQS,
  RELATED_LINKS,
  enterpriseAiDecision,
} from '@/lib/enterprise-ai';
import { robotsFor } from '@/lib/index-quality';
import { IndustryServiceJsonLd } from '@/components/JsonLd';
import { guidesForService, resolveCluster } from '@/lib/content-cluster';
import { getGuide } from '@/lib/guides';
import { getCompare } from '@/lib/compare';
import { getBlogPostBySlug } from '@/lib/blog-posts';
import BusinessFooter from '@/components/BusinessFooter';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: { absolute: ENTERPRISE_AI_TITLE },
  description: ENTERPRISE_AI_DESCRIPTION,
  keywords: ENTERPRISE_AI_KEYWORDS,
  // 독립적인 검색 의도(사내 문서 기반 검색·질의응답)를 가지므로 self-canonical 이다.
  // /ai-automation/ 으로 canonical 을 보내지 않는다 — 다른 질문에 답하는 페이지다.
  alternates: { canonical: ENTERPRISE_AI_CANONICAL },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: ENTERPRISE_AI_CANONICAL,
    siteName: SITE.name,
    title: ENTERPRISE_AI_TITLE,
    description: ENTERPRISE_AI_DESCRIPTION,
    // 전용 이미지가 없으므로 사이트 대표 OG 를 재사용한다(없는 경로를 만들지 않는다).
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: '사내 AI 구축 — 름랩' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: ENTERPRISE_AI_TITLE,
    description: ENTERPRISE_AI_DESCRIPTION,
    images: [SITE.defaultOgImage],
  },
  robots: robotsFor(enterpriseAiDecision()),
};

const H2 = { fontSize: '1.3rem' } as const;
const H2_SMALL = { fontSize: '1.15rem' } as const;
const SECTION = { paddingTop: 8 } as const;
const LIST = { marginTop: 8, paddingLeft: 18, lineHeight: 2 } as const;

export default function EnterpriseAiPage() {
  const crumbs = [
    { name: '홈', url: `${SITE.domain}/` },
    { name: 'AI 개발', url: `${SITE.domain}/ai-development/` },
    { name: '사내 AI 구축', url: ENTERPRISE_AI_CANONICAL },
  ];

  return (
    <>
      <IndustryServiceJsonLd
        /* Service.name 은 H1 에 실제로 들어 있는 문구를 쓴다 — 스키마와 화면이 어긋나면
           구조화 데이터 정책 위반이고, 검사기(seo:verify:services)도 이 일치를 본다. */
        name="사내 AI 구축"
        serviceType="기업용 AI 시스템 개발"
        description={ENTERPRISE_AI_DESCRIPTION}
        url={ENTERPRISE_AI_CANONICAL}
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
            <span>사내 AI 구축</span>
          </nav>

          {/* ── Hero — 기술 용어 대신 "무엇을 만드는가"부터 (§9·§10) ── */}
          <div className="section-inner">
            <p className="section-tag">{ENTERPRISE_AI_EYEBROW}</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)' }}>
              {ENTERPRISE_AI_H1}
            </h1>
            <p className="hub-intro">{ENTERPRISE_AI_LEAD}</p>

            <div className="cta-buttons" style={{ marginTop: 24 }}>
              <a
                href={SITE.phoneHref}
                className="btn-primary"
                data-analytics="cta_enterprise_ai_call"
                data-service="enterprise_ai"
              >
                📞 {SITE.phone} · 사내 AI 구축 상담하기
              </a>
              <a href="#process" className="btn-outline" data-analytics="cta_enterprise_ai_process">
                구축 방식 확인하기
              </a>
            </div>
          </div>

          {/* ── 핵심 요약 (§44) ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2_SMALL}>사내 AI 핵심 요약</h2>
            <ul className="hub-intro" style={LIST}>
              {SUMMARY.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          {/* ── 문제 (§11) ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>사내 정보, 아직도 사람이 직접 찾고 있나요?</h2>
            <div className="link-grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
              {PROBLEMS.map((p) => (
                <div key={p.no} className="faq-item">
                  <p className="faq-q" style={{ color: 'var(--green)' }}>{p.no}</p>
                  <p className="faq-a">{p.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── 정의 (§12·§43 answer-first) ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>사내 AI란?</h2>
            <p className="hub-intro"><strong>{DEFINITION}</strong></p>
            <p className="hub-intro" style={{ marginTop: 12 }}>{DEFINITION_BODY}</p>
          </div>

          {/* ── 일반 생성형 AI 와의 차이 (§13·§49 모바일 가로 스크롤) ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>일반 생성형 AI와 무엇이 다른가</h2>
            <div style={{ overflowX: 'auto', marginTop: 12 }}>
              <table style={{ width: '100%', minWidth: 560, borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                <thead>
                  <tr>
                    <th scope="col" style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '2px solid var(--green)' }}>항목</th>
                    <th scope="col" style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '2px solid var(--green)' }}>일반 생성형 AI</th>
                    <th scope="col" style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '2px solid var(--green)' }}>사내 AI (구축형)</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((c) => (
                    <tr key={c.item}>
                      <th scope="row" style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid rgba(128,128,128,0.2)', fontWeight: 600 }}>{c.item}</th>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(128,128,128,0.2)' }}>{c.general}</td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(128,128,128,0.2)' }}>{c.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="hub-intro" style={{ marginTop: 12, fontSize: '0.92rem', opacity: 0.85 }}>{COMPARISON_NOTE}</p>
          </div>

          {/* ── 활용 예시 (§14·§15) ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>기업에서는 이렇게 활용할 수 있습니다</h2>
            <div className="link-grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
              {USE_CASES.map((u) => (
                <div key={u.area} className="faq-item">
                  <p className="faq-q" style={{ color: 'var(--green)' }}>{u.area}</p>
                  <p className="faq-a" style={{ fontWeight: 600 }}>{u.ask}</p>
                  <p className="faq-a" style={{ marginTop: 4 }}>{u.flow.join(' → ')}</p>
                </div>
              ))}
            </div>
            <p className="hub-intro" style={{ marginTop: 12, fontSize: '0.92rem', opacity: 0.85 }}>
              {USE_CASES_DISCLAIMER} <Link href="/portfolio/">개발 사례 보기</Link>
            </p>
          </div>

          {/* ── RAG (§16·§17·§48 흐름 시각화는 HTML/CSS 로만) ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>RAG는 왜 사내 AI에 사용될까?</h2>
            <p className="hub-intro"><strong>{RAG_DEFINITION}</strong></p>
            <ol className="hub-intro" style={{ marginTop: 12, paddingLeft: 0, listStyle: 'none' }}>
              {RAG_FLOW.map((r) => (
                <li
                  key={r.step}
                  style={{ padding: '10px 0 10px 14px', borderLeft: '3px solid var(--green)', marginBottom: 8 }}
                >
                  <strong>{r.step}</strong> — {r.detail}
                </li>
              ))}
            </ol>
            <h3 className="section-title" style={{ ...H2_SMALL, marginTop: 20 }}>RAG로 해결되지 않는 것</h3>
            <ul className="hub-intro" style={LIST}>
              {RAG_LIMITS.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            <p className="hub-intro" style={{ marginTop: 12 }}>
              RAG 자체를 더 알고 싶으시면 <Link href="/guide/rag-explained/">RAG 동작 방식을 정리한 가이드</Link>를 참고하세요.
            </p>
          </div>

          {/* ── 근거 표시 (§18) ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>답변의 근거를 함께 보여 줍니다</h2>
            <p className="hub-intro">{SOURCE_DISPLAY}</p>
          </div>

          {/* ── 데이터 유형 (§19) ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>어떤 자료를 검색 대상으로 만들 수 있나</h2>
            <div className="link-grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
              {DATA_TYPES.map((d) => (
                <div key={d.type} className="faq-item">
                  <p className="faq-q" style={{ color: 'var(--green)' }}>{d.type}</p>
                  <p className="faq-a">{d.note}</p>
                </div>
              ))}
            </div>
            <p className="hub-intro" style={{ marginTop: 12, fontSize: '0.92rem', opacity: 0.85 }}>{DATA_TYPES_NOTE}</p>
          </div>

          {/* ── 기존 시스템 연동 (§20) ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>기존 업무 시스템과도 연결할 수 있습니다</h2>
            <ul className="hub-intro" style={LIST}>
              {INTEGRATIONS.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            <p className="hub-intro" style={{ marginTop: 12 }}>{INTEGRATIONS_NOTE}</p>
            <p className="hub-intro" style={{ marginTop: 12 }}>
              사내 데이터가 아직 시스템으로 정리돼 있지 않다면{' '}
              <Link href="/erp/">업무 시스템·ERP 구축</Link>부터 검토하는 편이 순서상 맞습니다.
            </p>
          </div>

          {/* ── 권한 (§21) ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>부서·역할에 따라 볼 수 있는 자료를 나눕니다</h2>
            <div className="link-grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
              {PERMISSIONS.map((p) => (
                <div key={p.who} className="faq-item">
                  <p className="faq-q" style={{ color: 'var(--green)' }}>{p.who}</p>
                  <p className="faq-a">{p.scope}</p>
                </div>
              ))}
            </div>
            <p className="hub-intro" style={{ marginTop: 12, fontSize: '0.92rem', opacity: 0.85 }}>{PERMISSIONS_NOTE}</p>
          </div>

          {/* ── 보안 (§22·§23 — 약속이 아니라 정해야 할 항목) ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>기업 AI에서 먼저 확인해야 하는 데이터 보안</h2>
            <p className="hub-intro">
              보안은 기능으로 해결되는 것이 아니라 &ldquo;무엇을 어디까지 열어 둘 것인가&rdquo;를 정하는 일입니다.
              구축 전에 아래 항목을 함께 결정합니다.
            </p>
            <div className="link-grid" style={{ gridTemplateColumns: '1fr', gap: 12, marginTop: 12 }}>
              {SECURITY_CHECKS.map((s) => (
                <div key={s.q} className="faq-item">
                  <p className="faq-q">{s.q}</p>
                  <p className="faq-a">{s.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── 모델 선택 (§24) ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>어떤 AI 모델을 쓰나</h2>
            <p className="hub-intro">{MODEL_SELECTION}</p>
            <p className="hub-intro" style={{ marginTop: 12 }}>
              완성 후에는 <Link href="/source-handover/">소스코드와 계정 권한을 통째로 이관</Link>합니다. 모델을 바꾸거나
              다른 팀에 맡기실 때 저희를 거치지 않아도 됩니다.
            </p>
          </div>

          {/* ── 프로세스 (§25) ── */}
          <div className="section-inner" style={SECTION} id="process">
            <h2 className="section-title" style={H2}>사내 AI는 이렇게 구축합니다</h2>
            <div className="link-grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
              {PROCESS.map((p) => (
                <div key={p.no} className="faq-item">
                  <p className="faq-q" style={{ color: 'var(--green)' }}>{p.no} · {p.title}</p>
                  <p className="faq-a">{p.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── PoC (§26) ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>작게 검증하고 확장할 수 있습니다</h2>
            <p className="hub-intro">{POC}</p>
            <p className="hub-intro" style={{ marginTop: 12 }}>
              검증 뒤 실제 서비스로 키우는 단계는 <Link href="/mvp/">MVP 개발</Link>과 같은 방식으로 진행합니다.
            </p>
          </div>

          {/* 중간 CTA — 하단 CTA 와 문구가 겹치지 않게 한다 */}
          <div className="section-inner" style={SECTION}>
            <div className="faq-item" style={{ borderLeft: '3px solid var(--green)' }}>
              <p className="faq-q">우리 자료로 쓸 만한 답이 나올지부터 확인하고 싶다면</p>
              <p className="faq-a" style={{ marginBottom: 12 }}>
                자주 나오는 질문 몇 개와 문서 형태만 알려 주시면, 지금 자료 상태로 어디까지 가능한지 먼저 말씀드립니다.
              </p>
              <div className="cta-buttons">
                <a
                  href={SITE.phoneHref}
                  className="btn-primary"
                  data-analytics="cta_enterprise_ai_mid"
                  data-service="enterprise_ai"
                >
                  자료 기준 가능 범위 확인
                </a>
              </div>
            </div>
          </div>

          {/* ── 비용 결정 요소 (§27) ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>사내 AI 구축 비용은 무엇에 따라 달라질까?</h2>
            <ul className="hub-intro" style={LIST}>
              {COST_FACTORS.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="hub-intro" style={{ marginTop: 12 }}>{COST_NOTE}</p>
            <p className="hub-intro" style={{ marginTop: 12 }}>
              각 요소가 금액을 어떻게 움직이는지는{' '}
              <Link href="/guide/enterprise-ai-cost/">사내 AI 구축 비용 가이드</Link>에 따로 정리했습니다.
            </p>
          </div>

          {/* ── AI 자동화와의 차이 (§30) ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>사내 AI와 AI 업무 자동화는 어떻게 다른가</h2>
            <p className="hub-intro">{VS_AUTOMATION.lead}</p>
            <div className="link-grid" style={{ gridTemplateColumns: '1fr', gap: 12, marginTop: 12 }}>
              {VS_AUTOMATION.rows.map((r) => (
                <div key={r.name} className="faq-item">
                  <p className="faq-q" style={{ color: 'var(--green)' }}>
                    {r.href === '/ai-automation/' ? <Link href={r.href}>{r.name}</Link> : r.name}
                  </p>
                  <p className="faq-a">{r.what}</p>
                  <p className="faq-a" style={{ marginTop: 4, opacity: 0.85 }}>예: {r.example}</p>
                </div>
              ))}
            </div>
            <p className="hub-intro" style={{ marginTop: 12 }}>{VS_AUTOMATION.combined}</p>
          </div>

          {/* ── FAQ (§33·§34 — 화면에 보이는 것만 스키마로) ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>사내 AI 구축 자주 묻는 질문</h2>
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
              {resolveCluster(guidesForService('/enterprise-ai/'), {
                guide: getGuide,
                compare: getCompare,
                blog: getBlogPostBySlug,
              }).map((g) => (
                <Link key={g.href} href={g.href}>{g.label}</Link>
              ))}
            </div>
          </div>

          {/* ── 내부링크 (§37) ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2_SMALL}>함께 확인하면 좋은 것들</h2>
            <div className="link-grid">
              {RELATED_LINKS.map((r) => (
                <Link key={r.href} href={r.href}>{r.label}</Link>
              ))}
            </div>
          </div>

          {/* ── 하단 CTA (§51) ── */}
          <div className="cta" style={{ marginTop: 24 }}>
            <h2 className="section-title" style={H2_SMALL}>사내 AI 구축 상담하기</h2>
            <p className="hub-intro">
              지금 자료가 어디에 어떤 형태로 있는지, 직원들이 가장 자주 묻는 질문이 무엇인지만 알려 주세요.
              만들 수 있는지, 지금 만드는 게 맞는지부터 말씀드립니다.
            </p>
            <div className="cta-buttons">
              <a
                href={SITE.phoneHref}
                className="btn-primary"
                data-analytics="cta_enterprise_ai_call_bottom"
                data-service="enterprise_ai"
              >
                📞 {SITE.phone} 상담
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="btn-outline"
                data-analytics="cta_enterprise_ai_email"
                data-service="enterprise_ai"
              >
                ✉️ 자료 형태 보내고 검토 요청
              </a>
            </div>
          </div>
        </article>
      </main>
      <BusinessFooter topExtra={<Link href="/ai-automation/">← AI 업무 자동화로</Link>} />
    </>
  );
}
