import { RELATED_KEYWORDS_BY_PILLAR, mergeRelatedKeywords } from './keyword-coverage';

export const SITE = {
  name: '름랩',
  nameEn: 'REUMLAB',
  domain: 'https://reumlab.com',
  defaultOgImage: 'https://reumlab.com/og-image.jpg',
  phone: '010-8111-9370',
  /** tel: 링크용 (하이픈 제거) */
  phoneHref: 'tel:01081119370',
  address: '경기도 화성시 동탄첨단산업1로 58, 307호(영천동)',
  email: 'ceo@eternalsix.com',
  /** 문의는 전화·이메일로만 받습니다 */
  company: '앱·웹개발 스튜디오 름랩',
  representative: '성아름',
  bizNo: '793-12-03247',
  /**
   * 외부 채널 — 엔티티(신뢰) 신호용 sameAs 단일 출처.
   * 채널을 실제로 개설한 뒤 여기에만 실 URL을 추가하면 전 페이지 JSON-LD에 반영됩니다.
   * 가짜/추정 URL 금지 — 실제로 존재하는 채널만 등록.
   */
  sameAs: [
    'https://naver.me/FORRCoFc', // 네이버 플레이스
    'https://blog.naver.com/reumlab', // 네이버 블로그
    'https://www.instagram.com/reumlab/', // 인스타그램
    'https://pf.kakao.com/_xkxjQxgn', // 카카오톡 채널
    'https://maps.app.goo.gl/rkKTdHCvhSyYrEkq8', // 구글 비즈니스 프로필(지도)
    // 'https://www.youtube.com/@...',   // 유튜브 (개설 시 추가)
  ] as string[],
};

export interface PageSeo {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  h1: string;
  canonical: string;
  /**
   * 이 페이지가 노리는 대표 검색어 1개. title/H1/본문이 이 키워드를 중심으로 정렬돼야 한다.
   * (keywords 배열은 보조 신호 — primary 는 "이 페이지의 단일 주제"를 선언한다)
   */
  primary?: string;
  /** 보조 키워드 2~4개 (primary 를 보강하는 롱테일·변형) */
  secondary?: string[];
  /** 검색 의도 (예: '업체 비교/견적', '문제 해결', '정보 탐색') — 운영·리포트용 */
  intent?: string;
  /** 퍼널 단계 (예: '전환 직전', '전환', '중간', '인지') — 운영·리포트용 */
  funnel?: string;
  serviceDesc?: string;
  /** 허브/필러 전용 — 페이지 고유 "왜 름랩" 포인트 (있으면 공통 불릿 대체) */
  whyPoints?: string[];
  /** 허브/필러 전용 — 검색 의도별 고유 본문 섹션 (비용/기간/프로세스/적합성 등) */
  sections?: { h2: string; body: string }[];
  /** 허브/필러 전용 — 화면+FAQPage 스키마에 함께 쓰는 고유 FAQ */
  faqs?: { q: string; a: string }[];
}

