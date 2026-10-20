import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { biotechManagementCore } from './management-core';
import { biotechManagementOperations } from './management-operations';

export const biotechManagementPage: AgencyPage = {
  slug:'management/바이오테크업체',clusterIds:['ind-611-management'],
  primaryKeyword:'바이오테크업체 관리 프로그램',
  keywordVariants:['바이오 연구 과제 관리 시스템','연구 검토 결정 근거 관리','공동 연구 산출물 후속 업무 관리'],
  searchIntent:'바이오 연구 과제의 목표·산출물·검토 근거와 승인 결정, 남은 조건 및 후속 업무를 연결해 관리하기',
  industry:'바이오테크업체',serviceAxis:'관리 프로그램·ERP',
  title:'바이오테크업체 관리 프로그램 | 연구 과제·검토·결정 근거 | 름랩',
  description:'연구 과제의 목표와 산출물, 검토 자료 및 승인 결정을 연결합니다. 조건부 결정, 목표 변경, 자료 정정과 담당자 인계의 관리 범위를 확인하세요.',
  h1:'바이오테크업체 관리 프로그램, 과제의 검토 근거와 후속 결정을 연결합니다',
  summary:'바이오테크 관리 프로그램은 연구 과제의 목표와 산출물, 검토 근거 및 승인 결정이 이어지는 원장으로 설계할 수 있습니다. 일정 완료와 기술 검토, 외부 자료 전달은 다른 상태입니다. 름랩은 실제 의사 결정 책임과 변경·인계 사례를 확인해 근거와 남은 조건이 보존되는 과제 관리 범위를 정리합니다.',
  updatedAt:'2026-10-20',...biotechManagementCore,...biotechManagementOperations,
  sections:sections(['연구 목표와 결정 근거를 관리하는 조직','완료 표시와 실제 검토·이행의 차이','과제 책임자·검토자·결정 승인 역할','산출물 제출에서 결정과 후속 확인까지','현재 상태의 근거를 찾는 과제 화면','검토 일정과 조건·양식의 운영','목표·자료 묶음·결정·업무 연결','자료 정정·조건부 결정·책임자 변경','대표 과제의 첫 원장과 의존 관계 확장','근거 정리와 도구 연동의 비용·일정','연구 판단과 승인 기록의 책임 확인','목표 변경과 미해결 조건의 운영 인수']),
  faq:[
    {question:'실험 결과가 나오면 과제 단계가 자동 완료되나요?',answer:'자료 생성과 과제 검토의 완료는 다른 사건입니다. 실제 산출물 확인 기준과 책임자의 결정, 남은 조건을 구분해야 합니다. 시스템이 연구의 성공이나 기술적 가치를 자동 판단하도록 설계하지 않습니다.'},
    {question:'회의 후 자료가 정정되면 이전 결정도 바뀌나요?',answer:'결정 당시의 자료와 근거는 보존하고 새 자료가 어떤 확인을 필요로 하는지 표시하는 것이 좋습니다. 이전 결정을 바꿀지는 책임자가 검토하고 변경 이유와 적용 범위를 남겨야 합니다.'},
    {question:'모든 연구 과제에 같은 완료율을 적용할 수 있나요?',answer:'과제의 목표와 산출물 기준이 다르면 같은 숫자가 같은 의미를 갖지 않을 수 있습니다. 관리에 필요한 상태를 정의하고 지표가 연구 성과나 성공 확률로 오해되지 않도록 설명해야 합니다.'},
    {question:'기존 연구 기록 도구를 새로 만들어야 하나요?',answer:'기존 원본을 유지하며 검토에 필요한 자료의 식별자와 버전을 연결할 수 있습니다. 일정과 자료, 결정 및 후속 업무의 관계를 정리하는 범위부터 시작하고 원본 접근과 버전 연결을 검수하는 것이 좋습니다.'},
    {question:'공동 연구 자료를 내부 과제에서 모두 볼 수 있나요?',answer:'협력 기관과의 계약 및 자료 사용 조건, 참여자의 권한에 따라 달라집니다. 같은 회사의 과제라는 이유만으로 모든 자료를 공유하지 않고 적용 목적과 공개 범위를 확인해야 합니다.'},
    {question:'범위 검토에 필요한 예시는 무엇인가요?',answer:'대표 과제의 목표와 산출물, 검토 회의의 자료·결정 및 후속 업무 사례가 도움이 됩니다. 조건부 결정이나 목표 변경, 담당자 이관 사례를 포함하면 실제 예외와 책임을 구체적으로 정리할 수 있습니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/portal/바이오테크업체/',label:'고객 의뢰와 산출물 공개의 포털',reason:'내부 과제 검토와 고객에게 승인 결과를 전달하는 범위를 구분합니다.'},
    {href:'/development-agency/website/바이오테크업체/',label:'공개 연구 기술과 과제 상태',reason:'내부 결정에서 외부 공개 콘텐츠로 옮길 때의 승인 책임을 확인합니다.'},
    {href:'/development-agency/api-integration-development/',label:'연구 문서와 일정 도구 연결',reason:'자료 식별과 버전, 일정·결정·이행 상태의 원본을 정합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'연구 자료와 결정 권한 검수',reason:'검토 의견과 외부 협력 자료의 접근 및 승인 권한을 구분합니다.'},
    {href:'/source-handover/',label:'연구 과제 관리 원장 인수',reason:'조건부 결정과 목표 변경, 담당자 이관의 근거를 보존합니다.'},
  ],
  ctaContext:'연구 과제의 목표와 산출물, 검토 자료 및 결정·후속 업무를 관리하는 방식을 알려 주세요. 상태의 근거와 미해결 조건을 이어 가는 관리 프로그램 범위를 정리합니다.',
  evidenceSources:[
    {title:'BioNTech 공개 협력 안내',url:'https://www.biontech.com/int/en/home/about/collaborators.html',use:'연구 협력이 여러 조직의 역할과 목적을 연결하는 공개 배경을 참고했습니다. 과제 원장과 결정 기록은 별도 설계 제안이며 해당 회사의 내부 운영을 설명하지 않습니다.'},
    {title:'W3C 웹 콘텐츠 접근성 기준 안내',url:'https://www.w3.org/WAI/WCAG22/quickref/',use:'과제 상태와 검토 조건, 변경 안내를 인식하고 관련 근거와 입력 항목을 키보드로 확인하는 기준을 참고합니다.'},
  ],
};
