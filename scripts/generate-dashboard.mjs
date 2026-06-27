#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 대시보드 생성 시뮬레이션
class DashboardGenerator {
  constructor() {
    this.campaigns = [];
    this.metrics = new Map();
  }

  loadData() {
    console.log('📊 대시보드 데이터 로드\n');

    // 샘플 캠페인
    this.campaigns = [
      {
        id: 'campaign-1',
        name: '[자동] 앱 개발 비용 - 수원',
        platform: 'google',
      },
      {
        id: 'campaign-2',
        name: '[자동] 앱 개발 비용 - 서울',
        platform: 'naver',
      },
      {
        id: 'campaign-3',
        name: '[자동] 웹개발 비용 - 경기',
        platform: 'google',
      },
      {
        id: 'campaign-4',
        name: '[자동] 홈페이지 제작 - 인계동',
        platform: 'facebook',
      },
      {
        id: 'campaign-5',
        name: '[자동] 앱개발외주 - 경기',
        platform: 'naver',
      },
    ];

    // 샘플 성과 메트릭
    this.metrics.set('campaign-1', {
      spend: 3000000,
      conversions: 15,
      ctr: 3.0,
      cpc: 18181,
      cpa: 200000,
      roas: 2.5,
      clicks: 165,
      impressions: 5500,
    });

    this.metrics.set('campaign-2', {
      spend: 3000000,
      conversions: 12,
      ctr: 3.19,
      cpc: 22388,
      cpa: 250000,
      roas: 2.0,
      clicks: 134,
      impressions: 4200,
    });

    this.metrics.set('campaign-3', {
      spend: 1500000,
      conversions: 0,
      ctr: 2.0,
      cpc: 50000,
      cpa: Infinity,
      roas: 0,
      clicks: 30,
      impressions: 1500,
    });

    this.metrics.set('campaign-4', {
      spend: 1500000,
      conversions: 18,
      ctr: 3.0,
      cpc: 7692,
      cpa: 83333,
      roas: 3.6,
      clicks: 195,
      impressions: 6500,
    });

    this.metrics.set('campaign-5', {
      spend: 900000,
      conversions: 2,
      ctr: 4.0,
      cpc: 25000,
      cpa: 450000,
      roas: 1.11,
      clicks: 36,
      impressions: 900,
    });
  }

