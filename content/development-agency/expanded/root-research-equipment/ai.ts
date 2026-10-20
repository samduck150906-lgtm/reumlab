import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { researchEquipmentAiCore } from './ai-core';
import { researchEquipmentAiOperations } from './ai-operations';

export const researchEquipmentAiPage: AgencyPage = {
  slug:'ai/연구장비업체',clusterIds:['ind-614-ai'],
  primaryKeyword:'연구장비업체 AI 자동화',
  keywordVariants:['연구 장비 요구사항 AI 검토','분석 장비 구성 사양 대조 AI','장비 제안 문서 근거 확인 자동화'],
  searchIntent:'고객 요구 문서의 항목·단위·조건을 추출하고 실제 모델·옵션 자료의 근거와 대조해 조건부 비교·미확인·추가 질문 및 사람 승인으로 연결하기',
  industry:'연구장비업체',serviceAxis:'AI·GPT 자동화',
  title:'연구장비업체 AI 자동화 | 요구 조건·구성 근거·검토표 | 름랩',
  description:'고객 요구의 단위·조건·각주와 모델·옵션 자료의 근거를 연결합니다. 다른 구성 인용과 근거 없는 충족 표시를 검수하는 AI 보조의 적용 범위를 확인하세요.',
  h1:'연구장비업체 AI 자동화, 요구 조건과 실제 구성의 근거를 대조합니다',
  summary:'연구 장비 요구 문서의 값은 단위와 적용 조건, 각주 및 실제 공급 구성과 함께 검토해야 합니다. 름랩은 요구 항목을 원문에 연결하고 모델·옵션 자료의 대응 근거와 미확인 조건, 추가 질문 및 사람 승인을 관리하는 AI 보조 범위를 설계합니다.',
  updatedAt:'2026-10-21',...researchEquipmentAiCore,...researchEquipmentAiOperations,
  sections:sections(['고객 요구와 공급 구성을 검토하는 기술 담당자','단위·각주·다른 옵션 자료의 혼동','자료·제품·기술 검토·제안 승인 역할','요구 추출에서 근거 대조와 추가 질문까지','원문 위치와 조건을 함께 보는 검토표','구성 자료와 오류 유형·평가의 운영','요구 판본·구성·근거·승인의 연결','별첨 충돌·표 누락·권한 밖 자료 처리','대표 장비군의 첫 AI 검토 범위','자료 정비와 평가·연동의 비용·일정','고객 문서 처리와 기술 판단의 경계','오류·개정·사람 수정의 운영 인수']),
  faq:[
    {question:'요구사항과 제품 자료의 숫자가 같으면 충족으로 표시하나요?',answer:'같은 지표와 단위인지, 적용 조건과 실제 구성이 맞는지 확인해야 합니다. AI가 찾은 값과 원문 위치를 함께 보여 주고 조건이 다르거나 자료가 부족하면 미확인과 추가 질문으로 남기도록 설계하는 것이 좋습니다.'},
    {question:'각주와 별첨에 있는 조건도 확인할 수 있나요?',answer:'처리할 문서 형식과 표 구조에 맞춰 본문·표·각주·별첨의 관계를 검토할 수 있습니다. 일부 구간을 읽지 못하면 처리 범위와 누락을 표시하고 담당자가 원문을 확인하도록 해야 하며 모든 문서를 완전하게 해석한다고 보장하지 않습니다.'},
    {question:'선택 옵션의 기능을 기본 모델의 기능으로 제안하면 어떻게 하나요?',answer:'근거 자료의 적용 모델과 구성, 옵션 조건을 검토표에 연결하고 다른 구성의 인용을 오류 유형으로 평가합니다. 실제 공급 구성을 제품 담당자가 확인한 뒤 제안에 사용하도록 하며 승인되지 않은 결과를 견적에 자동 반영하지 않습니다.'},
    {question:'자료가 없는 요구사항은 AI가 추정해서 채워 주나요?',answer:'다른 모델의 값이나 일반적인 설명으로 보충하지 않고 자료가 없는 항목과 확인할 담당, 고객·제조사 질문으로 연결하는 범위가 적절합니다. 답을 만드는 기능뿐 아니라 근거가 부족할 때 보류하는 동작을 함께 검수해야 합니다.'},
    {question:'AI 검토표로 장비 적합성을 최종 확정할 수 있나요?',answer:'검토표는 요구와 근거, 조건 및 추가 질문을 정리하는 보조 자료입니다. 실제 기술 적합성과 공급·설치 가능성, 규제나 인증 요구의 충족은 해당 자료와 전문 담당자의 별도 검토가 필요합니다.'},
    {question:'고객 문서나 제품 자료가 바뀌면 기존 결과는 어떻게 되나요?',answer:'이전 검토와 전달본이 사용한 판본·구성·근거를 보존하고 변경된 항목에서 다시 확인할 범위를 찾도록 구성할 수 있습니다. 파일 이름이 같다는 이유로 이전 승인 결과를 자동 유지하거나 새 결과로 조용히 대체하지 않는 것이 좋습니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/website/연구장비업체/',label:'공개 사양 조건과 실제 공급 구성',reason:'AI가 참고할 제품 설명의 단위·적용 조건과 공개 자료 범위를 확인합니다.'},
    {href:'/development-agency/management/연구장비업체/',label:'승인된 주문 구성과 변경 이력',reason:'AI 검토 결과와 실제 제안·주문에 적용하는 구성 개정을 연결합니다.'},
    {href:'/development-agency/portal/연구장비업체/',label:'고객 자산별 적용 문서와 접근',reason:'모델 이름 외에 실제 장비 구성과 문서 개정을 구분하는 자료 관리 범위를 비교합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'고객 요구와 기술 자료의 접근 검수',reason:'권한 밖 검색과 외부 전달, 문서 안의 지시문 및 사용자 해제를 확인합니다.'},
    {href:'/source-handover/',label:'AI 평가와 제안 승인 운영 인수',reason:'근거 누락과 구성 오류, 자료 개정 및 사람 수정 이력을 담당자가 검수합니다.'},
  ],
  ctaContext:'대표 고객 요구 문서와 승인된 모델·옵션 자료, 기술 검토 기준을 알려 주세요. 원문과 대응 근거, 미확인 조건과 추가 질문을 사람이 승인하는 AI 적용 범위를 정리합니다.',
  evidenceSources:[
    {title:'Agilent 장비 설치 전 현장 준비 안내',url:'https://www.agilent.com/en/s/installation-relocation-services/site-preparation',use:'장비 자료의 조건과 실제 현장 준비의 확인을 구분하는 배경을 참고했습니다. AI의 조건 대조가 개별 현장의 적합성이나 전문 검증을 확정하지는 않습니다.'},
  ],
};
