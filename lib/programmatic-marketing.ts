// 프로그래매틱 마케팅 자동화 엔진

export interface AdCampaign {
  id: string;
  name: string;
  platform: 'google' | 'naver' | 'facebook' | 'instagram';
  keywords: string[];
  adCopy: AdCopy[];
  budget: Budget;
  targeting: TargetingOptions;
  bidStrategy: BidStrategy;
  schedule: CampaignSchedule;
  performance?: PerformanceMetrics;
}

export interface AdCopy {
  headline: string;
  description: string;
  cta: string;
  keywords: string[];
  landingUrl: string;
}

export interface Budget {
  daily: number;
  monthly: number;
  lifetime?: number;
  currency: 'KRW' | 'USD';
}

export interface TargetingOptions {
  regions: string[];
  deviceTypes: ('mobile' | 'desktop' | 'tablet')[];
  ageGroups?: string[];
  interests?: string[];
  keywords?: string[];
  excludeKeywords?: string[];
}

export interface BidStrategy {
  type: 'cpc' | 'cpm' | 'cpa' | 'auto';
  maxBid: number;
  targetCpa?: number;
  targetRoas?: number;
}

export interface CampaignSchedule {
  startDate: string;
  endDate?: string;
  daysOfWeek?: string[];
  timeSlots?: TimeSlot[];
}

export interface TimeSlot {
  startHour: number;
  endHour: number;
}

export interface PerformanceMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
  updateDate: string;
}

// 블로그 기반 광고 캠페인 자동 생성
export function generateAdCampaignsFromBlog(
  blogPosts: Array<{
    slug: string;
    title: string;
    keywords: string[];
    description: string;
    region?: string;
  }>,
  config?: Partial<AdCampaign>
): AdCampaign[] {
  return blogPosts.map((post, index) => {
    const mainKeyword = post.keywords[0];
    const region = post.region || '전국';

    return {
      id: `campaign-${post.slug}-${Date.now()}`,
      name: `[자동] ${mainKeyword} - ${region}`,
      platform: selectPlatform(region),
      keywords: post.keywords,
      adCopy: generateAdCopies(post),
      budget: generateBudget(index),
      targeting: generateTargeting(region, post.keywords),
      bidStrategy: generateBidStrategy(post.keywords),
      schedule: generateSchedule(),
      ...config,
    };
  });
}

// 플랫폼 자동 선택 (지역 기반)
function selectPlatform(region: string): AdCampaign['platform'] {
  const koreanPlatformRegions = ['수원', '서울', '경기', '인천', '부산', '대구', '대전', '전국'];

  if (koreanPlatformRegions.includes(region)) {
    return Math.random() > 0.5 ? 'naver' : 'google';
  }
  return 'google';
}

// 광고 문구 자동 생성
function generateAdCopies(post: {
  title: string;
  keywords: string[];
  description: string;
}): AdCopy[] {
  const mainKeyword = post.keywords[0];
  const secondKeyword = post.keywords[1] || '가이드';

  return [
    {
      headline: `${mainKeyword} ${secondKeyword} | 2026 최신 정보`,
      description: post.description,
      cta: '상담받기',
      keywords: post.keywords,
      landingUrl: `/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`,
    },
    {
      headline: `${mainKeyword} 완벽 정리 | 비용·기간·체크리스트`,
      description: `${post.keywords.slice(0, 3).join(', ')}를 한눈에 비교해보세요.`,
      cta: '무료 상담',
      keywords: post.keywords,
      landingUrl: `/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`,
    },
    {
      headline: `${mainKeyword} 외주 완벽 가이드`,
      description: `${post.description.slice(0, 80)}...실패 예방부터 선택 기준까지.`,
      cta: '지금 확인',
      keywords: post.keywords,
      landingUrl: `/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`,
    },
  ];
}

// 예산 자동 배분
function generateBudget(index: number): Budget {
  // 상위 30%의 포스트에 더 많은 예산 배분
  const tier = index % 100;
  let dailyBudget = 30000; // 기본 30,000원

  if (tier < 30) {
    dailyBudget = 100000; // 상위: 100,000원
  } else if (tier < 60) {
    dailyBudget = 50000; // 중위: 50,000원
  }

  return {
    daily: dailyBudget,
    monthly: dailyBudget * 30,
    currency: 'KRW',
  };
}

// 타겟팅 옵션 생성
function generateTargeting(
  region: string,
  keywords: string[]
): TargetingOptions {
  return {
    regions: [region],
    deviceTypes: ['mobile', 'desktop'],
    interests: extractInterests(keywords),
    keywords: keywords,
    excludeKeywords: ['무료', '불법', '사기'],
  };
}

