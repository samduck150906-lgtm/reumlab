import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import './reum-sales.css';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { Analytics } from '../components/Analytics';
import { AnalyticsDataLayer } from '../components/AnalyticsDataLayer';
import FloatingContact from '../components/FloatingContact';
import { getSite } from '../lib/data';
import { PAGE_SEO_MAP, SITE } from '@/lib/seo';
import { SiteEntityJsonLd } from '@/components/JsonLd';

const home = PAGE_SEO_MAP[''];

const googleVer = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
/** 네이버 서치어드바이저 사이트 소유 확인 */
const NAVER_SITE_VERIFICATION = '651783cd19f26e41ad3c77876597082cd6ec823e';

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
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
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
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0f1f3a" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="름랩 REUMLAB RSS"
          href={`${SITE.domain}/feed.xml`}
        />
        <link rel="alternate" hrefLang="ko" href={SITE.domain + '/'} />
        <link rel="alternate" hrefLang="x-default" href={SITE.domain + '/'} />
      </head>
      <body>
        {/*
          사이트 전역 엔티티(WebSite + Organization + ProfessionalService)를 여기 한 곳에서만 낸다.
          하위 페이지의 Service/Article 은 이 노드들을 @id 로 참조만 하므로, 개별 페이지에서
          Organization·사업체 노드를 다시 선언하면 안 된다(중복 엔티티).
          루트로 서빙되는 홈은 정적 index.html 이라 이 레이아웃을 타지 않는다 —
          index.html 안에 같은 @id·같은 값의 그래프가 따로 들어 있다.
        */}
        <SiteEntityJsonLd description={home.description} />
        <Analytics />
        <AnalyticsDataLayer />
        <Nav site={site} />
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}

