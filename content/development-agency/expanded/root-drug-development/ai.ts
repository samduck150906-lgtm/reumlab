import type { AgencyPage } from '@/lib/development-agency/types';
import { sections } from '../root-wind/structure';
import { drugDevelopmentAiCore } from './ai-core';
import { drugDevelopmentAiOperations } from './ai-operations';

export const drugDevelopmentAiPage: AgencyPage = {
  slug:'ai/의약품개발사',clusterIds:['ind-612-ai'],
  primaryKeyword:'의약품개발사 AI 자동화',
  keywordVariants:['신약 개발 문서 일관성 검토 AI','개발 문서 명칭 날짜 대조 AI','의약품 개발 자료 버전 비교 자동화'],
  searchIntent:'허용된 개발 문서 묶음의 후보·프로그램 명칭과 날짜·수치 표현을 원문 위치와 대조하고 불일치 후보에 대한 사람의 판단을 기록하기',
  industry:'의약품개발사',serviceAxis:'AI·GPT 자동화',
  title:'의약품개발사 AI 자동화 | 개발 문서 명칭·수치 대조 | 름랩',
  description:'개발 문서의 후보명·프로그램 코드·기준 날짜와 수치 표현을 원문 근거와 비교합니다. 추출 오류와 판단 보류, 담당자 검토를 포함한 AI 보조 범위를 확인하세요.',
  h1:'의약품개발사 AI 자동화, 문서 사이의 차이를 원문 근거와 함께 검토합니다',
  summary:'개발 문서의 명칭과 날짜, 표와 본문이 다르게 보이더라도 실제 오류인지 판단하려면 대상과 단위, 기준 시점 및 원문을 확인해야 합니다. 름랩은 허용된 문서 버전에서 불일치 후보를 찾고 읽지 못한 항목과 판단 보류를 구분하며 담당자가 확인한 결과를 남기는 AI 검토 보조 기능을 설계합니다.',
  updatedAt:'2026-10-20',...drugDevelopmentAiCore,...drugDevelopmentAiOperations,
  sections:sections(['개발 문서의 반복 대조를 수행하는 담당자','명칭·날짜·표와 본문의 차이 확인 문제','문서 기준 설정과 전문 검토·개정 역할','원문 추출에서 불일치 검토와 재검사까지','비교 값과 원문 위치를 함께 읽는 화면','비교 규칙·자료 처리·오류 유형 관리','문서 버전·추출 항목·판단 기록 구조','다른 대상·단위·추출 실패의 예외 처리','명칭과 날짜 중심의 첫 검토 보조 범위','문서 형식과 품질 검수의 비용·일정','비공개 자료와 AI 판단의 사용 범위','오류 사례·권한·규칙 변경의 운영 인수']),
  faq:[
    {question:'문서에 차이가 있으면 AI가 바로 수정하나요?',answer:'차이는 오류일 수도 있고 문서 목적이나 기준 시점에 따른 표현 차이일 수도 있습니다. 원문 위치와 문맥을 제시하고 담당자가 실제 수정 필요 여부를 확인한 뒤 개정 절차로 연결하는 방식이 적절합니다.'},
    {question:'숫자가 다르면 모두 불일치인가요?',answer:'단위와 집계 범위, 기준 날짜 및 반올림의 영향을 확인해야 합니다. AI는 비교할 후보와 근거를 제시하고 같은 대상을 같은 조건에서 비교할 수 있는지는 담당자가 판단하도록 설계합니다.'},
    {question:'스캔 문서와 복잡한 표도 완전히 읽을 수 있나요?',answer:'문서 품질과 형식에 따라 읽기 오류가 발생할 수 있습니다. 읽지 못한 페이지나 표를 표시하고 해당 위치를 판단 보류로 남겨 전체 검사를 마친 것처럼 보이지 않도록 해야 합니다.'},
    {question:'검사 결과가 없으면 제출 문서가 정확한가요?',answer:'정해진 규칙에서 차이를 찾지 못했다는 의미이며 문서 전체의 정확성이나 규제 적합성을 보장하지 않습니다. 검사 범위와 누락된 자료를 표시하고 전문 검토와 제출 승인 책임을 유지해야 합니다.'},
    {question:'비공개 문서를 외부 AI 서비스로 보내도 되나요?',answer:'회사 정책과 실제 계약, 처리 목적에 맞는 허용 범위를 먼저 확인해야 합니다. 전달 내용과 보존·학습 사용 조건을 정하고 내부 처리 등 가능한 방식의 비용과 운영 책임을 비교합니다.'},
    {question:'첫 도입의 품질은 어떻게 확인하나요?',answer:'사람이 확인한 실제 차이와 허용된 표현 차이, 추출 실패 사례를 포함한 문서 묶음으로 검수합니다. 놓친 항목과 잘못 표시한 항목을 기록하고 담당자가 원문을 찾아 판단할 수 있는지 확인합니다.'},
  ],
  relatedRoutes:[
    {href:'/development-agency/management/의약품개발사/',label:'문서 준비와 검토 상태 관리',reason:'AI가 제시한 수정 후보를 실제 문서 버전과 담당자의 검토 업무에 연결합니다.'},
    {href:'/development-agency/portal/의약품개발사/',label:'기관별 제공 문서 버전 관리',reason:'비교할 수 있는 내부 자료와 외부 제공본의 접근·승인 범위를 구분합니다.'},
    {href:'/development-agency/ai/바이오테크업체/',label:'문헌 주장과 원문 근거 검토',reason:'문서 간 표현 대조와 외부 문헌의 연구 조건 확인의 다른 검토 목적을 비교합니다.'},
    {href:'/development-agency/web-app-security-review-scope/',label:'개발 문서와 AI 처리 권한 검토',reason:'원문·추출 내용·검색·검사 결과에 동일한 접근 범위를 적용하는지 확인합니다.'},
    {href:'/source-handover/',label:'문서 대조 AI의 검수·운영 인수',reason:'추출 실패와 재검사, 규칙 변경 및 사용량·자료 보관 책임을 정리합니다.'},
  ],
  ctaContext:'대조할 개발 문서와 버전, 실제 발견한 명칭·날짜·수치 차이의 예시를 알려 주세요. 원문 근거와 담당자 판단을 남기는 의약품개발사 AI 검토 보조 범위를 정리합니다.',
  evidenceSources:[
    {title:'OWASP 생성형 AI 프롬프트 주입 위험 안내',url:'https://genai.owasp.org/llmrisk/llm01-prompt-injection/',use:'외부 문서에 포함된 지시가 모델의 동작을 바꾸려는 위험을 참고했습니다. 문서는 검토할 자료로 취급하며 개발 문서의 전문 판단은 담당자가 수행합니다.'},
  ],
};
