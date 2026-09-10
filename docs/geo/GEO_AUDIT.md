# REUMLAB GEO · AI Search · Technical SEO audit

기준일: 2026-09-10 (Asia/Seoul)

## 1. Executive Summary

이번 작업은 새 지역·검색어 페이지를 만들지 않고 대표 URL, 사업자 엔터티, 화면 근거, 초기 HTML, 크롤러 접근, 측정과 반복 QA를 정리했다. 최종 정적 모델은 canonical indexable 777개, noindex 566개, redirect 규칙 153개이며 sitemap에는 777개의 최종 200 canonical만 들어간다.

P0 코드 문제는 수정했다. 성남 지역의 15개 구형 slug를 현행 지역 서비스 3개 URL로 통합하고, 비용·가격·제작비·견적처럼 단어만 다른 service_intent 94개도 대표 가이드로 통합했다. 과거 소재지 신호를 정리했으며, 미확인 법적 상호·창업자 schema와 화면 키워드 나열을 제거했다. 전역 NAP와 공개 프로필은 하나의 설정을 사용한다.

다만 777개 색인 URL의 상당수가 프로그램형 업종·비용·솔루션·웹사이트 축이다. 정확 중복과 현재 QA 임계치 위의 자기잠식은 없지만, 모든 페이지에 충분한 1차 근거가 있다는 뜻은 아니다. 109개 색인 URL의 클릭 깊이도 6 이상이다. 배포 후 검색·문의 데이터에 따라 근거 강화, noindex, 통합을 계속 결정해야 한다.

## 2. 발견된 P0 문제

- `/l/seongnam-app-dev-out/` 등 구형 랜딩과 `/app-development/seongnam/` 등이 같은 의도를 나눴다.
- 지역명 없는 `/l/` 96개가 비용·가격·제작비·견적의 어순만 바꿔 같은 구매 의도를 나눴다.
- 생성 설정의 대표 지역에 `인계동`이 남아 현재 동탄·영천동 사업장과 충돌할 수 있었다.
- Organization schema의 `legalName`이 마케팅 설명을 법적 상호처럼 사용했고, 대표자를 `founder`로 추정했다.
- 서비스 페이지 히어로에 SEO 키워드 배열이 칩 목록으로 노출됐다.
- Windows에서 Unix `cp`, CRLF 고정 정규식, 역슬래시 경로 때문에 빌드와 QA가 재현되지 않았다.

## 3. 실제 수정한 항목

- `lib/seo.ts`의 `SITE`에 엔터티 필드를 확장하고 푸터·schema 소비처를 연결했다.
- 미확인 `legalName`과 `founder`의 JSON-LD 출력을 제거했다.
- 성남 앱·웹·MVP 레거시 slug를 build 대상에서 제외하고 `_redirects`에 단일 301을 추가했다.
- service_intent 96개 중 정확한 대체 페이지가 없는 쇼핑몰·서비스기획 대표 2개만 유지하고, 나머지 94개를 앱·웹·MVP 비용 가이드로 통합했다.
- `인계동` 생성 설정을 `동탄`으로 고쳤으며 회사 소재지 문맥을 검사하는 스크립트를 추가했다.
- 서비스 히어로의 키워드 칩 렌더링을 삭제했다.
- 첫 랜딩, 리퍼러 hostname, 허용 UTM, AI/검색 채널 분류를 폼과 dataLayer에 추가했다. click id와 PII는 이벤트에서 제외했다.
- Windows 호환 정적 파일 복사와 경로 정규화를 적용했다.
- URL·콘텐츠·엔터티·redirect 결정을 CSV/Markdown/JSON으로 재생성하는 `geo:*` 명령을 추가했다.

## 4. URL 통합 및 redirect

다음 slug는 slash 유무와 관계없이 체인 없이 최종 URL로 301한다.

- 앱 → `/app-development/seongnam/`: `seongnam-app-dev`, `seongnam-app-dev-out`, `seongnam-app-dev-cost`, `seongnam-app-dev-quote`
- 웹 → `/web-development/seongnam/`: `seongnam-web-dev`, `seongnam-homepage-dev`, `seongnam-website-dev`, `seongnam-landing-page`, 각 web/homepage/landing의 cost·quote 변형
- MVP → `/mvp/seongnam/`: `seongnam-mvp-dev`

`seongnam-shopping-mall`은 직접 대응하는 현행 페이지가 없어 자동 통합하지 않았다. 전체 URL 결정은 `URL_DECISIONS.csv`에 있다. 최종 감사에서 redirect chain 0, loop 0, redirect 대상 내부 링크 0, sitemap의 redirect/noindex/404 0이다.

