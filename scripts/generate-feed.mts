/**
 * RSS 2.0 피드 생성 (정적 export용) → public/feed.xml → out/feed.xml
 *
 * 무엇을 담나
 *  발행일이 실제로 있는 콘텐츠(블로그·가이드·비교)만 최신순으로 담는다.
 *  RSS 는 "새 글 알림" 채널이다 — 네이버 서치어드바이저의 RSS 제출도 신규 콘텐츠 발견용이고,
 *  서비스·랜딩 페이지의 전수 목록은 sitemap.xml 이 이미 담당한다.
 *
 * 왜 다시 썼나 (이전 버전의 문제)
 *  하드코딩된 STATIC_PAGES 가 2026-07 개편 전에 멈춰 있었고, 랜딩·허브를 색인 게이트 없이
 *  전부 넣어 373개 항목 중 244개가 noindex, 20개가 301 되는 URL 이었다. 정작 블로그·가이드는
 *  한 편도 없었다. 이 피드는 app/layout.tsx 에서 전 페이지 <head> 에 rel="alternate" 로
 *  선언되므로, 죽은 URL 목록을 크롤러에 계속 알리는 역방향 신호였다.
 *
 * 원칙
 *  - URL 은 sitemap.ts 와 "같은 색인 게이트"를 통과한 것만 넣는다(단일 판정, 모순 없음).
 *  - canonical 헬퍼가 만든 URL 을 그대로 쓴다(도메인·trailing slash 자동 일치).
 *  - 날짜는 콘텐츠의 실제 publishedAt 을 쓴다. 빌드 시각을 넣지 않는다.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SITE } from '../lib/seo';
import { BLOG_POSTS, blogCanonical, blogShouldIndex } from '../lib/blog-posts';
import { GUIDES, guideCanonical, guideDecision } from '../lib/guides';
import { COMPARES, compareCanonical, compareDecision } from '../lib/compare';

const DOMAIN = SITE.domain;

/** 피드 최대 항목 수 — RSS 는 최신 콘텐츠 알림 채널이므로 전수 목록이 아니다 */
const MAX_ITEMS = 100;

function escapeXml(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

interface FeedItem {
  title: string;
  link: string;
  description: string;
  publishedAt: string;
}

const items: FeedItem[] = [];

for (const b of BLOG_POSTS) {
  if (!blogShouldIndex(b.slug)) continue; // 얇은·중복 글 제외 (sitemap 과 동일 판정)
  items.push({
    title: b.title,
    link: blogCanonical(b.slug),
    description: b.description,
    publishedAt: b.publishedAt,
  });
}

for (const g of GUIDES) {
  if (!guideDecision(g.slug)?.inSitemap) continue;
  items.push({
    title: g.title,
    link: guideCanonical(g.slug),
    description: g.description,
    publishedAt: g.publishedAt,
  });
}

for (const c of COMPARES) {
  if (!compareDecision(c.slug)?.inSitemap) continue;
  items.push({
    title: c.title,
    link: compareCanonical(c.slug),
    description: c.description,
    publishedAt: c.publishedAt,
  });
}

// 최신순 + URL 중복 제거(같은 URL 이 두 축에 잡히는 경우 방어)
items.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
const seen = new Set<string>();
const feedItems = items.filter((it) => (seen.has(it.link) ? false : (seen.add(it.link), true))).slice(0, MAX_ITEMS);

// lastBuildDate 는 "피드에서 가장 최근 글"의 날짜. 빌드 시각을 쓰면 내용이 그대로여도
// 매 배포마다 갱신된 것처럼 보여 리더·크롤러에 잘못된 프레시 신호를 준다.
const latest = feedItems.length ? new Date(feedItems[0].publishedAt) : new Date(0);

const itemXml = feedItems
  .map(
    (it) => `    <item>
      <title>${escapeXml(it.title)}</title>
      <link>${escapeXml(it.link)}</link>
      <description>${escapeXml(it.description)}</description>
      <pubDate>${new Date(it.publishedAt).toUTCString()}</pubDate>
      <guid isPermaLink="true">${escapeXml(it.link)}</guid>
    </item>`,
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${SITE.name} ${SITE.nameEn} 블로그·가이드`)}</title>
    <link>${DOMAIN}/blog/</link>
    <description>${escapeXml('앱개발 비용·MVP·Flutter·홈페이지 제작 등 비전공 대표를 위한 실무 칼럼과 가이드.')}</description>
    <language>ko-KR</language>
    <lastBuildDate>${latest.toUTCString()}</lastBuildDate>
    <atom:link href="${DOMAIN}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>REUMLAB generate-feed.mts</generator>
${itemXml}
  </channel>
</rss>
`;

writeFileSync(join('public', 'feed.xml'), xml, 'utf8');
console.log(
  `✓ feed.xml generated: ${feedItems.length} items (블로그 ${BLOG_POSTS.filter((b) => blogShouldIndex(b.slug)).length} · 가이드 ${GUIDES.filter((g) => guideDecision(g.slug)?.inSitemap).length} · 비교 ${COMPARES.filter((c) => compareDecision(c.slug)?.inSitemap).length}) → public/feed.xml`,
);
