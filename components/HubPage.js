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
    <div className="dynamic-page">
      <p className="breadcrumb"><Link href="/">름랩</Link> &gt; {hub.ko}</p>
      <section className="hero">
        <div className="hero-inner">
          <h1><span className="g">{hub.ko}</span></h1>
          <p className="hero-desc">
            {bodyText || '관련 키워드 랜딩에서 견적·상담을 받아 보세요.'}
          </p>
        </div>
      </section>
      <section className="sec sec-warm">
        <div className="section-inner">
          <span className="section-tag">키워드별 상담</span>
          <h2 className="section-title">{hub.ko} 관련 견적·상담 페이지</h2>
          <div className="link-grid">
            {landings.map((slug) => (
              <Link key={slug} href={`/l/${slug}/`}>{getKeywordBySlug(slug)}</Link>
            ))}
          </div>
        </div>
      </section>
      <section className="cta">
        <div className="section-inner">
          <h2>{hub.ko} 견적 문의</h2>
          <p className="hero-desc">전화·이메일로 편하게 상담받아 보세요.</p>
          <div className="cta-buttons">
            <a href={`tel:${String(site.tel || '').replace(/-/g, '')}`} className="btn-primary">{site.tel} 전화 상담</a>
            <a href={`mailto:${site.email}`} className="btn-outline">이메일 문의</a>
          </div>
        </div>
      </section>
      <footer>
        <p>© 2026 {site.company} (REUMLAB). All Rights Reserved.</p>
        <div className="footer-links">
          <a href={`mailto:${site.email}`}>이메일</a>
          <a href={`tel:${String(site.tel || '').replace(/-/g, '')}`}>전화</a>
        </div>
      </footer>
    </div>
  );
}
