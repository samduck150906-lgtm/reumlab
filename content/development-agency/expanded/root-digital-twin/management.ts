import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '@/content/development-agency/expanded/root-wind/structure';
import { digitalTwinManagementCore } from './management-core';
import { digitalTwinManagementOperations } from './management-operations';

export const digitalTwinManagementPage: AgencyPage = {
  slug:'management/디지털트윈업체',clusterIds:['ind-621-management'],
  primaryKeyword:'디지털트윈업체 관리 프로그램 개발',
  keywordVariants:['디지털트윈 모델 개정 관리 시스템','디지털 트윈 자산 연결 관리 프로그램','디지털트윈 배포 승인 운영 시스템'],
  searchIntent:'프로젝트별 실제 자산·모델·자료 연결 규칙을 식별하고 변경 시험·승인·배포·복구의 근거를 관리하기',
  industry:'디지털트윈업체',serviceAxis:'관리 프로그램·ERP',
  title:'디지털트윈 관리 프로그램 개발 | 자산·모델·변경 승인 | 름랩',
  description:'실제 자산과 모델 대상, 자료 연결 규칙을 구분합니다. 모델 개정의 영향 확인·시험·승인·부분 배포·복구 근거를 관리하는 디지털트윈 내부 운영 프로그램을 확인하세요.',
  h1:'디지털트윈 관리 프로그램, 모델과 자료 연결의 변경 근거를 함께 관리합니다',
  summary:'프로젝트가 늘수록 실제 자산과 모델 대상, 자료 연결 규칙 및 운영 개정의 관계를 유지해야 합니다. 름랩은 식별 대장과 변경 요청을 바탕으로 시험·승인·배포 결과를 연결하고 당시 운영 구성을 확인할 수 있는 디지털트윈 관리 프로그램을 설계합니다.',
  updatedAt:'2026-10-21',...digitalTwinManagementCore,...digitalTwinManagementOperations,
  sections:sections(['여러 프로젝트의 자산과 모델을 운영하는 담당자','식별 오류와 모델·자료 규칙의 개정 불일치','자산·모델·연동·시험·배포 승인의 책임','대상 등록부터 변경 시험과 운영 확인까지','영향 대상과 실제 반영 상태를 보여 주는 관리','프로젝트별 기준과 미완료 변경의 운영','자산·모델·규칙·시험·배포의 관계 기록','자산 교체와 단위 변경·부분 배포의 처리','대표 연결의 첫 변경 관리와 이후 확장','식별 정리와 시험·복구 범위의 비용·일정','기술 승인과 고객 공개·현장 실행의 권한','과거 구성과 부분 복구를 직접 확인하는 인수']),
  faq:[
    {question:'자산 이름이 같으면 같은 모델 대상으로 묶어도 되나요?',answer:'프로젝트와 현장, 실제 자산의 식별 관계를 확인해야 합니다. 이름만 같은 대상을 자동 병합하지 않고 교체와 관계 변경의 적용 기간을 남겨 과거 자료와 현재 연결이 어떤 자산을 가리키는지 구분하도록 설계합니다.'},
    {question:'모델 파일을 바꾸면 자료 연결도 자동으로 맞춰지나요?',answer:'속성이나 관계의 변경이 원본 항목과 단위, 표시 화면에 어떤 영향을 주는지 확인해야 합니다. 모델 개정과 자료 규칙, 시험 근거를 변경 묶음으로 연결하고 실제 반영 상태를 별도로 검수하는 편이 좋습니다.'},
    {question:'일부 대상만 새 구성으로 반영할 수 있나요?',answer:'대상별 적용 개정과 시험·승인, 반영 결과를 남기는 범위에서 검토할 수 있습니다. 부분 실패 시 성공한 대상을 중복 처리하지 않는지와 이전 구성으로 돌릴 자료 규칙·관계의 범위도 함께 확인해야 합니다.'},
    {question:'고객 확인이 끝나면 내부 기술 변경도 완료된 것인가요?',answer:'고객 검토와 기술 시험·배포, 현장 운영 확인은 서로 다른 완료 기준일 수 있습니다. 연결된 요청을 함께 조회하되 각 단계의 책임과 근거를 구분해 아직 남은 보완이나 실제 반영이 가려지지 않도록 구성합니다.'},
    {question:'관리 프로그램이 설비 제어 명령도 승인하나요?',answer:'일반적인 모델·자료 변경 승인과 현장 설비 제어는 별도 업무로 검토해야 합니다. 실제 제어가 필요하면 해당 현장의 권한과 시험, 운영 절차 및 실행 결과 확인을 별도로 정하고 기본 관리 기능에 암묵적으로 포함하지 않습니다.'},
    {question:'처음 구축할 때 어떤 운영 자료가 필요할까요?',answer:'대표 프로젝트의 실제 자산과 모델 대상 목록, 모델의 두 개정 및 원본 자료 항목을 준비하면 도움이 됩니다. 단위·시각·품질 상태와 변경 승인자, 시험과 복구 기준을 정하면 첫 내부 관리 범위를 구체화할 수 있습니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/management/로봇스타트업/',label:'구성과 시험·배포의 내부 운영',reason:'실제 대상에 적용할 구성과 검증·반영 기록을 연결하는 관리 범위를 비교합니다.'},
    {href:'/development-agency/management/스마트시티업체/',label:'여러 대상과 자료 책임의 관리',reason:'시설과 데이터 원본의 식별·변경 책임을 조직 안에서 유지하는 방법을 확인합니다.'},
    {href:'/development-agency/portal/임상데이터업체/',label:'내부 개정과 고객 공개본의 구분',reason:'내부 변경 작업과 외부 검토자에게 공개한 자료 묶음의 책임을 나눠 검토합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'프로젝트별 접근과 승인 범위',reason:'모델·운영 수치·접속 정보의 열람과 변경 권한, 외부 전달 조건을 확인합니다.'},
    {href:'/source-handover/',label:'부분 배포와 복구의 운영 인수',reason:'자산 교체·개정 반영·실패 복구 및 과거 구성 조회를 담당자가 직접 검수합니다.'},
  ],
  ctaContext:'대표 프로젝트의 자산 목록과 모델 개정, 자료 연결표 및 현재 변경 승인 과정을 알려 주세요. 식별 관계와 시험·배포·복구 근거가 유지되는 내부 운영 프로그램의 범위를 정리합니다.',
  evidenceSources:[
    {title:'Microsoft Azure Digital Twins 모델과 대상 관계',url:'https://learn.microsoft.com/en-us/azure/digital-twins/concepts-twins-graph',use:'대상 모델과 관계·속성 메타데이터를 구분하는 기술 배경입니다. 프로젝트별 변경 승인과 운영 책임은 별도 업무 기준으로 설계합니다.'},
    {title:'Microsoft Azure Digital Twins 이벤트 알림 안내',url:'https://learn.microsoft.com/en-us/azure/digital-twins/concepts-event-notifications',use:'대상·관계·속성 변경 알림의 종류를 구분하는 참고 자료입니다. 외부 변경 알림을 기술 승인이나 실제 운영 반영과 동일하게 취급하지 않습니다.'},
  ],
};
