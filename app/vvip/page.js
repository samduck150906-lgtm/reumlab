import Link from 'next/link';
import { getSite } from '../../lib/data';
import VvipForm from '../../components/VvipForm';

export const metadata = {
  title: 'VVIP 1:1 AI 컨설팅 신청 | 럼랩 REUMLAB',
  description: '대표님의 사업에 맞춤 AI 전략을 설계하고 함께 실행합니다. 교육공학 석사 + 12년 교육 경력의 1:1 VVIP 컨설팅.',
  openGraph: {
    title: 'VVIP 1:1 AI 컨설팅 신청 | 럼랩 REUMLAB',
    description: 'AI를 도입이 아닌 내재화하도록. 맞춤 AI 전략 설계와 핸즈온 실행을 함께합니다.',
    url: 'https://reumlab.com/vvip/',
    images: ['/og-default.png'],
  },
  alternates: { canonical: 'https://reumlab.com/vvip/' },
};

export default function VvipPage() {
  const site = getSite();
  const kakaoUrl = site.kakao || 'https://open.kakao.com/o/sF0lmnhi';

  return (
    <>
      <nav className="nav scrolled">
        <div className="container">
          <div className="nav-inner">
            <Link href="/" className="nav-logo en">
              <span>REUMLAB</span>
            </Link>
            <Link href="/" className="nav-cta">← 메인으로</Link>
          </div>
        </div>
      </nav>

      <section className="hero" style={{ minHeight: '85vh', padding: '120px 0 80px', background: 'linear-gradient(170deg,#f4f1e8 0%,#e8f0e0 30%,#dce9d0 70%,#d0e2c4 100%)' }}>
        <div className="hero-glow hero-glow-1" style={{ width: 400, height: 400, top: '-10%', right: '-5%', background: 'radial-gradient(circle, rgba(58,140,92,.12), transparent 70%)' }} />
        <div className="hero-glow hero-glow-2" style={{ width: 300, height: 300, bottom: '10%', left: '-5%', background: 'radial-gradient(circle, rgba(219,192,110,.1), transparent 70%)' }} />
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">👑 VVIP 1:1 AI 컨설팅</div>
            <h1 className="hero-title" style={{ fontSize: 'clamp(36px,6vw,56px)' }}>
              AI를 <span className="gradient-text">내재화</span>하세요
            </h1>
            <p className="hero-sub">
              대표님의 업무와 사업에 맞춤 AI 전략을 설계하고, 직접 핸즈온으로 실행까지 함께합니다. 교육공학 석사 + 12년 교육 경력으로, 어떤 수준이든 이해할 수 있게 설명합니다.
            </p>
            <a href="#apply" className="btn-primary" style={{ marginTop: 16 }}>VVIP 컨설팅 신청하기 →</a>
          </div>
        </div>
      </section>

      <section className="intro">
        <div className="container">
          <div className="intro-grid">
            <div>
              <div className="intro-label">WHY VVIP</div>
              <h2 className="intro-title">도입이 아닌,<br />내재화까지</h2>
              <p className="intro-desc">
                단순히 &apos;AI 도구 쓰는 법&apos;을 알려드리는 게 아닙니다. 대표님의 <span className="hl">업무 프로세스를 분석</span>하고, AI를 통합하는 구체적인 워크플로우를 설계한 뒤, 직접 함께 실행합니다.
              </p>
              <p className="intro-desc">
                교육공학 석사와 12년 교육 경력을 바탕으로, 비개발자도 충분히 따라올 수 있도록 단계별로 안내합니다.
              </p>
            </div>
            <div>
              <ul className="intro-list">
                <li>사업·업무 현황 분석 및 AI 적용 포인트 도출</li>
                <li>맞춤 AI 도구 추천 및 워크플로우 설계</li>
                <li>2시간 1:1 세션 또는 월간 리테이너 형태</li>
                <li>실무에 즉시 적용 가능한 액션 플랜 제공</li>
                <li>필요 시 팀 교육·핸즈온 워크숍 포함</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="tiers">
        <div className="container">
          <div className="intro-label">CONSULTING TIERS</div>
          <h2 className="intro-title">선택 가능한 컨설팅 옵션</h2>
          <p className="intro-desc">목적과 예산에 맞는 옵션을 선택하실 수 있습니다. 세부 조건은 신청 후 1:1로 안내드립니다.</p>
          <div className="tier-cards">
            <div className="tier-card">
              <div className="tier-name">🔹 싱글 세션</div>
              <div className="tier-price">50만원</div>
              <ul className="tier-features">
                <li>2시간 1:1 세션</li>
                <li>사업 현황 분석</li>
                <li>AI 도구 추천</li>
                <li>액션 플랜</li>
              </ul>
            </div>
            <div className="tier-card gold">
              <div className="tier-name">👑 월간 리테이너</div>
              <div className="tier-price">150만원/월</div>
              <ul className="tier-features">
                <li>월 4회 세션</li>
                <li>AI 전환 로드맵</li>
                <li>핸즈온 워크숍</li>
                <li>전용 채널 · 우선 응대</li>
              </ul>
            </div>
            <div className="tier-card">
              <div className="tier-name">🏗️ 프로젝트 기반</div>
              <div className="tier-price">협의</div>
              <ul className="tier-features">
                <li>전체 AI 전환</li>
                <li>팀 교육 포함</li>
                <li>커스텀 솔루션</li>
                <li>성과 리포트</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="trust">
        <div className="container">
          <div className="trust-center">
            <h2 className="trust-title">왜 럼랩인가</h2>
            <p className="trust-sub">실무 경험과 교육 전문성이 결합된 컨설팅</p>
          </div>
          <div className="trust-grid">
            <div className="trust-card">
              <div className="trust-icon">🎓</div>
              <div className="trust-heading">교육공학 석사</div>
              <p className="trust-txt">학습 설계와 전달 방식을 체계적으로 적용해, 이해하기 쉽게 설명합니다.</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">📱</div>
              <div className="trust-heading">12년+ 교육·기획 경력</div>
              <p className="trust-txt">다수의 앱·웹 프로젝트 기획과 AI 도구 실무 적용 경험을 보유하고 있습니다.</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">🤝</div>
              <div className="trust-heading">1:1 맞춤 실행</div>
              <p className="trust-txt">이론이 아닌, 대표님 환경에 맞춘 워크플로우 설계와 핸즈온 지원까지 제공합니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec apply-section" id="apply">
        <div className="container">
          <div className="apply-inner">
            <h2 className="apply-title">VVIP 컨설팅 신청</h2>
            <p className="apply-sub">아래 양식을 작성해 주시면, 24시간 내 연락드리겠습니다. 비용·일정은 1:1 상담 시 안내합니다.</p>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '36px 32px', boxShadow: '0 12px 40px rgba(58,140,92,.06)' }}>
              <VvipForm actionPath="/vvip/" />
            </div>
            <p className="apply-alt">바로 상담을 원하시면 · <a href={kakaoUrl} target="_blank" rel="noopener noreferrer">카카오톡</a></p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p className="footer-info">
            사업자명: {site.company} <span>|</span> 사업자등록번호: 303-28-65658 <span>|</span> 대표: 성아름 <span>|</span> 주소: 경기도 수원시 영통구 삼성로 186 4층 <span>|</span> 이메일: <a href={`mailto:${site.email}`} style={{ color: 'var(--text-dim)' }}>{site.email}</a>
          </p>
        </div>
      </footer>
    </>
  );
}
