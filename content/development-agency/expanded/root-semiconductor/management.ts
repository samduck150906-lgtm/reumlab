import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { semiconductorManagementCore } from './management-core';
import { semiconductorManagementOperations } from './management-operations';

export const semiconductorManagementPage: AgencyPage = {
  slug:'management/반도체장비업체',clusterIds:['ind-609-management'],
  primaryKeyword:'반도체장비업체 관리 프로그램',
  keywordVariants:['반도체 장비 서비스 부품 관리','장비 부품 교환 반환 시스템','수리 부품 개별 이력 관리'],
  searchIntent:'반도체 장비 서비스 부품의 개별 식별과 출고·교환·반환·수리 상태를 고객 지원 사건에 연결하는 관리 프로그램',
  industry:'반도체장비업체',serviceAxis:'관리 프로그램·ERP',
  title:'반도체장비업체 관리 프로그램 | 부품 교환·반환 이력 | 름랩',
  description:'반도체 장비 서비스 부품의 개별 식별과 출고·반환·수리 관계를 관리합니다. 교환 대상과 소유자, 검토 상태 및 기존 창고·지원 도구 연결 범위를 확인하세요.',
  h1:'반도체장비업체 관리 프로그램, 서비스 부품의 출고와 반환 관계를 이어 줍니다',
  summary:'반도체 장비 관리 프로그램은 서비스용 부품의 개별 식별자와 개정, 출고·반환·수리 이력을 고객 지원 사건에 연결하는 범위에서 설계할 수 있습니다. 창고 도착과 사용 가능 승인, 소유자와 실제 보관 위치를 구분해야 합니다. 름랩은 교환 사건과 원장 예시를 확인해 미반환·불일치·정정을 처리하는 관리 흐름을 정리합니다.',
  updatedAt:'2026-10-20',...semiconductorManagementCore,...semiconductorManagementOperations,
  sections:sections(['서비스 부품의 교환과 수리를 관리하는 조직','출고 대상과 반환 대상의 연결이 끊기는 문제','기술 확인·창고 이동·계약 상태의 책임','공급 요청에서 반환 확인·수리 회수까지','개별 부품과 교환 관계를 보는 화면','미반환·검토 대기·재고 차이 운영','부품 사건 원장과 창고·지원 도구 연결','다른 번호 반환·일부 누락·소유 변경 처리','한 부품 종류의 첫 범위와 거점별 확장','이력 복원과 실물 대조의 비용·일정','호환·재사용 승인과 계약 조건 확인','교환·정정·재고 복구의 운영 인수']),
  faq:[
    {question:'일반 재고 수량 관리와 어떤 점이 다른가요?',answer:'같은 품번이라도 개별 식별자와 개정, 소유자 및 확인 상태가 다를 수 있습니다. 먼저 공급한 부품과 반환받을 부품의 관계, 수리 이력까지 확인해야 한다면 단순 수량 원장 이상의 구조가 필요합니다. 실제 관리 단위를 먼저 확인합니다.'},
    {question:'반환된 부품은 바로 사용 가능 재고가 되나요?',answer:'실물 도착과 식별 확인, 기술 검토 및 사용 가능 승인은 서로 다른 단계일 수 있습니다. 실제 품질 기준과 권한을 확인해 상태 전환을 정해야 합니다. 관리 프로그램이 도착만으로 재사용을 승인하도록 만들지 않습니다.'},
    {question:'대체품과 반환품의 번호가 달라도 연결되나요?',answer:'교환 사건에 제공한 대상과 기대 반환 대상, 실제 도착한 대상을 각각 연결할 수 있습니다. 서로 다른 개체를 하나의 번호로 덮어쓰지 않고 불일치가 있으면 담당자의 확인 근거를 남기는 방식으로 설계합니다.'},
    {question:'수리 후 번호가 바뀐 부품은 어떻게 처리하나요?',answer:'변경 근거와 수리 결과를 확인해 이전 대상과의 관계를 기록해야 합니다. 파일명이나 비슷한 표기만으로 같은 개체라고 단정하지 않습니다. 기술 검토와 재고 상태 변경의 책임자를 구분해 처리하도록 합니다.'},
    {question:'대여와 판매를 같은 출고로 관리할 수 있나요?',answer:'실제 이동은 비슷해도 소유 관계와 반환 조건이 다를 수 있습니다. 제공 유형과 계약상 상태를 구분해 필요한 후속 확인을 연결하는 편이 좋습니다. 비용 정산이 있다면 기존 회계 책임과 승인 기준을 별도로 확인합니다.'},
    {question:'개발 상담에는 어떤 예시가 필요한가요?',answer:'품번·개정·개별 식별자 구조와 실제 교환·수리 사건, 현재 재고 상태 및 고객 지원 요청의 연결 방식을 알려 주세요. 허용된 자료 예시로 먼저 범위를 정리할 수 있습니다. 기존 창고와 계약·지원 도구의 담당자도 함께 확인합니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/portal/반도체장비업체/',label:'고객 장비의 지원 요청 포털',reason:'고객 요청과 내부 부품 교환 사건의 연결 범위를 확인합니다.'},
    {href:'/solution/manufacturing/',label:'제조·장비 관리 시스템 범위',reason:'서비스 부품 원장과 기존 제조·창고 업무의 책임을 나눕니다.'},
    {href:'/development-agency/api-integration-development/',label:'창고와 지원 기록 연동',reason:'재고 이동의 원본과 중복 전송·정정 처리를 정합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'부품 승인과 자료 접근 검수',reason:'재고 입력과 기술 승인, 고객 자료 공개 권한을 확인합니다.'},
    {href:'/source-handover/',label:'부품 원장 운영 인수',reason:'미반환·식별 불일치·수리 회수·재고 대조를 준비합니다.'},
  ],
  ctaContext:'서비스 부품의 식별 방식과 교환·대여·수리 흐름, 현재 재고 상태 및 반환 조건을 알려 주세요. 실제 개체와 이동 사건을 보존하는 관리 프로그램 범위를 정리합니다.',
  evidenceSources:[
    {title:'Lam Research 서비스 부품 소개',url:'https://www.lamresearch.com/customer-support/spares/',use:'부품의 개정 관리와 일부 부품의 수리·재정비가 구분되는 공개 배경을 참고했습니다. 해당 제조사의 품질 기준이나 성능을 의뢰 업체에 그대로 적용하지 않으며 상세 원장 흐름은 별도 설계 제안입니다.'},
  ],
};
