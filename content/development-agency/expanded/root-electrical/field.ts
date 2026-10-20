import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { electricalFieldCore } from './field-core';
import { electricalFieldOperations } from './field-operations';

export const electricalFieldPage: AgencyPage = {
  slug:'field/전력설비업체', clusterIds:['ind-606-field'],
  primaryKeyword:'전력설비업체 현장 관리 앱',
  keywordVariants:['전력설비 설치품 확인 앱','수배전반 현장 기록 앱','전력기기 인수 기록 개발'],
  searchIntent:'납품 현장의 전력설비 식별과 기준 자료 대조, 미완료 항목의 조치·재확인 및 인수 자료 연결을 모바일에서 기록하기',
  industry:'전력설비업체', serviceAxis:'현장·작업 관리',
  title:'전력설비업체 현장 관리 앱 | 설비 식별·미완료 항목·인수 | 름랩',
  description:'전력설비 현장 앱의 설치품 식별, 기준 도면 대조와 사진 근거, 보완 항목 재확인을 설계합니다. 오프라인 전송과 번호 불일치, 인수 자료 연결까지 개발 범위를 확인하세요.',
  h1:'전력설비업체 현장 관리 앱, 설치품과 보완 근거를 인수 기록으로 이어 줍니다',
  summary:'전력설비 현장 관리 앱은 실제 설치품의 식별 정보와 도면·문서, 사진 및 미완료 항목을 연결하는 기록 도구입니다. 조치 회신과 재확인 결과를 구분하고 통신 중단 상황에서도 전송 상태를 확인할 수 있어야 합니다. 름랩은 승인된 확인표와 현장 인계 방식을 바탕으로 기록부터 인수 자료 제출까지 범위를 설계합니다.',
  updatedAt:'2026-10-20',
  ...electricalFieldCore, ...electricalFieldOperations,
  sections:sections(['설치품을 확인하고 인수 자료를 만드는 담당자','식별 정보와 보완 사진이 분리되는 문제','현장 기록·보완·재확인 권한','대상 식별부터 미완료 항목의 종료까지','라벨 대조와 사진 근거 입력','번호 불일치·자료 누락·재확인 운영','설비·위치·문서 관계와 제작 원장 연결','라벨 중복·오프라인 충돌·기기 분실 처리','한 현장의 인수 기록과 여러 현장 확장','기기·사진·확인표가 결정하는 비용·일정','전문 작업 기준과 현장 자료의 공개 범위','실제 기기와 보완 사례로 검수하는 인수']),
  faq:[
    {question:'설비 번호를 스캔하면 대상을 바로 확정하나요?',answer:'번호 발급과 라벨 부착 기준, 기존 설비 목록의 대응 관계를 먼저 확인해야 합니다. 등록되지 않았거나 중복된 번호는 확인 요청으로 처리합니다. 잘못된 라벨의 사진과 위치 정보를 남겨 담당자가 대조할 수 있는 흐름을 검토합니다.'},
    {question:'보완 사진이 올라오면 항목이 해결된 건가요?',answer:'조치 담당자의 회신과 검토자의 재확인은 구분할 수 있습니다. 원래 발견 내용과 사진, 후속 근거를 대조한 뒤 합의한 역할이 해결 상태를 확정합니다. 사진 파일이 있다는 이유만으로 항목을 자동 종료하지 않습니다.'},
    {question:'앱으로 설비를 조작하거나 시험할 수 있나요?',answer:'이 페이지의 범위는 대상 식별과 관찰·자료 대조, 보완 및 인수 기록입니다. 설비 제어나 전기적 시험은 별도의 전문 기준과 책임, 필요한 기능을 확인해야 합니다. 기록 완료를 운전 허가나 시험 통과와 같은 의미로 표시하지 않습니다.'},
    {question:'도면과 실제 설치 위치가 다르면 어떻게 기록하나요?',answer:'확인한 차이와 대상, 관련 근거를 남겨 책임자에게 전달합니다. 앱에서 위치 값을 바꾸었다고 설계 변경과 고객 자료 갱신이 완료된 것은 아닙니다. 필요한 검토와 승인, 기준 문서 반영 상태를 각각 추적하도록 설계합니다.'},
    {question:'현장 통신이 끊겨도 사진을 남길 수 있나요?',answer:'지원 기기와 저장 공간, 필요한 오프라인 범위를 확인해 설계할 수 있습니다. 기기 저장과 서버 수신, 첨부 전송 완료를 구분하고 재전송 중복과 확인표 변경 충돌을 시험합니다. 모든 문서를 연결 없이 사용할 수 있다고 가정하지 않습니다.'},
    {question:'상담 전에 어떤 현장 자료가 필요한가요?',answer:'설비 식별 방식과 확인표 구조, 미완료 항목의 처리 및 인수 자료 형식을 알려 주세요. 고객 도면이나 현장 사진 전체를 먼저 보낼 필요는 없습니다. 제공 가능한 예시와 실제 기기·통신 조건으로 첫 범위와 검수 방법을 정리합니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/pwa-web-app-development/',label:'오프라인 현장 웹앱 범위',reason:'저장·재전송·기기별 지원 조건을 확인합니다.'},
    {href:'/solution/manufacturing/',label:'제작품과 현장 설비 연결',reason:'내부 식별자와 실제 설치품의 대응 기준을 정합니다.'},
    {href:'/development-agency/api-integration-development/',label:'인수 자료와 원장 연동',reason:'중복 전송과 문서 제출 번호의 처리 기준을 검토합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'현장 사진과 도면 접근',reason:'협력사 권한과 기기 내 자료의 통제 범위를 확인합니다.'},
    {href:'/source-handover/',label:'현장 앱 운영 인수',reason:'담당자 교체와 기기 분실, 전송 실패 대응을 준비합니다.'},
  ],
  ctaContext:'현장 설비를 식별하는 방법과 확인표, 보완 항목 및 인수 자료 처리 방식을 알려 주세요. 대상과 사진 근거를 정확히 연결하는 현장 앱 범위를 정리합니다.',
  evidenceSources:[
    {title:'Schneider Electric 전력설비 문서와 식별 정보 안내',url:'https://productinfo.se.com/esxp_digital_apps_nema/ealcm/English/BM_ESXP_DG_Electrical_Asset_Life_Cycle_Management_NEMA_0001154840.xml/$/ESXP_DG_EALCM_SD_Inputs_0001094176',use:'설비의 식별·위치와 관련 자료를 연결하는 배경을 확인합니다. 실제 현장 업무 기준은 전문 책임자의 절차로 별도 확인합니다.'},
    {title:'W3C 접근성 빠른 참조',url:'https://www.w3.org/WAI/WCAG22/quickref/',use:'모바일 입력과 상태 안내, 오류 식별 등 합의한 검수 항목을 정할 때 참고합니다.'},
  ],
};
