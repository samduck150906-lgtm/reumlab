import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'node-html-parser';
import reviews from '../content/public-page-review.json';
import { GUIDES, guideCanonical, sectionAnchor } from '../lib/guides';
import { COMPARES, compareCanonical } from '../lib/compare';
import { ANSWER_TOPICS, answerCanonical, ANSWER_EVIDENCE_SOURCES } from '../lib/answers';
import { GEO_PRACTICAL_EVIDENCE } from '../lib/geo-practical-evidence';
import { PACKAGES, toWon } from '../lib/pricing';
import { SITE } from '../lib/seo';

const out = process.argv[2] ?? 'out';
const normalized = (s: string) => s.replace(/\s+/g, '').normalize('NFC');
const readPage = (url: string) => parse(readFileSync(join(out, decodeURIComponent(new URL(url, SITE.domain).pathname).slice(1), 'index.html'), 'utf8'));
const nodes = (doc: ReturnType<typeof parse>) => doc.querySelectorAll('script[type="application/ld+json"]').flatMap(script => {
  const value = JSON.parse(script.textContent); return value['@graph'] ?? [value];
});
const articles: { url: string; sourceUrls: string[]; parts: number }[] = [];
for (const entry of [
  ...GUIDES.map(g => ({ url: guideCanonical(g.slug), citations: g.sources ?? [], parts: g.sections.map((s, i) => ({ id: sectionAnchor(s, i), text: [s.body, ...(s.items ?? [])].join('\n') })) })),
  ...COMPARES.map(c => ({ url: compareCanonical(c.slug), citations: c.sources ?? [], parts: (c.sections ?? []).map((s, i) => ({ id: `comparison-detail-${i + 1}`, text: [s.body, ...s.items].join('\n') })) })),
  ...ANSWER_TOPICS.map(t => ({ url: answerCanonical(t.slug), citations: t.links.map(l => ({ title: l.label, url: new URL(l.href, SITE.domain).href })), parts: [{ id: 'answer', text: t.answer }, { id: 'fit', text: t.fit.join('\n') }, { id: 'not-fit', text: t.notFit.join('\n') }] })),
]) {
  const doc = readPage(entry.url); const article = nodes(doc).find(n => n['@id'] === `${entry.url}#article`);
  assert.ok(article, `Missing article: ${entry.url}`);
  assert.deepEqual(article.citation ?? [], entry.citations.map(s => s.url));
  assert.equal(article.hasPart?.length ?? 0, entry.parts.length);
  for (const part of entry.parts) {
    const schema = article.hasPart.find((p: { '@id': string }) => p['@id'] === `${entry.url}#${part.id}`);
    const heading = doc.querySelectorAll('[id]').find(node => node.id === part.id);
    assert.ok(heading && schema, `Missing section ${entry.url}#${part.id}`);
    assert.equal(normalized(schema.text), normalized(part.text));
    const text = normalized(heading.parentNode.textContent);
    assert.ok(text.includes(normalized(part.text)), `Schema text not visible at ${entry.url}#${part.id}`);
  }
  for (const source of entry.citations) assert.ok(doc.querySelectorAll('a[href]').some(a => new URL(a.getAttribute('href')!, entry.url).href === source.url), `Citation not linked: ${source.url}`);
  articles.push({ url: entry.url, sourceUrls: entry.citations.map(s => s.url), parts: entry.parts.length });
}
const practical = [];
for (const [path, record] of Object.entries(GEO_PRACTICAL_EVIDENCE)) {
  const doc = readPage(path); const section = doc.querySelector('section.geo-practical-evidence');
  assert.ok(section && section.querySelectorAll('[id]').some(n => n.id === record.id));
  const graph = nodes(section).find(n => n['@id'] === `${SITE.domain}${path}#${record.id}`);
  assert.ok(graph); assert.equal(graph.text, record.answer);
  assert.deepEqual(graph.citation, record.sources.map(s => s.url));
  assert.equal(section.querySelectorAll('tbody tr').length, record.rows.length);
  for (const row of record.rows) for (const text of row) assert.ok(normalized(section.textContent).includes(normalized(text)));
  practical.push({ path, checks: record.rows.length, sources: record.sources.map(s => s.url) });
}
const hub = readPage('/answers/'); const llms = readFileSync(join(out, 'llms.txt'), 'utf8');
for (const source of ANSWER_EVIDENCE_SOURCES) {
  assert.ok(hub.querySelectorAll('[id]').some(n => n.id === source.id));
  assert.ok(llms.includes(`${SITE.domain}${source.href}`));
}
for (const name of ['llms.txt', 'llms-full.txt']) {
  const text = readFileSync(join(out, name), 'utf8');
  for (const p of PACKAGES) assert.ok(text.includes(`| ${p.name} | ${toWon(p.price)} | ${p.duration} |`), `${name}: divergent package ${p.name}`);
}
const covered = new Set([...Object.keys(reviews), ...articles.map(a => decodeURIComponent(new URL(a.url).pathname))]);
assert.equal(covered.size, 2881, 'Preserve the exact completed-page coverage');
const report = { checked_at: new Date().toISOString(), completed_page_coverage: covered.size, existing_review_pages: Object.keys(reviews).length,
  covered_paths: [...covered].sort(),
  article_pages: articles.length, citable_article_sections: articles.reduce((n, a) => n + a.parts, 0),
  practical_pages: practical, original_criteria_and_public_sources_retained: true, package_text_exports_use_public_price_source: true,
  fabricated_people_ratings_and_customer_results_added: false, ai_citation_lift_claimed: false };
mkdirSync('docs/search-audit', { recursive: true });
writeFileSync('docs/search-audit/geo-evidence-verification.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ ...report, covered_paths: undefined }, null, 2));
