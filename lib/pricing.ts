/**
 * 가격 단일 출처 (Pricing Source of Truth)
 * ------------------------------------------------------------------
 * 왜 이 파일이 있는가
 *  가격이 index.html·lib/*.ts·content/*.json·컴포넌트에 각각 하드코딩돼 있었다.
 *  그 결과 사이트 어딘가에는 이미 쓰지 않는 가격(웹 49만 원·앱 290만 원, 홈 카드 490만 원)이
 *  남아 검색 스니펫·GBP·구조화 데이터로 흘러나갈 수 있는 상태였다. 검색결과에서 본 금액과
 *  랜딩에서 본 금액이 다르면 그 자체로 이탈이고, 구조화 데이터와 본문 불일치는 구글
 *  구조화 데이터 정책 위반(리치 결과 박탈)이다.
 *
 * 기준값의 출처
 *  홈(index.html)의 요금 섹션이 실제 판매가다. 아래 표는 그 화면을 그대로 옮긴 것이며,
 *  새로 만들어 낸 금액이 하나도 없다. 홈 요금이 바뀌면 이 파일과 index.html 을 함께 고친다
 *  (scripts/verify-pricing.mjs 가 빌드 결과물에서 둘의 일치를 검사한다).
 *
 * 쓰는 법
 *  - 문장에 금액을 직접 타이핑하지 말고 여기 헬퍼(webFromText 등)를 쓴다.
 *  - 이미 문장 안에 녹아 있는 기존 카피는 값이 같다면 굳이 치환하지 않는다.
 *    (문장 리라이트는 회귀 위험만 키운다. 대신 verify 스크립트가 값 일치를 강제한다.)
 */

export interface PackageDef {
  /** 패키지명 — 홈 요금표의 카드 이름과 동일해야 한다 */
  name: string;
  line: 'web' | 'app';
  /** VAT 포함 정액 (원) */
  price: number;
  /** 표준 작업 기간 표기 (홈 요금표와 동일) */
  duration: string;
  /** 누구를 위한 패키지인가 — 홈 요금표의 태그 라인 */
  forWhom: string;
}

/** 홈(index.html) 요금 섹션 = 판매가 원본 */
export const PACKAGES: PackageDef[] = [
  { name: '웹 스타터', line: 'web', price: 980_000, duration: '약 5일', forWhom: '소상공인 소개·문의용 랜딩' },
  { name: '웹 + 강력 마케팅', line: 'web', price: 1_960_000, duration: '약 10일', forWhom: '검색·광고로 문의 늘리기' },
  { name: '웹 비즈니스', line: 'web', price: 3_800_000, duration: '약 14일', forWhom: '멀티페이지·블로그 정식 웹' },
  { name: '웹 프리미엄', line: 'web', price: 5_800_000, duration: '약 21일', forWhom: '관리자·외부 연동 웹앱' },
  { name: '앱 라이트 MVP', line: 'app', price: 5_800_000, duration: '약 14일', forWhom: '투자·테스트용 앱 빠른 검증' },
  { name: '앱 스탠다드', line: 'app', price: 9_800_000, duration: '약 21일', forWhom: '회원·결제·관리자까지' },
  { name: '앱 AI', line: 'app', price: 13_800_000, duration: '약 30일', forWhom: 'AI 기능·업무 자동화' },
  { name: '앱 프리미엄', line: 'app', price: 19_800_000, duration: '약 45일', forWhom: '멀티 기능 + AI 고도화' },
];

export function packagesOf(line: 'web' | 'app'): PackageDef[] {
  return PACKAGES.filter((p) => p.line === line);
}

function cheapest(line: 'web' | 'app'): PackageDef {
  return packagesOf(line).reduce((a, b) => (b.price < a.price ? b : a));
}

/** 라인별 최저가 패키지 — "…부터" 문구의 기준 */
export const WEB_ENTRY = cheapest('web');
export const APP_ENTRY = cheapest('app');

/** 원 단위 → "98만" 같은 만원 단위 문자열 (1,000만 이상은 콤마 표기) */
export function toManwon(won: number): string {
  const man = won / 10_000;
  return man >= 1000 ? man.toLocaleString('ko-KR') : String(man);
}

/** 원 단위 → "980,000원" */
export function toWon(won: number): string {
  return `${won.toLocaleString('ko-KR')}원`;
}

/** "98만 원" (띄어쓰기 포함 — 본문용) */
export function manwonText(won: number): string {
  return `${toManwon(won)}만 원`;
}

/** "98만원" (붙여쓰기 — title/description 등 글자 수가 빠듯한 곳) */
export function manwonTight(won: number): string {
  return `${toManwon(won)}만원`;
}

export const webFrom = WEB_ENTRY.price;
export const appFrom = APP_ENTRY.price;

/** "98만 원부터" */
export function webFromText(tight = false): string {
  return `${tight ? manwonTight(webFrom) : manwonText(webFrom)}부터`;
}
/** "580만 원부터" */
export function appFromText(tight = false): string {
  return `${tight ? manwonTight(appFrom) : manwonText(appFrom)}부터`;
}

/** "웹 98만 원부터 · 앱 580만 원부터" — 사이트 공통 가격 한 줄 */
export function priceLineText(tight = false): string {
  return `웹 ${webFromText(tight)} · 앱 ${appFromText(tight)}`;
}

/**
 * 소상공인(/soho/) 한정 프로모션.
 * 정가는 위 패키지 표와 같고, 표시 가격만 프로모션가다. 정가를 함께 노출해야
 * "사이트 전체 98만 원 vs 이 페이지 49만원"이 모순으로 읽히지 않는다.
 */
export const SOHO_PROMO = {
  basic: { regular: 980_000, promo: 490_000, label: '홈페이지 제작' },
  marketing: { regular: 1_960_000, promo: 980_000, label: '홈페이지 + 검색 노출 설계' },
} as const;

/**
 * 현재 판매하지 않는 과거 가격 — 빌드 결과물에 하나라도 남으면 검사 실패.
 * (scripts/verify-pricing.mjs 가 out/**.html 전체를 훑는다.)
 *
 * 149만/799만 : 2025년 구 요금제 (docs/SEO_INDEXING_ACTION.md 에 기록된 구글 캐시 잔재)
 * 290만/490만 : 홈 요금이 2배 정정되기 전의 앱·웹 진입가
 * 690만       : 구 홈 요금표 상단값
 */
export const RETIRED_PRICES: { text: string; note: string }[] = [
  { text: '2,900,000', note: '구 앱 진입가 (현행 5,800,000)' },
  { text: '290만', note: '구 앱 진입가 (현행 580만)' },
  { text: '490만', note: '구 앱 카드 가격 (현행 580만)' },
  { text: '1,490,000', note: '구 요금제' },
  { text: '149만', note: '구 요금제' },
  { text: '799만', note: '구 요금제 상단값' },
  { text: '690만', note: '구 홈 요금표 상단값' },
];

/**
 * 프로모션(/soho/)을 제외하면 사이트 어디에도 나오면 안 되는 금액.
 * 49만원은 소상공인 프로모션가라 /soho/ 안에서는 정상이고, 그 밖에서는 구가격이다.
 */
export const SOHO_ONLY_PRICES = ['490,000', '49만'];
