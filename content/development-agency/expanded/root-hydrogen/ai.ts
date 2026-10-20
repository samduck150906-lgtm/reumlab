import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { hydrogenAiCore } from './ai-core';
import { hydrogenAiOperations } from './ai-operations';

export const hydrogenAiPage: AgencyPage = {
  slug:'ai/수소에너지업체', clusterIds:['ind-605-ai'],
  primaryKeyword:'수소에너지업체 AI 자동화',
  keywordVariants:['수소 기술 문서 AI 비교','수소 장비 사양서 자동 정리','수소에너지 AI 업무 개발'],
  searchIntent:'수소 기술 사양서와 제안 자료에서 조건과 근거를 보존해 항목을 추출·대조하고 담당자의 답변 검토를 돕기',
  industry:'수소에너지업체', serviceAxis:'AI·GPT 자동화',
  title:'수소에너지업체 AI 업무 자동화 | 사양서 비교·근거 검토 | 름랩',
  description:'수소 기술 문서의 항목 추출, 조건별 사양 비교와 답변 초안 업무를 설계합니다. 모델·단위·문서 버전 보존, 출처 대조와 승인, 프로젝트 권한을 기준으로 AI 개발 범위를 확인하세요.',
  h1:'수소에너지업체 AI 업무 자동화, 사양서의 조건과 근거를 함께 비교합니다',
  summary:'수소에너지업체의 AI 업무 자동화는 사양서와 제안 자료에서 필요한 항목을 찾고 원문 근거와 함께 검토 초안을 만드는 데서 시작할 수 있습니다. 숫자만 옮기지 않고 제품 모델과 적용 조건, 단위 및 문서 버전을 보존해야 합니다. 름랩은 실제 검토 질문과 담당자의 승인 기준을 확인해 추출·대조·수정 흐름을 설계합니다.',
  updatedAt:'2026-10-20',
  ...hydrogenAiCore, ...hydrogenAiOperations,
  sections:sections(['사양서와 질의 회신을 검토하는 조직','조건과 버전이 빠지는 문서 비교 문제','문서 관리·기술 검토·발송 승인 역할','요구 항목 추출부터 승인 답변까지','원문 근거와 조건을 보여 주는 검토 화면','버전 충돌·반려·평가 사례 관리','요구 항목 데이터와 문서 저장소 연결','읽기 실패·자료 혼합·외부 지시 처리','한 문서 유형에서 시작하는 개발 범위','문서 품질과 평가 기준에 따른 견적·일정','기술 자료 권한과 전문 검토 책임','원문 대조와 변경 평가를 이어 가는 인수']),
  faq:[
    {question:'사양서의 숫자를 AI가 자동으로 비교해도 되나요?',answer:'항목과 모델, 단위 및 적용 조건을 함께 확인하는 비교 초안을 만들 수 있습니다. 숫자가 있다고 해서 같은 조건의 성능이라고 가정하지 않습니다. 담당자가 원문을 대조해 비교 가능한 항목을 확정하고 누락된 조건은 추가 확인 대상으로 남깁니다.'},
    {question:'자료에 없는 값도 다른 문서를 참고해 채울 수 있나요?',answer:'다른 모델이나 버전의 값을 근거 없이 가져와 빈칸을 채우지 않습니다. 필요한 값이 없으면 자료 없음이나 확인 필요 상태로 표시하고 추가 문서를 요청합니다. 여러 자료를 함께 사용할 때에는 각 값의 출처와 적용 대상을 검토해야 합니다.'},
    {question:'AI가 장비의 안전성과 적합성을 판단하나요?',answer:'이 페이지의 범위는 문서 항목 정리와 근거 대조, 답변 초안입니다. 장비의 적용과 안전, 법적 적합성 판단은 필요한 전문 책임자의 검토 기준과 절차를 별도로 확인해야 합니다. 모델의 답변을 해당 확인을 대신하는 결과로 표시하지 않습니다.'},
    {question:'비공개 고객 문서를 사용해도 되나요?',answer:'처리 권한과 보관 기준, 외부 모델 서비스에 전달 가능한 정보 범위를 먼저 확인해야 합니다. 사용자와 프로젝트별로 허용된 문서만 검색하도록 설계하고 권한 회수도 검수합니다. 전체 자료를 먼저 올리기보다 사용 가능한 예시와 필요한 항목부터 정합니다.'},
    {question:'정확도는 어떤 자료로 검수하나요?',answer:'담당자가 항목과 근거를 확인한 대표 자료로 누락, 잘못된 원문 연결, 조건 보존과 버전 선택을 나눠 평가합니다. 단일 정확도 숫자만으로 검수를 끝내지 않습니다. 스캔 오류나 여러 모델이 섞인 문서 등 실제 실패 사례도 포함해야 합니다.'},
    {question:'상담 전에 무엇을 준비하면 되나요?',answer:'현재 반복해서 읽는 문서 유형, 비교할 항목, 결과를 사용하는 사람과 승인 흐름을 알려 주세요. 민감한 원문 전체가 필요하지는 않습니다. 사용 허락을 받은 예시와 검토 기준을 바탕으로 첫 개발 범위와 평가 방법을 정리합니다.'},
  ],
  relatedRoutes:[
    {href:'/ai-automation/',label:'AI 자동화 업무 범위',reason:'사람의 검토가 필요한 단계와 자동 처리 범위를 정합니다.'},
    {href:'/development-agency/b2b-sales-support-ai-workflow/',label:'기술 영업 답변과 승인',reason:'출처를 확인한 제안 초안이 고객 전달로 이어지는 흐름을 비교합니다.'},
    {href:'/development-agency/api-integration-development/',label:'문서 저장소 연동',reason:'문서 개정과 회수, 연결 실패의 처리 기준을 정합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'고객 자료 접근 검수',reason:'프로젝트별 검색 권한과 외부 전송 승인 범위를 점검합니다.'},
    {href:'/source-handover/',label:'평가 자료와 운영 인수',reason:'모델과 처리 규칙 변경 후 재검수할 자료를 준비합니다.'},
  ],
  ctaContext:'비교하는 사양서의 유형과 필요한 항목, 원문 확인과 답변 승인 방식을 알려 주세요. 조건과 출처를 추적하며 담당자가 검수할 수 있는 AI 문서 업무 범위를 정리합니다.',
  evidenceSources:[
    {title:'OWASP 프롬프트 인젝션 위험',url:'https://genai.owasp.org/llmrisk/llm01-prompt-injection/',use:'외부 문서의 지시가 권한 변경이나 자료 전송으로 이어지지 않도록 검수 범위를 정할 때 참고합니다.'},
    {title:'H2Tools 안전 계획 참고 자료',url:'https://h2tools.org/bestpractices/safety-planning',use:'문서 자동화와 별도로 전문 책임자의 안전 계획·검토 기준을 확인하는 배경 자료입니다.'},
  ],
};
