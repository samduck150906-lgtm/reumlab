import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { storageManagementCore } from './management-core';
import { storageManagementOperations } from './management-operations';

export const storageManagementPage: AgencyPage = {
  slug:'management/에너지저장장치업체', clusterIds:['ind-607-management'],
  primaryKeyword:'에너지저장장치업체 관리 프로그램',
  keywordVariants:['ESS 장치 서비스 관리','에너지저장장치 교체 이력 원장','ESS 계약 보증 관리 시스템'],
  searchIntent:'설치된 에너지저장장치의 구성·계약을 기준으로 서비스 사건과 부품 교체·보증 회신·반품 등 후속 업무를 추적하기',
  industry:'에너지저장장치업체', serviceAxis:'관리 프로그램·ERP',
  title:'에너지저장장치업체 관리 프로그램 | 구성 이력·서비스·보증 확인 | 름랩',
  description:'ESS 관리 프로그램의 장치 구성과 계약, 서비스 접수·교체 이력·보증 회신을 설계합니다. 현재 설치 상태와 반품·정산의 구분, 자료 이전 및 운영 인수 범위를 확인하세요.',
  h1:'에너지저장장치업체 관리 프로그램, 현재 구성과 서비스 사건의 근거를 이어 줍니다',
  summary:'에너지저장장치 관리 프로그램은 설치된 장치의 구성과 계약을 확인하고 서비스 접수부터 부품 변경, 고객 회신과 남은 행정 업무를 연결하는 원장입니다. 현재 구성과 과거 이력을 보존하고 보증 확인·반품·정산 상태를 구분해야 합니다. 름랩은 실제 설치 자료와 서비스 사례를 바탕으로 관리 범위를 설계합니다.',
  updatedAt:'2026-10-20',
  ...storageManagementCore, ...storageManagementOperations,
  sections:sections(['설치 장치와 서비스 사건을 이어 관리하는 조직','현재 구성과 남은 후속 절차가 안 보이는 문제','기준 정보·접수·기술 검토·공급사·마감 역할','계약 확인에서 교체와 사건 마감까지','구성 적용 이력과 서비스 처리 화면','보증 회신·반품·정산 대기 관리','장치·계약·구성 관계와 기존 도구 연결','번호 변경·교체 취소·과거 자료 정정 처리','대표 고객 서비스의 첫 범위와 확장','식별 자료와 계약 규칙의 비용·일정','전문 변경 기준과 보증 판단 책임','구성 대조와 미마감 업무를 인계하는 운영']),
  faq:[
    {question:'납품 날짜만으로 보증 적용 여부를 판단할 수 있나요?',answer:'판매·유지관리 계약과 제조사 보증 조건이 다를 수 있어 실제 조건과 근거를 확인해야 합니다. 프로그램에서는 필요한 문서와 적용 기간, 담당자 판단을 연결할 수 있습니다. 자료가 불명확한 사건을 자동으로 가능 또는 불가로 확정하지 않습니다.'},
    {question:'교체한 부품은 기존 구성품을 수정하면 되나요?',answer:'제거한 구성품과 새 구성품, 실제 적용 기간 및 교체 근거를 구분하는 방식을 검토합니다. 기존 번호만 바꾸면 과거 서비스 사건의 대상이 달라질 수 있습니다. 현재 설치 상태와 반품·보관 상태도 별도로 기록해야 합니다.'},
    {question:'고객 회신이 끝나면 서비스 사건을 마감하나요?',answer:'보증 확인이나 공급사 회신, 부품 반품과 정산이 남아 있는지 확인해야 합니다. 고객 대응과 내부 후속 절차의 상태를 구분하고 합의한 조건으로 마감합니다. 한 단계의 완료가 전체 업무 완료로 표시되지 않도록 설계합니다.'},
    {question:'장치 소프트웨어 버전도 관리할 수 있나요?',answer:'필요한 버전 항목과 확인 근거, 적용 시점 및 현재 구성과의 관계를 정해 기록할 수 있습니다. 보고된 값과 실제 확인한 값은 구분하는 편이 좋습니다. 버전을 기록하는 기능과 장치에 업데이트를 실행하는 기능은 별도 범위입니다.'},
    {question:'과거 설치 자료가 불완전하면 시작할 수 없나요?',answer:'자료의 누락과 식별 상태를 확인하고 검증할 수 있는 대상부터 범위를 정할 수 있습니다. 모르는 구성을 추정해 채우기보다 확인 필요 상태와 대조 목록을 남깁니다. 진행 중인 서비스 사건이 이전 후에도 이어지는지 함께 검수해야 합니다.'},
    {question:'상담 전에 어떤 사례를 준비하면 되나요?',answer:'대표 장치의 설치·구성 자료와 계약의 구조, 실제 서비스 접수와 부품 교체의 처리 흐름을 알려 주세요. 고객 비공개 자료 전체를 처음부터 전달할 필요는 없습니다. 사용 가능한 예시로 식별 관계와 마감 기준을 정리할 수 있습니다.'},
  ],
  relatedRoutes:[
    {href:'/erp/',label:'서비스 사건과 계약 원장',reason:'부서별 상태와 마감 이후 정정 범위를 정합니다.'},
    {href:'/solution/manufacturing/',label:'장치와 구성품의 기준 정보',reason:'현재 구성과 과거 변경 이력의 관계를 확인합니다.'},
    {href:'/development-agency/api-integration-development/',label:'고객·구매·회계 도구 연결',reason:'원본 식별자와 재전송 중복 방지 기준을 검토합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'고객·공급사 자료 접근',reason:'협력사 권한과 보고서 내보내기 범위를 확인합니다.'},
    {href:'/source-handover/',label:'관리 원장과 미처리 업무 인수',reason:'기준 자료와 사건 이력, 복구·재처리 절차를 준비합니다.'},
  ],
  ctaContext:'설치 장치의 구성과 계약을 확인하는 방식, 서비스·교체 이후 남는 보증·반품 업무를 알려 주세요. 현재 상태와 처리 근거를 추적할 수 있는 관리 프로그램 범위를 정리합니다.',
  evidenceSources:[
    {title:'Sandia 에너지저장장치 실증과 운영 단계 안내',url:'https://energy.sandia.gov/programs/energy-storage/demonstrations-and-validation/',use:'인수 이후 운영과 유지관리 단계가 이어진다는 배경을 확인합니다. 개별 계약의 보증 조건이나 기술 판단은 실제 담당자가 별도 확인해야 합니다.'},
    {title:'OWASP 애플리케이션 보안 검증 표준',url:'https://owasp.org/www-project-application-security-verification-standard/',use:'자료 변경과 확정 권한, 외부 자료 접근의 검수 항목을 정할 때 참고합니다.'},
  ],
};
