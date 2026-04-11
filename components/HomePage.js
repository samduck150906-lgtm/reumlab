'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const KAKAO_OPEN = 'https://open.kakao.com/o/sF0lmnhi';

export default function HomePage({ site }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pricingTab, setPricingTab] = useState('app');
  const [navScrolled, setNavScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const leafContainerRef = useRef(null);

  const kakaoUrl = site?.kakao || KAKAO_OPEN;

  useEffect(() => {
    const onScroll = () => {
      setNavScrolled(window.scrollY > 60);
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) en.target.classList.add('vis');
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    document.querySelectorAll('.rv').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const cObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target;
          const target = +el.dataset.target;
          const duration = 1800;
          const start = performance.now();
          const step = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const v = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(v * target);
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target;
          };
          requestAnimationFrame(step);
          cObs.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll('.counter').forEach((el) => cObs.observe(el));
    return () => cObs.disconnect();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  useEffect(() => {
    const container = leafContainerRef.current;
    if (!container) return;
    const leaves = ['🍃', '🌿', '☘️', '🌱'];
    for (let i = 0; i < 12; i++) {
      const div = document.createElement('div');
      div.className = 'hero-leaf';
      div.textContent = leaves[Math.floor(Math.random() * leaves.length)];
      div.style.left = Math.random() * 100 + '%';
      div.style.animationDuration = 10 + Math.random() * 15 + 's';
      div.style.animationDelay = Math.random() * 12 + 's';
      div.style.fontSize = 14 + Math.random() * 10 + 'px';
      div.style.position = 'absolute';
      container.appendChild(div);
    }
    return () => {
      while (container.firstChild) container.removeChild(container.firstChild);
    };
  }, []);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className={`nav ${navScrolled ? 'scrolled' : ''}`} id="nav">
        <div className="container">
          <div className="nav-inner">
            <Link href="/" className="nav-logo en">
              <span>REUMLAB</span>
            </Link>
            <ul className="nav-links">
              <li><a href="#services">서비스</a></li>
              <li><a href="#app-portfolio">앱</a></li>
              <li><a href="#web-portfolio">웹</a></li>
              <li><a href="#pricing">가격</a></li>
              <li><Link href="/consultation/" className="nav-cta">📋 상담 신청</Link></li>
            </ul>
            <button type="button" className="hamburger" id="hamburgerBtn" aria-label="메뉴" onClick={() => setMobileMenuOpen(true)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`} id="mobileMenu">
        <button type="button" className="mobile-close" id="mobileClose" onClick={() => setMobileMenuOpen(false)} aria-label="닫기">✕</button>
        <a href="#services" onClick={closeMobile}>서비스</a>
        <a href="#app-portfolio" onClick={closeMobile}>앱 포트폴리오</a>
        <a href="#web-portfolio" onClick={closeMobile}>웹 포트폴리오</a>
        <a href="#pricing" onClick={closeMobile}>가격</a>
        <Link href="/consultation/" className="btn-primary" style={{ fontSize: '15px', padding: '13px 28px' }} onClick={closeMobile}>📋 상담 신청</Link>
      </div>

      <section className="hero">
        <div className="hero-glow hero-glow-1" />
        <div className="hero-glow hero-glow-2" />
        <div className="hero-glow hero-glow-3" />
        <div ref={leafContainerRef} id="leafC" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              프로젝트 상담 가능
            </div>
            <h1 className="hero-title">
              <span className="gradient-text">아이디어를</span>
              <br />
              <span className="outline">현실로</span>
            </h1>
            <p className="hero-sub">
              어떤 <strong>웹</strong>이든, 어떤 <strong>앱</strong>이든.
              <br />
              기획부터 디자인, 개발, 배포까지 <strong>맞춤 외주</strong>로 만들어드립니다.
            </p>
            <div className="hero-tags">
              <span className="hero-tag">📱 앱 개발</span>
              <span className="hero-tag">🌐 웹 개발</span>
            </div>
            <div className="hero-btns">
              <Link href="/consultation/" className="btn-primary">📋 사이트에서 바로 신청</Link>
              <a href={kakaoUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">💬 카카오톡 상담</a>
              <a href="#app-portfolio" className="btn-secondary">포트폴리오 보기 →</a>
            </div>
          </div>
        </div>
      </section>

      <section className="sec sec-warm" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-text rv">
              <div className="sec-label">ABOUT US</div>
              <h2 className="sec-title">앱·웹 개발에<br />집중합니다</h2>
              <p>기획·디자인·개발·배포까지 한 팀에서 책임집니다.</p>
              <p>단순 제작이 아니라 <span className="hl">서비스에 맞는 구조와 UX</span>를 함께 설계합니다.</p>
              <p>MVP부터 정식 런칭까지, 규모에 맞춰 진행합니다.</p>
            </div>
            <div className="stats-grid rv rv-d2">
              <div className="stat-card">
                <div className="stat-num"><span className="counter" data-target="5">0</span>+</div>
                <div className="stat-label">앱·웹 개발<br />경력 (년)</div>
              </div>
              <div className="stat-card">
                <div className="stat-num"><span className="counter" data-target="15">0</span>+</div>
                <div className="stat-label">프로젝트<br />완료</div>
              </div>
              <div className="stat-card">
                <div className="stat-num"><span className="counter" data-target="100">0</span>%</div>
                <div className="stat-label">맞춤<br />기획</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="services">
        <div className="container">
          <div className="sec-center">
            <div className="sec-label rv">SERVICES</div>
            <h2 className="sec-title rv rv-d1">앱 개발 · 웹 개발</h2>
          </div>
          <div className="services-grid">
            <div className="svc rv">
              <div className="svc-icon">📱</div>
              <h3 className="svc-title">앱 개발</h3>
              <div className="svc-sub">App Development</div>
              <p className="svc-desc">iOS·Android 동시 개발. MVP부터 정식 서비스 런칭까지 책임집니다.</p>
              <ul className="svc-list">
                <li>크로스플랫폼 (Flutter / React Native)</li>
                <li>소셜 로그인 · 결제 시스템 연동</li>
                <li>대용량 DB · 검색/필터 고급 기능</li>
                <li>맞춤 UI/UX · 런칭 지원 · 유지보수</li>
              </ul>
            </div>
            <div className="svc rv rv-d1">
              <div className="svc-icon">🌐</div>
              <h3 className="svc-title">웹 개발</h3>
              <div className="svc-sub">Web Development</div>
              <p className="svc-desc">랜딩·브랜드 사이트·예약/결제까지. 기획·디자인·반응형·SEO 기본 포함.</p>
              <ul className="svc-list">
                <li>기업/브랜드 홈페이지 · 멀티페이지</li>
                <li>전환 최적화 랜딩페이지</li>
                <li>예약/결제·관리자 연동</li>
                <li>SEO · 애널리틱스 기본 세팅</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* App Portfolio - 첫 카드만 표시, 나머지는 동일 패턴으로 추가 가능 */}
      <section className="sec sec-cream" id="app-portfolio">
        <div className="container">
          <div className="sec-center">
            <div className="sec-label rv">APP PORTFOLIO</div>
            <h2 className="sec-title rv rv-d1">앱 개발 포트폴리오</h2>
            <p className="sec-desc rv rv-d2">대규모 데이터 처리부터 복잡한 비즈니스 로직까지, 앱 개발의 모든 것을 구현합니다.</p>
          </div>
          <div className="app-cards">
            <div className="app-card rv">
              <div className="app-card-head">
                <div className="app-card-emoji">📚</div>
                <div>
                  <h3 className="app-card-title">교육 추천 슈퍼앱</h3>
                  <div className="app-card-subtitle">Cross-Platform Matching Platform</div>
                </div>
              </div>
              <div className="app-card-tags">
                <span className="app-tag">Flutter</span>
                <span className="app-tag">Node.js</span>
                <span className="app-tag">Supabase</span>
                <span className="app-tag">PostgreSQL RPC</span>
              </div>
              <p className="app-card-desc">
                130,000건 이상의 데이터를 PostgreSQL RPC로 처리하는 대규모 매칭 플랫폼. Haversine 공식 기반 위치 검색, 6가지 가중치 스코어링 알고리즘, 역할 기반 UX 분기(GoRouter redirect guard), 실시간 리뷰 집계 시스템을 구현했습니다.
              </p>
              <div className="app-features">
                <div className="app-feature">
                  <div className="app-feature-icon">🎯</div>
                  <div className="app-feature-title">프로필 기반 추천 엔진</div>
                  <div className="app-feature-desc">거리·과목·목표·예산·평점 등 6가지 가중치 기반 스코어링</div>
                </div>
                <div className="app-feature">
                  <div className="app-feature-icon">📍</div>
                  <div className="app-feature-title">위치 기반 검색</div>
                  <div className="app-feature-desc">GPS + 3단계 행정구역 드릴다운, Haversine 반경 검색</div>
                </div>
                <div className="app-feature">
                  <div className="app-feature-icon">👤</div>
                  <div className="app-feature-title">역할 기반 UX 분기</div>
                  <div className="app-feature-desc">완전히 분리된 UX 플로우, 역할별 대시보드</div>
                </div>
                <div className="app-feature">
                  <div className="app-feature-icon">⭐</div>
                  <div className="app-feature-title">리뷰 &amp; 상담 시스템</div>
                  <div className="app-feature-desc">별점+텍스트+이미지 리뷰, 상담 요청, 통계</div>
                </div>
              </div>
              <div className="app-card-stats">
                <span className="app-stat">24,000+ Lines</span>
                <span className="app-stat">17 API Endpoints</span>
                <span className="app-stat">13 DB Tables</span>
              </div>
            </div>
            <div className="app-card rv">
              <div className="app-card-head">
                <div className="app-card-emoji">🏠</div>
                <div>
                  <h3 className="app-card-title">제휴 서비스 플랫폼</h3>
                  <div className="app-card-subtitle">B2B2C Triple Platform</div>
                </div>
              </div>
              <div className="app-card-tags">
                <span className="app-tag">React Native (Expo)</span>
                <span className="app-tag">Next.js 14</span>
                <span className="app-tag">Supabase</span>
                <span className="app-tag">TypeScript</span>
              </div>
              <p className="app-card-desc">
                React Native(Expo) + Next.js 14 + Supabase로 구축한 트리플 플랫폼 아키텍처. 관리자 대시보드(Next.js SSR), 전용 모바일 앱(Expo), 고객 랜딩을 단일 Supabase 인스턴스에서 운용. RLS 기반 다중 역할 인증, 카카오 알림톡 API + SMS 폴백, 다자간 정산 로직 2주 내 MVP 완성.
              </p>
              <div className="app-features">
                <div className="app-feature">
                  <div className="app-feature-icon">📊</div>
                  <div className="app-feature-title">관리자 대시보드</div>
                  <div className="app-feature-desc">실시간 통계, 서비스 요청 관리, 정산 처리 통합</div>
                </div>
                <div className="app-feature">
                  <div className="app-feature-icon">🔐</div>
                  <div className="app-feature-title">다중 역할 인증</div>
                  <div className="app-feature-desc">관리자/스태프/중개사/제휴업체별 접근 권한 분리</div>
                </div>
                <div className="app-feature">
                  <div className="app-feature-icon">💰</div>
                  <div className="app-feature-title">정산 시스템</div>
                  <div className="app-feature-desc">다자간 정산, 추천 가입 수수료 적립, 만료일 자동 관리</div>
                </div>
                <div className="app-feature">
                  <div className="app-feature-icon">📩</div>
                  <div className="app-feature-title">알림 자동화</div>
                  <div className="app-feature-desc">카카오 알림톡 + SMS 자동 대체 발송</div>
                </div>
              </div>
              <div className="app-card-stats">
                <span className="app-stat">2주 MVP</span>
                <span className="app-stat">트리플 플랫폼</span>
              </div>
            </div>
            <div className="app-card rv">
              <div className="app-card-head">
                <div className="app-card-emoji">🔍</div>
                <div>
                  <h3 className="app-card-title">콘텐츠 검색·아카이빙 SaaS</h3>
                  <div className="app-card-subtitle">Search &amp; Archive Platform</div>
                </div>
              </div>
              <div className="app-card-tags">
                <span className="app-tag">Flutter</span>
                <span className="app-tag">Supabase</span>
                <span className="app-tag">Edge Functions</span>
                <span className="app-tag">SaaS</span>
              </div>
              <p className="app-card-desc">
                풀텍스트·메타 검색, 이미지 OCR 기반 태그, 벡터 DB 연동 문맥 검색, Edge Function 서버리스로 0.5초대 응답. 구독형 빌링 + 대규모 동시 접속 구조.
              </p>
              <div className="app-features">
                <div className="app-feature">
                  <div className="app-feature-icon">🗣️</div>
                  <div className="app-feature-title">시맨틱 검색·아카이빙</div>
                  <div className="app-feature-desc">벡터 데이터베이스 및 시맨틱 검색 기반의 지식 아카이빙 솔루션</div>
                </div>
                <div className="app-feature">
                  <div className="app-feature-icon">🖼️</div>
                  <div className="app-feature-title">문서 자동 분류</div>
                  <div className="app-feature-desc">Edge Functions 및 OCR 엔진 기반의 실시간 문서 자동 분류 시스템</div>
                </div>
                <div className="app-feature">
                  <div className="app-feature-icon">⚡</div>
                  <div className="app-feature-title">초경량 DB</div>
                  <div className="app-feature-desc">0.5초 이내 처리, 서버 비용 최소화</div>
                </div>
                <div className="app-feature">
                  <div className="app-feature-icon">📈</div>
                  <div className="app-feature-title">확장성 확보</div>
                  <div className="app-feature-desc">1,000명 동시접속, 구독형 수익 모델</div>
                </div>
              </div>
              <div className="app-card-stats">
                <span className="app-stat">4주 MVP</span>
                <span className="app-stat">SaaS 모델</span>
              </div>
            </div>
            <div className="app-card rv">
              <div className="app-card-head">
                <div className="app-card-emoji">⚡</div>
                <div>
                  <h3 className="app-card-title">초단위 반응형 캐주얼 게임</h3>
                  <div className="app-card-subtitle">Ultra-Lightweight Casual Game</div>
                </div>
              </div>
              <div className="app-card-tags">
                <span className="app-tag">Flutter</span>
                <span className="app-tag">Firebase</span>
                <span className="app-tag">Cross-Platform</span>
              </div>
              <p className="app-card-desc">
                고정밀 타이머(microseconds) 반응속도 측정, Firestore 실시간 리더보드, 진입→플레이→결과 3초 이내 UX 플로우.
              </p>
              <div className="app-features">
                <div className="app-feature">
                  <div className="app-feature-icon">🎮</div>
                  <div className="app-feature-title">3초 UX 플로우</div>
                  <div className="app-feature-desc">극한의 짧은 사이클로 중독성 확보</div>
                </div>
                <div className="app-feature">
                  <div className="app-feature-icon">🏆</div>
                  <div className="app-feature-title">랭킹 시스템</div>
                  <div className="app-feature-desc">일간/주간 리더보드, 경쟁 심리 리텐션</div>
                </div>
                <div className="app-feature">
                  <div className="app-feature-icon">📊</div>
                  <div className="app-feature-title">반응속도 분석</div>
                  <div className="app-feature-desc">사용자별 데이터 수집 및 통계 시각화</div>
                </div>
                <div className="app-feature">
                  <div className="app-feature-icon">🎯</div>
                  <div className="app-feature-title">브랜드 확장</div>
                  <div className="app-feature-desc">기업 이벤트·프로모션 연동 구조</div>
                </div>
              </div>
            </div>
            <div className="app-card rv">
              <div className="app-card-head">
                <div className="app-card-emoji">📋</div>
                <div>
                  <h3 className="app-card-title">일정 선택·확정 투표 앱</h3>
                  <div className="app-card-subtitle">Group Scheduling Helper</div>
                </div>
              </div>
              <div className="app-card-tags">
                <span className="app-tag">Flutter</span>
                <span className="app-tag">Supabase Realtime</span>
              </div>
              <p className="app-card-desc">
                UUID 링크 공유 Zero-Hurdle UX, Realtime Subscription 실시간 투표, Edge Function 크론잡 자동 마감 + 확정 알림.
              </p>
              <div className="app-features">
                <div className="app-feature">
                  <div className="app-feature-icon">🔗</div>
                  <div className="app-feature-title">로그인 불필요</div>
                  <div className="app-feature-desc">링크만으로 즉시 참여, 제로 허들</div>
                </div>
                <div className="app-feature">
                  <div className="app-feature-icon">⏰</div>
                  <div className="app-feature-title">자동 마감·확정</div>
                  <div className="app-feature-desc">기한 도래 시 최다 득표 자동 확정</div>
                </div>
                <div className="app-feature">
                  <div className="app-feature-icon">📊</div>
                  <div className="app-feature-title">실시간 시각화</div>
                  <div className="app-feature-desc">참여 현황 라이브 + 미응답자 리마인드</div>
                </div>
                <div className="app-feature">
                  <div className="app-feature-icon">📱</div>
                  <div className="app-feature-title">알림 연동</div>
                  <div className="app-feature-desc">카카오톡·SMS 알림으로 참여율 극대화</div>
                </div>
              </div>
            </div>
            <div className="app-card rv">
              <div className="app-card-head">
                <div className="app-card-emoji">🤝</div>
                <div>
                  <h3 className="app-card-title">만남 성사 확인 앱</h3>
                  <div className="app-card-subtitle">Privacy-First Mutual Matching</div>
                </div>
              </div>
              <div className="app-card-tags">
                <span className="app-tag">Flutter</span>
                <span className="app-tag">Supabase RLS</span>
                <span className="app-tag">FCM</span>
              </div>
              <p className="app-card-desc">
                Supabase RLS로 비대칭 노출 완전 차단, 양방향 수락 시에만 결과 공개. 단일 목적 UX, FCM 조건부 푸시(성사 시에만).
              </p>
              <div className="app-features">
                <div className="app-feature">
                  <div className="app-feature-icon">🔒</div>
                  <div className="app-feature-title">비대칭 노출 방지</div>
                  <div className="app-feature-desc">RLS로 상대 수락 전 선택 비공개</div>
                </div>
                <div className="app-feature">
                  <div className="app-feature-icon">💡</div>
                  <div className="app-feature-title">부담 제로 UX</div>
                  <div className="app-feature-desc">거절 상황 자체가 발생하지 않는 구조</div>
                </div>
                <div className="app-feature">
                  <div className="app-feature-icon">🎯</div>
                  <div className="app-feature-title">단일 목적</div>
                  <div className="app-feature-desc">프로필·채팅 없이 핵심 기능 집중</div>
                </div>
                <div className="app-feature">
                  <div className="app-feature-icon">🔔</div>
                  <div className="app-feature-title">조건부 알림</div>
                  <div className="app-feature-desc">양방향 성사 시에만 푸시, 불필요 알림 제로</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec sec-warm" id="web-portfolio">
        <div className="container">
          <div className="sec-center">
            <div className="sec-label rv">WEB PORTFOLIO</div>
            <h2 className="sec-title rv rv-d1">웹 개발 포트폴리오</h2>
            <p className="sec-desc rv rv-d2">실제 제작한 사이트의 구성과 기술 구현입니다.</p>
          </div>
          <div className="web-grid">
            <div className="web-card rv">
              <div className="web-mockup">
                <div className="web-mockup-bar">
                  <div className="dots"><span className="dot r" /><span className="dot y" /><span className="dot g" /></div>
                </div>
                <div style={{ background: 'linear-gradient(180deg,#0a0a0a,#1a1a1a)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '7px', letterSpacing: '4px', color: 'rgba(255,255,255,.4)', marginBottom: '6px' }}>PERSONAL BRAND</div>
                    <div style={{ fontSize: '20px', fontWeight: 200, color: '#fff', letterSpacing: '8px' }}>PORTFOLIO</div>
                    <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,.2)', margin: '10px auto' }} />
                    <div style={{ fontSize: '7px', color: 'rgba(255,255,255,.3)' }}>시네마틱 감성</div>
                  </div>
                </div>
              </div>
              <div className="web-card-info">
                <div className="web-card-cat">포트폴리오</div>
                <h3 className="web-card-title">개인 브랜딩 포트폴리오</h3>
                <p className="web-card-desc">Intersection Observer 스크롤 애니메이션 + CSS 라이트박스 갤러리</p>
                <ul className="web-card-features">
                  <li>반응형 레이아웃 (모바일/태블릿/PC)</li>
                  <li>이미지 갤러리 + 라이트박스</li>
                  <li>CSS-only 스크롤 애니메이션</li>
                </ul>
                <div className="web-card-taglist"><span>반응형</span><span>갤러리</span><span>CSS Animation</span></div>
              </div>
            </div>
            <div className="web-card rv rv-d1">
              <div className="web-mockup">
                <div className="web-mockup-bar">
                  <div className="dots"><span className="dot r" /><span className="dot y" /><span className="dot g" /></div>
                </div>
                <div style={{ background: 'linear-gradient(180deg,#0d1b2a,#1b263b,#415a77)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '7px', letterSpacing: '3px', color: '#7dd3fc', marginBottom: '6px' }}>PREMIUM PRODUCT</div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>최상의 경험을<br />설계합니다</div>
                    <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginTop: 10 }}>
                      <span style={{ padding: '4px 10px', background: '#3b82f6', borderRadius: 4, fontSize: '7px', color: '#fff', fontWeight: 600 }}>구매하기</span>
                      <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,.1)', borderRadius: 4, fontSize: '7px', color: '#fff' }}>상담</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="web-card-info">
                <div className="web-card-cat">브랜드 랜딩</div>
                <h3 className="web-card-title">D2C 전환 최적화 랜딩페이지</h3>
                <p className="web-card-desc">AIDA 구조 카피라이팅 + CTA A/B 테스트 + SEO 메타태그</p>
                <ul className="web-card-features">
                  <li>AIDA 구조 기반 세일즈 카피라이팅</li>
                  <li>CTA 버튼 A/B 테스트 배치</li>
                  <li>카카오톡 채널 + SEO 연동</li>
                </ul>
                <div className="web-card-taglist"><span>전환 최적화</span><span>SEO</span><span>카카오</span></div>
              </div>
            </div>
            <div className="web-card rv">
              <div className="web-mockup">
                <div className="web-mockup-bar">
                  <div className="dots"><span className="dot r" /><span className="dot y" /><span className="dot g" /></div>
                </div>
                <div style={{ background: 'linear-gradient(180deg,#162b1e,#1e3828)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '7px', letterSpacing: '3px', color: '#a8d8b8', marginBottom: '6px' }}>RESERVATION SYSTEM</div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>특별한 순간을<br />특별한 공간에서</div>
                    <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginTop: 10 }}>
                      <span style={{ padding: '4px 10px', background: '#3a8c5c', borderRadius: 4, fontSize: '7px', color: '#fff', fontWeight: 600 }}>예약</span>
                      <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,.1)', borderRadius: 4, fontSize: '7px', color: '#fff' }}>둘러보기</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="web-card-info">
                <div className="web-card-cat">비즈니스</div>
                <h3 className="web-card-title">예약·결제 통합 사이트</h3>
                <p className="web-card-desc">타임슬롯 가격 로직 + PG사 결제 API + 자동 예약 확인 알림</p>
                <ul className="web-card-features">
                  <li>시간대별 가격 + 실시간 예약</li>
                  <li>카카오 예약 알림 + 지도 API</li>
                  <li>공간별 상세 + 이미지 갤러리</li>
                </ul>
                <div className="web-card-taglist"><span>예약 시스템</span><span>결제 API</span><span>카카오</span></div>
              </div>
            </div>
            <div className="web-card rv rv-d1">
              <div className="web-mockup">
                <div className="web-mockup-bar">
                  <div className="dots"><span className="dot r" /><span className="dot y" /><span className="dot g" /></div>
                </div>
                <div style={{ background: 'linear-gradient(180deg,#fef9c3,#fef08a)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 28, marginBottom: 4 }}>🤝</div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#78350f', lineHeight: 1.3 }}>함께 나누는<br />따뜻한 커뮤니티</div>
                    <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginTop: 10 }}>
                      <span style={{ padding: '4px 10px', background: '#f59e0b', borderRadius: 100, fontSize: '7px', color: '#fff', fontWeight: 600 }}>가입</span>
                      <span style={{ padding: '4px 10px', background: 'rgba(245,158,11,.2)', borderRadius: 100, fontSize: '7px', color: '#92400e' }}>활동</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="web-card-info">
                <div className="web-card-cat">커뮤니티</div>
                <h3 className="web-card-title">커뮤니티 홍보 &amp; 가입 사이트</h3>
                <p className="web-card-desc">감성 일러스트 + Warm Color + 모바일 퍼스트 + OG 메타태그</p>
                <ul className="web-card-features">
                  <li>감성 일러스트 + Warm Color 파레트</li>
                  <li>갤러리 · 간편 가입 폼</li>
                  <li>반응형 + OG 메타태그 최적화</li>
                </ul>
                <div className="web-card-taglist"><span>감성 디자인</span><span>전환 최적화</span><span>반응형</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec sec-warm" id="pricing">
        <div className="container">
          <div className="sec-center">
            <div className="sec-label rv">PRICING</div>
            <h2 className="sec-title rv rv-d1">투명한 가격 정책</h2>
            <p className="sec-desc rv rv-d2">숨겨진 비용 없이, 처음 안내드린 금액 그대로.</p>
          </div>
          <div className="pricing-tabs rv">
            <button type="button" className={`pricing-tab ${pricingTab === 'app' ? 'active' : ''}`} onClick={() => setPricingTab('app')}>📱 앱 개발</button>
            <button type="button" className={`pricing-tab ${pricingTab === 'web' ? 'active' : ''}`} onClick={() => setPricingTab('web')}>🌐 웹 개발</button>
          </div>
          <div className={`pricing-content ${pricingTab === 'app' ? 'active' : ''}`} id="app-pricing">
            <div className="pricing-grid">
              <div className="price-card featured rv">
                <div className="price-tier">개발 외주 패키지</div>
                <div className="price-amount">300만원~</div>
                <div className="price-period">약 7~10일</div>
                <ul className="price-features">
                  <li>로그인 / 회원가입</li><li>데이터베이스 설계</li><li>핵심 기능 1~3개 개발</li><li>기본 UI 제작</li><li>결제 연동 (Toss 등)</li><li>도메인 연결 &amp; 배포</li><li>2회 수정 포함</li>
                </ul>
                <Link href="/consultation/" className="price-btn price-btn-fill">상담하기</Link>
              </div>
              <div className="price-card rv rv-d1">
                <div className="price-tier">Standard</div>
                <div className="price-amount">499만원~</div>
                <div className="price-period">3~5주</div>
                <ul className="price-features">
                  <li>풀 기능 + 맞춤 UI/UX</li><li>소셜 로그인 + 결제</li><li>관리자 대시보드</li><li>유지보수 1개월</li>
                </ul>
                <Link href="/consultation/" className="price-btn price-btn-outline">상담하기</Link>
              </div>
              <div className="price-card rv rv-d2">
                <div className="price-tier">Enterprise</div>
                <div className="price-amount">별도 협의</div>
                <div className="price-period">협의</div>
                <ul className="price-features">
                  <li>복합 플랫폼 (웹+앱)</li><li>대용량 아키텍처</li><li>외부 API 다중 연동</li><li>장기 유지보수</li>
                </ul>
                <Link href="/consultation/" className="price-btn price-btn-outline">상담하기</Link>
              </div>
            </div>
          </div>
          <div className={`pricing-content ${pricingTab === 'web' ? 'active' : ''}`} id="web-pricing">
            <div className="pricing-grid">
              <div className="price-card rv">
                <div className="price-tier">Basic</div>
                <div className="price-amount">99만원~</div>
                <div className="price-period">7일</div>
                <ul className="price-features">
                  <li>원페이지 랜딩</li><li>반응형 디자인</li><li>기본 SEO</li><li>수정 2회 + 호스팅 1년</li>
                </ul>
                <Link href="/consultation/" className="price-btn price-btn-outline">상담하기</Link>
              </div>
              <div className="price-card featured rv rv-d1">
                <div className="price-tier">Standard</div>
                <div className="price-amount">199만원~</div>
                <div className="price-period">10~14일</div>
                <ul className="price-features">
                  <li>멀티페이지 (5P)</li><li>맞춤 UI/UX</li><li>고급 SEO + 애널리틱스</li><li>수정 5회 + 유지보수 1개월</li>
                </ul>
                <Link href="/consultation/" className="price-btn price-btn-fill">상담하기</Link>
              </div>
              <div className="price-card rv rv-d2">
                <div className="price-tier">Premium</div>
                <div className="price-amount">399만원~</div>
                <div className="price-period">협의</div>
                <ul className="price-features">
                  <li>풀커스텀 디자인+기능</li><li>결제/예약 시스템</li><li>관리자 페이지 + API</li><li>수정 무제한 + 유지보수 3개월</li>
                </ul>
                <Link href="/consultation/" className="price-btn price-btn-outline">상담하기</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="process">
        <div className="container">
          <div className="sec-center">
            <div className="sec-label rv">PROCESS</div>
            <h2 className="sec-title rv rv-d1">진행 과정</h2>
          </div>
          <div className="process-grid">
            <div className="process-step rv"><div className="process-num en">01</div><h3 className="process-step-title">무료 상담</h3><p className="process-step-desc">아이디어 공유 &amp; 요구사항 분석</p></div>
            <div className="process-step rv rv-d1"><div className="process-num en">02</div><h3 className="process-step-title">기획 &amp; 견적</h3><p className="process-step-desc">맞춤 제안서 &amp; 기술 스택 선정</p></div>
            <div className="process-step rv rv-d2"><div className="process-num en">03</div><h3 className="process-step-title">디자인 &amp; 개발</h3><p className="process-step-desc">실시간 피드백 반영·단계별 검수</p></div>
            <div className="process-step rv rv-d3"><div className="process-num en">04</div><h3 className="process-step-title">완성 &amp; 배포</h3><p className="process-step-desc">검수 → 런칭 → 유지보수</p></div>
          </div>
        </div>
      </section>

      <section className="sec sec-cream" id="faq">
        <div className="container">
          <div className="sec-center">
            <div className="sec-label rv">FAQ</div>
            <h2 className="sec-title rv rv-d1">자주 묻는 질문</h2>
          </div>
          <div className="faq-grid">
            <div className="faq-item rv"><div className="faq-q">기획서가 없어도 되나요?</div><p className="faq-a">네, 아이디어만 말씀해주시면 기획부터 정리해서 진행합니다.</p></div>
            <div className="faq-item rv rv-d1"><div className="faq-q">결제는 어떻게 하나요?</div><p className="faq-a">계약서 작성 후 선금 50% → 완료 후 잔금 50%. 세금계산서 가능.</p></div>
            <div className="faq-item rv rv-d2"><div className="faq-q">수정은 몇 번까지 가능한가요?</div><p className="faq-a">패키지별 수정 횟수가 다르며, 추가 수정은 협의 후 진행 가능합니다.</p></div>
            <div className="faq-item rv rv-d3"><div className="faq-q">앱과 웹을 같이 만들 수 있나요?</div><p className="faq-a">네. 동일 백엔드로 앱·웹을 함께 구축하는 경우도 많습니다. 상담 시 일정과 견적을 안내드립니다.</p></div>
          </div>
        </div>
      </section>

      <section className="sec apply-section" id="apply">
        <div className="container">
          <div className="apply-inner rv">
            <h2 className="apply-title">사이트에서 바로 상담 신청</h2>
            <p className="apply-sub">앱·웹 개발 상담 폼으로 이동해 간단히 작성해 주시면 빠르게 연락드립니다.</p>
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <Link href="/consultation/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>신청 보내기</Link>
            </div>
            <p className="apply-alt">바로 상담을 원하시면 · <a href={kakaoUrl} target="_blank" rel="noopener noreferrer">카카오톡</a></p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-glow cta-glow-1" />
        <div className="cta-glow cta-glow-2" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="cta-title rv"><span className="gradient-text">아이디어</span>만 있으면<br />나머지는 저희가 합니다</h2>
          <p className="cta-sub rv rv-d1">앱·웹 개발 문의는 언제든 편하게 상담하세요.</p>
          <div className="hero-btns rv rv-d2" style={{ justifyContent: 'center', gap: 14 }}>
            <Link href="/consultation/" className="btn-primary" style={{ fontSize: 18, padding: '20px 42px' }}>📋 사이트에서 바로 신청</Link>
            <a href={kakaoUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: 16, padding: '18px 36px' }}>💬 카카오톡 상담</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p className="footer-info">
            {site?.company || '이터널식스'} <span>|</span> 대표자: 성아름 <span>|</span> 사업자등록번호: 303-28-65658
            <br />
            통신판매업: 제 2025-수원영통-1499호 <span>|</span> 연락처: 010-8111-9370
            <br />
            주소: 경기도 수원시 영통구 삼성로 186-1 4층 <span>|</span> 이메일:{' '}
            <a href="mailto:ceo@eternalsix.kr" style={{ color: 'var(--text-dim)' }}>ceo@eternalsix.kr</a>
          </p>
        </div>
      </footer>

      <div className="float-btns">
        <a href={kakaoUrl} target="_blank" rel="noopener noreferrer" className="float-btn float-kakao" title="카카오톡 상담">💬</a>
        <button type="button" className={`float-btn float-top ${showScrollTop ? 'show' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} title="맨 위로">↑</button>
      </div>
    </>
  );
}
