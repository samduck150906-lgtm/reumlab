/**
 * AI Worker 구축 — 상위 B2B 서비스 카테고리 (허브 /ai-worker/ + 역할별 스포크)
 * ------------------------------------------------------------------
 * 왜 새 축인가
 *  기존 AI 페이지 4종은 각각 "무엇으로 답하느냐"를 축으로 나뉘어 있다 —
 *    /ai-development/       고객 응대용 텍스트 챗봇
 *    /enterprise-ai/        사내 문서를 검색해 답하는 RAG
 *    /ai-voice-development/ 전화를 받아 대화하는 음성
 *    /ai-automation/        반복 업무를 줄이는 자동화(목적별 랜딩)
 *  그런데 실제 문의는 "답하는 것"이 아니라 "일하는 것"으로 들어온다 —
 *  "직원이 하던 걸 AI가 대신 처리하게 해 달라", "AI 직원 만들 수 있나요",
 *  "ERP에 입력까지 AI가 해 줄 수 있나요". 이 수요는 답변 생성이 아니라
 *  기존 시스템 접근·권한·예외 처리가 본질이라 위 네 페이지 어디에도 맞지 않는다.
 *
 *  그래서 "업무를 끝까지 수행하는 AI"를 상위 카테고리로 세우고,
 *  역할(사무·영업견적·문서)별 스포크를 둔다. 전화 응대 역할은 이미
 *  /ai-voice-development/ 가 있으므로 새로 만들지 않고 연결만 한다.
 *
 * 콘텐츠 원칙 (기존 서비스 페이지와 동일)
 *  - 고객사명·프로젝트명·실적 수치·평점·파트너십을 쓰지 않는다.
 *  - 만들어 본 적 없는 것을 만들어 봤다고 쓰지 않는다. "구현 가능한 구성"으로 적는다.
 *  - 업종별 사례는 상담에서 반복된 업무 "유형"이며 특정 고객사 도입 사례가 아니다.
 *  - 정확도·절감률처럼 운영 데이터 없이는 확인할 수 없는 수치를 보장하지 않는다.
 *  - 스포크 3종은 서로 다른 연결 시스템·권한·예외 조건을 갖는다(색인 게이트가 중복을 검사).
 */
import { SITE } from './seo';
import { decideFromContent, fingerprint, type IndexDecision } from './index-quality';

export const AI_WORKER_PATH = '/ai-worker/';
export const AI_WORKER_CANONICAL = `${SITE.domain}${AI_WORKER_PATH}`;

export const AI_WORKER_TITLE = 'AI Worker 구축 | 업무를 끝까지 수행하는 맞춤형 AI 직원 — 름랩 REUMLAB';
export const AI_WORKER_DESCRIPTION =
  '직원이 반복하는 업무를 처음부터 끝까지 수행하는 맞춤형 AI를 구축합니다. 기존 웹·ERP·CRM·문서·메일에 연결해 조회·입력·회신까지 처리하고, 판단이 필요한 예외만 사람에게 넘깁니다. API가 없는 시스템은 화면 조작(Computer Use)으로 연결하며, 권한은 읽기·쓰기·확인요청·사람전담 4단계로 설계합니다.';
export const AI_WORKER_H1 = 'AI Worker 구축';
export const AI_WORKER_EYEBROW = 'AI 업무 수행 시스템';
export const AI_WORKER_LEAD =
  '질문에 답하는 AI가 아니라, 직원이 반복하던 업무를 처음부터 끝까지 수행하는 AI를 만듭니다. 어떤 업무를 맡길지, 어떤 시스템에 어디까지 손대게 할지, 무엇은 반드시 사람이 확인할지를 먼저 정하고 구축합니다.';
export const AI_WORKER_KEYWORDS = [
  'AI 직원 개발',
  'AI Worker 구축',
  'AI 업무 자동화',
  'AI 에이전트 개발',
  '기업 AI 자동화',
  'AI 사무 자동화',
  'ERP AI 자동화',
  'Computer Use 개발',
  'AI 영업 자동화',
  'AI 문서 자동화',
];

/**
 * 이 페이지가 "AI Worker란 무엇인가"에 내놓는 공식 한 문장.
 * 생성형 검색이 그대로 인용하는 자리라 본문·구조화 데이터·llms.txt 가 같은 문장을 쓴다.
 * 브랜드 토큰은 사이트 표기 규칙(lib/seo.ts SITE.name)을 따라 '름랩'으로 적는다.
 */
export const AI_WORKER_ENTITY_STATEMENT =
  '름랩 AI Worker는 단순히 질문에 답하는 챗봇이 아니라, 기업의 기존 웹·ERP·CRM·문서·메일과 연결해 정해진 업무를 수행하고 예외 상황을 사람에게 전달하도록 구축하는 맞춤형 AI 업무 자동화 시스템입니다.';

// ── 2. 문제 — 사람이 여러 시스템을 오가는 반복업무 ──
export const PROBLEMS_LEAD =
  '자동화가 안 되는 업무의 공통점은 어렵다는 것이 아니라, 한 건을 끝내려면 화면 네다섯 개를 오가야 한다는 것입니다.';
export const PROBLEMS: { title: string; body: string }[] = [
  {
    title: '한 건에 화면 네다섯 개',
    body: '메일에서 요청을 읽고, ERP에서 재고를 확인하고, 엑셀에 옮겨 적고, CRM에 기록하고, 다시 메일로 회신합니다. 각 단계는 1분이지만 화면을 오가는 동안 흐름이 끊겨 한 건에 20분이 듭니다.',
  },
  {
    title: '규칙은 있는데 문서에 없다',
    body: '"이 거래처는 단가표가 다르다", "이 항목은 팀장 확인을 받는다" 같은 규칙이 담당자 머릿속에만 있습니다. 그래서 담당자가 자리를 비우면 업무가 멈추고, 인수인계에 몇 주가 걸립니다.',
  },
  {
    title: '시스템에 API가 없다',
    body: '오래된 사내 시스템, 거래처가 쓰라고 준 웹 포털, 구독 중인 SaaS 중에는 외부 연동 창구가 아예 없는 것이 많습니다. 자동화 이야기가 여기서 멈춥니다.',
  },
  {
    title: '챗봇을 붙였지만 일은 그대로',
    body: '문의에 답은 하는데 접수·입력·회신은 사람이 다시 합니다. 답변만 자동화하면 업무량은 줄지 않고 확인할 창구만 하나 늘어납니다.',
  },
  {
    title: '예외가 무서워 전면 도입을 못 한다',
    body: '100건 중 95건은 규칙대로인데 5건이 예외입니다. 그 5건 때문에 전체를 자동화하지 못하고 95건도 계속 손으로 처리합니다.',
  },
];

