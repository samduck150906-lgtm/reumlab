import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '@/content/development-agency/expanded/root-wind/structure';
import { digitalTwinFieldCore } from './field-core';
import { digitalTwinFieldOperations } from './field-operations';

export const digitalTwinFieldPage: AgencyPage = {
  slug:'field/디지털트윈업체',clusterIds:['ind-621-field'],
  primaryKeyword:'디지털트윈업체 현장 관리 앱',
  keywordVariants:['디지털 트윈 현장 확인 앱','디지털트윈 자산 대조 작업 앱','디지털트윈 모델 현장 검토 프로그램'],
  searchIntent:'실제 자산과 모델 대상을 현장에서 대조하고 관측 시점·식별 근거·미확인 사유를 검토와 반영 절차로 전달하기',
  industry:'디지털트윈업체',serviceAxis:'현장·작업 관리',
  title:'디지털트윈 현장 관리 앱 | 자산 대조·관측·차이 보고 | 름랩',
  description:'모델 대상과 실제 현장 자산을 대조합니다. 식별 근거·관측 시점·미확인 사유와 통신 없는 기록, 사무실 검토 및 모델 반영을 구분하는 현장 관리 앱의 범위를 확인하세요.',
  h1:'디지털트윈 현장 관리 앱, 실제 자산과 모델의 차이를 확인 근거로 전달합니다',
  summary:'모델과 현장이 같은 대상을 가리키는지 확인하려면 실제 표식과 위치, 관측한 시점 및 확인하지 못한 조건을 남겨야 합니다. 름랩은 대상 배정에서 현장 기록과 사무실 검토까지 연결하고 모델 반영의 책임을 구분하는 현장 관리 앱을 설계합니다.',
  updatedAt:'2026-10-21',...digitalTwinFieldCore,...digitalTwinFieldOperations,
  sections:sections(['실제 자산과 모델 대상을 확인하는 현장 작업자','다른 대상의 기록과 오래된 개정이 섞이는 문제','배정·현장 확인·모델 검토·변경 승인의 역할','방문 준비부터 관측 접수와 보완 회신까지','식별 근거와 미확인 사유가 남는 현장 기록','작업 변경과 처리 대기·검토 책임의 운영','대상·개정·관측·전송·후속 확인의 관계','표식 불일치와 통신 없는 기록·장비 교체','대표 현장의 첫 확인과 이후 반복 작업 확장','현장 자료와 기기·연결·검수의 비용·일정','출입·촬영·관측과 실제 조치의 권한 확인','전송 충돌과 사무실 검토를 직접 수행하는 인수']),
  faq:[
    {question:'현장 위치 정보로 모델의 대상을 바로 확정할 수 있나요?',answer:'실내 위치와 유사 자산 등의 조건을 확인해야 합니다. 실제 표식과 구역, 자산 식별 근거를 함께 대조하고 불명확한 관계는 확인 요청으로 남겨 위치 정보만으로 잘못된 대상에 기록하지 않도록 설계합니다.'},
    {question:'통신이 되지 않는 구역에서도 기록할 수 있나요?',answer:'기기와 자료 보관 조건에 맞춰 작업 묶음과 현장 기록을 보관하는 범위를 검토할 수 있습니다. 연결 복구 후 대상이나 개정이 바뀐 상황, 반복 전송과 접수 실패를 구분하고 원본 관측이 사라지지 않는지 시험해야 합니다.'},
    {question:'현장 사진을 올리면 모델도 곧바로 수정되나요?',answer:'사진과 관측은 검토 근거이며 승인된 모델 변경과는 별도 단계로 다루는 편이 좋습니다. 사무실 담당자가 대상과 시점, 차이를 확인한 후 모델이나 자료 규칙을 변경하고 실제 반영 결과를 따로 기록하도록 구성합니다.'},
    {question:'센서 값과 사람이 본 값이 다르면 어느 쪽이 맞나요?',answer:'화면에서 한쪽을 임의로 정답으로 확정하지 않습니다. 측정 대상과 관측 시각, 단위 및 기록 조건이 같은지 담당자가 검토할 수 있도록 근거를 전달하고 필요한 추가 확인이나 전문 판단은 해당 책임 범위에서 진행해야 합니다.'},
    {question:'앱의 작업 배정이 현장 출입 허가도 포함하나요?',answer:'작업 배정과 실제 출입·촬영·안전 작업 허가는 별도로 확인해야 합니다. 현장의 실제 조건과 권한, 수행 절차를 검토하고 앱의 업무 상태만으로 허가나 설비 제어가 승인됐다고 안내하지 않습니다.'},
    {question:'제작 전에 어떤 현장 자료를 준비하면 좋을까요?',answer:'대표 대상 목록과 현장 표식, 사용할 모델 개정 및 실제 확인 질문을 준비하면 도움이 됩니다. 사용 기기와 통신 조건, 자료 수집 범위 및 사무실 검토·모델 반영 담당을 함께 정하면 첫 앱의 범위를 구체화할 수 있습니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/field/스마트시티업체/',label:'현장 대상과 시설 자료의 확인',reason:'여러 구역의 실제 대상과 관측 근거를 현장에서 대조하고 검토하는 업무를 비교합니다.'},
    {href:'/development-agency/field/로봇스타트업/',label:'현장 확인과 기술 구성 반영의 구분',reason:'실제 수행 기록과 사무실의 기술 검토·변경 승인 사이의 역할을 확인합니다.'},
    {href:'/development-agency/field/연구장비업체/',label:'식별 근거와 확인 불가 항목의 기록',reason:'대상 장비와 적용 자료를 대조하고 실제 확인한 범위를 남기는 절차를 검토합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'현장 자료와 기기 접근 범위',reason:'고객별 도면·사진의 열람과 전송, 작업 종료 후 기기 자료 처리 조건을 정리합니다.'},
    {href:'/source-handover/',label:'통신 없는 기록과 충돌 처리의 인수',reason:'현장 작성부터 전송·보완·모델 반영 확인까지 실제 담당자가 검수하는 범위를 정합니다.'},
  ],
  ctaContext:'대상 자산과 현장 표식, 모델 개정 및 현재 확인 질문을 알려 주세요. 실제 관측과 미확인 사유를 남기고 사무실 검토로 이어지는 디지털트윈 현장 관리 앱의 범위를 정리합니다.',
  evidenceSources:[
    {title:'OGC SensorThings API 관측 자료 모델',url:'https://docs.ogc.org/is/18-088/18-088.html',use:'관측 대상과 관측·결과 시각, 자료 품질을 구분하는 개념을 참고했습니다. 현장 확인 절차 자체가 해당 표준으로 인증됐다는 의미는 아닙니다.'},
    {title:'Microsoft Azure Digital Twins 모델과 대상 관계',url:'https://learn.microsoft.com/en-us/azure/digital-twins/concepts-twins-graph',use:'모델 대상과 관계 및 속성의 시간 정보를 구분하는 배경 자료입니다. 실제 현장 자산의 확정과 모델 반영은 별도 담당과 근거로 검토합니다.'},
  ],
};
