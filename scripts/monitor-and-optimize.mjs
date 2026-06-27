#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 성과 최적화 및 모니터링 시뮬레이션
class PerformanceMonitoringSystem {
  constructor() {
    this.campaigns = [];
    this.metrics = new Map();
    this.optimizationActions = [];
    this.dailyReport = null;
  }

  // 1단계: 캠페인 및 성과 데이터 로드
  loadCampaignData() {
    console.log('📊 1단계: 캠페인 및 성과 데이터 로드\n');

    // 시뮬레이션 캠페인 데이터
    this.campaigns = [
      {
        id: 'campaign-1',
        name: '[자동] 앱 개발 비용 - 수원',
        platform: 'google',
        budget: { daily: 100000, monthly: 3000000 },
        bidStrategy: { type: 'cpc', maxBid: 3000 },
      },
      {
        id: 'campaign-2',
        name: '[자동] 앱 개발 비용 - 서울',
        platform: 'naver',
        budget: { daily: 100000, monthly: 3000000 },
        bidStrategy: { type: 'cpc', maxBid: 3000 },
      },
      {
        id: 'campaign-3',
        name: '[자동] 웹개발 비용 - 경기',
        platform: 'google',
        budget: { daily: 50000, monthly: 1500000 },
        bidStrategy: { type: 'cpc', maxBid: 3000 },
      },
      {
        id: 'campaign-4',
        name: '[자동] 홈페이지 제작 - 인계동',
        platform: 'facebook',
        budget: { daily: 50000, monthly: 1500000 },
        bidStrategy: { type: 'cpa', maxBid: 50000 },
      },
      {
        id: 'campaign-5',
        name: '[자동] 앱개발외주 - 경기',
        platform: 'naver',
        budget: { daily: 30000, monthly: 900000 },
        bidStrategy: { type: 'cpa', maxBid: 50000 },
      },
    ];

    // 시뮬레이션 성과 데이터
    this.metrics.set('campaign-1', {
      impressions: 5500,
      clicks: 165,
      conversions: 15,
      spend: 3000000,
      ctr: 3.0,
      cpc: 18181,
      cpa: 200000,
      roas: 2.5,
      updateDate: new Date().toISOString(),
    });

    this.metrics.set('campaign-2', {
      impressions: 4200,
      clicks: 134,
      conversions: 12,
      spend: 3000000,
      ctr: 3.19,
      cpc: 22388,
      cpa: 250000,
      roas: 2.0,
      updateDate: new Date().toISOString(),
    });

    this.metrics.set('campaign-3', {
      impressions: 1500,
      clicks: 30,
      conversions: 0,
      spend: 1500000,
      ctr: 2.0,
      cpc: 50000,
      cpa: Infinity,
      roas: 0,
      updateDate: new Date().toISOString(),
    });

    this.metrics.set('campaign-4', {
      impressions: 6500,
      clicks: 195,
      conversions: 18,
      spend: 1500000,
      ctr: 3.0,
      cpc: 7692,
      cpa: 83333,
      roas: 3.6,
      updateDate: new Date().toISOString(),
    });

    this.metrics.set('campaign-5', {
      impressions: 900,
      clicks: 36,
      conversions: 2,
      spend: 900000,
      ctr: 4.0,
      cpc: 25000,
      cpa: 450000,
      roas: 1.11,
      updateDate: new Date().toISOString(),
    });

    console.log(`✓ ${this.campaigns.length}개 캠페인 로드됨`);
    console.log(`✓ ${this.metrics.size}개 성과 데이터 로드됨\n`);
  }