// ── 3. AI Worker 정의와 챗봇 차이 ──
export const DEFINITION_HEADING = 'AI Worker란 무엇인가';
export const DEFINITION_BODY =
  'AI Worker는 사람이 쓰던 업무 도구에 접근 권한을 받아, 정해진 절차대로 조회·판단·입력·회신까지 수행하는 AI입니다. 대화가 목적이 아니라 업무를 끝내는 것이 목적이므로, 성공 기준도 "답이 그럴듯한가"가 아니라 "그 건이 처리되었는가"입니다. 규칙에서 벗어나는 건은 스스로 처리하지 않고 담당자에게 넘깁니다.';
export const CHATBOT_COMPARE: { item: string; chatbot: string; worker: string }[] = [
  { item: '목적', chatbot: '질문에 답한다', worker: '업무를 끝까지 처리한다' },
  { item: '입력', chatbot: '사용자가 채팅창에 쓴 문장', worker: '메일·양식·전화·파일 등 업무가 실제로 들어오는 경로' },
  { item: '접근 범위', chatbot: '학습·제공된 텍스트', worker: '권한을 준 ERP·CRM·문서·메일·웹 화면' },
  { item: '산출물', chatbot: '답변 텍스트', worker: '등록된 레코드, 발송된 회신, 갱신된 문서' },
  { item: '성공 판정', chatbot: '사용자가 만족했는가', worker: '처리 건수·오류 건수·사람에게 넘긴 건수' },
  { item: '실패 처리', chatbot: '모른다고 답한다', worker: '처리를 멈추고 근거와 함께 담당자에게 넘긴다' },
];
export const CHATBOT_COMPARE_NOTE =
  '둘은 대체 관계가 아닙니다. 문의 응대가 목적이면 챗봇이 맞고, 응대 뒤에 남는 입력·회신까지 없애는 것이 목적이면 AI Worker가 맞습니다. 실제로는 챗봇으로 접수한 건을 AI Worker가 처리하도록 이어 붙이는 구성이 가장 많습니다.';

// ── 4. 다섯 가지 Worker ──
export interface WorkerCard {
  href: string;
  name: string;
  tagline: string;
  tasks: string[];
  systems: string;
  /** 이미 운영 중인 다른 서비스 페이지로 연결되는 역할 */
  external?: boolean;
}
export const WORKER_CARDS: WorkerCard[] = [
  {
    href: '/ai-voice-development/',
    name: 'AI 전화상담 직원',
    tagline: '전화를 받아 상담하고 예약·접수까지 기록합니다',
    tasks: ['걸려 오는 전화 응대', '예약·문의 접수', '상담 내용 요약 기록', '담당자 연결 판단'],
    systems: '전화 회선, 예약 시스템, CRM',
    external: true,
  },
  {
    href: '/ai-worker/office/',
    name: 'AI 사무직원',
    tagline: 'ERP·관리자 화면·엑셀·메일을 오가던 입력 업무를 대신합니다',
    tasks: ['메일로 온 요청 확인', 'ERP·관리자 화면 조회와 입력', '엑셀 대장 정리', '처리 결과 회신'],
    systems: 'ERP, 사내 관리자, 스프레드시트, 메일',
  },
  {
    href: '/ai-worker/sales/',
    name: 'AI 영업·견적 직원',
    tagline: '들어온 문의에서 요구사항과 예산을 정리해 견적 초안까지 만듭니다',
    tasks: ['문의 내용 정리', '요구사항·예산 확인 질문', '단가표 기준 견적 초안', 'CRM 기록과 담당자 배정'],
    systems: '문의 폼, 메일, 단가표, CRM',
  },
  {
    href: '/ai-worker/document/',
    name: 'AI 문서처리 직원',
    tagline: 'PDF·계약서에서 항목을 뽑아 비교하고 시스템에 입력합니다',
    tasks: ['PDF·스캔 문서 항목 추출', '이전 버전·기준 문서와 비교', '차이 표시와 검토 요청', '확인된 값만 시스템 입력'],
    systems: '문서 보관소, 계약 양식, ERP·회계 시스템',
  },
  {
    href: '/ai-worker/multimodal/',
    name: '멀티모달 AI Worker',
    tagline: '영상·사진·음성·문서를 이해해 현장 검수와 시스템 업무로 연결합니다',
    tasks: ['현장 사진·영상 검수', '통화·음성 업무 분석', '견적·보고 초안', 'ERP·CRM 후속 업무'],
    systems: '카메라, 통화 녹취, 문서, ERP·CRM·업무 시스템',
  },
];
export const WORKER_CARDS_NOTE =
  '다섯 역할을 한 번에 만들지 않습니다. 가장 반복이 많고 규칙이 분명한 업무 하나를 골라 먼저 세우고, 그 구조 위에 다음 역할을 붙입니다.';

// ── 5. Before / After ──
export interface FlowCompare {
  label: string;
  before: string[];
  after: string[];
  humanLeft: string;
}
export const BEFORE_AFTER: FlowCompare[] = [
  {
    label: '거래처 발주 메일 처리',
    before: [
      '담당자가 메일함에서 발주 메일을 연다',
      'ERP에서 품목 코드와 재고를 확인한다',
      '엑셀 발주 대장에 옮겨 적는다',
      'ERP에 발주를 등록한다',
      '확인 메일을 작성해 회신한다',
    ],
    after: [
      'AI가 메일을 읽어 품목·수량·납기를 뽑는다',
      'ERP에서 코드·재고를 조회한다',
      '재고가 충분하면 발주를 등록하고 대장을 갱신한다',
      '확인 메일 초안을 만들어 발송한다',
    ],
    humanLeft: '재고가 부족하거나 단가가 기준과 다른 건, 신규 거래처 건은 등록하지 않고 담당자에게 넘깁니다.',
  },
  {
    label: '신규 문의 견적 회신',
    before: [
      '문의 폼 알림을 확인한다',
      '내용을 읽고 빠진 정보를 메일로 되묻는다',
      '단가표를 열어 항목별로 계산한다',
      '견적서를 작성해 보낸다',
      'CRM에 기록하고 담당자를 지정한다',
    ],
    after: [
      'AI가 문의 내용을 항목으로 정리한다',
      '빠진 정보는 회신 메일로 되묻고 답을 받아 채운다',
      '단가표 기준으로 견적 초안을 만든다',
      'CRM에 기록하고 담당자에게 초안을 올린다',
    ],
    humanLeft: '금액 확정과 발송은 사람이 합니다. AI는 초안까지만 만듭니다.',
  },
];
export const BEFORE_AFTER_NOTE =
  '위 흐름은 구현 가능한 구성이며 특정 고객사의 도입 사례가 아닙니다. 실제 구축에서는 회사의 실제 화면과 규칙을 보고 단계를 다시 그립니다.';

