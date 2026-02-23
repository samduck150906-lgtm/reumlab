import Link from 'next/link';
import { getSite, getHubBySlug, getHubBodyTemplate, getKeywordBySlug } from '../lib/data';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://reumlab.com';

export default function HubPage({ hubSlug }) {
  const site = getSite();
  const hub = getHubBySlug(hubSlug);
  if (!hub) return null;
  const bodyText = getHubBodyTemplate(hub);
  const landings = (hub.landings || []).slice(0, 50);

  return (
    <>
      <p className="breadcrumb"><Link href="/">럼랩</Link> &gt; {hub.ko}</p>
      <section className="hero">
        <div className="hero-inner">
          <h1><span className="g">{hub.ko}</span></h1>
          <p className="hero-desc">관련 키워드 랜딩에서 견적·상담을 받아 보세요.</p>
        </div>
      </section>
      <section>
        <div className="section-inner">
          <h2 className="section-title">관련 페이지</h2>
          <div className="link-grid">
            {landings.map((slug) => (
              <Link key={slug} href={`/l/${slug}/`}>{getKeywordBySlug(slug)}</Link>
            ))}
          </div>
        </div>
      </section>
      <section className="cta">
        <a href={site.kakao} target="_blank" rel="noopener noreferrer" className="btn-primary">카카오톡 상담</a>
        <Link href="/" className="btn-outline" style={{ marginLeft: 8 }}>메인으로</Link>
      </section>
      <footer>
        <p>© 2026 {site.company} (REUMLAB). All Rights Reserved.</p>
      </footer>
    </>
  );
}
