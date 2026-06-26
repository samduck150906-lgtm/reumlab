# 🚀 블로그 자동 생성 시스템 가이드

REUMLAB의 블로그 자동 생성 시스템으로 SEO 최적화된 콘텐츠를 대량으로 생성하고, 여러 플랫폼에 배포할 수 있습니다.

---

## 📋 목차

1. [개요](#개요)
2. [시스템 구조](#시스템-구조)
3. [사용 방법](#사용-방법)
4. [커스터마이징](#커스터마이징)
5. [SEO 전략](#seo-전략)
6. [멀티 플랫폼 배포](#멀티-플랫폼-배포)
7. [성과 측정](#성과-측정)

---

## 개요

이 시스템은 **화이트햇 SEO 기반**으로 설계되어 있습니다. 의도적으로 낮은 품질의 중복 콘텐츠를 생성하지 않으며, 각 콘텐츠는 실제 가치를 제공하도록 구성됩니다.

### ✨ 핵심 특징

- **자동 생성**: 키워드 조합 기반으로 새로운 블로그 포스트 자동 생성
- **지역별 다양화**: 수원, 경기도, 전국 등 지역별 최적화된 콘텐츠
- **SEO 메타데이터**: 자동으로 메타 태그, JSON-LD, 구조화된 데이터 포함
- **멀티 플랫폼**: 웹사이트, 네이버 플레이스, 블로그 등 여러 채널 배포
- **일정 관리**: 플랫폼별 배포 일정 자동 계산
- **품질 보증**: 최소 읽기 시간, 단어 수, FAQ 요구사항 자동 검증

---

## 시스템 구조

```
reumlab/
├── lib/
│   ├── blog-generator.ts          # 블로그 생성 엔진 (TypeScript)
│   └── blog-posts.ts              # 생성된 블로그 포스트 데이터
├── scripts/
│   ├── generate-blog-posts.mjs    # 자동 생성 스크립트 (Node.js)
│   └── distribute-blog-posts.mjs  # 멀티 플랫폼 배포 계획
├── content/
│   └── blog-generation-config.json # 생성 설정 파일
└── docs/
    └── BLOG-AUTO-GENERATION.md    # 이 파일
```

### 주요 파일 설명

| 파일 | 역할 | 언어 |
|------|------|------|
| `blog-generator.ts` | 블로그 콘텐츠 생성 로직 | TypeScript |
| `generate-blog-posts.mjs` | Node.js에서 실행되는 생성 스크립트 | JavaScript |
| `distribute-blog-posts.mjs` | 멀티 플랫폼 배포 계획 생성 | JavaScript |
| `blog-generation-config.json` | 생성 설정 (키워드, 지역, 채널 등) | JSON |

---

## 사용 방법

### 1️⃣ 기본 사용법

```bash
# 블로그 포스트 자동 생성
npm run gen:blog

# 멀티 플랫폼 배포 계획 생성
npm run gen:blog:distribute
```

### 2️⃣ 설정 파일 수정

`content/blog-generation-config.json`을 편집하여 생성할 콘텐츠 주제를 변경합니다:

```json
{
  "blogGenerationStrategy": {
    "topics": [
      {
        "mainKeyword": "앱 개발",
        "subKeywords": ["비용", "기간", "견적"],
        "region": "수원",
        "postsToGenerate": 6
      }
    ]
  }
}
```

### 3️⃣ 커스텀 설정으로 생성

TypeScript에서 직접 사용:

```typescript
import { generateBlogPost, BlogTopicConfig } from '@/lib/blog-generator';

const config: BlogTopicConfig = {
  mainKeyword: '웹 개발',
  subKeywords: ['비용', 'SEO', '견적'],
  region: '서울',
  minReadingTime: 6
};

const post = generateBlogPost(config, 0);
```

---

## 커스터마이징

### 새로운 주제 추가

`content/blog-generation-config.json`의 `topics` 배열에 추가:

```json
{
  "mainKeyword": "AI 챗봇",
  "subKeywords": ["개발", "비용", "도입"],
  "region": "전국",
  "postsToGenerate": 4
}
```

### 키워드 전략 변경

```json
{
  "seoStrategy": {
    "keywordVariation": true,      // 키워드 변형 활성화
    "regionalDiversity": true,      // 지역별 다양화
    "multiPlatformDistribution": true, // 멀티 플랫폼 배포
    "structuredData": true          // JSON-LD 구조화 데이터
  }
}
```

### 배포 채널 설정

```json
{
  "distributionChannels": {
    "website": {
      "enabled": true,
      "priority": 1
    },
    "naverPlace": {
      "enabled": true,
      "priority": 2,
      "url": "https://naver.me/FORRCoFc"
    }
  }
}
```

---

## SEO 전략

### 🎯 키워드 다양화

각 블로그 포스트는 여러 키워드 변형을 포함합니다:

- `앱 개발 비용`
- `수원 앱 개발`
- `앱 개발 비용 비용`
- `비용 앱 개발`
- `수원 앱 개발 비용`

이는 자연스러운 검색 쿼리를 반영하면서 과도한 키워드 채우기를 피합니다.

### 🌍 지역별 최적화

설정 파일에서 `region`을 지정하면, 자동으로 지역 기반 콘텐츠가 생성됩니다:

```
- "수원" 지역 설정 → 수원 관련 키워드 자동 포함
- "경기도" 지역 설정 → 경기도 범위의 광역 콘텐츠
- "전국" 지역 설정 → 지역별 변형 콘텐츠
```

### 📊 구조화된 데이터

각 포스트는 다음을 자동 포함합니다:

```typescript
{
  htmlBody: `...`,  // SEO 최적화된 HTML
  faqs: [            // FAQ JSON-LD 스키마
    { q: '...', a: '...' }
  ]
}
```

### 🔗 내부 링크 구조

블로그 인덱스 페이지(`/blog/`)에서:
- 모든 포스트 목록이 표시됨
- 각 포스트로의 내부 링크 확보
- 도메인 권한(Domain Authority) 축적

---

## 멀티 플랫폼 배포

### 📱 지원하는 플랫폼

| 플랫폼 | 상태 | SEO 가중치 | 설명 |
|-------|------|-----------|------|
| 웹사이트 | ✅ 활성 | 1.0 | 메인 채널 - 최우선 배포 |
| 네이버 플레이스 | ✅ 활성 | 0.8 | 지역 검색 최적화 |
| 네이버 블로그 | ⏳ 준비 중 | 0.7 | API 연동 필요 |
| Medium | ⏳ 준비 중 | 0.6 | 해외 개발자 커뮤니티 |

### 📅 자동 배포 일정

각 플랫폼별로 배포 일정이 자동 계산됩니다:

```javascript
// 예: 2026-06-26 발행 포스트
웹사이트:        2026-06-26 (즉시)
네이버 플레이스: 2026-06-27 (+1일)
네이버 블로그:   2026-06-28 (+2일)
Medium:         2026-06-29 (+3일)
```

이 지연은 **구글 신선도 신호**를 최대화하면서 동시에 여러 플랫폼에서 검색 노출을 유지하도록 설계되었습니다.

### 🔗 배포 URL 전략

각 플랫폼에서 원본 웹사이트로의 링크:

```
네이버 플레이스:
  /blog/{slug}/?region=suwon
  ↓ (외부 링크)
웹사이트의 리소스 증대
```

---

## 성과 측정

### 📈 추적해야 할 메트릭

1. **검색 노출(Impressions)**
   - 구글 서치 콘솔에서 `/blog/` 경로 모니터링
   - 지역별 키워드 노출도 추적

2. **클릭률(CTR)**
   - 각 포스트의 클릭 수 추적
   - 타이틀·설명(Description) 최적화 필요 여부 판단

3. **유입(Traffic)**
   - Google Analytics에서 `/blog` 섹션 별도 추적
   - 플랫폼별 유입 비교 (웹 vs 네이버 vs 기타)

4. **전환(Conversion)**
   - 블로그 → 상담 신청 (CTA 클릭)
   - 블로그 → 서비스 페이지 이동

### 📊 대시보드 설정

```javascript
// Google Analytics 커스텀 이벤트 예시
gtag('event', 'view_blog_post', {
  'blog_slug': 'app-gaebal-biyong',
  'region': 'suwon'
});
```

---

## ⚠️ 주의사항

### ✅ 해야 할 것

- ✓ 자동 생성 후 사람이 검토하기
- ✓ 정기적으로 실제 고객 피드백 반영
- ✓ 오래된 포스트 주기적 업데이트
- ✓ 검색 랭킹 모니터링 및 개선
- ✓ 각 플랫폼의 지침 준수

### ❌ 하면 안 되는 것

- ✗ 품질 검증 없이 자동 배포
- ✗ 과도한 중복 콘텐츠 (각 포스트는 고유해야 함)
- ✗ 지역/키워드 변형을 핑계로 콘텐츠 스팸
- ✗ 메타 태그 키워드 채우기 (outdated SEO)
- ✗ 자동 생성 사실 숨기기

---

## 🔧 트러블슈팅

### Q: 스크립트가 실행되지 않음
```bash
# 실행 권한 확인
chmod +x scripts/generate-blog-posts.mjs

# 다시 실행
npm run gen:blog
```

### Q: 블로그 포스트가 사이트에 반영되지 않음
- `lib/blog-posts.ts` 파일이 제대로 업데이트되었는지 확인
- Next.js 개발 서버 재시작: `npm run dev`
- 빌드 캐시 삭제: `rm -rf .next/`

### Q: SEO 순위가 오르지 않음
- 최소 2-4주 대기 (구글 인덱싱 시간)
- Google Search Console에서 URL 수동 제출
- 각 포스트의 콘텐츠 품질 재검토
- 내부 링크 구조 최적화 확인

---

## 📚 참고 자료

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Search Central - SEO Guide](https://developers.google.com/search/docs)
- [Schema.org Structured Data](https://schema.org/)
- [Naver Search Advisor](https://searchadvisor.naver.com/)

---

## 📞 지원

문제가 있거나 개선 사항이 있으면:
- 이슈 제출: GitHub Issues
- 이메일: ceo@eternalsix.com
- 전화: 010-8111-9370

---

**Last Updated**: 2026-06-26
**System Version**: 1.0.0
