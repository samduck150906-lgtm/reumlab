# 홈·가이드 메타·캐노니컬·구조화 데이터·FAQ 감사 (2026-09-15)

기준 커밋: `3a59be8` · 작업 브랜치: `claude/home-guide-seo-fix`
실행 환경: node v22.22.2 / npm 10.9.7 · 작업 시작 시 미커밋 변경 **0건**

## 1. 전달받은 진단 3건의 실제 판정

판정은 **모든 후처리가 끝난 `out/`** 을 HTML 파서(node-html-parser)로 읽어 내렸다.
정규식으로 head/script 를 추정하지 않았고, JS 번들·주석 속 문자열을 태그로 세지 않았다.

| # | 전달받은 진단 | 소스 증거 | 빌드(out) 증거 | 운영 HTTP | 판정 |
|---|---|---|---|---|---|
| A | 홈 meta description·canonical 누락 | `index.html` head 에 둘 다 존재 | `out/index.html` head: description 1개(68자), canonical 1개 `https://reumlab.com/`, og:url 일치, body 오출력 0 | **미검증** | **이미 정상** |
| B | 홈 JSON-LD 부재, Organization·LocalBusiness 필요 | `index.html` 에 `@graph` 1블록 | `out/index.html`: WebSite·Organization·ProfessionalService·BreadcrumbList·FAQPage 5노드, 같은 `@id` 중복 정의 0 | **미검증** | **이미 정상** (단, 사업체 **타입만** 정리 대상 → §3) |
| C-1 | 홈 본문 FAQ 부재 | `index.html` 에 12문항 Q/A 마크업 | FAQPage 12문항 ↔ 화면 텍스트 대조: 없는 질문 0, 없는 답변 0 | **미검증** | **이미 정상** (단, no-JS 접근 결함 발견 → §3) |
| C-2 | 가이드 인덱스 본문 FAQ 부재 | `app/guide/page.tsx` 에 Q&A 섹션 없음 | `out/guide/index.html`: FAQPage 0개, 본문 Q&A 0개 | **미검증** | **실제 누락** |

**운영 HTTP 가 전부 "미검증"인 이유**: 이 실행 환경의 이그레스 프록시가
`reumlab.com:443` 을 `connect_rejected` 로 차단한다(프록시 상태 API 의 `recentRelayFailures`
에 기록됨). GET 원문·리다이렉트 체인·`X-Robots-Tag`·HTTP `Link` 헤더는 확인하지 못했다.
소스와 빌드 산출물만으로 판정했고, 운영 반영 여부는 배포 후 별도 확인이 필요하다(§ROLLBACK 문서).

## 2. "원본 → 생성/복사 → 후처리 → out → 호스팅" 경로

```
prebuild   generate-landings · extract-portfolio · extract-content-cluster
gen:feed   feed.xml
           prepare-next-public.mjs      ← public/robots.txt 제거(app/robots.ts 단일화)
next build → out/**                      ← Next 정적 export (가이드 등 라우트)
copy:home  copy-home-assets.mjs          ← 루트 index.html/styles.css/script.js 를 out/ 로 복사
           inject-portfolio-static.mjs   ← out/index.html 마커 구간 재작성
           inject-service-menu.mjs       ← out/index.html 마커 구간 재작성
           generate-purpose-landings.mjs ← out/<slug>/index.html 8종 (Next 출력 덮어씀)
gen:llms   llms.txt · llms-full.txt
           split-sitemap.mjs · finalize-out.mjs
           seo:verify:home-guide         ← 이번에 추가한 게이트 (finalize 이후)
publish    netlify.toml → publish = "out"
```

**핵심**: 홈은 Next 렌더가 아니라 정적 `index.html` 이 `copy:home` 단계에서 `out/` 을 덮어쓴다.
`app/page.tsx`·`app/layout.tsx` 만 고치면 실제 배포 홈에 반영되지 않는다. 그래서 이번
게이트의 판정 대상은 언제나 최종 `out/` 이다.

### 빌드 구조에서 확인한 사항 (이번 범위에서 고치지 않음)
- `npm run build` 가 `npm run prebuild` 를 **명시 호출**하는데 npm 자동 lifecycle 도
  `prebuild` 를 실행해 **prebuild 가 2회 돈다**. 생성기는 멱등이라 산출물은 같지만 빌드가 길어진다.
  이번 작업과 무관한 빌드 재설계라 손대지 않았다. → 권고 항목.
- 생성·주입 단계를 한 번 더 실행해도 `out/index.html`·`out/guide/index.html`·`out/mvp/index.html`
  의 md5 가 동일하고 전역 엔티티가 1회씩만 나온다(멱등 확인).

## 3. 실제로 고친 것 / 이미 정상이라 보존한 것

