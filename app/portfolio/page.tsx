import type { Metadata } from 'next';
import Link from 'next/link';
import { PORTFOLIO, hasPortfolio, portfolioCanonical } from '@/lib/portfolio';
import { SITE } from '@/lib/seo';
import { BreadcrumbJsonLdTrail, PortfolioCollectionJsonLd } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

const canonical = `${SITE.domain}/portfolio/`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  // 브랜드명이 이미 title 에 포함됨 → 레이아웃 템플릿의 "| 름랩" 중복 방지
  title: { absolute: '포트폴리오 · 진행 사례 | 앱·웹·AI 개발 — 름랩 REUMLAB' },
  description:
    '름랩이 실제로 진행한 앱·웹·AI 개발 사례. 학원 검색·결제 앱, 무인 렌탈스튜디오 랜딩, AI 프롬프트 엔진 앱, 마케터 매칭 플랫폼까지 — 문제 → 해결 → 결과 → 산출물(소스코드·저장소·권한 이관)을 투명하게 정리합니다.',
  keywords: [
    '앱 개발 사례',
    '웹 개발 포트폴리오',
    'MVP 개발 사례',
    'Flutter 앱개발 사례',
    'AI 앱 개발 사례',
    '매칭 플랫폼 개발',
    '학원 앱 개발',
    '소스코드 이관',
  ],
  alternates: { canonical },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: canonical,
    siteName: SITE.nameEn,
    title: '름랩 포트폴리오 · 진행 사례',
    description: '앱·웹·AI 개발 사례 — 문제→해결→결과→산출물.',
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: '름랩 포트폴리오' }],
  },
  // 실제 사례가 등록되기 전에는 색인하지 않는다 (빈 페이지 색인 방지)
  robots: hasPortfolio
    ? { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } }
    : { index: false, follow: true },
};

const CATEGORY_LABEL: Record<string, string> = { app: '앱', web: '웹', ai: 'AI' };

export default function PortfolioIndexPage() {
  return (
    <>
      <BreadcrumbJsonLdTrail
        items={[
          { name: '홈', url: `${SITE.domain}/` },
          { name: '포트폴리오', url: canonical },
        ]}
      />
      {hasPortfolio ? (
        <PortfolioCollectionJsonLd
          url={canonical}
          items={PORTFOLIO.map((p) => ({
            name: p.title,
            url: portfolioCanonical(p.slug),
            description: p.summary,
          }))}
        />
      ) : null}
      <main>
        <section className="hero" style={{ minHeight: 'auto', padding: '120px 0 40px' }}>
          <div className="container">
            <p className="section-tag">Portfolio</p>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>
              진행 사례
            </h1>
            <p className="hero-desc" style={{ maxWidth: 720 }}>
              실제로 진행한 앱·웹·AI 개발 사례를 문제 → 해결 → 결과 → 산출물 순으로 정리합니다.
              소스코드·저장소·배포 권한을 통째로 넘기는 방식 그대로의 결과물입니다.
            </p>
          </div>
        </section>

        <section className="sec sec-cream">
          <div className="container">
            {hasPortfolio ? (
              <ul className="link-grid" style={{ marginTop: 8 }}>
                {PORTFOLIO.map((p) => (
                  <li key={p.slug} style={{ listStyle: 'none' }}>
                    <Link href={portfolioCanonical(p.slug).replace(SITE.domain, '')} style={{ display: 'block', minHeight: '100%' }}>
                      <article className="svc" style={{ height: '100%', margin: 0, display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 11, color: 'var(--green)', marginBottom: 8 }}>
                          {CATEGORY_LABEL[p.category] ?? p.category}
                          {p.durationDays ? ` · 약 ${p.durationDays}일` : ''}
                        </span>
                        <h2 className="svc-title" style={{ fontSize: '1.05rem' }}>{p.title}</h2>
                        <p className="svc-desc" style={{ flex: 1 }}>{p.summary}</p>
                        <span className="mono" style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                          {p.stack.join(' · ')}
                        </span>
                      </article>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0 8px', maxWidth: 640, margin: '0 auto' }}>
                <p className="hub-intro">
                  공개 동의를 받은 사례를 정리해 곧 올립니다. 지금 진행 중인 프로젝트나
                  참고 사례가 궁금하시면 상담에서 비공개로 보여 드립니다.
                </p>
              </div>
            )}

            {hasPortfolio ? (
              <div style={{ marginTop: 44, maxWidth: 760, marginLeft: 'auto', marginRight: 'auto' }}>
                <h2 className="section-title" style={{ fontSize: '1.2rem' }}>이 사례들로 확인할 수 있는 것</h2>
                <p className="hub-intro">
                  개발 외주에서 가장 중요한 질문은 “이 팀이 실제로 만들 수 있는가”입니다. 각 사례는
                  화면·기능처럼 확인 가능한 사실만 적고, 매출·전환율 같은 미확인 수치는 넣지 않았습니다.
                  사례마다 <strong>문제 → 해결 → 결과 → 사용 기술 → 개발 범위 → 산출물 → 예상 견적</strong>과
                  자주 묻는 질문까지 정리해, 비슷한 프로젝트를 준비할 때 그대로 참고하실 수 있습니다.
                </p>
                <ul className="hub-intro" style={{ paddingLeft: '1.1em', listStyle: 'disc', marginTop: 12 }}>
                  <li style={{ marginTop: 6 }}><strong>기술 폭</strong> — Flutter 앱, 반응형 웹, AI(LLM) 연동, 양면 매칭 플랫폼까지 실제 구현 범위</li>
                  <li style={{ marginTop: 6 }}><strong>소유권 이관</strong> — 모든 사례에서 소스코드·저장소·배포 권한을 대표 명의로 통째 이관</li>
                  <li style={{ marginTop: 6 }}><strong>정액 견적 기준</strong> — 비슷한 규모를 새로 만들 때의 예상 패키지·금액을 사례마다 공개</li>
                </ul>
              </div>
            ) : null}

            {hasPortfolio ? (
              <div style={{ marginTop: 40 }}>
                <h2 className="section-title" style={{ fontSize: '1.15rem', textAlign: 'center' }}>
                  서비스별로 더 보기
                </h2>
                <div className="link-grid" style={{ marginTop: 12 }}>
                  <Link href="/mvp/">앱 MVP 개발</Link>
                  <Link href="/flutter/">Flutter 앱개발</Link>
                  <Link href="/web-development/">웹사이트·랜딩 제작</Link>
                  <Link href="/ai-development/">AI 외주개발</Link>
                  <Link href="/soho/">소상공인 홈페이지 49만원</Link>
                  <Link href="/source-handover/">소스코드 이관</Link>
                </div>
              </div>
            ) : null}

            <p style={{ marginTop: 32, textAlign: 'center' }}>
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_portfolio_call">
                📞 {SITE.phone} 전화 상담
              </a>
            </p>
          </div>
        </section>
      </main>
      <BusinessFooter />
    </>
  );
}
