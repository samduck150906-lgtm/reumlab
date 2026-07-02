import Link from 'next/link';
import {
  getSite,
  getHubBySlug,
  getHubBodyTemplate,
  getKeywordBySlug,
  getLandingBySlug,
  landingRedirectTarget,
} from '../lib/data';
import BusinessFooter from './BusinessFooter';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://reumlab.com';

export default function HubPage({ hubSlug }) {
  const site = getSite();
  const hub = getHubBySlug(hubSlug);
  if (!hub) return null;

  const bodyText = getHubBodyTemplate(hub);
  const tel = `tel:${String(site.tel || '').replace(/-/g, '')}`;
  const mail = `mailto:${site.email}`;
  const landings = (hub.landings || []).slice(0, 60);

  return (
    <div className="bg-white font-sans text-slate-800">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800 px-5 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <nav className="mb-6 text-sm text-slate-400">
            <Link href="/" className="hover:text-slate-200">홈</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-300">{hub.ko}</span>
          </nav>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-sky-300 ring-1 ring-white/15">
            키워드별 견적·상담
          </span>
          <h1 className="mt-6 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {hub.ko}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {bodyText || `${hub.ko} 관련 키워드별 상담 페이지를 모았습니다. 원하는 항목에서 바로 견적·상담을 받아 보세요.`}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href={tel} className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-accent-deep">
              📞 {site.tel} 전화 상담
            </a>
            <a href={mail} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-7 py-4 text-base font-bold text-white ring-1 ring-white/20 transition-all hover:bg-white/15">
              ✉️ 이메일 문의
            </a>
          </div>
        </div>
      </section>

      {/* ── 키워드 그리드 ── */}
      <section className="px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <span className="text-sm font-bold uppercase tracking-wide text-accent">EXPLORE</span>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">
            {hub.ko} 관련 견적·상담 페이지
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {landings.map((slug) => {
              const l = getLandingBySlug(slug);
              const keyword = getKeywordBySlug(slug);
              // 앱 pSEO로 통합된 랜딩은 301 홉 없이 대상 페이지로 직접 링크
              const href = landingRedirectTarget(slug) || `/l/${slug}/`;
              return (
                <Link
                  key={slug}
                  href={href}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-card-hover"
                >
                  <div>
                    <p className="text-[15px] font-bold text-navy-900">{keyword}</p>
                    <p className="mt-1 text-xs text-slate-500">{l ? l.description : '견적·상담 안내'}</p>
                  </div>
                  <span className="flex-none text-accent transition-transform group-hover:translate-x-1">→</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 최종 CTA ── */}
      <section className="bg-gradient-to-br from-accent to-accent-deep px-5 py-16 text-center sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {hub.ko} 견적, 지금 문의하세요
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
            전화·이메일로 편하게 상담받아 보세요. 가능 여부와 예상 비용·일정을 솔직하게 안내드립니다.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={tel} className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-base font-bold text-accent-deep shadow-lg transition-transform hover:-translate-y-0.5">
              📞 {site.tel} 전화 상담
            </a>
            <a href={mail} className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-7 py-4 text-base font-bold text-white ring-1 ring-white/40 transition-all hover:bg-white/25">
              ✉️ 이메일 문의
            </a>
          </div>
        </div>
      </section>

      <BusinessFooter />
    </div>
  );
}
