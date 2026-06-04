'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function HomePage({ site }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pricingTab, setPricingTab] = useState('app');
  const [navScrolled, setNavScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const leafContainerRef = useRef(null);

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
                  <li>로그인 / 회원가입</li><li>데이터베이스 설계</li><li>핵심 기능 1~3개 개발</li><li>기본 UI 제작</li><li>결제 연동</li><li>도메인 연결 &amp; 배포</li><li>2회 수정 포함</li>
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
            <p className="apply-alt">바로 상담을 원하시면 · <a href="tel:01081119370">전화 010-8111-9370</a></p>
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
            <a href="tel:01081119370" className="btn-secondary" style={{ fontSize: 16, padding: '18px 36px' }}>📞 전화 상담</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p className="footer-info">
            {site?.company || '앱·웹개발 스튜디오 름랩'} <span>|</span> 대표자: 성아름 <span>|</span> 사업자등록번호: 793-12-03247
            <br />
            연락처: 010-8111-9370
            <br />
            주소: 경기도 수원시 팔달구 인계로124번길 19, 12층 1208호(인계동) <span>|</span> 이메일:{' '}
            <a href="mailto:ceo@eternalsix.com" style={{ color: 'var(--text-dim)' }}>ceo@eternalsix.com</a>
          </p>
        </div>
      </footer>

      <div className="float-btns">
        <a href="tel:01081119370" className="float-btn float-call" title="전화 상담">📞</a>
        <button type="button" className={`float-btn float-top ${showScrollTop ? 'show' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} title="맨 위로">↑</button>
      </div>
    </>
  );
}
