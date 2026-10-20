import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { electricalPortalCore } from './portal-core';
import { electricalPortalOperations } from './portal-operations';

export const electricalPortalPage: AgencyPage = {
  slug:'portal/전력설비업체', clusterIds:['ind-606-portal'],
  primaryKeyword:'전력설비업체 고객 포털 개발',
  keywordVariants:['전력설비 도면 제출 포털','수배전반 고객 검토 포털','전력기기 납품 문서 포털'],
  searchIntent:'전력설비 도면과 제출 묶음의 개정별 고객 검토·보완·회신을 연결하고 납품 문서 인수까지 전달 근거를 관리하기',
  industry:'전력설비업체', serviceAxis:'고객·파트너 포털',
  title:'전력설비업체 고객 포털 개발 | 도면 제출·검토 회신·보완 | 름랩',
  description:'전력설비 고객 포털의 제출 묶음, 도면 개정과 의견 연결, 보완 후 재제출 흐름을 설계합니다. 열람과 승인 상태의 구분, 프로젝트별 권한 및 납품 자료 인수를 확인하세요.',
  h1:'전력설비업체 고객 포털 개발, 제출한 도면과 검토 회신을 연결합니다',
  summary:'전력설비 고객 포털은 어떤 개정의 도면을 누구에게 전달했고 어떤 의견이 회신되었는지 추적하는 업무 공간입니다. 제출 묶음과 개별 문서 상태를 구분하고 보완과 재제출이 이전 의견에 연결되도록 해야 합니다. 름랩은 실제 제출 목록과 고객 회신 체계를 확인해 문서 전달부터 인수까지 포털 범위를 설계합니다.',
  updatedAt:'2026-10-20',
  ...electricalPortalCore, ...electricalPortalOperations,
  sections:sections(['도면을 제출하고 회신하는 프로젝트 참여자','서로 다른 개정본으로 진행되는 검토 문제','제출·고객 검토·회신 확정 권한','제출 묶음에서 보완 후 재제출까지','도면 위치와 의견을 연결하는 화면','미회신과 일부 보완 항목의 운영 관리','문서 개정 관계와 기존 도구 연결','잘못된 제출·회수·대형 파일 실패 처리','한 프로젝트 검토 흐름의 첫 범위','고객 회신 방식에 따른 비용·일정','도면 공개와 승인 상태의 의미 확인','최종 문서 인수와 프로젝트 종료']),
  faq:[
    {question:'파일을 열어 보면 승인 상태가 되나요?',answer:'열람과 기술 검토 회신, 계약상 승인은 서로 다른 의미입니다. 포털에서는 각 상태를 구분하고 누가 어떤 조건으로 상태를 바꿀 수 있는지 정합니다. 파일을 열어 본 기록만으로 제작이나 납품 승인을 자동 확정하지 않습니다.'},
    {question:'도면에 남긴 의견은 새 개정본으로 옮겨지나요?',answer:'의견을 남긴 원래 개정본과 위치를 보존하고 새 개정에서의 반영 결과를 별도로 연결하는 방식을 검토합니다. 파일 위치가 달라지면 좌표를 그대로 옮기는 것이 맞지 않을 수 있습니다. 담당자가 이전 의견과 새 내용을 대조할 수 있어야 합니다.'},
    {question:'제출한 파일을 잘못 올렸을 때 삭제하면 되나요?',answer:'이미 전달한 사실과 회수·재제출 사유를 어떻게 남길지 운영 기준을 정해야 합니다. 받은 사람이 어떤 파일을 확인했는지와 새 자료를 전달할 대상을 구분합니다. 기록 없이 파일만 바꾸면 과거 회신의 기준을 확인하기 어려울 수 있습니다.'},
    {question:'고객마다 다른 회신 코드를 사용할 수 있나요?',answer:'고객의 실제 회신 예시를 확인해 프로젝트별 코드와 상태 전환을 설계할 수 있습니다. 이름이 비슷해도 승인 의미가 같다고 가정하지 않습니다. 코드 추가가 진행 중인 다른 프로젝트의 상태를 바꾸지 않는지도 검수해야 합니다.'},
    {question:'큰 도면 파일도 웹에서 검토할 수 있나요?',answer:'파일 형식과 크기, 필요한 확대·위치 표시 기능 및 실제 기기를 확인해야 합니다. 변환 화면에서 원문이 정확히 보이는지 시험하고 원본으로 확인할 경로를 제공합니다. 지원 조건과 저장·전송 비용은 개발 범위에 명시합니다.'},
    {question:'상담 전에 고객 도면 전체를 보내야 하나요?',answer:'먼저 제출 목록의 구조, 문서 번호와 개정 규칙, 회신 상태 및 참여 역할을 알려 주세요. 비공개 도면 전체가 처음부터 필요하지는 않습니다. 사용 가능한 예시와 전달 권한을 정한 뒤 화면과 검수 범위를 확인합니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/api-integration-development/',label:'기존 문서 도구 연결',reason:'원본 식별자와 제출 이력을 대조할 연동 규칙을 정합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'프로젝트 자료 접근 검수',reason:'외부 검토자의 초대·변경·종료 조건을 확인합니다.'},
    {href:'/erp/',label:'제작·납품 관리 연결',reason:'고객 회신과 내부 업무 상태의 연결 범위를 검토합니다.'},
    {href:'/solution/manufacturing/',label:'설비와 문서 기준 데이터',reason:'설비 식별자와 문서 적용 관계를 정리합니다.'},
    {href:'/source-handover/',label:'문서 운영과 계정 인수',reason:'프로젝트 종료와 운영 담당자 변경 절차를 준비합니다.'},
  ],
  ctaContext:'실제 도면 제출 목록과 고객 회신 상태, 보완·재제출 처리 방식을 알려 주세요. 전달한 개정본과 검토 의견을 추적할 수 있는 고객 포털 범위를 정리합니다.',
  evidenceSources:[
    {title:'Schneider Electric 단선도 정보 유지 안내',url:'https://www.se.com/ww/en/download/document/22105261/',use:'전력설비 도면 정보의 정확성과 유지 관리가 필요하다는 배경을 확인합니다. 포털 구현이나 특정 프로젝트의 승인을 의미하지 않습니다.'},
    {title:'OWASP 애플리케이션 보안 검증 표준',url:'https://owasp.org/www-project-application-security-verification-standard/',use:'프로젝트별 접근 권한과 파일 제공의 검수 항목을 정할 때 참고합니다.'},
  ],
};
