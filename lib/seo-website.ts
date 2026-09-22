import { SITE } from './seo';

export type SeoWebsitePageId = 'MAIN' | 'REGIONAL' | 'COST' | 'STAFFING';
export type SeoWebsiteIndustryPageId =
  | 'CLEANING'
  | 'MOVING'
  | 'DEMOLITION'
  | 'LEAK'
  | 'WATERPROOF'
  | 'INTERIOR'
  | 'AIRCON'
  | 'WASTE'
  | 'STAFFING'
  | 'MANUFACTURING';

export type Faq = { q: string; a: string };
export type ContentSection = { heading: string; body: string; items?: string[] };

export type SeoWebsitePage = {
  pageId: SeoWebsitePageId;
  slug: '' | 'regional' | 'cost' | 'staffing';
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  lead: string;
  canonical: string;
  faqs: Faq[];
};

export type SeoWebsiteGuide = {
  pageId: 'GUIDE_REGISTRATION' | 'GUIDE_CHECKLIST';
  slug: 'search-registration' | 'seo-checklist';
  title: string;
  description: string;
  h1: string;
  canonical: string;
  lead: string;
  sections: ContentSection[];
  sources?: { title: string; url: string }[];
};

export type SeoWebsiteIndustry = {
  pageId: SeoWebsiteIndustryPageId;
  slug: string;
  label: string;
  href: string;
  summary: string;
  decisionInfo: string[];
  menuExample: string[];
  materials: string[];
  formExample: string[];
  faqs: Faq[];
  existingWebsiteSlug?: string;
};

export const SEO_WEBSITE_CANONICAL = `${SITE.domain}/seo-website/`;

export function seoWebsiteCanonical(slug = ''): string {
  const clean = slug.replace(/^\/+|\/+$/g, '');
  return clean ? `${SEO_WEBSITE_CANONICAL}${clean}/` : SEO_WEBSITE_CANONICAL;
}

const commonNoGuarantee =
  '검색 등록과 기술 설정은 제작 범위에 포함할 수 있지만, 수집·색인·노출 위치와 순위는 검색엔진이 결정하므로 보장하지 않습니다.';

