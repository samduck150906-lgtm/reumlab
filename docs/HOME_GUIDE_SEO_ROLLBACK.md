# 홈·가이드 SEO 개선 — 배포 전 체크리스트와 롤백 (2026-09-15)

**현재 상태: 운영 미배포.** 로컬 브랜치 `claude/home-guide-seo-fix` 에만 존재한다.
원격 push·PR·merge·Netlify 배포·Search Console 제출·IndexNow 실전 제출은 **하지 않았다.**

## 1. 승인 후 배포 절차

1. 브랜치 확인 — `git log --oneline main..claude/home-guide-seo-fix`
2. 로컬 재검증 — `npm run typecheck && npm test && npm run build`
   (`build` 마지막에 `seo:verify:home-guide` 가 돌아 실패 시 빌드가 멈춘다)
3. 병합·push 는 **승인 후에만.** 이 저장소의 프로덕션 컨텍스트는
   `netlify.toml` 의 `[context.production] command = "npm run build && npm run seo:indexnow"` 라
   **main 에 push 되는 순간 IndexNow 실전 제출이 함께 일어난다.** 제출 범위를 먼저 확인하려면
   `npm run neo:indexnow:dry-run` 으로 변경분을 본다.

## 2. 배포 직후 운영 검증 (이번 실행에서는 못 한 항목)

이그레스 차단으로 로컬에서 확인하지 못했다. 배포 후 아래를 **GET 원문**으로 확인한다
(HEAD 나 요약 텍스트로 판정하지 않는다).

- [ ] `curl -sSL -D- https://reumlab.com/ -o home.html` — 200, 최종 URL, 리다이렉트 체인
- [ ] `curl -sSL -D- https://reumlab.com/guide/ -o guide.html` — 동일
- [ ] 응답 헤더에 `X-Robots-Tag: noindex` 가 섞이지 않았는지 (preview 설정 누수)
- [ ] HTTP `Link: <...>; rel="canonical"` 헤더가 HTML canonical 과 충돌하지 않는지
- [ ] 저장한 원문을 **HTML 파서로** 검사:
      `node scripts/verify-home-guide-seo.mjs <원문을 out 구조로 둔 디렉터리>`
- [ ] 홈 FAQ 12문항·답변, 가이드 FAQ 6문항·답변이 본문에 있는지
- [ ] `#business` 노드 타입이 `LocalBusiness`, `@id` 가 `https://reumlab.com/#business` 인지
- [ ] 브라우저에서 JS 를 끈 채 홈 FAQ 답변이 읽히는지
- [ ] 상담 폼 제출 동선(필드·동의 체크) — **테스트 데이터를 운영 endpoint 로 보내지 않는다**
- [ ] Rich Results Test / Schema Markup Validator 로 JSON-LD 확인 (선택)

코드 반영 · 빌드 반영 · 운영 반영 · 검색엔진 재수집은 서로 다른 상태다.
배포 성공 메시지만 보고 "SEO 반영 완료"로 적지 않는다.

## 3. 롤백

이번 변경만 되돌린다. **다른 사용자 변경을 버리는 명령(`git reset --hard`, `git clean`,
force push)은 쓰지 않는다.**

### 3-1. 아직 병합 전 (현재 상태)
브랜치를 병합하지 않으면 끝이다. 작업 브랜치만 지우려면:
```
git branch -D claude/home-guide-seo-fix    # 로컬 브랜치만 삭제
```

### 3-2. 병합 후 전체 되돌리기
병합 커밋 하나만 revert 한다(새 커밋이 쌓이므로 히스토리를 고쳐 쓰지 않는다).
```
git revert -m 1 <merge-commit>
npm run build     # 게이트 포함 재검증
```

### 3-3. 부분 롤백 — 변경이 독립적이라 하나씩 되돌릴 수 있다

| 되돌릴 대상 | 파일 | 되돌리는 법 |
|---|---|---|
| 가이드 FAQ만 | `lib/guide-faq.ts`, `app/guide/page.tsx` | 두 파일을 기준 커밋 버전으로: `git checkout 3a59be8 -- app/guide/page.tsx && git rm lib/guide-faq.ts` · 게이트의 `BASELINE.guide.faqExact` 관련 검사도 함께 완화해야 한다 |
| LocalBusiness 전환만 | `lib/schema.ts`, `index.html`, `scripts/generate-purpose-landings.mjs`, `scripts/build-landings-pages.mjs`, `scripts/qa-final.mjs`, `scripts/verify-entities.mts` | `@type` 문자열 4곳을 `ProfessionalService` 로, `qa-final.mjs` 기대 배열 2곳을 원복. 게이트의 `BASELINE.businessType` 도 함께 변경 |
| 홈 noscript FAQ 대비만 | `index.html` | head 의 `<noscript><style>.faq-a{max-height:none}</style></noscript>` 블록 제거. 게이트의 `faq-nojs` 검사가 실패하므로 그 검사도 함께 제거해야 한다 |
| 회귀 게이트만 | `scripts/verify-home-guide-seo.mjs`, `scripts/verify-home-guide-seo.test.mts`, `package.json` | 두 파일 삭제 + `package.json` 의 `seo:verify:home-guide` 스크립트와 `build` 체인 끝의 호출 제거 |
| HTML 파서 의존성만 | `package.json`, `package-lock.json` | `npm uninstall -D node-html-parser` — 단, 게이트가 이 파서를 쓰므로 게이트를 먼저 제거해야 한다 |

### 3-4. 되돌린 뒤 반드시 재확인
```
npm run typecheck && npm test && npm run build
```
게이트를 남긴 채 대상만 되돌리면 게이트가 실패한다. 이는 정상 동작이며,
**통과시키려고 검사를 주석 처리하거나 상수를 현재 결과로 맞추지 않는다.**
되돌리는 의사결정이 먼저이고, 기대값은 그 결정을 따라 함께 바꾼다.

## 4. 운영자 조치가 필요한 항목

| 항목 | 필요한 권한 | 비고 |
|---|---|---|
| 운영 HTTP 원문 검증 | 네트워크 접근 | 이 실행 환경은 `reumlab.com` 차단 |
| Search Console URL 검사·색인 요청 | GSC 계정 | 저장소에 API 자격증명 없음 |
| 네이버 서치어드바이저 수집 요청 | 서치어드바이저 계정 | 동일 |
| IndexNow 실전 제출 | main 배포 | production 빌드가 자동 실행 |
| schema.org·Google 공식 문서 현행 재확인 | 네트워크 접근 | LocalBusiness 전환 근거의 원문 확인 |
