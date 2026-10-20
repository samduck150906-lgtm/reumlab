import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { semiconductorAiCore } from './ai-core';
import { semiconductorAiOperations } from './ai-operations';

export const semiconductorAiPage: AgencyPage = {
  slug:'ai/반도체장비업체',clusterIds:['ind-609-ai'],
  primaryKeyword:'반도체장비업체 AI 자동화',
  keywordVariants:['반도체 장비 지원 기록 AI','장비 로그 메모 사건 정리','반도체 기술 지원 인계 요약'],
  searchIntent:'반도체 장비 지원 사건의 허용된 로그·현장 메모·고객 설명을 출처와 시각 기준에 따라 정리해 기술 검토와 인계를 지원하기',
  industry:'반도체장비업체',serviceAxis:'AI·GPT 자동화',
  title:'반도체장비업체 AI 자동화 | 지원 기록·사건 근거 정리 | 름랩',
  description:'반도체 장비 지원 사건의 로그와 현장 메모를 출처·시각 기준에 따라 정리합니다. 미확인 시간 관계와 상충 기록, 담당자 검토 및 고객 공개 범위를 확인하세요.',
  h1:'반도체장비업체 AI 자동화, 지원 사건의 기록과 미확인 근거를 정리합니다',
  summary:'반도체 장비 AI 자동화는 지원 사건의 로그와 작업 메모, 고객 설명을 출처와 시각 기준에 맞춰 정리하는 업무부터 검토할 수 있습니다. 관찰한 사실과 보고된 내용, 기술적 원인 판단은 구분해야 합니다. 름랩은 허용된 사건 자료와 검토 기준을 확인해 근거·누락·상충 기록을 보존하는 AI 지원 흐름을 정리합니다.',
  updatedAt:'2026-10-20',...semiconductorAiCore,...semiconductorAiOperations,
  sections:sections(['지원 사건의 근거를 모으는 기술 조직','시간 기준과 다른 장비 기록이 섞이는 문제','자료 확인·기술 검토·공개 승인 역할','자료 묶음에서 근거 검토와 인계까지','사건 순서와 원문이 연결된 검토 화면','시간 오류·혼입·누락의 평가 운영','출처 기록과 지원·현장 도구 연결','불명확한 시간·손상 자료·외부 지시 처리','한 사건 유형의 첫 적용과 인계 확장','자료 정리와 평가·연동의 비용·일정','고객 로그 사용과 기술 판단의 책임','회귀 평가와 수동 지원의 운영 인수']),
  faq:[
    {question:'AI가 장비 고장의 원인을 바로 알려 주나요?',answer:'이 범위는 지원 기록의 근거와 시간 관계, 추가 확인 질문을 정리하는 업무입니다. 로그의 유사성만으로 고장 원인을 확정하지 않습니다. 기술적 원인 판단과 실제 조치는 책임 있는 담당자가 자료와 적용 조건을 검토해야 합니다.'},
    {question:'로그와 현장 메모의 시간이 다르면 어떻게 하나요?',answer:'각 기록의 원래 시각과 시간대·기준을 보존하고 확인된 변환 근거만 적용해야 합니다. 기준이 불명확하면 순서를 확정하지 않고 질문으로 남깁니다. 단순 정렬 결과가 실제 발생 순서와 같다고 가정하지 않습니다.'},
    {question:'서로 다른 고객 설명은 하나로 합쳐지나요?',answer:'비슷한 설명을 묶는 후보를 제공할 수 있지만 원본과 제공자를 보존해야 합니다. 상충하는 내용은 차이를 드러내고 담당자가 확인하도록 합니다. AI가 한 설명을 선택해 다른 근거를 조용히 삭제하지 않는지 평가합니다.'},
    {question:'장비를 조작하거나 명령을 실행하나요?',answer:'기록 정리 기능에 제어 권한을 부여할 필요는 없습니다. 로그나 문서에 있는 명령과 링크는 자료로 취급하고 자동 실행·전송으로 연결하지 않습니다. 원격 제어나 진단은 별도의 기술·보안 책임과 승인 절차를 확인해야 합니다.'},
    {question:'일부 기간의 로그만 있어도 사용할 수 있나요?',answer:'제공된 범위 안에서 근거를 정리할 수 있지만 누락된 기간과 확인하지 못한 부분을 표시해야 합니다. 자료가 없다는 사실을 정상 운영이나 사건 종료로 바꾸지 않습니다. 추가로 필요한 자료는 검토자가 결정하도록 합니다.'},
    {question:'검토를 시작하려면 무엇을 준비하면 되나요?',answer:'사용 허락을 받은 지원 사건의 기록 형식과 시각 기준, 담당자가 확인한 요약 또는 검토 결과가 도움이 됩니다. 실제 민감한 로그 전체를 먼저 전달할 필요는 없습니다. 접근 권한과 허용된 자료 처리 방식도 함께 확인합니다.'},
  ],
  relatedRoutes:[
    {href:'/ai-automation/',label:'AI 업무 자동화 범위 검토',reason:'기록 정리와 기술적 판단, 승인 책임을 구분합니다.'},
    {href:'/development-agency/field/반도체장비업체/',label:'현장 작업의 근거와 인계',reason:'AI가 정리할 현장 기록과 미완료 항목의 입력 구조를 확인합니다.'},
    {href:'/development-agency/portal/반도체장비업체/',label:'고객 지원 사건과 공개 답변',reason:'고객 자료의 접근과 승인된 설명의 전달 흐름을 나눕니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'장비 로그와 외부 자료 처리 검수',reason:'원문 속 지시와 자료 전송, 고객별 검색 권한을 확인합니다.'},
    {href:'/source-handover/',label:'지원 기록 AI와 평가 기준 인수',reason:'시간·출처 오류 평가와 모델 변경 후 검수 방법을 준비합니다.'},
  ],
  ctaContext:'지원 사건에 모이는 로그와 현장 메모의 형식, 시각 기준 및 기술 검토·공개 승인 흐름을 알려 주세요. 근거와 미확인 질문을 보존하는 AI 기록 정리 범위를 정리합니다.',
  evidenceSources:[
    {title:'OWASP 프롬프트 인젝션 위험',url:'https://genai.owasp.org/llmrisk/llm01-prompt-injection/',use:'로그와 고객 문서에 포함된 내용을 실행 지시로 취급하지 않고 시스템의 읽기·전송·실행 권한을 구분하는 검수 항목을 참고합니다.'},
    {title:'Lam Research 장비 서비스 소개',url:'https://www.lamresearch.com/customer-support/service/',use:'장비 지원 업무의 공개 배경을 참고했습니다. 이 페이지의 AI 기록 정리는 별도 설계 제안이며 해당 제조사의 진단 모델이나 성능을 설명하지 않습니다.'},
  ],
};
