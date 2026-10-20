import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { semiconductorWebsiteCore } from './website-core';
import { semiconductorWebsiteOperations } from './website-operations';

export const semiconductorWebsitePage: AgencyPage = {
  slug:'website/반도체장비업체',clusterIds:['ind-609-website'],
  primaryKeyword:'반도체장비업체 홈페이지 제작',
  keywordVariants:['반도체 장비 회사 웹사이트','공정 장비 제품 홈페이지','반도체 장비 기술 문의 홈페이지'],
  searchIntent:'반도체 장비의 공정 기능·제품군·모델 탐색과 신규 장비·기존 장비 지원 문의를 구분하는 홈페이지 제작 범위',
  industry:'반도체장비업체',serviceAxis:'홈페이지·웹사이트',
  title:'반도체장비업체 홈페이지 제작 | 공정별 제품·지원 문의 | 름랩',
  description:'반도체 장비 홈페이지의 공정 기능과 제품군·모델 관계, 신규 장비·서비스 문의 경로를 설계합니다. 공개 기술 자료의 적용 범위와 승인·갱신 운영을 확인하세요.',
  h1:'반도체장비업체 홈페이지 제작, 공정별 탐색을 제품과 기술 문의로 연결합니다',
  summary:'반도체 장비 업체 홈페이지는 필요한 공정 기능과 실제 공급하는 제품군·모델을 연결하고 신규 구매와 기존 장비 지원 문의를 구분해야 합니다. 공개 가능한 적용 범위와 기술 상담에서 확인할 조건도 나눠야 합니다. 름랩은 실제 제품 자료와 서비스 책임을 확인해 탐색·문의·갱신의 제작 범위를 정리합니다.',
  updatedAt:'2026-10-20',...semiconductorWebsiteCore,...semiconductorWebsiteOperations,
  sections:sections(['공정 기능과 장비 지원을 찾는 구매자','제품 탐색과 서비스 문의가 끊기는 문제','제품·기술·서비스의 공개 책임','공정 탐색에서 목적별 기술 상담까지','제품 관계와 문의 유형별 화면','지원 범위와 자료 갱신 운영','공개 제품 정보와 영업·포털 연결','모델 개정·지원 변경·자료 회수 처리','대표 제품군의 첫 구축과 다국어 확장','기술 콘텐츠와 연결 기능의 비용·일정','성능 표현과 고객 자료 공개 확인','제품 분류와 문의 운영 인수']),
  faq:[
    {question:'공정별 메뉴와 모델 목록 중 무엇부터 만들면 되나요?',answer:'방문자가 제품 모델을 알고 오는지 필요한 기능부터 찾는지 확인하는 것이 좋습니다. 두 탐색 경로를 제공할 수 있지만 같은 제품의 상세 정보는 일관되게 연결해야 합니다. 실제 공급 범위를 기준으로 분류와 관계를 정합니다.'},
    {question:'장비 판매와 서비스 문의를 같은 양식으로 받아도 되나요?',answer:'접수는 함께 운영할 수 있지만 목적에 따라 필요한 정보와 담당자가 다를 수 있습니다. 신규 장비 검토와 기존 장비의 부품·지원 요청을 구분하면 초기 확인 부담을 줄일 수 있습니다. 실제 대응 부서와 접수 기준을 확인해 양식을 구성합니다.'},
    {question:'상세 공정 조건을 홈페이지에서 받아야 하나요?',answer:'초기 문의에서는 필요한 기능과 검토 단계 등 공개 가능한 수준부터 확인할 수 있습니다. 비공개 공정 자료는 필요성과 전달 권한을 검토한 후 별도 협의로 받는 방식도 가능합니다. 모든 고객에게 민감한 파일 제출을 요구할 필요는 없습니다.'},
    {question:'단종 장비 페이지는 바로 없애야 하나요?',answer:'기존 고객의 지원 문의와 자료 확인 필요성을 함께 검토해야 합니다. 현재 지원 여부와 상담 경로를 안내할 수 있으며 대체 모델이 동일하게 호환된다고 자동 표현하면 안 됩니다. 실제 사업 정책에 맞춰 공개 상태를 정합니다.'},
    {question:'다른 제조사 장비를 취급하는 회사도 제작할 수 있나요?',answer:'실제 공급·서비스 역할과 자료 사용 허락을 확인해 구성할 수 있습니다. 해당 제조사의 성능이나 실적을 자체 개발 성과로 표시하지 않고 회사가 제공하는 범위를 분명히 안내해야 합니다. 제품별 공개 자료와 문의 책임을 함께 정리합니다.'},
    {question:'견적 전에 어떤 자료를 준비하면 되나요?',answer:'공급하는 공정 기능과 제품군·모델 목록, 공개할 수 있는 기술 자료 및 신규 장비·지원 문의의 처리 방식을 알려 주세요. 기술 검토와 공개 승인 담당자를 확인하면 콘텐츠 편집과 화면·연동 구현의 범위를 나눌 수 있습니다.'},
  ],
  relatedRoutes:[
    {href:'/website/yeonguso/',label:'연구·기술 조직의 홈페이지 구성',reason:'공개 기술 설명과 상담에서 확인할 정보의 범위를 비교합니다.'},
    {href:'/development-agency/cms-website-development/',label:'제품과 문서의 운영 편집',reason:'제품 관계와 공개 자료의 승인·갱신 방법을 확인합니다.'},
    {href:'/development-agency/multilingual-website-development/',label:'다국어 기술 자료 운영',reason:'공정 용어와 모델·지원 상태를 언어별로 관리합니다.'},
    {href:'/development-agency/api-integration-development/',label:'기술 문의와 영업 도구 연결',reason:'제품 선택과 요청 유형이 담당자에게 전달되는 범위를 정합니다.'},
    {href:'/source-handover/',label:'제품 홈페이지 운영 인수',reason:'제품 추가와 문서 회수, 지원 문의의 운영 절차를 준비합니다.'},
  ],
  ctaContext:'제공하는 공정 기능과 제품군·모델, 공개 기술 자료 및 기존 장비의 지원 범위를 알려 주세요. 구매자 탐색과 목적별 기술 문의를 연결하는 홈페이지 범위를 정리합니다.',
  evidenceSources:[
    {title:'Applied Materials 반도체 제품 분류',url:'https://www.appliedmaterials.com/us/en/semiconductor/products.html',use:'공정 기능과 제품 탐색의 관계를 확인한 공개 참고 자료입니다. 해당 제조사의 제품이나 역량을 의뢰 업체의 공급 범위로 가정하지 않습니다.'},
    {title:'Lam Research 고객 지원 개요',url:'https://www.lamresearch.com/customer-support/customer-support-overview/?highlight=etch+UI',use:'장비 제품과 부품·서비스·업그레이드·고객 자료 접근을 구분하는 공개 사례를 참고했습니다. 실제 제공 범위와 홈페이지 구성은 의뢰 업체의 업무를 확인해 정합니다.'},
  ],
};
