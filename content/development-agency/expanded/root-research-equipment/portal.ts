import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { researchEquipmentPortalCore } from './portal-core';
import { researchEquipmentPortalOperations } from './portal-operations';

export const researchEquipmentPortalPage: AgencyPage = {
  slug:'portal/연구장비업체',clusterIds:['ind-614-portal'],
  primaryKeyword:'연구장비업체 고객 포털 개발',
  keywordVariants:['연구 장비 고객 지원 포털','보유 분석 장비 매뉴얼 포털','장비 자산별 서비스 요청 시스템'],
  searchIntent:'고객 기관의 실제 보유 장비와 설치 구성에 맞는 문서·지원 요청을 연결하고 기관별 접근·담당자 변경·자료 개정을 관리하기',
  industry:'연구장비업체',serviceAxis:'고객·파트너 포털',
  title:'연구장비업체 고객 포털 | 장비별 문서·지원 요청·인계 | 름랩',
  description:'기관·부서·보유 장비와 실제 설치 구성을 연결합니다. 적용 문서의 개정과 지원 요청, 고객 담당자 변경 및 기관 간 접근 차단의 구축 범위를 확인하세요.',
  h1:'연구장비업체 고객 포털, 보유 장비의 구성에 맞는 자료와 지원을 연결합니다',
  summary:'고객이 가진 장비의 모델 이름만으로 매뉴얼과 지원 범위를 확정하기는 어렵습니다. 실제 자산과 설치 구성, 기관 내 담당 및 문서 적용 조건을 함께 확인해야 합니다. 름랩은 장비별 문서함과 지원 진행, 담당자 인계를 고객의 접근 범위 안에서 관리하는 포털을 설계합니다.',
  updatedAt:'2026-10-21',...researchEquipmentPortalCore,...researchEquipmentPortalOperations,
  sections:sections(['보유 장비의 자료와 지원을 찾는 고객','모델별 자료와 실제 설치 구성의 차이','기관·장비·문서 공개·서비스의 역할','장비 확인에서 지원 결과와 담당자 인계까지','적용 자료와 진행 상태를 읽는 고객 화면','자산 확인과 문서 공개·미결 요청 운영','소속·자산·구성·자료 버전의 연결','공동 사용·장비 이전·문서 적용 오류','대표 고객의 첫 문서함과 지원 접수','자산 정비와 외부 연동의 비용·일정','고객 자료와 매뉴얼 배포 범위 확인','권한 종료와 자산·문서 정정의 인수']),
  faq:[
    {question:'모델이 같으면 같은 문서를 보여 주면 되나요?',answer:'설치 옵션과 소프트웨어 등 실제 구성에 따라 적용 여부를 확인해야 합니다. 모델 공통 자료와 특정 구성에 적용되는 자료를 구분하고 확인되지 않은 경우 담당자의 검토로 연결하도록 설계할 수 있습니다.'},
    {question:'제조번호를 입력하면 장비 자료를 바로 볼 수 있나요?',answer:'제조번호만으로 고객의 소유와 접근 권한을 확정하지 않는 것이 좋습니다. 기관 소속과 실제 자산 관계를 확인한 후 허용된 문서를 제공하고 잘못된 번호로 다른 고객 자료가 열리지 않도록 검수해야 합니다.'},
    {question:'기관 안에서 여러 연구실이 장비를 같이 사용하면 어떻게 하나요?',answer:'공동 사용 장비의 대표 담당과 사용자별 자료 접근을 정할 수 있습니다. 공통 매뉴얼을 보는 권한과 계약·서비스 내역을 확인하는 권한은 실제 역할에 맞춰 구분하는 것이 좋습니다.'},
    {question:'지원 결과 파일을 내려받으면 요청이 자동 종료되나요?',answer:'다운로드와 결과 확인, 계약상 인수는 서로 다른 의미일 수 있습니다. 확인할 자료 버전과 상태의 의미를 명확히 하고 고객이 후속 질문을 남기거나 담당자가 종료 조건을 검토할 수 있도록 구성합니다.'},
    {question:'기존 서비스 관리 프로그램과 함께 쓸 수 있나요?',answer:'고객 기관과 자산, 설치 구성 및 요청 식별자를 안정적으로 연결할 수 있는지 확인한 뒤 연동 범위를 정할 수 있습니다. 내부 작업 기록 중 고객에게 공개할 상태와 자료를 따로 검토해야 합니다.'},
    {question:'고객의 담당자가 바뀌면 과거 자료도 새로 등록해야 하나요?',answer:'자산과 요청의 이력을 유지하면서 새 담당자의 소속과 접근을 확인해 인계할 수 있습니다. 이전 담당자의 접근 종료와 진행 중 업무의 책임 변경을 함께 처리하고 다운로드된 자료의 사용 조건도 따로 확인합니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/website/연구장비업체/',label:'장비 선택과 공개 기술 자료 안내',reason:'구매 전 제품 탐색과 공급 후 고객 자산의 지원 공간을 연결합니다.'},
    {href:'/development-agency/portal/임상데이터업체/',label:'자료 전달과 결과 확인의 상태 구분',reason:'파일 도착과 전문 검토·고객 확인을 서로 다른 상태로 관리하는 범위를 비교합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'기관과 장비별 자료 접근 검수',reason:'주소 직접 접근과 사용자 해제, 외부 담당자의 제한된 자료 열람을 확인합니다.'},
    {href:'/development-agency/existing-codebase-audit/',label:'기존 자산·지원 환경의 연동 검토',reason:'원본 식별자와 고객 공개 상태를 기존 시스템에서 구분할 수 있는지 점검합니다.'},
    {href:'/source-handover/',label:'장비 고객 포털 운영 인수',reason:'자산 정정과 문서 개정, 기관 담당자 교체 및 미결 요청 인계를 직접 검수합니다.'},
  ],
  ctaContext:'고객 기관의 보유 장비 목록과 설치 구성, 제공할 문서와 실제 지원 절차를 알려 주세요. 적용 자료와 요청 진행, 담당자 인계를 연결하는 고객 포털 범위를 정리합니다.',
  evidenceSources:[
    {title:'Agilent 장비 설치 서비스의 구성 확인 안내',url:'https://www.agilent.com/en/s/installation-relocation-services/instrument-installation',use:'공급된 장비 구성과 설치·확인·교육의 업무 범위를 구분하는 배경을 참고했습니다. 포털의 문서 적용과 고객 접근은 실제 자산·계약 자료로 별도 확인해야 합니다.'},
  ],
};
