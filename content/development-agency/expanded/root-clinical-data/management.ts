import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { clinicalDataManagementCore } from './management-core';
import { clinicalDataManagementOperations } from './management-operations';

export const clinicalDataManagementPage: AgencyPage = {
  slug:'management/임상데이터업체',clusterIds:['ind-613-management'],
  primaryKeyword:'임상데이터업체 관리 프로그램',
  keywordVariants:['임상 데이터 질의 검토 관리','연구 데이터 규칙 버전 관리','임상 데이터 전달본 변경 추적 시스템'],
  searchIntent:'연구별 입력 자료·검토 규칙·검사 실행과 질의 답변·원본 반영·종료 판단을 연결하고 확정 전달본의 변경을 추적하기',
  industry:'임상데이터업체',serviceAxis:'관리 프로그램·ERP',
  title:'임상데이터업체 관리 프로그램 | 규칙·질의·전달본 추적 | 름랩',
  description:'입력 자료와 검사 규칙 버전, 질의 답변 및 원본 반영 확인을 연결합니다. 확정 전달본과 이후 정정, 담당자별 검토 책임을 관리하는 구축 범위를 확인하세요.',
  h1:'임상데이터업체 관리 프로그램, 검사 기준부터 질의 종료와 전달본까지 연결합니다',
  summary:'질의 처리 건수만으로 데이터 검토가 끝났는지 판단하기 어렵습니다. 어떤 자료와 규칙으로 발견한 항목인지, 답변과 원본 수정이 반영됐는지, 누가 종료를 확인했는지를 연결해야 합니다. 름랩은 실제 데이터 관리 절차와 원본 시스템의 책임을 바탕으로 검사·질의·재확인 및 확정 전달본의 이력을 관리하는 프로그램을 설계합니다.',
  updatedAt:'2026-10-20',...clinicalDataManagementCore,...clinicalDataManagementOperations,
  sections:sections(['데이터 검토와 질의 처리를 맡는 담당자','질의 건수만으로 알 수 없는 처리 근거','규칙 검토·원본 수정·종료 판단의 역할','자료 검사에서 답변·재확인·전달본까지','검사 기준과 남은 책임을 찾는 화면','규칙 버전·예외·담당자 운영','입력·검사·질의·확정본의 연결 구조','중복 발견·원본 미반영·확정 후 정정','대표 연구의 첫 검토 상태 관리 범위','원본 연동과 변경 추적의 비용·일정','연구 기록과 전문 판단의 책임 확인','재검사·집계 대조·전달본 변경 인수']),
  faq:[
    {question:'질의 답변을 받으면 자동 종료할 수 있나요?',answer:'답변 도착과 문제 해결, 실제 원본 반영은 다른 상태일 수 있습니다. 담당자가 대상 버전과 필요한 변경을 확인하고 종료 여부를 판단하도록 연결하는 것이 좋습니다.'},
    {question:'규칙을 바꾸면 이전 검사 결과도 새로 계산하나요?',answer:'이전 실행에 사용한 자료와 규칙 버전은 유지해야 합니다. 새 검사와 이전 결과의 관계를 확인하고 어떤 항목을 재검토할지 담당자가 결정하도록 구성할 수 있습니다.'},
    {question:'이미 쓰는 수집 시스템과 질의 도구를 바꿔야 하나요?',answer:'기존 도구가 충분히 처리하는 기능은 유지할 수 있습니다. 새 프로그램이 연결할 자료 버전과 상태, 책임을 먼저 정하고 원본 수정과 질의 종료의 기준 시스템을 분명히 해야 합니다.'},
    {question:'미해결 질의가 없으면 데이터가 확정되나요?',answer:'건수 외에도 필요한 검사와 인수 조건, 승인된 예외 및 자료 기준 시점을 확인해야 합니다. 실제 승인자가 확정할 범위를 검토하고 시스템은 그 근거와 구성을 기록하도록 설계합니다.'},
    {question:'전달본을 확정한 뒤 정정이 필요하면 어떻게 하나요?',answer:'과거 전달본의 구성과 확인 기록은 유지하고 변경 요청과 영향을 받는 후속 작업을 연결합니다. 새 전달본의 차이와 승인 책임을 남겨 어느 자료가 사용됐는지 추적할 수 있어야 합니다.'},
    {question:'규제 업무에도 바로 사용할 수 있나요?',answer:'사용 목적과 적용 요구에 따라 전자 기록·서명과 시스템 검증, 운영 절차의 확인이 필요할 수 있습니다. 일반 관리 기능의 구축이 규제 적합성이나 전문 판단의 완료를 자동 보장하지는 않습니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/portal/임상데이터업체/',label:'고객 자료 전달과 결과물 인수',reason:'외부 전달 상태와 내부 검사·질의 처리의 책임을 연결합니다.'},
    {href:'/development-agency/management/의약품개발사/',label:'제출 문서 준비와 검토 의견',reason:'문서 준비 관리와 데이터 규칙·질의 원장의 다른 대상을 비교합니다.'},
    {href:'/development-agency/ai/의약품개발사/',label:'문서 표현의 원문 대조 보조',reason:'문서의 차이 후보를 찾는 AI와 실제 데이터 질의 종료 판단을 구분합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'연구 자료와 상태 변경 권한',reason:'원본 수정·검토·조회·내보내기 권한의 실제 경계를 확인합니다.'},
    {href:'/source-handover/',label:'데이터 검토 관리 시스템 인수',reason:'규칙 변경과 반복 검사, 확정본 정정 및 상태 집계를 대조합니다.'},
  ],
  ctaContext:'현재 데이터 관리 절차와 입력 자료·규칙 버전, 질의 상태 및 전달본 확정 조건을 알려 주세요. 원본 책임을 유지하면서 검토 근거와 변경을 추적하는 관리 프로그램 범위를 정리합니다.',
  evidenceSources:[
    {title:'미국 FDA 임상시험 전자 시스템·기록·서명 안내',url:'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/electronic-systems-electronic-records-and-electronic-signatures-clinical-investigations-questions',use:'임상 연구의 전자 시스템과 기록에는 사용 목적에 따른 신뢰성과 관리 요구의 검토가 필요하다는 배경을 참고했습니다. 특정 국가의 지침을 모든 프로젝트에 동일 적용하거나 규제 적합성을 보장하지 않습니다.'},
  ],
};
