import Link from 'next/link';
import { getSite } from '../lib/data';

export const metadata = {
  title: '름랩 REUMLAB | AI 앱 제작 · 창업 프로덕션 · 부트캠프 · VVIP 컨설팅',
  description: 'AI 어플 제작 외주, 창업 프로덕션, AI 부트캠프, VVIP 1:1 컨설팅. 기획부터 배포까지 원스톱.',
  openGraph: {
    title: '름랩 REUMLAB | AI 앱 제작 · 창업 프로덕션 · 부트캠프 · VVIP 컨설팅',
    description: 'AI 어플 제작 외주, 창업 프로덕션, AI 부트캠프, VVIP 1:1 컨설팅. 기획부터 배포까지 원스톱.',
    url: 'https://reumlab.com/',
    images: ['/og-default.png'],
  },
  alternates: { canonical: 'https://reumlab.com/' },
};

export default function HomePage() {
  const site = getSite();

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(13, 6, 18, 0.9)', backdropFilter: 'blur(12px)',
        padding: '14px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <Link href="/" className="logo">REUMLAB</Link>
        <ul className="nav-links">
          <li><Link href="/#services">서비스</Link></li>
          <li><Link href="/consultation/">상담 신청</Link></li>
          <li><Link href="/vvip/">VVIP</Link></li>
          <li><Link href="/#faq">FAQ</Link></li>
        </ul>
        <a href={site.kakao} target="_blank" rel="noopener noreferrer" className="contact-btn">문의하기</a>
      </nav>
      <section className="hero" id="top">
        <div className="hero-inner">
          <span className="hero-tag">AI 앱 · 웹 · 기획</span>
          <h1><span className="g">름랩 REUMLAB</span><br />AI 앱 제작 · 창업 프로덕션 · VVIP 컨설팅</h1>
          <p className="hero-desc">AI 어플 제작 외주, 창업 프로덕션, AI 부트캠프, VVIP 1:1 컨설팅. 기획부터 배포까지 원스톱.</p>
          <div className="hero-cta">
            <Link href="/consultation/" className="btn-primary">상담 신청</Link>
            <a href={site.kakao} target="_blank" rel="noopener noreferrer" className="btn-outline">카카오톡 상담</a>
            <Link href="/vvip/" className="btn-outline">VVIP 신청</Link>
          </div>
        </div>
      </section>
      <section id="services">
        <div className="section-inner">
          <span className="section-tag">서비스</span>
          <h2 className="section-title">키워드 랜딩 · 허브</h2>
          <p className="hero-desc" style={{ marginBottom: 24 }}>
            앱·웹·홈페이지·랜딩 제작 견적 및 지역·업종별 상담 페이지로 연결됩니다.
          </p>
          <div className="link-grid">
            <Link href="/h/app-dev/">앱 개발</Link>
            <Link href="/h/homepage-dev/">홈페이지 제작</Link>
            <Link href="/h/web-dev/">웹 개발</Link>
            <Link href="/h/landing-page/">랜딩페이지 제작</Link>
            <Link href="/h/mvp-dev/">MVP 개발</Link>
            <Link href="/l/suwon-app-dev/">수원 앱개발</Link>
            <Link href="/l/gangnam-homepage-dev/">강남 홈페이지제작</Link>
          </div>
        </div>
      </section>
      <section className="cta">
        <div className="section-inner">
          <h2><span className="g">상담 신청</span></h2>
          <p className="hero-desc">카카오톡·이메일·전화로 편하게 문의해 주세요.</p>
          <div className="cta-buttons">
            <Link href="/consultation/" className="btn-primary">상담 신청</Link>
            <a href={site.kakao} target="_blank" rel="noopener noreferrer" className="btn-outline">카카오톡</a>
            <Link href="/vvip/" className="btn-outline">VVIP</Link>
          </div>
        </div>
      </section>
      <section id="faq">
        <div className="section-inner">
          <span className="section-tag">FAQ</span>
          <h2 className="section-title">자주 묻는 질문</h2>
          <div className="faq-item">
            <div className="faq-q">개발 기간은 얼마나 걸리나요?</div>
            <div className="faq-a">프로젝트 규모에 따라 다릅니다. 소규모 랜딩은 2~4주, 앱은 2~4개월 수준으로 산정됩니다.</div>
          </div>
          <div className="faq-item">
            <div className="faq-q">견적은 어떻게 받을 수 있나요?</div>
            <div className="faq-a">카카오톡, 이메일, 전화로 요구사항을 알려주시면 기획·견적을 정리해 안내드립니다.</div>
          </div>
        </div>
      </section>
      <footer>
        <p>© 2026 {site.company} (REUMLAB). All Rights Reserved.</p>
        <div className="footer-links">
          <a href={`mailto:${site.email}`}>이메일</a>
          <a href={`tel:${site.tel}`}>전화</a>
          <a href={site.kakao} target="_blank" rel="noopener noreferrer">카카오톡</a>
        </div>
      </footer>
    </>
  );
}
