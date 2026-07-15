import Link from 'next/link';
import { getSite, getLandingBySlug, getHubBySlug } from '../lib/data';
import { buildLandingContent } from '../lib/landing-content';
import BusinessFooter from './BusinessFooter';
import LandingInquiryForm from './LandingInquiryForm';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://reumlab.com';

export default function LandingPage({ slug }) {
  const site = getSite();
  const landing = getLandingBySlug(slug);
  if (!landing) return null;

  const c = buildLandingContent(landing);
  const kw = landing.keyword;
  const tel = `tel:${String(site.tel || '').replace(/-/g, '')}`;
  const mail = `mailto:${site.email}`;
  const hub = landing.hubId ? getHubBySlug(landing.hubId) : null;

  const stats = [
    ['100%', '소스코드 이관'],
    ['0원', '월 관리비'],
    ['1:1', '대표 직접 소통'],
    ['전국', '어디서나 진행'],
  ];

  return (
    <div className="bg-white font-sans text-slate-800">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800 px-5 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <nav className="mb-6 text-sm text-slate-400">
            <Link href="/" className="hover:text-slate-200">홈</Link>
            <span className="mx-2">/</span>
            {hub ? (
              <>
                <Link href={`/h/${landing.hubId}/`} className="hover:text-slate-200">{hub.ko}</Link>
                <span className="mx-2">/</span>
              </>
            ) : null}
            <span className="text-slate-300">{kw}</span>
          </nav>

          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-sky-300 ring-1 ring-white/15">
            {c.badge}
          </span>
          <h1 className="mt-6 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {kw}
          </h1>
          <p className="mt-3 text-lg font-semibold text-sky-300">{c.serviceLabel} 견적·상담</p>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {c.heroSub}
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href={tel} className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-accent-deep">
              📞 {site.tel} 전화 상담
            </a>
            <a href={mail} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-7 py-4 text-base font-bold text-white ring-1 ring-white/20 transition-all hover:bg-white/15">
              ✉️ 이메일 문의
            </a>
          </div>

          <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-4 sm:gap-6">
            {stats.map(([n, l]) => (
              <div key={l} className="text-center">
                <dt className="font-display text-2xl font-bold text-white sm:text-3xl">{n}</dt>
                <dd className="mt-1 text-xs text-slate-400 sm:text-sm">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 인트로 ── */}
      <section className="px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <span className="text-sm font-bold uppercase tracking-wide text-accent">{c.serviceLabel}</span>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
            {kw}, 이렇게 도와드립니다
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-slate-600 sm:text-base">{c.intro}</p>
        </div>
      </section>

      {/* ── 포함 항목 ── */}
      <section className="border-y border-slate-100 bg-slate-50 px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
            {c.serviceLabel}에 포함되는 것
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.deliverables.map((d) => (
              <div key={d.t} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">✓</div>
                <h3 className="mt-4 text-base font-bold text-navy-900">{d.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{d.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 인텐트 앵글 ── */}
      <section className="px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
            {c.angle.title}
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-slate-600 sm:text-base">{c.angle.body}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {c.angle.points.map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white">✓</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 가격 가이드 ── */}
      <section className="bg-navy-950 px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {c.serviceLabel} 가격 가이드
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">{c.pricing.note}</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {c.pricing.tiers.map((t) => (
              <div
                key={t.tier}
                className={`rounded-2xl p-7 ${
                  t.featured
                    ? 'bg-white text-navy-900 shadow-card-hover ring-2 ring-accent'
                    : 'bg-navy-850/60 text-slate-200 ring-1 ring-white/10'
                }`}
              >
                {t.featured ? (
                  <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">추천</span>
                ) : null}
                <h3 className={`text-sm font-bold ${t.featured ? 'text-accent-deep' : 'text-sky-300'}`}>{t.tier}</h3>
                <p className={`mt-2 font-display text-3xl font-bold ${t.featured ? 'text-navy-900' : 'text-white'}`}>{t.price}</p>
                <p className={`mt-1 text-xs ${t.featured ? 'text-slate-500' : 'text-slate-400'}`}>{t.period}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {t.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 ${t.featured ? 'text-slate-700' : 'text-slate-300'}`}>
                      <span className={t.featured ? 'text-accent' : 'text-sky-300'}>·</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 진행 과정 ── */}
      <section className="px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">진행 과정</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.process.map((s) => (
              <div key={s.step} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
                <div className="font-display text-2xl font-bold text-accent">{s.step}</div>
                <h3 className="mt-3 text-base font-bold text-navy-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 이런 분께 ── */}
      <section className="border-y border-slate-100 bg-slate-50 px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
            이런 분께 추천합니다
          </h2>
          <ul className="mt-8 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {c.audience.map((a) => (
              <li key={a} className="flex items-start gap-3 px-6 py-4 text-[15px] text-slate-700">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent-soft text-accent">✓</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 직접 운영 세팅 + 데모 영상 ── */}
      <section className="px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="text-sm font-bold uppercase tracking-wide text-accent">DIRECT HANDOVER</span>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
                사이트만 넘겨드리지 않습니다. 직접 유지보수하실 수 있게, 전부 세팅해 드립니다.
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-slate-600 sm:text-base">
                메뉴별로 정리된 전용 관리 화면을 함께 세팅해 드립니다. 연락처·가격·후기·블로그까지,
                개발자 없이도 클릭 몇 번으로 직접 수정하고 게시하실 수 있습니다.
              </p>
              <ul className="mt-7 space-y-3">
                {[
                  '메뉴별로 정리된 콘텐츠 관리 화면 — 무엇을 어디서 고치는지 한눈에',
                  '텍스트·이미지·가격·후기까지 클릭 몇 번으로 직접 수정·게시',
                  '처음 한 번, 실제 화면으로 1:1 운영 교육까지 포함',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[15px] text-slate-700">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent-soft text-[11px] font-bold text-accent">✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <figure className="m-0">
              <div className="mx-auto overflow-hidden rounded-2xl border border-slate-200 bg-navy-950 shadow-card-hover" style={{ aspectRatio: '1080 / 1350', maxWidth: 408 }}>
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
              <figcaption className="mt-3 text-center text-sm text-slate-500">
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

      {/* ── FAQ ── */}
      <section className="px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">자주 묻는 질문</h2>
          <div className="mt-8 space-y-3">
            {c.faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-[15px] font-bold text-navy-900">
                  {f.q}
                  <span className="flex-none text-xl font-normal text-accent transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="px-6 pb-5 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 최종 CTA ── */}
      <section className="bg-gradient-to-br from-accent to-accent-deep px-5 py-16 text-center sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {kw} 견적, 지금 받아보세요
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
            가능한지, 얼마쯤 드는지, 더 나은 방법은 없는지 — 솔직하게 안내드립니다. 상담은 무료입니다.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={tel} className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-base font-bold text-accent-deep shadow-lg transition-transform hover:-translate-y-0.5">
              📞 {site.tel} 전화 상담
            </a>
            <a href={mail} className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-7 py-4 text-base font-bold text-white ring-1 ring-white/40 transition-all hover:bg-white/25">
              ✉️ 이메일 문의
            </a>
          </div>

          {/* 홈과 동일한 상담 폼(Netlify main-apply) — 전화·이메일이 부담될 때 바로 접수 */}
          <div className="mt-8">
            <LandingInquiryForm landingSlug={slug} />
          </div>

          {hub ? (
            <p className="mt-6 text-sm text-white/80">
              <Link href={`/h/${landing.hubId}/`} className="font-semibold underline-offset-2 hover:underline">
                {hub.ko} 관련 다른 키워드 보기 →
              </Link>
            </p>
          ) : null}
        </div>
      </section>

      <BusinessFooter />
    </div>
  );
}
