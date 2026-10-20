import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { contentFingerprint } from '../content-manifest.mjs';

const [base,outDir,reportFile]=process.argv.slice(2);
if(!base||!outDir||!reportFile)throw new Error('Provide base URL, local export and report path');
const origin=new URL(base).origin;
const xml=fs.readFileSync(path.join(outDir,'sitemap-development-agency.xml'),'utf8');
const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
if(!urls.length)throw new Error('New sitemap has no URLs');
const rows:any[]=[];
for(let start=0;start<urls.length;start+=4){
  await Promise.all(urls.slice(start,start+4).map(async canonical=>{
    const pathname=new URL(canonical).pathname;
    const url=origin+pathname;
    const expected=fs.readFileSync(path.join(outDir,decodeURIComponent(pathname),'index.html'),'utf8');
    const response=await fetch(url,{signal:AbortSignal.timeout(30000),redirect:'follow'});
    const html=await response.text();
    const doc=parse(html);
    const actualCanonical=doc.querySelector('link[rel="canonical"]')?.getAttribute('href')||'';
    const xRobots=response.headers.get('x-robots-tag')||'';
    const robots=doc.querySelector('meta[name="robots"]')?.getAttribute('content')||'';
    const fingerprint=contentFingerprint(html), expectedFingerprint=contentFingerprint(expected);
    rows.push({canonical,url,status:response.status,finalUrl:response.url,contentType:response.headers.get('content-type'),actualCanonical,robots,xRobots,expectedFingerprint,fingerprint,equivalent:fingerprint===expectedFingerprint,pass:response.status===200&&new URL(actualCanonical).href===new URL(canonical).href&&!/noindex/i.test(robots+' '+xRobots)&&fingerprint===expectedFingerprint});
  }));
}
const sitemapResponse=await fetch(origin+'/sitemap-development-agency.xml',{signal:AbortSignal.timeout(30000)});
const actualXml=await sitemapResponse.text();
const sitemap={status:sitemapResponse.status,contentType:sitemapResponse.headers.get('content-type'),exactBody:actualXml===xml};
const result={checkedAt:new Date().toISOString(),origin,status:rows.every(r=>r.pass)&&sitemap.status===200&&sitemap.exactBody?'PASS':'FAIL',count:rows.length,sitemap,rows:rows.sort((a,b)=>a.canonical.localeCompare(b.canonical))};
fs.mkdirSync(path.dirname(reportFile),{recursive:true});fs.writeFileSync(reportFile,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({...result,rows:result.rows.filter(r=>!r.pass)}));
process.exitCode=result.status==='PASS'?0:1;
