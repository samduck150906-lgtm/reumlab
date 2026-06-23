import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/seo';
import { LandingServiceJsonLd } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';

const PAGE_URL = `${SITE.domain}/soho/`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: '소상공인·자영업자 홈페이지 특가 49만원 | 름랩 REUMLAB',
  description:
    '소상공인·자영업자 전용 홈페이지 제작 특가 VAT 포함 49만원. 모바일 반응형, 소스코드 전체 이관, 월 관리비 없음. 수원 거점 · 전국 비대면 상담.',
  keywords: [
    '소상공인 홈페이지',
    '자영업자 홈페이지 제작',
    '소상공인 특가',
    '홈페이지 49만원',
    '저렴한 홈페이지 제작',
    '랜딩페이지 소상공인',
    '수원 홈페이지 제작',
    '저가 홈페이지',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: PAGE_URL,
    siteName: SITE.nameEn,
    title: '소상공인·자영업자 홈페이지 특가 49만원 | 름랩',
    description: '소상공인·자영업자 전용 홈페이지 제작 특가 VAT 포함 49만원. 모바일 반응형, 소스코드 전체 이관.',
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: '소상공인 홈페이지 특가 49만원' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '소상공인·자영업자 홈페이지 특가 49만원 | 름랩',
    description: '소상공인·자영업자 전용 홈페이지 제작 특가 VAT 포함 49만원.',
    images: [SITE.defaultOgImage],
  },
  robots: { index: true, follow: true },
};

const INCLUDES = [
  { icon: '📱', title: '모바일 반응형 완전 지원', desc: '스마트폰·태블릿·PC 화면에서 모두 깔끔하게' },
  { icon: '🔍', title: 'SEO 기본 세팅 포함', desc: '메타 태그·구조화 데이터·사이트맵 기본 적용' },
  { icon: '📦', title: '소스코드 전체 이관', desc: '완료 후 GitHub 저장소 + 소스코드 100% 넘겨드림' },
  { icon: '💸', title: '월 관리비 없음', desc: '호스팅·도메인 비용 외 별도 월정액 없음' },
  { icon: '✏️', title: '직접 수정 교육 1회', desc: '텍스트·이미지·연락처 직접 바꾸는 법 안내' },
  { icon: '🚀', title: '약 14일 납기', desc: '콘텐츠 확정 후 2주 내 오픈 목표' },
];

const FAQS = [
  {
    q: '49만원에 정말 다 포함되나요?',
    a: '네. VAT(부가세) 포함 490,000원입니다. 페이지 제작비·기본 디자인·소스코드 이관·직접 수정 교육 1회가 포함됩니다. 호스팅·도메인은 실비로 별도이며 월 1~2만원 수준입니다.',
  },
  {
    q: '어떤 업종에 적합한가요?',
    a: '음식점, 카페, 미용실, 학원, 필라테스·PT·운동시설, 공방, 네일·뷰티, 인테리어, 소규모 쇼핑몰 등 단일 브랜드를 운영하는 자영업자·소상공인에게 적합합니다.',
  },
  {
    q: '기존 블로그나 스마트스토어와 연결할 수 있나요?',
    a: '네, 네이버 블로그·인스타그램·카카오채널·스마트스토어 링크를 홈페이지에 삽입할 수 있습니다. 별도 연동 개발이 필요한 기능(예약 시스템, 결제)은 추가 견적이 발생할 수 있습니다.',
  },
  {
    q: '직접 내용을 수정할 수 있나요?',
    a: '소스코드를 이관받으신 후 AI 도구(Cursor 등)를 사용해 텍스트·이미지·전화번호 등 간단한 수정이 가능합니다. 오픈 후 1회 직접 수정 교육을 제공합니다.',
  },
  {
    q: '수원 외 지역도 가능한가요?',
    a: '전국 비대면 상담으로 진행합니다. 수원·화성·동탄·용인·서울 고객분들은 사무실(수원 인계동) 대면 상담도 가능합니다.',
  },
];

