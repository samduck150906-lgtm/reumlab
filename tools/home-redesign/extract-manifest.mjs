/**
 * 보호 항목 manifest 추출 (홈 리디자인 전/후 비교용)
 *
 *   node tools/home-redesign/extract-manifest.mjs <html파일> [--out manifest.json] [--label 이름]
 *
 * 마스터 프롬프트 4·9절의 "보호 자산"을 기계가 비교할 수 있는 형태로 뽑는다.
 * 화면에 보이는지까지는 판정하지 않는다 — 그건 렌더 검사(render-audit)가 맡는다.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parse, walk, findAll, byTag, textOf, normText } from './lib/html.mjs';

const args = process.argv.slice(2);
const file = args[0];
if (!file) {
  console.error('사용법: node tools/home-redesign/extract-manifest.mjs <html> [--out x.json] [--label name]');
  process.exit(1);
}
const outPath = args.includes('--out') ? args[args.indexOf('--out') + 1] : null;
const label = args.includes('--label') ? args[args.indexOf('--label') + 1] : file;

const html = readFileSync(file, 'utf8');
const doc = parse(html);

const el = (tag) => byTag(doc, tag);
const first = (tag) => el(tag)[0];

/* ---------------------------------------------------------------- 메타 */
const metas = el('meta').map((n) => n.attrs);
const links = el('link').map((n) => n.attrs);

const metaByName = {};
for (const a of metas) {
  const key = a.name || a.property || a['http-equiv'] || a.itemprop;
  if (!key) continue;
  (metaByName[key] ||= []).push(a.content ?? '');
}

const head = {
  title: normText(textOf(first('title') || { children: [] })),
  lang: first('html')?.attrs?.lang ?? null,
  charset: metas.find((m) => 'charset' in m)?.charset ?? null,
  viewport: metaByName.viewport?.[0] ?? null,
  meta: Object.fromEntries(Object.entries(metaByName).map(([k, v]) => [k, v.length === 1 ? v[0] : v])),
  linkRels: links
    .map((a) => ({ rel: a.rel ?? null, href: a.href ?? null, type: a.type ?? null, sizes: a.sizes ?? null, title: a.title ?? null }))
    .sort((a, b) => `${a.rel}|${a.href}`.localeCompare(`${b.rel}|${b.href}`)),
  canonical: links.find((a) => (a.rel || '').toLowerCase() === 'canonical')?.href ?? null,
  robots: metaByName.robots?.[0] ?? null,
};

/* ------------------------------------------------------- 구조화 데이터 */
const jsonLd = [];
for (const s of el('script')) {
  if ((s.attrs.type || '').toLowerCase() !== 'application/ld+json') continue;
  const raw = (s.raw ?? '').trim();
  try {
    jsonLd.push(JSON.parse(raw));
  } catch (e) {
    jsonLd.push({ __parseError: String(e.message), __rawSha256: createHash('sha256').update(raw).digest('hex') });
  }
}
/** key 순서는 무시하되 값과 배열 순서는 보존(9절 정규화 규칙) */
function sortKeys(v) {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortKeys(v[k])]));
  }
  return v;
}

/* -------------------------------------------------------------- 헤딩 */
const headings = [];
walk(doc, (n) => {
  if (n.type === 'element' && /^h[1-6]$/.test(n.tag)) {
    headings.push({ level: Number(n.tag[1]), text: normText(textOf(n)) });
  }
});

/* ------------------------------------------------- 섹션 순서·앵커 id */
const anchors = [];
walk(doc, (n) => {
  if (n.type === 'element' && n.attrs?.id) anchors.push({ tag: n.tag, id: n.attrs.id });
});

const sections = findAll(doc, (n) => n.tag === 'section' || n.tag === 'header' || n.tag === 'footer' || n.tag === 'main')
  .map((n, idx) => ({
    order: idx,
    tag: n.tag,
    id: n.attrs.id ?? null,
    class: n.attrs.class ?? null,
    ariaLabel: n.attrs['aria-label'] ?? null,
    headings: findAll(n, (h) => /^h[1-6]$/.test(h.tag)).map((h) => `h${h.tag[1]}:${normText(textOf(h))}`),
    textSha256: createHash('sha256').update(normText(textOf(n))).digest('hex'),
    textLength: normText(textOf(n)).length,
  }));

/* ------------------------------------------------- 영역별 링크 (9절) */
/** 링크가 속한 최상위 영역 이름을 찾는다 — 개수까지 영역별로 비교하기 위함 */
function areaOf(node) {
  let n = node.parent;
  const chain = [];
  while (n && n.tag !== '#root') {
    if (n.tag === 'header') return 'header';
    if (n.tag === 'footer') return 'footer';
    if (n.tag === 'section') return n.attrs.id ? `section#${n.attrs.id}` : `section.${(n.attrs.class || '').split(/\s+/)[0] || 'unnamed'}`;
    if (n.attrs?.id === 'mobileNav') return 'mobile-nav';
    if (n.attrs?.id === 'mcta') return 'mobile-cta';
    if (n.attrs?.id === 'pm') return 'portfolio-modal';
    chain.push(n.tag);
    n = n.parent;
  }
  return 'other';
}

