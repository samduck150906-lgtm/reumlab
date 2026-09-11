# AEO·SEO Measurement Plan

기준일: 2026-09-11

## 측정 원칙

정적 감사는 구현 품질을 확인할 뿐 검색 성과를 증명하지 않습니다. URL별 클릭·노출·쿼리·선택 canonical은 GSC, Bing, 네이버 원본 export로 보완하고, 문의는 GA4와 Netlify Forms의 서버 성공 기록을 기준으로 맞춥니다.

## 0~30일: 기준선

- GSC 페이지/쿼리 16개월 export: 클릭, 노출, CTR, 평균 순위, Google 선택 canonical, 색인 상태
- Bing Webmaster Tools: 검색 성과, sitemap, IndexNow, AI Performance export
- 네이버 Search Advisor: 콘텐츠 노출/클릭, 수집·색인, 사이트 진단 export
- GA4: landing page + session source/medium + page_context + cta_click + inquiry_form_start + generate_lead
- Netlify Forms: 최초 랜딩, referrer, source/medium, UTM, 제출 성공 시간
- 백링크: 연결 도메인, 대상 URL, 앵커, 최초 확인일

## 31~60일: 개선 검증

- 출처·표·방법론이 추가된 3개 가이드의 쿼리 다양성, CTR, 평균 순위 변화를 28일 동기간으로 비교
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
