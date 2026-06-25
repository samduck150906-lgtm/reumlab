// 색인(랜딩) 페이지 콘텐츠 차별화 엔진
// serviceKey × intentKey 조합으로 페이지마다 실질적으로 다른 본문을 생성한다.

const PRICING = {
  app: {
    note: '표시 금액은 시작가(VAT 별도)이며, 기능 범위에 따라 견적이 조정됩니다.',
    tiers: [
      { tier: '개발 외주 패키지', price: '300만원~', period: '약 7~10일', features: ['로그인 / 회원가입', '데이터베이스 설계', '핵심 기능 1~3개', '기본 UI · 결제 연동', '도메인 연결 & 배포'] },
      { tier: 'Standard', price: '490만원~', period: '3~5주', featured: true, features: ['풀 기능 + 맞춤 UI/UX', '소셜 로그인 + 결제', '관리자 대시보드', '유지보수 1개월'] },
      { tier: 'Enterprise', price: '별도 협의', period: '협의', features: ['웹 + 앱 복합 플랫폼', '대용량 아키텍처', '외부 API 다중 연동', '장기 유지보수'] },
    ],
  },
  web: {
    note: '표시 금액은 시작가(VAT 별도)이며, 페이지 수·기능에 따라 조정됩니다.',
    tiers: [
      { tier: 'Basic', price: '99만원~', period: '약 7일', features: ['원페이지 랜딩', '반응형 디자인', '기본 SEO', '수정 2회 + 호스팅 1년'] },
      { tier: 'Standard', price: '199만원~', period: '10~14일', featured: true, features: ['멀티페이지(약 5P)', '맞춤 UI/UX', '고급 SEO + 애널리틱스', '수정 5회 + 유지보수 1개월'] },
      { tier: 'Premium', price: '399만원~', period: '협의', features: ['풀커스텀 디자인 + 기능', '결제 / 예약 시스템', '관리자 페이지 + API', '수정 무제한 + 유지보수 3개월'] },
    ],
  },
  plan: {
    note: '아이디어 단계부터 함께 정리합니다. 범위에 따라 견적이 달라집니다.',
    tiers: [
      { tier: '기획 · MVP 스타트', price: '300만원~', period: '2~4주', featured: true, features: ['핵심 가설 · 기능 정의', '프로토타입 제작', 'MVP 개발', '핵심 지표 세팅'] },
      { tier: 'Growth', price: '별도 협의', period: '협의', features: ['사용자 검증 · 개선', '기능 확장', '데이터 분석', '지속 운영 지원'] },
    ],
  },
};

const PROCESS_DEFAULT = [
  { step: '01', title: '무료 상담', desc: '전화·이메일로 아이디어와 요구사항을 편하게 말씀해 주세요.' },
  { step: '02', title: '기획 & 견적', desc: '필요 기능을 정리해 일정과 견적을 투명하게 제안드립니다.' },
  { step: '03', title: '디자인 & 개발', desc: '단계별로 결과를 공유하며 피드백을 바로 반영합니다.' },
  { step: '04', title: '검수 & 이관', desc: '검수 후 배포하고 소스코드 전체와 운영법을 넘겨드립니다.' },
];

