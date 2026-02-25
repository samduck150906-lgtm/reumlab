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
    { href: '/#services', label: '서비스' },
    { href: '/#app-portfolio', label: '앱' },
    { href: '/#web-portfolio', label: '웹' },
    { href: '/#production', label: '창업 프로덕션' },
    { href: '/bootcamp/', label: '부트캠프' },
    { href: '/vvip/', label: 'VVIP 신청' },
    { href: '/#pricing', label: '가격' },
  ];

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`} id="nav">
        <div className="container">
          <div className="nav-inner">
            <Link href="/" className="nav-logo en">
              <span>REUMLAB</span>
            </Link>
            <ul className="nav-links">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/consultation/" className="nav-cta">
                  📋 상담 신청
                </Link>
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
        <Link href="/#services" onClick={closeMobile}>서비스</Link>
        <Link href="/#app-portfolio" onClick={closeMobile}>앱 포트폴리오</Link>
        <Link href="/#web-portfolio" onClick={closeMobile}>웹 포트폴리오</Link>
        <Link href="/#production" onClick={closeMobile}>창업 프로덕션</Link>
        <Link href="/bootcamp/" onClick={closeMobile}>부트캠프</Link>
        <Link href="/vvip/" onClick={closeMobile}>VVIP 신청</Link>
        <Link href="/#pricing" onClick={closeMobile}>가격</Link>
        <Link href="/consultation/" className="btn-primary" style={{ fontSize: '15px', padding: '13px 28px' }} onClick={closeMobile}>
          📋 상담 신청
        </Link>
      </div>
    </>
  );
}
