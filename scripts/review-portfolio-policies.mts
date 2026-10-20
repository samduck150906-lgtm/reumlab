import { readFileSync, writeFileSync } from 'node:fs';
import { parse } from 'node-html-parser';
import { PROJECTS } from '../lib/portfolio';

const folder = 'docs/execution-20261020';
const before = JSON.parse(readFileSync(`${folder}/portfolio-before.json`, 'utf8'));
const rows: Record<string, unknown>[] = [];
for (const p of PROJECTS) {
  const original = before.find((x: { id: string }) => x.id === p.id);
  const { designConsiderations, handoverChecks, ...originalDetail } = p.detail;
  if (JSON.stringify({ ...p, detail: originalDetail }) !== JSON.stringify(original)) throw new Error(`Original portfolio facts changed: ${p.id}`);
  if (!designConsiderations || !handoverChecks) throw new Error(`Missing editorial detail: ${p.id}`);
  rows.push({
    url: `https://reumlab.com/portfolio/${p.id}/`, type: 'portfolio',
    source: ['script.js:PROJECTS', 'content/portfolio.json (generated)', 'lib/portfolio.ts', 'app/portfolio/[id]/page.tsx'],
    intent: `${p.title}의 문제·담당 범위·구현 흐름·산출물 확인`,
    preserved: original,
    findings: { scope: p.scope, existingProblem: p.detail.problemDetail, existingFlow: p.detail.userFlow, existingDeliverables: p.detail.deliverables, missingEvidence: '수행 기록·승인된 사례 자료·측정 자료·공개 승인서는 세션에서 확인되지 않음. 동일 내용을 복제한 원본·생성 JSON은 독립 증거가 아님.', missingDecisionContext: designConsiderations, missingHandoverContext: handoverChecks },
    changes: { designConsiderations, handoverChecks, boundary: '기존 수행 설명과 유사 개발 검토 기준을 별도 섹션으로 구분; 실제 경험·성과·날짜 추가 없음; 홈 모달과 상세 동일 원본 사용', disclosure: '목업·고객정보 비공개·측정성과 비공개 명시, 단일 데이터 원본 등 내부 편집 설명 제거' },
    evidence: { sourceSnapshot: `${folder}/portfolio-before.json`, sourceParity: '15개 기존 사실 필드 완전 보존 검증', factualProof: 'pending', requiredRecords: [`${p.scope}에 해당하는 저장소/납품·검수 기록`, `${p.detail.deliverables.join(' / ')}의 실제 인도 확인`, '공개 승인·익명화 범위 확인', '성과 표현을 추가하려면 측정 기간·지표·조건 원본'] },
    status: 'source_reviewed_enriched_factual_evidence_pending',
    checks: { originalFieldsPreserved: true, inventedCustomerDateMetric: false, indexPolicyChanged: false, build: 'root_integration_pending', deployedHtml: 'pending' },
  });
}
rows.push({
  url: 'https://reumlab.com/portfolio/', type: 'portfolio_hub', source: ['app/portfolio/page.tsx', 'script.js:PROJECTS'],
  intent: '웹·앱·ERP/SaaS·AI·데이터 분류로 관련 개발 사례 선택',
  findings: { retained: '15개 사례별 문제·범위·기술·상세 링크와 5개 분류가 이미 있음', gap: '목업과 실제 화면·성과의 경계, 공개 범위 설명 보강 필요' },
  changes: ['목업/고객 화면·성과 증빙 구분', '상세의 기존 범위와 조건부 검토 기준 안내'], evidence: { catalogSize: PROJECTS.length, source: 'PROJECTS 기존 필드', executionProof: '각 상세와 동일하게 pending' }, status: 'source_reviewed_enriched_factual_evidence_pending',
});
const policyReviews = {
  privacy: {
    intent: '개인정보 항목·목적·보관·위탁·권리행사·책임자 확인',
    preserved: '항목/수집경로·목적·보유기간 표·제3자 제공·위탁·열람정정삭제·파기·보안·쿠키·책임자·시행일',
    checks: '현 문의폼 이름·전화 필수, 이메일 선택, 프로젝트정보 및 유입정보가 수집됨을 index.html/script.js와 대조. 정책은 경로별 항목을 설명하고 있으나 실제 수탁자·처리위치·운영 기간은 별도 증빙 필요.',
    pending: ['현재 실제 수탁자 목록·업무·국외 처리 여부', '문의 및 분석 자료 실제 보유기간·파기 설정', '안전성 조치·권리행사 처리 절차의 실제 운영'],
  },
  terms: {
    intent: '서비스 범위·계약·권리·책임·분쟁 및 사업자 확인',
    preserved: '개발·교육·컨설팅 범위, 개별 서면계약, 권리·의무·저작권·책임·사업자 정보',
    checks: '운영사 이터널식스·303-28-65658·성아름·연락처 정본 보존. 계약별 범위/가격/일정 우선 설명이 있으며 정책에 불필요한 FAQ·스키마를 추가하지 않음.',
    pending: ['현 계약서·서비스 제공 범위와 약관의 운영 일치', '교육·컨설팅 서비스 제공 조건의 사업자 확인', '법률적 유효성은 이 콘텐츠 검수로 확정하지 않음'],
  },
  refund: {
    intent: '개발·교육·월 컨설팅별 취소/환불 산정·신청·처리기간 확인',
    preserved: '무료 상담·착수 전후·진행비율·제3자 비용·교육/컨설팅별 조건·처리기간·문의처',
    checks: '개발 계약의 단계별 정산과 문의 경로, 처리기간이 있음. 계약상 금액·환불률·시행일을 임의 수정하지 않음. 루트 refund.html은 정본과 다른 구형 파일이므로 공개 정본을 덮어쓰지 않음.',
    pending: ['개별 계약·교육 관련 적용 규정과 환불 안내 일치', '실제 결제수단/처리기간·중도정산 운영', '루트 구형 *.html 배포 제외 유지 확인'],
  },
};
for (const [slug, review] of Object.entries(policyReviews)) {
  const source = `public/${slug}/index.html`;
  const html = readFileSync(source, 'utf8');
  const dom = parse(html);
  const text = dom.querySelector('main')?.structuredText;
  if (!text || !text.includes('303-28-65658')) throw new Error(`Missing policy content/company identity: ${slug}`);
  rows.push({
    url: `https://reumlab.com/${slug}/`, type: 'policy', source: [source],
    intent: review.intent, findings: { preserved: review.preserved, inspection: review.checks, pending: review.pending },
    changes: '현재 목적별 본문 보존. 근거 없는 사업조건·법률 결론·시행일·환불률 추가/수정 없음.',
    evidence: { sourceBody: text, h1: dom.querySelector('h1')?.text, headings: dom.querySelectorAll('h2').map((x) => x.text), company: '이터널식스 / 303-28-65658', policyEffectiveDate: '2026-04-11 기존값 보존', legalComplianceOpinion: 'not_assessed' },
    status: 'source_reviewed_preserved_business_evidence_pending',
  });
}
if (rows.length !== 19) throw new Error(`Expected 19 URLs, found ${rows.length}`);
writeFileSync(`${folder}/portfolio-policy-review.json`, JSON.stringify({
  reviewedAt: '2026-10-20', counts: { portfolio: 15, portfolioHub: 1, policies: 3, total: rows.length },
  method: '원본 수행사실 보존을 자동 대조하고 각 사례의 문제·흐름·범위·산출물과 조건부 비교 기준을 개별 검수. 원본의 주장과 실제 수행증빙을 구분. 정책은 실제 배포 원본 public 경로의 본문을 검수.',
  rows,
}, null, 2));
console.log(`Portfolio/policy source review: ${rows.length} URLs; 15 original fact records unchanged; factual/operational evidence pending explicitly recorded.`);
