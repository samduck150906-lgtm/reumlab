# SEO_REGRESSION_REPORT — 기존 검색 자산 보존 확인

대조 방법: 기준선 `a5aa77e` 를 별도 git worktree 에 체크아웃해 **똑같이 전체 빌드**한 뒤,
두 `out/` 의 HTML 1,351개를 전수 비교했다. 소스가 아니라 배포될 파일을 비교한 것이다.

---

## 1. 결론

| 항목 | 기준선 | 현재 | 변화 |
|---|---:|---:|---|
| 산출물 HTML | 1,351 | 1,351 | **추가 0 · 삭제 0** |
| 사이트맵 URL | 780 | 780 | **제거 0 · 추가 0** |
| canonical 변경 | — | — | **0건** |
| robots 메타 변경 | — | — | **0건** |
| og:url 변경 | — | — | **0건** |
| `main-apply` 폼 개수 변경 | — | — | **0건** |
| JSON-LD 블록 수 변경 | — | — | **0건** |
| 네이버 소유확인 메타 변경 | — | — | **0건** |
| title 변경 | — | — | 1건 (`/ai-voice-development/` — 의도) |
| description 변경 | — | — | 1건 (동일) |
| H1 변경 | — | — | 1건 (동일) |

---

## 2. 본문 텍스트 전수 대조

`<script>`·`<style>` 을 제거한 본문 텍스트를 1,351개 전부 비교했다.

```
본문 대조: 1,351개 중 1,350개 완전 일치
다른 페이지: 1개
  ai-voice-development/index.html  13,897 → 17,076 (+3,179자)
```

즉 **이번 작업으로 내용이 달라진 페이지는 대상 페이지 하나뿐**이다.
나머지 1,350개는 한 글자도 바뀌지 않았고, **줄어든 페이지는 0개다**.

---

## 3. 사이트 공통 변경 — 없음

작업 도중 공유 폼(`components/LandingInquiryForm.tsx`)에 "JS 가 꺼져 있으면 전송 결과를
확인해 드릴 수 없다"는 안내를 넣었다가 **제거했다.**

그 문구는 native 제출이 실제로 처리되는지 확인하지 못한 상태에서 둔 하한선이었는데,
확인해 보니 **문구가 필요 없었다** — 이 폼의 마크업은 홈(`index.html`)에서 이미 운영 중인
`main-apply` 폼과 동일하고, JS 없이도 브라우저 기본 제출이 정상적으로 나간다(§3.1).

→ 결과적으로 **이 페이지 외의 1,350개 페이지는 본문이 한 글자도 바뀌지 않았다.**

### 3.1 JS 없이 제출되는 것을 실제로 확인한 방법

Chromium 에서 자바스크립트를 끄고(`javaScriptEnabled: false`) 사람이 하듯 입력한 뒤
제출 버튼을 눌러, 나가는 요청을 가로채 내용을 확인했다.
**운영 시스템으로는 아무것도 보내지 않았다.**

| 확인 항목 | `/ai-voice-development/` | `/geo-website/` (기존 페이지) |
|---|---|---|
| 요청 | `POST http://…/ai-voice-development/` | `POST http://…/geo-website/` |
| Content-Type | `application/x-www-form-urlencoded` | 동일 |
| `form-name` | `main-apply` | `main-apply` |
| 전송 필드 수 | **30개** | **27개** |
| 신규 필드 3종 | `학원` · `10~30건` · `Business` 모두 전송됨 | 해당 없음 |
| 허니팟 `bot-field` | 빈 값(정상) | 빈 값(정상) |
| 필수값 비우고 제출 | **브라우저가 막음 (POST 0회)** | — |

`action` 속성이 없으므로 기본 제출은 **현재 주소로 POST** 되고, Netlify Forms 가
`form-name` 으로 가로채 접수한다. 이는 홈 폼이 쓰는 것과 같은 경로다.

성공 후 방문자가 보는 화면은 Netlify 의 기본 완료 페이지다 —
홈 폼도 지금 같은 동작이므로 사이트 전체가 일관된다.

## 4. 대상 페이지의 검색 신호 변화 (의도)

