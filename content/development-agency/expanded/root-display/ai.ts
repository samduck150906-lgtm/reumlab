import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { displayAiCore } from './ai-core';
import { displayAiOperations } from './ai-operations';

export const displayAiPage: AgencyPage = {
  slug:'ai/디스플레이업체',clusterIds:['ind-610-ai'],
  primaryKeyword:'디스플레이업체 AI 자동화',
  keywordVariants:['디스플레이 고객 요구 정리 AI','제품 사양 근거 대조 AI','디스플레이 상담 질문 자동화'],
  searchIntent:'디스플레이 고객 문의의 요구 항목을 승인된 제품 사양 근거와 대조하고 정보 부족·조건 차이·추가 질문을 검토하기',
  industry:'디스플레이업체',serviceAxis:'AI·GPT 자동화',
  title:'디스플레이업체 AI 자동화 | 고객 요구·사양 근거 대조 | 름랩',
  description:'고객 문의의 필수·희망 조건을 승인된 디스플레이 제품 자료와 대조합니다. 비교 가능한 근거와 정보 부족, 추가 질문 및 담당자 검토 범위를 확인하세요.',
  h1:'디스플레이업체 AI 자동화, 제품 상담의 요구와 사양 근거를 대조합니다',
  summary:'디스플레이 AI 자동화는 고객 문의의 요구 항목을 정리하고 승인된 제품 자료의 근거와 비교하는 상담 준비 업무부터 검토할 수 있습니다. 수치와 단위가 같아도 정의와 조건이 다르면 직접 비교하기 어렵습니다. 름랩은 요구 원문과 제품 근거, 정보 부족 및 추가 질문을 보존하는 담당자 검토 흐름을 설계합니다.',
  updatedAt:'2026-10-20',...displayAiCore,...displayAiOperations,
  sections:sections(['고객 요구를 제품 상담으로 연결하는 조직','같은 수치와 다른 조건을 혼동하는 문제','자료 승인·영업 확인·기술 검토 역할','문의 추출에서 근거 대조와 답변 승인까지','요구 원문과 사양 근거를 읽는 화면','누락·잘못된 후보·자료 변경의 평가','요구·제품 조건·검토 결과의 연결 구조','범위값·모호한 단위·자료 혼입의 처리','한 제품군의 첫 대조와 문의 변경 확장','자료 정리와 오류 평가의 비용·일정','고객 자료 사용과 제품 판단의 책임','자료 갱신과 수동 상담의 운영 인수']),
  faq:[
    {question:'AI가 바로 호환되는 디스플레이를 확정하나요?',answer:'이 범위는 고객 요구와 제품 자료의 근거를 정리하는 상담 지원입니다. 공급 형태와 연결 구성, 적용 조건 등을 기술 담당자가 확인해야 합니다. AI가 만든 후보 목록을 제품 호환성이나 적용 승인으로 안내하지 않습니다.'},
    {question:'같은 단위의 수치면 자동 비교할 수 있나요?',answer:'항목의 정의와 측정 조건, 제품 구성이 같은지 확인해야 합니다. 단위가 같다는 이유만으로 직접 비교가 가능하다고 판단하지 않습니다. 근거가 부족한 경우에는 비교할 수 없는 이유와 추가 질문을 남깁니다.'},
    {question:'제품 문서에 값이 없으면 후보에서 제외하나요?',answer:'확인된 불일치와 정보가 없는 상태는 다릅니다. 자료가 없다는 이유만으로 조건을 충족하지 못한다고 단정하지 않고 담당자가 확인할 항목으로 표시하는 방법을 검토해야 합니다.'},
    {question:'고객 요구가 바뀌면 이전 결과는 삭제되나요?',answer:'이전 요구와 대조 결과를 보존하고 변경된 조건에 따라 다시 검토하는 것이 좋습니다. 후보가 포함되거나 제외된 이유를 비교하고 당시 사용한 제품 자료 버전을 확인할 수 있어야 합니다.'},
    {question:'정리한 답변을 고객에게 자동으로 보내나요?',answer:'담당자 검토와 공개 승인을 거친 답변만 전달하는 범위로 시작할 수 있습니다. 고객 자료의 접근 권한과 전송 권한을 나누고 AI 초안과 승인 답변의 상태가 구분되는지 검수해야 합니다.'},
    {question:'초기 평가에는 어떤 문의가 필요한가요?',answer:'사용이 허용된 문의와 승인된 제품 자료, 담당자가 확인한 요구와 질문 사례가 도움이 됩니다. 조건이 빠졌거나 자료 정의가 다른 경우, 오래된 문서가 있는 경우도 포함해 오류와 누락을 평가하는 것이 좋습니다.'},
  ],
  relatedRoutes:[
    {href:'/ai-automation/',label:'AI 상담 준비의 적용 범위',reason:'요구 정리와 기술 판단, 답변 승인 책임을 나눕니다.'},
    {href:'/development-agency/website/디스플레이업체/',label:'공개 제품 자료와 사양 조건',reason:'대조에 사용할 제품 정보의 정의와 공개 범위를 확인합니다.'},
    {href:'/development-agency/portal/디스플레이업체/',label:'도면·샘플 평가의 고객 협의',reason:'상담 후보 이후의 기술 검토와 평가 근거를 인계할 범위를 정합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'고객 문의와 외부 문서의 AI 검수',reason:'자료 접근과 전송 권한, 입력 문서 속 지시를 구분합니다.'},
    {href:'/source-handover/',label:'제품 대조 AI와 평가 기준 인수',reason:'자료 갱신과 모델 변경 후 오류를 확인하고 수동 상담을 이어 갑니다.'},
  ],
  ctaContext:'제품 상담에서 자주 받는 요구와 승인된 사양 자료, 기술 담당자가 추가로 확인하는 질문을 알려 주세요. 원문과 조건의 근거를 보존하는 AI 대조 범위를 정리합니다.',
  evidenceSources:[
    {title:'OWASP 프롬프트 인젝션 위험',url:'https://genai.owasp.org/llmrisk/llm01-prompt-injection/',use:'고객 문의와 제품 문서 속 내용을 실행 지시로 취급하지 않고 읽기·전송·실행 권한을 구분하는 검수 항목을 참고합니다.'},
    {title:'LG Display 공개 제품 안내',url:'https://www.lgdisplay.com/eng/product/automotive-display/lcd',use:'제품의 적용 분야와 기술 범주가 구분되는 배경을 참고했습니다. 이 페이지의 AI 사양 대조는 별도 업무 설계 제안이며 제조사의 추천 시스템이나 성능을 설명하지 않습니다.'},
  ],
};
