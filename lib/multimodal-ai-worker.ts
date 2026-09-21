import { decideFromContent, type IndexDecision } from './index-quality';
import { SITE } from './seo';

export const MULTIMODAL_PATH = '/ai-worker/multimodal/';
export const MULTIMODAL_CANONICAL = `${SITE.canonicalOrigin}${MULTIMODAL_PATH}`;
export const MULTIMODAL_TITLE = '멀티모달 AI Worker 개발 | 영상·음성·현장 업무 자동화 | 름랩';
export const MULTIMODAL_DESCRIPTION =
  '영상·사진·음성·문서를 이해하고 검수·견적·상담 분석부터 ERP·CRM 업무까지 연결하는 맞춤형 멀티모달 AI Worker를 구축합니다.';
export const MULTIMODAL_H1 = '보고 듣고 판단하고, 업무까지 처리하는 AI';
export const MULTIMODAL_LEAD =
  '사진·영상·음성·문서를 이해하는 멀티모달 AI와 기업의 ERP·CRM·업무 시스템을 연결해 사람이 반복하던 업무를 AI Worker로 전환합니다.';
export const MULTIMODAL_ENTITY_STATEMENT =
  'Multimodal AI Worker는 ReumLab의 AI Worker 서비스 중 하나로, 시각·음성·문서 정보를 이해한 뒤 검수, 견적, 상담 분석, 데이터 입력과 같은 실제 업무 흐름까지 연결하도록 구축하는 맞춤형 AI 시스템입니다.';
export const MULTIMODAL_KEYWORDS = [
  '멀티모달 AI',
  '멀티모달 AI Worker',
  '영상 분석 AI',
  '음성 분석 AI',
  '현장 업무 자동화',
  'AI 검수 자동화',
  'ERP AI 연동',
];

export interface MultimodalFlowStep {
  id: 'input' | 'perceive' | 'understand' | 'worker' | 'connect' | 'result';
  label: string;
  detail: string;
}

export const MULTIMODAL_FLOW: MultimodalFlowStep[] = [
  { id: 'input', label: 'VIDEO · IMAGE · VOICE · DOCUMENT · TEXT', detail: '현장에서 생기는 비정형 정보를 받습니다.' },
  { id: 'perceive', label: 'SEE · HEAR · READ', detail: '영상의 장면, 통화의 발화, 문서의 항목을 분리해 읽습니다.' },
  { id: 'understand', label: 'UNDERSTAND', detail: '업무 기준과 문맥을 적용해 필요한 정보와 이상 징후를 찾습니다.' },
  { id: 'worker', label: 'AI WORKER', detail: '정해진 권한과 검수 규칙에 따라 다음 업무를 결정합니다.' },
  { id: 'connect', label: 'API · ERP · CRM · DB · COMPUTER USE', detail: '가능하면 API로, 필요한 경우 제한된 화면 조작으로 연결합니다.' },
  { id: 'result', label: '검수 · 견적 · 보고 · 예약 · 발주 · AS · 업무등록', detail: '사람이 확인할 수 있는 근거와 함께 업무 결과를 남깁니다.' },
];

export interface MultimodalEngineStep {
  id: 'input' | 'understanding' | 'reasoning' | 'rules' | 'permission' | 'action' | 'result';
  label: string;
  detail: string;
}

export const MULTIMODAL_ENGINE: MultimodalEngineStep[] = [
  { id: 'input', label: '입력 수집', detail: '카메라, 업로드, 전화 녹취, 문서와 텍스트 입력을 수집합니다.' },
  { id: 'understanding', label: '내용 이해', detail: 'OCR·음성인식·비전 모델을 조합해 사람이 확인할 수 있는 구조로 바꿉니다.' },
  { id: 'reasoning', label: '판단 후보 생성', detail: '관측된 사실과 업무 맥락을 구분하고 다음 행동 후보를 만듭니다.' },
  { id: 'rules', label: '업무 규칙 적용', detail: '회사별 체크리스트, 가격표, 금지 조건과 예외 규칙을 적용합니다.' },
  { id: 'permission', label: '권한 확인', detail: '읽기·쓰기·승인 필요·사람 전용 단계 중 허용 범위를 확인합니다.' },
  { id: 'action', label: '시스템 실행', detail: 'API를 우선 사용하고, API가 없을 때만 통제된 Computer Use를 검토합니다.' },
  { id: 'result', label: '결과와 근거 기록', detail: '처리 결과, 입력 근거, 검수 상태와 실패 사유를 로그로 남깁니다.' },
];

export interface MultimodalProduct {
  id: string;
  title: string;
  input: string;
  judgement: string;
  output: string;
  guardrail: string;
}

