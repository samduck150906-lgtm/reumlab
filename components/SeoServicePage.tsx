import Link from 'next/link';
import type { PageSeo } from '@/lib/seo';
import { SITE } from '@/lib/seo';
import { getService, REGIONS } from '@/lib/pseo';
import { FAQPageJsonLd } from '@/components/JsonLd';
import { getPortfolioBySlug, portfolioCanonical, portfolioCategoryLabel } from '@/lib/portfolio';

const RELATED_BLOG: { match: RegExp; slug: string; title: string }[] = [
  { match: /source-handover|소스코드|이관/, slug: 'oeju-gaebal-silphae-an-haneun-bab', title: '외주 개발 실패 안 하는 법: 명세·일정·소유권 3종 세트' },
  { match: /app-dev|앱개발|앱-개발|app-gaebal/, slug: 'app-gaebal-biyong-julineun-bab', title: '앱 개발 비용 총정리 (2026): 범위별 견적과 줄이는 법' },
  { match: /mvp/, slug: 'mvp-gaebal-biyong-gigan', title: 'MVP 개발 비용과 기간: 3주 만에 시장 검증이 가능한 이유' },
  { match: /flutter/, slug: 'flutter-oeju-jangdanjeom', title: 'Flutter 앱개발 외주, 장단점 솔직 정리' },
  { match: /suwon|수원/, slug: 'suwon-app-gaebal-upche', title: '수원 앱개발 업체 고르는 법' },
  { match: /landing|homepage|홈페이지|랜딩/, slug: 'homepage-jejak-biyong', title: '홈페이지 제작 비용 총정리 (2026)' },
];

/** 서비스 슬러그 → 관련 포트폴리오 사례 (허브 → 사례 내부링크 / 토픽 클러스터) */
const RELATED_CASES: { match: RegExp; slugs: string[] }[] = [
  { match: /ai-development|솔루션SaaS|솔루션|saas/i, slugs: ['ai-handler', 'academy-matching-app'] },
  { match: /플랫폼개발|platform|기업용ERP|erp/i, slugs: ['marbee-marketer-matching', 'academy-matching-app'] },
  { match: /web-development|웹개발|homepage|홈페이지|landing|랜딩/i, slugs: ['ute-studio-rental', 'marbee-marketer-matching'] },
  { match: /flutter/i, slugs: ['academy-matching-app', 'ai-handler'] },
  { match: /mvp|스타트업/i, slugs: ['academy-matching-app', 'marbee-marketer-matching'] },
  { match: /앱개발|app-development|app-dev/i, slugs: ['academy-matching-app', 'ai-handler'] },
  { match: /source-handover|소스코드|이관/i, slugs: ['academy-matching-app', 'marbee-marketer-matching'] },
];

function relatedCasesFor(pageSlug?: string) {
  if (!pageSlug) return [];
  const hit = RELATED_CASES.find((r) => r.match.test(pageSlug));
  if (!hit) return [];
  return hit.slugs.map((s) => getPortfolioBySlug(s)).filter((p): p is NonNullable<typeof p> => Boolean(p));
}

