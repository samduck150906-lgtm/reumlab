// 마케팅 대시보드 API

import type { AdCampaign, PerformanceMetrics } from './programmatic-marketing';

export interface DashboardSummary {
  summary: {
    totalCampaigns: number;
    activeCampaigns: number;
    totalSpend: number;
    totalConversions: number;
    averageROAS: number;
    averageCPC: number;
    lastUpdated: string;
  };
  topPerformers: CampaignPerformance[];
  underperformers: CampaignPerformance[];
  platformMetrics: PlatformMetric[];
  recommendations: string[];
  alerts: Alert[];
}

export interface CampaignPerformance {
  campaignId: string;
  campaignName: string;
  platform: string;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  metrics: {
    spend: number;
    conversions: number;
    ctr: number;
    cpc: number;
    cpa: number;
    roas: number;
  };
  trend: 'improving' | 'stable' | 'declining';
  daysRunning: number;
}

export interface PlatformMetric {
  platform: string;
  campaignCount: number;
  totalSpend: number;
  totalConversions: number;
  averageROAS: number;
  performance: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface Alert {
  severity: 'critical' | 'warning' | 'info';
  type: string;
  message: string;
  affectedCampaigns: string[];
  suggestedAction: string;
}

// 마케팅 대시보드 빌더
export class MarketingDashboard {
  private campaigns: AdCampaign[] = [];
  private metrics: Map<string, PerformanceMetrics> = new Map();

  constructor(campaigns: AdCampaign[], metrics: Map<string, PerformanceMetrics>) {
    this.campaigns = campaigns;
    this.metrics = metrics;
  }

  // 대시보드 데이터 빌드
  buildDashboard(): DashboardSummary {
    const summary = this.buildSummary();
    const topPerformers = this.getTopPerformers(5);
    const underperformers = this.getUnderperformers(5);
    const platformMetrics = this.getPlatformMetrics();
    const recommendations = this.generateRecommendations();
    const alerts = this.generateAlerts();

    return {
      summary,
      topPerformers,
      underperformers,
      platformMetrics,
      recommendations,
      alerts,
    };
  }

  // 요약 통계 빌드
  private buildSummary() {
    const metricsArray = Array.from(this.metrics.values());

    const totalSpend = metricsArray.reduce((sum, m) => sum + m.spend, 0);
    const totalConversions = metricsArray.reduce((sum, m) => sum + m.conversions, 0);
    const averageROAS =
      metricsArray.reduce((sum, m) => sum + m.roas, 0) / Math.max(metricsArray.length, 1);
    const averageCPC =
      metricsArray.reduce((sum, m) => sum + m.cpc, 0) / Math.max(metricsArray.length, 1);

    return {
      totalCampaigns: this.campaigns.length,
      activeCampaigns: this.campaigns.filter((c) => {
        const metric = this.metrics.get(c.id);
        return metric && metric.conversions > 0;
      }).length,
      totalSpend,
      totalConversions,
      averageROAS: Math.round(averageROAS * 100) / 100,
      averageCPC: Math.round(averageCPC),
      lastUpdated: new Date().toISOString(),
    };
  }

  // 우수 캠페인 목록
  private getTopPerformers(limit: number): CampaignPerformance[] {
    return this.campaigns
      .map((campaign) => {
        const metric = this.metrics.get(campaign.id)!;
        return {
          campaignId: campaign.id,
          campaignName: campaign.name,
          platform: campaign.platform,
          status: this.classifyPerformance(metric.roas),
          metrics: {
            spend: metric.spend,
            conversions: metric.conversions,
            ctr: Math.round(metric.ctr * 100) / 100,
            cpc: Math.round(metric.cpc),
            cpa: Math.round(metric.cpa),
            roas: Math.round(metric.roas * 100) / 100,
          },
          trend: this.analyzeTrend(metric),
          daysRunning: 30,
        };
      })
      .filter((c) => this.metrics.has(c.campaignId))
      .sort((a, b) => b.metrics.roas - a.metrics.roas)
      .slice(0, limit);
  }

  // 저성과 캠페인 목록
  private getUnderperformers(limit: number): CampaignPerformance[] {
    return this.campaigns
      .map((campaign) => {
        const metric = this.metrics.get(campaign.id)!;
        return {
          campaignId: campaign.id,
          campaignName: campaign.name,
          platform: campaign.platform,
          status: this.classifyPerformance(metric.roas),
          metrics: {
            spend: metric.spend,
            conversions: metric.conversions,
            ctr: Math.round(metric.ctr * 100) / 100,
            cpc: Math.round(metric.cpc),
            cpa: Math.round(metric.cpa),
            roas: Math.round(metric.roas * 100) / 100,
          },
          trend: this.analyzeTrend(metric),
          daysRunning: 30,
        };
      })
      .filter((c) => this.metrics.has(c.campaignId))
      .sort((a, b) => a.metrics.roas - b.metrics.roas)
      .slice(0, limit);
  }

