#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, '../content');
const blogPostsFile = path.join(__dirname, '../lib/blog-posts.ts');
const outputDir = path.join(__dirname, '../.output');
const blogPostsJsonFile = path.join(outputDir, 'blog-posts.json');

// SEO 최적화 키워드 및 콘텐츠 템플릿
const keywords = [
  {
    main: '앱 개발',
    subs: ['비용', '기간', '견적', '외주', '비전공자'],
    region: '수원'
  },
  {
    main: '홈페이지 제작',
    subs: ['비용', '업체', 'SEO', '견적', '템플릿'],
    region: '인계동'
  },
  {
    main: 'Flutter 개발',
    subs: ['비용', '크로스플랫폼', '장점', '단점', 'MVP'],
    region: '경기도'
  },
  {
    main: '랜딩페이지',
    subs: ['제작', '비용', 'SEO', '전환율', '디자인'],
    region: '온라인'
  },
  {
    main: 'MVP 개발',
    subs: ['비용', '기간', '검증', '전략', '실패 예방'],
    region: '전국'
  }
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 50);
}

function generateKeywordVariations(main, sub, region) {
  return [
    `${main} ${sub}`,
    `${region} ${main} ${sub}`,
    `${main} ${sub} 외주`,
    `${sub} ${main} 비용`,
    `${main}${sub} 어떻게`,
  ];
}

function generateBlogPost(main, sub, region, index) {
  const title = `${main} ${sub}: 실무 가이드 ${index + 1}`;
  const slug = slugify(title);
  const publishDate = new Date();
  publishDate.setDate(publishDate.getDate() - index * 2);

  const keywords = generateKeywordVariations(main, sub, region);
  const dateStr = publishDate.toISOString().split('T')[0];

  return {
    slug,
    title,
    description: `${region}에서 ${main}을 ${sub}하려는 분을 위한 실무 가이드. 비용, 기간, 선택 기준, 외주 팁을 정리했습니다.`,
    keywords,
    publishedAt: dateStr,
    readingMinutes: Math.floor(Math.random() * 4) + 4,
    paragraphs: [],
    htmlBody: generateHtmlBody(main, sub, region),
    faqs: generateFAQs(main, sub)
  };
}

function generateHtmlBody(main, sub, region) {
  return `
<article style="max-width: 900px; margin: 0 auto; font-size: 16px; line-height: 1.8; color: #333;">
  <p style="font-size: 18px; margin-bottom: 20px;"><strong>${main}${sub}</strong>는 많은 분이 물어보는 주제입니다. 이 글에서는 실무 기준으로 ${sub}하는 방법, 예상 비용과 기간, 흔한 실수를 정리했습니다.</p>

  <h2 style="font-size: 24px; margin: 30px 0 15px; color: #222; border-bottom: 2px solid #667eea; padding-bottom: 10px;">${main} ${sub}의 기본</h2>
  <p>${main} 프로젝트에서 ${sub}은 핵심 단계입니다. 이 단계를 제대로 이해하고 진행하면 후속 작업의 리스크가 크게 줄어듭니다.</p>

  <ul style="margin: 15px 0 15px 20px; padding-left: 20px;">
  <li style="margin-bottom: 10px;">${sub}의 목적을 먼저 명확히 하기</li>
  <li style="margin-bottom: 10px;">예상 비용과 일정을 미리 파악하기</li>
  <li>외주사 선정 시 확인할 체크리스트</li>
  </ul>

  <h2 style="font-size: 24px; margin: 30px 0 15px; color: #222; border-bottom: 2px solid #667eea; padding-bottom: 10px;">실무에서 주의할 점</h2>
  <p>${region}에서 ${main} 작업을 할 때 가장 많은 실수는 "기준을 미리 정하지 않는 것"입니다. 다음 항목을 계약 전에 명시하면 분쟁을 크게 줄 수 있습니다:</p>

  <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left; font-weight: bold;">항목</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left; font-weight: bold;">확인 사항</th>
      <th style="padding: 12px; border: 1px solid #ddd; text-align: left; font-weight: bold;">왜 중요한가</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">범위</td>
      <td style="padding: 12px; border: 1px solid #ddd;">화면·기능·예외 처리를 문서화</td>
      <td style="padding: 12px; border: 1px solid #ddd;">범위 변경 요청의 기준을 만듦</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">일정</td>
      <td style="padding: 12px; border: 1px solid #ddd;">중간 데모·검수 일정을 정함</td>
      <td style="padding: 12px; border: 1px solid #ddd;">방향이 어긋났을 때 빨리 파악</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #ddd;">소유권</td>
      <td style="padding: 12px; border: 1px solid #ddd;">소스코드·계정 권한이 누구 명의</td>
      <td style="padding: 12px; border: 1px solid #ddd;">나중에 다른 개발사로 이전 가능</td>
    </tr>
  </tbody>
  </table>

  <h2 style="font-size: 24px; margin: 30px 0 15px; color: #222; border-bottom: 2px solid #667eea; padding-bottom: 10px;">${main} ${sub}의 시장 상황</h2>
  <p>현재 시장에서는 다음과 같은 트렌드가 있습니다:</p>
  <ul style="margin: 15px 0 15px 20px; padding-left: 20px;">
  <li style="margin-bottom: 10px;">원격 작업으로 지역의 경계가 낮아짐</li>
  <li style="margin-bottom: 10px;">정액제 패키지로 투명한 가격 제시가 기준</li>
  <li>납품 후 직접 운영할 수 있게 교육을 포함하는 곳이 증가</li>
  </ul>

  <h2 style="font-size: 24px; margin: 30px 0 15px; color: #222; border-bottom: 2px solid #667eea; padding-bottom: 10px;">자주 묻는 질문</h2>
  <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <div style="margin-bottom: 20px;">
      <h3 style="font-size: 16px; margin-bottom: 8px; color: #333; font-weight: bold;">Q. ${main} ${sub}에 보통 얼마가 들나요?</h3>
      <p style="color: #666; margin-left: 20px;">규모와 복잡도에 따라 다르지만, 기본적으로는 ${sub}의 범위가 비용을 결정합니다. 구체적인 사항은 전문가와 상담해서 판단하세요.</p>
    </div>
    <div>
      <h3 style="font-size: 16px; margin-bottom: 8px; color: #333; font-weight: bold;">Q. 어떤 업체를 고르는 것이 좋을까요?</h3>
      <p style="color: #666; margin-left: 20px;">가격을 먼저 공개하고, 소스코드·계정 소유권을 명시하며, 포트폴리오가 실제 스토어에 올라간 곳을 추천합니다.</p>
    </div>
  </div>
</article>
  `.trim();
}

