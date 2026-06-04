import Link from 'next/link';
import { getLandings, getLandingBySlug, getHubBySlug, getSite } from '../../../lib/data';
import LandingPage from '../../../components/LandingPage';
import { LandingServiceJsonLd } from '../../../components/JsonLd';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://reumlab.com';

export async function generateStaticParams() {
  const landings = getLandings();
  return landings.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }) {
  const landing = getLandingBySlug(params.slug);
  if (!landing) return { title: '름랩 REUMLAB' };
  const url = `${BASE}/l/${params.slug}/`;
  return {
    title: landing.title,
    description: landing.description,
    openGraph: {
      title: landing.title,
      description: landing.description,
      url,
      images: ['/og-default.png'],
    },
    alternates: { canonical: url },
  };
}

export default function LandingRoute({ params }) {
  const site = getSite();
  const landing = getLandingBySlug(params.slug);
  if (!landing) return null;

  const url = `${BASE}/l/${params.slug}/`;
  const hub = landing.hubId ? getHubBySlug(landing.hubId) : null;
  const crumbs = [
    { name: '홈', url: `${BASE}/` },
    ...(hub ? [{ name: hub.ko, url: `${BASE}/h/${landing.hubId}/` }] : []),
    { name: landing.keyword || landing.title, url },
  ];

  return (
    <>
      <LandingServiceJsonLd
        name={landing.title}
        description={landing.description}
        url={url}
        crumbs={crumbs}
      />
      <nav className="dynamic-nav">
        <div className="dynamic-nav-inner">
          <Link href="/" className="logo">REUMLAB</Link>
          <ul className="nav-links">
            <li><Link href="/">홈</Link></li>
            <li><Link href={`/h/${landing.hubId}/`}>더보기</Link></li>
            <li><Link href="/#faq">FAQ</Link></li>
          </ul>
          <a href={`tel:${String(site.tel || '').replace(/-/g, '')}`} className="contact-btn">전화 문의</a>
        </div>
      </nav>
      <LandingPage slug={params.slug} />
    </>
  );
}