  buildDashboard() {
    console.log('🎨 대시보드 생성 중...\n');

    const metricsArray = Array.from(this.metrics.values());

    const totalSpend = metricsArray.reduce((sum, m) => sum + m.spend, 0);
    const totalConversions = metricsArray.reduce((sum, m) => sum + m.conversions, 0);
    const averageROAS =
      metricsArray.reduce((sum, m) => sum + m.roas, 0) / Math.max(metricsArray.length, 1);
    const averageCPC = metricsArray.reduce((sum, m) => sum + m.cpc, 0) / Math.max(metricsArray.length, 1);

    // 상위 캠페인
    const topPerformers = this.campaigns
      .map((c) => ({
        ...c,
        metrics: this.metrics.get(c.id),
      }))
      .sort((a, b) => (b.metrics?.roas || 0) - (a.metrics?.roas || 0))
      .slice(0, 3);

    // 저성과 캠페인
    const underperformers = this.campaigns
      .map((c) => ({
        ...c,
        metrics: this.metrics.get(c.id),
      }))
      .sort((a, b) => (a.metrics?.roas || 0) - (b.metrics?.roas || 0))
      .slice(0, 2);

    // 플랫폼별 성과
    const platformMetrics = {};
    this.campaigns.forEach((c) => {
      const metric = this.metrics.get(c.id);
      if (!metric) return;

      if (!platformMetrics[c.platform]) {
        platformMetrics[c.platform] = { count: 0, roas: [], cpc: [] };
      }
      platformMetrics[c.platform].count += 1;
      platformMetrics[c.platform].roas.push(metric.roas);
      platformMetrics[c.platform].cpc.push(metric.cpc);
    });

    const platformData = Object.entries(platformMetrics).map(([platform, data]) => ({
      platform,
      campaignCount: data.count,
      averageROAS: (data.roas.reduce((a, b) => a + b, 0) / data.roas.length).toFixed(2),
      averageCPC: Math.round(data.cpc.reduce((a, b) => a + b, 0) / data.cpc.length),
    }));

    // 알림 생성
    const alerts = [];

    const lossCalampaigns = this.campaigns.filter(
      (c) => this.metrics.get(c.id)?.roas < 1.0
    );
    if (lossCalampaigns.length > 0) {
      alerts.push({
        severity: 'critical',
        type: '손실 캠페인',
        message: `${lossCalampaigns.length}개 캠페인이 손실을 기록 중입니다`,
        affected: lossCalampaigns.map((c) => c.name),
      });
    }

    const noConversionCampaigns = this.campaigns.filter((c) => {
      const m = this.metrics.get(c.id);
      return m && m.conversions === 0 && m.clicks > 20;
    });
    if (noConversionCampaigns.length > 0) {
      alerts.push({
        severity: 'warning',
        type: '전환 부족',
        message: `${noConversionCampaigns.length}개 캠페인에서 전환이 발생하지 않았습니다`,
        affected: noConversionCampaigns.map((c) => c.name),
      });
    }

    // 추천사항
    const recommendations = [
      '상위 성과 캠페인 예산을 20% 증가하세요',
      '저성과 캠페인의 광고 문구를 개선하세요',
      'A/B 테스트 결과를 바탕으로 최적의 카피를 선정하세요',
      '새로운 지역에 확장 캠페인을 생성하세요',
    ];

    return {
      timestamp: new Date().toISOString(),
      summary: {
        totalCampaigns: this.campaigns.length,
        activeCampaigns: this.campaigns.filter((c) => (this.metrics.get(c.id)?.conversions || 0) > 0).length,
        totalSpend,
        totalConversions,
        averageROAS: Math.round(averageROAS * 100) / 100,
        averageCPC: Math.round(averageCPC),
      },
      topPerformers,
      underperformers,
      platformMetrics: platformData,
      alerts,
      recommendations,
    };
  }

