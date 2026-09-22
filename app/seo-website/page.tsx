import type { Metadata } from 'next';
import Link from '@/components/SiteLink';
import BusinessFooter from '@/components/BusinessFooter';
import LandingInquiryForm from '@/components/LandingInquiryForm';
import { ServiceWebPageJsonLd } from '@/components/JsonLd';
import { SITE } from '@/lib/seo';
import { SEO_WEBSITE_INDUSTRIES, SEO_WEBSITE_PAGES } from '@/lib/seo-website';
import styles from './seo-website.module.css';

const page = SEO_WEBSITE_PAGES[0];

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: { absolute: page.title },
  description: page.description,
  alternates: { canonical: page.canonical },
  openGraph: { type: 'website', locale: 'ko_KR', url: page.canonical, siteName: SITE.name, title: page.title, description: page.description, images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: page.h1 }] },
  twitter: { card: 'summary_large_image', title: page.title, description: page.description, images: [SITE.defaultOgImage] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
};

const scope = [
  ['업종·지역·질문 정리', '실제 제공 서비스와 활동 지역, 상담 전에 자주 묻는 내용을 확인합니다.'],
  ['페이지·카피 설계', '고객이 비교할 정보를 페이지별 역할과 자연스러운 한국어 문장으로 정리합니다.'],
  ['모바일·PC 제작', '작은 화면부터 읽기 쉽고 전화·문의로 이동할 수 있는 반응형 화면을 만듭니다.'],
  ['기술 SEO', 'title, description, canonical, 사이트맵과 실제 내부 링크를 정리합니다.'],
  ['문의 채널 연결', '현재 사용하는 문의폼·전화·카카오톡·이메일 중 필요한 동선을 연결합니다.'],
  ['검색 등록·인수인계', '계정 권한 범위에서 소유확인과 사이트맵 제출을 점검하고 운영 방법을 전달합니다.'],
];

const process = ['현황·목표 확인', '범위·견적 확정', '자료·페이지 설계', '제작·문의 연결', '검수·배포', '검색 등록 확인·인수인계'];

