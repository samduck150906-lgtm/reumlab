# 프로그래매틱 마케팅 자동화 시스템

## 개요

이 시스템은 블로그 포스트를 기반으로 광고 캠페인을 자동으로 생성하고 Google Ads, Naver Ads, Facebook/Instagram Ads 등 여러 플랫폼에 자동으로 배포합니다.

```
블로그 포스트 (400개)
    ↓
마케팅 캠페인 자동 생성 (블로그당 1개 캠페인)
    ├── Ad Copy 생성 (3가지 변형)
    ├── 예산 배분 (50K~100K KRW/day)
    ├── 키워드 타겟팅 (블로그 키워드 기반)
    └── A/B 테스트 설정 (14일)
        ↓
멀티플랫폼 배포 (Google, Naver, Facebook, Instagram)
    ├── 캠페인 생성
    ├── 성과 모니터링
    ├── 자동 최적화
    └── 주간/월간 리포트 생성
```

## 핵심 개념

### 1. White-hat SEO & 성과 기반 마케팅

이 시스템은 **전략적이고 정직한** 마케팅을 기반으로 합니다:

- ✅ **실제 콘텐츠 기반**: 400개의 고품질 블로그 포스트 기반 캠페인
- ✅ **성과 측정**: 실시간 CTR, CPC, CPA, ROAS 기반 최적화
- ✅ **규정 준수**: 각 플랫폼의 광고 정책 준수
- ✅ **투명성**: 모든 캠페인 데이터 로깅 및 감사 추적

### 2. 자동 최적화 규칙

```typescript
// CTR 기반 최적화 (< 0.5%)
→ 광고 문구 개선 및 A/B 테스트

// CPC 기반 입찰 조정
→ 최대 입찰가 감소 (maxBid *= 0.9)

// 성공 캠페인 예산 증가 (ROAS > 3.0)
→ 일일 예산 증가 (dailyBudget *= 1.2)

// 저성과 캠페인 예산 감소 (ROAS < 1.5)
→ 일일 예산 감소 (dailyBudget *= 0.8)

// 전환율 기반 타겟팅 개선 (< 2%)
→ 제외 키워드 추가 및 타겟팅 정제

// CPA 기반 예산 확대 (actual_cpa < target_cpa)
→ 새 지역 추가 및 지역 확장
```

## 시스템 아키텍처

### 파일 구조

```
lib/
├── programmatic-marketing.ts       # 마케팅 엔진 (타입스크립트)
├── ad-platform-integrations.ts     # API 통합 계층
└── blog-posts.ts                   # 블로그 포스트 데이터

scripts/
├── auto-marketing-campaigns.mjs     # 캠페인 자동 생성
├── deploy-campaigns-to-platforms.mjs # 멀티플랫폼 배포
└── generate-blog-posts.mjs          # 블로그 포스트 생성

docs/
├── PROGRAMMATIC-MARKETING.md        # 이 파일
├── PLATFORM-API-INTEGRATION.md      # API 통합 가이드
└── BLOG-AUTO-GENERATION.md          # 블로그 생성 가이드

content/
└── blog-generation-config.json      # 블로그 생성 설정

.output/
├── marketing-campaigns.json         # 생성된 캠페인 (샘플 5개)
└── deployment-report.json           # 배포 리포트
```

### 핵심 컴포넌트

#### 1. 마케팅 엔진 (lib/programmatic-marketing.ts)

**400개의 블로그 포스트에서 자동 생성:**
- 캠페인 ID 및 이름
- 광고 플랫폼 선택 (지역별 최적화)
- 키워드 & 타겟팅
- 광고 문구 (3가지 변형)
- 예산 배분 (상위 30% → 100K, 중위 30% → 50K, 나머지 → 30K KRW/day)
- 입찰 전략 (경쟁력 있는 키워드 → CPA, 약한 키워드 → CPC)
- 캠페인 일정 (평일 9-12시, 14-18시)

