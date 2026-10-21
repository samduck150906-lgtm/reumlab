import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { clinicalDataPortalCore } from './portal-core';
import { clinicalDataPortalOperations } from './portal-operations';

export const clinicalDataPortalPage: AgencyPage = {
  slug:'portal/임상데이터업체',clusterIds:['ind-613-portal'],
  primaryKeyword:'임상데이터업체 고객 포털 개발',
  keywordVariants:['연구 데이터 전달 고객 포털','임상 데이터 결과물 인수 포털','데이터 파일 명세 보완 요청 관리'],
  searchIntent:'연구별 데이터 전달 명세와 파일 버전·보완 요청을 연결하고 전송·전문 검토·결과물 인수 상태를 고객과 함께 관리하기',
  industry:'임상데이터업체',serviceAxis:'고객·파트너 포털',
  title:'임상데이터업체 고객 포털 | 자료 명세·보완·결과물 인수 | 름랩',
  description:'프로젝트별 자료 기준일과 파일 명세, 전달 버전 및 보완 요청을 연결합니다. 전송 성공·전문 검토·고객 인수를 구분하는 데이터 업무 포털 범위를 확인하세요.',
  h1:'임상데이터업체 고객 포털, 전달한 파일과 검토·인수 상태를 함께 추적합니다',
  summary:'연구 자료를 올렸다는 사실만으로 검토와 인수가 끝난 것은 아닙니다. 전달 목적과 기준일, 파일 명세 및 버전을 연결하고 누락·보완·결과물 확인의 책임을 구분해야 합니다. 름랩은 허용된 자료 처리 범위 안에서 고객의 전달 건과 업체의 검토 의견, 보완본 및 결과물 인수를 관리하는 포털을 설계합니다.',
  updatedAt:'2026-10-20',...clinicalDataPortalCore,...clinicalDataPortalOperations,
  sections:sections(['연구 자료를 전달하고 결과를 인수하는 고객','업로드 완료와 자료 수용이 섞이는 문제','전달 승인·접수·전문 검토·인수 역할','자료 명세에서 보완과 결과물 확인까지','파일 구성과 처리 단계를 읽는 화면','누락·검토 대기·고객 확인의 운영','전달 묶음·파일 버전·결과물의 관계','중복 전송·기준일 차이·오전달 처리','대표 프로젝트의 첫 자료 교환 검수','전송 환경과 검토 이력의 비용·일정','연구별 자료 접근과 수탁 범위 확인','보완본·인수·접근 종료의 운영 인수']),
  faq:[
    {question:'파일 업로드가 끝나면 접수 완료인가요?',answer:'전송 성공과 명세 확인, 전문 검토 및 자료 인수는 각각 다른 상태로 관리하는 것이 좋습니다. 고객에게 현재 처리 단계와 필요한 다음 행동을 명확히 표시해야 합니다.'},
    {question:'같은 이름의 파일을 다시 올리면 이전 파일이 사라지나요?',answer:'파일 이름만으로 대체 여부를 결정하지 않고 전달 묶음의 버전과 교체·추가 관계를 남길 수 있습니다. 이미 사용한 자료가 있다면 후속 결과물에 미치는 영향을 담당자가 확인하도록 구성합니다.'},
    {question:'보완 자료를 보내면 검토 의견도 자동 종료되나요?',answer:'자료 도착과 검토 의견의 해결은 다릅니다. 보완본을 해당 의견에 연결한 뒤 검토자가 조건이 충족됐는지 확인하고 종료하도록 설계할 수 있습니다.'},
    {question:'고객이 결과물을 내려받으면 인수한 것으로 보나요?',answer:'다운로드 기록과 합의된 인수 조건의 확인을 구분해야 합니다. 확인 버튼의 의미와 대상 자료 버전을 명확히 하고 실제 계약과 업무 절차에 맞춰 인수 책임을 정합니다.'},
    {question:'기존 파일 전송 도구를 계속 사용할 수 있나요?',answer:'전달 건과 실제 수신 파일을 안정적으로 연결할 수 있다면 기존 환경을 유지하면서 명세와 검토 의견, 인수 상태를 관리하는 포털을 구성할 수 있습니다. 지원 형식과 용량, 접근 조건은 실제로 확인해야 합니다.'},
    {question:'실제 연구 데이터 없이 먼저 검수할 수 있나요?',answer:'적절한 시험 데이터로 누락·중복·보완 및 권한 흐름을 먼저 검수할 수 있습니다. 실제 운영 자료를 처리하기 전에는 제공 권한과 수탁 범위, 보존·전송 조건을 별도로 확인해야 합니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/website/임상데이터업체/',label:'데이터 서비스의 입력·산출물 안내',reason:'초기 상담의 공개 정보와 실제 프로젝트 자료 교환의 경계를 정합니다.'},
    {href:'/development-agency/portal/의약품개발사/',label:'개발 협력 자료의 공개 버전·질문 관리',reason:'협력 검토 자료실과 처리할 데이터 전달·결과물 인수의 차이를 비교합니다.'},
    {href:'/development-agency/management/의약품개발사/',label:'문서 준비와 전달 묶음의 검토 책임',reason:'자료 준비 상태와 실제 전달·접수의 다른 확인 조건을 살펴봅니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'연구별 파일·알림·검색 권한 검토',reason:'전달 파일뿐 아니라 검토 의견과 미리보기에서도 접근 범위를 유지합니다.'},
    {href:'/source-handover/',label:'자료 교환 포털 운영 인수',reason:'누락 파일과 보완본, 인수 확인 및 접근 종료를 실제로 처리해 봅니다.'},
  ],
  ctaContext:'대표 프로젝트의 자료 전달 명세와 기준일, 보완 요청 및 결과물 인수 조건을 알려 주세요. 전달 버전과 검토 상태를 함께 확인하는 임상데이터업체 고객 포털 범위를 정리합니다.',
  evidenceSources:[
    {title:'OWASP 자료별 접근 권한 설계 안내',url:'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html',use:'사용자와 자료의 관계에 맞는 최소 권한과 요청별 접근 확인 원칙을 참고했습니다. 임상 데이터 제공·수탁의 계약 조건이나 전문 검토 기준을 대신 정하지 않습니다.'},
  ],
};
