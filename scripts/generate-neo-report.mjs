/** Generate a public, static-build NEO inventory without publishing console metrics. */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { attribute, htmlSignals, parseCsv, PRODUCTION_ORIGIN, toCsv } from './neo-lib.mjs';
import { readSitemapLocs } from './read-sitemap.mjs';

const OUT = 'out';
if (!existsSync(OUT)) throw new Error('out/이 없습니다. 먼저 npm run build를 실행하세요.');
const generatedAt = new Date().toISOString();
const outputDir = 'docs/neo';
mkdirSync(outputDir, { recursive: true });

function walk(directory, results = []) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) walk(path, results);
    else results.push(path);
  }
  return results;
}

function pathForHtml(file) {
  const rel = relative(OUT, file).replaceAll('\\', '/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
}

function pageType(pathname) {
  if (pathname === '/') return 'home';
  if (pathname === '/404.html') return '404';
  if (/^\/(?:naver|google)[^/]*\.html$/i.test(pathname) || pathname === '/__forms.html') return 'system';
  if (pathname.startsWith('/guide/')) return 'guide';
  if (pathname.startsWith('/blog/')) return 'blog';
  if (pathname.startsWith('/portfolio/')) return 'portfolio';
  if (/^\/(?:app-development|web-development|mvp|flutter|ai-development)\/[^/]+\/$/.test(pathname)) return 'region_service';
  if (pathname.startsWith('/l/')) return 'campaign';
  return 'service_or_hub';
}

function metaContent(html, name) {
  const tag = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0])
    .find((candidate) => attribute(candidate, 'name').toLowerCase() === name.toLowerCase());
  return tag ? attribute(tag, 'content') : '';
}

function normalizeInternal(href) {
  try {
    const parsed = new URL(href, PRODUCTION_ORIGIN);
    if (parsed.origin !== PRODUCTION_ORIGIN) return '';
    return parsed.pathname;
  } catch { return ''; }
}

const sitemap = new Set(readSitemapLocs(OUT));
const feed = existsSync(join(OUT, 'feed.xml')) ? readFileSync(join(OUT, 'feed.xml'), 'utf8') : '';
const rss = new Set([...feed.matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>[\s\S]*?<\/item>/g)].map((match) => match[1]));
const scorecard = existsSync('docs/geo/CONTENT_SCORECARD.csv')
  ? new Map(parseCsv(readFileSync('docs/geo/CONTENT_SCORECARD.csv', 'utf8')).map((row) => [row.url, row]))
  : new Map();

const documents = walk(OUT).filter((file) => file.endsWith('.html')).map((file) => {
  const pathname = pathForHtml(file);
  const html = readFileSync(file, 'utf8');
  const signals = htmlSignals(html);
  const canonical = signals.canonical;
  const noindex = /noindex/i.test(signals.robots);
  const links = [...html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)]
    .map((match) => normalizeInternal(match[1])).filter(Boolean);
  const types = new Set();
  for (const match of html.matchAll(/"@type"\s*:\s*(?:"([^"]+)"|\[([^\]]+)\])/g)) {
    if (match[1]) types.add(match[1]);
    else for (const nested of match[2].matchAll(/"([^"]+)"/g)) types.add(nested[1]);
  }
  const url = canonical || `${PRODUCTION_ORIGIN}${pathname}`;
  const type = pageType(pathname);
  const statusCode = type === '404' ? 404 : 200;
  let decision = 'REVIEW';
  let reason = 'system or non-canonical document; manual review';
  if (type === '404') { decision = '404'; reason = 'custom not-found document'; }
  else if (noindex) { decision = 'NOINDEX'; reason = 'robots noindex in initial HTML'; }
  else if (canonical && sitemap.has(canonical)) { decision = 'INDEX'; reason = 'self-canonical, indexable and present in sitemap'; }
  const score = scorecard.get(canonical);
  return { file, pathname, html, links, canonical, noindex, type, statusCode, decision, reason, score, signals, schemaTypes: [...types].sort(), url };
});

const byPath = new Map(documents.map((document) => [document.pathname, document]));
const depths = new Map([['/', 0]]);
const queue = ['/'];
while (queue.length) {
  const current = queue.shift();
  const document = byPath.get(current);
  if (!document) continue;
  for (const target of new Set(document.links)) {
    if (!byPath.has(target) || depths.has(target)) continue;
    depths.set(target, depths.get(current) + 1);
    queue.push(target);
  }
}

