import type { Metadata } from 'next';
import Link from 'next/link';
import './portfolio.css';
import { SITE } from '@/lib/seo';
import {
  PROJECTS,
  CATEGORIES,
  CATEGORY_KEYS,
  projectCategories,
  projectsByCategory,
  PORTFOLIO_HUB,
} from '@/lib/portfolio';
import { BreadcrumbJsonLdTrail, HOME_CRUMB } from '@/components/JsonLd';

/*
  개발 사례 허브.

  홈의 포트폴리오 섹션은 카드 15장을 보여주지만, 각 사례의 실제 내용
  (구조·사용자 흐름·운영자 기능·기술·산출물)은 클릭해야 열리는 JS 모달 안에만 있었다.
  즉 검색엔진과 AI 검색은 사례가 있다는 사실만 알 뿐 무엇을 만들었는지는 볼 수 없었다.
  이 허브와 /portfolio/<id>/ 상세가 같은 데이터를 HTML 로 내보낸다.

  ⚠️ 고객사명·서비스 URL·성과 수치는 원본 데이터에 없다. 만들어 넣지 말 것.
*/

const TITLE = `개발 사례 ${PROJECTS.length}건 — 앱·웹·ERP·AI 실제 구축 내역 | ${SITE.name} ${SITE.nameEn}`;
const DESCRIPTION =
  `름랩이 실제로 구축한 앱·웹·ERP·SaaS·AI 자동화·데이터 시스템 ${PROJECTS.length}건의 개발 사례입니다. ` +
  '각 사례마다 해결한 문제, 서비스 구조, 구현 기능, 사용 기술, 납품 산출물을 공개합니다.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PORTFOLIO_HUB },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: SITE.name,
    title: TITLE,
    description: DESCRIPTION,
    url: PORTFOLIO_HUB,
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: '름랩 개발 사례' }],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1 } },
};

export default function PortfolioHub() {
  return (
    <main className="pfh">
      <BreadcrumbJsonLdTrail items={[HOME_CRUMB, { name: '개발 사례', url: PORTFOLIO_HUB }]} />

      <nav className="pfh-crumb" aria-label="breadcrumb">
        <Link href="/">홈</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">개발 사례</span>
      </nav>

      <header className="pfh-head">
        <p className="pfh-eyebrow">PORTFOLIO</p>
        <h1>서비스 이름보다, 해결한 문제를 보여드립니다</h1>
        <p className="pfh-lead">
          름랩이 실제로 구축한 {PROJECTS.length}건입니다. 각 사례에서 고객이 겪던 문제, 서비스 구조,
          구현한 기능, 사용한 기술, 납품한 산출물을 확인할 수 있습니다.
        </p>
        {/* 홈 포트폴리오 섹션에 이미 고지된 내용과 같은 문구 — 두 화면의 설명이 어긋나면 안 된다. */}
        <p className="pfh-notice">
          실제 프로젝트명·고객사·서비스 URL·화면 속 개인정보는 고객사 요청에 따라 비공개
          처리했습니다. 대신 어떤 문제를 어떻게 설계하고 구현했는지는 그대로 공개합니다.
        </p>
      </header>

      {/* 분류별 묶음 — 어떤 종류의 시스템을 만드는 곳인지 목록만 봐도 알 수 있게 한다 */}
      <section className="pfh-types" aria-label="사례 분류">
        <h2>어떤 시스템을 개발했나</h2>
        <ul className="pfh-typelist">
          {CATEGORY_KEYS.map((key) => {
            const n = projectsByCategory(key).length;
            return (
              <li key={key}>
                <b>{CATEGORIES[key].full}</b>
                <span>{n}건</span>
              </li>
            );
          })}
        </ul>
      </section>

      <ol className="pfh-grid">
        {PROJECTS.map((p) => (
          <li key={p.id} className="pfh-card">
            <p className="pfh-chip">{p.chip}</p>
            <h2 className="pfh-card__title">
              <Link href={`/portfolio/${p.id}/`}>{p.title}</Link>
            </h2>
            <p className="pfh-card__problem">{p.problem}</p>
            {/* §13 — 카드만 봐도 "무엇을 개발했는지"와 "핵심 범위"가 읽혀야 한다 */}
            <ul className="pfh-card__feats">
              {p.features.slice(0, 3).map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <dl className="pfh-card__meta">
              <dt>담당 범위</dt>
              <dd>{p.scope}</dd>
              <dt>기술</dt>
              <dd>{p.detail.tech.slice(0, 4).join(' · ')}</dd>
              <dt>분류</dt>
              <dd>{projectCategories(p).map((c) => CATEGORIES[c].label).join(' · ')}</dd>
            </dl>
            <Link className="pfh-card__more" href={`/portfolio/${p.id}/`}>
              사례 자세히 보기 →
            </Link>
          </li>
        ))}
      </ol>

      <section className="pfh-cta">
        <h2>비슷한 문제를 풀고 싶으신가요?</h2>
        <p>
          어떤 서비스를 만들지 아직 정리되지 않았어도 괜찮습니다. 지금 겪고 있는 문제를 알려 주시면
          어떤 구조로 풀 수 있을지부터 함께 정리합니다.
        </p>
        <p className="pfh-cta__links">
          <a href={SITE.phoneHref} data-analytics="portfolio-hub-cta">{SITE.phone}</a>
          <a href={`mailto:${SITE.email}`} data-analytics="portfolio-hub-cta">{SITE.email}</a>
          <a href={SITE.kakaoChannel} target="_blank" rel="noopener noreferrer" data-analytics="portfolio-hub-cta">
            카카오톡 상담
          </a>
        </p>
      </section>

      <nav className="pfh-services" aria-label="관련 개발 서비스">
        <h2>관련 개발 서비스</h2>
        <ul>
          <li><Link href="/flutter/">Flutter 앱개발 외주</Link></li>
          <li><Link href="/website/">홈페이지·랜딩페이지 제작</Link></li>
          <li><Link href="/mvp/">앱·SaaS MVP 개발</Link></li>
          <li><Link href="/erp/">ERP·운영관리 시스템 개발</Link></li>
          <li><Link href="/admin-page-development/">관리자 페이지 개발</Link></li>
          <li><Link href="/ai-automation/">AI 업무 자동화 개발</Link></li>
          <li><Link href="/data-seo/">데이터·SEO 시스템 구축</Link></li>
        </ul>
      </nav>
    </main>
  );
}