// ── 서비스 프로필(그룹) ──
const GROUPS = {
  app: {
    pricing: 'app',
    intro:
      '아이디어나 매장 운영을 모바일 앱으로 확장합니다. iOS·Android를 동시에 커버하는 크로스플랫폼(Flutter/React Native)으로 개발 기간과 비용을 줄이고, 회원·결제·푸시 같은 핵심 기능을 안정적으로 구현합니다. 완성 후에는 소스코드와 스토어 권한을 통째로 넘겨드려 외주사에 묶이지 않습니다.',
    deliverables: [
      { t: 'iOS · Android 동시 출시', d: '하나의 코드베이스로 두 플랫폼을 함께 개발합니다.' },
      { t: '회원 · 소셜 로그인 · 푸시', d: '가입부터 알림까지 사용자 기반 기능을 구축합니다.' },
      { t: '결제 · 구독 연동', d: 'PG·인앱결제·정기결제를 안전하게 연동합니다.' },
      { t: '관리자 대시보드', d: '데이터·회원·매출을 한눈에 보는 운영 도구.' },
      { t: '스토어 등록 · 배포', d: '앱스토어·플레이스토어 심사 등록까지 지원.' },
      { t: '소스코드 전체 이관', d: '완료 후 GitHub 저장소와 권한을 100% 이관.' },
    ],
    audience: ['아이디어를 빠르게 검증하려는 초기 창업자·스타트업', '오프라인 매장을 앱으로 확장하려는 사업자', '기존 서비스의 기능을 고도화하려는 팀'],
    faqs: [
      { q: '기획서가 없어도 앱 개발을 맡길 수 있나요?', a: '가능합니다. 아이디어와 꼭 필요한 기능 한두 가지만 있어도 기획부터 함께 정리해 진행합니다.' },
      { q: '안드로이드와 아이폰을 따로 만들어야 하나요?', a: '아니요. 크로스플랫폼으로 한 번에 개발해 두 플랫폼에 동시 출시하므로 비용·기간이 절약됩니다.' },
    ],
  },
  web: {
    pricing: 'web',
    intro:
      '브랜드와 서비스에 맞는 웹사이트를 기획·디자인·개발까지 한 번에 제작합니다. PC·모바일·태블릿 어디서나 깔끔한 반응형, 검색에 잘 잡히는 SEO 기본 세팅, 문의·예약 연결까지 포함합니다. 제작 후 소스코드를 이관하고 직접 수정하는 법까지 알려드려 월 관리비 부담이 없습니다.',
    deliverables: [
      { t: '반응형 디자인', d: 'PC·모바일·태블릿에서 모두 최적화되어 보입니다.' },
      { t: '기획 · 디자인 · 퍼블리싱', d: '구조 설계부터 맞춤 디자인까지 한 팀에서.' },
      { t: '문의 · 예약 · 지도 연결', d: '전화·문의 폼·예약·길찾기를 바로 연결합니다.' },
      { t: 'SEO 기본 세팅', d: '메타 태그·구조화 데이터·사이트맵 기본 적용.' },
      { t: '소스코드 이관', d: '완료 후 소스코드 전체를 넘겨드립니다.' },
      { t: '직접 수정 교육 1회', d: '텍스트·이미지·연락처를 직접 바꾸는 법 안내.' },
    ],
    audience: ['브랜드·기업 공식 사이트가 필요한 곳', '소상공인·자영업자 단일 매장', '병원·학원·전문 서비스 등 신뢰가 중요한 업종'],
    faqs: [
      { q: '제작 후 직접 수정할 수 있나요?', a: '네. 소스코드를 이관받은 뒤 AI 도구로 텍스트·이미지 등 간단한 수정을 직접 하실 수 있고, 1회 교육을 제공합니다.' },
      { q: '월 관리비가 따로 드나요?', a: '없습니다. 호스팅·도메인 실비 외 별도 월정액은 받지 않습니다.' },
    ],
  },
  landing: {
    pricing: 'web',
    intro:
      '광고·캠페인의 전환을 끌어올리는 랜딩페이지를 제작합니다. 한 화면에서 메시지가 또렷하게 흐르도록 카피·디자인·CTA를 설계하고, 광고 픽셀과 전환 추적까지 붙여 성과를 측정할 수 있게 만듭니다. 빠르면 약 7일 안에 오픈합니다.',
    deliverables: [
      { t: '전환 최적화 원페이지', d: '스크롤 흐름과 CTA 배치를 전환 기준으로 설계.' },
      { t: '카피 · 디자인 · CTA', d: '메시지·후킹·행동 유도를 함께 다듬습니다.' },
      { t: '광고 픽셀 · 전환 추적', d: 'GA4·메타·구글 광고 전환 이벤트를 연동.' },
      { t: 'A/B 테스트 가능한 구조', d: '문구·이미지를 바꿔 성과를 비교하기 쉽게.' },
      { t: '빠른 납기', d: '콘텐츠 확정 후 약 7일 내 오픈 목표.' },
      { t: '소스코드 이관', d: '완료 후 소스코드 전체를 넘겨드립니다.' },
    ],
    audience: ['광고를 돌리는데 전환이 낮은 사업자', '신제품·이벤트 캠페인을 준비하는 팀', '문의·예약 수를 늘리고 싶은 매장'],
    faqs: [
      { q: '광고 전환 추적도 붙여 주나요?', a: '네. GA4·메타 픽셀·구글 광고 전환 이벤트를 함께 세팅해 성과를 측정할 수 있게 만듭니다.' },
      { q: '얼마나 빨리 오픈할 수 있나요?', a: '콘텐츠가 준비되면 약 7일 내 오픈을 목표로 진행합니다.' },
    ],
  },
  shop: {
    pricing: 'web',
    intro:
      '상품 등록부터 결제·배송·정산까지 운영 가능한 쇼핑몰을 구축합니다. 장바구니·주문·회원·리뷰 등 커머스 핵심 기능과 관리자 도구를 갖추고, 스마트스토어 등 외부 채널과도 연결할 수 있습니다.',
    deliverables: [
      { t: '상품 · 카테고리 · 장바구니', d: '검색·필터·옵션까지 커머스 기본기를 구현.' },
      { t: 'PG 결제 · 배송 · 쿠폰', d: '결제부터 배송·할인 정책까지 운영 가능하게.' },
      { t: '회원 · 등급 · 리뷰', d: '단골을 만드는 회원·리워드·후기 기능.' },
      { t: '관리자(상품/주문/정산)', d: '재고·주문·매출을 한 곳에서 관리.' },
      { t: '외부 채널 연동', d: '스마트스토어 등 판매 채널과 연결.' },
      { t: '소스코드 이관', d: '완료 후 소스코드 전체를 넘겨드립니다.' },
    ],
    audience: ['자사몰을 처음 시작하는 브랜드', '스마트스토어를 넘어 확장하려는 셀러', '정기구독·멤버십 커머스를 준비하는 팀'],
    faqs: [
      { q: '스마트스토어와 연동할 수 있나요?', a: '네. 외부 판매 채널과 연결하거나 링크를 삽입할 수 있고, 필요한 연동 범위는 상담 시 안내드립니다.' },
      { q: '결제 연동도 포함되나요?', a: '국내 PG 결제 연동을 포함해 실제 판매가 가능한 형태로 구축합니다.' },
    ],
  },
  mvp: {
    pricing: 'plan',
    intro:
      '아이디어를 가장 빠르고 저렴하게 시장에서 검증하도록 MVP를 만듭니다. 꼭 필요한 핵심 기능만 추려 먼저 출시하고, 사용자 반응과 지표를 보며 다음 단계를 결정합니다. 투자·피칭용 데모로도 활용할 수 있습니다.',
    deliverables: [
      { t: '핵심 가설 · 기능 정의', d: '무엇을 검증할지부터 범위를 좁혀 잡습니다.' },
      { t: '프로토타입 · MVP 개발', d: '핵심 흐름만 빠르게 동작하도록 구현.' },
      { t: '사용자 검증 · 지표 세팅', d: '핵심 지표를 심어 반응을 측정합니다.' },
      { t: '확장 가능한 아키텍처', d: '검증 후 키울 수 있게 기반을 설계.' },
      { t: '투자 · 피칭용 데모', d: '보여줄 수 있는 형태로 정리해 드립니다.' },
      { t: '소스코드 이관', d: '완료 후 소스코드 전체를 넘겨드립니다.' },
    ],
    audience: ['아이디어 검증이 먼저인 초기 창업자', '투자·데모가 필요한 예비 창업팀', '신규 서비스를 빠르게 실험하려는 기업'],
    faqs: [
      { q: 'MVP는 일반 개발과 무엇이 다른가요?', a: '핵심 기능만 먼저 만들어 빠르게 검증하는 방식입니다. 예산을 아끼고 실패 리스크를 줄일 수 있습니다.' },
      { q: '검증 후 기능을 더 키울 수 있나요?', a: '네. 확장 가능한 구조로 만들기 때문에 검증 결과에 따라 단계적으로 고도화할 수 있습니다.' },
    ],
  },
};

