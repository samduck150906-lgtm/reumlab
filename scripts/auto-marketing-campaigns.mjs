#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 블로그 포스트 데이터 (시뮬레이션)
function getBlogPosts() {
  const topics = [
    { main: '앱 개발', subs: ['비용', '기간', '견적'] },
    { main: '홈페이지 제작', subs: ['비용', 'SEO', '견적'] },
    { main: '웹개발', subs: ['비용', '학원', '외주'] },
  ];

  const regions = ['수원', '서울', '경기'];
  const posts = [];

  topics.forEach((t) => {
    t.subs.forEach((sub) => {
      regions.forEach((region) => {
        posts.push({
          slug: `${t.main.toLowerCase()}-${sub.toLowerCase()}-${region.toLowerCase()}`,
          title: `${t.main} ${sub}: ${region}`,
          keywords: [`${t.main} ${sub}`, `${region} ${t.main}`, `${t.main} ${sub} 비용`],
          description: `${region}에서 ${t.main}을 ${sub}하는 완벽 가이드. 비용, 기간, 체크리스트까지.`,
          region,
        });
      });
    });
  });

  return posts;
}

// 광고 캠페인 자동 생성
function generateCampaigns(posts) {
  const campaigns = [];

  posts.forEach((post, idx) => {
    const platform = idx % 2 === 0 ? 'google' : 'naver';
    const mainKeyword = post.keywords[0];

    campaigns.push({
      id: `campaign-${idx}`,
      name: `[자동] ${mainKeyword} - ${post.region}`,
      platform,
      keywords: post.keywords,
      adCopies: [
        {
          headline: `${mainKeyword} | 2026 최신 정보`,
          description: post.description,
          cta: '상담받기',
        },
        {
          headline: `${mainKeyword} 완벽 정리`,
          description: `비용, 기간, 체크리스트 한눈에`,
          cta: '무료 상담',
        },
        {
          headline: `${mainKeyword} 외주 가이드`,
          description: `실패 예방부터 선택 기준까지`,
          cta: '지금 확인',
        },
      ],
      budget: {
        daily: idx < 5 ? 100000 : 50000,
        monthly: (idx < 5 ? 100000 : 50000) * 30,
        currency: 'KRW',
      },
      targeting: {
        regions: [post.region],
        devices: ['mobile', 'desktop'],
        keywords: post.keywords,
      },
      bidStrategy: {
        type: post.keywords.some((k) => k.includes('외주')) ? 'cpa' : 'cpc',
        maxBid: post.keywords.some((k) => k.includes('외주')) ? 50000 : 3000,
      },
      schedule: {
        startDate: new Date().toISOString().split('T')[0],
        daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        timeSlots: [
          { start: 9, end: 12 },
          { start: 14, end: 18 },
        ],
      },
    });
  });

  return campaigns;
}

// A/B 테스트 설정 생성
function createABTests(campaigns) {
  return campaigns.map((campaign, idx) => ({
    campaignId: campaign.id,
    testName: `AB_Test_${idx}`,
    controlGroup: {
      name: 'Control',
      adCopy: campaign.adCopies[0],
      percentage: 50,
    },
    variantGroups: [
      {
        name: 'Variant A',
        adCopy: campaign.adCopies[1],
        percentage: 25,
      },
      {
        name: 'Variant B',
        adCopy: campaign.adCopies[2],
        percentage: 25,
      },
    ],
    duration: 14,
    successMetric: 'ctr',
    expectedOutcome: {
      ctr: 0.8,
      cpc: 2500,
      conversions: 10,
    },
  }));
}

// 성과 시뮬레이션
function simulatePerformance(campaign) {
  const baseImpressions = Math.floor(campaign.budget.monthly / 1000);
  const expectedCTR = campaign.platform === 'naver' ? 0.8 : 0.6;
  const conversions = Math.floor((baseImpressions * (expectedCTR / 100)) * 0.03);

  return {
    campaignId: campaign.id,
    period: '30일',
    metrics: {
      impressions: baseImpressions,
      clicks: Math.floor(baseImpressions * (expectedCTR / 100)),
      conversions,
      spend: campaign.budget.monthly,
      ctr: expectedCTR,
      cpc: Math.floor(campaign.budget.monthly / Math.max(baseImpressions * (expectedCTR / 100), 1)),
      cpa: Math.floor(campaign.budget.monthly / Math.max(conversions, 1)),
      roas: (conversions * 500000) / campaign.budget.monthly,
    },
  };
}

