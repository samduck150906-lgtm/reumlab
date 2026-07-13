import Link from 'next/link';
import type { PageSeo } from '@/lib/seo';
import { SITE } from '@/lib/seo';
import { getService, REGIONS, INDEXED_REGION_SLUGS } from '@/lib/pseo';
import { FAQPageJsonLd } from '@/components/JsonLd';

// 실제 존재하는 블로그 슬러그로만 매칭한다(404 방지). 위에서부터 first-match.
const RELATED_BLOG: { match: RegExp; slug: string; title: string }[] = [
  { match: /admin-page|관리자|어드민|백오피스|maintenance|유지보수|인수|hwaseong|화성/, slug: 'hwaseong-dongtan-business-web', title: '화성 동탄첨단산업단지 기업을 위한 업무용 웹·관리자 시스템 개발' },
  { match: /flutter/, slug: 'flutter-oeju-jangdanjeom', title: 'Flutter 앱개발 외주, 장단점 솔직 정리' },
  { match: /renewal|리뉴얼|cafe24|카페24|nocode|노코드|web-development|웹개발|homepage|홈페이지|랜딩|website/, slug: 'website-or-app-first', title: '소상공인, 홈페이지부터일까 앱부터일까? 선택 기준 5가지' },
  { match: /academy|학원/, slug: 'academy-management-app', title: '학원 수강관리 앱 만들기: 수강신청·출결·수납·학부모 알림 한 번에' },
  { match: /clinic|병원|의원|한의원/, slug: 'clinic-reservation-app', title: '병원·한의원 예약·접수·문진 앱: 대기 줄이고 노쇼 막는 법' },
  { match: /gym|fitness|헬스|피트니스/, slug: 'gym-membership-app', title: '헬스장·필라테스 회원관리 앱: 회원권·PT·자동결제·출석 한 번에' },
  { match: /restaurant|식당|음식점/, slug: 'restaurant-order-app', title: '음식점·카페 주문·웨이팅·포인트 앱: 회전율 높이고 단골 만드는 법' },
  { match: /reservation|예약|dongtan|동탄/, slug: 'dongtan-reservation-app', title: '동탄 카페·학원·헬스장 예약앱 만들기: 노쇼 줄이는 5가지 기능' },
  { match: /suwon|수원|app-development|app-agency|앱개발|앱-개발|app-gaebal|mvp|source-handover|소스코드|이관/, slug: 'suwon-app-gaebal-upche', title: '수원 앱개발 업체 고르는 법' },
];

