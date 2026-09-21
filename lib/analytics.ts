/**
 * 전환 측정 공통 규약 — 이벤트 이름·파라미터·페이지 분류를 한곳에서 정의한다.
 *
 * 왜 필요한가
 *  기존 측정은 동작은 했지만 "어떤 SEO 페이지가 문의를 만드는가"에 답할 수 없었다.
 *  cta_location 은 있었어도 page_type·service 가 없어서, GA4 에서 지역 랜딩 350개와
 *  가이드 40개와 서비스 허브를 구분하려면 URL 을 일일이 정규식으로 파싱해야 했다.
 *  여기서 경로 → 분류를 한 번 정의하고, 모든 이벤트가 같은 값을 싣는다.
 *
 * ⚠️ 개인정보는 절대 싣지 않는다.
 *    이름·연락처·이메일·회사명·문의 내용·참고 서비스는 이 모듈을 거치지 않는다.
 *    파라미터는 경로와 UI 위치처럼 사람을 식별할 수 없는 값만 쓴다.
 *
 * ⚠️ 카디널리티.
 *    지역·업종 slug 수백 개를 파라미터 값으로 쏟아내지 않는다. 세부 구분이 필요하면
 *    GA4 기본 page_path 를 쓰고, 여기서는 묶음(page_type·service)만 넘긴다.
 */

/** 페이지 유형 — 실제 사이트 IA 에 존재하는 것만 */
export type PageType =
  | 'home'
  | 'service' // 서비스 허브 (/flutter/, /erp/, /mvp/ …)
  | 'industry' // 업종 (/app/academy/, /website/hospital/, /solution/*)
  | 'location' // 지역 (/app-development/dongtan/ …)
  | 'landing' // pSEO 랜딩 (/l/*)
  | 'hub' // 키워드 허브 (/h/*)
  | 'portfolio'
  | 'guide'
  | 'blog'
  | 'comparison'
  | 'cost'
  | 'legal'
  | 'other';

/** 서비스 축 — 실제 제공 서비스만. 없는 서비스명을 만들지 않는다. */
export type ServiceKey = 'app' | 'web' | 'mvp' | 'erp' | 'ai' | 'data' | 'platform' | '';

const SERVICE_BY_FIRST_SEGMENT: Record<string, ServiceKey> = {
  flutter: 'app',
  'flutter-development': 'app',
  'app-development': 'app',
  'app-agency': 'app',
  app: 'app',
  'windows-app-development': 'app',
  website: 'web',
  'web-development': 'web',
  'website-agency': 'web',
  'geo-website': 'web',
  soho: 'web',
  'academy-shopping-mall': 'web',
  'realestate-landing': 'web',
  renewal: 'web',
  mvp: 'mvp',
  'mvp-development': 'mvp',
  erp: 'erp',
  'admin-page-development': 'erp',
  'ai-automation': 'ai',
  'ai-development': 'ai',
  'ai-voice-development': 'ai',
  'ai-worker': 'ai',
  'data-seo': 'data',
  // 기존 홈페이지의 검색 구조를 고치는 서비스 — 신규 제작(/geo-website/)과 같은 '웹' 축이다.
  'ai-search-optimization': 'web',
  platform: 'platform',
  'reservation-commerce': 'platform',
};

const CONTENT_SECTIONS: Record<string, PageType> = {
  guide: 'guide',
  blog: 'blog',
  compare: 'comparison',
  cost: 'cost',
  portfolio: 'portfolio',
  l: 'landing',
  h: 'hub',
  solution: 'industry',
};

const LEGAL = new Set(['privacy', 'terms', 'refund']);

