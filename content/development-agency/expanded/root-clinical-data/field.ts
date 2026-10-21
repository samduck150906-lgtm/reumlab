import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { clinicalDataFieldCore } from './field-core';
import { clinicalDataFieldOperations } from './field-operations';

export const clinicalDataFieldPage: AgencyPage = {
  slug:'field/임상데이터업체',clusterIds:['ind-613-field'],
  primaryKeyword:'임상데이터업체 현장 관리 앱',
  keywordVariants:['연구 양식 현장 입력 앱','임상 데이터 수집 양식 관리','연구 기록 모바일 정정 관리'],
  searchIntent:'승인된 연구 양식과 실제 기록 사건을 연결해 허용된 항목·미수집 사유·입력 검토·정정 및 전송 상태를 관리하기',
  industry:'임상데이터업체',serviceAxis:'현장·작업 관리',
  title:'임상데이터업체 현장 앱 | 양식 버전·사건·입력 검토 | 름랩',
  description:'연구 양식의 승인 버전과 실제 사건, 입력값과 미수집 사유를 연결합니다. 전송 대기·검토·정정 이력 및 원본 책임을 구분하는 현장 앱 범위를 확인하세요.',
  h1:'임상데이터업체 현장 앱, 어떤 양식과 사건으로 기록했는지 남깁니다',
  summary:'현장 기록은 값뿐 아니라 양식의 버전과 실제 사건, 미수집 이유 및 정정 근거를 연결해야 의미가 유지됩니다. 기기 저장과 서버 접수, 형식 확인과 전문 판단도 구분해야 합니다. 름랩은 실제 연구의 수집 계획과 원본 책임을 확인해 승인된 양식의 입력·검토·정정 및 전송 상태를 관리하는 앱을 설계합니다.',
  updatedAt:'2026-10-20',...clinicalDataFieldCore,...clinicalDataFieldOperations,
  sections:sections(['승인된 연구 양식으로 자료를 기록하는 담당자','사건·미수집·정정 의미가 섞이는 문제','양식 승인·입력·검토·원본 책임','양식 배정에서 입력·접수·정정까지','단위와 미수집 이유·전송 상태의 화면','양식 개정과 기관·기기 접근 운영','사건·항목 버전·응답·수정 기록의 관계','반복 사건·시각 차이·동기화 충돌','대표 양식과 시험 자료의 첫 검수','오프라인·원본 연결·검증의 비용·일정','연구 수집과 전자 기록의 적용 범위','양식 개정·재전송·정정 절차 인수']),
  faq:[
    {question:'현장 앱의 기록이 원본 데이터가 되나요?',answer:'앱에서 직접 수집하는 원본인지 기존 원본의 전사본인지 사용 목적에 따라 다릅니다. 기록의 책임과 확인·정정 절차를 먼저 정하고 다른 시스템과의 관계를 설계해야 합니다.'},
    {question:'값을 입력하지 않은 항목은 어떻게 처리하나요?',answer:'미수집과 알 수 없음, 해당 없음 또는 작성 중의 의미가 다를 수 있습니다. 승인된 항목 정의와 허용 사유를 사용하고 빈칸을 영이나 다른 값으로 임의 변환하지 않도록 구성합니다.'},
    {question:'양식이 바뀌면 작성 중인 기록도 새 양식이 되나요?',answer:'어떤 기록에 새 버전을 적용할지 먼저 정해야 합니다. 과거 양식의 질문과 선택값 의미를 보존하고 이미 작성한 기록을 새로운 의미로 자동 변환하지 않도록 해야 합니다.'},
    {question:'오프라인 입력은 안전하게 사용할 수 있나요?',answer:'실제 필요성과 기기 내 저장 범위, 접근 및 보존 조건을 확인한 뒤 적용해야 합니다. 전송 대기·접수와 버전 충돌, 중복 전송 및 기기 분실 대응까지 검수해야 합니다.'},
    {question:'입력 오류 검사가 정상 결과를 뜻하나요?',answer:'형식이나 완결성 검사의 통과는 임상적 정상 또는 전문 판단의 완료를 의미하지 않습니다. 화면의 알림과 검토 절차에서 그 책임을 명확히 구분해야 합니다.'},
    {question:'일반 모바일 설문을 그대로 사용할 수 있나요?',answer:'실제 연구 목적에 필요한 원본 책임과 정정 이력, 접근·보존 및 검증 요구를 확인해야 합니다. 사용 환경에 적합한지 평가하고 부족한 운영·검수 범위를 정한 뒤 선택하는 것이 좋습니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/management/임상데이터업체/',label:'입력 자료의 규칙 검사와 질의 추적',reason:'현장 기록과 원본 반영 확인, 질의 종료의 후속 책임을 연결합니다.'},
    {href:'/development-agency/portal/임상데이터업체/',label:'연구 자료 전달과 인수 상태',reason:'현장 수집과 고객의 파일 전달·인수의 다른 단계를 비교합니다.'},
    {href:'/development-agency/field/의약품개발사/',label:'협력기관 방문의 사실·미확인 기록',reason:'방문 후속 관리와 연구 양식의 실제 데이터 수집을 구분합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'현장 기기와 연구별 접근 확인',reason:'양식·기록·정정·기기 저장의 허용 범위를 검수합니다.'},
    {href:'/source-handover/',label:'연구 입력 앱의 운영 인수',reason:'양식 개정과 정정, 동기화 충돌 및 접근 종료를 시험합니다.'},
  ],
  ctaContext:'승인된 연구 양식과 실제 기록 사건, 원본의 책임 및 사용할 기기 환경을 알려 주세요. 입력과 미수집·정정의 의미를 유지하는 현장 앱 범위를 정리합니다.',
  evidenceSources:[
    {title:'미국 FDA 전자 원자료 관리 안내',url:'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/electronic-source-data-clinical-investigations',use:'전자 원자료의 수집·검토·보존과 추적 관계를 확인해야 한다는 배경을 참고했습니다. 개별 연구의 적용 요구나 원본 책임은 실제 사용 목적에 맞춰 전문 담당자가 정해야 합니다.'},
  ],
};