### 고친 것
1. **가이드 인덱스 본문 FAQ 6문항 신설** — 실제 누락(C-2).
   `lib/guide-faq.ts` 배열 하나가 화면과 FAQPage `mainEntity` 를 동시에 만든다.
   기존 `CollectionPage`/`ItemList`(48항목)/`BreadcrumbList` 는 그대로 두고, FAQPage 를
   별도 `@id`(`/guide/#faq`) 로 추가한 뒤 `CollectionPage.hasPart` ↔ `FAQPage.isPartOf` 로 연결했다.
2. **사업체 노드 타입 `ProfessionalService` → `LocalBusiness`.**
   근거: schema.org 어휘의 ProfessionalService 정의문에
   *"The general ProfessionalService type for local businesses was deprecated due to confusion
   with Service."* 가 명시돼 있고, 대체로 열거된 것은 Dentist·Attorney 같은 구체 업종 타입뿐이라
   소프트웨어 개발 스튜디오에 맞는 업종 타입이 없다. 직계 상위이자 현행 타입인 LocalBusiness 를 썼다.
   `ProfessionalService` 는 원래 `LocalBusinessBase` 를 확장하므로 이 전환은 일반화이며,
   쓰던 속성(주소·전화·영업시간·priceRange·areaServed)은 전부 유효하다.
   **schema.org 직접 접속은 차단돼 있어**, schema.org 어휘에서 생성된 `schema-dts@2.0.0` 의
   정의문으로 대조했다. 공식 페이지 원문 확인은 미검증.
   `@id`(`#business`)·이름·주소·연락처·영업시간·`parentOrganization` 은 바꾸지 않았다.
   새 `#localbusiness` 노드를 만들지 않았고 Organization 도 지우지 않았다.
3. **홈 FAQ 의 no-JS 접근 결함 수정** — §6-1 점검에서 발견.
   `styles.css` 가 `.faq-a { max-height: 0; overflow: hidden }` 로 접고, 펼치는 동작은
   `script.js` 클릭 핸들러가 inline `max-height` 를 넣는 방식뿐이었다. 즉 **JS 를 끄면
   질문 12개는 보이는데 답변은 어떤 방법으로도 열 수 없었다.** (답변 텍스트는 HTML 에 있으므로
   숨김 SEO 텍스트가 아니라 조작 수단의 문제다.)
   `index.html` head 에 `<noscript><style>.faq-a{max-height:none}</style></noscript>` 만 추가했다.
   JS 가 동작하는 일반 방문자에게는 적용되지 않아 화면이 그대로다(브라우저 검수로 확인).
4. **가이드 페이지의 취약한 JSON-LD 직렬화 제거.**
   `dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}` 를 쓰고 있어, 값에
   `</script>` 가 한 번만 섞여도 블록이 조기 종료된다. `components/JsonLd.tsx` 의 기존 안전
   직렬화(`ldJson`)를 타도록 `JsonLdScript` 공개 export 를 추가해 교체했다(기존 export 무변경).

### 이미 정상이라 **보존**한 것 (중복 추가하지 않음)
- 홈 meta description(68자) — 문구 그대로. "짧다"는 이유로 교체하지 않았다.
- 홈·가이드 canonical, title, OG/Twitter, 네이버 소유확인, RSS alternate, robots 정책.
- 홈 FAQ 12문항의 문항·답변·순서·디자인·CTA, 홈 OfferCatalog·가격표.
- 가이드의 CollectionPage/ItemList(48)/BreadcrumbList, 가이드·비교·허브 링크 96개.
- 전역 `@id` 3종(`#website`·`#organization`·`#business`), 홈 `#faqpage`·`#breadcrumb` ID.
- 로고·파비콘·OG 이미지·브랜드 컬러·폰트·헤더·히어로·H1·포트폴리오·상담 폼·모바일 메뉴.

## 4. 범위 밖으로 남긴 권고 (이번에 고치지 않음)

1. **인덱스 페이지 5곳의 취약한 JSON-LD 직렬화** — `app/solution/page.tsx`,
   `app/app/page.tsx`, `app/system/page.tsx`, `app/website/page.tsx`, `app/cost/page.tsx` 가
   가이드와 동일하게 `JSON.stringify` 를 직접 넣는다. 같은 한 줄 교체(`<JsonLdScript data={itemList} />`)로
   해결되지만 이번 대상 페이지(홈·가이드) 밖이라 손대지 않았다.
2. **`prebuild` 2회 실행** — 위 §2 참고.
3. **클릭 깊이 6 이상인 색인 페이지 109개** — `seo:qa` 의 기존 경고. 기준선과 동일하며
   이번 변경과 무관하다.
4. **`인계동` 문맥 수동 확인 9건** — `geo:check-entities` 의 기존 경고. 기준선과 동일.
