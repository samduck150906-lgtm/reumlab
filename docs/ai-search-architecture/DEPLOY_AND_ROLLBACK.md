# 배포와 복구

## 0. 현재 상태

- 구현·검수: **로컬 완료** (`out/` 산출물 기준, 전체 검증 통과).
- 원격 push / PR / merge / 프로덕션 배포: **하지 않았다.** 사용자 지시 없이는 진행하지 않는다.
- 작업 브랜치: `claude/ai-search-architecture` (기준선 `16d04a4`).

## 1. 배포 경로 (이 저장소의 실제 동작)

```
main 에 push
  → Netlify [context.production]
     command = "npm run build && npm run seo:indexnow"
     publish = "out"
```

**주의:** production 컨텍스트에서는 빌드 성공 후 `seo:indexnow` 가 실행돼 **네이버·Bing 에 IndexNow 제출이 실제로 나간다.** main 에 올리는 것 = 색인 제출까지 하는 것이다. 프리뷰/브랜치 빌드는 `npm run build` 만 돌고 제출하지 않는다.

`npm run build` 체인:
```
prebuild → gen:feed → prepare-next-public → next build
  → copy:home (copy-home-assets → inject-portfolio-static → inject-service-menu)
  → generate-purpose-landings → gen:llms → split-sitemap → finalize-out
  → seo:verify:home-guide → seo:verify:ai-search
```
마지막 두 게이트가 실패하면 빌드가 실패하므로, 회귀가 있는 산출물은 배포로 넘어가지 않는다.

**홈은 정적 `index.html` 이 Next 렌더 결과를 덮어쓴다.** `app/page.tsx` 만 고치면 배포된 홈에 반영되지 않는다. 홈 관련 검사는 반드시 최종 `out/` 을 본다.

## 2. 배포 전 체크 (순서대로)

```bash
npm ci
npm run typecheck          # exit 0
npm test                   # 90/90
npm run build              # exit 0 + 두 게이트 통과
npm run seo:verify && npm run seo:verify:pricing && npm run seo:verify:menu \
  && npm run seo:verify:cannibalization && npm run geo:check-entities && npm run seo:qa
```
그다음 `out/` 을 로컬 정적 서버로 띄워 눈으로 확인한다(`next dev`/`next start` 로 대체하지 않는다).

## 3. 배포 후 확인 (실서버)

1. `https://reumlab.com/ai-search-optimization/` 이 **200** 으로 응답.
2. `<head>` — title / description / canonical / og:image 가 로컬과 동일.
3. `https://reumlab.com/og-ai-search-architecture.jpg` 가 200, `Content-Type: image/jpeg`, 1200×630.
4. 본문 — 가격 3종, FAQ 15문항, 개선 범위 6장이 **JS 없이** 보이는지(소스 보기).
5. 상단 서비스 메뉴에 `AI 검색 구조 개선` 노출, 클릭 시 이동.
6. `https://reumlab.com/sitemap-pages.xml` 에 새 URL 1회 등록, 기존 URL 수 유지.
7. `https://reumlab.com/llms.txt` 에 새 항목 1줄.
8. 브라우저 콘솔 JS 오류 확인(홈의 기존 `updateMobileCta` 오류는 선행 결함 — QA_REPORT 6절).
9. **실제 상담 폼 1건 제출 → Netlify Forms 접수 내역에 새 필드 5종이 들어왔는지 확인.** (로컬 목 서버 200 은 접수 확인이 아니다.)
10. `/geo-website/` · `/ai-voice-development/` · `/l/*` 폼이 그대로 동작하는지.
11. 푸터 사업자 정보·로고, GTM/픽셀 중복 로드 없는지.
12. 프리뷰용 noindex 가 프로덕션에 섞이지 않았는지.

## 4. 복구 (rollback)

복구 대상은 **이번 변경만**이다. 다른 작업자의 변경을 되돌리지 않는다.

| 상황 | 방법 |
|---|---|
| 배포 직후 문제 발견 | Netlify 대시보드에서 **직전 성공 배포로 "Publish deploy"**. 이전 배포 식별자를 모르면 지어내지 않고 대시보드에서 확인한다 |
| 코드를 되돌려야 할 때 | 이번 변경은 전부 가산이므로 `git revert <이 작업의 커밋>` 로 충분하다. `git reset --hard`·force push 는 쓰지 않는다 |
| 페이지만 내리고 싶을 때 | `content/service-menu.json` 에서 항목 제거 + `app/sitemap.ts` 의 push 블록 제거 → 재빌드. **URL 자체를 삭제하지 말고** 먼저 메뉴·사이트맵에서만 뺀다(색인된 URL 을 바로 404 로 만들지 않는다) |
| 가격만 잘못됐을 때 | `lib/ai-search-architecture.ts` 의 `PACKAGES` 수정 → `scripts/verify-ai-search-page.mjs` 의 `BASELINE.packages` 도 같이 수정 → 재빌드 |

되돌려도 **기존 URL·메타·스키마에는 영향이 없다.** 이번 변경이 기존 페이지에 남긴 것은 (a) 메뉴 항목 1개, (b) `/geo-website/` 문맥 링크 2개, (c) 사이트맵 1줄뿐이다.

## 5. 범위 밖 (명시적 지시가 있어야 진행)

프로덕션 배포 · 원격 push · merge · 도메인/DNS 변경 · robots 정책 변경 · IndexNow 실제 제출 · 유료 결제.
