import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '@/content/development-agency/expanded/root-wind/structure';
import { digitalTwinPortalCore } from './portal-core';
import { digitalTwinPortalOperations } from './portal-operations';

export const digitalTwinPortalPage: AgencyPage = {
  slug:'portal/디지털트윈업체',clusterIds:['ind-621-portal'],
  primaryKeyword:'디지털트윈업체 고객 포털 개발',
  keywordVariants:['디지털 트윈 발주 고객 포털','디지털트윈 모델 검토 포털','자산 모델 개정 고객 확인 시스템'],
  searchIntent:'고객에게 공개한 대상·모델 개정·자료 시점별 검토와 회신을 연결하고 실제 운영 반영과 구분하기',
  industry:'디지털트윈업체',serviceAxis:'고객·파트너 포털',
  title:'디지털트윈 고객 포털 개발 | 모델 개정·검토·회신 | 름랩',
  description:'고객별 대상과 모델 개정, 자료 시점을 연결합니다. 자산별 의견·공급업체 회신·검토 완료와 실제 운영 반영을 구분하는 디지털트윈 고객 포털의 구축 범위를 확인하세요.',
  h1:'디지털트윈 고객 포털, 어떤 대상과 개정을 확인했는지 근거를 남깁니다',
  summary:'모델과 운영 자료를 고객과 함께 검토하려면 공개 대상과 개정, 자료 기준 시점 및 회신 책임이 명확해야 합니다. 름랩은 고객별 권한으로 자료를 확인하고 대상별 의견과 보완 회신을 연결해 검토 완료의 근거를 유지하는 포털을 설계합니다.',
  updatedAt:'2026-10-21',...digitalTwinPortalCore,...digitalTwinPortalOperations,
  sections:sections(['공개된 대상과 개정을 확인하는 고객 검토자','서로 다른 모델과 시점에 의견이 남는 문제','고객 초대·검토·승인과 공급업체 공개 역할','자료 공개에서 대상별 회신과 재확인까지','자산 의견과 자료 상태가 연결된 고객 화면','검토 묶음과 고객별 공개 범위의 운영','고객·대상·개정·의견·확인의 자료 관계','대상 교체와 지연 자료·잘못된 초대 처리','대표 고객의 첫 검토와 이후 협력 범위 확장','모델 표시와 원본 연결·권한 검수의 비용·일정','고객 자료 공개와 운영 적용의 권한 확인','이전 개정 회신과 권한 종료를 확인하는 인수']),
  faq:[
    {question:'고객이 모델을 확인하면 실제 운영에도 바로 적용되나요?',answer:'열람과 검토 완료, 실제 운영 반영은 별도 상태와 책임으로 설계해야 합니다. 포털의 확인이 무엇을 의미하는지 정하고 현장 작업 허가나 설비 제어가 필요한 업무는 해당 권한과 절차를 별도로 검토합니다.'},
    {question:'새 모델을 공개하면 이전 의견은 어떻게 관리하나요?',answer:'의견이 작성된 대상과 모델 개정, 자료 기준을 유지하고 새 개정에서 다시 확인할 항목을 연결할 수 있습니다. 이름이 바뀌거나 대상이 삭제된 경우에는 의견을 임의로 옮기지 않고 담당자가 적용 관계를 검토하도록 구성합니다.'},
    {question:'마지막 갱신 시각만 표시하면 자료가 최신인지 알 수 있나요?',answer:'실제 관측 시각과 서버에 반영된 시각, 미수신이나 품질 상태가 다를 수 있습니다. 원본에서 제공하는 시간과 상태를 확인해 각 값의 기준을 안내하고 자료가 없을 때 정상이나 영 값으로 잘못 표시하지 않도록 설계합니다.'},
    {question:'외부 협력사도 일부 대상만 함께 검토할 수 있나요?',answer:'계약과 자료 공개 조건에 맞춰 대상과 역할, 접근 기간을 정한 범위에서 검토할 수 있습니다. 초대가 고객 전체 자료의 열람 권한으로 확대되지 않는지와 협업 종료 후 자료 사본의 처리 기준도 함께 확인합니다.'},
    {question:'고객 포털에서 가상 조건 비교도 제공할 수 있나요?',answer:'입력 자료와 계산 조건, 결과의 사용 범위 및 검토 책임을 별도로 정한 뒤 검토할 수 있습니다. 관측값 조회와 계산 결과를 구분하고 화면에서 얻은 결과만으로 현장 안전이나 성능이 확인됐다고 단정하지 않습니다.'},
    {question:'구축 전에 어떤 검토 자료를 준비하면 좋을까요?',answer:'고객별 대상 목록과 역할, 대표 모델의 두 개정, 자료 기준 시점 및 실제 확인 질문을 준비하면 도움이 됩니다. 의견 처리와 회신, 검토 완료 및 운영 반영의 담당자를 구분하면 포털의 첫 범위를 구체화할 수 있습니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/portal/스마트시티업체/',label:'사업 대상별 공개와 확인 역할',reason:'여러 기관과 대상의 자료를 각각의 권한으로 공개하고 검토하는 포털 구성을 비교합니다.'},
    {href:'/development-agency/portal/임상데이터업체/',label:'자료 개정과 확인 근거의 유지',reason:'현재 공개본과 이전 회신의 적용 관계를 남기는 검토 공간의 책임을 확인합니다.'},
    {href:'/development-agency/b2b-partner-portal-development/',label:'고객 포털의 역할과 접근 범위',reason:'계약 대상·사용자 초대·자료 전달과 내부 운영 업무의 경계를 정리합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'대상별 자료 열람과 공유 검토',reason:'다른 고객의 모델과 운영 수치가 노출되지 않는 권한·전송·다운로드 조건을 확인합니다.'},
    {href:'/source-handover/',label:'개정 회신과 권한 종료의 인수',reason:'실제 공개와 고객 확인, 담당자 변경 및 이전 근거 조회를 운영자가 직접 검수합니다.'},
  ],
  ctaContext:'고객별 대상과 공개할 모델 개정, 실제 검토 질문 및 회신 담당을 알려 주세요. 자료의 시점과 대상별 의견을 연결하고 확인 근거가 유지되는 고객 포털 범위를 정리합니다.',
  evidenceSources:[
    {title:'Microsoft Azure Digital Twins의 대상과 관계',url:'https://learn.microsoft.com/en-us/azure/digital-twins/concepts-twins-graph',use:'대상 모델·관계와 속성의 시간 정보를 구분하는 기술 배경으로 참고했습니다. 고객 검토 절차와 권한은 실제 프로젝트 조건에 맞춰 별도로 설계합니다.'},
    {title:'Microsoft Azure Digital Twins 자료 입출력 안내',url:'https://learn.microsoft.com/en-us/azure/digital-twins/concepts-data-ingress-egress',use:'자료 수집·보관·후속 처리의 연결을 구분하는 참고 자료입니다. 특정 서비스의 사용이나 모든 자료의 즉시 반영을 보장하는 근거로 제시하지 않습니다.'},
  ],
};
