#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 블로그 생성 함수
function generateBlogPost(mainKeyword, subKeyword, region, index) {
  const title = `${mainKeyword} ${subKeyword}: 비용·기간·선택 기준 완벽 정리 #${index + 1}`;
  const slug = slugify(`${mainKeyword}-${subKeyword}-${index + 1}`);

  const publishDate = new Date();
  publishDate.setDate(publishDate.getDate() - index * 2);
  const dateStr = publishDate.toISOString().split('T')[0];

  const keywords = [
    `${mainKeyword} ${subKeyword}`,
    `${region} ${mainKeyword}`,
    `${mainKeyword} ${subKeyword} 비용`,
    `${mainKeyword} ${subKeyword} 기간`,
    `${region} ${mainKeyword} ${subKeyword}`,
  ];

  return {
    slug,
    title,
    description: `${region}에서 ${mainKeyword}을 ${subKeyword}하려는 분을 위한 완벽 가이드. 비용, 기간, 선택 기준, 체크리스트를 정리했습니다.`,
    keywords,
    publishedAt: dateStr,
    readingMinutes: Math.floor(Math.random() * 3) + 5,
    paragraphs: [],
    htmlBody: generateHtmlBody(mainKeyword, subKeyword, region),
    faqs: generateFAQs(mainKeyword, subKeyword)
  };
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 50);
}

function generateHtmlBody(main, sub, region) {
  const scenarios = [
    `<p>많은 ${region} 기업과 스타트업이 "${main}을 ${sub}하는 데 얼마나 들까?"를 검색합니다. 답부터 드리면, <strong>${sub}의 범위와 복잡도에 따라 크게 달라집니다.</strong></p>`,
    `<p>${region}에서 ${main} 프로젝트를 준비 중이신가요? ${sub}는 전체 비용과 일정을 결정하는 핵심 단계입니다. 이 글에서 현실적인 비용 구간과 선택 기준을 정리했습니다.</p>`,
    `<p>${main}을 ${sub}할 때 가장 많이 하는 실수는 "기준을 미리 정하지 않는 것"입니다. 이 글은 계약 전에 확인할 체크리스트와 ${region} 시장 기준 비용을 정리합니다.</p>`
  ];

  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

  return `${scenario}

<h2>${main} ${sub}의 기본 이해</h2>
<p>${sub}는 ${main} 프로젝트에서 매우 중요한 단계입니다. 이 단계를 제대로 이해하고 준비하면 후속 작업의 리스크가 크게 줄어듭니다.</p>

<h3>${region} 시장 기준 비용</h3>
<table>
<thead><tr><th>유형</th><th>예상 범위</th><th>기간</th></tr></thead>
<tbody>
<tr><td>기본형</td><td>300만~500만 원</td><td>1~2주</td></tr>
<tr><td>표준형</td><td>500만~1,500만 원</td><td>2~4주</td></tr>
<tr><td>프리미엄</td><td>1,500만 원 이상</td><td>4주 이상</td></tr>
</tbody>
</table>

<h2>${sub}에서 흔한 실수</h2>
<ul>
<li><strong>범위를 미리 정하지 않기</strong> - 개발 중 요청이 계속 증가</li>
<li><strong>중간 검수 없이 최종 납품만 받기</strong> - 방향이 어긋났을 때 수정 비용이 엄청남</li>
<li><strong>소스코드·계정 소유권 미확인</strong> - 나중에 수정이나 이전이 불가능</li>
<li><strong>정액 가격이 아닌 시간당 계약</strong> - 일정이 늘어나면서 비용도 함께 증가</li>
</ul>

<h2>${main} ${sub}의 선택 기준</h2>
<p>외주사나 업체를 고를 때 확인해야 할 5가지:</p>
<ol>
<li>가격을 먼저 공개하는가 (협상 없이 패키지 제시)</li>
<li>소스코드·계정 소유권을 명시하는가</li>
<li>개발 전에 화면을 먼저 확정하는가</li>
<li>납품 후 직접 수정할 수 있게 교육해주는가</li>
<li>실제 스토어에 올라간 포트폴리오가 있는가</li>
</ol>

<h2>${region}에서의 특수성</h2>
<p>${region}의 시장 환경을 반영한 특수성이 있습니다:</p>
<ul>
<li>지역 기반 기업들의 예산 제약 (로컬 시장)</li>
<li>원격 협업의 증가로 지역 경계 낮아짐</li>
<li>표준화된 가격 공개의 중요성 증대</li>
</ul>

<h2>자주 묻는 질문</h2>
<dl>
<dt>Q. ${main} ${sub}에 보통 얼마가 들나요?</dt>
<dd>${sub}의 범위에 따라 300만~1,500만 원 사이입니다. 상세 요구사항을 바탕으로 여러 업체에서 견적을 받아 비교하세요.</dd>
<dt>Q. 기간은 얼마나 걸리나요?</dt>
<dd>범위가 명확할 때 1~4주 정도입니다. 범위가 불분명하면 기간이 늘어날 수 있으니 사전에 문서화하세요.</dd>
<dt>Q. 어떻게 업체를 선택하나요?</dt>
<dd>정액 가격 공개, 소스코드 이관, 포트폴리오 확인, 중간 데모 과정 포함 여부를 확인하세요.</dd>
</dl>`;
}

