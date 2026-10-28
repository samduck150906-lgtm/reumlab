import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import Nav from '../components/Nav';
import { Analytics } from '../components/Analytics';
import { AnalyticsDataLayer } from '../components/AnalyticsDataLayer';
import FloatingContact from '../components/FloatingContact';
import { getSite } from '../lib/data';
import { PAGE_SEO_MAP, SITE } from '@/lib/seo';
import { SiteEntityJsonLd } from '@/components/JsonLd';
import { TOSS_BANNER_ID, TOSS_BANNER_SCRIPT } from '@/lib/toss-banner.mjs';

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
        {/* Pretendard is self-hosted with font-display: swap; no remote font dependency. */}
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
          사이트 전역 엔티티(WebSite + Organization + LocalBusiness)를 여기 한 곳에서만 낸다.
          하위 페이지의 Service/Article 은 이 노드들을 @id 로 참조만 하므로, 개별 페이지에서
          Organization·사업체 노드를 다시 선언하면 안 된다(중복 엔티티).
          루트로 서빙되는 홈은 정적 index.html 이라 이 레이아웃을 타지 않는다 —
          index.html 안에 같은 @id·같은 값의 그래프가 따로 들어 있다.
        */}
        <SiteEntityJsonLd />
        <Analytics />
        <AnalyticsDataLayer />
        <Nav site={site} />
        {/*
          토스페이먼츠 협력사 띠배너 — 헤더 바로 아래. 원문 HTML 에는 빈 자리표시자와 인라인 스크립트뿐이고,
          스크립트가 첫 페인트 전에 채운다(본문·SEO 무변경, CLS 없음). <Nav> 뒤에 있어야 헤더 높이를 잴 수 있다.
          dangerouslySetInnerHTML 을 빈 값으로 두어 React 가 채워진 자식을 하이드레이션하지 않게 한다.
          lib/toss-banner.mjs 참고.
        */}
        <div id={TOSS_BANNER_ID} data-nosnippet="" dangerouslySetInnerHTML={{ __html: '' }} />
        <script dangerouslySetInnerHTML={{ __html: TOSS_BANNER_SCRIPT }} />
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}

