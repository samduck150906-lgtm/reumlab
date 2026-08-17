/**
 * 검색 의도(Search Intent) 기반 Title/Description 생성 + 자기잠식 판정 데이터
 * ------------------------------------------------------------------
 * 문제
 *  프로그래매틱 4축(/app · /cost · /solution · /website)과 /l 랜딩이 축마다
 *  "제목 템플릿 1개"를 공유했다. 중복 title 은 0건이지만(업종명이 다르니까),
 *  검색결과에서 보면 같은 문장이 업종명만 바뀌어 100줄 늘어선 모양이라
 *  어떤 결과가 내 질문에 답하는지 알 수 없다 → 노출은 늘어도 클릭이 안 붙는다.
 *
 *  더 중요한 건 의도 불일치다. "독서실관리앱 제작비용"으로 들어온 사람이 원하는 답은
 *  "얼마"고, "어린이집 앱개발"로 들어온 사람이 원하는 답은 "무슨 기능이 되나"다.
 *  두 페이지가 같은 문형을 쓰면 둘 중 하나는 반드시 어긋난다.
 *
 * 이 파일이 하는 일
 *  1) 축별로 "검색 의도"를 선언하고, 의도에 맞는 제목 문형을 여러 개 둔다.
 *     페이지 slug 를 시드로 결정적으로 하나를 골라(SSG 안전) 문형이 갈라지게 한다.
 *  2) description 을 그 페이지가 실제로 가진 데이터(가격대·기능·기간)로 조립한다.
 *     축 전체가 공유하는 상수 문장을 쓰지 않는다 — 스니펫이 페이지 내용과 맞아야 한다.
 *  3) 각 축의 PRIMARY / SECONDARY / INTENT / DIFFERENTIATION 을 내부 데이터로 남긴다.
 *     "이 페이지는 왜 저 페이지와 따로 존재하는가"를 코드가 답할 수 있어야
 *     자기잠식 검사(scripts/verify-cannibalization.mjs)가 자동화된다.
 *
 * 원칙
 *  - 클릭베이트 금지. 제목이 약속하는 정보(가격·기간·기능·업체 여부)는 본문에 실제로 있다.
 *  - 없는 숫자를 만들지 않는다. 금액은 lib/pricing.ts 또는 각 페이지 데이터에서만 온다.
 *  - Date.now()/Math.random() 미사용 — 빌드마다 제목이 흔들리면 색인이 요동친다.
 */
import { appFrom, webFrom, manwonTight } from './pricing';

