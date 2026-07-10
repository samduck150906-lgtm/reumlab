# GSC · 네이버 수동 색인 요청 URL 목록 (우선순위)

> 전체 URL은 이미 `sitemap.xml`로 자동 제출된다. 이 목록은 **수동으로 "색인 요청/수집 요청"을 넣을 우선순위 페이지**다.
> 구글 서치콘솔 URL 검사는 하루 요청 수 제한이 있으니 **Tier 순서로 나눠서** 넣는다.
> 평문 복사용: [`gsc-priority-urls.txt`](./gsc-priority-urls.txt)

## 어떻게 넣나

- **구글 (GSC)**: [Search Console](https://search.google.com/search-console) → 상단 **URL 검사** 창에 주소 붙여넣기 → **색인 생성 요청**. (+ **Sitemaps**에 `https://reumlab.com/sitemap.xml` 제출/재제출)
- **네이버**: [서치어드바이저](https://searchadvisor.naver.com) → 요청 → **웹 페이지 수집** → 주소 입력. (+ **사이트맵 제출**, [**IndexNow 등록**](https://searchadvisor.naver.com/indexnow) 하면 배포 시 자동 전달)

주소는 반드시 **끝에 `/` 포함**한 형태 그대로 넣는다(사이트가 trailing-slash canonical이라 슬래시 없는 주소는 리다이렉트된다).

---

## Tier 1 — 홈 + 핵심 필러 + 인덱스 허브 (먼저, 1일차)

가장 중요. 특히 **홈(`/`)** 은 구글 캐시가 낡아 있으니 **오늘 바로** 색인 요청한다.

```
https://reumlab.com/
https://reumlab.com/app-development/
https://reumlab.com/web-development/
https://reumlab.com/mvp/
https://reumlab.com/flutter/
https://reumlab.com/ai-development/
https://reumlab.com/source-handover/
https://reumlab.com/app/
https://reumlab.com/website/
https://reumlab.com/cost/
https://reumlab.com/solution/
https://reumlab.com/guide/
https://reumlab.com/blog/
https://reumlab.com/soho/
```

## Tier 2 — 거점 지역×서비스 (2일차)

색인 대상 지역은 **동탄·화성·수원 3곳뿐**이다(`INDEXED_REGION_SLUGS`, 그 외 지역은 noindex). 이 9개가 지역 상업 키워드의 핵심.

```
https://reumlab.com/app-development/dongtan/
https://reumlab.com/app-development/hwaseong/
https://reumlab.com/app-development/suwon/
https://reumlab.com/web-development/dongtan/
https://reumlab.com/web-development/hwaseong/
https://reumlab.com/web-development/suwon/
https://reumlab.com/mvp/dongtan/
https://reumlab.com/mvp/hwaseong/
https://reumlab.com/mvp/suwon/
```

## Tier 3 — 보조 필러 + 대표 가이드 (3일차~)

```
https://reumlab.com/app-agency/
https://reumlab.com/website-agency/
https://reumlab.com/admin-page-development/
https://reumlab.com/maintenance/
https://reumlab.com/windows-app-development/
https://reumlab.com/guide/dongtan-hwaseong/
https://reumlab.com/guide/app-cost/
https://reumlab.com/guide/web-cost/
https://reumlab.com/guide/mvp-cost/
https://reumlab.com/guide/outsourcing-cost/
```

---

## 나머지 (자동)

- 위 목록 밖의 랜딩(`/l/…`)·업종(`/app/…`, `/website/…`, `/cost/…`, `/solution/…`)·가이드·비교 페이지는 **`sitemap.xml`에 색인 게이트를 통과한 것만** 들어 있어 자동으로 수집된다. 수동 요청은 위 대표 페이지만으로 충분하다.
- 재크롤은 **홈 `lastmod` 신선도 수정**(이미 배포)과 위 **수동 색인 요청**이 함께 작동할 때 가장 빠르다.
