import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { clinicalDataAiCore } from './ai-core';
import { clinicalDataAiOperations } from './ai-operations';

export const clinicalDataAiPage: AgencyPage = {
  slug:'ai/임상데이터업체',clusterIds:['ind-613-ai'],
  primaryKeyword:'임상데이터업체 AI 자동화',
  keywordVariants:['임상 데이터 사양 매핑 검토 AI','연구 데이터 항목 정의 비교','임상 데이터 코드 목록 대조 자동화'],
  searchIntent:'원본과 목표 데이터 사양의 정의·단위·조건·선택값을 비교해 대응 후보와 부족한 근거를 제시하고 담당자의 승인 판단을 기록하기',
  industry:'임상데이터업체',serviceAxis:'AI·GPT 자동화',
  title:'임상데이터업체 AI 자동화 | 사양 대응·코드 목록 검토 | 름랩',
  description:'원본 항목과 목표 사양의 정의·단위·반복 구조·선택값을 비교합니다. 대응 후보의 근거와 판단 보류, 사양 버전·담당자 승인을 관리하는 AI 범위를 확인하세요.',
  h1:'임상데이터업체 AI 자동화, 항목 이름보다 정의와 조건을 함께 대조합니다',
  summary:'항목 이름이 비슷해도 정의와 단위, 시간 기준 또는 선택값이 다르면 같은 데이터로 대응시킬 수 없습니다. 름랩은 승인된 원본·목표 사양에서 대응 후보와 근거, 부족한 정보를 제시하고 담당자의 판단을 기록하는 AI 검토 보조를 설계합니다. 실제 변환 실행과 전문적 적합성 판단은 승인된 별도 절차에 따라 연결합니다.',
  updatedAt:'2026-10-20',...clinicalDataAiCore,...clinicalDataAiOperations,
  sections:sections(['데이터 사양의 대응 관계를 검토하는 담당자','비슷한 항목 이름과 다른 정의의 문제','원본 의미·목표 사양·승인 규칙의 역할','사양 비교에서 후보 검토와 구현 인계까지','정의·단위·선택값·근거를 읽는 화면','허용 사양과 버전·오류 유형 운영','대응 후보·질문·승인 관계의 구조','정보 부족·부분 날짜·대응 없는 코드','대표 사양과 사람이 확인한 첫 비교','문서 형식과 규칙 검수의 비용·일정','비공개 사양과 표준 판단의 범위','잘못된 후보·사양 개정·권한 검수 인수']),
  faq:[
    {question:'같은 이름의 항목은 자동으로 연결할 수 있나요?',answer:'실제 정의와 수집 시점, 단위 및 반복 구조를 확인해야 합니다. 이름이 같아도 의미가 다를 수 있으므로 근거와 다른 조건을 제시하고 담당자가 대응 여부를 판단하도록 구성합니다.'},
    {question:'목표 목록에 없는 코드도 AI가 가장 가까운 값으로 바꾸나요?',answer:'임의로 가까운 값에 맞추면 원본 의미가 사라질 수 있습니다. 대응 값이 없거나 정의가 부족한 항목은 판단 보류와 추가 질문으로 남기고 전문 담당자가 처리 규칙을 정해야 합니다.'},
    {question:'실제 참여자 데이터를 입력해야 사용할 수 있나요?',answer:'항목 정의와 코드 목록, 적절한 합성 예시만으로 검토할 수 있는 부분부터 시작할 수 있습니다. 실제 값이 필요하다면 자료 사용 권한과 외부 처리·보존 범위를 먼저 확인해야 합니다.'},
    {question:'AI가 승인한 대응 규칙을 바로 실행하나요?',answer:'AI는 후보와 근거를 제안하고 담당자가 승인 여부를 결정합니다. 실제 변환은 승인된 관계와 조건만 별도 구현에 전달하며 변환 결과의 검수 책임을 유지해야 합니다.'},
    {question:'원본 사양이 바뀌면 이전 승인도 유지되나요?',answer:'변경된 정의와 코드 목록이 어떤 대응 관계에 영향을 주는지 확인해야 합니다. 적용 버전을 남기고 담당자가 재검토 범위를 결정하도록 하며 새 AI 결과로 기존 승인을 조용히 대체하지 않습니다.'},
    {question:'표준 적합성을 AI 결과로 보장할 수 있나요?',answer:'후보 제안은 표준 적용과 전문 검토를 돕는 범위입니다. 실제 버전과 제출 요구, 변환 규칙 및 결과 검수는 담당자가 확인해야 하며 모델 결과만으로 적합성을 보장하지 않습니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/management/임상데이터업체/',label:'자료·규칙·질의의 검토 원장',reason:'사양 검토 결과와 실제 데이터 검사·질의 처리의 책임을 연결합니다.'},
    {href:'/development-agency/field/임상데이터업체/',label:'수집 양식과 항목 정의·미수집 의미',reason:'원본 항목의 실제 수집 조건과 버전을 확인할 지점을 정리합니다.'},
    {href:'/development-agency/ai/의약품개발사/',label:'개발 문서의 명칭·수치 표현 대조',reason:'문서 표현의 일관성과 데이터 항목의 의미 대응이라는 다른 검토 목적을 비교합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'비공개 사양과 AI 처리 범위',reason:'프로젝트별 원문과 제안 결과에 같은 접근 권한을 적용합니다.'},
    {href:'/source-handover/',label:'사양 검토 AI의 규칙·품질 인수',reason:'잘못된 후보와 판단 보류, 버전 변경 및 승인 결과 전달을 시험합니다.'},
  ],
  ctaContext:'원본과 목표 사양, 코드 목록 및 사람이 확인한 대응·불일치 예시를 알려 주세요. 정의와 조건의 근거를 남기는 임상데이터업체 AI 검토 보조 범위를 정리합니다.',
  evidenceSources:[
    {title:'CDISC CDASH 항목 정의와 추적 관계 안내',url:'https://www.cdisc.org/standards/foundational/cdash',use:'데이터 수집 항목의 의미와 후속 자료 간 추적 관계를 고려해야 한다는 배경을 참고했습니다. 자동 매핑의 정확성이나 특정 표준 버전 적합성을 보장하지 않습니다.'},
    {title:'OWASP 생성형 AI 문서 지시문 위험 안내',url:'https://genai.owasp.org/llmrisk/llm01-prompt-injection/',use:'문서에 포함된 지시를 시스템 명령으로 실행하지 않도록 하는 보안 검토의 참고 자료입니다. 실제 사양 대응의 판단 근거는 승인된 정의와 담당자의 검토입니다.'},
  ],
};
