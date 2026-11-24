import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { EnglishSite } from '../components/EnglishSite';
import { ENGLISH_PAGES, LANGUAGE_PAIRS, englishUrl, englishTextExport } from '../lib/english';
import pairs from '../content/language-pairs.json';

const out=process.argv[2]??'out';
mkdirSync(join(out,'assets'),{recursive:true});
for(const asset of ['assets/english.css','assets/english.js','english-og.png'])copyFileSync(join('public',asset),join(out,asset));
for(const page of ENGLISH_PAGES){
  const directory=join(out,page.path.slice(1));mkdirSync(directory,{recursive:true});
  writeFileSync(join(directory,'index.html'),'<!DOCTYPE html>'+renderToStaticMarkup(React.createElement(EnglishSite,{page}))+'\n');
}
for(const page of LANGUAGE_PAIRS){
  if(pairs[page.korean as keyof typeof pairs]!==page.path)throw new Error('Language map mismatch: '+page.path);
  const file=join(out,page.korean.slice(1),'index.html');let html=readFileSync(file,'utf8');
  html=html.replace(/<link\b(?=[^>]*\bhreflang=)[^>]*>/gi,'');
  const tags=`<link rel="alternate" hreflang="ko" href="${englishUrl(page.korean)}"/><link rel="alternate" hreflang="en" href="${englishUrl(page.path)}"/>`;
  html=html.replace('</head>',tags+'</head>');writeFileSync(file,html);
}
console.log(`English publication: ${ENGLISH_PAGES.length} pages, ${LANGUAGE_PAIRS.length} reciprocal language pairs`);
writeFileSync(join(out,'en','llms.txt'),englishTextExport());
