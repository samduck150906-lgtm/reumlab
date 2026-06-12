import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  BLOG_POSTS,
  blogCanonical,
  getAllBlogSlugs,
  getBlogPostBySlug,
} from '@/lib/blog-posts';
import { SITE } from '@/lib/seo';
import { ArticleJsonLd, BreadcrumbJsonLdTrail, FAQPageJsonLd } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);
  if (!post) notFound();
  const canonical = blogCanonical(post.slug);

  return {
    metadataBase: new URL(SITE.domain),
    title: `${post.title} | ${SITE.name}`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      url: canonical,
      siteName: SITE.nameEn,
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
    robots: { index: true, follow: true },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) notFound();
  const url = blogCanonical(post.slug);

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

            <div className="cta" style={{ marginTop: 40 }}>
              <h2 className="section-title" style={{ fontSize: '1.15rem' }}>
                다음 단계
              </h2>
              <p className="hub-intro">패키지·일정이 궁금하시면 상담으로 연결해 드립니다.</p>
              <div className="cta-buttons">
                <Link href="/consultation/" className="btn-primary" data-analytics="cta_blog_post_consult">
                  무료 상담
                </Link>
                <Link href="/#pricing" className="btn-outline" data-analytics="cta_blog_post_pricing">
                  패키지 요금 보기
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>
      <BusinessFooter topExtra={<Link href="/blog/">← 블로그 목록</Link>} />
    </>
  );
}