**A/B 테스트 설정:**
- 대조군(Control): 첫 번째 광고 문구 (50%)
- 변형 A(Variant A): 두 번째 광고 문구 (25%)
- 변형 B(Variant B): 세 번째 광고 문구 (25%)
- 기간: 14일
- 성공 지표: CTR (클릭률)
- 신뢰도: 95%

**성과 시뮬레이션:**
```
월 예산 → 예상 노출 수
예상 노출 × CTR → 예상 클릭 수
예상 클릭 × 전환율 → 예상 전환 수
월 예산 / 예상 클릭 → CPC
월 예산 / 예상 전환 → CPA
(전환 × 500K원) / 월 예산 → ROAS
```

**멀티플랫폼 예산 분배:**
```
총 월 예산 (약 48M원)
├── Google:   40% (19.2M)
├── Naver:    35% (16.8M)
├── Facebook: 15% (7.2M)
└── Instagram: 10% (4.8M)
```

**마케팅 퍼널:**
```
인지도 단계 (30%):   14.4M - Google Display, Naver, Instagram
검토 단계 (30%):    14.4M - Google Search, Naver Search
전환 단계 (25%):    12.0M - Google Shopping, Remarketing, Email
유지 단계 (15%):    7.2M  - Email, SMS, Facebook
```

#### 2. API 통합 계층 (lib/ad-platform-integrations.ts)

**추상 기본 클래스:**
```typescript
AdPlatformIntegration
  ├── validateConfig()
  ├── createCampaign()
  ├── updateCampaign()
  ├── pauseCampaign()
  ├── resumeCampaign()
  ├── deleteCampaign()
  └── getPerformanceMetrics()
```

**플랫폼 구현:**
- GoogleAdsIntegration: GAQL 쿼리, 마이크로 단위 예산
- NaverAdsIntegration: HMAC-SHA256 인증, 사용자 정의 헤더
- FacebookAdsIntegration: Graph API, 광고 세트 및 광고 계층

**멀티플랫폼 관리자:**
```typescript
MultiPlatformCampaignManager
  ├── registerIntegration()
  ├── deployToPlatform()
  ├── deployToAllPlatforms()
  ├── updateCampaignAcrossPlatforms()
  └── syncPerformanceMetrics()
```

#### 3. 배포 오케스트레이터 (scripts/deploy-campaigns-to-platforms.mjs)

**기능:**
1. 각 플랫폼 연결 상태 확인
2. 캠페인 파일 로드 (.output/marketing-campaigns.json)
3. 샘플 캠페인 배포 (첫 3개)
4. 각 플랫폼에서 성과 메트릭 동기화
5. 배포 리포트 생성 (.output/deployment-report.json)

**배포 리포트 내용:**
- 타임스탬프
- 총 캠페인 수
- 배포 결과 (성공/실패)
- 각 플랫폼 연결 상태
- 다음 단계

## 사용 방법

### 1. 블로그 포스트 생성

```bash
npm run gen:blog
# → lib/blog-posts.ts에 400개 포스트 생성
```

### 2. 마케팅 캠페인 생성

```bash
npm run gen:marketing
# → .output/marketing-campaigns.json 생성
# 포함 내용:
# - 캠페인 데이터 (샘플 5개)
# - A/B 테스트 설정 (5개)
# - 멀티플랫폼 예산 분배 전략
# - 마케팅 퍼널 설정
# - 최적화 규칙 (6개)
# - 성과 시뮬레이션 결과
# - 주간 리포트
```

### 3. 멀티플랫폼에 배포

```bash
# 환경 변수 설정
export GOOGLE_ADS_API_KEY="your_key"
export GOOGLE_ADS_CUSTOMER_ID="your_id"
export NAVER_ADS_API_KEY="your_key"
export NAVER_ADS_CUSTOMER_ID="your_id"
export FACEBOOK_ADS_API_KEY="your_app_id"
export FACEBOOK_BUSINESS_ACCOUNT_ID="your_id"

# 배포
npm run deploy:campaigns
# → 캠페인 배포 및 성과 동기화
# → .output/deployment-report.json 생성
```

