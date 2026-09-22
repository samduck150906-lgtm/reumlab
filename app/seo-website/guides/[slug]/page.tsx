import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from '@/components/SiteLink';
import BusinessFooter from '@/components/BusinessFooter';
import { GuideArticleJsonLd } from '@/components/JsonLd';
import { SITE } from '@/lib/seo';
import { getSeoWebsiteGuide, SEO_WEBSITE_GUIDES } from '@/lib/seo-website';
import styles from '../../seo-website.module.css';

type Props = { params: { slug: string } };
export const dynamicParams = false;
export function generateStaticParams() { return SEO_WEBSITE_GUIDES.map((guide) => ({ slug: guide.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getSeoWebsiteGuide(params.slug);
  if (!guide) notFound();
  return { metadataBase: new URL(SITE.domain), title: { absolute: `${guide.title} | 름랩` }, description: guide.description, alternates: { canonical: guide.canonical }, openGraph: { type: 'article', locale: 'ko_KR', url: guide.canonical, siteName: SITE.name, title: guide.title, description: guide.description, images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: guide.h1 }] }, robots: { index: true, follow: true } };
}

export default function SeoWebsiteGuidePage({ params }: Props) {
  const guide = getSeoWebsiteGuide(params.slug);
  if (!guide) notFound();
  const crumbs = [{ name: '홈', url: `${SITE.domain}/` }, { name: '검색 잘되는 홈페이지 제작', url: `${SITE.domain}/seo-website/` }, { name: guide.h1, url: guide.canonical }];
  return <>
    <GuideArticleJsonLd title={guide.title} description={guide.description} url={guide.canonical} publishedAt="2026-09-22" updatedAt="2026-09-22" keywords={guide.pageId === 'GUIDE_REGISTRATION' ? ['홈페이지 검색 등록', '홈페이지 상위노출', '사이트맵 제출'] : ['SEO 홈페이지 제작', '홈페이지 제작 견적', 'SEO 체크리스트']} crumbs={crumbs} citations={guide.sources} />
    <main className={styles.page}>
      <nav className={`${styles.wrap} ${styles.breadcrumb}`} aria-label="breadcrumb"><Link href="/">홈</Link> / <Link href="/seo-website/">검색 잘되는 홈페이지 제작</Link> / <span>가이드</span></nav>
      <article>
        <header className={styles.hero}><div className={styles.wrap}><p className={styles.eyebrow}>름랩 검색형 홈페이지 가이드</p><h1>{guide.h1}</h1><p className={styles.lead}>{guide.lead}</p><p className={styles.guideMeta}>름랩 편집 · 작성 및 검토 2026-09-22</p></div></header>
        <div className={styles.wrap}>
          {guide.sections.map((section) => <section className={styles.section} key={section.heading}><header className={styles.sectionHeader}><h2>{section.heading}</h2></header><p className={styles.lead}>{section.body}</p>{section.items ? <ul className={styles.card}>{section.items.map((item) => <li key={item}>{item}</li>)}</ul> : null}</section>)}
          {guide.sources?.length ? <section className={styles.section}><header className={styles.sectionHeader}><h2>공식 문서</h2><p>콘텐츠 검토일: 2026-09-22</p></header><ul className={`${styles.card} ${styles.sourceList}`}>{guide.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul></section> : null}
          <section className={styles.section}><header className={styles.sectionHeader}><h2>다음 단계</h2><p>새 홈페이지가 필요하면 서비스 범위를, 기존 홈페이지가 검색되지 않으면 현재 구조 개선 범위를 확인하세요.</p></header><div className={styles.links}><Link href="/seo-website/">검색 잘되는 홈페이지 제작</Link><Link href="/seo-website/cost/">제작 비용과 포함 범위</Link><Link href="/ai-search-optimization/">기존 홈페이지 검색 구조 개선</Link></div></section>
        </div>
      </article>
    </main>
    <BusinessFooter topExtra={<Link href="/seo-website/">← 검색 잘되는 홈페이지 제작</Link>} />
  </>;
}