export const MULTIMODAL_PRODUCTS: MultimodalProduct[] = [
  { id: 'field-inspection', title: '현장 사진·영상 검수 AI', input: '작업 전후 사진, 순회 영상, 체크리스트', judgement: '필수 구역 누락, 파손 의심, 기준 미달 항목을 분류합니다.', output: '검수 보고서와 재확인 업무를 생성합니다.', guardrail: '법적 안전 판정이나 최종 품질 승인은 담당자가 확인합니다.' },
  { id: 'phone-qa', title: '전화 상담 품질 분석 AI', input: '통화 녹취, 상담 스크립트, CRM 고객 정보', judgement: '문의 의도, 약속 사항, 금칙어와 후속 조치 필요성을 찾습니다.', output: '상담 요약, 품질 체크, CRM 후속 업무를 남깁니다.', guardrail: '녹취 고지와 접근 권한을 갖춘 통화만 처리하고 민감정보는 최소화합니다.' },
  { id: 'estimate-camera', title: '카메라 기반 견적 보조 AI', input: '현장 사진·영상, 규격표, 단가표', judgement: '대상 수량과 상태를 추정하고 추가 확인 항목을 표시합니다.', output: '담당자가 검토할 견적 초안과 현장 질문 목록을 만듭니다.', guardrail: '영상만으로 확정할 수 없는 수량·재질·안전 조건은 현장 실측을 요구합니다.' },
  { id: 'real-estate-listing', title: '부동산 매물 등록 AI', input: '공간 사진, 음성 메모, 매물 서류', judgement: '공간 특징과 서류 항목을 추출하고 누락·불일치를 확인합니다.', output: '검수 가능한 매물 설명과 CRM 등록 초안을 만듭니다.', guardrail: '소유권·권리관계·면적 등 법적 사실은 공적 서류와 담당자 확인을 우선합니다.' },
  { id: 'used-car-inspection', title: '중고차 상태 기록 AI', input: '차량 외관 영상, 계기판 사진, 점검 문서', judgement: '손상 의심 부위와 문서·계기판 정보의 불일치를 표시합니다.', output: '상태 기록과 추가 점검 요청을 생성합니다.', guardrail: '정비 진단과 사고 이력 확정은 자격을 갖춘 사람과 공식 조회 결과가 담당합니다.' },
  { id: 'academy-consulting', title: '학원 상담·수업 기록 AI', input: '상담 음성, 학생 문서, 수업 메모', judgement: '희망 과목, 일정, 고민, 후속 상담 시점을 정리합니다.', output: 'CRM 상담 기록과 승인 대기 메시지 초안을 만듭니다.', guardrail: '미성년자 정보는 동의·보관 정책에 맞춰 처리하고 자동 발송 전 사람이 확인합니다.' },
  { id: 'logistics-inspection', title: '물류 입출고 검수 AI', input: '상품 사진, 바코드, 운송장, 입출고 문서', judgement: '품목·수량·포장 상태와 문서 일치 여부를 비교합니다.', output: '검수 결과와 재촬영·보류 업무를 WMS 또는 ERP에 연결합니다.', guardrail: '가려진 라벨이나 낮은 화질처럼 확신이 낮은 항목은 자동 확정하지 않습니다.' },
  { id: 'store-manager', title: '매장 운영 점검 AI', input: '매장 순회 영상, 진열 사진, 음성 보고', judgement: '진열·청결·재고·안전 체크리스트의 누락 후보를 찾습니다.', output: '점검 보고와 지점별 개선 업무를 만듭니다.', guardrail: '직원 감시·생체 식별 용도로 확장하지 않고 운영 목적과 보관 기간을 명시합니다.' },
  { id: 'meeting-to-work', title: '회의·현장 브리핑 업무화 AI', input: '회의 음성, 화면 캡처, 문서와 채팅', judgement: '결정 사항, 담당자, 기한과 미확정 쟁점을 분리합니다.', output: '회의록과 프로젝트 관리 도구의 업무 초안을 만듭니다.', guardrail: '발언만으로 확정되지 않은 담당자·기한은 참석자의 승인을 받습니다.' },
  { id: 'incident-intake', title: '사고·AS 접수 AI', input: '고객 음성, 고장 영상, 영수증과 제품 사진', judgement: '제품·증상·긴급도와 추가 확인 자료를 분류합니다.', output: 'AS 티켓, 담당 부서 배정과 고객 안내 초안을 생성합니다.', guardrail: '위험·의료·법률 판단이 필요한 신고는 즉시 사람에게 이관합니다.' },
];