// ── 6. 구축 방식 6단계 ──
export const BUILD_STEPS: { step: string; title: string; detail: string }[] = [
  {
    step: '1',
    title: '업무 분석',
    detail:
      '한 건이 들어와서 끝날 때까지의 화면과 판단을 그대로 적습니다. 담당자 머릿속에 있던 예외 규칙을 이 단계에서 글로 꺼내는 것이 전체 성패를 가릅니다.',
  },
  {
    step: '2',
    title: '도구 연결',
    detail:
      'AI가 만질 시스템을 정하고 연결 방식을 고릅니다. API가 있으면 API로, 없으면 사람과 같은 방식으로 화면을 조작합니다. 읽기만 되는 연결과 쓰기까지 되는 연결을 분리해 둡니다.',
  },
  {
    step: '3',
    title: '권한 설계',
    detail:
      '업무 항목마다 읽기·쓰기·확인요청·사람전담 중 하나를 지정합니다. 금액 확정·환불·계약처럼 되돌리기 어려운 동작은 기본값을 사람 확인으로 둡니다.',
  },
  {
    step: '4',
    title: '실행',
    detail:
      '정해진 절차대로 처리하게 하고 모든 동작을 기록에 남깁니다. 어떤 근거로 그렇게 처리했는지까지 남겨야 나중에 검증할 수 있습니다.',
  },
  {
    step: '5',
    title: '검증',
    detail:
      '처리 건수, 사람이 되돌린 건수, 사람에게 넘긴 건수를 봅니다. 되돌린 건이 반복되면 규칙이 잘못된 것이므로 1단계로 돌아가 절차를 고칩니다.',
  },
  {
    step: '6',
    title: '예외만 사람',
    detail:
      '규칙대로인 건은 AI가 끝내고, 규칙에서 벗어난 건만 근거와 함께 담당자에게 올라옵니다. 자동화의 목표는 전부를 맡기는 것이 아니라 사람이 볼 건수를 줄이는 것입니다.',
  },
];

// ── 7. API 시스템 vs API 없는 시스템 (Computer Use) ──
export const CONNECTION_LEAD =
  '"우리 시스템은 연동이 안 된다"는 이유로 멈춘 자동화가 많습니다. 연결 방식은 두 가지이고, 어느 쪽인지에 따라 비용과 안정성이 달라집니다.';
export const CONNECTION_MODES: { title: string; when: string; how: string; caution: string }[] = [
  {
    title: 'API가 있는 시스템',
    when: '자체 개발한 웹·앱, 공개 API를 제공하는 SaaS, 연동 규격이 있는 ERP·CRM',
    how: '정해진 창구로 데이터를 주고받습니다. 화면이 바뀌어도 영향이 없고, 실패했을 때 원인을 정확히 알 수 있어 가장 안정적입니다.',
    caution: '권한 범위를 계정 단위로 나눠 두어야 합니다. 관리자 키 하나로 전부 열어 두면 사고 범위가 곧 시스템 전체가 됩니다.',
  },
  {
    title: 'API가 없는 시스템 (Computer Use)',
    when: '오래된 사내 프로그램, 거래처가 준 웹 포털, 연동 창구를 열어 주지 않는 구독 서비스',
    how: 'AI가 사람과 같은 방식으로 화면을 보고 클릭·입력합니다. 시스템을 고치지 않아도 되므로 거래처 시스템처럼 우리가 손댈 수 없는 곳에 쓸 수 있습니다.',
    caution:
      '화면이 바뀌면 동작이 깨집니다. 그래서 읽기·조회부터 적용하고, 쓰기 동작은 실패를 전제로 확인 단계를 둡니다. API 연결보다 느리고 유지보수가 더 듭니다.',
  },
];
export const CONNECTION_NOTE =
  '실제 구축에서는 두 방식을 섞습니다. 사내 시스템은 API로 연결해 안정성을 확보하고, 거래처 포털처럼 손댈 수 없는 곳만 화면 조작으로 처리하는 식입니다. 어느 쪽으로 갈지는 시스템 목록을 보고 정합니다.';

// ── 8. 권한 4단계 ──
export const PERMISSION_LEVELS: { level: string; name: string; meaning: string; example: string }[] = [
  {
    level: 'READ',
    name: '읽기',
    meaning: '조회만 합니다. 어떤 값도 바꾸지 않습니다.',
    example: '재고 확인, 주문 상태 조회, 계약서 항목 추출',
  },
  {
    level: 'WRITE',
    name: '쓰기',
    meaning: '되돌릴 수 있는 범위에서 직접 기록합니다.',
    example: '접수 등록, 상담 기록 저장, 대장 행 추가',
  },
  {
    level: 'CONFIRM',
    name: '확인 요청',
    meaning: 'AI가 초안까지 만들고 사람이 승인해야 실행됩니다.',
    example: '견적 금액 확정, 외부 발송 메일, 단가 변경',
  },
  {
    level: 'HUMAN',
    name: '사람 전담',
    meaning: 'AI가 아예 손대지 않습니다. 판단 근거만 정리해 올립니다.',
    example: '계약 체결, 환불·결제 취소, 개인정보 열람이 필요한 업무',
  },
];
export const PERMISSION_NOTE =
  '처음에는 대부분의 항목을 읽기와 확인 요청으로 시작합니다. 운영 기록을 보고 되돌린 건이 거의 없는 항목부터 쓰기로 옮깁니다. 반대 순서로 하면 사고가 난 뒤에 권한을 회수하게 됩니다.';

// ── 9. 업종별 활용 구성 ──
export const INDUSTRY_CASES: { industry: string; task: string; flow: string }[] = [
  {
    industry: '제조·유통',
    task: '거래처 발주·재고 확인',
    flow: '발주 메일에서 품목·수량을 뽑아 ERP 재고를 조회하고, 기준을 만족하면 발주를 등록한 뒤 확인 메일을 회신합니다. 재고 부족·단가 불일치는 담당자에게 넘깁니다.',
  },
  {
    industry: '건설·설비',
    task: '현장 견적 요청 정리',
    flow: '들어온 요청에서 위치·공정·일정·예산을 항목으로 정리하고 빠진 정보를 되묻습니다. 단가표 기준 견적 초안을 만들어 담당자 승인 대기 상태로 올립니다.',
  },
  {
    industry: '병의원·전문 서비스',
    task: '예약 접수와 기록',
    flow: '전화·웹으로 들어온 예약을 접수해 일정에 등록하고 상담 요약을 남깁니다. 진료·처치 판단이 필요한 문의는 응답하지 않고 담당자에게 연결합니다.',
  },
  {
    industry: '물류·수출입',
    task: '서류 항목 대조',
    flow: '인보이스·패킹리스트에서 항목을 추출해 주문 정보와 대조하고, 불일치 항목만 표로 정리해 검토를 요청합니다. 확인된 값만 시스템에 입력합니다.',
  },
  {
    industry: '교육·학원',
    task: '상담 문의 배정',
    flow: '문의 내용을 과정·지역·학년으로 분류해 담당 상담자에게 배정하고, 안내 자료 발송과 CRM 기록까지 처리합니다. 환불·분쟁 문의는 사람 전담입니다.',
  },
];
export const INDUSTRY_CASES_NOTE =
  '상담에서 반복적으로 나온 업무 유형을 구현 가능한 구성으로 적은 것이며, 특정 고객사의 도입 사례나 성과가 아닙니다.';

