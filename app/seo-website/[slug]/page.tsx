import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from '@/components/SiteLink';
import BusinessFooter from '@/components/BusinessFooter';
import LandingInquiryForm from '@/components/LandingInquiryForm';
import { ServiceWebPageJsonLd } from '@/components/JsonLd';
import { SITE } from '@/lib/seo';
import { getSeoWebsitePage, SEO_WEBSITE_PAGES } from '@/lib/seo-website';
import styles from '../seo-website.module.css';

type Props = { params: { slug: string } };

export const dynamicParams = false;
export function generateStaticParams() { return SEO_WEBSITE_PAGES.filter((page) => page.slug).map((page) => ({ slug: page.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getSeoWebsitePage(params.slug);
  if (!page || !page.slug) notFound();
  return { metadataBase: new URL(SITE.domain), title: { absolute: page.title }, description: page.description, alternates: { canonical: page.canonical }, openGraph: { type: 'website', locale: 'ko_KR', url: page.canonical, siteName: SITE.name, title: page.title, description: page.description, images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: page.h1 }] }, robots: { index: true, follow: true } };
}

function RegionalContent() {
  return <>
    <section className={styles.section}><div className={styles.wrap}><header className={styles.sectionHeader}><h2>한 페이지로 충분한 경우 / 나눌 이유가 있는 경우</h2></header><div className={styles.grid2}><article className={styles.card}><h3>한 페이지에서 설명</h3><p>실제 활동 지역과 서비스 조건이 같고 지역별로 추가할 정보가 적다면 한 페이지에 서비스 범위를 정확히 표시합니다.</p></article><article className={styles.card}><h3>고유 정보가 있을 때 구분</h3><p>현장 조건, 출장 기준, 작업 유형, 사진·사례와 고객 질문이 다를 때만 별도 페이지를 검토합니다.</p></article></div></div></section>
    <section className={styles.section}><div className={styles.wrap}><header className={styles.sectionHeader}><h2>지역과 서비스의 관계를 실제 정보로 설명합니다.</h2><p>‘지역 A + 청소 유형 B’는 정보 구조 예시입니다. 실제 지점·완료 실적·후기를 창작하지 않습니다.</p></header><div className={styles.grid3}>{[['고유 정보', '출장 가능 범위, 예약 방식, 작업 종류, 현장 조건과 공개 가능한 실제 자료'], ['운영 구조', '필수 정보 검토 → 미리보기 → 공개 → 사이트맵 반영 → 상태 확인'], ['숫자의 구분', '후보 조합 수, 실제 제작 수, 공개 수, 색인 수와 노출 검색어 수는 서로 다름']].map(([title, body]) => <article className={styles.card} key={title}><h3>{title}</h3><p>{body}</p></article>)}</div></div></section>
    <section className={styles.section}><div className={styles.wrap}><header className={styles.sectionHeader}><h2>품질 기준과 견적 범위</h2></header><div className={styles.comparison}><table><caption>지역·서비스 페이지 검토 기준</caption><thead><tr><th scope="col">구분</th><th scope="col">확인 내용</th></tr></thead><tbody><tr><th scope="row">공개 기준</th><td>같은 내용에 지역명만 바꾸지 않고 실제 제공 서비스와 고유 정보가 있는지 확인</td></tr><tr><th scope="row">비용 기준</th><td>템플릿 수, 유효 데이터량, 개별 원고, 운영 기능, 연동과 검수 범위</td></tr><tr><th scope="row">자동화 필요 시</th><td><Link href="/data-seo/">대량 데이터·SEO 시스템 구축</Link>과 별도 역할로 검토</td></tr></tbody></table></div></div></section>
  </>;
}

function CostContent() {
  return <>
    <section className={styles.section}><div className={styles.wrap}><div className={styles.priceBox}><strong>범위 확인 후 개별 견적</strong><p>페이지 수, 콘텐츠 준비 상태, 관리 기능과 외부 연동을 확인해 포함·제외 항목을 구분해 안내합니다.</p></div></div></section>
    <section className={styles.section}><div className={styles.wrap}><header className={styles.sectionHeader}><h2>비교할 세 가지 제작 범위</h2><p>아래는 견적 설명용 유형이며 새로운 고정가 패키지가 아닙니다.</p></header><div className={styles.grid3}>{[['소개·문의 중심', '기본 서비스 설명, 모바일, 문의 연결, 기본 검색 접근성', '원페이지·멀티페이지와 자료 제공 상태'], ['서비스·업종 설명 확장', '서비스별 페이지, 비용·FAQ, 관련 내부 링크', '페이지별 원고·사진·관리 방식'], ['지역·서비스 운영 확장', '구분할 가치가 있는 데이터, 템플릿, 검수 흐름', '데이터 품질·관리자·공개·수정 범위']].map(([title, body, note]) => <article className={styles.card} key={title}><h3>{title}</h3><p>{body}</p><p><strong>추가 확인:</strong> {note}</p></article>)}</div></div></section>
    <section className={styles.section}><div className={styles.wrap}><header className={styles.sectionHeader}><h2>반드시 구분할 비용 항목</h2></header><div className={styles.grid2}>{['설계·디자인·개발·콘텐츠 정리', '도메인·호스팅·유료 도구 운영 실비', '촬영·원고 대행·다국어·고급 관리자·외부 연동', '지속 관리·추가 콘텐츠·광고 집행', '사이트 이전·기존 URL 대응·데이터 정비', '업종·서비스·지역·자료·기능·예산·일정 확인'].map((item) => <div className={styles.card} key={item}><p>{item}</p></div>)}</div></div></section>
  </>;
}

function StaffingContent() {
  const profile = SEO_WEBSITE_PAGES.find((page) => page.pageId === 'STAFFING')!;
  return <>
    <section className={styles.section}><div className={styles.wrap}><header className={styles.sectionHeader}><h2>기업 문의와 구직 문의를 처음부터 구분합니다.</h2><p>인력 요청은 직무·인원·기간·현장 지역을, 구직 문의는 필요한 최소 정보와 다음 안내를 받도록 설계합니다.</p></header><div className={styles.grid2}><article className={styles.card}><h3>인력이 필요한 기업</h3><ul><li>필요 직무와 인원</li><li>기간·근무 조건</li><li>현장과 지역</li><li>담당자 연락 동선</li></ul></article><article className={styles.card}><h3>일자리를 찾는 사람</h3><ul><li>제공 직무와 활동 지역</li><li>운영 절차</li><li>문의 채널</li><li>민감정보 최소 수집</li></ul></article></div></div></section>
    <section className={styles.section}><div className={styles.wrap}><header className={styles.sectionHeader}><h2>준비할 자료와 상담 항목</h2></header><div className={styles.grid3}>{['실제 소개·파견 등 업무 형태와 제공 직무', '활동 지역·현장·운영 시간과 문의 처리 방식', '자격·법적 지위는 공식 자료로 확인', '기업 문의: 직무·인원·기간·지역', '구직자 이력서·민감정보 시스템은 별도 범위', '고객사 문의폼 예시와 름랩 제작 상담폼은 구분'].map((item) => <div className={styles.card} key={item}><p>{item}</p></div>)}</div><p className={styles.notice}>{profile.lead}</p></div></section>
  </>;
}

export default function SeoWebsiteDetailPage({ params }: Props) {
  const page = getSeoWebsitePage(params.slug);
  if (!page || !page.slug) notFound();
  const crumbs = [{ name: '홈', url: `${SITE.domain}/` }, { name: '검색 잘되는 홈페이지 제작', url: `${SITE.domain}/seo-website/` }, { name: page.h1, url: page.canonical }];
  return <>
    <ServiceWebPageJsonLd url={page.canonical} name={page.h1} description={page.description} serviceType="검색 유입을 고려한 홈페이지 제작" crumbs={crumbs} />
    <main className={styles.page}>
      <nav className={`${styles.wrap} ${styles.breadcrumb}`} aria-label="breadcrumb"><Link href="/">홈</Link> / <Link href="/seo-website/">검색 잘되는 홈페이지 제작</Link> / <span>{page.pageId === 'REGIONAL' ? '지역별 구조' : page.pageId === 'COST' ? '비용' : '인력업체'}</span></nav>
      <section className={styles.hero}><div className={styles.wrap}><p className={styles.eyebrow}>{page.eyebrow}</p><h1>{page.h1}</h1><p className={styles.lead}>{page.lead}</p><div className={styles.actions}><a href="#inquiry" className={styles.primary} data-analytics={`seo_website_${page.slug}_form`} data-cta-type="form" data-cta-location="hero">제작 범위 상담하기</a><Link href="/seo-website/" className={styles.secondary}>대표 서비스 보기</Link></div><p className={styles.notice}>실제 서비스와 고유 정보가 있는 범위에서 설계하며 검색 순위·색인·문의 수를 보장하지 않습니다.</p></div></section>
      {page.pageId === 'REGIONAL' ? <RegionalContent /> : page.pageId === 'COST' ? <CostContent /> : <StaffingContent />}
      <section className={styles.section}><div className={styles.wrap}><header className={styles.sectionHeader}><h2>자주 묻는 질문</h2></header><div className={styles.faq}>{page.faqs.map((faq) => <details key={faq.q}><summary>{faq.q}</summary><p>{faq.a}</p></details>)}</div></div></section>
      <section className={styles.inquiry} id="inquiry" tabIndex={-1}><div className={styles.wrap}><header className={styles.sectionHeader}><h2>업종과 필요한 범위를 알려주세요.</h2><p>현재 홈페이지 유무와 실제 서비스 지역을 확인해 포함·제외 항목을 안내합니다.</p></header><LandingInquiryForm landingSlug={`seo-website/${page.slug}`} defaultServiceType="검색 잘되는 홈페이지 제작" variant="seo-website" defaultIndustry={page.pageId === 'STAFFING' ? '인력' : undefined} submitLabel="제작 범위 검토 요청하기" /></div></section>
    </main>
    <BusinessFooter topExtra={<Link href="/seo-website/">← 검색 잘되는 홈페이지 제작</Link>} />
  </>;
}
