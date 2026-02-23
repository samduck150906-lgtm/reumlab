import Link from 'next/link';
import { getSite } from '../../lib/data';

export const metadata = {
  title: 'AI 전략 가능성 진단 · 상담 신청 | 름랩 REUMLAB',
  description: 'AI 도입 가능성 진단 및 맞춤 상담 신청. 앱·웹 제작, VVIP 컨설팅 문의 - 럼랩 REUMLAB.',
  openGraph: {
    title: 'AI 전략 가능성 진단 · 상담 신청 | 름랩 REUMLAB',
    description: 'AI 도입 가능성 진단 및 맞춤 상담 신청. 앱·웹 제작, VVIP 컨설팅 문의 - 럼랩 REUMLAB.',
    url: 'https://reumlab.com/consultation/',
    images: ['/og-default.png'],
  },
  alternates: { canonical: 'https://reumlab.com/consultation/' },
};

export default function ConsultationPage() {
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
          <li><Link href="/">홈</Link></li>
          <li><Link href="/vvip/">VVIP</Link></li>
          <li><Link href="/#faq">FAQ</Link></li>
        </ul>
        <a href={site.kakao} target="_blank" rel="noopener noreferrer" className="contact-btn">문의하기</a>
      </nav>
      <section className="hero">
        <div className="hero-inner">
          <h1><span className="g">상담 신청</span></h1>
          <p className="hero-desc">AI 전략 가능성 진단 및 맞춤 상담을 위해 아래 채널로 문의해 주세요.</p>
          <div className="hero-cta">
            <a href={site.kakao} target="_blank" rel="noopener noreferrer" className="btn-primary">카카오톡 상담</a>
            <a href={`mailto:${site.email}`} className="btn-outline">이메일</a>
            <a href={`tel:${site.tel.replace(/-/g, '')}`} className="btn-outline">전화</a>
          </div>
        </div>
      </section>
      <footer>
        <p>© 2026 {site.company} (REUMLAB). All Rights Reserved.</p>
      </footer>
    </>
  );
}