export const SEO_WEBSITE_PAGES: SeoWebsitePage[] = [
  {
    pageId: 'MAIN',
    slug: '',
    title: '검색 잘되는 홈페이지 제작 | 네이버·구글 SEO 홈페이지 | 름랩',
    description:
      '검색 유입을 고려한 홈페이지를 제작합니다. 업종과 서비스 지역에 맞춘 페이지 설계부터 모바일 화면, 문의 연결, 기술 SEO와 검색 등록 범위를 확인하세요.',
    h1: '검색 잘되는 홈페이지 제작',
    eyebrow: '검색을 고려한 홈페이지 제작',
    lead:
      '업종과 서비스 지역, 고객이 궁금해하는 내용을 홈페이지 구조에 반영합니다. 모바일 화면부터 서비스별 설명, 문의 연결, 검색 등록과 점검까지 필요한 범위를 함께 제작합니다.',
    canonical: seoWebsiteCanonical(),
    faqs: [
      { q: '검색 잘되는 홈페이지와 일반 홈페이지 제작은 무엇이 다른가요?', a: '회사 소개와 연락처뿐 아니라 고객이 검색하는 서비스, 실제 활동 지역, 비용 조건, 질문과 문의 동선을 페이지별로 설계합니다. 일반 홈페이지에도 검색 기본기가 있을 수 있으며, 이번 서비스는 그 범위를 초기 기획부터 더 구체적으로 확인합니다.' },
      { q: '네이버와 구글을 모두 고려하나요?', a: '두 검색엔진이 읽을 수 있는 초기 HTML, 고유한 제목과 설명, canonical, 내부 링크와 사이트맵을 공통 기반으로 만듭니다. 소유 계정 권한이 있으면 각 관리 도구의 확인과 제출 범위도 구분해 안내합니다.' },
      { q: '홈페이지를 만들면 바로 검색되나요?', a: `아닙니다. 제작과 공개, 소유확인과 사이트맵 제출, 수집과 색인은 서로 다른 단계입니다. ${commonNoGuarantee}` },
      { q: '홈페이지 상위노출을 보장하나요?', a: '보장하지 않습니다. 경쟁 상황과 검색엔진의 평가가 계속 바뀌기 때문입니다. 름랩은 검색엔진이 내용을 읽고 사용자가 필요한 정보를 찾기 쉬운 구조와 운영 기준을 만듭니다.' },
      { q: '네이버 웹사이트 노출과 플레이스 광고는 같은 것인가요?', a: '서로 다른 영역입니다. 웹사이트 검색, 네이버 플레이스, 블로그, 유료 광고는 각각 운영 방식이 다르며 이번 홈페이지 제작에 광고 집행이 자동 포함되지는 않습니다.' },
      { q: '여러 지역명으로 검색되는 페이지도 만들 수 있나요?', a: '실제로 제공하는 지역과 서비스 조건, 현장 정보, 사진과 질문처럼 구분할 내용이 있을 때 설계할 수 있습니다. 지역명만 바꾼 대량 페이지는 만들지 않습니다.' },
      { q: '페이지를 많이 만들수록 좋은가요?', a: '아닙니다. 페이지 수보다 각 URL이 다른 질문에 충분한 답을 주는지가 중요합니다. 중복되는 내용은 한 페이지에 모으고 고유 정보가 있는 경우에만 나눕니다.' },
      { q: '사진이나 글이 충분하지 않으면 어떻게 진행하나요?', a: '확인할 수 있는 서비스 범위와 고객 질문부터 정리하고, 자료가 필요한 섹션은 준비 목록을 안내합니다. 가짜 후기·사진·실적을 채워 넣지 않으며 자료에 맞춰 제작 범위를 조정합니다.' },
      { q: '홈페이지가 이미 있는데 새로 만들어야 하나요?', a: '먼저 기존 구조와 수정 권한을 확인합니다. 살릴 수 있다면 기존 홈페이지 검색 구조 개선 서비스로 필요한 부분만 고치는 편이 나을 수 있습니다.' },
      { q: '도메인·호스팅·유료 도구 비용이 포함되나요?', a: '제작 작업과 운영 실비를 구분해 견적에 표시합니다. 도메인·호스팅·유료 도구는 선택한 환경과 계약 범위에 따라 달라집니다.' },
      { q: '관리자나 블로그도 함께 만들 수 있나요?', a: '필요한 수정 범위와 운영 방식을 확인한 뒤 별도 범위로 포함할 수 있습니다. 모든 프로젝트에 관리자·블로그·콘텐츠 대행이 자동 포함되지는 않습니다.' },
      { q: '완료 후 무엇을 전달받나요?', a: '계약 범위에 따라 운영 URL, 소스코드와 저장소, 계정·배포 권한, 주요 페이지와 문의 경로, 검색 설정 및 운영 방법을 확인해 인수인계합니다.' },
      { q: '지속적인 관리나 광고가 필수인가요?', a: '필수라고 정하지 않습니다. 제작 이후 필요한 수정·측정·광고 범위를 따로 선택할 수 있으며, 검색 광고와 콘텐츠 운영은 별도 업무입니다.' },
    ],
  },
  {
    pageId: 'REGIONAL',
    slug: 'regional',
    title: '지역별 검색을 고려한 홈페이지 제작 | 름랩',
    description:
      '실제 활동 지역과 서비스 조건이 다른 업체를 위해 지역별 홈페이지 정보 구조, 고유 콘텐츠와 공개·검수 기준을 설계합니다.',
    h1: '여러 지역에서 찾을 수 있도록, 지역별 홈페이지 구조를 설계합니다.',
    eyebrow: '지역·서비스 정보 구조',
    lead:
      '여러 지역에서 서비스를 제공하는 업체라면 고객이 확인해야 할 활동 지역, 작업 범위, 비용 조건과 문의 정보를 구분해 담을 수 있습니다. 실제로 제공하는 서비스와 고유한 정보가 있는 범위에서 페이지 구조를 설계합니다.',
    canonical: seoWebsiteCanonical('regional'),
    faqs: [
      { q: '전국 단위 지역 페이지도 만들 수 있나요?', a: '실제 제공 범위와 각 지역에 설명할 고유 정보가 확인될 때 단계적으로 설계할 수 있습니다. 전국 지명 조합을 먼저 만들고 내용을 나중에 채우는 방식은 사용하지 않습니다.' },
      { q: '같은 서비스는 한 페이지에 통합해도 되나요?', a: '지역별 조건과 정보가 거의 같다면 한 페이지에서 활동 범위를 명확히 설명하는 편이 낫습니다. 현장 조건·출장 기준·사례·질문이 다를 때만 나눕니다.' },
      { q: '처음 준비할 자료는 무엇인가요?', a: '실제 서비스 지역, 지역별 출장 조건, 제공 서비스, 비용에 영향을 주는 요소, 공개 가능한 사진과 자주 받는 질문을 준비하면 됩니다.' },
      { q: '공개 이후 지역 정보를 수정할 수 있나요?', a: '수정 빈도와 담당자를 확인해 소스 수정, 간단한 관리 화면 또는 별도 운영 지원 중 맞는 방법을 견적에서 구분합니다.' },
      { q: '만든 지역 페이지가 전부 색인되나요?', a: commonNoGuarantee },
    ],
  },
  {
    pageId: 'COST',
    slug: 'cost',
    title: 'SEO 홈페이지 제작 비용과 포함 범위 | 름랩',
    description:
      'SEO 홈페이지 제작 비용을 좌우하는 페이지 범위, 자료 준비 상태, 관리 기능, 문의·예약 연동과 운영 실비를 구분해 안내합니다.',
    h1: 'SEO 홈페이지 제작 비용, 포함 범위부터 확인하세요.',
    eyebrow: '견적 비교 가이드',
    lead:
      '같은 홈페이지 제작이라도 페이지 구성, 콘텐츠 준비 상태, 관리 기능과 연동 범위에 따라 비용이 달라집니다. 검색을 고려한 제작에서 어떤 항목을 확인해야 하는지 정리했습니다.',
    canonical: seoWebsiteCanonical('cost'),
    faqs: [
      { q: '검색 등록 포함이면 상위노출도 포함인가요?', a: `아닙니다. 등록과 수집 요청은 검색엔진에 URL을 알리는 단계입니다. ${commonNoGuarantee}` },
      { q: '페이지 수만으로 견적을 비교해도 되나요?', a: '같은 10페이지라도 원고·사진의 준비 상태, 각 페이지의 고유 정보, 관리자와 외부 연동, 이전 작업에 따라 작업량이 달라집니다. 포함·제외 항목을 함께 비교해야 합니다.' },
      { q: '월 관리가 필수인가요?', a: '필수라고 정하지 않습니다. 제작 후 직접 운영, 필요할 때 추가 요청, 정기 지원 중 실제 운영 방식에 맞게 구분합니다.' },
      { q: '기존 사이트 수정과 신규 제작 가격은 같나요?', a: '같지 않을 수 있습니다. 기존 코드·계정·URL·콘텐츠를 살릴 수 있는지와 이전 위험을 먼저 확인해야 하므로 신규 제작과 별도로 범위를 계산합니다.' },
    ],
  },
  {
    pageId: 'STAFFING',
    slug: 'staffing',
    title: '인력사무소 홈페이지 제작 | 검색·문의 구조 설계 | 름랩',
    description:
      '인력을 요청하는 기업과 일자리를 찾는 사람의 동선을 구분한 인력사무소 홈페이지를 제작합니다. 직무·인원·기간·지역 문의 구조와 개인정보 최소 수집 기준을 확인하세요.',
    h1: '인력사무소·인력업체 홈페이지 제작',
    eyebrow: '업종별 검색형 홈페이지',
    lead:
      '인력이 필요한 기업 문의와 일자리를 찾는 사람의 문의가 섞이지 않도록 역할·직무·활동 지역과 접수 정보를 나눠 설계합니다.',
    canonical: seoWebsiteCanonical('staffing'),
    faqs: [
      { q: '구인 기업과 구직자 문의를 한 폼에서 받아도 되나요?', a: '초기에는 문의 유형을 먼저 선택하게 해 필요한 항목만 보여줄 수 있습니다. 개인정보와 운영량이 늘면 별도 동선과 관리 권한을 검토합니다.' },
      { q: '직무별 페이지를 모두 만들어야 하나요?', a: '실제로 제공하고 설명할 정보가 다른 직무만 구분합니다. 동일한 설명에 직무명만 바꾼 페이지는 만들지 않습니다.' },
      { q: '구직자 이력서를 홈페이지에서 받아도 되나요?', a: '민감정보와 파일 보관, 접근 권한, 삭제 정책을 먼저 정해야 합니다. 이번 기본 상담폼에는 이력서 업로드를 포함하지 않으며 필요 시 별도 범위로 설계합니다.' },
      { q: '활동 지역은 어떻게 보여주나요?', a: '실제 인력 공급이 가능한 지역과 현장 조건을 확인해 한 페이지의 활동 범위 또는 고유한 지역 정보 페이지로 구분합니다.' },
      { q: '소개·파견 자격도 홈페이지에 표시해 주나요?', a: '고객이 제공한 공식 자료와 공개 권한을 확인한 내용만 표시합니다. 자격·허가·법적 지위를 추정해 작성하지 않습니다.' },
    ],
  },
];

