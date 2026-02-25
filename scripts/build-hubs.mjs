/**
 * clusters.json 기반으로 허브 페이지 HTML 38개 생성
 * public/h/{hubSlug}/index.html
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const contentDir = path.join(root, 'content');
const publicDir = path.join(root, 'public');

const clusters = JSON.parse(fs.readFileSync(path.join(contentDir, 'clusters.json'), 'utf8'));
const landings = JSON.parse(fs.readFileSync(path.join(contentDir, 'landings.json'), 'utf8'));
const templates = JSON.parse(fs.readFileSync(path.join(contentDir, 'templates.json'), 'utf8'));
const { site } = templates;
const BASE = site.url;
const OG_IMAGE = site.ogImage || '';
const hubBodyTemplates = templates.hubBodyTemplates || {};
const slugToKeyword = Object.fromEntries(landings.map((l) => [l.slug, l.keyword]));

function escapeHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function hubHtml(hubSlug, hub) {
  const url = `${BASE}/h/${hubSlug}/`;
  const hubLandings = (hub.landings || []).slice(0, 50);
  const bodyTemplate = hubBodyTemplates[hub.type] || hubBodyTemplates.service || '름랩은 앱·웹·기획 외주를 진행합니다. 견적·상담은 카카오톡·이메일·전화로 문의해 주세요.';
  const hubBody = bodyTemplate.replace(/\s+/g, ' ').trim();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '름랩', item: BASE + '/' },
      { '@type': 'ListItem', position: 2, name: hub.ko, item: url },
    ],
  };

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(hub.ko)} | 름랩 REUMLAB</title>
  <meta name="description" content="${escapeHtml(hub.ko)} 견적·외주 - 름랩 앱·웹 개발. 키워드별 상담 페이지 모음.">
  <meta property="og:title" content="${escapeHtml(hub.ko)} | 름랩 REUMLAB">
  <meta property="og:description" content="${escapeHtml(hub.ko)} 견적·외주 - 름랩 앱·웹 개발. 키워드별 상담 페이지 모음.">
  <meta property="og:url" content="${url}">
  ${OG_IMAGE ? `<meta property="og:image" content="${escapeHtml(OG_IMAGE)}">` : ''}
  <link rel="canonical" href="${url}">
  <meta name="theme-color" content="#1a0a1f">
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
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
      --border-subtle: rgba(168, 85, 247, 0.2);
      --radius-md: 16px;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Malgun Gothic', sans-serif; background: var(--bg-dark); color: var(--text-primary); line-height: 1.6; }
    a { text-decoration: none; color: inherit; }
    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      background: rgba(13, 6, 18, 0.9); backdrop-filter: blur(12px);
      padding: 14px 5%; display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid var(--border-subtle);
    }
    .logo { font-size: 1.25rem; font-weight: 700; background: var(--gradient-main); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .nav-links { display: flex; gap: 20px; list-style: none; }
    .nav-links a { color: var(--text-secondary); font-size: 0.9rem; }
    .contact-btn { padding: 10px 20px; background: var(--gradient-main); color: #fff; border-radius: 25px; font-weight: 600; }
    .hero { padding: 100px 5% 48px; }
    .hero-inner { max-width: 800px; margin: 0 auto; }
    .hero h1 { font-size: clamp(1.5rem, 4vw, 2rem); margin-bottom: 12px; }
    .hero h1 .g { background: var(--gradient-main); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .hero p { color: var(--text-secondary); }
    .hub-body-text { color: var(--text-secondary); line-height: 1.9; max-width: 720px; }
    section { padding: 32px 5%; }
    .section-inner { max-width: 800px; margin: 0 auto; }
    .section-title { font-size: 1.25rem; margin-bottom: 20px; }
    .link-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
    .link-grid a {
      display: block; padding: 14px 18px; background: var(--bg-card);
      border-radius: var(--radius-md); border: 1px solid var(--border-subtle);
      color: var(--text-secondary); font-size: 0.95rem;
    }
    .link-grid a:hover { border-color: var(--accent-cyan); color: var(--accent-cyan); }
    .cta { text-align: center; padding: 48px 5%; }
    .btn-primary { padding: 14px 28px; background: var(--gradient-main); color: #fff; border-radius: 28px; font-weight: 600; display: inline-block; margin: 8px; }
    footer { background: var(--bg-elevated); padding: 24px 5%; border-top: 1px solid var(--border-subtle); text-align: center; }
    footer p { font-size: 0.85rem; color: var(--text-muted); }
    .breadcrumb { padding: 80px 5% 0; font-size: 0.9rem; color: var(--text-muted); }
    .breadcrumb a { color: var(--accent-cyan); }
  </style>
</head>
<body>
  <nav>
    <a href="${BASE}/" class="logo">REUMLAB</a>
    <ul class="nav-links">
      <li><a href="${BASE}/">홈</a></li>
      <li><a href="${BASE}/#services">서비스</a></li>
      <li><a href="${BASE}/#faq">FAQ</a></li>
    </ul>
    <a href="${site.kakao}" target="_blank" rel="noopener noreferrer" class="contact-btn">문의하기</a>
  </nav>
  <p class="breadcrumb"><a href="${BASE}/">름랩</a> &gt; ${escapeHtml(hub.ko)}</p>
  <section class="hero">
    <div class="hero-inner">
      <h1><span class="g">${escapeHtml(hub.ko)}</span></h1>
      <p>관련 키워드 랜딩에서 견적·상담을 받아 보세요.</p>
    </div>
  </section>
  <section>
    <div class="section-inner">
      <h2 class="section-title">관련 페이지</h2>
      <div class="link-grid">
        ${hubLandings.map((slug) => `<a href="${BASE}/l/${slug}/">${escapeHtml(slugToKeyword[slug] || slug)}</a>`).join('')}
      </div>
    </div>
  </section>
  <section class="cta">
    <a href="${site.kakao}" target="_blank" rel="noopener noreferrer" class="btn-primary">카카오톡 상담</a>
    <a href="${BASE}/">메인으로</a>
  </section>
  <footer>
    <p>© 2026 ${site.company} (REUMLAB). All Rights Reserved.</p>
  </footer>
</body>
</html>`;
}

function main() {
  const outBase = path.join(publicDir, 'h');
  if (!fs.existsSync(outBase)) fs.mkdirSync(outBase, { recursive: true });

  let count = 0;
  for (const [hubSlug, hub] of Object.entries(clusters)) {
    const dir = path.join(outBase, hubSlug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), hubHtml(hubSlug, hub), 'utf8');
    count++;
  }
  console.log('Built hub pages:', count);
}

main();
