import './globals.css';

export const metadata = {
  metadataBase: new URL('https://reumlab.com'),
  title: { default: '름랩 REUMLAB | AI 앱 제작 · 창업 프로덕션 · 부트캠프 · VVIP 컨설팅', template: '%s | 럼랩 REUMLAB' },
  description: 'AI 어플 제작 외주, 창업 프로덕션, AI 부트캠프, VVIP 1:1 컨설팅. 기획부터 배포까지 원스톱.',
  openGraph: { type: 'website', url: 'https://reumlab.com/', images: ['/og-default.png'] },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