export const SEO_WEBSITE_GUIDES: SeoWebsiteGuide[] = [
  {
    pageId: 'GUIDE_REGISTRATION',
    slug: 'search-registration',
    title: '홈페이지 검색 등록과 상위노출은 어떻게 다른가요?',
    description:
      '홈페이지 공개, 검색엔진 등록, 수집, 색인, 노출과 순위의 차이를 Google과 네이버 공식 문서를 바탕으로 설명합니다.',
    h1: '홈페이지 검색 등록과 상위노출은 어떻게 다른가요?',
    canonical: seoWebsiteCanonical('guides/search-registration'),
    lead:
      '검색엔진에 사이트를 알리는 작업, 로봇이 페이지를 가져오는 수집, 검색 대상으로 처리하는 색인, 검색결과에 보여주는 노출과 순위는 서로 다른 단계입니다.',
    sections: [
      { heading: '공개부터 검색 처리까지', body: '제작이 끝난 운영 URL이 정상 응답해야 소유확인과 사이트맵 제출을 진행할 수 있습니다. 그다음 수집과 색인 여부는 각 검색엔진이 판단합니다.', items: ['운영 URL 공개와 200 응답', '소유확인과 사이트맵 제출', '로봇 수집', '색인 처리', '검색어에 따른 노출과 순위'] },
      { heading: '사이트맵 제출이 보장하지 않는 것', body: '사이트맵은 정규 URL과 의미 있는 수정 시점을 알려주는 발견 도구입니다. 제출 성공은 모든 URL의 색인이나 상위노출 완료를 뜻하지 않습니다.' },
      { heading: '업체 이름과 서비스명 검색은 다릅니다', body: '상호를 아는 사람이 찾는 브랜드 검색과, 서비스명·지역명으로 업체를 비교하는 비브랜드 검색은 필요한 정보와 경쟁 환경이 다릅니다.' },
      { heading: '기존 홈페이지가 검색되지 않을 때', body: 'robots, noindex, 상태코드, canonical, 중복 URL, 초기 HTML 본문, 내부 링크와 사이트맵을 함께 확인해야 합니다. 원인은 한 가지가 아닐 수 있습니다.' },
      { heading: '엔진마다 처리 시점이 다릅니다', body: 'Google과 네이버는 별도 시스템이며 같은 날 제출해도 수집·색인·노출 시점이 같지 않습니다. 고정된 반영 일수를 약속할 수 없습니다.' },
    ],
    sources: [
      { title: 'Google 사이트맵 만들기 및 제출', url: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap' },
      { title: '네이버 RSS 및 사이트맵 제출', url: 'https://searchadvisor.naver.com/guide/request-feed' },
      { title: '네이버 검색엔진 최적화의 목적', url: 'https://searchadvisor.naver.com/guide/seo-basic-intro' },
    ],
  },
  {
    pageId: 'GUIDE_CHECKLIST',
    slug: 'seo-checklist',
    title: 'SEO 포함 홈페이지 제작, 견적 전에 확인할 10가지',
    description:
      '검색 대상 고객, 초기 HTML, 고유 title과 canonical, 내부 링크, 문의 접수, 검색 등록과 인수인계까지 견적 전에 물어볼 10가지를 정리했습니다.',
    h1: 'SEO 포함 홈페이지 제작, 견적 전에 확인할 10가지',
    canonical: seoWebsiteCanonical('guides/seo-checklist'),
    lead:
      '‘SEO 포함’이라는 한 문장보다 어떤 고객과 질문을 어느 페이지에서 다루고, 완료 후 무엇을 검수하고 전달받는지를 확인해야 견적을 비교할 수 있습니다.',
    sections: [
      { heading: '1. 어떤 고객의 어떤 검색을 대상으로 하나요?', body: '왜: 검색 의도가 다르면 페이지 역할도 달라집니다. 질문: “브랜드명 외에 고객이 어떤 서비스·지역 표현으로 찾는다고 가정하나요?” 산출물: 페이지별 검색 의도와 키워드 매핑.' },
      { heading: '2. 페이지마다 어떤 고유 정보를 제공하나요?', body: '왜: 이름만 바꾼 중복 페이지는 사용자에게도 도움이 되지 않습니다. 질문: “각 URL에서만 확인할 수 있는 정보는 무엇인가요?” 산출물: 페이지 목록과 고유 섹션.' },
      { heading: '3. 중요한 본문이 초기 HTML에 있나요?', body: '왜: 사용자와 로봇이 스크립트 오류 없이 핵심 내용을 읽을 수 있어야 합니다. 질문: “자바스크립트를 실행하지 않아도 제목·본문·링크가 보이나요?” 산출물: 빌드 HTML 또는 렌더 결과.' },
      { heading: '4. title과 canonical이 페이지마다 고유한가요?', body: '왜: 검색엔진에 페이지 주제와 대표 URL을 일관되게 알려야 합니다. 질문: “추적 쿼리와 미리보기 주소가 canonical에 섞이지 않나요?” 산출물: URL·title·canonical 목록.' },
      { heading: '5. 주요 페이지가 실제 링크로 연결되나요?', body: '왜: 메뉴·본문·breadcrumb 링크는 사용자의 탐색과 로봇의 발견을 돕습니다. 질문: “버튼 스크립트가 아니라 실제 href로 연결되나요?” 산출물: 내부 링크 검사 결과.' },
      { heading: '6. 문의가 서버에 실제 저장되나요?', body: '왜: 성공 화면만 보여주고 접수가 누락될 수 있습니다. 질문: “서버 성공과 관리자 수신을 어떻게 확인하나요?” 산출물: 테스트 접수 ID 또는 저장 기록.' },
      { heading: '7. 소유확인과 사이트맵 제출 범위는 어디까지인가요?', body: '왜: 코드 배포와 검색 관리도구 처리는 별도 권한이 필요합니다. 질문: “어느 계정에서 누가 소유확인과 제출을 하나요?” 산출물: 플랫폼별 상태표.' },
      { heading: '8. 운영 권한과 소스 인수인계 범위는 무엇인가요?', body: '왜: 제작 이후 수정과 이전 가능성을 결정합니다. 질문: “도메인·호스팅·저장소·분석 계정은 누구 명의인가요?” 산출물: 계정·권한 인수인계 목록.' },
      { heading: '9. 어떤 항목이 추가 비용인가요?', body: '왜: 촬영·원고·관리자·외부 도구·지속 운영은 제작비와 다를 수 있습니다. 질문: “제작비와 운영 실비, 별도 작업을 구분해 주세요.” 산출물: 포함·제외·실비 표.' },
      { heading: '10. 완료 검수 기준은 무엇인가요?', body: '왜: 화면 공개만으로 문의·검색·모바일 품질을 확인할 수 없습니다. 질문: “상태코드, 모바일, 폼, 메타, 사이트맵과 복구를 어떻게 검수하나요?” 산출물: QA 보고서와 복구 기준.' },
    ],
  },
];

const commonFaq = (label: string): Faq[] => [
  { q: `${label} 홈페이지에 지역 페이지가 꼭 필요한가요?`, a: '실제 활동 지역과 조건이 다르고 각 지역에서 설명할 정보가 있을 때만 나눕니다. 정보가 같다면 한 페이지에서 제공 범위를 명확히 알리는 편이 낫습니다.' },
  { q: `${label} 홈페이지 제작비는 무엇으로 정해지나요?`, a: '페이지와 원고 범위, 사진 준비 상태, 문의·예약 기능, 관리자와 외부 연동, 이전 작업을 확인해 정합니다. 실제 서비스 가격과 홈페이지 제작비는 별개입니다.' },
  { q: '현장 사진이 부족해도 만들 수 있나요?', a: '확인 가능한 서비스 범위와 상담 질문부터 구성할 수 있습니다. 다만 사진·사례가 필요한 섹션은 공개 권한이 있는 실제 자료를 준비하거나 범위를 줄입니다.' },
  { q: '검색 상위노출을 보장하나요?', a: commonNoGuarantee },
];

export const SEO_WEBSITE_INDUSTRIES: SeoWebsiteIndustry[] = [
  {
    pageId: 'CLEANING', slug: 'cleaning', label: '청소·입주청소', href: '/website/cheongsoeobche/', existingWebsiteSlug: 'cheongsoeobche',
    summary: '입주·이사·상가·정기 청소처럼 실제 제공 종류와 포함·제외 작업, 면적과 현장 상태를 고객이 비교할 수 있게 정리합니다.',
    decisionInfo: ['청소 종류와 실제 제공 범위', '면적·오염도·추가 작업이 견적에 미치는 조건', '서비스 지역과 희망 일정 접수 방식'],
    menuExample: ['청소 종류', '포함·제외 작업', '서비스 지역', '견적 기준', '준비사항', '작업 사례', '문의'],
    materials: ['실제 제공 항목', '사용 허가된 작업 사진', '전후 설명의 근거', '접수 방식'],
    formExample: ['작업 종류', '대략적 면적', '희망일', '지역'],
    faqs: commonFaq('청소업체'),
  },
  {
    pageId: 'MOVING', slug: 'moving', label: '이사·이삿짐센터', href: '/website/isaeobche/', existingWebsiteSlug: 'isaeobche',
    summary: '포장·일반·보관·사무실 이사 범위와 출발·도착 지역, 층수와 일정처럼 견적에 필요한 정보를 먼저 보여줍니다.',
    decisionInfo: ['포장·일반·보관·사무실 이사 구분', '출발·도착지와 층수·엘리베이터 조건', '방문견적과 희망 일정 안내'],
    menuExample: ['이사 종류', '진행 과정', '방문견적 안내', '서비스 가능 지역', '자주 묻는 질문', '상담'],
    materials: ['실제 운영 방식', '포함·제외 작업', '차량·인력 범위', '공개 가능한 현장 사진'],
    formExample: ['이사 유형', '희망일', '출발·도착 지역', '대략적 규모'],
    faqs: commonFaq('이사업체'),
  },
  {
    pageId: 'DEMOLITION', slug: 'demolition', label: '철거', href: '/website/cheolgeoeobche/', existingWebsiteSlug: 'cheolgeoeobche',
    summary: '실내·상가·부분 철거와 원상복구 등 실제 작업 범위, 현장 진입 조건과 폐기물 처리 포함 여부를 구분합니다.',
    decisionInfo: ['철거 대상과 부분·전체 범위', '면적·진입 조건·건물 상태', '폐기물 처리와 원상복구 포함 여부'],
    menuExample: ['철거 범위', '현장 조건', '진행 절차', '현장 사진', '비용 결정 요소', '견적 상담'],
    materials: ['실제 수행 범위', '공개 가능한 현장 사진', '처리 범위', '고객이 준비할 현장 정보'],
    formExample: ['현장 유형', '철거 범위', '면적', '지역', '일정'],
    faqs: commonFaq('철거업체'),
  },
  {
    pageId: 'LEAK', slug: 'leak-detection', label: '누수탐지·설비', href: '/website/nusutamjieobche/', existingWebsiteSlug: 'nusutamjieobche',
    summary: '탐지·수리·배관 중 실제 대응 범위와 건물 종류, 발생 위치, 관찰된 증상을 상담 전에 구분합니다.',
    decisionInfo: ['탐지·수리·배관의 실제 대응 범위', '건물 유형·발생 위치·관찰 증상', '방문 지역과 긴급 대응 가능 여부의 사실 확인'],
    menuExample: ['증상별 상담 안내', '제공 작업', '방문 지역', '점검 과정', '비용 조건', '문의'],
    materials: ['실제 장비와 공정', '대응 가능한 작업', '증빙 가능한 현장 사진', '영업시간과 방문 범위'],
    formExample: ['건물 종류', '지역', '발생 위치', '관찰된 증상'],
    faqs: commonFaq('누수탐지업체'),
  },
  {
    pageId: 'WATERPROOF', slug: 'waterproofing', label: '방수', href: '/website/bangsueobche/', existingWebsiteSlug: 'bangsueobche',
    summary: '옥상·외벽·지하 등 실제 시공 부위와 공법, 기존 상태와 면적에 따른 상담 정보를 분리해 설명합니다.',
    decisionInfo: ['옥상·외벽·지하 등 적용 부위', '공법·자재와 기존 상태', '면적·현장 점검·보증 조건의 근거'],
    menuExample: ['적용 부위', '공법·자재 정보', '현장 점검', '시공 사례', '비용 조건', '상담'],
    materials: ['실제 공정 사진', '자재·공법 정보 출처', '시공 범위', '확인 가능한 보증 조건'],
    formExample: ['시공 부위', '면적', '현장 지역', '현재 상태'],
    faqs: commonFaq('방수업체'),
  },
  {
    pageId: 'INTERIOR', slug: 'interior', label: '인테리어', href: '/website/interieoeobche/', existingWebsiteSlug: 'interieoeobche',
    summary: '주거·상업·부분 시공의 전문 범위와 공개 승인된 프로젝트 사진, 예산·일정·담당 역할을 연결합니다.',
    decisionInfo: ['주거·상업·부분 시공 구분', '공간 종류·범위·예산·일정', '디자인·시공 담당 역할과 공개 승인된 사례'],
    menuExample: ['공간 유형', '프로젝트 설명', '진행 과정', '상담 전 준비', '견적 요청'],
    materials: ['포트폴리오 공개 권한', '실제 작업 범위', '디자인·시공 포함 여부', '사용 가능한 사진 설명'],
    formExample: ['공간 유형', '면적', '대략적 예산', '지역', '일정'],
    faqs: commonFaq('인테리어 업체'),
  },
  {
    pageId: 'AIRCON', slug: 'air-conditioning', label: '에어컨 청소·설치', href: '/website/eeokeoneobche/', existingWebsiteSlug: 'eeokeoneobche',
    summary: '청소와 설치, 가정용과 상업용, 지원 기종·대수·설치 환경을 실제 서비스 범위에 맞게 구분합니다.',
    decisionInfo: ['청소와 설치 서비스 구분', '가정용·상업용과 지원 기종', '대수·설치 환경·추가비용 조건'],
    menuExample: ['서비스 종류', '지원 기종', '작업 범위', '추가비용 조건', '예약·문의'],
    materials: ['실제 지원 기종', '설치·청소 포함 항목', '사용 허가된 사진', '제조사 관계의 공식 자료'],
    formExample: ['청소·설치 구분', '기종', '대수', '지역', '일정'],
    faqs: commonFaq('에어컨업체'),
  },
  {
    pageId: 'WASTE', slug: 'waste-removal', label: '폐기물 수거·처리', href: '/website/pyegimulcheorieobche/', existingWebsiteSlug: 'pyegimulcheorieobche',
    summary: '실제 취급 가능한 품목과 운반·처리 범위, 대략적 양과 반출 조건을 상담 전에 확인할 수 있게 합니다.',
    decisionInfo: ['실제 취급 가능·불가 품목', '수거·운반·처리의 담당 범위', '대략적 양과 진입·반출 조건'],
    menuExample: ['취급 품목', '진행 과정', '상담 정보', '활동 지역', '견적 요청'],
    materials: ['공개 가능한 사업 자료', '실제 취급 범위', '허가 관련 공식 근거', '운반·처리 역할'],
    formExample: ['품목', '대략적 양', '반출 지역', '접근 조건'],
    faqs: commonFaq('폐기물 처리업체'),
  },
  {
    pageId: 'STAFFING', slug: 'staffing', label: '인력사무소·인력업체', href: '/seo-website/staffing/',
    summary: '인력을 요청하는 기업과 일자리를 찾는 사람의 동선을 나누고, 역할·인원·기간·현장·지역을 최소 정보로 접수합니다.',
    decisionInfo: ['기업 인력 요청과 구직 문의 분리', '직무·인원·기간·현장 조건', '민감정보를 최소화한 접수와 권한'],
    menuExample: ['인력 요청', '제공 직무', '활동 지역', '운영 절차', '구직 문의 안내'],
    materials: ['실제 업무 형태', '제공 직무', '활동 지역', '자격·운영 범위의 공식 자료'],
    formExample: ['직무', '인원', '기간', '현장 지역'],
    faqs: SEO_WEBSITE_PAGES.find((page) => page.pageId === 'STAFFING')!.faqs,
  },
  {
    pageId: 'MANUFACTURING', slug: 'manufacturing', label: '제조·산업용 제품', href: '/website/jejoeob/', existingWebsiteSlug: 'jejoeob',
    summary: '제품군·적용 분야·사양 자료와 품목·모델·용도·수량을 전달하는 기업 문의 흐름을 설계합니다.',
    decisionInfo: ['제품군·적용 분야·사양 구분', '품목·모델·용도·수량의 기술 문의', '인증·취급 관계와 이미지의 공개 근거'],
    menuExample: ['회사 소개', '제품군', '적용 분야', '자료', '지원 범위', '견적·기술 문의'],
    materials: ['공개 가능한 사양', '공식 취급·인증 자료', '사용 허가된 제품 이미지', '지원 범위'],
    formExample: ['제품군', '모델', '용도', '수량', '요구사항'],
    faqs: commonFaq('제조업'),
  },
];

const pageBySlug = new Map(SEO_WEBSITE_PAGES.map((page) => [page.slug, page]));
const guideBySlug = new Map(SEO_WEBSITE_GUIDES.map((guide) => [guide.slug, guide]));
const industryById = new Map(SEO_WEBSITE_INDUSTRIES.map((industry) => [industry.pageId, industry]));
const industryByWebsiteSlug = new Map(
  SEO_WEBSITE_INDUSTRIES.filter((industry) => industry.existingWebsiteSlug).map((industry) => [industry.existingWebsiteSlug!, industry]),
);

export function getSeoWebsitePage(slug: string): SeoWebsitePage | undefined {
  return pageBySlug.get(slug.replace(/^\/+|\/+$/g, ''));
}

export function getSeoWebsiteGuide(slug: string): SeoWebsiteGuide | undefined {
  return guideBySlug.get(slug.replace(/^\/+|\/+$/g, ''));
}

export function getSeoWebsiteIndustryByPageId(pageId: string): SeoWebsiteIndustry | undefined {
  return industryById.get(pageId as SeoWebsiteIndustryPageId);
}

export function getSeoWebsiteIndustryByExistingSlug(slug: string): SeoWebsiteIndustry | undefined {
  return industryByWebsiteSlug.get(slug);
}

export const SEO_WEBSITE_NEW_CANONICALS = [
  ...SEO_WEBSITE_PAGES.map((page) => page.canonical),
  ...SEO_WEBSITE_GUIDES.map((guide) => guide.canonical),
];

