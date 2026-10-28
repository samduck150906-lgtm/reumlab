import type { Metadata } from 'next';
import { SITE } from '@/lib/seo';
import { AGENCY_DOMAIN, agencyHref, type AgencyPage } from './types';

/**
 * 검색 결과용 설명 — 본문·구조화 데이터의 page.description 은 그대로 두고 meta·OG 에만 쓴다.
 *
 * 개발사 상세 1,795개 중 714개의 설명이 160자를 넘었다(최대 364자). 네이버·구글 모두 스니펫을
 * 그보다 훨씬 짧게 자르므로 문장 중간에서 끊긴 채 노출된다. 완결된 문장 단위로 155자 안에서 자르고,
 * 첫 문장부터 길면 단어 경계에서 자른 뒤 말줄임표를 붙인다.
 */
const META_DESCRIPTION_MAX = 155;
export function agencyMetaDescription(description: string): string {
  const text = description.trim();
  if (text.length <= META_DESCRIPTION_MAX) return text;
  const sentences = text.match(/[^.!?]+[.!?]+(?:\s+|$)/g) ?? [text];
  let out = '';
  for (const sentence of sentences) {
    if ((out + sentence).trim().length > META_DESCRIPTION_MAX) break;
    out += sentence;
  }
  if (out.trim()) return out.trim();
  const cut = text.slice(0, META_DESCRIPTION_MAX - 1);
  const at = Math.max(cut.lastIndexOf(' '), cut.lastIndexOf('·'));
  return `${(at > 80 ? cut.slice(0, at) : cut).replace(/[\s·,]+$/, '')}…`;
}

export function agencyMetadata(page: AgencyPage): Metadata {
  const url = `${AGENCY_DOMAIN}${agencyHref(page)}`;
  const description = agencyMetaDescription(page.description);
  return {
    title: { absolute: page.title },
    description,
    keywords: [...page.keywordVariants],
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website', locale: 'ko_KR', siteName: SITE.name, url,
      title: page.title, description,
      images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: '름랩 REUMLAB' }],
    },
    twitter: {
      card: 'summary_large_image', title: page.title,
      description, images: [SITE.defaultOgImage],
    },
  };
}
