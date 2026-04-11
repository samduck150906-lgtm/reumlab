export const SITE = {
  name: '름랩',
  nameEn: 'REUMLAB',
  domain: 'https://reumlab.com',
  defaultOgImage: 'https://reumlab.com/og-image.jpg',
  phone: '010-8111-9370',
  address: '경기도 수원시 영통구 삼성로 186-1 4층',
  email: 'ceo@eternalsix.kr',
  /** 푸터·Organization JSON-LD */
  kakao: 'https://open.kakao.com/o/sNAsri4h',
  company: '이터널식스',
  representative: '성아름',
  bizNo: '303-28-65658',
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
    title: 'AI 기반 앱·웹 개발 & 자체 유지보수 교육 | 름랩 Reum Lab',
    description:
      '비전공자 대표도 직접 수정·관리할 수 있도록. Flutter MVP와 1:1 유지보수 전수 교육을 함께하는 림랩(Reum Lab) 파트너 랜딩입니다.',
    keywords: [
      '앱 개발',
      '웹 개발',
      'Flutter',
      'MVP',
      '유지보수 교육',
      'AI 개발',
      '비전공자 대표',
      '외주 개발',
      '름랩',
      'Reum Lab',
    ],
    ogTitle: '론칭 다음 날도 주도하는 IT, 림랩 Reum Lab',
    ogDescription:
      'AI 보조 개발과 1:1 맞춤 교육으로 유지보수 비용을 줄이고 IT 자생력을 키우는 앱·웹 개발 파트너.',
    h1: 'AI 기반 앱·웹 개발과 자체 유지보수까지, 림랩과 함께',
    canonical: 'https://reumlab.com',
  },

  // ─── 서비스별 페이지 (AI 단어 제거) ───
  웹개발: {
    title: '웹 개발 & 홈페이지 제작 | 름랩 (REUMLAB)',
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
    h1: '비즈니스 경쟁력을 높이는 모바일 앱 개발',
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
};

export const ALL_SLUGS = Object.keys(PAGE_SEO_MAP).filter((s) => s !== '');

/** 정적 라우트 /portfolio 전용 */
export const PORTFOLIO_SEO: PageSeo = {
  title: '개발 포트폴리오·레퍼런스 | 름랩 (REUMLAB)',
  description:
    '앱·웹 개발 레퍼런스. Flutter, React Native, Next.js 기반 대규모 매칭·SaaS·예약 시스템 등 실제 프로젝트 사례.',
  keywords: ['개발 포트폴리오', '앱 포트폴리오', '웹 제작 사례', '외주 레퍼런스', '름랩'],
  ogTitle: '개발 포트폴리오 | 름랩',
  ogDescription: '앱·웹 실전 프로젝트 레퍼런스를 확인하세요.',
  h1: '앱·웹 개발 포트폴리오',
  canonical: 'https://reumlab.com/portfolio',
};

export function getSeoBySlug(slug: string): PageSeo | undefined {
  return PAGE_SEO_MAP[slug];
}