// ── 10. 구축 프로세스 ──
export const PROCESS: { title: string; detail: string }[] = [
  {
    title: '업무 진단',
    detail:
      '자동화 후보 업무를 반복 횟수와 규칙의 명확성으로 줄 세웁니다. 이 단계에서 "지금 만들면 안 되는 업무"를 걸러 내는 것이 더 중요합니다.',
  },
  {
    title: '범위 확정과 권한 합의',
    detail:
      '첫 Worker가 맡을 업무 하나를 정하고, 항목마다 읽기·쓰기·확인요청·사람전담을 문서로 합의합니다. 접근할 계정과 권한 범위도 여기서 정합니다.',
  },
  {
    title: '연결과 구현',
    detail:
      'API 연결과 화면 조작 연결을 구성하고 절차를 구현합니다. 모든 동작이 기록에 남도록 함께 만듭니다.',
  },
  {
    title: '병행 운영',
    detail:
      '일정 기간 사람이 하던 방식과 나란히 돌립니다. AI 처리 결과를 사람이 확인만 하고, 차이가 나는 건을 모아 절차를 고칩니다.',
  },
  {
    title: '권한 확대와 이관',
    detail:
      '되돌린 건이 없는 항목부터 확인 요청을 쓰기로 옮깁니다. 소스코드와 API 키는 대표님이 직접 보유하도록 이관하고, 절차를 고치는 방법을 교육합니다.',
  },
];
export const PROCESS_NOTE =
  '첫 산출물은 "업무 하나를 끝까지 처리하는 Worker 1종 + 처리 기록 화면"입니다. 기간은 연결할 시스템 수와 권한 확인 절차에 따라 달라지므로, 시스템 목록을 본 뒤 범위와 함께 알려 드립니다.';

// ── 11. 비용 결정요소 ──
export const COST_FACTORS: { factor: string; detail: string }[] = [
  {
    factor: '연결할 시스템 수와 방식',
    detail:
      'API가 있는 시스템 하나를 붙이는 것과, API가 없어 화면 조작으로 붙이는 것은 구현량과 유지보수가 다릅니다. 화면 조작 연결은 화면이 바뀌면 손봐야 하므로 운영 비용이 더 듭니다.',
  },
  {
    factor: '업무 규칙의 복잡도',
    detail:
      '분기가 적고 예외가 분명한 업무는 빠르게 세워집니다. 거래처마다 단가·절차가 다르거나 담당자 재량이 큰 업무는 규칙을 정리하는 단계부터 시간이 듭니다.',
  },
  {
    factor: '쓰기 권한 범위',
    detail:
      '읽기만 하는 Worker는 검증이 단순합니다. 쓰기까지 하면 되돌리기·중복 방지·실패 복구를 함께 만들어야 해 범위가 늘어납니다.',
  },
  {
    factor: '문서 형태',
    detail:
      '항목이 일정한 전자문서는 바로 읽을 수 있습니다. 스캔본·손글씨·양식이 제각각인 문서는 전처리와 검수 절차가 추가됩니다.',
  },
  {
    factor: '처리량과 모델 사용량',
    detail:
      '월 처리 건수와 문서 길이에 따라 외부 AI 사용료가 달라집니다. 사용료는 개발비와 별도이며, 대표님 명의 키로 직접 결제하도록 이관합니다.',
  },
  {
    factor: '운영 기간과 절차 수정',
    detail:
      '병행 운영 기간 동안 절차를 고치는 횟수도 비용에 들어갑니다. 처음부터 완성하려 하기보다 한 업무를 세우고 다듬는 편이 총비용이 낮습니다.',
  },
];
export const COST_NOTE =
  '금액은 업무 범위와 시스템 목록을 확인한 뒤 정합니다. 운영 데이터가 없는 상태에서 처리 정확도나 인건비 절감률을 보장하지 않습니다.';

// ── 12. FAQ ──
export const FAQS: { q: string; a: string }[] = [
  {
    q: 'AI Worker는 챗봇과 무엇이 다른가요?',
    a: '챗봇은 질문에 답하는 것이 목적이고, AI Worker는 업무를 끝내는 것이 목적입니다. 챗봇이 문의에 답한 뒤 접수·입력·회신을 사람이 다시 한다면 업무량은 줄지 않습니다. AI Worker는 권한을 받은 시스템에 직접 조회·입력하고 회신까지 처리하며, 규칙에서 벗어난 건만 담당자에게 넘깁니다.',
  },
  {
    q: '우리 시스템에 API가 없는데 연동이 가능한가요?',
    a: '가능합니다. AI가 사람과 같은 방식으로 화면을 보고 클릭·입력하는 방식(Computer Use)으로 연결합니다. 시스템을 고치지 않아도 되므로 거래처가 준 포털처럼 우리가 손댈 수 없는 곳에도 적용할 수 있습니다. 다만 화면이 바뀌면 동작이 깨지므로 조회부터 적용하고 쓰기 동작에는 확인 단계를 둡니다.',
  },
  {
    q: 'AI가 잘못 처리하면 어떻게 되나요?',
    a: '되돌리기 어려운 동작은 처음부터 AI에게 맡기지 않습니다. 금액 확정·외부 발송·계약·환불은 기본값이 사람 확인이거나 사람 전담입니다. 모든 동작은 근거와 함께 기록에 남기므로 어떤 판단으로 그렇게 처리했는지 확인하고 되돌릴 수 있습니다.',
  },
  {
    q: '기존 ERP나 그룹웨어를 바꿔야 하나요?',
    a: '바꾸지 않습니다. AI Worker는 지금 쓰는 시스템에 계정과 권한을 받아 들어가는 방식이라 시스템 교체가 전제가 아닙니다. 다만 접근 권한을 어디까지 줄지는 반드시 먼저 합의합니다.',
  },
  {
    q: '어떤 업무부터 시작하는 것이 좋나요?',
    a: '반복 횟수가 많고 규칙이 분명하며, 잘못돼도 되돌릴 수 있는 업무부터 시작합니다. 접수 등록·조회·정리처럼 읽기와 기록 중심의 업무가 첫 대상으로 적합합니다. 반대로 재량 판단이 크거나 외부로 나가는 업무는 뒤로 미룹니다.',
  },
  {
    q: '직원을 줄이려는 목적에도 맞나요?',
    a: '저희가 약속할 수 있는 것은 사람이 확인해야 할 건수를 줄이는 것까지입니다. 인원 감축 효과는 업무 구성과 처리량에 따라 달라서 운영 데이터 없이 수치로 보장하지 않습니다. 병행 운영 기간의 처리 기록을 보고 판단하시는 편이 정확합니다.',
  },
  {
    q: '만든 다음 우리가 직접 수정할 수 있나요?',
    a: '소스코드와 API 키를 대표님이 직접 보유하도록 이관합니다. 업무 규칙과 권한 설정은 화면에서 고칠 수 있게 만들고, 절차를 바꾸는 방법을 교육합니다. 구조 자체를 바꾸는 변경은 별도 범위로 진행합니다.',
  },
  {
    q: '개인정보가 포함된 업무도 맡길 수 있나요?',
    a: '업무에 따라 다릅니다. 개인정보 열람이 필요한 항목은 기본적으로 사람 전담으로 두고, AI에게는 처리에 필요한 최소 항목만 전달하는 구조로 설계합니다. 실제 자료 형태와 보관 정책을 확인한 뒤 가능한 범위를 먼저 알려 드립니다.',
  },
];

