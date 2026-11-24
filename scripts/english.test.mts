import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {parse} from 'node-html-parser';
import {EnglishSite,englishGraph} from '../components/EnglishSite';
import {ENGLISH_PAGES,ENGLISH_INDEXABLE,LANGUAGE_PAIRS,englishPackages,englishTextExport,languageAlternates} from '../lib/english';
import {PACKAGES} from '../lib/pricing';
import pairs from '../content/language-pairs.json';

test('language alternatives exist only for actual equivalents, with independent self canonicals',()=>{
  assert.equal(ENGLISH_PAGES.length,16);assert.equal(ENGLISH_INDEXABLE.length,15);assert.equal(LANGUAGE_PAIRS.length,9);
  assert.equal(new Set(ENGLISH_PAGES.map(p=>p.path)).size,16);
  for(const p of LANGUAGE_PAIRS){assert.equal(pairs[p.korean as keyof typeof pairs],p.path);assert.notEqual(languageAlternates(p).en,languageAlternates(p).ko);}
  for(const p of ENGLISH_PAGES.filter(p=>!p.korean))assert.deepEqual(languageAlternates(p),{});
});
test('English price table preserves every public package value and VAT currency context',()=>{
  assert.deepEqual(englishPackages.map(p=>[p.name,p.price,p.duration]),PACKAGES.map(p=>[p.name,p.price,p.duration]));
  const page=ENGLISH_PAGES.find(p=>p.widget==='pricing')!;
  const doc=parse(renderToStaticMarkup(React.createElement(EnglishSite,{page})));
  assert.equal(doc.querySelectorAll('tbody tr').length,8);assert.ok(doc.textContent.includes('South Korean won'));assert.ok(doc.textContent.includes('include VAT'));
});
test('English text exports omit the noindex confirmation page and contain the visible FAQ answers',()=>{
  const text=englishTextExport();assert.ok(!text.includes('inquiry-received/'));
  for(const p of ENGLISH_INDEXABLE)for(const f of p.faqs)assert.ok(text.includes(f.a));
});
test('HTML and structured data safely escape a hostile future content string',()=>{
  const page=structuredClone(ENGLISH_PAGES[0]);page.answer='</script><script>alert("unsafe")</script>';
  const doc=parse(renderToStaticMarkup(React.createElement(EnglishSite,{page})));
  assert.equal(doc.querySelectorAll('script').length,2);
  const script=doc.querySelector('script[type="application/ld+json"]')!;
  assert.deepEqual(JSON.parse(script.textContent),englishGraph(page));
  assert.equal(doc.querySelector('#short-answer')?.textContent,page.answer);
});