export default function SeoWebsitePage() {
  const crumbs = [{ name: '홈', url: `${SITE.domain}/` }, { name: page.h1, url: page.canonical }];
  return (
    <>
      <ServiceWebPageJsonLd url={page.canonical} name={page.h1} description={page.description} serviceType="검색 유입을 고려한 홈페이지 제작" crumbs={crumbs} />
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={`${styles.wrap} ${styles.heroGrid}`}>
            <div>
              <p className={styles.eyebrow}>{page.eyebrow}</p>
              <h1>{page.h1}</h1>
              <p className={styles.lead}>네이버·구글에서 찾고, 홈페이지에서 이해하고, 문의로 이어지도록.</p>
              <p className={styles.lead}>{page.lead}</p>
              <div className={styles.actions}>
                <a href="#inquiry" className={styles.primary} data-analytics="seo_website_hero_form" data-cta-type="form" data-cta-location="hero">우리 업체 제작 범위 상담하기</a>
                <Link href="/seo-website/cost/" className={styles.secondary}>구성과 비용 확인하기</Link>
              </div>
              <p className={styles.trust}>제작 범위와 비용을 확인한 뒤 결정하세요.</p>
              <p className={styles.notice}>검색 유입을 고려한 구조를 만드는 서비스이며, 검색 순위나 노출을 보장하지 않습니다.</p>
            </div>
            <aside className={styles.structure} aria-label="홈페이지 정보 구조 구성 예시">
              <small>구성 예시</small>
              <h2>검색과 문의를 잇는 정보 흐름</h2>
              <div className={styles.flow}>
                <span>업종·서비스 설명</span><span>지역별 실제 정보</span><span>비용·범위·FAQ</span><span>전화·문의 접수</span>
              </div>
            </aside>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <header className={styles.sectionHeader}><h2>홈페이지를 만들 때, 이런 고민이 있나요?</h2></header>
            <div className={styles.grid4}>
              {[
                '업체 이름 말고 서비스명으로도 고객이 찾아왔으면 한다.',
                '여러 지역에서 일하는데 홈페이지에는 회사 소개만 있다.',
                '어떤 정보를 넣어야 견적 문의를 받을지 모르겠다.',
                '홈페이지 제작과 검색 등록을 따로 맡겨야 할지 헷갈린다.',
              ].map((item, index) => <div className={styles.card} key={item}><span className={styles.number}>{index + 1}</span><p>{item}</p></div>)}
            </div>
            <p className={styles.lead}>이미 홈페이지가 있다면 새로 만들기 전에 <Link href="/ai-search-optimization/">기존 홈페이지 검색 구조 개선</Link> 범위를 확인할 수 있습니다.</p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <header className={styles.sectionHeader}><h2>회사 소개에서 한 걸음 더, 고객의 검색과 질문을 담습니다.</h2><p>일반적인 소개 구성에 실제 서비스 범위와 고객이 비교하는 정보를 추가합니다.</p></header>
            <div className={styles.comparison}>
              <table><caption>소개 중심 구성과 검색형 정보 설계 비교</caption><thead><tr><th scope="col">비교 항목</th><th scope="col">소개 중심 구성</th><th scope="col">이번 서비스에서 추가 설계</th></tr></thead><tbody>
                {[
                  ['서비스 설명', '회사 소개와 대표 서비스', '서비스별 대상·범위·제외 조건'], ['활동 지역', '주소와 연락처', '실제 활동 범위와 출장 조건'], ['비용·범위', '문의 후 안내', '가격을 좌우하는 조건과 포함·제외'], ['고객 질문', '간단한 안내', '선택 전 필요한 FAQ와 준비 자료'], ['문의 동선', '전화·이메일', '페이지 맥락을 보존한 실제 접수'], ['검색 접근성', '기본 메타', '고유 title·canonical·내부 링크·사이트맵'], ['운영·측정', '공개 후 수정', '유입·CTA·접수 성공을 구분해 점검'],
                ].map((row) => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th scope="row" key={cell}>{cell}</th> : <td key={cell}>{cell}</td>)}</tr>)}
              </tbody></table>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <header className={styles.sectionHeader}><h2>화면만이 아니라, 검색과 문의에 필요한 구조를 만듭니다.</h2><p>계약마다 필요한 범위를 확인해 포함·제외 항목을 구분합니다.</p></header>
            <div className={styles.grid3}>{scope.map(([title, body], index) => <article className={styles.card} key={title}><span className={styles.number}>{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <header className={styles.sectionHeader}><h2>우리 업종에는 어떤 홈페이지가 필요할까요?</h2><p>기존에 살아 있는 업종 URL은 유지하고, 각 업종 고객이 실제로 비교할 정보만 보강합니다.</p></header>
            <div className={styles.grid2}>{SEO_WEBSITE_INDUSTRIES.map((industry) => <article className={styles.card} key={industry.pageId}><h3>{industry.label} 홈페이지 제작</h3><p>{industry.summary}</p><Link href={industry.href}>{industry.label} 구성 확인하기 →</Link></article>)}</div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <header className={styles.sectionHeader}><h2>여러 지역에서 일한다면, 실제 제공하는 정보를 나눠 담습니다.</h2></header>
            <div className={styles.grid2}>
              <article className={styles.card}><h3>한 페이지로 충분한 경우</h3><p>서비스 범위와 운영 조건이 같다면 한 페이지에서 실제 활동 지역을 명확히 설명합니다.</p></article>
              <article className={styles.card}><h3>페이지를 나눌 이유가 있는 경우</h3><p>지역별 작업 조건, 현장 정보, 제공 서비스와 고객 질문이 실제로 다를 때만 구분합니다.</p></article>
            </div>
            <p className={styles.notice}>‘지역명 + 입주청소’, ‘지역명 + 누수탐지’는 고객사 홈페이지의 정보 구조 예시이며 름랩이 해당 현장 서비스를 제공한다는 뜻이 아닙니다.</p>
            <div className={styles.actions}><Link href="/seo-website/regional/" className={styles.secondary}>지역별 홈페이지 구조 자세히 보기</Link></div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <header className={styles.sectionHeader}><h2>제작 비용은 필요한 범위에 따라 정합니다.</h2></header>
            <div className={styles.priceBox}><strong>범위 확인 후 개별 견적</strong><p>페이지 수, 콘텐츠 준비 상태, 관리 기능과 외부 연동을 확인해 포함·제외 항목을 구분해 안내합니다.</p></div>
            <div className={styles.links} style={{ marginTop: 20 }}><Link href="/seo-website/cost/">비용 결정 요소와 견적 체크리스트</Link><Link href="/seo-website/guides/seo-checklist/">견적 전에 확인할 10가지</Link></div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <header className={styles.sectionHeader}><h2>상담부터 공개 후 점검까지, 진행 범위가 보이게.</h2></header>
            <div className={styles.grid3}>{process.map((item, index) => <article className={styles.card} key={item}><span className={styles.number}>{index + 1}</span><h3>{item}</h3></article>)}</div>
            <p className={styles.notice}>홈페이지 제작 일정과 검색엔진의 수집·색인 시점은 다릅니다.</p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <header className={styles.sectionHeader}><h2>납품 항목과 검수 기준으로 확인하세요.</h2><p>이 상품과 직접 연결해 공개할 수 있는 검색 성과 사례는 아직 별도 증거로 확보하지 않았습니다. 대신 실제 검수 가능한 항목을 기준으로 안내합니다.</p></header>
            <div className={styles.grid3}>{['모바일·PC 초기 HTML과 실제 링크', '문의폼 서버 접수와 오류 상태', 'title·canonical·사이트맵·구조화 데이터', '계정 권한 범위의 소유확인·제출 상태', '소스·배포·운영 권한 인수인계', '검색 순위 보장과 별개인 7·14·28일 점검 항목'].map((item) => <div className={styles.card} key={item}><p>{item}</p></div>)}</div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.wrap}>
            <header className={styles.sectionHeader}><h2>자주 묻는 질문</h2></header>
            <div className={styles.faq}>{page.faqs.map((faq) => <details key={faq.q}><summary>{faq.q}</summary><p>{faq.a}</p></details>)}</div>
          </div>
        </section>

        <section className={styles.inquiry} id="inquiry" tabIndex={-1}>
          <div className={styles.wrap}>
            <header className={styles.sectionHeader}><h2>어떤 홈페이지가 필요한지, 업종과 지역부터 알려주세요.</h2><p>현재 홈페이지 유무와 필요한 기능을 남겨주시면, 제작 범위와 비용을 검토해 안내합니다.</p></header>
            <LandingInquiryForm landingSlug="seo-website" defaultServiceType="웹 MVP / 홈페이지" submitLabel="제작 범위 검토 요청하기" />
            <div className={styles.links} style={{ marginTop: 20 }}><a href={SITE.phoneHref}>전화 {SITE.phone}</a><a href={`mailto:${SITE.email}`}>이메일 문의</a></div>
          </div>
        </section>
      </main>
      <BusinessFooter topExtra={<Link href="/website/">일반 업종별 홈페이지 제작과 비교하기</Link>} />
    </>
  );
}

