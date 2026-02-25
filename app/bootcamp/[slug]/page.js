import '../bootcamp.css';
import { getSite } from '../../../lib/data';
import BootcampLanding from '../BootcampLanding';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://reumlab.com';

export function generateStaticParams() {
  return [{ slug: 'ai-app' }];
}

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const url = `${BASE}/bootcamp/${slug}/`;
  return {
    title: { absolute: 'AI 앱 부트캠프 | 름랩 REUMLAB' },
    description: '문과 학점 2.8, 코딩 1도 모르는 비전공자가 AI만으로 대기업 경력직 서류 합격. 4주 만에 나만의 앱을 완성하는 소수정예 그룹과외. 1기 모집중.',
    openGraph: {
      title: 'AI 앱 부트캠프 | 름랩 REUMLAB',
      description: '코딩 몰라도 4주만에 내 앱 완성. 대표가 직접 진행하는 소수정예 온라인 그룹과외.',
      url,
      images: ['/og-default.png'],
    },
    alternates: { canonical: url },
  };
}

export default function BootcampPage({ params }) {
  const site = getSite();
  return <BootcampLanding kakaoUrl={site?.kakao} />;
}
