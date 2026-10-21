import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { laboratoryOperationsAiCore } from './ai-core';
import { laboratoryOperationsAiOperations } from './ai-operations';

export const laboratoryOperationsAiPage: AgencyPage = {
  slug:'ai/실험실관리업체',clusterIds:['ind-615-ai'],
  primaryKeyword:'실험실관리업체 AI 자동화',
  keywordVariants:['실험실 운영 절차 개정 AI 비교','실험실 문서 변경 영향 검토 AI','운영 양식 교육 자료 대조 자동화'],
  searchIntent:'기관별 승인 절차와 개정안을 원문에 연결해 비교하고 양식·안내·교육 자료의 영향 후보와 시행 조건을 담당자가 검토·승인하도록 보조하기',
  industry:'실험실관리업체',serviceAxis:'AI·GPT 자동화',
  title:'실험실관리업체 AI 자동화 | 절차 개정·영향 근거·승인 | 름랩',
  description:'승인본과 개정안의 문장·표·별첨을 대조합니다. 기관별 적용 범위와 시행일, 양식·교육 자료의 영향 근거를 사람이 검토하는 AI 적용 범위를 확인하세요.',
  h1:'실험실관리업체 AI 자동화, 절차 개정과 관련 자료의 영향을 근거로 검토합니다',
  summary:'운영 절차의 새 문서를 받았다고 모든 기관의 양식과 안내가 즉시 바뀌는 것은 아닙니다. 름랩은 승인 상태와 적용 범위·시행일을 확인하고 변경 원문과 연결 자료의 영향 후보, 담당자 검토 및 승인이 이어지는 AI 보조 업무를 설계합니다.',
  updatedAt:'2026-10-21',...laboratoryOperationsAiCore,...laboratoryOperationsAiOperations,
  sections:sections(['운영 절차와 관련 자료의 변경을 검토하는 담당자','초안·현행본·기관별 적용 조건의 혼동','문서·업무·기관 승인·교육 준비의 역할','변경 비교에서 영향 확정과 후속 확인까지','이전·제안 원문과 영향 근거를 보는 화면','문서 상태·참조 관계·오류 평가의 운영','기관·판본·시행일·영향·승인의 연결','같은 문서 번호·별첨 충돌·과거 적용본','한 기관의 첫 변경 비교와 보류 검수','자료 정비와 평가·연동의 비용·일정','전문 판단과 절차 시행·이행 확인의 경계','변경·권한·처리 실패의 운영 인수']),
  faq:[
    {question:'새 개정 번호가 있으면 모든 기관에 바로 적용하나요?',answer:'승인 상태와 적용 기관·업무, 시행 시점을 함께 확인해야 합니다. 검토 중인 초안과 현행 안내를 구분하고 개정 번호만으로 모든 기관과 과거 업무를 새 기준으로 바꾸지 않도록 설계하는 것이 좋습니다.'},
    {question:'AI가 관련 양식과 교육 대상을 자동으로 확정하나요?',answer:'실제 문서 참조와 확인된 관계를 근거로 영향 후보를 제시하고 업무 책임자가 확정하도록 구성할 수 있습니다. 근거가 없는 관계와 교육 이행은 만들어 내지 않고 확인 질문과 미확인 범위로 남겨야 합니다.'},
    {question:'문장만 비교하면 변경 영향을 알 수 있나요?',answer:'문장 차이와 실제 업무 영향은 다를 수 있습니다. 표·별첨과 참조 자료, 적용 역할 및 기록 항목을 함께 검토하고 담당자가 원문과 근거를 확인한 뒤 수정·유지·추가 확인으로 정리하는 범위가 필요합니다.'},
    {question:'AI 요약을 읽으면 교육 이수로 처리해도 되나요?',answer:'요약 열람과 실제 교육·이해 확인, 운영 이행은 각각 다른 상태입니다. 대상 자료와 확인 의미를 명확히 하고 실제 기관 절차에 맞춘 이행 확인을 별도로 관리해야 합니다.'},
    {question:'여러 고객 실험실의 문서를 한 번에 검색할 수 있나요?',answer:'사용자에게 허용된 기관과 업무·문서 범위부터 확인해야 합니다. 같은 문서 번호라도 기관별 내용과 적용 조건이 다를 수 있으므로 검색 결과와 요약·인용에 다른 기관 자료가 섞이지 않는지 검수합니다.'},
    {question:'AI가 실험 방법이나 안전 절차도 새로 만들어 주나요?',answer:'이 페이지의 범위는 승인 자료와 개정안의 변경·영향을 정리하는 보조 업무입니다. 전문 방법과 안전 판단, 시행 승인 및 실제 결과의 적합성은 해당 담당자가 검토해야 하며 AI가 이를 대신 확정하는 기능으로 구성하지 않습니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/website/실험실관리업체/',label:'실제 운영 지원과 고객 책임의 설명',reason:'AI 적용 전에 업체가 수행할 업무와 고객 기관의 검토 책임을 확인합니다.'},
    {href:'/development-agency/laboratory-sample-management/',label:'실험실 시료·결과의 업무 원장',reason:'문서 변경 검토와 실제 업무 기록·결과 관리의 기능 경계를 구분합니다.'},
    {href:'/development-agency/ai/연구장비업체/',label:'원문 조건과 구성 근거를 대조하는 AI',reason:'요구 대조와 운영 절차 개정에서 각각 확인할 근거·적용 범위·승인 책임을 비교합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'기관별 문서 검색과 지시문 처리 검수',reason:'권한 밖 자료와 문서 안의 실행 요구가 결과·외부 실행에 영향을 주지 않는지 확인합니다.'},
    {href:'/source-handover/',label:'변경 영향 AI의 평가와 운영 인수',reason:'시행일·참조 누락·문서 개정 및 사람 수정 사례를 담당자가 직접 검수합니다.'},
  ],
  ctaContext:'대표 승인 절차와 개정안, 연결된 양식·안내·교육 자료 및 기관별 승인 구조를 알려 주세요. 변경 근거와 영향 후보를 사람이 검토하는 AI 적용 범위를 정리합니다.',
  evidenceSources:[
    {title:'OWASP LLM 프롬프트 주입 예방 안내',url:'https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html',use:'참고 문서의 내용을 실행 지시와 구분하고 외부 실행의 권한·사람 확인을 검수하는 배경을 참고했습니다. 특정 방어만으로 모든 공격과 자료 노출을 막는다고 보장하지 않습니다.'},
  ],
};
