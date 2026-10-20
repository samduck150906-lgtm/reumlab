/**
 * New namespace QA only. Never edits HTML, existing sitemaps, source or old QA.
 * node --import tsx scripts/development-agency/verify.mts --out <export> --reports <new-report-dir>
 * Exit 0 PASS, 1 measured failure, 2 missing inputs / incomplete execution.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse, type HTMLElement } from 'node-html-parser';
import type { AgencyPage } from '../../lib/development-agency/types';
import { agencyHref, assertAgencyPages } from '../../lib/development-agency/types';

const ORIGIN = 'https://reumlab.com';
const PREFIX = '/development-agency/';
const REQUIRED_FIELDS = ['audience','actualProblems','userRoles','workflows','coreFeatures',
  'adminFeatures','integrations','dataEntities','edgeCases','mvpScope','expansionScope',
  'costDrivers','timelineDrivers','complianceChecks','handover'] as const;
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PLACEHOLDER = /\b(?:TODO|TBD|lorem\s+ipsum|placeholder)\b|추후\s*작성|내용\s*준비\s*중/iu;
type Json = Record<string, any>;
type Issue = { url?: string; check: string; detail: string };
type Catalog = { agencyPages: readonly AgencyPage[]; agencyHub: AgencyPage };
type Options = { out: string; reports: string; baseline?: string; expectedExisting?: number };
type Page = {
  url: string; file: string;
  text: string; title: string; description: string; h1: string; canonical: string;
  sentences: string[]; grams: Set<string>; source?: AgencyPage; isNew: boolean;
};
const normalize = (value: unknown) => String(value ?? '').normalize('NFC').replace(/\s+/gu, ' ').trim();
const withoutSpace = (value: string) => value.replace(/\s/gu, '');
const readJson = (file: string) => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const normalizedUrl = (value: string) => new URL(value, ORIGIN).href;
const diff = (a: Iterable<string>, b: Iterable<string>) => {
  const set = new Set(b);
  return [...new Set(a)].filter(value => !set.has(value)).sort();
};
function csv(rows: Json[], columns: string[]) {
  const cell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  return '\uFEFF' + [columns.map(cell).join(','), ...rows.map(row =>
    columns.map(key => cell(typeof row[key] === 'object' ? JSON.stringify(row[key]) : row[key])).join(','))].join('\n') + '\n';
}
export function fiveGrams(text: string): Set<string> {
  const chars = [...text.normalize('NFC').toLocaleLowerCase('ko-KR').replace(/[\s\p{P}\p{S}]/gu, '')];
  const grams = new Set<string>();
  for (let i = 0; i <= chars.length - 5; i++) grams.add(chars.slice(i, i + 5).join(''));
  return grams;
}
export function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size && !b.size) return 1;
  let overlap = 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const gram of small) if (large.has(gram)) overlap++;
  return overlap / (a.size + b.size - overlap);
}
// Exact inverted postings count intersections once per shared gram. No sampling,
// approximate hashes, threshold relaxation or omission of existing-page pairs.
export function gramPostings(sets: readonly Set<string>[]): Map<string, number[]> {
  const index = new Map<string, number[]>();
  for (let id = 0; id < sets.length; id++) for (const gram of sets[id]) {
    const ids = index.get(gram);
    if (ids) ids.push(id); else index.set(gram, [id]);
  }
  return index;
}
export function exactOverlaps(grams: Set<string>, index: Map<string, number[]>, count: number): Uint32Array {
  const result = new Uint32Array(count);
  for (const gram of grams) for (const id of index.get(gram) ?? []) result[id]++;
  return result;
}
export function sentenceUnits(text: string): string[] {
  // Block boundaries and sentence-ending punctuation are deterministic across Node/ICU versions.
  // Short labels/headings (<12 non-space characters) are excluded; all eligible
  // main-body sentences remain included, including handover/legal text.
  return text.split(/(?<=[.!?。！？])\s*|\n+/u).map(normalize)
    .filter(unit => withoutSpace(unit).length >= 12)
    .map(unit => unit.replace(/[.!?。！？]+$/u, '').trim());
}
export function visibleMain(document: HTMLElement): HTMLElement | null {
  const main = document.querySelector('main');
  if (!main) return null;
  const copy = parse(main.outerHTML).querySelector('main')!;
  for (const node of copy.querySelectorAll('*')) {
    const style = node.getAttribute('style') ?? '';
    if (['SCRIPT','STYLE','NOSCRIPT','NAV','FOOTER','TEMPLATE'].includes(node.tagName)
      || node.hasAttribute('hidden') || node.getAttribute('aria-hidden') === 'true'
      || /(?:display\s*:\s*none|visibility\s*:\s*hidden)/i.test(style)) node.remove();
  }
  return copy;
}
function inside(root: string, filename: string) {
  const relative = path.relative(root, filename);
  return relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative);
}
function localFile(root: string, url: string): string | null {
  const parsed = new URL(url, ORIGIN);
  let decoded: string;
  try { decoded = decodeURIComponent(parsed.pathname); } catch { return null; }
  if (decoded.includes('\\') || decoded.includes('\0')) return null;
  const raw = path.resolve(root, '.' + decoded);
  if (!inside(root, raw)) return null;
  const choices = [raw, path.join(raw, 'index.html')];
  for (const file of choices) {
    if (fs.existsSync(file) && fs.statSync(file).isFile()
      && inside(fs.realpathSync(root), fs.realpathSync(file))) return file;
  }
  return null;
}
export function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/.test(value)) return false;
  const stamp = Date.parse(value);
  if (!Number.isFinite(stamp) || stamp > Date.now() + 1000) return false;
  const day = value.slice(0, 10);
  const dayStamp = new Date(day + 'T00:00:00Z');
  return dayStamp.toISOString().slice(0, 10) === day;
}
export function readSitemapTree(root: string, entryUrl: string) {
  const entries = new Map<string, string>(), errors: string[] = [], visited = new Set<string>();
  const decode = (value: string) => parse(`<p>${value}</p>`).querySelector('p')!.textContent;
  function visit(url: string) {
    if (visited.has(url)) { errors.push(`Repeated/cyclic sitemap ${url}`); return; }
    visited.add(url);
    if (new URL(url).origin !== ORIGIN) { errors.push(`Off-origin sitemap ${url}`); return; }
    const file = localFile(root, url);
    if (!file) { errors.push(`Missing sitemap ${url}`); return; }
    const xml = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
    if (/<!DOCTYPE|<!ENTITY/i.test(xml)) { errors.push(`External declarations forbidden: ${url}`); return; }
    const source = xml.replace(/<\?xml[^?]*\?>/g, '').replace(/<!--[\s\S]*?-->/g, '').trim();
    const stack: string[] = [];
    let rootName = '', roots = 0, priorEnd = 0;
    const tokens = [...source.matchAll(/<[^>]*>/g)];
    for (const token of tokens) {
      const gap = source.slice(priorEnd, token.index);
      if (gap.trim() && !['loc','lastmod','priority','changefreq'].includes(stack.at(-1) ?? '')) {
        errors.push(`Unexpected XML text in ${url}`);
      }
      if (/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-f]+;)/i.test(gap)) errors.push(`Unescaped XML entity in ${url}`);
      priorEnd = token.index! + token[0].length;
      const match = /^<(\/?)([a-z][\w:-]*)(?:\s[^<>]*)?(\/?)>$/i.exec(token[0]);
      if (!match) { errors.push(`Invalid XML token in ${url}`); continue; }
      const [, closing, name, selfClosing] = match;
      if (closing) {
        if (stack.pop() !== name) errors.push(`Mismatched XML closing tag ${name}: ${url}`);
      } else {
        if (!stack.length) { rootName = name; roots++; }
        const parent = stack.at(-1);
        if (parent && !(
          (parent === 'urlset' && name === 'url') || (parent === 'sitemapindex' && name === 'sitemap')
          || (parent === 'url' && ['loc','lastmod','priority','changefreq'].includes(name))
          || (parent === 'sitemap' && ['loc','lastmod'].includes(name))
        )) errors.push(`Unexpected XML nesting ${parent}/${name}: ${url}`);
        if (!selfClosing) stack.push(name);
      }
    }
    if (stack.length || roots !== 1 || !['urlset','sitemapindex'].includes(rootName)
      || source.slice(priorEnd).trim() || !/xmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']/.test(source)) {
      errors.push(`Invalid sitemap structure/namespace: ${url}`);
    }
    const tag = rootName === 'sitemapindex' ? 'sitemap' : 'url';
    const blocks = [...source.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'g'))];
    if (!blocks.length) errors.push(`Empty sitemap ${url}`);
    for (const block of blocks) {
      const locs = [...block[1].matchAll(/<loc>([\s\S]*?)<\/loc>/g)];
      const mods = [...block[1].matchAll(/<lastmod>([\s\S]*?)<\/lastmod>/g)];
      if (locs.length !== 1 || mods.length > 1) { errors.push(`Invalid loc/lastmod cardinality: ${url}`); continue; }
      const location = decode(locs[0][1].trim());
      let parsed: URL;
      try { parsed = new URL(location); } catch { errors.push(`Invalid absolute loc ${location}`); continue; }
      if (parsed.origin !== ORIGIN || parsed.search || parsed.hash) errors.push(`Invalid sitemap loc ${location}`);
      if (tag === 'sitemap') visit(location);
      else {
        if (entries.has(location)) errors.push(`Duplicate sitemap loc ${location}`);
        entries.set(location, mods[0]?.[1].trim() ?? '');
      }
    }
  }
  visit(entryUrl);
  return { entries, errors, documents: [...visited] };
}
function collectNodes(value: any, result: Json[] = []): Json[] {
  if (Array.isArray(value)) value.forEach(item => collectNodes(item, result));
  else if (value && typeof value === 'object') {
    if (value['@type']) result.push(value);
    Object.values(value).forEach(item => collectNodes(item, result));
  }
  return result;
}
const typed = (nodes: Json[], type: string) => nodes.filter(node => [node['@type']].flat().includes(type));
function pageFrom(root: string, url: string, isNew: boolean, source?: AgencyPage): Page | null {
  const file = localFile(root, url);
  if (!file) return null;
  const html = fs.readFileSync(file, 'utf8'), doc = parse(html), main = visibleMain(doc);
  const text = main?.structuredText ?? '';
  // DOMs are used only while extracting this page, then released. Holding every
  // hydrated Next HTML DOM together makes large namespaces needlessly expensive.
  return { url, file, text,
    title: normalize(doc.querySelector('title')?.textContent),
    description: normalize(doc.querySelector('meta[name="description"]')?.getAttribute('content')),
    h1: normalize(main?.querySelector('h1')?.textContent),
    canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
    sentences: sentenceUnits(text), grams: fiveGrams(text), isNew, source };
}
function validateCatalog(page: AgencyPage, url: string, add: (check: string, detail: string) => void) {
  const walk = (value: any, key: string) => {
    if (typeof value === 'string') {
      if (!value.trim() && key !== 'slug') add('empty-field', key);
      if (PLACEHOLDER.test(value)) add('placeholder', key + ': ' + value.slice(0, 160));
    } else if (Array.isArray(value)) {
      if (!value.length) add('empty-array', key);
      value.forEach((item, i) => walk(item, `${key}[${i}]`));
    } else if (value && typeof value === 'object') {
      Object.entries(value).forEach(([k, item]) => walk(item, key ? `${key}.${k}` : k));
    } else add('empty-field', key);
  };
  walk(page, '');
  for (const key of ['primaryKeyword','searchIntent','industry','serviceAxis','title','description','h1','summary','updatedAt','ctaContext']) {
    if (!normalize((page as any)[key])) add('required-field', key);
  }
  for (const key of [...REQUIRED_FIELDS, 'keywordVariants','clusterIds','relatedRoutes','evidenceSources']) {
    if (!Array.isArray(page[key]) || !page[key].length) add('required-array', key);
  }
  if (!validDate(page.updatedAt)) add('content-date', `Invalid/future date ${page.updatedAt}`);
  if (!page.sections || page.sections.length < 12) add('catalog-sections', 'At least 12 sections required');
  if (!page.faq || page.faq.length < 6) add('catalog-faq', 'At least 6 FAQs required');
  const fields = new Set((page.sections ?? []).flatMap(section => section.fields ?? []));
  for (const field of REQUIRED_FIELDS) if (!fields.has(field)) add('unrendered-field', field);
  const ids = (page.sections ?? []).map(section => section.id);
  if (new Set(ids).size !== ids.length) add('section-id', 'Duplicate section id');
  for (const id of ids) if (!/^[a-z][a-z0-9-]*$/.test(id)) add('section-id', `Unsafe section id ${id}`);
  for (const link of page.relatedRoutes ?? []) {
    try { if (normalizedUrl(link.href) === url) add('self-related-link', link.href); }
    catch { add('invalid-related-link', link.href); }
  }
}
export function verify(options: Options, catalog: Catalog) {
  const root = path.resolve(options.out), issues: Issue[] = [], quality: Json[] = [], links: Json[] = [];
  const add = (check: string, detail: string, url?: string) => issues.push({ ...(url ? { url } : {}), check, detail });
  const baselineFile = options.baseline ?? path.join(REPO, 'config/content-manifest.json');
  const requiredInputs = [root, path.join(root, 'sitemap.xml'), path.join(root, 'sitemap-development-agency.xml'), baselineFile];
  const missing = requiredInputs.filter(file => !fs.existsSync(file));
  if (missing.length) return { status: 'INCOMPLETE', missingInputs: missing, issues, quality, links };
  if (!Array.isArray(catalog.agencyPages) || !catalog.agencyHub || !catalog.agencyPages.length) {
    return { status: 'INCOMPLETE', missingInputs: ['Non-empty agencyPages and agencyHub catalog exports'], issues, quality, links };
  }
  const baseline = readJson(baselineFile);
  const oldMap = readSitemapTree(root, ORIGIN + '/sitemap.xml');
  const newMap = readSitemapTree(root, ORIGIN + '/sitemap-development-agency.xml');
  oldMap.errors.forEach(error => add('existing-sitemap', error));
  newMap.errors.forEach(error => add('new-sitemap', error));
  const registry = new Map<string, AgencyPage>([[ORIGIN + PREFIX, catalog.agencyHub]]);
  try { assertAgencyPages([catalog.agencyHub,...catalog.agencyPages]); }
  catch(error) { add('catalog-contract',String(error)); }
  for (const page of catalog.agencyPages) {
    if (!/^[a-z0-9가-힣-]+(?:\/[a-z0-9가-힣-]+)*$/.test(page.slug)) { add('slug', `Invalid slug ${page.slug}`); continue; }
    const url = ORIGIN + agencyHref(page);
    if (registry.has(url)) add('duplicate-route', url);
    registry.set(url, page);
  }
  const expectedExisting = options.expectedExisting ?? 823;
  if (oldMap.entries.size !== expectedExisting) add('existing-sitemap-count', `Expected ${expectedExisting}; found ${oldMap.entries.size}`);
  for (const url of diff(Object.keys(baseline), oldMap.entries.keys())) add('existing-sitemap-missing', url);
  for (const url of diff(oldMap.entries.keys(), Object.keys(baseline))) add('existing-sitemap-added', url);
  for (const url of diff(registry.keys(), newMap.entries.keys())) add('new-sitemap-missing', url);
  for (const url of diff(newMap.entries.keys(), registry.keys())) add('new-sitemap-unapproved', url);
  for (const url of registry.keys()) if (oldMap.entries.has(url)) add('namespace-collision', url);
  const namespaceFiles: string[] = [];
  function walk(directory: string) {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) { add('namespace-symlink', file); continue; }
      if (entry.isDirectory()) walk(file);
      else if (entry.isFile() && file.endsWith('.html')) namespaceFiles.push(file);
    }
  }
  walk(path.join(root, 'development-agency'));
  for (const file of namespaceFiles) {
    const relative = path.relative(root, file).split(path.sep).join('/');
    const url = normalizedUrl('/' + relative.replace(/index\.html$/, ''));
    if (!registry.has(url)) add('unapproved-export', url);
  }
  const pages: Page[] = [], newPages: Page[] = [];
  for (const url of new Set([...oldMap.entries.keys(), ...registry.keys()])) {
    const page = pageFrom(root, url, registry.has(url), registry.get(url));
    if (!page) { add('missing-html', url, url); continue; }
    pages.push(page);
    if (page.isNew) newPages.push(page);
  }
  const sentenceOwners = new Map<string, Set<string>>();
  for (const page of pages) for (const sentence of page.sentences) {
    if (!sentenceOwners.has(sentence)) sentenceOwners.set(sentence, new Set());
    sentenceOwners.get(sentence)!.add(page.url);
  }
  // New metadata must be unique against all original canonical pages, and against each other.
  for (const key of ['title','description','h1','canonical'] as const) {
    const grouped = new Map<string, Page[]>();
    for (const page of pages) {
      const value = normalize(page[key]);
      if (!value) continue;
      const list = grouped.get(value) ?? []; list.push(page); grouped.set(value, list);
    }
    for (const [value, group] of grouped) {
      if (group.length > 1 && group.some(page => page.isNew)) add('duplicate-' + key, JSON.stringify({ value, urls: group.map(page => page.url) }));
    }
  }
  const similarity: Json[] = [];
  const pageIds = new Map(pages.map((page,index)=>[page.url,index]));
  const newIds = new Map(newPages.map((page,index)=>[page.url,index]));
  const postings = gramPostings(pages.map(page=>page.grams));
  let comparedPairs = 0, certifiedBelowThresholdBySize = 0;
  for (let i = 0; i < newPages.length; i++) {
    const a = newPages[i];
    const overlaps = exactOverlaps(a.grams, postings, pages.length);
    for (const b of pages) {
      if (b.url === a.url || (b.isNew && newIds.get(b.url)! < i)) continue;
      // All same-axis new pairs and every new-to-existing pair are gated.
      // Different-axis new pairs are also measured so duplication is visible.
      const sameAxis = b.isNew && a.source?.serviceAxis === b.source?.serviceAxis;
      const gated = sameAxis || !b.isNew;
      const sizeUpperBound = Math.min(a.grams.size, b.grams.size) / Math.max(1, a.grams.size, b.grams.size);
      if (sizeUpperBound < 0.72) { certifiedBelowThresholdBySize++; continue; }
      const intersection = overlaps[pageIds.get(b.url)!];
      const union = a.grams.size + b.grams.size - intersection;
      const score = union ? intersection / union : 1; comparedPairs++;
      if (score >= 0.5) similarity.push({ url:a.url, comparedUrl:b.url, sameAxis, comparedKind:b.isNew?'new':'existing', jaccard:score, threshold:0.72, gated });
      if (score >= 0.72 && gated) add('body-similarity', `5-gram Jaccard ${score.toFixed(6)} >= 0.72 against ${b.url}`, a.url);
    }
  }
  postings.clear();
  const anchorCache = new Map<string, Set<string>>();
  for (const page of newPages) {
    const pageAdd = (check: string, detail: string) => add(check, detail, page.url);
    const before = issues.length, source = page.source!;
    validateCatalog(source, page.url, pageAdd);
    const doc = parse(fs.readFileSync(page.file, 'utf8')), main = visibleMain(doc);
    if (doc.querySelectorAll('main').length !== 1) pageAdd('main-count', 'Exactly one main required');
    if (doc.querySelectorAll('h1').length !== 1) pageAdd('h1-count', 'Exactly one H1 required');
    for (const [selector, label] of [['title','title'],['meta[name="description"]','description'],['link[rel="canonical"]','canonical']]) {
      if (doc.querySelectorAll(selector).length !== 1) pageAdd('metadata-cardinality', label);
    }
    if (page.title !== normalize(source.title) && page.title !== normalize(source.title + ' | 름랩')) pageAdd('catalog-title', 'Rendered title differs from catalog/title template');
    if (page.description !== normalize(source.description)) pageAdd('catalog-description', 'Rendered description differs from catalog');
    if (page.h1 !== normalize(source.h1)) pageAdd('catalog-h1', 'Rendered H1 differs from catalog');
    if (page.canonical !== page.url) pageAdd('canonical', `Expected ${page.url}; received ${page.canonical}`);
    const robots = doc.querySelectorAll('meta').filter(meta =>
      /^(robots|googlebot|naver|yeti)$/i.test(meta.getAttribute('name') ?? ''));
    if (!robots.some(meta => /^robots$/i.test(meta.getAttribute('name') ?? ''))) pageAdd('robots', 'Explicit robots policy missing');
    if (robots.some(meta => /(?:^|[\s,])(noindex|none|nofollow)(?:$|[\s,])/i.test(meta.getAttribute('content') ?? ''))) pageAdd('robots', 'Index/follow policy is blocked');
    if (doc.querySelector('html')?.getAttribute('lang') !== 'ko') pageAdd('lang', 'Expected ko');
    for (const field of ['og:type','og:locale','og:site_name','og:url','og:title','og:description','og:image']) {
      const tags = doc.querySelectorAll(`meta[property="${field}"]`);
      if (tags.length !== 1 || !normalize(tags[0]?.getAttribute('content'))) pageAdd('open-graph', `${field} missing/duplicated/empty`);
    }
    if (doc.querySelector('meta[property="og:url"]')?.getAttribute('content') !== page.url) pageAdd('open-graph-url', 'OG URL differs from canonical');
    for (const field of ['twitter:card','twitter:title','twitter:description','twitter:image']) {
      if (!doc.querySelector(`meta[name="${field}"]`)?.getAttribute('content')) pageAdd('twitter', `Missing ${field}`);
    }
    const chars = [...withoutSpace(page.text)].length;
    const koreanSyllables = (page.text.match(/[가-힣]/gu) ?? []).length;
    const h2Count = main?.querySelectorAll('h2').length ?? 0;
    if (chars < 3500) pageAdd('body-length', `${chars} non-whitespace main characters < 3500`);
    if (koreanSyllables < 3500) pageAdd('korean-body-length', `${koreanSyllables} Korean syllables < 3500`);
    if (h2Count < 8) pageAdd('h2-count', `${h2Count} < 8`);
    if (PLACEHOLDER.test(page.text)) pageAdd('placeholder', 'Placeholder in visible main');
    const compactText = withoutSpace(normalize(page.text));
    for (const field of REQUIRED_FIELDS) for (const text of source[field] ?? []) {
      if (!compactText.includes(withoutSpace(normalize(text)))) pageAdd('content-rendering', `${field} item absent from visible initial main: ${text.slice(0, 90)}`);
    }
    let renderedSections = 0;
    for (const section of source.sections ?? []) {
      if (!/^[a-z][a-z0-9-]*$/.test(section.id)) continue;
      const found = main?.querySelectorAll(`[id="${section.id}"]`) ?? [];
      if (found.length === 1 && normalize(found[0].textContent).includes(normalize(section.heading))) renderedSections++;
      else pageAdd('section-rendering', `Section ${section.id} missing, duplicated, or heading differs`);
    }
    if (renderedSections < 12) pageAdd('section-count', `${renderedSections} rendered sections < 12`);
    const sentenceCounts = new Map<string, number>();
    for (const sentence of page.sentences) sentenceCounts.set(sentence, (sentenceCounts.get(sentence) ?? 0) + 1);
    const unique = page.sentences.filter(sentence => sentenceCounts.get(sentence) === 1 && sentenceOwners.get(sentence)?.size === 1).length;
    const uniqueRatio = unique / Math.max(1, page.sentences.length);
    if (uniqueRatio < 0.65) pageAdd('sentence-uniqueness', `${unique}/${page.sentences.length} = ${uniqueRatio.toFixed(6)} < 0.65`);
    const schemas: Json[] = [];
    for (const script of doc.querySelectorAll('script[type="application/ld+json"]')) {
      try { collectNodes(JSON.parse(script.textContent), schemas); }
      catch { pageAdd('schema-json', 'JSON-LD parse failed'); }
    }
    for (const type of ['WebPage','Service','BreadcrumbList','FAQPage']) {
      if (typed(schemas, type).length !== 1) pageAdd('schema-type', `Expected one ${type}; found ${typed(schemas, type).length}`);
    }
    const orgs = typed(schemas, 'Organization');
    if (orgs.length !== 1 || orgs[0]['@id'] !== ORIGIN + '/#organization') pageAdd('schema-organization', 'Existing root Organization must occur once');
    for (const service of typed(schemas, 'Service')) {
      if (service.provider?.['@id'] !== ORIGIN + '/#organization' || Object.keys(service.provider ?? {}).some(key => key !== '@id')) pageAdd('schema-provider', 'Provider must reference existing Organization @id only');
      if (service.url && service.url !== page.url) pageAdd('schema-url', 'Service URL differs from canonical');
    }
    for (const webPage of typed(schemas, 'WebPage')) if (webPage.url !== page.url) pageAdd('schema-url', 'WebPage URL differs from canonical');
    const breadcrumb = typed(schemas, 'BreadcrumbList')[0]?.itemListElement ?? [];
    if (!Array.isArray(breadcrumb) || breadcrumb.length < 2) pageAdd('schema-breadcrumb', 'At least hub/current breadcrumbs required');
    else {
      const last = breadcrumb.at(-1)?.item;
      if ((typeof last === 'string' ? last : last?.['@id']) !== page.url) pageAdd('schema-breadcrumb', 'Last breadcrumb differs from current URL');
    }
    const faq = typed(schemas, 'FAQPage')[0]?.mainEntity;
    if (!Array.isArray(faq) || faq.length !== source.faq?.length || faq.length < 6) pageAdd('schema-faq', 'Schema FAQ count differs from source or is below 6');
    for (const [index, expected] of (source.faq ?? []).entries()) {
      const actual = Array.isArray(faq) ? faq[index] : null;
      if (actual?.['@type'] !== 'Question' || normalize(actual.name) !== normalize(expected.question)
        || actual.acceptedAnswer?.['@type'] !== 'Answer' || normalize(actual.acceptedAnswer.text) !== normalize(expected.answer)) {
        pageAdd('schema-faq', `FAQ ${index + 1} differs from source`);
      }
      if (!compactText.includes(withoutSpace(normalize(expected.question))) || !compactText.includes(withoutSpace(normalize(expected.answer)))) {
        pageAdd('visible-faq', `FAQ ${index + 1} not present in visible initial main`);
      }
    }
    const schemaText = JSON.stringify(schemas);
    if (/"(?:aggregateRating|ratingValue|reviewCount|award)"\s*:|"@type"\s*:\s*"(?:Review|AggregateRating)"/.test(schemaText)) pageAdd('unverified-schema-claims', 'Review/rating/award fields require evidence and are not allowed in new namespace');
    const ids = doc.querySelectorAll('[id]').map(element => element.getAttribute('id')!);
    if (new Set(ids).size !== ids.length) pageAdd('duplicate-anchor', 'Duplicate HTML id');
    let internal = 0;
    for (const anchor of doc.querySelectorAll('a[href]')) {
      const href = anchor.getAttribute('href') ?? '';
      if (!href.trim()) { pageAdd('empty-link', 'Empty href'); continue; }
      if (/^(?:mailto|tel):/i.test(href)) continue;
      let target: URL;
      try { target = new URL(href, page.url); } catch { pageAdd('invalid-link', href); continue; }
      if (!['http:','https:'].includes(target.protocol)) { pageAdd('unsupported-link', href); continue; }
      if (target.origin !== ORIGIN) continue;
      internal++;
      const file = localFile(root, target.href);
      let error = file ? '' : 'Target missing from static export';
      if (file && target.hash && target.hash !== '#') {
        if (!anchorCache.has(file)) anchorCache.set(file, new Set(parse(fs.readFileSync(file, 'utf8')).querySelectorAll('[id]').map(element => element.getAttribute('id')!)));
        try { if (!anchorCache.get(file)!.has(decodeURIComponent(target.hash.slice(1)))) error = 'Target anchor missing'; }
        catch { error = 'Invalid fragment encoding'; }
      }
      if (target.href === page.url) error = 'Self-page link without a section fragment';
      links.push({ url:page.url, href, target:target.href, status:error?'FAIL':'PASS', detail:error });
      if (error) pageAdd('internal-link', `${href}: ${error}`);
    }
    if (!internal) pageAdd('internal-link', 'No internal href in initial HTML');
    for (const related of source.relatedRoutes ?? []) if (!doc.querySelectorAll('a[href]').some(anchor => {
      try { return normalizedUrl(anchor.getAttribute('href')!) === normalizedUrl(related.href); } catch { return false; }
    })) pageAdd('related-link-rendering', related.href);
    const lastmod = newMap.entries.get(page.url) ?? '';
    if (!validDate(lastmod) || lastmod !== source.updatedAt) pageAdd('sitemap-lastmod', `Expected content date ${source.updatedAt}; received ${lastmod}`);
    quality.push({ url:page.url, serviceAxis:source.serviceAxis, charactersNoWhitespace:chars, koreanSyllables, sections:renderedSections, h2:h2Count,
      faq:source.faq?.length ?? 0, eligibleSentences:page.sentences.length, uniqueSentences:unique, uniqueSentenceRatio:uniqueRatio,
      repeatedSentenceExamples:[...sentenceCounts.keys()].filter(sentence => sentenceCounts.get(sentence)! > 1 || sentenceOwners.get(sentence)!.size > 1).slice(0,12),
      internalLinks:internal, localIssueCount:issues.length-before });
  }
  // A sitemap does not create navigational discovery: each approved new URL
  // must be linked by another rendered new page (hub included).
  for (const url of registry.keys()) if (!links.some(link => link.url !== url && link.target.split('#')[0].split('?')[0] === url)) {
    add('new-orphan', 'No initial-HTML inbound link from another namespace page', url);
  }
  return {
    status:issues.length?'FAIL':'PASS', issues, quality, links, similarity,
    counts:{ existingSitemap:oldMap.entries.size, newSitemap:newMap.entries.size, approvedNew:registry.size, renderedNew:newPages.length,
      union:new Set([...oldMap.entries.keys(), ...newMap.entries.keys()]).size, exactSimilarityPairs:comparedPairs, certifiedBelowThresholdBySize },
    sitemap:{ existingDocuments:oldMap.documents, newDocuments:newMap.documents, approvedUrls:[...registry.keys()] },
    methodology:{
      body:'Visible initial main only; scripts/styles/noscript/nav/footer/template/hidden/aria-hidden/inline hidden nodes excluded. CSS class-based hiding requires UI verification.',
      characters:'Unicode code points excluding whitespace and Hangul syllables (U+AC00..U+D7A3) reported separately; each must be >=3500 for hub and detail pages.',
      sentences:'Split at block boundaries or sentence-ending punctuation; eligible units have >=12 non-space characters. Unique only when appearing once here and in no other new/existing canonical main. Threshold65%; no manual exemption list.',
      similarity:'Exact normalized Unicode character 5-gram Jaccard. Same-axis new pairs and all new-to-existing pairs gated at <0.72. Cardinality upper-bound <0.72 proves a pair cannot fail without calculating the intersection.',
      links:'Initial HTML hrefs and local fragment IDs checked against the supplied export. External network status not measured.',
      limits:'No HTTP server/network/hydration/CSS viewport testing. Run separate local and production browser/HTTP checks. Existing root-only QA is not edited or represented as covering the new sitemap.',
    },
  };
}

async function main() {
  const argv = process.argv.slice(2), args: Record<string,string> = {};
  for (let i = 0; i < argv.length; i++) {
    if (!['--out','--reports','--baseline'].includes(argv[i]) || !argv[i+1] || argv[i+1].startsWith('--')) throw new Error(`Invalid/missing argument: ${argv[i]}`);
    args[argv[i].slice(2)] = argv[++i];
  }
  if (!args.out) throw new Error('Explicit --out is required; no implicit current export may be verified.');
  const reports = path.resolve(args.reports ?? '_reumlab_new_pages_reports');
  if (inside(path.resolve(args.out), reports)) throw new Error('Reports must not be written into the deployment export.');
  fs.mkdirSync(reports, { recursive:true });
  let result: Json;
  try {
    const catalogFile = path.join(REPO,'lib/development-agency/catalog.ts');
    if (!fs.existsSync(catalogFile)) result = { status:'INCOMPLETE', missingInputs:[catalogFile], issues:[], quality:[], links:[] };
    else result = verify({ out:args.out, reports, baseline:args.baseline }, await import(pathToFileURL(catalogFile).href));
  } catch (error) {
    result = { status:'INCOMPLETE', executionError:error instanceof Error?error.stack:String(error), issues:[], quality:[], links:[] };
  }
  result = { checkedAt:new Date().toISOString(), out:path.resolve(args.out), ...result };
  fs.writeFileSync(path.join(reports,'namespace-verification.json'), JSON.stringify(result,null,2)+'\n');
  fs.writeFileSync(path.join(reports,'page-quality.csv'), csv(result.quality,['url','serviceAxis','charactersNoWhitespace','koreanSyllables','sections','h2','faq','eligibleSentences','uniqueSentences','uniqueSentenceRatio','internalLinks','localIssueCount','repeatedSentenceExamples']));
  fs.writeFileSync(path.join(reports,'qa-issues.csv'), csv(result.issues,['url','check','detail']));
  fs.writeFileSync(path.join(reports,'internal-links.csv'), csv(result.links,['url','href','target','status','detail']));
  fs.writeFileSync(path.join(reports,'similarity-review.csv'), csv(result.similarity??[],['url','comparedUrl','sameAxis','comparedKind','jaccard','threshold','gated']));
  console.log(JSON.stringify({ status:result.status, reports, counts:result.counts, issues:result.issues.length, missingInputs:result.missingInputs, executionError:result.executionError }));
  process.exitCode = result.status === 'PASS' ? 0 : result.status === 'FAIL' ? 1 : 2;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 2; });
}
