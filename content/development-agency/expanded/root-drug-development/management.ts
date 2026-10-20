import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { drugDevelopmentManagementCore } from './management-core';
import { drugDevelopmentManagementOperations } from './management-operations';

export const drugDevelopmentManagementPage: AgencyPage = {
  slug:'management/의약품개발사',clusterIds:['ind-612-management'],
  primaryKeyword:'의약품개발사 관리 프로그램 개발',
  keywordVariants:['신약 개발 문서 준비 관리','의약품 제출 자료 일정 관리','개발 문서 변경 영향 관리 시스템'],
  searchIntent:'의약품 개발 제출 목적별 문서 준비와 버전·검토 의견·선행 작업을 연결하고 확정 자료 묶음과 실제 접수 결과를 구분해 관리하기',
  industry:'의약품개발사',serviceAxis:'관리 프로그램·ERP',
  title:'의약품개발사 관리 프로그램 | 문서 준비·검토·변경 영향 | 름랩',
  description:'제출 목적별 문서 버전과 선행 작업, 검토 의견 및 확정 자료 묶음을 관리합니다. 내부 준비 완료와 실제 제출·접수 결과를 구분하는 구축 범위를 확인하세요.',
  h1:'의약품개발사 관리 프로그램, 문서 준비와 검토의 근거 버전을 연결합니다',
  summary:'제출 준비 상태는 작업 완료율만으로 판단하기 어렵습니다. 문서의 대상 버전과 검토 의견, 선행 자료 및 인수 조건을 함께 확인하고 실제 제출·접수 결과를 따로 기록해야 합니다. 름랩은 제출 목적별 준비 항목과 책임자, 문서 변경 영향 및 확정 묶음의 이력을 연결하는 관리 프로그램을 설계합니다.',
  updatedAt:'2026-10-20',...drugDevelopmentManagementCore,...drugDevelopmentManagementOperations,
  sections:sections(['제출 준비를 조율하는 개발·문서 담당자','완료율만으로 알 수 없는 문서 준비 상태','작성·전문 검토·인수·접수 기록의 역할','문서 준비에서 확정 묶음과 접수 확인까지','미해결 조건과 선행 자료를 찾는 화면','책임자·상태 정의·인수 조건 관리','문서 버전과 검토 의견·변경 영향 구조','개정·일정 변경·접수 오류의 구분','대표 제출 목적의 첫 준비 관리 범위','문서 의존 관계와 연동의 비용·일정','실제 규제 업무와 시스템 책임의 확인','확정 버전·재검토·접수 기록 운영 인수']),
  faq:[
    {question:'문서 작업을 완료하면 제출 준비도 완료인가요?',answer:'작성 완료와 검토 완료, 제출 대상으로 인수된 상태는 구분해야 합니다. 대상 버전과 미해결 의견, 선행 자료 및 실제 인수 조건을 확인한 후 준비 상태를 표시하도록 설계할 수 있습니다.'},
    {question:'원본 문서를 새 시스템으로 전부 옮겨야 하나요?',answer:'기존 보관 시스템에서 문서와 버전을 안정적으로 참조할 수 있다면 준비 항목과 책임, 검토 이력을 연결하는 범위부터 시작할 수 있습니다. 원본 복제에 따른 정정과 접근 관리 책임도 함께 검토해야 합니다.'},
    {question:'검토 완료 후 문서가 개정되면 어떻게 처리하나요?',answer:'기존 검토는 당시 버전에 남기고 새 버전의 변경 영향을 담당자가 확인하도록 구성합니다. 공통 자료가 여러 준비 항목에 사용된다면 영향을 받는 작업을 찾아 재검토 여부와 이유를 기록합니다.'},
    {question:'이 프로그램에서 규제기관에 바로 제출할 수 있나요?',answer:'실제 전자 제출 형식 생성과 기술 검증, 전송은 별도 범위입니다. 준비 자료를 기존 제출 도구에 인수하는 기능과 실제 기관 접수 결과를 연결하는 기능의 책임을 각각 정해야 합니다.'},
    {question:'모든 국가의 제출 준비 목록을 공통으로 사용할 수 있나요?',answer:'제출 목적과 지역, 신청 유형에 따라 필요한 항목이 달라질 수 있습니다. 반복 목록은 출발점으로 사용할 수 있지만 적용 내용과 준비 완료 조건은 전문 담당자가 확인해야 합니다.'},
    {question:'보완 요청이 오면 기존 제출 기록을 수정하나요?',answer:'확정 당시의 자료 목록과 버전은 유지하고 요청 내용과 대응 문서, 새 검토 및 후속 제출을 별도로 연결하는 방식이 도움이 됩니다. 어떤 내용이 달라졌고 누가 확인했는지 추적할 수 있어야 합니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/portal/의약품개발사/',label:'협력 기관에 제공한 자료와 질문 관리',reason:'내부 제출 준비와 외부 협력 자료 제공의 다른 승인 범위를 확인합니다.'},
    {href:'/development-agency/management/바이오테크업체/',label:'연구 과제의 산출물·의사결정 관리',reason:'연구 과제 진행과 특정 제출 목적의 문서 준비가 구분되는 지점을 비교합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'개발 문서와 검토 기록의 접근 범위',reason:'역할별로 허용된 문서와 상태 변경만 처리하는지 검토합니다.'},
    {href:'/development-agency/cms-website-development/',label:'공개 개발 정보의 편집·승인 관리',reason:'내부 준비 문서와 외부에 공개할 정보의 운영 책임을 구분합니다.'},
    {href:'/source-handover/',label:'문서 준비 관리 시스템의 운영 인수',reason:'버전 변경과 재검토, 담당자 교체 및 접수 기록을 실제로 시험합니다.'},
  ],
  ctaContext:'대표 제출 목적의 문서 목록과 검토 단계, 선행 자료 및 준비 완료 조건을 알려 주세요. 문서 버전과 변경 영향을 확인할 수 있는 의약품개발사 관리 프로그램 범위를 정리합니다.',
  evidenceSources:[
    {title:'미국 FDA 전자 공통 기술 문서 안내',url:'https://www.fda.gov/drugs/electronic-regulatory-submission-and-review/electronic-common-technical-document-ectd',use:'기관 제출에는 별도의 형식과 기술 기준이 존재한다는 배경을 참고했습니다. 이 페이지의 업무 관리 설계를 eCTD 생성·전송 또는 규제 요구 충족으로 주장하지 않습니다.'},
  ],
};
