'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Nav({ site }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const navLinks = [
    { href: '/#solution', label: '특징', a: 'nav_solution' },
    { href: '/#work', label: '사례', a: 'nav_work' },
    { href: '/#pricing', label: '패키지', a: 'nav_pricing' },
    { href: '/portfolio/', label: '포트폴리오', a: 'nav_portfolio' },
    { href: '/blog/', label: '블로그', a: 'nav_blog' },
    { href: '/#faq', label: 'FAQ', a: 'nav_faq' },
  ];

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`} id="nav">
        <div className="container">
          <div className="nav-inner">
            <Link href="/" className="nav-logo en" aria-label="REUMLAB 홈">
              <img src="/logo.png" alt="" width="28" height="28" className="nav-logo-mark" />
              <span>REUMLAB</span>
            </Link>
            <ul className="nav-links">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} data-analytics={l.a}>{l.label}</Link>
                </li>
              ))}
              <li>
                <a href="tel:01081119370" className="nav-cta" data-analytics="nav_cta_call">
                  📞 전화 상담
                </a>
              </li>
            </ul>
            <button
              type="button"
              className="hamburger"
              onClick={() => setMobileOpen(true)}
              aria-label="메뉴"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`} id="mobileMenu">
        <button
          type="button"
          className="mobile-close"
          onClick={closeMobile}
          aria-label="닫기"
        >
          ✕
        </button>
        <Link href="/#solution" onClick={closeMobile} data-analytics="nav_m_solution">특징</Link>
        <Link href="/#work" onClick={closeMobile} data-analytics="nav_m_work">진행 사례</Link>
        <Link href="/#pricing" onClick={closeMobile} data-analytics="nav_m_pricing">패키지</Link>
        <Link href="/#prepare" onClick={closeMobile} data-analytics="nav_m_prepare">준비사항</Link>
        <Link href="/blog/" onClick={closeMobile} data-analytics="nav_m_blog">블로그</Link>
        <Link href="/#faq" onClick={closeMobile} data-analytics="nav_m_faq">FAQ</Link>
        <Link href="/portfolio/" onClick={closeMobile} data-analytics="nav_m_portfolio">포트폴리오</Link>
        <Link href="/mvp/" onClick={closeMobile} data-analytics="nav_m_mvp">앱 MVP 개발</Link>
        <Link href="/flutter/" onClick={closeMobile} data-analytics="nav_m_flutter">Flutter 앱개발</Link>
        <Link href="/ai-development/" onClick={closeMobile} data-analytics="nav_m_ai">AI 외주개발</Link>
        <Link href="/source-handover/" onClick={closeMobile} data-analytics="nav_m_handover">소스코드 이관</Link>
        <a href="tel:01081119370" className="btn-primary" style={{ fontSize: '15px', padding: '13px 28px' }} onClick={closeMobile} data-analytics="nav_m_cta_call">
          📞 전화 상담
        </a>
      </div>
    </>
  );
}
