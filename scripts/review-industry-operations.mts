import { readFileSync, writeFileSync } from 'node:fs';
import { INDUSTRIES } from '../lib/industries';
import { COSTS } from '../lib/cost';
import { SOLUTIONS } from '../lib/solution';
import { SYSTEMS } from '../lib/systems';
import { INDUSTRY_OPERATIONS } from '../lib/industry-operations';
import { SYSTEM_OPERATIONS } from '../lib/system-operations';
import { DEEP_DIVES } from '../lib/deep-dive';

const folder = 'docs/execution-20261020';
const before = JSON.parse(readFileSync(`${folder}/app-cost-solution-before.json`, 'utf8'));
const rows: Record<string, unknown>[] = [];
const errors: string[] = [];
for (const i of INDUSTRIES) {
  const o = INDUSTRY_OPERATIONS[i.slug];
  const c = COSTS.find((x) => x.slug === i.slug);
  const s = SOLUTIONS.find((x) => x.slug === i.slug);
  if (!o || !c || !s) { errors.push(`Missing content: ${i.slug}`); continue; }
  for (const [key, value] of Object.entries(o)) if (value.trim().length < 20) errors.push(`Incomplete ${i.slug}.${key}`);
  for (const kind of ['app', 'cost', 'solution'] as const) {
    const source = kind === 'app' ? 'lib/industries.ts' : `lib/${kind}.ts`;
    const initial = (kind === 'app' ? before.industries : kind === 'cost' ? before.costs : before.solutions).find((x: { slug: string }) => x.slug === i.slug);
    const intent = kind === 'app' ? `${i.ko}: ${i.coreFeatures}의 사용자 흐름·MVP 판단` : kind === 'cost' ? `${i.ko}: 범위별 견적·운영 실비·변경 영향` : `${i.ko}: 모듈·권한·이관·시험 운영·인수인계`;
    rows.push({
      url: `https://reumlab.com/${kind}/${i.slug}/`,
      type: kind, source: [source, 'lib/industry-operations.ts', 'components/IndustryOperationalContent.tsx', `app/${kind}/[industry]/page.tsx`, ...(kind === 'app' && DEEP_DIVES[i.slug] ? ['lib/deep-dive.ts'] : [])],
      intent,
      preserved: kind === 'app' ? { coreFeatures: i.coreFeatures, features: i.features, costRange: i.costRange } : kind === 'cost' ? { tiers: c.tiers, drivers: c.drivers, save: c.save } : { modules: s.modules, roadmap: s.roadmap },
      findings: kind === 'app' ? { missingDetail: ['역할별 접근 범위', '예외 상태', '알림·결제 연동 전제'], specificIssue: o.exception } : kind === 'cost' ? { missingDetail: ['확정 견적 입력', '범위별 포함·추가 항목', '외부 운영비·심사·변경 검수'], specificInput: o.quote } : { missingDetail: ['권한·데이터 흐름', '연동 이용권한', '자료 이관·시험·인수인계'], specificAcceptance: o.acceptance },
      changes: kind === 'app' ? { roles: o.roles, flow: o.flow, exception: o.exception, prerequisites: o.dependency, mvp: s.roadmap[0], expansion: s.roadmap.slice(1), deepDive: DEEP_DIVES[i.slug] ?? null } : kind === 'cost' ? { quoteInputs: o.quote, scopeAnchor: c.tiers[0], separatelyConsidered: c.tiers.slice(1), changeImpact: o.exception, verification: o.acceptance, thirdParty: o.dependency } : { permissions: o.roles, dataFlow: o.flow, migrationInputs: o.quote, testScenarios: o.exception, acceptance: o.acceptance, integrationConditions: o.dependency },
      evidence: { kind: 'editorial_design_criteria_not_customer_outcomes', originalSourceSnapshot: `${folder}/app-cost-solution-before.json`, before: initial, designRecord: `INDUSTRY_OPERATIONS.${i.slug}`, businessFacts: '기존 가격·상품 범위 보존; 고객별 실적·외부 API 권한 확인으로 간주하지 않음', ...(DEEP_DIVES[i.slug] && kind === 'app' ? { formerExperienceClaims: '공개 수행 기록 없는 회고·성과 수치 제거, 구체적인 설계 판단 예시로 재작성', originalDeepDive: `${folder}/deep-dive-before.txt` } : {}) },
      status: 'source_reviewed_and_enriched',
      checks: { sourceCoverage: 'pass', indexPolicyChanged: false, build: 'root_integration_pending', deployedHtml: 'pending', searchSubmission: 'pending' },
    });
  }
}
for (const s of SYSTEMS) {
  const sections = SYSTEM_OPERATIONS[s.slug];
  if (!sections || sections.length < 3) { errors.push(`Missing system ${s.slug}`); continue; }
  rows.push({
    url: `https://reumlab.com/system/${s.slug}/`, type: 'system',
    source: ['lib/systems.ts', 'lib/system-operations.ts', 'app/system/[slug]/page.tsx'],
    intent: `${s.primary}: ${s.features.slice(0, 3).join(' / ')} 도입·운영 판단`,
    findings: { preserved: { userTypes: s.userTypes, features: s.features, process: s.process }, missingDetail: sections.map((section) => section.h) },
    changes: sections, evidence: { kind: 'editorial_design_criteria_not_customer_outcomes', designRecord: `SYSTEM_OPERATIONS.${s.slug}`, integration: 'API 공개와 해당 고객의 이용권한·시험환경을 구분; 미확인 연동 확약 없음' },
    status: 'source_reviewed_and_enriched', checks: { sourceCoverage: 'pass', indexPolicyChanged: false, build: 'root_integration_pending', deployedHtml: 'pending', searchSubmission: 'pending' },
  });
}
const hubs = [
  { slug: 'app', intent: '업종을 선택하고 기능·비용·도입 관점으로 이동', findings: ['100개 업종 하드코딩이 실제 112개 목록과 불일치'], changes: ['메타·H1 고정 개수 제거/본문 실제 개수 연동', '기존 3축 탐색 설명·112개 링크 보존'], evidence: { actualCatalogSize: INDUSTRIES.length, classification: '기능 / 비용 / 솔루션' } },
  { slug: 'cost', intent: '업종별 가격대·견적 조건 비교', findings: ['30분 내 정확한 견적 보장 근거 없음', '월 관리비 없음이 선택 유지보수·외부 실비와 혼동'], changes: ['시간 보장 제거', '같은 조건으로 견적 비교하는 입력·실비·시장 평균 구분 보강'], evidence: { catalogSize: COSTS.length, actualCostDrivers: COSTS.map((c) => ({ slug: c.slug, drivers: c.drivers })) } },
  { slug: 'solution', intent: '업종별 도입 모듈·자료 이관·검수 탐색', findings: ['100개 업종 고정 문구', '목록 단계에서 이관·권한·시험자료 준비 설명 부족'], changes: ['고정 개수 문구 제거', '익명 양식·권한·기준일·연동 이용권한 준비 안내 추가'], evidence: { catalogSize: SOLUTIONS.length, retainedModules: '각 업종 coreFeatures와 상세 솔루션 링크' } },
  { slug: 'system', intent: '업종 대신 필요한 기능·시스템으로 탐색', findings: ['상담은 대체로 기능 이름으로 시작한다는 경험 일반화', '목록에 없는 기능 대부분 가능 단정'], changes: ['실제 상담 경험처럼 읽히는 서술 제거', 'QR 주문/웨이팅/시간 재고/반복 회차/현장기록/서류공유/시각견적 선택 기준 추가', '장비·API 권한 확인 전제'], evidence: { catalogSize: SYSTEMS.length, slugs: SYSTEMS.map((s) => s.slug) } },
];
for (const hub of hubs) rows.push({ url: `https://reumlab.com/${hub.slug}/`, type: 'hub', source: [`app/${hub.slug}/page.tsx`], intent: hub.intent, findings: hub.findings, changes: hub.changes, evidence: hub.evidence, status: 'source_reviewed_and_enriched', checks: { indexPolicyChanged: false, build: 'root_integration_pending', deployedHtml: 'pending', searchSubmission: 'pending' } });
if (rows.length !== 347) errors.push(`Expected 347 source URLs, found ${rows.length}`);
if (new Set(rows.map((row) => row.url)).size !== rows.length) errors.push('Duplicate URLs');
if (Object.keys(INDUSTRY_OPERATIONS).length !== INDUSTRIES.length) errors.push('Operations/catalog cardinality mismatch');
if (errors.length) throw new Error(errors.join('\n'));
writeFileSync(`${folder}/app-cost-solution-review.json`, JSON.stringify({
  reviewedAt: '2026-10-20', method: '기존 업종 기능·비용 요인·도입단계와 비교하여 112개 개별 업무 규칙 및 7개 시스템 도입 기준 작성; 원본 및 수정 문구를 URL별 보존. 소스 검수와 운영 검증을 분리.',
  counts: { app: 112, cost: 112, solution: 112, system: 7, hubs: 4, total: rows.length, deepDiveRewritten: Object.keys(DEEP_DIVES).length },
  limitations: ['외부 연동 권한·사업자 운영 조건은 고객별 확인 필요', '실제 고객 경험·성과는 근거 없이 생성하지 않음', '운영 배포·HTTP·렌더링 검수·제출은 통합 검증 로그로 별도 확인'],
  rows,
}, null, 2));
console.log(`Reviewed source coverage: ${rows.length} URLs; ${Object.keys(INDUSTRY_OPERATIONS).length} unique industry records; ${Object.keys(DEEP_DIVES).length} rewritten deep dives.`);