export const PAGE_SEO_MAP: Record<string, PageSeo> = {
  // ─── 메인 (에이전시 정체성) ───
  '': {
    title: '름랩 REUMLAB | Flutter 앱개발, 랜딩페이지 제작, MVP 외주개발 — 동탄·수원 개발 스튜디오',
    description:
      '화성 동탄 외주개발 스튜디오 름랩. Flutter 앱개발·MVP 개발·랜딩페이지 제작·홈페이지 제작·AI 기능 개발. 동탄·수원·화성 등 경기 남부와 전국 진행. 소스코드 전체 이관 + 직접 운영 1:1 교육 포함. 웹 49만 원부터, 앱 290만 원부터(VAT 포함 정액).',
    keywords: [
      '외주개발',
      '앱개발 외주',
      'Flutter 앱개발',
      'MVP 개발',
      '랜딩페이지 제작',
      '홈페이지 제작',
      '수원 앱개발',
      '수원 외주개발',
      '동탄 앱개발',
      '화성 앱개발',
      '동탄 외주개발',
      '소스코드 이관',
      '스타트업 MVP',
    ],
    ogTitle: '외주 맡긴 앱, 다시는 외주에 묶이지 않게. | 름랩 REUMLAB',
    ogDescription:
      '앱·웹 MVP 개발 + AI 직접 운영 교육. Flutter 앱·웹 MVP를 빠르게 만들고 소스코드·권한을 통째로 넘깁니다.',
    h1: '외주 맡긴 앱, 다시는 외주에 묶이지 않게',
    primary: '앱개발 외주',
    secondary: ['웹개발 외주', 'MVP 개발', '동탄 앱개발', '수원 외주개발'],
    intent: '브랜드·종합',
    funnel: '전환',
    canonical: 'https://reumlab.com/',
  },

  // ─── 서비스별 페이지 (AI 단어 제거) ───
  웹개발: {
    title: '웹사이트 제작 외주 | 반응형 웹 49만원부터 정액 — 름랩 REUMLAB',
    description:
      '기업용 웹사이트, 고성능 랜딩페이지 제작. 최신 기술 스택 기반의 반응형 웹 개발을 제공합니다.',
    keywords: [
      '웹 개발',
      '홈페이지 제작',
      '반응형 웹',
      '기업용 웹사이트',
      'Next.js 개발',
      'TypeScript 웹',
    ],
    ogTitle: '홈페이지 제작·웹 개발 | 름랩',
    ogDescription: '검색에 잡히고 문의로 이어지는 웹사이트를 정액으로 만듭니다. 소스코드는 넘겨드립니다.',
    h1: '홈페이지 제작·웹 개발',
    primary: '홈페이지 제작 업체',
    secondary: ['웹개발 업체', '반응형 웹', '기업용 웹사이트'],
    intent: '업체 비교/견적',
    funnel: '전환 직전',
    canonical: 'https://reumlab.com/웹개발/',
  },

  앱개발: {
    title: '앱개발 외주 | Flutter iOS·안드로이드 MVP 290만원부터 — 름랩',
    description:
      'Flutter로 iOS·안드로이드 앱을 한 번에 만듭니다. 기획서가 없어도 꼭 필요한 기능 한두 개면 상담을 시작할 수 있고, 완성 후 소스코드를 넘겨드립니다.',
    keywords: [
      '앱 개발',
      '어플 제작',
      '모바일 앱',
      'React Native 개발',
      'Flutter 앱',
      'iOS 안드로이드 앱',
    ],
    ogTitle: 'Flutter 앱 개발 외주 | 름랩',
    ogDescription: '화면 설계부터 스토어 등록까지 진행하고, 대표님이 직접 수정할 수 있게 운영 교육까지 드립니다.',
    h1: 'Flutter 앱 MVP 개발',
    canonical: 'https://reumlab.com/앱개발/',
  },

  스타트업MVP: {
    title: '스타트업 MVP 개발 외주 | 3주 출시·소스코드 이관 — 름랩 REUMLAB',
    description:
      '검증에 필요한 핵심 기능만 추려 3주 안에 출시하는 MVP 개발. 다 만들고 나서 반응을 보는 대신, 꼭 필요한 흐름 하나부터 시장에 내놓습니다.',
    keywords: [
      '스타트업 MVP',
      'MVP 제작',
      '최소 기능 제품 개발',
      '스타트업 외주',
      '신규 서비스 구축',
    ],
    ogTitle: '스타트업 MVP 개발 외주 | 름랩',
    ogDescription: '데모데이·투자 일정이 있으면 그 날짜에 맞춰 범위를 잡습니다. 이후 내부 개발팀이 이어받도록 코드를 정리해 넘겨드립니다.',
    h1: '스타트업 MVP 개발',
    canonical: 'https://reumlab.com/스타트업MVP/',
  },

  솔루션SaaS: {
    title: 'B2B 솔루션·SaaS 개발 외주 | 구독·관리자·결제 연동 — 름랩 REUMLAB',
    description:
      '벡터 DB·OCR 기반의 데이터 아카이빙, 업무 자동화 SaaS 구축. 확장성 높은 클라우드 아키텍처.',
    keywords: [
      'SaaS 개발',
      'B2B 솔루션',
      '업무 자동화',
      '벡터 데이터베이스',
      'OCR 솔루션',
      '클라우드 서비스',
    ],
    ogTitle: '전문 B2B 솔루션 및 SaaS 개발 서비스 | 름랩',
    ogDescription:
      '엣지 컴퓨팅과 최신 데이터 기술로 기업의 업무 효율을 극대화합니다.',
    h1: '확장 가능한 고성능 B2B 솔루션 및 SaaS 개발',
    canonical: 'https://reumlab.com/솔루션SaaS/',
  },

  플랫폼개발: {
    title: '플랫폼·O2O 앱 개발 외주 | 매칭·예약·정산 시스템 — 름랩 REUMLAB',
    description:
      '매칭·예약 플랫폼, O2O 서비스 전문 개발. 복잡한 비즈니스 로직을 안정적으로 구현합니다.',
    keywords: [
      '플랫폼 개발',
      '매칭 서비스 제작',
      'O2O 플랫폼',
      '예약 시스템 구축',
      '마켓플레이스 개발',
    ],
    ogTitle: '맞춤형 비즈니스 플랫폼 구축 | 름랩',
    ogDescription: '안정적인 트래픽 처리와 고도화된 비즈니스 플랫폼 솔루션.',
    h1: '수익 모델을 현실화하는 맞춤형 플랫폼 개발',
    primary: '플랫폼 개발 업체',
    secondary: ['매칭 서비스 제작', 'O2O 플랫폼', '예약 시스템 구축'],
    intent: '업체/정보',
    funnel: '중간',
    canonical: 'https://reumlab.com/플랫폼개발/',
  },

  기업용ERP: {
    title: '맞춤형 ERP·관리자 시스템 개발 외주 | 업무 자동화 — 름랩 REUMLAB',
    description:
      'CRM, 사내 시스템, 관리자 웹 고도화. 기존 데이터를 통합하여 업무 효율을 혁신합니다.',
    keywords: [
      'ERP 개발',
      'CRM 시스템',
      '백오피스 구축',
      '사내 인트라넷',
      '관리자 페이지 고도화',
    ],
    ogTitle: '업무 효율을 극대화하는 사내 통합 시스템 개발 | 름랩',
    ogDescription: '파편화된 업무를 하나로. 기업 맞춤형 관리 시스템 구축 전문.',
    h1: '기업 환경에 최적화된 맞춤형 ERP 및 관리 시스템',
    primary: 'ERP 개발',
    secondary: ['CRM 시스템', '백오피스 구축', '관리자 페이지 고도화'],
    intent: '정보/전환',
    funnel: '중간',
    canonical: 'https://reumlab.com/기업용ERP/',
  },

  // ─── 영문 서비스 URL (구글 광고 랜딩 + 영문 검색) ───
  'app-development': {
    title: 'App Development Outsourcing Korea | Flutter MVP | REUMLAB',
    description:
      'Flutter app development studio in Hwaseong (Dongtan), Korea. iOS + Android in one codebase. MVP in ~21 days. Full source code handover + 1:1 operation training. From ₩2,900,000 VAT incl.',
    keywords: [
      '앱개발 외주',
      'Flutter 앱개발',
      'app development Korea',
      'Flutter MVP',
      '앱개발 견적',
      'mobile app outsourcing',
    ],
    ogTitle: 'Flutter App Development | MVP in 21 Days | REUMLAB Korea',
    ogDescription: 'One codebase, iOS + Android. Full source handover. Hwaseong (Dongtan) studio serving Suwon and all of Korea.',
    h1: '앱개발 외주 · App Development',
    // 영문 광고·해외 검색 랜딩(title 영어). 한글 "앱개발 업체" 쿼리는 /app-agency 가 담당.
    primary: 'app development Korea',
    secondary: ['app development outsourcing', 'Flutter MVP Korea', '앱개발 외주'],
    intent: '영문 검색/광고',
    funnel: '전환',
    serviceDesc: '름랩은 Flutter로 iOS·Android 앱을 한 번에 만듭니다. 앱 라이트 MVP는 290만 원부터, 회원·결제·관리자까지 갖춘 앱 스탠다드는 490만 원·약 21일, 소스코드 전체 이관. 구글 광고·영문 검색으로 유입된 고객도 동일한 조건으로 상담합니다.',
    canonical: 'https://reumlab.com/app-development/',
  },

  'web-development': {
    title: 'Web Development & Landing Page Korea | REUMLAB',
    description:
      'Custom website and landing page development in Korea. SEO-ready, source code included, no monthly fees. From ₩490,000 VAT incl. Hwaseong (Dongtan) studio.',
    keywords: [
      '홈페이지 제작',
      '랜딩페이지 제작',
      'web development Korea',
      'landing page Korea',
      '웹사이트 제작',
      'Next.js development',
    ],
    ogTitle: 'Website & Landing Page Development | REUMLAB Korea',
    ogDescription: 'Custom web development with full source handover. No monthly fees. SEO-ready from day one.',
    h1: '웹사이트·랜딩페이지 제작 · Web Development',
    // 영문 랜딩(title 영어). 한글 "홈페이지 제작 업체" 쿼리는 /website-agency 가 담당.
    primary: 'web development Korea',
    secondary: ['landing page Korea', 'website development Korea', '랜딩페이지 제작'],
    intent: '영문 검색/광고',
    funnel: '전환',
    serviceDesc: '름랩 웹은 원페이지 랜딩 웹 스타터 49만 원부터 시작하고, 멀티페이지+CMS+블로그를 갖춘 웹 비즈니스 패키지는 VAT 포함 190만 원, 약 14일입니다. 맞춤 제작, 소스코드 전체 이관, 월 관리비 없음. SEO 기본기(메타·구조화 데이터·사이트맵)가 기본 포함됩니다.',
    canonical: 'https://reumlab.com/web-development/',
  },

  'mvp-development': {
    title: 'MVP Development Korea | 3-Week Launch | REUMLAB',
    description:
      'Startup MVP development in Korea. Flutter cross-platform, 3-week turnaround, full source handover. Validate your idea before scaling. From ₩2,900,000.',
    keywords: [
      'MVP 개발',
      'MVP 외주',
      'startup MVP Korea',
      'MVP development',
      '스타트업 앱개발',
      'rapid prototyping',
    ],
    ogTitle: 'Startup MVP Development in 3 Weeks | REUMLAB Korea',
    ogDescription: 'Cross-platform Flutter MVP. Full source ownership. Validate your market in 21 days.',
    h1: 'MVP 개발 · Startup MVP Development',
    primary: 'MVP 개발 업체',
    secondary: ['MVP 개발 비용', '스타트업 MVP', 'MVP 외주', 'MVP 개발 견적'],
    intent: '업체/비용',
    funnel: '전환',
    serviceDesc: '검증에 필요한 최소 기능만 빠르게 만듭니다. Flutter로 iOS·Android 동시 출시, 소스코드 전체 이관, 직접 운영 교육 포함. 앱 라이트 MVP는 VAT 포함 290만 원·약 14일, 회원·결제까지 갖춘 앱 스탠다드는 490만 원·약 21일.',
    sections: [
      { h2: 'What to build first — and what to cut', body: 'A good MVP includes only what is needed to test your core hypothesis (investment, sales, or user validation). We keep the essential login/payment/admin flows and defer edge cases, extra options, and “nice to have” features to after validation. Trying to build everything at once multiplies cost and delays launch.' },
      { h2: 'MVP cost and timeline', body: 'Scope decides price. A lean web MVP maps to our Web Business package, an app MVP to App Lite (₩2,900,000, ~14 days) or App Standard with members/payments/admin (₩4,900,000, ~21 days). AI or complex settlement moves into the App AI (₩6,900,000) tier. All prices are fixed and VAT-included, disclosed before we start — no hidden fees.' },
      { h2: 'How ownership is handed over', body: 'On delivery we transfer the full source code, Git repository, deployment rights, and store accounts to your name. You can move to another team or run it yourself — never locked to one vendor. We also give 1:1 training so a non-developer founder can make simple edits directly, and the codebase is structured to extend on the same base after validation.' },
    ],
    faqs: [
      { q: 'How much does MVP development cost in Korea?', a: 'Our lean MVP starts from ₩2,900,000 (VAT included), scaling to ₩4,900,000 for an app with members, payments, and an admin panel. Final pricing depends on scope, which we fix and disclose before starting.' },
      { q: 'How long does it take to launch an MVP?', a: 'Typically about 14–30 days depending on scope. App Lite is around 14 days, App Standard around 21 days. If you have an investor or demo-day deadline, we scope the build to fit it.' },
      { q: 'Do I receive the full source code?', a: 'Yes — always. Full source code, repository, deployment rights, and store accounts are transferred to you, plus 1:1 operation training. No lock-in.' },
    ],
    canonical: 'https://reumlab.com/mvp-development/',
  },

  'flutter-development': {
    title: 'Flutter App Development Studio Korea | REUMLAB',
    description:
      'Flutter specialist studio in Hwaseong (Dongtan), Korea. One codebase for iOS and Android. 50–70% cost vs native. Full source handover + operation training.',
    keywords: [
      'Flutter 개발',
      'Flutter 앱개발',
      'Flutter development Korea',
      '크로스플랫폼 개발',
      'Flutter 외주',
    ],
    ogTitle: 'Flutter App Development | iOS + Android | REUMLAB',
    ogDescription: 'Flutter specialist studio. One code, two platforms. Cheaper to build, cheaper to maintain.',
    h1: 'Flutter 앱개발 · Flutter Development',
    primary: 'Flutter 앱개발 업체',
    secondary: ['Flutter 외주', '크로스플랫폼 개발', 'Flutter MVP', '앱개발 외주'],
    intent: '업체/정보',
    funnel: '전환',
    serviceDesc: 'Flutter 크로스플랫폼은 네이티브 2벌 대비 비용 50~70% 절감. 유지보수도 구조적으로 절반. 소스코드 전체 이관, 직접 수정 교육 포함. 앱 라이트 MVP 290만 원부터, 회원·결제까지 갖춘 앱 스탠다드 490만 원.',
    sections: [
      { h2: 'Why Flutter is cheaper to build and maintain', body: 'Building iOS and Android natively means two codebases, two teams, and two maintenance streams. Flutter uses a single codebase for both platforms, cutting development cost by roughly 50–70% and halving long-term maintenance — every fix and update ships to both platforms at once.' },
      { h2: 'When Flutter fits — and when native is better', body: 'Flutter is ideal for commerce, booking, community, and subscription apps, and for MVPs that need to launch on both platforms fast. For high-end 3D games, real-time video, or AR that depend on native performance, we recommend native and say so up front. We assess fit before quoting.' },
      { h2: 'Cost, delivery, and handover', body: 'A Flutter app MVP starts at ₩2,900,000 (App Lite, ~14 days) and ₩4,900,000 for App Standard with members, payments, and admin (~21 days) — fixed, VAT-included pricing. We handle App Store and Play Store submission, then transfer the full source code, repository, and deployment rights to you, with 1:1 operation training.' },
    ],
    faqs: [
      { q: 'How much does Flutter app development cost?', a: 'Our Flutter app MVP starts from ₩2,900,000 (App Lite, VAT included), and ₩4,900,000 for App Standard with members, payments, and an admin panel. Scope is fixed and disclosed before we start.' },
      { q: 'Does Flutter build both iOS and Android?', a: 'Yes — one codebase produces both iOS and Android apps, released together. We also handle store registration and transfer the accounts and rights to you.' },
      { q: 'Is Flutter quality lower than native?', a: 'For MVPs and most business apps, users notice essentially no difference. Unless you need high-end 3D or real-time video, Flutter is faster to launch and cheaper to maintain — usually the more practical choice.' },
    ],
    canonical: 'https://reumlab.com/flutter-development/',
  },

  // ─── 지역×서비스(pSEO) 허브 — 한글 서비스 슬러그 ───
  mvp: {
    title: 'MVP 개발 외주 | 지역별 스타트업 MVP — 름랩 REUMLAB',
    description:
      '검증에 필요한 핵심 기능부터 빠르게 출시하는 MVP 개발. Flutter 크로스플랫폼, 14~30일, VAT 포함 290만 원부터. 소스코드 전체 이관 + 직접 운영 교육. 동탄·수원 거점, 전국 어디서나 진행.',
    keywords: ['MVP 개발', 'MVP 외주', '스타트업 MVP', '최소 기능 제품', 'Lean MVP', '앱개발 외주'],
    ogTitle: 'MVP 개발 외주 | 핵심 기능부터 빠르게 — 름랩',
    ogDescription: '시장 검증에 필요한 핵심 기능부터 Lean MVP로. 소스코드 전체 이관 + 직접 운영 교육.',
    h1: 'MVP 개발 외주',
    primary: 'MVP 개발',
    secondary: ['MVP 외주', '스타트업 MVP', 'Lean MVP', '앱개발 외주'],
    intent: '정보/전환',
    funnel: '중간',
    serviceDesc:
      '시장 검증에 필요한 핵심 기능부터 만드는 Lean MVP. 화면 흐름 설계 → 중간 확인 → 소스코드 이관 순서로 진행합니다. VAT 포함 290만 원부터, 약 14~30일. 전국 어디서나 같은 패키지로 진행합니다.',
    whyPoints: [
      '검증에 필요한 핵심 기능만 추려 14~30일에 출시 — 예산·실패 리스크 최소화',
      'VAT 포함 정액(290만 원부터)으로 가격 먼저 공개, 숨은 비용 없음',
      '소스코드·저장소·배포 권한 전체 이관 — 검증 후 같은 코드 위에서 확장',
      '비개발자 대표도 직접 운영하도록 AI 운영 1:1 교육 포함',
    ],
    sections: [
      { h2: 'MVP 개발 비용과 기간', body: 'MVP 비용은 기능 범위·화면 수·관리자/연동 여부로 정해집니다. 름랩 Lean MVP는 VAT 포함 290만 원부터, 약 14~30일입니다. 웹 중심 MVP는 웹 비즈니스(190만 원·약 14일), 앱 MVP는 앱 라이트 290만 원(약 14일)·앱 스탠다드(490만 원·약 21일), AI·고도화가 필요하면 앱 AI 690만 원~앱 프리미엄 990만 원(약 30~45일)으로 매핑됩니다.' },
      { h2: 'MVP에 넣을 것 vs 빼야 할 것', body: '검증 목표(투자·영업·사용자 테스트)에 직접 필요한 기능만 넣습니다. 회원·결제·관리자 중 검증에 꼭 필요한 흐름만 남기고, 부가 기능·예외 처리·확장 옵션은 검증 후로 미룹니다. 처음부터 다 넣으면 비용과 기간이 두세 배로 늘고 출시가 늦어집니다.' },
      { h2: '진행 프로세스', body: '핵심 기능 범위 설계 → 화면·흐름 확정 → 개발 → 중간 확인으로 방향 조정 → 소스코드·문서 이관 → 직접 운영 교육 순서로 진행합니다. 중간 확인 단계가 “생각과 다른 결과물” 리스크를 줄입니다.' },
      { h2: '이런 경우 적합 / 부적합', body: '적합: 아이디어를 빠르게 시장에서 검증하려는 초기 창업자·스타트업, 투자·데모데이용 데모가 필요한 팀. 부적합: 처음부터 대규모 트래픽·복잡한 정산·고성능 그래픽이 핵심인 서비스는 MVP보다 본개발 설계가 먼저입니다.' },
    ],
    faqs: [
      { q: 'MVP는 일반 앱개발과 무엇이 다른가요?', a: '모든 기능을 한 번에 만들지 않고 검증에 꼭 필요한 핵심부터 빠르게 출시하는 방식입니다. 초기 비용과 실패 리스크를 줄이고, 반응을 본 뒤 같은 코드 위에서 확장합니다.' },
      { q: 'MVP 개발 비용은 얼마인가요?', a: '기능 범위가 가격을 정합니다. 름랩 Lean MVP는 VAT 포함 290만 원부터, 약 14~30일입니다. 상담에서 검증 목표에 맞춰 범위와 패키지를 함께 정합니다.' },
      { q: '검증 후 확장은 어떻게 하나요?', a: '소스코드와 저장소를 통째로 이관하므로 같은 코드 위에서 기능을 단계적으로 추가합니다. 내부 개발팀이 생기면 그대로 이어받을 수 있습니다.' },
    ],
    canonical: 'https://reumlab.com/mvp/',
  },

  'windows-app-development': {
    title: '윈도우 앱·데스크톱 프로그램 개발 외주 | 사내 업무 자동화 — 름랩 REUMLAB',
    description:
      'Windows 데스크톱 앱·업무 자동화 프로그램 개발 외주. 재고·주문·정산 등 반복 PC 업무를 설치형 프로그램으로 자동화. Electron·Flutter Desktop 기반, 소스코드 전체 이관. 동탄·수원 거점, 전국 진행.',
    keywords: ['윈도우 앱 개발', '데스크톱 앱 개발', '윈도우 프로그램 외주', '업무 자동화 프로그램', 'PC 프로그램 제작', 'Electron 개발'],
    ogTitle: '윈도우 앱·데스크톱 프로그램 개발 외주 | 름랩',
    ogDescription: '사내 업무를 자동화하는 Windows 데스크톱 프로그램. 소스코드 전체 이관 + 직접 운영 교육.',
    h1: '윈도우 앱·데스크톱 프로그램 개발 외주',
    primary: '윈도우 앱 개발',
    secondary: ['데스크톱 앱 개발', '업무 자동화 프로그램', 'PC 프로그램 제작', 'Electron 개발'],
    intent: '정보/전환',
    funnel: '중간',
    serviceDesc:
      '재고·주문·정산·출력 같은 반복 업무를 Windows 데스크톱 프로그램으로 자동화합니다. Electron 또는 Flutter Desktop 기반으로 만들어 PC에 설치해 쓰고, 필요하면 같은 코드로 웹·모바일까지 확장합니다. 완성 후 소스코드와 설치 파일을 전부 이관합니다.',
    whyPoints: [
      '엑셀·수기로 하던 재고·주문·정산을 PC 프로그램으로 자동화 — 반복 작업·실수 감소',
      '인터넷 없이도 동작하는 오프라인 데스크톱 앱 + 필요 시 서버 연동',
      'Electron·Flutter Desktop으로 Windows·macOS 동시 대응 가능',
      '소스코드·설치 파일 전체 이관 — 외주사에 묶이지 않고 직접 운영',
    ],
    sections: [
      { h2: '윈도우 앱 개발 비용과 기간', body: '기능 범위(화면 수·데이터베이스·외부 연동·설치 배포)로 비용이 정해집니다. 단순 업무 자동화 도구는 소규모로 시작할 수 있고, 재고·주문·정산이 얽힌 관리 프로그램은 웹 관리자 수준의 견적으로 잡힙니다. 정확한 금액은 업무 흐름을 듣고 화면 단위로 산정해 먼저 공개합니다.' },
      { h2: '어떤 업무에 적합한가', body: '매장·창고의 재고 관리, 주문·발주 처리, 견적·거래명세서 출력, 사내 데이터 집계처럼 매일 반복되는 PC 작업에 적합합니다. 웹으로 만들기 애매하고 설치형 프로그램이 편한 현장 업무에 특히 효과적입니다.' },
      { h2: '기술 선택 — Electron vs Flutter Desktop', body: 'Electron은 웹 기술을 그대로 데스크톱에 담아 개발이 빠르고 UI 자유도가 높습니다. Flutter Desktop은 모바일 앱과 코드를 공유해 앱까지 함께 갈 때 유리합니다. 업무 성격과 확장 계획에 맞춰 골라 드립니다.' },
      { h2: '진행 프로세스', body: '업무 흐름 정리 → 화면·데이터 설계 → 개발 → 중간 확인 → 설치 파일 배포 → 소스코드·운영 교육 순서로 진행합니다. 현장에서 실제 쓰는 흐름대로 만들고 중간 확인으로 방향을 맞춥니다.' },
    ],
    faqs: [
      { q: '윈도우 앱과 웹 프로그램 중 뭐가 나은가요?', a: '인터넷 없이 PC에서 바로 쓰고 설치형이 편한 현장 업무는 데스크톱 앱이, 여러 곳에서 접속하고 업데이트가 잦으면 웹이 유리합니다. 업무를 듣고 맞는 쪽을 추천드립니다.' },
      { q: '기존 엑셀 자료를 옮길 수 있나요?', a: '가능합니다. 쓰시던 엑셀·CSV 데이터를 불러와 프로그램에서 이어서 쓰도록 마이그레이션을 포함해 설계합니다.' },
      { q: 'macOS에서도 쓸 수 있나요?', a: 'Electron·Flutter Desktop 기반이면 Windows와 macOS를 함께 대응할 수 있습니다. 필요 여부를 상담에서 정합니다.' },
    ],
    canonical: 'https://reumlab.com/windows-app-development/',
  },

  flutter: {
    title: 'Flutter 앱개발 외주 | iOS·안드로이드 동시 — 름랩 REUMLAB',
    description:
      'Flutter 하나로 iOS·Android 앱을 동시에. 네이티브 2벌 대비 개발 비용 50~70% 절감, 유지보수도 절반. VAT 포함 290만 원부터, 소스코드 전체 이관 + 직접 운영 교육. 동탄·수원 거점, 전국 어디서나 진행.',
    keywords: ['Flutter 앱개발', 'Flutter 외주', '크로스플랫폼 개발', 'Flutter MVP', '앱개발 외주', 'iOS 안드로이드 앱'],
    ogTitle: 'Flutter 앱개발 외주 | 하나의 코드로 두 플랫폼 — 름랩',
    ogDescription: '하나의 코드로 iOS·Android 동시 제작. MVP 단계 시간·비용을 줄이는 Flutter 앱개발.',
    h1: 'Flutter 앱개발 외주',
    primary: 'Flutter 앱개발',
    secondary: ['Flutter 외주', '크로스플랫폼 개발', 'Flutter MVP', 'iOS 안드로이드 앱'],
    intent: '정보/전환',
    funnel: '중간',
    serviceDesc:
      'Flutter 크로스플랫폼으로 iOS·Android를 한 번에 만듭니다. 네이티브 2벌 대비 비용 50~70% 절감, 유지보수도 구조적으로 절반. 소스코드 전체 이관, 직접 수정 교육 포함. VAT 포함 290만 원부터.',
    whyPoints: [
      '하나의 코드로 iOS·Android 동시 출시 — 네이티브 2벌 대비 비용 50~70% 절감',
      '유지보수도 구조적으로 절반 — 출시 후 운영비까지 줄임',
      'VAT 포함 290만 원부터 정액, 소스코드 전체 이관',
      'MVP·중소 규모 서비스 앱에 최적, 직접 수정 교육 포함',
    ],
    sections: [
      { h2: 'Flutter가 비용을 줄이는 이유', body: 'iOS·Android를 따로 만들면 인력·기간·유지보수가 두 벌 듭니다. Flutter는 하나의 코드베이스로 두 플랫폼을 함께 만들어 개발 비용을 50~70% 줄이고, 이후 수정·업데이트도 한 번에 반영돼 유지보수가 구조적으로 절반입니다.' },
      { h2: 'Flutter가 맞는 경우 / 아닌 경우', body: '맞는 경우: 커머스·예약·커뮤니티·구독처럼 일반 비즈니스 앱, iOS·Android 동시 출시가 필요한 MVP. 아닌 경우: 고사양 3D 게임, 실시간 영상 처리처럼 플랫폼 네이티브 성능이 핵심인 영역은 네이티브를 검토합니다. 상담에서 적합성을 먼저 판단합니다.' },
      { h2: '진행 방식과 산출물', body: '화면·흐름 확정 → 핵심 기능 중심 개발 → 중간 확인 → 스토어 등록 → 소스코드·저장소·배포 권한 이관 순으로 진행합니다. 산출물은 iOS·Android 앱, 관리자/연동 기능, 소스코드 전체, 실행 문서, 1:1 운영 교육입니다.' },
      { h2: '비용·기간', body: 'Flutter 앱 MVP는 핵심 화면 중심 앱 라이트 290만 원(약 14일)부터, 회원·결제·관리자까지 갖춘 앱 스탠다드는 490만 원(약 21일)입니다(VAT 포함 정액). 결제·복잡한 관리자·외부 API·서버 비용·스토어 계정은 범위에 따라 별도 안내되며, 숨은 비용 없이 상담 단계에서 미리 정합니다.' },
    ],
    faqs: [
      { q: 'Flutter로 만들면 네이티브보다 품질이 떨어지나요?', a: 'MVP·중소 규모 서비스에서는 체감 차이가 거의 없습니다. 고사양 게임·실시간 영상이 아니라면 출시 속도와 유지보수 비용에서 오히려 유리합니다.' },
      { q: 'iOS와 Android 둘 다 나오나요?', a: '네. 하나의 코드로 두 플랫폼을 동시에 만들어 함께 출시합니다. 스토어 등록도 대행하고 계정·권한을 이관합니다.' },
      { q: 'Flutter 앱개발 비용은 얼마인가요?', a: '핵심 화면 중심 앱 라이트 MVP는 VAT 포함 290만 원(약 14일)부터, 회원·결제·관리자까지 갖춘 앱 스탠다드는 490만 원(약 21일)입니다. 기능 범위에 따라 견적이 정해지며 상담에서 미리 안내합니다.' },
    ],
    canonical: 'https://reumlab.com/flutter/',
  },

  'ai-development': {
    title: 'AI 외주개발 | 챗봇·상담 자동화 실전형 — 름랩 REUMLAB',
    description:
      '거창한 AI가 아니라 운영에 필요한 기능부터. 고객문의 자동화 챗봇·문서 요약·상담 자동화·추천을 최소 기능으로 설계하고, AI를 직접 지시·운영하도록 1:1 교육. 소스코드·API 키 직접 보유. 전국 어디서나 진행.',
    keywords: ['AI 외주개발', 'AI 챗봇 개발', '상담 자동화', '업무 자동화', 'AI 기능 개발', 'AI 외주'],
    ogTitle: 'AI 외주개발 | 작게 시작하는 상담 자동화 — 름랩',
    ogDescription: '운영에 필요한 AI 기능부터 최소 단위로. 직접 지시·운영 교육 포함, 소스코드·API 키 직접 보유.',
    h1: 'AI 외주개발',
    primary: 'AI 챗봇 개발',
    secondary: ['상담 자동화', '업무 자동화', 'AI 기능 개발', 'AI 외주개발'],
    intent: '정보/전환',
    funnel: '중간',
    serviceDesc:
      '챗봇·자동응답·문서요약·추천·상담 자동화 등 운영에 필요한 AI 기능부터 설계합니다. 최소 기능으로 시작해 효과를 확인한 뒤 단계적으로 확장합니다. 소스코드·API 키를 직접 보유하도록 이관하고, AI 직접 운영 교육을 제공합니다.',
    whyPoints: [
      '거창한 AI가 아니라 운영에 필요한 기능부터 — 효과 확인 후 단계 확장',
      '고객문의 자동화·문서 요약·상담 자동화·추천·분류 등 실무형 AI',
      '소스코드·API 키 직접 보유로 이관 — 종속·보안 부담 최소화',
      'AI에 정확히 지시하고 결과를 확인하는 1:1 운영 교육 포함',
    ],
    sections: [
      { h2: '작게 시작하는 AI가 유리한 이유', body: '처음부터 거창한 AI를 붙이면 비용·기간·실패 위험이 큽니다. 고객문의 자동 응답처럼 효과가 분명한 최소 기능부터 붙여 운영 효과를 확인한 뒤, 같은 구조 위에서 단계적으로 확장하는 것이 비용·리스크 면에서 유리합니다.' },
      { h2: '어떤 기능부터 만드나', body: '반복 문의 자동 응답 챗봇, 문서 요약, 상담 접수·분류, 추천 로직처럼 업무 절감과 직접 연결되는 기능을 우선합니다. 기존 앱·웹에 AI 기능만 추가 연동하는 것도 가능합니다.' },
      { h2: '적합 / 부적합', body: '적합: 반복 응대·문서 처리·분류가 많아 자동화로 시간을 줄이려는 팀. 부적합: 데이터·목표가 정해지지 않은 채 “AI를 일단 넣어보자”는 경우 — 이때는 어떤 업무를 줄일지부터 상담에서 정합니다.' },
      { h2: '진행과 소유권', body: '효과가 분명한 최소 기능 설계 → 개발·연동 → 운영 확인 → 확장 순으로 진행합니다. 소스코드와 API 키를 대표님이 직접 보유하도록 이관해 보안·운영 부담을 줄이고, AI에 지시·확인하는 방법을 교육합니다.' },
    ],
    faqs: [
      { q: 'AI 기능을 작게 시작했다가 확장할 수 있나요?', a: '가능합니다. 효과가 분명한 최소 기능부터 붙이고, 운영하며 반응을 본 뒤 같은 구조 위에서 단계적으로 확장합니다.' },
      { q: '기존 서비스에 AI 기능만 추가할 수 있나요?', a: '네. 이미 운영 중인 앱·웹에 챗봇·자동 응답·요약 같은 AI 기능만 추가 연동하는 방식도 진행합니다.' },
      { q: 'API 키와 비용은 누가 관리하나요?', a: '대표님 명의로 API 키를 직접 보유하도록 이관합니다. 사용량 기반 비용 구조와 절감 방법도 함께 안내합니다.' },
    ],
    canonical: 'https://reumlab.com/ai-development/',
  },

  // ─── 차별화 pillar — 소스코드 이관 (경쟁사 미점유 토픽) ───
  'source-handover': {
    title: '소스코드 이관 외주 | 저장소·배포 권한 통째로 — 름랩 REUMLAB',
    description:
      '앱·웹 외주의 소스코드 전체·GitHub 저장소·배포 권한·스토어 계정을 통째로 이관받으세요. 외주사 종속 없이 직접 운영·유지보수·이전이 가능합니다. 정액 패키지 기본 포함. 이미 외주사에서 소스코드를 못 받은 경우 현황 점검·이관 상담도 진행합니다.',
    keywords: [
      '소스코드 이관',
      '소스코드 주는 외주',
      '외주 소스코드',
      '외주사 종속',
      '소스코드 못 받았을 때',
      'GitHub 저장소 이관',
    ],
    ogTitle: '소스코드 통째 이관 | 외주에 묶이지 않는 개발 — 름랩',
    ogDescription:
      '소스코드·저장소·배포 권한·스토어 계정 전체 이관. 외주사 종속 없이 직접 통제하세요.',
    h1: '소스코드 이관 — 외주에 묶이지 않게',
    primary: '소스코드 이관',
    secondary: ['외주 개발 실패', '개발자 잠수', '소스코드 못 받았을 때', 'GitHub 저장소 이관'],
    intent: '문제 해결',
    funnel: '전환 직전',
    serviceDesc:
      '름랩은 모든 프로젝트에서 소스코드 전체, GitHub 저장소, 배포 권한, 스토어·서버 계정을 대표님 명의로 통째로 넘깁니다. 다른 개발사로 옮기거나 직접 운영·유지보수할 수 있는 상태로 납품하는 것이 기본 원칙입니다. 이미 다른 외주사에서 소스코드를 못 받았거나 일부만 받은 경우, 현황 점검과 이관 가능성 상담도 진행합니다. 간단한 수정은 AI 도구로 직접 할 수 있도록 1:1 운영 교육을 함께 제공합니다.',
    whyPoints: [
      '소스코드 전체·GitHub 저장소·배포 권한·스토어 계정 통째 이관',
      '외주사 종속 없이 다른 개발사 이전·직접 운영·유지보수 가능',
      '정액 패키지에 기본 포함 — 별도 비용 없음',
      '외주사에서 못 받은 경우 현황 점검·이관 가능성 상담',
    ],
    sections: [
      { h2: '소스코드를 꼭 받아야 하는 이유', body: '소스코드가 없으면 작은 수정도 그 외주사에만 맡겨야 하고, 연락이 끊기면 서비스 자체가 멈춥니다. 소스코드·저장소·배포 권한을 보유해야 다른 개발사로 옮기거나 직접 운영·유지보수할 수 있습니다. 외주 실패의 가장 큰 원인이 바로 소유권 미확보입니다.' },
      { h2: '무엇을 이관받나 (이관 범위)', body: '소스코드 전체, GitHub 저장소, 배포 권한, 앱스토어·플레이스토어 계정, 서버·도메인 권한, 실행에 필요한 문서를 대표님 명의로 넘깁니다. 외부 유료 서비스 계정은 프로젝트별로 안내합니다.' },
      { h2: '외주사에서 소스코드를 못 받았다면', body: '이미 다른 곳에서 소스코드를 못 받았거나 일부만 받은 경우, 현재 보유한 자료로 어디까지 이관·이전이 가능한지 현황을 점검해 드립니다. 계약·권한 관계에 따라 가능 범위가 달라지므로 상담에서 함께 확인합니다.' },
      { h2: '름랩의 이관 방식', body: '름랩은 모든 프로젝트에서 “만들고 끝”이 아니라 “운영 가능한 상태로 넘김”을 원칙으로 합니다. 납품 시 소스코드·저장소·권한을 통째로 이관하고, 비개발자 대표도 간단한 수정은 AI 도구로 직접 하도록 1:1 교육을 제공합니다.' },
    ],
    faqs: [
      { q: '소스코드 이관은 추가 비용인가요?', a: '아니요. 름랩 정액 패키지에는 소스코드·저장소·배포 권한 이관이 기본 포함입니다. 별도 비용이 없습니다.' },
      { q: '계약서에 소유권을 명시할 수 있나요?', a: '네. 소스코드·계정 소유권과 이관 범위를 계약 단계에서 명시합니다. 종속 없이 직접 통제할 수 있는 상태로 납품하는 것이 기본 원칙입니다.' },
      { q: '이미 다른 외주사에서 못 받았는데 도와줄 수 있나요?', a: '현황을 점검해 이관·이전 가능 범위를 안내합니다. 보유 자료와 권한 관계에 따라 가능 정도가 달라지므로 상담에서 함께 확인합니다.' },
    ],
    canonical: 'https://reumlab.com/source-handover/',
  },

  // ─── 고의도(전환) 신규 페이지 — 업체/회사 축은 기존 서비스 페이지로 흡수하고,
  //     여기서는 경쟁사 미점유 "문제 해결/기능" 토픽만 신설(자기잠식 방지) ───
  'admin-page-development': {
    title: '관리자 페이지 개발 외주 | 어드민·백오피스 맞춤 구축 — 름랩',
    description:
      '엑셀·수기로 하던 주문·회원·재고·정산 관리를 관리자(어드민) 페이지로 자동화합니다. 카페24·노코드로는 막히는 맞춤 백오피스를 정액으로 구축하고 소스코드 전체 이관 + 직접 운영 교육. 동탄·수원 거점, 전국 어디서나 진행.',
    keywords: [
      '관리자 페이지 개발',
      '어드민 페이지 개발',
      '백오피스 개발',
      '관리자 웹 개발',
      '관리자 페이지 제작',
      '어드민 개발',
    ],
    ogTitle: '관리자 페이지 개발 — 엑셀·수기 관리를 어드민 한 화면으로 | 름랩',
    ogDescription: '주문·회원·재고·정산을 한 화면에서. 맞춤 관리자(어드민) 페이지를 정액으로 구축하고 소스코드를 통째로 이관합니다.',
    h1: '관리자 페이지 개발 — 엑셀·수기 관리를 어드민 한 화면으로',
    primary: '관리자 페이지 개발',
    secondary: ['관리자 웹 개발', '어드민 페이지 개발', '백오피스 개발', '관리자 페이지 제작'],
    intent: '기능/전환',
    funnel: '전환',
    serviceDesc:
      '주문·회원·재고·정산·게시물처럼 매일 반복되는 운영 데이터를 하나의 관리자(어드민) 화면에서 처리하도록 맞춤 구축합니다. 카페24·노코드 템플릿으로는 막히는 화면·권한·집계도 코드로 직접 만들고, 완성 후 소스코드·저장소·배포 권한을 통째로 이관합니다. 비개발자 대표도 항목을 직접 수정하도록 1:1 운영 교육을 포함합니다.',
    whyPoints: [
      '엑셀·수기·카톡으로 흩어진 운영을 어드민 한 화면으로 통합 — 반복 작업·실수 감소',
      '템플릿이 막는 맞춤 화면·역할별 권한·통계 대시보드까지 코드로 직접 구현',
      '기존 앱·웹·쇼핑몰(카페24 등)에 관리자만 붙이는 부분 구축도 가능',
      '소스코드 전체 이관 + 직접 수정 1:1 교육 — 외주사 종속 없이 직접 운영',
    ],
    sections: [
      { h2: '관리자 페이지가 필요한 신호', body: '주문·회원·재고를 엑셀 여러 개로 관리하고 있거나, 담당자만 아는 수기 규칙으로 굴러가거나, 카페24·노코드 기본 관리자에서 원하는 화면·통계가 안 나올 때가 관리자 페이지를 만들 시점입니다. 사람이 옮겨 적는 과정에서 생기는 누락·중복·정산 오류를 화면 하나로 줄이는 것이 목적입니다.' },
      { h2: '무엇을 만드나 (기능 범위)', body: '주문·예약 접수와 상태 변경, 회원·고객 관리, 상품·재고·옵션, 정산·매출 집계, 게시물·공지 관리, 역할별 접근 권한, 엑셀 업로드/다운로드, 통계 대시보드를 업무 흐름에 맞춰 구성합니다. 처음부터 전부 넣기보다 매일 쓰는 핵심 화면부터 만들고 단계적으로 확장합니다.' },
      { h2: '기존 시스템에 관리자만 붙이기', body: '이미 운영 중인 앱·웹·쇼핑몰이 있다면 서비스는 그대로 두고 관리자(백오피스)만 별도로 붙이는 방식도 가능합니다. 데이터베이스나 API가 열려 있으면 연동하고, 없으면 엑셀·CSV 이관으로 시작해 관리 화면을 얹습니다.' },
      { h2: '진행 방식과 산출물', body: '업무 흐름 정리 → 화면·데이터 설계 → 개발 → 중간 확인 → 배포 → 소스코드·운영 교육 순으로 진행합니다. 산출물은 관리자 웹, 역할별 계정, 소스코드 전체, 실행 문서, 1:1 운영 교육입니다. 간단한 항목·문구 수정은 대표님이 직접 하실 수 있습니다.' },
    ],
    faqs: [
      { q: '카페24·아임웹 관리자로 안 되는 기능도 만들 수 있나요?', a: '네. 템플릿 관리자에서 막히는 맞춤 화면·권한·통계·자동화를 코드로 직접 구현합니다. 기존 쇼핑몰은 그대로 두고 필요한 관리 기능만 별도 백오피스로 붙이는 것도 가능합니다.' },
      { q: '엑셀로 관리하던 데이터를 옮길 수 있나요?', a: '가능합니다. 쓰시던 엑셀·CSV를 불러와 관리자에서 이어서 쓰도록 마이그레이션을 포함해 설계합니다. 이후에는 화면에서 직접 입력·수정합니다.' },
      { q: '관리자 페이지 개발 비용은 얼마인가요?', a: '화면 수·권한 구조·연동 범위로 정해집니다. 핵심 화면 중심이면 웹 관리자 수준의 견적으로 시작하고, 정산·연동·대시보드가 늘면 조정됩니다. 업무 흐름을 듣고 화면 단위로 산정해 먼저 공개합니다.' },
      { q: '직원마다 볼 수 있는 화면을 다르게 할 수 있나요?', a: '네. 관리자·매니저·직원처럼 역할별로 접근 권한과 노출 화면을 나눠 설계합니다. 민감한 정산·회원정보는 권한이 있는 계정만 보도록 구성합니다.' },
      { q: '완성 후 직접 수정할 수 있나요?', a: '소스코드를 통째로 이관하고, 항목·문구·기본 설정은 대표님이 직접 수정하도록 1:1 운영 교육을 제공합니다. 큰 기능 추가가 필요할 때만 추가 개발로 진행합니다.' },
    ],
    canonical: 'https://reumlab.com/admin-page-development/',
  },

  maintenance: {
    title: '앱·웹 유지보수 외주 | 타사 개발 앱 인수·수정 — 름랩',
    description:
      '다른 곳에서 만든 앱·웹의 유지보수, 기능 수정, 오류 대응을 이어받습니다. 소스코드가 있으면 인수 점검 후 바로, 없으면 이관 가능성부터 확인. 월 고정 계약 없이 필요할 때 정액으로. 동탄·수원 거점, 전국 진행.',
    keywords: [
      '앱 유지보수',
      '웹 유지보수',
      '기존 앱 수정',
      '개발 인수인계',
      '타사 앱 유지보수',
      '앱 유지보수 업체',
    ],
    ogTitle: '앱·웹 유지보수 — 타사 개발 앱도 이어받습니다 | 름랩',
    ogDescription: '만들다 만 앱, 연락 끊긴 외주사 앱, 오래된 웹까지. 인수 점검 후 유지보수·수정을 이어받고 소스코드를 정리해 드립니다.',
    h1: '앱·웹 유지보수 — 타사 개발 앱도 이어받습니다',
    primary: '앱 유지보수',
    secondary: ['웹 유지보수', '기존 앱 수정', '개발 인수인계', '타사 앱 유지보수'],
    intent: '문제 해결',
    funnel: '전환',
    serviceDesc:
      '이미 운영 중이거나 만들다 멈춘 앱·웹의 유지보수와 기능 수정을 이어받습니다. 소스코드·저장소가 있으면 구조를 점검한 뒤 바로 수정·개선을 진행하고, 없으면 어디까지 이관·복구가 가능한지부터 확인합니다. 월 고정 계약을 강제하지 않고 필요한 작업만 정액으로 처리하며, 이후에는 대표님이 직접 운영할 수 있게 정리해 드립니다.',
    whyPoints: [
      '연락 끊긴 외주사·잠수한 개발자로 멈춘 앱·웹을 인수해 이어서 진행',
      '소스코드 구조·배포 환경을 먼저 점검해 "고칠 수 있는 상태"인지 진단',
      '월 고정 관리비 강제 없이 필요한 수정·업데이트만 정액으로',
      '수정과 함께 저장소·배포 권한을 정리해 이관 — 다음부터 직접 운영 가능',
    ],
    sections: [
      { h2: '이런 경우 이어받습니다', body: '외주사와 연락이 끊겨 수정이 막힌 앱, 개발자가 퇴사·잠수해 방치된 서비스, 오래돼 스토어 정책·OS 업데이트로 오류가 나는 앱, 만들다 중단된 프로젝트를 인수해 진행합니다. 먼저 현재 상태를 점검하고, 무엇을 살리고 무엇을 다시 만들지 판단합니다.' },
      { h2: '인수 점검(코드 진단) 단계', body: '유지보수의 첫 단계는 넘겨받은 소스코드·저장소·배포 환경이 실제로 동작·수정 가능한 상태인지 확인하는 것입니다. 빌드가 되는지, 배포 권한과 계정이 있는지, 구조가 이어받을 만한지를 진단해 가능 범위와 리스크를 먼저 알려 드립니다.' },
      { h2: '소스코드가 없을 때', body: '소스코드를 받지 못했거나 일부만 있는 경우, 보유 자료와 계약·권한 관계로 어디까지 이관·복구가 가능한지 점검합니다. 복구가 어려우면 기존 데이터를 살려 같은 기능을 다시 만드는 편이 빠른 경우도 있어, 상담에서 함께 판단합니다.' },
      { h2: '유지보수 방식', body: '긴급 오류 대응, 기능 추가·개선, OS·스토어 정책 대응, 서버·배포 이전 등을 필요한 만큼 정액으로 진행합니다. 큰 개편이 필요하면 리뉴얼로 안내하고, 작업 후에는 저장소·배포 권한을 정리해 직접 운영 가능한 상태로 넘깁니다.' },
    ],
    faqs: [
      { q: '다른 업체가 만든 앱도 유지보수해 주나요?', a: '네. 소스코드·저장소가 있으면 구조를 점검한 뒤 수정·개선을 이어받습니다. 없으면 이관·복구 가능 범위부터 확인하고 시작합니다.' },
      { q: '소스코드를 못 받았는데 고칠 수 있나요?', a: '보유 자료와 권한 관계에 따라 다릅니다. 현황을 점검해 복구·이관 가능 범위를 알려 드리고, 복구가 어려우면 데이터를 살려 다시 만드는 방안도 함께 검토합니다.' },
      { q: '매달 고정 관리비를 꼭 내야 하나요?', a: '아니요. 월 고정 계약을 강제하지 않습니다. 필요한 수정·업데이트가 있을 때 정액으로 처리하고, 소스코드를 이관해 직접 운영하실 수 있게 합니다.' },
      { q: '유지보수 비용은 어떻게 정해지나요?', a: '작업 범위(오류 대응·기능 추가·이전 등)와 코드 상태로 정해집니다. 인수 점검으로 난이도를 먼저 확인한 뒤 작업 단위로 견적을 공개합니다.' },
      { q: '오래된 앱이 스토어에서 오류가 나는데 되나요?', a: 'OS·스토어 정책 변경으로 생긴 빌드·심사 오류 대응이 유지보수의 흔한 작업입니다. 점검 후 수정 범위와 일정을 안내해 다시 정상 배포되도록 진행합니다.' },
    ],
    canonical: 'https://reumlab.com/maintenance/',
  },

  renewal: {
    title: '웹사이트 리뉴얼 외주 | 홈페이지 개편·모바일·SEO — 름랩',
    description:
      '오래된 홈페이지를 모바일 반응형·검색 최적화로 리뉴얼합니다. 기존 콘텐츠를 살려 구조·디자인·속도를 개선하고, 소스코드 전체 이관 + 월 관리비 없음. 카페24·워드프레스·노코드에서 이전도 가능. 동탄·수원 거점, 전국 진행.',
    keywords: [
      '웹사이트 리뉴얼',
      '홈페이지 리뉴얼',
      '기존 사이트 개편',
      'SEO 리뉴얼',
      '홈페이지 개편',
      '반응형 리뉴얼',
    ],
    ogTitle: '웹사이트 리뉴얼 — 오래된 홈페이지를 검색되는 사이트로 | 름랩',
    ogDescription: '모바일에서 깨지고 검색에 안 잡히는 사이트를 반응형·SEO 기본기까지 갖춰 개편합니다. 소스코드 이관·월 관리비 없음.',
    h1: '웹사이트 리뉴얼 — 오래된 홈페이지를 검색되는 사이트로',
    primary: '웹사이트 리뉴얼',
    secondary: ['홈페이지 리뉴얼', '기존 사이트 개편', 'SEO 리뉴얼', '반응형 리뉴얼'],
    intent: '문제 해결',
    funnel: '전환',
    serviceDesc:
      '모바일에서 깨지거나, 검색에 안 잡히거나, 수정할 때마다 업체에 연락해야 하는 오래된 홈페이지를 개편합니다. 기존 텍스트·이미지·문의 이력을 최대한 살려 구조·디자인·속도·SEO 기본기를 다시 잡고, 완성 후 소스코드를 통째로 이관해 월 관리비 없이 직접 운영하도록 합니다. 카페24·워드프레스·노코드에서 벗어나 맞춤 사이트로 이전하는 것도 진행합니다.',
    whyPoints: [
      '모바일 반응형·페이지 속도·검색 노출(메타·구조화 데이터·사이트맵) 기본기 재정비',
      '기존 콘텐츠·문의 폼·유입 경로를 살려 리뉴얼 — 검색 순위 손실 최소화',
      '카페24·워드프레스·노코드 → 맞춤 사이트 이전 및 데이터 이관',
      '소스코드 전체 이관 + 월 관리비 없음 — 이후 문구·이미지는 직접 수정',
    ],
    sections: [
      { h2: '리뉴얼이 필요한 신호', body: '모바일에서 글자·버튼이 깨지거나, 네이버·구글에서 상호로도 잘 안 나오거나, 로딩이 느려 이탈이 잦거나, 작은 수정도 업체에 매번 맡겨야 한다면 리뉴얼 시점입니다. 디자인만 바꾸는 게 아니라 검색 노출과 문의 전환까지 함께 개선하는 것이 목적입니다.' },
      { h2: '기존 자산을 살리는 개편', body: '오래된 사이트라도 콘텐츠·후기·유입 경로에는 가치가 있습니다. 기존 URL·콘텐츠를 정리해 옮기고 필요한 곳에 301 리다이렉트를 설계해, 리뉴얼 후 검색 순위와 유입이 급락하지 않도록 이전합니다.' },
      { h2: 'SEO를 포함한 리뉴얼', body: '메타 태그·구조화 데이터(JSON-LD)·사이트맵·모바일 반응형·페이지 속도 같은 검색 기본기를 리뉴얼에 포함합니다. 광고 없이도 상호·지역·서비스 키워드로 검색에 잡히도록 구조를 잡아 문의로 이어지게 만듭니다.' },
      { h2: '플랫폼 이전(카페24·워드프레스·노코드)', body: '카페24·워드프레스·노코드 툴의 한계로 옮기려는 경우, 기존 데이터·콘텐츠를 살려 맞춤 사이트로 이전합니다. 이전 후에는 소스코드와 도메인·호스팅을 직접 보유하도록 정리해 종속과 월 비용을 줄입니다.' },
    ],
    faqs: [
      { q: '지금 쓰는 콘텐츠를 그대로 옮길 수 있나요?', a: '네. 기존 텍스트·이미지·문의 폼을 최대한 살려 옮기고, 필요한 부분만 새로 정리합니다. URL이 바뀌는 페이지는 301 리다이렉트로 검색 유입 손실을 줄입니다.' },
      { q: '리뉴얼하면 검색 순위가 떨어지지 않나요?', a: '기존 URL·콘텐츠를 보존하고 리다이렉트를 설계하면 순위 손실을 최소화할 수 있습니다. 오히려 모바일·속도·구조화 데이터 개선으로 노출이 좋아지는 경우가 많습니다.' },
      { q: '카페24·워드프레스에서 벗어나고 싶은데 가능한가요?', a: '가능합니다. 기존 데이터·콘텐츠를 이관해 맞춤 사이트로 옮기고, 소스코드·도메인·호스팅을 직접 보유하도록 정리합니다. 월 사용료·기능 제약에서 벗어날 수 있습니다.' },
      { q: '리뉴얼 후에도 매달 관리비가 드나요?', a: '름랩 웹은 월 관리비가 없습니다. 소스코드를 이관하고 문구·이미지 수정은 직접 하도록 교육합니다. 호스팅·도메인만 실비로 직접 보유하시면 됩니다.' },
      { q: '웹사이트 리뉴얼 비용은 얼마인가요?', a: '페이지 수·기능·이전 범위로 정해집니다. 콘텐츠를 살리는 개편은 신규 제작보다 합리적인 경우가 많고, 상담에서 현재 사이트를 보고 범위와 견적을 먼저 공개합니다.' },
    ],
    canonical: 'https://reumlab.com/renewal/',
  },

  'cafe24-limit': {
    title: '카페24 한계 넘는 맞춤개발 | 쇼핑몰 커스텀·관리자 — 름랩',
    description:
      '카페24 기본 기능·디자인·관리자로 안 되는 부분을 맞춤개발로 해결합니다. 커스텀 화면·자동화·외부 연동·별도 앱까지, 기존 쇼핑몰은 살리고 필요한 기능만 확장. 소스코드 이관·직접 운영. 동탄·수원 거점, 전국 진행.',
    keywords: [
      '카페24 한계',
      '카페24 커스텀 개발',
      '카페24 관리자페이지',
      '쇼핑몰 맞춤개발',
      '카페24 앱 개발',
      '쇼핑몰 커스텀',
    ],
    ogTitle: '카페24 한계, 맞춤개발로 넘기 | 름랩',
    ogDescription: '기본 기능·관리자·디자인으로 막힌 부분을 코드로 해결합니다. 쇼핑몰은 살리고 필요한 커스텀 기능만 붙입니다.',
    h1: '카페24 한계, 맞춤개발로 넘어서기',
    primary: '카페24 한계',
    secondary: ['카페24 커스텀 개발', '카페24 관리자페이지', '쇼핑몰 맞춤개발', '쇼핑몰 커스텀'],
    intent: '문제 해결',
    funnel: '중간',
    serviceDesc:
      '카페24로 시작했지만 기본 기능·디자인·관리자의 제약에 막혔다면, 그 한계 지점만 맞춤개발로 풀 수 있습니다. 쇼핑몰 자체는 살리면서 원하는 화면·자동화·외부 연동·별도 앱을 코드로 붙이거나, 필요하면 맞춤 사이트로 이전합니다. 완성 후 소스코드를 이관해 종속과 월 비용을 줄이도록 진행합니다.',
    whyPoints: [
      '기본 테마·앱스토어 앱으로 안 되는 맞춤 화면·기능을 코드로 직접 구현',
      '카페24 관리자에서 부족한 통계·자동화·주문 처리 흐름을 별도 백오피스로 보완',
      '쇼핑몰은 유지하고 필요한 기능만 확장 → 리스크·비용 최소화',
      '한계가 크면 데이터를 살려 맞춤 커머스로 이전, 소스코드 직접 보유',
    ],
    sections: [
      { h2: '카페24에서 자주 막히는 지점', body: '원하는 레이아웃·상세페이지 커스터마이징이 테마 한계에 걸리거나, 앱스토어 유료 앱을 여러 개 붙여도 딱 맞는 기능이 없거나, 관리자에서 원하는 통계·주문 자동화가 안 나오거나, 외부 시스템(ERP·물류·사내 툴)과 연동이 막히는 경우가 대표적입니다.' },
      { h2: '쇼핑몰을 살리면서 확장하기', body: '많은 경우 카페24를 버릴 필요는 없습니다. 기존 쇼핑몰은 그대로 두고, 부족한 부분만 맞춤 관리자·자동화 스크립트·별도 페이지나 앱으로 보완하는 것이 비용·리스크 면에서 유리합니다. 어디까지 카페24로 두고 어디를 맞춤으로 뺄지 먼저 정리합니다.' },
      { h2: '맞춤 커머스로 이전이 나은 경우', body: '수수료·기능 제약·확장성 문제가 반복되고 매출 규모가 커졌다면, 데이터를 살려 맞춤 커머스로 이전하는 편이 장기적으로 유리할 수 있습니다. 이전 시 상품·회원·주문 데이터를 이관하고 소스코드를 직접 보유하도록 설계합니다.' },
      { h2: '진행 방식', body: '현재 카페24 구성과 막힌 지점을 점검 → 카페24 유지/이전 범위 결정 → 맞춤 기능 개발·연동 → 검증 → 소스코드·운영 교육 순으로 진행합니다. 무리한 전면 이전보다 효과가 분명한 지점부터 푸는 방식을 권장합니다.' },
    ],
    faqs: [
      { q: '카페24를 버리지 않고 기능만 추가할 수 있나요?', a: '네. 대부분은 쇼핑몰을 유지한 채 부족한 화면·자동화·연동만 맞춤개발로 보완하는 것이 낫습니다. 어디를 유지하고 어디를 맞춤으로 뺄지 상담에서 함께 정합니다.' },
      { q: '카페24 관리자에서 안 나오는 통계·자동화도 되나요?', a: '가능합니다. 주문·매출·재고를 원하는 형태로 집계하는 별도 관리자(백오피스)나 자동화를 붙일 수 있습니다. 기존 데이터를 연동하거나 주기적으로 가져오는 방식으로 설계합니다.' },
      { q: '외부 시스템(ERP·물류)과 연동할 수 있나요?', a: '상대 시스템의 API 제공 여부에 따라 연동 범위가 달라집니다. 현재 사용 중인 시스템을 확인하고 가능한 연동과 대안을 먼저 정리해 드립니다.' },
      { q: '아예 맞춤 쇼핑몰로 옮기는 게 나을까요?', a: '수수료·기능 제약이 반복되고 규모가 커졌다면 이전이 유리할 수 있습니다. 다만 비용이 크므로, 먼저 막힌 지점만 맞춤으로 풀어 보고 판단하는 것을 권장합니다.' },
      { q: '비용은 어떻게 정해지나요?', a: '유지/이전 범위와 맞춤 기능의 복잡도로 정해집니다. 현재 카페24 구성을 보고 막힌 지점을 진단한 뒤 작업 단위로 견적을 공개합니다.' },
    ],
    canonical: 'https://reumlab.com/cafe24-limit/',
  },

  'nocode-limit': {
    title: '노코드 한계 넘는 맞춤개발 | 버블·웹플로우 이전 — 름랩',
    description:
      '노코드(버블·웹플로우·글라이드 등)로 만들다 성능·확장·비용·소유권에 막혔다면 맞춤개발로 넘어갈 시점입니다. 검증된 아이디어를 소스코드 기반으로 다시 세우고 데이터 이관·전체 이관. 동탄·수원 거점, 전국 진행.',
    keywords: [
      '노코드 한계',
      '노코드 vs 맞춤개발',
      '버블 앱 한계',
      '웹플로우 한계',
      '노코드 이전',
      '노코드 앱 개발',
    ],
    ogTitle: '노코드 한계, 맞춤개발로 넘기 | 름랩',
    ogDescription: '노코드로 검증은 끝났는데 성능·확장·비용에 막혔다면, 소스코드 기반 맞춤개발로 옮길 시점입니다. 데이터 살려 이전합니다.',
    h1: '노코드 한계, 맞춤개발로 넘어서기',
    primary: '노코드 한계',
    secondary: ['노코드 vs 맞춤개발', '버블 앱 한계', '웹플로우 한계', '노코드 이전'],
    intent: '문제 해결',
    funnel: '중간',
    serviceDesc:
      '버블·웹플로우·글라이드 같은 노코드 툴은 검증에는 훌륭하지만, 사용자가 늘고 기능이 복잡해지면 성능·확장성·월 비용·소유권에서 벽에 부딪힙니다. 름랩은 노코드로 검증된 아이디어를 소스코드 기반 앱·웹으로 다시 세우고, 기존 데이터를 이관해 같은 흐름을 유지하면서 확장 가능한 구조로 옮깁니다. 완성 후 소스코드를 통째로 이관합니다.',
    whyPoints: [
      '노코드로 검증한 흐름을 살려 소스코드 기반으로 재구축 — 확장·성능 한계 해소',
      '월 구독·사용량 요금 대신 소유하는 코드로 전환 — 장기 비용·종속 감소',
      '기존 데이터·사용자·화면 흐름을 이관해 연속성 유지',
      '검증은 노코드, 확장은 맞춤개발 — 단계에 맞는 선택을 함께 판단',
    ],
    sections: [
      { h2: '노코드가 막히는 지점', body: '사용자·데이터가 늘며 느려지거나, 원하는 로직·연동·결제 흐름이 툴의 제약에 걸리거나, 규모가 커질수록 월 요금이 부담되거나, 앱스토어 정식 출시·세밀한 UX가 어려운 경우가 대표적입니다. 무엇보다 서비스가 특정 플랫폼에 종속돼 소유권·이전이 자유롭지 않다는 점이 큽니다.' },
      { h2: '언제 옮기고 언제 남을지', body: '아직 검증 중이라면 노코드가 더 빠르고 쌉니다. 반대로 검증이 끝나 트래픽·결제·복잡한 로직이 필요해졌다면 맞춤개발이 유리합니다. 지금 단계가 어디인지부터 진단해, 무리한 이전 대신 필요한 시점에 옮기도록 안내합니다.' },
      { h2: '데이터를 살려 이전하기', body: '이전의 핵심은 기존 사용자·콘텐츠·화면 흐름을 잃지 않는 것입니다. 노코드 툴에서 데이터를 추출해 새 구조로 이관하고, 익숙한 흐름은 유지하면서 성능·확장성만 개선합니다. 필요하면 핵심 기능부터 옮기고 단계적으로 완전 이전합니다.' },
      { h2: '진행 방식과 소유권', body: '현재 노코드 구성 점검 → 이전/유지 범위 결정 → 소스코드 기반 재구축 → 데이터 이관 → 검증 → 소스코드·저장소·배포 권한 이관 순으로 진행합니다. 이전 후에는 플랫폼 종속 없이 직접 운영·확장할 수 있습니다.' },
    ],
    faqs: [
      { q: '버블·웹플로우로 만든 걸 그대로 옮길 수 있나요?', a: '화면·로직을 1:1로 복사하진 않지만, 검증된 흐름과 데이터를 살려 같은 사용자 경험을 소스코드 기반으로 재구축합니다. 데이터는 추출해 새 구조로 이관합니다.' },
      { q: '아직 노코드로 충분한지, 옮겨야 할지 모르겠어요.', a: '단계 진단부터 도와드립니다. 검증 중이면 노코드 유지가 낫고, 트래픽·결제·복잡 로직이 필요해졌다면 이전이 유리합니다. 무리한 이전을 권하지 않습니다.' },
      { q: '노코드보다 맞춤개발이 비싸지 않나요?', a: '초기 개발비는 더 들 수 있지만, 규모가 커지면 노코드 월 요금·제약이 누적됩니다. 소유하는 코드로 전환하면 장기 비용과 종속을 줄일 수 있어, 시점을 함께 계산해 판단합니다.' },
      { q: '기존 사용자 데이터를 잃지 않고 옮길 수 있나요?', a: '네. 노코드 툴에서 데이터를 추출해 새 구조로 이관하는 것을 이전 설계에 포함합니다. 핵심 기능부터 옮겨 연속성을 유지하며 단계적으로 이전할 수도 있습니다.' },
      { q: '옮긴 뒤에는 누가 운영하나요?', a: '완성 후 소스코드·저장소·배포 권한을 통째로 이관합니다. 플랫폼 종속 없이 직접 운영·확장할 수 있고, 간단한 수정은 1:1 교육으로 직접 하실 수 있습니다.' },
    ],
    canonical: 'https://reumlab.com/nocode-limit/',
  },

  // ─── 한글 "업체/회사" 고의도 랜딩 — 영문 랜딩(app-development/web-development)과
  //     검색어(한글 vs 영문)가 달라 자기잠식 아님. 지역 pSEO의 "[지역] 앱개발 업체"의 전국 허브 역할 ───
  'app-agency': {
    title: '앱개발 업체 | 소스코드 주는 앱 제작 외주 — 름랩',
    description:
      '앱개발 업체를 찾는 대표님께 — Flutter로 iOS·Android를 한 번에 만들고, 완성 후 소스코드·저장소·배포 권한을 통째로 넘깁니다. VAT 포함 290만 원부터 정액, 숨은 비용 없음. 동탄·수원 거점, 전국 어디서나 진행.',
    keywords: [
      '앱개발 업체',
      '앱개발 회사',
      '앱 제작 업체',
      '앱개발 외주 업체',
      '앱 제작 회사',
      'MVP 개발 업체',
    ],
    ogTitle: '앱개발 업체 — 소스코드까지 넘기는 앱 제작 외주 | 름랩',
    ogDescription: '업체에 묶이지 않는 앱개발. Flutter로 빠르게 만들고 소스코드를 통째로 이관합니다. 정액·선공개 견적.',
    h1: '앱개발 업체 찾는 대표님께 — 소스코드까지 넘기는 앱 제작',
    primary: '앱개발 업체',
    secondary: ['앱개발 회사', '앱 제작 업체', '앱개발 외주 업체', 'MVP 개발 업체'],
    intent: '업체 비교/견적',
    funnel: '전환 직전',
    serviceDesc:
      '앱개발 업체를 고를 때 가장 중요한 건 "만든 뒤에도 대표님이 통제할 수 있는가"입니다. 름랩은 Flutter로 iOS·Android를 한 번에 만들고, 완성 후 소스코드·GitHub 저장소·배포 권한·스토어 계정을 통째로 이관합니다. 견적과 일정을 먼저 공개하는 VAT 포함 정액이라 숨은 비용이 없고, 비개발자 대표도 간단한 수정은 직접 하도록 1:1 운영 교육을 드립니다.',
    whyPoints: [
      '소스코드·저장소·배포 권한 전체 이관 — 업체에 종속되지 않음',
      'VAT 포함 정액·선공개 견적 — 추가 비용 협상 없음(290만 원부터)',
      'Flutter로 iOS·Android 동시 제작 — 비용·기간 절감',
      '대표가 직접 소통·직접 수정 교육 — 만든 뒤에도 스스로 운영',
    ],
    sections: [
      { h2: '앱개발 업체 고를 때 확인할 것', body: '소스코드와 저장소·배포 권한을 주는지, 견적이 정액인지 시간제인지, 담당자가 계속 소통 가능한지, 유지보수·이관 조건이 계약에 있는지를 먼저 확인하세요. 특히 소스코드를 안 주는 업체는 작은 수정도 계속 그 업체에만 맡겨야 해 종속됩니다. 름랩은 이 네 가지를 모두 계약 단계에서 명시합니다.' },
      { h2: '름랩이 다른 점', body: '많은 외주가 "완성 후 종속"으로 끝납니다. 름랩은 "운영 가능한 상태로 넘김"을 원칙으로, 소스코드·계정·문서를 대표님 명의로 이관하고 직접 수정 교육까지 제공합니다. 다른 개발사로 옮기거나 내부 팀이 이어받는 것도 자유롭습니다.' },
      { h2: '비용과 기간', body: '앱 라이트 MVP는 VAT 포함 290만 원·약 14일, 회원·결제·관리자까지 갖춘 앱 스탠다드는 490만 원·약 21일입니다. 결제·복잡한 관리자·외부 연동은 범위에 따라 별도로 안내되며, 숨은 비용 없이 상담에서 미리 정합니다.' },
      { h2: '진행 방식', body: '아이디어·핵심 기능 정리 → 화면·흐름 확정 → 개발 → 중간 확인 → 스토어 등록 → 소스코드·권한 이관 → 운영 교육 순으로 진행합니다. 기획서가 없어도 꼭 필요한 기능 한두 가지만 있으면 상담을 시작할 수 있습니다.' },
    ],
    faqs: [
      { q: '앱개발 업체 중 소스코드를 주는 곳이 드물던데요?', a: '름랩은 모든 프로젝트에서 소스코드 전체·저장소·배포 권한·스토어 계정을 대표님 명의로 이관합니다. 계약서에도 소유권과 이관 범위를 명시합니다.' },
      { q: '앱개발 업체 견적은 어떻게 받나요?', a: '기능 범위를 듣고 VAT 포함 정액으로 선공개합니다. 앱 라이트 290만 원, 앱 스탠다드 490만 원을 기준으로 범위에 맞춰 조정하며, 상담 단계에서 미리 확정합니다.' },
      { q: '작은 회사인데 대형 업체보다 괜찮을까요?', a: '름랩은 대표가 직접 소통·진행하는 스튜디오라 의사결정이 빠르고, 정액·소스코드 이관으로 리스크가 낮습니다. MVP·중소 규모 서비스에는 오히려 합리적인 선택입니다.' },
      { q: '지역이 다른데 진행되나요?', a: '동탄·수원 거점이지만 화상 상담·중간 확인·소스코드 이관 기반의 비대면 협업으로 전국 어디든 같은 조건으로 진행합니다.' },
      { q: '만든 뒤 다른 업체로 옮길 수 있나요?', a: '네. 소스코드·저장소·권한을 통째로 이관하므로 다른 개발사로 옮기거나 직접 운영·유지보수할 수 있습니다. 종속되지 않는 것이 기본 원칙입니다.' },
    ],
    canonical: 'https://reumlab.com/app-agency/',
  },

  'website-agency': {
    title: '홈페이지 제작 업체 | 검색되는 웹사이트 외주 49만원~ — 름랩',
    description:
      '홈페이지 제작 업체를 찾는 대표님께 — 검색에 잡히고 문의로 이어지는 반응형 웹사이트를 정액 49만 원부터. 소스코드 전체 이관·월 관리비 없음. SEO 기본기 포함. 동탄·수원 거점, 전국 어디서나 진행.',
    keywords: [
      '홈페이지 제작 업체',
      '웹사이트 제작 업체',
      '웹개발 업체',
      '소상공인 홈페이지 제작',
      '홈페이지 외주',
      '반응형 홈페이지 제작',
    ],
    ogTitle: '홈페이지 제작 업체 — 검색되고 소스코드 주는 곳 | 름랩',
    ogDescription: '광고비 없이도 검색에 잡히는 홈페이지를 정액 49만 원부터. 소스코드 이관·월 관리비 없음.',
    h1: '홈페이지 제작 업체 찾을 때 — 검색되고 소스코드 주는 곳',
    primary: '홈페이지 제작 업체',
    secondary: ['웹사이트 제작 업체', '웹개발 업체', '소상공인 홈페이지 제작', '홈페이지 외주'],
    intent: '업체 비교/견적',
    funnel: '전환 직전',
    serviceDesc:
      '홈페이지 제작 업체를 고를 때는 "검색에 잡히는가"와 "만든 뒤 직접 고칠 수 있는가"가 핵심입니다. 름랩은 메타·구조화 데이터·사이트맵 같은 SEO 기본기를 포함해 반응형 웹사이트를 정액 49만 원부터 제작하고, 소스코드를 통째로 이관해 월 관리비 없이 직접 운영하도록 합니다. 문구·이미지 수정은 대표님이 직접 하도록 1:1 교육을 드립니다.',
    whyPoints: [
      '검색 노출(메타·JSON-LD·사이트맵) 기본기 포함 — 광고 없이도 유입',
      '정액 49만 원부터 · 월 관리비 없음 · 소스코드 전체 이관',
      '반응형(모바일·태블릿·PC) + 예약·문의 CTA·폼 연동',
      '문구·이미지 직접 수정 1:1 교육 — 업체에 매번 연락할 필요 없음',
    ],
    sections: [
      { h2: '홈페이지 제작 업체 고를 때 확인할 것', body: '검색 노출(SEO) 기본기가 들어가는지, 월 관리비·유지비 구조가 어떤지, 소스코드와 도메인·호스팅을 직접 보유하는지, 완성 후 직접 수정이 가능한지를 확인하세요. 저렴해 보여도 월 사용료·수정비가 누적되면 총비용이 커집니다. 름랩은 정액·월 관리비 없음·소스코드 이관을 기본으로 합니다.' },
      { h2: '검색되는 홈페이지', body: '단순히 예쁜 사이트가 아니라, 상호·지역·서비스 키워드로 검색에 잡혀 문의로 이어지는 것이 목적입니다. 메타 태그·구조화 데이터(JSON-LD)·사이트맵·모바일 반응형·속도 같은 기본기를 제작에 포함해, 광고 없이도 손님이 찾아오도록 구조를 잡습니다.' },
      { h2: '비용과 패키지', body: '원페이지 랜딩 웹 스타터는 VAT 포함 49만 원부터, 멀티페이지+CMS+블로그를 갖춘 웹 비즈니스 패키지는 190만 원·약 14일입니다. 월 관리비가 없고, 호스팅·도메인은 대표님 명의로 직접 보유하도록 안내합니다.' },
      { h2: '진행 방식', body: '목적·필요 페이지 정리 → 구조·디자인 확정 → 제작 → 검토 → 배포 → 소스코드·운영 교육 순으로 진행합니다. 소상공인·1인 사업자는 꼭 필요한 페이지부터 작게 시작해 비용을 합리적으로 맞춥니다.' },
    ],
    faqs: [
      { q: '홈페이지 제작 업체인데 월 관리비가 정말 없나요?', a: '네. 름랩 웹은 월 관리비가 없습니다. 소스코드를 이관하고 호스팅·도메인은 대표님 명의로 직접 보유하도록 안내합니다. 문구·이미지 수정은 직접 하실 수 있습니다.' },
      { q: '검색에 잘 나오게 만들어 주나요?', a: '메타·구조화 데이터·사이트맵·모바일 반응형 같은 SEO 기본기를 제작에 포함합니다. 상호·지역·서비스 키워드로 검색에 잡히도록 구조를 잡아 문의로 이어지게 합니다.' },
      { q: '가장 저렴한 홈페이지는 얼마인가요?', a: '원페이지 랜딩 웹 스타터가 VAT 포함 49만 원부터입니다. 필요한 페이지·기능이 늘면 웹 비즈니스 패키지(190만 원)로 확장하며, 상담에서 범위와 견적을 먼저 공개합니다.' },
      { q: '만든 뒤 제가 직접 수정할 수 있나요?', a: '네. 소스코드를 이관하고, 연락처·가격·문구·이미지·블로그를 직접 수정·게시하도록 관리 화면과 1:1 운영 교육을 제공합니다.' },
      { q: '지역이 다른데 제작 가능한가요?', a: '동탄·수원 거점이지만 비대면 협업으로 전국 어디든 같은 조건으로 진행합니다. 필요한 경우 일정을 조율해 대면도 가능합니다.' },
    ],
    canonical: 'https://reumlab.com/website-agency/',
  },
};

