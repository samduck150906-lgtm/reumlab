// 성과 기반 자동 최적화 엔진

import type { AdCampaign, PerformanceMetrics } from './programmatic-marketing';

export interface OptimizationAction {
  campaignId: string;
  campaignName: string;
  rule: string;
  condition: string;
  action: string;
  impact: 'high' | 'medium' | 'low';
  expectedImprovement: number; // 예상 개선율 (%)
}

export interface OptimizationResult {
  campaignId: string;
  campaignName: string;
  originalBudget: number;
  optimizedBudget: number;
  originalMetrics: PerformanceMetrics;
  projectedMetrics: PerformanceMetrics;
  changes: string[];
}

export interface DailyOptimizationReport {
  date: string;
  totalCampaigns: number;
  optimizedCampaigns: number;
  totalBudgetChange: number;
  expectedROASImprovement: number;
  actions: OptimizationAction[];
}

// 최적화 규칙 엔진
export class PerformanceOptimizer {
  // 최적화 규칙 평가
  evaluateOptimizationRules(
    campaigns: AdCampaign[],
    metrics: Map<string, PerformanceMetrics>
  ): OptimizationAction[] {
    const actions: OptimizationAction[] = [];

    campaigns.forEach((campaign) => {
      const metric = metrics.get(campaign.id);
      if (!metric) return;

      // Rule 1: CTR 기반 최적화
      if (metric.ctr < 0.5) {
        actions.push({
          campaignId: campaign.id,
          campaignName: campaign.name,
          rule: 'CTR 기반 최적화',
          condition: `CTR ${metric.ctr.toFixed(2)}% < 0.5%`,
          action: '광고 문구 개선 (A/B 테스트)',
          impact: 'high',
          expectedImprovement: 40,
        });
      }

      // Rule 2: CPC 기반 입찰 조정
      if (metric.cpc > (campaign.bidStrategy.maxBid || 5000) * 1.5) {
        actions.push({
          campaignId: campaign.id,
          campaignName: campaign.name,
          rule: 'CPC 기반 입찰 조정',
          condition: `CPC ${Math.floor(metric.cpc)}원 > ${(campaign.bidStrategy.maxBid || 5000) * 1.5}원`,
          action: '최대 입찰가 감소 (× 0.9)',
          impact: 'high',
          expectedImprovement: 15,
        });
      }

      // Rule 3: 우수 캠페인 예산 증가
      if (metric.roas > 3.0) {
        actions.push({
          campaignId: campaign.id,
          campaignName: campaign.name,
          rule: '우수 캠페인 예산 증가',
          condition: `ROAS ${metric.roas.toFixed(2)} > 3.0`,
          action: '일일 예산 증가 (× 1.2)',
          impact: 'medium',
          expectedImprovement: 20,
        });
      }

      // Rule 4: 저성과 캠페인 예산 감소
      if (metric.roas < 1.5 && metric.roas > 0) {
        actions.push({
          campaignId: campaign.id,
          campaignName: campaign.name,
          rule: '저성과 캠페인 최적화',
          condition: `ROAS ${metric.roas.toFixed(2)} < 1.5`,
          action: '일일 예산 감소 (× 0.8)',
          impact: 'medium',
          expectedImprovement: -10,
        });
      }

      // Rule 5: 타겟팅 개선
      if (metric.conversions === 0 && metric.clicks > 100) {
        actions.push({
          campaignId: campaign.id,
          campaignName: campaign.name,
          rule: '타겟팅 개선',
          condition: '클릭은 많지만 전환이 없음',
          action: '키워드 정제 및 제외어 추가',
          impact: 'high',
          expectedImprovement: 50,
        });
      }

      // Rule 6: CPA 기반 확장
      if (metric.cpa < 30000 && metric.conversions > 5) {
        actions.push({
          campaignId: campaign.id,
          campaignName: campaign.name,
          rule: 'CPA 기반 확장',
          condition: `CPA ${Math.floor(metric.cpa)}원 < 30000원`,
          action: '예산 확대 및 지역 확장',
          impact: 'medium',
          expectedImprovement: 30,
        });
      }

      // Rule 7: 모바일 최적화
      if (metric.conversions > 0) {
        actions.push({
          campaignId: campaign.id,
          campaignName: campaign.name,
          rule: '디바이스별 최적화',
          condition: '크로스 디바이스 성과 분석 필요',
          action: '모바일 입찰가 조정 (× 1.1)',
          impact: 'low',
          expectedImprovement: 10,
        });
      }

      // Rule 8: 시간대 최적화
      if (metric.ctr > 1.0) {
        actions.push({
          campaignId: campaign.id,
          campaignName: campaign.name,
          rule: '시간대 최적화',
          condition: 'CTR 성과 우수',
          action: '고성과 시간대 예산 집중',
          impact: 'low',
          expectedImprovement: 15,
        });
      }
    });

    return actions;
  }

