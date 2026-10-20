import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { evBatteryManagementCore } from './management-core';
import { evBatteryManagementOperations } from './management-operations';

export const evBatteryManagementPage: AgencyPage = {
  slug:'management/전기차배터리업체',clusterIds:['ind-608-management'],
  primaryKeyword:'전기차배터리업체 관리 프로그램',
  keywordVariants:['배터리 생산 이력 관리','배터리 구성품 추적 시스템','EV 배터리 출하 자료 관리'],
  searchIntent:'전기차 배터리의 자재·제품 구성 관계와 보류·해제·출하 기록을 원본 시스템에 연결하는 관리 프로그램의 범위 비교',
  industry:'전기차배터리업체',serviceAxis:'관리 프로그램·ERP',
  title:'전기차배터리업체 관리 프로그램 | 구성 이력·출하 기록 | 름랩',
  description:'전기차 배터리의 자재와 제품 식별 관계, 분리·교체 이력 및 보류·출하 자료를 연결합니다. 기존 제조 시스템의 책임과 수량 대조·정정·연동 범위를 확인하세요.',
  h1:'전기차배터리업체 관리 프로그램, 제품 구성과 출하 시점의 이력을 연결합니다',
  summary:'전기차 배터리 관리 프로그램은 자재와 제품의 실제 구성 관계, 변경 이력 및 출하 시점의 기록을 확인하는 업무에 활용할 수 있습니다. 기존 제조·품질 시스템의 원본 책임과 보류·해제 권한을 구분해야 합니다. 름랩은 식별 체계와 원장 예시를 확인해 추적 관계와 정정·출하 자료 연결의 개발 범위를 정리합니다.',
  updatedAt:'2026-10-20',...evBatteryManagementCore,...evBatteryManagementOperations,
  sections:sections(['생산과 출하의 근거를 연결하는 조직','현재 목록으로 사라지는 과거 구성','투입 기록·품질 상태·출하의 책임','투입·교체·보류 확인에서 출하 기록까지','시점별 구성과 출하 준비 화면','식별 불일치와 원장 정정 운영','구성 관계 원장과 기존 시스템 연결','늦은 기록·재사용 번호·분리 투입 처리','한 제품군의 첫 범위와 장소별 확장','이력 복원과 대조 검수의 비용·일정','추적 기록과 품질·안전 판단 구분','원장 대조와 정정·복구의 운영 인수']),
  faq:[
    {question:'기존 제조 실행 시스템을 교체해야 하나요?',answer:'반드시 교체해야 하는 것은 아닙니다. 기존 시스템이 원본으로 관리하는 기록을 확인하고 다른 원장과 연결되지 않는 식별 관계나 누락된 출하 자료를 보완할 수 있습니다. 항목별 수정 권한과 원본 책임을 먼저 나눕니다.'},
    {question:'구성품을 교체하면 이전 이력도 바뀌나요?',answer:'이전 관계의 종료와 새로운 관계의 시작을 기록하면 과거 시점의 구성을 보존할 수 있습니다. 현재 부품 목록만 덮어쓰는 방식으로는 출하 당시의 상태를 설명하기 어렵습니다. 변경 사건과 확인 근거를 함께 연결하도록 설계합니다.'},
    {question:'하나의 자재 문제가 관련 제품의 불량 판정을 뜻하나요?',answer:'연결 이력은 확인 대상과 근거를 찾는 데 활용할 수 있지만 제품의 실제 품질 판단과 같지는 않습니다. 적용 범위와 필요한 조치는 책임자가 검토해야 합니다. 불명확한 관계와 누락 자료도 조회 결과에서 구분합니다.'},
    {question:'보류 해제와 출하 준비 완료는 같은 상태인가요?',answer:'품질 보류가 해제돼도 고객별 문서나 다른 준비 항목이 남아 있을 수 있습니다. 실제 업무에서 확인하는 상태와 승인 주체를 구분하고 하나의 변경으로 모든 단계를 자동 완료하지 않도록 검수합니다.'},
    {question:'과거 자료가 불완전해도 이전할 수 있나요?',answer:'자료의 확인 범위를 표시하고 연결이 불명확한 부분을 정비 대상으로 남기는 방식은 가능합니다. 없는 이력을 추측해 확정 기록으로 만들면 안 됩니다. 이전할 범위와 대조 가능한 건수·수량·상태를 먼저 합의합니다.'},
    {question:'상담을 위해 무엇을 준비하면 되나요?',answer:'현재 사용하는 자재·제품 식별자 구조와 구성 변경 예시, 보류·해제 및 출하 자료의 연결 방식을 알려 주세요. 비공개 원본 전체보다 허용된 구조 예시로 먼저 검토할 수 있습니다. 기존 시스템의 담당자와 원본 책임도 함께 확인합니다.'},
  ],
  relatedRoutes:[
    {href:'/solution/manufacturing/',label:'제조 관리 업무의 전체 범위',reason:'기존 제조 실행과 새 관리 기능의 책임을 구분합니다.'},
    {href:'/development-agency/portal/전기차배터리업체/',label:'배터리 샘플 평가 협업',reason:'생산 원장과 고객에게 공개할 평가 자료의 경계를 확인합니다.'},
    {href:'/development-agency/api-integration-development/',label:'이력 시스템 연결과 재전송',reason:'원본 책임과 중복 기록·처리 순서의 검수를 준비합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'정정과 승인 권한 점검',reason:'기록 수정과 품질·출하 승인 권한을 분리해 확인합니다.'},
    {href:'/source-handover/',label:'생산 이력 프로그램 인수',reason:'원장 대조와 오류 재처리, 복구 시 확인할 항목을 정합니다.'},
  ],
  ctaContext:'제품과 자재의 식별 구조, 구성 변경 및 보류·출하 기록의 연결 방식을 알려 주세요. 기존 원본을 존중하면서 시점별 이력을 확인할 수 있는 관리 범위를 정리합니다.',
  evidenceSources:[
    {title:'삼성SDI 자동차용 배터리 사업과 품질 이력 소개',url:'https://www.samsungsdi.com/business/automotive-battery.html',use:'배터리 사업에서 제조 이력과 품질 관리의 연결을 설명하는 공개 배경 자료입니다. 이 페이지의 원장 설계는 프로젝트별 제안이며 해당 업체의 내부 구현을 재현하거나 인증을 보장하지 않습니다.'},
    {title:'삼성SDI Cell-to-Pack 구성 설명',url:'https://news.samsungsdi.com/global/articleView?cate=B01&seq=250',use:'모든 제품을 셀·모듈·팩의 고정 단계로 가정하지 않고 실제 구성 관계를 확인해야 한다는 배경을 검토했습니다.'},
  ],
};
