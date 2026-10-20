import fs from 'node:fs';
import path from 'node:path';
import { agencyHub, agencyPages } from '../../lib/development-agency/catalog';
import { agencyHref } from '../../lib/development-agency/types';
import { sourceDigest, releaseState, type VerifiedRelease } from './release-state.mts';

const reports=path.resolve('_reumlab_new_pages_reports');
const queueFile=path.join(reports,'expanded-build-queue.json');
const stateFile=path.join(reports,'work-state.json');
const queue=JSON.parse(fs.readFileSync(queueFile,'utf8'));
const state=JSON.parse(fs.readFileSync(stateFile,'utf8'));
const byCluster=new Map(agencyPages.flatMap(p=>p.clusterIds.map(id=>[id,p] as const)));
const stamp=new Date().toISOString();
const ledgerFile=path.join(reports,'verified-release-ledger.json');
const ledger:Record<string,VerifiedRelease>=fs.existsSync(ledgerFile)
  ? JSON.parse(fs.readFileSync(ledgerFile,'utf8')).pages : {};
const statusFor=(page:typeof agencyHub)=>{
  const url='https://reumlab.com'+agencyHref(page);
  const digest=sourceDigest(page,agencyPages);
  return {sourceDigest:digest,...releaseState(digest,ledger[url])};
};
for (const item of queue) {
  const direct=byCluster.get(item.cluster_id);
  const merged=byCluster.get(item['동의어병합대상']);
  const page=direct||merged;
  if (page) {
    item['현재작업상태']=direct?'AUTHORED_AWAITING_RELEASE_QA':'MERGED_TO_AUTHORED_CANONICAL';
    item['실제작성경로']=agencyHref(page);
    item['최종검색의도']=page.searchIntent;
    item['관련클러스터']=page.clusterIds.join(' | ');
    item['배포상태']=statusFor(page).deploymentStatus;
  }
  // No deployed/submitted status is inferred from source registration.
}
const counts=Object.fromEntries([...new Set(queue.map((q:any)=>q['현재작업상태']))].map(status=>[String(status),queue.filter((q:any)=>q['현재작업상태']===status).length]));
state.phase='expanded-content-authoring-and-integration';
state.updatedAt=stamp;
state.next='Continue every outstanding expanded queue item; source audit, rendered build, HTTP/browser QA, production release and search submission are separate completion gates.';
state.completedSourceClusters=[...byCluster.keys()].sort();
state.completedClusters=state.completedClusters||[];
state.sourceProgress={registeredDetailPages:agencyPages.length,registeredHubPages:1,expandedQueueRows:queue.length,queueCounts:counts,nextUnwritten:queue.filter((q:any)=>q['현재작업상태']==='AUTHORING_REQUIRED').slice(0,20).map((q:any)=>q.cluster_id),allRequestedContentComplete:!queue.some((q:any)=>q['현재작업상태']==='AUTHORING_REQUIRED')};
fs.writeFileSync(queueFile,JSON.stringify(queue,null,2)+'\n');
fs.writeFileSync(stateFile,JSON.stringify(state,null,2)+'\n');
const columns=[...new Set(queue.flatMap((row:any)=>Object.keys(row)))];
const quote=(v:unknown)=>`"${String(v??'').replace(/"/g,'""')}"`;
fs.writeFileSync(path.join(reports,'expanded-build-queue.csv'),'\uFEFF'+[columns.map(quote).join(','),...queue.map((r:any)=>columns.map(c=>quote(r[String(c)])).join(','))].join('\n')+'\n');
const created=[agencyHub,...agencyPages].map(p=>({url:'https://reumlab.com'+agencyHref(p),clusterIds:p.clusterIds,primaryKeyword:p.primaryKeyword,searchIntent:p.searchIntent,industry:p.industry,serviceAxis:p.serviceAxis,sourceStatus:'REGISTERED_AUTHORED',...statusFor(p)}));
fs.writeFileSync(path.join(reports,'authored-pages-progress.json'),JSON.stringify({updatedAt:stamp,pages:created},null,2)+'\n');
const classificationFile=path.join(reports,'classification-summary.json');
const classification=JSON.parse(fs.readFileSync(classificationFile,'utf8'));
classification.initialClassificationIsHistorical=true;
classification.currentUserInstruction='최초 보류 2453개도 모두 고유 내용을 조사·작성한다. 같은 의도는 병합하며 품질 검수를 통과한 페이지부터 공개한다.';
classification.currentScope={updatedAt:stamp,...state.sourceProgress,deployedCurrentSource:created.filter(p=>p.deploymentStatus==='DEPLOYED_VERIFIED').length,sourceChangedAfterDeployment:created.filter(p=>p.deploymentStatus==='PREVIOUS_VERSION_DEPLOYED_SOURCE_CHANGED').length};
classification.statusMeaning='counts와 newDetailCanonicals는 최초 비교 이력이다. 현재 작업은 currentScope 및 expanded-build-queue의 현재작업상태를 따른다. 배포와 제출은 실제 운영 검수 원장에 근거한다.';
fs.writeFileSync(classificationFile,JSON.stringify(classification,null,2)+'\n');
console.log(JSON.stringify(state.sourceProgress));
