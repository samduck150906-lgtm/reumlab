import { decideFromContent, type IndexDecision } from './index-quality';

export const ENTERNAL_CANONICAL = 'https://reumlab.com/enternal-ai/';
export const ENTERNAL_TITLE = 'Enternal AI | 기업용 Private AI·사내 AI PoC | 름랩';
export const ENTERNAL_DESCRIPTION = '기업 데이터를 고객 환경 안에서 활용하는 Private AI를 목표로 개발합니다. 로컬 추론·사내 문서 연결·자체 사전학습 기반의 적용 범위를 기업별 PoC로 검증합니다.';
export const ENTERNAL_H1 = '기업의 데이터는 기업 안에. Enternal AI';
export const ENTERNAL_LEAD = '외부로 보내지 않는, 기업만의 AI를 목표로 개발합니다.';
export const ENTERNAL_ENTITY_STATEMENT = 'Enternal AI는 기업 내부 환경에서 업무 데이터와 AI를 연결하기 위해 ReumLab이 개발하는 Private AI 제품입니다. 자체 사전학습 기반과 로컬 추론 구조를 목표로 하며, 현재는 기업별 PoC를 통해 적용 범위와 성능을 검증합니다.';
export const ENTERNAL_KEYWORDS = ['Enternal AI', '기업용 AI', 'Private AI', '사내 AI', '로컬 AI', '설치형 AI', 'AI PoC'];

export type EnternalStatusId = 'available' | 'poc' | 'direction';

export interface EnternalStatus {
  id: EnternalStatusId;
  label: string;
  detail: string;
}

export const ENTERNAL_STATUSES: EnternalStatus[] = [
  { id: 'available', label: '현재 제공', detail: '기업 환경 진단, 데이터·권한 범위 정의와 PoC 설계를 제공합니다.' },
  { id: 'poc', label: 'PoC 검증', detail: '선정한 업무에서 데이터 경로, 답변 품질, 운영 조건과 적용 범위를 측정합니다.' },
  { id: 'direction', label: '개발 방향', detail: '로컬 추론과 자체 사전학습 기반을 목표로 연구·개발합니다.' },
];

export interface EnternalProblem {
  id: string;
  title: string;
  detail: string;
}

export const ENTERNAL_PROBLEMS: EnternalProblem[] = [
  {
    id: 'data-path',
    title: '업무 데이터가 이동하는 경로를 설명하기 어렵습니다',
    detail: '직원이 어떤 자료를 입력하고 어느 모델과 저장소를 거치는지 확인할 수 있어야 보안·법무·운영 담당자가 적용 범위를 판단할 수 있습니다.',
  },
  {
    id: 'api-dependency',
    title: '외부 API 정책과 비용 변화가 운영 조건을 바꿀 수 있습니다',
    detail: '일반 생성형 AI API는 빠른 검증에 유용하지만 모델, 데이터 보관 정책, 사용량 비용과 제공 조건이 바뀔 수 있어 대체 경로를 함께 검토해야 합니다.',
  },
  {
    id: 'generic-fit',
    title: '범용 모델만으로 회사 규칙을 자동으로 이해하지는 않습니다',
    detail: '용어, 문서 구조, 권한, 승인 절차와 최신 기준을 연결하지 않으면 답변이 자연스러워도 실제 업무에는 맞지 않을 수 있습니다.',
  },
  {
    id: 'governance',
    title: '누가 무엇을 확인하고 책임지는지 먼저 정해야 합니다',
    detail: 'AI가 읽을 수 있는 자료, 답변 근거, 보관 기간, 접근 권한, 오류 이관과 최종 승인자를 PoC 단계부터 명확히 기록합니다.',
  },
];

export interface EnternalFlowStep {
  id: string;
  label: string;
  detail: string;
  limit: string;
}

export const ENTERNAL_FLOW: EnternalFlowStep[] = [
  { id: 'employee', label: '업무 질문', detail: '직원이 허용된 화면에서 질문이나 작업 요청을 입력합니다.', limit: '개인정보와 불필요한 원문은 입력 범위에서 제외합니다.' },
  { id: 'enternal', label: '권한·맥락 확인', detail: 'Enternal AI가 사용자 권한, 질문 의도와 필요한 자료 범위를 확인합니다.', limit: '권한이 없거나 의도가 불명확하면 자동으로 다음 단계에 넘기지 않습니다.' },
  { id: 'model', label: '승인된 모델 또는 로컬 추론', detail: '기업 환경과 PoC 조건에 맞춰 승인한 모델 경로에서 요청을 처리합니다.', limit: '로컬 실행 가능 여부와 외부 통신 범위는 모델·인프라별로 검증합니다.' },
  { id: 'knowledge', label: '사내 문서·시스템', detail: '접근이 허용된 문서, 데이터베이스 또는 업무 시스템에서 근거 후보를 찾습니다.', limit: '원본 변경과 시스템 실행은 별도 권한과 승인 절차가 있을 때만 허용합니다.' },
  { id: 'answer', label: '근거가 연결된 답변', detail: '답변과 함께 사용한 자료, 확인 시점과 추가 검토 항목을 보여 줍니다.', limit: '근거가 부족하거나 충돌하면 확정 답변 대신 담당자 확인을 요청합니다.' },
];

