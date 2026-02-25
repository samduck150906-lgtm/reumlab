import Link from 'next/link';
import {
  getSite,
  getLandingBySlug,
  pickFaqs,
  pickReviews,
  getPricingSnippet,
} from '../lib/data';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://reumlab.com';

export default function LandingPage({ slug }) {
  const site = getSite();
  const landing = getLandingBySlug(slug);
  if (!landing) return null;
  const faqs = pickFaqs(landing.slug);
  const reviews = pickReviews(landing.slug);
  const pricingSnippet = getPricingSnippet(landing);

  return (
    <>
      <p className="breadcrumb"><Link href="/">름랩</Link> &gt; {landing.keyword}</p>
      <section className="hero">
        <div className="hero-inner">
          <span className="hero-tag">{landing.keyword}</span>
          <h1><span className="g">{landing.keyword}</span><br />견적·상담 문의</h1>
          <p className="hero-desc">{landing.description}</p>
          <div className="hero-cta">
            <a href={site.kakao} target="_blank" rel="noopener noreferrer" className="btn-primary">카카오톡 상담</a>
            <a href={`mailto:${site.email}`} className="btn-outline">이메일 문의</a>
            <a href={`tel:${site.tel.replace(/-/g, '')}`} className="btn-outline">전화 문의</a>
          </div>
        </div>
      </section>
      {pricingSnippet && (
        <section className="pricing-guide">
          <div className="section-inner">
            <span className="section-tag">가격 가이드</span>
            <h2 className="section-title">{landing.keyword} 견적 안내</h2>
            <p className="pricing-desc">{pricingSnippet} 정확한 견적은 요구사항을 알려주시면 상담 후 안내드립니다.</p>
          </div>
        </section>
      )}
      {reviews.length > 0 && (
        <section className="reviews">
          <div className="section-inner">
            <span className="section-tag">후기</span>
            <h2 className="section-title">고객 후기</h2>
            {reviews.map((r, i) => (
              <div key={i} className="review">
                <p>{r.text}</p>
                <span className="author">{r.author}</span>
              </div>
            ))}
          </div>
        </section>
      )}
      <section className="faq">
        <div className="section-inner">
          <span className="section-tag">FAQ</span>
          <h2 className="section-title">자주 묻는 질문</h2>
          {faqs.map((f, i) => (
            <article key={i} className="faq-item">
              <div className="faq-q">{f.q}</div>
              <div className="faq-a">{f.a}</div>
            </article>
          ))}
        </div>
      </section>
      <section className="cta">
        <div className="section-inner">
          <h2><span className="g">{landing.keyword}</span> 견적 문의</h2>
          <p className="hero-desc">카카오톡·이메일·전화로 편하게 문의해 주세요.</p>
          <div className="cta-buttons">
            <a href={site.kakao} target="_blank" rel="noopener noreferrer" className="btn-primary">카카오톡 상담</a>
            <a href={`mailto:${site.email}`} className="btn-outline">이메일</a>
            <a href={`tel:${site.tel.replace(/-/g, '')}`} className="btn-outline">전화</a>
          </div>
        </div>
      </section>
      <footer>
        <p>© 2026 {site.company} (REUMLAB). All Rights Reserved.</p>
        <div className="footer-links">
          <a href={`mailto:${site.email}`}>이메일</a>
          <a href={`tel:${site.tel}`}>전화</a>
          <a href={site.kakao} target="_blank" rel="noopener noreferrer">카카오톡</a>
        </div>
      </footer>
    </>
  );
}
