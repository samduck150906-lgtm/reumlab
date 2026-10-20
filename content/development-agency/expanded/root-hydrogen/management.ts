import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { hydrogenManagementCore } from './management-core';
import { hydrogenManagementOperations } from './management-operations';

export const hydrogenManagementPage: AgencyPage = {
  slug:'management/수소에너지업체', clusterIds:['ind-605-management'],
  primaryKeyword:'수소에너지업체 관리 프로그램',
  keywordVariants:['수소 공급 관리 시스템','수소에너지업체 ERP','수소 납품 기록 프로그램'],
  searchIntent:'수소 공급 주문과 실제 공급 건의 출고·인계·수령 근거를 연결하고 수량 차이와 정정·마감을 관리하기',
  industry:'수소에너지업체', serviceAxis:'관리 프로그램·ERP',
  title:'수소에너지업체 관리 프로그램 | 공급 기록·수량 대조·마감 | 름랩',
  description:'수소 공급 주문과 출고·인계·수령 기록을 연결하는 관리 프로그램을 설계합니다. 단위와 원본 근거, 부분 이행, 이견 처리와 마감 후 정정을 포함한 구축·인수 기준을 확인하세요.',
  h1:'수소에너지업체 관리 프로그램, 공급 한 건의 근거와 마감을 연결합니다',
  summary:'수소에너지 공급 관리 프로그램은 주문한 내용과 실제 출고·인계·수령 기록을 연결해 누락과 차이를 찾는 업무 시스템입니다. 각 수량의 단위와 출처, 확정 주체를 구분하고 부분 이행과 정정을 마감 기록까지 이어서 관리합니다. 름랩은 실제 공급 자료와 운영 기준을 확인해 입력·대조·승인·인수의 개발 범위를 정리합니다.',
  updatedAt:'2026-10-20',
  ...hydrogenManagementCore, ...hydrogenManagementOperations,
  sections:sections(['공급 기록을 여러 부서가 이어 쓰는 업무','주문·출고·수령 값이 섞이는 문제','입력·확인·마감·정정 권한','주문 한 건에서 공급과 마감까지','원본 근거와 수량 대조 화면','미확인·이견·마감 보류 관리','공급 데이터 관계와 기존 시스템 연결','부분 이행·단위 차이·중복 자료 처리','한 공급 유형의 첫 범위와 청구 연결 확장','견적·일정에 영향을 주는 원본과 운영 규칙','안전·품질 기록과 업무 상태의 확인 범위','마감과 정정을 직접 처리하는 인수 검수']),
  faq:[
    {question:'출고량과 수령량을 하나의 수량으로 관리해도 되나요?',answer:'실제 업무에서 각 기록이 어떤 의미를 갖는지 먼저 확인해야 합니다. 값의 출처와 단위, 시점이 다르면 각각 보존하고 대조하는 방식이 필요할 수 있습니다. 청구나 재고 판단에 사용할 값은 담당자가 승인한 기준에 따라 정합니다.'},
    {question:'한 주문을 여러 번 나누어 공급할 수 있나요?',answer:'주문 항목과 실제 공급 건을 나누어 연결하면 부분 이행을 표현할 수 있습니다. 취소하거나 확인이 끝나지 않은 건의 포함 여부도 정해야 합니다. 완료 건수만으로 주문이 모두 이행되었다고 판단하지 않고 합의한 수량과 조건을 확인합니다.'},
    {question:'기존 엑셀의 단위가 제각각이면 어떻게 이전하나요?',answer:'원본 단위와 변환에 필요한 근거를 먼저 정리합니다. 확인할 수 없는 값을 임의로 변환해 합계에 넣지 않습니다. 기준 목록과 제외·보류 사유를 남기고 이전 후 원본 기록의 건수와 주요 값을 같은 조건으로 대조합니다.'},
    {question:'이미 마감한 공급 기록을 고칠 수 있나요?',answer:'마감 후 정정 권한과 승인 절차를 운영 정책으로 정의할 수 있습니다. 원래 값을 남기고 정정 사유와 증빙, 청구 영향까지 연결하는 방식이 필요합니다. 수정값을 과거 보고에 자동 반영할지는 해당 보고의 기준과 책임자가 결정합니다.'},
    {question:'장비와 운송 시스템을 모두 연결해야 하나요?',answer:'첫 범위는 실제 업무를 마감할 수 있는 자료 연결부터 정할 수 있습니다. 연동이 필요하면 공식 제공 기능과 원본 식별자, 실패 시 재처리 규칙을 확인합니다. 실시간 장비 제어는 별도 전문 검토와 권한이 필요한 범위로 다룹니다.'},
    {question:'도입 상담 전에 어떤 자료를 준비하나요?',answer:'대표 주문과 공급 기록, 사용하는 단위, 수령 확인 자료와 정정 사례의 종류를 정리하면 됩니다. 고객의 비공개 계약 원문 전체를 처음부터 보낼 필요는 없습니다. 자료 구조와 담당 역할을 확인한 뒤 안전한 예시 전달 범위를 정합니다.'},
  ],
  relatedRoutes:[
    {href:'/erp/',label:'업무 관리 시스템 기획',reason:'부서별 입력과 승인, 원본 기록의 책임을 구체화합니다.'},
    {href:'/development-agency/inventory-management-system-development/',label:'단위와 재고 원장 설계',reason:'기록의 의미와 대조 기준을 갖춘 수량 관리를 살펴봅니다.'},
    {href:'/development-agency/settlement-system-development/',label:'마감과 정산 근거 관리',reason:'확정 기록과 청구·조정 자료의 연결 조건을 비교합니다.'},
    {href:'/development-agency/api-integration-development/',label:'기존 도구 연동 범위',reason:'같은 원본 자료가 중복 처리되지 않도록 연결 규칙을 정합니다.'},
    {href:'/source-handover/',label:'고객 소유 운영 자료 인수',reason:'배포·자료 복구와 담당자 변경 후 운영할 조건을 확인합니다.'},
  ],
  ctaContext:'주문과 공급 건을 현재 어떻게 연결하는지, 출고·수령 근거와 마감 기준이 무엇인지 알려 주세요. 부분 이행과 정정을 포함해 실제로 완료할 수 있는 관리 프로그램 범위를 정리합니다.',
  evidenceSources:[
    {title:'미국 에너지부 수소 공급 분야',url:'https://www.energy.gov/cmei/fuels/hydrogen-delivery',use:'운송·저장·최종 공급의 사업 역할을 이해하기 위한 참고 자료이며 개별 사업자의 수량 계산 기준을 정하는 자료는 아닙니다.'},
    {title:'OWASP 보안 검증 표준',url:'https://owasp.org/projects/asvs',use:'기록 변경 권한과 승인·내보내기 등 합의한 구현 범위의 검수 항목을 구체화합니다.'},
  ],
};
