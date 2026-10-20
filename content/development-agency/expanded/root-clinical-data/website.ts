import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { clinicalDataWebsiteCore } from './website-core';
import { clinicalDataWebsiteOperations } from './website-operations';

export const clinicalDataWebsitePage: AgencyPage = {
  slug:'website/임상데이터업체',clusterIds:['ind-613-website'],
  primaryKeyword:'임상데이터업체 홈페이지 제작',
  keywordVariants:['임상 데이터 관리 서비스 홈페이지','임상 데이터 표준화 업체 웹사이트','연구 데이터 서비스 문의 홈페이지'],
  searchIntent:'임상 데이터 수집·관리·표준 구조 변환의 실제 서비스 범위와 필요한 입력·산출물을 설명하고 민감 원본 없이 초기 상담을 연결하기',
  industry:'임상데이터업체',serviceAxis:'홈페이지·웹사이트',
  title:'임상데이터업체 홈페이지 제작 | 서비스 단계·입력·산출물 | 름랩',
  description:'데이터 수집 도구와 관리 업무, 표준 구조 변환 및 분석 지원을 구분합니다. 실제 제공 범위와 지원 조건, 공개 근거 및 상담 이관의 구축 범위를 확인하세요.',
  h1:'임상데이터업체 홈페이지, 맡길 업무와 준비 자료·산출물을 분명히 설명합니다',
  summary:'임상 데이터 서비스 소개에서는 도구의 기능과 업체가 맡는 업무, 필요한 입력 자료 및 전달 결과를 구분해야 합니다. 표준과 인증의 이름만으로 지원 범위를 확대하거나 민감한 연구 원본을 초기 문의에서 요구하지 않는 것이 중요합니다. 름랩은 실제 제공 서비스와 확인 가능한 근거를 바탕으로 업무 단계별 안내와 상담이 연결되는 홈페이지를 설계합니다.',
  updatedAt:'2026-10-20',...clinicalDataWebsiteCore,...clinicalDataWebsiteOperations,
  sections:sections(['데이터 업무를 맡길 범위를 찾는 의뢰기관','도구·수행 업무·지원 표준이 섞이는 문제','서비스 검토·공개 승인·상담 이관 역할','업무 단계 탐색에서 자료 검토 상담까지','입력 자료와 산출물을 비교하는 화면','지원 조건·기술 자료·문의 담당자 운영','서비스·표준·공개 근거의 연결 구조','지원 범위 차이와 민감 자료 오접수','핵심 서비스의 첫 공개 홈페이지 구성','전문 콘텐츠와 문의 연동의 비용·일정','연구 자료·사례·표준 표현의 확인','서비스 변경과 기술 자료 갱신 인수']),
  faq:[
    {question:'데이터 수집 도구와 데이터 관리 서비스는 같은가요?',answer:'도구를 제공하는 범위와 실제 데이터 검토·질의 처리 등 업무를 수행하는 범위는 다를 수 있습니다. 홈페이지에서는 업체가 맡는 일과 고객이 준비할 자료, 전달 결과를 구분해 설명하는 것이 좋습니다.'},
    {question:'CDASH나 SDTM을 표시하면 모든 연구를 지원한다는 뜻인가요?',answer:'각 표준을 어떤 업무와 범위에서 사용하는지 확인해야 합니다. 표준 이름만으로 모든 입력 자료를 자동 변환하거나 모든 기관의 제출 요구를 충족한다고 표현하지 않고 적용 조건을 안내합니다.'},
    {question:'상담 전에 실제 참여자 데이터를 보내야 하나요?',answer:'초기에는 연구 유형과 요청 업무, 현재 도구와 자료 준비 상태 등 공개 가능한 정보로 범위를 확인할 수 있습니다. 민감한 원본이 필요한 다음 단계는 전달 목적과 권한, 계약 조건을 확인한 별도 경로로 진행하는 것이 좋습니다.'},
    {question:'데이터 예시 화면은 어떻게 준비하나요?',answer:'실제 고객 자료의 공개 권한을 확인하거나 설명 목적의 합성 자료를 사용할 수 있습니다. 합성 자료를 실제 프로젝트 결과처럼 제시하지 않고 예시의 목적과 적용 범위를 명확히 해야 합니다.'},
    {question:'기존 고객 플랫폼 로그인도 홈페이지에 넣을 수 있나요?',answer:'로그인 경로를 안내할 수 있지만 공개 사이트와 연구 데이터 공간의 권한은 구분해야 합니다. 소개 내용을 편집할 수 있는 사람이 실제 연구 자료까지 자동으로 접근하지 않도록 범위를 정합니다.'},
    {question:'제작을 위해 가장 먼저 정리할 내용은 무엇인가요?',answer:'실제 제공할 서비스 단계와 입력 자료, 수행 업무 및 전달 산출물부터 정리하는 것이 도움이 됩니다. 표준·도구 지원 범위와 공개 가능한 근거, 전문 상담 담당자를 확인하면 콘텐츠와 기능의 경계가 명확해집니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/website/의약품개발사/',label:'개발 프로그램의 공개 상태 안내',reason:'개발사의 연구 현황과 데이터를 맡아 처리하는 서비스 업체의 안내 목적을 비교합니다.'},
    {href:'/development-agency/website/바이오테크업체/',label:'연구 기술과 실제 제공 서비스 구분',reason:'기술 소개가 실제 수행 가능한 서비스 범위로 이어지는 정보를 검토합니다.'},
    {href:'/development-agency/cms-website-development/',label:'지원 조건과 기술 자료의 갱신',reason:'서비스와 표준 설명, 공개 근거 및 검토 시점을 함께 관리합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'공개 문의와 연구 자료 전달 범위',reason:'초기 상담에서 수집할 정보와 별도의 민감 자료 교환 경로를 정리합니다.'},
    {href:'/source-handover/',label:'데이터 서비스 홈페이지 운영 인수',reason:'담당자 변경과 사례 공개 범위, 기술 자료 정정을 직접 수행하도록 검수합니다.'},
  ],
  ctaContext:'실제로 제공하는 데이터 업무와 필요한 입력·전달 산출물, 지원 표준 및 공개 가능한 근거를 알려 주세요. 서비스 범위와 목적별 상담이 연결되는 임상데이터업체 홈페이지를 정리합니다.',
  evidenceSources:[
    {title:'CDISC CDASH 데이터 수집 표준 안내',url:'https://www.cdisc.org/standards/foundational/cdash',use:'일관된 데이터 수집과 후속 자료의 추적 관계를 설명하는 배경을 참고했습니다. 특정 업체의 표준 지원이나 적합성을 인증하는 근거로 사용하지 않습니다.'},
    {title:'CDISC SDTM 데이터 구조 표준 안내',url:'https://www.cdisc.org/standards/foundational/sdtm',use:'수집과 이후 데이터 구성의 목적을 구분하는 참고 자료입니다. 실제 적용 버전과 기관별 요구 충족 여부는 개별 프로젝트에서 확인해야 합니다.'},
  ],
};