// ── 13~14. CTA·내부링크 ──
export const CTA_LEAD =
  '어떤 업무를 맡기고 싶은지, 그 업무가 어떤 화면을 오가는지만 알려 주세요. 지금 자동화할 수 있는 업무인지, 먼저 정리해야 할 규칙이 무엇인지부터 말씀드립니다.';
export const RELATED_LINKS: { href: string; label: string; note: string }[] = [
  {
    href: '/ai-voice-development/',
    label: 'AI 음성 상담·전화 자동화 개발',
    note: '전화를 받아 상담·예약·접수까지 처리하는 역할입니다. AI Worker 의 전화 응대 축을 따로 다룹니다.',
  },
  {
    href: '/enterprise-ai/',
    label: '사내 AI·기업용 AI 구축',
    note: '업무 수행이 아니라 사내 문서를 검색해 임직원 질문에 답하는 것이 목적이라면 이쪽입니다.',
  },
  {
    href: '/ai-development/',
    label: 'AI 외주개발 (챗봇·상담 자동화)',
    note: '고객 응대용 챗봇이나 AI 기능 하나를 최소 범위로 붙이려는 경우입니다.',
  },
  {
    href: '/ai-automation/',
    label: 'AI 업무 자동화',
    note: '자동화할 업무가 아직 정해지지 않았다면 어떤 업무부터 후보가 되는지 여기서 확인하세요.',
  },
  {
    href: '/erp/',
    label: 'ERP·관리 시스템 구축',
    note: 'AI가 들어가 일할 시스템 자체가 아직 없다면 업무 시스템부터 만들어야 합니다.',
  },
  {
    href: '/admin-page-development/',
    label: '관리자 페이지 개발',
    note: '처리 기록을 보고 규칙을 고칠 화면이 필요할 때 함께 검토합니다.',
  },
  {
    href: '/source-handover/',
    label: '소스코드·API 키 이관 조건',
    note: '구축 후 소유권과 운영 권한을 어떻게 넘겨받는지 정리해 두었습니다.',
  },
];

// ── 역할별 스포크 (3종) ──
export interface WorkerDef {
  slug: string;
  /** 화면 표시명 = H1 기반 */
  name: string;
  primary: string;
  secondary: string[];
  lead: string;
  /** 이 역할이 실제로 끝내는 업무 */
  duties: string[];
  /** 연결하는 시스템과 연결 방식 */
  connections: { system: string; mode: string }[];
  /** 권한 4단계를 이 역할에 적용한 배치 */
  permissions: { level: string; items: string[] }[];
  /** 사람에게 넘기는 조건 */
  handoff: string[];
  /** 1차 구축 범위(산출물) */
  scope: string[];
  /** 비용·기간을 좌우하는 이 역할 고유 요인 */
  drivers: string[];
  /** 적합 / 부적합 */
  fit: { good: string[]; bad: string[] };
  faqs: { q: string; a: string }[];
  related: { href: string; label: string }[];
}

