import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { storageAiCore } from './ai-core';
import { storageAiOperations } from './ai-operations';

export const storageAiPage: AgencyPage = {
  slug:'ai/에너지저장장치업체', clusterIds:['ind-607-ai'],
  primaryKeyword:'에너지저장장치업체 AI 자동화',
  keywordVariants:['ESS 운영 보고서 AI 초안','에너지저장장치 자료 설명 자동화','ESS 보고 문서 AI 개발'],
  searchIntent:'확인된 에너지저장장치 집계표와 공개 가능한 운영 메모를 근거로 기간 보고서 설명·질문 초안을 만들고 수치와 해석을 사람이 검토하기',
  industry:'에너지저장장치업체', serviceAxis:'AI·GPT 자동화',
  title:'에너지저장장치업체 AI 자동화 | 근거 기반 보고 초안·검토 | 름랩',
  description:'ESS 운영 보고서 AI의 집계표·메모 근거 연결과 설명 초안, 누락 상태 및 승인 흐름을 설계합니다. 수치 계산과 문장 생성, 확인 사실과 원인 해석을 구분해 범위를 확인하세요.',
  h1:'에너지저장장치업체 AI 자동화, 확인된 집계표에서 검토할 보고 초안을 만듭니다',
  summary:'에너지저장장치 AI 자동화는 확인된 기간 집계와 공개 가능한 운영 메모를 바탕으로 보고서 설명 초안을 작성하는 업무에서 시작할 수 있습니다. 수치 계산과 문장 생성을 분리하고 각 설명의 근거와 미확인 상태를 보존해야 합니다. 름랩은 실제 보고 예시와 담당자의 검토 기준을 확인해 초안·수정·승인 흐름을 설계합니다.',
  updatedAt:'2026-10-20',
  ...storageAiCore, ...storageAiOperations,
  sections:sections(['집계와 설명을 연결해 보고하는 조직','변화의 원인과 누락 상태를 잘못 설명하는 문제','자료 확정·기술 검토·초안·발행 승인 역할','승인된 입력에서 정정 가능한 보고서까지','문장별 근거와 수치 대조 화면','오류 유형·보고 형식·모델 변경 관리','입력 묶음과 고객 포털 연결','자료 누락·조건 차이·외부 지시 처리','한 보고 형식의 첫 범위와 단계별 확장','평가 자료와 승인 흐름의 비용·일정','고객 자료 처리와 성능 해석의 책임','회귀 평가와 보고 업무를 이어가는 인수']),
  faq:[
    {question:'AI가 성능 지표를 직접 계산하나요?',answer:'필요한 계산은 합의한 규칙과 원본 자료로 별도 검증하고 그 결과를 설명 초안의 입력으로 제공하는 방식을 검토합니다. 언어 모델이 임의로 숫자와 계산 기준을 만들어 쓰지 않도록 합니다. 수치와 문장의 근거는 각각 대조해야 합니다.'},
    {question:'값이 바뀐 원인까지 자동으로 설명할 수 있나요?',answer:'변화가 관찰됐다는 사실과 원인이 확인됐다는 판단은 다릅니다. 확인된 메모와 사건을 근거로 설명하되 원인이 불명확하면 추가 질문으로 남깁니다. 자료에 없는 기술적 원인을 그럴듯한 문장으로 채우지 않도록 검수합니다.'},
    {question:'자료가 없는 기간도 보고 초안을 만들 수 있나요?',answer:'누락 상태와 사용할 수 있는 범위를 입력에 명확히 제공해야 합니다. 부족한 부분을 이전 기간의 값으로 채우거나 정상 운영 결과로 단정하지 않습니다. 잠정 보고와 발행 보류 여부는 실제 운영 기준과 책임자가 정해야 합니다.'},
    {question:'다른 사업장의 보고서를 참고해도 되나요?',answer:'접근 권한과 자료 사용 목적, 비교 가능한 조건을 먼저 확인해야 합니다. 같은 항목 이름이라도 구성과 계산 기준이 다를 수 있습니다. 다른 고객의 비공개 자료가 검색이나 출력에 섞이지 않도록 범위를 제한하고 검수합니다.'},
    {question:'보고서는 자동으로 고객에게 발송되나요?',answer:'초안 생성과 발행은 별도 상태와 권한으로 설계하는 것이 좋습니다. 담당자가 수치·단위·기간과 기술 표현, 공개 범위를 확인한 승인본만 전달하도록 할 수 있습니다. 정정이 생기면 이전 발행본과 변경 이유를 연결해야 합니다.'},
    {question:'상담 전에 어떤 예시를 준비하면 되나요?',answer:'현재 보고서와 확인된 입력 집계표의 구조, 사용할 수 있는 운영 메모 및 검토·승인 흐름을 알려 주세요. 비공개 데이터 전체를 먼저 전달할 필요는 없습니다. 사용 허락을 받은 예시로 근거 연결과 평가 기준을 정리할 수 있습니다.'},
  ],
  relatedRoutes:[
    {href:'/ai-automation/',label:'AI 업무 자동화 범위',reason:'계산·설명·전문 판단의 책임과 자동화 범위를 나눕니다.'},
    {href:'/development-agency/b2b-sales-support-ai-workflow/',label:'대외 답변의 근거와 승인',reason:'초안의 출처와 고객 전달 전 검토할 항목을 비교합니다.'},
    {href:'/development-agency/api-integration-development/',label:'집계 자료와 보고 도구 연결',reason:'승인된 입력 버전과 중복 발행 방지 기준을 정합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'운영 메모와 고객 자료 접근',reason:'권한별 검색과 외부 전송의 검수 범위를 확인합니다.'},
    {href:'/source-handover/',label:'보고 자동화와 평가 기준 인수',reason:'모델·입력 변경 후 검수와 비용 확인 방법을 준비합니다.'},
  ],
  ctaContext:'보고서의 입력 집계와 운영 메모, 수치·표현을 확인하는 담당자 및 발행 절차를 알려 주세요. 근거와 미확인 상태를 보존하는 AI 보고 업무 범위를 정리합니다.',
  evidenceSources:[
    {title:'미국 에너지부 배터리 저장장치 평가 자료',url:'https://www.energy.gov/sites/default/files/2024-01/bess-evaluation-method.pdf',use:'운영 자료의 품질과 평가 결과 해석의 한계를 확인하는 배경 자료입니다. 이 문서가 언어 모델의 계산이나 진단 정확성을 보증하지는 않습니다.'},
    {title:'OWASP 프롬프트 인젝션 위험',url:'https://genai.owasp.org/llmrisk/llm01-prompt-injection/',use:'운영 메모 등 외부 자료를 실행 지시로 취급하지 않고 자료 접근과 전송 권한을 제한하는 검수 항목을 정할 때 참고합니다.'},
  ],
};
