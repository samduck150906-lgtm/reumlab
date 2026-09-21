import type { Metadata } from 'next';
import Link from '@/components/SiteLink';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/seo';
import {
  WORKERS,
  getWorker,
  workerCanonical,
  workerTitle,
  workerDescription,
  workerDecision,
  AI_WORKER_CANONICAL,
  AI_WORKER_ENTITY_STATEMENT,
} from '@/lib/ai-worker';
import { robotsFor } from '@/lib/index-quality';
import { IndustryServiceJsonLd } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';
import { guidesForService, resolveCluster } from '@/lib/content-cluster';
import { getGuide } from '@/lib/guides';
import { getCompare } from '@/lib/compare';
import { getBlogPostBySlug } from '@/lib/blog-posts';

type Props = { params: { role: string } };

export function generateStaticParams() {
  return WORKERS.map((w) => ({ role: w.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const w = getWorker(params.role);
  if (!w) notFound();

  const title = workerTitle(w);
  const description = workerDescription(w);
  const canonical = workerCanonical(w.slug);

  return {
    metadataBase: new URL(SITE.domain),
    title: { absolute: title },
    description,
    keywords: [w.primary, ...w.secondary],
    alternates: { canonical },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      url: canonical,
      siteName: SITE.name,
      title,
      description,
      images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: `${w.name} — 름랩` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [SITE.defaultOgImage] },
    robots: robotsFor(workerDecision(w.slug)!),
  };
}

const H2 = { fontSize: '1.3rem' } as const;
const H2_SMALL = { fontSize: '1.15rem' } as const;
const SECTION = { paddingTop: 8 } as const;
const LIST = { marginTop: 8, paddingLeft: 18, lineHeight: 2 } as const;
const TH = { textAlign: 'left', padding: '10px 12px', borderBottom: '2px solid var(--green)' } as const;
const TD = { padding: '10px 12px', borderBottom: '1px solid rgba(128,128,128,0.2)' } as const;

export default function AiWorkerRolePage({ params }: Props) {
  const w = getWorker(params.role);
  if (!w) notFound();

  const canonical = workerCanonical(w.slug);
  const crumbs = [
    { name: '홈', url: `${SITE.domain}/` },
    { name: 'AI Worker 구축', url: AI_WORKER_CANONICAL },
    { name: w.name, url: canonical },
  ];
  const siblings = WORKERS.filter((o) => o.slug !== w.slug);
  const decisionGuides = resolveCluster(guidesForService(`/ai-worker/${w.slug}/`), {
    guide: getGuide,
    compare: getCompare,
    blog: getBlogPostBySlug,
  });

  return (
    <>
      <IndustryServiceJsonLd
        name={w.name}
        serviceType="AI 업무 자동화 시스템 개발"
        description={workerDescription(w)}
        url={canonical}
        faqs={w.faqs}
        crumbs={crumbs}
      />
      <main>
        <article className="dynamic-page">
          <nav className="breadcrumb" aria-label="breadcrumb">
            <Link href="/">홈</Link>
            {' / '}
            <Link href="/ai-worker/">AI Worker 구축</Link>
            {' / '}
            <span>{w.name}</span>
          </nav>

          <div className="section-inner">
            <p className="section-tag">AI Worker · {w.primary}</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)' }}>{w.name}</h1>
            <p className="hub-intro">{w.lead}</p>

            <div className="cta-buttons" style={{ marginTop: 24 }}>
              <a
                href={SITE.phoneHref}
                className="btn-primary"
                data-analytics={`cta_ai_worker_${w.slug}_call`}
                data-service="ai_worker"
              >
                📞 {SITE.phone} · {w.name} 상담하기
              </a>
              <a href="#scope" className="btn-outline" data-analytics={`cta_ai_worker_${w.slug}_scope`}>
                1차 구축 범위 보기
              </a>
            </div>
          </div>

          {/* ── 무엇을 끝까지 처리하나 ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>{w.name}가 처리하는 업무</h2>
            <ul className="hub-intro" style={LIST}>
              {w.duties.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>

          {/* ── 연결 시스템 ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>어떤 시스템에 연결하나</h2>
            <div style={{ overflowX: 'auto', marginTop: 8 }}>
              <table style={{ width: '100%', minWidth: 480, borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                <thead>
                  <tr>
                    <th scope="col" style={TH}>시스템</th>
                    <th scope="col" style={TH}>연결 방식</th>
                  </tr>
                </thead>
                <tbody>
                  {w.connections.map((c) => (
                    <tr key={c.system}>
                      <th scope="row" style={{ ...TD, textAlign: 'left', fontWeight: 600 }}>{c.system}</th>
                      <td style={TD}>{c.mode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="hub-intro" style={{ marginTop: 12, fontSize: '0.92rem', opacity: 0.85 }}>
              연동 창구(API)가 없는 시스템은 전용 계정으로 화면을 조작해 연결합니다. 화면이 바뀌면 손봐야 하므로
              조회부터 적용하고 쓰기 동작에는 확인 단계를 둡니다.
            </p>
          </div>

          {/* ── 권한 4단계 ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>이 역할의 권한 설계</h2>
            <div style={{ overflowX: 'auto', marginTop: 8 }}>
              <table style={{ width: '100%', minWidth: 480, borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                <thead>
                  <tr>
                    <th scope="col" style={TH}>단계</th>
                    <th scope="col" style={TH}>이 역할에서 해당하는 항목</th>
                  </tr>
                </thead>
                <tbody>
                  {w.permissions.map((p) => (
                    <tr key={p.level}>
                      <th scope="row" style={{ ...TD, textAlign: 'left', fontWeight: 600 }}>{p.level}</th>
                      <td style={TD}>{p.items.join(' · ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="hub-intro" style={{ marginTop: 12 }}>
              단계의 의미와 확대 순서는 <Link href="/ai-worker/">AI Worker 구축</Link> 에 정리해 두었습니다.
            </p>
          </div>

          {/* ── 사람에게 넘기는 조건 ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>언제 사람에게 넘기나</h2>
            <ul className="hub-intro" style={LIST}>
              {w.handoff.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <p className="hub-intro" style={{ marginTop: 12 }}>
              넘길 때는 처리를 멈추고 어떤 값 때문에 멈췄는지를 함께 올립니다. 담당자가 판단만 하면 되도록 만드는 것이
              목표이며, 처음부터 다시 확인하게 만들면 자동화한 의미가 없습니다.
            </p>
          </div>

          {/* ── 1차 구축 범위 ── */}
          <div className="section-inner" style={SECTION} id="scope">
            <h2 className="section-title" style={H2}>1차 구축 범위</h2>
            <ul className="hub-intro" style={LIST}>
              {w.scope.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="hub-intro" style={{ marginTop: 12 }}>
              한 번에 여러 업무를 맡기지 않습니다. 업무 하나를 끝까지 처리하게 만든 뒤 같은 구조 위에서 범위를 넓히는
              편이 기간과 비용 모두 유리합니다. 소스코드와 API 키는 대표님이 직접 보유하도록 이관합니다.
            </p>
          </div>

          {/* ── 비용·기간 요인 ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>비용과 기간을 좌우하는 것</h2>
            <ul className="hub-intro" style={LIST}>
              {w.drivers.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <p className="hub-intro" style={{ marginTop: 12 }}>
              금액과 기간은 업무 범위와 시스템 목록을 확인한 뒤 정합니다. 외부 AI 사용료는 개발비와 별도이며 처리량에
              따라 달라집니다. 운영 데이터가 없는 상태에서 처리 정확도나 인건비 절감률을 보장하지 않습니다.
            </p>
          </div>

          {/* ── 적합 / 부적합 ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>적합한 경우와 아닌 경우</h2>
            <div className="faq-grid" style={{ marginTop: 12 }}>
              <div className="faq-item">
                <p className="faq-q">적합합니다</p>
                <ul className="hub-intro" style={LIST}>
                  {w.fit.good.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </div>
              <div className="faq-item">
                <p className="faq-q">지금은 권하지 않습니다</p>
                <ul className="hub-intro" style={LIST}>
                  {w.fit.bad.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── FAQ ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2}>{w.name} 자주 묻는 질문</h2>
            <div className="faq-grid">
              {w.faqs.map((f) => (
                <div className="faq-item" key={f.q}>
                  <p className="faq-q">{f.q}</p>
                  <p className="faq-a">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── 다른 역할 ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2_SMALL}>결정 전에 읽어 두면 좋은 글</h2>
            <div className="link-grid">
              {decisionGuides.map((item) => (
                <Link key={item.href} href={item.href}>{item.label}</Link>
              ))}
            </div>
          </div>

          {/* ── 다른 역할 ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2_SMALL}>다른 역할의 AI Worker</h2>
            <ul className="hub-intro" style={LIST}>
              {siblings.map((s) => (
                <li key={s.slug}>
                  <Link href={`/ai-worker/${s.slug}/`}>{s.name}</Link> — {s.lead}
                </li>
              ))}
            </ul>
          </div>

          {/* ── 내부링크 ── */}
          <div className="section-inner" style={SECTION}>
            <h2 className="section-title" style={H2_SMALL}>함께 확인하면 좋은 것들</h2>
            <div className="link-grid">
              {w.related.map((r) => (
                <Link key={r.href} href={r.href}>{r.label}</Link>
              ))}
            </div>
          </div>

          {/* ── 하단 CTA ── */}
          <div className="cta" style={{ marginTop: 24 }}>
            <h2 className="section-title" style={H2_SMALL}>{w.name} 구축 상담하기</h2>
            <p className="hub-intro">
              {AI_WORKER_ENTITY_STATEMENT} 맡기고 싶은 업무가 어떤 화면을 오가는지만 알려 주시면, 지금 자동화할 수
              있는 범위부터 말씀드립니다.
            </p>
            <div className="cta-buttons">
              <a
                href={SITE.phoneHref}
                className="btn-primary"
                data-analytics={`cta_ai_worker_${w.slug}_call_bottom`}
                data-service="ai_worker"
              >
                📞 {SITE.phone} 상담
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="btn-outline"
                data-analytics={`cta_ai_worker_${w.slug}_email`}
                data-service="ai_worker"
              >
                ✉️ 업무 흐름 보내고 가능 범위 확인
              </a>
            </div>
          </div>
        </article>
      </main>
      <BusinessFooter topExtra={<Link href="/ai-worker/">← AI Worker 구축으로</Link>} />
    </>
  );
}
