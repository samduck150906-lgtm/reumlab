import type { Metadata } from 'next';
import Link from '@/components/SiteLink';
import LandingInquiryForm from '@/components/LandingInquiryForm';
import BusinessFooter from '@/components/BusinessFooter';
import { ServiceWebPageJsonLd } from '@/components/JsonLd';
import { getProject, portfolioCanonical } from '@/lib/portfolio';
import { SITE } from '@/lib/seo';
import '../reum-sales.css';
import styles from './geo-website.module.css';

const CANONICAL = `${SITE.domain}/geo-website/`;
const TITLE = 'GEO 홈페이지 제작 | AI 검색을 고려한 웹사이트 개발 · 름랩';
const DESCRIPTION =
  '고객 질문과 브랜드 정보, 사례·FAQ, 검색 접근성, 문의 동선을 함께 설계하는 름랩의 GEO 홈페이지 제작 서비스. 신규 제작과 기존 홈페이지 개선 범위를 상담하세요.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ['GEO 홈페이지 제작', 'GEO 웹사이트 개발', 'AI 검색을 고려한 홈페이지', '생성형 AI 검색 최적화'],
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: CANONICAL,
    siteName: SITE.name,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: 'AI 검색까지 고려한 GEO 홈페이지 제작 — 름랩' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [SITE.defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

const fitItems = [
  '홈페이지가 없어 처음부터 검색을 고려해 만들고 싶은 기업',
  '디자인은 있지만 서비스·비용·진행 방식 설명이 부족한 업체',
  '고객이 자주 묻는 질문을 홈페이지에서 해결하고 싶은 사업자',
  '사례와 전문성을 체계적으로 공개하고 싶은 B2B 기업',
  '광고 유입뿐 아니라 검색을 통한 문의 기반을 만들고 싶은 브랜드',
  '기존 홈페이지를 유지하면서 정보 구조와 문의 동선을 개선하려는 업체',
] as const;

const comparisonRows = [
  ['서비스 설명', '회사와 서비스 소개를 중심으로 구성', '대상 고객·선택 기준·제공 범위·결과물을 질문 흐름에 맞춰 구체화'],
  ['고객의 질문', '대표적인 문의 내용을 별도 안내', '비교·검토·문의 단계의 질문을 찾아 서비스·비용·FAQ와 연결'],
  ['신뢰 근거', '회사 연혁과 대표 실적을 소개', '공개 가능한 사례·과정·산출물을 실제 설명 가까이에 배치'],
  ['검색 접근성', '기본 메타데이터와 반응형을 적용', '본문 렌더링·canonical·내부 링크·사이트맵·적절한 구조화 데이터를 함께 점검'],
  ['문의 동선', '전화·이메일·문의 폼을 제공', '고객이 근거를 확인한 뒤 필요한 범위를 남기도록 CTA와 폼 맥락을 연결'],
  ['성과 확인과 업데이트', '방문·문의 수를 필요에 따라 확인', '검색 유입·CTA·폼 시작·접수 성공을 구분하고 보완할 콘텐츠 구조를 설계'],
] as const;

const scopes = [
  {
    no: '01',
    title: '브랜드·서비스 정보 정리',
    body: '회사명, 제공 서비스, 대상 고객, 서비스 지역, 진행 방식, 차별점과 확인 가능한 근거를 일관된 정보 구조로 정리합니다.',
    outputs: '브랜드·서비스 정보표 · 핵심 메시지 구조',
  },
  {
    no: '02',
    title: '고객 질문과 콘텐츠 설계',
    body: '비교·검토·문의 단계의 질문을 정리하고 서비스 설명, 비용 결정 요소, 사례와 FAQ의 배치를 설계합니다.',
    outputs: '핵심 질문 목록 · 페이지 구성안 · 콘텐츠 목차',
  },
  {
    no: '03',
    title: '반응형 홈페이지 개발',
    body: '모바일과 PC 화면, 서비스 소개, 문의 흐름을 실제 웹사이트로 구현하고 운영 환경에 배포합니다.',
    outputs: '반응형 페이지 · 작동하는 문의 폼 · 배포 환경',
  },
  {
    no: '04',
    title: '검색 접근성과 기술 SEO',
    body: '초기 HTML, 페이지별 메타데이터, canonical, 내부 링크, 사이트맵과 내용에 맞는 구조화 데이터를 구현·점검합니다.',
    outputs: '적용 내역 · 기술 점검표',
  },
  {
    no: '05',
    title: '운영 가능한 근거·콘텐츠 구조',
    body: '실제 사례, 작업 과정, 자주 묻는 질문을 지속해서 보완할 수 있게 구성합니다. 관리자·CMS 개발은 필요한 경우 별도 범위로 확정합니다.',
    outputs: '사례·FAQ 템플릿 · 콘텐츠 운영 가이드',
  },
  {
    no: '06',
    title: '문의와 성과 측정 기반',
    body: '검색 유입, 페이지 이용, CTA 클릭과 실제 문의 접수를 구분해 측정하도록 이벤트와 확인 방법을 설계합니다.',
    outputs: '이벤트 정의 · 측정 항목 · 점검 방법',
  },
] as const;

const examples = [
  {
    title: '지역 서비스 업체',
    flow: ['서비스 가능 지역', '작업 범위', '비용 결정 요소', '실제 작업 사례', '예약·견적 문의'],
  },
  {
    title: 'B2B·제조 기업',
    flow: ['제품·서비스', '적용 분야', '사양·선택 기준', '확인 가능한 인증·납품 근거', '기업 문의'],
  },
  {
    title: '브랜드·SaaS',
    flow: ['해결하는 문제', '기능·사용 대상', '활용 사례', '요금 결정 기준', '도입 문의'],
  },
] as const;

const caseIds = ['pseo-engine', 'space-booking', 'edu-erp'] as const;
const cases = caseIds.map((id) => getProject(id)).filter((item): item is NonNullable<typeof item> => Boolean(item));

const process = [
  ['현황과 목표 확인', '현재 홈페이지·서비스 자료와 고객의 주요 질문을 공유해 주세요. 유지할 URL과 우선 목표를 함께 확인합니다.', '현황 목록 · 목표·제약 정리'],
  ['제작 범위·핵심 질문 정리', '대상 고객, 서비스 범위, 자주 받는 문의와 공개 가능한 근거를 확인합니다.', '핵심 질문 · 포함·제외 범위'],
  ['정보 구조·카피·화면 설계', '회사 자료와 검증 가능한 사실을 바탕으로 페이지 흐름과 화면을 검토합니다.', '사이트맵 · 화면 구성 · 카피 초안'],
  ['개발과 문의·측정 연동', '확정한 화면과 콘텐츠를 반응형으로 개발하고 문의 접수와 측정 항목을 연결합니다.', '테스트 사이트 · 문의 폼 · 이벤트 정의'],
  ['QA·배포·인수인계', 'URL·모바일·접근성·폼·검색 설정을 점검하고 고객 명의 운영 환경으로 넘깁니다.', '운영 사이트 · 소스코드 · 점검표 · 운영 가이드'],
] as const;

const projectTypes = [
  {
    title: 'GEO 신규 홈페이지 제작',
    body: '홈페이지가 없거나 새로 만드는 경우, 질문·서비스·근거·문의 흐름을 처음부터 한 구조로 설계합니다.',
  },
  {
    title: '기존 홈페이지 GEO 관점 개선',
    body: '현재 URL과 콘텐츠를 먼저 점검한 뒤 유지할 자산과 개선할 정보 구조·검색 접근성·문의 동선을 구분합니다.',
    // 기존 사이트만 다루는 별도 상품이 생겨(패키지·시작가 공개) 그쪽으로 연결한다.
    // 이 카드의 설명·견적 문구는 그대로 두고 링크 한 줄만 더한다.
    href: '/ai-search-optimization/',
    hrefLabel: '기존 홈페이지 개선 전용 패키지 보기 →',
  },
  {
    title: '콘텐츠·관리 기능·측정 확장',
    body: '사례·FAQ를 직접 관리하는 CMS, 외부 서비스 연동, 상세 이벤트 측정처럼 운영에 필요한 기능을 별도 범위로 확장합니다.',
  },
] as const;

const faqs = [
  ['일반 홈페이지 제작과 무엇이 다른가요?', '일반 제작 범위에 고객 질문·검토 기준·검증 가능한 근거와 측정 설계를 더 깊게 연결합니다. 디자인과 기술 SEO만 추가하는 작업이 아니라, 고객이 서비스를 이해하고 근거를 확인한 뒤 문의하도록 정보 구조를 함께 만듭니다.'],
  ['기존 홈페이지를 유지하면서 개선할 수 있나요?', '가능합니다. 먼저 기존 URL, 검색 유입 콘텐츠, canonical과 내부 링크를 점검해 보존 대상을 정합니다. 변경이 필요한 주소는 사전 합의와 리다이렉트 계획 없이 임의로 없애지 않습니다.'],
  ['ChatGPT나 Google AI 검색에 반드시 나오게 해주나요?', '추천·인용이나 검색 순위를 보장하지 않습니다. 검색 가능한 기술 구조와 명확한 서비스 설명, 공개 가능한 근거를 구현하지만 최종 노출과 답변은 각 검색·AI 서비스가 결정합니다.'],
  ['홈페이지가 없고 자료가 적어도 시작할 수 있나요?', '시작할 수 있습니다. 회사가 제공하는 서비스, 주요 고객, 진행 방식과 자주 받는 질문부터 인터뷰해 초안을 만듭니다. 확인되지 않은 실적이나 인증은 자료가 없다는 이유로 만들어 넣지 않습니다.'],
  ['서비스 설명과 FAQ 작성도 함께 진행하나요?', '계약 범위에 포함해 진행할 수 있습니다. 제공받은 자료와 인터뷰 내용을 바탕으로 초안을 작성하고, 서비스 책임자가 사실관계를 확인한 문장만 게시합니다.'],
  ['제작 비용과 기간은 어떻게 정해지나요?', '범위를 확인한 뒤 개별 견적으로 정합니다. 페이지 수, 기존 콘텐츠 상태, 사례·FAQ 작성 범위, CMS·외부 연동, 기존 사이트 이전과 측정 범위에 따라 달라집니다.'],
  ['제작 후 직접 콘텐츠를 수정할 수 있나요?', '수정 가능한 구조로 제작할 수 있습니다. 단순 파일 수정 교육과 관리자·CMS 구축은 범위가 다르므로, 직접 바꾸고 싶은 항목을 확인해 계약에 명시합니다.'],
  ['어떤 자료를 준비해야 하나요?', '현재 홈페이지 주소, 서비스 소개서, 고객이 자주 묻는 질문, 공개 가능한 사례·인증·사진이 있으면 좋습니다. 자료가 부족하면 보유 자료와 인터뷰로 확인 가능한 사실부터 정리합니다.'],
  ['효과는 어떤 항목으로 확인하나요?', '검색 유입, 방문 페이지, CTA 클릭, 폼 입력 시작과 서버가 확인한 문의 접수를 구분해 확인합니다. AI 답변의 브랜드 언급·링크 인용은 실행 날짜와 조건을 기록하는 관찰 항목이며 고정 순위처럼 해석하지 않습니다.'],
  ['유지관리나 추가 콘텐츠 작업도 가능한가요?', '가능하지만 자동 포함되지는 않습니다. 유지관리, 사례·FAQ 추가, 측정 보고는 필요한 주기와 작업량을 확인한 뒤 별도 범위로 안내합니다.'],
] as const;

export default function GeoWebsitePage() {
  return (
    <>
      <ServiceWebPageJsonLd
        url={CANONICAL}
        name="GEO 홈페이지 제작"
        description={DESCRIPTION}
        serviceType="GEO 홈페이지 제작 · AI 검색을 고려한 웹사이트 개발"
        crumbs={[
          { name: '홈', url: `${SITE.domain}/` },
          { name: 'GEO 홈페이지 제작', url: CANONICAL },
        ]}
      />

      <main className={`reum-landing ${styles.page}`}>
        <section className={styles.hero} aria-labelledby="geo-title">
          <div className={styles.wrap}>
            <nav className={styles.breadcrumb} aria-label="현재 위치">
              <Link href="/">홈</Link><span aria-hidden="true">/</span><span>GEO 홈페이지 제작</span>
            </nav>
            <div className={styles.heroGrid}>
              <div>
                <p className={styles.eyebrow}>GEO 홈페이지 제작</p>
                <h1 id="geo-title">AI 검색까지 고려한<br />GEO 홈페이지 제작</h1>
                <p className={styles.heroMessage}>고객이 묻는 질문에,<br />우리 회사의 답이 준비된 홈페이지.</p>
                <p className={styles.heroDescription}>
                  름랩은 고객이 실제로 묻는 질문, 서비스 선택 기준, 검증 가능한 사례를 홈페이지 구조에 반영합니다.
                  검색엔진이 읽을 수 있는 기술 기반부터 브랜드 정보, 문의 동선과 성과 측정까지 함께 설계합니다.
                </p>
                <div className={styles.actions}>
                  <a href="#geo-inquiry" className={styles.primaryButton} data-analytics="cta_geo_hero_form" data-cta-type="form" data-cta-location="hero">
                    GEO 홈페이지 제작 상담하기
                  </a>
                  <a href="#geo-scope" className={styles.secondaryButton} data-analytics="cta_geo_hero_scope">어떤 내용을 제작하는지 보기</a>
                </div>
                <ul className={styles.featureStrip} aria-label="핵심 특징">
                  <li>신규 제작·기존 사이트 개선</li><li>고객 질문 중심 정보 설계</li><li>SEO 기술 기반</li><li>문의 동선</li><li>소스코드·운영 권한 인수인계</li>
                </ul>
              </div>
              <figure className={styles.heroFigure}>
                <figcaption>구성 예시 · 실제 추천 결과 화면이 아닙니다</figcaption>
                <ol>
                  <li><span>01</span><strong>고객의 질문</strong><small>무엇을, 왜 선택해야 하나요?</small></li>
                  <li><span>02</span><strong>관련 서비스 설명</strong><small>대상·범위·비용 결정 요소</small></li>
                  <li><span>03</span><strong>근거·사례 확인</strong><small>공개 가능한 사실과 산출물</small></li>
                  <li><span>04</span><strong>문의</strong><small>필요한 범위를 남기는 동선</small></li>
                </ol>
              </figure>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="geo-summary-title">
          <div className={`${styles.wrap} ${styles.narrow}`}>
            <p className={styles.eyebrow}>SERVICE</p>
            <h2 id="geo-summary-title">GEO 홈페이지 제작은 무엇인가요?</h2>
            <p className={styles.lead}>
              생성형 AI를 포함한 검색 환경에서 기업과 서비스를 정확히 설명할 수 있도록
              홈페이지의 콘텐츠, 기술 구조, 근거 자료와 문의 동선을 함께 설계·개발하는 서비스입니다.
              키워드나 메타 태그만 추가하는 작업이 아니라, 사람이 이해하기 쉬운 답과 검색 가능한 기술 기반을 함께 만듭니다.
            </p>
            <p className={styles.note}>
              SEO·AEO·GEO를 서로 단절된 공식 규격으로 다루지 않습니다. 검색 접근성, 명확한 답변,
              정확한 브랜드 설명이라는 공통 기반에서 프로젝트에 필요한 범위를 정합니다.
            </p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.soft}`} aria-labelledby="geo-fit-title">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>FIT</p>
            <h2 id="geo-fit-title">이런 업체에 적합합니다</h2>
            <div className={styles.fitGrid}>
              {fitItems.map((item) => <div key={item} className={styles.fitCard}><span aria-hidden="true">✓</span><p>{item}</p></div>)}
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="geo-difference-title">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>DIFFERENCE</p>
            <h2 id="geo-difference-title">무엇을 다르게 설계하나요?</h2>
            <p className={styles.sectionIntro}>소개 중심 홈페이지의 기본 역할은 유지하면서, 고객이 질문하고 검토하는 과정에 필요한 정보와 측정을 추가합니다.</p>
            <div className={styles.tableWrap} tabIndex={0} aria-label="소개 중심 구성과 GEO 홈페이지 제작 범위 비교표">
              <table className={styles.comparisonTable}>
                <thead><tr><th scope="col">비교 기준</th><th scope="col">소개 중심 구성</th><th scope="col">이번 서비스에서 추가로 설계하는 범위</th></tr></thead>
                <tbody>{comparisonRows.map(([label, current, added]) => <tr key={label}><th scope="row">{label}</th><td>{current}</td><td>{added}</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.dark}`} id="geo-scope" aria-labelledby="geo-scope-title">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>SCOPE</p>
            <h2 id="geo-scope-title">실제 제작 범위</h2>
            <p className={styles.sectionIntro}>아래 항목을 기준으로 필요한 것만 계약 범위에 확정합니다. 모든 항목이 모든 프로젝트에 자동 포함되는 것은 아닙니다.</p>
            <div className={styles.scopeGrid}>
              {scopes.map((scope) => (
                <article key={scope.no} className={styles.scopeCard}>
                  <span className={styles.number}>{scope.no}</span><h3>{scope.title}</h3><p>{scope.body}</p>
                  <div><b>산출물 예시</b><span>{scope.outputs}</span></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="geo-example-title">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>EXAMPLES</p>
            <h2 id="geo-example-title">업종별 홈페이지 구성 예시</h2>
            <p className={styles.sectionIntro}>아래는 정보 구조 예시이며, 실제 고객의 GEO 성과나 AI 추천 결과를 뜻하지 않습니다.</p>
            <div className={styles.exampleGrid}>
              {examples.map((example) => (
                <article key={example.title} className={styles.exampleCard}>
                  <span>구성 예시</span><h3>{example.title}</h3>
                  <ol>{example.flow.map((step, index) => <li key={step}><b>{String(index + 1).padStart(2, '0')}</b><span>{step}</span></li>)}</ol>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.soft}`} aria-labelledby="geo-cases-title">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>EXPERIENCE</p>
            <h2 id="geo-cases-title">관련 구현 경험</h2>
            <p className={styles.sectionIntro}>공개된 실제 구축 사례 중 검색 구조, 웹 문의·예약, 콘텐츠·운영 화면과 직접 관련된 사례만 연결했습니다. AI 추천·인용 성과로 바꾸어 표현하지 않습니다.</p>
            <div className={styles.caseGrid}>
              {cases.map((project) => (
                <article key={project.id} className={styles.caseCard}>
                  <p>{project.chip}</p><h3>{project.title}</h3><span>{project.problem}</span>
                  <dl><div><dt>담당 범위</dt><dd>{project.scope}</dd></div><div><dt>납품 산출물</dt><dd>{project.detail.deliverables.slice(0, 3).join(' · ')}</dd></div></dl>
                  <Link href={portfolioCanonical(project.id).replace(SITE.domain, '')}>구현 내용 확인하기 →</Link>
                </article>
              ))}
            </div>
            <p className={styles.casePrivacy}>고객사 요청에 따라 실제 고객명·서비스 URL은 공개하지 않으며, 사례 페이지의 기존 익명 처리 범위를 유지합니다.</p>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="geo-process-title">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>PROCESS</p>
            <h2 id="geo-process-title">진행 방식</h2>
            <ol className={styles.processList}>
              {process.map(([title, input, output], index) => (
                <li key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{input}</p><small><b>확인할 결과물</b> {output}</small></div></li>
              ))}
            </ol>
          </div>
        </section>

        <section className={`${styles.section} ${styles.soft}`} aria-labelledby="geo-price-title">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>PROJECT TYPE &amp; COST</p>
            <h2 id="geo-price-title">제작 유형과 비용 안내</h2>
            <div className={styles.typeGrid}>
              {projectTypes.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  {'href' in item && item.href ? (
                    <p><Link href={item.href} prefetch={false}>{item.hrefLabel}</Link></p>
                  ) : null}
                  <strong>범위 확인 후 개별 견적</strong>
                </article>
              ))}
            </div>
            <div className={styles.costFactors}>
              <h3>비용을 결정하는 항목</h3>
              <ul><li>페이지 수</li><li>기존 콘텐츠 상태</li><li>사례·FAQ 작성 범위</li><li>CMS 필요 여부</li><li>외부 연동</li><li>기존 사이트 이전 여부</li><li>측정 범위</li></ul>
              <p>기존 일반 웹 제작 가격은 참고할 수 있지만 GEO 서비스의 확정 가격은 아닙니다. 포함 범위와 외부 서비스 실비는 계약 전에 구분해 안내합니다.</p>
            </div>
          </div>
        </section>

        <section className={styles.section} id="geo-faq" aria-labelledby="geo-faq-title">
          <div className={`${styles.wrap} ${styles.narrow}`}>
            <p className={styles.eyebrow}>FAQ</p>
            <h2 id="geo-faq-title">자주 묻는 질문</h2>
            <div className={styles.faqList}>
              {faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
            </div>
            <p className={styles.limitNotice}>
              검색 노출 순위와 AI 답변의 추천·인용 여부는 보장하지 않습니다. 계약으로 확정한 제작 범위와 검증 가능한 구현 항목을 기준으로 진행합니다.
            </p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.inquiry}`} id="geo-inquiry" aria-labelledby="geo-inquiry-title">
          <div className={styles.wrap}>
            <div className={styles.inquiryIntro}>
              <p className={styles.eyebrow}>START</p>
              <h2 id="geo-inquiry-title">우리 회사에 필요한 GEO 홈페이지,<br />제작 범위부터 정리해드립니다.</h2>
              <p>현재 홈페이지 주소나 만들고 싶은 서비스를 알려주세요. 신규 제작과 기존 사이트 개선 중 적합한 방향, 필요한 구성과 예상 견적 범위를 안내드립니다.</p>
              <div className={styles.contactLinks}>
                <a href={SITE.phoneHref} data-analytics="cta_geo_final_call">전화 {SITE.phone}</a>
                <a href={SITE.kakaoChannel} target="_blank" rel="noopener noreferrer" data-analytics="cta_geo_final_kakao">카카오톡 상담</a>
                <a href={`mailto:${SITE.email}`} data-analytics="cta_geo_final_email">이메일 문의</a>
              </div>
            </div>
            <LandingInquiryForm landingSlug="geo-website" defaultServiceType="GEO 홈페이지 제작" variant="geo-website" submitLabel="GEO 홈페이지 제작 상담하기" />
          </div>
        </section>

        <section className={styles.related} aria-labelledby="geo-related-title">
          <div className={styles.wrap}>
            <h2 id="geo-related-title">관련 서비스</h2>
            <nav aria-label="관련 서비스">
              <Link href="/website/">일반 홈페이지·랜딩페이지 제작</Link>
              <Link href="/seo-website/">업종·지역 검색 유입을 고려한 홈페이지 제작</Link>
              <Link href="/ai-search-optimization/" prefetch={false}>기존 홈페이지 AI 검색 구조 개선</Link>
              <Link href="/data-seo/" prefetch={false}>데이터·SEO 자동화 시스템 구축</Link>
              <Link href="/service-renewal/" prefetch={false}>기존 서비스 개선·인수 개발</Link>
              <Link href="/portfolio/">개발 사례 전체 보기</Link>
            </nav>
          </div>
        </section>
      </main>
      <BusinessFooter topExtra={<Link href="/website/">← 홈페이지 제작 서비스 비교하기</Link>} />
    </>
  );
}