// 키워드에서 관심사 추출
function extractInterests(keywords: string[]): string[] {
  const interestMap: Record<string, string[]> = {
    '앱': ['앱개발', '프로그래밍', '기술'],
    '개발': ['개발', '프로그래밍', '기술', '소프트웨어'],
    '디자인': ['디자인', '창의성', '마케팅'],
    '마케팅': ['마케팅', '사업', '디지털'],
    '비용': ['사업', '투자', '예산'],
  };

  const interests: Set<string> = new Set();

  keywords.forEach((keyword) => {
    Object.entries(interestMap).forEach(([key, values]) => {
      if (keyword.includes(key)) {
        values.forEach((v) => interests.add(v));
      }
    });
  });

  return Array.from(interests);
}

// 입찰 전략 자동 생성
function generateBidStrategy(keywords: string[]): BidStrategy {
  // 경쟁력 있는 키워드는 ROAS 기반, 약한 키워드는 CPC 기반
  const competitorKeywords = ['앱 개발', '웹 개발', '외주'];
  const isCompetitive = keywords.some((k) =>
    competitorKeywords.some((c) => k.includes(c))
  );

  if (isCompetitive) {
    return {
      type: 'cpa',
      maxBid: 50000,
      targetCpa: 30000,
    };
  }

  return {
    type: 'cpc',
    maxBid: 3000,
  };
}

// 캠페인 일정 생성
function generateSchedule(): CampaignSchedule {
  return {
    startDate: new Date().toISOString().split('T')[0],
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], // 평일 중심
    timeSlots: [
      { startHour: 9, endHour: 12 },
      { startHour: 14, endHour: 18 },
    ],
  };
}

// A/B 테스트 설정 생성
export interface ABTestConfig {
  controlGroup: AdCopy;
  variantGroups: AdCopy[];
  splitPercentage: number; // 각 그룹별 트래픽 비율
  duration: number; // 일수
  successMetric: 'ctr' | 'cpc' | 'cpa' | 'roas';
  confidenceLevel: number; // 0.9, 0.95, 0.99
}

export function createABTestConfig(
  adCopy: AdCopy[],
  config?: Partial<ABTestConfig>
): ABTestConfig {
  return {
    controlGroup: adCopy[0],
    variantGroups: adCopy.slice(1),
    splitPercentage: 50,
    duration: 14,
    successMetric: 'ctr',
    confidenceLevel: 0.95,
    ...config,
  };
}

// 성과 기반 자동 최적화
export function optimizeCampaign(
  campaign: AdCampaign,
  metrics: PerformanceMetrics
): Partial<AdCampaign> {
  const optimizations: Partial<AdCampaign> = {};

  // CTR 기반 최적화
  if (metrics.ctr < 0.5) {
    optimizations.adCopy = campaign.adCopy.map((copy) => ({
      ...copy,
      headline: improveHeadline(copy.headline),
      cta: selectBetterCTA(copy.keywords),
    }));
  }

  // CPC 기반 입찰가 조정
  if (metrics.cpc > (campaign.bidStrategy.maxBid || 5000)) {
    optimizations.bidStrategy = {
      ...campaign.bidStrategy,
      maxBid: Math.max(campaign.bidStrategy.maxBid || 3000, metrics.cpc * 0.8),
    };
  }

  // 예산 조정 (ROAS 기반)
  if (metrics.roas > 3) {
    // 좋은 성과면 예산 증가
    optimizations.budget = {
      ...campaign.budget,
      daily: campaign.budget.daily * 1.2,
      monthly: campaign.budget.daily * 1.2 * 30,
    };
  } else if (metrics.roas < 1.5) {
    // 나쁜 성과면 예산 감소
    optimizations.budget = {
      ...campaign.budget,
      daily: campaign.budget.daily * 0.8,
      monthly: campaign.budget.daily * 0.8 * 30,
    };
  }

  return optimizations;
}

// 헤드라인 개선
function improveHeadline(originalHeadline: string): string {
  const improvements = [
    (h: string) => `[한정] ${h}`,
    (h: string) => `${h} | 전문가 가이드`,
    (h: string) => `${h} | 2026 최신`,
    (h: string) => `무료 ${h}`,
    (h: string) => `${h} | 지금 확인`,
  ];

  const improvement = improvements[Math.floor(Math.random() * improvements.length)];
  return improvement(originalHeadline);
}