// ── 결정적 선택 (lib/voice.ts 와 같은 방식) ──
function hashInt(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickVariant<T>(pool: T[], seed: string, salt = ''): T {
  return pool[hashInt(`${seed}|${salt}`) % pool.length];
}

/** 검색자가 원하는 답의 종류 */
export type SearchIntent =
  | 'cost' // 얼마인가
  | 'vendor' // 어디에 맡기나
  | 'capability' // 만들 수 있나 · 무슨 기능이 되나
  | 'build' // 어떻게 구축하나
  | 'presence' // 홈페이지로 무엇을 보여주나
  | 'learn'; // 판단 기준을 알고 싶다

export const INTENT_LABEL: Record<SearchIntent, string> = {
  cost: '비용·견적',
  vendor: '업체 탐색',
  capability: '제작 가능 여부·기능',
  build: '구축 방법',
  presence: '홈페이지 구성·노출',
  learn: '정보 탐색',
};

/**
 * 페이지의 키워드 포지션. 자기잠식 검사와 운영 리포트가 함께 읽는다.
 * 값을 지어내지 않는다 — 실제 라우트가 노리는 검색어만 적는다.
 */
export interface IntentProfile {
  /** 이 페이지가 노리는 대표 검색어 1개 */
  primary: string;
  /** 보조 검색어 (primary 의 변형·롱테일) */
  secondary: string[];
  intent: SearchIntent;
  /** 같은 키워드군의 다른 축과 무엇이 다른가 — CONSOLIDATE/DIFFERENTIATE 판단 근거 */
  differentiation: string;
}

// 문장 조립 도우미 ─────────────────────────────────────────────

/** 앞뒤 공백·중복 공백·문장부호 정리 */
function tidy(s: string): string {
  return s.replace(/\s+/g, ' ').replace(/\s+([,.])/g, '$1').trim();
}

/** n자를 넘으면 단어 경계에서 자르고 말줄임 없이 끝낸다 (제목에 "…"는 신뢰를 깎는다) */
export function clampTitle(s: string, max = 60): string {
  const t = tidy(s);
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const at = Math.max(cut.lastIndexOf(' '), cut.lastIndexOf('·'), cut.lastIndexOf('|'));
  return (at > max * 0.6 ? cut.slice(0, at) : cut).replace(/[\s|·]+$/, '');
}

/**
 * description 은 검색결과에 그대로 실리는 문장이다.
 * 너무 짧으면(70자 미만) 검색엔진이 본문에서 임의로 뽑아 쓰고, 너무 길면 잘린다.
 * 조각을 순서대로 채우다 목표 길이를 넘으면 멈춘다 — 잘린 문장이 나오지 않게.
 */
export function composeDescription(parts: (string | undefined | null)[], max = 155): string {
  const out: string[] = [];
  for (const p of parts) {
    const piece = p && tidy(p);
    if (!piece) continue;
    const next = out.length ? `${out.join(' ')} ${piece}` : piece;
    // 넘치는 조각은 "건너뛴다". 여기서 멈추면 뒤에 오는 짧은 가격·USP 문구까지
    // 통째로 사라져 스니펫이 도리어 부실해진다(웹 축 260개가 그렇게 60자대로 잘렸다).
    if (next.length > max && out.length) continue;
    out.push(piece);
  }
  return tidy(out.join(' ')).replace(/[\s,·]+$/, '');
}

/** 목록 앞머리 n개를 "A·B·C" 로 (긴 항목은 버린다) */
export function headList(items: string[] | undefined, n = 3, maxLen = 14, totalMax = 40): string {
  if (!items?.length) return '';
  const picked: string[] = [];
  for (const raw of items) {
    const item = raw.split(/[—:(]/)[0].trim();
    if (!item || item.length > maxLen) continue;
    if (picked.length >= n) break;
    if ([...picked, item].join('·').length > totalMax) break;
    picked.push(item);
  }
  return picked.join('·');
}

// ─────────────────────────────────────────────────────────────
// 축 1 — /cost/[industry] : 비용형 (BOFU 최우선)
// 검색 예: "독서실관리앱 제작비용", "부동산 매물관리 어플 만드는 비용", "앱 개발 비용"
// 검색자가 원하는 답: 얼마부터인가 · 무엇이 금액을 올리는가 · 기간
// ─────────────────────────────────────────────────────────────
const COST_TITLES: ((n: string, entry: string) => string)[] = [
  (n, e) => `${n}, 얼마부터일까 | 기능별 견적·개발기간 | 름랩`,
  (n, e) => `${n} | 간단형 ${e}~ 단계별 가격대와 비용 요인 | 름랩`,
  (n) => `${n} 견적 기준 | 무엇이 금액을 올리고 무엇이 줄이나 | 름랩`,
  (n, e) => `${n} ${e}부터 | 범위별 견적·유지비까지 계산 | 름랩`,
];

export function buildCostTitle(name: string, entryRange: string, seed: string): string {
  const entry = shortRange(entryRange);
  return clampTitle(pickVariant(COST_TITLES, seed, 'cost-title')(name, entry));
}

/** "VAT 포함 580만 원대~" → "580만 원대" (제목에 들어갈 만큼 짧게) */
function shortRange(range: string): string {
  const m = range.match(/[\d,]+\s?만\s?원(?:대)?/);
  return m ? m[0].replace(/\s+/g, ' ').trim() : `${manwonTight(appFrom)}대`;
}

export function buildCostDescription(input: {
  name: string;
  tiers: { name: string; range: string }[];
  drivers: string[];
  running: string;
}): string {
  // 단계 이름 + 금액. 서로 다른 금액만 남긴다 — 원본 range 문자열이 "1,600만 원대"와
  // "1,600만 원대 이상"처럼 앞부분이 같으면 스니펫에 같은 숫자가 두 번 찍혀 성의 없어 보인다.
  const seen = new Set<string>();
  const rungs: string[] = [];
  for (const x of input.tiers) {
    const r = shortRange(x.range);
    if (seen.has(r)) continue;
    seen.add(r);
    rungs.push(`${x.name} ${r}`);
    if (rungs.length >= 3) break;
  }
  const ladder = rungs.length ? `${rungs.join(' · ')}.` : '';
  const driver = input.drivers[0] ? `${tidy(input.drivers[0]).split(/[.]/)[0]}.` : '';
  return composeDescription([
    `${input.name} 기준을 공개합니다.`,
    ladder,
    driver,
    'VAT 포함 정액 · 소스코드 이관 · 월 관리비 없음.',
  ]);
}

// ─────────────────────────────────────────────────────────────
// 축 2 — /app/[industry] : 업종형 (제작 가능 여부 · 기능)
// 검색 예: "어린이집 앱개발", "파티룸 앱", "공간대여 앱"
// 검색자가 원하는 답: 우리 업종에 맞게 만들 수 있나 · 어떤 기능이 들어가나
// ─────────────────────────────────────────────────────────────
const APP_TITLES: ((ko: string, feat: string) => string)[] = [
  (ko, f) => `${ko} 앱 개발 | ${f} 등 필요한 기능부터 | 름랩`,
  (ko) => `${ko} 앱 만들 수 있나요 | 기능·비용·개발기간 정리 | 름랩`,
  (ko, f) => `${ko} 앱 제작 | ${f} 실제 구현 범위와 견적 | 름랩`,
  (ko) => `${ko} 앱 개발 | 현장 운영 흐름 그대로 MVP로 | 름랩`,
];

export function buildAppTitle(ko: string, coreFeatures: string, seed: string): string {
  const feat = headList(coreFeatures.split(/[·,]/), 2, 10) || '핵심 기능';
  return clampTitle(pickVariant(APP_TITLES, seed, 'app-title')(ko, feat));
}

export function buildAppDescription(input: {
  ko: string;
  coreFeatures: string;
  scenario?: string;
  userTypes?: string[];
}): string {
  return composeDescription([
    `${input.ko} 앱에 실제로 들어가는 기능 — ${tidy(input.coreFeatures)}.`,
    input.scenario ? tidy(input.scenario).split(/(?<=[.])\s/)[0] : '',
    `${manwonTight(appFrom)}대 MVP부터, 소스코드 이관 포함.`,
  ]);
}

// ─────────────────────────────────────────────────────────────
// 축 3 — /solution/[industry] : 구축형
// 검색 예: "학원 ERP 구축", "예약 시스템 개발", "O2O 플랫폼 구축"
// 검색자가 원하는 답: 어떤 모듈로 · 어떤 기술로 · 어떤 순서로 도입하나
// ─────────────────────────────────────────────────────────────
const SOLUTION_TITLES: ((n: string, mod: string) => string)[] = [
  (n, m) => `${n} 구축 | ${m} 모듈 구성과 도입 단계 | 름랩`,
  (n) => `${n} 어떻게 구축하나 | 기술 스택·연동·단계별 도입 | 름랩`,
  (n, m) => `${n} 시스템 개발 | ${m} 연동까지 한 번에 | 름랩`,
  (n) => `${n} 구축 | 기존 업무 흐름에 맞춘 설계·이관 | 름랩`,
];

export function buildSolutionTitle(name: string, modules: string[] | undefined, seed: string): string {
  const mod = headList(modules, 1, 16, 16) || '핵심';
  return clampTitle(pickVariant(SOLUTION_TITLES, seed, 'sol-title')(name, mod));
}

export function buildSolutionDescription(input: {
  name: string;
  modules?: string[];
  integrations?: string[];
  lead?: string;
}): string {
  const mods = headList(input.modules, 3, 16, 44);
  // 연동 포인트는 원래 배열이라 그대로 쓸 수 있다. 기술 스택은 산문 한 문단이어서
  // 쪼개면 "기술: 수의사." 같은 조각이 나온다 — 스니펫에는 넣지 않는다.
  const links = headList(input.integrations, 2, 18, 34);
  return composeDescription([
    input.lead ? tidy(input.lead).split(/(?<=[.])\s/)[0] : `${input.name} 구축 기준을 정리했습니다.`,
    mods ? `모듈: ${mods}.` : '',
    links ? `연동: ${links}.` : '',
    '단계별 도입 · 소스코드 이관 · 월 관리비 없음.',
  ]);
}

// ─────────────────────────────────────────────────────────────
// 축 4 — /website/[industry] : 업종 홈페이지형
// 검색 예: "요양병원 홈페이지 제작", "학원 홈페이지 만들기"
// 검색자가 원하는 답: 우리 업종 홈페이지에 무슨 페이지가 필요한가 · 얼마인가 · 검색에 뜨나
// ─────────────────────────────────────────────────────────────
const WEBSITE_TITLES: ((ko: string, pages: string, price: string) => string)[] = [
  (ko, p) => `${ko} 홈페이지 제작 | ${p} 구성과 검색 노출 | 름랩`,
  (ko, _p, price) => `${ko} 홈페이지 제작 비용 | ${price}부터 정액 견적 | 름랩`,
  (ko, p) => `${ko} 홈페이지 만들기 | ${p} 어디까지 필요한가 | 름랩`,
  (ko) => `${ko} 홈페이지 제작 업체 | 직접 기획·개발·이관 | 름랩`,
];

export function buildWebsiteTitle(ko: string, pages: string[] | undefined, seed: string): string {
  const p = headList(pages, 2, 10, 22) || '필요한 페이지';
  return clampTitle(pickVariant(WEBSITE_TITLES, seed, 'web-title')(ko, p, manwonTight(webFrom)));
}

export function buildWebsiteDescription(input: {
  ko: string;
  pages?: string[];
  /** 이 업종 페이지의 고유 운영 시나리오 (buildWebsiteContent 가 slug 별로 다르게 만든다) */
  scenario?: string;
}): string {
  const pages = headList(input.pages, 4, 12, 40);
  // 같은 카테고리(예: 의료 30여 업종)는 아키타입 페이지 목록이 같다. 여기까지만 쓰면
  // 업종명만 바뀐 설명이 30줄 늘어선다 — 슬러그마다 달라지는 시나리오 문장을 함께 싣는다.
  const line = input.scenario ? tidy(input.scenario).split(/(?<=[.])\s/)[0] : '';
  return composeDescription([
    `${input.ko} 홈페이지에 실제로 필요한 페이지${pages ? ` — ${pages}` : ''}.`,
    line,
    `${manwonTight(webFrom)}부터 정액 · 소스코드 이관 · 월 관리비 없음.`,
  ]);
}

// ─────────────────────────────────────────────────────────────
// 축 5 — /l/[slug] : 키워드 랜딩 (BOFU 비용·견적 의도)
// 검색 예: "앱개발 비용", "앱개발외주 가격", "홈페이지제작 견적"
// 이 축이 가장 아쉬웠다 — title 평균 22자, description 평균 35자로
// 검색결과에서 아무 정보도 주지 못했다. 의도별 문형으로 갈라 준다.
// ─────────────────────────────────────────────────────────────
const LANDING_INTENT_COPY: Record<
  string,
  { title: (kw: string, svc: string, from: string) => string; desc: (svc: string, from: string) => string; intent: SearchIntent }
> = {
  cost: {
    title: (kw, _s, f) => `${kw} | ${f}부터, 기능별 견적 기준 공개 | 름랩`,
    desc: (s, f) => `${s} 비용이 어떻게 정해지는지 기능·화면 수 기준으로 공개합니다. VAT 포함 정액 ${f}부터, 범위를 먼저 확정하고 시작합니다.`,
    intent: 'cost',
  },
  price: {
    title: (kw, _s, f) => `${kw} | VAT 포함 정액 ${f}부터 | 름랩`,
    desc: (s, f) => `${s} 가격을 먼저 공개합니다. VAT 포함 정액 ${f}부터, 진행 중 추가 청구 없이 범위와 금액을 계약 전에 확정합니다.`,
    intent: 'cost',
  },
  quote: {
    title: (kw, s) => `${kw} | 기능 정리하면 당일 범위 회신 | 름랩`,
    desc: (s, f) => `${s} 견적을 받으실 때 필요한 것은 기능 목록 한 장이면 충분합니다. 범위·금액·기간을 정액 ${f}부터 기준으로 정리해 드립니다.`,
    intent: 'cost',
  },
  'production-cost': {
    title: (kw, _s, f) => `${kw} | ${f}부터·무엇이 금액을 올리나 | 름랩`,
    desc: (s, f) => `${s} 제작비를 좌우하는 건 화면 수·연동·관리자 범위입니다. 어떤 조건에서 얼마나 오르는지 정액 ${f}부터 기준으로 정리했습니다.`,
    intent: 'cost',
  },
  'dev-cost': {
    title: (kw, s) => `${kw} | 개발 범위별 금액 차이 정리 | 름랩`,
    desc: (s, f) => `${s} 개발비는 같은 이름의 기능도 범위에 따라 크게 갈립니다. 범위별 차이와 줄이는 방법을 정액 ${f}부터 기준으로 안내합니다.`,
    intent: 'cost',
  },
  'quote-inquiry': {
    title: (kw, s) => `${kw} | 개발 가능 여부부터 솔직하게 | 름랩`,
    desc: (s, f) => `${s} 견적문의 주시면 만들 수 있는지, 지금 만드는 게 맞는지부터 말씀드립니다. 가능하면 정액 ${f}부터 기준으로 범위를 잡아 드립니다.`,
    intent: 'vendor',
  },
  'cost-consult': {
    title: (kw, s) => `${kw} | 예산에 맞춰 범위부터 조정 | 름랩`,
    desc: (s, f) => `${s} 예산이 정해져 있다면 그 안에서 가능한 범위를 먼저 잡습니다. 정액 ${f}부터, 무엇을 빼고 무엇을 남길지 함께 정리합니다.`,
    intent: 'cost',
  },
  'out-source-cost': {
    title: (kw, s) => `${kw} | 외주비에 무엇이 포함되나 | 름랩`,
    desc: (s, f) => `${s} 외주비에 기획·디자인·개발·배포·소스코드 이관 중 무엇이 들어가는지 항목별로 공개합니다. 정액 ${f}부터, 월 관리비 없음.`,
    intent: 'cost',
  },
};

/** 서비스 축(app/web/plan) → 진입가 문구 */
function entryFor(svcType: string): string {
  return svcType === 'web' ? `${manwonTight(webFrom)}` : `${manwonTight(appFrom)}`;
}

export function buildLandingMeta(input: {
  keyword: string;
  serviceKo: string;
  intentKey?: string;
  svcType?: string;
  regionKo?: string;
  industryKo?: string;
  slug: string;
}): { title: string; description: string; intent: SearchIntent } {
  const from = entryFor(input.svcType ?? 'app');
  const copy = input.intentKey ? LANDING_INTENT_COPY[input.intentKey] : undefined;
  // 지역·업종 랜딩은 의도 문형만 쓰면 "수원 웹개발 비용"과 "강남 웹개발 비용"의 설명이
  // 글자 하나까지 같아진다(서비스·의도가 같으므로). 주어를 문장에 넣어 구분한다.
  const subject = `${input.regionKo ? `${input.regionKo} ` : ''}${input.industryKo ? `${input.industryKo} ` : ''}`.trim();

  if (copy) {
    const svc = subject ? `${subject} ${input.serviceKo}` : input.serviceKo;
    return {
      title: clampTitle(copy.title(input.keyword, svc, from)),
      description: composeDescription([
        copy.desc(svc, from),
        subject ? `${subject} 프로젝트도 화면 공유 미팅으로 전국 원격 진행합니다.` : '',
      ]),
      intent: copy.intent,
    };
  }

  // 지역·업종 랜딩 — 의도 키가 없는 조합. 지역/업종을 문장 주어로 쓴다.
  const where = input.regionKo ? `${input.regionKo} ` : '';
  const who = input.industryKo ? `${input.industryKo} ` : '';
  // 제목에 키워드를 한 번만 쓴다 — "학원 쇼핑몰제작 | 학원 쇼핑몰 제작 …" 처럼 겹치면
  // 검색결과에서 같은 말이 두 번 보이고 정보량은 그대로다.
  const titles = [
    `${input.keyword} | 기획부터 배포까지 직접 개발·이관 | 름랩`,
    `${input.keyword} | 범위·금액 먼저 확정하고 시작 | 름랩`,
    `${input.keyword} | ${from}부터 정액, 월 관리비 없음 | 름랩`,
  ];
  return {
    title: clampTitle(pickVariant(titles, input.slug, 'l-title')),
    description: composeDescription([
      subject
        ? `${subject} ${input.serviceKo}을 기획부터 개발·배포까지 직접 진행합니다.`
        : `${input.serviceKo}을 기획부터 개발·배포까지 직접 진행합니다.`,
      `VAT 포함 정액 ${from}부터, 완성 후 소스코드와 운영 권한을 통째로 넘겨 드립니다.`,
      '월 관리비 없이 직접 수정·운영하도록 1:1 교육까지 포함합니다.',
    ]),
    intent: 'vendor',
  };
}

// ─────────────────────────────────────────────────────────────
// 자기잠식(cannibalization) 판정 데이터
// 같은 업종 slug 를 4축이 공유한다. "왜 4개가 따로 있는가"를 여기서 선언하고,
// scripts/verify-cannibalization.mjs 가 이 선언과 실제 렌더 본문을 대조한다.
// ─────────────────────────────────────────────────────────────
export function costProfile(ko: string): IntentProfile {
  return {
    primary: `${ko} 앱 개발 비용`,
    secondary: [`${ko} 앱 제작비용`, `${ko} 어플 만드는 비용`, `${ko} 앱 견적`],
    intent: 'cost',
    differentiation: '금액이 어떻게 정해지는가(단계별 가격대·비용 요인·유지비·절감)만 다룬다. 기능 목록은 /app 으로 넘긴다.',
  };
}

export function appProfile(ko: string): IntentProfile {
  return {
    primary: `${ko} 앱 개발`,
    secondary: [`${ko} 앱 제작`, `${ko} 어플 개발`, `${ko} 앱 만들기`],
    intent: 'capability',
    differentiation: '무엇을 만들 수 있는가(기능·사용자 유형·운영 시나리오)를 다룬다. 금액 상세는 /cost 로 넘긴다.',
  };
}

export function solutionProfile(name: string): IntentProfile {
  return {
    primary: `${name} 구축`,
    secondary: [`${name} 시스템 개발`, `${name} 솔루션`, `${name} 도입`],
    intent: 'build',
    differentiation: '어떻게 구축하는가(모듈 구성·기술 스택·연동·도입 단계)를 다룬다. 앱 단일 제품이 아니라 업무 시스템 관점이다.',
  };
}

export function websiteProfile(ko: string): IntentProfile {
  return {
    primary: `${ko} 홈페이지 제작`,
    secondary: [`${ko} 홈페이지`, `${ko} 홈페이지 제작 비용`, `${ko} 웹사이트 제작`],
    intent: 'presence',
    differentiation: '홈페이지(웹) 축이다. 페이지 구성·검색 노출·정액 비용을 다루며 앱 기능은 /app 으로 넘긴다.',
  };
}