  // 2단계: 최적화 규칙 평가
  evaluateOptimizationRules() {
    console.log('⚙️  2단계: 최적화 규칙 평가\n');

    this.optimizationActions = [];

    this.campaigns.forEach((campaign) => {
      const metric = this.metrics.get(campaign.id);
      if (!metric) return;

      // Rule 1: CTR 기반 최적화
      if (metric.ctr < 0.5) {
        this.optimizationActions.push({
          campaignId: campaign.id,
          campaignName: campaign.name,
          rule: 'CTR 기반 최적화',
          condition: `CTR ${metric.ctr.toFixed(2)}% < 0.5%`,
          action: '광고 문구 개선',
          impact: 'high',
        });
      }

      // Rule 2: CPC 기반 입찰 조정
      if (metric.cpc > 15000) {
        this.optimizationActions.push({
          campaignId: campaign.id,
          campaignName: campaign.name,
          rule: 'CPC 기반 입찰 조정',
          condition: `CPC ${Math.floor(metric.cpc)}원 > 15000원`,
          action: '최대 입찰가 감소 (× 0.9)',
          impact: 'high',
        });
      }

      // Rule 3: 우수 캠페인 예산 증가
      if (metric.roas > 3.0) {
        this.optimizationActions.push({
          campaignId: campaign.id,
          campaignName: campaign.name,
          rule: '우수 캠페인 예산 증가',
          condition: `ROAS ${metric.roas.toFixed(2)} > 3.0`,
          action: '일일 예산 20% 증가',
          impact: 'medium',
        });
      }

      // Rule 4: 저성과 캠페인 최적화
      if (metric.roas < 1.5 && metric.roas > 0) {
        this.optimizationActions.push({
          campaignId: campaign.id,
          campaignName: campaign.name,
          rule: '저성과 캠페인 최적화',
          condition: `ROAS ${metric.roas.toFixed(2)} < 1.5`,
          action: '일일 예산 20% 감소',
          impact: 'medium',
        });
      }

      // Rule 5: 타겟팅 개선
      if (metric.conversions === 0 && metric.clicks > 20) {
        this.optimizationActions.push({
          campaignId: campaign.id,
          campaignName: campaign.name,
          rule: '타겟팅 개선',
          condition: '클릭은 많지만 전환이 없음',
          action: '키워드 정제 및 제외어 추가',
          impact: 'high',
        });
      }

      // Rule 6: CPA 기반 확장
      if (metric.cpa < 100000 && metric.conversions > 5) {
        this.optimizationActions.push({
          campaignId: campaign.id,
          campaignName: campaign.name,
          rule: 'CPA 기반 확장',
          condition: `CPA ${Math.floor(metric.cpa)}원 < 100000원`,
          action: '예산 확대 및 지역 확장',
          impact: 'medium',
        });
      }
    });

    console.log(`✓ ${this.optimizationActions.length}개 최적화 기회 발견\n`);

    if (this.optimizationActions.length > 0) {
      console.log('발견된 최적화 기회:');
      this.optimizationActions.forEach((action, i) => {
        console.log(`  ${i + 1}. ${action.campaignName}`);
        console.log(`     규칙: ${action.rule}`);
        console.log(`     조건: ${action.condition}`);
        console.log(`     액션: ${action.action}`);
      });
      console.log();
    }
  }

  // 3단계: 이상 탐지
  detectAnomalies() {
    console.log('⚠️  3단계: 이상 탐지\n');

    const anomalies = [];

    this.campaigns.forEach((campaign) => {
      const metric = this.metrics.get(campaign.id);
      if (!metric) return;

      // 전환 중단
      if (metric.conversions === 0 && metric.clicks > 50) {
        anomalies.push({
          severity: 'high',
          campaign: campaign.name,
          issue: '전환 중단',
          detail: `${metric.clicks}회 클릭 중 0회 전환`,
        });
      }

      // CPC 급증
      if (metric.cpc > 30000) {
        anomalies.push({
          severity: 'medium',
          campaign: campaign.name,
          issue: 'CPC 급증',
          detail: `CPC ${Math.floor(metric.cpc)}원 (정상 범위 10K-15K원)`,
        });
      }

      // ROAS 부족
      if (metric.roas < 1.0) {
        anomalies.push({
          severity: 'high',
          campaign: campaign.name,
          issue: '손실 상태',
          detail: `ROAS ${metric.roas.toFixed(2)} - 손실 발생`,
        });
      }
    });

    if (anomalies.length > 0) {
      console.log(`⚠️  ${anomalies.length}개 이상 탐지됨:\n`);

      anomalies
        .sort((a, b) => (a.severity === 'high' ? -1 : 1))
        .forEach((anomaly) => {
          const severity = anomaly.severity === 'high' ? '🔴' : '🟡';
          console.log(`  ${severity} ${anomaly.campaign}`);
          console.log(`     문제: ${anomaly.issue}`);
          console.log(`     세부: ${anomaly.detail}`);
        });

      console.log();
    } else {
      console.log('✓ 이상 징후 없음\n');
    }
  }

