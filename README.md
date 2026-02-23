# 럼랩 REUMLAB — SEO 키워드 랜딩 자동생성 시스템

앱·웹 개발 외주 키워드 랜딩 **328개** + 허브 **38개**를 자동 생성하고,  
네이버·구글 검색에서 자연 유입을 극대화하는 시스템입니다.

## 아키텍처

```
검색 유입 ("수원 앱개발 비용", "홈페이지제작 견적" 등)
     ↓
/l/{키워드별 슬러그}/ (328개 정적 HTML)
     ↓ CTA 버튼 (카카오톡 상담 / 전화 / 이메일)
     ↓
문의 → 상담 → 계약
```

**핵심 원칙**

- 랜딩은 **정적 HTML** → 크롤러(네이버 Yeti, 구글봇)가 바로 읽음
- 허브(`/h/*`)로 내부링크 클러스터링 → SEO 파워 전달
- 각 랜딩마다 다른 FAQ/후기/문구 → 중복 콘텐츠 회피
- **JSON-LD** 구조화 데이터 → 검색엔진 리치 스니펫 대응

## 프로젝트 구조

```
reumlab-main/
├── content/
│   ├── templates.json      # 럼랩 기본 데이터 (서비스/가격/FAQ/후기)
│   ├── landings.json       # [자동생성] 328개 랜딩 데이터
│   └── clusters.json       # [자동생성] 38개 허브-랜딩 클러스터 매핑
├── scripts/
│   ├── generate-landings.mjs    # 키워드 조합 → landings.json
│   ├── build-hubs.mjs           # 허브 페이지 HTML 생성
│   ├── build-landings-pages.mjs # 랜딩 HTML 328개 생성
│   ├── copy-main.mjs            # 메인 index.html + assets 복사
│   ├── generate-sitemaps.mjs    # sitemap.xml (367개 URL)
│   └── generate-robots.mjs     # robots.txt
├── public/                      # [자동생성] Netlify에서 서빙하는 폴더
│   ├── index.html               # 메인 럼랩 사이트
│   ├── l/{slug}/index.html     # 키워드 랜딩 328개
│   ├── h/{hub}/index.html      # 허브 페이지 38개
│   ├── sitemap.xml
│   └── robots.txt
├── index.html                   # 기존 럼랩 메인 페이지 원본
├── netlify.toml                 # Netlify 빌드·배포 설정
├── package.json
└── README.md
```

## 시작하기

### 1. 전체 빌드 (로컬)

```bash
# 한 번에 (prebuild 포함: landings 생성 → HTML + sitemap + robots)
npm run build
```

prebuild만 따로 실행하려면: `npm run prebuild`

### 2. 개별 실행

```bash
npm run gen:landings      # content/landings.json 생성 (328개)
npm run build:hubs        # public/h/*/index.html 생성 (38개)
npm run build:landings    # public/l/*/index.html 생성 (328개)
npm run gen:sitemaps      # public/sitemap.xml 생성 (367개 URL)
npm run gen:robots        # public/robots.txt 생성
npm run copy:main         # index.html + assets → public/
```

### 3. 로컬 미리보기

```bash
npx serve public -l 3000
```

- http://localhost:3000  
- http://localhost:3000/l/suwon-app-dev/  
- http://localhost:3000/h/app-dev/

### 4. Netlify 배포

도메인 연결을 이미 했다면 **배포만 하면 됩니다.**

- **Git 사용 시**: 저장소를 Netlify에 연결해 두었다면 **git push**만 하면 자동 배포됩니다.
- **수동 배포**: `npx netlify deploy --prod` (또는 `netlify deploy --prod`)로 `public/` 폴더를 직접 배포할 수 있습니다. (Netlify CLI 설치: `npm i -g netlify-cli`)

`netlify.toml`에 빌드 커맨드가 설정되어 있어 배포 시 자동으로:

1. `landings.json` 생성  
2. HTML 328개 + 허브 38개 빌드  
3. `sitemap.xml` + `robots.txt` 생성  
4. `public/` 폴더 배포  

## 키워드 매트릭스 (328개 조합)

| 패턴 | 예시 | 개수 |
|------|------|------|
| 서비스 × 의도 | 앱개발 비용, 홈페이지제작 견적 | 96개 |
| 지역 × 서비스 | 수원 앱개발, 강남 홈페이지제작 | 80개 |
| 업종 × 서비스 | 스타트업 앱개발, 카페 홈페이지 | 72개 |
| 지역 × 서비스 × 의도 | 수원 앱개발 비용, 판교 웹개발 견적 | 80개 |

## 네이버·구글 검색 등록 가이드

### STEP 1: 구글 서치콘솔

1. [Google Search Console](https://search.google.com/search-console) 접속  
2. "URL 접두어" → 사이트 URL 입력 후 소유권 확인  
3. **Sitemaps** → `https://reumlab.netlify.app/sitemap.xml` 제출  
4. **URL 검사** → 메인 URL 및 주요 랜딩 5~10개 색인 생성 요청  

### STEP 2: 네이버 서치어드바이저

1. [네이버 서치어드바이저](https://searchadvisor.naver.com) 접속  
2. 사이트 등록 후 소유권 확인 (HTML 파일 또는 메타태그)  
3. **사이트맵 제출** → `https://reumlab.netlify.app/sitemap.xml`  
4. **웹 페이지 수집** → 주요 URL 수동 요청  

### STEP 3: 색인 모니터링

- **구글**: Search Console → 적용 범위에서 색인된 페이지 수 확인  
- **네이버**: 서치어드바이저 → 현황 → 콘텐츠 현황  
- 목표: 2~4주 내 300개+ URL 색인  

## 키워드 추가/수정

- **새 키워드**: `scripts/generate-landings.mjs`에서 `SERVICES`, `REGIONS`, `INDUSTRIES`, `INTENTS` 배열 수정 후 `npm run prebuild && npm run build`  
- **FAQ/후기 문구**: `content/templates.json`에서 수정 후 `npm run build` 재실행  

## 주의사항

- **중복 콘텐츠 회피**: 각 랜딩마다 FAQ/후기를 슬러그 기준으로 다르게 조합하며, canonical URL을 설정했습니다.  
- **이미지**: 메인 페이지용 이미지는 `assets/` 폴더에 두면 빌드 시 `public/assets/`로 복사됩니다. (og-image.png 등 필요 시 추가)  
- **Netlify**: 정적 HTML 기준으로 무료 플랜 대역폭으로 충분합니다.  

## 기대 효과

| 항목 | 기대치 |
|------|--------|
| 색인 페이지 | 367개 (메인 + 허브 38 + 랜딩 328) |
| 타겟 키워드 | 300개+ |
| 색인 완료 | 2~4주 (구글), 1~2주 (네이버) |
| 자연 유입 | 1~2개월 후부터 |

---

© 2026 이터널식스 (REUMLAB). All Rights Reserved.
