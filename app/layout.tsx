import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { getSite } from '../lib/data';
import { PAGE_SEO_MAP, SITE } from '@/lib/seo';

const home = PAGE_SEO_MAP[''];

const googleVer = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
/** ?ㅼ씠踰??쒖튂?대뱶諛붿씠? ?ъ씠???뚯쑀 ?뺤씤 */
const NAVER_SITE_VERIFICATION = 'ce34d37949725f395c5091f3180d4eb36befb0d9';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: home.title,
    template: `%s | ${SITE.name}`,
  },
  description: home.description,
  keywords: home.keywords,
  alternates: { canonical: home.canonical },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: home.canonical,
    siteName: SITE.nameEn,
    title: home.ogTitle,
    description: home.ogDescription,
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: home.ogTitle }],
  },
  twitter: {
    card: 'summary_large_image',
    title: home.ogTitle,
    description: home.ogDescription,
    images: [SITE.defaultOgImage],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    ...(googleVer ? { google: googleVer } : {}),
    other: {
      'naver-site-verification': NAVER_SITE_VERIFICATION,
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const site = getSite();
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#162b1e" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="由꾨옪 REUMLAB RSS"
          href={`${SITE.domain}/feed.xml`}
        />
      </head>
      <body>
        <Nav site={site} />
        {children}
      </body>
    </html>
  );
}