  // 최적화 액션 적용
  applyOptimizations(
    campaigns: AdCampaign[],
    actions: OptimizationAction[]
  ): OptimizationResult[] {
    const results: OptimizationResult[] = [];

    actions.forEach((action) => {
      const campaign = campaigns.find((c) => c.id === action.campaignId);
      if (!campaign) return;

      const result: OptimizationResult = {
        campaignId: campaign.id,
        campaignName: campaign.name,
        originalBudget: campaign.budget.daily,
        optimizedBudget: campaign.budget.daily,
        originalMetrics: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          spend: 0,
          ctr: 0,
          cpc: 0,
          cpa: 0,
          roas: 0,
          updateDate: new Date().toISOString(),
        },
        projectedMetrics: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          spend: 0,
          ctr: 0,
          cpc: 0,
          cpa: 0,
          roas: 0,
          updateDate: new Date().toISOString(),
        },
        changes: [],
      };

      // 최적화 규칙에 따른 예산 조정
      if (action.rule === '우수 캠페인 예산 증가') {
        result.optimizedBudget = Math.floor(campaign.budget.daily * 1.2);
        result.changes.push(`예산: ${campaign.budget.daily}원 → ${result.optimizedBudget}원 (+20%)`);
      } else if (action.rule === '저성과 캠페인 최적화') {
        result.optimizedBudget = Math.floor(campaign.budget.daily * 0.8);
        result.changes.push(`예산: ${campaign.budget.daily}원 → ${result.optimizedBudget}원 (-20%)`);
      } else if (action.rule === 'CPA 기반 확장') {
        result.optimizedBudget = Math.floor(campaign.budget.daily * 1.25);
        result.changes.push(`예산: ${campaign.budget.daily}원 → ${result.optimizedBudget}원 (+25%)`);
        result.changes.push('새 지역 추가: 예정');
      }

      // 입찰가 조정
      if (action.rule === 'CPC 기반 입찰 조정') {
        const newMaxBid = Math.floor((campaign.bidStrategy.maxBid || 3000) * 0.9);
        result.changes.push(`최대 입찰가: ${campaign.bidStrategy.maxBid}원 → ${newMaxBid}원 (-10%)`);
      }

      // 타겟팅 개선
      if (action.rule === '타겟팅 개선') {
        result.changes.push('제외 키워드 추가 예정');
        result.changes.push('지역 타겟팅 정제 예정');
      }

      // 광고 문구 개선
      if (action.rule === 'CTR 기반 최적화') {
        result.changes.push('새 헤드라인 생성 예정');
        result.changes.push('A/B 테스트 시작 예정');
      }

      // 프로젝션 계산 (간단한 선형 계산)
      const improvementRate = action.expectedImprovement / 100;
      result.projectedMetrics.roas = 1.67 * (1 + improvementRate * 0.5);

      results.push(result);
    });

    return results;
  }

  // 일일 최적화 리포트 생성
  generateDailyOptimizationReport(
    campaignCount: number,
    actions: OptimizationAction[]
  ): DailyOptimizationReport {
    const totalBudgetChange = actions.reduce((sum, action) => {
      if (action.rule === '우수 캠페인 예산 증가') return sum + 20000;
      if (action.rule === '저성과 캠페인 최적화') return sum - 10000;
      if (action.rule === 'CPA 기반 확장') return sum + 25000;
      return sum;
    }, 0);

    const expectedROASImprovement = actions.reduce((sum, action) => {
      return sum + action.expectedImprovement;
    }, 0) / Math.max(actions.length, 1);

    return {
      date: new Date().toISOString().split('T')[0],
      totalCampaigns: campaignCount,
      optimizedCampaigns: actions.length,
      totalBudgetChange,
      expectedROASImprovement: Math.round(expectedROASImprovement),
      actions,
    };
  }
}

// 성과 모니터링 엔진
export class PerformanceMonitor {
  private metricsHistory: Map<string, PerformanceMetrics[]> = new Map();

  recordMetrics(campaignId: string, metrics: PerformanceMetrics): void {
    if (!this.metricsHistory.has(campaignId)) {
      this.metricsHistory.set(campaignId, []);
    }
    this.metricsHistory.get(campaignId)!.push(metrics);
  }