export const WORKERS: WorkerDef[] = [
  {
    slug: 'office',
    name: 'AI 사무직원',
    primary: 'AI 사무 자동화',
    secondary: ['ERP AI 자동화', 'AI 업무 대행 시스템', '엑셀 업무 자동화', '사무직 AI 도입'],
    lead:
      'ERP와 사내 관리자 화면, 엑셀 대장, 메일을 오가며 처리하던 입력 업무를 AI가 대신합니다. 조회와 기록은 AI가 끝내고, 기준에서 벗어난 건만 담당자에게 올라옵니다.',
    duties: [
      '메일·양식으로 들어온 요청에서 처리에 필요한 항목을 뽑습니다',
      'ERP·관리자 화면에서 재고·상태·이력을 조회합니다',
      '기준을 만족하는 건을 등록하고 대장·시트를 갱신합니다',
      '처리 결과를 정해진 문구로 회신합니다',
      '처리·보류 건을 기록 화면에 남깁니다',
    ],
    connections: [
      { system: '사내 ERP·관리 시스템', mode: '연동 창구가 있으면 API, 없으면 화면 조작' },
      { system: '스프레드시트·엑셀 대장', mode: '시트 API 또는 파일 읽기·쓰기' },
      { system: '업무용 메일함', mode: '메일 API (읽기 전용 계정에서 시작)' },
      { system: '사내 관리자 페이지', mode: '전용 계정 로그인 후 화면 조작' },
    ],
    permissions: [
      { level: 'READ', items: ['재고·단가 조회', '주문·처리 이력 조회', '메일 수신함 읽기'] },
      { level: 'WRITE', items: ['접수 건 등록', '대장 행 추가', '처리 메모 기록'] },
      { level: 'CONFIRM', items: ['외부로 나가는 회신 메일', '기존 레코드 수정', '기준과 다른 수량·단가 적용'] },
      { level: 'HUMAN', items: ['결제·정산 실행', '거래처 정보 변경', '개인정보 열람이 필요한 처리'] },
    ],
    handoff: [
      '재고·수량이 기준을 만족하지 않는 건',
      '단가표에 없는 항목이거나 거래처별 예외 단가가 걸린 건',
      '처음 보는 거래처·신규 계정에서 들어온 요청',
      '같은 내용이 중복으로 들어와 어느 쪽이 유효한지 판단이 필요한 건',
      '연결된 시스템이 응답하지 않아 처리 결과를 확인할 수 없는 건',
    ],
    scope: [
      '업무 한 종류를 끝까지 처리하는 Worker 1종',
      '처리·보류·실패 건을 볼 수 있는 기록 화면',
      '권한 4단계 설정과 담당자 알림 규칙',
      '병행 운영 기간의 차이 비교 기록',
    ],
    drivers: [
      'ERP에 연동 창구가 있는지 — 없으면 화면 조작으로 붙여야 해 구현·유지보수가 늘어납니다',
      '엑셀 대장의 서식이 일정한지 — 시트마다 열이 다르면 정리 규칙부터 만들어야 합니다',
      '거래처별 예외 규칙의 수 — 예외가 많을수록 분기와 검증이 늘어납니다',
      '쓰기 범위 — 조회만 할 때와 등록까지 할 때는 실패 복구 설계가 달라집니다',
    ],
    fit: {
      good: [
        '같은 형태의 요청이 매일 반복되고 처리 규칙이 문서로 설명 가능한 경우',
        '담당자가 화면 서너 개를 오가며 옮겨 적는 일에 시간을 쓰는 경우',
        'ERP·관리 시스템이 이미 있고 그 안에서 업무가 끝나는 경우',
      ],
      bad: [
        '업무 규칙이 담당자 재량에 크게 의존해 글로 적기 어려운 경우',
        '처리할 시스템 자체가 아직 없고 엑셀 파일만 있는 경우 — 업무 시스템부터 만드는 편이 빠릅니다',
        '월 처리 건수가 적어 사람이 처리하는 편이 저렴한 경우',
      ],
    },
    faqs: [
      {
        q: 'ERP에 API가 없어도 되나요?',
        a: '됩니다. AI가 전용 계정으로 로그인해 사람과 같은 방식으로 화면을 조작합니다. 다만 화면이 바뀌면 손봐야 하므로, 조회부터 적용하고 등록·수정 동작에는 확인 단계를 둡니다.',
      },
      {
        q: '엑셀 파일이 여러 개인데 정리되나요?',
        a: '서식이 일정하면 바로 읽습니다. 시트마다 열 이름과 순서가 다르면 어떤 열이 무엇인지 기준을 먼저 정해야 하고, 그 정리 작업이 범위에 포함됩니다. 실제 파일을 보고 필요한 준비를 알려 드립니다.',
      },
      {
        q: '잘못 등록되면 되돌릴 수 있나요?',
        a: '등록 동작은 되돌릴 수 있는 범위에서만 쓰기 권한을 줍니다. 모든 동작에 어떤 근거로 처리했는지가 기록되므로 해당 건을 찾아 취소하거나 수정할 수 있습니다. 되돌리기 어려운 동작은 사람 확인 뒤에만 실행됩니다.',
      },
      {
        q: '기존 담당자는 무엇을 하게 되나요?',
        a: '보류로 올라온 건을 판단하고 규칙을 고치는 일을 하게 됩니다. 병행 운영 기간에는 AI 처리 결과를 확인하는 역할도 겸합니다.',
      },
      {
        q: '어느 정도 기간이 걸리나요?',
        a: '업무 한 종류와 연결 시스템 수에 따라 달라집니다. 연동 창구가 있는 시스템 두세 개로 업무 하나를 세우는 범위가 가장 짧고, 화면 조작 연결이 섞이면 늘어납니다. 시스템 목록을 확인한 뒤 기간과 범위를 함께 알려 드립니다.',
      },
    ],
    related: [
      { href: '/ai-worker/', label: 'AI Worker 구축 전체 보기' },
      { href: '/erp/', label: 'ERP·관리 시스템 구축' },
      { href: '/admin-page-development/', label: '관리자 페이지 개발' },
      { href: '/ai-worker/document/', label: '문서에서 항목을 뽑는 AI 문서처리 직원' },
      { href: '/ai-automation/', label: 'AI 업무 자동화' },
    ],
  },
  {
    slug: 'sales',
    name: 'AI 영업·견적 직원',
    primary: 'AI 영업 자동화',
    secondary: ['AI 견적 자동화', '문의 응대 자동화', 'CRM AI 연동', '영업 리드 자동 분류'],
    lead:
      '들어온 문의에서 요구사항과 예산을 정리하고, 빠진 정보는 되물어 채운 뒤 단가표 기준으로 견적 초안까지 만듭니다. 금액 확정과 발송은 사람이 합니다.',
    duties: [
      '문의 폼·메일로 들어온 내용을 항목으로 정리합니다',
      '판단에 필요한데 빠진 정보를 회신으로 되묻고 답을 채웁니다',
      '단가표와 기준 범위에 맞춰 견적 초안을 만듭니다',
      'CRM에 기록하고 규칙에 따라 담당자를 배정합니다',
      '응답이 없는 건을 정해진 간격으로 다시 안내합니다',
    ],
    connections: [
      { system: '문의 폼·랜딩 제출', mode: '폼 수신 연동 (기존 제출 경로 그대로)' },
      { system: '업무용 메일함', mode: '메일 API — 수신 읽기와 초안 작성' },
      { system: '단가표·견적 기준', mode: '시트 또는 사내 기준 문서 읽기' },
      { system: 'CRM·영업 관리', mode: '연동 창구가 있으면 API, 없으면 화면 조작' },
    ],
    permissions: [
      { level: 'READ', items: ['문의 내용 읽기', '단가표 조회', '이전 상담 이력 조회'] },
      { level: 'WRITE', items: ['CRM 리드 등록', '상담 기록 저장', '담당자 배정'] },
      { level: 'CONFIRM', items: ['고객에게 나가는 회신 메일', '견적 초안 발송', '재안내 메일'] },
      { level: 'HUMAN', items: ['최종 금액 확정', '할인·예외 단가 승인', '계약 조건 협의'] },
    ],
    handoff: [
      '단가표로 계산되지 않는 요구사항이 섞인 건',
      '예산이 기준 범위를 크게 벗어나 조정이 필요한 건',
      '경쟁 비교·납기 협의처럼 협상이 시작된 건',
      '되묻기를 두 번 했는데도 판단할 정보가 모이지 않은 건',
      '기존 고객의 추가 요청이라 이전 계약 조건을 확인해야 하는 건',
    ],
    scope: [
      '문의 접수부터 견적 초안·CRM 기록까지 처리하는 Worker 1종',
      '견적 초안 검토·승인 화면',
      '되묻기 문구와 재안내 간격 설정',
      '담당자 배정 규칙과 알림',
    ],
    drivers: [
      '단가 구조가 표로 계산되는지 — 항목 조합이나 담당자 재량이 크면 초안 신뢰도가 떨어집니다',
      '문의 경로의 수 — 폼·메일·전화·메신저가 섞이면 수집 경로마다 연결이 필요합니다',
      'CRM 연동 방식 — API가 없으면 화면 조작으로 기록해야 합니다',
      '되묻기 대화의 깊이 — 한 번 묻고 끝나는지, 답에 따라 다시 묻는지에 따라 설계가 달라집니다',
    ],
    fit: {
      good: [
        '문의가 꾸준히 들어오는데 첫 회신이 늦어 이탈이 생기는 경우',
        '견적 항목이 표로 계산 가능하고 기준 단가가 정리돼 있는 경우',
        '리드 기록과 담당자 배정이 수기로 이뤄져 누락이 생기는 경우',
      ],
      bad: [
        '건마다 금액이 협의로 정해져 기준 단가가 없는 경우',
        '문의 건수가 적어 담당자가 직접 보는 편이 빠른 경우',
        '첫 응대부터 관계·협상이 중요해 초안 자동화가 오히려 손해인 경우',
      ],
    },
    faqs: [
      {
        q: 'AI가 견적을 고객에게 바로 보내나요?',
        a: '보내지 않습니다. 금액이 들어가는 회신은 기본값이 사람 확인입니다. AI는 항목을 정리하고 단가표 기준으로 초안까지 만들며, 확정과 발송은 담당자가 승인한 뒤에 이뤄집니다.',
      },
      {
        q: '단가표가 복잡한데 계산이 되나요?',
        a: '옵션·수량·등급처럼 규칙으로 표현되는 구조는 계산됩니다. 반대로 건마다 협의로 정해지는 구조라면 초안 대신 "요구사항 정리와 담당자 배정"까지만 맡기는 구성이 더 적합합니다.',
      },
      {
        q: '고객에게 되묻는 말투를 정할 수 있나요?',
        a: '정할 수 있습니다. 되묻기 문구와 재안내 간격은 설정값으로 두어 화면에서 고칠 수 있게 만듭니다. 기존 응대 메일이 있으면 그 문장을 기준으로 맞춥니다.',
      },
      {
        q: 'CRM을 새로 도입해야 하나요?',
        a: '지금 쓰는 CRM에 계정과 권한을 받아 기록하는 방식이라 교체가 전제는 아닙니다. CRM이 아예 없다면 스프레드시트를 기록처로 쓰거나, 관리 화면을 함께 만드는 범위로 검토합니다.',
      },
      {
        q: '문의가 광고·스팸이면 어떻게 하나요?',
        a: '분류 규칙을 두어 영업 대상이 아닌 문의는 등록하지 않고 별도 목록으로 모읍니다. 판단이 애매한 건은 등록하되 담당자 확인 표시를 달아 올립니다.',
      },
    ],
    related: [
      { href: '/ai-worker/', label: 'AI Worker 구축 전체 보기' },
      { href: '/ai-voice-development/', label: '전화 문의까지 AI가 받는 음성 상담 개발' },
      { href: '/ai-development/', label: '고객 응대용 AI 챗봇 개발' },
      { href: '/ai-worker/office/', label: '접수 뒤 입력까지 처리하는 AI 사무직원' },
      { href: '/mvp/', label: '문의 유입 화면부터 만드는 MVP 개발' },
    ],
  },
  {
    slug: 'document',
    name: 'AI 문서처리 직원',
    primary: 'AI 문서 자동화',
    secondary: ['계약서 검토 자동화', 'PDF 항목 추출', '문서 비교 자동화', '서류 입력 자동화'],
    lead:
      'PDF·계약서·거래 서류에서 필요한 항목을 뽑아 기준 문서나 시스템 값과 대조하고, 차이 나는 항목만 표로 정리해 검토를 요청합니다. 확인된 값만 시스템에 입력합니다.',
    duties: [
      '들어온 문서에서 정해진 항목을 추출합니다',
      '이전 버전·표준 양식·주문 정보와 값을 대조합니다',
      '일치하지 않는 항목만 근거 위치와 함께 정리합니다',
      '검토가 끝난 값을 시스템에 입력합니다',
      '문서와 처리 이력을 찾아볼 수 있게 남깁니다',
    ],
    connections: [
      { system: '문서 보관소·공유 드라이브', mode: '폴더 감시 또는 업로드 수신' },
      { system: '표준 양식·기준 문서', mode: '읽기 전용 참조' },
      { system: 'ERP·회계 시스템', mode: '연동 창구가 있으면 API, 없으면 화면 조작' },
      { system: '메일 첨부 수신', mode: '메일 API (첨부 파일 읽기)' },
    ],
    permissions: [
      { level: 'READ', items: ['문서 항목 추출', '기준 문서 대조', '이전 버전 조회'] },
      { level: 'WRITE', items: ['비교 결과 기록', '검토 요청 생성', '처리 이력 저장'] },
      { level: 'CONFIRM', items: ['추출 값의 시스템 입력', '문서 상태 변경', '담당자 배정 변경'] },
      { level: 'HUMAN', items: ['계약 체결·서명', '조항 해석이 필요한 판단', '법률 검토가 필요한 사안'] },
    ],
    handoff: [
      '문서 품질이 낮아 항목을 확실히 읽지 못한 건',
      '기준 문서에 없는 조항·항목이 새로 들어온 건',
      '숫자·날짜가 서로 다른 위치에서 다르게 적힌 건',
      '금액·기간처럼 잘못 입력하면 손해가 큰 항목의 값이 애매한 건',
      '문서 종류 자체가 처음 보는 양식인 건',
    ],
    scope: [
      '문서 종류 한 가지를 처리하는 Worker 1종',
      '추출 값과 근거 위치를 함께 보는 검토 화면',
      '불일치 항목 목록과 승인 흐름',
      '처리 이력·원본 문서 보관 규칙',
    ],
    drivers: [
      '문서가 전자문서인지 스캔본인지 — 스캔·손글씨는 전처리와 검수 절차가 추가됩니다',
      '양식의 가짓수 — 거래처마다 양식이 다르면 종류별로 규칙이 필요합니다',
      '대조 대상 — 이전 버전과만 비교하는지, 시스템 값까지 맞춰 보는지에 따라 연결이 늘어납니다',
      '월 처리 문서 수와 페이지 수 — 외부 AI 사용료에 직접 영향을 줍니다',
    ],
    fit: {
      good: [
        '같은 종류의 서류가 반복해서 들어오고 확인할 항목이 정해져 있는 경우',
        '사람이 눈으로 대조하다 숫자·날짜를 놓치는 일이 반복되는 경우',
        '문서 값을 다시 시스템에 옮겨 적는 이중 입력이 있는 경우',
      ],
      bad: [
        '문서마다 구조가 완전히 달라 확인할 항목을 미리 정할 수 없는 경우',
        '조항 해석과 법률 판단이 핵심인 업무 — 추출·대조까지만 맡기고 판단은 사람이 해야 합니다',
        '문서 보관·열람 자체에 강한 제약이 있어 외부 처리가 불가능한 경우',
      ],
    },
    faqs: [
      {
        q: '스캔한 계약서도 읽을 수 있나요?',
        a: '읽을 수 있지만 품질에 따라 정확도가 달라집니다. 그래서 추출 값에는 항상 원문 어느 위치에서 가져왔는지를 함께 표시하고, 확신이 낮은 항목은 자동 입력하지 않고 검토 요청으로 올립니다.',
      },
      {
        q: 'AI가 계약서를 검토해 주나요?',
        a: '항목 추출과 기준 대비 차이 표시까지 합니다. 조항이 우리에게 유리한지 같은 법률 판단은 하지 않습니다. 그 판단은 사람 전담으로 두고, AI는 무엇이 달라졌는지를 빠짐없이 보여 주는 역할을 맡습니다.',
      },
      {
        q: '문서가 외부로 나가지 않게 할 수 있나요?',
        a: '자료 성격에 따라 처리 위치와 보관 범위를 정합니다. 외부 AI를 쓰면 어디까지 전송되는지, 어떤 항목을 가리고 보낼지를 먼저 합의합니다. 전송 자체가 불가능한 자료는 대상에서 제외하고 가능한 범위만 자동화합니다.',
      },
      {
        q: '양식이 거래처마다 다른데 되나요?',
        a: '양식 종류별로 규칙을 만들면 됩니다. 처음에는 가장 자주 들어오는 한두 종류로 시작하고, 운영하면서 종류를 늘리는 편이 비용과 정확도 면에서 유리합니다.',
      },
      {
        q: '추출 정확도를 보장하나요?',
        a: '보장하지 않습니다. 문서 품질과 양식에 따라 달라지기 때문입니다. 대신 확신이 낮은 항목을 걸러 사람에게 올리는 기준을 함께 설계해, 틀린 값이 그대로 시스템에 들어가지 않게 만듭니다.',
      },
    ],
    related: [
      { href: '/ai-worker/', label: 'AI Worker 구축 전체 보기' },
      { href: '/enterprise-ai/', label: '사내 문서를 검색해 답하는 사내 AI 구축' },
      { href: '/ai-worker/office/', label: '추출한 값을 시스템에 넣는 AI 사무직원' },
      { href: '/erp/', label: '문서 값이 들어갈 ERP·관리 시스템' },
      { href: '/guide/rag-development/', label: 'RAG 구축 — 문서를 AI에 연결하는 방법' },
    ],
  },
];

