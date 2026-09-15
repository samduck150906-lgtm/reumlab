/**
 * /ai-search-optimization/ 상담 폼에서 쓰는 선택지 — **import 가 하나도 없는 모듈**.
 *
 * 왜 따로 두나
 *  components/LandingInquiryForm.tsx 는 'use client' 다. 여기서 lib/ai-search-architecture.ts
 *  를 import 하면 그 파일이 import 하는 lib/seo.ts(수백 개 서비스·지역 메타, 100KB 이상)가
 *  통째로 브라우저 번들에 딸려 들어간다. 같은 사고가 /ai-voice-development/ 에서 한 번
 *  있었고(First Load JS 133KB → 105KB), 그때와 같은 방식으로 값만 분리한다.
 *
 *  lib/ai-search-architecture.ts 가 이 파일을 re-export 하므로, 화면·폼·검증 스크립트는
 *  여전히 "한 곳에서 온 같은 값"을 쓴다. 값을 고칠 때는 이 파일만 고치면 된다.
 *
 * 개인정보 원칙
 *  여기 정의된 값은 전부 비식별 선택지다. 분석 이벤트에 실어도 사람을 식별할 수 없다.
 *  자유 입력값(주소·연락처·상담 원문)은 이 파일에 들어오지 않는다.
 */

/** 관심 패키지 — 화면 가격 카드와 같은 순서, 기본값은 '미정' */
export const PACKAGE_CHOICES = ['미정', 'START', 'GROWTH', 'ENTERPRISE'] as const;
export type PackageChoice = (typeof PACKAGE_CHOICES)[number];

/**
 * 분석 이벤트용 비식별 enum. 한글 라벨을 그대로 GA4 에 보내지 않고 ASCII 로 고정한다
 * (파라미터 값이 UI 문구 변경마다 갈라지는 것을 막는다).
 */
export const PACKAGE_TIER: Record<PackageChoice, string> = {
  미정: 'UNDECIDED',
  START: 'START',
  GROWTH: 'GROWTH',
  ENTERPRISE: 'ENTERPRISE',
};

/** 지속 관리 관심 — 기본값 '없음'. 구독이 선택된 상태로 시작하지 않는다. */
export const CARE_CHOICES = ['없음', 'CARE', 'CARE PLUS', '상담 후 결정'] as const;

/** 홈페이지 환경 — 실제로 적용 범위가 갈리는 구분만 둔다 */
export const PLATFORM_CHOICES = [
  '코드 기반 (Next.js·React 등)',
  'WordPress',
  '아임웹',
  '카페24',
  '기타',
  '잘 모르겠음',
] as const;

/** 수정 권한 — 계약 범위를 정하는 데 필요한 최소 구분 */
export const ACCESS_CHOICES = ['직접 관리 가능', '제작업체 협의 필요', '잘 모르겠음'] as const;

/** 홈페이지 주소 입력의 최대 길이 — 서버가 없으므로 브라우저에서 막을 수 있는 선을 둔다 */
export const SITE_URL_MAX = 200;

/** 상담 내용 자유 입력의 최대 길이 */
export const IMPROVE_MAX = 1000;

/**
 * 고객이 입력한 홈페이지 주소를 표준화한다.
 *
 * 반환값의 ok=false 는 "받을 수 없는 주소"라는 뜻이다. 이 함수는 절대로 주소를
 * fetch 하지 않는다 — 임의 URL 을 서버가 대신 읽어 주는 기능을 만들면 SSRF 공격면이
 * 생긴다. 여기서는 오타 교정과 위험한 스킴 차단까지만 한다.
 */
export function normalizeSiteUrl(raw: string): { ok: boolean; value: string; reason?: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: true, value: '' };
  if (trimmed.length > SITE_URL_MAX) {
    return { ok: false, value: trimmed, reason: `주소가 너무 깁니다 (${SITE_URL_MAX}자 이내).` };
  }
  // 스킴이 없으면 https 를 붙여 본다. 'example.com' 같은 입력이 가장 흔하다.
  const candidate = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed) ? trimmed : `https://${trimmed}`;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return { ok: false, value: trimmed, reason: '주소 형식을 확인해 주세요. 예: example.com' };
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { ok: false, value: trimmed, reason: 'http 또는 https 주소만 받습니다.' };
  }
  // 아이디·비밀번호가 박힌 URL 은 받지 않는다 — 계약 전에 인증정보를 받을 이유가 없다.
  if (url.username || url.password) {
    return { ok: false, value: trimmed, reason: '주소에 계정 정보를 포함하지 말아 주세요.' };
  }
  if (!url.hostname.includes('.')) {
    return { ok: false, value: trimmed, reason: '도메인을 확인해 주세요. 예: example.com' };
  }
  return { ok: true, value: url.toString() };
}