// File2 연관키워드(관련 검색어) 반영 — 필러별 보조 키워드를 keywords 에 중복 없이 병합.
// (버퍼 의도 학습·언어 키워드는 lib/keyword-coverage.ts 에서 이미 제외됨)
for (const [slug, extra] of Object.entries(RELATED_KEYWORDS_BY_PILLAR)) {
  const seo = PAGE_SEO_MAP[slug];
  if (seo) seo.keywords = mergeRelatedKeywords(slug, seo.keywords);
}

/**
 * 얇은(meta-only) 한글 pillar 정리.
 * - REDIRECTED: 충실한 한글 페이지가 따로 있어 301 (정적 생성 제외 → public/_redirects 301 발동)
 * - NOINDEX: 충실한 한글 트윈이 없어 우선 noindex,follow + 사이트맵 제외 (본문 보강 시 재색인)
 * (영문 슬러그 app-development/web-development 등은 영어 페이지라 통합 대상이 아님)
 */
export const REDIRECTED_PILLAR_SLUGS = new Set(['스타트업MVP', '앱개발', '솔루션SaaS']);
export const NOINDEX_PILLAR_SLUGS = new Set(['웹개발', '플랫폼개발', '기업용ERP']);

export const ALL_SLUGS = Object.keys(PAGE_SEO_MAP).filter(
  (s) => s !== '' && !REDIRECTED_PILLAR_SLUGS.has(s),
);

export function getSeoBySlug(slug: string): PageSeo | undefined {
  return PAGE_SEO_MAP[slug];
}
