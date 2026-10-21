import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { laboratoryOperationsWebsiteCore } from './website-core';
import { laboratoryOperationsWebsiteOperations } from './website-operations';

export const laboratoryOperationsWebsitePage: AgencyPage = {
  slug:'website/실험실관리업체',clusterIds:['ind-615-website'],
  primaryKeyword:'실험실관리업체 홈페이지 제작',
  keywordVariants:['실험실 운영 대행 홈페이지','실험실 관리 서비스 웹사이트','실험실 운영 지원 업체 사이트'],
  searchIntent:'실험실 운영 지원·시험 분석·관리 소프트웨어 중 실제 제공 업무와 고객 책임·준비 자료·산출물 및 공개 근거를 설명하고 목적별 상담을 연결하기',
  industry:'실험실관리업체',serviceAxis:'홈페이지·웹사이트',
  title:'실험실관리업체 홈페이지 제작 | 수행 범위·준비 자료·산출물 | 름랩',
  description:'실험실 운영 대행과 시험·분석, 관리 소프트웨어의 제공 범위를 구분합니다. 고객 준비 사항과 산출물, 공개 근거 및 상담 이관의 홈페이지 구축 범위를 확인하세요.',
  h1:'실험실관리업체 홈페이지, 실제 맡길 업무와 준비 자료·결과물을 설명합니다',
  summary:'실험실 관리 서비스는 운영 업무의 수행과 시험·분석, 관리 도구의 구축에 따라 고객이 맡길 일과 결과물이 달라질 수 있습니다. 름랩은 실제 제공 범위와 고객 책임, 공개할 근거 및 협력 조건을 정리해 목적별 상담으로 이어지는 홈페이지를 설계합니다.',
  updatedAt:'2026-10-21',...laboratoryOperationsWebsiteCore,...laboratoryOperationsWebsiteOperations,
  sections:sections(['운영 지원의 실제 범위를 확인하는 의뢰기관','운영 대행·시험 수행·도구 구축의 혼동','서비스·기술 검토·공개 승인·상담 역할','서비스 탐색에서 협력 조건과 전문 상담까지','업무 범위와 고객 준비 사항을 읽는 화면','서비스·근거·사례·문의 담당의 운영','공개 업무와 결과물·자격 범위의 연결','복합 서비스·허락 변경·자료 오접수','대표 서비스의 첫 소개와 문의 검수','기술 콘텐츠와 상담 이관의 비용·일정','자격 표현과 고객 자료 사용 범위 확인','서비스 변경과 자료 정정의 운영 인수']),
  faq:[
    {question:'운영 대행과 시험·분석 서비스를 같은 소개로 묶어도 되나요?',answer:'한 업체가 함께 제공하더라도 실제 수행 업무와 결과물, 고객의 승인 책임이 다를 수 있습니다. 서비스 유형별 범위를 먼저 설명하고 고객이 맡기려는 업무를 선택해 상담할 수 있도록 구성하는 것이 좋습니다.'},
    {question:'관리 소프트웨어 구축도 실험실 운영을 맡긴다는 뜻인가요?',answer:'도구를 구축하는 범위와 실제 인력이 운영 업무를 수행하는 범위는 구분해야 합니다. 홈페이지에서 제공하는 기능과 수행 업무, 고객이 계속 맡을 일 및 전달 결과를 각각 명확하게 설명해야 합니다.'},
    {question:'인정이나 인증 로고를 표시하면 충분한가요?',answer:'실제 자격의 대상 기관과 업무·범위, 확인 시점 및 표기 권한을 함께 검토해야 합니다. 특정 인정이 모든 시험과 제품, 운영 서비스나 소프트웨어에 대한 보증으로 확대되지 않도록 설명하는 것이 좋습니다.'},
    {question:'초기 상담에서 실험실 도면과 연구 자료를 받아야 하나요?',answer:'처음에는 운영 유형과 요청 업무, 현재 도구 및 자료 준비 상태 등 필요한 개요로 범위를 확인할 수 있습니다. 비공개 자료가 필요한 다음 단계는 처리 목적과 권한, 전달 경로를 별도로 정하는 것이 좋습니다.'},
    {question:'고객 포털과 관리 프로그램도 홈페이지 안에서 만들 수 있나요?',answer:'공개 홈페이지에서 로그인 경로를 안내하고 연결할 수 있습니다. 실제 고객 자료를 처리하는 포털과 업무 프로그램은 기관별 접근·원장·검수 범위가 필요하므로 별도의 기능과 비용·일정으로 정리해야 합니다.'},
    {question:'제작 전에 가장 먼저 준비할 내용은 무엇인가요?',answer:'실제 제공 서비스와 고객이 계속 맡을 업무, 필요한 준비 자료와 산출물을 정리하면 도움이 됩니다. 공개 가능한 자격·사례의 근거 및 상담 담당자를 함께 확인하면 콘텐츠와 문의 흐름을 구체화할 수 있습니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/laboratory-sample-management/',label:'실험실의 실제 시료·결과 관리 업무',reason:'공개 서비스 설명과 비공개 업무 원장을 구축하는 프로그램의 범위를 비교합니다.'},
    {href:'/development-agency/website/연구장비업체/',label:'장비 공급 범위와 기술 자료 안내',reason:'장비를 공급하는 역할과 실험실 운영을 지원하는 서비스의 설명 목적을 구분합니다.'},
    {href:'/development-agency/cms-website-development/',label:'서비스와 공개 근거 자료의 갱신',reason:'업무 범위와 사례 허락, 자료 개정 및 편집·공개 승인 책임을 정리합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'공개 문의와 실험실 자료 접근 범위',reason:'초기 상담의 정보와 별도 비공개 자료 전달, 기관별 접근을 검수합니다.'},
    {href:'/source-handover/',label:'실험실 서비스 홈페이지 운영 인수',reason:'서비스 변경과 사례 정정, 상담 담당자 이관을 운영자가 직접 확인합니다.'},
  ],
  ctaContext:'실제로 제공하는 실험실 운영 업무와 고객 준비 사항, 전달 결과 및 공개 가능한 근거를 알려 주세요. 서비스의 범위와 목적별 상담이 명확한 홈페이지를 정리합니다.',
  evidenceSources:[
    {title:'NIST NVLAP 인정과 인증의 차이 안내',url:'https://www.nist.gov/nvlap/accreditation-vs-certification',use:'특정 시험·교정의 인정 범위와 제품 인증을 구분하는 참고 자료입니다. 다른 제도의 요건을 대신 설명하거나 름랩·의뢰업체가 해당 인정을 보유한다는 근거로 사용하지 않습니다.'},
  ],
};