const anchorsList = el('a').map((n) => ({
  area: areaOf(n),
  href: n.attrs.href ?? null,
  text: normText(textOf(n)),
  rel: n.attrs.rel ?? null,
  target: n.attrs.target ?? null,
  ariaLabel: n.attrs['aria-label'] ?? null,
  dataCta: n.attrs['data-cta'] ?? null,
  dataCtaLoc: n.attrs['data-cta-loc'] ?? null,
  dataPlan: n.attrs['data-plan'] ?? null,
  dataPurpose: n.attrs['data-purpose'] ?? null,
  dataHeroCta: n.attrs['data-hero-cta'] ?? null,
}));

const linkCountByArea = {};
for (const a of anchorsList) linkCountByArea[a.area] = (linkCountByArea[a.area] || 0) + 1;

/* ------------------------------------------------------------ 이미지 */
const images = el('img').map((n) => ({
  src: n.attrs.src ?? null,
  alt: n.attrs.alt ?? null,
  width: n.attrs.width ?? null,
  height: n.attrs.height ?? null,
  loading: n.attrs.loading ?? null,
  decoding: n.attrs.decoding ?? null,
  class: n.attrs.class ?? null,
}));
const media = [
  ...el('video').map((n) => ({ kind: 'video', src: n.attrs.src ?? null, poster: n.attrs.poster ?? null, controls: 'controls' in n.attrs, preload: n.attrs.preload ?? null, ariaLabel: n.attrs['aria-label'] ?? null })),
  ...el('source').map((n) => ({ kind: 'source', src: n.attrs.src ?? null, type: n.attrs.type ?? null })),
];
const figcaptions = el('figcaption').map((n) => normText(textOf(n)));

/* --------------------------------------------------------- 로고 구현 */
const logoNodes = findAll(doc, (n) => String(n.attrs?.class || '').split(/\s+/).includes('logo'));
const logos = logoNodes.map((n) => ({
  area: areaOf(n),
  tag: n.tag,
  href: n.attrs.href ?? null,
  ariaLabel: n.attrs['aria-label'] ?? null,
  text: normText(textOf(n)),
  innerHtmlSha256: createHash('sha256').update(serialize(n)).digest('hex'),
  images: findAll(n, (c) => c.tag === 'img').map((c) => ({ src: c.attrs.src, alt: c.attrs.alt ?? null, width: c.attrs.width ?? null, height: c.attrs.height ?? null, class: c.attrs.class ?? null })),
  inlineSvgCount: findAll(n, (c) => c.tag === 'svg').length,
}));

/* ----------------------------------------------------------- 폼·기능 */
const forms = el('form').map((f) => ({
  name: f.attrs.name ?? null,
  method: f.attrs.method ?? null,
  action: f.attrs.action ?? null,
  netlify: f.attrs['data-netlify'] ?? null,
  honeypot: f.attrs['data-netlify-honeypot'] ?? null,
  fields: findAll(f, (n) => ['input', 'select', 'textarea', 'button'].includes(n.tag)).map((n) => ({
    tag: n.tag,
    name: n.attrs.name ?? null,
    type: n.attrs.type ?? null,
    id: n.attrs.id ?? null,
    required: 'required' in n.attrs,
    placeholder: n.attrs.placeholder ?? null,
    autocomplete: n.attrs.autocomplete ?? null,
    dataUtm: n.attrs['data-utm'] ?? null,
    dataCtx: n.attrs['data-ctx'] ?? null,
    options: n.tag === 'select' ? findAll(n, (o) => o.tag === 'option').map((o) => normText(textOf(o))) : undefined,
  })),
  labels: findAll(f, (n) => n.tag === 'label').map((n) => ({ for: n.attrs.for ?? null, text: normText(textOf(n)) })),
}));

const buttons = el('button').map((n) => ({
  class: n.attrs.class ?? null,
  type: n.attrs.type ?? null,
  text: normText(textOf(n)),
  ariaLabel: n.attrs['aria-label'] ?? null,
  ariaExpanded: n.attrs['aria-expanded'] ?? null,
  ariaControls: n.attrs['aria-controls'] ?? null,
  ariaSelected: n.attrs['aria-selected'] ?? null,
  role: n.attrs.role ?? null,
  dataFilter: n.attrs['data-filter'] ?? null,
  id: n.attrs.id ?? null,
}));

/* --------------------------------------- 계측이 의존하는 훅(id/class/data) */
const analyticsHooks = {
  dataCta: {},
  dataCtaLoc: {},
  dataAttrs: {},
  idsUsedByScript: [],
};
walk(doc, (n) => {
  if (n.type !== 'element') return;
  for (const [k, v] of Object.entries(n.attrs || {})) {
    if (!k.startsWith('data-')) continue;
    (analyticsHooks.dataAttrs[k] ||= []).push(v);
  }
  if (n.attrs?.['data-cta']) analyticsHooks.dataCta[n.attrs['data-cta']] = (analyticsHooks.dataCta[n.attrs['data-cta']] || 0) + 1;
  if (n.attrs?.['data-cta-loc']) analyticsHooks.dataCtaLoc[n.attrs['data-cta-loc']] = (analyticsHooks.dataCtaLoc[n.attrs['data-cta-loc']] || 0) + 1;
});
for (const k of Object.keys(analyticsHooks.dataAttrs)) analyticsHooks.dataAttrs[k] = analyticsHooks.dataAttrs[k].sort();

