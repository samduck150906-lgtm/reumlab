import Link from 'next/link';
import { getLandings, getLandingBySlug, getSite } from '../../../lib/data';
import LandingPage from '../../../components/LandingPage';

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
          <li><Link href={`/h/${landing.hubId}/`}>더보기</Link></li>
          <li><Link href="/#faq">FAQ</Link></li>
        </ul>
        <a href={site.kakao} target="_blank" rel="noopener noreferrer" className="contact-btn">문의하기</a>
      </nav>
      <LandingPage slug={params.slug} />
    </>
  );
}
