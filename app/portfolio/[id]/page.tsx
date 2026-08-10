import type { Metadata } from 'next';
import Link from 'next/link';
import '../portfolio.css';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/seo';
import {
  PROJECTS,
  CATEGORIES,
  getProject,
  projectCategories,
  relatedServices,
  relatedProjects,
  portfolioCanonical,
  portfolioTitle,
  portfolioDescription,
  PORTFOLIO_HUB,
} from '@/lib/portfolio';
import { BreadcrumbJsonLdTrail, HOME_CRUMB } from '@/components/JsonLd';

/*
  개발 사례 상세.

  섹션 구성은 홈 모달(script.js buildModal)과 같은 항목·같은 순서를 쓴다.
  화면에 보이는 내용과 크롤러가 읽는 내용이 달라지면 안 되고, 두 곳의 설명이 어긋나도 안 된다.

  구조화 데이터는 BreadcrumbList 만 낸다.
   · Article/CreativeWork — datePublished·dateModified 로 쓸 실제 날짜가 원본 데이터에 없다.
     날짜를 지어내면서까지 스키마를 늘릴 이유가 없다.
   · Review·AggregateRating — 검증 가능한 리뷰 시스템이 없으므로 절대 넣지 않는다.
   · Organization/ProfessionalService — 루트 layout 의 SiteEntityJsonLd 가 이미 내고 있다.
*/

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const p = getProject(params.id);
  if (!p) return { title: { absolute: `${SITE.name} ${SITE.nameEn}` } };
  const url = portfolioCanonical(p.id);
  const title = portfolioTitle(p);
  const description = portfolioDescription(p);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      siteName: SITE.name,
      title,
      description,
      url,
      images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: `${p.title} 개발 사례` }],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1 } },
  };
}

export default function PortfolioDetail({ params }: { params: { id: string } }) {
  const p = getProject(params.id);
  if (!p) notFound();

  const url = portfolioCanonical(p.id);
  const cats = projectCategories(p);
  const services = relatedServices(p);
  const related = relatedProjects(p);

  return (
    <main className="pfd">
      <BreadcrumbJsonLdTrail
        items={[HOME_CRUMB, { name: '개발 사례', url: PORTFOLIO_HUB }, { name: p.title, url }]}
      />

      <nav className="pfd-crumb" aria-label="breadcrumb">
        <Link href="/">홈</Link>
        <span aria-hidden="true">›</span>
        <Link href="/portfolio/">개발 사례</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{p.title}</span>
      </nav>

      <header className="pfd-head">
        <p className="pfd-chip">{p.chip}</p>
        <h1>{p.title} 개발 사례</h1>
        <p className="pfd-lead">{p.detail.overview}</p>
      </header>

      {/*
        §40 요약 블록 — AI 검색과 훑어보는 사람이 "무엇을 만들었나"를 문단을 읽지 않고 뽑을 수 있게.
        값이 없는 항목은 넣지 않는다(원본에 기간·고객사·성과가 없으므로 그 줄 자체가 없다).
      */}
      <section className="pfd-facts" aria-label="사례 요약">
        <dl>
          <div>
            <dt>프로젝트 유형</dt>
            <dd>{cats.map((c) => CATEGORIES[c].full).join(' · ')}</dd>
          </div>
          <div>
            <dt>담당 범위</dt>
            <dd>{p.scope}</dd>
          </div>
          <div>
            <dt>결과물</dt>
            <dd>{p.detail.structure.join(' · ')}</dd>
          </div>
          <div>
            <dt>사용 기술</dt>
            <dd>{p.detail.tech.join(' · ')}</dd>
          </div>
        </dl>
      </section>

      <section className="pfd-sec">
        <h2>해결해야 했던 문제</h2>
        <p>{p.detail.problemDetail}</p>
      </section>

      <section className="pfd-sec">
        <h2>서비스 구조</h2>
        {/* 구조는 순서가 있는 흐름이라 목록이 아니라 연결로 보여준다 */}
        <ol className="pfd-chain">
          {p.detail.structure.map((node) => (
            <li key={node}>{node}</li>
          ))}
        </ol>
      </section>

      <section className="pfd-sec">
        <h2>구현한 핵심 기능</h2>
        <ul className="pfd-list">
          {p.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="pfd-sec">
        <h2>주요 사용자 흐름</h2>
        <ol className="pfd-steps">
          {p.detail.userFlow.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="pfd-sec">
        <h2>운영자 기능</h2>
        <ul className="pfd-list">
          {p.detail.operator.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </section>

      <section className="pfd-sec">
        <h2>기술 구성</h2>
        <ul className="pfd-tech">
          {p.detail.tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section className="pfd-sec">
        <h2>납품 산출물</h2>
        <ul className="pfd-list">
          {p.detail.deliverables.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </section>

      <p className="pfd-notice">
        고객사 요청에 따라 실제 프로젝트명·고객사·서비스 URL은 비공개 처리했습니다. 위 내용은 름랩이
        직접 설계하고 구현한 범위입니다.
      </p>

      {/* §15 사례 → 서비스 역링크 */}
      <section className="pfd-services">
        <h2>관련 개발 서비스</h2>
        <p>
          비슷한 서비스를 만들 계획이라면 아래에서 진행 방식과 포함 범위를 확인할 수 있습니다.
        </p>
        <ul>
          {services.map((s) => (
            <li key={s.href}>
              <Link href={s.href}>{s.label}</Link>
            </li>
          ))}
        </ul>
      </section>

      {/* §41 관련 사례 — 분류가 겹치는 것만. 없으면 섹션 자체를 그리지 않는다 */}
      {related.length > 0 && (
        <section className="pfd-related">
          <h2>비슷한 유형의 개발 사례</h2>
          <ul>
            {related.map((r) => (
              <li key={r.id}>
                <Link href={`/portfolio/${r.id}/`}>{r.title}</Link>
                <span>{r.scope}</span>
              </li>
            ))}
          </ul>
          <p>
            <Link href="/portfolio/">개발 사례 전체 보기 →</Link>
          </p>
        </section>
      )}

      <section className="pfd-cta">
        <h2>이런 서비스가 필요하신가요?</h2>
        <p>
          지금 겪고 있는 문제를 알려 주시면 어떤 구조로 풀 수 있을지, 어떤 범위까지 필요한지부터
          정리해 드립니다.
        </p>
        {/*
          data-analytics 가 cta_location 이 된다(components/AnalyticsDataLayer 가 전역에서 읽는다).
          속성이 없으면 nav·푸터 클릭과 구분되지 않고 전부 'page' 로 뭉뚱그려진다.
        */}
        <p className="pfd-cta__links">
          <a href={SITE.phoneHref} data-analytics="portfolio-detail-cta">{SITE.phone}</a>
          <a href={`mailto:${SITE.email}`} data-analytics="portfolio-detail-cta">{SITE.email}</a>
          <a href={SITE.kakaoChannel} target="_blank" rel="noopener noreferrer" data-analytics="portfolio-detail-cta">
            카카오톡 상담
          </a>
        </p>
      </section>
    </main>
  );
}