// 멀티플랫폼 예산 분배
function createMultiPlatformStrategy(totalBudget) {
  return {
    totalMonthlyBudget: totalBudget,
    distribution: {
      google: Math.floor(totalBudget * 0.4),
      naver: Math.floor(totalBudget * 0.35),
      facebook: Math.floor(totalBudget * 0.15),
      instagram: Math.floor(totalBudget * 0.1),
    },
    allocation: {
      awareness: Math.floor(totalBudget * 0.3),
      consideration: Math.floor(totalBudget * 0.3),
      decision: Math.floor(totalBudget * 0.25),
      retention: Math.floor(totalBudget * 0.15),
    },
  };
}

// 마케팅 퍼널 설정
function createMarketingFunnel(totalBudget) {
  return {
    awareness: {
      name: '인지도 구축',
      objective: '광범위한 노출 및 관심 유도',
      budget: Math.floor(totalBudget * 0.3),
      channels: ['Google Display', 'Naver', 'Instagram'],
      messaging: '앱 개발·웹 개발, 알면 다릅니다',
    },
    consideration: {
      name: '검토 단계',
      objective: '구체적 정보 제공 및 비교',
      budget: Math.floor(totalBudget * 0.3),
      channels: ['Google Search', 'Naver Search'],
      messaging: '우리 vs 경쟁사',
    },
    decision: {
      name: '전환 촉진',
      objective: '구매 의사결정 지원',
      budget: Math.floor(totalBudget * 0.25),
      channels: ['Google Search', 'Remarketing'],
      messaging: '지금 결정하세요 - 특별 혜택',
    },
    retention: {
      name: '고객 유지',
      objective: '재구매 및 충성도 강화',
      budget: Math.floor(totalBudget * 0.15),
      channels: ['Email', 'SMS'],
      messaging: '고객님을 위한 특별 제안',
    },
  };
}

// 자동 최적화 규칙
function createOptimizationRules() {
  return {
    rules: [
      {
        name: 'CTR 기반 최적화',
        condition: 'ctr < 0.5%',
        action: '광고 문구 개선 또는 예산 감소',
        implementation: '새 헤드라인 생성 및 A/B 테스트',
      },
      {
        name: 'CPC 기반 입찰 조정',
        condition: 'actual_cpc > max_bid',
        action: '최대 입찰가 감소',
        implementation: 'maxBid *= 0.9',
      },
      {
        name: '좋은 성과 예산 증가',
        condition: 'roas > 3.0',
        action: '일일 예산 증가',
        implementation: 'dailyBudget *= 1.2',
      },
      {
        name: '나쁜 성과 예산 감소',
        condition: 'roas < 1.5',
        action: '일일 예산 감소',
        implementation: 'dailyBudget *= 0.8',
      },
      {
        name: '타겟팅 개선',
        condition: '전환율 < 2%',
        action: '타겟팅 키워드 정제',
        implementation: '제외 키워드 추가',
      },
      {
        name: 'CPA 기반 확장',
        condition: 'actual_cpa < target_cpa',
        action: '예산 확대 및 지역 확장',
        implementation: '새 지역 추가 캠페인 생성',
      },
    ],
  };
}

// 주간 리포트 생성
function generateWeeklyReport(campaigns, performanceData) {
  const report = {
    period: `${new Date().toISOString().split('T')[0]} ~ 7days`,
    summary: {
      totalCampaigns: campaigns.length,
      totalSpend: campaigns.reduce((sum, c) => sum + (c.budget.daily * 7), 0),
      totalImpressions: performanceData.reduce((sum, p) => sum + p.metrics.impressions, 0),
      totalClicks: performanceData.reduce((sum, p) => sum + p.metrics.clicks, 0),
      totalConversions: performanceData.reduce((sum, p) => sum + p.metrics.conversions, 0),
    },
    topPerformers: performanceData
      .sort((a, b) => b.metrics.roas - a.metrics.roas)
      .slice(0, 5)
      .map((p) => ({
        campaignId: p.campaignId,
        roas: p.metrics.roas.toFixed(2),
        conversions: p.metrics.conversions,
      })),
    recommendations: [
      '상위 성과 캠페인의 예산을 20% 증가하세요',
      '저성과 캠페인의 광고 문구를 재작성하세요',
      'A/B 테스트 결과를 바탕으로 최적의 카피 선정하세요',
      '새로운 지역에 확장 캠페인을 생성하세요',
    ],
  };

  return report;
}

