import Link from 'next/link';
import type { PageSeo } from '@/lib/seo';
import { SITE } from '@/lib/seo';

export default function SeoServicePage({ seo }: { seo: PageSeo }) {
  return (
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
            <Link href="/consultation/" className="btn-primary">
              📋 무료 상담 신청
            </Link>
            <a href={SITE.kakao} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              💬 카카오톡 문의
            </a>
            <Link href="/portfolio/" className="btn-secondary">
              포트폴리오 보기
            </Link>
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
            <li>기획·디자인·개발·배포까지 원스톱</li>
            <li>Flutter, React Native, Next.js 등 최신 스택</li>
            <li>견적·일정 투명 안내 · 대표 직접 커뮤니케이션</li>
            <li>사업자 {SITE.company} · 대표 {SITE.representative} · {SITE.phone}</li>
          </ul>
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
            사업자명: {SITE.company} <span>|</span> 사업자등록번호: {SITE.bizNo} <span>|</span> 대표: {SITE.representative}{' '}
            <span>|</span> {SITE.address} <span>|</span>{' '}
            <a href={`mailto:${SITE.email}`} style={{ color: 'var(--text-dim)' }}>
              {SITE.email}
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