function generateFAQs(main, sub) {
  const faqs = [
    {
      q: `${main} ${sub}에 얼마가 들나요?`,
      a: `${sub}의 범위와 복잡도에 따라 300만~1,500만 원이 일반적입니다. 정확한 비용은 상세 요구사항을 바탕으로 여러 업체에서 견적을 받아 비교해야 합니다.`
    },
    {
      q: `${sub} 기간은 얼마나 걸리나요?`,
      a: `범위가 명확할 때 1~4주 정도입니다. 범위가 불분명하거나 변경이 많으면 기간이 늘어날 수 있으니, 계약 전에 상세히 합의하세요.`
    },
    {
      q: `좋은 업체는 어떻게 고르나요?`,
      a: `가격을 먼저 공개하고, 소스코드 이관을 보장하며, 실제 포트폴리오를 보여주고, 중간 데모 과정을 포함하는 업체를 추천합니다.`
    }
  ];

  if (Math.random() > 0.5) {
    faqs.push({
      q: `${main}은 무엇인가요?`,
      a: `${main}은 현대 비즈니스에서 필수적인 요소입니다. 효율성을 높이고 비용을 절감하며 경쟁력을 강화하는 데 핵심 역할을 합니다.`
    });
  }

  return faqs;
}

function main() {
  console.log('🚀 대량 블로그 포스트 생성 시작...\n');

  const configPath = path.join(__dirname, '../content/blog-generation-config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  const blogPostsPath = path.join(__dirname, '../lib/blog-posts.ts');
  let blogPostsContent = fs.readFileSync(blogPostsPath, 'utf-8');

  let totalGenerated = 0;
  const newPosts = [];

  config.blogGenerationStrategy.topics.forEach((topic) => {
    const { mainKeyword, subKeywords, region, postsToGenerate } = topic;

    for (let i = 0; i < postsToGenerate; i++) {
      const subKeyword = subKeywords[i % subKeywords.length];
      const post = generateBlogPost(mainKeyword, subKeyword, region, i);
      newPosts.push(post);
      totalGenerated++;

      console.log(`✓ [${totalGenerated}] ${post.title}`);
    }
  });

  // blog-posts.ts 파일에 새 포스트 추가
  const postsJson = newPosts.map(p => JSON.stringify(p, null, 2));

  // 마지막 닫는 괄호 이전에 포스트 추가
  const lastArrayIndex = blogPostsContent.lastIndexOf('  },\n  {');
  const insertPosition = blogPostsContent.indexOf('\n]', lastArrayIndex);

  if (insertPosition !== -1) {
    const newContent =
      blogPostsContent.slice(0, insertPosition) +
      ',\n  ' +
      postsJson.join(',\n  ') +
      blogPostsContent.slice(insertPosition);

    fs.writeFileSync(blogPostsPath, newContent);
    console.log(`\n✅ ${totalGenerated}개 포스트가 추가되었습니다!`);
  }

  // 통계
  console.log('\n📊 생성 통계:');
  console.log('='.repeat(60));
  console.log(`총 생성된 포스트: ${totalGenerated}개`);
  console.log(`주제별 생성:`, config.blogGenerationStrategy.topics.map(t =>
    `${t.mainKeyword}(${t.postsToGenerate}개)`
  ).join(', '));

  const regions = [...new Set(config.blogGenerationStrategy.topics.map(t => t.region))];
  console.log(`지역별 최적화: ${regions.join(', ')}`);

  console.log('\n✨ 블로그 자동 생성 완료!');
  console.log('📝 다음 단계:');
  console.log('   1. npm run dev - 개발 서버 시작');
  console.log('   2. http://localhost:3000/blog - 블로그 확인');
  console.log('   3. git commit - 변경사항 커밋');
}

main();