export interface MultimodalIndustry {
  id: string;
  label: string;
  input: string;
  judgement: string;
  process: string;
  result: string;
  note: string;
}

export const MULTIMODAL_INDUSTRIES: MultimodalIndustry[] = [
  { id: 'cleaning', label: '청소·시설관리', input: '작업 전후 사진과 현장 영상', judgement: '구역별 완료 여부와 재확인 후보', process: '담당자 배정과 검수표 기록', result: '작업 보고서·재방문 업무', note: '빛·각도·촬영 누락은 사람이 다시 확인합니다.' },
  { id: 'lodging', label: '숙박·공간운영', input: '객실 사진, 고객 음성, 점검 문서', judgement: '객실 상태와 긴급 요청 분류', process: 'PMS·CRM에 점검 및 요청 등록', result: '하우스키핑·시설 업무', note: '고객 사생활이 포함된 자료는 수집하지 않습니다.' },
  { id: 'construction', label: '건설·시공', input: '공정 사진, 도면, 작업자 음성 메모', judgement: '공정별 체크리스트 누락과 변경 후보', process: '현장 관리 시스템에 검토 요청', result: '공정 보고·보완 업무', note: '구조·안전의 최종 판단은 현장 책임자가 합니다.' },
  { id: 'logistics', label: '물류·창고', input: '상품·파렛트 영상, 라벨, 운송장', judgement: '수량·라벨·포장 상태 일치 여부', process: 'WMS·ERP 입출고 초안 작성', result: '검수 기록·보류 티켓', note: '인식 신뢰도가 낮으면 자동 입력하지 않습니다.' },
  { id: 'academy', label: '학원·교육', input: '상담 통화, 학생 문서, 수업 메모', judgement: '문의 의도와 후속 상담 항목', process: 'CRM 기록과 담당자 확인', result: '상담 요약·후속 업무', note: '미성년자와 학습 정보는 최소 권한으로 처리합니다.' },
  { id: 'hospital', label: '병원·의료기관', input: '예약 통화와 비의료 행정 문서', judgement: '예약·변경·행정 문의 분류', process: '승인된 시스템에 예약 초안 기록', result: '콜백·예약 확인 업무', note: '진단·처방·응급 판단은 자동화 범위에서 제외합니다.' },
  { id: 'real-estate', label: '부동산', input: '매물 사진, 음성 메모, 서류', judgement: '특징 추출과 정보 누락 확인', process: '매물·CRM 등록 초안 작성', result: '검수 가능한 매물 카드', note: '권리관계와 공적 정보는 원문 서류로 확인합니다.' },
  { id: 'automotive', label: '자동차·정비', input: '차량 영상, 계기판, 점검표', judgement: '외관 이상 후보와 문서 불일치', process: '점검 시스템에 확인 항목 등록', result: '상태 기록·추가 점검 요청', note: '정비사의 최종 진단을 대체하지 않습니다.' },
  { id: 'franchise', label: '프랜차이즈·매장', input: '순회 영상, 진열 사진, 음성 보고', judgement: '운영 기준 누락과 개선 후보', process: '지점별 체크리스트 및 담당 업무 생성', result: '점검 보고·후속 작업', note: '직원 평가가 아니라 매장 운영 기준 확인에 한정합니다.' },
  { id: 'b2b', label: 'B2B 사무업무', input: '회의 음성, 계약·발주 문서, 이메일', judgement: '결정·기한·금액·승인 필요 항목', process: 'ERP·CRM·업무 도구에 초안 연결', result: '보고서·발주·후속 업무', note: '금액 확정과 계약 승인은 반드시 담당자가 확인합니다.' },
];

export function getMultimodalIndustry(id: string): MultimodalIndustry {
  return MULTIMODAL_INDUSTRIES.find((item) => item.id === id) ?? MULTIMODAL_INDUSTRIES.find((item) => item.id === 'b2b')!;
}

export interface MultimodalPermission {
  level: 'READ' | 'WRITE' | 'CONFIRM' | 'HUMAN_ONLY';
  title: string;
  detail: string;
}

export const MULTIMODAL_PERMISSIONS: MultimodalPermission[] = [
  { level: 'READ', title: '읽기', detail: '업무에 필요한 자료만 조회하며 원본을 변경하지 않습니다.' },
  { level: 'WRITE', title: '쓰기', detail: '허용된 필드와 상태에만 초안 또는 기록을 생성합니다.' },
  { level: 'CONFIRM', title: '승인 후 실행', detail: '발송·예약·발주·견적 확정처럼 영향이 있는 행동은 사람이 승인합니다.' },
  { level: 'HUMAN_ONLY', title: '사람 전용', detail: '법률·의료·안전·고액 결제처럼 자동화하면 안 되는 결정은 사람에게 남깁니다.' },
];

