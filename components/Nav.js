'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://reumlab.com';

export default function Nav({ site, extraLinks = [] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = [
    { href: '/', label: '홈' },
    ...extraLinks,
    { href: '/#faq', label: 'FAQ' },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(13, 6, 18, 0.9)', backdropFilter: 'blur(12px)',
        padding: '14px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <Link href="/" className="logo">REUMLAB</Link>
        <ul className="nav-links main-nav" style={{ listStyle: 'none' }}>
          {links.map((l) => (
            <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
          ))}
        </ul>
        {site?.kakao && (
          <a href={site.kakao} target="_blank" rel="noopener noreferrer" className="contact-btn main-btn">문의하기</a>
        )}
        <button type="button" className="hamburger" onClick={() => setOpen(!open)} aria-label="메뉴">
          <span /><span /><span />
        </button>
      </nav>
    </>
  );
}
