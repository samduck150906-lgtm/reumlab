# REUMLAB AEO·GEO 파일럿 실행 기록

기준일: 2026-09-12 (Asia/Seoul)

## 실행 범위와 보호 기준선

- 작업 브랜치: `codex/aeo-geo-pilot`
- 시작 커밋: `3cf18c07f840324cc2088209867e63d379e9e3f5`
- 이 작업 전에 존재하던 `/geo-website/` 및 공통 내비게이션·폼 변경은 사용자 작업으로 간주해 보존했다.
- 시작 산출물: HTML 1,349개, sitemap canonical URL 778개. 이전 777개 기준선과의 차이는 기존 미커밋 `/geo-website/` 추가분이다.
- 이번 파일럿은 기존 URL을 새로 만들거나 삭제하지 않는다. title, H1, canonical, redirect, noindex, 가격표, 전역 엔터티 ID를 바꾸지 않는다.

| 파일럿 URL | 보존 title | 보존 H1 | 보존 canonical | 2026-09-11 데이터 판정 |
|---|---|---|---|---|
| `/ai-development/` | AI 외주개발 \| 챗봇·상담 자동화 실전형 — 름랩 REUMLAB | AI 외주개발 | `https://reumlab.com/ai-development/` | IMPROVE, P1-data, Google 노출 500+, 클릭 0 |
| `/ai-automation/` | AI 업무 자동화 개발 — 반복 업무를 AI 흐름으로 \| 름랩 REUMLAB | AI 업무 자동화 개발 사람이 반복하던 일을 AI가 처리하는 흐름으로 | `https://reumlab.com/ai-automation/` | IMPROVE, P1-data, Google 노출 100–499, 클릭 0 |
| `/admin-page-development/` | 관리자 페이지 개발 외주 \| 어드민·백오피스 맞춤 구축 — 름랩 | 관리자 페이지 개발 — 엑셀·수기 관리를 어드민 한 화면으로 | `https://reumlab.com/admin-page-development/` | IMPROVE, P2-data, Google 노출 20–99, 클릭 1–2 |

원본 수치와 행 단위 데이터는 git 제외 경로인 `docs/seo-aeo/private/`에만 둔다. 공개 문서에는 기존 원칙대로 구간값만 기록한다.

## 감사 결론

1. 세 URL 모두 초기 HTML에 직접 답변, 적합·부적합, 기능 범위, 사례, 가이드, FAQ와 Service/FAQ 구조화 데이터가 이미 있다. 새 스키마나 새 페이지보다 범위·제외 조건을 더 분명히 하는 편이 우선이다.
2. `/ai-development/`와 `/ai-automation/`은 AI API 연결, 맞춤 모델 학습, 데이터 정리, 외부 사용료가 한 문장 안에서 섞일 수 있었다. 계약 범위·별도 범위·사람 검수·오류 이관 기준을 화면과 FAQ에 추가했다.
3. `/admin-page-development/`의 엑셀 이관 답변은 원본 상태와 관계없이 “가능”하다고 읽힐 수 있었다. 실제 파일 구조·중복·오류·API 접근권한을 확인한 뒤 자동/수동 범위를 나누도록 고쳤다.
4. 홈의 “MVP 개발 비용” 카드가 업종별 비용 인덱스 `/cost/`를 가리키고 있었다. 검색 의도와 제목에 맞는 `/guide/mvp-cost/`로 바꿨다.
5. `/cost/`는 실제 비용 하위 URL이 112개인데 title·H1·description은 “100개 업종”이라고 쓴다. title/H1 보호 원칙과 기존 검색 성과를 고려해 자동 변경하지 않고 소유자 검토 항목으로 남긴다.
6. `llms.txt`는 기존 자동 생성을 유지하지만 Google 노출을 높이는 전용 신호로 취급하지 않는다. Google의 2026-09-12 확인 문서는 Google Search가 `llms.txt`를 사용하지 않는다고 명시한다.
7. Netlify 빌드 명령은 모든 컨텍스트에서 IndexNow 스크립트를 실행했다. 전역 빌드에서는 전송 명령을 제거하고 Netlify production 컨텍스트에서만 `npm run seo:indexnow`를 호출한다. 스크립트는 실전송에 `--submit` 명시를 요구하고, deploy-preview·branch-deploy에서는 이 플래그가 있어도 차단한다. 기본 무플래그 실행까지 회귀 테스트하며 `--dry-run`은 모든 컨텍스트에서 허용한다.
8. 실제 390px 브라우저에서 목적 랜딩의 긴 H1과 520px 목업이 단일 grid track의 최소 폭을 키워 콘텐츠를 오른쪽에서 자르는 문제가 발견됐다. 모바일 grid를 `minmax(0, 1fr)`로 만들고 긴 강조문구를 줄바꿈하며 CTA를 세로 배치해 수정했다.

