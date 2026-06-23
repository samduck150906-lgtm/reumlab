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
    title: '웹·앱 MVP 개발 외주 | 름랩 (REUMLAB)',
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
    title: '모바일 앱 개발 전문 | 름랩 (REUMLAB)',
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
    title: '스타트업 MVP 개발 외주 | 름랩 (REUMLAB)',
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
      '검증에 필요한 핵심 기능부터 빠르게 출시하는 MVP 개발. Flutter 크로스플랫폼, 14~30일, VAT 포함 499만 원부터. 소스코드 전체 이관 + 직접 운영 교육. 수원 거점, 경기·서울 대면, 전국 비대면.',
    keywords: ['MVP 개발', 'MVP 외주', '스타트업 MVP', '최소 기능 제품', 'Lean MVP', '앱개발 외주'],
    ogTitle: 'MVP 개발 외주 | 핵심 기능부터 빠르게 — 름랩',
    ogDescription: '시장 검증에 필요한 핵심 기능부터 Lean MVP로. 소스코드 전체 이관 + 직접 운영 교육.',
    h1: 'MVP 개발 외주',
    serviceDesc:
      '시장 검증에 필요한 핵심 기능부터 만드는 Lean MVP. 화면 흐름 설계 → 중간 확인 → 소스코드 이관 순서로 진행합니다. VAT 포함 499만 원부터, 약 14~30일. 지역별 대면 상담도 가능합니다.',
    canonical: 'https://reumlab.com/mvp',
  },

  flutter: {
    title: 'Flutter 앱개발 외주 | iOS·안드로이드 동시 — 름랩 REUMLAB',
    description:
      'Flutter 하나로 iOS·Android 앱을 동시에. 네이티브 2벌 대비 개발 비용 50~70% 절감, 유지보수도 절반. VAT 포함 499만 원부터, 소스코드 전체 이관 + 직접 운영 교육. 수원 거점, 전국 비대면.',
    keywords: ['Flutter 앱개발', 'Flutter 외주', '크로스플랫폼 개발', 'Flutter MVP', '앱개발 외주', 'iOS 안드로이드 앱'],
    ogTitle: 'Flutter 앱개발 외주 | 하나의 코드로 두 플랫폼 — 름랩',
    ogDescription: '하나의 코드로 iOS·Android 동시 제작. MVP 단계 시간·비용을 줄이는 Flutter 앱개발.',
    h1: 'Flutter 앱개발 외주',
    serviceDesc:
      'Flutter 크로스플랫폼으로 iOS·Android를 한 번에 만듭니다. 네이티브 2벌 대비 비용 50~70% 절감, 유지보수도 구조적으로 절반. 소스코드 전체 이관, 직접 수정 교육 포함. VAT 포함 499만 원부터.',
    canonical: 'https://reumlab.com/flutter',
  },

  'ai-development': {
    title: 'AI 외주개발 | 챗봇·상담 자동화 실전형 — 름랩 REUMLAB',
    description:
      '거창한 AI가 아니라 운영에 필요한 기능부터. 고객문의 자동화 챗봇·문서 요약·상담 자동화·추천을 최소 기능으로 설계하고, AI를 직접 지시·운영하도록 1:1 교육. 소스코드·API 키 직접 보유. 전국 비대면.',
    keywords: ['AI 외주개발', 'AI 챗봇 개발', '상담 자동화', '업무 자동화', 'AI 기능 개발', 'AI 외주'],
    ogTitle: 'AI 외주개발 | 작게 시작하는 상담 자동화 — 름랩',
    ogDescription: '운영에 필요한 AI 기능부터 최소 단위로. 직접 지시·운영 교육 포함, 소스코드·API 키 직접 보유.',
    h1: 'AI 외주개발',
    serviceDesc:
      '챗봇·자동응답·문서요약·추천·상담 자동화 등 운영에 필요한 AI 기능부터 설계합니다. 최소 기능으로 시작해 효과를 확인한 뒤 단계적으로 확장합니다. 소스코드·API 키를 직접 보유하도록 이관하고, AI 직접 운영 교육을 제공합니다.',
    canonical: 'https://reumlab.com/ai-development',
  },
};

export const ALL_SLUGS = Object.keys(PAGE_SEO_MAP).filter((s) => s !== '');

export function getSeoBySlug(slug: string): PageSeo | undefined {
  return PAGE_SEO_MAP[slug];
}