/** 경로 → 페이지 유형. 쿼리·해시는 무시한다. */
export function pageTypeOf(pathname: string): PageType {
  const clean = pathname.split(/[?#]/)[0];
  const seg = clean.split('/').filter(Boolean);
  if (seg.length === 0) return 'home';
  const [first] = seg;
  if (LEGAL.has(first)) return 'legal';
  if (CONTENT_SECTIONS[first]) return CONTENT_SECTIONS[first];
  // /app/<업종>/ · /website/<업종>/ 은 업종 축으로 본다.
  // (/cost/<업종>/ 는 위 CONTENT_SECTIONS 에서 이미 'cost' 로 잡힌다 — 업종보다 비용 의도가 크다.)
  if ((first === 'app' || first === 'website') && seg.length > 1) return 'industry';
  // /ai-worker/<역할>/ 은 지역 랜딩이 아니라 하나의 AI 서비스 계열이다.
  if (first === 'ai-worker') return 'service';
  // /<서비스>/<지역>/ 형태
  if (seg.length === 2 && SERVICE_BY_FIRST_SEGMENT[first]) return 'location';
  if (SERVICE_BY_FIRST_SEGMENT[first]) return 'service';
  return 'other';
}

/** 경로 → 서비스 축. 판단할 수 없으면 빈 문자열(값을 지어내지 않는다). */
export function serviceOf(pathname: string): ServiceKey {
  const clean = pathname.split(/[?#]/)[0];
  const seg = clean.split('/').filter(Boolean);
  if (!seg.length) return '';
  return SERVICE_BY_FIRST_SEGMENT[seg[0]] ?? '';
}

/**
 * 이벤트 이름.
 *
 * 기존에 이미 GTM 트리거로 쓰이고 있던 이름(inquiry_form_*, form_submit_success,
 * main_apply_submit, phone_click …)은 그대로 둔다. 이름을 바꾸면 운영 중인 전환이 끊긴다.
 * generate_lead 는 GA4 권장 이름이라 "추가"만 하고, 어느 것을 key event 로 쓸지는
 * GA4/GTM 관리자에서 하나만 고르면 된다(보고서 MANUAL ACTIONS 참고).
 */
export const EVENT = {
  /** 상담 채널 클릭 — secondary conversion. 상담 완료가 아니다. */
  ctaClick: 'cta_click',
  /** 문의폼 최초 상호작용 — micro conversion. 폼 1회당 한 번만. */
  formStart: 'inquiry_form_start',
  /** 문의 제출 성공 — primary conversion. 서버 성공 응답 이후에만. */
  lead: 'generate_lead',
  /** 문의 제출 실패 진단용. 개인 입력값·서버 메시지 원문을 싣지 않는다. */
  formError: 'form_error',

  /*
   * /ai-voice-development/ 데모·계산기 전용.
   * 전부 "관심 표명"이지 전환이 아니다 — key event 로 설정하지 말 것.
   * 파라미터는 비식별 ASCII enum 만 싣는다(업종 라벨의 한글·계산기 입력값은 보내지 않는다).
   */
  voiceDemoSelect: 'voice_demo_select',
  voiceDemoStart: 'voice_demo_start',
  voiceDemoComplete: 'voice_demo_complete',
  voicePackageSelect: 'voice_package_select',
  voiceWorkloadInteract: 'voice_workload_interact',
} as const;

export type FormErrorType = 'validation' | 'network' | 'server';

export interface EventParams {
  page_type?: PageType;
  service?: ServiceKey;
  /** UI 상 위치 (nav, hero, sticky-bar, portfolio-cta …) — 자유 텍스트를 남발하지 않는다 */
  cta_location?: string;
  /** 상담 채널 */
  cta_type?: 'phone' | 'email' | 'kakao' | 'form';
  /** 폼 식별자 (main-apply, soho-diagnosis) */
  form_name?: string;
  /** 실패 원인 분류 */
  error_type?: FormErrorType;
  /** 유입 랜딩 경로 — page_path 수준까지만. 쿼리·개인정보 없음 */
  source_page?: string;
  /** 개인정보를 제외한 유입 채널 분류 */
  lead_source?: string;
  /**
   * 관심 상품 등급 — 비식별 ASCII enum 만 (UNDECIDED / START / GROWTH / ENTERPRISE).
   * 값 목록은 lib/ai-search-form.ts 의 PACKAGE_TIER 가 단일 출처다.
   * 화면 라벨(한글)을 그대로 보내면 문구를 고칠 때마다 GA4 값이 갈라진다.
   */
  package_tier?: string;
  /**
   * 업종 — 비식별 ASCII enum 만 (B2B / ACADEMY / CLINIC / BEAUTY / REAL_ESTATE / SUPPORT).
   * 값 목록은 lib/ai-voice-form.ts 의 VOICE_INDUSTRY_ENUM 이 단일 출처다.
   */
  industry?: string;
  /**
   * 상호작용 종류 — 계산기처럼 "무엇을 했는지"만 남기고 입력값은 싣지 않는다.
   * 예: 'input-change' | 'cta'. 자유 텍스트를 남발하지 않는다.
   */
  interaction?: string;
}

/**
 * 외부 리퍼러 도메인과 utm_source를 사람이 읽을 수 있는 채널로 묶는다.
 * 전체 리퍼러 URL이나 검색어는 저장하지 않는다.
 */
export function leadSourceOf(referrerHost = '', utmSource = ''): string {
  const campaign = utmSource.trim().toLowerCase();
  const host = referrerHost.trim().toLowerCase().replace(/^www\./, '');
  const value = campaign || host;

  if (/chatgpt|openai/.test(value)) return 'ChatGPT';
  if (/perplexity/.test(value)) return 'Perplexity';
  if (/claude|anthropic/.test(value)) return 'Claude';
  if (/copilot|bing/.test(value)) return 'Bing/Copilot';
  if (/google/.test(value)) return 'Google';
  if (/naver/.test(value)) return 'Naver';
  if (campaign) return `campaign:${campaign.slice(0, 40)}`;
  if (!host) return 'direct';
  if (host === 'reumlab.com' || host.endsWith('.reumlab.com')) return 'internal';
  return 'referral';
}

/** GA4 파라미터에 들어가면 안 되는 이름 — 정적 검사기와 같은 목록을 쓴다 */
export const FORBIDDEN_PARAM_KEYS = [
  'name', 'email', 'phone', 'tel', 'company', 'message', 'content',
  '이름', '이메일', '연락처', '휴대폰번호', '회사', '문의내용', '핵심기능', '참고서비스',
];

/**
 * dataLayer push. Analytics 가 막혀 있어도 절대 예외를 던지지 않는다 —
 * 측정이 사용자 기능(폼 제출·링크 이동)보다 우선할 수 없다.
 */
export function pushEvent(event: string, params: EventParams = {}): void {
  try {
    const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
    w.dataLayer = w.dataLayer || [];
    const clean: Record<string, unknown> = { event };
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === '' || v === null) continue;
      if (FORBIDDEN_PARAM_KEYS.includes(k)) continue; // 방어선 — 실수로 들어와도 막는다
      clean[k] = v;
    }
    w.dataLayer.push(clean);
  } catch {
    /* dataLayer 차단·SSR 환경 무시 */
  }
}

/** 현재 페이지의 공통 컨텍스트 */
export function pageContext(pathname: string): { page_type: PageType; service: ServiceKey } {
  return { page_type: pageTypeOf(pathname), service: serviceOf(pathname) };
}
