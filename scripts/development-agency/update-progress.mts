import fs from 'node:fs';
import path from 'node:path';
import { agencyHub, agencyPages } from '../../lib/development-agency/catalog';
import { agencyHref } from '../../lib/development-agency/types';

const reports=path.resolve('_reumlab_new_pages_reports');
const queueFile=path.join(reports,'expanded-build-queue.json');
const stateFile=path.join(reports,'work-state.json');
const queue=JSON.parse(fs.readFileSync(queueFile,'utf8'));
const state=JSON.parse(fs.readFileSync(stateFile,'utf8'));
const byCluster=new Map(agencyPages.flatMap(p=>p.clusterIds.map(id=>[id,p] as const)));
const stamp=new Date().toISOString();
for (const item of queue) {
  const direct=byCluster.get(item.cluster_id);
  const merged=byCluster.get(item['동의어병합대상']);
  const page=direct||merged;
  if (page) {
    item['현재작업상태']=direct?'AUTHORED_AWAITING_RELEASE_QA':'MERGED_TO_AUTHORED_CANONICAL';
    item['실제작성경로']=agencyHref(page);
    item['최종검색의도']=page.searchIntent;
    item['관련클러스터']=page.clusterIds.join(' | ');
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
const created=[agencyHub,...agencyPages].map(p=>({url:'https://reumlab.com'+agencyHref(p),clusterIds:p.clusterIds,primaryKeyword:p.primaryKeyword,searchIntent:p.searchIntent,industry:p.industry,serviceAxis:p.serviceAxis,sourceStatus:'REGISTERED_AUTHORED',deploymentStatus:'NOT_DEPLOYED',searchSubmissionStatus:'NOT_SUBMITTED'}));
fs.writeFileSync(path.join(reports,'authored-pages-progress.json'),JSON.stringify({updatedAt:stamp,pages:created},null,2)+'\n');
console.log(JSON.stringify(state.sourceProgress));