const headers = ['url', 'status_code', 'canonical', 'robots', 'indexable', 'in_sitemap', 'in_rss', 'title', 'description', 'h1', 'schema_types', 'internal_link_count', 'click_depth', 'page_type', 'primary_intent', 'naver_priority', 'decision', 'reason', 'verification_status'];
const inventory = documents.map((document) => ({
  url: document.url,
  status_code: document.statusCode,
  canonical: document.canonical,
  robots: document.signals.robots,
  indexable: document.decision === 'INDEX' ? 'yes' : 'no',
  in_sitemap: sitemap.has(document.canonical) ? 'yes' : 'no',
  in_rss: rss.has(document.canonical) ? 'yes' : 'no',
  title: document.signals.title,
  description: metaContent(document.html, 'description'),
  h1: document.signals.h1,
  schema_types: document.schemaTypes.join('|'),
  internal_link_count: new Set(document.links).size,
  click_depth: depths.has(document.pathname) ? depths.get(document.pathname) : '',
  page_type: document.type,
  primary_intent: document.score?.primary_intent ?? document.type,
  naver_priority: document.pathname === '/' || ['service_or_hub', 'home'].includes(document.type) ? 'P1' : ['guide', 'portfolio', 'blog'].includes(document.type) ? 'P2' : 'P3',
  decision: document.decision,
  reason: document.reason,
  verification_status: 'TESTED_LOCAL_BUILD',
}));
writeFileSync(join(outputDir, 'url-inventory.csv'), toCsv(headers, inventory), 'utf8');

const decisionCounts = Object.fromEntries(['INDEX', 'NOINDEX', 'REVIEW', '404'].map((decision) => [decision, inventory.filter((row) => row.decision === decision).length]));
const robots = readFileSync(join(OUT, 'robots.txt'), 'utf8');
const feedBytes = Buffer.byteLength(feed);
const feedHostMismatches = [...rss].filter((url) => {
  try { return new URL(url).origin !== PRODUCTION_ORIGIN; } catch { return true; }
}).length;
const key = '67cc4ff3436125d6a5eb18de9bb63dd0';
const keyPath = join(OUT, `${key}.txt`);
const root = documents.find((document) => document.pathname === '/');
const redirects = readFileSync('public/_redirects', 'utf8').split(/\r?\n/)
  .filter((line) => {
    const trimmed = line.trim();
    return trimmed && !trimmed.startsWith('#') && trimmed.split(/\s+/).length >= 2;
  });

const privateFiles = [join('docs', 'seo-aeo', 'private'), join('docs', 'neo', 'private')]
  .filter(existsSync).flatMap((directory) => walk(directory));
const naverExports = privateFiles.filter((file) => /naver-\d{4}-\d{2}-\d{2}-90d\.csv$/i.test(file));
const latestNaverExport = naverExports.sort().at(-1) ?? '';
const httpSnapshotPath = join('docs', 'neo', 'private', 'http-latest.json');
let httpSnapshot = null;
if (existsSync(httpSnapshotPath)) {
  try { httpSnapshot = JSON.parse(readFileSync(httpSnapshotPath, 'utf8')); }
  catch { httpSnapshot = { failures: ['invalid JSON'], results: [] }; }
}

const external = [
  ['Search Advisor 사이트 등록', 'BLOCKED_EXTERNAL_ACCOUNT', '로그인된 콘솔에서 직접 확인 필요'],
  ['소유확인', 'IMPLEMENTED', '초기 HTML meta와 발급 HTML 파일 존재; 콘솔 승인 상태는 별도 확인'],
  ['사이트맵 제출·처리', 'BLOCKED_EXTERNAL_ACCOUNT', '코드 산출물 검증과 콘솔 처리 상태는 다름'],
  ['RSS 제출·처리', 'BLOCKED_EXTERNAL_ACCOUNT', '코드 산출물 검증과 콘솔 처리 상태는 다름'],
  ['사이트명 반영', 'UNVERIFIED', 'og:site_name/WebSite/Organization은 일치하나 검색결과 반영은 미확인'],
  ['수집 요청', 'NOT_RUN', '자동 반복 요청하지 않음'],
  ['IndexNow 외부 수신', 'UNVERIFIED', '정적 구성/dry-run과 검색엔진 수신·색인은 별개'],
  ['네이버 플레이스 NAP', 'BLOCKED_EXTERNAL_ACCOUNT', '외부 프로필 최종 공개값 직접 확인 필요'],
  ['네이버 블로그 프로필', 'UNVERIFIED', '공식 링크는 코드에 있으나 프로필 필드는 직접 확인 필요'],
  ['Search Advisor 90일 export', latestNaverExport ? 'UNVERIFIED' : 'BLOCKED_EXTERNAL_ACCOUNT', latestNaverExport ? 'private 후보 파일 감지; 공개 보고서에 원수치 미포함' : 'export 파일 미제공'],
];

