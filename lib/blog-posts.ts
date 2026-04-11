import { SITE } from '@/lib/seo';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  publishedAt: string; // ISO date
  readingMinutes: number;
  /** 본문 단락 (HTML 없이 순수 텍스트) */
  paragraphs: string[];
}

const base = `${SITE.domain}/blog`;

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'app-gaebal-biyong-julineun-bab',
    title: '앱 개발 비용 줄이는 법: MVP 범위와 유지보수 설계부터',
    description:
      '기능을 줄이고 검증 주기를 짧게 가져가며, 론칭 후 직접 수정 가능한 구조로 외주 반복 비용을 줄이는 실무 체크리스트입니다.',
    keywords: ['앱 개발 비용', 'MVP 비용', '외주 절감', '유지보수'],
    publishedAt: '2026-04-01',
    readingMinutes: 6,
    paragraphs: [
      '많은 창업팀이 처음부터 “완성형 앱”을 목표로 견적을 받다가 예산을 크게 초과합니다. 비용을 줄이려면 “검증에 필요한 최소 기능”만 남기고 나머지는 로드맵으로 미루는 것이 첫 번째 원칙입니다.',
      '두 번째는 유지보수를 전부 외주에 맡기지 않는 구조입니다. 카피·이미지·단순 설정 변경을 대표님이 직접 할 수 있도록 문서화·교육·도구(AI 보조 개발)를 납품에 포함하면, 작은 수정마다 발생하던 추가 견적을 크게 줄일 수 있습니다.',
      '세 번째는 기술 스택 선택입니다. Flutter 등 크로스플랫폼으로 iOS·Android를 한 번에 가져가면 초기 개발 인건비와 일정 리스크가 동시에 줄어듭니다. 름랩은 이런 흐름으로 패키지를 설계해, VAT 포함 정액으로 범위를 명확히 합니다.',
    ],
  },
  {
    slug: 'oeju-gaebal-silphae-an-haneun-bab',
    title: '외주 개발 실패 안 하는 법: 명세·일정·소유권 3종 세트',
    description:
      '기능 명세서, 마일스톤, 소스코드·계정 소유권을 계약 전에 고정하면 분쟁과 비용 폭증을 예방할 수 있습니다.',
    keywords: ['외주 개발 실패', '개발 명세서', '소스코드 납품', '계약'],
    publishedAt: '2026-04-02',
    readingMinutes: 7,
    paragraphs: [
      '실패의 대부분은 “말로만 된 요구사항”에서 시작합니다. 화면별로 입력·출력·예외 처리를 적은 명세가 있으면 견적 정확도와 일정 준수율이 함께 올라갑니다.',
      '일정은 중간 데모마다 고객이 직접 확인할 수 있는 산출물을 붙이세요. 한 번에 최종본만 받는 구조는 방향이 어긋났을 때 수정 비용이 기하급수적으로 늘어납니다.',
      '마지막으로 Git 저장소, 스토어 개발자 계정, 도메인·호스팅 권한이 누구 명의인지 문서로 남겨야 합니다. 납품 후 “접근이 안 된다”는 분쟁을 막는 가장 값싼 보험입니다.',
    ],
  },
  {
    slug: 'mvp-gaebal-bijeongongja-daehyo',
    title: '비전공자 대표도 가능한 MVP 개발: 검증 질문 5가지',
    description:
      '코딩을 몰라도 “무엇을 검증할지”만 분명하면 MVP는 빨라집니다. 고객·가격·채널을 묻는 5가지 질문 프레임을 정리했습니다.',
    keywords: ['비전공자 MVP', '창업 MVP', '시장 검증', '앱 MVP'],
    publishedAt: '2026-04-03',
    readingMinutes: 5,
    paragraphs: [
      'MVP의 목적은 “기능 완성”이 아니라 “가설 검증”입니다. 누가 돈을 내는지, 얼마를 내는지, 어떤 채널로 유입되는지를 숫자로 적을 수 있어야 다음 스프린트가 의미를 갖습니다.',
      '비전공자 대표는 화면 설계보다 먼저 “고객 시나리오”를 적는 것이 유리합니다. 사용자가 앱을 켠 뒤 첫 3분 안에 하는 행동을 문장으로 써 보세요. 개발사는 그 문장을 화면과 API로 바꿉니다.',
      'AI 도구는 이 단계에서 초안을 빠르게 만드는 데 유리합니다. 다만 실제 서비스 연동·보안·스토어 정책은 전문가와 함께 가야 합니다. 교육과 외주를 섞는 모델이 중간 비용을 줄이는 데 효과적입니다.',
    ],
  },
  {
    slug: 'yujibosu-biyong-jeolgam-ai',
    title: '앱 유지보수 비용 절감: AI 보조와 자체 수정 루틴',
    description:
      '텍스트·이미지·간단한 설정을 직접 바꿀 수 있게 하면 고정 비용이 줄고, 마케팅 실험 속도가 빨라집니다.',
    keywords: ['유지보수 비용', '앱 수정', 'AI 개발', '자체 운영'],
    publishedAt: '2026-04-04',
    readingMinutes: 6,
    paragraphs: [
      '유지보수 비용의 대부분은 “작은 변경”의 누적입니다. 디자이너·개발자·기획자가 모두 한 줄 카피를 바꾸는 데 이틀이 걸리면 기회비용이 큽니다.',
      'AI는 자연어로 변경 의도를 코드나 설정에 반영하는 보조 역할에 적합합니다. 대표님이 직접 프롬프트와 검증 루틴을 익히면, 외주 티켓 수 자체가 줄어듭니다.',
      '운영 체크리스트(배포 전 테스트 5분, 롤백 방법, 장애 시 연락망)를 만들어 두면 긴급 외주 의존도가 내려갑니다. 름랩 패키지에는 이런 운영 루틴을 온라인으로 전수합니다.',
    ],
  },
  {
    slug: 'landing-peiji-seo-chamsa',
    title: '스타트업 랜딩페이지 SEO: 검색·공유·전환을 한 번에',
    description:
      '메타 타이틀, 구조화 데이터, 코어 웹 바이탈을 챙기면 오가닉 유입과 광고 효율이 동시에 좋아집니다.',
    keywords: ['랜딩페이지 SEO', '스타트업 마케팅', '메타 태그', '구조화 데이터'],
    publishedAt: '2026-04-05',
    readingMinutes: 6,
    paragraphs: [
      '랜딩은 “한 페이지에 하나의 약속”이 명확할수록 전환과 SEO가 같이 좋아집니다. H1 하나, CTA 하나를 기본으로 잡고 나머지는 증거·FAQ로 보강하세요.',
      '기술적으로는 title·description·canonical·OG 이미지가 카카오·슬랙 미리보기 품질을 결정합니다. Next.js의 generateMetadata로 페이지마다 고유 값을 주는 것이 안전합니다.',
      '블로그·롱테일 칼럼으로 내부 링크를 모으면 도메인 전체 권한이 올라갑니다. /blog 아래 주제별 slug를 늘리는 프로그래매틱 SEO와 함께 쓰기 좋습니다.',
    ],
  },
  {
    slug: 'flutter-mvp-sijang-gamjeong',
    title: 'Flutter MVP로 시장 검증하기: 언제 크로스플랫폼이 유리한가',
    description:
      '동시에 iOS·Android를보내야 할 때 Flutter가 유리합니다. 네이티브가 필요한 시점도 짚어 드립니다.',
    keywords: ['Flutter MVP', '크로스플랫폼', '앱 출시', '스타트업'],
    publishedAt: '2026-04-06',
    readingMinutes: 5,
    paragraphs: [
      'Flutter는 UI 일관성과 빌드 파이프라인 단순화에 강합니다. 초기 팀이 작을 때 “한 코드베이스로 두 스토어”는 속도 면에서 큰 이점입니다.',
      '다만 AR·블루투스 저수준 제어·플랫폼 전용 SDK가 핵심이면 네이티브 모듈이 필요할 수 있습니다. MVP 단계에서는 우회 경로(웹뷰·서버 처리)로 시작하고, PMF 이후에 최적화하는 전략이 비용 대비 효율이 좋습니다.',
      '스토어 심사·버전 관리·크래시 리포팅까지 포함한 “출시 패키지” 기준을 미리 정하면 중간에 항목이 늘어나며 견적이 흔들리는 일을 줄일 수 있습니다.',
    ],
  },
  {
    slug: 'hoe-ui-seo-jae-gaebal-sigan',
    title: '외주 개발사 회의 없이 수정하려면: 권한과 문서화',
    description:
      '배포 파이프라인과 콘텐츠 레이어를 분리하면 대표님이 손댈 수 있는 영역이 넓어집니다.',
    keywords: ['외주 회의', '앱 수정', '배포 자동화', '콘텐츠 관리'],
    publishedAt: '2026-04-07',
    readingMinutes: 5,
    paragraphs: [
      '“회의 없이 수정”은 기술적으로 콘텐츠가 코드와 분리되어 있어야 가능에 가깝습니다. CMS, 원격 설정, 혹은 잘 나뉜 컴포넌트 구조가 전제입니다.',
      '권한은 최소 권한 원칙으로 나누되, 대표 계정으로 스토어·도메인을 소유해야 합니다. 외주사 계정에만 자산이 묶이면 이전 비용이 큽니다.',
      '문서는 “어디를 바꾸면 어디에 반영되는지” 스크린샷과 함께 적어 두세요. 름랩은 이런 운영 문서와 1:1 교육을 패키지에 포함합니다.',
    ],
  },
  {
    slug: 'sosub-gongneung-mvp-beomwi',
    title: '소수 기능 MVP 범위 정하기: MoSCoW로 한 장 정리',
    description:
      'Must / Should / Could / Won’t로 나누면 불필요한 기능을 계약 단계에서 잘라낼 수 있습니다.',
    keywords: ['MVP 범위', '기능 우선순위', 'MoSCoW', '외주 견적'],
    publishedAt: '2026-04-08',
    readingMinutes: 4,
    paragraphs: [
      'MVP에서 가장 비싼 것은 “나중에 넣자”가 계속 쌓이는 것입니다. Won’t(하지 않음) 목록을 명시적으로 적는 순간 팀의 판단이 빨라집니다.',
      'Must는 없으면 서비스가 성립하지 않는 기능만 넣으세요. Should는 있으면 좋지만 2주 안에 대체 UX로 설명 가능한 것만 남깁니다.',
      '외주 견적서에 MoSCoW 표를 첨부하면 변경 요청이 왔을 때 “범위 밖” 논의가 데이터로 가능해집니다.',
    ],
  },
  {
    slug: 'ronching-hu-tekseuteu-byeongyeong',
    title: '론칭 후 텍스트 변경: 외주 없이 처리하는 체크리스트',
    description:
      '문구 변경이 배포를 타는지, CMS만 바꾸면 되는지부터 확인하세요.',
    keywords: ['론칭 후 수정', '텍스트 변경', '앱 운영', '유지보수'],
    publishedAt: '2026-04-09',
    readingMinutes: 5,
    paragraphs: [
      '하드코딩된 카피는 앱 스토어 심사를 다시 탈 수 있습니다. 빈번한 문구는 원격 설정이나 CMS로 빼 두는 편이 운영에 유리합니다.',
      '이미지는 해상도·용량 가이드를 정해 두면 마케터가 직접 교체하기 쉽습니다. WebP·압축 파이프라인을 빌드에 넣어 두세요.',
      'AI는 변경 초안을 빠르게 만들고, 사람이 브랜드 톤만 검수하는 이중 구조가 실수를 줄입니다.',
    ],
  },
  {
    slug: 'gaebal-myeongseo-hwak-in-bangbeob',
    title: '외주 개발 명세서 확인 방법: 화면·API·예외 3단 구성',
    description:
      '화면 단위로 입력값·결과·에러를 적으면 개발사와 대화 비용이 줄어듭니다.',
    keywords: ['개발 명세서', '외주 체크리스트', '기능 정의', '앱 기획'],
    publishedAt: '2026-04-10',
    readingMinutes: 6,
    paragraphs: [
      '좋은 명세는 “사용자 한 명이 앱을 켠 뒤 끝까지 가는 스토리”입니다. 각 화면에 필요한 필드, 버튼, 로딩·실패 상태를 빠짐없이 적습니다.',
      'API 명세는 엔드포인트 이름보다 요청·응답 필드와 권한(로그인 여부)이 중요합니다. MVP에서는 필드를 최소화하고 확장 포인트만 주석으로 남겨도 충분합니다.',
      '검수는 체크리스트로: 스토어 정책(결제·개인정보), 딥링크, 푸시 권한 문구까지 포함하면 론칭 직전 이슈가 줄어듭니다.',
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}

export function blogCanonical(slug: string): string {
  return `${base}/${slug}/`;
}