export default function SohoPage() {
  return (
    <>
      <LandingServiceJsonLd
        name="소상공인·자영업자 홈페이지 특가 제작"
        description="소상공인·자영업자 전용 홈페이지 제작 특가 VAT 포함 49만원. 모바일 반응형, 소스코드 전체 이관, 월 관리비 없음."
        url={PAGE_URL}
        crumbs={[
          { name: '홈', url: `${SITE.domain}/` },
          { name: '소상공인 특가', url: PAGE_URL },
        ]}
      />

      <main className="seo-landing">
        {/* ── HERO ── */}
        <section className="hero" style={{ minHeight: 'auto', padding: '120px 0 64px' }}>
          <div className="container">
            <nav
              className="seo-breadcrumb"
              aria-label="breadcrumb"
              style={{ marginBottom: 24, fontSize: 14, color: 'var(--text-dim)' }}
            >
              <Link href="/">홈</Link>
              <span style={{ margin: '0 8px' }}>/</span>
              <span>소상공인·자영업자 특가</span>
            </nav>

            <p className="sec-label">SPECIAL PRICE</p>
            <h1
              className="hero-title"
              style={{ fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.2, marginBottom: 16 }}
            >
              소상공인·자영업자<br />
              홈페이지 특가{' '}
              <span className="gradient-text">49만원</span>
            </h1>
            <p className="hero-sub" style={{ maxWidth: 640, marginBottom: 12 }}>
              VAT 포함 490,000원 · 모바일 반응형 · 소스코드 전체 이관 · 월 관리비 없음
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-dim)', marginBottom: 32 }}>
              음식점·카페·학원·뷰티·운동시설 등 단일 브랜드를 운영하는 자영업자를 위한 전용 패키지입니다.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 36 }}>
              {['소상공인 전용', 'VAT 포함 49만원', '14일 납기', '소스코드 이관', '월 관리비 없음'].map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    background: 'rgba(58,140,92,.12)',
                    color: 'var(--green)',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="hero-btns" style={{ flexWrap: 'wrap' }}>
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_soho_phone">
                📞 {SITE.phone} 전화 상담
              </a>
              <a href={`mailto:${SITE.email}`} className="btn-secondary" data-analytics="cta_soho_email">
                ✉️ 이메일 문의
              </a>
            </div>
          </div>
        </section>

        {/* ── 가격 박스 ── */}
        <section className="sec sec-warm" style={{ padding: '72px 0' }}>
          <div className="container" style={{ maxWidth: 800 }}>
            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: 24,
                padding: 'clamp(28px, 5vw, 48px)',
                boxShadow: '0 8px 40px rgba(58,140,92,0.10)',
                border: '1.5px solid var(--border)',
                textAlign: 'center',
              }}
            >
              <p className="sec-label" style={{ justifyContent: 'center' }}>소상공인 특가 패키지</p>
              <div style={{ fontSize: 'clamp(52px, 10vw, 80px)', fontWeight: 900, color: 'var(--green)', lineHeight: 1, margin: '16px 0 8px' }}>
                49만원
              </div>
              <p style={{ color: 'var(--text-dim)', fontSize: 15, marginBottom: 28 }}>VAT 포함 · 1회성 · 호스팅·도메인 별도</p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 16,
                  marginBottom: 32,
                  textAlign: 'left',
                }}
              >
                {INCLUDES.map((item) => (
                  <div
                    key={item.title}
                    style={{
                      padding: '18px 20px',
                      background: 'var(--bg-warm)',
                      borderRadius: 14,
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                    <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{item.title}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.55 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
              <a href={SITE.phoneHref} className="btn-primary" style={{ fontSize: 17 }} data-analytics="cta_soho_price_phone">
                지금 바로 상담 신청 · {SITE.phone}
              </a>
            </div>
          </div>
        </section>

        {/* ── 왜 름랩인가 ── */}
        <section className="sec sec-cream" style={{ padding: '72px 0' }}>
          <div className="container" style={{ maxWidth: 800 }}>
            <h2
              className="sec-title"
              style={{ fontSize: 'clamp(22px, 3vw, 30px)', marginBottom: 12 }}
            >
              왜 름랩 소상공인 패키지인가요?
            </h2>
            <p style={{ color: 'var(--text-sub)', marginBottom: 32, lineHeight: 1.8 }}>
              외주 제작 후 수정 한 번에 몇 만원씩 청구되거나, 월 관리비가 계속 나가는 구조는 소상공인에게 부담입니다.
              름랩은 1회 제작비만 받고, 소스코드를 통째로 넘깁니다. 이후 수정은 AI 도구로 직접 하실 수 있습니다.
            </p>
            <ul className="svc-list">
              <li>대형 에이전시처럼 팀 영업 없이 — 대표 1인이 직접 소통</li>
              <li>추가 비용 청구 없는 투명한 1회성 계약</li>
              <li>소스코드 이관으로 외주사 종속 없음</li>
              <li>사업자: {SITE.company} · 대표: {SITE.representative} · {SITE.phone}</li>
            </ul>

            <div
              style={{
                marginTop: 36,
                padding: '20px 24px',
                background: 'rgba(58,140,92,0.07)',
                borderRadius: 14,
                borderLeft: '3px solid var(--green)',
              }}
            >
              <p style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 6 }}>관련 글</p>
              <Link
                href="/blog/homepage-jejak-biyong/"
                style={{ fontWeight: 600, textDecoration: 'none', color: 'var(--text)' }}
              >
                홈페이지 제작 비용 총정리 (2026) →
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="sec sec-warm" style={{ padding: '72px 0' }}>
          <div className="container" style={{ maxWidth: 800 }}>
            <h2 className="sec-title" style={{ fontSize: 'clamp(22px, 3vw, 30px)', marginBottom: 32 }}>
              자주 묻는 질문
            </h2>
            <dl style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {FAQS.map((faq) => (
                <div
                  key={faq.q}
                  style={{
                    padding: '22px 24px',
                    background: 'var(--bg-card)',
                    borderRadius: 16,
                    border: '1px solid var(--border)',
                  }}
                >
                  <dt style={{ fontWeight: 700, fontSize: 16, marginBottom: 10, color: 'var(--text)' }}>
                    Q. {faq.q}
                  </dt>
                  <dd style={{ color: 'var(--text-sub)', lineHeight: 1.75, fontSize: 15 }}>
                    {faq.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── 최종 CTA ── */}
        <section className="sec" style={{ padding: '72px 0', textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: 640 }}>
            <h2 className="sec-title" style={{ fontSize: 'clamp(22px, 3vw, 30px)', marginBottom: 16 }}>
              지금 바로 상담하세요
            </h2>
            <p style={{ color: 'var(--text-sub)', marginBottom: 32, lineHeight: 1.8 }}>
              견적·일정 문의는 전화 또는 이메일로 연결해 드립니다.<br />
              수원 대면 상담 · 전국 비대면 상담 모두 가능합니다.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
              <a href={SITE.phoneHref} className="btn-primary" data-analytics="cta_soho_bottom_phone">
                📞 {SITE.phone} 전화 상담
              </a>
              <a href={`mailto:${SITE.email}`} className="btn-secondary" data-analytics="cta_soho_bottom_email">
                ✉️ 이메일 문의
              </a>
            </div>
            <p style={{ marginTop: 24, fontSize: 13, color: 'var(--text-dim)' }}>
              <Link href="/">← 름랩 메인으로</Link>
              {'  ·  '}
              <Link href="/blog/homepage-jejak-biyong/">홈페이지 제작 비용 글 보기</Link>
            </p>
          </div>
        </section>
      </main>

      <BusinessFooter />
    </>
  );
}