  // 트렌드 분석
  analyzeTrend(campaignId: string): {
    trend: 'improving' | 'declining' | 'stable';
    changePercentage: number;
  } {
    const history = this.metricsHistory.get(campaignId) || [];
    if (history.length < 2) {
      return { trend: 'stable', changePercentage: 0 };
    }

    const recent = history[history.length - 1];
    const previous = history[history.length - 2];

    const changePercentage = ((recent.roas - previous.roas) / previous.roas) * 100;

    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (changePercentage > 5) trend = 'improving';
    if (changePercentage < -5) trend = 'declining';

    return { trend, changePercentage };
  }

  // 캠페인 상태 분류
  classifyCampaignStatus(metrics: PerformanceMetrics): 'excellent' | 'good' | 'fair' | 'poor' {
    if (metrics.roas > 3.0) return 'excellent';
    if (metrics.roas > 1.5) return 'good';
    if (metrics.roas > 0.5) return 'fair';
    return 'poor';
  }

  // 이상 탐지
  detectAnomalies(campaignId: string, currentMetrics: PerformanceMetrics): string[] {
    const anomalies: string[] = [];
    const history = this.metricsHistory.get(campaignId) || [];

    if (history.length === 0) return anomalies;

    const avgMetrics = this.calculateAverageMetrics(history);

    // CPC 급증 감지
    if (currentMetrics.cpc > avgMetrics.cpc * 2) {
      anomalies.push(`CPC 급증: ${avgMetrics.cpc}원 → ${Math.floor(currentMetrics.cpc)}원`);
    }

    // CTR 급락 감지
    if (currentMetrics.ctr < avgMetrics.ctr * 0.5 && avgMetrics.ctr > 0) {
      anomalies.push(`CTR 급락: ${avgMetrics.ctr.toFixed(2)}% → ${currentMetrics.ctr.toFixed(2)}%`);
    }

    // 전환 중단 감지
    if (currentMetrics.conversions === 0 && history[history.length - 1].conversions > 0) {
      anomalies.push('전환이 완전히 중단됨');
    }

    // 클릭 부재 감지
    if (currentMetrics.clicks === 0 && history[history.length - 1].clicks > 0) {
      anomalies.push('클릭이 완전히 중단됨 - 광고 승인 상태 확인 필요');
    }

    return anomalies;
  }

  // 평균 메트릭 계산
  private calculateAverageMetrics(history: PerformanceMetrics[]): PerformanceMetrics {
    const count = history.length;
    return {
      impressions: history.reduce((sum, m) => sum + m.impressions, 0) / count,
      clicks: history.reduce((sum, m) => sum + m.clicks, 0) / count,
      conversions: history.reduce((sum, m) => sum + m.conversions, 0) / count,
      spend: history.reduce((sum, m) => sum + m.spend, 0) / count,
      ctr: history.reduce((sum, m) => sum + m.ctr, 0) / count,
      cpc: history.reduce((sum, m) => sum + m.cpc, 0) / count,
      cpa: history.reduce((sum, m) => sum + m.cpa, 0) / count,
      roas: history.reduce((sum, m) => sum + m.roas, 0) / count,
      updateDate: new Date().toISOString(),
    };
  }

  // 성과 비교 (플랫폼별)
  comparePlatformPerformance(
    campaigns: AdCampaign[],
    metrics: Map<string, PerformanceMetrics>
  ): {
    platform: string;
    avgROAS: number;
    avgCPC: number;
    totalConversions: number;
    totalSpend: number;
  }[] {
    const platformMetrics: {
      [key: string]: { roas: number[]; cpc: number[]; conversions: number; spend: number };
    } = {};

    campaigns.forEach((campaign) => {
      const metric = metrics.get(campaign.id);
      if (!metric) return;

      if (!platformMetrics[campaign.platform]) {
        platformMetrics[campaign.platform] = { roas: [], cpc: [], conversions: 0, spend: 0 };
      }

      platformMetrics[campaign.platform].roas.push(metric.roas);
      platformMetrics[campaign.platform].cpc.push(metric.cpc);
      platformMetrics[campaign.platform].conversions += metric.conversions;
      platformMetrics[campaign.platform].spend += metric.spend;
    });

    return Object.entries(platformMetrics).map(([platform, data]) => ({
      platform,
      avgROAS: data.roas.reduce((a, b) => a + b, 0) / data.roas.length,
      avgCPC: data.cpc.reduce((a, b) => a + b, 0) / data.cpc.length,
      totalConversions: data.conversions,
      totalSpend: data.spend,
    }));
  }
}
