'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function BootcampLanding({ kakaoUrl }) {
  const kakao = kakaoUrl || 'http://pf.kakao.com/_xkxjQxgn';

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('v');
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    document.querySelectorAll('.bp-rv').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const st = document.getElementById('bp-stt');
    if (!st) return;
    const onScroll = () => st.classList.toggle('on', window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="bootcamp-lp">
      <div className="bp-amb">
        <i className="bp-a1" />
        <i className="bp-a2" />
        <i className="bp-a3" />
      </div>

      <section className="bp-hero">
        <div className="bp-w">
          <div className="bp-badge">실화입니다</div>
          <h1>
            문과 학점 <span className="n">2.8</span>
            <br />
            <span className="h">AI</span>만으로
            <br />
            대기업 경력직
            <br />
            <span className="ac">서류 합격한 비결</span>
          </h1>
          <p className="bp-hero-s">
            코딩 1도 모르는 문과생이 AI만으로 앱 6개를 만들고,
            <br />
            대기업 AI 직무 경력직에 서류 합격했습니다.
            <br />
            그 전 과정을 4주 만에 당신도 경험할 수 있습니다.
          </p>
          <div className="bp-hero-a">
            <Link href="/consultation/" className="bp-bt bp-bt-p bp-bt-l">
              무료 상담 신청 →
            </Link>
            <Link href="/" className="bp-bt bp-bt-g bp-bt-l">
              REUMLAB 둘러보기
            </Link>
          </div>
        </div>
      </section>

      <hr className="bp-dv" />

      <section id="spec">
        <div className="bp-w bp-sec">
          <div className="bp-sl bp-rv">MY SPEC</div>
          <h2 className="bp-st bp-rv bp-d1">
            이 스펙으로
            <br />
            <span className="e">대기업에 합격</span>했습니다
          </h2>
          <div className="bp-sp-s bp-rv bp-d2">
            <div className="bp-sp-r">
              <span className="bp-sp-l">전공</span>
              <span className="bp-sp-v">
                <span className="g">경영학과</span> (문과)
              </span>
            </div>
            <div className="bp-sp-r">
              <span className="bp-sp-l">학점</span>
              <span className="bp-sp-v">
                <span className="g">2.8</span> / 4.5
              </span>
            </div>
            <div className="bp-sp-r">
              <span className="bp-sp-l">코딩</span>
              <span className="bp-sp-v">
                <span className="g">1도 모름</span> 오로지 AI로만
              </span>
            </div>
          </div>
          <div className="bp-res bp-rv bp-d3">
            <div className="bp-res-lb">R E S U L T</div>
            <div className="bp-res-t">
              대기업 <span className="ai">AI 직무</span> 경력직
              <br />
              서류 <span className="ps">합격</span>
            </div>
            <div className="bp-res-tg">포트폴리오가 스펙을 이겼다</div>
          </div>
        </div>
      </section>

      <hr className="bp-dv" />

      <section id="did">
        <div className="bp-w bp-sec">
          <div className="bp-sl bp-rv">WHAT I DID</div>
          <h2 className="bp-st bp-rv bp-d1">
            <span className="e">AI</span>로 이걸 다 했습니다
          </h2>
          <div className="bp-sg bp-rv bp-d2">
            <div className="bp-sc">
              <div className="bp-sc-i">📱</div>
              <div className="bp-sc-n">6개</div>
              <div className="bp-sc-d">앱 기획 · 개발 · 배포</div>
            </div>
            <div className="bp-sc">
              <div className="bp-sc-i">🌐</div>
              <div className="bp-sc-n">4개</div>
              <div className="bp-sc-d">웹사이트 디자인 · SEO</div>
            </div>
            <div className="bp-sc">
              <div className="bp-sc-i">⚡</div>
              <div className="bp-sc-n">7일</div>
              <div className="bp-sc-d">MVP 완성 사이클</div>
            </div>
            <div className="bp-sc">
              <div className="bp-sc-i">🤖</div>
              <div className="bp-sc-n">20+</div>
              <div className="bp-sc-d">AI 도구 실무 활용</div>
            </div>
          </div>
          <div className="bp-hw bp-rv bp-d3">
            <div className="bp-hw-lb">HOW?</div>
            <div className="bp-hw-i no">이론 수업 듣고 한 거 아님</div>
            <div className="bp-hw-i no">녹화 강의 본 거 아님</div>
            <div className="bp-hw-i yes">직접 만들면서 전부 익힘</div>
            <p className="bp-hw-n">전부 코딩 비전공자가 AI만으로 만든 결과물</p>
          </div>
          <div className="bp-ls bp-rv bp-d4">
            <Link href="/#app-portfolio" className="bp-bt bp-bt-g bp-bt-m">
              📱 앱 포트폴리오 보기
            </Link>
            <Link href="/#web-portfolio" className="bp-bt bp-bt-g bp-bt-m">
              🌐 웹 포트폴리오 보기
            </Link>
          </div>
        </div>
      </section>

      <hr className="bp-dv" />

      <section id="curriculum">
        <div className="bp-w bp-sec">
          <div className="bp-sl bp-rv">ONLINE GROUP TUTORING</div>
          <h2 className="bp-st bp-rv bp-d1">
            이 과정을 <span className="e">소수에게</span>
            <br />
            직접 보여드립니다
          </h2>
          <div className="bp-cl">
            <div className="bp-wk bp-rv">
              <div className="bp-wk-n">W1</div>
              <div className="bp-wk-t">뭘 만들 건지 정합니다</div>
              <div className="bp-wk-d">아이디어 정리 → 범위 설정 → AI 도구 세팅</div>
            </div>
            <div className="bp-wk bp-rv bp-d1">
              <div className="bp-wk-n">W2</div>
              <div className="bp-wk-t">화면을 만듭니다</div>
              <div className="bp-wk-d">제 화면 보면서 같이 UI 제작 → &quot;이게 되네?&quot;</div>
            </div>
            <div className="bp-wk bp-rv bp-d2">
              <div className="bp-wk-n">W3</div>
              <div className="bp-wk-t">기능을 붙입니다</div>
              <div className="bp-wk-d">로그인 · DB · API 연동 → 막히면 바로 해결</div>
            </div>
            <div className="bp-wk bp-rv bp-d3">
              <div className="bp-wk-n">W4</div>
              <div className="bp-wk-t">완성하고 세상에 내놓습니다</div>
              <div className="bp-wk-d">테스트 → 배포 → 내 이름으로 된 링크 생성</div>
            </div>
          </div>
          <div className="bp-df bp-rv bp-d4">
            <p className="pr">이건 강의가 아닙니다</p>
            <h3>
              대표가 옆에서 <span className="e">같이 만드는</span>
              <br />
              온라인 그룹과외입니다
            </h3>
            <div className="bp-tg">
              <span>대표 직접 진행</span>
              <span>소수정예</span>
              <span>결과물 1개 완성</span>
            </div>
          </div>
        </div>
      </section>

      <hr className="bp-dv" />

      <section id="pricing">
        <div className="bp-w bp-sec">
          <div className="bp-sl bp-rv">PRICING</div>
          <h2 className="bp-st bp-rv bp-d1">
            부트캠프 <span className="e">1기</span> 모집 중
          </h2>
          <div className="bp-pc bp-rv bp-d2">
            <div className="bp-pc-r">
              <span className="bp-pc-lb">💰 1기 얼리버드</span>
            </div>
            <div className="bp-pc-r" style={{ marginBottom: 4 }}>
              <span className="bp-pc-pr">490,000</span>
              <span style={{ fontSize: '1rem', color: 'var(--bp-txt-m)' }}>원</span>
            </div>
            <p className="bp-pc-og">정가 790,000원 (2기부터 인상)</p>
            <p className="bp-pc-nt">제작 동행형 · 대표 직접 진행</p>
            <div className="bp-inc-t">📦 포함 구성</div>
            <ul className="bp-inc">
              <li>4주 실전 과정 (주 1회 라이브 코칭, 90분)</li>
              <li>AI 절대 프롬프트 패키지 제공</li>
              <li>MVP 기획 템플릿 제공</li>
              <li>로그인 · DB · 결제 · 배포 실습</li>
              <li>개인 서비스 1개 완성 목표</li>
              <li>커뮤니티 참여권</li>
              <li>부트캠프 수강자 외주 10% 할인</li>
            </ul>
            <div className="bp-pc-btns">
              <Link href="/consultation/" className="bp-bt bp-bt-p bp-bt-l">
                📋 사이트에서 신청
              </Link>
              <a href={kakao} className="bp-bt bp-bt-k bp-bt-l" target="_blank" rel="noopener noreferrer">
                💬 카카오톡 상담
              </a>
            </div>
          </div>
        </div>
      </section>

      <hr className="bp-dv" />

      <section className="bp-cta-s">
        <div className="bp-w">
          <div className="bp-cta bp-rv">
            <div className="bp-cta-pr">나도 만들어보고 싶다면?</div>
            <h2 className="bp-cta-h">
              코딩 몰라도
              <br />
              <span className="e">4주만에</span> 내 앱 완성
            </h2>
            <div className="bp-cta-sb">소수정예 그룹과외</div>
            <div className="bp-cta-b">
              <Link href="/consultation/" className="bp-bt bp-bt-p bp-bt-l">
                📋 무료 상담 신청 →
              </Link>
              <Link href="/" className="bp-bt bp-bt-g bp-bt-l">
                REUMLAB 보기
              </Link>
            </div>
            <div className="bp-cta-i">
              <span>✔ 상담 무료</span>
              <span>✔ 아이디어 없어도 OK</span>
              <span>✔ 1기 모집중</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="bp-ftr">
        <div className="bp-w">
          <p>
            사업자명: 이터널식스 | 사업자등록번호: 303-28-65658 | 대표: 성아름
            <br />
            주소: 경기도 수원시 영통구 삼성로 186 4층 | 이메일:{' '}
            <a href="mailto:cori@eternalsix.kr">cori@eternalsix.kr</a>
            <br />
            <br />
            © 2026 이터널식스 (REUMLAB). All Rights Reserved.
          </p>
        </div>
      </footer>

      <a href={kakao} className="bp-fab" target="_blank" rel="noopener noreferrer" title="카카오톡 상담">
        💬
      </a>
      <div className="bp-stt" id="bp-stt" onClick={() => window.scrollTo({ top: 0 })} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && window.scrollTo({ top: 0 })}>
        ↑
      </div>
    </div>
  );
}