export interface EnternalCapability {
  id: string;
  status: EnternalStatusId;
  title: string;
  input: string;
  output: string;
  boundary: string;
}

export const ENTERNAL_CAPABILITIES: EnternalCapability[] = [
  { id: 'knowledge-search', status: 'poc', title: '사내 지식검색', input: '업무 매뉴얼, 규정, 제품 문서와 자주 묻는 질문', output: '근거 문서와 확인 시점을 함께 제시하는 답변', boundary: '문서에 없는 사실은 만들지 않고 담당자 확인 대상으로 남깁니다.' },
  { id: 'document-analysis', status: 'poc', title: '문서 분석', input: '승인된 계약·발주·보고 문서의 검증용 샘플', output: '항목 추출, 문서 간 차이와 누락 후보', boundary: '법률 해석과 최종 판단은 담당자가 원문을 확인합니다.' },
  { id: 'report-drafting', status: 'poc', title: '보고서 초안', input: '회의 기록, 업무 데이터와 회사 템플릿', output: '근거를 추적할 수 있는 요약과 보고서 초안', boundary: '제출·발송 전 수치와 결론을 사람이 검토합니다.' },
  { id: 'workflow-support', status: 'available', title: '통제된 업무 지원 설계', input: '현재 프로세스, 권한표와 예외 규칙', output: 'AI가 읽고 제안하며 사람에게 넘기는 단계별 설계', boundary: '결제·계약·권한 변경 등 영향이 큰 행동은 사람 전용으로 남깁니다.' },
  { id: 'organization-adaptation', status: 'direction', title: '기업별 모델 적응', input: '허가된 학습·평가 자료와 회사 용어', output: '기업 질문에 맞춘 평가 기준과 모델 개선 후보', boundary: '자체 모델의 적용 가능성과 성능은 기업별 PoC 결과로만 판단합니다.' },
];

export interface EnternalComparisonItem {
  id: string;
  item: string;
  externalApi: string;
  enternalTarget: string;
}

export const ENTERNAL_COMPARISON: EnternalComparisonItem[] = [
  { id: 'data-path', item: '데이터 경로', externalApi: '서비스 제공자의 API와 정책에 맞춰 요청을 전송합니다.', enternalTarget: '고객이 통제할 수 있는 경로를 우선 설계하고 실제 전송 범위를 PoC에서 확인합니다.' },
  { id: 'model-operation', item: '모델 운영', externalApi: '업데이트와 운영을 제공자가 담당해 빠르게 시작할 수 있습니다.', enternalTarget: '승인된 외부 모델, 전용 환경 또는 로컬 추론 후보를 업무 조건에 맞춰 비교합니다.' },
  { id: 'customization', item: '기업 맞춤', externalApi: '프롬프트, 검색 연결과 제공 범위 안의 조정이 중심입니다.', enternalTarget: '회사 용어, 평가 세트와 업무 규칙을 제품 개발 방향에 반영합니다.' },
  { id: 'deployment', item: '배포 방식', externalApi: '인터넷 연결과 제공자의 지원 지역·계정 정책을 따릅니다.', enternalTarget: '사내망·전용 인프라·로컬 장비 가능성을 확인하되 환경별 제약을 먼저 검증합니다.' },
  { id: 'governance', item: '운영 통제', externalApi: '제공자 설정과 고객 애플리케이션의 권한을 함께 관리합니다.', enternalTarget: '조회 자료, 모델 경로, 답변 근거, 로그와 사람 승인 책임을 한 설계로 정리합니다.' },
  { id: 'adoption', item: '도입 방법', externalApi: '범용 기능을 빠르게 연결해 사용성을 확인하기 좋습니다.', enternalTarget: '한 가지 우선 업무의 데이터와 성능을 측정한 뒤 적용 확대 여부를 결정합니다.' },
];

export interface EnternalProcessStep {
  id: string;
  title: string;
  detail: string;
}

