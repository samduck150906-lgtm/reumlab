import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { biotechPortalCore } from './portal-core';
import { biotechPortalOperations } from './portal-operations';

export const biotechPortalPage: AgencyPage = {
  slug:'portal/바이오테크업체',clusterIds:['ind-611-portal'],
  primaryKeyword:'바이오테크업체 고객 포털 개발',
  keywordVariants:['연구 서비스 의뢰 고객 포털','바이오 연구 결과 전달 자료실','연구 의뢰 보완 질문 포털'],
  searchIntent:'바이오 연구 서비스의 합의 범위와 제출 자료, 공개 승인된 산출물 및 결과 버전별 고객 질문을 관리하기',
  industry:'바이오테크업체',serviceAxis:'고객·파트너 포털',
  title:'바이오테크업체 고객 포털 개발 | 연구 의뢰·산출물·보완 질문 | 름랩',
  description:'연구 서비스 의뢰의 합의 범위와 제출 자료, 승인 산출물 및 보완 질문을 연결합니다. 범위 변경, 결과 정정과 고객별 접근 관리 기준을 확인하세요.',
  h1:'바이오테크업체 고객 포털, 연구 의뢰와 산출물의 확인 범위를 연결합니다',
  summary:'바이오테크 고객 포털은 연구 서비스의 합의 범위와 자료 제출, 승인된 산출물 전달 및 질문을 연결하는 공간으로 설계할 수 있습니다. 파일 수신과 내용 확인, 연구 수행과 결과 공개는 다른 상태입니다. 름랩은 의뢰별 권한과 변경·정정 절차를 확인해 고객과 담당자가 같은 근거를 보는 포털 범위를 정리합니다.',
  updatedAt:'2026-10-20',...biotechPortalCore,...biotechPortalOperations,
  sections:sections(['연구 서비스의 범위와 결과를 확인하는 고객','자료 추가와 범위 변경·결과 수신의 혼동','의뢰 접수·수행·공개·고객 검토 역할','의뢰 기준에서 자료 보완·산출물 전달까지','결과 버전과 보완 질문을 연결하는 화면','자료 부족과 공개 승인·질문의 운영','의뢰·제출 자료·산출물 버전의 연결','부분 제출·결과 정정·고객 변경 처리','대표 서비스의 첫 포털과 다수 의뢰 확장','파일과 공개 연동 검수의 비용·일정','연구 자료 사용과 검수 책임 확인','산출물 정정과 고객 접근의 운영 인수']),
  faq:[
    {question:'고객이 파일을 추가하면 의뢰 범위도 바뀌나요?',answer:'자료 추가와 업무 범위 변경은 구분해야 합니다. 접수 기준에 어떤 영향이 있는지 담당자가 확인하고 변경 요청으로 검토한 뒤 합의된 범위만 반영하도록 설계할 수 있습니다.'},
    {question:'결과 파일 다운로드를 검수 완료로 처리하나요?',answer:'파일 수신과 내용 검토, 계약상 검수 완료는 같은 의미가 아닙니다. 고객 확인 버튼이 무엇을 뜻하는지 실제 서비스와 계약 기준에 맞춰 정하고 미해결 질문을 별도로 남겨야 합니다.'},
    {question:'내부 분석 결과가 생기면 바로 공개되나요?',answer:'내부 파일 생성과 고객 공개 승인을 나누는 것이 좋습니다. 검토 책임자가 공개할 파일과 설명을 확인한 뒤 전달하고 내부 검토 메모나 다른 의뢰 자료가 포함되지 않는지 검수합니다.'},
    {question:'결과를 정정하면 이전 질문은 어떻게 되나요?',answer:'이전 결과 버전을 참조한 질문과 답변을 보존하고 새 버전의 변경 이유와 관계를 연결해야 합니다. 어떤 결과를 기준으로 의견을 남겼는지 확인할 수 있어야 정정 이후의 혼동을 줄일 수 있습니다.'},
    {question:'연구 서비스 포털이 내부 분석 도구를 대체하나요?',answer:'반드시 대체할 필요는 없습니다. 고객에게 필요한 의뢰 기준과 자료 제출, 승인 결과 전달 및 질문 처리부터 구축하고 내부 도구의 공개 가능한 상태와 파일을 연결할 수 있습니다.'},
    {question:'초기 설계에는 어떤 의뢰 예시가 필요한가요?',answer:'대표 서비스의 합의 범위와 제출 항목, 결과 형식 및 보완·정정 처리 사례가 도움이 됩니다. 실제 민감 자료 전체를 먼저 제공하기보다 형식과 상태, 접근 역할을 정리해 범위를 합의할 수 있습니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/website/바이오테크업체/',label:'공개 연구 기술과 협력 문의 안내',reason:'홈페이지의 공개 정보와 의뢰별 비공개 자료를 구분합니다.'},
    {href:'/development-agency/api-integration-development/',label:'내부 연구 도구와 공개 산출물 연결',reason:'의뢰 식별자와 결과 버전, 공개 승인 및 오류 처리를 확인합니다.'},
    {href:'/development-agency/cms-website-development/',label:'서비스 안내와 제출 기준의 편집',reason:'고객에게 안내하는 제출 항목과 공개 문서의 갱신 책임을 정합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'연구 의뢰 자료의 접근 검수',reason:'고객별 파일 격리와 외부 협력자 권한, 자료 회수 범위를 확인합니다.'},
    {href:'/source-handover/',label:'연구 서비스 포털 운영 인수',reason:'결과 정정과 보완 질문, 종료 의뢰의 자료 처리를 직접 운영하도록 준비합니다.'},
  ],
  ctaContext:'실제 제공하는 연구 서비스의 의뢰 기준과 제출 자료, 산출물 및 보완·정정 절차를 알려 주세요. 고객에게 필요한 진행과 결과를 전달하는 포털 범위를 정리합니다.',
  evidenceSources:[
    {title:'Thermo Fisher Scientific 연구 관련 서비스 안내',url:'https://www.thermofisher.com/nl/en/home/products-and-services/services.html',use:'연구와 장비·정보 관리 등 서비스 범위가 구분된 공개 배경을 참고했습니다. 이 포털은 업체의 실제 의뢰 절차에 맞춘 별도 제안이며 해당 회사의 고객 시스템을 재현한다고 주장하지 않습니다.'},
    {title:'W3C 웹 콘텐츠 접근성 기준 안내',url:'https://www.w3.org/WAI/WCAG22/quickref/',use:'자료 제출의 오류 안내와 진행 상태, 산출물 링크와 질문 입력을 접근 가능하게 제공하는 검수 기준을 참고합니다.'},
  ],
};