export default function SeoServicePage({ seo, pageSlug }: { seo: PageSeo; pageSlug?: string }) {
  const related = pageSlug
    ? RELATED_BLOG.find((r) => r.match.test(pageSlug))
    : undefined;
  // 지역×서비스 허브(app-development, web-development, mvp, flutter, ai-development)면
  // 지역 스포크 페이지로 내부링크를 노출 (허브-스포크 클러스터링)
  const regionService = pageSlug ? getService(pageSlug) : undefined;
  const relatedCases = relatedCasesFor(pageSlug);
  return (
    <>
      {seo.faqs && seo.faqs.length > 0 ? <FAQPageJsonLd items={seo.faqs} /> : null}
      <main className="seo-landing">
      <section className="hero" style={{ minHeight: 'auto', padding: '120px 0 64px' }}>
        <div className="container">
          <nav className="seo-breadcrumb" aria-label="breadcrumb" style={{ marginBottom: 24, fontSize: 14, color: 'var(--text-dim)' }}>
            <Link href="/">홈</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span>{seo.h1.slice(0, 40)}…</span>
          </nav>
          <h1 className="hero-title" style={{ fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.25, marginBottom: 20 }}>
            {seo.h1}
          </h1>
          <p className="hero-sub" style={{ maxWidth: 720, marginBottom: 28 }}>
            {seo.serviceDesc ?? seo.description}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
            {seo.keywords.slice(0, 8).map((k) => (
              <span
                key={k}
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  background: 'rgba(58,140,92,.12)',
                  color: 'var(--green)',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {k}
              </span>
            ))}
          </div>
          <div className="hero-btns" style={{ flexWrap: 'wrap' }}>
            <a href={SITE.phoneHref} className="btn-primary">
              📞 {SITE.phone} 전화 상담
            </a>
            <a href={`mailto:${SITE.email}`} className="btn-secondary">
              ✉️ 이메일 문의
            </a>
          </div>
        </div>
      </section>

      <section className="sec sec-warm">
        <div className="container" style={{ maxWidth: 800 }}>
          <h2 className="sec-title" style={{ fontSize: 'clamp(22px, 3vw, 28px)', marginBottom: 20 }}>
            왜 {SITE.nameEn}인가요?
          </h2>
          <p style={{ marginBottom: 16, lineHeight: 1.75 }}>
            {seo.description}
          </p>
          <ul className="svc-list" style={{ marginTop: 24 }}>
            {(seo.whyPoints && seo.whyPoints.length > 0
              ? seo.whyPoints
              : [
                  '기획·디자인·개발·배포까지 원스톱',
                  'Flutter, React Native, Next.js 등 최신 스택',
                  '견적·일정 투명 안내 · 대표 직접 커뮤니케이션',
                  `사업자 ${SITE.company} · 대표 ${SITE.representative} · ${SITE.phone}`,
                ]
            ).map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>

          {seo.sections && seo.sections.length > 0 && (
            <div style={{ marginTop: 36 }}>
              {seo.sections.map((s) => (
                <div key={s.h2} style={{ marginBottom: 26 }}>
                  <h2 className="sec-title" style={{ fontSize: 'clamp(18px, 2.4vw, 22px)', marginBottom: 12 }}>
                    {s.h2}
                  </h2>
                  <p style={{ lineHeight: 1.75 }}>{s.body}</p>
                </div>
              ))}
            </div>
          )}
          {regionService && (
            <div style={{ marginTop: 36 }}>
              <h2 className="sec-title" style={{ fontSize: 'clamp(18px, 2.4vw, 22px)', marginBottom: 16 }}>
                지역별 {regionService.short}
              </h2>
              <div className="link-grid">
                {REGIONS.map((r) => (
                  <Link key={r.slug} href={`/${regionService.slug}/${r.slug}/`}>
                    {r.full} {regionService.short}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {seo.faqs && seo.faqs.length > 0 && (
            <div style={{ marginTop: 36 }}>
              <h2 className="sec-title" style={{ fontSize: 'clamp(18px, 2.4vw, 22px)', marginBottom: 16 }}>
                자주 묻는 질문
              </h2>
              <div className="faq-grid">
                {seo.faqs.map((f) => (
                  <div className="faq-item" key={f.q}>
                    <p className="faq-q">{f.q}</p>
                    <p className="faq-a">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {relatedCases.length > 0 && (
            <div style={{ marginTop: 36 }}>
              <h2 className="sec-title" style={{ fontSize: 'clamp(18px, 2.4vw, 22px)', marginBottom: 16 }}>
                관련 진행 사례
              </h2>
              <div className="link-grid">
                {relatedCases.map((p) => (
                  <Link key={p.slug} href={portfolioCanonical(p.slug).replace(SITE.domain, '')}>
                    [{portfolioCategoryLabel(p.category)}] {p.title}
                  </Link>
                ))}
                <Link href="/portfolio/">전체 포트폴리오 보기</Link>
              </div>
            </div>
          )}

          {related && (
            <div style={{ marginTop: 32, padding: '20px 24px', background: 'rgba(255,255,255,0.04)', borderRadius: 12, borderLeft: '3px solid var(--accent, #2f6bff)' }}>
              <p style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 8 }}>관련 글</p>
              <Link href={`/blog/${related.slug}/`} style={{ fontWeight: 600, textDecoration: 'none' }}>
                {related.title} →
              </Link>
            </div>
          )}
          <div style={{ marginTop: 40 }}>
            <p className="section-tag" style={{ marginBottom: 12 }}>주요 서비스</p>
            <div className="link-grid">
              {[
                { href: '/mvp/', label: '앱 MVP 개발' },
                { href: '/flutter/', label: 'Flutter 앱개발' },
                { href: '/ai-development/', label: 'AI 외주개발' },
                { href: '/source-handover/', label: '소스코드 이관' },
                { href: '/web-development/', label: '웹사이트 제작' },
                { href: '/blog/', label: '블로그' },
              ]
                .filter((s) => !pageSlug || !s.href.includes(`/${pageSlug}/`))
                .map((s) => (
                  <Link key={s.href} href={s.href}>{s.label}</Link>
                ))}
            </div>
          </div>

          <div style={{ marginTop: 40 }}>
            <Link href="/" className="btn-light">
              ← 메인으로
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer" style={{ marginTop: 48 }}>
        <div className="container">
          <p className="footer-info">
            {SITE.company} <span>|</span> 대표자: {SITE.representative} <span>|</span> 사업자등록번호: {SITE.bizNo}
            <br />
            연락처:{' '}
            <a href={SITE.phoneHref} style={{ color: 'var(--text-dim)' }}>{SITE.phone}</a> <span>|</span>{' '}
            이메일:{' '}
            <a href={`mailto:${SITE.email}`} style={{ color: 'var(--text-dim)' }}>{SITE.email}</a>
            <br />
            주소: {SITE.address}
          </p>
        </div>
      </footer>
    </main>
    </>
  );
}
