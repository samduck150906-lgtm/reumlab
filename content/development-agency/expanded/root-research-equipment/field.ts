import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { researchEquipmentFieldCore } from './field-core';
import { researchEquipmentFieldOperations } from './field-operations';

export const researchEquipmentFieldPage: AgencyPage = {
  slug:'field/연구장비업체',clusterIds:['ind-614-field'],
  primaryKeyword:'연구장비업체 현장 관리 앱',
  keywordVariants:['연구 장비 설치 현장 앱','분석 장비 방문 작업 기록','실험 장비 설치 준비 확인 앱'],
  searchIntent:'방문 대상 장비와 지시 버전을 확인하고 현장 준비의 근거·실제 수행 범위·고객 확인·오프라인 전송 및 후속 조치를 기록하기',
  industry:'연구장비업체',serviceAxis:'현장·작업 관리',
  title:'연구장비업체 현장 앱 | 자산 확인·설치 기록·후속 인계 | 름랩',
  description:'고객 사전 응답과 현장 관찰, 미확인 조건을 구분합니다. 장비 식별·작업 지시 버전·부분 수행·고객 확인 및 오프라인 전송의 개발 범위를 확인하세요.',
  h1:'연구장비업체 현장 앱, 대상 장비와 실제 작업·남은 확인을 기록합니다',
  summary:'장비 설치 현장에서는 고객의 사전 설명과 담당자의 관찰, 실제 수행 범위 및 남은 확인을 구분해야 합니다. 름랩은 자산과 지시 버전에 맞는 준비·작업 기록, 고객에게 전달할 결과 및 오프라인 전송 상태가 이어지는 현장 앱을 설계합니다.',
  updatedAt:'2026-10-21',...researchEquipmentFieldCore,...researchEquipmentFieldOperations,
  sections:sections(['배정된 장비와 방문 범위를 확인하는 현장 담당자','사전 응답·실제 관찰·전송 완료의 혼동','배정·작업·기술 검토·고객 확인 역할','지시 확인에서 실제 수행과 후속 인계까지','근거가 표시된 현장 기록과 고객 확인 화면','양식·촬영 제한·정정·미결의 운영','방문·자산·지시·자료·전송의 관계','오배정·촬영 금지·오프라인 지시 충돌','대표 장비 방문과 통신 제한의 첫 검수','현장 기록과 오프라인 처리의 비용·일정','전문 판단과 현장 자료 수집 범위 확인','부분 작업·정정·기기 종료의 운영 인수']),
  faq:[
    {question:'고객이 준비 완료라고 답하면 현장 확인도 완료로 표시하나요?',answer:'사전 응답과 담당자의 실제 관찰은 구분하는 것이 좋습니다. 직접 확인한 내용과 고객의 설명, 아직 확인하지 못한 조건을 각각 남기고 차이가 있으면 실제 책임자에게 다음 조치를 확인하도록 구성합니다.'},
    {question:'장비의 제조번호를 현장에서 확인하지 못하면 어떻게 하나요?',answer:'모델 이름만으로 자산을 확정하기보다 확인하지 못한 사유와 대체 확인 자료를 남길 수 있습니다. 실제 대상이 맞는지 담당자가 검토한 뒤 기록을 연결하고 다른 고객 장비에 결과가 등록되지 않도록 검수해야 합니다.'},
    {question:'연구실에서 사진을 찍을 수 없어도 사용할 수 있나요?',answer:'고객 시설의 허용 범위에 맞춰 사진이 없는 확인과 대체 증빙을 지원할 수 있습니다. 사진을 필수로 강요하거나 비공개 실험 자료가 포함된 촬영을 기본 절차로 두지 않고 승인된 기록 기준을 정합니다.'},
    {question:'오프라인에서 저장하면 사무실에도 즉시 완료로 보이나요?',answer:'기기 저장과 서버 반영은 다른 상태입니다. 전송 대기와 실패·재전송을 표시하고 다시 연결했을 때 지시 변경이나 중복 기록을 확인한 뒤 서버의 실제 상태를 기준으로 후속 업무를 처리하도록 설계합니다.'},
    {question:'고객 서명을 받으면 장비 성능 검증도 끝난 건가요?',answer:'서명과 확인의 의미는 대상 자료와 실제 계약·업무 절차에 따라 정해야 합니다. 설명을 받았다는 확인과 계약상 인수, 전문적인 성능 검증을 구분하고 앱의 서명만으로 모든 요건을 충족했다고 판정하지 않습니다.'},
    {question:'작업 지시가 현장에서 바뀌면 기존 기록은 어떻게 하나요?',answer:'적용한 지시 버전과 변경 요청·승인, 실제 수행한 범위를 연결하는 방식이 좋습니다. 오프라인으로 작성한 기록과 새 지시가 다르면 차이를 보여 주고 담당자가 검토하도록 하며 이전 결과를 조용히 덮어쓰지 않습니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/management/연구장비업체/',label:'장비 공급과 설치 이행 원장',reason:'방문에서 확인한 자산과 부분 작업을 원래 주문·설치 미결과 연결합니다.'},
    {href:'/development-agency/portal/연구장비업체/',label:'고객에게 전달할 장비별 지원 결과',reason:'내부 작업 기록 중 공개가 승인된 결과와 남은 확인을 고객 공간에 전달합니다.'},
    {href:'/development-agency/pwa-web-app-development/',label:'현장 앱의 브라우저·기기 지원 범위',reason:'PWA의 오프라인 한계와 설치·갱신, 실제 현장 기기의 검수 범위를 비교합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'현장·장비·외부 담당자의 접근 범위',reason:'촬영 자료와 고객 자산을 작업과 역할에 맞춰 열람하도록 검수합니다.'},
    {href:'/source-handover/',label:'현장 앱과 후속 인계의 운영 인수',reason:'부분 작업과 기기 분실, 양식 개정 및 결과 정정을 실제 담당자가 처리해 봅니다.'},
  ],
  ctaContext:'대표 장비의 작업 지시와 설치 준비 안내, 현장 기록 및 고객 확인 절차를 알려 주세요. 실제 자산과 지시 버전을 기준으로 작업·미확인·후속 조치가 이어지는 앱 범위를 정리합니다.',
  evidenceSources:[
    {title:'Agilent 장비 설치 전 현장 준비 안내',url:'https://www.agilent.com/en/s/installation-relocation-services/site-preparation',use:'현장 준비 확인과 장비 설치 작업을 구분하는 배경을 참고했습니다. 실제 체크 항목과 판단 기준은 해당 장비의 승인된 문서 및 전문 담당자의 검토가 필요합니다.'},
    {title:'Agilent 장비 설치 서비스 안내',url:'https://www.agilent.com/en/s/installation-relocation-services/instrument-installation',use:'설치·확인·교육의 업무 범위가 다르다는 배경 자료입니다. 앱 기록과 고객 확인을 제조사 인증이나 전문 검증의 대체 근거로 사용하지 않습니다.'},
  ],
};
