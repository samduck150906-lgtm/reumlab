import type { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog-posts';
import { SITE } from '@/lib/seo';
import { BreadcrumbJsonLdTrail } from '@/components/JsonLd';

const canonical = `${SITE.domain}/blog/`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: '블로그·칼럼 | 비전공자 창업·MVP·외주 인사이트 | 름랩',
  description:
    '앱 개발 비용 절감, 외주 실패 방지, MVP 범위, 유지보수 등 롱테일 키워드를 다룬 실무 칼럼. 름랩 Reum Lab.',
  alternates: { canonical },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: canonical,
    siteName: SITE.nameEn,
    title: '창업자를 위한 앱·웹·외주 인사이트 | 름랩',
    description: '비전공 대표도 읽을 수 있는 개발·운영 칼럼. 검색 유입용 롱테일 주제를 꾸준히 확장합니다.',
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: 'Reum Lab 블로그' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '창업자를 위한 앱·웹·외주 인사이트 | 름랩',
    description: 'MVP·외주·유지보수 실무 칼럼.',
    images: [SITE.defaultOgImage],
  },
  robots: { index: true, follow: true },
};

export default function BlogIndexPage() {
  return (
    <>
      <BreadcrumbJsonLdTrail
        items={[
          { name: '홈', url: `${SITE.domain}/` },
          { name: '블로그', url: canonical },
        ]}
      />
      <main>
        <section className="hero" style={{ minHeight: 'auto', padding: '120px 0 40px' }}>
          <div className="container">
            <p className="section-tag">Blog · Programmatic SEO</p>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>
              롱테일 키워드 기반 칼럼
            </h1>
            <p className="hero-desc" style={{ maxWidth: 720 }}>
              스타트업 대표·비전공 창업자가 검색하는 주제별로 URL을 나누어{' '}
              <strong>프로그래매틱 SEO</strong> 구조를 갖췄습니다. CMS나 노션으로 본문만 바꿔 같은 패턴으로
              페이지를 늘리면 됩니다.
            </p>
          </div>
        </section>

        <section className="sec sec-cream">
          <div className="container">
            <ul className="link-grid" style={{ marginTop: 8 }}>
              {BLOG_POSTS.map((p) => (
                <li key={p.slug} style={{ listStyle: 'none' }}>
                  <Link href={`/blog/${p.slug}/`} style={{ display: 'block', minHeight: '100%' }}>
                    <article
                      className="svc"
                      style={{ height: '100%', margin: 0, display: 'flex', flexDirection: 'column' }}
                    >
                      <time
                        dateTime={p.publishedAt}
                        style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 8 }}
                      >
                        {p.publishedAt} · 약 {p.readingMinutes}분
                      </time>
                      <h2 className="svc-title" style={{ fontSize: '1.05rem' }}>
                        {p.title}
                      </h2>
                      <p className="svc-desc" style={{ flex: 1 }}>
                        {p.description}
                      </p>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--green)' }}>
                        /blog/{p.slug}/
                      </span>
                    </article>
                  </Link>
                </li>
              ))}
            </ul>
            <p style={{ marginTop: 32, textAlign: 'center' }}>
              <Link href="/consultation/" className="btn-primary" data-analytics="cta_blog_index_consult">
                상담 신청하기
              </Link>
            </p>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="container">
          <p className="footer-info">
            <Link href="/">홈</Link>
            <span> · </span>
            <Link href="/portfolio/">포트폴리오</Link>
          </p>
        </div>
      </footer>
    </>
  );
}
