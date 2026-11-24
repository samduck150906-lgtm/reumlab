import assert from 'node:assert/strict';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'node-html-parser';
import { ENGLISH_PAGES, ENGLISH_INDEXABLE, LANGUAGE_PAIRS, englishUrl, englishPackages, krw, languageAlternates } from '../lib/english';
// @ts-ignore — shared build helper
import { readSitemapLocs } from './read-sitemap.mjs';

const out=process.argv[2]??'out';const sitemap=new Set(readSitemapLocs(out));
const read=(path:string)=>parse(readFileSync(join(out,path.slice(1),'index.html'),'utf8'));
const clean=(value:string)=>value.replace(/\s+/g,'');
const graph=(doc:ReturnType<typeof parse>)=>doc.querySelectorAll('script[type="application/ld+json"]').flatMap(s=>{const j=JSON.parse(s.textContent);return j['@graph']??[j];});
let sections=0,faqs=0;
for(const page of ENGLISH_PAGES){
  const doc=read(page.path);const url=englishUrl(page.path);const main=doc.querySelector('main');assert.ok(main);
  assert.equal(doc.querySelector('html')?.getAttribute('lang'),'en');
  assert.equal(doc.querySelectorAll('h1').length,1);assert.equal(doc.querySelector('h1')?.textContent,page.h1);
  assert.equal(doc.querySelector('title')?.textContent,page.title);
  assert.equal(doc.querySelector('meta[name="description"]')?.getAttribute('content'),page.description);
  assert.equal(doc.querySelector('link[rel="canonical"]')?.getAttribute('href'),url);
  assert.equal(doc.querySelector('meta[property="og:locale"]')?.getAttribute('content'),'en_US');
  assert.equal(sitemap.has(url),!page.noindex);
  assert.equal(doc.querySelector('meta[name="robots"]')?.getAttribute('content')?.includes('noindex'),!!page.noindex);
  assert.ok((main.textContent.match(/[가-힣]/g)??[]).length<=10,'Korean body unexpectedly present: '+page.path);
  const nodes=graph(doc);const node=nodes.find(n=>n['@id']===url+'#webpage');assert.ok(node);
  assert.equal(node.inLanguage,'en');assert.equal(node.abstract,page.answer);
  assert.equal(node.hasPart.length,page.sections.length);
  for(const part of node.hasPart){
    const id=part['@id'].split('#')[1];const heading=doc.querySelector(`[id="${id}"]`);assert.ok(heading);
    assert.ok(clean(heading.parentNode.textContent).includes(clean(part.text)),'Invisible structured text: '+part['@id']);sections++;
  }
  for(const f of page.faqs){assert.ok(main.textContent.includes(f.q)&&main.textContent.includes(f.a));faqs++;}
  const actual=Object.fromEntries(doc.querySelectorAll('link[rel="alternate"][hreflang]').map(n=>[n.getAttribute('hreflang'),n.getAttribute('href')]));
  assert.deepEqual(actual,languageAlternates(page));
  for(const a of doc.querySelectorAll('a[href]')){
    const href=a.getAttribute('href')!;if(!href.startsWith('/'))continue;
    const p=new URL(href,'https://reumlab.com');assert.ok(existsSync(join(out,decodeURIComponent(p.pathname).slice(1),p.pathname.endsWith('/')?'index.html':'')),'Broken English link: '+href);
  }
  for(const source of page.sources)assert.ok(doc.querySelectorAll('a[href]').some(a=>a.getAttribute('href')===source.href));
}
for(const page of LANGUAGE_PAIRS){
  const doc=read(page.korean);const actual=Object.fromEntries(doc.querySelectorAll('link[rel="alternate"][hreflang]').map(n=>[n.getAttribute('hreflang'),n.getAttribute('href')]));
  assert.deepEqual(actual,languageAlternates(page));
  assert.equal(doc.querySelector('html')?.getAttribute('lang'),'ko');
  assert.equal(doc.querySelector('link[rel="canonical"]')?.getAttribute('href'),englishUrl(page.korean));
}
const pricing=read('/en/pricing/');const rows=pricing.querySelectorAll('tbody tr');assert.equal(rows.length,englishPackages.length);
for(const p of englishPackages){const row=rows.find(r=>r.getAttribute('data-package')===p.name);assert.ok(row);assert.ok(row.textContent.includes(krw(p.price)));assert.ok(row.textContent.includes(p.englishDuration));}
const contact=read('/en/contact/');const form=contact.querySelector('form[name="en-project-inquiry"]');assert.ok(form);
assert.equal(form.getAttribute('method'),'POST');assert.equal(form.getAttribute('data-netlify'),'true');assert.equal(form.getAttribute('netlify-honeypot'),'bot-field');
assert.equal(form.getAttribute('action'),'/en/inquiry-received/');assert.equal(form.querySelector('input[name="email"]')?.getAttribute('type'),'email');
for(const selector of ['input[name="name"]','input[name="email"]','textarea[name="project-brief"]','input[name="privacy-consent"]'])assert.ok(form.querySelector(selector)?.hasAttribute('required'));
const exported=readFileSync(join(out,'en/llms.txt'),'utf8');const root=readFileSync(join(out,'llms.txt'),'utf8');const full=readFileSync(join(out,'llms-full.txt'),'utf8');
for(const p of ENGLISH_INDEXABLE){assert.ok(exported.includes(p.answer)&&root.includes(englishUrl(p.path))&&full.includes(p.answer));}
const report={checked_at:new Date().toISOString(),passed:true,english_indexable_pages:ENGLISH_INDEXABLE.length,noindex_confirmation_pages:1,reciprocal_language_pairs:LANGUAGE_PAIRS.length,citable_sections:sections,visible_faq_answers:faqs,price_rows:rows.length,english_inquiry_form:'en-project-inquiry',public_sources_linked:true,legacy_preservation_verification:'separate release snapshot comparison',actual_new_indexing_or_ai_citation_gain_claimed:false};
mkdirSync('docs/search-audit',{recursive:true});writeFileSync('docs/search-audit/english-verification.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
