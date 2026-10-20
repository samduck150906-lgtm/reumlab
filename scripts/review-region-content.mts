import fs from 'node:fs';
import { REGION_SERVICE_PROFILES } from '../lib/region-service.ts';

const reviews=Object.entries(REGION_SERVICE_PROFILES).map(([key,p])=>{
  const [region,service]=key.split(':');
  return {
    url:`https://reumlab.com/${service}/${region}/`,
    type:'regional service',
    source:['lib/pseo.ts','lib/region-service.ts'],
    intent:p.faq.q,
    indexPolicy:'retain existing index',
    findings:'지역별 고객 경험·수요 통계나 비용 절감 단정을 뒷받침할 자료가 없어 현재 확인 가능한 사업장 및 진행 조건과 해당 서비스의 범위 판단으로 교정.',
    changes:{lead:p.lead,faq:p.faq},
    evidence:{businessLocation:'경기도 화성시 동탄구 동탄첨단산업1로 58, 307호',basis:'현재 운영 SITE 정본; 가상 지점 추가 없음. 각 예시는 설계·상담 준비 기준이며 수행 실적으로 표시하지 않음.'},
    reviewStatus:'individual source content reviewed; final build and live checks recorded separately',
    pendingFacts:['고객별 외부 API 권한·현장 작업·출장·자료 이관 범위는 견적 전에 확인'],
  };
});
fs.writeFileSync('docs/execution-20261020/regions-review.json',JSON.stringify({reviewedAt:'2026-10-20',count:reviews.length,reviews},null,2)+'\n');
console.log(`Regional content reviews: ${reviews.length}`);