지역명 없는 앱·앱외주·모바일앱 비용 변형은 `/guide/app-cost/`, 홈페이지·웹·랜딩·웹사이트·반응형웹 변형은 `/guide/web-cost/`, MVP 변형은 `/guide/mvp-cost/`로 통합했다. 쇼핑몰과 서비스기획은 각각 `/l/shopping-mall-cost/`, `/l/service-plan-cost/` 하나를 대표로 남겼다. 이 결정으로 sitemap의 랜딩/허브 묶음은 108개에서 14개로 줄었다.

## 5. 사업자 엔터티 정리

브랜드 름랩/REUMLAB, 대표자 성아름, 동탄 사업장 주소, 전화, 이메일, 사업자번호, 전국 비대면 서비스, 실제 공개 프로필을 `SITE`에서 관리한다. JSON-LD 1,338페이지의 Organization과 ProfessionalService를 대조해 NAP·sameAs 충돌 0을 확인했다.

법적 상호는 비워 두었고 대표자를 founder로 표시하지 않는다. 일반 `인계동` 9개 파일은 수원 지역 데이터 등일 수 있어 보존하고 수동 검토 대상으로 남겼다.

## 6. 핵심 콘텐츠 개선

기존 자산에서 확인된 강한 1차 자료를 유지했다.

- 홈의 VAT 포함 8개 패키지 가격과 기간, 진행 과정, QA, 소스·권한 인계
- 15개 익명 사례의 문제, 기능, 구조, 기술, 산출물과 비공개 범위
- 45개 가이드의 초기 HTML 핵심 요약과 본문 앵커
- 기업용 AI 페이지의 가능 범위와 수행 경험 한계

새 고객명·성과·후기·인증을 만들지 않았다. 서비스 화면의 키워드 나열 칩만 제거했다. 정보성 색인 페이지 170개는 title/description/H1 중복 0, 고립 0, Article/BlogPosting 58개, 가이드 앵커 오류 0이었다.

## 7. 구조화 데이터

WebSite, Organization, ProfessionalService와 BreadcrumbList를 안정된 `@id`로 연결한다. 페이지 유형에 따라 Service, FAQPage, Article/BlogPosting, CollectionPage, Place를 보탠다. 실제 지점이 아닌 지역 서비스 페이지에 다중 LocalBusiness를 만들지 않았고, Review/AggregateRating도 추가하지 않았다.

최종 QA는 JSON-LD 문법 오류 0, 전역 엔터티 중복 0, 검증 불가 필드 0, breadcrumb 오류 0을 기록했다. 세부 매트릭스는 `SCHEMA_MATRIX.md`에 있다.

## 8. robots·sitemap·RSS·IndexNow

- robots: 공개 렌더링 자산을 허용하고 중복 RSC `/*index.txt$`만 차단한다. Yeti와 검색형 AI 크롤러를 명시 허용한다.
- sitemap: 12개 하위 sitemap과 index로 777개의 canonical 200 indexable URL만 포함한다.
- RSS: 블로그 10, 가이드 45, 비교 3으로 58 item을 생성한다.
- IndexNow: 변경 URL manifest 기반 제출과 `--dry-run`을 지원한다. 실제 제출은 하지 않았다.
- `llms.txt`: 기존 자동 생성 실험을 유지한다. `llms-full.txt`는 33KB의 제한된 FAQ/핵심 URL 파생물이며 화면과 83개 FAQ가 동기화된다. 표준 SEO 요소나 인용 보장 수단으로 취급하지 않는다.

GPTBot과 ClaudeBot의 학습 크롤링 허용은 기존 정책이며 이번 작업에서 임의 변경하지 않았다.

## 9. 내부 링크 및 토픽 구조

기존 서비스→가이드·사례·인계, 가이드→서비스·비교, 사례→서비스 연결을 검사했다. 깨진 링크 0, 고립된 색인 페이지 0, redirect를 향하는 내부 링크 0이다. 23/23 가이드 허브가 배선되어 있고 정보 가이드 중 상업 연결이 없는 페이지는 0이다.

잔여 위험은 109개 색인 URL이 홈에서 6클릭 이상(최대 12)이라는 점이다. `QUERY_MAP.md`를 기준으로 핵심 의사결정 허브에서 근거가 있는 페이지만 더 직접 연결한다.

## 10. 접근성 및 에이전트 호환성

핵심 내용은 정적 초기 HTML로 생성되며 H1 없는 색인 페이지와 600자 미만 SSR 본문은 0이다. 문의 폼에는 label, 필수 동의, loading/success/error, 중복 제출 방지, aria-live가 있다. 이미지 alt 누락 0, 이미지 치수 누락 0이었다.

