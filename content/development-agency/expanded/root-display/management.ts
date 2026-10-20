import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { displayManagementCore } from './management-core';
import { displayManagementOperations } from './management-operations';

export const displayManagementPage: AgencyPage = {
  slug:'management/디스플레이업체',clusterIds:['ind-610-management'],
  primaryKeyword:'디스플레이업체 관리 시스템 개발',
  keywordVariants:['디스플레이 주문 구성 관리','패널 모듈 개정 출하 관리','디스플레이 고객 제품 번호 대응 시스템'],
  searchIntent:'디스플레이 고객 주문의 제품·개정·공급 구성과 실제 준비 항목을 대조하고 변경 승인 및 부분 출하 근거를 관리하기',
  industry:'디스플레이업체',serviceAxis:'관리 프로그램·ERP',
  title:'디스플레이업체 관리 시스템 개발 | 주문 구성·개정·출하 대조 | 름랩',
  description:'고객 제품 번호와 내부 모델, 주문의 공급 구성 및 실제 준비 상태를 연결합니다. 구성 변경 승인, 문서 누락, 부분 출하와 기준 이력 관리 범위를 확인하세요.',
  h1:'디스플레이업체 관리 시스템, 주문 기준과 실제 출하 구성을 대조합니다',
  summary:'디스플레이 관리 시스템은 고객 주문이 요구한 모델·개정과 실제 준비한 공급 구성을 비교하는 업무부터 검토할 수 있습니다. 재고 수량과 출하 가능 상태, 변경 승인과 문서 준비는 구분해야 합니다. 름랩은 업체의 공급 단위와 기존 원장을 확인해 주문 기준·준비·차이 검토·부분 출하의 근거가 남는 관리 흐름을 설계합니다.',
  updatedAt:'2026-10-20',...displayManagementCore,...displayManagementOperations,
  sections:sections(['주문과 실제 공급 구성을 맞추는 조직','고객 번호·제품 개정·준비 상태의 불일치','주문 확인과 변경·출하를 승인하는 역할','주문 기준에서 준비·차이 검토·출하까지','구성 차이와 변경 영향을 확인하는 화면','기준표와 승인 대기·정정의 운영','고객 제품 번호와 구성·출하 자료 연결','대체 구성·부분 출하·과거 정정 처리','한 제품군의 대조 기능과 영향 조회 확장','기준 정리와 시스템 연동의 비용·일정','기술 승인과 거래 근거의 책임 구분','변경 적용과 연동 오류의 운영 인수']),
  faq:[
    {question:'재고가 있으면 출하 가능으로 표시하나요?',answer:'수량 외에 주문이 요구한 모델과 개정, 실제 구성 및 필요한 문서와 보류 사항을 확인해야 합니다. 어떤 조건을 충족해야 출하 가능으로 볼지는 회사의 실제 절차에 맞춰 정의합니다.'},
    {question:'고객 제품 번호와 내부 번호가 달라도 관리할 수 있나요?',answer:'대응 관계와 적용 근거를 관리하는 범위를 설계할 수 있습니다. 같은 이름이나 비슷한 번호만으로 자동 연결하지 않고 모델과 공급 구성, 적용 시점 등을 담당자가 확인하도록 해야 합니다.'},
    {question:'제품 구성을 바꾸면 모든 주문이 갱신되나요?',answer:'변경 적용 대상과 시점을 확인하는 절차가 필요합니다. 준비 전인 주문과 이미 일부 출하한 주문의 처리 방식은 다를 수 있습니다. 과거 주문과 출하 당시의 기준을 자동으로 덮어쓰지 않도록 설계합니다.'},
    {question:'부분 출하된 물량은 어떻게 기록하나요?',answer:'각 출하 건의 실제 구성과 수량, 확인 근거를 남기고 주문 전체의 계획 및 남은 물량과 연결합니다. 다음 출하의 기준이 달라진다면 해당 적용 근거를 확인하고 기록해야 합니다.'},
    {question:'기존 재고 프로그램을 교체해야 하나요?',answer:'반드시 그럴 필요는 없습니다. 어느 시스템이 모델과 수량 상태의 원본인지 확인하고 필요한 데이터를 연결해 주문 기준과 비교하는 범위를 검토할 수 있습니다. 누락과 중복, 정정의 연동 검수도 포함해야 합니다.'},
    {question:'도입 검토에는 어떤 사례가 필요한가요?',answer:'고객 제품 번호와 내부 모델의 대응 예시, 구성 변경이 있었던 주문 및 부분 출하 사례가 도움이 됩니다. 실제 민감 정보는 필요한 범위로 줄이고 담당자의 확인·승인·정정 흐름부터 정리할 수 있습니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/portal/디스플레이업체/',label:'고객 도면과 평가 근거의 포털',reason:'고객과 협의한 제품 개정·조건을 주문 내부 기준과 구분합니다.'},
    {href:'/development-agency/website/디스플레이업체/',label:'공급 형태와 공개 제품 안내',reason:'제품을 소개하는 공개 범위와 실제 주문의 확정 조건을 나눕니다.'},
    {href:'/development-agency/api-integration-development/',label:'재고·영업·문서 시스템 연결',reason:'식별자와 상태 원본, 중복·정정의 전달 방법을 확인합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'주문 자료와 승인 권한 검수',reason:'수량 입력과 구성 변경 승인, 고객별 자료 접근의 범위를 점검합니다.'},
    {href:'/source-handover/',label:'주문 구성 관리의 운영 인수',reason:'부분 출하와 기준 변경, 오류 후 수동 처리 근거를 전달합니다.'},
  ],
  ctaContext:'고객 제품 번호와 내부 모델의 대응, 주문별 공급 구성 및 변경·부분 출하 처리 방식을 알려 주세요. 실제 준비 상태를 주문 기준과 대조하는 관리 시스템 범위를 정리합니다.',
  evidenceSources:[
    {title:'W3C 웹 콘텐츠 접근성 기준 안내',url:'https://www.w3.org/WAI/WCAG22/quickref/',use:'주문 기준과 실제 준비 상태의 차이를 색상 외의 문구와 관계 정보로 전달하고 검토 화면을 키보드로 사용하는 기준을 참고합니다.'},
    {title:'LG Display 공개 제품 안내',url:'https://www.lgdisplay.com/eng/product/automotive-display/lcd',use:'제품이 적용 분야와 기술 범주별로 구분되는 공개 배경만 참고했습니다. 주문과 공급 구성 대조는 업체의 실제 원장을 확인해 설계하는 별도 제안입니다.'},
  ],
};
