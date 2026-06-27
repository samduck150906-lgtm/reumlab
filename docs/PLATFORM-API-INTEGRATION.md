# 광고 플랫폼 API 통합 가이드

## 개요

이 가이드는 Google Ads, Naver Ads, Facebook/Instagram Ads API를 프로그래매틱 마케팅 시스템에 통합하는 방법을 설명합니다.

## 아키텍처

```
programmatic-marketing.ts
    ↓
ad-platform-integrations.ts (API 추상화 계층)
    ├── GoogleAdsIntegration
    ├── NaverAdsIntegration
    └── FacebookAdsIntegration
        ↓
deploy-campaigns-to-platforms.mjs (배포 오케스트레이션)
```

## 1. Google Ads API 통합

### 1.1 사전 요구사항

- Google Cloud 프로젝트 생성
- Google Ads API 활성화
- OAuth 2.0 클라이언트 ID 및 시크릿 생성
- Google Ads 계정의 Customer ID 확인

### 1.2 환경 설정

```bash
export GOOGLE_ADS_API_KEY="YOUR_API_KEY"
export GOOGLE_ADS_API_SECRET="YOUR_API_SECRET"
export GOOGLE_ADS_CUSTOMER_ID="YOUR_CUSTOMER_ID"
export GOOGLE_ADS_REFRESH_TOKEN="YOUR_REFRESH_TOKEN"
```

### 1.3 인증 흐름

```typescript
// 1단계: OAuth 2.0 토큰 획득
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?
  client_id=${GOOGLE_ADS_API_KEY}
  &redirect_uri=http://localhost:3000/callback
  &response_type=code
  &scope=https://www.googleapis.com/auth/adwords`;

// 2단계: Access Token 획득
const accessToken = await getAccessToken(refreshToken);

// 3단계: API 호출
const response = await fetch(`https://googleads.googleapis.com/v14/customers/${customerId}/campaigns`, {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'developer-token': GOOGLE_ADS_DEVELOPER_TOKEN,
  },
});
```

### 1.4 실제 API 호출 예제

```typescript
async createCampaign(campaign: AdCampaign): Promise<CampaignCreateResponse> {
  const operations = [{
    create: {
      name: campaign.name,
      status: 'ENABLED',
      advertisingChannelType: 'SEARCH',
      campaignBudget: {
        amountMicros: campaign.budget.daily * 1000000,
        deliveryMethod: 'STANDARD',
      },
      biddingStrategyType: 'MANUAL_CPC',
      startDate: campaign.schedule.startDate,
    }
  }];

  const response = await fetch(
    `https://googleads.googleapis.com/v14/customers/${this.config.customerId}/campaigns:mutate`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'developer-token': this.developerToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mutateOperations: operations }),
    }
  );

  const result = await response.json();
  return {
    success: result.results?.length > 0,
    campaignId: result.results?.[0]?.resourceName,
  };
}
```

### 1.5 GAQL (Google Ads Query Language) 사용

```typescript
async getPerformanceMetrics(campaignId: string, dateRange: { startDate: string; endDate: string }) {
  const query = `
    SELECT campaign.id, campaign.name, metrics.impressions, metrics.clicks,
           metrics.conversions, metrics.cost_micros
    FROM campaign
    WHERE campaign.id = '${campaignId}'
    AND segments.date BETWEEN '${dateRange.startDate}' AND '${dateRange.endDate}'
  `;

  const response = await fetch(
    `https://googleads.googleapis.com/v14/customers/${this.config.customerId}/googleAds:search`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'developer-token': this.developerToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    }
  );

  const rows = await response.json();
  const metrics = rows[0]?.metrics || {};
  
  return {
    success: true,
    metrics: {
      impressions: metrics.impressions || 0,
      clicks: metrics.clicks || 0,
      conversions: metrics.conversions || 0,
      spend: (metrics.costMicros || 0) / 1000000,
      // 추가 계산...
    }
  };
}
```

## 2. Naver Ads API 통합

### 2.1 사전 요구사항

- Naver Ads API 가입
- API Key 및 Secret Key 발급
- Naver Ads 계정의 Customer ID 확인

### 2.2 환경 설정

```bash
export NAVER_ADS_API_KEY="YOUR_API_KEY"
export NAVER_ADS_API_SECRET="YOUR_API_SECRET"
export NAVER_ADS_CUSTOMER_ID="YOUR_CUSTOMER_ID"
```

### 2.3 인증 방식

Naver Ads API는 HTTP Authorization Header를 사용합니다.

```typescript
import crypto from 'crypto';