function main() {
  console.log('🚀 프로그래매틱 마케팅 자동화 시스템 시작\n');

  // 1. 블로그 포스트 기반 캠페인 생성
  const blogPosts = getBlogPosts();
  console.log(`📝 블로그 포스트: ${blogPosts.length}개`);

  const campaigns = generateCampaigns(blogPosts);
  console.log(`📊 광고 캠페인 생성: ${campaigns.length}개\n`);

  // 2. A/B 테스트 생성
  const abTests = createABTests(campaigns);
  console.log(`🧪 A/B 테스트 설정: ${abTests.length}개`);

  // 3. 성과 시뮬레이션
  const performanceData = campaigns.map((c) => simulatePerformance(c));
  const totalSpend = performanceData.reduce((sum, p) => sum + p.metrics.spend, 0);
  const totalConversions = performanceData.reduce((sum, p) => sum + p.metrics.conversions, 0);
  console.log(`💰 예상 월간 예산: ${(totalSpend / 1000000).toFixed(1)}M원`);
  console.log(`🎯 예상 월간 전환: ${totalConversions}개\n`);

  // 4. 멀티플랫폼 전략
  const multiPlatform = createMultiPlatformStrategy(totalSpend);
  console.log('📱 멀티플랫폼 예산 분배:');
  console.log(`   Google: ${(multiPlatform.distribution.google / 1000000).toFixed(1)}M원`);
  console.log(`   Naver: ${(multiPlatform.distribution.naver / 1000000).toFixed(1)}M원`);
  console.log(`   Facebook: ${(multiPlatform.distribution.facebook / 1000000).toFixed(1)}M원`);
  console.log(`   Instagram: ${(multiPlatform.distribution.instagram / 1000000).toFixed(1)}M원\n`);

  // 5. 마케팅 퍼널
  const funnel = createMarketingFunnel(totalSpend);
  console.log('🔄 마케팅 퍼널 예산 분배:');
  console.log(`   인지도 (30%): ${(funnel.awareness.budget / 1000000).toFixed(1)}M원`);
  console.log(`   검토 (30%): ${(funnel.consideration.budget / 1000000).toFixed(1)}M원`);
  console.log(`   전환 (25%): ${(funnel.decision.budget / 1000000).toFixed(1)}M원`);
  console.log(`   유지 (15%): ${(funnel.retention.budget / 1000000).toFixed(1)}M원\n`);

  // 6. 자동 최적화 규칙
  const optimizationRules = createOptimizationRules();
  console.log(`⚙️  자동 최적화 규칙: ${optimizationRules.rules.length}개`);

  // 7. 주간 리포트
  const weeklyReport = generateWeeklyReport(campaigns, performanceData);
  console.log(`\n📈 주간 성과 리포트:`);
  console.log(`   총 노출: ${(weeklyReport.summary.totalImpressions / 1000).toFixed(0)}K`);
  console.log(`   총 클릭: ${weeklyReport.summary.totalClicks.toFixed(0)}`);
  console.log(`   총 전환: ${weeklyReport.summary.totalConversions}`);

  // JSON 파일로 저장
  const output = {
    timestamp: new Date().toISOString(),
    campaigns: campaigns.slice(0, 5), // 샘플
    abTests: abTests.slice(0, 5),
    multiPlatform,
    funnel,
    optimization: optimizationRules,
    performance: performanceData.slice(0, 5),
    weeklyReport,
  };

  const outputPath = path.join(__dirname, '../.output/marketing-campaigns.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`\n✅ 마케팅 캠페인 자동 생성 완료!`);
  console.log(`📄 결과 저장: ${outputPath}`);
  console.log(`\n🎯 다음 단계:`);
  console.log(`   1. Google Ads API 연동`);
  console.log(`   2. Naver Ads API 연동`);
  console.log(`   3. Facebook Ads API 연동`);
  console.log(`   4. 자동 입찰 및 예산 관리`);
  console.log(`   5. 성과 추적 및 리포팅`);
}

main();