export const ENTERNAL_PROCESS: EnternalProcessStep[] = [
  { id: 'discovery', title: '환경 진단', detail: '현재 업무, 인프라, 외부 통신 정책과 해결하려는 질문을 확인합니다.' },
  { id: 'scope', title: '데이터·권한 범위', detail: '검증에 필요한 자료, 제외할 정보, 접근 권한, 보관 기간과 담당자를 정합니다.' },
  { id: 'poc-design', title: 'PoC 설계', detail: '대표 질문, 정답 기준, 모델 후보, 데이터 경로, 기간과 산출물을 합의합니다.' },
  { id: 'validation', title: '측정 검증', detail: '답변 근거, 실패 유형, 처리 시간, 운영 부담과 외부 통신 여부를 실제 샘플로 측정합니다.' },
  { id: 'decision', title: '도입 판단', detail: '측정 결과와 비용·보안·운영 조건을 함께 검토해 중단, 보완 또는 적용을 결정합니다.' },
  { id: 'expansion', title: '선택적 확대', detail: '검증된 범위만 운영에 옮기고 다음 문서나 업무는 별도 단계로 확장합니다.' },
];

export interface EnternalScenario {
  id: string;
  title: string;
  example: string;
  boundary: string;
}

export const ENTERNAL_SCENARIOS: EnternalScenario[] = [
  { id: 'manufacturing', title: '제조 업무 예시', example: '설비 매뉴얼과 작업 표준에서 근거를 찾아 현장 질문에 답하고 점검 항목을 정리합니다.', boundary: '안전 판단과 설비 제어는 현장 책임자의 승인 없이 실행하지 않습니다.' },
  { id: 'education', title: '교육 운영 예시', example: '과정 안내, 운영 규정과 내부 상담 기준을 연결해 직원용 답변 초안을 만듭니다.', boundary: '학생 개인정보와 평가 정보는 권한·보관 정책을 확인한 범위에서만 다룹니다.' },
  { id: 'professional-services', title: '전문서비스 예시', example: '프로젝트 자료와 표준 문서를 대조해 쟁점, 누락 자료와 보고서 초안을 정리합니다.', boundary: '법률·세무·의료 등 자격이 필요한 판단을 AI 답변으로 확정하지 않습니다.' },
  { id: 'internal-operations', title: '사내 운영 예시', example: '인사·총무·IT 운영 문서에서 직원 질문의 근거와 담당 부서를 안내합니다.', boundary: '인사 결정, 계정 권한 변경과 민감정보 열람은 사람 전용 절차로 유지합니다.' },
];

export interface EnternalTechDirection {
  id: string;
  status: EnternalStatusId;
  title: string;
  detail: string;
}

export const ENTERNAL_TECH_DIRECTIONS: EnternalTechDirection[] = [
  { id: 'private-inference', status: 'poc', title: 'Private·로컬 추론 경로', detail: '모델 라이선스, 하드웨어, 지연시간과 외부 통신을 확인해 고객 환경에서 가능한 추론 경로를 검증합니다.' },
  { id: 'organization-evaluation', status: 'available', title: '기업 질문 평가 체계', detail: '실제 업무 질문과 기대 답변, 근거, 실패 기준을 먼저 정의해 모델 선택을 수치와 사례로 비교합니다.' },
  { id: 'auditable-retrieval', status: 'poc', title: '감사 가능한 지식 연결', detail: '답변이 사용한 문서, 구간, 버전과 권한을 기록하고 근거가 없을 때 중단하도록 설계합니다.' },
  { id: 'proprietary-pretraining', status: 'direction', title: '자체 사전학습 기반', detail: '외부 생성형 AI API 의존도를 낮추기 위한 데이터·토크나이저·학습·평가 기반을 장기 제품 방향으로 개발합니다.' },
];

export const ENTERNAL_RELATED_LINKS = [
  { href: '/enterprise-ai/', label: '현재 제공 가능한 사내 지식검색·RAG 구축' },
  { href: '/ai-worker/', label: '업무를 수행하고 사람에게 이관하는 AI Worker 구축' },
  { href: '/guide/enterprise-ai-adoption/', label: '기업용 AI 도입 전에 준비할 것' },
  { href: '/guide/rag-development/', label: 'RAG 개발 구조와 검증 기준' },
];

export interface EnternalFaq {
  q: string;
  a: string;
}

