function Footer() {
  const company = '앱·웹개발 스튜디오 름랩';
  const phone = '010-8111-9370';
  const email = 'ceo@eternalsix.com';
  const address = '경기도 화성시 동탄첨단산업1로 58, 307호(영천동)';
  return (
    <footer style={{ padding: '28px 20px', backgroundColor: '#f9fafb', borderTop: '1px solid #f3f4f6', color: '#6b7280', fontSize: '12px', lineHeight: '1.6', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap', fontWeight: 'bold' }}>
          <a href="/terms/" style={{ color: '#374151', textDecoration: 'none' }}>이용약관</a>
          <a href="/privacy/" style={{ color: '#374151', textDecoration: 'none' }}>개인정보처리방침</a>
          <a href="/refund/" style={{ color: '#374151', textDecoration: 'none' }}>취소 및 환불 안내</a>
        </div>
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: '#6b7280' }}>
            <span>{company} | 대표자: 성아름 | 사업자등록번호: 793-12-03247</span>
            <span>
              연락처: <a href="tel:01081119370" style={{ color: '#4f46e5', textDecoration: 'none' }}>{phone}</a>
              {' | '}이메일: <a href={`mailto:${email}`} style={{ color: '#4f46e5', textDecoration: 'none' }}>{email}</a>
            </span>
            <span>주소: {address}</span>
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
