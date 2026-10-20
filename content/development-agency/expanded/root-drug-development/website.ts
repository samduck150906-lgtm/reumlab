import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { drugDevelopmentWebsiteCore } from './website-core';
import { drugDevelopmentWebsiteOperations } from './website-operations';

export const drugDevelopmentWebsitePage: AgencyPage = {
  slug:'website/의약품개발사',clusterIds:['ind-612-website'],
  primaryKeyword:'의약품개발사 홈페이지 제작',
  keywordVariants:['신약 개발 파이프라인 홈페이지','의약품 개발 프로그램 소개 사이트','신약 개발 협력 문의 홈페이지'],
  searchIntent:'후보와 연구 목적별 개발 프로그램의 공개 상태·근거·공식 정보 연결을 구분하고 사업 협력 문의를 전달하기',
  industry:'의약품개발사',serviceAxis:'홈페이지·웹사이트',
  title:'의약품개발사 홈페이지 제작 | 후보·프로그램별 공개 정보 | 름랩',
  description:'후보별 개발 프로그램과 공개 상태, 확인일 및 근거 자료를 연결합니다. 연구 단계·모집·승인 정보의 구분과 협력 문의 운영 범위를 확인하세요.',
  h1:'의약품개발사 홈페이지, 후보별 프로그램과 공개 근거를 정확히 연결합니다',
  summary:'의약품개발사의 공개 홈페이지는 후보와 연구 목적별 프로그램, 개발 상태와 모집·결과·승인 정보를 구분해야 합니다. 한 연구의 진행 상황을 후보 전체의 성과로 확대하지 않고 확인 시점과 공식 자료를 연결하는 것이 중요합니다. 름랩은 승인된 공개 자료와 담당자의 검토 절차를 바탕으로 프로그램 안내와 사업 협력 문의가 이어지는 홈페이지를 설계합니다.',
  updatedAt:'2026-10-20',...drugDevelopmentWebsiteCore,...drugDevelopmentWebsiteOperations,
  sections:sections(['개발 현황과 협력 가능성을 확인하는 방문자','후보·연구 목적·공개 상태가 섞이는 문제','프로그램 검토와 공개 승인·문의 담당자','프로그램 탐색에서 공식 정보·협력 문의까지','개발 목록과 근거 자료를 읽는 화면','공개 상태·확인일·다국어 갱신 관리','후보·프로그램·발표 자료의 연결 구조','연구별 상태 차이와 코드·명칭 변경','대표 프로그램 중심의 첫 구축 범위','공개 검토와 정보 연결의 비용·일정','개발·등록·승인 표현의 책임 확인','프로그램 변경과 자료 정정의 운영 인수']),
  faq:[
    {question:'후보마다 개발 단계를 하나만 표시해도 되나요?',answer:'같은 후보라도 연구 목적이나 프로그램에 따라 공개 상태가 다를 수 있습니다. 방문자가 어느 프로그램의 정보인지 확인할 수 있게 하고, 가장 앞선 단계 하나를 모든 연구에 적용하는 표현은 피해야 합니다.'},
    {question:'연구 등록 사이트 링크가 있으면 승인된 연구로 표시할 수 있나요?',answer:'등록 정보의 존재와 정부의 안전성·과학적 타당성 검토나 제품 승인은 같은 의미가 아닙니다. 링크 대상과 설명의 범위를 담당자가 확인하고 공식 정보로 이동하는 경로로 표시해야 합니다.'},
    {question:'모집 상태와 개발 단계는 같은 항목인가요?',answer:'서로 다른 정보이므로 구분해 관리하는 것이 좋습니다. 프로그램의 개발 상태, 특정 연구의 모집 상태, 결과 발표 및 제품 승인 여부를 한 상태값에 합치면 방문자가 의미를 잘못 이해할 수 있습니다.'},
    {question:'사업 협력 문의에서 개발 자료를 바로 받아도 되나요?',answer:'초기 문의에는 공개 가능한 제안 요약과 목적, 연락 경로를 받는 방식부터 검토할 수 있습니다. 비공개 자료 교환은 실제 협력 절차와 비밀 유지·접근 권한을 확인한 뒤 별도 단계로 연결합니다.'},
    {question:'외부 등록 정보가 바뀌면 홈페이지도 자동 변경하나요?',answer:'변경을 감지해 검토할 담당자에게 알릴 수 있지만 자동 게시 여부는 별도 결정이 필요합니다. 회사가 공개할 범위와 정보의 시점, 프로그램의 연결 관계를 확인한 후 승인된 내용을 반영하도록 구성할 수 있습니다.'},
    {question:'종료된 프로그램과 이전 발표는 어떻게 정리하나요?',answer:'실제 공개 정책에 따라 현재 상태와 당시의 발표를 구분해 유지할 수 있습니다. 후보 이름과 프로그램 코드가 바뀌어도 관련 자료의 연결을 점검하고 다른 연구의 자료로 잘못 이동하지 않도록 검수합니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/website/바이오테크업체/',label:'기술 플랫폼과 연구 과제 소개',reason:'기술의 공통 기반과 개별 개발 프로그램의 공개 설명 차이를 비교합니다.'},
    {href:'/development-agency/cms-website-development/',label:'개발 현황의 승인·갱신 관리',reason:'상태의 기준 시점과 발표 자료, 공개 승인 이력을 관리하는 범위를 정합니다.'},
    {href:'/development-agency/multilingual-website-development/',label:'다국어 개발 정보의 의미 확인',reason:'프로그램과 연구 단계, 모집·승인 상태가 언어별로 일치하는지 검토합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'협력 문의와 자료 접근 검토',reason:'초기 공개 문의와 후속 비공개 자료 교환의 접근 범위를 구분합니다.'},
    {href:'/source-handover/',label:'개발 프로그램 홈페이지 인수',reason:'프로그램 변경과 자료 정정, 담당자 이관을 실제 운영자가 수행하도록 준비합니다.'},
  ],
  ctaContext:'공개할 후보와 프로그램 목록, 상태를 확인할 자료 및 협력 문의 유형을 알려 주세요. 프로그램별 근거와 갱신 책임을 연결하는 의약품개발사 홈페이지 범위를 정리합니다.',
  evidenceSources:[
    {title:'미국 FDA 의약품 개발 과정 안내',url:'https://www.fda.gov/patients/learn-about-drug-and-device-approvals/drug-development-process',use:'연구·개발·검토·승인 과정이 구분된다는 배경을 참고했습니다. 특정 국가의 절차를 모든 사업에 동일하게 적용하거나 허가 결과를 보장하지 않습니다.'},
    {title:'ClinicalTrials.gov 공개 정보의 책임과 한계',url:'https://clinicaltrials.gov/about-site/disclaimer',use:'연구의 등록과 정부의 안전성·과학적 타당성 승인 여부가 다르며 정보 제공자의 책임이 있다는 안내를 참고했습니다. 등록 링크를 제품 승인 표시로 사용하지 않습니다.'},
  ],
};
