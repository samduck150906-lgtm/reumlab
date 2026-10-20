import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { semiconductorFieldCore } from './field-core';
import { semiconductorFieldOperations } from './field-operations';

export const semiconductorFieldPage: AgencyPage = {
  slug:'field/반도체장비업체',clusterIds:['ind-609-field'],
  primaryKeyword:'반도체장비업체 현장 관리 앱',
  keywordVariants:['반도체 장비 서비스 작업 앱','장비 현장 작업 보고 시스템','반도체 장비 미완료 작업 인계'],
  searchIntent:'반도체 장비 현장 서비스의 대상·절차 버전·사용 부품·미완료 항목을 고객 보안 조건에 맞춰 기록하고 인계하는 앱 개발',
  industry:'반도체장비업체',serviceAxis:'현장·작업 관리',
  title:'반도체장비업체 현장 관리 앱 | 작업 기록·미완료 인계 | 름랩',
  description:'반도체 장비 현장 서비스의 장비·절차·부품 기록과 미완료 인계를 연결합니다. 촬영 제한과 오프라인 입력, 기술 검토·고객 확인의 상태를 나눠 개발 범위를 확인하세요.',
  h1:'반도체장비업체 현장 관리 앱, 수행한 작업과 남은 확인을 이어 줍니다',
  summary:'반도체 장비 현장 관리 앱은 대상 장비와 적용 절차, 수행 사실 및 사용·회수 부품을 연결하고 미완료 항목을 다음 담당자에게 인계하는 범위로 설계할 수 있습니다. 고객의 촬영·네트워크 조건과 실제 승인 체계를 확인해야 합니다. 름랩은 기록 제출과 검토·고객 확인을 구분하는 현장 흐름을 정리합니다.',
  updatedAt:'2026-10-20',...semiconductorFieldCore,...semiconductorFieldOperations,
  sections:sections(['고객 현장의 장비 서비스 기록','대상 누락과 방문 종료 뒤 사라지는 일','배정·수행 기록·기술 검토·고객 확인','작업 배정에서 보고 승인과 후속 인계까지','절차와 미완료 상태를 읽는 현장 화면','부품 불일치와 고객별 보안 조건 운영','장비·방문 기록과 지원 도구 연결','촬영 제한·공동 작업·미전송 처리','한 서비스 유형의 첫 적용과 방문 연결','현장 조건과 기록 연동의 비용·일정','작업 확인과 장비 사용 승인의 경계','절차 갱신·보고 정정·인계의 운영 인수']),
  faq:[
    {question:'작업 기록을 제출하면 장비 사용 승인도 끝나나요?',answer:'기록 제출과 기술 검토, 고객 확인 및 장비 사용·생산 재개 승인은 다른 상태일 수 있습니다. 실제 책임자와 절차를 확인해 구분해야 합니다. 앱의 완료 버튼이 모든 승인을 대신하도록 만들지 않습니다.'},
    {question:'사진을 찍을 수 없는 고객 현장은 어떻게 하나요?',answer:'고객이 허용한 기록과 근거 전달 방식을 확인해 양식을 구성해야 합니다. 모든 현장에 사진 필수를 강제하거나 임의의 이미지를 대신 첨부하지 않습니다. 촬영과 자료 반출 조건을 초기 요구 정리에서 확인합니다.'},
    {question:'같은 모델의 장비가 여러 대면 어떻게 구분하나요?',answer:'고객 장소와 실제 장비 식별자, 필요한 경우 구성 단위까지 연결합니다. 배정 정보와 현장 표기가 다르면 확인 요청으로 남기고 비슷한 이름만으로 같은 대상으로 처리하지 않습니다. 사용 절차의 버전도 함께 기록합니다.'},
    {question:'일부 작업만 끝난 방문도 기록할 수 있나요?',answer:'수행한 범위와 미완료 이유, 다음 담당자 및 확인 조건을 남길 수 있습니다. 방문 종료를 위해 모든 항목을 완료로 바꾸지 않습니다. 후속 방문이 생기면 이전 미완료 항목과 새 배정 범위를 연결하도록 설계합니다.'},
    {question:'사용한 부품과 회수한 부품도 관리하나요?',answer:'두 대상을 각각의 식별자와 작업 사건에 연결해 내부 부품 원장과 대조할 수 있습니다. 현장에서 입력한 사실과 기술적 사용 승인, 반환 상태는 구분해야 합니다. 실제 관리 시스템의 원본 책임을 확인해 연동 범위를 정합니다.'},
    {question:'개발 전 무엇을 확인하면 좋나요?',answer:'현재 작업 양식과 장비 식별 방식, 미완료 인계 및 고객 보고 흐름을 알려 주세요. 현장 기기와 촬영·네트워크·자료 반출 조건, 기술 검토와 고객 확인의 책임자를 함께 확인하면 구현과 현장 검수의 범위를 정리할 수 있습니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/portal/반도체장비업체/',label:'고객 지원 요청과 공개 보고',reason:'현장 작업의 시작과 고객에게 전달할 결과를 연결합니다.'},
    {href:'/development-agency/management/반도체장비업체/',label:'서비스 부품의 출고·반환 이력',reason:'사용한 부품과 회수한 대상의 원장 연결을 확인합니다.'},
    {href:'/development-agency/api-integration-development/',label:'작업 기록과 내부 도구 연동',reason:'미전달 기록과 중복 처리, 원본 책임의 범위를 정합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'현장 자료와 기기 접근 점검',reason:'고객별 촬영·저장·전송 조건과 권한 검수를 준비합니다.'},
    {href:'/source-handover/',label:'현장 기록 앱 운영 인수',reason:'미완료 인계와 보고 정정, 절차 갱신의 운영 방법을 정합니다.'},
  ],
  ctaContext:'현장 서비스의 대상 식별과 승인 절차, 현재 작업 양식 및 고객의 촬영·통신 조건을 알려 주세요. 수행 사실과 미완료 인계를 보존하는 앱 범위를 정리합니다.',
  evidenceSources:[
    {title:'Lam Research 장비 서비스 소개',url:'https://www.lamresearch.com/customer-support/service/',use:'장비 서비스와 지원 업무가 장비 수명주기에 걸쳐 이어지는 공개 배경을 참고했습니다. 상세 기록 흐름은 별도 제안이며 해당 제조사의 현장 절차를 재현하지 않습니다.'},
    {title:'W3C 접근성 빠른 참조',url:'https://www.w3.org/WAI/WCAG22/quickref/',use:'현장 기기의 입력 라벨과 오류 설명, 색상에만 의존하지 않는 상태 표시를 검수할 때 참고합니다.'},
  ],
};
