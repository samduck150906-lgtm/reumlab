import Link from 'next/link';
import type { ReactNode } from 'react';

type Site = {
  kakao?: string;
  email?: string;
  company?: string;
};

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

function SectionHeading({
  eyebrow,
  title,
  description,
  dark,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  dark?: boolean;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p
        className={`font-display text-xs font-semibold uppercase tracking-[0.2em] ${
          dark ? 'text-sky-200/90' : 'text-accent-deep'
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl ${
          dark ? 'text-white' : 'text-navy-900'
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            dark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
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
      <h3 className="font-display text-lg font-bold text-navy-900">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">{children}</p>
    </div>
  );
}

const PROCESS_STEPS = [
  {
    step: 'Step 1',
    title: '상담 및 기획안 검토',
    desc: '아이디어와 요구사항을 깊이 있게 정리하고, 실행 가능한 범위와 우선순위를 함께 확정합니다.',
  },
  {
    step: 'Step 2',
    title: 'AI 기반 UI/UX 설계',
    desc: 'Flutter와 최신 디자인 도구로 프로토타입을 설계해, 개발 전에 화면과 흐름을 명확히 맞춥니다.',
  },
  {
    step: 'Step 3',
    title: '본 개발 및 피드백',
    desc: '크로스플랫폼 개발과 중간 점검으로 방향을 빠르게 검증하고, 필요 시 즉시 조정합니다.',
  },
  {
    step: 'Step 4',
    title: '최종 산출물 및 소스코드 납품',
    desc: '런칭 가능한 산출물과 함께 소스코드를 전달해, 이후 운영과 수정의 주도권을 고객에게 남깁니다.',
  },
  {
    step: 'Step 5',
    title: '1:1 유지보수 맞춤 교육',
    desc: '온·오프라인으로 텍스트·이미지 교체와 간단한 오류 대응까지, 직접 손볼 수 있게 전수합니다.',
  },
] as const;

const PACKAGES = [
  {
    tier: 'STANDARD',
    checkoutKey: 'standard' as const,
    title: '웹 개발 + 강의',
    bullets: [
      '간단한 웹 개발 진행',
      'AI로 웹 만드는 방법, 이후 유지보수하는 방법 온라인으로 알려드립니다.',
    ],
    priceWon: 1_490_000,
    durationDays: 14,
    featured: false,
  },
  {
    tier: 'DELUXE',
    checkoutKey: 'deluxe' as const,
    title: '앱 개발 + 강의',
    bullets: [
      '간단한 앱 개발 진행',
      'AI로 앱 만드는 방법, 이후 유지보수하는 방법 온라인으로 알려드립니다.',
    ],
    priceWon: 4_990_000,
    durationDays: 21,
    featured: true,
    badge: '가장 인기 있는 패키지',
  },
  {
    tier: 'PREMIUM',
    checkoutKey: 'premium' as const,
    title: '고도화된 앱 또는 웹 개발 + 강의',
    bullets: [
      '복잡한 앱 또는 웹 개발 진행',
      'AI로 앱 또는 웹 만드는 방법, 이후 유지보수법 온라인티칭',
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
    q: '코딩을 전혀 몰라도 교육을 따라갈 수 있나요?',
    a: '네. 비전공·문과 출신 대표님을 기준으로, AI 도구와 자연어로 수정하는 흐름부터 차근차근 맞춤 지도합니다.',
  },
  {
    q: 'Flutter만 가능한가요, 웹도 되나요?',
    a: '앱은 Flutter 크로스플랫폼을 권장하며, 웹·랜딩은 프로젝트 성격에 맞는 스택으로 함께 설계합니다. 상담 시 최적 조합을 제안드립니다.',
  },
  {
    q: '금액과 VAT는 어떻게 되나요?',
    a: '패키지 금액은 부가세(VAT)가 포함된 금액입니다. 범위가 패키지 설명을 넘어서는 경우에는 상담 후 추가 견적이 필요할 수 있습니다.',
  },
  {
    q: '납품 후에도 문의할 수 있나요?',
    a: '네. 1:1 유지보수 교육 이후에도 합리적인 범위 내 후속 질의·가이드를 지원합니다. 추가 개발은 별도 협의입니다.',
  },
] as const;

export default function ReumSalesLanding({ site }: { site: Site }) {
  const kakao = site?.kakao || 'https://open.kakao.com/o/sNAsri4h';
  const email = site?.email || 'ceo@eternalsix.kr';
  const company = site?.company || '이터널식스';

  return (
    <main className="bg-white text-slate-800 antialiased">
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
          <h1 className="mx-auto mt-6 max-w-4xl text-center font-display text-[1.65rem] font-bold leading-snug tracking-tight text-white sm:text-4xl sm:leading-tight lg:text-[2.65rem]">
            외주 개발, 앱/웹 론칭이 끝이 아닙니다.
            <span className="mt-2 block text-slate-200 sm:mt-3">
              진짜 시작은 <span className="text-sky-300">&apos;유지보수&apos;</span>입니다.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-slate-300 sm:text-lg">
            비전공자 대표님도 직접 수정하고 관리하는{' '}
            <strong className="font-semibold text-white">AI 기반 앱/웹 개발 &amp; 자체 유지보수</strong>{' '}
            1:1 완벽 전수
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/consultation/"
              className="inline-flex min-h-[48px] w-full max-w-xs items-center justify-center rounded-xl bg-white px-8 py-3.5 text-center font-display text-sm font-semibold text-navy-900 shadow-lg transition hover:bg-slate-100 sm:w-auto"
            >
              아이디어 무료 상담하기
            </Link>
            <Link
              href="/portfolio/"
              className="inline-flex min-h-[48px] w-full max-w-xs items-center justify-center rounded-xl border border-white/25 bg-white/5 px-8 py-3.5 text-center font-display text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10 sm:w-auto"
            >
              포트폴리오 보기
            </Link>
          </div>
          <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 border-t border-white/10 pt-10 sm:grid-cols-3 sm:gap-6">
            <div className="text-center sm:text-left">
              <dt className="font-display text-xs font-medium uppercase tracking-wider text-slate-400">파트너십</dt>
              <dd className="mt-1 text-sm font-medium text-white">론칭 이후까지 설계</dd>
            </div>
            <div className="text-center sm:text-left">
              <dt className="font-display text-xs font-medium uppercase tracking-wider text-slate-400">교육</dt>
              <dd className="mt-1 text-sm font-medium text-white">교육공학 석사 기반 커리큘럼</dd>
            </div>
            <div className="text-center sm:text-left">
              <dt className="font-display text-xs font-medium uppercase tracking-wider text-slate-400">기술</dt>
              <dd className="mt-1 text-sm font-medium text-white">Flutter · AI 보조 개발</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Pain */}
      <section id="pain" className="scroll-mt-24 border-b border-slate-100 bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Pain Point"
            title="작은 수정 하나에도 시간과 비용이 묶이셨나요?"
            description="론칭 후 문구 하나, 이미지 한 장을 바꾸는 일에 수십만 원과 며칠이 걸리는 경험은 흔합니다. 개발사 일정에 맞춰 끌려다니며 비즈니스 속도가 느려지는 구조에서 벗어나야 합니다."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-10">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="font-display text-lg font-bold text-navy-900">공감하는 순간들</h3>
              <ul className="mt-5 space-y-4 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-600">
                    !
                  </span>
                  <span>단순 텍스트 수정인데도 &apos;견적 재산정&apos;이 나오며 답답했던 적.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-600">
                    !
                  </span>
                  <span>이미지 한 장 교체에 며칠이 걸리며 캠페인 타이밍을 놓친 경험.</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-600">
                    !
                  </span>
                  <span>소스코드와 권한이 불투명해 &apos;내 제품&apos; 같지 않았던 느낌.</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col justify-center rounded-2xl border border-navy-800 bg-navy-900 p-8 text-slate-300 shadow-card">
              <p className="font-display text-sm font-semibold uppercase tracking-wider text-sky-300/90">Our stance</p>
              <p className="mt-3 text-lg font-semibold leading-snug text-white">
                외주는 &apos;맡기고 끝&apos;이 아니라, 대표님이 주도하는 IT 운영의 시작점이어야 합니다.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                림랩은 납품 후에도 대표님이 스스로 고칠 수 있는 체계를 함께 만듭니다. 유지보수 비용을 줄이고,
                반복되는 소통 비용 대신 성장에 쓸 시간을 되돌려 드리는 것이 목표입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section id="solution" className="scroll-mt-24 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Solution & Features"
            title="개발과 교육을 한 번에, 세 가지 약속"
            description="기술을 대신해주는 팀이 아니라, 대표님의 비즈니스가 스스로 숨 쉬는 IT 환경을 설계합니다."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <FeatureCard icon={<IconGraduate className="h-6 w-6" />} title="교육공학 석사의 눈높이 맞춤 교육">
              코딩을 모르는 문과생 출신 대표도 AI 툴을 보조 개발자로 활용하고, 자연어로 코드를 수정하는 방법을
              쉽고 꼼꼼하게 안내합니다. 암기가 아닌 &apos;운영 흐름&apos; 중심으로 익힙니다.
            </FeatureCard>
            <FeatureCard icon={<IconDevices className="h-6 w-6" />} title="실무 투입 가능한 크로스플랫폼">
              Flutter로 안드로이드와 iOS를 동시에 구축해 MVP를 빠르고 안정적으로 완성합니다. 시장 검증에
              필요한 최소 기능부터 단단하게 집니다.
            </FeatureCard>
            <FeatureCard icon={<IconShield className="h-6 w-6" />} title="유지보수 비용 0원을 향한 자립">
              텍스트 수정, 이미지 교체, 간단한 오류 해결을 직접 수행할 수 있게 해 고정 비용을 줄입니다. 외주
              의존도를 낮추고 비즈니스 본질에 집중할 수 있도록 돕습니다.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Audience */}
      <section id="audience" className="scroll-mt-24 border-y border-slate-100 bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Target Audience"
            title="이런 대표님께 림랩을 권합니다"
          />
          <ul className="mx-auto mt-12 max-w-3xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-sm">
            {[
              '합리적인 예산으로 빠른 MVP 개발 및 시장 반응 확인이 필요한 분',
              '사소한 업데이트마다 발생하는 외주 비용이 부담스러운 분',
              '장기적으로 내 비즈니스의 IT 자생력을 키우고 싶은 분',
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
            eyebrow="Process"
            title="진행 절차"
            description="기획부터 교육까지 한 흐름으로, 중간에 끊기지 않도록 설계했습니다."
          />
          <ol className="relative mt-14 max-w-3xl space-y-6 border-l border-slate-200 pl-8 sm:pl-10">
            {PROCESS_STEPS.map((item, i) => (
              <li key={item.step} className="relative">
                <span
                  className="absolute -left-[39px] top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-accent bg-white text-xs font-bold text-accent-deep sm:-left-[43px]"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex sm:gap-6 sm:p-8">
                  <div className="hidden w-28 shrink-0 font-display text-sm font-bold text-accent-deep sm:block">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-display text-xs font-semibold text-accent-deep sm:hidden">{item.step}</p>
                    <h3 className="mt-1 font-display text-lg font-bold text-navy-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                  </div>
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
            eyebrow="Pricing & Packages"
            title="패키지 요금"
            description="VAT가 포함된 정액 패키지입니다. 진행 범위는 상담 시 함께 확정하며, 표준 패키지를 넘는 요구는 별도 협의할 수 있습니다."
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
                <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-sky-200/80">
                  {pkg.tier}
                </p>
                <h3 className="mt-3 font-display text-lg font-bold leading-snug text-white sm:text-xl">
                  {pkg.title}
                </h3>
                <p className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-[2rem]">
                  {formatKrw(pkg.priceWon)}
                </p>
                <p className="mt-1 text-sm text-slate-400">VAT 포함</p>
                <p className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-200 ring-1 ring-white/10">
                  <span className="font-display text-xs font-semibold uppercase tracking-wider text-slate-400">
                    작업 기간
                  </span>
                  <span className="font-semibold text-white">{pkg.durationDays}일</span>
                </p>
                <ol className="mt-6 flex-1 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate-300 sm:text-[15px]">
                  {pkg.bullets.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ol>
                <div className="mt-8 flex flex-col gap-2">
                  <Link
                    href={`/checkout-reum.html?package=${pkg.checkoutKey}`}
                    className={`inline-flex min-h-[48px] w-full items-center justify-center rounded-xl px-5 py-3.5 text-center font-display text-sm font-semibold transition ${
                      pkg.featured
                        ? 'bg-accent text-white hover:bg-accent-deep'
                        : 'bg-white text-navy-900 hover:bg-slate-100'
                    }`}
                  >
                    {formatKrw(pkg.priceWon)} 결제하기
                  </Link>
                  <Link
                    href="/consultation/"
                    className={`inline-flex min-h-[44px] w-full items-center justify-center rounded-xl px-5 py-3 text-center font-display text-xs font-semibold text-slate-300 underline-offset-2 transition hover:text-white sm:text-sm ${
                      pkg.featured ? 'hover:underline' : 'border border-white/15 hover:border-white/25'
                    }`}
                  >
                    상담만 받기
                  </Link>
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
                    제목
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
                    <td className="whitespace-nowrap px-4 py-3.5 text-slate-300 sm:px-5">{pkg.durationDays}일</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500 sm:text-sm">
            패키지 외 범위·고도화가 필요하면 상담 후 맞춤 견적을 안내드립니다.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/consultation/"
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-white px-8 py-3.5 font-display text-sm font-semibold text-navy-900 transition hover:bg-slate-100"
            >
              패키지 상담 요청하기
            </Link>
          </div>
        </div>
      </section>

      {/* Prep + FAQ */}
      <section id="prepare" className="scroll-mt-24 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Preparation"
            title="프로젝트 성공을 위한 준비물"
            description="아래를 미리 정리해 주시면 상담과 기획이 훨씬 빨라집니다. 형식은 자유이며, 없는 항목은 함께 채워 나가면 됩니다."
          />
          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50/80 p-8 sm:p-10">
            <ul className="grid gap-6 sm:grid-cols-2">
              {[
                { title: '핵심 기능 명세서', desc: '꼭 있어야 할 기능과 나중에 넣을 기능을 구분해 주세요.' },
                { title: '레퍼런스 링크', desc: '마음에 드는 서비스·앱 URL과 이유 한 줄이면 충분합니다.' },
                { title: '대략적인 화면 기획안', desc: '손그림, 노션, 링크 등 표현 방식은 무관합니다.' },
                { title: '브랜드 에셋', desc: '로고, 컬러 코드, 폰트, 카피 톤 등이 있으면 반영 속도가 빨라집니다.' },
              ].map((item) => (
                <li key={item.title} className="border-l-4 border-accent pl-5">
                  <h3 className="font-display font-bold text-navy-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                </li>
              ))}
            </ul>
          </div>

          <div id="faq" className="scroll-mt-24 mt-20">
            <SectionHeading
              eyebrow="FAQ"
              title="자주 묻는 질문"
            />
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
            림랩과 함께, IT 주도권을 되찾을 준비가 되셨나요?
          </h2>
          <p className="max-w-xl text-sm text-slate-600 sm:text-base">
            무료 상담으로 아이디어를 말씀해 주시면, 가능한 접근과 교육·개발 로드맵을 솔직하게 안내드립니다.
          </p>
          <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Link
              href="/consultation/"
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-navy-900 px-8 py-3.5 font-display text-sm font-semibold text-white transition hover:bg-navy-950"
            >
              아이디어 무료 상담하기
            </Link>
            <a
              href={kakao}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-slate-300 bg-white px-8 py-3.5 font-display text-sm font-semibold text-navy-900 transition hover:border-slate-400"
            >
              카카오톡으로 연결
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-5xl px-5 text-center text-xs leading-relaxed text-slate-500 sm:px-6 lg:px-8 sm:text-sm">
          <p className="font-display font-semibold text-navy-900">REUMLAB · 림랩</p>
          <p className="mt-3">
            사업자명: {company} · 이메일:{' '}
            <a className="text-accent-deep underline-offset-2 hover:underline" href={`mailto:${email}`}>
              {email}
            </a>
          </p>
          <p className="mt-2">
            <Link href="/portfolio/" className="text-accent-deep underline-offset-2 hover:underline">
              포트폴리오
            </Link>
            <span className="mx-2 text-slate-300">|</span>
            <Link href="/consultation/" className="text-accent-deep underline-offset-2 hover:underline">
              상담 신청
            </Link>
          </p>
        </div>
      </footer>
    </main>
  );
}
