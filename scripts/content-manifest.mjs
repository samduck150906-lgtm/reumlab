/**
 * Meaningful page changes, independent of Next build IDs and build time.
 * Baseline is explicitly promoted after a verified release; builds never overwrite it.
 * node scripts/content-manifest.mjs [outDir]
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { parse } from 'node-html-parser';
import { readSitemapXml } from './read-sitemap.mjs';

export function contentFingerprint(html) {
  const document = parse(html);
  const body = document.querySelector('main') ?? document.querySelector('article') ?? document.querySelector('body');
  // UI assets, hydration and common navigation aren't editorial changes.
  const content = parse(body?.innerHTML ?? '');
  content.querySelectorAll('script,style,noscript,nav,footer').forEach(n => n.remove());
  const clean = s => String(s ?? '').replace(/\s+/g, ' ').trim();
  const schema = document.querySelectorAll('script[type="application/ld+json"]').map(n => {
    try { return JSON.parse(n.textContent); } catch { return n.textContent; }
  });
  return crypto.createHash('sha256').update(JSON.stringify({
    title: clean(document.querySelector('title')?.textContent),
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
    robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '',
    body: clean(content.textContent),
    links: content.querySelectorAll('a[href]').map(n => [clean(n.textContent), n.getAttribute('href')]),
    schema,
  })).digest('hex');
}

export function syncSitemapIndexLastmod(outDir) {
  const indexPath = path.join(outDir, 'sitemap.xml');
  const index = fs.readFileSync(indexPath, 'utf8');
  if (!index.includes('<sitemapindex')) return;
  const updated = index.replace(/<sitemap>([\s\S]*?)<\/sitemap>/g, (block, inner) => {
    const location = /<loc>(.*?)<\/loc>/.exec(inner)?.[1];
    if (!location) return block;
    const child = fs.readFileSync(path.join(outDir, path.basename(new URL(location).pathname)), 'utf8');
    const dates = [...child.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].map(match => match[1]);
    if (!dates.length) return block.replace(/<lastmod>.*?<\/lastmod>/, '');
    if (dates.some(date => !Number.isFinite(Date.parse(date)))) throw new Error(`Invalid child sitemap lastmod: ${location}`);
    const latest = dates.reduce((a, b) => Date.parse(a) >= Date.parse(b) ? a : b);
    const tag = `<lastmod>${latest}</lastmod>`;
    return /<lastmod>/.test(block)
      ? block.replace(/<lastmod>.*?<\/lastmod>/, tag)
      : block.replace('</sitemap>', `${tag}</sitemap>`);
  });
  fs.writeFileSync(indexPath, updated);
}

export function buildManifest(outDir='out') {
  const baselinePath='config/content-manifest.json';
  const baseline=fs.existsSync(baselinePath)?JSON.parse(fs.readFileSync(baselinePath,'utf8')):{};
  const xml=readSitemapXml(outDir);
  const current={}; const changed=[]; const now=new Date().toISOString();
  for(const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const url=/<loc>(.*?)<\/loc>/.exec(block[1])?.[1];
    if(!url)continue;
    const pathname=decodeURIComponent(new URL(url).pathname);
    const file=path.join(outDir,pathname.replace(/^\//,''),'index.html');
    if(!fs.existsSync(file))throw new Error(`Missing canonical HTML: ${url}`);
    const hash=contentFingerprint(fs.readFileSync(file,'utf8'));
    const old=baseline[url];
    const same=old?.hash===hash;
    current[url]={hash,lastmod:same?old.lastmod:now};
    if(!same)changed.push({url,action:old?'changed':'added',before:old?.hash??null,after:hash});
  }
  for(const url of Object.keys(baseline))if(!current[url])changed.push({url,action:'removed',before:baseline[url].hash,after:null});
  for(const name of fs.readdirSync(outDir).filter(n=>/^sitemap.*\.xml$/.test(n))){
    const file=path.join(outDir,name);
    const source=fs.readFileSync(file,'utf8');
    const updated=source.replace(/<url>([\s\S]*?)<\/url>/g,(all,inner)=>{
      const url=/<loc>(.*?)<\/loc>/.exec(inner)?.[1];
      if(!current[url])return all;
      return all.replace(/<lastmod>.*?<\/lastmod>/,`<lastmod>${current[url].lastmod}</lastmod>`);
    });
    fs.writeFileSync(file,updated);
  }
  // split-sitemap runs before the content fingerprint pass. Its index dates must
  // follow the now-final child dates instead of retaining the pre-pass git dates.
  syncSitemapIndexLastmod(outDir);
  fs.mkdirSync('docs/execution-20261020',{recursive:true});
  fs.writeFileSync('docs/execution-20261020/content-manifest-after.json',JSON.stringify(current,null,2)+'\n');
  fs.writeFileSync('docs/execution-20261020/content-changes.json',JSON.stringify(changed,null,2)+'\n');
  console.log(`Content manifest: ${Object.keys(current).length} URLs; ${changed.length} meaningful changes`);
  return {current,changed};
}
if(process.argv[1] && path.resolve(process.argv[1])===path.resolve('scripts/content-manifest.mjs')) buildManifest(process.argv[2]);
