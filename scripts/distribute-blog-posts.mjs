#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 배포 채널 설정
const platforms = {
  website: {
    name: '웹사이트',
    url: 'https://reumlab.com',
    description: '공식 웹사이트 - 메인 채널',
    seoWeight: 1.0
  },
  naver_place: {
    name: '네이버플레이스',
    url: 'https://naver.me/FORRCoFc',
    description: '네이버 플레이스 - 지역 검색 최적화',
    seoWeight: 0.8
  },
  naver_blog: {
    name: '네이버 블로그',
    url: 'https://blog.naver.com',
    description: '네이버 블로그 - 검색 노출 확대',
    seoWeight: 0.7
  },
  medium: {
    name: 'Medium',
    url: 'https://medium.com',
    description: 'Medium - 해외 개발자 커뮤니티',
    seoWeight: 0.6
  }
};

// 지역별 키워드 세트 (SEO 다양화)
const regions = [
  { name: '수원', code: 'suwon', weight: 1.0 },
  { name: '경기도', code: 'gyeonggi', weight: 0.8 },
  { name: '경기남부', code: 'south-gyeonggi', weight: 0.7 },
  { name: '인천', code: 'incheon', weight: 0.6 },
  { name: '전국', code: 'nationwide', weight: 0.9 }
];

// 서비스 카테고리
const services = [
  { name: '앱 개발', keywords: ['앱개발', 'iOS', 'Android', 'Flutter'] },
  { name: '웹 개발', keywords: ['웹개발', '웹사이트', '랜딩페이지'] },
  { name: 'MVP 개발', keywords: ['MVP', '스타트업', '시장검증'] },
  { name: '외주 상담', keywords: ['외주', '개발 비용', '견적'] }
];

function generateDistributionPlan(blogPost) {
  const plan = {
    postId: blogPost.slug,
    title: blogPost.title,
    description: blogPost.description,
    keywords: blogPost.keywords,
    publishDate: blogPost.publishedAt,
    distributions: []
  };

  // 각 플랫폼별 배포 전략
  Object.entries(platforms).forEach(([platformKey, platform]) => {
    regions.forEach((region) => {
      const distribution = {
        platform: platform.name,
        platformKey,
        region: region.name,
        url: `${platform.url}/blog/${blogPost.slug}?region=${region.code}`,
        seoScore: (platform.seoWeight * region.weight * 100).toFixed(0),
        strategy: generateStrategy(blogPost, platform, region),
        schedule: calculateSchedule(blogPost.publishedAt, platformKey, region.code)
      };
      plan.distributions.push(distribution);
    });
  });

  return plan;
}

function generateStrategy(post, platform, region) {
  return {
    title: `[${region}] ${post.title}`,
    excerpt: `${region}에서 ${post.description.substring(0, 100)}...`,
    hashtags: generateHashtags(post.keywords, region.name),
    callToAction: `📞 ${region} ${post.title} 무료 상담 (010-8111-9370)`,
    images: [
      `hero-${post.slug}`,
      `guide-${post.slug}`,
      `cta-${post.slug}`
    ]
  };
}

function generateHashtags(keywords, region) {
  const baseHashtags = keywords.map(k => `#${k.replace(/\s+/g, '')}`);
  const regionHashtags = [
    `#${region}`,
    `#${region}개발`,
    `#${region}외주`,
    '#앱개발 #개발비용 #외주'
  ];
  return [...baseHashtags, ...regionHashtags].slice(0, 10);
}

function calculateSchedule(publishDate, platformKey, regionCode) {
  const platformDelays = {
    website: 0,
    naver_place: 1,
    naver_blog: 2,
    medium: 3
  };

  const regionDelays = {
    suwon: 0,
    gyeonggi: 0,
    'south-gyeonggi': 1,
    incheon: 1,
    nationwide: 2
  };

  const date = new Date(publishDate);
  const delayDays = (platformDelays[platformKey] || 0) + (regionDelays[regionCode] || 0);
  date.setDate(date.getDate() + delayDays);

  return {
    publishDate: date.toISOString().split('T')[0],
    delayDays,
    platformPriority: 5 - (platformDelays[platformKey] || 0)
  };
}