export const ENTERNAL_FAQS: EnternalFaq[] = [
  { q: 'Enternal AI는 지금 완성된 제품인가요?', a: 'Enternal AI는 현재 기업별 환경 진단과 PoC를 제공하며, 로컬 추론과 자체 사전학습 기반은 개발 방향으로 검증하고 있습니다. 일반 사용자가 바로 설치하는 완제품으로 설명하지 않습니다.' },
  { q: '회사 데이터가 외부로 전혀 나가지 않나요?', a: '외부 전송 여부는 선택한 모델, 인프라와 연동 구조에 따라 달라집니다. PoC에서 각 데이터 경로와 통신 대상을 확인하고, 고객 정책을 만족하지 못하는 경로는 적용 범위에서 제외합니다.' },
  { q: '인터넷이 없는 사내망에서도 운영할 수 있나요?', a: '폐쇄망이나 제한망 운영 가능성은 모델 라이선스, 하드웨어, 업데이트와 인증 방식까지 확인해야 판단할 수 있습니다. 로컬 실행 후보를 실제 환경과 유사한 조건에서 검증한 뒤 가능 범위를 제안합니다.' },
  { q: '름랩이 만든 자체 모델을 사용하나요?', a: '자체 모델과 자체 사전학습 기반은 현재 장기 개발 방향이며 모든 PoC에 완성 모델을 제공하는 상태는 아닙니다. 검증 단계에서는 목적과 환경에 맞는 승인된 모델 후보를 비교할 수 있습니다.' },
  { q: '어떤 사내 데이터를 연결할 수 있나요?', a: '업무 매뉴얼, 규정, 제품 문서, 보고서와 권한이 정리된 시스템 데이터를 우선 검토합니다. 개인정보·영업비밀·저작권 자료는 목적, 법적 근거, 최소 범위와 보관 정책을 먼저 확인합니다.' },
  { q: '보안은 누가 책임지나요?', a: '보안 책임은 제품 하나가 아니라 고객 정책, 인프라, 모델, 계정 권한과 운영 절차를 함께 나눠 관리합니다. 름랩은 PoC 설계에서 데이터 흐름과 통제 지점을 문서화하지만 인증이나 무결점을 임의로 약속하지 않습니다.' },
  { q: 'PoC 성능은 어떻게 확인하나요?', a: 'PoC 성능은 대표 질문, 기대 답변, 근거 일치, 실패 유형과 처리 조건을 사전에 정한 평가 세트로 측정합니다. 한 번의 데모나 자연스러운 문장만으로 운영 적합성을 판단하지 않습니다.' },
  { q: 'Enternal AI 도입은 어떤 순서로 진행하나요?', a: '환경 진단 뒤 데이터·권한 범위를 정하고, 한 가지 우선 업무로 PoC를 설계해 측정한 다음 도입 여부를 결정합니다. 검증되지 않은 업무까지 한 번에 운영 범위로 확대하지 않습니다.' },
  { q: '구축 비용과 기간은 얼마인가요?', a: '비용과 기간은 모델 경로, 인프라, 데이터 정리 수준, 평가 범위와 시스템 연동 수에 따라 달라집니다. 환경 진단과 PoC 범위를 합의한 뒤 산출물, 일정과 견적을 먼저 제안합니다.' },
  { q: '기존 사내 AI·AI Worker 서비스와 무엇이 다른가요?', a: 'Enternal AI는 고객이 통제하는 데이터 경로와 로컬 추론 가능성을 검증하는 Private AI 제품 방향입니다. `/enterprise-ai/`는 현재 구축 가능한 문서 기반 지식검색이고 `/ai-worker/`는 승인된 시스템에서 업무를 수행하는 에이전트 서비스입니다.' },
];

export function enternalAiDecision(): IndexDecision {
  return decideFromContent({
    title: ENTERNAL_TITLE,
    description: ENTERNAL_DESCRIPTION,
    h1: ENTERNAL_H1,
    bodyParts: [
      ENTERNAL_LEAD,
      ENTERNAL_ENTITY_STATEMENT,
      ENTERNAL_STATUSES.flatMap((item) => [item.label, item.detail]),
      ENTERNAL_PROBLEMS.flatMap((item) => [item.title, item.detail]),
      ENTERNAL_FLOW.flatMap((item) => [item.label, item.detail, item.limit]),
      ENTERNAL_CAPABILITIES.flatMap((item) => [item.title, item.input, item.output, item.boundary]),
      ENTERNAL_COMPARISON.flatMap((item) => [item.item, item.externalApi, item.enternalTarget]),
      ENTERNAL_PROCESS.flatMap((item) => [item.title, item.detail]),
      ENTERNAL_SCENARIOS.flatMap((item) => [item.title, item.example, item.boundary]),
      ENTERNAL_TECH_DIRECTIONS.flatMap((item) => [item.title, item.detail]),
      ENTERNAL_FAQS.flatMap((item) => [item.q, item.a]),
    ],
    faqQuestions: ENTERNAL_FAQS.map((item) => item.q),
    internalLinks: ENTERNAL_RELATED_LINKS.length + 4,
    hasUniqueMedia: true,
    evidence: {
      firstPartyEvidence: 'partial',
      independentSources: 0,
      hasMethodology: true,
      hasLimitations: true,
      reviewedAt: '2026-09-21',
      hasOriginalMedia: true,
    },
  });
}
