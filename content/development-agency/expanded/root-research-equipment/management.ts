import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { researchEquipmentManagementCore } from './management-core';
import { researchEquipmentManagementOperations } from './management-operations';

export const researchEquipmentManagementPage: AgencyPage = {
  slug:'management/연구장비업체',clusterIds:['ind-614-management'],
  primaryKeyword:'연구장비업체 관리 프로그램',
  keywordVariants:['연구 장비 공급 관리 시스템','장비 구성 주문 출하 관리','분석 장비 설치 인수 원장'],
  searchIntent:'승인된 주문 구성의 개정과 실제 장비 자산·입고·배정·부분 출하·설치·고객 인수 및 미결을 내부 원장으로 연결하기',
  industry:'연구장비업체',serviceAxis:'관리 프로그램·ERP',
  title:'연구장비업체 관리 프로그램 | 구성 개정·자산·설치 인수 | 름랩',
  description:'승인된 주문 구성과 실제 장비·부속품을 대조합니다. 입고·배정·부분 출하·설치 및 고객 확인을 연결하고 변경·부족·후속 작업을 추적하는 구축 범위를 확인하세요.',
  h1:'연구장비업체 관리 프로그램, 주문 구성과 실제 출하·설치 자산을 맞춥니다',
  summary:'장비 본체와 옵션·부속품·소프트웨어를 공급할 때는 승인된 주문의 구성과 실제 이행 내역을 연결해야 합니다. 름랩은 구성 개정과 자산 식별, 부분 입고·출하 및 설치·고객 확인을 구분하고 남은 품목과 작업이 이어지는 관리 프로그램을 설계합니다.',
  updatedAt:'2026-10-21',...researchEquipmentManagementCore,...researchEquipmentManagementOperations,
  sections:sections(['주문 구성과 이행 범위를 맞추는 내부 담당자','구성 누락과 출하·설치 완료의 혼동','영업·구매·창고·설치·인수 승인 역할','견적 개정에서 자산 배정과 고객 확인까지','구성·실재고·미결을 연결하는 화면','대체·조정·정정 승인과 미결 운영','주문 개정·자산·물류·결과 자료의 원장','부분 공급·현장 지연·인수 정정의 예외','대표 장비군의 첫 주문 이행 검수','구성 정리와 자료 이전의 비용·일정','계약·기술 자료·상태 확정의 책임 확인','직무별 이행 대조와 원장 운영 인수']),
  faq:[
    {question:'모델과 주문 수량만 관리하면 부족한가요?',answer:'기본 구성과 선택 옵션, 부속품 및 제공 서비스가 다르면 같은 모델·수량이어도 실제 이행 범위가 달라질 수 있습니다. 승인된 주문 구성을 실제 자산과 품목·문서에 연결하고 빠진 항목과 확인이 필요한 조건을 관리하는 것이 좋습니다.'},
    {question:'일부 장비만 먼저 보내는 주문도 관리할 수 있나요?',answer:'실제 출하한 자산과 품목, 미출하 범위 및 설치에 필요한 후속 확인을 구분할 수 있습니다. 전체 주문이 완료된 것으로 처리하지 않고 부족 품목과 남은 작업의 담당을 원래 주문에 연결합니다.'},
    {question:'고객이 구성 변경을 요청하면 기존 주문을 수정하면 되나요?',answer:'제안한 변경과 승인된 변경을 나누고 이미 구매·배정·출하한 내역에 미치는 영향을 확인해야 합니다. 실제 이행이 참조한 개정은 보존하고 승인 이후의 적용 범위와 추가 조치를 연결하는 방식이 좋습니다.'},
    {question:'시연용 장비를 판매 재고와 함께 관리할 수 있나요?',answer:'같은 원장에서 관리하더라도 자산의 용도와 상태, 고객 배정 및 판매 가능 여부를 구분해야 합니다. 시연·대여 자산을 판매로 전환할 때 필요한 확인과 문서·승인 조건은 실제 운영 기준에 맞춰 정합니다.'},
    {question:'설치 완료를 기록하면 고객 인수도 끝나나요?',answer:'실제 작업과 결과 문서, 고객의 확인 및 계약상 인수 조건은 다를 수 있습니다. 대상 자산과 구성, 남은 작업 및 확인 조건을 연결하고 설치 기록만으로 모든 검증이나 인수가 끝났다고 자동 판정하지 않습니다.'},
    {question:'기존 회계 프로그램을 바꿔야 하나요?',answer:'기존 회계 원장을 유지하면서 주문과 물류·설치의 상태를 필요한 거래 식별자로 연결하는 범위를 검토할 수 있습니다. 청구·수금 원본과 물류·고객 확인 상태의 의미 및 확정 책임을 먼저 구분하는 것이 좋습니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/website/연구장비업체/',label:'공개 장비 구성과 공급 범위 안내',reason:'홈페이지에서 안내한 구성과 실제 주문의 합의 범위를 연결합니다.'},
    {href:'/development-agency/portal/연구장비업체/',label:'설치 자산별 고객 자료와 지원',reason:'내부 이행 원장에서 확인한 장비와 구성을 고객용 자료함 및 지원 공간에 연결합니다.'},
    {href:'/development-agency/existing-codebase-audit/',label:'기존 주문·자산 원장 연동 검토',reason:'구성 개정과 물류·회계 식별자를 기존 코드와 데이터에서 추적할 수 있는지 확인합니다.'},
    {href:'/solution/manufacturing/',label:'제조·공급 업무의 관리 범위 비교',reason:'일반 생산 관리와 장비 공급·설치 인수의 업무 경계를 검토합니다.'},
    {href:'/source-handover/',label:'장비 이행 원장 운영 인수',reason:'부분 공급과 구성 변경, 자산 정정 및 연동 실패를 담당자가 직접 검수합니다.'},
  ],
  ctaContext:'대표 견적의 장비 구성과 개정, 실제 입고·출하·설치 자료 및 기존 원장을 알려 주세요. 주문과 자산의 이행 범위, 부족 품목과 후속 작업이 연결되는 관리 프로그램을 정리합니다.',
  evidenceSources:[
    {title:'Agilent 장비 설치 전 현장 준비 안내',url:'https://www.agilent.com/en/s/installation-relocation-services/site-preparation',use:'설치 작업 전 현장 준비 확인과 공급·설치 업무의 상태를 나누는 배경을 참고했습니다. 실제 확인 항목은 해당 장비의 승인된 자료와 계약을 따라야 합니다.'},
    {title:'Agilent 장비 설치 서비스 안내',url:'https://www.agilent.com/en/s/installation-relocation-services/instrument-installation',use:'장비 도착·설치와 사양에 따른 확인·교육의 범위가 연결된다는 배경 자료입니다. 프로그램의 기록을 제조사 인증이나 규제 적합성 판정으로 사용하지 않습니다.'},
  ],
};