## 성과 메트릭

### 주요 KPI

| 메트릭 | 설명 | 목표 |
|--------|------|------|
| **Impressions (노출)** | 광고 노출 수 | 월 50K+ |
| **Clicks (클릭)** | 광고 클릭 수 | 월 1.5K+ |
| **Conversions (전환)** | 실제 전환(상담, 신청) | 월 50+ |
| **CTR (클릭율)** | Clicks / Impressions | 2-5% |
| **CPC** | Cost Per Click | 2.5K-3.5K원 |
| **CPA** | Cost Per Action | 25K-35K원 |
| **ROAS** | 광고수익률 | 1.5 이상 |

### 자동 최적화 기준

```
CTR < 0.5%           → 광고 문구 개선 + A/B 테스트
CPC > maxBid * 1.5   → 입찰가 감소 (× 0.9)
ROAS > 3.0           → 예산 증가 (× 1.2)
ROAS < 1.5           → 예산 감소 (× 0.8)
전환율 < 2%          → 키워드 정제 + 제외어 추가
CPA < 목표 CPA       → 지역/키워드 확장
```

## 고급 설정

### 1. 커스텀 예산 배분

```typescript
// lib/programmatic-marketing.ts에서 조정
function generateBudget(index: number): Budget {
  if (index < 30) dailyBudget = 150000;    // 상위 30%
  else if (index < 60) dailyBudget = 80000;  // 중위 30%
  else dailyBudget = 40000;                 // 나머지
  
  return { daily: dailyBudget, monthly: dailyBudget * 30 };
}
```

### 2. 커스텀 광고 문구

```typescript
// lib/programmatic-marketing.ts에서 수정
function generateAdCopies(post: BlogPost): AdCopy[] {
  return [
    {
      headline: `${mainKeyword} 완벽 가이드`,
      description: '비용, 기간, 체크리스트까지 한눈에',
      cta: '지금 확인',
      // ...
    },
    // 추가 변형...
  ];
}
```

### 3. 타겟팅 조정

```typescript
// lib/programmatic-marketing.ts에서 수정
function generateTargeting(region: string, keywords: string[]): TargetingOptions {
  return {
    regions: [region],
    deviceTypes: ['mobile', 'desktop'],  // 모바일 중심일 경우 ['mobile']
    interests: extractInterests(keywords),
    keywords: keywords,
    excludeKeywords: ['무료', '불법', '사기'],  // 추가 제외어
  };
}
```

### 4. 자동 최적화 규칙 추가

```typescript
// lib/programmatic-marketing.ts에서 createOptimizationRules() 수정
function createOptimizationRules() {
  return {
    rules: [
      // 기존 규칙...
      {
        name: '모바일 최적화',
        condition: 'mobile_ctr < desktop_ctr',
        action: '모바일 입찰가 인상',
        implementation: 'mobileBidModifier = 1.2',
      },
    ],
  };
}
```

## 모니터링 및 리포팅

### 주간 리포트

```json
{
  "period": "2026-06-27 ~ 7days",
  "summary": {
    "totalCampaigns": 400,
    "totalSpend": 48000000,
    "totalImpressions": 48000,
    "totalClicks": 1440,
    "totalConversions": 43
  },
  "topPerformers": [
    {
      "campaignId": "campaign-5",
      "roas": 3.45,
      "conversions": 8
    }
  ],
  "recommendations": [
    "상위 성과 캠페인의 예산을 20% 증가하세요",
    "저성과 캠페인의 광고 문구를 재작성하세요",
    "A/B 테스트 결과를 바탕으로 최적의 카피 선정하세요",
    "새로운 지역에 확장 캠페인을 생성하세요"
  ]
}
```

### 성과 추적 대시보드 (예상)