export default function SeoServicePage({ seo, pageSlug }: { seo: PageSeo; pageSlug?: string }) {
  const related = pageSlug
    ? RELATED_BLOG.find((r) => r.match.test(pageSlug))
    : undefined;
  // 지역×서비스 허브(app-development, web-development, mvp, flutter, ai-development)면
  // 지역 스포크 페이지로 내부링크를 노출 (허브-스포크 클러스터링)
  const regionService = pageSlug ? getService(pageSlug) : undefined;
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
            <a href={SITE.kakaoChannel} target="_blank" rel="noopener noreferrer" className="btn-secondary" data-analytics="cta_service_kakao" style={{ background: '#FEE500', color: '#191919', fontWeight: 700 }}>
              💬 카카오톡 상담
            </a>
            <a href={`mailto:${SITE.email}`} className="btn-secondary">
              ✉️ 이메일 문의
            </a>
          </div>
        </div>
      </section>

      {/* 직접 운영 세팅 + 데모 영상 (테마 독립 네이비 밴드) */}
      <section style={{ background: '#0f1f3a', padding: '64px 0' }}>
        <div className="container" style={{ maxWidth: 980 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7aa0ff', marginBottom: 12 }}>
              DIRECT HANDOVER
            </p>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, color: '#ffffff', lineHeight: 1.3, margin: '0 auto 14px', maxWidth: 760 }}>
              사이트만 넘겨드리지 않습니다 — 직접 유지보수하실 수 있게 전부 세팅해 드립니다
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, maxWidth: 680, margin: '0 auto', fontSize: 15.5 }}>
              메뉴별로 정리된 전용 관리 화면을 함께 세팅해 드립니다. 연락처·가격·후기·블로그까지,
              개발자 없이도 클릭 몇 번으로 직접 수정하고 게시하실 수 있습니다.
            </p>
          </div>
          <figure style={{ margin: '8px auto 0', maxWidth: 400, width: '100%' }}>
            <div style={{ overflow: 'hidden', borderRadius: 16, border: '1px solid rgba(255,255,255,0.12)', background: '#0a0f1c', aspectRatio: '1080 / 1350', boxShadow: '0 24px 60px rgba(0,0,0,0.35)' }}>
              <video
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
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
            <figcaption style={{ marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
              실제 운영 관리 화면 — 메뉴별로 정리된 콘텐츠를 직접 수정·게시합니다.
            </figcaption>
          </figure>
          <div style={{ marginTop: 36 }}>
            <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>
              관리자 화면 미리보기
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, maxWidth: 620, margin: '0 auto' }}>
              {[
                { src: '/assets/images/admin-preview-1.jpg', cap: '글자 하나도 전화 없이 직접', alt: '관리자 화면 — 매번 개발자에게 전화할 필요 없이 직접 수정' },
                { src: '/assets/images/admin-preview-2.jpg', cap: '연락처·가격·SEO 바로 수정', alt: '관리자 화면 — 연락처·가격·메인 문구·SEO를 클릭해서 바로 수정' },
                { src: '/assets/images/admin-preview-3.jpg', cap: '블로그·후기·FAQ도 직접', alt: '관리자 화면 — 블로그·후기·FAQ도 직접 올리고 삭제' },
              ].map((s) => (
                <figure key={s.src} style={{ margin: 0 }}>
                  <img
                    src={s.src}
                    width={760}
                    height={950}
                    loading="lazy"
                    decoding="async"
                    alt={s.alt}
                    style={{ width: '100%', height: 'auto', borderRadius: 14, border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 16px 40px rgba(0,0,0,0.3)', background: '#0f1f3a' }}
                  />
                  <figcaption style={{ marginTop: 9, textAlign: 'center', fontSize: 12.5, color: 'rgba(255,255,255,0.6)' }}>{s.cap}</figcaption>
                </figure>
              ))}
            </div>
            <p style={{ textAlign: 'center', marginTop: 28 }}>
              <a
                href="/assets/admin-guide-example.html"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', padding: '10px 24px', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 999, fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}
              >
                운영 가이드 예시 보기 →
              </a>
            </p>
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
                  '기획·디자인·개발·배포를 한 팀이 이어서 진행',
                  '주로 Flutter·React Native·Next.js로 작업합니다',
                  '견적·일정을 미리 공개하고, 대표가 직접 소통합니다',
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
                거점 지역 {regionService.short}
              </h2>
              {/* 지역은 차별화 축이 아니다 — 실제 거점(동탄·화성·수원)만 노출하고, 그 외는 아래 문구로 안내 */}
              <div className="link-grid">
                {REGIONS.filter((r) => INDEXED_REGION_SLUGS.has(r.slug)).map((r) => (
                  <Link key={r.slug} href={`/${regionService.slug}/${r.slug}/`}>
                    {r.full} {regionService.short}
                  </Link>
                ))}
              </div>
              <p style={{ marginTop: 14, fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.7 }}>
                동탄·수원 거점이지만 화상 상담·중간 확인·소스코드 이관 기반의 비대면 협업으로
                <strong> 전국 어디서나 동일한 조건</strong>으로 진행합니다.
              </p>
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
                { href: '/app-agency/', label: '앱개발 업체' },
                { href: '/website-agency/', label: '홈페이지 제작 업체' },
                { href: '/app/', label: '업종별 앱개발' },
                { href: '/mvp/', label: '앱 MVP 개발' },
                { href: '/flutter/', label: 'Flutter 앱개발' },
                { href: '/flutter-development/', label: 'Flutter Development' },
                { href: '/ai-development/', label: 'AI 외주개발' },
                { href: '/admin-page-development/', label: '관리자 페이지 개발' },
                { href: '/academy-shopping-mall/', label: '학원 쇼핑몰 제작' },
                { href: '/realestate-landing/', label: '부동산 랜딩페이지' },
                { href: '/maintenance/', label: '앱·웹 유지보수' },
                { href: '/renewal/', label: '웹사이트 리뉴얼' },
                { href: '/cafe24-limit/', label: '카페24 한계' },
                { href: '/nocode-limit/', label: '노코드 한계' },
                { href: '/source-handover/', label: '소스코드 이관' },
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