function generateAuthHeader(method: string, endpoint: string, apiKey: string, apiSecret: string) {
  const timestamp = Date.now();
  const message = `${method} ${endpoint} ${timestamp}`;
  
  const hmac = crypto
    .createHmac('sha256', apiSecret)
    .update(message)
    .digest('base64');
  
  return {
    'X-API-KEY': apiKey,
    'X-Timestamp': timestamp.toString(),
    'X-Signature': hmac,
  };
}
```

### 2.4 실제 API 호출 예제

```typescript
async createCampaign(campaign: AdCampaign): Promise<CampaignCreateResponse> {
  const endpoint = `/ncc/api/v1/campaigns`;
  const payload = {
    name: campaign.name,
    type: 'SEARCH',
    dailyBudget: campaign.budget.daily,
    deliveryMethod: 'BALANCED',
    status: 'ACTIVE',
  };

  const headers = generateAuthHeader('POST', endpoint, this.config.apiKey, this.config.apiSecret);

  const response = await fetch(`https://api.naver.com${endpoint}`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  return {
    success: result.code === '00',
    campaignId: result.data?.campaignId,
  };
}
```

### 2.5 성과 데이터 조회

```typescript
async getPerformanceMetrics(campaignId: string, dateRange: { startDate: string; endDate: string }) {
  const endpoint = `/ncc/api/v1/campaigns/${campaignId}/stats`;
  const params = new URLSearchParams({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    statGb: 'PERIOD_STAT',
  });

  const headers = generateAuthHeader('GET', `${endpoint}?${params}`, this.config.apiKey, this.config.apiSecret);

  const response = await fetch(`https://api.naver.com${endpoint}?${params}`, {
    method: 'GET',
    headers,
  });

  const result = await response.json();
  const stat = result.data?.[0] || {};

  return {
    success: true,
    metrics: {
      impressions: stat.impsCnt || 0,
      clicks: stat.clkCnt || 0,
      conversions: stat.cnvCnt || 0,
      spend: stat.spenAmt || 0,
      ctr: stat.ctr || 0,
      cpc: stat.avgCpc || 0,
    }
  };
}
```

## 3. Facebook/Instagram Ads API 통합

### 3.1 사전 요구사항

- Facebook Business Manager 계정
- App 생성 및 Facebook Ads API 활성화
- Business Account ID 확인
- Long-lived Access Token 생성

### 3.2 환경 설정

```bash
export FACEBOOK_ADS_API_KEY="YOUR_APP_ID"
export FACEBOOK_ADS_API_SECRET="YOUR_APP_SECRET"
export FACEBOOK_BUSINESS_ACCOUNT_ID="YOUR_BUSINESS_ACCOUNT_ID"
export FACEBOOK_ACCESS_TOKEN="YOUR_ACCESS_TOKEN"
```

### 3.3 인증 방식

```typescript
// Access Token 갱신
async refreshAccessToken(appId: string, appSecret: string, currentToken: string) {
  const response = await fetch(
    `https://graph.instagram.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${currentToken}`
  );
  
  const data = await response.json();
  return data.access_token; // 새로운 long-lived token
}
```

### 3.4 실제 API 호출 예제

```typescript
async createCampaign(campaign: AdCampaign): Promise<CampaignCreateResponse> {
  const payload = {
    name: campaign.name,
    objective: 'CONVERSIONS',
    status: 'PAUSED', // 검토 후 활성화
    special_ad_categories: [],
  };

  const response = await fetch(
    `https://graph.facebook.com/v18.0/act_${this.config.businessAccountId}/campaigns`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();
  return {
    success: !!result.id,
    campaignId: result.id,
  };
}
```

### 3.5 광고 세트 및 광고 생성

```typescript
async createAdSet(campaignId: string, adSet: any) {
  const payload = {
    name: adSet.name,
    campaign_id: campaignId,
    daily_budget: adSet.budget.daily * 100, // 센트 단위
    billing_event: 'IMPRESSIONS',
    optimization_goal: 'CONVERSIONS',
    status: 'PAUSED',
    targeting: {
      geo_locations: {
        regions: adSet.targeting.regions.map(r => ({ key: r })),
      },
      facebook_positions: ['feed'],
      instagram_positions: ['stream', 'explore'],
    },
  };

  const response = await fetch(
    `https://graph.facebook.com/v18.0/act_${this.config.businessAccountId}/adsets`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  return await response.json();
}
```

### 3.6 성과 데이터 조회

```typescript
async getPerformanceMetrics(campaignId: string, dateRange: { startDate: string; endDate: string }) {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${campaignId}/insights?fields=impressions,clicks,actions,spend&time_range={"since":"${dateRange.startDate}","until":"${dateRange.endDate}"}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
      },
    }
  );

  const result = await response.json();
  const data = result.data?.[0] || {};

  return {
    success: true,
    metrics: {
      impressions: data.impressions || 0,
      clicks: data.clicks || 0,
      conversions: data.actions?.filter(a => a.action_type === 'offsite_conversion.fb_pixel_purchase').length || 0,
      spend: data.spend || 0,
      // 추가 계산...
    }
  };
}
```

## 4. 멀티플랫폼 배포 방법

### 4.1 환경 변수 설정

```bash
# .env.local 또는 shell 환경에 설정
export GOOGLE_ADS_API_KEY="your_google_key"
export NAVER_ADS_API_KEY="your_naver_key"
export FACEBOOK_ADS_API_KEY="your_facebook_app_id"

