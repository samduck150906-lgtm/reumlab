/**
 * /guide/ 인덱스 본문 FAQ — 화면과 FAQPage 구조화 데이터의 단일 원본.
 *
 * 왜 이 파일이 있나
 *  가이드 인덱스에는 목록(CollectionPage·ItemList)만 있고, "개발을 처음 맡기는 사람"이
 *  목록을 보기 전에 갖는 질문에 답하는 본문이 없었다. 그 질문들은 개별 가이드에 흩어져
 *  있어서 인덱스만 읽고는 어디부터 봐야 할지 알 수 없었다.
 *
 * 규칙 (이 파일을 고칠 때 반드시 지킬 것)
 *  - 여기 있는 q/a 배열 하나가 화면과 FAQPage mainEntity 를 동시에 만든다.
 *    한쪽만 고치면 scripts/verify-home-guide-seo.mjs 가 빌드를 실패시킨다.
 *  - a 는 그 자체로 답이 완결돼야 한다. "자세히 보기" 같은 유도 문장만 넣지 않는다.
 *    관련 링크는 relatedLinks 로 분리한다(답변 본문에 섞지 않는다 — 스키마 대조가 흐려진다).
 *  - 확인되지 않은 금액·기간·무상 유지보수 기간을 새로 만들지 않는다. 금액이 필요하면
 *    공개 가격 안내로 넘기고 숫자를 여기 쓰지 않는다.
 *  - relatedLinks 는 slug 만 적는다. 라벨은 렌더 시점에 lib/guides.ts·lib/compare.ts 에서
 *    가져오므로, 없는 slug 를 적으면 링크가 사라지고 검증 스크립트가 잡는다.
 *  - id 는 화면 앵커로 쓰이므로 안정적으로 유지하고, 페이지 내 다른 id 와 겹치지 않게 한다
 *    (현재 가이드 인덱스가 쓰는 id: editorial-policy).
 */

export interface GuideFaqLink {
  kind: 'guide' | 'compare';
  /** lib/guides.ts · lib/compare.ts 에 실재하는 slug 만 */
  slug: string;
}

export interface GuideFaqItem {
  /** 화면 앵커 id (guide-faq- 접두어 고정) */
  id: string;
  q: string;
  a: string;
  relatedLinks?: GuideFaqLink[];
}

export const GUIDE_FAQS: readonly GuideFaqItem[] = [
  {
    id: 'guide-faq-where-to-start',
    q: '개발을 처음 의뢰한다면 어떤 가이드부터 읽으면 되나요?',
    a: '만들려는 서비스의 목적과 꼭 필요한 기능부터 정리한 뒤, 비용·견적 가이드와 외주 계약 체크리스트를 순서대로 확인하면 됩니다. 업종별로 필요한 기능이 다르면 해당 업종 가이드와 기술 비교 글을 함께 살펴보세요.',
    relatedLinks: [
      { kind: 'guide', slug: 'app-cost' },
      { kind: 'guide', slug: 'outsourcing-checklist' },
    ],
  },
  {
    id: 'guide-faq-quote-prep',
    q: '개발 견적을 받기 전에 무엇을 준비해야 하나요?',
    a: '서비스 목적, 주요 사용자, 필수 기능, 참고 서비스, 희망 일정과 예산 범위를 준비하면 견적 검토에 도움이 됩니다. 관리자 기능, 결제·예약, 기존 데이터나 외부 서비스 연동이 필요한지도 함께 알려주세요.',
    relatedLinks: [{ kind: 'guide', slug: 'quote' }],
  },
  {
    id: 'guide-faq-mvp-vs-full',
    q: 'MVP와 정식 서비스는 어떻게 구분하나요?',
    a: 'MVP는 핵심 가설을 검증하는 데 필요한 기능에 우선순위를 둔 초기 제품입니다. 정식 서비스의 기능 범위는 실제 이용자와 운영 요구에 따라 달라지므로, 처음부터 필요한 기능과 검증 후 확장할 기능을 나눠 정하는 것이 좋습니다.',
    relatedLinks: [
      { kind: 'guide', slug: 'mvp-priority' },
      { kind: 'guide', slug: 'startup-mvp' },
    ],
  },
  {
    id: 'guide-faq-why-estimates-differ',
    q: '같은 앱이나 웹사이트라도 견적과 기간이 달라지는 이유는 무엇인가요?',
    a: '화면 수, 사용자 권한, 관리자 기능, 결제·예약 흐름, 데이터 이전, 외부 연동과 테스트 범위가 다르기 때문입니다. 공개 패키지와 별도 개발 범위를 구분하고, 정확한 금액·VAT·일정은 최신 가격 안내와 개별 견적에서 확인해야 합니다.',
    relatedLinks: [
      { kind: 'guide', slug: 'app-duration' },
      { kind: 'guide', slug: 'outsourcing-cost' },
    ],
  },
  {
    id: 'guide-faq-flutter-vs-rn',
    q: 'Flutter와 React Native 중 무엇을 선택해야 하나요?',
    a: '필요한 기능, 기존 코드와 연동 환경, 유지보수 방식에 따라 적합한 선택이 달라집니다. 기술 이름만으로 결정하기보다 실제 사용자 흐름과 운영 조건을 정리한 뒤 비교 가이드와 함께 검토하는 것이 좋습니다.',
    relatedLinks: [{ kind: 'compare', slug: 'flutter-vs-react-native' }],
  },
  {
    id: 'guide-faq-contract-handover',
    q: '개발 계약과 납품 단계에서 무엇을 확인해야 하나요?',
    a: '포함 기능과 제외 범위, 검수 기준, 수정 절차, 외부 서비스 비용을 먼저 확인하세요. 납품 시에는 소스코드와 실행·배포 문서, 도메인·배포·데이터베이스 등 주요 계정 권한의 이관 범위를 계약 내용과 대조해야 합니다.',
    relatedLinks: [
      { kind: 'guide', slug: 'dev-process' },
      { kind: 'guide', slug: 'agency-choice' },
    ],
  },
] as const;

/** FAQPage mainEntity — 화면과 같은 배열에서 만든다. acceptedAnswer 에는 답변 전문이 들어간다. */
export function guideFaqMainEntity() {
  return GUIDE_FAQS.map((f) => ({
    '@type': 'Question' as const,
    name: f.q,
    acceptedAnswer: { '@type': 'Answer' as const, text: f.a },
  }));
}
