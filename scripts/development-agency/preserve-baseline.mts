import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { contentFingerprint } from '../content-manifest.mjs';

const [sourceRepo, baselineOut, currentOut, inventoryFile, reportFile]=process.argv.slice(2).map(p=>path.resolve(p));
if (!reportFile) throw new Error('Provide source repo, baseline export, current export, inventory JSON, report JSON');
const read=(p:string)=>fs.readFileSync(p,'utf8').replace(/^\uFEFF/,'');
const sha=(bytes:Buffer|string)=>crypto.createHash('sha256').update(bytes).digest('hex');
const baseline=JSON.parse(read(path.join(sourceRepo,'_reumlab_new_pages_reports/existing-files-before.json')));
const sourceChanges=baseline.trackedFiles.flatMap((r:any)=>{
  const file=path.join(sourceRepo,r.path);
  if (!fs.existsSync(file)) return [{path:r.path,status:'MISSING',expected:r.sha256}];
  const actual=sha(fs.readFileSync(file));
  return actual===r.sha256?[]:[{path:r.path,status:'CHANGED',expected:r.sha256,actual}];
});
const inventory=JSON.parse(read(inventoryFile));
const pages=inventory.map((p:any)=>{
  const relative=path.join(decodeURIComponent(new URL(p.url).pathname).replace(/^\//,''),'index.html');
  const before=read(path.join(baselineOut,relative)),after=read(path.join(currentOut,relative));
  const beforeFingerprint=contentFingerprint(before),afterFingerprint=contentFingerprint(after);
  return {url:p.url,baseline:beforeFingerprint,current:afterFingerprint,editorialEqual:beforeFingerprint===afterFingerprint,completeHtmlByteEqual:sha(before)===sha(after)};
});
const protectedFiles=fs.readdirSync(baselineOut).filter(f=>/^sitemap.*\.xml$/.test(f)||['robots.txt','rss.xml','feed.xml','llms.txt','llms-full.txt'].includes(f));
const discovery=protectedFiles.map(file=>{
  const a=sha(fs.readFileSync(path.join(baselineOut,file)));
  const target=path.join(currentOut,file);
  const b=fs.existsSync(target)?sha(fs.readFileSync(target)):null;
  return {file,baseline:a,current:b,equal:a===b};
});
const failures=[...sourceChanges,...pages.filter((p:any)=>!p.editorialEqual),...discovery.filter(p=>!p.equal)];
const result={checkedAt:new Date().toISOString(),status:failures.length?'FAIL':'PASS',sourceFiles:baseline.trackedFiles.length,sourceChanges,existingCanonicals:pages.length,editorialEquivalent:pages.filter((p:any)=>p.editorialEqual).length,completeHtmlByteEqual:pages.filter((p:any)=>p.completeHtmlByteEqual).length,scope:'Original tracked file SHA-256, existing canonical title/description/canonical/robots/main body/links/JSON-LD fingerprints, and existing sitemap/robots/feed/llms bytes. Build IDs and asset references are not editorial fingerprints.',discovery,pages};
fs.mkdirSync(path.dirname(reportFile),{recursive:true});
fs.writeFileSync(reportFile,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({...result,pages:pages.filter((p:any)=>!p.editorialEqual)}));
process.exitCode=failures.length?1:0;