## 파일럿별 최소 변경

| URL | 변경 | 연결 근거 | 추가로 필요한 소유자 자료 |
|---|---|---|---|
| `/ai-development/` | 포함/별도 범위, 성능 수치 비보장, 맞춤 모델 학습 FAQ | 기존 AI 가이드 3개, 실제 익명 사례 매핑, `/enterprise-ai/` 문맥 링크 | 공개 가능한 입력·출력 예시, 검수 로그, 운영 전후 측정값 |
| `/ai-automation/` | 기본 확인/계약/별도 협의 표, 맞춤 모델 학습 FAQ | `/guide/ai-automation-guide/` 등 기존 가이드, 익명 사례 5개, Agent 경계 링크 | 공개 가능한 자동화 흐름, 오류·사람 승인 예시, 사용량 비용 예시 |
| `/admin-page-development/` | 데이터 이관 조건, 외부 연동 한계, 별도 범위 | 자체 CMS 데모(고객 사례 아님), 관리자/ERP 가이드, 실제 익명 사례 매핑 | 공개 허가된 관리자 화면 또는 데이터 이관 전후 산출물 |

## 6개 실행 전략

| 전략 | 이번 파일럿 적용 | 다음 단계 | 측정 지표 |
|---|---|---|---|
| Authority Density | 관련 가이드·실제 사례·공식 정책만 연결하고 범용 출처 나열을 금지 | 실제 산출물 공개 허가 확보 후 해당 서비스에만 추가 | 검증 완료 claim 비율, 오래된 출처 수 |
| Answer Directness | 첫 문장 직접 답변을 보존하고 포함/제외/판단 조건 보강 | GSC URL별 쿼리 export로 질문 문구 조정 | CTR, 답변 블록 노출, benchmark directness |
| Semantic Linkage | AI 챗봇↔사내 AI, 자동화↔Agent, 홈 MVP 비용↔MVP 비용 가이드 연결 | 깊이 6 이상 중요 URL만 허브에서 문맥 재배선 | 최대 클릭 깊이, 중요 URL 3클릭 이내 비율 |
| SERP Expansion | 기존 FAQ·Service·Article·Breadcrumb가 화면 내용과 일치하는지 유지 | 실제 화면이 확보된 페이지만 고유 이미지 추가 | 유효 구조화 데이터, 이미지/영상 노출 |
| Claim-evidence discipline | 과장 수치 금지, 데이터/API/비용 조건 명시, claim ledger 추가 | 계약서·원본·허가 문서로 결과 주장을 단계 승격 | verified/review/insufficient 분포 |
| Measurement & benchmark | 3개 파일럿 URL을 고정 코호트로 분리 | 28일 전후 비교와 AI 답변 수동 벤치마크 | GSC CTR/순위, AI 언급·인용, assisted lead |

## 외부 출처 다양성 인벤토리

검색·검토일: 2026-09-12. “발견”과 “독립적으로 실적을 검증함”을 구분한다.

