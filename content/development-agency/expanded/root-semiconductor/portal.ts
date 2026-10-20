import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { semiconductorPortalCore } from './portal-core';
import { semiconductorPortalOperations } from './portal-operations';

export const semiconductorPortalPage: AgencyPage = {
  slug:'portal/반도체장비업체',clusterIds:['ind-609-portal'],
  primaryKeyword:'반도체장비업체 고객 포털 개발',
  keywordVariants:['반도체 설치 장비 고객 포털','장비 기술 문서 고객 자료실','반도체 장비 지원 요청 포털'],
  searchIntent:'고객의 반도체 설치 장비 구성에 맞는 문서 접근과 기술 지원 요청·공개 답변을 연결하는 포털 개발',
  industry:'반도체장비업체',serviceAxis:'고객·파트너 포털',
  title:'반도체장비업체 고객 포털 개발 | 장비 문서·지원 요청 | 름랩',
  description:'반도체 설치 장비의 구성과 문서 적용 조건, 고객별 접근 권한을 연결합니다. 기술 지원 요청과 내부 검토·공개 답변, 문서 회수 및 담당자 이관 범위를 확인하세요.',
  h1:'반도체장비업체 고객 포털 개발, 설치 장비에 맞는 자료와 지원을 연결합니다',
  summary:'반도체 장비 고객 포털은 설치 장비의 모델·구성과 문서 적용 범위를 연결하고 기술 지원 요청을 이어 가는 공간으로 설계할 수 있습니다. 고객 소속과 장소별 권한, 내부 검토와 공개 답변을 구분해야 합니다. 름랩은 장비 원장과 지원 사례를 확인해 문서 접근·요청·회수·이관의 범위를 정리합니다.',
  updatedAt:'2026-10-20',...semiconductorPortalCore,...semiconductorPortalOperations,
  sections:sections(['설치 장비별 자료와 지원을 찾는 고객','다른 구성의 문서와 불명확한 지원 요청','고객 소속·기술 지원·공개 승인 역할','장비 확인에서 자료 탐색·요청 종료까지','적용 문서와 공개 답변이 보이는 화면','장비 불일치·권한·요청 이관 운영','설치 원장과 문서·지원 도구 연결','장소 이전·문서 회수·계약 종료 처리','한 고객의 첫 포털과 부품·방문 연결','자료 대응과 권한 검수의 비용·일정','기술 자료 사용과 현장 판단의 책임','문서 회수와 고객 접근의 운영 인수']),
  faq:[
    {question:'같은 모델이면 같은 문서를 보여 주면 되나요?',answer:'설치 구성과 개정, 문서 적용 조건이 다를 수 있습니다. 모델 이름만으로 모든 자료가 적합하다고 확정하지 않고 확인된 장비 정보와 문서의 대응을 관리하는 편이 좋습니다. 적용이 불명확하면 담당자가 확인하도록 합니다.'},
    {question:'고객 조직의 모든 공장 자료를 함께 볼 수 있나요?',answer:'실제 허용 범위에 따라 달라집니다. 소속 조직뿐 아니라 장소와 설치 장비, 담당 역할의 접근 조건을 확인해야 합니다. 고객 계정을 만들었다는 이유만으로 다른 공장이나 프로젝트의 자료까지 자동 공개하지 않습니다.'},
    {question:'기술 문의가 바로 부품 주문이 되나요?',answer:'문의 접수와 호환 검토, 주문 또는 서비스 승인은 별도 절차일 수 있습니다. 지원 요청에서 후속 업무로 연결할 수 있지만 실제 승인 기준과 담당자를 정해야 합니다. 질문을 접수했다는 사실만으로 거래나 기술 조치를 확정하지 않습니다.'},
    {question:'이전 문서로 작성된 답변은 어떻게 관리하나요?',answer:'답변이 참조한 문서 버전을 남기고 문서 회수나 개정 시 재검토가 필요한 항목을 확인할 수 있습니다. 과거 기록의 근거와 새로운 다운로드 허용 상태를 구분해야 합니다. 새 문서가 모든 장비에 적용되는지는 별도로 확인합니다.'},
    {question:'장비를 원격 제어하는 기능도 포함되나요?',answer:'자료 제공과 지원 요청 포털의 기본 범위에 자동 포함되는 기능은 아닙니다. 원격 지원이나 제어는 별도의 기술·보안 책임과 승인 절차를 확인해야 합니다. 첫 포털에서는 허용된 자료와 요청 상태를 정확히 연결하는 범위부터 검토할 수 있습니다.'},
    {question:'포털 개발 전에 어떤 정보를 준비하면 되나요?',answer:'설치 장비 목록의 구조와 문서 적용 기준, 고객별 공개 범위 및 현재 지원 요청 흐름을 알려 주세요. 내부 원장과 지원 도구의 담당자도 확인하면 연동 책임을 나눌 수 있습니다. 초기 검토는 사용 허락을 받은 구조 예시로 진행할 수 있습니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/website/반도체장비업체/',label:'공개 장비 소개와 지원 문의',reason:'공개 홈페이지와 고객 전용 기술 자료의 경계를 확인합니다.'},
    {href:'/development-agency/api-integration-development/',label:'설치 원장과 지원 도구 연결',reason:'장비 정보와 상태의 원본 책임 및 재전송 처리를 정합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'장소·장비별 자료 접근 검수',reason:'문서 검색과 직접 다운로드, 계정 종료의 권한을 확인합니다.'},
    {href:'/solution/manufacturing/',label:'제조·장비 업무 시스템 범위',reason:'고객 지원과 내부 원장 관리의 역할을 나눠 검토합니다.'},
    {href:'/source-handover/',label:'고객 자료실과 지원 운영 인수',reason:'문서 회수와 요청 이관, 계약 변경 후 운영 절차를 준비합니다.'},
  ],
  ctaContext:'설치 장비와 공개 문서의 적용 관계, 고객·장소별 접근 범위 및 기술 지원 요청 흐름을 알려 주세요. 자료의 근거와 지원 책임을 보존하는 포털 범위를 정리합니다.',
  evidenceSources:[
    {title:'Lam Research 고객 지원과 고객 포털 소개',url:'https://www.lamresearch.com/customer-support/customer-support-overview/?highlight=etch+UI',use:'장비 서비스와 기술 자료를 고객 전용 포털로 제공하는 공개 사례를 확인했습니다. 이 페이지의 상세 권한과 요청 흐름은 별도 설계 제안이며 해당 업체의 내부 구현을 설명하지 않습니다.'},
  ],
};
