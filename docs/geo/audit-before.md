# 수정 전 기준선

- 시작: 2026-09-13 00:42 KST
- 기준 커밋: `24cb613fe2bcd41b74a7d3f8ef389d09486917c6`

> 이 전체 해시를 롤백 기준으로 삼는다.

## 코드 기준선

- 브랜치: `main`, `origin/main`과 동일
- 시작 시 미커밋 변경: 없음
- 프레임워크: Next.js 14 정적 export + 정적 홈 `index.html` 덮어쓰기
- 패키지 관리: npm, `package-lock.json`
- 배포: Netlify, `npm run build`, `out/`
- 핵심 데이터: `lib/`, `content/`, `scripts/generate-purpose-landings.mjs`

## 수정 전 실행 결과

| 검사 | 결과 | 상태 |
|---|---|---|
| `npm test` | 19/19 pass | TESTED |
| `npm run typecheck` | pass | TESTED |
| `npm run seo:qa` | HTML 1,344; indexable 778; 신호 충돌 0; 경고 1 | TESTED |
| `npm run seo:verify:pricing` | HTML 1,349; 패키지 8종; 폐기 가격 0 | TESTED |
| `npm run build` | 1,338 static routes; sitemap 778; success | TESTED |

기존 경고는 홈에서 6클릭 이상인 색인 URL 109개, 최대 깊이 12다. 이 작업에서 임의 대량 링크 블록을 추가하지 않고 기존 인덱스 스포크를 보존한다.

## 핵심 URL 보존 판정

- `/`, `/app-development/`, `/mvp/`, `/source-handover/`, `/maintenance/`, `/enterprise-ai/`, `/geo-website/`, `/portfolio/`, `/guide/mvp-cost/`: 정적 빌드에 존재
- `/l/mvp-dev-cost/`: 기존 redirect 정책을 보존하며 구 콘텐츠를 복원하지 않음
- canonical, robots, sitemap, NAP, 익명 사례·목업 고지: 전면 교체 대상 아님

## 운영·콘솔 기준선

이 파일은 코드 수정 전 저장소 기준선이다. GSC·네이버·Bing·GA4·CDN의 가장 최신 수치는 서명된 export와 콘솔 조회 시각을 함께 보관해야 한다. 사이트맵 제출을 색인 완료로 간주하지 않는다.

## 2026-09-13 공식 문서 확인

- Google은 AI Overviews/AI Mode에 별도 AI 파일이나 특수 schema를 요구하지 않고, 색인·스니펫 적격성·유용한 콘텐츠·기술 SEO를 기본으로 안내한다: https://developers.google.com/search/docs/appearance/ai-features
- Google의 2026 가이드는 llms.txt가 Google 검색 노출에 도움이나 불이익을 주지 않으며, 독자에게 고유하고 유용한 콘텐츠를 우선하라고 한다: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google 업데이트 기록에 따라 FAQ rich result는 2026-05-07부터 표시되지 않는다. 유용한 FAQ 본문은 그 이유로 삭제하지 않는다: https://developers.google.com/search/updates
- OpenAI는 OAI-SearchBot(검색), GPTBot(모델 학습), ChatGPT-User(사용자 요청 방문)의 역할을 구분한다: https://developers.openai.com/api/docs/bots