실제 브라우저 키보드 순서, focus trap, 모바일 키보드, 색 대비, Lighthouse 접근성 점수는 이번 정적 검사만으로 확인할 수 없어 배포 전 작업으로 남겼다.

## 11. 측정 체계

세션 최초 랜딩, 현재 제출 페이지, 최초 리퍼러 hostname, 허용 UTM, `lead_source`를 dataLayer와 Netlify Forms에 전달한다. ChatGPT, Perplexity, Claude, Bing/Copilot, Google, Naver, campaign/direct/internal/referral을 구분한다. referrer가 없는 AI 유입은 식별 불가임을 전제로 한다.

기존 GTM 이벤트 이름은 유지하고 `generate_lead`는 서버 성공 후에만 발생한다. 단위 테스트와 정적 전환 감사에서 성공 전 발화, 중복 발화, 이벤트 PII가 모두 0이었다.

## 12. 테스트 결과

실행한 명령과 결과:

- `npm ci`: 성공. 1,297 packages 설치; audit 보고 61건(2 low, 17 moderate, 36 high, 6 critical)은 별도 의존성 검토 필요.
- `npm run typecheck`: 통과.
- `npm test`: 9/9 통과.
- `npm run build`: 통과. 1,431개 Next 정적 경로 생성 후 홈·랜딩·sitemap·llms 산출.
- `npm run geo:audit`: hard failure 없이 통과. 일반 `인계동` 문맥 9개 파일의 수동 확인 경고와 클릭 깊이 6 이상 109개(최대 12) 경고가 남았다.
- `npm run seo:verify`: sitemap·robots 통과.
- region/service/FAQ/media/Naver/portfolio/conversion/pricing/menu/cannibalization 검증: 모두 hard failure 없이 통과.
- `npm run geo:indexnow:dry-run`: 변경 후보를 계산하고 네트워크 제출 없이 종료. 최종 sitemap 기준 재실행 시 777개가 대상이다.
- 로컬 정적 프리뷰 smoke test: Googlebot, bingbot, Yeti, OAI-SearchBot, PerplexityBot, Claude-SearchBot 모두 `/app-development/`에서 HTTP 200과 동일한 83,119-byte HTML을 받았다. title, canonical, H1과 robots/sitemap/feed의 200 응답도 확인했다.

린트는 저장소에 ESLint 설정과 비대화형 lint 명령이 없어 별도 실행하지 못했다. Next build의 타입/빌드 단계는 통과했지만 이를 독립 lint 통과로 표현하지 않는다. 기존 E2E, 실제 Netlify 폼 제출, Lighthouse, 실브라우저 hydration 콘솔, 배포 후 프로덕션 봇 UA HTTP 테스트는 실행하지 않았다. 로컬 smoke test는 정적 HTML 동등성만 검증하며 Netlify redirect 동작을 대신하지 않는다.

빌드 중 Google Fonts stylesheet 다운로드 실패와 webpack cache snapshot 경고가 있었으나 compilation과 export는 성공했다. 배포 환경의 네트워크에서 폰트 동작을 다시 확인해야 한다.

## 13. 남은 위험

1. 프로그램형 색인 URL 777개의 실제 검색 가치와 1차 근거 밀도는 GSC·문의 데이터로 계속 검증해야 한다.
2. noindex 지역/랜딩 템플릿 566개는 색인되지는 않지만 crawl 예산과 유지보수 비용이 있다.
3. 109개 색인 URL의 클릭 깊이가 6 이상이다.
4. FAQ 질문이 여러 페이지에서 반복된다. 화면/schema 일치는 통과했지만 페이지 고유 판단 정보가 약해지지 않는지 추적해야 한다.
5. 프로덕션은 아직 이 코드가 배포되지 않아 redirect, schema, 키워드 나열 제거, 측정 변경이 반영되지 않았다.
6. npm 의존성 audit 61건은 자동 수정하지 않았으며 영향도 검토가 필요하다.

## 14. 외부 계정에서 해야 할 작업

Search Console, Bing Webmaster Tools, 네이버 Search Advisor, 플레이스/Business Profile, GA4/GTM, CDN 로그, Netlify Forms 작업을 `OWNER_ACTIONS.md`에 배포 순서대로 기록했다.

## 15. 사실 확인이 필요한 항목

법적 상호, founder 여부, 외부 프로필 소유권, 우편번호 최신성, 방문 상담/영업시간, 총 프로젝트 수, 팀 규모·업력, 고객 성과, 후기·인증, 기업 AI 실제 납품 범위는 확인 전 확정 주장으로 사용하지 않는다. 전체 목록은 `FACT_GAPS.md`에 있다.
