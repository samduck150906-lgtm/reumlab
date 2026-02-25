import { getSite } from '../lib/data';
import HomePage from '../components/HomePage';

export const metadata = {
  title: { absolute: '름랩 REUMLAB | AI 앱 제작 · 창업 프로덕션 · 부트캠프 · VVIP 컨설팅' },
  description: 'AI 어플 제작 외주, 창업 프로덕션, AI 부트캠프, VVIP 1:1 컨설팅. 기획부터 배포까지 원스톱.',
  openGraph: {
    title: '름랩 REUMLAB | AI 앱 제작 · 창업 프로덕션 · 부트캠프 · VVIP 컨설팅',
    description: 'AI 어플 제작 외주, 창업 프로덕션, AI 부트캠프, VVIP 1:1 컨설팅. 기획부터 배포까지 원스톱.',
    url: 'https://reumlab.com/',
    images: ['/og-default.png'],
  },
  alternates: { canonical: 'https://reumlab.com/' },
};

export default function Home() {
  const site = getSite();
  return <HomePage site={site} />;
}
