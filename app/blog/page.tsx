import type { Metadata } from 'next';
import Link from 'next/link';
import { indexableBlogPosts } from '@/lib/blog-posts';
import { SITE } from '@/lib/seo';
import { BreadcrumbJsonLdTrail } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

const canonical = `${SITE.domain}/blog/`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: '블로그 | 앱개발 비용·MVP·Flutter·홈페이지 제작 실무 칼럼 | 름랩',
  description:
    '앱 개발 비용, MVP 개발 기간, Flutter 외주, 랜딩페이지 제작 비용 등 창업자가 궁금한 개발·외주 주제를 정리한 름랩 칼럼입니다.',
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
            <p className="section-tag">Blog</p>
            <h1 className="hero-title" style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>
              앱·웹 개발 실무 칼럼
            </h1>
            <p className="hero-desc" style={{ maxWidth: 720 }}>
              앱개발 비용, MVP 개발 기간, Flutter 외주, 홈페이지 제작 비용 등{' '}
              창업자·소상공인이 자주 묻는 주제를 솔직하게 정리합니다.
            </p>
          </div>
        </section>

        <section className="sec sec-cream">
          <div className="container">
            <ul className="link-grid" style={{ marginTop: 8 }}>
              {indexableBlogPosts()
                .slice()
                .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
                .map((p) => (
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
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_blog_index_call">
                📞 {SITE.phone} 전화 상담
              </a>
            </p>
          </div>
        </section>
      </main>
      <BusinessFooter />
    </>
  );
}
