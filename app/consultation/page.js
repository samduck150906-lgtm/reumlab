import Link from 'next/link';
import { getSite } from '../../lib/data';
import ConsultationForm from '../../components/ConsultationForm';

export const metadata = {
  title: '상담 신청 | 름랩 REUMLAB',
  description: '앱·웹 개발 상담 신청. 프로젝트 견적·일정 문의 - 름랩 REUMLAB.',
  openGraph: {
    title: '상담 신청 | 름랩 REUMLAB',
    description: '앱·웹 개발 상담 신청. 프로젝트 견적·일정 문의 - 름랩 REUMLAB.',
    url: 'https://reumlab.com/consultation/',
    images: ['/og-default.png'],
  },
  alternates: { canonical: 'https://reumlab.com/consultation/' },
};

export default function ConsultationPage() {
  const site = getSite();

  return (
    <>
      <nav className="nav scrolled">
        <div className="container">
          <div className="nav-inner">
            <Link href="/" className="nav-logo en">
              <span>REUMLAB</span>
            </Link>
            <ul className="nav-links">
              <li><Link href="/">홈</Link></li>
              <li><Link href="/#faq">FAQ</Link></li>
              <li><a href={site.kakao} target="_blank" rel="noopener noreferrer">카카오톡</a></li>
              <li><Link href="/consultation/" className="nav-cta">📋 상담 신청</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      <section className="hero" style={{ minHeight: 'auto', padding: '100px 0 48px' }}>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title" style={{ fontSize: 'clamp(26px,4vw,36px)' }}>
              <span className="gradient-text">상담 신청</span>
            </h1>
            <p className="hero-sub">
              앱·웹 개발 문의를 남겨 주시면 빠르게 연락드립니다.
            </p>
          </div>
        </div>
      </section>

      <section className="sec apply-section" id="apply" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="apply-inner" style={{ maxWidth: 720 }}>
            <ConsultationForm site={site} />
            <p className="apply-alt" style={{ marginTop: 24 }}>
              바로 상담을 원하시면 · <a href={site.kakao} target="_blank" rel="noopener noreferrer">카카오톡</a> · <a href={`mailto:${site.email}`}>이메일</a> · <a href={`tel:${site.tel.replace(/-/g, '')}`}>전화</a>
            </p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p className="footer-info">© 2026 {site.company} (REUMLAB). All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
}
