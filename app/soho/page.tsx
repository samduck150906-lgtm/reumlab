import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/seo';
import { LandingServiceJsonLd, FAQPageJsonLd } from '@/components/JsonLd';
import BusinessFooter from '@/components/BusinessFooter';
import './soho.css';

const PAGE_URL = `${SITE.domain}/soho/`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: '검색 노출되는 소상공인 홈페이지 제작 49만원 | 름랩 REUMLAB',
  description:
    '광고비 0원으로도 손님이 스스로 찾아오는 검색 최적화 홈페이지. 소상공인·자영업자 전용 49만원부터, 검색 노출 설계 포함 마케팅 패키지 98만원. 소스코드 전체 이관·월 관리비 없음. 수원 거점 · 전국 비대면 상담.',
  keywords: [
    '소상공인 홈페이지',
    '자영업자 홈페이지 제작',
    '검색 노출 홈페이지',
    '검색 최적화 홈페이지',
    '소상공인 특가',
    '홈페이지 49만원',
    '지역 검색 노출',
    '저렴한 홈페이지 제작',
    '랜딩페이지 소상공인',
    '수원 홈페이지 제작',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: PAGE_URL,
    siteName: SITE.nameEn,
    title: '검색 노출되는 소상공인 홈페이지 제작 49만원 | 름랩',
    description:
      '광고비 0원으로도 손님이 먼저 찾아오는 검색 최적화 홈페이지. 49만원부터 · 소스코드 전체 이관 · 월 관리비 없음.',
    images: [{ url: SITE.defaultOgImage, width: 1200, height: 630, alt: '검색 노출 소상공인 홈페이지 49만원' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '검색 노출되는 소상공인 홈페이지 제작 49만원 | 름랩',
    description: '광고비 0원으로도 손님이 먼저 찾아오는 검색 최적화 홈페이지. 49만원부터.',
    images: [SITE.defaultOgImage],
  },
  robots: { index: true, follow: true },
};

const FEATURES = [
  {
    no: '강점 01',
    title: '강력한 검색 노출 설계',
    desc: '네이버·구글·AI 검색까지 고려한 구조로, 손님이 쓰는 키워드 조합에 내 업장이 먼저 노출되도록 설계합니다.',
  },
  {
    no: '강점 02',
    title: '쉬운 소통',
    desc: '어려운 개발 용어 없이 사장님의 언어로 설명합니다. 모르는 단어를 외울 필요가 없습니다.',
  },
  {
    no: '강점 03',
    title: '간편한 수정·관리',
    desc: '제작 후에도 AI 도구로 직접 수정이 가능해 운영 부담이 적습니다. 수정마다 비용이 청구되지 않습니다.',
  },
  {
    no: '강점 04',
    title: '합리적 가격',
    desc: '검색 경쟁력은 갖추되 비용은 낮춥니다. 1회성 제작비만, 숨은 월정액 없이 투명하게.',
  },
];

const INCLUDES = [
  { icon: '📱', title: '모바일 반응형 완전 지원', desc: '스마트폰·태블릿·PC에서 모두 깔끔하게' },
  { icon: '🔍', title: '검색 노출 기본 세팅', desc: '메타 태그·구조화 데이터·사이트맵 기본 적용' },
  { icon: '📦', title: '소스코드 전체 이관', desc: '완료 후 GitHub 저장소 + 소스코드 100% 이관' },
  { icon: '💸', title: '월 관리비 없음', desc: '호스팅·도메인 외 별도 월정액 없음' },
  { icon: '✏️', title: '직접 수정 교육 1회', desc: '텍스트·이미지·연락처 바꾸는 법 안내' },
  { icon: '🚀', title: '약 14일 납기', desc: '콘텐츠 확정 후 2주 내 오픈 목표' },
];

const FAQS = [
  {
    q: '49만원에 정말 다 포함되나요?',
    a: '490,000원입니다. 페이지 제작비·기본 디자인·검색 노출 기본 세팅·소스코드 이관·직접 수정 교육 1회가 포함됩니다. 호스팅·도메인은 실비로 별도이며 월 1~2만원 수준입니다.',
  },
  {
    q: '98만원 마케팅 패키지는 무엇이 다른가요?',
    a: '기본 49만원 홈페이지에 더해, 지역·업종·분위기·가격 등 손님이 실제로 검색하는 키워드 조합을 분석해 검색 노출을 적극적으로 설계해 드립니다. 광고비 없이도 검색으로 손님이 찾아오는 구조를 한 번에 갖추고 싶은 분께 적합합니다.',
  },
  {
    q: '어떤 업종에 적합한가요?',
    a: '음식점, 카페, 미용실, 학원, 필라테스·PT·운동시설, 인테리어, 네일·뷰티, 공방, 소규모 쇼핑몰 등 단일 브랜드를 운영하는 자영업자·소상공인에게 적합합니다.',
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

const SearchIcon = () => (
  <svg className="s-search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const QIcon = () => (
  <svg className="s-qico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default function SohoPage() {
  return (
    <>
      <LandingServiceJsonLd
        name="검색 노출되는 소상공인·자영업자 홈페이지 제작"
        description="광고비 0원으로도 손님이 스스로 찾아오는 검색 최적화 홈페이지. 소상공인·자영업자 전용 49만원부터, 검색 노출 설계 포함 마케팅 패키지 98만원. 소스코드 전체 이관·월 관리비 없음."
        url={PAGE_URL}
        crumbs={[
          { name: '홈', url: `${SITE.domain}/` },
          { name: '소상공인 특가', url: PAGE_URL },
        ]}
      />
      <FAQPageJsonLd items={FAQS.map((f) => ({ q: f.q, a: f.a }))} />

      <main className="soho">
        {/* ── HERO ── */}
        <section className="s-sec s-hero t-dark acc-green">
          <div className="s-wrap">
            <nav className="s-crumb" aria-label="breadcrumb">
              <Link href="/">홈</Link>
              <span style={{ margin: '0 8px' }}>/</span>
              <span>소상공인·자영업자 특가</span>
            </nav>

            <p className="s-brand">REUMLAB</p>
            <h1 className="s-h s-hero-h">
              언제까지 광고로만<br />
              <span className="s-g">손님을 데려오실</span> 건가요?
            </h1>
            <p className="s-lead">
              광고비 0원으로도 손님이 스스로 찾아오는 구조,<br />
              검색 최적화 홈페이지에서 시작됩니다.
            </p>

            <div className="s-search" aria-hidden="true">
              <SearchIcon />
              <span className="s-search-txt">
                수원 인테리어 업체<span className="s-cursor" />
              </span>
            </div>

            <div className="s-chips">
              {['소상공인 전용', '49만원 특가', '검색 노출 설계', '소스코드 이관', '월 관리비 없음'].map((t) => (
                <span key={t} className="s-chip">{t}</span>
              ))}
            </div>

            <div className="s-btns">
              <a href={SITE.phoneHref} className="s-btn s-btn-main" data-analytics="cta_soho_hero_phone">
                📞 내 업장 맞춤 상담받기
              </a>
              <a href={`mailto:${SITE.email}`} className="s-btn s-btn-ghost" data-analytics="cta_soho_hero_email">
                ✉️ 이메일 문의
              </a>
            </div>
          </div>
        </section>

        {/* ── 검색에 안 보이는 업장 ── */}
        <section className="s-sec t-ink2 acc-coral">
          <div className="s-wrap">
            <p className="s-label">VISIBILITY</p>
            <h2 className="s-h">
              검색에 안 보이는 업장은<br />
              <span className="s-g">간판 없는 업장</span>입니다
            </h2>
            <p className="s-lead">아무리 잘 만들어도, 안 보이면 없는 것과 같습니다.</p>

            <div className="s-ranks">
              {[
                { no: '1위', w: '88%', name: '경쟁 업장 A' },
                { no: '2위', w: '72%', name: '경쟁 업장 B' },
                { no: '3위', w: '58%', name: '경쟁 업장 C' },
              ].map((r) => (
                <div className="s-rank" key={r.no}>
                  <span className="s-rank-no">{r.no}</span>
                  <span className="s-rank-bar"><span style={{ width: r.w }} /></span>
                  <span className="s-rank-name">{r.name}</span>
                </div>
              ))}
              <div className="s-dots">· · ·</div>
              <div className="s-rank is-us">
                <span className="s-rank-no">48위</span>
                <span className="s-rank-bar"><span style={{ width: '10%' }} /></span>
                <span className="s-rank-name">우리 업장</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 모든 검색어에 광고를 걸 수는 없습니다 ── */}
        <section className="s-sec t-light">
          <div className="s-wrap">
            <p className="s-label">SEARCH BEHAVIOR</p>
            <h2 className="s-h">
              손님의 <span className="s-g">모든 검색어</span>에<br />
              광고를 걸 수는 없습니다
            </h2>
            <p className="s-lead">손님은 업종, 지역, 분위기, 가격 등 다양한 조합으로 검색을 합니다.</p>

            <div className="s-queries">
              <div className="s-query is-dim"><QIcon />“○○카페”라고 검색</div>
              <div className="s-query"><QIcon />“강남 분위기 좋은 카페”</div>
              <div className="s-query"><QIcon />“가성비 좋은 강남 카페”</div>
            </div>
          </div>
        </section>

        {/* ── 키워드 조합으로 노출 ── */}
        <section className="s-sec t-dark acc-teal">
          <div className="s-wrap">
            <p className="s-label">KEYWORD STRATEGY</p>
            <h2 className="s-h">
              검색 키워드 조합으로<br />
              <span className="s-g">노출 범위를 넓힙니다</span>
            </h2>
            <p className="s-lead">어떤 상황에서도 내 업장이 먼저 노출됩니다.</p>

            <div className="s-combo">
              <div className="s-combo-col">
                <h4>지역</h4>
                <p>관악구<br />은평구</p>
              </div>
              <div className="s-combo-x">×</div>
              <div className="s-combo-col">
                <h4>분야</h4>
                <p>인테리어<br />데코타일</p>
              </div>
              <div className="s-combo-x">×</div>
              <div className="s-combo-col is-out">
                <h4>의도</h4>
                <p>견적<br />업체</p>
              </div>
            </div>

            <div className="s-up">
              <div className="s-up-row">
                <span className="s-up-tag">AI 검색</span>
                <span className="s-up-desc">챗봇이 추천하는 업장으로 — 손님이 많이 묻는 곳</span>
                <span className="s-up-badge">↑ UP</span>
              </div>
              <div className="s-up-row">
                <span className="s-up-tag">구글·네이버</span>
                <span className="s-up-desc">지역 업종 검색 노출 선정 — 신규 유입을 끌어오는 곳</span>
                <span className="s-up-badge">↑ UP</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 24시간 일하는 영업사원 (그라데이션 배너) ── */}
        <section className="s-sec s-band t-band">
          <div className="s-wrap">
            <span className="s-band-badge">24/7 ALWAYS ON</span>
            <h2 className="s-h">
              <span className="s-nowrap">홈페이지는 한 번 쓰는 비용이 아니라</span><br />
              <span className="s-g">24시간 일하는 영업사원</span>입니다
            </h2>
            <p className="s-lead">잘 만든 홈페이지는, 사장님이 자는 동안에도 손님을 데려옵니다.</p>
          </div>
        </section>

        {/* ── 사장님의 말로 ── */}
        <section className="s-sec t-light2">
          <div className="s-wrap">
            <p className="s-label">EASY COMMUNICATION</p>
            <h2 className="s-h">
              개발 용어 대신,<br />
              <span className="s-g">사장님의 말로</span>
            </h2>
            <p className="s-lead">모르는 단어를 외울 필요가 없습니다.</p>

            <div className="s-chat">
              <div className="s-bubble left">“반응형이요? 도메인이요…?”</div>
              <div className="s-bubble right">“휴대폰에서도 잘 보이게 하고, 가게 주소처럼 쓰는 인터넷 주소예요.”</div>
              <div className="s-bubble left">“수정은 제가 못 하는데…”</div>
              <div className="s-bubble right">“사진 한 장 바꾸듯 쉽게 고치실 수 있어요.”</div>
            </div>
          </div>
        </section>

        {/* ── 4 강점 ── */}
        <section className="s-sec t-dark">
          <div className="s-wrap">
            <p className="s-label">WHY REUMLAB</p>
            <h2 className="s-h">
              름랩은 업장 특성에 맞는<br />
              <span className="s-g">홈페이지</span>를 만듭니다
            </h2>
            <div className="s-grid">
              {FEATURES.map((f) => (
                <div className="s-feat" key={f.no}>
                  <div className="s-feat-no">{f.no}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 가격 ── */}
        <section className="s-sec t-ink2 acc-gold" id="price">
          <div className="s-wrap">
            <p className="s-label">TRANSPARENT PRICE</p>
            <h2 className="s-h">
              필요한 만큼만,<br />
              숨은 비용 없는 <span className="s-g">투명한 가격</span>
            </h2>

            <div className="s-prices">
              <div className="s-price">
                <span className="s-price-tag">기본</span>
                <h3>홈페이지 제작</h3>
                <p className="s-price-sub">검색에 잘 잡히는 기본 웹사이트</p>
                <div className="s-price-amt">
                  <span className="s-price-was">50만원</span>
                  <span className="s-price-now">49<small>만원</small></span>
                </div>
                <p className="s-price-note">1회성 · 호스팅·도메인 별도</p>
              </div>

              <div className="s-price is-feature">
                <span className="s-price-tag">마케팅 패키지</span>
                <h3>홈페이지 + 검색 노출 설계</h3>
                <p className="s-price-sub">네이버·구글·AI 검색까지 함께</p>
                <div className="s-price-amt">
                  <span className="s-price-was">100만원</span>
                  <span className="s-price-now">98<small>만원</small></span>
                </div>
                <p className="s-price-note">기본 대비 +49만원으로 노출까지 한 번에</p>
              </div>
            </div>

            <div className="s-incl">
              {INCLUDES.map((it) => (
                <div className="s-incl-item" key={it.title}>
                  <span className="s-incl-ico">{it.icon}</span>
                  <div>
                    <b>{it.title}</b>
                    <span>{it.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="s-btns" style={{ marginTop: 32 }}>
              <a href={SITE.phoneHref} className="s-btn s-btn-main" data-analytics="cta_soho_price_phone">
                📞 {SITE.phone} 상담 신청
              </a>
              <a href={`mailto:${SITE.email}`} className="s-btn s-btn-ghost" data-analytics="cta_soho_price_email">
                ✉️ 이메일 문의
              </a>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="s-sec t-light">
          <div className="s-wrap">
            <p className="s-label">FAQ</p>
            <h2 className="s-h">자주 묻는 질문</h2>
            <div className="s-faq">
              {FAQS.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <div className="s-faq-a">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── 최종 CTA ── */}
        <section className="s-sec s-final t-band">
          <div className="s-wrap">
            <p className="s-cap">고민만 하기엔, 손님은 지금도 검색 중입니다</p>
            <h2 className="s-h">
              이제는 <span className="s-g">손님이 먼저 찾는</span><br />
              업장을 만드세요
            </h2>
            <div className="s-btns">
              <a href={SITE.phoneHref} className="s-btn s-btn-main" data-analytics="cta_soho_bottom_phone">
                📞 내 업장 맞춤 상담받기
              </a>
              <a href={`mailto:${SITE.email}`} className="s-btn s-btn-ghost" data-analytics="cta_soho_bottom_email">
                ✉️ 이메일 문의
              </a>
            </div>
            <p className="s-final-foot">
              REUMLAB — 내 업장 홈페이지 제작은 름랩
              <br />
              <Link href="/">← 름랩 메인으로</Link>
            </p>
          </div>
        </section>
      </main>

      <BusinessFooter />
    </>
  );
}
