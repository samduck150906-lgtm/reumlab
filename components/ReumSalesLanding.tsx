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

const PACKAGES = [
  {
    tier: 'STANDARD',
    title: '웹사이트 + 직접 운영 교육',
    summary: '랜딩·소개·예약 같은 웹부터 시작하는 분',
    bullets: [
      '필요한 기능 중심의 웹사이트 제작',
      'AI 도구로 직접 수정·운영하는 법 온라인 1:1 교육',
      '소스코드 전체 이관',
    ],
    priceWon: 1_490_000,
    durationDays: 14,
    featured: false,
  },
  {
    tier: 'DELUXE',
    title: '모바일 앱 + 직접 운영 교육',
    summary: '앱으로 시장 반응을 빠르게 보고 싶은 분',
    bullets: [
      'Flutter 크로스플랫폼(안드로이드·iOS) 앱 제작',
      'AI 도구로 직접 수정·운영하는 법 온라인 1:1 교육',
      '소스코드 전체 이관',
    ],
    priceWon: 4_990_000,
    durationDays: 21,
    featured: true,
    badge: '가장 많이 선택하세요',
  },
  {
    tier: 'PREMIUM',
    title: '고도화 앱·웹 + 직접 운영 교육',
    summary: '기능이 많거나 복잡한 서비스가 필요한 분',
    bullets: [
      '복잡한 기능까지 포함한 앱 또는 웹 개발',
      'AI 도구로 직접 수정·운영하는 법 온라인 1:1 교육',
      '소스코드 전체 이관',
    ],
    priceWon: 7_990_000,
    durationDays: 30,
    featured: false,
  },
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
    a: '네, 표기된 패키지 금액은 VAT 포함입니다. 패키지 설명 범위를 넘는 기능이 필요하면 상담 후 별도 견적을 솔직하게 안내드립니다. 숨은 비용은 만들지 않습니다.',
  },
  {
    q: '납품이 끝나면 연락이 끊기나요?',
    a: '아니요. 소스코드를 통째로 드리고 직접 고치는 법까지 가르치는 것이 본 서비스입니다. 교육 이후에도 합리적인 범위의 후속 질문은 계속 도와드립니다. 추가 개발만 별도 협의입니다.',
  },
] as const;