export const MULTIMODAL_CONNECTIONS = [
  { title: 'API 우선', detail: '공식 API가 있으면 인증·권한·오류 처리가 명확한 API 연동을 먼저 사용합니다.' },
  { title: '데이터베이스·파일 연동', detail: '승인된 DB, 웹훅, CSV 또는 문서 저장소로 읽기·쓰기 범위를 분리합니다.' },
  { title: '조건부 Computer Use', detail: 'API가 없을 때만 제한된 계정과 단계별 확인을 두고 화면 조작을 검토합니다.' },
];

export const MULTIMODAL_COMPUTER_USE_LIMITS = [
  'CAPTCHA, MFA, 보안키처럼 사람 확인이 필요한 단계는 자동 우회하지 않습니다.',
  'VDI·사내망·IP 제한 환경은 고객 보안 정책과 접속 방식을 먼저 확인합니다.',
  '화면 구조가 바뀌면 동작이 멈출 수 있어 감지·중단·알림 절차가 필요합니다.',
  '결제, 계약 확정, 개인정보 변경은 기본적으로 사람 승인 뒤 실행합니다.',
];

export const MULTIMODAL_SECURITY = [
  '목적에 필요한 영상·음성·문서만 수집하고 보관 기간을 정합니다.',
  '운영·검수·관리 계정을 분리하고 최소 권한 원칙을 적용합니다.',
  '민감정보는 마스킹하거나 처리 대상에서 제외하고 전송·저장 구간을 보호합니다.',
  '입력 근거, AI 판단, 사람 승인, 시스템 실행 결과를 구분해 로그로 남깁니다.',
  '낮은 신뢰도, 규칙 충돌, 시스템 오류는 자동 처리하지 않고 사람에게 이관합니다.',
];

export const MULTIMODAL_DELIVERABLES = [
  '업무 흐름·예외·권한을 정리한 자동화 설계서',
  '영상·사진·음성·문서 입력 처리 파이프라인',
  'ERP·CRM·DB·업무 도구 연동과 운영 화면',
  '검수·승인·실패 이관 규칙과 처리 로그',
  '배포 환경, 소스코드, 운영 권한과 인수인계 문서',
];

export const MULTIMODAL_PROCESS = [
  '현재 업무와 실제 입력 자료를 확인해 자동화 후보를 좁힙니다.',
  '정답 기준·예외·사람 승인 구간을 정의하고 작은 검증 범위를 정합니다.',
  '샘플 자료로 인식·분류·업무 연결 가능성을 검증합니다.',
  'API 우선으로 시스템을 연결하고 권한·로그·중단 조건을 구현합니다.',
  '현장 검수 후 운영 범위를 단계적으로 넓히고 담당자에게 이관합니다.',
];

export const MULTIMODAL_BUSINESS_MODEL = [
  '비용은 입력 종류, 처리량, 모델·저장 비용, 시스템 연동 수, 검수·승인 단계에 따라 달라집니다.',
  '처음부터 전 업무를 묶기보다 한 가지 반복 업무를 검증한 뒤 다음 프로세스로 확장합니다.',
  '상담에서 현재 자료와 시스템을 확인한 뒤 구현 범위, 기간, 산출물과 견적을 먼저 제안합니다.',
];

export const MULTIMODAL_RELATED_LINKS = [
  { href: '/ai-worker/', label: 'AI Worker 전체 서비스' },
  { href: '/ai-voice-development/', label: 'AI 전화상담 직원 구축' },
  { href: '/enterprise-ai/', label: '기업용 AI 구축' },
  { href: '/ai-automation/', label: 'AI 업무 자동화' },
  { href: '/erp/', label: 'ERP·업무 시스템 개발' },
];

export interface MultimodalFaq {
  q: string;
  a: string;
}