  generateHTML(dashboard) {
    console.log('📄 HTML 대시보드 생성 중...\n');

    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>마케팅 캠페인 대시보드</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    .header {
      background: white;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    h1 { color: #333; margin-bottom: 10px; font-size: 32px; }
    .timestamp { color: #999; font-size: 14px; }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }
    .summary-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      border-top: 4px solid #667eea;
    }
    .summary-label { color: #666; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 1px; }
    .summary-value { font-size: 28px; font-weight: bold; color: #333; }

    .section {
      background: white;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .section-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #333;
      padding-bottom: 10px;
      border-bottom: 2px solid #667eea;
    }

    .alert-list { display: flex; flex-direction: column; gap: 12px; }
    .alert {
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid;
    }
    .alert.critical {
      background: #fff5f5;
      border-color: #f56565;
    }
    .alert.warning {
      background: #fffaf0;
      border-color: #ed8936;
    }
    .alert.info {
      background: #ebf8ff;
      border-color: #4299e1;
    }
    .alert-title {
      font-weight: bold;
      margin-bottom: 5px;
      font-size: 14px;
    }
    .alert-message {
      font-size: 13px;
      color: #666;
    }

    .campaign-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 15px;
    }
    .campaign-card {
      background: #f9f9f9;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 15px;
    }
    .campaign-name { font-weight: bold; margin-bottom: 10px; color: #333; }
    .campaign-stat {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      font-size: 13px;
      border-bottom: 1px solid #eee;
    }
    .campaign-stat:last-child { border-bottom: none; }
    .stat-label { color: #666; }
    .stat-value { font-weight: bold; color: #333; }

    .recommendation-list {
      list-style: none;
      padding: 0;
    }
    .recommendation-list li {
      padding: 10px 0;
      padding-left: 30px;
      position: relative;
      color: #555;
      line-height: 1.6;
    }
    .recommendation-list li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #667eea;
      font-weight: bold;
    }

    .platform-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }
    .platform-stat {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }
    .platform-name {
      font-weight: bold;
      margin-bottom: 10px;
      color: #333;
      text-transform: uppercase;
      font-size: 12px;
    }
    .platform-detail {
      font-size: 13px;
      color: #666;
      padding: 5px 0;
    }
    .platform-roas {
      font-size: 18px;
      font-weight: bold;
      color: #667eea;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 마케팅 캠페인 대시보드</h1>
      <div class="timestamp">마지막 업데이트: ${dashboard.timestamp}</div>
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
          <div class="alert-title">🔔 ${alert.type}</div>
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
      <div class="campaign-grid">
        ${dashboard.topPerformers
          .map(
            (c) => `
        <div class="campaign-card">
          <div class="campaign-name">${c.name}</div>
          <div class="campaign-stat">
            <span class="stat-label">플랫폼:</span>
            <span class="stat-value">${c.platform.toUpperCase()}</span>
          </div>
          <div class="campaign-stat">
            <span class="stat-label">ROAS:</span>
            <span class="stat-value">${c.metrics.roas}</span>
          </div>
          <div class="campaign-stat">
            <span class="stat-label">전환:</span>
            <span class="stat-value">${c.metrics.conversions}개</span>
          </div>
          <div class="campaign-stat">
            <span class="stat-label">CPC:</span>
            <span class="stat-value">${c.metrics.cpc}원</span>
          </div>
        </div>
        `
          )
          .join('')}
      </div>
    </div>

    <div class="section">
      <div class="section-title">📊 플랫폼별 성과</div>
      <div class="platform-stats">
        ${dashboard.platformMetrics
          .map(
            (p) => `
        <div class="platform-stat">
          <div class="platform-name">${p.platform}</div>
          <div class="platform-detail">캠페인: ${p.campaignCount}개</div>
          <div class="platform-detail">평균 CPC: ${p.averageCPC}원</div>
          <div class="platform-roas">ROAS: ${p.averageROAS}</div>
        </div>
        `
          )
          .join('')}
      </div>
    </div>

    <div class="section">
      <div class="section-title">💡 추천사항</div>
      <ul class="recommendation-list">
        ${dashboard.recommendations.map((rec) => `<li>${rec}</li>`).join('')}
      </ul>
    </div>
  </div>
</body>
</html>`;

    return html;
  }

  run() {
    console.log('🚀 마케팅 대시보드 생성 시작\n');

    this.loadData();
    const dashboard = this.buildDashboard();
    const html = this.generateHTML(dashboard);

    // JSON 저장
    const jsonPath = path.join(__dirname, '../.output/dashboard-data.json');
    fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
    fs.writeFileSync(jsonPath, JSON.stringify(dashboard, null, 2));
    console.log(`✓ JSON 저장: ${jsonPath}`);

    // HTML 저장
    const htmlPath = path.join(__dirname, '../.output/dashboard.html');
    fs.writeFileSync(htmlPath, html);
    console.log(`✓ HTML 저장: ${htmlPath}`);

    // 요약
    console.log('\n═════════════════════════════════════════════════');
    console.log('✅ 대시보드 생성 완료!\n');
    console.log(`📊 요약:`);
    console.log(`   • 총 캠페인: ${dashboard.summary.totalCampaigns}개`);
    console.log(`   • 활성 캠페인: ${dashboard.summary.activeCampaigns}개`);
    console.log(`   • 월간 지출: ${(dashboard.summary.totalSpend / 1000000).toFixed(1)}M원`);
    console.log(`   • 평균 ROAS: ${dashboard.summary.averageROAS}`);
    console.log(`   • 알림: ${dashboard.alerts.length}개\n`);

    console.log(`🌐 브라우저에서 확인:`);
    console.log(`   ${htmlPath}\n`);
  }
}

const generator = new DashboardGenerator();
generator.run();
