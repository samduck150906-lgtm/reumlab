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
              <li><a href="#production">창업 프로덕션</a></li>
              <li><a href="/bootcamp/">부트캠프</a></li>
              <li><Link href="/vvip/">VVIP 신청</Link></li>
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
        <a href="#production" onClick={closeMobile}>창업 프로덕션</a>
        <a href="/bootcamp/" onClick={closeMobile}>부트캠프</a>
        <Link href="/vvip/" onClick={closeMobile}>VVIP 신청</Link>
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
              어떤 <strong>웹사이트</strong>든, 어떤 <strong>앱</strong>이든.
              <br />
              기획부터 디자인, 개발, <strong>창업 프로덕션</strong>까지 원스톱으로 만들어드립니다.
            </p>
            <div className="hero-tags">
              <span className="hero-tag">📱 앱 개발</span>
              <span className="hero-tag">🌐 웹사이트</span>
              <span className="hero-tag">🏗️ 창업 프로덕션</span>
              <span className="hero-tag">🎓 AI 부트캠프</span>
              <span className="hero-tag">👑 VVIP 컨설팅</span>
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
              <h2 className="sec-title">개발만 하는 곳이<br />아닙니다</h2>
              <p>기획부터 마케팅까지 올인원. 단순히 만들어만 주는 외주와는 다릅니다.</p>
              <p>마케팅 실무 경력을 바탕으로, <span className="hl">고객이 찾아오는 구조까지 설계</span>합니다.</p>
              <p>기획 → 디자인 → 개발 → SEO/마케팅 세팅까지 한 번에.</p>
            </div>
            <div className="stats-grid rv rv-d2">
              <div className="stat-card">
                <div className="stat-num"><span className="counter" data-target="5">0</span>+</div>
                <div className="stat-label">기획/개발/마케팅<br />경력 (년)</div>
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
            <h2 className="sec-title rv rv-d1">뭐든지 만들어드립니다</h2>
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
                <li>런칭 지원 + 유지보수</li>
              </ul>
            </div>
            <div className="svc rv rv-d1">
              <div className="svc-icon">🌐</div>
              <h3 className="svc-title">웹사이트 제작</h3>
              <div className="svc-sub">Web Development</div>
              <p className="svc-desc">랜딩페이지, 브랜드 사이트, 예약 시스템까지. 기획·디자인·SEO 최적화 포함.</p>
              <ul className="svc-list">
                <li>기업/브랜드 홈페이지</li>
                <li>전환 최적화 랜딩페이지</li>
                <li>예약/결제 시스템 연동</li>
                <li>SEO + 애널리틱스 기본 세팅</li>
              </ul>
            </div>
            <div className="svc rv rv-d2">
              <div className="svc-icon">🎨</div>
              <h3 className="svc-title">UI/UX 디자인</h3>
              <div className="svc-sub">Design</div>
              <p className="svc-desc">사용자 경험을 최우선으로 한 인터페이스 디자인. 반응형 설계 기본 포함.</p>
              <ul className="svc-list">
                <li>모바일 퍼스트 반응형 설계</li>
                <li>프로토타입 · 와이어프레임</li>
                <li>브랜드 아이덴티티 반영</li>
                <li>사용성 테스트 기반 개선</li>
              </ul>
            </div>
            <div className="svc rv rv-d3">
              <div className="svc-icon">📈</div>
              <h3 className="svc-title">마케팅 세팅</h3>
              <div className="svc-sub">Marketing</div>
              <p className="svc-desc">만들고 끝이 아닙니다. 고객이 찾아오는 구조까지 함께 설계합니다.</p>
              <ul className="svc-list">
                <li>SEO 최적화 + 메타태그 세팅</li>
                <li>Google Analytics · Search Console</li>
                <li>카카오톡 채널 연동</li>
                <li>전환율 최적화 (CRO)</li>
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
                  <h3 className="app-card-title">초개인화 아카이빙 플랫폼</h3>
                  <div className="app-card-subtitle">Semantic Search SaaS</div>
                </div>
              </div>
              <div className="app-card-tags">
                <span className="app-tag">Flutter</span>
                <span className="app-tag">Supabase</span>
                <span className="app-tag">GPT-4o API</span>
                <span className="app-tag">SaaS</span>
              </div>
              <p className="app-card-desc">
                GPT-4o API 시맨틱 검색 SaaS. Vision API 자동 태그 분류, Embedding 벡터 문맥 검색, Edge Function 서버리스 처리 0.5초 이내 응답. 구독형 빌링 + 1,000명 동시 접속 아키텍처.
              </p>
              <div className="app-features">
                <div className="app-feature">
                  <div className="app-feature-icon">🗣️</div>
                  <div className="app-feature-title">시맨틱 검색</div>
                  <div className="app-feature-desc">자연어 질문으로 문맥 파악 후 정확한 정보 검색</div>
                </div>
                <div className="app-feature">
                  <div className="app-feature-icon">🖼️</div>
                  <div className="app-feature-title">이미지→텍스트 변환</div>
                  <div className="app-feature-desc">사진 업로드 시 자동 태그 분류 (OCR/Vision)</div>
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
            <h2 className="sec-title rv rv-d1">웹사이트 포트폴리오</h2>
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

      <section className="sec sec-dark" id="production">
        <div className="container">
          <div className="rv">
            <div className="sec-label">STARTUP PRODUCTION</div>
            <h2 className="sec-title">아이디어 → 시장 검증 → MVP → 투자 유치</h2>
            <p className="sec-desc">창업에 필요한 모든 프로덕션을 AI로 가속합니다.</p>
          </div>
          <div className="prod-grid">
            <div className="rv">
              <div className="prod-info">
                <h3>만들기만 하는 게 아니라,<br />되게 만들어 드립니다</h3>
                <p>아이디어 검증부터 MVP 앱 개발, IR 덱 제작, 브랜딩, 마케팅 전략까지 — 창업 프로덕션의 전 과정을 원스톱으로 실행합니다.</p>
                <p>AI 기반 초고속 개발로 일반 에이전시 대비 3~5배 빠른 속도와 결과물을 제공합니다.</p>
                <div className="prod-highlights">
                  <div className="prod-hl"><div className="prod-hl-val">7일</div><div className="prod-hl-label">MVP 개발</div></div>
                  <div className="prod-hl"><div className="prod-hl-val">14일</div><div className="prod-hl-label">풀버전+마케팅</div></div>
                  <div className="prod-hl"><div className="prod-hl-val">원스톱</div><div className="prod-hl-label">기획~배포~마케팅</div></div>
                </div>
              </div>
            </div>
            <div className="rv rv-d2">
              <ul className="prod-steps">
                <li className="prod-step"><div className="prod-step-num">01</div><div><div className="prod-step-title">아이디어 검증 &amp; 시장 분석</div><div className="prod-step-desc">경쟁 리서치, TAM/SAM/SOM, 비즈니스 모델 설계</div></div></li>
                <li className="prod-step"><div className="prod-step-num">02</div><div><div className="prod-step-title">MVP 앱 + 랜딩페이지</div><div className="prod-step-desc">Flutter 크로스플랫폼, 전환 최적화 랜딩, SEO</div></div></li>
                <li className="prod-step"><div className="prod-step-num">03</div><div><div className="prod-step-title">IR 덱 &amp; 투자 소개서</div><div className="prod-step-desc">투자자 관점 스토리라인, 재무 모델, 시장 기회</div></div></li>
                <li className="prod-step"><div className="prod-step-num">04</div><div><div className="prod-step-title">브랜딩 &amp; 마케팅 런칭</div><div className="prod-step-desc">브랜드 아이덴티티, AI 콘텐츠 파이프라인</div></div></li>
                <li className="prod-step"><div className="prod-step-num">05</div><div><div className="prod-step-title">그로스 &amp; 스케일링</div><div className="prod-step-desc">데이터 기반 그로스, A/B 테스트, 전환 퍼널</div></div></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="bootcamp">
        <div className="container">
          <div className="rv">
            <div className="sec-label">AI APP BOOTCAMP</div>
            <h2 className="sec-title">AI 창업 부트캠프</h2>
            <p className="sec-desc">코딩 경험 없어도, 4주 만에 나만의 앱을 만들고 배포합니다.</p>
          </div>
          <div className="boot-layout">
            <div className="boot-visual rv">
              <ul className="boot-curriculum">
                <li className="boot-week"><div className="boot-week-num">W1</div><div><div className="boot-week-title">AI 도구 &amp; 기획</div><div className="boot-week-desc">Cursor, Claude, ChatGPT 세팅 → 앱 기획서 → 와이어프레임</div></div></li>
                <li className="boot-week"><div className="boot-week-num">W2</div><div><div className="boot-week-title">Flutter 기초 &amp; UI</div><div className="boot-week-desc">Flutter 환경 → AI 코딩으로 화면 제작 → 네비게이션</div></div></li>
                <li className="boot-week"><div className="boot-week-num">W3</div><div><div className="boot-week-title">백엔드 &amp; API 연동</div><div className="boot-week-desc">Supabase DB → 인증 → 결제/지도 등 외부 API</div></div></li>
                <li className="boot-week"><div className="boot-week-num">W4</div><div><div className="boot-week-title">배포 &amp; 런칭</div><div className="boot-week-desc">QA → 앱스토어 배포 → 마케팅 기초 → 데모데이</div></div></li>
              </ul>
            </div>
            <div className="boot-info rv rv-d1">
              <h3>AI로 앱을 만드는<br />가장 빠른 방법</h3>
              <p>12년 교육 경력 + AI 도구 전문성을 결합한 실전형 커리큘럼. 매 주차 결과물을 만드는 프로젝트 기반 수업입니다.</p>
              <div className="boot-price" style={{ margin: '20px 0', padding: '16px 20px', background: 'rgba(0,0,0,.06)', borderRadius: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>💰 가격</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--green)' }}>1기 얼리버드: 490,000원</div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-dim)', marginTop: 4 }}>정가: 790,000원 (2기부터 인상)</div>
              </div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>📦 구성</div>
              <ul className="svc-list" style={{ marginBottom: 16 }}>
                <li>4주 실전 과정</li>
                <li>주 1회 라이브 코칭 (주 90분)</li>
                <li>AI 절대 프롬프트 패키지 제공</li>
                <li>MVP 기획 템플릿 제공</li>
                <li>로그인·DB·결제·배포 실습</li>
                <li>개인 서비스 1개 완성 목표</li>
                <li>커뮤니티 참여권</li>
                <li>부트캠프 수강자 외주 10% 할인</li>
              </ul>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
                <Link href="/bootcamp/" className="btn-primary" style={{ fontSize: 14, padding: '14px 28px' }}>부트캠프 상세 보기 →</Link>
                <a href={kakaoUrl} target="_blank" rel="noopener noreferrer" className="btn-light" style={{ fontSize: 14, padding: '14px 28px' }}>카카오톡 상담</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec sec-dark2" id="vvip">
        <div className="container">
          <div className="rv"><div className="sec-label">VVIP CONSULTING</div><h2 className="sec-title">VVIP 1:1 AI 컨설팅</h2><p className="sec-desc">대표님의 사업에 맞춤 AI 전략을 설계하고 함께 실행합니다.</p></div>
          <div className="vvip-layout">
            <div className="vvip-info rv">
              <h3>AI를 &apos;도입&apos;이 아닌<br />&apos;내재화&apos;하도록</h3>
              <p>대표님의 업무 프로세스를 분석하고, AI를 통합하는 구체적인 워크플로우를 설계하고, 직접 핸즈온으로 실행까지 함께합니다.</p>
              <p>교육공학 석사 + 12년 교육 경력으로, 어떤 수준의 분이든 이해할 수 있도록 설명합니다.</p>
              <Link href="/vvip/" className="btn-primary" style={{ marginTop: 20 }}>VVIP 전용 페이지에서 신청 →</Link>
              <a href={kakaoUrl} target="_blank" rel="noopener noreferrer" className="btn-light" style={{ marginTop: 12, marginLeft: 0 }}>카카오톡 상담</a>
            </div>
            <div className="vvip-tiers rv rv-d1">
              <div className="vvip-tier gold" style={{ maxWidth: '100%' }}>
                <div className="vvip-tier-header"><span className="vvip-tier-name">👑 월간 1:1 VVIP</span><span className="vvip-tier-price">1,200,000원/월</span></div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', margin: '8px 0 12px' }}>정원: 3명 제한</p>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>📦 구성</div>
                <ul className="vvip-tier-list">
                  <li>주 1회 1:1 Zoom 세션 (60~90분)</li>
                  <li>무제한 카톡 피드백</li>
                  <li>아이디어 → MVP 구조 설계</li>
                  <li>AI 개발 환경 세팅</li>
                  <li>서비스 출시 전략 동행</li>
                  <li>외주 없이 제작 가능한 구조 설계</li>
                  <li>컨설팅 수강 시 외주 비용 10% 할인</li>
                </ul>
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
            <button type="button" className={`pricing-tab ${pricingTab === 'web' ? 'active' : ''}`} onClick={() => setPricingTab('web')}>🌐 웹사이트</button>
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
            <div className="process-step rv rv-d2"><div className="process-num en">03</div><h3 className="process-step-title">디자인 &amp; 개발</h3><p className="process-step-desc">실시간 피드백 &amp; AI 초고속 빌드</p></div>
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
            <div className="faq-item rv rv-d3"><div className="faq-q">부트캠프는 코딩 경험이 없어도?</div><p className="faq-a">네, 완전 초보자 대상 커리큘럼입니다. AI 도구가 코딩을 도와줍니다.</p></div>
          </div>
        </div>
      </section>

      <section className="sec apply-section" id="apply">
        <div className="container">
          <div className="apply-inner rv">
            <h2 className="apply-title">사이트에서 바로 상담 신청</h2>
            <p className="apply-sub">AI 전략 가능성 진단 폼으로 이동해 간단히 작성해 주시면 빠르게 연락드립니다.</p>
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
          <p className="cta-sub rv rv-d1">앱 외주, 창업 프로덕션, 부트캠프, 컨설팅 — 무엇이든 편하게 상담하세요.</p>
          <div className="hero-btns rv rv-d2" style={{ justifyContent: 'center', gap: 14 }}>
            <Link href="/consultation/" className="btn-primary" style={{ fontSize: 18, padding: '20px 42px' }}>📋 사이트에서 바로 신청</Link>
            <a href={kakaoUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: 16, padding: '18px 36px' }}>💬 카카오톡 상담</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p className="footer-info">
            사업자명: {site?.company || '이터널식스'} <span>|</span> 사업자등록번호: 303-28-65658 <span>|</span> 대표: 성아름 <span>|</span> 주소: 경기도 수원시 영통구 삼성로 186 4층 <span>|</span> 이메일: <a href={`mailto:${site?.email || 'ceo@eternalsix.com'}`} style={{ color: 'var(--text-dim)' }}>{site?.email || 'ceo@eternalsix.com'}</a>
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
