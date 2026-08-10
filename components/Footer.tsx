import { SITE } from '@/lib/seo';

function Footer() {
  return (
    <footer style={{ padding: '28px 20px', backgroundColor: '#f9fafb', borderTop: '1px solid #f3f4f6', color: '#6b7280', fontSize: '12px', lineHeight: '1.6', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/*
          정보성·신뢰 콘텐츠 허브 — Next 라우트 1,400여 페이지의 푸터에는 법적 고지 링크만
          있어서 /guide/(가이드 40건)와 /portfolio/(사례 15건)가 사실상 발견되지 않았다.
          (정적 홈·목적별 랜딩 푸터에는 이미 있었지만 그쪽은 9페이지뿐이다.)
        */}
        <nav aria-label="콘텐츠" style={{ marginBottom: '12px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <a href="/guide/" style={{ color: '#374151', textDecoration: 'none' }}>개발 가이드</a>
          <a href="/portfolio/" style={{ color: '#374151', textDecoration: 'none' }}>개발 사례</a>
          <a href="/blog/" style={{ color: '#374151', textDecoration: 'none' }}>블로그</a>
          <a href="/cost/" style={{ color: '#374151', textDecoration: 'none' }}>업종별 개발 비용</a>
        </nav>
        <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap', fontWeight: 'bold' }}>
          <a href="/terms/" style={{ color: '#374151', textDecoration: 'none' }}>이용약관</a>
          <a href="/privacy/" style={{ color: '#374151', textDecoration: 'none' }}>개인정보처리방침</a>
          <a href="/refund/" style={{ color: '#374151', textDecoration: 'none' }}>취소 및 환불 안내</a>
        </div>
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: '#6b7280' }}>
            <span>{SITE.company} | 대표자: {SITE.representative} | 사업자등록번호: {SITE.bizNo}</span>
            <span>
              연락처: <a href={SITE.phoneHref} style={{ color: '#4f46e5', textDecoration: 'none' }}>{SITE.phone}</a>
              {' | '}이메일: <a href={`mailto:${SITE.email}`} style={{ color: '#4f46e5', textDecoration: 'none' }}>{SITE.email}</a>
            </span>
            <span>주소: {SITE.address}</span>
          </div>
        </div>
        <div style={{ marginTop: '16px' }}>
          <p style={{ margin: 0, color: '#9ca3af' }}>© {new Date().getFullYear()} REUMLAB. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
export default Footer;