const SERVICE_LABEL = {
  'app-dev': '앱 개발', 'mobile-app': '모바일 앱 개발', 'app-dev-out': '앱 개발 외주',
  'homepage-dev': '홈페이지 제작', 'web-dev': '웹 개발', 'website-dev': '웹사이트 제작',
  'web-dev-simple': '간단한 홈페이지 제작', 'responsive-web': '반응형 웹 제작',
  'landing-page': '랜딩페이지 제작', 'shopping-mall': '쇼핑몰 제작',
  'mvp-dev': 'MVP 개발', 'service-plan': '서비스 기획',
};

const SERVICE_GROUP = {
  'app-dev': 'app', 'mobile-app': 'app', 'app-dev-out': 'app',
  'homepage-dev': 'web', 'web-dev': 'web', 'website-dev': 'web', 'web-dev-simple': 'web', 'responsive-web': 'web',
  'landing-page': 'landing', 'shopping-mall': 'shop',
  'mvp-dev': 'mvp', 'service-plan': 'mvp',
};

// 서비스별 한 줄 차별화 인트로(같은 그룹 안에서도 페이지를 구분)
const SERVICE_NUANCE = {
  'app-dev': '앱 개발은 기능 범위와 화면 수가 비용을 좌우합니다. 꼭 필요한 기능부터 단계적으로 제안드립니다.',
  'mobile-app': '모바일 앱은 사용자가 매일 꺼내 쓰는 접점입니다. 가볍고 빠른 사용 경험을 우선합니다.',
  'app-dev-out': '앱 개발 외주는 소스코드 이관이 핵심입니다. 완료 후 권한을 통째로 넘겨 외주 종속을 없앱니다.',
  'homepage-dev': '홈페이지는 브랜드의 첫인상입니다. 검색 노출과 신뢰감을 함께 잡습니다.',
  'web-dev': '웹 개발은 단순 제작이 아니라 서비스에 맞는 구조와 UX 설계가 중요합니다.',
  'website-dev': '웹사이트는 여러 페이지가 일관된 톤으로 연결되어야 합니다. 정보 구조부터 설계합니다.',
  'web-dev-simple': '간단한 홈페이지는 빠르고 합리적으로. 필요한 핵심만 담아 부담을 줄입니다.',
  'responsive-web': '반응형 웹은 어떤 화면에서도 깨지지 않아야 합니다. 모바일 우선으로 설계합니다.',
  'landing-page': '랜딩페이지는 단 한 가지 행동을 끌어내는 데 집중합니다.',
  'shopping-mall': '쇼핑몰은 결제·배송·정산까지 실제 운영이 되어야 의미가 있습니다.',
  'mvp-dev': 'MVP는 완성도보다 검증 속도가 먼저입니다. 핵심만 빠르게 만듭니다.',
  'service-plan': '서비스 기획은 아이디어를 실행 가능한 범위로 정리하는 단계입니다.',
};

