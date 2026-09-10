/**
 * 빌드 산출물 기반 GEO/SEO URL 인벤토리와 반복 가능한 기준 리포트 생성.
 * 사람의 사업 판단이 필요한 항목은 점수로 단정하지 않고 review 경고로 남긴다.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { readSitemapXml } from './read-sitemap.mjs';

const OUT = process.argv[2] || 'out';
const DOCS = process.argv[3] || 'docs/geo';
const ORIGIN = 'https://reumlab.com';
if (!existsSync(OUT)) {
  console.error('out/이 없습니다. 먼저 npm run build를 실행하세요.');
  process.exit(1);
}
mkdirSync(DOCS, { recursive: true });

const decode = (text = '') => text
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
const strip = (html) => decode(html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
const pick = (html, re) => decode((html.match(re) || [, ''])[1]).trim();
const csv = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
const writeCsv = (file, headers, rows) => {
  writeFileSync(join(DOCS, file), [headers.map(csv).join(','), ...rows.map((row) => headers.map((h) => csv(row[h])).join(','))].join('\n') + '\n');
};
const normalizePath = (path) => {
  if (!path) return '/';
  const clean = path.split(/[?#]/)[0].replace(/\\/g, '/');
  if (/\.[a-z0-9]{2,5}$/i.test(clean)) return clean;
  return clean === '/' ? '/' : clean.replace(/\/+$/, '') + '/';
};
const routeType = (path) => {
  if (path === '/') return 'home';
  if (/^\/(privacy|terms|refund)\//.test(path)) return 'legal';
  if (/^\/portfolio\/[\w-]+\//.test(path)) return 'case';
  if (path === '/portfolio/') return 'case_hub';
  if (/^\/guide\/[\w-]+\//.test(path)) return 'guide';
  if (path === '/guide/') return 'guide_hub';
  if (/^\/blog\/[\w-]+\//.test(path)) return 'blog';
  if (path === '/blog/') return 'blog_hub';
  if (/^\/compare\//.test(path)) return 'comparison';
  if (/^\/l\//.test(path)) return 'legacy_landing';
  if (/^\/h\//.test(path)) return 'keyword_hub';
  if (/^\/cost\/[\w-]+\//.test(path)) return 'industry_cost';
  if (/^\/(app|website|solution)\/[\w-]+\//.test(path)) return 'industry_service';
  if (/^\/system\/[\w-]+\//.test(path)) return 'system_service';
  if (/^\/(app-development|web-development|mvp|flutter-development|ai-development)\/[\w-]+\//.test(path)) return 'region_service';
  return 'service_or_hub';
};
const sourceFor = (type) => ({
  home: 'index.html', case: 'content/portfolio.json', case_hub: 'content/portfolio.json',
  guide: 'lib/guides.ts', guide_hub: 'lib/guides.ts', blog: 'lib/blog-posts.ts', blog_hub: 'lib/blog-posts.ts',
  comparison: 'lib/compare.ts', legacy_landing: 'content/landings.json', keyword_hub: 'content/clusters.json',
  industry_cost: 'lib/cost.ts', industry_service: 'lib/industries.ts|lib/website-industries.ts|lib/solution.ts',
  system_service: 'lib/systems.ts', region_service: 'lib/pseo.ts|lib/region-service.ts', legal: 'public/',
}[type] || 'lib/seo.ts|route component');

const sitemapXml = readSitemapXml(OUT);
const sitemap = new Set([...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
const feed = existsSync(join(OUT, 'feed.xml')) ? readFileSync(join(OUT, 'feed.xml'), 'utf8') : '';
const feedUrls = new Set([...feed.matchAll(/<link>(https:\/\/reumlab\.com[^<]+)<\/link>/g)].map((m) => m[1]));

const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path);
    else if (entry.endsWith('.html')) files.push(path);
  }
})(OUT);

const pages = [];
for (const file of files) {
  const rel = relative(OUT, file).replace(/\\/g, '/');
  if (/^(404\.html|__forms\.html|google[^/]*\.html|naver[^/]*\.html)$/.test(rel)) continue;
  const path = normalizePath('/' + rel.replace(/index\.html$/, ''));
  const html = readFileSync(file, 'utf8');
  const body = (html.match(/<body[\s\S]*<\/body>/i) || [html])[0];
  const text = strip(body);
  const canonical = pick(html, /<link rel="canonical" href="([^"]*)"/i);
  const schemaTypes = [...new Set([...html.matchAll(/"@type":\s*"([^"]+)"/g)].map((m) => m[1]))].sort();
  const links = [...body.matchAll(/<a\b[^>]*\shref="([^"]+)"/gi)].map((m) => m[1]);
  const internal = links.map((href) => {
    try { const url = new URL(href, ORIGIN); return url.origin === ORIGIN ? normalizePath(decodeURIComponent(url.pathname)) : ''; }
    catch { return ''; }
  }).filter(Boolean);
  const type = routeType(path);
  pages.push({
    path, url: ORIGIN + path, file, html, text, canonical,
    title: pick(html, /<title>([\s\S]*?)<\/title>/i),
    description: pick(html, /<meta name="description" content="([^"]*)"/i),
    h1: strip(pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i)),
    language: pick(html, /<html[^>]*lang="([^"]*)"/i), type,
    noindex: /<meta name="robots" content="[^"]*noindex/i.test(html),
    published: pick(html, /"datePublished":\s*"([^"]+)"/),
    modified: pick(html, /"dateModified":\s*"([^"]+)"/),
    schemaTypes, internal: [...new Set(internal)],
    hash: createHash('sha256').update(text.toLowerCase().replace(/\s+/g, '')).digest('hex'),
  });
}

const inbound = new Map();
for (const page of pages) for (const target of page.internal) inbound.set(target, (inbound.get(target) || 0) + 1);
const titleGroups = new Map(), h1Groups = new Map(), bodyGroups = new Map();
for (const page of pages.filter((p) => !p.noindex)) {
  for (const [map, value] of [[titleGroups, page.title], [h1Groups, page.h1], [bodyGroups, page.hash]]) {
    if (!value) continue;
    map.set(value, [...(map.get(value) || []), page.path]);
  }
}
const duplicatePaths = new Set();
for (const map of [titleGroups, h1Groups, bodyGroups]) for (const group of map.values()) if (group.length > 1) group.forEach((path) => duplicatePaths.add(path));

const inventory = pages.map((page) => {
  const entityConflict = /인계동\s*(본사|사무실|사업장)/.test(page.text) ? 'yes' : 'no';
  const duplicate = duplicatePaths.has(page.path) ? 'yes' : 'no';
  const indexable = !page.noindex;
  return {
    url: page.url, route_type: page.type, http_status: 200, redirect_target: '', indexable: indexable ? 'yes' : 'no',
    canonical: page.canonical, title: page.title, description: page.description, h1: page.h1, language: page.language,
    template: page.type, content_source: sourceFor(page.type), approximate_visible_text_length: page.text.length,
    date_published: page.published, date_modified: page.modified, schema_types: page.schemaTypes.join('|'),
    internal_inlinks: inbound.get(page.path) || 0, internal_outlinks: page.internal.length,
    sitemap_included: sitemap.has(page.url) ? 'yes' : 'no', rss_included: feedUrls.has(page.url) ? 'yes' : 'no',
    intent_cluster: page.type, possible_duplicate: duplicate, entity_conflict: entityConflict,
    recommended_action: entityConflict === 'yes' ? 'fix entity conflict' : duplicate === 'yes' ? 'manual consolidation review' : indexable ? 'retain canonical' : 'retain noindex; consolidate if equivalent redirect exists',
  };
});

const redirectRows = [];
const expandedRedirectRows = [];
const redirectsFile = join(OUT, '_redirects');
if (existsSync(redirectsFile)) {
  for (const line of readFileSync(redirectsFile, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [from, to, status = '301'] = trimmed.split(/\s+/);
    if (!from || !to) continue;
    redirectRows.push({ from, to, status });
    inventory.push({
      url: ORIGIN + from, route_type: 'redirect', http_status: status.replace('!', ''), redirect_target: to,
      indexable: 'no', canonical: '', title: '', description: '', h1: '', language: '', template: '_redirects',
      content_source: 'public/_redirects', approximate_visible_text_length: 0, date_published: '', date_modified: '',
      schema_types: '', internal_inlinks: 0, internal_outlinks: 0, sitemap_included: 'no', rss_included: 'no',
      intent_cluster: 'legacy_redirect', possible_duplicate: 'resolved', entity_conflict: 'no', recommended_action: '301 to final canonical',
    });
  }
}

// Netlify wildcard 규칙은 설정 행만 기록하면 실제로 통합되는 구 URL이 인벤토리에서 사라진다.
// 현재 콘텐츠 원본에 존재하지만 build에서 제외된 /l/ slug를 구체 URL로 펼쳐 결정표에 남긴다.
const landingSource = join('content', 'landings.json');
if (existsSync(landingSource)) {
  const landingPaths = JSON.parse(readFileSync(landingSource, 'utf8')).map((landing) => `/l/${landing.slug}/`);
  const builtPaths = new Set(pages.map((page) => page.path));
  for (const rule of redirectRows.filter((row) => row.from.startsWith('/l/') && row.from.includes('*'))) {
    const expression = new RegExp('^' + rule.from
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\*/g, '[^/]+') + '/?$');
    for (const from of landingPaths) {
      // 비강제 redirect보다 실제 파일이 우선한다. 대표 랜딩은 redirect로 오분류하지 않는다.
      if (builtPaths.has(from) || !expression.test(from)) continue;
      expandedRedirectRows.push({ from, to: rule.to, status: rule.status, expandedFrom: rule.from });
      inventory.push({
        url: ORIGIN + from, route_type: 'redirect', http_status: rule.status.replace('!', ''), redirect_target: rule.to,
        indexable: 'no', canonical: '', title: '', description: '', h1: '', language: '', template: '_redirects wildcard',
        content_source: 'content/landings.json|public/_redirects', approximate_visible_text_length: 0, date_published: '', date_modified: '',
        schema_types: '', internal_inlinks: 0, internal_outlinks: 0, sitemap_included: 'no', rss_included: 'no',
        intent_cluster: 'legacy_redirect', possible_duplicate: 'resolved', entity_conflict: 'no', recommended_action: `301 to ${rule.to} via ${rule.from}`,
      });
    }
  }
}