# 실행
npm run deploy:campaigns
```

### 4.2 TypeScript 코드 사용

```typescript
import { 
  GoogleAdsIntegration, 
  NaverAdsIntegration, 
  FacebookAdsIntegration,
  MultiPlatformCampaignManager 
} from './lib/ad-platform-integrations';

const manager = new MultiPlatformCampaignManager();

// 플랫폼 등록
manager.registerIntegration(
  'google',
  new GoogleAdsIntegration({
    apiKey: process.env.GOOGLE_ADS_API_KEY,
    customerId: process.env.GOOGLE_ADS_CUSTOMER_ID,
    accessToken: process.env.GOOGLE_ADS_ACCESS_TOKEN,
  })
);

manager.registerIntegration(
  'naver',
  new NaverAdsIntegration({
    apiKey: process.env.NAVER_ADS_API_KEY,
    customerId: process.env.NAVER_ADS_CUSTOMER_ID,
    apiSecret: process.env.NAVER_ADS_API_SECRET,
  })
);

// 캠페인 배포
const campaign = {/* ... */};
const results = await manager.deployToAllPlatforms(campaign);

results.forEach(({ platform, response }) => {
  console.log(`${platform}: ${response.success ? '성공' : '실패'}`);
});
```

## 5. 자동 성과 모니터링

### 5.1 정기적 메트릭 동기화

```typescript
// 매일 자정에 실행
import cron from 'node-cron';

cron.schedule('0 0 * * *', async () => {
  const campaigns = loadCampaigns();
  const dateRange = {
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  };

  for (const campaign of campaigns) {
    const metrics = await manager.syncPerformanceMetrics(campaign.id, dateRange);
    
    // DB에 저장
    await saveCampaignMetrics(campaign.id, metrics);
    
    // 최적화 규칙 적용
    if (shouldOptimize(metrics)) {
      await applyOptimizations(campaign, metrics);
    }
  }
});
```

### 5.2 성과 기반 자동 최적화

```typescript
function shouldOptimize(metrics) {
  return (
    metrics.ctr < 0.5 ||  // 낮은 클릭율
    metrics.cpc > 5000 ||  // 높은 클릭당 비용
    metrics.roas < 1.5 ||  // 낮은 광고 지출 수익
    metrics.conversions === 0  // 전환 없음
  );
}

async function applyOptimizations(campaign, metrics) {
  const optimizations = optimizeCampaign(campaign, metrics);
  
  for (const [platform, integration] of Object.entries(this.integrations)) {
    const optimizedCampaign = { ...campaign, ...optimizations };
    await integration.updateCampaign(optimizedCampaign);
  }
}
```

## 6. 에러 처리 및 재시도

```typescript
async function callWithRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = Math.pow(2, i) * 1000; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// 사용
const result = await callWithRetry(
  () => integration.createCampaign(campaign),
  3
);
```

## 7. 요금 최적화

### 7.1 API 호출 최소화

```typescript
// ❌ 나쁜 예: 매번 API 호출
for (const campaign of campaigns) {
  const metrics = await getMetrics(campaign.id); // 400+ API 호출
}

// ✅ 좋은 예: 배치 API 호출
const metricsMap = await getBatchMetrics(campaigns.map(c => c.id)); // 1-2 API 호출
```

### 7.2 캐싱 전략

```typescript
const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1시간

async function getCachedMetrics(campaignId) {
  const cached = cache.get(campaignId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = await getMetrics(campaignId);
  cache.set(campaignId, { data, timestamp: Date.now() });
  return data;
}
```

## 8. 문제 해결

### 인증 오류
- Access Token이 만료되었는지 확인
- Refresh Token으로 새로운 Access Token 획득
- API Key 및 Secret이 올바른지 확인

### Rate Limiting
- API 호출 속도 제한 준수
- 지수 백오프(exponential backoff) 사용
- 배치 API 활용 (가능한 경우)

### 캠페인 검수 대기
- Facebook/Instagram: 캠페인이 자동으로 검수됨 (24-48시간)
- 이 기간에는 PAUSED 상태로 생성 후 자동 활성화 대기

## 9. 다음 단계

1. **실제 API 키 설정**: 각 플랫폼의 실제 API 자격증명 입력
2. **자동 모니터링 구성**: 정기적인 메트릭 동기화
3. **최적화 엔진 활성화**: 성과 기반 자동 최적화
4. **레포팅 시스템**: 주간/월간 성과 리포트 자동화
5. **머신러닝 통합**: 예측 기반 입찰 최적화

## 참고 자료

- [Google Ads API 문서](https://developers.google.com/google-ads/api/docs/start)
- [Naver Ads API 문서](https://api.naver.com/docs)
- [Facebook Marketing API 문서](https://developers.facebook.com/docs/marketing-api/)