  // 4단계: 플랫폼별 성과 비교
  comparePlatformPerformance() {
    console.log('📊 4단계: 플랫폼별 성과 비교\n');

    const platformMetrics = {};

    this.campaigns.forEach((campaign) => {
      const metric = this.metrics.get(campaign.id);
      if (!metric) return;

      if (!platformMetrics[campaign.platform]) {
        platformMetrics[campaign.platform] = {
          count: 0,
          totalSpend: 0,
          totalConversions: 0,
          totalROAS: 0,
          totalCPC: 0,
        };
      }

      platformMetrics[campaign.platform].count += 1;
      platformMetrics[campaign.platform].totalSpend += metric.spend;
      platformMetrics[campaign.platform].totalConversions += metric.conversions;
      platformMetrics[campaign.platform].totalROAS += metric.roas;
      platformMetrics[campaign.platform].totalCPC += metric.cpc;
    });

    console.log('플랫폼별 평가:');
    Object.entries(platformMetrics)
      .sort((a, b) => (b[1].totalROAS / b[1].count) - (a[1].totalROAS / a[1].count))
      .forEach(([platform, metrics]) => {
        const avgROAS = (metrics.totalROAS / metrics.count).toFixed(2);
        const avgCPC = Math.floor(metrics.totalCPC / metrics.count);
        const status = avgROAS > 2.5 ? '✅' : avgROAS > 1.5 ? '⚠️' : '❌';

        console.log(
          `  ${status} ${platform.toUpperCase()}: ${metrics.count}개 캠페인, 평균 ROAS ${avgROAS}, 평균 CPC ${avgCPC}원`
        );
      });

    console.log();
  }

  // 5단계: 일일 최적화 리포트
  generateDailyReport() {
    console.log('📋 5단계: 일일 최적화 리포트 생성\n');

    const highImpactActions = this.optimizationActions.filter((a) => a.impact === 'high');
    const budgetChanges = this.optimizationActions.reduce((sum, action) => {
      if (action.rule === '우수 캠페인 예산 증가') return sum + 20000;
      if (action.rule === '저성과 캠페인 최적화') return sum - 10000;
      return sum;
    }, 0);

    this.dailyReport = {
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      summary: {
        totalCampaigns: this.campaigns.length,
        monitoredCampaigns: this.metrics.size,
        optimizationActions: this.optimizationActions.length,
        highImpactActions: highImpactActions.length,
      },
      metrics: {
        totalSpend: Array.from(this.metrics.values()).reduce((sum, m) => sum + m.spend, 0),
        totalConversions: Array.from(this.metrics.values()).reduce((sum, m) => sum + m.conversions, 0),
        averageROAS: (
          Array.from(this.metrics.values()).reduce((sum, m) => sum + m.roas, 0) / this.metrics.size
        ).toFixed(2),
      },
      budgetOptimization: {
        proposedChange: budgetChanges,
        direction: budgetChanges > 0 ? 'INCREASE' : 'DECREASE',
      },
      topActions: highImpactActions.slice(0, 5),
      nextSteps: [
        '우수 캠페인 예산 20% 증가',
        '저성과 캠페인 광고 문구 개선',
        '타겟팅 정제 및 제외어 추가',
        'A/B 테스트 결과 검토',
        '플랫폼별 성과 분석',
      ],
    };

    console.log('📅 오늘의 최적화 요약:');
    console.log(`  날짜: ${this.dailyReport.date}`);
    console.log(`  모니터된 캠페인: ${this.dailyReport.summary.monitoredCampaigns}개`);
    console.log(`  최적화 기회: ${this.dailyReport.summary.optimizationActions}개`);
    console.log(`  고영향 액션: ${this.dailyReport.summary.highImpactActions}개`);
    console.log(`  예상 예산 변화: ${budgetChanges > 0 ? '+' : ''}${(budgetChanges / 1000).toFixed(0)}K원`);
    console.log(`  평균 ROAS: ${this.dailyReport.metrics.averageROAS}\n`);

    console.log('🎯 우선순위 액션:');
    highImpactActions.slice(0, 3).forEach((action, i) => {
      console.log(`  ${i + 1}. ${action.campaignName}`);
      console.log(`     → ${action.action}`);
    });

    console.log();
  }

