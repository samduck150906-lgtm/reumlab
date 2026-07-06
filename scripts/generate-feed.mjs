/**
 * RSS 2.0 피드 생성 (정적 export용) → public/feed.xml
 * 사이트맵과 동일한 URL 집합 + 제목·설명
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DOMAIN = 'https://reumlab.com';

function escapeXml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** lib/seo.ts PAGE_SEO_MAP + consultation 과 동기화 */
const STATIC_PAGES = [
  {
    url: `${DOMAIN}/`,
    title: '웹·앱 개발 전문 에이전시 | 름랩 (REUMLAB)',
    description:
      'MVP부터 기업용 ERP까지. 비즈니스 성장을 위한 커스텀 웹·앱 개발 전문 에이전시 름랩입니다.',
  },
  {
    url: `${DOMAIN}/웹개발/`,
    title: '웹 개발 & 홈페이지 제작 | 름랩 (REUMLAB)',
    description:
      '기업용 웹사이트, 고성능 랜딩페이지 제작. 최신 기술 스택 기반의 반응형 웹 개발을 제공합니다.',
  },
  {
    url: `${DOMAIN}/앱개발/`,
    title: '모바일 앱 개발 전문 | 름랩 (REUMLAB)',
    description:
      'iOS·Android 네이티브 및 하이브리드 앱 제작. 안정적인 성능과 최적의 UX를 구현합니다.',
  },
  {
    url: `${DOMAIN}/스타트업MVP/`,
    title: '스타트업 MVP 개발 외주 | 름랩 (REUMLAB)',
    description:
      '가장 빠른 시장 검증을 위한 MVP 기획 및 개발. 불필요한 비용 없이 핵심 가치를 구축합니다.',
  },
  {
    url: `${DOMAIN}/솔루션SaaS/`,
    title: 'B2B 솔루션 & SaaS 개발 | 름랩 (REUMLAB)',
    description:
      '벡터 DB·OCR 기반의 데이터 아카이빙, 업무 자동화 SaaS 구축. 확장성 높은 클라우드 아키텍처.',
  },
  {
    url: `${DOMAIN}/플랫폼개발/`,
    title: '플랫폼 및 O2O 시스템 구축 | 름랩 (REUMLAB)',
    description:
      '매칭·예약 플랫폼, O2O 서비스 전문 개발. 복잡한 비즈니스 로직을 안정적으로 구현합니다.',
  },
  {
    url: `${DOMAIN}/기업용ERP/`,
    title: '맞춤형 ERP & 인트라넷 개발 | 름랩 (REUMLAB)',
    description:
      'CRM, 사내 시스템, 관리자 웹 고도화. 기존 데이터를 통합하여 업무 효율을 혁신합니다.',
  },
  {
    url: `${DOMAIN}/consultation/`,
    title: '프로젝트 상담 신청 | 름랩 (REUMLAB)',
    description: '웹·앱 개발 상담 및 견적 문의. 름랩에 프로젝트를 맡겨 주세요.',
  },
];

function main() {
  const landingsPath = path.join(ROOT, 'content', 'landings.json');
  const clustersPath = path.join(ROOT, 'content', 'clusters.json');
  const landings = fs.existsSync(landingsPath)
    ? JSON.parse(fs.readFileSync(landingsPath, 'utf8'))
    : [];
  if (!landings.length) {
    console.warn('generate-feed: landings 비어 있음 — npm run prebuild 권장');
  }
  const clusters = fs.existsSync(clustersPath)
    ? JSON.parse(fs.readFileSync(clustersPath, 'utf8'))
    : {};

  const pubDate = new Date().toUTCString();
  const items = [];

  for (const p of STATIC_PAGES) {
    items.push({
      title: p.title,
      link: p.url,
      description: p.description,
      pubDate,
    });
  }

  for (const hubSlug of Object.keys(clusters)) {
    const hub = clusters[hubSlug];
    const ko = hub.ko || hubSlug;
    items.push({
      title: `${ko} 관련 키워드 안내 | 름랩`,
      link: `${DOMAIN}/h/${hubSlug}/`,
      description: `${ko} 비용·견적·제작 등 검색 의도별 랜딩 페이지 모음.`,
      pubDate,
    });
  }

  for (const l of landings) {
    items.push({
      title: l.title || l.keyword,
      link: `${DOMAIN}/l/${l.slug}/`,
      description: l.description || l.keyword,
      pubDate,
    });
  }

  const channelTitle = '름랩 REUMLAB';
  const channelDesc =
    '웹·앱 개발 전문 에이전시 름랩의 서비스 페이지, SEO 랜딩 갱신 피드입니다.';
  const channelLink = `${DOMAIN}/`;

  const itemXml = items
    .map(
      (it) => `    <item>
      <title>${escapeXml(it.title)}</title>
      <link>${escapeXml(it.link)}</link>
      <description>${escapeXml(it.description)}</description>
      <pubDate>${it.pubDate}</pubDate>
      <guid isPermaLink="true">${escapeXml(it.link)}</guid>
    </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${channelLink}</link>
    <description>${escapeXml(channelDesc)}</description>
    <language>ko-KR</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <atom:link href="${DOMAIN}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>REUMLAB generate-feed.mjs</generator>
${itemXml}
  </channel>
</rss>
`;

  const out = path.join(ROOT, 'public', 'feed.xml');
  fs.writeFileSync(out, xml, 'utf8');
  console.log('generate-feed: public/feed.xml (%d items)', items.length);
}

main();
