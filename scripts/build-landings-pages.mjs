/**
 * landings.json + templates.json 기반으로 랜딩 HTML 328개 생성
 * public/l/{slug}/index.html
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const contentDir = path.join(root, 'content');
const publicDir = path.join(root, 'public');

const landings = JSON.parse(fs.readFileSync(path.join(contentDir, 'landings.json'), 'utf8'));
const templates = JSON.parse(fs.readFileSync(path.join(contentDir, 'templates.json'), 'utf8'));
const clusters = JSON.parse(fs.readFileSync(path.join(contentDir, 'clusters.json'), 'utf8'));
const { site } = templates;
const faqPool = templates.faqPool || [];
const reviewPool = templates.reviewPool || [];
const portfolioPool = templates.portfolioPool || [];
const pricingSnippets = templates.pricingSnippets || {};
const BASE = site.url;
const OG_IMAGE = site.ogImage || '';
const ANALYTICS = site.analytics || {};
const NAVER_VERIFY = site.naverSiteVerification || '';

// serviceKey → pricingSnippets 키 (앱/웹/기획)
const SERVICE_TO_PRICING_KEY = {
  'app-dev': 'app', 'mobile-app': 'app', 'app-dev-out': 'app',
  'homepage-dev': 'web', 'web-dev': 'web', 'landing-page': 'web', 'website-dev': 'web',
  'responsive-web': 'web', 'web-dev-simple': 'web', 'shopping-mall': 'web',
  'service-plan': 'plan', 'mvp-dev': 'plan',
};
function getPricingSnippet(landing) {
  const key = landing.serviceKey && SERVICE_TO_PRICING_KEY[landing.serviceKey];
  return key && pricingSnippets[key] ? pricingSnippets[key] : null;
}

// slug 기반 결정적 인덱스 (빌드 시마다 동일)
function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pickFaqs(slug, n = 4) {
  const h = hash(slug);
  const indices = [];
  for (let i = 0; i < n; i++) indices.push((h + i * 7) % faqPool.length);
  return [...new Set(indices)].slice(0, n).map((i) => faqPool[i]).filter(Boolean);
}

function pickReviews(slug, n = 3) {
  const h = hash(slug + 'r');
  const indices = [];
  for (let i = 0; i < n; i++) indices.push((h + i * 11) % reviewPool.length);
  return [...new Set(indices)].slice(0, n).map((i) => reviewPool[i]).filter(Boolean);
}

function pickPortfolios(landing, n = 3) {
  if (!portfolioPool.length) return [];
  const serviceType = landing.serviceKey && SERVICE_TO_PRICING_KEY[landing.serviceKey] || null;
  const hub = clusters[landing.hubId];
  const industry = hub && hub.type === 'industry' ? landing.hubId : null;
  let pool = portfolioPool.filter((p) => p.serviceType === serviceType);
  if (industry && pool.length > 0) {
    const byIndustry = pool.filter((p) => p.industry === industry || !p.industry);
    if (byIndustry.length > 0) pool = byIndustry;
  }
  if (pool.length === 0) pool = portfolioPool.filter((p) => p.serviceType === serviceType || !p.serviceType);
  if (pool.length === 0) pool = portfolioPool;
  const h = hash(landing.slug + 'p');
  const indices = [];
  for (let i = 0; i < n; i++) indices.push((h + i * 13) % pool.length);
  return [...new Set(indices)].slice(0, n).map((i) => pool[i]).filter(Boolean);
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function landingHtml(landing) {
  const url = `${BASE}/l/${landing.slug}/`;
  const faqs = pickFaqs(landing.slug);
  const reviews = pickReviews(landing.slug);
  const portfolios = pickPortfolios(landing, 3);
  const pricingSnippet = getPricingSnippet(landing);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.name,
    description: landing.description,
    url: url,
    areaServed: 'KR',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: site.tel,
      email: site.email,
      contactType: 'customer service',
      availableLanguage: 'Korean',
    },
  };
  if (pricingSnippet) {
    jsonLd.priceRange = '견적 문의';
    jsonLd.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: landing.keyword,
      itemListElement: [{ '@type': 'Offer', description: pricingSnippet }],
    };
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '름랩', item: BASE + '/' },
      { '@type': 'ListItem', position: 2, name: landing.keyword, item: url },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(landing.title)}</title>
  <meta name="description" content="${escapeHtml(landing.description)}">
  <meta property="og:title" content="${escapeHtml(landing.title)}">
  <meta property="og:description" content="${escapeHtml(landing.description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  ${OG_IMAGE ? `<meta property="og:image" content="${escapeHtml(OG_IMAGE)}">` : ''}
  <meta name="theme-color" content="#1a0a1f">
  <link rel="canonical" href="${url}">
  ${NAVER_VERIFY ? `<meta name="naver-site-verification" content="${escapeHtml(NAVER_VERIFY)}">` : ''}
  <link rel="preconnect" href="https://www.googletagmanager.com">
  <link rel="preconnect" href="https://pf.kakao.com">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
  <style>
    :root {
      --bg-dark: #0d0612;
      --bg-card: #15101a;
      --bg-elevated: #1a0a1f;
      --text-primary: #f0e6f5;
      --text-secondary: #b8a4c4;
      --text-muted: #7a6b85;
      --accent-purple: #a855f7;
      --accent-cyan: #06b6d4;
      --accent-pink: #ec4899;
      --gradient-main: linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-cyan) 50%, var(--accent-pink) 100%);
      --gradient-bg: linear-gradient(180deg, #0d0612 0%, #15101a 40%, #1a0a1f 100%);
      --border-subtle: rgba(168, 85, 247, 0.2);
      --radius-md: 16px;
      --transition: 0.3s ease;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Malgun Gothic', sans-serif; background: var(--bg-dark); color: var(--text-primary); line-height: 1.6; overflow-x: hidden; padding-left: env(safe-area-inset-left); padding-right: env(safe-area-inset-right); }
    a { text-decoration: none; color: inherit; }
    a, button { -webkit-tap-highlight-color: rgba(168, 85, 247, 0.2); }
    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      background: rgba(13, 6, 18, 0.9); backdrop-filter: blur(12px);
      padding: 14px 5%; padding-top: calc(14px + env(safe-area-inset-top));
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid var(--border-subtle);
    }
    .logo { font-size: 1.25rem; font-weight: 700; background: var(--gradient-main); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .nav-links { display: flex; gap: 20px; list-style: none; }
    .nav-links a { color: var(--text-secondary); font-size: 0.9rem; }
    .nav-links a:hover { color: var(--accent-cyan); }
    .contact-btn { padding: 10px 20px; min-height: 44px; display: inline-flex; align-items: center; justify-content: center; background: var(--gradient-main); color: #fff; border-radius: 25px; font-size: 0.875rem; font-weight: 600; }
    .hamburger { display: none; flex-direction: column; gap: 6px; background: none; border: none; cursor: pointer; padding: 8px; min-width: 44px; min-height: 44px; align-items: center; justify-content: center; }
    .hamburger span { width: 24px; height: 2px; background: var(--text-primary); border-radius: 2px; transition: var(--transition); }
    .hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .hamburger.active span:nth-child(2) { opacity: 0; }
    .hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
    .nav-drawer { position: fixed; top: 0; right: -100%; width: 100%; max-width: 320px; height: 100vh; background: var(--bg-elevated); z-index: 99; padding: 80px 24px 24px; padding-top: calc(80px + env(safe-area-inset-top)); transition: right 0.35s ease; border-left: 1px solid var(--border-subtle); }
    .nav-drawer.open { right: 0; }
    .nav-drawer .nav-links { flex-direction: column; gap: 0; }
    .nav-drawer .nav-links a { display: block; padding: 14px 0; font-size: 1rem; border-bottom: 1px solid var(--border-subtle); }
    .nav-drawer .contact-btn { margin-top: 20px; width: 100%; text-align: center; }
    .drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 98; opacity: 0; visibility: hidden; transition: var(--transition); }
    .drawer-overlay.open { opacity: 1; visibility: visible; }
    .hero {
      min-height: 60vh; display: flex; align-items: center; padding: 100px 5% 60px;
      background: var(--gradient-bg); position: relative;
    }
    .hero-inner { max-width: 800px; margin: 0 auto; }
    .hero-tag { display: inline-block; padding: 8px 16px; background: rgba(168, 85, 247, 0.2); border-radius: 20px; font-size: 0.875rem; color: var(--accent-cyan); margin-bottom: 16px; }
    .hero h1 { font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 800; margin-bottom: 16px; }
    .hero h1 .g { background: var(--gradient-main); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .hero-desc { color: var(--text-secondary); margin-bottom: 28px; }
    .hero-cta { display: flex; gap: 12px; flex-wrap: wrap; }
    .btn-primary { padding: 14px 28px; min-height: 48px; display: inline-flex; align-items: center; justify-content: center; background: var(--gradient-main); color: #fff; border-radius: 28px; font-weight: 600; border: none; cursor: pointer; font-size: 1rem; }
    .btn-outline { padding: 14px 28px; min-height: 48px; display: inline-flex; align-items: center; justify-content: center; background: transparent; color: var(--accent-cyan); border: 2px solid var(--accent-cyan); border-radius: 28px; font-weight: 600; font-size: 1rem; }
    section { padding: 48px 5%; }
    .section-inner { max-width: 800px; margin: 0 auto; }
    .section-tag { display: inline-block; padding: 6px 14px; background: rgba(168, 85, 247, 0.2); border-radius: 15px; font-size: 0.75rem; color: var(--accent-cyan); margin-bottom: 12px; }
    .section-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 24px; }
    .pricing-desc { color: var(--text-secondary); line-height: 1.8; }
    .faq-item { border-bottom: 1px solid var(--border-subtle); padding: 16px 0; }
    .faq-item summary { list-style: none; }
    .faq-item summary::-webkit-details-marker { display: none; }
    .faq-q { font-weight: 600; cursor: pointer; }
    .faq-a { color: var(--text-secondary); font-size: 0.95rem; padding-top: 10px; }
    .review { background: var(--bg-card); border-radius: var(--radius-md); padding: 20px; margin-bottom: 12px; border: 1px solid var(--border-subtle); }
    .review p { color: var(--text-secondary); margin-bottom: 8px; }
    .review .author { font-size: 0.85rem; color: var(--text-muted); }
    .portfolio-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
    .portfolio-card { background: var(--bg-card); border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-subtle); }
    .portfolio-image { aspect-ratio: 16/9; background: var(--bg-elevated); display: flex; align-items: center; justify-content: center; }
    .portfolio-image img { width: 100%; height: 100%; object-fit: cover; }
    .portfolio-placeholder { font-size: 0.85rem; color: var(--text-muted); }
    .portfolio-title { font-size: 1rem; font-weight: 600; padding: 14px 16px 0; margin-bottom: 6px; }
    .portfolio-desc { font-size: 0.9rem; color: var(--text-secondary); padding: 0 16px 16px; line-height: 1.5; }
    .cta { text-align: center; padding: 60px 5%; background: linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%); }
    .cta h2 { font-size: clamp(1.25rem, 4vw, 1.5rem); margin-bottom: 12px; }
    .cta .g { background: var(--gradient-main); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .cta-buttons { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-top: 20px; }
    footer { background: var(--bg-elevated); padding: 24px 5%; padding-bottom: calc(24px + env(safe-area-inset-bottom)); border-top: 1px solid var(--border-subtle); text-align: center; }
    footer p { font-size: 0.85rem; color: var(--text-muted); }
    .footer-links { margin-top: 8px; display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; }
    .footer-links a { color: var(--text-secondary); font-size: 0.9rem; padding: 8px 12px; }
    .breadcrumb { padding: 80px 5% 0; font-size: 0.9rem; color: var(--text-muted); }
    .breadcrumb a { color: var(--accent-cyan); }
    @media (max-width: 768px) {
      .nav-links:not(.drawer-links) { display: none; }
      .contact-btn:not(.drawer-btn) { display: none; }
      .hamburger { display: flex; }
      section { padding: 40px 5%; }
      .hero { padding: 88px 5% 48px; min-height: 50vh; }
    }
    @media (max-width: 480px) {
      .hero { padding: 88px 16px 40px; padding-bottom: calc(40px + env(safe-area-inset-bottom)); }
      .hero-cta { flex-direction: column; }
      .hero-cta .btn-primary, .hero-cta .btn-outline { width: 100%; text-align: center; }
      .breadcrumb { padding: 72px 16px 0; font-size: 0.85rem; }
      .cta-buttons { flex-direction: column; }
      .cta-buttons .btn-primary, .cta-buttons .btn-outline { width: 100%; text-align: center; }
      section { padding-left: 16px; padding-right: 16px; }
    }
  </style>
</head>
<body>
  <nav>
    <a href="${BASE}/" class="logo">REUMLAB</a>
    <ul class="nav-links">
      <li><a href="${BASE}/">홈</a></li>
      <li><a href="${BASE}/h/${landing.hubId}/">더보기</a></li>
      <li><a href="${BASE}/#faq">FAQ</a></li>
    </ul>
    <a href="${site.kakao}" target="_blank" rel="noopener noreferrer" class="contact-btn" data-cta="kakao">문의하기</a>
    <button class="hamburger" id="hamburger" type="button" aria-label="메뉴 열기"><span></span><span></span><span></span></button>
  </nav>
  <div class="drawer-overlay" id="drawerOverlay"></div>
  <aside class="nav-drawer" id="navDrawer">
    <ul class="nav-links drawer-links">
      <li><a href="${BASE}/">홈</a></li>
      <li><a href="${BASE}/h/${landing.hubId}/">더보기</a></li>
      <li><a href="${BASE}/#faq">FAQ</a></li>
    </ul>
    <a href="${site.kakao}" target="_blank" rel="noopener noreferrer" class="contact-btn drawer-btn" data-cta="kakao">문의하기</a>
  </aside>
  <p class="breadcrumb"><a href="${BASE}/">름랩</a> &gt; ${escapeHtml(landing.keyword)}</p>
  <section class="hero">
    <div class="hero-inner">
      <span class="hero-tag">${escapeHtml(landing.keyword)}</span>
      <h1><span class="g">${escapeHtml(landing.keyword)}</span><br>견적·상담 문의</h1>
      <p class="hero-desc">${escapeHtml(landing.description)}</p>
      <div class="hero-cta">
        <a href="${site.kakao}" target="_blank" rel="noopener noreferrer" class="btn-primary" data-cta="kakao">카카오톡 상담</a>
        <a href="mailto:${site.email}" class="btn-outline" data-cta="email">이메일 문의</a>
        <a href="tel:${site.tel.replace(/-/g, '')}" class="btn-outline" data-cta="tel">전화 문의</a>
      </div>
    </div>
  </section>
  ${pricingSnippet ? `
  <section class="pricing-guide">
    <div class="section-inner">
      <span class="section-tag">가격 가이드</span>
      <h2 class="section-title">${escapeHtml(landing.keyword)} 견적 안내</h2>
      <p class="pricing-desc">${escapeHtml(pricingSnippet)} 정확한 견적은 요구사항을 알려주시면 상담 후 안내드립니다.</p>
    </div>
  </section>
  ` : ''}
  ${reviews.length ? `
  <section class="reviews">
    <div class="section-inner">
      <span class="section-tag">후기</span>
      <h2 class="section-title">고객 후기</h2>
      ${reviews.map((r) => `<div class="review"><p>${escapeHtml(r.text)}</p><span class="author">${escapeHtml(r.author)}</span></div>`).join('')}
    </div>
  </section>
  ` : ''}
  <section class="faq">
    <div class="section-inner">
      <span class="section-tag">FAQ</span>
      <h2 class="section-title">자주 묻는 질문</h2>
      ${faqs.map((f) => `<article class="faq-item"><div class="faq-q">${escapeHtml(f.q)}</div><div class="faq-a">${escapeHtml(f.a)}</div></article>`).join('')}
    </div>
  </section>
  <section class="cta">
    <div class="section-inner">
      <h2><span class="g">${escapeHtml(landing.keyword)}</span> 견적 문의</h2>
      <p class="hero-desc">카카오톡·이메일·전화로 편하게 문의해 주세요.</p>
      <div class="cta-buttons">
        <a href="${site.kakao}" target="_blank" rel="noopener noreferrer" class="btn-primary" data-cta="kakao">카카오톡 상담</a>
        <a href="mailto:${site.email}" class="btn-outline" data-cta="email">이메일</a>
        <a href="tel:${site.tel.replace(/-/g, '')}" class="btn-outline" data-cta="tel">전화</a>
      </div>
    </div>
  </section>
  <footer>
    <p>© 2026 ${site.company} (REUMLAB). All Rights Reserved.</p>
    <div class="footer-links">
      <a href="mailto:${site.email}">이메일</a>
      <a href="tel:${site.tel}">전화</a>
      <a href="${site.kakao}" target="_blank" rel="noopener noreferrer">카카오톡</a>
    </div>
  </footer>
  <script>
    (function(){
      var h=document.getElementById('hamburger'), d=document.getElementById('navDrawer'), o=document.getElementById('drawerOverlay');
      function openDrawer(){ d.classList.add('open'); o.classList.add('open'); h.classList.add('active'); document.body.style.overflow='hidden'; }
      function closeDrawer(){ d.classList.remove('open'); o.classList.remove('open'); h.classList.remove('active'); document.body.style.overflow=''; }
      h.addEventListener('click',function(){ d.classList.contains('open') ? closeDrawer() : openDrawer(); });
      o.addEventListener('click',closeDrawer);
      d.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',closeDrawer); });
    })();
  </script>
  ${ANALYTICS.gtm ? `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${escapeHtml(ANALYTICS.gtm)}');</script><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${escapeHtml(ANALYTICS.gtm)}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>` : ''}
  ${ANALYTICS.ga4 ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${escapeHtml(ANALYTICS.ga4)}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${escapeHtml(ANALYTICS.ga4)}');document.querySelectorAll('[data-cta]').forEach(function(el){el.addEventListener('click',function(){gtag('event','cta_click',{cta:this.getAttribute('data-cta'),page:location.pathname});});});</script>` : ''}
</body>
</html>`;
}

function main() {
  const outBase = path.join(publicDir, 'l');
  if (!fs.existsSync(outBase)) fs.mkdirSync(outBase, { recursive: true });

  for (const landing of landings) {
    const dir = path.join(outBase, landing.slug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), landingHtml(landing), 'utf8');
  }
  console.log('Built landing pages:', landings.length);
}

main();
