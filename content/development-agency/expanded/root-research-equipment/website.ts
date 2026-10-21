import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { researchEquipmentWebsiteCore } from './website-core';
import { researchEquipmentWebsiteOperations } from './website-operations';

export const researchEquipmentWebsitePage: AgencyPage = {
  slug:'website/연구장비업체',clusterIds:['ind-614-website'],
  primaryKeyword:'연구장비업체 홈페이지 제작',
  keywordVariants:['연구 장비 공급업체 웹사이트','분석 장비 제품 비교 홈페이지','실험 장비 기술 자료 홈페이지'],
  searchIntent:'연구 목적에 맞는 장비군과 실제 공급 구성·조건이 있는 사양을 비교하고 설치 준비 자료와 제품 상담을 연결하기',
  industry:'연구장비업체',serviceAxis:'홈페이지·웹사이트',
  title:'연구장비업체 홈페이지 제작 | 사양 조건·구성·기술 자료 | 름랩',
  description:'장비 모델의 사양 단위와 적용 조건, 기본·선택 구성을 구분합니다. 기술 자료 개정과 단종 제품 지원, 설치 준비 안내 및 제품 상담의 구축 범위를 확인하세요.',
  h1:'연구장비업체 홈페이지, 사양의 조건과 실제 공급 구성을 함께 설명합니다',
  summary:'연구 장비를 검토하는 고객에게는 모델 이름과 수치뿐 아니라 적용 조건과 기본·선택 구성, 설치 준비 및 지원 범위가 필요합니다. 름랩은 실제 취급 제품과 승인된 기술 자료를 바탕으로 모델 탐색·비교와 전문 상담이 연결되는 홈페이지를 설계합니다.',
  updatedAt:'2026-10-21',...researchEquipmentWebsiteCore,...researchEquipmentWebsiteOperations,
  sections:sections(['연구 목적과 공급 구성을 확인하는 방문자','조건 없는 수치 비교와 오래된 자료 문제','제품·기술 검토·공개 승인·문의 역할','장비 탐색에서 구성 상담과 자료 갱신까지','조건과 단위가 표시된 모델 비교 화면','모델 공급 상태와 기술 자료의 운영','제품·구성·사양·자료 개정의 연결','구성 변경·단종·비공개 자료 오접수','대표 장비군의 첫 홈페이지 검수','사양 정리와 원본 연동의 비용·일정','제품 표현과 자료 사용 범위 확인','모델·비교 항목·문서 갱신의 인수']),
  faq:[
    {question:'사양 숫자만 같은 표에 넣어 비교해도 되나요?',answer:'같은 의미의 항목과 단위인지, 측정 조건과 적용 구성이 같은지 먼저 확인해야 합니다. 직접 비교하기 어려운 값은 조건과 자료 출처를 함께 표시하고 기술 담당자의 확인이 필요한 항목으로 안내하는 것이 좋습니다.'},
    {question:'모델이 같으면 기본 제공 품목도 항상 같나요?',answer:'실제 판매 시점과 공급 구성에 따라 확인이 필요할 수 있습니다. 홈페이지에서는 기본 구성과 선택 품목, 별도 상담이 필요한 조합을 구분하고 개별 견적에 적용된 구성은 당시 자료와 함께 관리하도록 범위를 정합니다.'},
    {question:'단종 장비의 제품 페이지는 어떻게 운영하나요?',answer:'신규 공급 가능 여부와 기존 고객에게 제공하는 자료·부품·서비스 지원을 나눠 안내할 수 있습니다. 필요한 기술 자료는 적용 대상을 표시해 유지하고 현재 구매 가능한 제품으로 오해하지 않도록 공개 상태를 정리합니다.'},
    {question:'설치 준비 안내를 홈페이지에 제공할 수 있나요?',answer:'해당 모델과 구성에 적용되는 승인된 준비 문서로 안내할 수 있습니다. 공개 안내를 읽는 단계와 실제 현장의 준비 확인, 장비 설치 및 이후 성능 확인은 구분하고 실제 계약과 전문 담당자의 검토 범위를 확인해야 합니다.'},
    {question:'제조사 사이트의 사진과 매뉴얼을 그대로 가져와도 되나요?',answer:'자료의 사용·배포 권한과 적용 모델·구성·언어 및 개정을 먼저 확인해야 합니다. 공개 가능한 자료를 연결하는 방식과 직접 게시하는 방식의 조건이 다를 수 있으므로 원본 권리와 공급업체의 실제 권한에 맞춰 운영합니다.'},
    {question:'제작 전에 어떤 제품 자료를 준비하면 좋을까요?',answer:'실제 취급 모델과 국내 공급 구성, 핵심 사양의 단위·조건 및 승인된 기술 자료를 정리하면 도움이 됩니다. 설치·교육·유지 지원의 제공 범위와 제품군별 상담 담당자를 함께 확인하면 홈페이지의 정보와 문의 흐름을 구체화할 수 있습니다.'},
  ],
  relatedRoutes:[
    {href:'/website/yeonguso/',label:'연구기관 홈페이지의 정보 목적',reason:'장비를 사용하는 기관 소개와 제품을 공급하는 업체의 모델·구성 상담 범위를 비교합니다.'},
    {href:'/development-agency/website/임상데이터업체/',label:'기술 서비스의 입력·산출물 설명',reason:'기술 용어를 실제 제공 업무와 확인할 조건으로 연결하는 구성을 검토합니다.'},
    {href:'/development-agency/cms-website-development/',label:'제품과 기술 자료의 갱신 관리',reason:'사양 조건과 문서 개정, 공개 승인 및 담당자의 편집 범위를 정리합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'제품 문의와 비공개 자료 전달',reason:'초기 상담 항목과 이후 고객 연구 자료를 전달할 경로의 접근 범위를 확인합니다.'},
    {href:'/source-handover/',label:'제품 홈페이지 운영 인수',reason:'구성 변경과 단종 안내, 자료 개정 및 문의 이관을 담당자가 직접 검수합니다.'},
  ],
  ctaContext:'취급하는 장비군과 모델, 기본·선택 구성 및 공개 가능한 사양·기술 자료를 알려 주세요. 조건을 비교하고 필요한 준비 사항과 전문 상담이 연결되는 홈페이지 범위를 정리합니다.',
  evidenceSources:[
    {title:'Agilent 장비 설치 전 현장 준비 안내',url:'https://www.agilent.com/en/s/installation-relocation-services/site-preparation',use:'장비 설치 전에 공간과 연결 환경 등 준비 조건을 확인하는 업무가 있다는 배경을 참고했습니다. 개별 모델의 실제 조건과 공개 안내는 승인된 해당 자료를 확인해야 합니다.'},
    {title:'Agilent 장비 설치 서비스 안내',url:'https://www.agilent.com/en/s/installation-relocation-services/instrument-installation',use:'설치와 제조사 사양에 따른 확인, 사용자 교육의 범위를 구분하는 참고 자료입니다. 름랩이나 공급업체의 설치 자격·검증 적합성을 인증하는 근거로 사용하지 않습니다.'},
  ],
};
