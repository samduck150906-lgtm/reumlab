import Link from 'next/link';
import { getSite } from '../../lib/data';

export const metadata = {
  title: 'VVIP 1:1 AI 컨설팅 신청 | 름랩 REUMLAB',
  description: '대표님의 사업에 맞춤 AI 전략을 설계하고 함께 실행합니다. 교육공학 석사 + 12년 교육 경력의 1:1 VVIP 컨설팅.',
  openGraph: {
    title: 'VVIP 1:1 AI 컨설팅 신청 | 름랩 REUMLAB',
    description: 'AI를 도입이 아닌 내재화하도록. 맞춤 AI 전략 설계와 핸즈온 실행을 함께합니다.',
    url: 'https://reumlab.com/vvip/',
    images: ['/og-default.png'],
  },
  alternates: { canonical: 'https://reumlab.com/vvip/' },
};

export default function VvipPage() {
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
          <li><Link href="/consultation/">상담 신청</Link></li>
          <li><Link href="/#faq">FAQ</Link></li>
        </ul>
        <a href={site.kakao} target="_blank" rel="noopener noreferrer" className="contact-btn">문의하기</a>
      </nav>
      <section className="hero">
        <div className="hero-inner">
          <span className="hero-tag">VVIP</span>
          <h1><span className="g">1:1 VVIP AI 컨설팅</span></h1>
          <p className="hero-desc">대표님의 사업에 맞춤 AI 전략을 설계하고 함께 실행합니다. 교육공학 석사 + 12년 교육 경력의 1:1 컨설팅.</p>
          <div className="hero-cta">
            <a href={site.kakao} target="_blank" rel="noopener noreferrer" className="btn-primary">VVIP 문의 (카카오톡)</a>
            <a href={`mailto:${site.email}`} className="btn-outline">이메일</a>
            <Link href="/consultation/" className="btn-outline">상담 신청</Link>
          </div>
        </div>
      </section>
      <footer>
        <p>© 2026 {site.company} (REUMLAB). All Rights Reserved.</p>
      </footer>
    </>
  );
}