  // 결과 저장
  saveResults() {
    console.log('💾 6단계: 결과 저장\n');

    const output = {
      workflow: {
        timestamp: new Date().toISOString(),
        duration: '실시간 모니터링',
      },
      campaigns: this.campaigns,
      metrics: Object.fromEntries(this.metrics),
      optimizationActions: this.optimizationActions,
      dailyReport: this.dailyReport,
    };

    const outputPath = path.join(__dirname, '../.output/optimization-report.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    console.log(`✓ 최적화 리포트 저장: ${outputPath}\n`);
  }

  // 주간 요약
  printWeeklySummary() {
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║  주간 성과 및 최적화 요약                        ║');
    console.log('╚════════════════════════════════════════════════╝\n');

    const totalSpend = Array.from(this.metrics.values()).reduce((sum, m) => sum + m.spend, 0);
    const totalConversions = Array.from(this.metrics.values()).reduce((sum, m) => sum + m.conversions, 0);
    const averageROAS = (
      Array.from(this.metrics.values()).reduce((sum, m) => sum + m.roas, 0) / this.metrics.size
    ).toFixed(2);

    console.log(`💰 주간 지출: ${(totalSpend / 1000000).toFixed(1)}M원`);
    console.log(`🎯 주간 전환: ${totalConversions}개`);
    console.log(`📊 평균 ROAS: ${averageROAS}\n`);

    console.log(`📈 개선 가능 영역: ${this.optimizationActions.length}개`);
    console.log(`🚀 우수 캠페인: ${this.campaigns.filter((c) => (this.metrics.get(c.id)?.roas || 0) > 2.5).length}개`);
    console.log(`⚠️  개선 필요: ${this.campaigns.filter((c) => (this.metrics.get(c.id)?.roas || 0) < 1.5).length}개\n`);

    console.log('💡 추천 조치:');
    console.log('  1. 우수 캠페인 예산 20% 증가');
    console.log('  2. 저성과 캠페인 광고 문구 개선');
    console.log('  3. 타겟팅 정제 및 제외어 추가');
    console.log('  4. 새 지역 확장 캠페인 준비');
    console.log('  5. A/B 테스트 결과 검토\n');
  }

  // 실행
  async run() {
    console.log('🎯 성과 모니터링 및 자동 최적화 시스템\n');
    console.log('═════════════════════════════════════════════════\n');

    this.loadCampaignData();
    this.evaluateOptimizationRules();
    this.detectAnomalies();
    this.comparePlatformPerformance();
    this.generateDailyReport();
    this.saveResults();
    this.printWeeklySummary();

    console.log('═════════════════════════════════════════════════\n');
    console.log('✅ 모니터링 및 최적화 완료!\n');

    console.log('🔄 다음 실행:');
    console.log('   • 일일 자동 실행: 매일 자정');
    console.log('   • 수동 실행: npm run optimize');
    console.log('   • 실시간 대시보드: npm run dashboard\n');
  }
}

const system = new PerformanceMonitoringSystem();
await system.run();
