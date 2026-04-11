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
    { href: '/#solution', label: '특징' },
    { href: '/#process', label: '진행' },
    { href: '/#pricing', label: '패키지' },
    { href: '/#prepare', label: '준비' },
    { href: '/portfolio/', label: '포트폴리오' },
    { href: '/#faq', label: 'FAQ' },
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
        <Link href="/#solution" onClick={closeMobile}>특징</Link>
        <Link href="/#process" onClick={closeMobile}>진행 절차</Link>
        <Link href="/#pricing" onClick={closeMobile}>패키지</Link>
        <Link href="/#prepare" onClick={closeMobile}>준비사항</Link>
        <Link href="/portfolio/" onClick={closeMobile}>포트폴리오</Link>
        <Link href="/#faq" onClick={closeMobile}>FAQ</Link>
        <Link href="/consultation/" className="btn-primary" style={{ fontSize: '15px', padding: '13px 28px' }} onClick={closeMobile}>
          📋 상담 신청
        </Link>
      </div>
    </>
  );
}
