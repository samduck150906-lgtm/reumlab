# AEO·SEO Measurement Plan

기준일: 2026-09-11

## 측정 원칙

정적 감사는 구현 품질을 확인할 뿐 검색 성과를 증명하지 않습니다. 이번 판정에는 GSC 16개월 URL 성과와 네이버 90일 TOP 30을 사용했습니다. 원본은 git 제외 private 폴더에 보관하고 공개 결과에는 수치 구간만 남깁니다. Bing·GA4 값이 준비되기 전에는 301/noindex/삭제를 자동 적용하지 않습니다.

## 확보된 기준선

- GSC URL 성과: 클릭·노출·CTR·평균 순위, 16개월 선택(실제 속성 데이터는 2026-02-22~2026-09-08)
- GSC 사이트 합계: 클릭 188, 노출 11,358, 평균 CTR 1.7%, 평균 순위 24.6
- 네이버 URL 성과: 최근 90일 TOP 30, 사이트 화면 합계 약 290클릭·2.2만 노출·CTR 1.3%
- Bing: Search Performance URL 행 없음(처리 중), AI Performance 최근 90일 사이트 합계 0
- GA4: 현재 로그인 계정에서 reumlab 속성을 찾지 못해 미사용

## 0~30일: 빠른 개선

- P1-data: GSC/네이버 100회 이상 노출 또는 상위 20위권·CTR 2% 미만 URL의 title, description, 직접 답변과 내부링크 개선
- GSC 페이지 필터별 쿼리 export로 같은 쿼리를 나눠 받는 URL 쌍을 확인
- GA4 reumlab 속성 접근권한을 연결하고 landing page + source/medium + page_context + cta_click + inquiry_form_start + generate_lead를 export
- Netlify Forms: 최초 랜딩, referrer, source/medium, UTM, 제출 성공 시간을 GA4 서버 성공 리드와 대조

## 31~60일: 개선 검증

- 변경 URL의 클릭·노출·CTR·평균 순위를 28일 동기간으로 비교
- AI referral(ChatGPT, Perplexity, Copilot, Gemini 등)은 별도 채널 그룹으로 보고 assisted conversion을 함께 확인
- 지역·업종 템플릿 페이지는 노출은 있으나 클릭이 없는지, 같은 쿼리를 여러 URL이 나눠 받는지 확인
- CWV는 모바일 75백분위 LCP ≤2.5초, INP ≤200ms, CLS ≤0.1을 목표로 URL 유형별 추적

## 61~90일: 의사결정

- 유지: 고유 쿼리·클릭·전환 또는 검증 가능한 1차 근거가 있는 URL
- 개선: 노출은 있으나 CTR/전환이 낮고 검색 의도는 분명한 URL
- 통합 후보: 같은 쿼리를 지속적으로 나눠 받고 독립 전환·근거가 없는 URL
- noindex/삭제 후보: 90일 이상 유효 노출·전환·백링크가 없고 고유 가치도 입증할 수 없는 URL
- 실제 301/noindex/삭제는 URL_DECISIONS.csv에 근거와 승인자를 기록한 뒤 개별 적용

## 대시보드 최소 지표

- 검색: organic clicks, impressions, CTR, non-brand/brand query, indexed pages
- AI: AI referral sessions, engaged sessions, assisted leads, cited/mentioned pages(도구가 제공할 때만)
- 전환: cta_click, inquiry_form_start, generate_lead, 제출 성공률, landing-to-lead rate
- 품질: evidence verified/review/insufficient, stale review date, broken citation, CWV pass rate
