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
    title: '름랩 REUMLAB | 앱·웹 MVP 개발, AI 외주개발, Flutter 앱개발',
    description:
      '름랩은 앱·웹 MVP 개발, AI 기능 개발, Flutter 앱개발, 소스코드 이관, AI 직접 운영 교육을 함께 제공하는 외주개발 스튜디오입니다. 예산 안에서 빠르게 만들고 직접 운영할 수 있게 돕습니다.',
    keywords: [
      '외주개발',
      '앱개발 외주',
      'AI 외주개발',
      'AI 개발 교육',
      'Flutter 앱개발',
      'MVP 개발',
      '웹사이트 제작',
      '소스코드 이관',
      '스타트업 MVP',
      '비개발자 창업 앱개발',
    ],
    ogTitle: '외주 맡긴 앱, 다시는 외주에 묶이지 않게. | 름랩 REUMLAB',
    ogDescription:
      '앱·웹 MVP 개발 + AI 직접 운영 교육. Flutter 앱·웹 MVP를 빠르게 만들고 소스코드·권한을 통째로 넘깁니다.',
    h1: '외주 맡긴 앱, 다시는 외주에 묶이지 않게',
    canonical: 'https://reumlab.com',
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
};

export const ALL_SLUGS = Object.keys(PAGE_SEO_MAP).filter((s) => s !== '');

export function getSeoBySlug(slug: string): PageSeo | undefined {
  return PAGE_SEO_MAP[slug];
}
