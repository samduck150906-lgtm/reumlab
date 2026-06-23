export const SITE = {
  name: '름랩',
  nameEn: 'REUMLAB',
  domain: 'https://reumlab.com',
  defaultOgImage: 'https://reumlab.com/og-image.jpg',
  phone: '010-8111-9370',
  /** tel: 링크용 (하이픈 제거) */
  phoneHref: 'tel:01081119370',
  address: '경기도 수원시 팔달구 인계로124번길 19, 12층 1208호(인계동)',
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
    // 'https://blog.naver.com/...',     // 네이버 블로그
    // 'https://www.instagram.com/...',  // 인스타그램
    // 'https://www.youtube.com/@...',   // 유튜브
    // 'https://github.com/...',         // GitHub / 포트폴리오
    // 'https://www.google.com/maps/...',// 구글 비즈니스 프로필
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
    title: '름랩 REUMLAB | Flutter 앱개발, 랜딩페이지 제작, MVP 외주개발 — 수원 개발 스튜디오',
    description:
      '수원 인계동 외주개발 스튜디오 름랩. Flutter 앱개발·MVP 개발·랜딩페이지 제작·홈페이지 제작·AI 기능 개발. 소스코드 전체 이관 + 직접 운영 1:1 교육 포함. VAT 포함 499만 원부터.',
    keywords: [
      '외주개발',
      '앱개발 외주',
      'Flutter 앱개발',
      'MVP 개발',
      '랜딩페이지 제작',
      '홈페이지 제작',
      '수원 앱개발',
      '수원 외주개발',
      '소스코드 이관',
      '스타트업 MVP',
    ],
    ogTitle: '외주 맡긴 앱, 다시는 외주에 묶이지 않게. | 름랩 REUMLAB',
    ogDescription:
      '앱·웹 MVP 개발 + AI 직접 운영 교육. Flutter 앱·웹 MVP를 빠르게 만들고 소스코드·권한을 통째로 넘깁니다.',
    h1: '외주 맡긴 앱, 다시는 외주에 묶이지 않게',
    canonical: 'https://reumlab.com/',
  },

  // ─── 서비스별 페이지 (AI 단어 제거) ───
  웹개발: {
    title: '웹사이트 제작 외주 | 반응형 웹 MVP 149만원 정액 — 름랩 REUMLAB',
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
    ogTitle: '전문 웹 개발 및 홈페이지 제작 | 름랩',
    ogDescription: '사용자 경험을 최우선으로 하는 고품질 웹 구축 솔루션.',
    h1: '성공적인 비즈니스를 위한 웹 개발 및 제작',
    canonical: 'https://reumlab.com/웹개발',
  },

  앱개발: {
    title: '앱개발 외주 | Flutter iOS·안드로이드 MVP 499만원 정액 — 름랩',
    description:
      'iOS·Android 네이티브 및 하이브리드 앱 제작. 안정적인 성능과 최적의 UX를 구현합니다.',
    keywords: [
      '앱 개발',
      '어플 제작',
      '모바일 앱',
      'React Native 개발',
      'Flutter 앱',
      'iOS 안드로이드 앱',
    ],
    ogTitle: '사용자가 만족하는 모바일 앱 개발 | 름랩',
    ogDescription: '기획부터 스토어 등록까지, 완벽한 모바일 비즈니스 앱 구축.',
    h1: '비즈니스 경쟁력을 높이는 Flutter 앱 MVP 개발',
    canonical: 'https://reumlab.com/앱개발',
  },

  스타트업MVP: {
    title: '스타트업 MVP 개발 외주 | 3주 출시·소스코드 이관 — 름랩 REUMLAB',
    description:
      '가장 빠른 시장 검증을 위한 MVP 기획 및 개발. 불필요한 비용 없이 핵심 가치를 구축합니다.',
    keywords: [
      '스타트업 MVP',
      'MVP 제작',
      '최소 기능 제품 개발',
      '스타트업 외주',
      '신규 서비스 구축',
    ],
    ogTitle: '빠른 실행력을 위한 스타트업 MVP 개발 | 름랩',
    ogDescription: '아이디어를 현실로. 가장 효율적인 방식으로 시장 반응을 확인하세요.',
    h1: '아이디어를 검증하는 가장 빠른 방법, MVP 개발',
    canonical: 'https://reumlab.com/스타트업MVP',
  },

  솔루션SaaS: {
    title: 'B2B 솔루션 & SaaS 개발 | 름랩 (REUMLAB)',
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
    canonical: 'https://reumlab.com/솔루션SaaS',
  },

  플랫폼개발: {
    title: '플랫폼 및 O2O 시스템 구축 | 름랩 (REUMLAB)',
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
    canonical: 'https://reumlab.com/플랫폼개발',
  },

  기업용ERP: {
    title: '맞춤형 ERP & 인트라넷 개발 | 름랩 (REUMLAB)',
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
    canonical: 'https://reumlab.com/기업용ERP',
  },

  // ─── 영문 서비스 URL (구글 광고 랜딩 + 영문 검색) ───
  'app-development': {
    title: 'App Development Outsourcing Korea | Flutter MVP | REUMLAB',
    description:
      'Flutter app development studio in Suwon, Korea. iOS + Android in one codebase. MVP in ~21 days. Full source code handover + 1:1 operation training. From ₩4,990,000 VAT incl.',
    keywords: [
      '앱개발 외주',
      'Flutter 앱개발',
      'app development Korea',
      'Flutter MVP',
      '앱개발 견적',
      'mobile app outsourcing',
    ],
    ogTitle: 'Flutter App Development | MVP in 21 Days | REUMLAB Korea',
    ogDescription: 'One codebase, iOS + Android. Full source handover. Suwon-based studio serving all of Korea.',
    h1: '앱개발 외주 · App Development',
    serviceDesc: '름랩은 Flutter로 iOS·Android 앱을 한 번에 만듭니다. VAT 포함 499만 원, 약 21일, 소스코드 전체 이관. 구글 광고·영문 검색으로 유입된 고객도 동일한 조건으로 상담합니다.',
    canonical: 'https://reumlab.com/app-development',
  },

  'web-development': {
    title: 'Web Development & Landing Page Korea | REUMLAB',
    description:
      'Custom website and landing page development in Korea. SEO-ready, source code included, no monthly fees. From ₩1,490,000 VAT incl. Suwon studio.',
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
    serviceDesc: '름랩 STANDARD 패키지는 VAT 포함 149만 원, 약 14일입니다. 맞춤 제작, 소스코드 전체 이관, 월 관리비 없음. SEO 기본기(메타·구조화 데이터·사이트맵)가 기본 포함됩니다.',
    canonical: 'https://reumlab.com/web-development',
  },

  'mvp-development': {
    title: 'MVP Development Korea | 3-Week Launch | REUMLAB',
    description:
      'Startup MVP development in Korea. Flutter cross-platform, 3-week turnaround, full source handover. Validate your idea before scaling. From ₩4,990,000.',
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
    serviceDesc: '검증에 필요한 최소 기능만 빠르게 만듭니다. Flutter로 iOS·Android 동시 출시, 소스코드 전체 이관, 직접 운영 교육 포함. VAT 포함 499만 원, 약 21일.',
    canonical: 'https://reumlab.com/mvp-development',
  },

  'flutter-development': {
    title: 'Flutter App Development Studio Korea | REUMLAB',
    description:
      'Flutter specialist studio in Suwon Korea. One codebase for iOS and Android. 50–70% cost vs native. Full source handover + operation training.',
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
    serviceDesc: 'Flutter 크로스플랫폼은 네이티브 2벌 대비 비용 50~70% 절감. 유지보수도 구조적으로 절반. 소스코드 전체 이관, 직접 수정 교육 포함. VAT 499만 원.',
    canonical: 'https://reumlab.com/flutter-development',
  },

  // ─── 지역×서비스(pSEO) 허브 — 한글 서비스 슬러그 ───
  mvp: {
    title: 'MVP 개발 외주 | 지역별 스타트업 MVP — 름랩 REUMLAB',
    description:
      '검증에 필요한 핵심 기능부터 빠르게 출시하는 MVP 개발. Flutter 크로스플랫폼, 14~30일, VAT 포함 499만 원부터. 소스코드 전체 이관 + 직접 운영 교육. 수원 거점, 전국 어디서나 진행.',
    keywords: ['MVP 개발', 'MVP 외주', '스타트업 MVP', '최소 기능 제품', 'Lean MVP', '앱개발 외주'],
    ogTitle: 'MVP 개발 외주 | 핵심 기능부터 빠르게 — 름랩',
    ogDescription: '시장 검증에 필요한 핵심 기능부터 Lean MVP로. 소스코드 전체 이관 + 직접 운영 교육.',
    h1: 'MVP 개발 외주',
    serviceDesc:
      '시장 검증에 필요한 핵심 기능부터 만드는 Lean MVP. 화면 흐름 설계 → 중간 확인 → 소스코드 이관 순서로 진행합니다. VAT 포함 499만 원부터, 약 14~30일. 전국 어디서나 같은 패키지로 진행합니다.',
    whyPoints: [
      '검증에 필요한 핵심 기능만 추려 14~30일에 출시 — 예산·실패 리스크 최소화',
      'VAT 포함 정액(499만 원부터)으로 가격 먼저 공개, 숨은 비용 없음',
      '소스코드·저장소·배포 권한 전체 이관 — 검증 후 같은 코드 위에서 확장',
      '비개발자 대표도 직접 운영하도록 AI 운영 1:1 교육 포함',
    ],
    sections: [
      { h2: 'MVP 개발 비용과 기간', body: 'MVP 비용은 기능 범위·화면 수·관리자/연동 여부로 정해집니다. 름랩 Lean MVP는 VAT 포함 499만 원부터, 약 14~30일입니다. 웹 중심 MVP는 STANDARD(149만 원·약 14일), 앱 MVP는 DELUXE(499만 원·약 21일), AI·고도화가 필요하면 PREMIUM(799만 원·약 30일)으로 매핑됩니다.' },
      { h2: 'MVP에 넣을 것 vs 빼야 할 것', body: '검증 목표(투자·영업·사용자 테스트)에 직접 필요한 기능만 넣습니다. 회원·결제·관리자 중 검증에 꼭 필요한 흐름만 남기고, 부가 기능·예외 처리·확장 옵션은 검증 후로 미룹니다. 처음부터 다 넣으면 비용과 기간이 두세 배로 늘고 출시가 늦어집니다.' },
      { h2: '진행 프로세스', body: '핵심 기능 범위 설계 → 화면·흐름 확정 → 개발 → 중간 확인으로 방향 조정 → 소스코드·문서 이관 → 직접 운영 교육 순서로 진행합니다. 중간 확인 단계가 “생각과 다른 결과물” 리스크를 줄입니다.' },
      { h2: '이런 경우 적합 / 부적합', body: '적합: 아이디어를 빠르게 시장에서 검증하려는 초기 창업자·스타트업, 투자·데모데이용 데모가 필요한 팀. 부적합: 처음부터 대규모 트래픽·복잡한 정산·고성능 그래픽이 핵심인 서비스는 MVP보다 본개발 설계가 먼저입니다.' },
    ],
    faqs: [
      { q: 'MVP는 일반 앱개발과 무엇이 다른가요?', a: '모든 기능을 한 번에 만들지 않고 검증에 꼭 필요한 핵심부터 빠르게 출시하는 방식입니다. 초기 비용과 실패 리스크를 줄이고, 반응을 본 뒤 같은 코드 위에서 확장합니다.' },
      { q: 'MVP 개발 비용은 얼마인가요?', a: '기능 범위가 가격을 정합니다. 름랩 Lean MVP는 VAT 포함 499만 원부터, 약 14~30일입니다. 상담에서 검증 목표에 맞춰 범위와 패키지를 함께 정합니다.' },
      { q: '검증 후 확장은 어떻게 하나요?', a: '소스코드와 저장소를 통째로 이관하므로 같은 코드 위에서 기능을 단계적으로 추가합니다. 내부 개발팀이 생기면 그대로 이어받을 수 있습니다.' },
    ],
    canonical: 'https://reumlab.com/mvp',
  },

  flutter: {
    title: 'Flutter 앱개발 외주 | iOS·안드로이드 동시 — 름랩 REUMLAB',
    description:
      'Flutter 하나로 iOS·Android 앱을 동시에. 네이티브 2벌 대비 개발 비용 50~70% 절감, 유지보수도 절반. VAT 포함 499만 원부터, 소스코드 전체 이관 + 직접 운영 교육. 수원 거점, 전국 어디서나 진행.',
    keywords: ['Flutter 앱개발', 'Flutter 외주', '크로스플랫폼 개발', 'Flutter MVP', '앱개발 외주', 'iOS 안드로이드 앱'],
    ogTitle: 'Flutter 앱개발 외주 | 하나의 코드로 두 플랫폼 — 름랩',
    ogDescription: '하나의 코드로 iOS·Android 동시 제작. MVP 단계 시간·비용을 줄이는 Flutter 앱개발.',
    h1: 'Flutter 앱개발 외주',
    serviceDesc:
      'Flutter 크로스플랫폼으로 iOS·Android를 한 번에 만듭니다. 네이티브 2벌 대비 비용 50~70% 절감, 유지보수도 구조적으로 절반. 소스코드 전체 이관, 직접 수정 교육 포함. VAT 포함 499만 원부터.',
    whyPoints: [
      '하나의 코드로 iOS·Android 동시 출시 — 네이티브 2벌 대비 비용 50~70% 절감',
      '유지보수도 구조적으로 절반 — 출시 후 운영비까지 줄임',
      'VAT 포함 499만 원부터 정액, 소스코드 전체 이관',
      'MVP·중소 규모 서비스 앱에 최적, 직접 수정 교육 포함',
    ],
    sections: [
      { h2: 'Flutter가 비용을 줄이는 이유', body: 'iOS·Android를 따로 만들면 인력·기간·유지보수가 두 벌 듭니다. Flutter는 하나의 코드베이스로 두 플랫폼을 함께 만들어 개발 비용을 50~70% 줄이고, 이후 수정·업데이트도 한 번에 반영돼 유지보수가 구조적으로 절반입니다.' },
      { h2: 'Flutter가 맞는 경우 / 아닌 경우', body: '맞는 경우: 커머스·예약·커뮤니티·구독처럼 일반 비즈니스 앱, iOS·Android 동시 출시가 필요한 MVP. 아닌 경우: 고사양 3D 게임, 실시간 영상 처리처럼 플랫폼 네이티브 성능이 핵심인 영역은 네이티브를 검토합니다. 상담에서 적합성을 먼저 판단합니다.' },
      { h2: '진행 방식과 산출물', body: '화면·흐름 확정 → 핵심 기능 중심 개발 → 중간 확인 → 스토어 등록 → 소스코드·저장소·배포 권한 이관 순으로 진행합니다. 산출물은 iOS·Android 앱, 관리자/연동 기능, 소스코드 전체, 실행 문서, 1:1 운영 교육입니다.' },
      { h2: '비용·기간', body: 'Flutter 앱 MVP는 VAT 포함 499만 원부터, 약 21일입니다. 결제·복잡한 관리자·외부 API·서버 비용·스토어 계정은 범위에 따라 별도 안내되며, 숨은 비용 없이 상담 단계에서 미리 정합니다.' },
    ],
    faqs: [
      { q: 'Flutter로 만들면 네이티브보다 품질이 떨어지나요?', a: 'MVP·중소 규모 서비스에서는 체감 차이가 거의 없습니다. 고사양 게임·실시간 영상이 아니라면 출시 속도와 유지보수 비용에서 오히려 유리합니다.' },
      { q: 'iOS와 Android 둘 다 나오나요?', a: '네. 하나의 코드로 두 플랫폼을 동시에 만들어 함께 출시합니다. 스토어 등록도 대행하고 계정·권한을 이관합니다.' },
      { q: 'Flutter 앱개발 비용은 얼마인가요?', a: 'VAT 포함 499만 원부터, 약 21일입니다. 기능 범위에 따라 견적이 정해지며 상담에서 미리 안내합니다.' },
    ],
    canonical: 'https://reumlab.com/flutter',
  },

  'ai-development': {
    title: 'AI 외주개발 | 챗봇·상담 자동화 실전형 — 름랩 REUMLAB',
    description:
      '거창한 AI가 아니라 운영에 필요한 기능부터. 고객문의 자동화 챗봇·문서 요약·상담 자동화·추천을 최소 기능으로 설계하고, AI를 직접 지시·운영하도록 1:1 교육. 소스코드·API 키 직접 보유. 전국 어디서나 진행.',
    keywords: ['AI 외주개발', 'AI 챗봇 개발', '상담 자동화', '업무 자동화', 'AI 기능 개발', 'AI 외주'],
    ogTitle: 'AI 외주개발 | 작게 시작하는 상담 자동화 — 름랩',
    ogDescription: '운영에 필요한 AI 기능부터 최소 단위로. 직접 지시·운영 교육 포함, 소스코드·API 키 직접 보유.',
    h1: 'AI 외주개발',
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
    canonical: 'https://reumlab.com/ai-development',
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
};

export const ALL_SLUGS = Object.keys(PAGE_SEO_MAP).filter((s) => s !== '');

export function getSeoBySlug(slug: string): PageSeo | undefined {
  return PAGE_SEO_MAP[slug];
}