function generateFAQs(main, sub) {
  return [
    {
      q: `${main} ${sub}에 얼마나 드나요?`,
      a: `${sub}의 범위와 복잡도에 따라 달라집니다. 구체적인 요구사항을 정리하고 여러 업체에서 견적을 받아 비교하는 것이 좋습니다.`
    },
    {
      q: `${main} 업체는 어떻게 고르나요?`,
      a: `가격을 먼저 공개하는지, 소스코드·계정 소유권을 명시하는지, 실제 포트폴리오가 있는지를 확인하세요.`
    }
  ];
}

function main() {
  console.log('🚀 블로그 포스트 자동 생성 시작...');

  const generatedPosts = [];
  let postIndex = 0;

  keywords.forEach((kw) => {
    kw.subs.forEach((sub) => {
      const post = generateBlogPost(kw.main, sub, kw.region, postIndex);
      generatedPosts.push(post);
      console.log(`✓ 생성됨: ${post.title} (/${post.slug}/)`);
      postIndex++;
    });
  });

  // lib/blog-posts.ts 읽기
  let content = fs.readFileSync(blogPostsFile, 'utf-8');

  // 기존 포스트는 유지하고 새 포스트 추가
  const postArrayMatch = content.match(/export const BLOG_POSTS: BlogPost\[\] = \[([\s\S]*?)\n\];/);

  if (postArrayMatch) {
    const newPostsStr = generatedPosts
      .map(p => JSON.stringify(p, null, 2).replace(/"/g, "'"))
      .join(',\n  ');

    // 새 포스트를 배열에 추가
    const updatedContent = content.replace(
      /export const BLOG_POSTS: BlogPost\[\] = \[([\s\S]*?)\n\];/,
      (match) => {
        // 기존 배열에서 마지막 항목 찾기
        const lastCommaIndex = match.lastIndexOf(',');
        return match.slice(0, lastCommaIndex) + ',' + newPostsStr + '\n];';
      }
    );

    fs.writeFileSync(blogPostsFile, updatedContent);
    console.log(`\n✅ ${generatedPosts.length}개 포스트가 추가되었습니다.`);
  }

  // .output 디렉토리가 없으면 생성
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 생성된 포스트를 JSON 파일로 저장 (워크플로우용)
  fs.writeFileSync(blogPostsJsonFile, JSON.stringify(generatedPosts, null, 2));
  console.log(`📄 JSON 파일 저장: ${blogPostsJsonFile}`);

  // 각 포스트별 메타데이터 로깅
  console.log('\n📊 생성된 포스트 목록:');
  console.log('='.repeat(60));
  generatedPosts.forEach((p) => {
    console.log(`
📄 ${p.title}
   URL: /blog/${p.slug}/
   Keywords: ${p.keywords.join(', ')}
   Published: ${p.publishedAt}
   Reading Time: ${p.readingMinutes}분
    `);
  });

  console.log('\n✨ 블로그 자동 생성 완료!');
}

main();
