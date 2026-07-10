# 왜 상위노출이 안 되는가 — 진단과 즉시 실행 체크리스트

> 2026-07-10 진단. 대상: `https://reumlab.com`

## TL;DR

**색인 차단(기술 장애)이 아니다.** 사이트는 구글에 색인돼 있고, 브랜드 검색 "름랩"에는 홈이 뜬다.
문제는 두 가지다:

1. **구글 색인이 낡았다(stale).** 구글이 캐시한 홈은 **옛 버전**(제목 "AI 기반 앱·웹 개발 & 자체 유지보수 교육", 가격 "149만~799만원")이다. 현재 배포된 홈은 제목 "외주에 묶이지 않는 앱·웹 MVP 개발…", 가격 49만~690만원이다. → 구글이 홈을 **오랫동안 재크롤하지 않았다.**
2. **비브랜드 경쟁 키워드(앱개발·홈페이지 제작 등)는 순위가 낮다.** 이건 버그가 아니라 **도메인 authority + 시간 + 오프페이지 신호** 문제다. 코드로 즉시 올릴 수 없다.

## 근거

| 신호 | 관측 | 해석 |
|---|---|---|
| `site:reumlab.com` | 홈 + 랜딩 다수 노출 | 색인 O, 차단 X |
| "름랩" 브랜드 검색 | 홈 1위 | 브랜드 SERP 정상 |
| 구글이 보여주는 홈 제목·가격 | **옛 버전**(149만~799만) | 재크롤 안 됨(stale) |
| robots / canonical / sitemap / JSON-LD | 정상, 정적 HTML로 본문 제공 | 기술 SEO 양호 |

## 코드로 고친 것 (이번 커밋)

- **홈 `lastmod` 신선도 버그 수정** (`app/sitemap.ts`).
  홈은 Next 렌더가 아니라 정적 `index.html`로 서빙되는데(copy:home), 사이트맵의 홈 `lastmod`가 `lib/seo.ts` 커밋만 따라가고 있었다. 그래서 **홈 콘텐츠(index.html)가 바뀐 배포에서도 신선도 신호가 전진하지 않아** 크롤러가 옛 홈을 계속 캐시했다(위 stale의 직접 원인).
  → 이제 홈 `lastmod`는 실제 배포되는 홈 소스(`index.html`·`styles.css`·`script.js`)의 최신 git 날짜를 함께 반영한다. IndexNow(네이버·Bing) 재제출도 홈 변경 시 함께 발동한다.

> 단, `lastmod`는 크롤러에 대한 **힌트**지 명령이 아니다. 낡은 홈을 빨리 갈아끼우는 가장 확실한 방법은 아래 **1번(GSC 색인 요청)**이다.

## 지금 당장 할 것 (오너 작업 — 효과순)