/* ---------------------------------------------------- 표·리스트·FAQ */
const tables = el('table').map((t) => ({
  class: t.attrs.class ?? null,
  headers: findAll(t, (n) => n.tag === 'th').map((n) => normText(textOf(n))),
  rows: findAll(t, (n) => n.tag === 'tr').map((tr) =>
    findAll(tr, (n) => n.tag === 'td' || n.tag === 'th').map((td) => normText(textOf(td)))),
}));

const faq = findAll(doc, (n) => String(n.attrs?.class || '').split(/\s+/).includes('faq-item')).map((n) => ({
  q: normText(textOf(findAll(n, (c) => String(c.attrs?.class || '').split(/\s+/).includes('faq-q'))[0] || { children: [] })),
  a: normText(textOf(findAll(n, (c) => String(c.attrs?.class || '').split(/\s+/).includes('faq-a'))[0] || { children: [] })),
}));

/* ------------------------------------------------- 가격 (숫자 무손실) */
const prices = findAll(doc, (n) => String(n.attrs?.class || '').split(/\s+/).includes('price-card')).map((n) => ({
  name: normText(textOf(findAll(n, (c) => String(c.attrs?.class || '').split(/\s+/).includes('price-name'))[0] || { children: [] })),
  tagLabel: normText(textOf(findAll(n, (c) => String(c.attrs?.class || '').split(/\s+/).includes('price-tag-label'))[0] || { children: [] })),
  amount: normText(textOf(findAll(n, (c) => String(c.attrs?.class || '').split(/\s+/).includes('price-amount'))[0] || { children: [] })),
  term: normText(textOf(findAll(n, (c) => String(c.attrs?.class || '').split(/\s+/).includes('price-term'))[0] || { children: [] })),
  includes: findAll(n, (c) => String(c.attrs?.class || '').split(/\s+/).includes('price-incl')).flatMap((ul) => findAll(ul, (li) => li.tag === 'li').map((li) => normText(textOf(li)))),
  note: normText(textOf(findAll(n, (c) => String(c.attrs?.class || '').split(/\s+/).includes('price-note'))[0] || { children: [] })),
  cta: findAll(n, (c) => c.tag === 'a').map((a) => ({ href: a.attrs.href, text: normText(textOf(a)), plan: a.attrs['data-plan'] ?? null })),
}));

/* ------------------------------------------------------- 전체 본문 텍스트 */
const bodyNode = first('body') || doc;
const visibleTextSkip = new Set(['script', 'style']);
const fullText = normText(textOf(bodyNode, { skip: visibleTextSkip }));
const noscriptText = el('noscript').map((n) => normText(textOf(n)));

/** DOM 읽기 순서 그대로의 텍스트 블록 — 순서 뒤바뀜을 잡기 위함 */
const textBlocks = [];
walk(bodyNode, (n) => {
  if (n.type !== 'element') return;
  if (!/^(p|li|h[1-6]|figcaption|td|th|dd|dt|blockquote)$/.test(n.tag)) return;
  const t = normText(textOf(n));
  if (t) textBlocks.push(`${n.tag}:${t}`);
});

/* ------------------------------------------------------------ 결과 */
function serialize(node) {
  if (node.type === 'text') return node.value;
  if (node.type === 'comment') return '';
  const attrs = Object.entries(node.attrs || {}).sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => ` ${k}="${v}"`).join('');
  const inner = (node.children || []).map(serialize).join('');
  return `<${node.tag}${attrs}>${inner}</${node.tag}>`;
}

const manifest = {
  label,
  sourceFile: file,
  sourceSha256: createHash('sha256').update(html).digest('hex'),
  sourceBytes: Buffer.byteLength(html),
  head,
  jsonLd: jsonLd.map(sortKeys),
  headings,
  anchors,
  sections,
  links: anchorsList,
  linkCountByArea,
  linkCountTotal: anchorsList.length,
  images,
  media,
  figcaptions,
  logos,
  forms,
  buttons,
  analyticsHooks,
  tables,
  faq,
  prices,
  noscriptText,
  textBlocks,
  fullTextSha256: createHash('sha256').update(fullText).digest('hex'),
  fullTextLength: fullText.length,
  fullText,
};

const json = JSON.stringify(manifest, null, 2);
if (outPath) {
  writeFileSync(outPath, json, 'utf8');
  console.log(`✓ manifest: ${outPath} (헤딩 ${headings.length} · 링크 ${anchorsList.length} · 가격카드 ${prices.length} · FAQ ${faq.length} · JSON-LD ${jsonLd.length} · 본문 ${fullText.length}자)`);
} else {
  process.stdout.write(json);
}