export const MULTIMODAL_FAQS: MultimodalFaq[] = [
  { q: '멀티모달 AI란 무엇인가요?', a: '멀티모달 AI는 텍스트뿐 아니라 사진·영상·음성·문서를 함께 읽고 같은 업무 문맥에서 판단하는 AI입니다. 름랩은 이해 결과를 보고서로 끝내지 않고 ERP·CRM·업무 도구의 검수·등록·후속 업무로 연결합니다.' },
  { q: '영상 내용을 실제로 이해할 수 있나요?', a: '영상에서 장면, 물체, 자막, 시간대별 변화를 추출해 정해진 체크리스트와 비교할 수 있습니다. 다만 가림·조도·각도와 모델 한계가 있으므로 확신이 낮은 결과는 사람이 확인하도록 설계합니다.' },
  { q: '현장 사진 검수를 자동화할 수 있나요?', a: '작업 전후 사진의 필수 구역, 누락 후보, 파손 의심 항목을 분류해 검수표와 재확인 업무를 만들 수 있습니다. 안전·법적 품질처럼 책임이 큰 최종 승인은 담당자가 수행합니다.' },
  { q: '전화 상담도 분석해서 업무로 만들 수 있나요?', a: '동의를 받은 통화 녹취에서 문의 의도, 고객 요청, 약속 사항과 후속 조치를 추출해 CRM 기록 초안을 만들 수 있습니다. 개인정보와 녹취 보관 정책을 먼저 정하고 자동 발송은 승인 단계로 분리합니다.' },
  { q: '카메라 영상만으로 견적을 확정할 수 있나요?', a: '카메라 영상은 수량·상태를 추정해 견적 초안을 만드는 데 활용할 수 있지만 최종 견적을 항상 확정할 수는 없습니다. 재질, 치수, 현장 조건처럼 화면에서 확인되지 않는 항목은 실측과 담당자 승인을 요구합니다.' },
  { q: '분석 결과를 ERP나 CRM에 자동 입력할 수 있나요?', a: '공식 API나 승인된 데이터 연결 방식이 있으면 허용된 필드에 초안을 기록하거나 업무 상태를 갱신할 수 있습니다. 결제·계약·민감정보 변경처럼 영향이 큰 행동은 사람 승인 뒤 실행하도록 권한을 나눕니다.' },
  { q: 'ERP에 API가 없어도 연동할 수 있나요?', a: 'API가 없으면 파일 교환, 데이터베이스 연동, RPA 또는 제한된 Computer Use를 검토할 수 있습니다. 사내망·VDI·MFA·화면 변경 조건을 확인한 뒤 안정성과 보안이 맞지 않으면 자동화 범위에서 제외합니다.' },
  { q: 'AI Worker는 일반 챗봇과 무엇이 다른가요?', a: '일반 챗봇은 주로 질문에 답하지만 AI Worker는 입력을 이해하고 권한·업무 규칙을 확인한 뒤 시스템에 기록하거나 후속 업무를 만듭니다. 실행 근거와 승인 상태를 남기고 실패 시 사람에게 이관하는 구조가 핵심입니다.' },
  { q: 'Computer Use는 사람처럼 모든 프로그램을 조작하나요?', a: 'Computer Use는 API가 없는 제한된 화면 업무에만 조건부로 사용합니다. CAPTCHA·MFA를 우회하지 않고 화면 변화나 예상 밖 상태가 감지되면 중단하며, 결제·계약 같은 단계는 사람이 승인합니다.' },
  { q: '멀티모달 AI Worker 구축 비용은 얼마인가요?', a: '구축 비용은 입력 종류와 처리량, 모델·저장 비용, 연동 시스템 수, 검수·승인 단계에 따라 달라져 고정 금액으로 단정하지 않습니다. 실제 자료와 한 가지 우선 업무를 확인한 뒤 기간·산출물·견적을 먼저 제안합니다.' },
];

export function multimodalDecision(): IndexDecision {
  return decideFromContent({
    title: MULTIMODAL_TITLE,
    description: MULTIMODAL_DESCRIPTION,
    h1: MULTIMODAL_H1,
    bodyParts: [
      MULTIMODAL_LEAD,
      MULTIMODAL_ENTITY_STATEMENT,
      MULTIMODAL_FLOW.flatMap((item) => [item.label, item.detail]),
      MULTIMODAL_ENGINE.flatMap((item) => [item.label, item.detail]),
      MULTIMODAL_PRODUCTS.flatMap((item) => [item.title, item.input, item.judgement, item.output, item.guardrail]),
      MULTIMODAL_INDUSTRIES.flatMap((item) => [item.label, item.input, item.judgement, item.process, item.result, item.note]),
      MULTIMODAL_PERMISSIONS.flatMap((item) => [item.level, item.title, item.detail]),
      MULTIMODAL_CONNECTIONS.flatMap((item) => [item.title, item.detail]),
      MULTIMODAL_COMPUTER_USE_LIMITS,
      MULTIMODAL_SECURITY,
      MULTIMODAL_DELIVERABLES,
      MULTIMODAL_PROCESS,
      MULTIMODAL_BUSINESS_MODEL,
      MULTIMODAL_FAQS.flatMap((item) => [item.q, item.a]),
    ],
    faqQuestions: MULTIMODAL_FAQS.map((item) => item.q),
    internalLinks: MULTIMODAL_RELATED_LINKS.length + 2,
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