### 1. 구글 서치콘솔에서 강제 재크롤 요청 ⚡ (가장 빠름, 2~7일)
- [Search Console](https://search.google.com/search-console) → **URL 검사**에 `https://reumlab.com/` 입력 → **색인 생성 요청**.
- 핵심 URL 10개도 동일하게 요청: `/app-development/suwon/`, `/web-development/suwon/`, `/mvp/`, `/flutter/`, `/ai-development/`, `/app/`, `/website/`, `/cost/`, 주력 랜딩 2~3개.
- **Sitemaps** → `https://reumlab.com/sitemap.xml` 제출(이미 했으면 "다시 제출").
- → 이걸 하면 위의 "낡은 홈"이 며칠 안에 최신 제목·가격으로 교체된다.

### 2. 네이버 서치어드바이저 (별도 생태계)
- [서치어드바이저](https://searchadvisor.naver.com) → 사이트 등록 → 소유확인(메타태그 이미 삽입됨: `naver-site-verification`).
- **사이트맵 제출** `https://reumlab.com/sitemap.xml` → **웹 페이지 수집** 수동 요청.
- **[IndexNow 등록](https://searchadvisor.naver.com/indexnow)** — 키 파일 이미 존재(`/reumlab2026indexnow9370.txt`). 등록하면 배포 시 자동 색인 요청이 네이버에 전달된다.
- 네이버는 **웹문서만으로는 상위가 어렵다.** C-Rank/D.I.A. 특성상 **네이버 블로그 + 스마트플레이스** 활동이 지역·브랜드 노출의 핵심 축이다(아래 4번).

### 3. 브랜드 엔티티 강화 (authority의 토대)
- `lib/seo.ts`의 `SITE.sameAs`에 **실제 개설한 채널**만 추가(네이버 블로그·인스타·유튜브·GBP 지도 URL). 현재 1개(네이버 플레이스)뿐 — 엔티티 신호가 약하다.
- **구글 비즈니스 프로필**: 이미 만든 생성기로 콘텐츠 채우기 — `npm run gen:gbp` → `content/gbp/GBP-PASTE-GUIDE.md` 그대로 붙여넣기. 웹사이트 필드 = `https://reumlab.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp`.
- **NAP 글자 단위 일치**: 사이트 footer / JSON-LD / 네이버 플레이스 / GBP 전부 동일 표기(`름랩(REUMLAB) · 대표 성아름 · 793-12-03247 · 경기도 화성시 동탄첨단산업1로 58, 307호(영천동) · 010-8111-9370`).

### 4. 콘텐츠·신뢰 신호 (순위의 실제 동력, 수주~수개월)
- **네이버 블로그** 주 2~3편(외주 체크리스트 / MVP 비용 / 소스코드 이관 등), 글 하단에 사이트 링크.
- **실제 후기 확보** — 가공 후기는 금지(표시광고법·SEO 위험). 동의받은 검증 후기만 게시.
- **백링크·인용**: 크몽/디렉터리/SNS/보도 등에서 사이트로 유입되는 링크 확보.

## 기대 시점 (현실)

| 항목 | 시점 |
|---|---|
| 낡은 홈 → 최신으로 교체 | 1번 실행 시 2~7일 |
| 신규/롱테일 pSEO 색인 확대 | 2~4주 |
| 지역+브랜드 키워드(동탄·화성 앱개발 등) 노출 | 1~2개월(플레이스·블로그·백링크 병행 시) |
| 광역 경쟁 키워드(앱개발·홈페이지 제작) 1페이지 | 수개월+ (authority 누적 필요) |

**핵심:** 코드는 기술적 신선도 버그만 고칠 수 있다. 실제 순위는 **GSC 색인 요청(1번) + 네이버 등록(2번) + 엔티티/후기/백링크(3·4번)**가 좌우한다. 1·2번은 오늘 바로 실행 가능하다.

---

## GSC "색인 미생성" 6개 항목 → 코드 대응 현황 (2026-06-30 기준, 색인됨 361 / 미색인 203)

GSC가 보고한 6개 미색인 사유를 코드 상태에 하나씩 대조했다. 대부분은 **의도된 품질 게이트(noindex,follow)** 이거나 **최근 SEO 커밋 배포 이전에 크롤된 stale 데이터**로, 재크롤 시 자연 해소된다. 코드로 새로 고칠 것은 **NOINDEX 4건뿐**이었다.

| GSC 사유 | 건수 | 판정 | 코드 대응 |
|---|---:|---|---|
| 발견됨–현재 색인 미생성 | 139 | 시간·크롤예산 문제 | 조치 불필요. 사이트맵/IndexNow 이미 가동, GSC 색인 요청(위 1번)으로 촉진. ute.kr(2,482) 대비 소규모 |
| 사용자가 선택한 표준 없는 중복 | 49 | 대부분 stale + 의도 noindex | `/l/`·`/h/`·pSEO near-duplicate는 `landingIndexable`·`hubShouldIndex`·`index-quality`로 이미 `noindex,follow` + 사이트맵 제외(자기참조 canonical 포함). 최근 canonical 통합 커밋 배포 前 크롤분이 다수 → 재크롤 시 해소 |
| 크롤링됨–현재 색인 미생성 | 8 | 의도 noindex + 정상 | `/l/*` near-duplicate 랜딩(색인 게이트 제외), `웹개발-인턴-*`은 글롭 301 처리됨, `/feed.xml`은 정상(피드) |
| **NOINDEX 태그로 제외** | **4** | **stale 초안 → 정리함** | `/blog/-16`·`/blog/-seo-18`·`/blog/flutter-14`·`/blog/mvp-22`. 현행 `BLOG_POSTS`에 없는 구 자동생성 삭제분(한글 접두어 유실 슬러그). 의도적 noindex 콘텐츠가 아니므로 **`public/_redirects`에 주제별 301 추가**(→ `/blog/`·`/web-development/`·`/flutter/`·`/mvp/`) |
| 리디렉션이 포함된 페이지 | 2 | 정상(버그 아님) | `/guide/quote`·`/mvp-development`는 실제 색인 대상 페이지이고 자기참조 canonical 보유. `next.config.mjs`의 `trailingSlash: true`로 인해 **슬래시 없는 요청이 슬래시 버전으로 301**되는 정상 동작 — GSC의 "리디렉션"은 이 non-slash→slash 301을 가리킴 |
| 찾을 수 없음(404) | 1 | 이미 처리됨 | `/bootcamp/ai-app/`는 `public/_redirects`에서 `/ai-development/`로 301 완료(GSC 재크롤 대기) |

**요약:** 코드로 새로 조치한 것은 NOINDEX 4건(stale 초안 → 301)뿐이고, 나머지는 이미 구현된 색인 게이트(의도)이거나 재크롤로 풀릴 stale이다. 남은 실효 조치는 위 **1번(GSC 강제 재크롤)** 이다.