| 항목 | 전 | 후 |
|---|---|---|
| canonical | `https://reumlab.com/ai-voice-development/` | **동일 (변경 없음)** |
| robots | `index, follow` | **동일** |
| title | AI 전화상담·음성 AI 개발 \| AI 상담원·예약 자동화 \| 름랩 | AI 전화상담 직원 구축 \| 예약·문의·견적 접수 자동화 \| 름랩 |
| description | 전화와 웹에서 고객과 실시간으로… (95자) | 반복 전화응대부터 상담·예약·견적 접수까지… (102자) |
| H1 | AI 음성 상담·전화 자동화 개발 | 전화 업무까지 처리하는 AI 전화상담 직원 구축 |
| 색인 판정 | index | **index (95점)** |
| JSON-LD | WebPage·Service·Breadcrumb·FAQPage | 동일 구성. FAQ 8 → **16문항** |
| Service `offers` | 없음 | **없음 유지** (화면에 금액이 없으므로) |
| 보존된 앵커 | — | `#voice-demo` `#voice-inquiry` `#voice-faq` `#voice-cost` `#voice-process` `#voice-related` 등 |

### 4.1 제거된 페이지 내 앵커

`#voice-flow` · `#voice-how` 두 앵커는 해당 섹션이 새 구성(문제·비교 / 연동 구조)으로
대체되며 사라졌다. 저장소 전체를 검색해 **외부에서 이 앵커를 참조하는 링크가 0건**임을
확인한 뒤 제거했다. 사이트 내 링크·사이트맵·llms.txt 어디에도 참조가 없다.

---

## 5. 생성 파이프라인 보존

| 파이프라인 | 결과 |
|---|---|
| `app/sitemap.ts` | `aiVoiceDecision()` 이 그대로 index 판정 → 사이트맵 780 유지 |
| `scripts/generate-llms.mts` | 이 페이지 요약 1줄 유지. llms.txt 14,143 bytes 생성 |
| `content/service-menu.json` | 5번째 항목으로 **이미 등록돼 있었다** — 중복 추가하지 않음 |
| `lib/content-cluster.ts` | 가이드 4개 배선 유지 |
| `public/__forms.html` | 필드 3종 추가. `out/__forms.html` 생성 확인(원본을 고쳤고 `out/` 을 직접 수정하지 않음) |
| `split-sitemap` | 780 URL → 12개 사이트맵 + index. 재배치 전후 URL 집합 동일 |
| IndexNow | **실행하지 않음.** production 컨텍스트 전용 흐름 그대로 유지 |

---

## 6. 폰트 파이프라인 부수 변경 (10개 파일)

새 카피에 `녕`·`늠`·`묵` 3글자가 들어가 기존 서브셋 밖으로 나갔다.
빌드 게이트가 이를 막았고, 스크립트가 안내한 절차대로 재생성했다.

| 항목 | 전 | 후 |
|---|---|---|
| 서브셋 글자 수 | 1,338 | 1,339 |
| 서브셋 크기 | 222KB | 223KB |
| `@font-face` 선언 동기화 | 11곳 | 11곳 |

변경된 10개 파일(`privacy.html`, `terms.html`, `refund.html`, `styles.css`, `reum.css`,
`vvip/index.html`, `public/privacy|terms|refund/index.html`, `public/assets/admin-guide-example.html`,
`app/globals.css`)의 diff 를 `git diff --unified=0` 로 전수 확인한 결과,
**`unicode-range` 한 줄과 크기 주석 외의 변경은 없다.**

서브셋 검사기는 "서브셋 밖 글자 0"으로 통과했다 — 즉 어떤 페이지도 2.0MB 원본 폰트를
추가로 받지 않는다.

---

## 7. 이 보고서가 증명하지 못하는 것

- **운영 HTTP 응답·리다이렉트 실동작** — 정적 파일 비교이므로 헤더·리다이렉트 규칙의
  실제 동작은 배포 후에만 확인된다.
- **라이브 색인 상태** — 검색엔진이 언제 재크롤할지, 순위가 어떻게 되는지는 알 수 없다.
- **검색 트래픽·AI 인용 변화** — 보장하지 않으며 이 작업의 성과 지표로 쓰지 않는다.