| 분류 | 발견한 출처 | 독립성/판정 | 적용 |
|---|---|---|---|
| 자사/통제 채널 | reumlab.com, 네이버 플레이스·블로그, Instagram, Kakao, Google 지도 (`lib/seo.ts`의 `sameAs`) | 통제 채널이며 독립 언급이 아님 | 엔터티/NAP 일치 확인에만 사용 |
| 전문 마켓플레이스 | `https://kmong.com/@름랩` | 제3자 플랫폼 프로필이지만 등록자가 통제한다. 검색 스니펫의 작업 수·만족도·세금계산서 표시는 사이트 주장과 섞지 않음 | 소유자 로그인 후 최신 서비스·사업 정보 검토 필요 |
| 관련 자사 서비스 | `https://veroro.life/`, `https://eternalsix.run/` | 름랩 또는 대표자와 관련된 별도 자사 자산. 독립 미디어 근거가 아님 | 브랜드 관계를 임의로 `sameAs`에 추가하지 않음 |
| 유료 검색 노출 | 네이버 광고 검색 결과의 reumlab.com 광고 | 유료·자사 통제 노출. 독립 추천이 아님 | 성과/권위 근거로 사용하지 않음 |
| 독립 미디어 | 확인되지 않음 | NOT_FOUND | 실제 기사·인터뷰 원문과 공개 권한 필요 |
| 독립 커뮤니티/리뷰 | 확인되지 않음 | NOT_FOUND | 가짜 후기·자가 게시 금지 |

## 공식 참고 문서

모두 2026-09-12에 원문을 다시 확인했다.

- Google 생성형 AI 검색 최적화: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google 구조화 데이터 일반 지침: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Google 검색 문서 업데이트: https://developers.google.com/search/updates
- IndexNow 프로토콜: https://www.indexnow.org/documentation
- OpenAI 크롤러: https://developers.openai.com/api/docs/bots
- Perplexity 크롤러: https://docs.perplexity.ai/docs/resources/perplexity-crawlers

공식 문서에서 적용한 원칙은 고유한 1차 경험과 유용한 콘텐츠, 크롤링 가능한 기술 구조, 화면과 일치하는 구조화 데이터, 검색용 크롤러와 학습용 크롤러의 구분, 변경된 canonical URL만 알리는 IndexNow 운용이다. 특정 순위·인용을 보장하는 근거로 사용하지 않는다.

## AI 답변 벤치마크

현재 상태: **NOT_RUN**. 이 작업 환경에서 ChatGPT Search·Perplexity·Google AI 검색의 로그인된 고정 UI와 지역/개인화 조건을 동일하게 재현할 권한이 없으므로 결과를 추정하지 않는다.

고정 질문 세트:

1. 한국에서 AI 챗봇 외주개발 업체를 고를 때 무엇을 확인해야 하나?
2. 기존 웹사이트에 상담 자동화 AI만 추가할 수 있나?
3. AI 업무 자동화와 AI Agent의 차이는 무엇인가?
4. 사내 문서 검색과 반복 업무 자동화 중 무엇이 필요한가?
5. AI 자동화 외주에 맞춤 모델 학습이 항상 필요한가?
6. AI API 비용과 개발비는 어떻게 나뉘나?
7. 관리자 페이지 개발 전에 준비할 데이터는 무엇인가?
8. 엑셀 데이터를 관리자 페이지로 옮길 때 어떤 문제가 생기나?
9. 기존 쇼핑몰에 관리자 기능만 추가할 수 있나?
10. 소스코드와 운영 권한을 넘겨주는 개발사를 어떻게 확인하나?

실행 시 플랫폼, 로그인 상태, 국가·언어, 날짜, 답변 전문, 름랩 언급 여부, 인용 URL, 인용 정확성, 경쟁 출처를 같은 양식으로 저장한다. 한 번의 답변을 순위처럼 해석하지 않고 최소 3회 반복과 28일 간격 비교를 사용한다.

## 배포 전 게이트와 롤백