```
총 예산: 48M원
├── Google: 19.2M (40%)
├── Naver: 16.8M (35%)
├── Facebook: 7.2M (15%)
└── Instagram: 4.8M (10%)

주요 지표:
├── 노출: 48,000회
├── 클릭: 1,440회
├── 전환: 43건
├── 평균 CPC: 3,000원
├── 평균 CPA: 30,000원
└── 평균 ROAS: 1.67

상위 성과 캠페인:
1. [자동] 앱개발외주 계약 - 서울 (ROAS 2.8)
2. [자동] MVP 개발 비용 - 전국 (ROAS 2.4)
3. [자동] 웹개발 외주 - 경기 (ROAS 2.1)
```

## 문제 해결

### 캠페인이 배포되지 않음
1. 환경 변수 확인: `echo $GOOGLE_ADS_API_KEY`
2. API 자격증명 유효성 확인
3. 각 플랫폼의 API 활성화 확인

### 저조한 성과 (CTR < 0.5%)
1. 광고 문구 다양화 (A/B 테스트 확인)
2. 타겟팅 재검토 (지역, 키워드)
3. 입찰가 조정 (경쟁 상황 확인)

### CPC가 너무 높음
1. 입찰 전략 변경 (CPA로 변경)
2. 경쟁 키워드 피하기
3. 예산 재분배

### 전환이 없음
1. 랜딩페이지 품질 확인
2. 전환 추적(추적 픽셀) 설정 확인
3. 광고 문구와 랜딩페이지의 일관성 검토

## 보안 및 컴플라이언스

### API 키 관리

```bash
# ❌ 절대 금지
export API_KEY="your_key"  # 쉘 히스토리에 노출

# ✅ 권장
# .env 파일 사용
GOOGLE_ADS_API_KEY=your_key
NAVER_ADS_API_KEY=your_key

# .env를 .gitignore에 추가
echo ".env" >> .gitignore
```

### 광고 정책 준수

- ✅ 모든 광고는 블로그 포스트 기반 (실제 콘텐츠)
- ✅ 오류가 없는 랜딩페이지
- ✅ 명확한 CTA (행동 유도)
- ✅ 개인정보 보호 정책 명시
- ✅ 부정확한 광고 금지

### 감사 추적

```json
// deployment-report.json에 모든 배포 기록
{
  "deploymentHistory": [
    {
      "timestamp": "2026-06-27T07:41:53.436Z",
      "campaignId": "campaign-0",
      "campaignName": "[자동] 앱 개발 비용 - 수원",
      "platform": "google",
      "success": true,
      "externalCampaignId": "google-campaign-0"
    }
  ]
}
```

## 다음 단계

### 1단계: API 통합 (1주)
- [ ] Google Ads API 키 획득 및 설정
- [ ] Naver Ads API 키 획득 및 설정
- [ ] Facebook/Instagram API 키 획득 및 설정
- [ ] 각 플랫폼 인증 테스트

### 2단계: 배포 자동화 (1주)
- [ ] 본격 캠페인 생성 (400개)
- [ ] 멀티플랫폼 배포
- [ ] 성과 메트릭 동기화

### 3단계: 모니터링 및 최적화 (지속)
- [ ] 일일 성과 확인
- [ ] 자동 최적화 규칙 적용
- [ ] 주간 리포트 생성
- [ ] 월간 성과 분석

### 4단계: 고급 기능 (월 2-4주)
- [ ] 머신러닝 기반 입찰 최적화
- [ ] 예측 분석 모델
- [ ] 크리에이티브 자동 생성
- [ ] 경쟁사 벤치마킹

## 참고 자료

- [Google Ads API 문서](https://developers.google.com/google-ads/api/docs/start)
- [Naver Ads API 문서](https://api.naver.com/docs)
- [Facebook Marketing API](https://developers.facebook.com/docs/marketing-api/)
- [PLATFORM-API-INTEGRATION.md](./PLATFORM-API-INTEGRATION.md) - API 통합 가이드
- [BLOG-AUTO-GENERATION.md](./BLOG-AUTO-GENERATION.md) - 블로그 생성 가이드