const invHeaders = ['url','route_type','http_status','redirect_target','indexable','canonical','title','description','h1','language','template','content_source','approximate_visible_text_length','date_published','date_modified','schema_types','internal_inlinks','internal_outlinks','sitemap_included','rss_included','intent_cluster','possible_duplicate','entity_conflict','recommended_action'];
writeCsv('url-inventory.csv', invHeaders, inventory);

const scoreRows = pages.filter((p) => !p.noindex).map((page) => {
  const direct = page.h1 && page.text.indexOf(page.h1) >= 0 && page.text.slice(page.text.indexOf(page.h1) + page.h1.length, page.text.indexOf(page.h1) + page.h1.length + 500).length >= 120;
  const limitations = /보장하지|달라질 수|별도|한계|수행하지|공개하지|비공개|확인 후/.test(page.text);
  const evidence = ['home','case','case_hub','guide','comparison'].includes(page.type) ? 'strong' : ['service_or_hub','blog','system_service'].includes(page.type) ? 'moderate' : 'templated-review';
  return {
    url: page.url, primary_intent: page.type, direct_answer: direct ? 'yes' : 'review', verified_facts: 'entity-schema-checked',
    original_evidence: evidence, decision_support: (page.html.match(/<h2\b/g) || []).length >= 3 ? 'yes' : 'review',
    limitations_disclosed: limitations ? 'yes' : 'review', content_uniqueness: duplicatePaths.has(page.path) ? 'review' : 'exact-unique',
    semantic_structure: (page.html.match(/<h1\b/g) || []).length === 1 ? 'valid-h1' : 'review',
    internal_links: page.internal.length, structured_data: page.schemaTypes.join('|'),
    freshness_accuracy: page.published || page.modified ? 'source-date-present' : 'not-date-bearing',
    conversion_path: /tel:|mailto:|pf\.kakao\.com|data-netlify/.test(page.html) ? 'yes' : 'review',
    priority: ['home','service_or_hub','case','guide'].includes(page.type) ? 'P1' : 'P2-monitor',
    action: evidence === 'templated-review' ? 'retain index gate; add only verified evidence' : 'retain and monitor',
  };
});
const scoreHeaders = ['url','primary_intent','direct_answer','verified_facts','original_evidence','decision_support','limitations_disclosed','content_uniqueness','semantic_structure','internal_links','structured_data','freshness_accuracy','conversion_path','priority','action'];
writeCsv('CONTENT_SCORECARD.csv', scoreHeaders, scoreRows);

