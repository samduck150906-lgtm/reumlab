# 네이버 노출 하락 대응 — 2026-10 코드·콘텐츠 정비 기록

이 문서는 저장소에서 확인·수정한 내용과 재점검 방법만 담는다. Search Advisor·Search Console 수치는
사업 텔레메트리라 여기(공개 저장소)에 적지 않고 `docs/neo/private/`(git 제외)에 둔다.

## 상태 구분

| 상태 | 이번 작업 |
|---|---|
| 콘텐츠·코드 수정 | 완료(아래) |
| 빌드 검증 | `npm run build` 전체 게이트 통과, `npm test` 210 통과 / 3 실패(기존 tsx 로더 문제, 변경 전과 동일) |
| 운영 배포 | 이 커밋이 main 에 반영된 뒤 Netlify production 배포로 반영 |
| Search Advisor / GSC 조회·제출 | 작업 세션에서 콘솔 접근 불가 — 미실행 |
| 실제 색인·노출 변화 | 미확인 |

## 확인한 원인 후보

- **확인됨(코드)** `/website/<업종>/` 294개 본문이 키워드 커버리지 목적으로 업종명 붙임 표기
  (`{업종}제작`·`{업종}업체`·`{업종}마케팅`·`{업종}창업`)를 문장·FAQ 질문에 섞어 생성됐다.
  예: "안과제작는 원페이지 기준…", "안과업체 교체 없이", FAQ "안과제작 비용은 얼마인가요?".
  받침 조사 오류("오시는 길 확인를"), 접미어 중복("영상제작업체업체"), 마침표 누락도 전 페이지에 반복됐다.
  2026-07-09 도입.
- **확인됨(코드)** `/h/` 허브 카드가 301 통합된 키워드 변형마다 남아, 이름만 다른 카드 여러 장이 같은 URL을 가리키고
  "○○ 문의하세요. … - 름랩." 스텁 문구를 노출했다. `/l/` Service JSON-LD 설명도 같은 스텁이었다.
- **확인됨(코드)** IndexNow 알림이 production build command 안에서 실행돼 새 배포 공개 전에 나갔고,
  빌드 컨테이너에서 갱신된 매니페스트가 저장되지 않아 다음 배포마다 같은 URL을 다시 보냈다.
- **유력한 가설(미검증)** 위 자동 생성·키워드 반복 문서가 네이버 품질 판단에 불리하게 작용했을 가능성.
  콘솔의 하락 시점·색인 제외 사유와 대조하기 전에는 원인으로 확정하지 않는다.
- **미확인** 운영 응답(403/429/5xx, WAF), 실제 하락 시점, 색인 문서 수 변화.

## 수정

| 파일 | 내용 | 영향 URL |
|---|---|---|
| `lib/website-industries.ts` | 붙임 키워드 제거, 받침 조사, 접미어 중복 제거, 가격은 `lib/pricing.ts`, 순위 보장 표현 제거, 설명문에 앞 문장 의존 문장 제외 | `/website/<업종>/` 294 |
| `components/HubPage.js` | 카드 목적지 URL 중복 제거, 목적지 랜딩의 실제 메타 설명 사용 | `/h/*` 31 |
| `app/l/[slug]/page.js` | Service JSON-LD 설명을 메타 설명과 일치 | `/l/*` 202 |
| `lib/search-intent.ts` | 랜딩 설명 목적격 조사 받침 처리("외주을" → "외주를") | `/l/*` 17 |
| `app/sitemap.ts` | `/h/`·`/l/` lastmod 가 렌더 템플릿 커밋도 반영 | 사이트맵 |
| `netlify.toml`, `netlify/plugins/indexnow-after-deploy/` | IndexNow 를 build command 에서 빼고, production 에서 새 BUILD_ID 가 운영 도메인에 공개된 것을 확인한 뒤에만 제출. 매니페스트 빌드 캐시 보존 | 배포 |

URL 삭제·noindex·리다이렉트·가격 변경은 하지 않았다. 사이트맵 URL 수(823)와 보호 URL(786)은 그대로다.

## 재점검

```bash
npm ci
npm run build                         # 전체 SEO 게이트 포함
npm test                              # 회귀 테스트(website-industry-copy, hub-landing-copy, indexnow-after-deploy 포함)
npm run neo:audit
npm run neo:indexnow:dry-run          # 제출 대상만 계산, 외부 전송 없음
npm run neo:http -- --origin https://reumlab.com --json docs/neo/private/http-latest.json
```

이번 변경으로 `/website/` 294개 URL의 lastmod 가 전진한다. 자동 제출 한도(50개)를 넘어
배포 후 플러그인은 대량 제출을 차단하고 로그만 남긴다. 범위를 확인한 뒤 한 번만 수동 제출한다.

```bash
node --use-system-ca scripts/submit-indexnow.mjs --submit --allow-large-batch
```

## 남은 판단(운영자)

- `/l/academy-shopping-mall/` 와 `/l/suwon-shopping-mall/` 본문 유사도 약 0.9 — 통합(301)·유지 판단 필요
- `/app/`·`/cost/`·`/solution/` 각 112개 업종 페이지도 같은 업종 목록을 공유한다. 콘솔 색인 제외 사유를 보고 우선순위를 정한다.
