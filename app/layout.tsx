import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import './reum-sales.css';
import Nav from '../components/Nav';
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
    /*
      og:site_name 은 구조화 데이터 WebSite.name 과 같아야 한다.
      schema 는 name="름랩" · alternateName="REUMLAB" 인데 여기만 영문을 쓰고 있었고,
      정적으로 서빙되는 홈(index.html)과 목적별 랜딩 9개는 또 "REUMLAB · 름랩" 이라
      한 사이트가 사이트명 세 가지를 동시에 말하고 있었다. 한국어 검색(네이버)에서
      사이트명 인식의 1차 신호라 대표 한국어 상호로 통일한다. 영문은 alternateName 이 맡는다.
    */
    siteName: SITE.name,
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
        {/*
          전역 웹폰트 — 실제로 쓰는 것만 받는다.
          LCP 요소가 히어로 이미지가 아니라 H1 텍스트라서, 이 요청이 곧 LCP 임계 경로다.

          제외한 것
           · Outfit — app/soho/soho.css 에서만, 그것도 weight 800 하나만 쓴다.
             1,400여 페이지가 쓰지도 않는 패밀리 6 weight 를 받고 있었다 → /soho/ 로 옮김.
           · JetBrains Mono 500 — CSS 어디에서도 쓰지 않는다(.mono 계열은 400·600만).
          남긴 것
           · Plus Jakarta Sans 400~800 — 본문·제목 전반에서 5개 weight 모두 사용.
           · Noto Sans KR 400~800 — 한글 본문·제목. weight 를 줄이면 합성 볼드가 생겨 유지.
        */}
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap"
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
        {/*
          hreflang 없음 — 이 사이트는 한국어 단일 언어다.
          이전에는 여기서 모든 페이지에 `hreflang="ko" href="https://reumlab.com/"` 를 뿌렸는데,
          그러면 /app-development/ 같은 페이지가 "내 한국어 버전은 홈이다" 라고 말하는 셈이라
          1,400여 페이지에서 잘못된 신호가 나갔다. hreflang 은 자기참조 + 실제 대체 언어판이
          있을 때만 의미가 있다. 영문 title 페이지들도 lang="ko" 의 한국어 본문이라 별도
          언어판이 아니다. 실제 /en/ 같은 구조가 생기면 그때 페이지별 자기참조로 선언할 것.
        */}
      </head>
      <body>
        {/*
          사이트 전역 엔티티(WebSite + Organization + ProfessionalService)를 여기 한 곳에서만 낸다.
          하위 페이지의 Service/Article 은 이 노드들을 @id 로 참조만 하므로, 개별 페이지에서
          Organization·사업체 노드를 다시 선언하면 안 된다(중복 엔티티).
          루트로 서빙되는 홈은 정적 index.html 이라 이 레이아웃을 타지 않는다 —
          index.html 안에 같은 @id·같은 값의 그래프가 따로 들어 있다.
        */}
        <SiteEntityJsonLd />
        <Analytics />
        <AnalyticsDataLayer />
        <Nav site={site} />
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}

