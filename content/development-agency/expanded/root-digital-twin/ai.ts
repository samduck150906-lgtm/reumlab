import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '@/content/development-agency/expanded/root-wind/structure';
import { digitalTwinAiCore } from './ai-core';
import { digitalTwinAiOperations } from './ai-operations';

export const digitalTwinAiPage: AgencyPage = {
  slug:'ai/디지털트윈업체',clusterIds:['ind-621-ai'],
  primaryKeyword:'디지털트윈업체 AI 자동화',
  keywordVariants:['디지털 트윈 모델 자료 AI 대조','디지털트윈 개정 검토 AI','자산 자료 근거 검색 GPT 자동화'],
  searchIntent:'대상·개정·관측 조건에 맞는 자료 근거를 찾아 누락과 충돌, 검토 질문을 정리하고 사람이 승인한 내용만 후속 업무에 전달하기',
  industry:'디지털트윈업체',serviceAxis:'AI·GPT 자동화',
  title:'디지털트윈 AI 자동화 | 대상·개정·자료 근거 검토 | 름랩',
  description:'자산과 모델 개정에 맞는 자료 근거를 찾습니다. 누락·충돌·확인 질문과 검토 초안을 정리하고 사람의 승인 후 업무로 전달하는 디지털트윈 AI 자동화 범위를 확인하세요.',
  h1:'디지털트윈 AI 자동화, 설명보다 먼저 대상과 자료의 근거를 확인합니다',
  summary:'모델과 운영 문서가 늘어나면 자료가 어떤 대상과 개정에 적용되는지 확인하는 일이 중요해집니다. 름랩은 권한에 맞는 근거 검색과 누락·차이 정리, 검토 초안을 연결하고 담당자의 확인을 거쳐 후속 업무를 준비하는 AI 자동화 흐름을 설계합니다.',
  updatedAt:'2026-10-21',...digitalTwinAiCore,...digitalTwinAiOperations,
  sections:sections(['대상과 자료 관계를 대조하는 모델·연동 담당자','잘못된 식별과 오래된 근거가 답변에 섞이는 문제','자료·모델·AI 운영·검토·변경 승인의 책임','질문과 근거 검색에서 검토 후 전달까지','개정과 근거가 연결된 답변·누락·검토 초안','검색 자료와 평가·실패 사례의 운영','자료·질문·근거·수정·후속 전달의 관계','이름 중복과 자료 충돌·누락·잘못된 실행 유도','대표 업무의 첫 평가와 이후 검토 지원 확장','자료 관계 정리와 평가·사용량의 비용·일정','AI 설명과 관측·계산·현장 판단의 구분','권한 차이와 보류·정정을 직접 수행하는 인수']),
  faq:[
    {question:'AI가 디지털트윈의 실제 상태와 고장 원인을 판단하나요?',answer:'첫 범위는 확인 가능한 자료의 근거 검색과 누락·차이 정리, 검토 초안으로 정할 수 있습니다. 생성된 설명과 실제 관측, 검증된 계산 및 전문 판단을 구분하고 근거 없이 고장 원인이나 안전 상태를 확정하지 않도록 설계합니다.'},
    {question:'자산 이름이 비슷하면 같은 대상으로 묶을 수 있나요?',answer:'프로젝트와 대상 식별, 적용 개정의 근거를 확인해야 합니다. 이름만으로 관계를 확정하지 않고 후보와 부족한 근거를 제시하며 불명확한 항목은 담당자가 확인할 질문으로 남기는 방식이 적절합니다.'},
    {question:'자료가 없거나 서로 다른 문서가 충돌하면 어떻게 하나요?',answer:'빈 관측값을 정상이나 영 값으로 채우지 않고 자료 부족을 표시해야 합니다. 충돌하는 설명은 각 근거와 적용 시점을 함께 제시하고 담당자가 유효한 자료와 다음 확인 작업을 결정하도록 구성합니다.'},
    {question:'AI의 답변을 모델 변경 요청에 바로 사용할 수 있나요?',answer:'초안 생성과 변경 요청 등록, 실제 승인과 반영을 별도 단계로 정하는 편이 좋습니다. 담당자가 대상과 근거, 전달할 내용을 확인한 뒤 허용된 업무로 넘기고 반복 요청과 잘못된 전달의 정정도 시험해야 합니다.'},
    {question:'가상 계산 도구나 운영 자료 분석과도 연결할 수 있나요?',answer:'분석 목표와 입력 자료, 계산 조건 및 검증할 도구의 범위를 정한 뒤 검토할 수 있습니다. 언어 모델의 설명이 물리 계산을 대신한다고 안내하지 않고 결과의 근거와 사용 가능한 조건, 담당자의 검토 책임을 유지해야 합니다.'},
    {question:'시작 전에 어떤 평가 자료가 필요할까요?',answer:'대표 질문과 사람이 확인한 답변 근거, 대상·개정 관계 및 접근 권한을 준비하면 도움이 됩니다. 오래된 문서와 이름 중복, 누락과 권한 차이를 포함해 잘못된 답변을 보류하고 수정할 수 있는지 평가할 기준을 정합니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/ai/로봇스타트업/',label:'기술 자료와 실제 실행 책임의 구분',reason:'AI의 설명·검토 초안과 실제 장비 실행의 승인 범위를 나누는 방법을 비교합니다.'},
    {href:'/development-agency/ai/스마트시티업체/',label:'대상·기간·자료 권한에 따른 AI 지원',reason:'여러 시설과 자료 원본을 대상으로 근거와 접근 범위를 유지하는 업무를 확인합니다.'},
    {href:'/development-agency/ai/연구장비업체/',label:'조건과 자료 개정에 맞는 기술 답변',reason:'확인된 자료와 적용 조건을 바탕으로 질문과 기술 검토를 준비하는 범위를 검토합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'AI 검색 자료와 후속 실행의 권한',reason:'고객별 근거 열람과 자료 전송, 변경 요청의 승인 및 실행 경계를 정리합니다.'},
    {href:'/source-handover/',label:'근거·보류·정정과 평가의 운영 인수',reason:'권한 차이·오래된 문서·자료 누락을 시험하고 담당자가 운영 책임을 인수하는 범위를 정합니다.'},
  ],
  ctaContext:'반복되는 검토 질문과 대상·모델 개정, 실제 근거 자료 및 담당자의 승인 과정을 알려 주세요. 누락과 차이를 정리하고 근거가 유지되는 AI 검토 지원의 첫 범위를 함께 정리합니다.',
  evidenceSources:[
    {title:'NIST 생성형 AI 위험 관리 프로필',url:'https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf',use:'생성형 답변의 오류와 정보·접근 위험, 평가·운영 책임을 구분하는 일반 배경으로 참고했습니다. 특정 구현의 인증이나 정확도 보장으로 제시하지 않습니다.'},
    {title:'Microsoft Azure Digital Twins의 자료 입출력',url:'https://learn.microsoft.com/en-us/azure/digital-twins/concepts-data-ingress-egress',use:'모델과 외부 자료·후속 처리의 연결을 구분하는 기술 배경입니다. AI의 설명을 실제 자료의 수신·반영이나 계산 검증과 동일하게 취급하지 않습니다.'},
  ],
};