// CTA 최적화
function selectBetterCTA(keywords: string[]): string {
  const ctas = [
    '무료 상담받기',
    '지금 확인',
    '견적받기',
    '자세히 보기',
    '지금 신청',
    '전문가와 상담',
    '시작하기',
  ];

  if (keywords.some((k) => k.includes('외주'))) {
    return '견적받기';
  }
  if (keywords.some((k) => k.includes('비용'))) {
    return '가격 확인';
  }

  return ctas[Math.floor(Math.random() * ctas.length)];
}

// 캠페인 성과 시뮬레이션
export function simulateCampaignPerformance(
  campaign: AdCampaign,
  daysRunning: number = 30
): PerformanceMetrics {
  const baseImpressions = Math.floor(campaign.budget.monthly / 1000); // 예상 노출수
  const expectedCTR = campaign.platform === 'naver' ? 0.8 : 0.6; // 플랫폼별 기본 CTR
  const expectedConversionRate = 0.03; // 3% 전환율

  const impressions = Math.floor(baseImpressions * (daysRunning / 30));
  const clicks = Math.floor(impressions * (expectedCTR / 100));
  const conversions = Math.floor(clicks * expectedConversionRate);
  const spend = campaign.budget.daily * daysRunning;
  const cpc = spend / Math.max(clicks, 1);
  const cpa = spend / Math.max(conversions, 1);
  const roas = conversions * 500000 / spend; // 평균 구매가 500,000원 가정

  return {
    impressions,
    clicks,
    conversions,
    spend,
    ctr: (clicks / impressions) * 100,
    cpc,
    cpa,
    roas,
    updateDate: new Date().toISOString(),
  };
}

// 멀티플랫폼 광고 분산 전략
export interface MultiPlatformStrategy {
  totalBudget: number;
  platforms: {
    google: number; // 비율
    naver: number;
    facebook: number;
    instagram: number;
  };
}

export function createMultiPlatformStrategy(
  totalMonthlyBudget: number,
  targetAudience?: {
    region?: string;
    ageGroup?: string;
    deviceType?: string;
  }
): MultiPlatformStrategy {
  // 기본 분산 전략: 구글 40%, 네이버 35%, 소셜 25%
  let distribution = {
    google: 0.4,
    naver: 0.35,
    facebook: 0.15,
    instagram: 0.1,
  };

  // 지역에 따른 조정
  if (targetAudience?.region === '전국' || !targetAudience?.region) {
    distribution.google = 0.45; // 구글 강화
    distribution.naver = 0.35;
  } else {
    distribution.naver = 0.4; // 네이버 강화
    distribution.google = 0.35;
  }

  // 모바일 기반 조정
  if (targetAudience?.deviceType === 'mobile') {
    distribution.facebook = 0.2;
    distribution.instagram = 0.15;
  }

  return {
    totalBudget: totalMonthlyBudget,
    platforms: {
      google: Math.floor(totalMonthlyBudget * distribution.google),
      naver: Math.floor(totalMonthlyBudget * distribution.naver),
      facebook: Math.floor(totalMonthlyBudget * distribution.facebook),
      instagram: Math.floor(totalMonthlyBudget * distribution.instagram),
    },
  };
}

// 마케팅 퍼널 자동화
export interface MarketingFunnel {
  awareness: Campaign;
  consideration: Campaign;
  decision: Campaign;
  retention: Campaign;
}

export interface Campaign {
  name: string;
  objective: string;
  budget: number;
  messaging: string;
  channels: string[];
}

export function createMarketingFunnel(
  totalBudget: number,
  product: string
): MarketingFunnel {
  return {
    awareness: {
      name: `${product} 인지도 구축`,
      objective: '광범위한 노출 및 관심 유도',
      budget: Math.floor(totalBudget * 0.3),
      messaging: `${product}, 알면 다릅니다`,
      channels: ['Google Display', 'Naver', 'Instagram'],
    },
    consideration: {
      name: `${product} 검토 단계`,
      objective: '구체적인 정보 제공 및 비교',
      budget: Math.floor(totalBudget * 0.3),
      messaging: `${product} vs 다른 솔루션`,
      channels: ['Google Search', 'Naver Search', 'Facebook'],
    },
    decision: {
      name: `${product} 전환 촉진`,
      objective: '구매 의사결정 지원',
      budget: Math.floor(totalBudget * 0.25),
      messaging: `지금 결정하세요 - 특별 혜택`,
      channels: ['Google Shopping', 'Remarketing', 'Email'],
    },
    retention: {
      name: `${product} 고객 유지`,
      objective: '재구매 및 충성도 강화',
      budget: Math.floor(totalBudget * 0.15),
      messaging: `고객님을 위한 특별 제안`,
      channels: ['Email', 'SMS', 'Facebook'],
    },
  };
}
