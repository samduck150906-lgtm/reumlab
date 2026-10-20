/** Generate RSS from the complete rendered article after static export. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { parse } from 'node-html-parser';
import { SITE } from '../lib/seo';
import { BLOG_POSTS, blogCanonical, blogShouldIndex } from '../lib/blog-posts';
import { GUIDES, guideCanonical, guideDecision } from '../lib/guides';
import { COMPARES, compareCanonical, compareDecision } from '../lib/compare';
import { articleForFeed, escapeXml, cdata, validContentDate } from './lib/feed-content.mjs';

const items = [
  ...BLOG_POSTS.filter(b => blogShouldIndex(b.slug)).map(b => ({ ...b, link: blogCanonical(b.slug) })),
  ...GUIDES.filter(g => guideDecision(g.slug)?.inSitemap).map(g => ({ ...g, link: guideCanonical(g.slug) })),
  ...COMPARES.filter(c => compareDecision(c.slug)?.inSitemap).map(c => ({ ...c, link: compareCanonical(c.slug) })),
].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.link.localeCompare(b.link));
const seen = new Set<string>();
const reports: object[] = [];
const dates: Date[] = [];
const itemXml = items.filter(it => {
  if (seen.has(it.link)) throw new Error(`Duplicate feed URL: ${it.link}`);
  seen.add(it.link);
  return true;
}).slice(0, 100).map(it => {
  const published = validContentDate(it.publishedAt);
  const modified = validContentDate('updatedAt' in it && it.updatedAt ? it.updatedAt : it.publishedAt);
  if (modified < published) throw new Error(`Modification predates publication: ${it.link}`);
  dates.push(modified);
  const path = join('out', decodeURIComponent(new URL(it.link).pathname), 'index.html');
  const page = parse(readFileSync(path, 'utf8'));
  if (page.querySelector('link[rel="canonical"]')?.getAttribute('href') !== it.link) throw new Error(`Feed canonical mismatch: ${it.link}`);
  if (page.querySelectorAll('meta[name="robots"]').some(m => /noindex/i.test(m.getAttribute('content') || ''))) throw new Error(`Feed contains noindex URL: ${it.link}`);
  const html = articleForFeed(page, it.link);
  reports.push({ url: it.link, source: path, publishedAt: it.publishedAt, updatedAt: modified.toISOString().slice(0, 10), articleCharacters: parse(html).textContent.length, articleBytes: Buffer.byteLength(html), articleSha256: createHash('sha256').update(html).digest('hex'), fullBody: true, canonicalMatch: true, absoluteLinks: true });
  return `    <item>
      <title>${escapeXml(it.title)}</title>
      <link>${escapeXml(it.link)}</link>
      <description>${cdata(html)}</description>
      <content:encoded>${cdata(html)}</content:encoded>
      <pubDate>${published.toUTCString()}</pubDate>
      <guid isPermaLink="true">${escapeXml(it.link)}</guid>
    </item>`;
}).join('\n');
if (!reports.length) throw new Error('RSS requires at least one published article');
const latest = new Date(Math.max(...dates.map(d => d.getTime())));
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(`${SITE.name} ${SITE.nameEn} 블로그·가이드`)}</title>
    <link>${SITE.domain}/blog/</link>
    <description>${escapeXml('앱개발 비용·MVP·Flutter·홈페이지 제작 등 비전공 대표를 위한 실무 칼럼과 가이드.')}</description>
    <language>ko-KR</language>
    <lastBuildDate>${latest.toUTCString()}</lastBuildDate>
    <atom:link href="${SITE.domain}/feed.xml" rel="self" type="application/rss+xml"/>
${itemXml}
  </channel>
</rss>
`;
const bytes = Buffer.byteLength(xml);
if (bytes >= 10_000_000) throw new Error(`RSS exceeds Naver under-10MB limit: ${bytes}`);
for (const directory of ['public', 'out']) writeFileSync(join(directory, 'feed.xml'), xml, 'utf8');
mkdirSync('docs/execution-20261020', { recursive: true });
writeFileSync('docs/execution-20261020/feed-verification.json', JSON.stringify({
  checkedAt: new Date().toISOString(), sourceGuidance: 'https://searchadvisor.naver.com/guide/request-feed',
  items: reports.length, bytes, limitBytesExclusive: 10_000_000,
  generation: 'Complete rendered article; scripts/styles removed; URLs absolute; dates from content, never build time.',
  xmlParserValidation: 'Run scripts/verify-feed.ps1 after generation.', articles: reports,
}, null, 2) + '\n');
console.log(`✓ RSS: ${reports.length} complete articles · ${bytes} bytes · public/feed.xml + out/feed.xml`);