function generateSitemapEntry(post) {
  return {
    url: `/blog/${post.slug}/`,
    lastmod: post.publishedAt,
    changefreq: 'weekly',
    priority: 0.8,
    alternates: regions.map(r => ({
      url: `/blog/${post.slug}/?region=${r.code}`,
      region: r.name
    }))
  };
}

function generateRobotsRules() {
  return `
# 🤖 자동 생성 블로그 SEO 규칙
User-agent: *
Allow: /blog/
Allow: /blog/?region=*

# 싱글 접근 최적화
User-agent: Googlebot
Crawl-delay: 1

User-agent: Bingbot
Crawl-delay: 2

# 스펨 봇 차단
User-agent: MJ12bot
Disallow: /

User-agent: AhrefsBot
Disallow: /

Sitemap: https://reumlab.com/sitemap.xml
Sitemap: https://reumlab.com/blog-sitemap.xml
  `.trim();
}

function main() {
  console.log('🌍 멀티플랫폼 배포 계획 생성...\n');

  // 예제 블로그 포스트
  const samplePost = {
    slug: 'app-gaebal-biyong-julineun-bab',
    title: '앱 개발 비용 총정리',
    description: '앱 개발 비용은 얼마일까? 범위별 견적과 줄이는 법을 정리했습니다.',
    keywords: ['앱 개발 비용', 'MVP 비용', '외주 비용'],
    publishedAt: '2026-06-26'
  };

  const distributionPlan = generateDistributionPlan(samplePost);

  // 배포 계획 파일 저장
  const distOutputPath = path.join(__dirname, '../.output/distribution-plan.json');
  fs.mkdirSync(path.dirname(distOutputPath), { recursive: true });
  fs.writeFileSync(distOutputPath, JSON.stringify(distributionPlan, null, 2));

  console.log(`📋 배포 계획: ${distOutputPath}`);
  console.log(`\n📊 총 배포 채널: ${distributionPlan.distributions.length}개\n`);

  // 채널별 통계
  const byPlatform = {};
  distributionPlan.distributions.forEach((d) => {
    byPlatform[d.platform] = (byPlatform[d.platform] || 0) + 1;
  });

  console.log('📍 플랫폼별 배포:');
  Object.entries(byPlatform).forEach(([platform, count]) => {
    console.log(`   ${platform}: ${count}개 지역 × 채널`);
  });

  // Robots.txt 생성
  const robotsPath = path.join(__dirname, '../public/robots.txt');
  fs.mkdirSync(path.dirname(robotsPath), { recursive: true });
  fs.writeFileSync(robotsPath, generateRobotsRules());
  console.log(`\n🤖 Robots.txt 생성: ${robotsPath}`);

  // Sitemap 항목 생성
  const sitemapEntry = generateSitemapEntry(samplePost);
  const sitemapPath = path.join(__dirname, '../.output/blog-sitemap-entry.json');
  fs.writeFileSync(sitemapPath, JSON.stringify(sitemapEntry, null, 2));
  console.log(`🗺️  Sitemap 항목: ${sitemapPath}`);

  // 배포 통계
  console.log('\n📈 SEO 배포 전략:');
  console.log('┌─────────────────────────────────────┐');
  console.log('│ 플랫폼별 SEO 가중치                  │');
  Object.entries(platforms).forEach(([key, platform]) => {
    console.log(`│ ${platform.name.padEnd(15)} ${(platform.seoWeight * 100).toFixed(0)}%`);
  });
  console.log('└─────────────────────────────────────┘');

  console.log('\n🎯 지역별 배포 일정:');
  const schedules = {};
  distributionPlan.distributions.forEach((d) => {
    const key = d.schedule.publishDate;
    schedules[key] = (schedules[key] || 0) + 1;
  });

  Object.entries(schedules)
    .sort()
    .forEach(([date, count]) => {
      console.log(`   ${date}: ${count}개 채널 배포`);
    });

  console.log('\n✅ 멀티플랫폼 배포 계획 생성 완료!');
  console.log('💡 다음 단계:');
  console.log('   1. 각 플랫폼별 API 연동 (Naver, Medium 등)');
  console.log('   2. 일정에 따라 자동 게시');
  console.log('   3. 분석 대시보드로 성과 추적');
}

main();
