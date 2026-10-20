import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { electricalAiCore } from './ai-core';
import { electricalAiOperations } from './ai-operations';

export const electricalAiPage: AgencyPage = {
  slug:'ai/전력설비업체', clusterIds:['ind-606-ai'],
  primaryKeyword:'전력설비업체 AI 자동화',
  keywordVariants:['전력설비 검토 의견 AI 정리','전력기기 회신 문서 AI','수배전반 보완 목록 자동화'],
  searchIntent:'고객의 전력설비 도면 검토 의견을 원문·개정·대상과 연결해 보완 목록으로 정리하고 승인할 회신 표 초안을 만들기',
  industry:'전력설비업체', serviceAxis:'AI·GPT 자동화',
  title:'전력설비업체 AI 자동화 | 고객 검토 의견·보완 목록·회신 | 름랩',
  description:'전력설비 검토 의견의 항목 추출, 원문 위치 연결과 보완 목록 정리, 회신 표 초안을 설계합니다. 요구 누락·잘못된 병합·개정 혼동을 검수하고 기술 승인 범위를 확인하세요.',
  h1:'전력설비업체 AI 자동화, 고객 검토 의견을 근거가 있는 보완 목록으로 정리합니다',
  summary:'전력설비업체의 AI 자동화는 여러 파일에 흩어진 고객 의견을 모으고 원문 근거와 함께 보완 목록 초안을 만드는 데 활용할 수 있습니다. 요구 조건과 도면 개정을 보존하고 항목의 분리·병합은 담당자가 검토해야 합니다. 름랩은 실제 회신 예시와 승인 흐름을 기준으로 의견 추출부터 회신 표 작성까지 범위를 설계합니다.',
  updatedAt:'2026-10-20',
  ...electricalAiCore, ...electricalAiOperations,
  sections:sections(['도면 검토 의견과 회신을 정리하는 조직','요약에서 빠지는 조건과 잘못된 의견 병합','문서 등록·항목 검토·기술 답변·승인 역할','고객 회신에서 승인된 답변 표까지','원문 위치와 요구 항목을 대조하는 화면','누락·수정 이유와 문서 유형 관리','의견 관계와 기존 포털 연결','주석 인식 실패·개정 혼합·외부 지시 처리','한 고객 회신 형식에서 시작하는 자동화','평가 자료와 문서 처리의 비용·일정','기술 검토 책임과 고객 자료 처리 범위','검토 시간과 오류 유형을 확인하는 인수']),
  faq:[
    {question:'비슷한 고객 의견은 자동으로 합쳐도 되나요?',answer:'표현이 비슷해도 대상 설비와 도면 개정, 요구 조건이 다를 수 있습니다. AI가 대응 후보를 찾더라도 담당자가 원문을 대조해 확정하도록 설계합니다. 항목을 합치거나 분리했을 때 원래 의견과의 연결을 보존해야 합니다.'},
    {question:'회신 초안에 기술적인 답변도 자동 작성하나요?',answer:'담당자가 확정한 기술 답변과 조치 근거를 표 형식으로 정리하는 범위부터 검토할 수 있습니다. 아직 없는 결과나 시험 값을 모델이 만들어 채우지 않도록 미확인 상태를 둡니다. 기술 조치의 판단과 고객 전달 승인은 실제 책임자가 확인해야 합니다.'},
    {question:'이미 회신한 의견이 다시 오면 중복으로 지우나요?',answer:'새 조건이나 재확인 요청이 포함됐는지 대조해야 합니다. 이전 의견과 새 원문을 함께 보여 주고 담당자가 관계를 확정하는 흐름을 둡니다. 단순 문장 유사도만으로 미해결 요구를 제외하거나 완료 처리하지 않습니다.'},
    {question:'도면의 이미지 주석도 처리할 수 있나요?',answer:'실제 파일 형식과 주석 품질을 확인하고 대표 사례로 읽기와 위치 연결을 시험해야 합니다. 읽을 수 없는 부분은 추측하지 않고 원문 확인 요청으로 남깁니다. 지원 조건과 검수한 문서 유형을 개발 범위에 명시합니다.'},
    {question:'정확도는 어떤 기준으로 확인하나요?',answer:'담당자가 확정한 의견 목록과 원문 대응을 기준으로 누락, 잘못된 분리·병합과 대상 연결 오류를 나눠 평가합니다. 조건과 부정 표현이 보존되는지도 확인합니다. 생성한 문서 수보다 검토 후 수정 부담과 오류 유형을 함께 보는 것이 필요합니다.'},
    {question:'고객 자료를 모두 먼저 제공해야 하나요?',answer:'먼저 회신 형식과 보완 목록의 항목, 기술 답변과 승인 흐름을 알려 주세요. 사용 권한이 있는 예시로 첫 평가를 진행할 수 있습니다. 비공개 원문과 외부 모델 전달 범위는 자료를 처리하기 전에 정해야 합니다.'},
  ],
  relatedRoutes:[
    {href:'/ai-automation/',label:'AI 업무 자동화 범위',reason:'반복 전사와 사람의 기술 판단이 필요한 지점을 구분합니다.'},
    {href:'/development-agency/b2b-sales-support-ai-workflow/',label:'근거와 승인을 갖춘 답변 초안',reason:'대외 전달 전 검토할 자료와 승인 조건을 비교합니다.'},
    {href:'/development-agency/api-integration-development/',label:'포털과 보완 목록 연동',reason:'항목 식별자와 중복 반영 방지 규칙을 정합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'고객 문서 접근 검수',reason:'프로젝트별 자료 경계와 외부 전송 권한을 확인합니다.'},
    {href:'/source-handover/',label:'평가 자료와 자동화 운영 인수',reason:'문서 유형·모델 변경 후 다시 확인할 기준을 준비합니다.'},
  ],
  ctaContext:'고객의 검토 의견이 들어오는 형식과 현재 보완 목록, 회신 승인 방식을 알려 주세요. 요구 누락을 확인하며 원문 근거를 추적할 수 있는 AI 업무 범위를 정리합니다.',
  evidenceSources:[
    {title:'OWASP 프롬프트 인젝션 위험',url:'https://genai.owasp.org/llmrisk/llm01-prompt-injection/',use:'외부 회신 문서를 실행 지시로 취급하지 않고 전송·수정 권한을 분리할 검수 범위를 정할 때 참고합니다.'},
    {title:'Schneider Electric 단선도 정보 유지 안내',url:'https://www.se.com/ww/en/download/document/22105261/',use:'전력설비의 도면 정보를 정확히 유지해야 한다는 배경을 확인합니다. AI의 기술 검토 능력이나 승인 효력을 보증하는 자료는 아닙니다.'},
  ],
};
