import './globals.css';
import Nav from '../components/Nav';
import { getSite } from '../lib/data';

export const metadata = {
  metadataBase: new URL('https://reumlab.com'),
  title: { default: '름랩 REUMLAB | AI 앱 제작 · 창업 프로덕션 · 부트캠프 · VVIP 컨설팅', template: '%s | 럼랩 REUMLAB' },
  description: 'AI 어플 제작 외주, 창업 프로덕션, AI 부트캠프, VVIP 1:1 컨설팅. 기획부터 배포까지 원스톱.',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://reumlab.com/',
    siteName: '름랩 REUMLAB',
    images: [{ url: 'https://reumlab.com/og-default.png', width: 1200, height: 630, alt: '름랩 REUMLAB' }],
  },
};

export default function RootLayout({ children }) {
  const site = getSite();
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#162b1e" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      <body>
        <Nav site={site} />
        {children}
      </body>
    </html>
  );
}
