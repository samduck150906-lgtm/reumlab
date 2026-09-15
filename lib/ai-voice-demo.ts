/**
 * 대화 데모 데이터 — 의존성이 하나도 없는 독립 모듈.
 *
 * 왜 lib/ai-voice.ts 에서 분리했나
 *  데모 UI(app/ai-voice-development/ConversationDemo.tsx)는 'use client' 다.
 *  그 파일이 lib/ai-voice.ts 를 import 하면 번들러가 lib/ai-voice.ts → lib/seo.ts(114KB) →
 *  lib/pricing.ts 까지 전부 클라이언트 번들에 끌어온다. 실제로 이 라우트의 First Load JS 가
 *  같은 폼을 쓰는 /geo-website/(102KB)보다 31KB 더 컸다.
 *  → 대사·항목만 여기로 떼어 두고, 서버 쪽(lib/ai-voice.ts)은 이 모듈을 다시 내보낸다.
 *    화면과 색인 채점이 같은 배열을 쓰는 구조는 그대로다.
 *
 * 이 파일에는 import 를 추가하지 말 것. 추가하는 순간 위 문제가 그대로 돌아온다.
 */

export const DEMO_FIELDS = ['서비스 유형', '플랫폼', '주요 기능', '예상 사용자', '희망 일정', '예산 범위'] as const;

export interface DemoTurn {
  role: 'customer' | 'ai';
  text: string;
  /** 이 턴에서 AI 가 새로 구조화한 항목 [필드명, 값] */
  capture?: readonly [string, string];
}

/**
 * 화면에 "예시"임을 반드시 표기한다. 실제 음성 AI 가 연결된 것처럼 보이게 하지 않는다.
 * 대사는 름랩 자체의 외주 리드 접수 상황을 그대로 쓴다 — 지어낸 고객사가 아니다.
 */
export const DEMO_TURNS: readonly DemoTurn[] = [
  { role: 'customer', text: '앱을 하나 만들고 싶어서 전화드렸어요.' },
  { role: 'ai', text: '네, 연결됐습니다. 어떤 서비스를 계획하고 계신지 먼저 여쭤봐도 될까요?' },
  { role: 'customer', text: '학원에서 쓸 수업 예약 앱이요.', capture: ['서비스 유형', '학원 수업 예약 앱'] },
  { role: 'ai', text: '학부모가 예약하는 화면과 원에서 관리하는 화면이 모두 필요하실까요?' },
  { role: 'customer', text: '네 둘 다요. 관리자는 컴퓨터로 봐야 해서요.', capture: ['플랫폼', '모바일 앱 + 웹 관리자'] },
  { role: 'ai', text: '알겠습니다. 예약 외에 출결이나 결제도 함께 보고 계신가요?' },
  { role: 'customer', text: '결제는 나중에 하고, 일단 예약이랑 출결만요.', capture: ['주요 기능', '예약·출결 (결제는 2차)'] },
  { role: 'ai', text: '현재 원생 수가 어느 정도인지 알 수 있을까요? 동시 접속 규모를 잡는 데 필요합니다.' },
  { role: 'customer', text: '지금 200명 정도 됩니다.', capture: ['예상 사용자', '원생 약 200명'] },
  { role: 'ai', text: '오픈 시점은 언제쯤으로 생각하고 계신가요?' },
  { role: 'customer', text: '다음 학기 개강 전에는 열고 싶어요.', capture: ['희망 일정', '다음 학기 개강 전'] },
  { role: 'ai', text: '예산은 정해 두신 범위가 있으실까요? 아직이시면 미정으로 남겨 두겠습니다.' },
  { role: 'customer', text: '아직 정확히는 아니고, 상담 받고 정하려고요.', capture: ['예산 범위', '미정 (상담 후 결정)'] },
  {
    role: 'ai',
    text: '정리해 드리겠습니다. 학원 수업 예약 앱, 학부모 앱과 웹 관리자, 예약·출결 기능, 원생 약 200명, 다음 학기 개강 전 오픈으로 담당자에게 전달하겠습니다. 확인 후 연락드리겠습니다.',
  },
] as const;
