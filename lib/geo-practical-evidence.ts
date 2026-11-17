export type PracticalEvidenceRecord = {
  id: string;
  title: string;
  answer: string;
  rows: [string, string, string][];
  sources: { title: string; url: string }[];
};

/** Original acceptance worksheets, not customer case studies or measured results. */
export const GEO_PRACTICAL_EVIDENCE: Record<string, PracticalEvidenceRecord> = {
  '/guide/enterprise-ai-adoption/': {
    id: 'ai-poc-acceptance',
    title: '기업 AI PoC의 통과 기준은 어떻게 정하나요?',
    answer: '모델 시연보다 먼저 업무 질문, 정답의 근거, 사용자 권한, 사람의 승인과 실패 시 처리 방식을 함께 정합니다. 같은 질문과 자료로 반복 확인하고, 통과 기준은 업무의 위험과 운영 조건에 맞춰 사전에 합의합니다.',
    rows: [
      ['업무 범위', '사용자 역할과 한 번에 끝내야 할 작업을 적고, 현재 처리 방법과 AI 적용 후 기대 결과를 같은 항목으로 비교합니다.', '업무 질문·기대 결과·제외 범위'],
      ['자료와 권한', '일반 사용자와 관리자가 같은 질문을 했을 때 각자 허용된 자료만 검색·열람할 수 있는지 확인합니다.', '역할별 조회·차단 시험 기록'],
      ['근거 없는 질문', '정답 문서가 없거나 자료가 오래된 질문을 넣고, 답변 보류·추가 확인·담당자 연결 중 합의한 절차로 이어지는지 확인합니다.', '보류 사유와 다음 처리 담당자'],
      ['외부 작업 실행', '답안 작성과 실제 발송·정보 변경을 나누고, 영향이 큰 작업은 담당자의 승인·거절 흐름을 각각 시험합니다.', '승인·거절·실패 시 처리 결과'],
    ],
    sources: [
      { title: 'Google Cloud — RAG의 검색·답변 평가', url: 'https://cloud.google.com/use-cases/retrieval-augmented-generation' },
      { title: 'OWASP — LLM01:2025 Prompt Injection 대응', url: 'https://genai.owasp.org/llmrisk/llm01-prompt-injection/' },
    ],
  },
  '/guide/rag-development/': {
    id: 'rag-retrieval-evaluation',
    title: 'RAG에서 검색 실패와 답변 실패를 어떻게 구분하나요?',
    answer: '정답 문서를 찾았는지와 찾은 문서에 맞게 답했는지를 따로 기록합니다. 검색 후보에 필요한 문서가 없으면 수집·분할·검색 조건부터 확인하고, 문서는 있는데 답이 틀리면 문맥 구성·인용 위치·답변 생성 단계를 점검합니다.',
    rows: [
      ['정답 문서 검색', '질문별 정답 문서 ID를 정한 뒤 같은 자료·검색 조건에서 필요한 문서가 검색 후보에 포함되는지 확인합니다.', '질문 ID·정답 문서 ID·검색 후보'],
      ['문서 버전과 인용', '이름이 비슷한 문서와 구버전을 함께 넣고, 답변에 사용한 정책의 유효일과 실제 인용 문단을 대조합니다.', '문서 버전·인용 위치·답변 판정'],
      ['자료 갱신과 권한 회수', '자료를 고치거나 사용자의 권한을 회수한 뒤 검색 후보, 출처 링크와 원문 열람을 각각 확인합니다.', '변경 시각·반영 시각·접근 결과'],
      ['문서 안의 악성 지시', '문서 내용에 명령을 섞은 시험 자료를 넣고, 외부 자료가 시스템 권한이나 승인 절차를 바꾸지 못하도록 검수합니다.', '시험 문서·차단 여부·검토 기록'],
    ],
    sources: [
      { title: 'Google Cloud — RAG 검색 평가와 개선 방법', url: 'https://cloud.google.com/blog/products/ai-machine-learning/optimizing-rag-retrieval' },
      { title: 'OWASP — 간접 프롬프트 인젝션과 권한 분리', url: 'https://genai.owasp.org/llmrisk/llm01-prompt-injection/' },
    ],
  },
  '/system/subscription-delivery/': {
    id: 'subscription-cycle-acceptance',
    title: '정기배송 주기와 회차별 할인은 어떻게 검수하나요?',
    answer: '구독의 기본 규칙과 각 회차 주문의 확정 금액을 구분합니다. 할인 기준을 생성 회차로 셀지 결제 완료 회차로 셀지 먼저 정하고, 건너뛰기·주기 변경·결제 실패에도 같은 규칙이 적용되는지 회차별로 대조합니다.',
    rows: [
      ['자동결제 주기', '토스페이먼츠 자동결제는 상점에서 스케줄을 구현해 승인 API를 호출하는 방식입니다. 빌링키 발급과 실제 회차 청구를 나눠 시험합니다.', '예정 회차·실행 시각·승인 응답'],
      ['회차별 할인', '할인 기준이 주문 생성인지 결제 완료인지 합의하고, 할인율을 바꿨을 때 기존 주문과 다음 주문에 적용할 규칙을 각각 확인합니다.', '적용 규칙·기준 금액·확정 금액'],
      ['중복 실행과 재시도', '같은 회차를 두 번 생성하거나 승인 요청을 재전송합니다. 회차 주문의 중복 방지와 PG의 중복 요청 방지 키(Idempotency-Key)를 나눠 확인합니다.', '구독·회차 ID·중복 요청 방지 키·승인 건수'],
      ['결제 결과 대조', '토스페이먼츠 자동결제는 결제 완료 웹훅을 보내지 않으므로 승인 응답과 결제 조회 결과로 상태를 대조하는 흐름을 확인합니다.', '상점 주문 상태·PG 결제 상태'],
      ['건너뛰기와 해지', '건너뛴 회차가 할인 횟수에 포함되는지 확인하고, 이미 승인된 주문의 처리와 이후 회차 생성을 따로 시험합니다.', '회차 이력·다음 생성 예정·처리 담당자'],
    ],
    sources: [
      { title: '토스페이먼츠 — 자동결제 스케줄 구현', url: 'https://docs.tosspayments.com/guides/v2/billing/integration' },
      { title: '토스페이먼츠 — 재시도와 중복 요청 방지', url: 'https://docs.tosspayments.com/reference/using-api/security-trust' },
      { title: '토스페이먼츠 — 결제 수단별 웹훅 이벤트', url: 'https://docs.tosspayments.com/reference/using-api/webhook-events' },
    ],
  },
};