const decisions = [
  ...redirectRows.map((row) => ({ url: ORIGIN + row.from, intent_cluster: 'legacy', decision: 'redirect', target: row.to, status: row.status.replace('!', ''), reason: 'consolidate legacy signal without a chain' })),
  ...expandedRedirectRows.map((row) => ({ url: ORIGIN + row.from, intent_cluster: 'legacy_landing', decision: 'redirect', target: row.to, status: row.status.replace('!', ''), reason: `expanded from ${row.expandedFrom}; consolidate query variant` })),
  ...pages.map((page) => ({ url: page.url, intent_cluster: page.type, decision: page.noindex ? 'retain_noindex' : 'retain', target: page.canonical, status: '200', reason: page.noindex ? 'quality/index gate' : 'self-canonical indexable page' })),
];
writeCsv('URL_DECISIONS.csv', ['url','intent_cluster','decision','target','status','reason'], decisions);

const indexable = pages.filter((p) => !p.noindex);
const metrics = {
  generatedAt: new Date().toISOString(), htmlPages: pages.length, canonicalIndexableUrls: indexable.length,
  noindexUrls: pages.length - indexable.length, redirectRules: redirectRows.length, sitemapUrls: sitemap.size,
  duplicateTitleGroups: [...titleGroups.values()].filter((g) => g.length > 1).length,
  duplicateH1Groups: [...h1Groups.values()].filter((g) => g.length > 1).length,
  exactDuplicateBodyGroups: [...bodyGroups.values()].filter((g) => g.length > 1).length,
  orphanIndexableUrls: indexable.filter((p) => p.path !== '/' && !inbound.get(p.path)).length,
  entityConflictCandidates: inventory.filter((r) => r.entity_conflict === 'yes').length,
};
writeFileSync(join(DOCS, 'latest-audit.json'), JSON.stringify(metrics, null, 2) + '\n');
writeFileSync(join(DOCS, 'latest-audit.md'), `# Latest GEO audit\n\nGenerated from the local \`out/\` build at ${metrics.generatedAt}. HTTP status and redirects are build-model results; production HTTP behavior still requires post-deploy verification.\n\n| Metric | Result |\n|---|---:|\n| HTML pages | ${metrics.htmlPages} |\n| Canonical indexable URLs | ${metrics.canonicalIndexableUrls} |\n| Noindex URLs | ${metrics.noindexUrls} |\n| Redirect rules | ${metrics.redirectRules} |\n| Sitemap URLs | ${metrics.sitemapUrls} |\n| Duplicate title groups | ${metrics.duplicateTitleGroups} |\n| Duplicate H1 groups | ${metrics.duplicateH1Groups} |\n| Exact duplicate body groups | ${metrics.exactDuplicateBodyGroups} |\n| Orphan indexable URLs | ${metrics.orphanIndexableUrls} |\n| Entity conflict candidates | ${metrics.entityConflictCandidates} |\n\nSubjective content quality remains a manual review item; the scorecard does not convert word count into a quality claim.\n`);

console.log(`GEO inventory: HTML ${pages.length} · indexable ${indexable.length} · noindex ${pages.length - indexable.length} · redirects ${redirectRows.length}`);
console.log(`Generated ${join(DOCS, 'url-inventory.csv')}, CONTENT_SCORECARD.csv, URL_DECISIONS.csv, latest-audit.{md,json}`);
