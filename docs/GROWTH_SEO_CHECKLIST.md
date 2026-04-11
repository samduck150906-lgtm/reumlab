# 림랩(Reum Lab) 트래픽·SEO 실행 체크리스트

이 문서는 저장소에 반영된 **코드**와 병행해, 내일부터 실행할 **마케팅·측정** 작업을 순서대로 정리합니다.

---

## 이미 구현된 기술 SEO (코드)

- [x] **동적 라우트**: `/portfolio/[slug]/`, `/blog/[slug]/` + `generateStaticParams` + `generateMetadata` (OG·canonical)
- [x] **홈 JSON-LD**: `ReumHomeGraphJsonLd` — Organization + LocalBusiness + ProfessionalService (`@graph`)
- [x] **칼럼·케이스 스키마**: Article, CreativeWork + BreadcrumbList
- [x] **동적 sitemap**: `app/sitemap.ts`에 블로그·포트폴리오 상세 URL 포함
- [x] **롱테일 시드**: `lib/content-marketing.ts` 키워드 10개 ↔ `lib/blog-posts.ts` slug 매칭
- [x] **GTM/픽셀 훅**: `components/Analytics.tsx` — 환경 변수 `NEXT_PUBLIC_GTM_ID`, 선택 `NEXT_PUBLIC_META_PIXEL_ID`
- [x] **dataLayer 클릭**: `data-analytics="..."` 속성 → 이벤트 `reum_click` / `reum_action` (GTM에서 GA4 이벤트로 변환)

### 환경 변수 (`.env.local` 예시)

```bash
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
# 선택: GTM에 Meta Pixel을 넣지 않을 때만
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
```

### GTM에서 할 일 (요약)

1. GA4 Configuration 태그 + Measurement ID 연결  
2. 사용자 정의 이벤트: 트리거 `Custom Event` 이름 `reum_click`, 파라미터 `reum_action`을 GA4 이벤트 매핑  
3. Meta Pixel은 GTM 템플릿으로 넣거나, 위 `NEXT_PUBLIC_META_PIXEL_ID`로 중복 없이 하나만 사용  

---

## 마케팅 액션 플랜 (순서대로)

### 주 1 — 측정·검색 콘솔

1. [ ] Netlify/Vercel 배포 후 **Google Search Console**·**네이버 서치어드바이저**에 사이트 등록  
2. [ ] **sitemap** 제출: `https://reumlab.com/sitemap.xml`  
3. [ ] GTM 컨테이너 발급 → `NEXT_PUBLIC_GTM_ID` 배포 환경에 설정  
4. [ ] GA4에서 전환 이벤트: `reum_click` 중 `cta_*consult*` → 전환으로 표시  

### 주 2 — 콘텐츠·내부 링크

5. [ ] `lib/blog-posts.ts`에 칼럼 2편 추가 (본문 800자 이상 권장) → 빌드 시 자동 정적 생성  
6. [ ] 각 블로그 본문에서 `/consultation/`, `/#pricing`, 서비스 slug(`/앱개발/` 등)로 **내부 링크 2개 이상**  
7. [ ] 링크드인·브런치에 칼럼 1편 요약 + “전문가 없이 유지보수” 훅으로 CTA  

### 주 3 — 오가닉 게릴라 (비용 0)

8. [ ] 스타트업 오픈채팅·디스콜: *“론칭 후 문구 하나에 며칠 쓰신 적 있나요?”* 로 스레드 시작 → 블로그 1편만 링크 (스팸 금지)  
9. [ ] IT 커뮤니티: 실패담 3줄 + 체크리스트 캡처(명세·소유권) + `/blog/oeju-gaebal-silphae-an-haneun-bab/` 링크  

### 주 4 — 페이드 A/B (소액)

10. [ ] **소재 A** (공포 회피): “외주 끝나고 수정 못 하셨나요? VAT 포함 패키지 + 전수 교육” → 랜딩 `/#pricing`  
11. [ ] **소재 B** (이득): “MVP 14일·웹 패키지. 검증 먼저.” → `/checkout-reum.html?package=standard`  
12. [ ] **소재 C** (교육): “문과 대표도 AI로 코드 수정” → `/blog/mvp-gaebal-bijeongongja-daehyo/`  
    - 타겟: 28–45세, 창업·소상공 관심, 앱 설치 행동 유사 타겟(메타) / 검색어 “MVP 개발 외주”(구글 검색광고)

### CTA·UX (랜딩에 반영됨)

- 히어로: 상담(주) + 포트폴리오(보조)  
- 패키지: 결제(주) + 상담만(보조) + 표 하단 재상담  
- 하단 스트립: 상담 + 카카오  
- 푸터: 포트폴리오·**블로그**·상담 (내부 링크 확장)

---

## 프로그래매틱 SEO 구조 기획 (요약)

| 레이어 | 역할 |
|--------|------|
| 데이터 | `lib/blog-posts.ts`, `lib/portfolio-cases.ts` (→ CMS/노션 API로 교체) |
| 라우트 | `generateStaticParams`로 전 URL 사전 렌더 |
| 메타 | `generateMetadata`로 title·description·OG·article 타입 |
| 스키마 | Article / CreativeWork / Breadcrumb |
| 사이트맵 | `sitemap.ts`에서 데이터 순회 |

---

## 롱테일 키워드 10가지 (slug 연동)

`lib/content-marketing.ts`의 `LONG_TAIL_KEYWORDS`와 동일합니다.

1. 앱 개발 비용 줄이는 법  
2. 외주 개발 실패 안 하는 법  
3. 비전공자 대표 MVP 개발  
4. 앱 유지보수 비용 절감 AI  
5. 스타트업 랜딩페이지 SEO 참사  
6. Flutter MVP 시장 검증  
7. 외주 개발사 회의 없이 수정  
8. 소수 기능 MVP 범위 정하기  
9. 론칭 후 텍스트 변경 외주 없이  
10. 외주 개발 명세서 확인 방법  

---

## 보안·운영

- 시크릿 키·API 키는 **절대** Git에 커밋하지 말고 호스팅 환경 변수만 사용  
- OG 이미지는 1200×630 권장, `SITE.defaultOgImage` URL이 실제로 200 응답하는지 주기적으로 확인  
