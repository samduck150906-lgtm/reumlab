# AEO·SEO 구현 검증

기준일: 2026-09-11

## 콘솔 실데이터 재분류

- Google Search Console URL-prefix `https://reumlab.com/`: 16개월 선택, 실제 표시 기간 2026-02-22~2026-09-08, 클릭 188, 노출 11,358, CTR 1.7%, 평균 순위 24.6
- GSC URL 행 771개를 canonical 단위로 합쳤고 현재 색인 목록 777개 중 492개와 일치
- 네이버 Search Advisor: 최근 90일 PC+Mobile 약 290클릭, 2.2만 노출, CTR 1.3%; TOP 30 중 현재 목록 28개와 일치
- Bing Webmaster Tools: Search Performance 처리 중이라 URL 행 없음; AI Performance 최근 90일 citations 0
- GA4: 현재 로그인 계정에 reumlab 속성이 없어 세션·전환 export를 판정에 사용하지 않음
- 최종 판정: RETAIN 143, IMPROVE 55, MONITOR 579
- 기존 IMPROVE 34개: RETAIN 5, IMPROVE 유지 20, MONITOR 9
- 기존 MONITOR 678개: RETAIN 76, IMPROVE 32, MONITOR 유지 570
- 원본 CSV와 정확한 URL별 수치는 `docs/seo-aeo/private/`에만 저장하고 git·배포에서 제외; 공개 CSV에는 구간값만 기록

## 콘텐츠 근거 연결

- 공개 가능한 름랩 자체 CMS 데모 3장, 영상 1개와 운영 가이드 예시를 관리자·ERP·웹 관련 상위 서비스에만 연결
- 관련 웹·ERP 사례에서 운영 가이드 예시로 연결하되 “고객 프로젝트 원본 화면이나 성과 자료가 아님”을 명시
- 앱·AI 등 무관한 서비스에는 대용량 CMS 미디어를 출력하지 않음
- 고객별 공개 허가가 확인되지 않은 화면·기간·수치·리뷰는 새로 만들거나 사례 성과로 표시하지 않음

## 정적 빌드와 품질 게이트

- Next 정적 페이지 1,337개 생성, 색인 URL 777개와 분할 sitemap 12개 일치
- canonical·sitemap·redirect·404·중복 title/description/H1·깨진 링크·고아·동적 404 오류 0
- 정보성 색인 페이지 170개: 블로그 10, 가이드 45, 비교 3, 비용 112
- 구조화 데이터: Article 58, CreativeWork 15
- 전환: 문의 폼 17, CTA 태깅 774, 성공 이전/중복 `generate_lead` 0, GTM+직접 GA4 중복 0
- 테스트 14개, TypeScript 검사, 프로덕션 빌드, SEO/AEO·콘텐츠·사례·네이버·전환 검증 통과

## 성능 개선

- Pretendard·Google Fonts 외부 요청 제거 후 운영체제 기본 한글 글꼴 사용
- 홈 배포 CSS 101,392→80,755 bytes, JS 35,504→24,000 bytes로 축소
- 홈 전용 CSS를 공통 Next 레이아웃에서 분리
- GTM이 GA4의 단일 소유자가 되도록 직접 `gtag.js` 중복 제거
- GTM·Meta 실제 스크립트는 첫 사용자 상호작용 또는 load 후 8초 idle 시점까지 지연; 초기 `dataLayer`·`fbq` 큐는 유지
- CMS 영상 autoplay 제거 및 `preload="none"` 적용

## Netlify·실제 브라우저 검증

- 최종 프리뷰 deploy: `6aa378bd34385283d9996b05`
- 최종 프로덕션 deploy: `6aa37b2716888f975a6627ce`
- 운영 홈·상위 서비스·사례 HTTP 200, 임의 미존재 URL HTTP 404, 홈 canonical `https://reumlab.com/`
- Chrome 실제 화면에서 상위 구조·접근성 트리·문의 폼 필수 동의·제출 중 잠금·서버 성공 화면 확인
- 미리보기 문의 E2E: `E2E TEST - DELETE` 제출 후 “검토 요청이 접수됐어요” 확인
- 최종 프로덕션 모바일 Lighthouse: Performance 98, Accessibility 100, Best Practices 100, SEO 100
- 최종 실험실 지표: FCP 1.6초, LCP 1.8초, TBT 0ms, CLS 0, Interactive 1.8초
- Lighthouse 측정 구간의 GTM·GA·Meta 네트워크 요청 0건; 초기 렌더 이후 로딩 확인
- 커밋 기준 변경 URL 10개를 IndexNow로 선별해 네이버와 Bing에 각각 HTTP 200으로 재전송

## 남은 외부 데이터

- GSC IMPROVE URL별 페이지 필터 쿼리, URL Inspection의 Google 선택 canonical·색인 상태, Core Web Vitals export
- Bing 처리 완료 후 Search Performance URL export와 AI Performance URL export
- reumlab GA4 속성 접근권한 또는 landing page·source/medium·campaign·conversion export
- 고객별 화면·산출물·결과 공개 허가 문서와 실제 원본
- GA4·페이지별 쿼리·Bing URL 데이터가 모이기 전까지 301·noindex·삭제는 적용하지 않음

## 알려진 경고

- 홈에서 클릭 깊이 6 이상인 색인 URL 109개, 최대 12
- `/AI서비스개발/`은 레거시 noindex 페이지로 title은 있으나 description과 H1이 없어 정적 감사 경고 1건
- 실사용자 Core Web Vitals는 GSC field data가 필요하며 단일 Lighthouse 실행과 구분해서 판단해야 함
