import Link from 'next/link';
import { getClusters, getHubBySlug, getSite } from '../../../lib/data';
import HubPage from '../../../components/HubPage';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://reumlab.com';

export async function generateStaticParams() {
  const clusters = getClusters();
  return Object.keys(clusters).map((hubSlug) => ({ hubSlug }));
}

export async function generateMetadata({ params }) {
  const hub = getHubBySlug(params.hubSlug);
  if (!hub) return { title: '름랩 REUMLAB' };
  const title = `${hub.ko} | 름랩 REUMLAB`;
  const description = `${hub.ko} 견적·외주 - 름랩 앱·웹 개발. 키워드별 상담 페이지 모음.`;
  const url = `${BASE}/h/${params.hubSlug}/`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: ['/og-default.png'],
    },
    alternates: { canonical: url },
  };
}

export default function HubRoute({ params }) {
  const site = getSite();
  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(13, 6, 18, 0.9)', backdropFilter: 'blur(12px)',
        padding: '14px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <Link href="/" className="logo">REUMLAB</Link>
        <ul className="nav-links">
          <li><Link href="/">홈</Link></li>
          <li><Link href="/#services">서비스</Link></li>
          <li><Link href="/#faq">FAQ</Link></li>
        </ul>
        <a href={site.kakao} target="_blank" rel="noopener noreferrer" className="contact-btn">문의하기</a>
      </nav>
      <HubPage hubSlug={params.hubSlug} />
    </>
  );
}
