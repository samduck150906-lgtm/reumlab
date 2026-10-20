import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { drugDevelopmentFieldCore } from './field-core';
import { drugDevelopmentFieldOperations } from './field-operations';

export const drugDevelopmentFieldPage: AgencyPage = {
  slug:'field/의약품개발사',clusterIds:['ind-612-field'],
  primaryKeyword:'의약품개발사 현장관리 앱 개발',
  keywordVariants:['개발 협력기관 방문 관리 앱','의약품 개발 방문 후속 조치 관리','협력기관 현장 확인 기록 앱'],
  searchIntent:'개발 협력기관 방문의 승인된 확인 범위와 실제 사실·미확인 사유를 기록하고 보완 자료와 후속 검토를 연결하기',
  industry:'의약품개발사',serviceAxis:'현장·작업 관리',
  title:'의약품개발사 현장관리 앱 | 협력기관 방문·후속 확인 | 름랩',
  description:'개발 협력기관의 방문 계획과 실제 확인 수준, 자료 버전 및 미확인 항목을 구분합니다. 촬영 제한·전송 대기·보완 자료 검토를 연결하는 앱 범위를 확인하세요.',
  h1:'의약품개발사 현장관리 앱, 방문에서 확인한 사실과 남은 조건을 구분합니다',
  summary:'협력기관 방문을 마쳤다는 사실이 모든 준비 조건의 충족을 뜻하지는 않습니다. 실제 관찰과 담당자 설명, 문서 검토 및 확인 불가를 나누고 나중에 받은 자료를 원래 방문 항목에 연결해야 합니다. 름랩은 승인된 확인 범위와 자료 수집 제한을 반영해 방문 기록·내부 검토·후속 요청을 관리하는 앱을 설계합니다.',
  updatedAt:'2026-10-20',...drugDevelopmentFieldCore,...drugDevelopmentFieldOperations,
  sections:sections(['개발 협력기관을 방문하는 실무 담당자','방문 완료와 조건 충족이 섞이는 문제','계획·현장 기록·내부 검토·후속 책임','방문 준비에서 보완 자료 확인까지','실제 확인 수준과 전송 상태를 읽는 화면','양식 버전·기록 공개·후속 기한 운영','방문 항목·근거·보완 자료의 연결','촬영 제한·자료 변경·기록 충돌 처리','대표 방문의 사실 기록과 후속 검수','현장 제약과 자료 연동의 비용·일정','열람·촬영·반출과 전문 판단의 범위','미확인 이관·재전송·기기 접근 인수']),
  faq:[
    {question:'방문을 마치면 확인 항목도 자동 완료되나요?',answer:'일정상의 방문 완료와 각 조건의 확인은 구분하는 것이 좋습니다. 확인하지 못한 항목은 이유와 후속 담당자를 남기고 보완 자료가 도착한 뒤 검토자가 종료 여부를 판단하도록 구성할 수 있습니다.'},
    {question:'사진 촬영이 금지된 기관에서는 기록할 수 없나요?',answer:'허용된 문서 식별과 버전, 확인 방법 및 담당자 설명 등 사진 이외의 근거를 기록하도록 설계할 수 있습니다. 기관이 허용한 열람과 반출 범위를 먼저 확인해야 합니다.'},
    {question:'임상 모니터링과 제조 품질 감사도 이 앱으로 처리하나요?',answer:'이 페이지는 개발 협력 방문의 자료 확인과 후속 업무를 설명합니다. 전문 모니터링이나 품질 판정에 사용하려면 해당 목적의 요구와 기록·검증 책임을 별도로 검토해야 합니다.'},
    {question:'방문 후 받은 자료를 현장 기록에 추가할 수 있나요?',answer:'보완 자료를 원래 항목에 연결할 수 있지만 당시 현장에서 확인한 사실과 구분해 남겨야 합니다. 자료의 도착 시점과 검토 결과를 따로 기록하면 확인 수준의 변화를 추적하기 쉽습니다.'},
    {question:'통신이 끊겨도 기록이 보존되나요?',answer:'허용된 자료 범위에 한해 기기 내 임시 저장을 검토할 수 있습니다. 전송 대기와 서버 접수 완료를 명확히 구분하고 재전송·충돌 처리 및 기기 내 자료 정리까지 검수해야 합니다.'},
    {question:'방문 양식이 바뀌면 과거 기록도 새 양식으로 바뀌나요?',answer:'과거 방문에서 어떤 질문과 기준으로 확인했는지 유지하는 것이 중요합니다. 새 양식은 이후 방문에 적용하고 과거 기록의 질문·응답 의미가 달라지지 않도록 버전을 관리할 수 있습니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/management/의약품개발사/',label:'문서 준비와 선행 작업의 상태 관리',reason:'방문 후 확인할 자료와 내부 제출 준비 작업의 관계를 정리합니다.'},
    {href:'/development-agency/portal/의약품개발사/',label:'협력기관 보완 자료와 공개 답변',reason:'내부 메모를 제외한 승인 요청과 외부 자료 제공 범위를 연결합니다.'},
    {href:'/development-agency/field/바이오테크업체/',label:'연구 시료의 인계·수령 기록',reason:'방문 항목 확인과 실제 시료 인계 기록의 다른 데이터와 책임을 비교합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'현장 기기와 첨부 자료 접근 검토',reason:'기기 내 저장과 파일 요청, 외부 공유의 허용 범위를 확인합니다.'},
    {href:'/source-handover/',label:'현장 방문 앱의 운영 인수',reason:'기록 충돌·전송 실패·접근 종료와 후속 조치 이관을 시험합니다.'},
  ],
  ctaContext:'협력기관 방문의 확인 목록과 허용된 근거, 미확인 사례 및 후속 자료 요청 흐름을 알려 주세요. 실제 확인 수준과 남은 책임을 구분하는 현장관리 앱 범위를 정리합니다.',
  evidenceSources:[
    {title:'OWASP 자료 접근 권한 설계 안내',url:'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html',use:'역할과 자료별 접근을 제한하는 일반 보안 원칙을 참고했습니다. 협력기관의 촬영·반출 허용과 전문 현장 업무의 판단 기준은 실제 계약과 담당자의 검토로 정해야 합니다.'},
  ],
};