  // 플랫폼별 메트릭
  private getPlatformMetrics(): PlatformMetric[] {
    const platformData: {
      [key: string]: {
        count: number;
        spend: number;
        conversions: number;
        roas: number[];
      };
    } = {};

    this.campaigns.forEach((campaign) => {
      const metric = this.metrics.get(campaign.id);
      if (!metric) return;

      if (!platformData[campaign.platform]) {
        platformData[campaign.platform] = {
          count: 0,
          spend: 0,
          conversions: 0,
          roas: [],
        };
      }

      platformData[campaign.platform].count += 1;
      platformData[campaign.platform].spend += metric.spend;
      platformData[campaign.platform].conversions += metric.conversions;
      platformData[campaign.platform].roas.push(metric.roas);
    });

    return Object.entries(platformData).map(([platform, data]) => ({
      platform,
      campaignCount: data.count,
      totalSpend: data.spend,
      totalConversions: data.conversions,
      averageROAS: Math.round((data.roas.reduce((a, b) => a + b, 0) / data.roas.length) * 100) / 100,
      performance: this.classifyPerformance(
        data.roas.reduce((a, b) => a + b, 0) / data.roas.length
      ),
    }));
  }

  // 추천사항 생성
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const topPerformers = this.getTopPerformers(3);
    const underperformers = this.getUnderperformers(3);

    if (topPerformers.length > 0) {
      recommendations.push(`상위 성과 캠페인 "${topPerformers[0].campaignName}"의 예산을 20% 증가하세요`);
    }

    if (underperformers.length > 0) {
      recommendations.push(`저성과 캠페인 "${underperformers[0].campaignName}"의 광고 문구를 개선하세요`);
    }

    const highCPCCampaigns = this.campaigns.filter((c) => {
      const metric = this.metrics.get(c.id);
      return metric && metric.cpc > 20000;
    });

    if (highCPCCampaigns.length > 0) {
      recommendations.push(`CPC가 높은 캠페인의 입찰가를 조정하세요 (${highCPCCampaigns.length}개)`);
    }

    const zeroConversionCampaigns = this.campaigns.filter((c) => {
      const metric = this.metrics.get(c.id);
      return metric && metric.conversions === 0 && metric.clicks > 50;
    });

    if (zeroConversionCampaigns.length > 0) {
      recommendations.push('전환이 없는 캠페인의 타겟팅을 정제하세요');
    }

    recommendations.push('A/B 테스트 결과를 바탕으로 최적의 광고 문구를 선정하세요');

    return recommendations;
  }

  // 경고 알림 생성
  private generateAlerts(): Alert[] {
    const alerts: Alert[] = [];

    // 손실 캠페인
    const lossCalampaigns = this.campaigns.filter((c) => {
      const metric = this.metrics.get(c.id);
      return metric && metric.roas < 1.0;
    });

    if (lossCalampaigns.length > 0) {
      alerts.push({
        severity: 'critical',
        type: '손실 캠페인',
        message: `${lossCalampaigns.length}개 캠페인이 손실을 기록하고 있습니다`,
        affectedCampaigns: lossCalampaigns.map((c) => c.name),
        suggestedAction: '즉시 광고 문구 개선 또는 예산 감소 검토',
      });
    }

    // CPC 급증
    const highCPCCampaigns = this.campaigns.filter((c) => {
      const metric = this.metrics.get(c.id);
      return metric && metric.cpc > 25000;
    });

    if (highCPCCampaigns.length > 0) {
      alerts.push({
        severity: 'warning',
        type: 'CPC 급증',
        message: `${highCPCCampaigns.length}개 캠페인의 CPC가 정상 범위를 초과했습니다`,
        affectedCampaigns: highCPCCampaigns.map((c) => c.name),
        suggestedAction: '최대 입찰가를 재평가하고 필요시 감소',
      });
    }

    // 전환 중단
    const noConversionCampaigns = this.campaigns.filter((c) => {
      const metric = this.metrics.get(c.id);
      return metric && metric.conversions === 0 && metric.clicks > 100;
    });

    if (noConversionCampaigns.length > 0) {
      alerts.push({
        severity: 'warning',
        type: '전환 부족',
        message: `${noConversionCampaigns.length}개 캠페인에서 전환이 발생하지 않았습니다`,
        affectedCampaigns: noConversionCampaigns.map((c) => c.name),
        suggestedAction: '랜딩페이지 품질 확인 및 타겟팅 정제',
      });
    }

    // 저조한 CTR
    const lowCTRCampaigns = this.campaigns.filter((c) => {
      const metric = this.metrics.get(c.id);
      return metric && metric.ctr < 0.5;
    });

    if (lowCTRCampaigns.length > 0) {
      alerts.push({
        severity: 'info',
        type: '낮은 CTR',
        message: `${lowCTRCampaigns.length}개 캠페인의 클릭율이 낮습니다`,
        affectedCampaigns: lowCTRCampaigns.map((c) => c.name),
        suggestedAction: 'A/B 테스트로 더 나은 헤드라인과 CTA 테스트',
      });
    }

    return alerts;
  }

