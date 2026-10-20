import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { drugDevelopmentPortalCore } from './portal-core';
import { drugDevelopmentPortalOperations } from './portal-operations';

export const drugDevelopmentPortalPage: AgencyPage = {
  slug:'portal/의약품개발사',clusterIds:['ind-612-portal'],
  primaryKeyword:'의약품개발사 고객 포털 구축',
  keywordVariants:['의약품 공동 개발 협력 포털','신약 개발 자료 검토 포털','개발 프로그램 협력사 문서 공유'],
  searchIntent:'의약품 개발 협력 기관별로 승인된 자료 묶음과 문서 버전, 질문·공개 답변 및 접근 종료를 관리하기',
  industry:'의약품개발사',serviceAxis:'고객·파트너 포털',
  title:'의약품개발사 협력 포털 | 공개 자료 버전·검토 질문 관리 | 름랩',
  description:'협력 기관과 프로그램별 자료 공개 범위, 전달 버전 및 검토 질문을 연결합니다. 내부 초안과 외부 답변, 권한 만료와 기록 관리의 구축 범위를 확인하세요.',
  h1:'의약품개발사 협력 포털, 기관별 제공 자료와 검토 질문의 기준을 남깁니다',
  summary:'개발 협력 자료실에서는 문서의 최신 버전과 특정 기관에 제공한 버전이 다를 수 있습니다. 협력 목적과 참여자의 권한을 확인하고 제공 묶음·질문의 근거 자료·승인 답변을 연결해야 합니다. 름랩은 실제 협력 범위에 따라 공개 승인과 자료 전달, 검토 질문 및 접근 종료를 관리하는 포털을 설계합니다.',
  updatedAt:'2026-10-20',...drugDevelopmentPortalCore,...drugDevelopmentPortalOperations,
  sections:sections(['공동 개발·기술 검토의 자료 교환 대상','문서 버전과 협력 기관이 섞이는 문제','자료 제공·공개 승인·외부 검토 역할','승인된 자료 묶음에서 질문·답변까지','제공 문서와 질문 기준을 확인하는 화면','협력 기간·참여자·공개 대기의 운영','기관·프로그램·문서·답변의 관계','자료 오공유·버전 정정·참여자 변경','한 협력 프로그램의 첫 포털 검수','자료 이력과 외부 계정의 비용·일정','계약 범위와 접근 통제의 확인','자료 교체·접근 종료·기록 조회 인수']),
  faq:[
    {question:'로그인한 협력사는 모든 프로그램 자료를 볼 수 있나요?',answer:'협력 기관과 대상 프로그램, 검토 목적 및 공개 승인 범위에 따라 접근을 나눠야 합니다. 로그인은 신원 확인의 한 과정이며 모든 개발 자료를 열람할 권한을 뜻하지 않습니다.'},
    {question:'내부 문서를 수정하면 외부 제공본도 즉시 바뀌나요?',answer:'내부 최신본과 외부에 전달한 버전을 구분하는 것이 좋습니다. 공개 검토 후 새 묶음을 제공하고 기존 자료를 대체하는지 보완하는지 표시하면 질문과 답변의 기준을 유지할 수 있습니다.'},
    {question:'문서를 열었다는 기록을 검토 완료로 사용해도 되나요?',answer:'단순한 접근 기록과 사용자의 검토 확인은 의미가 다릅니다. 확인 버튼을 둔다면 무엇을 확인하는지 화면에 설명하고 계약상 동의나 과학적 승인으로 자동 처리하지 않아야 합니다.'},
    {question:'자료 접근을 중단하면 내려받은 파일도 회수되나요?',answer:'포털의 새 접근을 차단할 수 있어도 이미 외부에 저장된 복사본까지 삭제됐다고 보장할 수는 없습니다. 제공 이력과 영향 대상을 확인하고 실제 계약과 운영 절차에 따라 후속 조치를 담당자에게 이관해야 합니다.'},
    {question:'질문에 대한 내부 의견도 협력사에게 보이나요?',answer:'내부 검토 초안과 외부 공개 답변을 나누고 승인된 답변만 제공하도록 설계할 수 있습니다. 첨부 파일과 알림, 검색 결과에서도 같은 공개 범위가 유지되는지 함께 검수합니다.'},
    {question:'첫 구축에 필요한 자료는 무엇인가요?',answer:'대표 협력 프로그램과 제공할 자료 묶음, 참여자 역할 및 질문 처리 예시가 필요합니다. 실제 공개 승인 조건과 협력 기간, 종료 후 기록 관리 책임을 확인하면 기능과 검수 범위를 구체화할 수 있습니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/web-app-security-review-scope/',label:'기관별 문서 접근과 파일 요청 검토',reason:'화면뿐 아니라 미리보기·검색·다운로드에서 권한이 유지되는지 확인합니다.'},
    {href:'/development-agency/portal/바이오테크업체/',label:'연구 서비스 자료 제출·결과 전달',reason:'서비스 납품물 확인과 공동 개발 검토 자료 교환의 다른 책임을 비교합니다.'},
    {href:'/development-agency/website/의약품개발사/',label:'공개 프로그램 안내와 협력 문의',reason:'홈페이지에서 제공할 공개 정보와 별도 협력 공간의 자료 범위를 구분합니다.'},
    {href:'/development-agency/cms-website-development/',label:'공개 자료의 승인·버전 운영',reason:'문서 공개본과 변경 이력을 편집하는 담당자의 작업을 정리합니다.'},
    {href:'/source-handover/',label:'협력 포털 권한·기록 운영 인수',reason:'참여자 변경과 자료 정정, 접근 종료 및 이력 조회를 시험합니다.'},
  ],
  ctaContext:'협력 기관에 제공할 프로그램 자료와 참여자 역할, 질문·답변 예시를 알려 주세요. 승인된 문서 버전과 제공 범위를 추적하는 의약품개발사 협력 포털의 범위를 정리합니다.',
  evidenceSources:[
    {title:'OWASP 권한 부여 설계 안내',url:'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html',use:'로그인과 자료 접근 권한을 구분하고 필요한 범위의 권한을 요청마다 확인하는 원칙을 참고했습니다. 특정 기관의 협력 계약이나 개발 자료 공개 정책을 대신 정하지 않습니다.'},
  ],
};