const audit = {
  generatedAt,
  source: 'local static build',
  documents: documents.length,
  sitemapUrls: sitemap.size,
  decisions: decisionCounts,
  redirectRules: redirects.length,
  robots: { yetiGroup: /User-Agent:\s*Yeti/i.test(robots), sitemapDeclaration: /^Sitemap:\s*\S+/im.test(robots) },
  rss: { bytes: feedBytes, items: rss.size, hostMismatches: feedHostMismatches },
  ownership: { rootMeta: /name=["']naver-site-verification["']/i.test(root?.html ?? ''), htmlFile: documents.some((document) => /^\/naver[0-9a-f]+\.html$/i.test(document.pathname)) },
  indexNow: { keyFile: existsSync(keyPath), keyMatches: existsSync(keyPath) && readFileSync(keyPath, 'utf8').trim() === key },
  http: httpSnapshot ? {
    status: httpSnapshot.failures?.length ? 'FAILED' : 'TESTED',
    origin: httpSnapshot.origin,
    testedAt: httpSnapshot.generatedAt,
    targets: httpSnapshot.results?.length ?? 0,
    failures: httpSnapshot.failures?.length ?? 0,
  } : { status: 'NOT_RUN', targets: 0, failures: 0 },
  external: external.map(([item, status, note]) => ({ item, status, note })),
};
writeFileSync(join(outputDir, 'latest-audit.json'), JSON.stringify(audit, null, 2) + '\n', 'utf8');
writeFileSync(join(outputDir, 'latest-audit.md'), `# 름랩 NEO 감사\n\n기준 시각: ${generatedAt}\n\n## 코드·빌드 기준선\n\n- HTML 문서: ${documents.length}개\n- INDEX: ${decisionCounts.INDEX}개 / NOINDEX: ${decisionCounts.NOINDEX}개 / REVIEW: ${decisionCounts.REVIEW}개 / 404: ${decisionCounts['404']}개\n- 사이트맵 URL: ${sitemap.size}개\n- 301 규칙: ${redirects.length}개\n- robots Yeti 그룹: ${audit.robots.yetiGroup ? 'TESTED' : 'FAILED'}\n- RSS: ${rss.size}개 item, ${(feedBytes / 1024).toFixed(1)} KiB, production host 불일치 ${feedHostMismatches}개\n- 네이버 소유확인 코드: meta ${audit.ownership.rootMeta ? 'IMPLEMENTED' : 'MISSING'}, HTML 파일 ${audit.ownership.htmlFile ? 'IMPLEMENTED' : 'MISSING'}\n- IndexNow 키 산출물: ${audit.indexNow.keyFile && audit.indexNow.keyMatches ? 'TESTED' : 'FAILED'}\n- 운영 HTTP/Yeti 비교: ${audit.http.status}${audit.http.testedAt ? ` (${audit.http.targets}개 대상, ${audit.http.failures}개 실패, ${audit.http.testedAt})` : ''}\n- URL별 근거: [url-inventory.csv](./url-inventory.csv)\n\n## 네이버 외부 작업\n\n| 항목 | 상태 | 근거·다음 확인 |\n|---|---|---|\n${external.map(([item, status, note]) => `| ${item} | ${status} | ${note} |`).join('\n')}\n\n코드의 IMPLEMENTED/TESTED와 네이버 콘솔의 처리·색인 상태를 같은 것으로 기록하지 않습니다. 사이트맵·RSS·IndexNow는 발견 및 변경 알림 수단이며 색인이나 노출을 보장하지 않습니다.\n`, 'utf8');
console.log(`NEO report: ${documents.length} HTML, ${sitemap.size} sitemap URLs, ${rss.size} RSS items`);