  // 성능 분류
  private classifyPerformance(roas: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (roas > 3.0) return 'excellent';
    if (roas > 1.5) return 'good';
    if (roas > 0.5) return 'fair';
    return 'poor';
  }

  // 트렌드 분석
  private analyzeTrend(metric: PerformanceMetrics): 'improving' | 'stable' | 'declining' {
    // 실제로는 히스토리 데이터를 기반으로 분석
    // 시뮬레이션: ROAS와 CTR을 기반으로 간단하게 판단
    if (metric.roas > 2.0 && metric.ctr > 2.0) return 'improving';
    if (metric.roas < 1.0 || metric.conversions === 0) return 'declining';
    return 'stable';
  }

  // JSON 출력
  toDashboardJSON(): string {
    return JSON.stringify(this.buildDashboard(), null, 2);
  }

  // HTML 대시보드 생성 (간단한 버전)
  toHTML(): string {
    const dashboard = this.buildDashboard();

    return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>마케팅 캠페인 대시보드</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
    .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
    .header { margin-bottom: 30px; }
    h1 { color: #333; margin-bottom: 10px; }
    .timestamp { color: #999; font-size: 14px; }

    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px; }
    .summary-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .summary-label { color: #666; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; }
    .summary-value { font-size: 24px; font-weight: bold; color: #333; }

    .section { margin-bottom: 30px; }
    .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333; }

    .alert-list { display: flex; flex-direction: column; gap: 10px; }
    .alert { padding: 15px; border-radius: 8px; border-left: 4px solid; }
    .alert.critical { background: #fee; border-color: #f33; }
    .alert.warning { background: #ffe; border-color: #f90; }
    .alert.info { background: #eef; border-color: #33f; }
    .alert-title { font-weight: bold; margin-bottom: 5px; }
    .alert-message { font-size: 14px; color: #666; }

    .campaign-table { width: 100%; background: white; border-collapse: collapse; border-radius: 8px; overflow: hidden; }
    .campaign-table th { background: #f5f5f5; padding: 12px; text-align: left; font-weight: bold; color: #666; border-bottom: 1px solid #ddd; }
    .campaign-table td { padding: 12px; border-bottom: 1px solid #ddd; }
    .campaign-table tr:hover { background: #fafafa; }

    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .badge.excellent { background: #d4edda; color: #155724; }
    .badge.good { background: #d1ecf1; color: #0c5460; }
    .badge.fair { background: #fff3cd; color: #856404; }
    .badge.poor { background: #f8d7da; color: #721c24; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 마케팅 캠페인 대시보드</h1>
      <div class="timestamp">마지막 업데이트: ${dashboard.summary.lastUpdated}</div>
    </div>

    <div class="summary-grid">
      <div class="summary-card">
        <div class="summary-label">총 캠페인</div>
        <div class="summary-value">${dashboard.summary.totalCampaigns}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">활성 캠페인</div>
        <div class="summary-value">${dashboard.summary.activeCampaigns}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">월간 지출</div>
        <div class="summary-value">${(dashboard.summary.totalSpend / 1000000).toFixed(1)}M</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">총 전환</div>
        <div class="summary-value">${dashboard.summary.totalConversions}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">평균 ROAS</div>
        <div class="summary-value">${dashboard.summary.averageROAS}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">평균 CPC</div>
        <div class="summary-value">${dashboard.summary.averageCPC}원</div>
      </div>
    </div>

    ${
      dashboard.alerts.length > 0
        ? `
    <div class="section">
      <div class="section-title">⚠️ 주의사항</div>
      <div class="alert-list">
        ${dashboard.alerts
          .map(
            (alert) => `
        <div class="alert ${alert.severity}">
          <div class="alert-title">${alert.type}</div>
          <div class="alert-message">${alert.message}</div>
        </div>
        `
          )
          .join('')}
      </div>
    </div>
    `
        : ''
    }

    <div class="section">
      <div class="section-title">🏆 상위 성과 캠페인</div>
      <table class="campaign-table">
        <thead>
          <tr>
            <th>캠페인명</th>
            <th>플랫폼</th>
            <th>상태</th>
            <th>ROAS</th>
            <th>전환</th>
            <th>CPC</th>
          </tr>
        </thead>
        <tbody>
          ${dashboard.topPerformers
            .map(
              (c) => `
          <tr>
            <td>${c.campaignName}</td>
            <td>${c.platform.toUpperCase()}</td>
            <td><span class="badge ${c.status}">${c.status.toUpperCase()}</span></td>
            <td>${c.metrics.roas}</td>
            <td>${c.metrics.conversions}</td>
            <td>${c.metrics.cpc}원</td>
          </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>

    <div class="section">
      <div class="section-title">💡 추천사항</div>
      <ul style="margin-left: 20px; line-height: 1.8;">
        ${dashboard.recommendations.map((rec) => `<li>${rec}</li>`).join('')}
      </ul>
    </div>
  </div>
</body>
</html>
    `.trim();
  }
}
