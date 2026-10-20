import fs from 'node:fs';
import path from 'node:path';

// Dedicated namespace submission. Existing site-wide scripts, manifests and
// automatic deployment hooks remain untouched.
const args=process.argv.slice(2);
const outDir=args.find(a=>a.startsWith('--out='))?.slice(6)||'out';
const reportDir=args.find(a=>a.startsWith('--reports='))?.slice(10)||'_reumlab_new_pages_reports/submissions';
const verificationFile=args.find(a=>a.startsWith('--verification='))?.slice(15);
const submit=args.includes('--submit');
const origin='https://reumlab.com';
const xml=fs.readFileSync(path.join(outDir,'sitemap-development-agency.xml'),'utf8');
const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>new URL(m[1]).href);
if(!urls.length||new Set(urls).size!==urls.length||urls.some(u=>new URL(u).origin!==origin||!new URL(u).pathname.startsWith('/development-agency/')))throw new Error('Sitemap contains missing, duplicate or out-of-scope URLs');
const candidates=fs.readdirSync('public').filter(f=>/^[a-f0-9]{8,128}\.txt$/i.test(f)).filter(f=>fs.readFileSync(path.join('public',f),'utf8').trim()===f.slice(0,-4));
if(candidates.length!==1)throw new Error('Cannot identify the existing public IndexNow ownership file unambiguously');
const key=candidates[0].slice(0,-4),keyLocation=origin+'/'+candidates[0];
if(!submit){
  console.log(JSON.stringify({mode:'DRY_RUN',host:'reumlab.com',urls:urls.length,newNamespaceOnly:true,keyFilePresent:true,externalRequests:0}));
  process.exit(0);
}
if(process.env.CONTEXT&&process.env.CONTEXT!=='production')throw new Error('Preview contexts cannot submit production URLs');
if(!verificationFile)throw new Error('A successful production HTTP fingerprint audit is required');
const verification=JSON.parse(fs.readFileSync(verificationFile,'utf8'));
const verified=new Map<string,any>(verification.rows?.map((r:any)=>[r.canonical,r])||[]);
if(verification.origin!==origin||verification.status!=='PASS'||Date.now()-Date.parse(verification.checkedAt)>86400000)throw new Error('Production verification is missing, stale or not PASS');
if(urls.some(u=>!verified.get(u)?.pass))throw new Error('A new URL has not passed production verification');
const publicKey=await fetch(keyLocation,{signal:AbortSignal.timeout(30000)});
if(publicKey.status!==200||(await publicKey.text()).trim()!==key)throw new Error('Published ownership key does not match');
const publicMap=await fetch(origin+'/sitemap-development-agency.xml',{signal:AbortSignal.timeout(30000)});
if(publicMap.status!==200||(await publicMap.text())!==xml)throw new Error('Production sitemap differs from the verified local export');
fs.mkdirSync(reportDir,{recursive:true});
const manifestFile=path.join(reportDir,'indexnow-namespace-manifest.json');
const manifest=fs.existsSync(manifestFile)?JSON.parse(fs.readFileSync(manifestFile,'utf8')):{};
let failed=false;
for(const endpoint of ['https://searchadvisor.naver.com/indexnow','https://www.bing.com/indexnow']){
  manifest[endpoint]||={};
  const changed=urls.filter(u=>manifest[endpoint][u]?.fingerprint!==verified.get(u).fingerprint);
  for(let i=0;i<changed.length;i+=1000){
    const urlList=changed.slice(i,i+1000), submittedAt=new Date().toISOString();
    const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json; charset=utf-8'},body:JSON.stringify({host:'reumlab.com',key,keyLocation,urlList}),signal:AbortSignal.timeout(30000)});
    const responseBody=await response.text();
    const accepted=response.status===200||response.status===202;
    const receipt={submittedAt,endpoint,urlList,status:response.status,responseBody,state:response.status===200?'ACCEPTED_INDEXING_NOT_CONFIRMED':response.status===202?'ACCEPTED_KEY_VALIDATION_PENDING':'FAILED'};
    fs.appendFileSync(path.join(reportDir,'indexnow-namespace-receipts.jsonl'),JSON.stringify(receipt)+'\n');
    if(accepted)for(const url of urlList)manifest[endpoint][url]={fingerprint:verified.get(url).fingerprint,submittedAt,status:response.status};
    else failed=true;
    fs.writeFileSync(manifestFile,JSON.stringify(manifest,null,2)+'\n');
    console.log(JSON.stringify({endpoint,urls:urlList.length,status:response.status,state:receipt.state}));
  }
  if(!changed.length)console.log(JSON.stringify({endpoint,urls:0,state:'NO_UNSUBMITTED_CHANGES'}));
}
process.exitCode=failed?1:0;
