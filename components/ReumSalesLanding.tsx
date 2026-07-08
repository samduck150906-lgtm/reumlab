/**
 * ⚠️ 운영 홈페이지(`reumlab.com/`)는 정적 `index.html`이 서빙됩니다
 *    (빌드의 `copy:home`이 Next가 만든 out/index.html을 덮어씀).
 * 이 컴포넌트는 동일 내용의 React 트윈입니다 — 가격·카피를 바꾸면 `index.html`도 함께 갱신하세요.
 * 자세한 내용: README "홈페이지·배포 구조".
 */
import Link from 'next/link';
import type { ReactNode } from 'react';
import { SITE } from '@/lib/seo';

type Site = {
  email?: string;
  company?: string;
};

const TEL_HREF = SITE.phoneHref;
const MAIL_HREF = `mailto:${SITE.email}`;

function IconGraduate({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3L2 8l10 5 10-5-10-5zM2 13l10 5 10-5M6 11v5l6 3 6-3v-5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconDevices({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPhone({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMail({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  dark,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={`reum-section-head mx-auto max-w-3xl text-center ${dark ? 'reum-section-head--dark' : 'reum-section-head--light'}`}
    >
      <p className={`reum-section-eyebrow font-display text-xs font-semibold uppercase tracking-[0.2em] ${dark ? '' : 'text-accent-deep'}`}>
        {eyebrow}
      </p>
      <h2 className={`reum-section-title mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl ${dark ? 'text-white' : 'text-navy-900'}`}>
        {title}
      </h2>
      {description ? (
        <p className={`reum-section-desc mt-4 text-base leading-relaxed sm:text-lg ${dark ? 'text-slate-200' : 'text-slate-700'}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-8 shadow-card transition-shadow duration-300 hover:border-slate-300 hover:shadow-card-hover">
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent-deep transition-colors duration-300 group-hover:bg-accent-deep group-hover:text-white">
        {icon}
      </div>
      <h3 className="reum-card-title font-display text-lg font-bold text-navy-900">{title}</h3>
      <p className="reum-card-body mt-3 text-sm leading-relaxed text-slate-700 sm:text-[15px]">{children}</p>
    </div>
  );
}

/** 전화 + 이메일, 두 가지 문의 버튼 */
function ContactButtons({
  variant = 'light',
  mailSubject,
}: {
  variant?: 'light' | 'dark' | 'compact';
  mailSubject?: string;
}) {
  const mailHref = mailSubject
    ? `${MAIL_HREF}?subject=${encodeURIComponent(mailSubject)}`
    : MAIL_HREF;

  if (variant === 'compact') {
    return (
      <div className="flex w-full flex-col gap-2">
        <a
          href={TEL_HREF}
          className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 font-display text-sm font-semibold text-white transition hover:bg-accent-deep"
          data-analytics="cta_pkg_call"
        >
          <IconPhone className="h-4 w-4" />
          전화로 바로 문의
        </a>
        <a
          href={mailHref}
          className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-display text-xs font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10 sm:text-sm"
          data-analytics="cta_pkg_mail"
        >
          <IconMail className="h-4 w-4" />
          이메일로 견적 요청
        </a>
      </div>
    );
  }

  const dark = variant === 'dark';
  return (
    <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
      <a
        href={TEL_HREF}
        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-accent px-8 py-3.5 font-display text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-deep sm:text-[15px]"
        data-analytics="cta_call"
      >
        <IconPhone className="h-[18px] w-[18px]" />
        {SITE.phone} 전화 상담
      </a>
      <a
        href={mailHref}
        className={`inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl px-8 py-3.5 font-display text-sm font-semibold transition sm:text-[15px] ${
          dark
            ? 'border border-white/25 bg-white/5 text-white backdrop-blur hover:bg-white/10'
            : 'border border-slate-300 bg-white text-navy-900 hover:border-slate-400'
        }`}
        data-analytics="cta_mail"
      >
        <IconMail className="h-[18px] w-[18px]" />
        이메일로 문의하기
      </a>
    </div>
  );
}

const PROCESS_STEPS = [
  {
    step: '01',
    title: '먼저 전화로 30분, 솔직하게',
    desc: '“이게 가능한 일인지”부터 따져 봅니다. 안 되는 건 안 된다고, 더 싸게 가는 길이 있으면 그 길을 먼저 말씀드립니다.',
  },
  {
    step: '02',
    title: '화면부터 맞추고 시작',
    desc: '코드를 짜기 전에 화면과 흐름을 먼저 그려 확인받습니다. “생각한 거랑 다른데요”가 개발 끝나고 나오는 일을 막습니다.',
  },
  {
    step: '03',
    title: '만드는 과정을 같이 봅니다',
    desc: 'Flutter로 안드로이드·iOS를 한 번에 만들고, 중간중간 실제 화면으로 확인하며 방향을 잡습니다. 한 달 잠수 타지 않습니다.',
  },
  {
    step: '04',
    title: '소스코드까지 통째로 드립니다',
    desc: '결과물만이 아니라 소스코드 전체를 넘깁니다. 다른 곳에 맡기든, 직접 고치든 — 권한은 처음부터 대표님 것입니다.',
  },
  {
    step: '05',
    title: '직접 고치는 법을 가르칩니다',
    desc: '글자·이미지 교체부터 간단한 오류 대응까지, 1:1로 손에 익을 때까지 알려드립니다. 여기까지가 름랩의 일입니다.',
  },
] as const;

type Pkg = {
  code: string;
  tier: string;
  summary: string;
  bullets: string[];
  priceWon: number;
  durationDays: number;
  featured?: boolean;
  badge?: string;
};

/** 웹(Web) 라인 — 가볍게 시작해 필요한 만큼 확장 */
const WEB_PACKAGES: Pkg[] = [
  {
    code: 'web-starter',
    tier: '웹 스타터',
    summary: '원페이지로 가볍게 시작하는 분',
    bullets: ['원페이지 랜딩 · 모바일 반응형', '문의·예약 CTA 연결', '소스코드 이관 · AI 수정 교육 1회'],
    priceWon: 490_000,
    durationDays: 5,
  },
  {
    code: 'web-marketing',
    tier: '웹 + 강력 마케팅',
    summary: '만들자마자 검색·광고로 손님을 부르고 싶은 분',
    bullets: ['전환 카피 설계 + 기본 SEO', 'GA·픽셀 세팅 + 광고 소재 1세트', '소스코드 이관 · AI 수정 교육 1회'],
    priceWon: 980_000,
    durationDays: 10,
    featured: true,
    badge: '대표 추천',
  },
  {
    code: 'web-business',
    tier: '웹 비즈니스',
    summary: '페이지가 여러 개인 정식 비즈니스 웹',
    bullets: ['멀티페이지(5p 내외) + 블로그', '예약·문의 + 간단 CMS · 기본 SEO', '소스코드 이관 · AI 운영 1:1 교육'],
    priceWon: 1_900_000,
    durationDays: 14,
  },
  {
    code: 'web-premium',
    tier: '웹 프리미엄',
    summary: '관리자·외부 연동까지 필요한 웹앱',
    bullets: ['고도화 웹앱 + 관리자 페이지', '외부 연동(결제·지도·메일 1~2종)', '소스코드 이관 · AI 운영 교육'],
    priceWon: 2_900_000,
    durationDays: 21,
  },
];

/** 앱(App) 라인 — Flutter로 iOS·안드로이드 동시, 기능 깊이로 분류 */
const APP_PACKAGES: Pkg[] = [
  {
    code: 'app-lite',
    tier: '앱 라이트 MVP',
    summary: '앱도 부담 없이 시장부터 검증',
    bullets: ['핵심 화면 3~5개 · 기본 데이터 연동', '문의·예약 흐름', '소스코드 이관 · AI 운영 1:1 교육'],
    priceWon: 2_900_000,
    durationDays: 14,
  },
  {
    code: 'app-standard',
    tier: '앱 스탠다드',
    summary: '회원·결제까지 갖춘 본격 앱 MVP',
    bullets: ['회원/로그인 + DB + 결제 또는 예약', '기본 관리자 + 실행·수정 가이드', '소스코드 이관 · AI 운영 1:1 교육'],
    priceWon: 4_900_000,
    durationDays: 21,
    featured: true,
    badge: '가장 많이 선택',
  },
  {
    code: 'app-ai',
    tier: '앱 AI',
    summary: 'AI 기능으로 운영까지 자동화',
    bullets: ['스탠다드 + AI 기능 1종(챗봇·추천·요약)', '업무 자동화 협의', '소스코드 이관 · AI 운영 교육'],
    priceWon: 6_900_000,
    durationDays: 30,
  },
  {
    code: 'app-premium',
    tier: '앱 프리미엄',
    summary: '다기능 · AI 고도화 + 외부 연동 다수',
    bullets: ['멀티 기능 + AI 고도화', '운영·관리자 흐름 + 외부 연동 다수', '소스코드 이관 · AI 운영 교육'],
    priceWon: 9_900_000,
    durationDays: 45,
  },
];

/** 정액제 vs 일반 외주 — 범위·금액 선확정 비교 (사실 기반 포지셔닝) */
const COMPARE_ROWS = [
  { label: '가격 공개', reum: 'VAT 포함 정액 선공개', other: '견적 전까지 비공개' },
  { label: '소스코드', reum: '전체 이관 · 대표님 소유', other: '미제공·부분 제공 잦음' },
  { label: '수정 비용', reum: '직접 수정 교육으로 최소화', other: '수정마다 견적·과금' },
  { label: '월 관리비', reum: '없음', other: '매월 고정 청구 잦음' },
  { label: '납품 후', reum: '직접 운영 1:1 교육', other: '문의 시 추가 비용' },
] as const;

/**
 * 사실 기반 신뢰 지표 — 지어낸 수치는 넣지 않는다(실제 제공 조건만).
 * TODO(reumlab): 실제 누적 프로젝트 수·평균 납기·재의뢰율·고객 한 줄 후기가
 * 확보되면 이 배열/별도 후기 섹션에 추가하세요. 현재는 검증 가능한 조건만 표시.
 */
const TRUST_SIGNALS = [
  { value: '100%', label: '소스코드 전체 이관' },
  { value: 'VAT 포함', label: '정액 가격 선공개' },
  { value: 'iOS·AOS', label: 'Flutter 동시 출시' },
  { value: '1:1', label: '직접 수정 운영 교육' },
] as const;

function formatKrw(n: number) {
  return `${n.toLocaleString('ko-KR')}원`;
}

const FAQ_ITEMS = [
  {
    q: '코딩을 한 줄도 몰라요. 교육을 정말 따라갈 수 있나요?',
    a: '대부분의 대표님이 비전공·문과 출신입니다. 외우는 교육이 아니라, AI 도구에게 “이렇게 바꿔줘”라고 말로 시키는 흐름을 손에 익히는 방식이라 부담이 적습니다. 못 따라오시면 따라오실 때까지 함께합니다.',
  },
  {
    q: '왜 앱은 Flutter를 권하나요?',
    a: '하나의 코드로 안드로이드와 iOS를 동시에 만들 수 있어, 같은 예산으로 두 플랫폼을 다 가져갈 수 있기 때문입니다. 웹·랜딩은 프로젝트 성격에 맞는 스택으로 따로 설계합니다.',
  },
  {
    q: '금액에 부가세(VAT)가 포함인가요?',
    a: '네, 표기된 패키지 금액은 VAT 포함입니다. 패키지 설명 범위를 넘는 기능이 필요하면 상담 후 별도 견적을 솔직하게 안내드립니다. 범위와 금액을 먼저 확정해 안내드립니다.',
  },
  {
    q: '납품이 끝나면 연락이 끊기나요?',
    a: '아니요. 소스코드를 통째로 드리고 직접 고치는 법까지 가르치는 것이 본 서비스입니다. 교육 이후에도 합리적인 범위의 후속 질문은 계속 도와드립니다. 추가 개발만 별도 협의입니다.',
  },
] as const;

function PricingCard({ pkg }: { pkg: Pkg }) {
  return (
    <article
      className={`relative flex h-full flex-col rounded-2xl border bg-navy-900/70 p-5 pb-6 shadow-xl backdrop-blur sm:p-6 ${
        pkg.featured ? 'border-accent/50 pt-9 ring-2 ring-accent/40' : 'border-white/10'
      }`}
    >
      {pkg.featured && pkg.badge ? (
        <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-3 py-1 font-display text-[11px] font-bold text-white shadow-lg">
          {pkg.badge}
        </div>
      ) : null}
      <h4 className="font-display text-base font-bold leading-snug text-white sm:text-lg">{pkg.tier}</h4>
      <p className="mt-1 text-xs leading-relaxed text-slate-300 sm:text-[13px]">{pkg.summary}</p>
      <p className="mt-4 font-display text-2xl font-bold tracking-tight text-white sm:text-[1.7rem]">
        {formatKrw(pkg.priceWon)}
      </p>
      <p className="mt-1 text-xs text-slate-200">VAT 포함 · 약 {pkg.durationDays}일</p>
      <ul className="mt-4 flex-1 space-y-2 text-[13px] leading-relaxed text-slate-100">
        {pkg.bullets.map((line) => (
          <li key={line} className="flex gap-2">
            <svg className="mt-[3px] h-3 w-3 shrink-0 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <a
        href={TEL_HREF}
        data-analytics="cta_pkg_call"
        className={`mt-5 inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 font-display text-[13px] font-semibold transition ${
          pkg.featured
            ? 'bg-accent text-white hover:bg-accent-deep'
            : 'bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15'
        }`}
      >
        <IconPhone className="h-3.5 w-3.5" />
        이 구성으로 상담
      </a>
    </article>
  );
}

function PricingLine({
  label,
  caption,
  packages,
}: {
  label: string;
  caption: string;
  packages: Pkg[];
}) {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="font-display text-lg font-bold text-white sm:text-xl">{label}</h3>
        <p className="text-sm text-slate-300">{caption}</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {packages.map((pkg) => (
          <PricingCard key={pkg.code} pkg={pkg} />
        ))}
      </div>
    </div>
  );
}

/**
 * 히어로 우측 비주얼 — 브랜드 토큰 기반 자체 제작(외부 이미지 의존 0).
 * 딥 네이비 + 글래스모피즘 앱 카드 + 블루~시안 글로우/연결선/입자.
 * 힉스필드 A-1 이미지를 대신 쓰려면: 생성 PNG를 public/assets/images/hero-visual.png 로
 * 저장한 뒤 이 컴포넌트 내부를 <img src="/assets/images/hero-visual.png" ... />로 교체하세요.
 */
function HeroVisual() {
  return (
    <div className="relative lg:pl-4">
      <div
        className="pointer-events-none absolute -inset-4 rounded-[2rem] opacity-60 blur-2xl"
        style={{ background: 'radial-gradient(60% 60% at 70% 30%, rgba(34,211,238,0.25), transparent)' }}
        aria-hidden
      />
      <div className="relative mx-auto aspect-[16/11] w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-navy-900 via-navy-850 to-navy-950 shadow-2xl ring-1 ring-white/5">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(70% 60% at 72% 26%, rgba(34,211,238,0.18), transparent 70%)' }}
          aria-hidden
        />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 320 220" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <defs>
            <linearGradient id="reumHeroLine" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#3B82F6" stopOpacity="0" />
              <stop offset="0.5" stopColor="#3B82F6" stopOpacity="0.7" />
              <stop offset="1" stopColor="#22D3EE" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          <path d="M64 156 C 120 124, 156 92, 214 66" stroke="url(#reumHeroLine)" strokeWidth="1.4" />
          <path d="M96 96 C 150 112, 196 122, 256 132" stroke="url(#reumHeroLine)" strokeWidth="1.4" />
          <circle cx="64" cy="156" r="3" fill="#3B82F6" />
          <circle cx="214" cy="66" r="3" fill="#22D3EE" />
          <circle cx="256" cy="132" r="2.5" fill="#6366F1" />
        </svg>

        {/* 글래스 앱 카드 1 */}
        <div className="absolute left-[10%] top-[16%] w-[44%] rounded-xl border border-white/10 bg-white/[0.06] p-3 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <span className="h-4 w-4 rounded-md bg-accent/80" />
            <span className="h-1.5 w-12 rounded-full bg-white/30" />
          </div>
          <div className="mt-2.5 space-y-1.5">
            <span className="block h-1.5 w-full rounded-full bg-white/15" />
            <span className="block h-1.5 w-4/5 rounded-full bg-white/15" />
            <span className="block h-1.5 w-3/5 rounded-full bg-white/10" />
          </div>
          <span className="mt-3 block h-5 w-16 rounded-md bg-sky-400/30" />
        </div>

        {/* 글래스 앱 카드 2 (미니 차트) */}
        <div className="absolute right-[8%] top-[42%] w-[42%] rounded-xl border border-white/10 bg-white/[0.08] p-3 shadow-xl backdrop-blur-md">
          <span className="block h-1.5 w-10 rounded-full bg-white/30" />
          <div className="mt-3 flex items-end gap-1.5">
            <span className="h-6 w-2.5 rounded-sm bg-cyan-300/40" />
            <span className="h-9 w-2.5 rounded-sm bg-cyan-300/60" />
            <span className="h-5 w-2.5 rounded-sm bg-cyan-300/30" />
            <span className="h-11 w-2.5 rounded-sm bg-accent/60" />
            <span className="h-7 w-2.5 rounded-sm bg-cyan-300/40" />
          </div>
        </div>

        {/* 작은 글래스 칩 (상태 표시) */}
        <div className="absolute bottom-[12%] left-[20%] flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.07] px-2.5 py-1.5 shadow-lg backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-300/80" />
          <span className="h-1.5 w-10 rounded-full bg-white/25" />
        </div>

        {/* 입자 */}
        <span className="absolute left-[34%] top-[72%] h-1.5 w-1.5 rounded-full bg-sky-300/80 blur-[1px]" aria-hidden />
        <span className="absolute right-[22%] top-[24%] h-1 w-1 rounded-full bg-cyan-200/80 blur-[0.5px]" aria-hidden />
        <span className="absolute left-[62%] top-[64%] h-1 w-1 rounded-full bg-indigo-300/70 blur-[0.5px]" aria-hidden />
      </div>
    </div>
  );
}

export default function ReumSalesLanding({ site }: { site: Site }) {
  const company = site?.company || SITE.company;

  return (
    <main className="reum-landing bg-white text-slate-800 antialiased">
      {/* Hero */}
      <section
        id="top"
        className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-850 pb-20 pt-28 sm:pb-24 sm:pt-32 lg:pb-28"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 70% 60% at 75% 0%, rgba(61,124,255,0.35), transparent)',
          }}
        />
        <div className="pointer-events-none absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            {/* 좌: 카피 + 단일 CTA */}
            <div className="text-center lg:text-left">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-sky-200/80">
                Reum Lab · 름랩
              </p>
              <h1 className="mt-5 font-display text-[1.7rem] font-bold leading-snug tracking-tight text-white sm:text-4xl sm:leading-tight lg:text-[2.6rem]">
                예산 안에서, 빠르게 MVP.
                <span className="mt-2 block text-slate-200">
                  <span className="text-sky-300">소스코드는 통째로</span> 대표님 것입니다.
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg lg:mx-0">
                Flutter로 iOS·안드로이드를 한 번에. 가격은 먼저 공개하고, 결과물은 소스코드까지 전부 넘깁니다.
                <strong className="font-semibold text-white"> 게다가 직접 수정·운영하는 법까지 1:1로 알려드립니다.</strong>
              </p>
              <div className="mt-9 flex flex-col items-center gap-3 lg:items-start">
                <a
                  href={TEL_HREF}
                  data-analytics="cta_hero_call"
                  className="inline-flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-xl bg-accent px-8 py-4 font-display text-base font-bold text-white shadow-lg shadow-accent/30 transition hover:bg-accent-deep sm:w-auto"
                >
                  <IconPhone className="h-5 w-5" />
                  무료 30분 상담받기
                </a>
                <a
                  href={`${MAIL_HREF}?subject=${encodeURIComponent('[름랩] 앱·웹 개발 문의')}`}
                  data-analytics="cta_hero_mail"
                  className="text-sm font-medium text-slate-300 underline-offset-4 transition hover:text-white hover:underline"
                >
                  또는 이메일로 문의하기 →
                </a>
              </div>
              <p className="mt-4 text-xs text-slate-400">
                상담은 무료입니다 · 평일 10:00–18:00 · 영업 전화로 괴롭히지 않습니다
              </p>
            </div>

            {/* 우: 히어로 비주얼 — 자체 제작(브랜드 토큰 기반, 외부 의존 0) */}
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* 신뢰 지표 (사실 기반 — 지어낸 수치 없음) */}
      <section aria-label="름랩 제공 조건" className="border-b border-slate-100 bg-white py-6 sm:py-7">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-5 text-center sm:grid-cols-4">
            {TRUST_SIGNALS.map((s) => (
              <li key={s.label} className="flex flex-col items-center gap-1">
                <span className="font-display text-xl font-bold text-navy-900 sm:text-2xl">{s.value}</span>
                <span className="text-xs leading-snug text-slate-500 sm:text-[13px]">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pain */}
      <section id="pain" className="scroll-mt-24 border-b border-slate-100 bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="혹시 이런 적 있으신가요"
            title="작은 수정 하나에 며칠씩 묶여본 적, 있으시죠"
            description="론칭하고 나면 진짜 일이 시작됩니다. 문구 한 줄, 이미지 한 장 바꾸자고 매번 견적을 받고 일정을 기다리는 구조 — 그 사이 비즈니스 속도는 외주사 일정에 묶입니다."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-10">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="font-display text-lg font-bold text-navy-900">아마 익숙하실 장면들</h3>
              <ul className="reum-card-body mt-5 space-y-4 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-600">
                    !
                  </span>
                  <span>단순 텍스트 한 줄 고치는데 “견적 다시 잡아야 한다”는 답이 돌아온다.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-600">
                    !
                  </span>
                  <span>이미지 한 장 교체에 며칠이 걸려, 결국 캠페인 타이밍을 놓쳤다.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-600">
                    !
                  </span>
                  <span>소스코드도 권한도 내 손에 없어, 정작 ‘내 서비스’가 내 것 같지 않다.</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col justify-center rounded-2xl border border-navy-800 bg-navy-900 p-8 text-slate-300 shadow-card">
              <p className="font-display text-sm font-semibold uppercase tracking-wider text-sky-300/90">름랩의 입장</p>
              <p className="mt-3 text-lg font-semibold leading-snug text-white">
                외주는 ‘맡기고 끝’이 아니라, 대표님이 직접 굴리기 시작하는 출발점이어야 합니다.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-200">
                그래서 름랩은 납품과 동시에 ‘스스로 고칠 수 있는 상태’를 함께 만듭니다. 매달 나가던 수정 비용과
                반복되는 소통 시간을, 비즈니스를 키우는 데 다시 쓰실 수 있도록.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section id="solution" className="scroll-mt-24 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="름랩이 다른 점"
            title="빠른 MVP, 통째로 넘기는 소스코드 — 그리고 보너스"
            description="같은 예산으로 더 빨리 출시하고, 결과물의 소유권은 처음부터 대표님께 둡니다. 직접 운영하는 법까지 가르치는 건 덤입니다."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <FeatureCard icon={<IconDevices className="h-6 w-6" />} title="한 번에 안드로이드 · iOS, 빠른 MVP">
              Flutter로 두 플랫폼을 한 코드로 만듭니다. 시장 검증에 필요한 핵심 기능부터 단단하게 잡아,
              같은 예산으로 더 빠르고 안정적으로 출시합니다.
            </FeatureCard>
            <FeatureCard icon={<IconShield className="h-6 w-6" />} title="소스코드를 통째로, 권한은 대표님 것">
              결과물만이 아니라 소스코드 전체를 넘깁니다. 다른 곳에 맡기든 직접 고치든, 처음부터 대표님 자산입니다.
              외주에 묶이지 않습니다.
            </FeatureCard>
            <FeatureCard icon={<IconGraduate className="h-6 w-6" />} title="게다가, 직접 고치는 법까지 1:1로">
              교육공학 석사 대표가 직접 가르칩니다. 코딩을 몰라도 AI 도구를 보조 개발자처럼 부려 글자·이미지 교체부터
              간단한 수정까지 직접 — 매달 나가던 수정비를 0에 가깝게 줄입니다.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Handover / 직접 운영 세팅 + 데모 영상 */}
      <section id="handover" className="scroll-mt-24 border-t border-slate-100 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-accent-deep">
                DIRECT HANDOVER
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
                사이트만 넘겨드리지 않습니다. 직접 유지보수하실 수 있게, 전부 세팅해 드립니다.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-700 sm:text-lg">
                메뉴별로 정리된 전용 관리 화면을 함께 세팅해 드립니다. 연락처·가격·후기·블로그까지,
                개발자 없이도 클릭 몇 번으로 직접 수정하고 게시하실 수 있습니다.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  '메뉴별로 정리된 콘텐츠 관리 화면 — 무엇을 어디서 고치는지 한눈에',
                  '텍스트·이미지·가격·후기까지 클릭 몇 번으로 직접 수정·게시',
                  '처음 한 번, 실제 화면으로 1:1 운영 교육까지 포함',
                ].map((text) => (
                  <li key={text} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent-deep"
                      aria-hidden
                    >
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                    <span className="text-[15px] font-semibold leading-relaxed text-slate-700">{text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-9">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-7 py-3.5 font-display text-sm font-semibold text-white shadow-blue transition hover:bg-accent-deep"
                  data-analytics="cta_home_handover"
                >
                  운영 세팅 포함 상담
                </a>
              </div>
            </div>
            <figure className="m-0">
              <div
                className="mx-auto overflow-hidden rounded-2xl border border-slate-200 bg-navy-950 shadow-card-hover"
                style={{ aspectRatio: '1080 / 1350', maxWidth: 408 }}
              >
                <video
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/assets/images/cms-promo-poster.jpg"
                  aria-label="름랩이 세팅해 드리는 콘텐츠 관리 화면 데모 영상"
                >
                  <source src="/assets/videos/cms-promo.mp4" type="video/mp4" />
                </video>
              </div>
              <figcaption className="mt-3.5 text-center text-sm text-slate-500">
                실제 운영 관리 화면 — 메뉴별로 정리된 콘텐츠를 직접 수정·게시합니다.
              </figcaption>
            </figure>
          </div>
          <div className="mt-12">
            <p className="text-center font-display text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              관리자 화면 미리보기
            </p>
            <div className="mx-auto mt-5 grid max-w-3xl gap-5 sm:grid-cols-3">
              {[
                { src: '/assets/images/admin-preview-1.jpg', cap: '글자 하나도 전화 없이 직접', alt: '관리자 화면 — 매번 개발자에게 전화할 필요 없이 직접 수정' },
                { src: '/assets/images/admin-preview-2.jpg', cap: '연락처·가격·SEO 바로 수정', alt: '관리자 화면 — 연락처·가격·메인 문구·SEO를 클릭해서 바로 수정' },
                { src: '/assets/images/admin-preview-3.jpg', cap: '블로그·후기·FAQ도 직접', alt: '관리자 화면 — 블로그·후기·FAQ도 직접 올리고 삭제' },
              ].map((s) => (
                <figure key={s.src} className="m-0">
                  <img
                    src={s.src}
                    width={760}
                    height={950}
                    loading="lazy"
                    decoding="async"
                    alt={s.alt}
                    className="w-full rounded-2xl border border-slate-200 bg-navy-900 shadow-card"
                  />
                  <figcaption className="mt-2.5 text-center text-[13px] font-semibold text-slate-500">{s.cap}</figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-7 text-center">
              <a
                href="/assets/admin-guide-example.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-accent hover:text-accent"
              >
                운영 가이드 예시 보기 →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Audience */}
      <section id="audience" className="scroll-mt-24 border-y border-slate-100 bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="이런 분께 맞습니다"
            title="이런 대표님이라면, 통화 한 번 해보시길"
          />
          <ul className="mx-auto mt-12 max-w-3xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm">
            {[
              '한정된 예산으로 빠르게 MVP를 띄우고 시장 반응부터 보고 싶은 분',
              '작은 업데이트마다 나가는 외주 비용이 슬슬 아까워진 분',
              '길게 보고, 내 서비스를 내 손으로 운영할 힘을 갖추고 싶은 분',
            ].map((text) => (
              <li key={text} className="flex items-start gap-4 px-6 py-5 sm:px-8 sm:py-6">
                <span
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-deep"
                  aria-hidden
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-sm font-medium leading-relaxed text-navy-900 sm:text-base">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="scroll-mt-24 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="진행 방식"
            title="통화 한 번에서 ‘직접 운영’까지, 다섯 단계"
            description="기획부터 교육까지 끊기지 않게 한 흐름으로 묶었습니다. 중간에 사라지지 않습니다."
          />
          <ol className="relative mt-14 max-w-3xl space-y-6 border-l border-slate-200 pl-8 sm:pl-10">
            {PROCESS_STEPS.map((item) => (
              <li key={item.step} className="relative">
                <span
                  className="absolute -left-[39px] top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-accent bg-white text-xs font-bold text-accent-deep sm:-left-[43px]"
                  aria-hidden
                >
                  {item.step}
                </span>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <h3 className="font-display text-lg font-bold text-navy-900">{item.title}</h3>
                  <p className="reum-card-body mt-2 text-sm leading-relaxed text-slate-700">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-24 bg-navy-950 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            dark
            eyebrow="패키지와 금액"
            title="가격을 먼저 공개합니다"
            description="모두 VAT 포함 정액입니다. 웹은 49만 원부터, 앱은 290만 원부터 — 필요한 깊이만큼 고르세요. 패키지를 넘는 요구는 통화하며 솔직하게 별도 견적을 드립니다."
          />

          <div className="mx-auto mt-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-400/15 px-4 py-1.5 font-display text-xs font-bold text-sky-200 ring-1 ring-sky-400/30">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              범위·금액 선확정 · 표시가가 곧 견적 기준
            </span>
          </div>

          <div className="mt-12 space-y-12">
            <PricingLine label="웹(Web) 라인" caption="가볍게 시작해 필요한 만큼 확장" packages={WEB_PACKAGES} />
            <PricingLine label="앱(App) 라인" caption="Flutter로 iOS·안드로이드 동시 — 기능 깊이로 선택" packages={APP_PACKAGES} />
          </div>

          {/* 범위·금액 선확정 — 정액제 vs 일반 외주 비교 */}
          <div className="mt-16">
            <h3 className="text-center font-display text-lg font-bold text-white sm:text-xl">정액제가 남기는 차이</h3>
            <p className="mt-2 text-center text-sm text-slate-300">같은 결과물이라도, 끝까지 남는 비용이 다릅니다.</p>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-navy-900/40">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <caption className="sr-only">름랩 정액제와 일반 외주 비교</caption>
                <thead>
                  <tr className="border-b border-white/10 bg-navy-850/60">
                    <th scope="col" className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-5">
                      항목
                    </th>
                    <th scope="col" className="px-4 py-3 font-display text-xs font-bold uppercase tracking-wider text-sky-200 sm:px-5">
                      름랩
                    </th>
                    <th scope="col" className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-5">
                      일반 외주
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row) => (
                    <tr key={row.label} className="border-b border-white/5 last:border-0">
                      <th scope="row" className="whitespace-nowrap px-4 py-3.5 font-display font-bold text-white sm:px-5">
                        {row.label}
                      </th>
                      <td className="px-4 py-3.5 sm:px-5">
                        <span className="inline-flex items-start gap-1.5 font-medium text-sky-100">
                          <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {row.reum}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 sm:px-5">{row.other}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500 sm:text-sm">
            어떤 패키지가 맞을지 모르겠다면, 전화 한 통이 가장 빠릅니다. 상황만 들어도 방향을 잡아드립니다.
          </p>
          <div className="mt-8 flex justify-center">
            <ContactButtons variant="dark" mailSubject="[름랩] 패키지 상담 문의" />
          </div>
        </div>
      </section>

      {/* 소상공인 특가 배너 */}
      <section className="border-y border-amber-100 bg-amber-50 py-14 sm:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-block rounded-full bg-amber-200 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-800 mb-3">
                소상공인 · 자영업자 특가
              </span>
              <h2 className="font-display text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">
                자영업자세요? 검색 노출까지 잡은<br />
                <span className="text-amber-700">VAT 포함 49만원</span> 홈페이지가 따로 있습니다
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 max-w-lg">
                음식점·카페·학원·뷰티 등 단일 브랜드 자영업자 전용. 네이버·구글 검색 노출 설계 + 모바일 반응형 · 소스코드 전체 이관 · 월 관리비 없음.
              </p>
            </div>
            <Link
              href="/soho/"
              className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-7 py-4 text-sm font-bold text-white shadow-md transition-all hover:bg-amber-600 hover:shadow-lg"
              data-analytics="cta_soho_banner"
            >
              특가 패키지 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* Prep + FAQ */}
      <section id="prepare" className="scroll-mt-24 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="이것만 챙겨주시면"
            title="이 정도만 정리해 오시면 상담이 빨라집니다"
            description="형식은 자유입니다. 손그림이든 메모든 좋고, 없는 항목은 통화하면서 함께 채워도 됩니다."
          />
          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50/80 p-8 sm:p-10">
            <ul className="grid gap-6 sm:grid-cols-2">
              {[
                { title: '꼭 필요한 기능', desc: '반드시 있어야 할 기능과 나중에 붙여도 될 기능을 구분해 주세요.' },
                { title: '참고할 서비스', desc: '마음에 든 앱·사이트 링크와 “이 점이 좋다” 한 줄이면 충분합니다.' },
                { title: '대략의 화면 구성', desc: '손그림, 노션, 캡처 — 표현 방식은 무엇이든 괜찮습니다.' },
                { title: '브랜드 자료', desc: '로고·컬러·폰트·말투가 있으면 결과물 반영 속도가 빨라집니다.' },
              ].map((item) => (
                <li key={item.title} className="border-l-4 border-accent pl-5">
                  <h3 className="font-display font-bold text-navy-900">{item.title}</h3>
                  <p className="reum-card-body mt-2 text-sm leading-relaxed text-slate-700">{item.desc}</p>
                </li>
              ))}
            </ul>
          </div>

          <div id="faq" className="scroll-mt-24 mt-20">
            <SectionHeading eyebrow="FAQ" title="궁금하실 만한 것들" />
            <div className="mt-10 space-y-4">
              {FAQ_ITEMS.map((item) => (
                <div
                  key={item.q}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm"
                >
                  <h3 className="font-display text-sm font-bold text-navy-900 sm:text-base">{item.q}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-5 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
            고민만 하다 타이밍 놓치기 전에, 30분만 통화해요
          </h2>
          <p className="max-w-xl text-sm text-slate-600 sm:text-base">
            아이디어만 있어도 괜찮습니다. 가능한지, 얼마쯤 드는지, 더 나은 길은 없는지 — 솔직하게 말씀드립니다.
            상담은 무료이고, 영업 전화로 괴롭히지 않습니다.
          </p>
          <ContactButtons mailSubject="[름랩] 앱·웹 개발 문의" />
          <p className="text-sm text-slate-600">
            통화가 부담되시면 이메일로 문의 주세요. 영업일 기준 24시간 내 연락드립니다.
          </p>
          <p className="text-xs text-slate-500">전화 {SITE.phone} · 이메일 {SITE.email} · 평일 10:00–18:00</p>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-5xl px-5 text-center text-xs leading-relaxed text-slate-600 sm:px-6 lg:px-8 sm:text-sm">
          <p className="font-display font-semibold text-navy-900">REUMLAB · 름랩</p>
          <div className="mt-4 space-y-1.5 text-[13px] leading-relaxed sm:text-sm">
            <p>
              <span className="font-semibold text-navy-900">{company}</span>
            </p>
            <p>대표자: {SITE.representative}</p>
            <p>사업자등록번호: {SITE.bizNo}</p>
            <p>
              연락처:{' '}
              <a className="text-accent-deep underline-offset-2 hover:underline" href={TEL_HREF}>
                {SITE.phone}
              </a>
            </p>
            <p>주소: {SITE.address}</p>
            <p>
              이메일:{' '}
              <a className="text-accent-deep underline-offset-2 hover:underline" href={MAIL_HREF}>
                {SITE.email}
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