export default function ReumSalesLanding({ site }: { site: Site }) {
  const company = site?.company || SITE.company;

  return (
    <main className="reum-landing bg-white text-slate-800 antialiased">
      {/* Hero */}
      <section
        id="top"
        className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-850 pb-24 pt-32 sm:pb-28 sm:pt-36"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(61,124,255,0.35), transparent)',
          }}
        />
        <div className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
          <p className="text-center font-display text-xs font-semibold uppercase tracking-[0.28em] text-sky-200/80">
            Reum Lab · 름랩
          </p>
          <h1 className="mx-auto mt-6 max-w-4xl text-center font-display text-[1.7rem] font-bold leading-snug tracking-tight text-white sm:text-4xl sm:leading-tight lg:text-[2.7rem]">
            예산 안에서, 빠르게 MVP.
            <span className="mt-2 block text-slate-200 sm:mt-3">
              <span className="text-sky-300">소스코드는 통째로</span> 대표님 것입니다.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-slate-300 sm:text-lg">
            Flutter로 iOS·안드로이드를 한 번에. 가격은 먼저 공개하고, 결과물은 소스코드까지 전부 넘깁니다.
            <strong className="font-semibold text-white"> 게다가 직접 수정·운영하는 법까지 1:1로 알려드립니다.</strong>
          </p>
          <div className="mt-10 flex justify-center">
            <ContactButtons variant="dark" mailSubject="[름랩] 앱·웹 개발 문의" />
          </div>
          <p className="mt-5 text-center text-xs text-slate-400">
            상담은 무료입니다 · 평일 10:00–18:00 ·{' '}
            <Link href="/portfolio/" className="text-sky-300 underline-offset-2 hover:underline" data-analytics="cta_hero_portfolio">
              먼저 포트폴리오부터 보기
            </Link>
          </p>
          <dl className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 border-t border-white/10 pt-10 sm:grid-cols-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <dt className="font-display text-xs font-medium uppercase tracking-wider text-slate-400">개발</dt>
              <dd className="mt-1 text-sm font-medium text-white">Flutter로 iOS·안드로이드 동시</dd>
            </div>
            <div className="text-center sm:text-left">
              <dt className="font-display text-xs font-medium uppercase tracking-wider text-slate-400">납품</dt>
              <dd className="mt-1 text-sm font-medium text-white">소스코드 전체 이관</dd>
            </div>
            <div className="text-center sm:text-left">
              <dt className="font-display text-xs font-medium uppercase tracking-wider text-slate-400">가격</dt>
              <dd className="mt-1 text-sm font-medium text-white">VAT 포함 정액 선공개</dd>
            </div>
            <div className="text-center sm:text-left">
              <dt className="font-display text-xs font-medium uppercase tracking-wider text-slate-400">보너스</dt>
              <dd className="mt-1 text-sm font-medium text-white">직접 수정 1:1 교육</dd>
            </div>
          </dl>
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
            description="모두 VAT 포함 정액입니다. 진행 범위는 통화하며 함께 확정하고, 패키지를 넘는 요구는 그때 솔직하게 별도 견적을 드립니다."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <article
                key={pkg.tier}
                className={`relative flex h-full flex-col rounded-2xl border bg-navy-900/70 p-6 pb-8 shadow-xl backdrop-blur sm:p-8 ${
                  pkg.featured
                    ? 'border-accent/50 pt-11 ring-2 ring-accent/40 sm:pt-12 lg:scale-[1.02] lg:-translate-y-1'
                    : 'border-white/10'
                }`}
              >
                {pkg.featured && pkg.badge ? (
                  <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-3 py-1 font-display text-[11px] font-bold text-white shadow-lg sm:text-xs">
                    {pkg.badge}
                  </div>
                ) : null}
                <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-sky-100">
                  {pkg.tier}
                </p>
                <h3 className="mt-3 font-display text-lg font-bold leading-snug text-white sm:text-xl">
                  {pkg.title}
                </h3>
                <p className="mt-1 text-sm text-slate-300">{pkg.summary}</p>
                <p className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-[2rem]">
                  {formatKrw(pkg.priceWon)}
                </p>
                <p className="mt-1 text-sm text-slate-200">VAT 포함 · 작업 약 {pkg.durationDays}일</p>
                <ul className="mt-6 flex-1 space-y-3 text-sm leading-relaxed text-slate-100 sm:text-[15px]">
                  {pkg.bullets.map((line) => (
                    <li key={line} className="flex gap-2.5">
                      <svg className="mt-1 h-3.5 w-3.5 shrink-0 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <ContactButtons variant="compact" mailSubject={`[름랩] ${pkg.title} 문의`} />
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10 bg-navy-900/40">
            <table className="w-full min-w-[600px] border-collapse text-left text-sm text-slate-200">
              <caption className="sr-only">패키지별 금액 및 작업 기간 비교</caption>
              <thead>
                <tr className="border-b border-white/10 bg-navy-850/60">
                  <th scope="col" className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-5">
                    패키지
                  </th>
                  <th scope="col" className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-5">
                    내용
                  </th>
                  <th scope="col" className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-5">
                    금액 (VAT 포함)
                  </th>
                  <th scope="col" className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-slate-400 sm:px-5">
                    작업 기간
                  </th>
                </tr>
              </thead>
              <tbody>
                {PACKAGES.map((pkg) => (
                  <tr
                    key={pkg.tier}
                    className={`border-b border-white/5 last:border-0 ${pkg.featured ? 'bg-accent/10' : ''}`}
                  >
                    <th scope="row" className="whitespace-nowrap px-4 py-3.5 font-display font-bold text-white sm:px-5">
                      {pkg.tier}
                      {pkg.featured ? (
                        <span className="ml-2 align-middle text-[10px] font-semibold text-sky-200">★ 인기</span>
                      ) : null}
                    </th>
                    <td className="max-w-[220px] px-4 py-3.5 text-slate-300 sm:px-5">{pkg.title}</td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-white sm:px-5">
                      {formatKrw(pkg.priceWon)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-slate-300 sm:px-5">약 {pkg.durationDays}일</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500 sm:text-sm">
            어떤 패키지가 맞을지 모르겠다면, 전화 한 통이 가장 빠릅니다. 상황만 들어도 방향을 잡아드립니다.
          </p>
          <div className="mt-8 flex justify-center">
            <ContactButtons variant="dark" mailSubject="[름랩] 패키지 상담 문의" />
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
            통화가 부담되시면{' '}
            <Link href="/consultation/" className="font-semibold text-accent-deep underline-offset-2 hover:underline" data-analytics="cta_strip_form">
              상담 신청서를 남겨 주세요
            </Link>
            . 영업일 기준 24시간 내 연락드립니다.
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
