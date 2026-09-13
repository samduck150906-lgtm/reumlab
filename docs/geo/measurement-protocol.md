# AI 언급·추천·인용 측정 프로토콜

버전: `reumlab-geo-prompts-v1`
기준일: 2026-09-13

## 목적과 표본

- 비브랜드 타깃 질문: Q01~Q40
- 브랜드 대조군: B01~B05, 비브랜드 발견률·추천률 집계에서 제외
- 수동 측정 surface: ChatGPT 웹 검색, Google Search AI Mode, Gemini 웹, Perplexity 웹
- 계획: 40개 × 4 surface × 3회 = 480회
- 480회는 계획 수량이며, 실제 원문을 수집하기 전에는 `NOT_RUN`이다.

## 수집 조건

1. 질문별 새 대화를 사용한다.
2. 질문 원문을 `tools/geo/prompts-v1.json`에서 복사하며 브랜드명·도메인·홍보 자료를 추가하지 않는다.
3. surface, 제공자, 알 수 있는 모델, 모드, 검색 사용 여부, 언어·지역·개인화 상태, 시각, 반복 번호를 기록한다.
4. 답변 전체 원문과 화면 캡처, 화면에 제공된 출처 URL을 보관한다.
5. 일반 검색 결과, API 실험, 소비자용 AI 화면을 각각 다른 `surface`로 저장한다.
6. 캡처·원문은 `.geo-measurements/`에 두며 공개 배포와 Git에 넣지 않는다.

## 실행 상태

`ANSWER_CAPTURED`, `NO_AI_FEATURE`, `INCOMPLETE_CAPTURE`, `AUTH_REQUIRED`, `RATE_LIMITED`, `NETWORK_ERROR`, `UNSUPPORTED`, `NOT_RUN`을 사용한다. 로그인·네트워크·요청 제한은 름랩 미노출로 계산하지 않는다. `NO_AI_FEATURE`는 AI 답변이 표시되지 않은 정상 조회이며 유효 AI 답변 분모와 분리한다.

## 집계 게이트

다음을 모두 만족해야 `N_valid_answers`에 든다.

- `execution_status=ANSWER_CAPTURED`
- `is_synthetic=false`
- `raw_response_path` 존재
- 원문의 SHA-256 `raw_response_hash` 일치
- `review_status=REVIEWED` 또는 `VERIFIED`

이 게이트를 넘지 못한 레코드는 임의로 false/0으로 채우지 않는다.

## 판정 규칙

- 언급: 본문에서 름랩/REUMLAB이 해당 업체로 식별됨. 부정적 언급도 언급으로는 계산하되 추천으로는 계산하지 않는다.
- 추천: 실제 선택 후보로 제안된 경우. 자사 홍보 문장을 재진술한 것은 추천이 아니다.
- 순위: 답변이 명시적 순위를 제시한 경우에만 숫자를 적는다. 순위 없는 목록은 rank `null`이다.
- 공식 인용: `reumlab.com` 또는 `www.reumlab.com`의 실제 출처 링크만 포함한다. 유사 도메인과 서브도메인은 자동 포함하지 않는다.
- 인용 적합성: 연결된 페이지가 해당 주장을 실제로 뒷받침하는지 수동 검토한다.
- 애매한 경우는 `REVIEW`로 남기고 결과 분모에 넣지 않는다.

## 보고 지표

`N_planned`, `N_attempted`, `N_valid_answers`, `N_unresolved`를 먼저 공개한다. 언급률·추천률·공식 인용률·추천+인용 동시 발생률은 항상 `n/N`과 백분율을 함께 표시한다. 분모가 0이면 `N/A`다. Top 3/5는 순위 판정이 가능한 답변만을 분모로 한다.

## 동일 조건 비교

변경 전·후는 질문 버전, surface, 모델/모드, 검색 사용 여부, 언어·지역, 반복 수가 가능한 범위에서 같아야 한다. 관찰된 변화를 사이트 수정의 인과로 단정하지 않는다.

## 비용 통제

기본은 수동 import/dry-run이다. 유료 API adapter는 이 버전에 포함하지 않았다. 출처별 호출 상한·예상 비용·재시도·동시성·타임아웃·중단 지점이 승인되기 전에는 대량 호출하지 않는다.
