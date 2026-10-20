import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { biotechFieldCore } from './field-core';
import { biotechFieldOperations } from './field-operations';

export const biotechFieldPage: AgencyPage = {
  slug:'field/바이오테크업체',clusterIds:['ind-611-field'],
  primaryKeyword:'바이오테크업체 현장 관리 앱',
  keywordVariants:['연구 시료 인수인계 기록 앱','시료 수령 대조 모바일 앱','연구 현장 식별 불일치 기록'],
  searchIntent:'연구용 시료의 인계 예정 목록과 실제 수령 식별·수량·서류를 대조하고 불일치 및 정정 근거를 원장에 연결하기',
  industry:'바이오테크업체',serviceAxis:'현장·작업 관리',
  title:'바이오테크업체 현장 관리 앱 | 시료 인계·수령·불일치 기록 | 름랩',
  description:'연구 시료의 예정 목록과 실제 수령 식별·수량·서류를 구분합니다. 부분 수령, 정정 근거, 미전송 기록과 책임자 검토의 관리 범위를 확인하세요.',
  h1:'바이오테크업체 현장 앱, 예정 시료와 실제 수령의 차이를 기록합니다',
  summary:'바이오테크 현장 앱은 승인된 인수인계 절차에서 시료의 예정 목록과 실제 수령, 관련 서류 및 불일치를 기록하도록 설계할 수 있습니다. 접수된 상태와 연구에 사용할 수 있는 상태는 구분해야 합니다. 름랩은 식별 체계와 책임자 검토, 원장 연동을 확인해 실제 사건과 정정 근거를 보존하는 앱 범위를 정리합니다.',
  updatedAt:'2026-10-20',...biotechFieldCore,...biotechFieldOperations,
  sections:sections(['연구 시료의 실제 인계를 확인하는 담당자','예정 수량과 실제 수령·승인의 혼동','인계·수령·불일치 검토의 역할','목록 대조에서 보완·결정·원장 반영까지','미확인 식별과 실제 사건을 남기는 화면','부분 수신과 서류·검토 대기의 운영','인계 건·수신 사건·정정 근거 연결','추가 도착·중복 식별·지연 입력 처리','한 인계 유형의 첫 앱과 기관 연결 확장','식별 대조와 연동 검수의 비용·일정','시료 취급과 자료 접근의 책임 구분','정정과 미전송 기록의 운영 인수']),
  faq:[
    {question:'시료를 접수하면 바로 연구 사용 가능으로 표시하나요?',answer:'접수 기록과 사용 가능 여부는 다른 상태입니다. 기관이 정한 검토와 승인 절차를 확인하고 책임자가 결정한 범위만 반영해야 합니다. 앱의 수신 완료 표시가 품질이나 연구 사용을 승인하지 않도록 설계합니다.'},
    {question:'예정 수량보다 적게 도착하면 어떻게 기록하나요?',answer:'예정 목록과 실제 확인한 수량을 따로 보존하고 부분 수령 및 남은 확인 항목을 기록할 수 있습니다. 추가로 도착한 물량도 별도 사건으로 연결해 실제 합계의 근거를 확인할 수 있게 합니다.'},
    {question:'표식이 읽히지 않으면 번호를 추정해 입력하나요?',answer:'추측으로 식별자를 확정하지 않는 것이 좋습니다. 확인한 표기와 미확인 상태, 보완 요청을 남기고 기관의 책임자가 근거를 확인해 정정하는 흐름을 마련합니다.'},
    {question:'통신이 끊긴 현장에서도 기록할 수 있나요?',answer:'허용되는 자료와 기기 보관 조건을 확인한 뒤 오프라인 입력 범위를 설계할 수 있습니다. 기기 초안과 서버 반영을 구분하고 복구 후 중복이나 누락, 정정 충돌이 없는지 검수해야 합니다.'},
    {question:'앱에서 시료 취급 방법도 안내하나요?',answer:'이 페이지는 승인된 절차에 필요한 인계와 수신 기록의 범위입니다. 실제 취급과 운송, 안전 및 품질 판단은 기관의 해당 책임자가 정한 절차에 따라야 합니다. 앱 제작이 그 절차의 적합성을 인증하는 것은 아닙니다.'},
    {question:'범위를 정하려면 어떤 자료가 필요한가요?',answer:'기관이 승인한 인계 양식과 식별 체계, 실제 수령·불일치·정정의 처리 흐름이 도움이 됩니다. 개인정보나 민감한 자료는 필요한 범위로 줄이고 기록 역할과 상태 정의부터 확인할 수 있습니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/portal/바이오테크업체/',label:'연구 의뢰 자료와 보완 요청 포털',reason:'고객 제출 자료와 현장에서 확인한 실제 수신을 구분합니다.'},
    {href:'/development-agency/management/바이오테크업체/',label:'연구 과제 검토와 결정 근거',reason:'현장 기록을 연구 검토의 자료로 연결할 때 원본과 책임을 보존합니다.'},
    {href:'/development-agency/api-integration-development/',label:'현장 확인과 시료 원장 연결',reason:'전송 성공과 원장 반영, 정정·중복 처리의 기준을 확인합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'시료 관련 정보와 모바일 접근 검수',reason:'기관별 자료 범위와 개인정보, 기기 내 초안의 접근을 점검합니다.'},
    {href:'/source-handover/',label:'인수인계 기록 앱의 운영 인수',reason:'부분 수신과 식별 정정, 통신 복구의 처리 근거를 전달합니다.'},
  ],
  ctaContext:'승인된 시료 인계 양식과 식별 체계, 실제 수령 대조 및 불일치 검토 절차를 알려 주세요. 사건과 정정 근거를 원장에 연결하는 현장 앱 범위를 정리합니다.',
  evidenceSources:[
    {title:'NCI 생물자원 관리 모범 사례 안내',url:'https://dctd.cancer.gov/data-tools-biospecimens/biospecimens-biobanks/resources/best-practices/biospecimen-resources',use:'생물자원 관리에서 자료 접근과 책임, 운영 기록을 함께 검토하는 배경을 참고했습니다. 모든 시료나 국내 기관에 같은 절차가 적용된다는 의미가 아니며 실제 취급·사용 기준은 해당 기관이 확인해야 합니다.'},
    {title:'W3C 웹 콘텐츠 접근성 기준 안내',url:'https://www.w3.org/WAI/WCAG22/quickref/',use:'현장 입력의 오류와 미확인 상태, 전송 결과를 명확히 인식하고 검토할 수 있는 화면 기준을 참고합니다.'},
  ],
};
