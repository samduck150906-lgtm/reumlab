# 산업별 AI·업무자동화 확장 구현 계획

> Spec: `docs/superpowers/specs/2026-09-28-industry-automation-seo-design.md`

## Task 1 — 데이터 계약과 품질 게이트

- 실패 테스트: 70개 분야, Priority S 필수 필드, 5개 이상 도구·업무·워크플로, 6개 FAQ, 중복 slug를 검사한다.
- 구현: `lib/automation-domains.ts`에 타입, 70개 분야, 공개 판정, canonical, metadata 도우미를 만든다.
- 검증: 해당 테스트와 typecheck를 통과시킨다.

## Task 2 — 검색어·AEO 연구 자산

- 실패 테스트: 7,000개 이상 고유 검색어, 분야별 100개 이상, 분야별 자연어 질문 30개 이상, 모든 targetPage 유효성을 검사한다.
- 구현: 결정적 생성기와 JSON/CSV 산출물을 만든다.
- 검증: 생성기를 두 번 실행해 같은 결과인지 확인한다.

## Task 3 — 상세 서비스 라우트

- 실패 테스트: 모든 공개 페이지의 self-canonical, H1, 핵심 답변, 5개 workflow, 제약, FAQ, 문의 폼, schema, 관련 링크를 검사한다.
- 구현: `/ai-automation/[slug]/` 정적 라우트와 모바일 친화적 UI를 만든다.
- 검증: route render 테스트, typecheck, build를 통과시킨다.

## Task 4 — 허브 디렉터리와 내부 링크

- 실패 테스트: 기존 `/ai-automation/` 산출물에 70개 분야, 공개 상세 링크, 검색·필터 UI가 있고 비공개 분야에는 링크가 없는지 검사한다.
- 구현: prebuild extractor와 목적 랜딩 생성기를 연결한다.
- 검증: 정적 산출물과 무자바스크립트 표시를 확인한다.

## Task 5 — 사이트맵·SEO QA·전체 검증

- 실패 테스트: 공개 URL만 사이트맵에 존재하고, title/description/canonical 중복·orphan·유사도 위반이 없는지 검사한다.
- 구현: sitemap, package scripts, 자동화 전용 QA를 연결한다.
- 검증: `npm test`, `npm run typecheck`, `npm run build`, 자동화 QA를 실행한다.

## Review Focus

- 기존 `/ai-automation/` 정적 덮어쓰기와 새 동적 라우트의 충돌
- 70개 분야 디렉터리가 링크 벽이나 doorway 구조가 되지 않는지
- 검색어 연구 파일이 화면 본문이나 metadata에 대량 주입되지 않는지
- 공개 판정과 sitemap 판정이 같은 단일 출처를 쓰는지
- Netlify 문의 폼과 기존 색인 보호 기준선 회귀 여부
