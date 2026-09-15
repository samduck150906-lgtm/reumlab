# 측정 정의와 해석 한계

이 문서는 **운영 시작 후** 무엇을 어떤 조건으로 기록할지 정한다.
현재 시점에 실측 데이터는 **없다**. 코드가 구현됐다는 것과 검색·AI 가 실제로 추천한다는 것은 다르다.

## 1. 분석 이벤트

기존 `lib/analytics.ts` 규약을 그대로 쓴다. 새 GTM/GA4/Meta 태그를 추가로 설치하지 않았다(GTM `GTM-WHLMP8ZD`, Meta 픽셀 1개, 기존과 동일).

| 이벤트 | 언제 | 파라미터 | 비고 |
|---|---|---|---|
| `cta_click` | 주요 CTA 클릭 | `cta_type:'form'`, `cta_location:'hero'\|'pricing'`, `package_tier`, `page_type`, `service`, `source_page`, `lead_source` | `package_tier` 는 가격 카드 CTA 에만 실린다 |
| `cta_click` | 전화·카카오·이메일 | `cta_type:'phone'\|'kakao'\|'email'`, `cta_location` | secondary conversion. 문의 완료가 아니다 |
| `inquiry_form_start` | 폼 최초 실질 상호작용 | `form_name:'main-apply'` | 폼 1회당 1번만 |
| `generate_lead` | **서버 성공 응답 이후** | `form_name`, `cta_type:'form'`, `package_tier`, `source_page`, `lead_source` | **성과 집계에 쓸 단 하나의 key event** |
| `form_error` | 제출 실패 | `error_type:'validation'\|'network'\|'server'` | 입력값·서버 메시지 원문 없음 |

기존 GTM 트리거가 쓰는 `inquiry_form_submit` / `main_apply_submit` / `form_submit_success` 는 **이름을 지우지 않고 그대로 둔다**(삭제하면 운영 중인 전환이 끊긴다). 다만 **중복 집계를 막기 위해 GA4/GTM 에서 key event 로 표시할 것은 `generate_lead` 하나만 고른다.**
같은 접수에서 네 이름이 모두 1회씩 나가는 것은 브라우저 검사로 확인했다(QA_REPORT F06/A01).

### `package_tier` 값

비식별 ASCII enum 만 쓴다: `UNDECIDED` / `START` / `GROWTH` / `ENTERPRISE`.
단일 출처는 `lib/ai-search-form.ts` 의 `PACKAGE_TIER`. 한글 라벨을 그대로 보내면 화면 문구를 고칠 때마다 GA4 값이 갈라진다.

### 절대 싣지 않는 것

이름·전화·이메일·상담 원문·**고객 홈페이지 URL**. `lib/analytics.ts` 의 `FORBIDDEN_PARAM_KEYS` 가 2차 방어선이고, 브라우저 검사로 dataLayer 에 입력값이 없는 것을 확인했다.
폼 입력값은 localStorage·sessionStorage·URL query·공개 로그 어디에도 저장하지 않는다. URL 에는 hash(`#inquiry`)만 남는다.

### 이 페이지의 문의를 구분하는 법

Netlify 접수 내역에서 `유입_랜딩 = /ai-search-optimization/`, `문의서비스 = AI Search Architecture (기존 홈페이지 검색 구조 개선)` 로 `/geo-website/` 문의와 구분된다. GA4 에서는 `source_page` 로 구분한다.

**출처가 없는 문의를 AI 유입이라고 추정하지 않는다.** `lead_source` 는 리퍼러 도메인·utm_source 를 묶은 분류일 뿐이고, 알려진 AI 리퍼러가 잡힌다고 해서 그것이 AI 영향의 전부를 관측한다는 뜻이 아니다. 많은 AI 서비스는 리퍼러를 넘기지 않는다.

## 2. AI 응답 관찰

`MEASUREMENT_TEMPLATE.csv` 의 헤더를 그대로 쓴다. **실측 전에는 행을 성과 데이터처럼 채우지 않는다.**

필드: `observed_at, surface, model_label, search_mode, locale, query_id, query_text, branded_control, run_id, status, brand_mentioned, owned_domain_cited, cited_urls, source_record_ref, limitations`

정의:
- **브랜드 언급(`brand_mentioned`)** — 응답 본문에 름랩/REUMLAB 이 식별 가능하게 등장.
- **자사 인용(`owned_domain_cited`)** — `reumlab.com` 의 실제 URL 이 응답 출처·링크로 포함. 브랜드 언급과 **다른 지표**다.
- **외부 언급** — 제3자 출처가 브랜드를 다루는 경우. 자사 URL 인용과 합산하지 않는다.
- **`status`** — `observed` / `no_result` / `service_error` / `rate_limited` / `search_not_used`. 실패·제한·검색 미사용을 "관측 없음" 과 구분한다.
- **`branded_control`** — 브랜드명이 들어간 통제 질문(true)과 비브랜드 획득 질문(false)을 **합산하지 않는다.**
- **`limitations`** — 그 실행의 제약(로그인 상태, 지역, 검색 기능 on/off 등).

지켜야 할 것:
- 표본의 **분모·날짜·서비스·검색 조건**을 반드시 함께 표시한다.
- 한 서비스의 **API 응답을 ChatGPT 웹 화면이나 Google AI Mode 결과라고 표기하지 않는다.** 같은 모델이라도 소비자 화면과 API 는 다른 결과를 낸다.
- AI 답변은 질문·날짜·서비스·검색 사용 여부에 따라 달라진다. 고정 질문과 실행 조건을 기록해 같은 조건으로 비교한다.
- 월 1회 관찰은 **고정 표본 모니터링**이며 전체 AI 노출률의 통계적 추정이 아니다.

## 3. 일반 검색·전환

| 출처 | 보는 것 |
|---|---|
| Google Search Console | 이 URL 의 색인 상태, 노출·클릭·쿼리 |
| 네이버 서치어드바이저 | 수집·색인 상태, 웹검색 노출 |
| GA4 (기존) | 신규 페이지 유입, `cta_click`, `inquiry_form_start`, `generate_lead` |
| Netlify 폼 접수 내역 | 실제 접수 건수, `유입_랜딩`·`문의서비스` |
| CRM·실제 상담 기록 | 유효 문의·계약 여부 |

**analytics 이벤트를 실제 계약으로 추정하지 않는다.** `generate_lead` 는 "폼 접수 성공" 이지 "수주" 가 아니다.

## 4. 관찰 계획 (T0 / 30 / 60 / 90일)

| 시점 | 할 일 |
|---|---|
| T0 (배포 직후) | GSC·서치어드바이저에 URL 등록, 색인 요청. 고정 질문 목록 확정. AI 관찰 1회(기준선) 기록 |
| +30일 | 색인 여부, 노출·클릭, `generate_lead` 건수. AI 관찰 2회차(같은 질문·같은 조건) |
| +60일 | 위와 동일. 비브랜드 쿼리 유입 여부 확인 |
| +90일 | 누적 비교. 개선 우선순위 재정리 |

해석 한계: 계절성·유료 광고·다른 페이지 변경·검색엔진 알고리즘 변화 때문에 **변화 전체를 이 작업의 인과효과로 단정하지 않는다.** 색인·노출·인용 반영 시점은 보장할 수 없다.
