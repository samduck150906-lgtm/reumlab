/**
 * 프로그래매틱 SEO 3축 (일부) — 비교 콘텐츠
 * 라우트: /compare/[slug]
 * 의사결정 단계 유입을 흡수해 름랩 포지션으로 연결. JSON-LD: Article + BreadcrumbList.
 */
import { SITE } from './seo';

export interface CompareRow {
  aspect: string;
  a: string;
  b: string;
}
export interface CompareDef {
  slug: string;
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  optionA: string;
  optionB: string;
  intro: string;
  rows: CompareRow[];
  /** 결론/름랩 포지션 */
  verdict: string;
  faqs: { q: string; a: string }[];
  related: { href: string; label: string }[];
  publishedAt: string;
}

export const COMPARES: CompareDef[] = [
  {
    slug: 'flutter-vs-react-native',
    title: 'Flutter vs React Native: MVP 관점 선택 기준',
    h1: 'Flutter vs React Native, MVP에는 무엇이 맞을까',
    description:
      'Flutter와 React Native를 MVP 관점에서 비교합니다. 개발 속도, 성능, 유지보수, 생태계 측면의 차이와 초기 창업자를 위한 선택 기준을 정리합니다.',
    keywords: ['Flutter vs React Native', 'Flutter React Native 비교', '크로스플랫폼 비교', 'MVP 프레임워크'],
    optionA: 'Flutter',
    optionB: 'React Native',
    intro:
      'Flutter와 React Native는 모두 하나의 코드로 iOS·Android를 만드는 크로스플랫폼 프레임워크입니다. 둘 다 MVP에 적합하지만, 화면 일관성·성능·팀 구성에 따라 선택이 갈립니다. 초기 창업자 관점에서 핵심 차이를 정리했습니다.',
    rows: [
      { aspect: 'UI 일관성', a: '자체 렌더링 엔진으로 플랫폼 간 화면이 거의 동일', b: '네이티브 컴포넌트 기반이라 플랫폼별 차이가 날 수 있음' },
      { aspect: '성능', a: '컴파일 방식으로 애니메이션·렌더링이 매끄러움', b: '대부분의 앱에서 충분하나 복잡한 UI는 최적화 필요' },
      { aspect: '개발 속도(MVP)', a: '풍부한 위젯으로 빠른 UI 구성', b: 'JS/React 경험이 있으면 빠르게 시작' },
      { aspect: '생태계·인력', a: '성장세가 빠르며 구글 지원', b: 'JS 생태계가 넓어 인력 풀이 큼' },
      { aspect: '유지보수', a: '단일 코드·위젯 구조로 일관된 유지보수', b: '네이티브 모듈이 늘면 유지보수 복잡도 증가' },
    ],
    verdict:
      '름랩은 MVP에 Flutter를 우선 권장합니다. 플랫폼 간 화면 일관성과 렌더링 성능이 검증 단계에서 유리하고, 단일 코드 구조라 유지보수와 소스코드 이관이 깔끔하기 때문입니다. 다만 이미 React/JS 인력이 있는 팀이라면 React Native도 합리적인 선택이며, 상담에서 팀 상황에 맞춰 안내합니다.',
    faqs: [
      { q: '초기 창업자에게는 둘 중 무엇이 나은가요?', a: '대부분의 MVP에는 Flutter를 권장합니다. 화면 일관성과 성능이 좋고 유지보수가 단순하기 때문입니다. 다만 팀에 React/JS 역량이 있으면 React Native도 좋은 선택입니다.' },
      { q: '나중에 네이티브로 갈아탈 수 있나요?', a: '서비스가 크게 성장해 플랫폼 고유 기능이 깊게 필요해지면 일부를 네이티브로 옮기는 경우가 있습니다. MVP 단계에서는 크로스플랫폼으로 빠르게 검증하는 것이 합리적입니다.' },
      { q: '름랩은 어떤 프레임워크로 개발하나요?', a: '름랩은 Flutter를 주력으로 합니다. MVP에 적합한 출시 속도·비용·유지보수 이점 때문이며, 팀 상황에 따라 다른 선택지도 상담에서 안내합니다.' },
    ],
    related: [
      { href: '/flutter', label: 'Flutter 앱개발 서비스 보기' },
      { href: '/guide/flutter-cost', label: 'Flutter 앱개발 비용' },
      { href: '/blog/flutter-oeju-jangdanjeom/', label: 'Flutter 외주 장단점' },
    ],
    publishedAt: '2026-06-22',
  },
  {
    slug: 'outsourcing-vs-nocode',
    title: '앱 외주 vs 노코드: 통제권·확장성 관점 비교',
    h1: '앱 외주 vs 노코드, 무엇을 선택할까',
    description:
      '앱·웹을 외주 개발할지 노코드 툴로 만들지 비교합니다. 초기 비용, 확장성, 통제권, 소스코드 관점에서의 차이와 선택 기준을 정리합니다.',
    keywords: ['앱 외주 vs 노코드', '노코드 vs 개발', '노코드 한계', '외주 개발 장점'],
    optionA: '외주 개발',
    optionB: '노코드',
    intro:
      '노코드 툴은 빠르고 저렴하게 시작할 수 있어 매력적입니다. 하지만 서비스가 커지면 확장성·비용·통제권에서 한계가 드러나기도 합니다. 두 방식의 차이를 알고 단계에 맞게 선택하는 것이 중요합니다.',
    rows: [
      { aspect: '초기 비용·속도', a: '제작 비용이 들지만 맞춤 구현 가능', b: '매우 빠르고 저렴하게 시작 가능' },
      { aspect: '확장성', a: '기능·트래픽 확장이 자유로움', b: '플랫폼 제약으로 복잡한 기능·확장에 한계' },
      { aspect: '통제권·소스코드', a: '소스코드를 보유해 완전한 통제권', b: '플랫폼에 종속, 데이터 이전이 어려울 수 있음' },
      { aspect: '운영 비용', a: '소스코드 보유 시 월 비용 통제 가능', b: '구독료가 사용량·기능에 따라 지속 발생' },
      { aspect: '적합 단계', a: '검증 후 확장, 차별화 기능이 필요할 때', b: '초기 아이디어 검증, 단순 기능' },
    ],
    verdict:
      '아이디어를 아주 빠르게 검증하는 단계라면 노코드도 좋은 출발점입니다. 하지만 차별화 기능, 확장, 데이터·소스코드 통제가 필요해지면 외주 개발이 유리합니다. 름랩은 소스코드를 이관하고 직접 운영 교육을 제공해, 노코드의 "빠름"과 개발의 "통제권"을 함께 가져가도록 돕습니다.',
    faqs: [
      { q: '노코드로 시작했다가 개발로 옮길 수 있나요?', a: '가능합니다. 노코드로 검증한 뒤 핵심 기능을 개발로 옮기는 사례가 많습니다. 름랩은 검증 결과를 바탕으로 MVP를 설계해 자연스럽게 전환을 돕습니다.' },
      { q: '노코드의 가장 큰 한계는 무엇인가요?', a: '플랫폼 종속과 확장 한계입니다. 복잡한 기능·대규모 트래픽·세밀한 커스터마이징이 필요해지면 제약이 커지고, 데이터·소스코드를 직접 통제하기 어렵습니다.' },
      { q: '처음부터 외주 개발이 나은 경우는?', a: '차별화된 핵심 기능이 분명하거나, 데이터·소스코드 통제가 중요하거나, 빠른 확장이 예상되는 경우 처음부터 개발이 유리합니다.' },
    ],
    related: [
      { href: '/mvp', label: 'MVP 개발 서비스 보기' },
      { href: '/blog/oeju-gaebal-silphae-an-haneun-bab/', label: '외주개발, 실패 안 하는 법' },
      { href: '/guide/mvp-cost', label: 'MVP 비용 줄이기' },
    ],
    publishedAt: '2026-06-22',
  },
  {
    slug: 'outsourcing-vs-inhouse',
    title: '외주개발 vs 자체개발: 초기 창업자의 의사결정',
    h1: '외주개발 vs 자체개발, 초기에는 무엇이 맞을까',
    description:
      '초기 창업자가 외주개발과 자체(인하우스) 개발 중 무엇을 선택할지 비교합니다. 비용, 속도, 통제권, 채용 리스크 관점의 차이를 정리합니다.',
    keywords: ['외주개발 vs 자체개발', '인하우스 vs 외주', '개발팀 채용', '초기 스타트업 개발'],
    optionA: '외주개발',
    optionB: '자체개발(인하우스)',
    intro:
      '초기 창업자는 "개발팀을 뽑을까, 외주를 줄까"를 고민합니다. 검증 전 단계에서 개발자를 채용하는 것은 비용·리스크가 크고, 외주는 빠르게 시작하되 통제권 확보가 관건입니다. 단계별로 무엇이 맞는지 정리했습니다.',
    rows: [
      { aspect: '초기 비용', a: '프로젝트 단위 비용, 고정 인건비 없음', b: '채용·급여·4대보험 등 고정비 부담' },
      { aspect: '시작 속도', a: '바로 시작 가능', b: '채용·온보딩에 시간 소요' },
      { aspect: '통제권', a: '소스코드 이관 시 통제권 확보 가능', b: '내부에 역량·코드가 축적됨' },
      { aspect: '검증 단계 적합성', a: '검증 전·MVP 단계에 적합', b: '제품 방향이 확정되고 지속 개발이 필요할 때 적합' },
      { aspect: '리스크', a: '업체 선택·이관 조건이 관건', b: '채용 실패·이탈 리스크' },
    ],
    verdict:
      '검증 전 단계라면 외주로 빠르게 MVP를 만들어 시장을 확인하는 편이 합리적입니다. 핵심은 소스코드 이관으로 통제권을 확보하는 것입니다. 름랩은 소스코드·배포 권한을 이관하고 운영 교육을 제공해, 검증 후 내부팀을 꾸릴 때 코드를 그대로 이어받도록 돕습니다.',
    faqs: [
      { q: '초기에 개발자를 뽑는 게 나을까요, 외주가 나을까요?', a: '제품 방향이 검증되기 전이라면 외주로 MVP를 만들어 시장을 확인하는 편이 비용·리스크 면에서 유리합니다. 방향이 확정되고 지속 개발이 필요해지면 내부팀을 꾸리는 것이 좋습니다.' },
      { q: '외주로 만들면 내부팀으로 전환하기 어렵지 않나요?', a: '소스코드를 이관받으면 전환이 어렵지 않습니다. 름랩은 확장 가능한 구조로 만들고 코드·문서를 이관해, 내부 개발자가 이어받을 수 있도록 합니다.' },
      { q: '외주와 자체개발을 병행할 수도 있나요?', a: '가능합니다. 초기에는 외주로 MVP를 만들고, 검증 후 핵심 인력을 채용해 내부에서 이어가는 하이브리드 방식이 흔합니다.' },
    ],
    related: [
      { href: '/guide/startup-mvp', label: '스타트업 MVP 개발 가이드' },
      { href: '/blog/oeju-gaebal-silphae-an-haneun-bab/', label: '외주개발, 실패 안 하는 법' },
      { href: '/mvp', label: 'MVP 개발 서비스 보기' },
    ],
    publishedAt: '2026-06-22',
  },
];

const COMPARE_BY_SLUG = Object.fromEntries(COMPARES.map((c) => [c.slug, c]));
export function getCompare(slug: string): CompareDef | undefined {
  return COMPARE_BY_SLUG[slug];
}
export function allCompareSlugs(): string[] {
  return COMPARES.map((c) => c.slug);
}
export function compareCanonical(slug: string): string {
  return `${SITE.domain}/compare/${slug}/`;
}
