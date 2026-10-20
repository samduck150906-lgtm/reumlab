import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { storageWebsiteCore } from './website-core';
import { storageWebsiteOperations } from './website-operations';

export const storageWebsitePage: AgencyPage = {
  slug:'website/에너지저장장치업체', clusterIds:['ind-607-website'],
  primaryKeyword:'에너지저장장치업체 홈페이지 제작',
  keywordVariants:['ESS 업체 홈페이지 제작','에너지저장장치 제품 웹사이트','배터리 저장장치 기업 홈페이지'],
  searchIntent:'에너지저장장치의 실제 제공 역할과 조건별 제품 자료를 구분해 공개하고 도입 목적·기존 고객 자료 요청에 맞는 기술 문의를 접수하기',
  industry:'에너지저장장치업체', serviceAxis:'홈페이지·웹사이트',
  title:'에너지저장장치업체 홈페이지 제작 | 사양 조건·도입 목적·문의 | 름랩',
  description:'ESS 홈페이지의 제공 역할, 제품별 전력·에너지 용량과 조건, 도입 목적별 문의를 설계합니다. 공개 사례와 문서 개정, 기술 검토 및 기존 고객 자료 요청의 범위를 확인하세요.',
  h1:'에너지저장장치업체 홈페이지 제작, 제공 범위와 제품 조건을 문의에 연결합니다',
  summary:'에너지저장장치업체 홈페이지는 장비 공급과 구성·구축·운영 지원의 실제 역할을 구분하고 제품 자료의 단위와 조건을 정확히 안내해야 합니다. 도입 전 상담과 기존 고객의 자료 요청도 필요한 입력이 다릅니다. 름랩은 공개 가능한 사양과 문의 흐름을 확인해 기술 자료 탐색부터 담당자 배정까지 범위를 설계합니다.',
  updatedAt:'2026-10-20',
  ...storageWebsiteCore, ...storageWebsiteOperations,
  sections:sections(['도입 목적과 실제 제공 역할을 확인하는 고객','용량 표기와 적용 조건이 섞이는 문제','사업·기술 승인·게시·사례 검토 역할','제품 자료 확인에서 기술 문의 배정까지','조건이 있는 사양과 목적별 문의 화면','개정 자료·공개 사례·상담 대기 관리','제품 조건 데이터와 기존 관리 도구 연결','단위 오류·단종·번역 지연·파일 실패 처리','대표 제품 안내의 첫 범위와 확장','자료 정리와 기술 승인의 비용·일정','성능 근거와 현장 적용 검토의 범위','제품 개정과 문의 운영을 이어가는 인수']),
  faq:[
    {question:'저장 용량과 출력은 같은 항목으로 표시해도 되나요?',answer:'저장할 수 있는 에너지와 공급할 수 있는 전력은 서로 다른 항목과 단위로 안내해야 합니다. 실제 공개 자료의 조건을 함께 확인하고 지속 시간 등의 설명에도 기준을 표시합니다. 제품마다 다른 조건의 수치를 동일한 성능처럼 비교하지 않습니다.'},
    {question:'홈페이지에 예상 절감 효과를 계산해 넣을 수 있나요?',answer:'필요한 원본 자료와 가정, 계산 기준 및 검토 책임을 먼저 확인해야 합니다. 일반 제품 사양만으로 특정 현장의 절감이나 수익을 보장하지 않습니다. 계산 기능은 확인한 조건과 결과의 적용 범위를 설명할 수 있을 때 별도 개발 범위로 검토합니다.'},
    {question:'장비 공급과 구축 서비스를 함께 소개해도 되나요?',answer:'실제 수행하는 역할과 계약 범위를 구분해 안내할 수 있습니다. 직접 제공하지 않는 업무를 전체 서비스에 자동 포함하지 않습니다. 고객이 각 단계에서 누구와 무엇을 확인해야 하는지 문의 경로와 함께 설명하는 방식이 좋습니다.'},
    {question:'도입 상담에서 현장 자료를 모두 받아야 하나요?',answer:'초기에는 도입 목적과 일정, 고객이 현재 알고 있는 조건을 중심으로 최소 항목을 받을 수 있습니다. 비공개 전력 사용 자료와 상세 도면의 전달은 필요성과 권한을 확인한 뒤 정합니다. 모르는 항목도 문의를 남길 수 있도록 구성할 수 있습니다.'},
    {question:'해외 자료를 참고하면 국내 요구도 충족하나요?',answer:'해외 참고 자료는 기술 용어와 업무 검토의 배경으로 활용할 수 있지만 국내 현장의 요구를 자동 충족하지 않습니다. 적용할 기준과 인허가, 안전 및 계약 조건은 프로젝트별로 실제 책임자가 확인해야 합니다.'},
    {question:'제작 상담에 어떤 자료를 준비하면 되나요?',answer:'실제 제공하는 업무 역할과 대표 제품 자료, 현재 문의 유형 및 공개할 수 있는 사례 범위를 알려 주세요. 기술 수치와 단위의 검토 담당자도 정해 두면 도움이 됩니다. 확인 가능한 예시로 자료 구조와 첫 개발 범위를 정리합니다.'},
  ],
  relatedRoutes:[
    {href:'/website/',label:'기업 홈페이지 제작 범위',reason:'사업 역할과 제품 안내를 고객 탐색 흐름으로 정리합니다.'},
    {href:'/development-agency/api-integration-development/',label:'제품 자료·상담 도구 연결',reason:'공개할 항목과 접수 번호의 대조 기준을 확인합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'현장 첨부와 관리자 접근',reason:'고객 자료의 수집·열람·전달 권한을 검수합니다.'},
    {href:'/solution/manufacturing/',label:'제품 기준 정보 관리',reason:'공개 사양과 내부 관리 자료의 연결을 검토합니다.'},
    {href:'/source-handover/',label:'웹사이트 운영 인수',reason:'자료 개정과 문의 배정을 이어갈 계정과 절차를 준비합니다.'},
  ],
  ctaContext:'대표 제품의 확인된 사양과 실제 제공하는 업무 역할, 도입 전·후 문의 유형을 알려 주세요. 조건이 명확한 자료와 상담 흐름을 갖춘 홈페이지 범위를 정리합니다.',
  evidenceSources:[
    {title:'미국 에너지부 저장 에너지와 전력 용량 안내',url:'https://www.energy.gov/cmei/systems/solar-integration-solar-energy-and-storage-basics',use:'저장 에너지와 공급 전력의 항목·단위를 구분하는 배경을 확인합니다.'},
    {title:'미국 에너지부 배터리 저장장치 기술 사양 안내',url:'https://www.energy.gov/cmei/femp/articles/lithium-ion-battery-storage-technical-specifications',use:'프로젝트 요구에 맞춰 사양을 검토해야 한다는 배경 자료입니다. 국내 기준 충족이나 당사의 인증을 의미하지 않습니다.'},
  ],
};
