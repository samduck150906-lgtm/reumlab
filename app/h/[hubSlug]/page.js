import Link from 'next/link';
import { getClusters, getHubBySlug, getSite } from '../../../lib/data';
import HubPage from '../../../components/HubPage';
import { LandingServiceJsonLd } from '../../../components/JsonLd';

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
  const hub = getHubBySlug(params.hubSlug);
  const url = `${BASE}/h/${params.hubSlug}/`;
  return (
    <>
      {hub ? (
        <LandingServiceJsonLd
          name={`${hub.ko} | 름랩 REUMLAB`}
          description={`${hub.ko} 견적·외주 - 름랩 앱·웹 개발 전문. 키워드별 상담 페이지 모음.`}
          url={url}
          crumbs={[
            { name: '홈', url: `${BASE}/` },
            { name: hub.ko, url },
          ]}
        />
      ) : null}
      <nav className="dynamic-nav">
        <div className="dynamic-nav-inner">
          <Link href="/" className="logo">REUMLAB</Link>
          <ul className="nav-links">
            <li><Link href="/">홈</Link></li>
            <li><Link href="/#services">서비스</Link></li>
            <li><Link href="/#faq">FAQ</Link></li>
          </ul>
          <a href={`tel:${String(site.tel || '').replace(/-/g, '')}`} className="contact-btn">전화 문의</a>
        </div>
      </nav>
      <HubPage hubSlug={params.hubSlug} />
    </>
  );
}
