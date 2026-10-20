import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { electricalManagementCore } from './management-core';
import { electricalManagementOperations } from './management-operations';

export const electricalManagementPage: AgencyPage = {
  slug:'management/전력설비업체', clusterIds:['ind-606-management'],
  primaryKeyword:'전력설비업체 관리 프로그램',
  keywordVariants:['전력설비 제작 관리','수배전반 제작 원장 개발','전력기기 납품 관리 시스템'],
  searchIntent:'주문별 전력설비의 확정 구성과 변경 적용 대상을 관리하고 조달·실제 투입·검사 근거·부분 출하를 개별 제작품에 연결하기',
  industry:'전력설비업체', serviceAxis:'관리 프로그램·ERP',
  title:'전력설비업체 관리 프로그램 | 구성 변경·제작품·출하 자료 | 름랩',
  description:'전력설비 제작 원장의 주문, 개별 식별자와 구성 변경을 설계합니다. 조달·투입 대조, 검사 문서 및 부분 출하를 연결해 누락과 변경 근거를 추적할 개발 범위를 확인하세요.',
  h1:'전력설비업체 관리 프로그램, 구성 변경을 개별 제작품과 출하 자료에 연결합니다',
  summary:'전력설비 관리 프로그램은 주문별 제작 대상의 확정 구성과 실제 투입, 검사·출하 근거를 이어 주는 업무 원장입니다. 변경이 적용되는 개별 설비를 구분하고 이전 구성과 승인 이유를 보존해야 합니다. 름랩은 현재 주문·조달·제작 자료를 확인해 부분 완료와 정정까지 추적할 수 있는 관리 범위를 설계합니다.',
  updatedAt:'2026-10-20',
  ...electricalManagementCore, ...electricalManagementOperations,
  sections:sections(['주문별 설비를 제작하고 인계하는 조직','구성 변경과 실제 투입이 어긋나는 문제','설계·구매·제작·검사·출하 역할','주문에서 개별 제작품의 납품까지','구성 기준본과 변경 적용 화면','누락 문서·수량 차이·정정 운영','제작품 관계와 조달 자료 연결','부분 취소·대체품·중복 식별자 처리','대표 주문의 첫 범위와 업무 확장','구성 규칙과 자료 이전의 비용·일정','기술 기준과 업무 완료의 의미 확인','변경·부분 출하·자료 복구 인수']),
  faq:[
    {question:'구성 목록이 바뀌면 모든 제작품에 적용되나요?',answer:'변경의 적용 대상과 시점을 별도로 정해야 합니다. 이미 제작 중이거나 출하한 설비의 실제 구성을 새 목록으로 덮어쓰지 않습니다. 변경 승인과 실제 적용 확인을 연결하고 이전 구성과 투입 이력을 보존하는 방식을 검토합니다.'},
    {question:'같은 모델은 하나의 기록으로 관리하면 되나요?',answer:'제품 모델과 개별 제작품은 관리 목적이 다를 수 있습니다. 계약별 구성이나 검사·출하 근거가 달라진다면 개별 식별자로 연결해야 합니다. 어떤 단계에서 번호를 부여하고 변경할 수 있는지 현재 업무를 기준으로 정합니다.'},
    {question:'대체 부품을 쓰는 경우도 기록할 수 있나요?',answer:'원래 계획한 품목과 실제 사용한 품목, 대체 승인과 적용 대상을 구분하는 흐름을 설계할 수 있습니다. 명칭만 바꾸거나 합계만 맞추면 나중에 실제 구성을 확인하기 어렵습니다. 필요한 기술 판단과 승인 책임은 운영 기준으로 제공해야 합니다.'},
    {question:'검사 파일을 첨부하면 출하 완료가 되나요?',answer:'파일 존재와 검사 결과 확인, 출하 승인 및 실제 출하는 서로 다른 상태입니다. 필요한 대상과 문서 버전, 보완 사항 및 승인 근거를 확인한 뒤 합의된 상태 전환을 적용합니다. 프로그램의 완료 표시가 제품 적합성을 자동 보증하지 않습니다.'},
    {question:'기존 엑셀 자료는 모두 이전할 수 있나요?',answer:'품목과 제작품의 식별자, 구성 버전 및 문서 연결이 어떤 수준으로 남아 있는지 확인해야 합니다. 중복이나 누락 자료는 대조 목록을 만들고 보류 이유를 남깁니다. 진행 중인 주문부터 적용하는 방법도 실제 운영 조건에 맞춰 검토할 수 있습니다.'},
    {question:'상담 시 어떤 업무 자료가 필요하나요?',answer:'대표 주문의 제작 대상과 구성, 조달·검사·출하 자료가 연결되는 방식을 알려 주세요. 비공개 설계 자료 전체를 먼저 전달할 필요는 없습니다. 정상 진행 사례와 변경·부분 출하 사례의 구조를 확인하면 범위와 검수 기준을 정리할 수 있습니다.'},
  ],
  relatedRoutes:[
    {href:'/erp/',label:'내부 업무 원장 설계',reason:'주문과 승인 상태, 마감 이후 정정의 범위를 정합니다.'},
    {href:'/solution/manufacturing/',label:'제작·품목 데이터 연결',reason:'계획 구성과 실제 제작 근거의 관계를 확인합니다.'},
    {href:'/development-agency/api-integration-development/',label:'조달·입고 자료 연동',reason:'외부 식별자와 중복 반영 방지 조건을 정합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'부서별 승인과 자료 접근',reason:'설계·구매·검사 담당자의 변경 권한을 검수합니다.'},
    {href:'/source-handover/',label:'관리 프로그램 운영 인수',reason:'기준 자료와 변경 절차, 복구 방법을 인계합니다.'},
  ],
  ctaContext:'주문에서 개별 설비의 제작·검사·출하까지 쓰는 자료와 구성 변경 방식을 알려 주세요. 실제 투입과 납품 근거를 추적할 수 있는 관리 프로그램 범위를 정리합니다.',
  evidenceSources:[
    {title:'Schneider Electric 전력설비 자료 구조 안내',url:'https://productinfo.se.com/esxp_digital_apps_nema/ealcm/English/BM_ESXP_DG_Electrical_Asset_Life_Cycle_Management_NEMA_0001154840.xml/$/ESXP_DG_EALCM_SD_Inputs_0001094176',use:'개별 설비의 식별 정보와 관련 문서를 연결하는 배경을 확인합니다. 구체적인 제작·시험 기준은 실제 프로젝트에서 별도로 확인해야 합니다.'},
    {title:'OWASP 애플리케이션 보안 검증 표준',url:'https://owasp.org/www-project-application-security-verification-standard/',use:'권한 분리와 자료 변경·내보내기 검수 범위를 정할 때 참고합니다.'},
  ],
};
