import type { Metadata } from 'next';
import Link from '@/components/SiteLink';
import BusinessFooter from '@/components/BusinessFooter';
import LandingInquiryForm from '@/components/LandingInquiryForm';
import { SITE } from '@/lib/seo';
import '../reum-sales.css';

const url = 'https://reumlab.com/marketing-linked-development/';
const title = '출시 후 마케팅까지 연계하는 개발 | 름랩';
const description = '앱·웹·MVP·ERP 개발 뒤 검색 구조, 전환 측정, 콘텐츠와 자동화가 필요한 프로젝트를 현랩과 연결합니다. 같은 운영 주체 이터널식스의 전문 브랜드가 담당 범위와 산출물을 함께 정리합니다.';
export const metadata: Metadata = { title: { absolute: title }, description, alternates: { canonical: url }, openGraph: { title, description, url, siteName: SITE.name, locale: 'ko_KR', type: 'website', images: [{ url: SITE.defaultOgImage, width: 1200, height: 630 }] }, twitter: { card: 'summary_large_image', title, description, images: [SITE.defaultOgImage] }, robots: { index: true, follow: true } };
const faqs = [
  ['현랩은 다른 회사인가요?', '현랩과 름랩의 법적 운영 주체는 이터널식스입니다. 름랩은 개발, 현랩은 검색·콘텐츠·분석·전환·자동화·그로스 마케팅을 맡는 전문 브랜드입니다. 프로젝트마다 계약 범위와 담당 역할을 문서로 확정합니다.'],
  ['개발만 맡길 수 있나요?', '가능합니다. 현랩 연계는 필요한 프로젝트에서만 정합니다. 기존 마케팅팀·개발사와 협업할 수 있고 월 운영 계약을 전제로 하지 않습니다.'],
  ['기존 사이트나 앱도 개선할 수 있나요?', '현재 소스와 권한, 유지할 URL·콘텐츠·기능, 데이터 수집 상태부터 확인합니다. 변경 가능한 범위에 따라 랜딩·폼·관리자·CRM·자동화 연동을 단계별로 정합니다.'],
  ['검색 순위와 문의 증가를 보장하나요?', '보장하지 않습니다. 검색엔진과 AI 서비스가 색인·노출·인용을 결정하고 문의는 유입과 상품, 고객 상황의 영향을 받습니다. 구현한 기능, 검색 접근성, 이벤트 수집과 개선 결과를 근거로 확인합니다.'],
];
export default function MarketingLinkedDevelopmentPage() {
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', '@id': url, url, name: title, description, isPartOf: { '@id': 'https://reumlab.com/#website' } },
    { '@type': 'Service', '@id': `${url}#service`, url, name: '마케팅 연계 개발', description, provider: { '@id': 'https://reumlab.com/#organization' } },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: '홈', item: 'https://reumlab.com/' }, { '@type': 'ListItem', position: 2, name: '마케팅 연계 개발', item: url }] },
    { '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  ] };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <main id="main" className="reum-sales"><div className="container" style={{ paddingTop: 130, paddingBottom: 72, maxWidth: 1000 }}>
      <nav aria-label="현재 위치"><Link href="/">홈</Link> / 마케팅 연계 개발</nav>
      <p style={{ marginTop: 30, color: 'var(--accent)' }}>BUILD × GROW</p>
      <h1 style={{ fontSize: 'clamp(30px, 5vw, 54px)', lineHeight: 1.3, margin: '20px 0' }}>개발 이후의 검색과 전환까지 연결합니다.</h1>
      <p style={{ fontSize: 20, lineHeight: 1.8 }}>름랩은 서비스 출시로 끝내지 않습니다. 검색 구조, 전환 측정, 콘텐츠, 마케팅 자동화가 필요한 프로젝트는 현랩과 연계해 출시 이후 성장 단계까지 이어갑니다. 개발은 름랩, 성장 시스템은 현랩이 맡으며, 두 브랜드의 법적 운영 주체는 이터널식스입니다.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 30 }}><a href="https://hyunlab.kr/marketing-development/" data-analytics="marketing-development-partner">현랩의 검색·측정·자동화 범위 보기 →</a><a href="#contact" data-analytics="marketing-development-contact" data-cta-type="form">개발 범위 상담하기 →</a></div>
      <section style={{ marginTop: 64 }}><h2>출시 뒤에 다시 개발하는 일을 줄이려면</h2><p>URL 구조, 서비스 설명, 문의 완료의 정의와 전환 이벤트를 개발 단계에서 정합니다. 출시 후 마케팅팀이 요청하는 랜딩 변경, 폼 필드와 CRM 연결, 리드 분류와 알림을 실제 기능과 데이터 흐름에 연결합니다.</p><p>개발사와 마케팅사를 따로 고르면 전문 파트너 선택과 독립적인 검토가 쉽습니다. 대신 요청 전달, 변경 권한과 검수 기준을 별도로 관리해야 합니다. 름랩과 현랩이 연계하는 프로젝트도 같은 기준으로 역할과 완료 조건을 명확히 남깁니다.</p></section>
      <section style={{ marginTop: 48 }}><h2>담당 범위와 산출물</h2><dl><dt><strong>름랩 · 앱·웹·업무시스템 개발</strong></dt><dd>화면·기능 설계, 반응형 사이트, 앱·MVP, 관리자·ERP, 폼·CRM·외부 API 연동, 배포와 소스·운영 권한 인수인계</dd><dt style={{ marginTop: 20 }}><strong>현랩 · 검색·콘텐츠·분석·자동화</strong></dt><dd>검색 접근성, 페이지·콘텐츠 정보구조, 전환 이벤트 명세와 검증, 리포트·리드 처리 시나리오와 운영 문서</dd></dl><p>광고 매체비와 외부 도구 사용료는 별도이며, 검색 순위·색인·AI 인용을 보장하지 않습니다. 실제 포함·제외 범위는 견적서와 계약서에서 확정합니다.</p></section>
      <section style={{ marginTop: 48 }}><h2>진행 과정과 비용 기준</h2><ol><li>현재 사이트·앱·계정, 목표와 유지할 기능을 확인합니다.</li><li>기능 목록·URL과 콘텐츠 맵·이벤트 명세, 역할과 검수 기준을 정합니다.</li><li>개발·검색 구조·계측과 자동화를 구현하고 테스트 화면을 공유합니다.</li><li>모바일·폼·권한·검색 접근성과 이벤트를 검증한 뒤 배포합니다.</li><li>운영 문서와 권한을 이관하고 데이터에 따라 후속 개선 순서를 정합니다.</li></ol><p>화면 수, 데이터 구조, 외부 연동, 이벤트와 자동화 시나리오, 검수 범위에 따라 견적과 일정을 산정합니다. 개발비와 현랩 구축비·월 운영비, 외부 사용료를 구분해 안내합니다.</p><p><Link href="/#pricing">름랩의 공개 개발 가격</Link> · <a href="https://hyunlab.kr/pricing/" data-analytics="marketing-development-pricing">현랩의 구축·운영 가격</a> · <Link href="/source-handover/">소스코드 인수인계 기준</Link></p></section>
      <section style={{ marginTop: 48 }}><h2>자주 묻는 질문</h2>{faqs.map(([q, a]) => <details key={q} style={{ borderBottom: '1px solid #d1d5db', padding: '20px 0' }}><summary style={{ cursor: 'pointer', fontWeight: 700 }}>{q}</summary><p>{a}</p></details>)}</section>
      <section id="contact" style={{ marginTop: 64 }}><h2>현재 상황과 필요한 개발 범위를 남겨 주세요.</h2><p>현재 주소, 핵심 사용자, 유지할 기능과 목표 일정이 있으면 알려 주세요. 비밀번호와 비밀키는 입력하지 마세요.</p><LandingInquiryForm landingSlug="marketing-linked-development" defaultServiceType="웹 MVP / 홈페이지" /></section>
    </div></main><BusinessFooter />
  </>;
}