export function getWorker(slug: string): WorkerDef | undefined {
  return WORKERS.find((w) => w.slug === slug);
}
export function workerCanonical(slug: string): string {
  return `${SITE.domain}${AI_WORKER_PATH}${slug}/`;
}
export function workerTitle(w: WorkerDef): string {
  return `${w.name} 구축 | ${w.primary} — 름랩 REUMLAB`;
}
export function workerDescription(w: WorkerDef): string {
  return `${w.lead} 연결 시스템, 권한 4단계, 사람에게 넘기는 조건, 1차 구축 범위와 비용 요인을 정리했습니다.`;
}

/** 스포크 본문을 채점·중복검사용 텍스트 조각으로 펼친다 */
function workerBodyParts(w: WorkerDef): Array<string | string[]> {
  return [
    w.lead,
    w.duties,
    w.connections.map((c) => `${c.system} ${c.mode}`),
    w.permissions.map((p) => `${p.level} ${p.items.join(' ')}`),
    w.handoff,
    w.scope,
    w.drivers,
    w.fit.good,
    w.fit.bad,
    w.faqs.map((f) => `${f.q} ${f.a}`),
    w.related.map((r) => r.label),
  ];
}

export function workerDecision(slug: string): IndexDecision | undefined {
  const w = getWorker(slug);
  if (!w) return undefined;
  // 형제 스포크와 본문이 겹치지 않는지 함께 검사한다(역할별로 연결 시스템·권한이 달라야 한다).
  const peers = WORKERS.filter((o) => o.slug !== slug).map((o) =>
    fingerprint(workerBodyParts(o).flat().join(' ')),
  );
  return decideFromContent({
    title: workerTitle(w),
    description: workerDescription(w),
    h1: w.name,
    bodyParts: workerBodyParts(w),
    faqQuestions: w.faqs.map((f) => f.q),
    // 브레드크럼 3 + 관련 링크 + 형제 역할 카드 2
    internalLinks: 3 + w.related.length + 2,
    hasUniqueMedia: false,
    peerFingerprints: peers,
    evidence: {
      firstPartyEvidence: 'partial',
      independentSources: 0,
      hasMethodology: true,
      hasLimitations: true,
      reviewedAt: '2026-09-19',
      hasOriginalMedia: false,
    },
  });
}

