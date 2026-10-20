import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { evBatteryWebsiteCore } from './website-core';
import { evBatteryWebsiteOperations } from './website-operations';

export const evBatteryWebsitePage: AgencyPage = {
  slug:'website/전기차배터리업체', clusterIds:['ind-608-website'],
  primaryKeyword:'전기차배터리업체 홈페이지 제작',
  keywordVariants:['전기차 배터리 회사 웹사이트','EV 배터리 제품 홈페이지','배터리 공급 업체 홈페이지'],
  searchIntent:'전기차 배터리 업체의 실제 공급 단위와 공개 제품 단계·자료를 구분해 기술 문의로 연결하는 홈페이지 제작 범위 비교',
  industry:'전기차배터리업체', serviceAxis:'홈페이지·웹사이트',
  title:'전기차배터리업체 홈페이지 제작 | 공급 범위·제품 문의 | 름랩',
  description:'전기차 배터리 홈페이지의 셀·모듈·팩 공급 범위와 공개 제품 단계, 사양 조건 및 기술 문의 흐름을 설계합니다. 자료 승인·갱신과 다국어 운영 범위를 확인하세요.',
  h1:'전기차배터리업체 홈페이지 제작, 공급 범위와 제품 검토 단계를 분명히 합니다',
  summary:'전기차 배터리 업체 홈페이지는 회사가 제공하는 단위와 공개 가능한 제품 상태를 설명하고 적절한 기술 문의로 연결해야 합니다. 제품군과 개별 모델의 사양, 샘플과 양산 상태, 공개 자료와 고객 전용 자료를 구분하는 것이 출발점입니다. 름랩은 실제 제공 범위와 자료 승인 과정을 확인해 제품 소개와 문의 운영을 설계합니다.',
  updatedAt:'2026-10-20', ...evBatteryWebsiteCore, ...evBatteryWebsiteOperations,
  sections:sections(['제공 단위와 구매자의 검토 목적','제품군·모델·개발 상태가 섞이는 문제','기술 자료의 검토와 공개 책임','제품 탐색에서 담당자 기술 상담까지','공급 범위와 조건을 읽는 제품 화면','공개 승인·언어별 갱신 관리','공개 제품 자료와 문의 도구 연결','제품 변경·미공개 항목·이전 자료 처리','첫 홈페이지와 고객 포털 확장 경계','기술 자료 정리와 제작 비용·일정','제품 표현과 자료 공개 전 확인','제품 갱신과 문의 운영의 인수']),
  faq:[
    {question:'셀과 팩을 모두 같은 제품 메뉴로 소개해도 되나요?',answer:'실제 제공 단위와 사업 역할이 구분되도록 구성하는 것이 좋습니다. 제품군을 함께 소개할 수 있지만 특정 공급 단위의 사양이나 역량을 다른 단위에도 적용되는 것처럼 표시하면 안 됩니다. 실제 제품 구조와 상담 목적을 확인해 메뉴를 정합니다.'},
    {question:'개발 중인 배터리도 홈페이지에 올릴 수 있나요?',answer:'공개 허락과 검토된 설명이 있다면 현재 개발 단계와 상담 가능한 범위를 분명히 안내할 수 있습니다. 계획이나 시제품 정보를 양산 실적처럼 표현하지 않고 상태가 바뀌었을 때 갱신할 책임자를 정해야 합니다.'},
    {question:'비공개 사양을 반드시 공개해야 하나요?',answer:'그럴 필요는 없습니다. 공개할 수 있는 제품 특징과 공급 범위, 별도 협의가 필요한 항목을 구분해 안내할 수 있습니다. 고객별 기술 문서와 상세 검토 자료는 접근 조건을 확인한 별도 전달 흐름으로 설계합니다.'},
    {question:'홈페이지에서 차량 적합성을 바로 판정할 수 있나요?',answer:'공개 사양을 탐색하는 기능과 차량 적용을 승인하는 기술 검토는 별개입니다. 조건이 다른 수치를 단순 비교해 적합하다고 안내하지 않습니다. 필요한 자료와 프로젝트 상황을 접수해 책임 있는 기술 담당자가 검토하도록 연결합니다.'},
    {question:'기술 문의 양식에는 무엇을 받아야 하나요?',answer:'처음에는 관심 공급 단위와 문의 목적, 프로젝트의 검토 단계 및 연락 방법부터 확인할 수 있습니다. 상세 설계 파일은 필요성과 전달 권한을 검토한 후 요청하는 방식도 가능합니다. 실제 대응 부서가 필요한 정보만 선택해 범위를 정합니다.'},
    {question:'홈페이지 견적 전에 어떤 자료를 준비하면 되나요?',answer:'현재 소개하는 제품군과 실제 공급 범위, 공개 가능한 문서 및 제품 상태를 알려 주세요. 기술 검토와 공개 승인을 담당할 사람, 문의 전달 방식도 함께 확인하면 자료 정리와 기능 구현의 범위를 나눠 산정할 수 있습니다.'},
  ],
  relatedRoutes:[
    {href:'/website/yeonguso/',label:'연구·기술 조직의 공개 홈페이지',reason:'공개 가능한 연구 설명과 사업 문의의 구성을 비교합니다.'},
    {href:'/development-agency/cms-website-development/',label:'제품 자료 편집과 공개 승인',reason:'제품 상태와 문서 갱신을 운영자가 관리하는 범위를 확인합니다.'},
    {href:'/development-agency/multilingual-website-development/',label:'다국어 기술 소개 운영',reason:'언어별 용어와 제품 상태의 승인·갱신 흐름을 정합니다.'},
    {href:'/development-agency/api-integration-development/',label:'문의와 영업 도구 연결',reason:'제품 선택 정보와 전송 실패 처리의 책임을 나눕니다.'},
    {href:'/source-handover/',label:'홈페이지 운영 인수',reason:'제품 수정과 자료 교체, 문의 접수의 운영 방법을 준비합니다.'},
  ],
  ctaContext:'실제 제공하는 배터리 단위와 공개 제품군, 자료 승인 담당자 및 기술 문의 흐름을 알려 주세요. 공개 범위와 운영 갱신 기준을 반영한 홈페이지 제작 범위를 정리합니다.',
  evidenceSources:[
    {title:'미국 에너지부 배터리 셀·팩 공급 구분',url:'https://www.energy.gov/cmei/vehicles/articles/fotw-1192-june-28-2021-most-us-light-duty-plug-electric-vehicle-battery',use:'셀 제조와 팩 구성의 공급자가 다를 수 있다는 사업 역할 구분을 확인한 배경 자료입니다. 과거 시장 통계나 다른 업체의 실적을 의뢰 업체의 역량으로 사용하지 않습니다.'},
    {title:'삼성SDI의 Cell-to-Pack 기술 설명',url:'https://news.samsungsdi.com/global/articleView?cate=B01&seq=250',use:'제품 구성에 따라 중간 모듈 단계가 다를 수 있으므로 공개 제품 메뉴를 실제 공급 구조에 맞춰야 한다는 점을 확인한 자료입니다. 해당 제조사의 성능이나 기술을 름랩의 개발 실적으로 주장하지 않습니다.'},
  ],
};
