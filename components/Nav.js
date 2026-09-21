'use client';

import Link from '@/components/SiteLink';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import serviceMenu from '../content/service-menu.json';

// 정적 HTML 로 덮어써지는 경로 판단과 prefetch 정책은 components/SiteLink 가 맡는다.
// 예전에는 여기서 별도 Set 을 들고 prefetch 를 켜고 껐는데, Next 라우트 쪽 메뉴 항목은
// prefetch 가 켜져 있어 메뉴가 닫혀 있는데도 모든 페이지가 서비스 메뉴 4곳의
// RSC 페이로드 327KB 를 미리 받고 있었다.

export default function Nav({ site }) {
  const pathname = usePathname();
  const isEnternal = pathname === '/enternal-ai' || pathname?.startsWith('/enternal-ai/');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);

  useEffect(() => {
    // 이 Nav 는 모든 Next 페이지에 들어간다.
    //  · passive: true — 리스너가 preventDefault 를 부르지 않음을 브라우저에 알려
    //    스크롤 처리가 메인 스레드를 기다리지 않게 한다.
    //  · setScrolled 는 값이 실제로 바뀔 때만 — 스크롤 프레임마다 리렌더를 유발하지 않는다.
    let last = window.scrollY > 60;
    setScrolled(last);
    const onScroll = () => {
      const next = window.scrollY > 60;
      if (next !== last) {
        last = next;
        setScrolled(next);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const navLinks = [
    { href: '/#solution', label: '특징', a: 'nav_solution' },
    { href: '/#pricing', label: '패키지', a: 'nav_pricing' },
    // 실제 구축 사례는 문의 직전 판단 근거라, 블로그보다 앞에 둔다.
    { href: '/portfolio/', label: '개발 사례', a: 'nav_portfolio' },
    { href: '/blog/', label: '블로그', a: 'nav_blog' },
    { href: '/#faq', label: 'FAQ', a: 'nav_faq' },
  ];

  return (
    <>
      <nav className={`nav ${isEnternal ? 'enternal-nav' : ''} ${scrolled ? 'scrolled' : ''}`} id="nav">
        <div className="container">
          <div className="nav-inner">
            <div className="nav-brand-group">
              <Link href="/" className="nav-logo en" aria-label="REUMLAB 홈">
                <img src="/logo.png" alt="" width="28" height="28" className="nav-logo-mark" />
                <span>REUMLAB</span>
              </Link>
              {isEnternal && (
                <>
                  <span className="nav-brand-divider" aria-hidden="true" />
                  <Link href="/enternal-ai/" className="nav-enternal-wordmark" aria-label="Enternal AI 홈">
                    <img
                      src="/enternal-ai/enternal-ai-wordmark.png"
                      alt="Enternal AI"
                      width="432"
                      height="144"
                    />
                  </Link>
                </>
              )}
            </div>
            <ul className="nav-links">
              <li className={`next-service-menu ${serviceOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="next-service-menu__button"
                  aria-expanded={serviceOpen}
                  aria-haspopup="true"
                  onClick={() => setServiceOpen((value) => !value)}
                >
                  서비스 <span aria-hidden="true">⌄</span>
                </button>
                <div className="next-service-menu__panel" role="menu">
                  {serviceMenu.items.map((item) => (
                    <Link key={item.slug} href={`/${item.slug}/`} role="menuitem" onClick={() => setServiceOpen(false)}>
                      <b>{item.label}</b>
                      <span>{item.short}</span>
                    </Link>
                  ))}
                </div>
              </li>
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
              aria-expanded={mobileOpen}
              aria-controls="mobileMenu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`mobile-menu ${mobileOpen ? 'open' : ''}`}
        id="mobileMenu"
        role="dialog"
        aria-modal="true"
        aria-label="전체 메뉴"
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className="mobile-close"
          onClick={closeMobile}
          aria-label="닫기"
        >
          ✕
        </button>
        <details className="mobile-service-menu">
          <summary>서비스</summary>
          <div>
            {serviceMenu.items.map((item) => (
              <Link key={item.slug} href={`/${item.slug}/`} onClick={closeMobile}>{item.label}</Link>
            ))}
          </div>
        </details>
        <Link href="/#solution" onClick={closeMobile} data-analytics="nav_m_solution">특징</Link>
        <Link href="/#pricing" onClick={closeMobile} data-analytics="nav_m_pricing">패키지</Link>
        <Link href="/#prepare" onClick={closeMobile} data-analytics="nav_m_prepare">준비사항</Link>
        <Link href="/portfolio/" onClick={closeMobile} data-analytics="nav_m_portfolio">개발 사례</Link>
        <Link href="/blog/" onClick={closeMobile} data-analytics="nav_m_blog">블로그</Link>
        <Link href="/#faq" onClick={closeMobile} data-analytics="nav_m_faq">FAQ</Link>
        <a href="tel:01081119370" className="btn-primary" style={{ fontSize: '15px', padding: '13px 28px' }} onClick={closeMobile} data-analytics="nav_m_cta_call">
          📞 전화 상담
        </a>
      </div>
    </>
  );
}