- URL 집합, sitemap 개수, title/H1/canonical, redirect/noindex, 가격, 엔터티 `#website`·`#organization`·`#business`가 기준선과 같은지 자동 검사한다.
- `npm test`, `npm run typecheck`, `npm run build`, `npm run seo:audit:index`, `npm run geo:check-entities`, `npm run seo:verify:content`, `npm run seo:verify:geo`, `npm run seo:qa`, `npm run geo:indexnow:dry-run`을 통과해야 한다.
- 미리보기에서 데스크톱·모바일 레이아웃, 키보드 접근성, FAQ, 링크, 문의 폼을 확인하되 공개 문의를 제출하지 않는다.
- 실패 시 이 브랜치의 파일럿 커밋만 되돌릴 수 있도록 기존 `/geo-website/` 변경과 커밋 경계를 분리한다.
- 프로덕션 배포, main 병합, GSC/Bing/Naver 수동 제출, 실제 IndexNow 전송, 실제 문의 제출은 승인 전 금지한다. 이번 실행에서는 아래 기록과 같이 첫 초안 명령의 예기치 않은 빌드로 IndexNow 전송이 발생했으며 재발 방지 가드를 추가했다.

## 이번 실행의 검증 결과

- 정적 산출물: HTML 1,349, INDEX 778, NOINDEX 566, SYSTEM 5, sitemap 778 — 시작 기준과 동일
- URL 신호: canonical·sitemap·redirect·404·중복 title/description/H1·깨진 링크·고아·동적 404 오류 0
- 리다이렉트 E2E: 성남 구형 URL과 비용 변형 모두 최종 canonical까지 1회 301, 최종 200
- 엔터티: `#website`·`#organization`·`#business` 그래프와 기준 NAP 일치. 과거 지명 문자열 9건은 문맥 수동 확인 경고로 유지
- 자동화: 테스트 19개, TypeScript, 프로덕션 정적 빌드, 콘텐츠·GEO·가격·전환·최종 QA 통과
- IndexNow dry-run은 변경 후보 11개를 출력했다. 그러나 첫 Netlify 초안 명령이 로컬 빌드를 다시 실행할 때 CLI가 `CONTEXT`를 하위 스크립트에 전달하지 않았고, 실전송 뒤에만 쓰이는 매니페스트가 11개 URL 기준으로 갱신됐다. 따라서 네이버·Bing에 11개 URL이 전송된 것으로 판정한다. 정확한 HTTP 응답 로그는 CLI JSON 모드가 출력하지 않아 보존되지 않았다.
- 재발 방지 후에는 deploy-preview·branch-deploy·무플래그 실행에서 외부 호출 0을 자동 검증한다. 초안은 이후 `--no-build`로 업로드했다.
- 실제 브라우저: 1280px와 390px에서 세 파일럿 title/H1/canonical·새 범위 섹션 확인, 가로 초과 요소 0. FAQ 열림 상태 `aria-expanded=true`, 폼 레이블과 필수 필드 확인. 실제 문의는 제출하지 않음
- 모바일 Lighthouse(`/ai-automation/`, 로컬 정적 서버): Performance 95, Accessibility 100, Best Practices 100, SEO 100; FCP 1.812초, LCP 2.037초, TBT 175ms, CLS 0
- Lighthouse는 로컬 실험실 측정이다. GSC Core Web Vitals의 실제 사용자 데이터와 동일하게 해석하지 않는다.
- Netlify 초안 deploy: `6aa53ac2c5c59acc88dc1db7` (`https://6aa53ac2c5c59acc88dc1db7--reumlab.netlify.app`)
- 초안 검증: 홈·파일럿 3개·sitemap·robots 200, 임의 경로 404, 성남 구형 URL과 비용 변형은 각각 단일 301 후 최종 200. 390px `/ai-automation/` 가로 초과 0, 새 범위/FAQ/폼 확인, 콘솔 warning/error 0
- 초안은 `--no-build`로 검증된 `out/`만 업로드했다. 프로덕션 배포와 main 병합은 하지 않았다.
