import fs from 'node:fs';
import path from 'node:path';
import { agencyHub, agencyPages } from '../../lib/development-agency/catalog';
import { agencyHref, assertAgencyPages } from '../../lib/development-agency/types';
import { fiveGrams, sentenceUnits, gramPostings, exactOverlaps } from './verify.mts';

// Source audit supplements the rendered-HTML and browser checks; it does not
// label unbuilt pages deployed, submitted or indexed.
const baseline = process.argv[2];
const output = process.argv[3];
if (!baseline || !output) throw new Error('Usage: source-audit.mts <existing-pages.json> <report.json>');
const old = JSON.parse(fs.readFileSync(baseline, 'utf8').replace(/^\uFEFF/, ''));
const pages = [agencyHub, ...agencyPages];
assertAgencyPages(pages);
const font = JSON.parse(fs.readFileSync('public/fonts/subset.json', 'utf8'));
const supported = new Set<number>();
for (const part of font.unicode_range.split(',')) {
  const m = /U\+([0-9a-f]+)(?:-([0-9a-f]+))?/i.exec(part);
  if (m) for (let n = parseInt(m[1],16); n <= parseInt(m[2] || m[1],16); n++) supported.add(n);
}
const records = [
  ...old.map((p: any) => ({url: p.url, text: p.body, title:p.title, description:p.description, h1:Array.isArray(p.h1)?p.h1[0]:p.h1})),
  ...pages.map(p => ({
    url:'https://reumlab.com'+agencyHref(p), title:p.title,description:p.description,h1:p.h1,
    text:[p.h1,p.summary,...p.sections.flatMap(s=>[s.heading,...s.fields.flatMap(f=>p[f])]),
      ...p.faq.flatMap(f=>[f.question,f.answer]),...p.relatedRoutes.flatMap(l=>[l.label,l.reason]),
      p.ctaContext,...p.evidenceSources.flatMap(s=>[s.title,s.use])].join('\n'),
  })),
].map(r=>({...r,grams:fiveGrams(r.text),sentences:sentenceUnits(r.text)}));
const postings = gramPostings(records.map(r=>r.grams));
const sentenceOwners = new Map<string, Set<number>>();
for (let i=0;i<records.length;i++) for (const s of records[i].sentences) {
  if (!sentenceOwners.has(s)) sentenceOwners.set(s,new Set());
  sentenceOwners.get(s)!.add(i);
}
const urls = new Set(records.map(r=>new URL(r.url).href));
const clusterOwners = new Map<string,string>();
for (const p of pages) for (const id of p.clusterIds) {
  if (clusterOwners.has(id)) throw new Error(`Cluster assigned twice: ${id}`);
  clusterOwners.set(id,agencyHref(p));
}
let measuredPairs = 0;
const rows = pages.map((p,k)=>{
  const i=old.length+k,r=records[i], overlaps=exactOverlaps(r.grams,postings,records.length);
  let nearest={url:'',similarity:0};
  records.forEach((other,j)=>{
    if (i===j) return;
    const overlap=overlaps[j], union=r.grams.size+other.grams.size-overlap;
    const similarity=union?overlap/union:1;
    if (similarity>nearest.similarity) nearest={url:other.url,similarity};
    measuredPairs++;
  });
  const frequencies = new Map<string,number>();
  for (const s of r.sentences) frequencies.set(s,(frequencies.get(s)||0)+1);
  const unique = r.sentences.filter(s=>sentenceOwners.get(s)!.size===1&&frequencies.get(s)===1).length;
  const korean=(r.text.match(/[가-힣]/g)||[]).length, nonspace=[...r.text.replace(/\s/gu,'')].length;
  const outsideFont=[...new Set([...JSON.stringify(p)].filter(c=>/[가-힣]/.test(c)&&!supported.has(c.codePointAt(0)!)))];
  const badLinks=p.relatedRoutes.filter(l=>!urls.has(new URL(l.href,'https://reumlab.com').href));
  const metadataCollisions=records.filter((other,j)=>i!==j&&(other.title===r.title||other.description===r.description||other.h1===r.h1)).map(o=>o.url);
  const uniqueSentenceRatio=unique/r.sentences.length;
  const placeholder=/\b(?:TODO|TBD|lorem\s+ipsum|placeholder)\b|추후\s*작성|내용\s*준비\s*중/iu.test(r.text);
  const status=korean>=3500&&nonspace>=3500&&p.sections.length>=12&&p.faq.length>=6&&uniqueSentenceRatio>=.65&&nearest.similarity<.72&&!outsideFont.length&&!badLinks.length&&!metadataCollisions.length&&!placeholder?'PASS':'FAIL';
  return {url:r.url,clusterIds:p.clusterIds,korean,nonspace,sections:p.sections.length,faq:p.faq.length,uniqueSentenceRatio,nearest,outsideFont,badLinks,metadataCollisions,placeholder,status};
});
const report={checkedAt:new Date().toISOString(),scope:'Registered completed source manuscripts versus all existing canonical main texts and each other. HTML, HTTP, runtime and deployment are separate checks.',status:rows.every(r=>r.status==='PASS')?'PASS':'FAIL',existing:old.length,registered:pages.length,measuredPairs,rows};
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,rows:rows.filter(r=>r.status!=='PASS')}));
process.exitCode=report.status==='PASS'?0:1;
