import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  BLOG_POSTS,
  blogCanonical,
  blogShouldIndex,
  getAllBlogSlugs,
  getBlogPostBySlug,
} from '@/lib/blog-posts';
import { SITE } from '@/lib/seo';
import { serviceLinksFor, regionLinkFor } from '@/lib/blog-links';
import { ArticleJsonLd, BreadcrumbJsonLdTrail, FAQPageJsonLd } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

type Props = { params: { slug: string } };

/**
 * 정적 export에서 한글 slug는 params.slug가 percent-encoding(%EC…)으로 전달된다.
 * 디코드하지 않으면 getBlogPostBySlug가 못 찾아 notFound()로 떨어지고, 한글 slug
 * 블로그 글(대다수)이 전부 error 페이지로 빌드된다. app/[slug]/page.tsx와 동일 처리.
 */
function resolveSlug(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPostBySlug(resolveSlug(params.slug));
  if (!post) notFound();
  const canonical = blogCanonical(post.slug);

  return {
    metadataBase: new URL(SITE.domain),
    title: { absolute: `${post.title} | ${SITE.name}` },
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      url: canonical,
      siteName: SITE.name,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description.slice(0, 200),
      images: [SITE.defaultOgImage],
    },
    // 얇은·중복 글은 색인 제외(noindex,follow) — 사이트 전체 품질 보호
    robots: blogShouldIndex(post.slug)
      ? { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } }
      : { index: false, follow: true, googleBot: { index: false, follow: true } },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPostBySlug(resolveSlug(params.slug));
  if (!post) notFound();
  const url = blogCanonical(post.slug);

  // 관련 글은 색인 품질을 통과한 글 우선 (얇은·중복 글로 링크 자산이 새지 않게)
  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug && blogShouldIndex(p.slug)).slice(0, 3);

  // 글 주제(키워드/제목)에 맞춘 머니페이지 내부링크 — 정보성 글의 힘을 견적 페이지로 전달(§7·§10)
  const serviceLinks = serviceLinksFor(post);
  const regionLink = regionLinkFor(post);
  const primaryService = serviceLinks[0]; // 하단 CTA 대상(글마다 다름)

  return (
    <>
      <ArticleJsonLd post={post} url={url} />
      {post.faqs && post.faqs.length > 0 && <FAQPageJsonLd items={post.faqs} />}
      <BreadcrumbJsonLdTrail
        items={[
          { name: '홈', url: `${SITE.domain}/` },
          { name: '블로그', url: `${SITE.domain}/blog/` },
          { name: post.title.slice(0, 48), url },
        ]}
      />
      <main>
        <article className="dynamic-page">
          <nav className="breadcrumb" aria-label="breadcrumb">
            <Link href="/">홈</Link>
            {' / '}
            <Link href="/blog/">블로그</Link>
            {' / '}
            <span>{post.title}</span>
          </nav>

          <div className="section-inner" style={{ paddingBottom: 48 }}>
            <p className="section-tag">Column</p>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.35rem, 3vw, 1.85rem)' }}>
              {post.title}
            </h1>
            <p className="hub-intro">
              <time dateTime={post.publishedAt}>{post.publishedAt}</time>
              {' · '}
              읽는 시간 약 {post.readingMinutes}분
            </p>

            <div style={{ marginTop: 28 }}>
              {post.htmlBody ? (
                <div
                  className="blog-body hub-intro"
                  dangerouslySetInnerHTML={{ __html: post.htmlBody }}
                />
              ) : (
                post.paragraphs.map((para, i) => (
                  <p key={i} className="hub-intro" style={{ marginTop: 18 }}>
                    {para}
                  </p>
                ))
              )}
            </div>

            {/*
              FAQ — 이 글의 FAQPage 구조화 데이터와 같은 배열을 화면에도 렌더한다.
              이전에는 FAQPageJsonLd 만 내보내고 화면에는 아무것도 없어서,
              "스키마에만 존재하는 FAQ" 상태였다(구글 구조화 데이터 정책 위반).
              같은 post.faqs 하나를 화면과 스키마가 공유하므로 어긋날 수 없다.
            */}
            {post.faqs && post.faqs.length > 0 && (
              <div style={{ marginTop: 44 }}>
                <h2 className="section-title" style={{ fontSize: '1.15rem' }}>
                  자주 묻는 질문
                </h2>
                <div className="faq-grid">
                  {post.faqs.map((f) => (
                    <div className="faq-item" key={f.q}>
                      <p className="faq-q">{f.q}</p>
                      <p className="faq-a">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 관련 서비스 — 글 주제에 맞춰 머니페이지로 링크 자산 전달(§7·§10) */}
            <div style={{ marginTop: 44 }}>
              <p className="section-tag" style={{ marginBottom: 16 }}>관련 서비스</p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {serviceLinks.map((s) => (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      style={{ display: 'block', padding: '14px 18px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, textDecoration: 'none' }}
                      data-analytics="cta_blog_service_link"
                    >
                      <span className="hub-intro" style={{ fontWeight: 600, color: 'var(--green, #4ade80)' }}>
                        {s.label} →
                      </span>
                      <span style={{ display: 'block', fontSize: 13, color: 'var(--text-dim)', marginTop: 4 }}>
                        {s.blurb}
                      </span>
                    </Link>
                  </li>
                ))}
                {regionLink && (
                  <li key={regionLink.href}>
                    <Link
                      href={regionLink.href}
                      style={{ display: 'block', padding: '14px 18px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, textDecoration: 'none' }}
                      data-analytics="cta_blog_region_link"
                    >
                      <span className="hub-intro" style={{ fontWeight: 600, color: 'var(--green, #4ade80)' }}>
                        {regionLink.label} →
                      </span>
                      <span style={{ display: 'block', fontSize: 13, color: 'var(--text-dim)', marginTop: 4 }}>
                        {regionLink.blurb}
                      </span>
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* 하단 CTA — 대표 서비스로 연결(글마다 다른 동선), 전화 상담 우선 */}
            <div className="cta" style={{ marginTop: 40 }}>
              <h2 className="section-title" style={{ fontSize: '1.15rem' }}>
                다음 단계
              </h2>
              <p className="hub-intro">
                {primaryService.label} 관련 상담이라면 패키지·일정을 바로 안내해 드립니다.
              </p>
              <div className="cta-buttons">
                <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_blog_post_call">
                  📞 무료 상담
                </a>
                <Link href={primaryService.href} className="btn-outline" data-analytics="cta_blog_post_service">
                  {primaryService.label} 자세히 보기
                </Link>
              </div>
            </div>

            {related.length > 0 && (
              <div style={{ marginTop: 48, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 32 }}>
                <p className="section-tag" style={{ marginBottom: 16 }}>관련 글</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/blog/${r.slug}/`}
                        style={{ display: 'block', padding: '14px 18px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, textDecoration: 'none' }}
                        data-analytics="cta_blog_related"
                      >
                        <span className="hub-intro" style={{ fontWeight: 600, color: 'var(--text-main, #fff)' }}>
                          {r.title}
                        </span>
                        <span style={{ display: 'block', fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>
                          {r.publishedAt} · 약 {r.readingMinutes}분
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </article>
      </main>
      <BusinessFooter topExtra={<Link href="/blog/">← 블로그 목록</Link>} />
    </>
  );
}