export function aiWorkerDecision(): IndexDecision {
  return decideFromContent({
    title: AI_WORKER_TITLE,
    description: AI_WORKER_DESCRIPTION,
    h1: AI_WORKER_H1,
    bodyParts: [
      AI_WORKER_LEAD,
      AI_WORKER_ENTITY_STATEMENT,
      PROBLEMS_LEAD,
      PROBLEMS.map((p) => `${p.title} ${p.body}`),
      DEFINITION_BODY,
      CHATBOT_COMPARE.map((c) => `${c.item} ${c.chatbot} ${c.worker}`),
      CHATBOT_COMPARE_NOTE,
      WORKER_CARDS.map((c) => `${c.name} ${c.tagline} ${c.tasks.join(' ')} ${c.systems}`),
      WORKER_CARDS_NOTE,
      BEFORE_AFTER.map((f) => `${f.label} ${f.before.join(' ')} ${f.after.join(' ')} ${f.humanLeft}`),
      BEFORE_AFTER_NOTE,
      BUILD_STEPS.map((s) => `${s.title} ${s.detail}`),
      CONNECTION_LEAD,
      CONNECTION_MODES.map((m) => `${m.title} ${m.when} ${m.how} ${m.caution}`),
      CONNECTION_NOTE,
      PERMISSION_LEVELS.map((p) => `${p.level} ${p.name} ${p.meaning} ${p.example}`),
      PERMISSION_NOTE,
      INDUSTRY_CASES.map((c) => `${c.industry} ${c.task} ${c.flow}`),
      INDUSTRY_CASES_NOTE,
      PROCESS.map((p) => `${p.title} ${p.detail}`),
      PROCESS_NOTE,
      COST_FACTORS.map((c) => `${c.factor} ${c.detail}`),
      COST_NOTE,
      CTA_LEAD,
      RELATED_LINKS.map((r) => `${r.label} ${r.note}`),
    ],
    faqQuestions: FAQS.map((f) => f.q),
    // 브레드크럼 2 + Worker 카드 4 + 관련 링크 + 가이드 클러스터 4
    internalLinks: 2 + WORKER_CARDS.length + RELATED_LINKS.length + 4,
    hasUniqueMedia: false,
    evidence: {
      firstPartyEvidence: 'partial',
      independentSources: 0,
      hasMethodology: true,
      hasLimitations: true,
      reviewedAt: '2026-09-19',
      hasOriginalMedia: false,
    },
  });
}
