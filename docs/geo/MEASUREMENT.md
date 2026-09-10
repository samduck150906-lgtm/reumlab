# GEO measurement

## 수집 기반

- 첫 랜딩: 세션의 최초 `location.pathname`만 저장한다.
- 리퍼러: 전체 URL이 아니라 최초 hostname만 저장한다.
- UTM: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`만 보존한다.
- click id(`fbclid` 등), 검색어, 이름·전화·이메일·문의 내용은 분석 이벤트에 넣지 않는다.
- `lead_source`: ChatGPT, Perplexity, Claude, Bing/Copilot, Google, Naver, campaign, direct, internal, referral로 분류한다.
- referrer가 없는 AI 환경은 직접 유입과 구분할 수 없으므로 추정하지 않는다.

폼 접수에는 현재 유입 경로, 최초 유입 페이지, 리퍼러 호스트, UTM, 유입 채널을 hidden field로 보낸다. hidden 값은 분석용 보조값이며 신뢰 가능한 인증 데이터로 취급하면 안 된다.

## 기준 지표

| 지표 | 기준일 값/정의 | 주기 |
|---|---|---|
| canonical indexable URL | 777 | 배포마다 |
| redirect 규칙 | 153 | 배포마다 |
| 중복 title/H1 | 0/0 | 배포마다 |
| 사업자 엔터티 충돌 | 0 | 배포마다 |
| sitemap 오류 | 0 | 배포마다 |
| 깊이 6 이상 URL | 109 | 월간 |
| AI search crawler 요청 | CDN 로그의 승인된 UA별 요청 | 주간 |
| AI referral sessions | lead_source와 source/medium 기반 세션 | 주간/월간 |
| AI referral leads | 서버 성공 뒤 `generate_lead` | 월간 |
| AI referral conversion rate | AI referral leads / AI referral sessions | 월간 |
| AI 인용 페이지·질문 | Bing AI Performance, 수동 표본, 제공되는 콘솔 | 월간 |
| Google 노출/클릭 | Search Console page/query | 주간/월간 |
| 네이버 색인/노출 | Search Advisor | 주간/월간 |
| 핵심 서비스 문의 전환 | page_type/service/source_page별 성공 lead | 월간 |

## 이벤트 원칙

- `cta_click`은 보조 전환, 서버가 성공 응답한 `generate_lead`만 주 전환 후보로 삼는다.
- 기존 `inquiry_form_submit`, `main_apply_submit`, `form_submit_success` 이름은 GTM 호환을 위해 유지한다.
- GA4에서는 중복 집계를 피하도록 주 전환 이벤트 하나만 Key event로 지정한다.
- 이벤트 결과로 순위나 AI 인용을 보장하지 않는다.