// ── 인텐트 프로필 ──
const INTENT_LABEL = {
  cost: '비용', price: '가격', 'production-cost': '제작 비용', 'dev-cost': '개발 비용',
  quote: '견적', 'quote-inquiry': '견적 문의', 'cost-consult': '비용 상담', 'out-source-cost': '외주 비용',
};

const INTENT_PROFILE = {
  cost: 'cost', price: 'cost', 'production-cost': 'cost', 'dev-cost': 'cost', 'out-source-cost': 'cost',
  quote: 'quote', 'quote-inquiry': 'quote', 'cost-consult': 'quote',
};

// 한국어 조사 은/는 자동 선택 (받침 유무 판별)
function hasBatchim(s) {
  const ch = String(s).trim().slice(-1);
  const code = ch.charCodeAt(0);
  if (Number.isNaN(code) || code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}
function eunneun(s) {
  return hasBatchim(s) ? '은' : '는';
}

function intentBlock(landing) {
  const kw = landing.keyword;
  const svc = SERVICE_LABEL[landing.serviceKey] || '제작';
  const profile = INTENT_PROFILE[landing.intentKey] || 'default';
  const label = INTENT_LABEL[landing.intentKey];

  if (profile === 'cost') {
    return {
      badge: `${label || '비용'} 안내`,
      heroSub: `${kw}, 금액이 무엇으로 정해지는지부터 투명하게 알려드립니다. 숨은 비용 없이 1회성으로 견적드립니다.`,
      angle: {
        title: `${kw}${eunneun(kw)} 이렇게 정해집니다`,
        body: '같은 서비스라도 기능과 디자인 범위에 따라 금액 차이가 큽니다. 아래 항목을 기준으로 꼭 필요한 범위만 골라 합리적으로 견적드립니다.',
        points: ['구현할 기능의 개수와 복잡도', '화면 수와 맞춤 디자인 정도', '결제·지도·외부 API 등 연동 범위', '출시 후 유지보수·운영 범위'],
      },
      faqs: [
        { q: `${kw}${eunneun(kw)} 보통 얼마인가요?`, a: `${svc} 비용은 기능 범위에 따라 달라집니다. 시작가 기준으로 안내드리고, 요구사항을 알려주시면 정확한 견적을 무료로 드립니다.` },
        { q: '계약 후 추가 비용이 생기나요?', a: '처음 합의한 범위 안에서는 추가 비용이 없습니다. 기능이 추가될 때만 협의 후 별도 견적을 드립니다.' },
      ],
    };
  }
  if (profile === 'quote') {
    return {
      badge: `${label || '견적'} · 상담`,
      heroSub: `${kw}, 요구사항만 알려주시면 빠르게 견적과 일정을 안내드립니다. 상담은 무료이고 영업 전화로 부담드리지 않습니다.`,
      angle: {
        title: `${kw} 받는 법`,
        body: '복잡한 절차 없이, 원하시는 기능만 편하게 말씀해 주세요. 영업일 기준 24시간 내에 1차 견적과 일정을 회신드립니다.',
        points: ['전화·이메일로 원하는 기능 공유', '참고할 사이트·앱이 있으면 함께 전달', '24시간 내 1차 견적·일정 회신', '협의 후 계약 및 착수'],
      },
      faqs: [
        { q: `${kw} 상담은 무료인가요?`, a: '네, 상담과 견적은 모두 무료입니다. 가능 여부와 예상 비용·일정을 솔직하게 안내드립니다.' },
        { q: '견적까지 얼마나 걸리나요?', a: '요구사항을 주시면 영업일 기준 24시간 내에 1차 견적을 회신드립니다.' },
      ],
    };
  }
  // default (지역·업종 등)
  return {
    badge: '맞춤 제작',
    heroSub: `${kw}, 업종과 상황에 맞춰 기획부터 제작·운영까지 도와드립니다. 대표가 직접 소통하고 소스코드를 통째로 넘겨드립니다.`,
    angle: {
      title: `왜 름랩 ${svc}인가요?`,
      body: '대형 에이전시처럼 팀 영업 단계를 거치지 않고, 대표 1인이 처음부터 끝까지 직접 소통합니다. 군더더기 없는 1회성 계약으로 진행합니다.',
      points: ['대표 1인이 직접 소통 — 빠른 의사결정', '소스코드 전체 이관으로 외주 종속 없음', '월 관리비 없는 투명한 1회성 계약', '완료 후 직접 수정 교육 제공'],
    },
    faqs: [
      { q: `${kw}${eunneun(kw)} 어떻게 진행되나요?`, a: '무료 상담 → 기획·견적 → 디자인·개발 → 검수·이관 순으로 진행합니다. 각 단계 결과를 공유하며 피드백을 반영합니다.' },
    ],
  };
}

const COMMON_FAQ = {
  q: '완료 후 소스코드를 정말 다 넘겨주나요?',
  a: '네. 프로젝트 완료 시 소스코드, GitHub 저장소, 실행 문서를 함께 이관합니다. 이후 다른 곳에서 수정·운영하셔도 됩니다.',
};

export function buildLandingContent(landing) {
  const groupKey = SERVICE_GROUP[landing.serviceKey] || 'web';
  const group = GROUPS[groupKey];
  const serviceLabel = SERVICE_LABEL[landing.serviceKey] || '제작';
  const intent = intentBlock(landing);

  const intro = `${group.intro} ${SERVICE_NUANCE[landing.serviceKey] || ''}`.trim();

  // FAQ: 인텐트 → 서비스 → 공통 순으로 합치고 질문 기준 중복 제거
  const faqs = [];
  const seen = new Set();
  for (const f of [...intent.faqs, ...group.faqs, COMMON_FAQ]) {
    if (f && !seen.has(f.q)) { seen.add(f.q); faqs.push(f); }
  }

  return {
    serviceLabel,
    badge: intent.badge,
    heroSub: intent.heroSub,
    intro,
    deliverables: group.deliverables,
    audience: group.audience,
    angle: intent.angle,
    process: PROCESS_DEFAULT,
    pricing: PRICING[group.pricing],
    faqs: faqs.slice(0, 6),
  };
}
