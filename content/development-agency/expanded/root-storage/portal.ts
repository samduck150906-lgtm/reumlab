import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { storagePortalCore } from './portal-core';
import { storagePortalOperations } from './portal-operations';

export const storagePortalPage: AgencyPage = {
  slug:'portal/에너지저장장치업체', clusterIds:['ind-607-portal'],
  primaryKeyword:'에너지저장장치업체 고객 포털 개발',
  keywordVariants:['ESS 고객 보고서 포털','에너지저장장치 운영 자료 포털','ESS 고객 문의 시스템'],
  searchIntent:'고객 사업장별 에너지저장장치의 승인된 기간 보고서와 정정본을 공개하고 원본 근거에 연결된 자료 문의를 처리하기',
  industry:'에너지저장장치업체', serviceAxis:'고객·파트너 포털',
  title:'에너지저장장치업체 고객 포털 개발 | 기간 보고서·정정·문의 | 름랩',
  description:'ESS 고객 포털의 사업장별 보고서 발행, 자료 누락 표시와 정정본, 항목별 문의를 설계합니다. 기간·단위 기준과 고객 권한, 계약 종료 및 보고 자료 인수 범위를 확인하세요.',
  h1:'에너지저장장치업체 고객 포털 개발, 보고서의 기준과 정정 이력을 함께 전달합니다',
  summary:'에너지저장장치 고객 포털은 고객에게 허용된 사업장의 기간 보고서와 서비스 자료를 제공하고 근거가 연결된 문의를 처리하는 업무 공간입니다. 발행본의 기간·단위·자료 확인 상태를 보존하고 정정이 생기면 이전 버전과의 관계를 설명해야 합니다. 름랩은 실제 보고서와 고객 권한, 검토·발행 절차를 확인해 포털 범위를 설계합니다.',
  updatedAt:'2026-10-20',
  ...storagePortalCore, ...storagePortalOperations,
  sections:sections(['기간 보고서와 운영 자료를 확인하는 고객','발행본과 내부 수정 자료가 달라지는 문제','작성·검토·발행·고객 문의 역할','원본 대조에서 고객 회신과 정정까지','기간·누락 상태·정정본을 보여 주는 화면','발행 대기와 고객별 자료 접근 관리','보고 항목과 원본 자료 연결','시간대·장치 교체·자료 누락·권한 종료 처리','한 고객의 보고 흐름과 사업장 확장','보고 기준과 자료 이전의 비용·일정','운영 자료 공개와 계약상 보고의 의미','정정·계정 종료·복구를 확인하는 인수']),
  faq:[
    {question:'실시간 운전 화면도 포털에 포함되나요?',answer:'기간 보고서 제공과 실시간 데이터 조회, 장치 제어는 각각 다른 범위입니다. 사용할 원본과 갱신 조건, 권한 및 운영 책임을 확인해야 합니다. 고객 보고서 포털을 만들었다는 이유만으로 실시간 제어나 긴급 대응 기능이 포함되지는 않습니다.'},
    {question:'자료가 빠진 기간은 영으로 표시하면 되나요?',answer:'자료가 수집되지 않은 상태와 실제 값이 없는 상태는 구분해야 합니다. 원본의 의미와 누락 처리 기준을 확인하고 고객이 자료 확인 상태를 알 수 있도록 표시합니다. 임의의 값으로 채워 정상 운영 결과처럼 표현하지 않습니다.'},
    {question:'이미 보낸 보고서를 수정할 수 있나요?',answer:'발행 당시 버전을 보존하고 정정본과 변경 이유를 연결하는 방식을 검토합니다. 어떤 항목이 달라졌는지 고객에게 안내하고 문의가 참조한 원래 버전도 확인할 수 있어야 합니다. 파일만 교체하면 과거 전달 결과를 설명하기 어려울 수 있습니다.'},
    {question:'여러 사업장의 수치를 한 번에 합쳐 보여 줄 수 있나요?',answer:'같은 기간과 단위, 집계 기준으로 비교·합산할 수 있는지 먼저 확인해야 합니다. 포함하지 못한 자료와 누락 상태를 설명하고 고객에게 허용된 사업장만 표시합니다. 기준이 다른 결과를 단순 합계로 보여 주지 않도록 검수합니다.'},
    {question:'장치 이상도 이 문의 화면으로 신고하면 되나요?',answer:'일반 보고서 문의와 긴급 대응은 실제 운영 체계에 맞춰 구분해야 합니다. 긴급 상황에 사용할 연락 경로와 안내를 책임자가 정하고 화면에 반영합니다. 일반 문의 접수만으로 현장 대응이 자동 수행된다고 표시하지 않습니다.'},
    {question:'상담 전에 어떤 자료를 준비하면 되나요?',answer:'현재 제공하는 보고서의 항목과 기간, 원본 자료 대조 방식 및 고객별 공개 범위를 알려 주세요. 비공개 운영 데이터 전체를 처음부터 보낼 필요는 없습니다. 사용 가능한 예시로 발행·문의·정정의 첫 범위를 정리할 수 있습니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/api-integration-development/',label:'운영 자료 수신과 대조',reason:'기간·단위·원본 식별자와 누락 상태를 연결합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'고객 사업장별 자료 접근',reason:'조회·다운로드·계약 종료 조건을 검수합니다.'},
    {href:'/erp/',label:'서비스 이력과 내부 업무',reason:'고객 문의와 내부 담당자·승인 상태의 연결을 검토합니다.'},
    {href:'/solution/manufacturing/',label:'장치와 보고 대상의 기준 정보',reason:'장치 교체와 과거 보고서의 식별 관계를 정합니다.'},
    {href:'/source-handover/',label:'보고서 포털 운영 인수',reason:'발행·정정·복구와 계정 변경 절차를 준비합니다.'},
  ],
  ctaContext:'고객에게 보내는 보고서의 기준과 정정 방식, 사업장별 공개 범위 및 문의 처리 흐름을 알려 주세요. 발행한 자료와 원본 근거를 추적할 수 있는 고객 포털 범위를 정리합니다.',
  evidenceSources:[
    {title:'Sandia 에너지저장장치 실증과 검증 안내',url:'https://energy.sandia.gov/programs/energy-storage/demonstrations-and-validation/',use:'실제 운영 자료를 확인해 결과를 검토한다는 배경을 참고합니다. 특정 장치의 성능 평가나 국내 계약 기준을 대신하지 않습니다.'},
    {title:'OWASP 애플리케이션 보안 검증 표준',url:'https://owasp.org/www-project-application-security-verification-standard/',use:'고객별 자료 접근과 발행 권한, 다운로드 검수 항목을 정할 때 참고합니다.'},
  ],
};
