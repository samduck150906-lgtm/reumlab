/**
 * 프로그래매틱 SEO 3축 (일부) — 비교 콘텐츠
 * 라우트: /compare/[slug]
 * 의사결정 단계 유입을 흡수해 름랩 포지션으로 연결. JSON-LD: Article + BreadcrumbList.
 */
import { SITE } from './seo';
import { decideFromContent, fingerprint, type IndexDecision } from './index-quality';

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
  updatedAt?: string;
  sections?: { h: string; body: string; items: string[] }[];
  sources?: { title: string; url: string; note?: string }[];
}

export const COMPARES: CompareDef[] = [
  {
    "slug": "flutter-vs-react-native",
    "title": "Flutter vs React Native: MVP 관점 선택 기준",
    "h1": "Flutter vs React Native, MVP에는 무엇이 맞을까",
    "description": "Flutter와 React Native를 MVP 관점에서 비교합니다. 개발 속도, 성능, 유지보수, 생태계 측면의 차이와 초기 창업자를 위한 선택 기준을 정리합니다.",
    "keywords": [
      "Flutter vs React Native",
      "Flutter React Native 비교",
      "크로스플랫폼 비교",
      "MVP 프레임워크"
    ],
    "optionA": "Flutter",
    "optionB": "React Native",
    "intro": "Flutter와 React Native는 모두 하나의 코드로 iOS·Android를 만드는 크로스플랫폼 프레임워크입니다. 둘 다 MVP에 적합하지만, 화면 일관성·성능·팀 구성에 따라 선택이 갈립니다. 초기 창업자 관점에서 핵심 차이를 정리했습니다.",
    "rows": [
      {
        "aspect": "화면 구현",
        "a": "자체 위젯·렌더링 구조로 UI를 구성",
        "b": "React와 플랫폼 네이티브 구성요소로 UI를 구성"
      },
      {
        "aspect": "성능 검증",
        "a": "목표 기기의 스크롤·시작·필수 SDK를 시험",
        "b": "같은 기기·같은 사용자 흐름으로 시험"
      },
      {
        "aspect": "팀 역량",
        "a": "Dart·Flutter 및 필요한 네이티브 연동 역량 확인",
        "b": "React·JavaScript/TypeScript 및 필요한 네이티브 연동 역량 확인"
      },
      {
        "aspect": "필수 연동",
        "a": "플러그인의 지원 OS·유지 상태·라이선스 확인",
        "b": "라이브러리와 네이티브 모듈의 지원·유지 상태 확인"
      },
      {
        "aspect": "유지보수",
        "a": "공유 코드 외에 OS별 테스트·서명·스토어 배포가 남음",
        "b": "공유 코드 외에 OS별 테스트·서명·스토어 배포가 남음"
      }
    ],
    "verdict": "Flutter와 React Native 중 어느 쪽이 무조건 빠르거나 저렴하다고 정할 수는 없습니다. 름랩의 Flutter 개발 범위를 검토할 때도 필수 SDK·기존 팀 역량·인수 후 유지보수 계획을 먼저 확인합니다. React 기반 코드와 담당 인력이 이미 있다면 React Native를 함께 비교하고, 플랫폼 고유 기능은 작은 시험으로 지원 여부를 확인합니다.",
    "faqs": [
      {
        "q": "초기 창업자에게는 둘 중 무엇이 나은가요?",
        "a": "두 플랫폼의 필수 기능과 인수 후 유지보수 담당자를 먼저 정하세요. Dart·Flutter 역량과 플러그인이 맞으면 Flutter를, React·JavaScript 코드와 팀 역량을 이어갈 필요가 크면 React Native를 검토합니다. 동일 기기의 핵심 흐름 시험 결과로 최종 선택합니다."
      },
      {
        "q": "나중에 네이티브로 갈아탈 수 있나요?",
        "a": "플랫폼별 기능을 네이티브 모듈로 연결할 수 있지만 화면 전체를 다른 기술로 바꾸는 일은 재구현이 필요할 수 있습니다. 서버 API·데이터 모델과 화면 코드를 구분해 재사용 범위를 확인해야 합니다."
      },
      {
        "q": "름랩은 어떤 프레임워크로 개발하나요?",
        "a": "름랩은 Flutter 앱 개발 서비스를 제공합니다. 공개 패키지의 범위와 필요한 외부 SDK·기존 코드의 호환성을 확인한 뒤 적용 여부를 정합니다."
      }
    ],
    "related": [
      {
        "href": "/flutter",
        "label": "Flutter 앱개발 서비스 보기"
      },
      {
        "href": "/guide/flutter-cost",
        "label": "Flutter 앱개발 비용"
      },
      {
        "href": "/blog/flutter-oeju-jangdanjeom/",
        "label": "Flutter 외주 장단점"
      }
    ],
    "publishedAt": "2026-06-22",
    "sections": [
      {
        "h": "결정 전에 수행할 동일 조건 시험",
        "body": "결제·카메라·지도 중 가장 중요한 기능을 골라 두 OS에서 정상 동작과 권한 거절·네트워크 끊김·앱 복귀를 시험합니다. 합격 기준은 화면 디자인뿐 아니라 응답 시간·오류 복구·배포 가능 여부까지 적습니다.",
        "items": [
          "필수 SDK·OS 지원 버전과 플러그인 유지 상태를 확인",
          "예상 기능표를 같은 조건으로 견적 요청",
          "소스 이관 후 담당 팀이 빌드·배포를 재현할 수 있는지 확인"
        ]
      }
    ],
    "sources": [
      {
        "title": "Flutter architectural overview",
        "url": "https://docs.flutter.dev/resources/architectural-overview",
        "note": "공유 코드와 플랫폼 연결 구조 확인. 절감률·성능 우열의 근거가 아님."
      },
      {
        "title": "React Native Architecture Overview",
        "url": "https://reactnative.dev/architecture/overview",
        "note": "현재 아키텍처 문서 확인. 오래된 bridge 설명만으로 성능을 비교하지 않음."
      }
    ],
    "updatedAt": "2026-10-20"
  },
  {
    "slug": "outsourcing-vs-nocode",
    "title": "앱 외주 vs 노코드: 통제권·확장성 관점 비교",
    "h1": "앱 외주 vs 노코드, 무엇을 선택할까",
    "description": "앱·웹을 외주 개발할지 노코드 툴로 만들지 비교합니다. 초기 비용, 확장성, 통제권, 소스코드 관점에서의 차이와 선택 기준을 정리합니다.",
    "keywords": [
      "앱 외주 vs 노코드",
      "노코드 vs 개발",
      "노코드 한계",
      "외주 개발 장점"
    ],
    "optionA": "외주 개발",
    "optionB": "노코드",
    "intro": "노코드와 맞춤 외주 개발은 제공 기능·운영비·권한·이전 조건을 같은 요구사항으로 비교해야 합니다. 제품별 기능과 요금제, 외주 계약 범위에 따라 선택이 달라지므로 핵심 흐름 하나를 실제로 시험한 뒤 결정합니다.",
    "rows": [
      {
        "aspect": "시작 범위",
        "a": "요구사항·계약·담당자 일정 확인 후 구현",
        "b": "선택 제품이 제공하는 기능을 설정해 시작"
      },
      {
        "aspect": "확장성",
        "a": "코드 변경 가능하나 설계·인프라·개발 비용 필요",
        "b": "제품 API·플러그인·사용량 제한 내에서 확장"
      },
      {
        "aspect": "데이터·코드",
        "a": "계약에서 소유권·이관 산출물·라이선스 확인",
        "b": "제품별 내보내기·API·코드 export 조건 확인"
      },
      {
        "aspect": "운영 비용",
        "a": "호스팅·외부 API·보안 대응·선택 유지보수",
        "b": "구독 요금·추가 사용자·사용량·플러그인 비용"
      },
      {
        "aspect": "선택 조건",
        "a": "고유 흐름·연동·인수 후 개발 통제가 필요할 때 검토",
        "b": "표준 기능으로 핵심 가설을 시험할 수 있을 때 검토"
      }
    ],
    "verdict": "기성 노코드 제품으로 핵심 흐름을 충분히 검증할 수 있으면 먼저 시험해 볼 수 있습니다. 고유 권한·정산·연동 때문에 우회 작업이 반복되면 맞춤 개발과 비교합니다. 제품별 제약과 계약을 확인하지 않은 채 노코드 전체의 비용·이전 가능성을 단정하지 않습니다.",
    "faqs": [
      {
        "q": "노코드로 시작했다가 개발로 옮길 수 있나요?",
        "a": "사용 중인 제품의 데이터 내보내기·API·파일 다운로드·식별자 보존 조건부터 확인해야 합니다. 화면과 업무 로직은 재구현이 필요할 수 있고, 계정 비밀번호나 결제 수단은 그대로 이전할 수 없는 경우가 있으므로 시험 이관을 먼저 합니다."
      },
      {
        "q": "노코드의 가장 큰 한계는 무엇인가요?",
        "a": "제약은 제품과 요금제마다 다릅니다. 사용자별 권한, 데이터 양, API 호출, 첨부 파일, 외부 인증, 내보내기와 계약 종료 조건을 실제 요구사항과 대조하세요."
      },
      {
        "q": "처음부터 외주 개발이 나은 경우는?",
        "a": "제품에서 지원하지 않는 고유 기능이 핵심 가설이거나, 지정된 인프라·세부 권한·외부 연동이 필수라면 맞춤 개발을 검토합니다. 먼저 제품의 지원 범위를 확인해 우회 가능한 수준인지 비교하세요."
      },
      {
        "q": "노코드 구독료와 개발 비용, 장기적으로 뭐가 저렴한가요?",
        "a": "정해진 답은 없습니다. 같은 운영 기간과 사용자·사용량을 가정해 노코드 구독·추가 요금·운영 작업과 맞춤 제작·호스팅·API·유지보수·이전 비용을 합산해 비교합니다. 소스코드 보유가 운영비 0원을 뜻하지 않습니다."
      }
    ],
    "related": [
      {
        "href": "/mvp",
        "label": "MVP 개발 서비스 보기"
      },
      {
        "href": "/source-handover/",
        "label": "소스코드 이관 — 외주 종속 피하기"
      },
      {
        "href": "/guide/mvp-cost",
        "label": "MVP 비용 줄이기"
      }
    ],
    "publishedAt": "2026-06-22",
    "sections": [
      {
        "h": "예약 서비스로 해 보는 전환 판단",
        "body": "가정: 예약 신청과 직원 승인만 필요하면 기성 도구로 시험할 수 있습니다. 여러 업체의 정산·별도 권한·부분 환불이 핵심이라면 해당 제품이 이 흐름을 제공하는지 실제 테스트합니다. 이름이 같은 예약 기능이라도 예외 처리 범위가 다릅니다.",
        "items": [
          "실제 샘플 데이터를 export한 뒤 항목·파일·ID가 보존되는지 확인",
          "요금제 상향 조건과 사용량 초과 비용을 동일 기간으로 계산",
          "맞춤 개발 전환 시 중단 시간·재가입·과거 이력 조회 계획 작성"
        ]
      }
    ],
    "updatedAt": "2026-10-20"
  },
  {
    "slug": "outsourcing-vs-inhouse",
    "title": "외주개발 vs 자체개발: 초기 창업자의 의사결정",
    "h1": "외주개발 vs 자체개발, 초기에는 무엇이 맞을까",
    "description": "초기 창업자가 외주개발과 자체(인하우스) 개발 중 무엇을 선택할지 비교합니다. 비용, 속도, 통제권, 채용 리스크 관점의 차이를 정리합니다.",
    "keywords": [
      "외주개발 vs 자체개발",
      "인하우스 vs 외주",
      "개발팀 채용",
      "초기 스타트업 개발"
    ],
    "optionA": "외주개발",
    "optionB": "자체개발(인하우스)",
    "intro": "초기 창업자는 \"개발팀을 뽑을까, 외주를 줄까\"를 고민합니다. 검증 전 단계에서 개발자를 채용하는 것은 비용·리스크가 크고, 외주는 빠르게 시작하되 통제권 확보가 관건입니다. 단계별로 무엇이 맞는지 정리했습니다.",
    "rows": [
      {
        "aspect": "초기 비용",
        "a": "프로젝트 단위 비용, 고정 인건비 없음",
        "b": "채용·급여·4대보험 등 고정비 부담"
      },
      {
        "aspect": "시작 속도",
        "a": "담당자 배정·착수 가능일·범위 합의가 필요",
        "b": "채용·온보딩 또는 기존 팀의 투입 가능일 확인"
      },
      {
        "aspect": "통제권",
        "a": "소스코드 이관 시 통제권 확보 가능",
        "b": "내부에 역량·코드가 축적됨"
      },
      {
        "aspect": "검증 단계 적합성",
        "a": "검증 전·MVP 단계에 적합",
        "b": "제품 방향이 확정되고 지속 개발이 필요할 때 적합"
      },
      {
        "aspect": "리스크",
        "a": "업체 선택·이관 조건이 관건",
        "b": "채용 실패·이탈 리스크"
      }
    ],
    "verdict": "한 번의 명확한 납품 범위와 외부 전문성이 필요하면 외주를, 제품 방향이 자주 바뀌고 지속적인 기술 판단이 핵심이면 내부팀을 검토합니다. 초기 기업이라도 보안·핵심 알고리즘·운영 대응이 중요하면 내부 책임자를 두는 편이 적합할 수 있습니다. 외주와 내부팀을 병행할 때도 우선순위·코드 리뷰·배포 승인 책임자를 명확히 정해야 합니다.",
    "faqs": [
      {
        "q": "초기에 개발자를 뽑는 게 나을까요, 외주가 나을까요?",
        "a": "검증 전이라는 이유만으로 외주가 정답은 아닙니다. 요구 변경 빈도·핵심 기술의 중요도·출시 후 장애 대응·현재 채용 가능성을 함께 비교합니다. 명확한 1차 산출물은 외주로, 지속 제품 판단은 내부 담당자가 맡는 방식도 가능합니다."
      },
      {
        "q": "외주로 만들면 내부팀으로 전환하기 어렵지 않나요?",
        "a": "코드뿐 아니라 실행·배포 문서, 데이터 구조, 테스트, 라이선스와 계정 권한이 필요합니다. 내부 담당자가 직접 빌드·배포하고 예시 오류를 재현할 수 있는 인수 기간을 잡아 전환 부담을 확인합니다."
      },
      {
        "q": "외주와 자체개발을 병행할 수도 있나요?",
        "a": "가능합니다. 내부 담당자는 제품 우선순위·검수·배포 승인을 맡고 외주팀은 합의한 구현을 맡는 식으로 책임을 나눌 수 있습니다. 중복 개발을 피하려면 저장소·작업 단위·승인 절차를 함께 정합니다."
      },
      {
        "q": "외주로 만들면 통제권을 잃는 것 아닌가요?",
        "a": "소스코드·저장소·배포·데이터 접근 권한과 계약상 이용 권리를 확인해야 합니다. 권한이 있어도 운영 역량과 문서가 없으면 인수에 시간이 걸리므로 실제 실행·복구 점검을 포함하세요."
      }
    ],
    "related": [
      {
        "href": "/guide/startup-mvp",
        "label": "스타트업 MVP 개발 가이드"
      },
      {
        "href": "/source-handover/",
        "label": "소스코드 이관 — 외주 종속 피하기"
      },
      {
        "href": "/mvp",
        "label": "MVP 개발 서비스 보기"
      }
    ],
    "publishedAt": "2026-06-22",
    "sections": [
      {
        "h": "세 달의 개발·운영 책임을 적어 비교한다",
        "body": "정해진 기간의 기능 개발뿐 아니라 오류 대응·배포·외부 정책 변경·고객 요청 처리까지 누가 맡을지 적습니다. 급여와 외주 금액만 비교하지 말고 채용·교육·검수·인수와 공백 시 대응 비용을 함께 보세요.",
        "items": [
          "제품 우선순위와 수용 여부를 결정할 내부 담당자 지정",
          "외주 담당자의 교체·휴가·중도 종료 시 인수 산출물 확인",
          "주간 데모·리뷰·운영 장애의 의사결정 경로를 문서화"
        ]
      }
    ],
    "updatedAt": "2026-10-20"
  }
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

/**
 * 비교 페이지 색인 판정 — intro + 비교표(각 행의 a/b) + verdict + FAQ에서 측정한다.
 */
export function compareDecision(slug: string): IndexDecision | null {
  const cmp = getCompare(slug);
  if (!cmp) return null;
  const others = COMPARES.filter((c) => c.slug !== cmp.slug);
  const rowsText = cmp.rows.map((r) => `${r.aspect} ${r.a} ${r.b}`);
  return decideFromContent({
    title: cmp.title,
    description: cmp.description,
    h1: cmp.h1,
    bodyParts: [cmp.intro, ...rowsText, cmp.verdict, ...cmp.faqs.map((f) => f.a)],
    faqQuestions: cmp.faqs.map((f) => f.q),
    internalLinks: 2 + cmp.related.length,
    hasUniqueMedia: false,
    peerFingerprints: others.map((c) =>
      fingerprint(`${c.intro} ${c.verdict} ${c.rows.map((r) => `${r.a} ${r.b}`).join(' ')}`),
    ),
  });
}
