import type { CSSProperties } from 'react';
import { TOSS_SECTION_ATTR, TOSS_SECTION_SCRIPT } from '@/lib/toss-banner.mjs';

/**
 * 름랩 × 토스페이먼츠 협력사 소개 섹션 — 푸터 바로 위에 둔다(푸터 컴포넌트들이 렌더한다).
 * 원문 HTML 에는 빈 자리표시자와 인라인 스크립트뿐이고 스크립트가 페인트 전에 채운다
 * (본문·제목·링크 무변경, data-nosnippet). 마크업·디자인·이유는 lib/toss-banner.mjs 참고.
 */
/** style: 자리표시자(섹션 바깥 상자)에 줄 여백 — 앞 콘텐츠와의 간격이 필요한 페이지용 */
export default function TossPartnerSection({ style }: { style?: CSSProperties }) {
  return (
    <>
      <div {...{ [TOSS_SECTION_ATTR]: '' }} data-nosnippet="" style={style} dangerouslySetInnerHTML={{ __html: '' }} />
      <script dangerouslySetInnerHTML={{ __html: TOSS_SECTION_SCRIPT }} />
    </>
  );
}
