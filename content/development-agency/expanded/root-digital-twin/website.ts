import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '@/content/development-agency/expanded/root-wind/structure';
import { digitalTwinWebsiteCore } from './website-core';
import { digitalTwinWebsiteOperations } from './website-operations';

export const digitalTwinWebsitePage: AgencyPage = {
  slug:'website/디지털트윈업체',clusterIds:['ind-621-website'],
  primaryKeyword:'디지털트윈업체 홈페이지 제작',
  keywordVariants:['디지털 트윈 개발사 웹사이트','디지털트윈 모델링 업체 홈페이지','디지털트윈 도입 상담 홈페이지'],
  searchIntent:'실제 대상과 준비 자료, 모델 작성·데이터 연결·시연의 제공 범위를 구분하고 기술 상담으로 연결하기',
  industry:'디지털트윈업체',serviceAxis:'홈페이지·웹사이트',
  title:'디지털트윈업체 홈페이지 제작 | 대상·자료·연결 범위 | 름랩',
  description:'입체 시연과 실제 데이터 연결의 범위를 구분합니다. 대상 자산과 준비 자료, 갱신 조건·공개 허락·기술 상담을 설명하는 디지털트윈업체 홈페이지 구축을 확인하세요.',
  h1:'디지털트윈업체 홈페이지, 시연의 모습과 실제 연결 범위를 함께 설명합니다',
  summary:'디지털트윈 도입을 검토하는 고객에게는 적용 대상과 보유 자료, 모델의 범위 및 실제로 연결할 업무의 설명이 필요합니다. 름랩은 공개가 승인된 자료를 바탕으로 시연의 성격과 제공 단계를 구분하고 구체적인 기술 상담이 이어지는 홈페이지를 설계합니다.',
  updatedAt:'2026-10-21',...digitalTwinWebsiteCore,...digitalTwinWebsiteOperations,
  sections:sections(['대상과 첫 업무를 확인하는 도입 검토자','화면 시연만으로 연결 범위가 드러나지 않는 문제','서비스·모델·연동·공개 승인·상담 역할','분야 탐색에서 자료 개요 확인과 기술 상담까지','자료 성격이 명확한 시연과 제공 단계 안내','공개 자료의 검토·개정과 문의 배정','대상·모델·자료·공개 허락의 연결','오래된 값과 비공개 도면·외부 시연 장애','대표 업무의 첫 안내와 이후 콘텐츠 확장','공개 자료와 실제 시연의 제작·운영 조건','고객 자료 사용과 기술 표현의 검토','자료 갱신과 문의 이관을 직접 확인하는 인수']),
  faq:[
    {question:'입체 모델 화면만 있으면 실시간 디지털트윈이라고 소개해도 되나요?',answer:'모델 표시와 실제 대상의 자료 연결·갱신 조건을 구분해 설명해야 합니다. 홈페이지에는 해당 시연이 사용하는 자료의 성격과 확인 시점, 구현 범위를 안내하고 현재 현장 상태를 그대로 보여 준다고 단정하지 않는 것이 좋습니다.'},
    {question:'고객의 실제 설비 화면을 공개 시연에 사용할 수 있나요?',answer:'고객의 공개 허락과 포함된 도면·모델·수치의 사용 권한을 먼저 확인해야 합니다. 공개 범위가 승인된 자료와 접속 경로를 사용하고 비공개 운영 환경이나 고객 식별 정보가 일반 방문자에게 노출되지 않도록 검토합니다.'},
    {question:'홈페이지 상담에 상세 도면과 내부망 정보를 모두 받아야 하나요?',answer:'초기 상담에서는 대상의 개요와 원하는 첫 업무, 보유 자료 종류를 파악하는 범위부터 정할 수 있습니다. 실제 비공개 자료와 접속 조건은 목적과 접근 권한을 확인한 후속 경로에서 검토하는 편이 적절합니다.'},
    {question:'홈페이지와 고객 운영 포털은 어떤 차이가 있나요?',answer:'홈페이지는 제공 분야와 준비 자료, 시연 및 상담을 설명하는 공개 정보 공간입니다. 고객 운영 포털은 계약과 권한이 있는 사용자가 자신의 대상·자료·확인 요청을 다루는 공간으로 데이터 접근과 운영 책임을 별도로 설계해야 합니다.'},
    {question:'실제 데이터 연결을 쓰는 시연도 제작할 수 있나요?',answer:'사용할 자료와 공개 권한, 갱신 조건 및 운영 비용을 확인한 범위에서 검토할 수 있습니다. 설명용 시연과 고객의 실제 운영 연결을 구분하고 외부 시연이 열리지 않을 때 제공할 안내와 유지 담당도 함께 정합니다.'},
    {question:'홈페이지 제작 전에 어떤 설명 자료를 준비하면 좋을까요?',answer:'실제 제공 가능한 분야와 대상, 고객이 준비할 자료, 모델 작성·연동·화면 개발 중 맡을 단계를 정리하면 도움이 됩니다. 사용할 수 있는 공개 자료와 시연의 성격, 기술 검토 및 상담 담당자를 함께 확인하면 구축 범위를 구체화할 수 있습니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/cms-website-development/',label:'기술 안내와 시연 자료의 갱신',reason:'서비스 설명과 공개 자료 개정을 담당자가 검토하고 게시하는 운영 범위를 확인합니다.'},
    {href:'/development-agency/website/로봇스타트업/',label:'실제 제품과 적용 조건의 공개 안내',reason:'기술 시연을 실제로 제공하는 제품·업무의 범위와 연결하는 정보 구성을 비교합니다.'},
    {href:'/development-agency/website/스마트시티업체/',label:'대상 구역과 데이터 조건의 설명',reason:'공간과 시설을 다루는 사업에서 대상 범위와 자료 준비 조건을 공개하는 방법을 검토합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'공개 시연과 비공개 자료의 접근',reason:'일반 방문자용 자료와 개별 고객 운영 정보의 권한 및 전달 경로를 구분합니다.'},
    {href:'/source-handover/',label:'시연 갱신과 기술 상담의 운영 인수',reason:'자료 개정·외부 연결 장애·문의 담당자 변경을 실제 운영자가 확인하는 인수 범위를 정합니다.'},
  ],
  ctaContext:'적용하려는 분야와 대상, 실제 제공 단계 및 공개 가능한 모델·화면 자료를 알려 주세요. 준비 자료와 시연의 성격을 설명하고 기술 상담이 연결되는 홈페이지 범위를 정리합니다.',
  evidenceSources:[
    {title:'Digital Twin Consortium 디지털트윈 정의',url:'https://www.digitaltwinconsortium.org/initiatives/the-definition-of-a-digital-twin/',use:'실제 대상의 표현과 정해진 동기화 조건을 구분하는 개념적 배경으로 참고했습니다. 개별 구현의 적합성이나 업체의 인증을 뜻하지 않습니다.'},
    {title:'Microsoft Azure Digital Twins의 모델과 관계 안내',url:'https://learn.microsoft.com/en-us/azure/digital-twins/concepts-twins-graph',use:'대상 모델과 대상 사이의 관계를 설명하는 기술 배경입니다. 특정 제품 사용이나 연동 완료를 름랩의 실적으로 제시하지 않습니다.'},
  ],
};
