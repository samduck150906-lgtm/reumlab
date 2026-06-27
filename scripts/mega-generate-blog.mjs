#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 더 충실한 콘텐츠 생성
function generateRichBlogPost(mainKeyword, subKeyword, region, index) {
  const title = `${mainKeyword} ${subKeyword}: 2026년 실무 완벽 가이드 (비용·기간·체크리스트)`;
  const slug = slugify(`${mainKeyword}-${subKeyword}-guide-${index}`);

  const publishDate = new Date();
  publishDate.setDate(publishDate.getDate() - index);
  const dateStr = publishDate.toISOString().split('T')[0];

  const keywords = [
    `${mainKeyword} ${subKeyword}`,
    `${region} ${mainKeyword}`,
    `${mainKeyword} ${subKeyword} 비용`,
    `${mainKeyword} ${subKeyword} 외주`,
    `${mainKeyword} ${subKeyword} 가이드`,
    `${region} ${mainKeyword} ${subKeyword}`,
  ];

  return {
    slug,
    title,
    description: `${region}에서 ${mainKeyword}을(를) ${subKeyword}하는 비용, 기간, 선택 기준부터 시작해서 계약 체크리스트, 흔한 실수까지 정리한 2026년 최신 완벽 가이드.`,
    keywords,
    publishedAt: dateStr,
    readingMinutes: 8 + Math.floor(Math.random() * 5),
    paragraphs: [],
    htmlBody: generateRichHtmlBody(mainKeyword, subKeyword, region),
    faqs: generateRichFAQs(mainKeyword, subKeyword, region)
  };
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 60);
}

function generateRichHtmlBody(main, sub, region) {
  return `<p>많은 ${region} 창업자와 소상공인, 중소기업이 "${main}을 ${sub}하려고 하는데 얼마가 들까?"를 검색합니다. 이 글은 <strong>2026년 실제 시장 기준</strong>으로 정리한 완벽 가이드입니다. 비용·기간·선택 기준부터 계약 체크리스트, 흔한 실수와 해결법까지 모두 담았습니다.</p>

<h2>${main} ${sub}: 기본 이해</h2>
<p>${main}은 현대 비즈니스에서 경쟁력을 결정하는 핵심 요소입니다. 특히 ${sub}는 프로젝트 전체 성패를 좌우하는 가장 중요한 단계입니다. 이 단계를 제대로 이해하고 준비하면:</p>
<ul>
<li>전체 프로젝트 기간을 정확하게 예측</li>
<li>불필요한 비용 증가 차단</li>
<li>후속 작업의 리스크 최소화</li>
<li>팀의 사기와 생산성 유지</li>
<li>고객 만족도 상향</li>
</ul>

<h2>${region} 시장 기준 비용 (2026년)</h2>
<p>${region} 지역의 실제 시장 기준입니다. 개발사 규모, 경력, 기술 스택에 따라 달라질 수 있으므로 최소 3곳 이상에서 견적을 받아 비교하세요.</p>

<table>
<thead><tr><th>난이도</th><th>범위</th><th>예상 비용</th><th>기간</th><th>팀 구성</th></tr></thead>
<tbody>
<tr><td><strong>입문</strong></td><td>기본 기능 중심<br/>화면 3~5개<br/>DB 단순</td><td>200만~400만 원</td><td>1~2주</td><td>1인 또는 소규모</td></tr>
<tr><td><strong>초급</strong></td><td>기본 기능 완성<br/>화면 5~10개<br/>간단한 DB</td><td>400만~700만 원</td><td>2~3주</td><td>2~3명</td></tr>
<tr><td><strong>중급</strong></td><td>추가 기능 포함<br/>화면 10~20개<br/>복잡한 DB<br/>관리자 기능</td><td>700만~1,500만 원</td><td>3~4주</td><td>3~5명</td></tr>
<tr><td><strong>고급</strong></td><td>고도화 기능<br/>실시간 처리<br/>AI/ML 연동<br/>국제화 지원</td><td>1,500만~3,000만 원</td><td>4주~3개월</td><td>5명 이상</td></tr>
<tr><td><strong>엔터프라이즈</strong></td><td>대규모 시스템<br/>복잡한 요구사항<br/>높은 안정성<br/>커스터마이징</td><td>3,000만 원~</td><td>3개월~</td><td>10명 이상</td></tr>
</tbody>
</table>

<h2>${sub}의 실무 프로세스</h2>
<p>전문 업체에서 ${main}을 ${sub}할 때 거치는 표준적인 프로세스입니다:</p>

<h3>1단계: 요구사항 정의 (1~2일)</h3>
<ul>
<li>비즈니스 목표 및 성공 기준 정의</li>
<li>타겟 사용자 및 시장 분석</li>
<li>경쟁사 분석 및 차별화 전략</li>
<li>예상 ROI 및 비용-편익 분석</li>
</ul>

<h3>2단계: 화면 설계 (2~3일)</h3>
<ul>
<li>와이어프레임 제작</li>
<li>사용자 흐름(User Flow) 정의</li>
<li>디자인 시스템 구축</li>
<li>반응형 레이아웃 검토</li>
</ul>

<h3>3단계: 기술 아키텍처 설계 (1~2일)</h3>
<ul>
<li>기술 스택 선정</li>
<li>데이터베이스 설계</li>
<li>API 구조 정의</li>
<li>보안 및 성능 전략</li>
</ul>

<h3>4단계: 개발 (기간은 범위에 따라 달라짐)</h3>
<ul>
<li>백엔드 개발</li>
<li>프론트엔드 개발</li>
<li>단위 테스트</li>
<li>통합 테스트</li>
</ul>

<h3>5단계: 검수 및 배포 (2~3일)</h3>
<ul>
<li>QA 테스트</li>
<li>사용자 수용 테스트(UAT)</li>
<li>배포 및 모니터링</li>
<li>사후 지원</li>
</ul>

<h2>${sub}에서 가장 흔한 5가지 실수</h2>

<h3>❌ 실수 1: 범위를 명확히 하지 않은 채로 시작</h3>
<p><strong>문제:</strong> "대략 이런 느낌으로" 수준의 요구사항으로 시작하면 개발 중간에 요청이 끊임없이 늘어납니다.</p>
<p><strong>해결:</strong> 화면별로 입력값·출력값·예외 처리를 문서화하고 계약서에 첨부하세요.</p>
<p><strong>체크리스트:</strong></p>
<ul>
<li>☐ 각 화면의 목적과 역할 명시</li>
<li>☐ 필수 입력 필드 및 유효성 검사 규칙</li>
<li>☐ 에러 메시지 및 예외 상황 처리</li>
<li>☐ 권한 및 접근 제어 규칙</li>
</ul>

<h3>❌ 실수 2: 중간 검수 없이 최종 납품만 받기</h3>
<p><strong>문제:</strong> 완성 직전까지 기다리면 방향이 어긋났을 때 되돌리는 비용이 기하급수적으로 증가합니다.</p>
<p><strong>해결:</strong> 2주 단위로 데모를 받고 피드백을 반영하는 프로세스를 계약에 포함하세요.</p>
<p><strong>체크리스트:</strong></p>
<ul>
<li>☐ 주 1회 또는 2주 1회 데모 일정</li>
<li>☐ 피드백 반영 기간 명시</li>
<li>☐ 변경 요청 추가 비용 규칙 정의</li>
</ul>

<h3>❌ 실수 3: 소스코드·계정 소유권 미확인</h3>
<p><strong>문제:</strong> 납품물에 소스코드나 계정 권한이 없으면 나중에 수정·이전이 불가능합니다.</p>
<p><strong>해결:</strong> 계약 전에 반드시 명시하세요.</p>
<p><strong>필수 확인 사항:</strong></p>
<ul>
<li>☐ 소스코드 전체 이관 (GitHub 포함)</li>
<li>☐ 도메인 소유권 (본인 명의)</li>
<li>☐ 호스팅 계정 권한</li>
<li>☐ 앱스토어/플레이스토어 개발자 계정</li>
<li>☐ 데이터베이스 접근 권한</li>
</ul>

<h3>❌ 실수 4: 정액 가격이 아닌 시간당 계약</h3>
<p><strong>문제:</strong> 일정이 늘어나면서 비용도 함께 증가하는 구조입니다.</p>
<p><strong>해결:</strong> 범위가 명확하면 정액제를 요청하세요.</p>
<p><strong>비용 구조 비교:</strong></p>
<table>
<thead><tr><th>구조</th><th>장점</th><th>단점</th></tr></thead>
<tbody>
<tr><td><strong>정액제</strong></td><td>비용 예측 가능<br/>업체의 효율성 유인<br/>리스크 명확</td><td>범위 변경 시 추가 비용<br/>낮은 이윤율</td></tr>
<tr><td><strong>시간당</strong></td><td>유연한 범위 조정<br/>실제 비용 반영</td><td>비용 불예측<br/>일정 연장 가능<br/>품질 관리 어려움</td></tr>
</tbody>
</table>

<h3>❌ 실수 5: 유지보수 계획 없이 론칭</h3>
<p><strong>문제:</strong> 론칭 후 버그 수정, 기능 추가, 보안 업데이트가 계속 발생합니다.</p>
<p><strong>해결:</strong> 사전에 유지보수 계획을 세우세요.</p>
<p><strong>유지보수 계획:</strong></p>
<ul>
<li>☐ 월간 또는 분기별 정기 점검</li>
<li>☐ 보안 업데이트 프로세스</li>
<li>☐ 성능 모니터링 및 최적화</li>
<li>☐ 사용자 피드백 반영 주기</li>
</ul>

<h2>좋은 업체와 계약할 때 확인해야 할 5가지</h2>

<h3>1. 가격을 먼저 공개하는가</h3>
<p>협상 없이 패키지 가격을 선공개하는 업체는 범위가 명확하고 투명한 경우가 많습니다.</p>
<p><strong>확인 포인트:</strong></p>
<ul>
<li>기본 패키지와 옵션 가격이 명확한가</li>
<li>추가 비용 항목이 사전에 설명되는가</li>
<li>선금·중금·기금 비율이 합리적인가 (보통 30-30-40)</li>
</ul>

<h3>2. 소스코드·계정 소유권을 명시하는가</h3>
<p>계약서에 명확히 기재되어야 합니다.</p>

<h3>3. 개발 전에 화면을 먼저 확정하는가</h3>
<p>코드부터 짜기 시작하는 업체는 수정 왕복이 많아집니다.</p>

<h3>4. 납품 후 직접 수정할 수 있게 교육해주는가</h3>
<p>문구 하나 바꾸는 데 매번 견적을 받는 구조인지, 직접 고칠 수 있게 교육을 주는지 확인하세요.</p>

<h3>5. 실제 스토어에 올라간 포트폴리오가 있는가</h3>
<p>시안 이미지가 아닌 실제 앱스토어에서 다운로드 가능한 포트폴리오를 확인하세요.</p>

<h2>${region}에서의 특수성</h2>
<p>${region}의 비즈니스 환경을 반영한 특수성이 있습니다:</p>
<ul>
<li><strong>예산 제약:</strong> 로컬 중소기업의 제한된 예산</li>
<li><strong>원격 협업:</strong> 지역 경계가 낮아지면서 전국의 업체와 협업 가능</li>
<li><strong>가격 투명성:</strong> 표준화된 정액 가격 제시의 중요성 증대</li>
<li><strong>빠른 출시:</strong> 시장 변화에 빠르게 대응해야 함</li>
<li><strong>지역 특화:</strong> 네이버 플레이스 등 지역 기반 서비스 최적화 필요</li>
</ul>

<h2>${main} ${sub}의 최신 트렌드 (2026)</h2>
<ul>
<li><strong>No-Code/Low-Code 활용:</strong> 단순 기능은 노코드로 빠르게 구현</li>
<li><strong>AI 보조 도구:</strong> ChatGPT, Claude 등을 활용한 개발 속도 향상</li>
<li><strong>마이크로서비스 아키텍처:</strong> 확장성과 유지보수성 향상</li>
<li><strong>DevOps 자동화:</strong> CI/CD 파이프라인으로 배포 속도 증가</li>
<li><strong>보안 우선:</strong> OWASP Top 10 대응 필수</li>
</ul>

<h2>비용을 절감하는 5가지 전략</h2>

<h3>1. MVP 개념 활용</h3>
<p>완성형이 아닌 최소 필요 기능만 먼저 구현합니다.</p>

<h3>2. 오픈소스 활용</h3>
<p>검증된 오픈소스를 적극 활용하면 개발 기간과 비용이 단축됩니다.</p>

<h3>3. 템플릿 기반 시작</h3>
<p>완전히 처음부터가 아니라 템플릿에서 커스터마이징하면 비용 절감 가능합니다.</p>

<h3>4. 단계별 개발</h3>
<p>한 번에 모든 기능을 개발하지 말고 단계별로 나누어 개발합니다.</p>

<h3>5. 자동화 도구 활용</h3>
<p>테스트 자동화, 배포 자동화 등으로 인건비를 절감합니다.</p>

<h2>자주 묻는 질문 (FAQ)</h2>
<dl>
<dt>Q. ${main} ${sub}에 보통 얼마가 들나요?</dt>
<dd>${region}을(를) 기준으로 ${sub}의 범위에 따라 200만~3,000만 원대입니다. 상세 요구사항을 정리하면 더 정확한 견적이 가능합니다. 최소 3곳 이상에서 견적을 받아 비교하세요.</dd>

<dt>Q. 기간은 얼마나 걸리나요?</dt>
<dd>범위가 명확할 때 1~4주 정도입니다. 범위가 불분명하거나 변경이 많으면 기간이 늘어날 수 있으니, 계약 전에 상세히 정의하세요.</dd>

<dt>Q. 어떤 업체를 고르는 게 좋을까요?</dt>
<dd>1) 가격을 먼저 공개하고 2) 소스코드 이관을 보장하며 3) 포트폴리오가 실제 스토어에 올라가 있고 4) 중간 데모 과정을 포함하는 업체를 추천합니다.</dd>

<dt>Q. 계약 후 범위가 늘어나면 어떻게 하나요?</dt>
<dd>추가 기능은 별도 견적으로 처리하기로 미리 정해야 합니다. 범위 변경 요청이 올 때마다 문서화해서 기록하세요.</dd>

<dt>Q. 소스코드가 없으면 안 되나요?</dt>
<dd>소스코드가 없으면 나중에 수정이나 다른 개발사로의 이전이 불가능합니다. 반드시 전체 소스코드를 이관받으세요.</dd>

<dt>Q. 유지보수는 얼마나 필요한가요?</dt>
<dd>론칭 후 첫 3개월은 버그 수정과 사용자 피드백 반영이 빈번합니다. 이후 월 1~2회 정도의 유지보수가 필요합니다. 직접 수정할 수 있는 구조라면 비용을 크게 절감할 수 있습니다.</dd>
</dl>`;
}

function generateRichFAQs(main, sub, region) {
  return [
    {
      q: `${main} ${sub}에 얼마가 들어요?`,
      a: `${region}을 기준으로 ${sub}의 범위에 따라 200만~3,000만 원대입니다. 복잡도에 따라 크게 달라지므로, 상세 요구사항을 정리하고 최소 3곳 이상에서 견적을 받아 비교하세요.`
    },
    {
      q: `좋은 업체는 어떻게 찾나요?`,
      a: `가격을 먼저 공개하고, 소스코드 이관을 명시하며, 실제 포트폴리오를 보여주고, 중간 데모 과정을 포함하는 업체를 추천합니다. 인지도보다는 투명성과 프로세스가 중요합니다.`
    },
    {
      q: `${sub} 기간은 얼마나 걸리나요?`,
      a: `범위가 명확할 때 1~4주 정도입니다. 범위가 불분명하거나 변경이 많으면 기간이 늘어날 수 있으니, 계약 전에 철저히 정의하고 문서화하세요.`
    },
    {
      q: `꼭 소스코드를 받아야 하나요?`,
      a: `네, 소스코드 전체를 받으세요. 소스코드가 없으면 나중에 수정이나 다른 개발사로의 이전이 불가능합니다. 계약서에 명시하는 것이 필수입니다.`
    },
    {
      q: `유지보수 비용은 얼마나 필요한가요?`,
      a: `론칭 후 첫 3개월은 월 100~300만 원대, 안정화 후 월 30~100만 원대가 일반적입니다. 직접 수정할 수 있는 구조로 받으면 비용을 크게 절감할 수 있습니다.`
    }
  ];
}

function main() {
  console.log('🚀 대규모 블로그 포스트 생성 시작 (500+개)...\n');

  // 더 많은 주제와 키워드 조합
  const topics = [
    { main: '앱 개발', subs: ['비용', '기간', '견적', '외주', '비전공자', '실패 예방', '인턴십', '스타트업', '회사', '학원', '취업', '포트폴리오'] },
    { main: '홈페이지 제작', subs: ['비용', '업체', 'SEO', '견적', '템플릿', '디자인', '마케팅', '개선', '반응형', '속도', '분석'] },
    { main: '웹개발', subs: ['비용', '학원', '외주', '인턴', '회사', '기술', '기간', '경력', '독학', '강의', '취업'] },
    { main: 'Flutter 개발', subs: ['비용', '크로스플랫폼', '장점', '단점', 'MVP', '배우기', '강좌', '라이브러리', '성능', '보안'] },
    { main: '랜딩페이지', subs: ['제작', '비용', 'SEO', '전환율', '디자인', '마케팅', '분석', '최적화', '사례', '도구'] },
    { main: 'MVP 개발', subs: ['비용', '기간', '검증', '전략', '실패 예방', '아이디어', '시장', '스케일', '자금', '팀'] },
    { main: '앱개발외주', subs: ['비용', '업체', '계약', '일정', '품질', '유지보수', '소스코드', '피해야할', '확인사항'] },
    { main: 'AI개발', subs: ['비용', '챗봇', '머신러닝', '딥러닝', '학습', '기술', '외주', '강의', 'GPT', '자동화'] },
    { main: '데이터분석', subs: ['비용', '학원', '강좌', '기술', '도구', '경력', '외주', '자격증', '포트폴리오'] },
    { main: '디자인', subs: ['비용', 'UI', 'UX', '웹디자인', '앱디자인', '전문가', '학원', '강좌', '도구', '경력'] },
  ];

  const regions = ['수원', '인계동', '경기도', '서울', '경기', '온라인', '전국', '부산', '대구', '인천'];

  let totalGenerated = 0;
  let newPosts = [];
  let postIndex = 0;

  // 모든 조합으로 포스트 생성
  topics.forEach((topic) => {
    topic.subs.forEach((sub) => {
      regions.forEach((region) => {
        if (totalGenerated < 500) {
          const post = generateRichBlogPost(topic.main, sub, region, postIndex);
          newPosts.push(post);
          totalGenerated++;
          postIndex++;

          if (totalGenerated % 50 === 0) {
            console.log(`✓ ${totalGenerated}개 포스트 생성됨...`);
          }
        }
      });
    });
  });

  // 블로그 포스트 파일 업데이트
  const blogPostsPath = path.join(__dirname, '../lib/blog-posts.ts');
  let blogPostsContent = fs.readFileSync(blogPostsPath, 'utf-8');

  // JSON 형식으로 변환 (TypeScript에서 사용 가능한 형태)
  const postsJson = newPosts.map(p => {
    const json = JSON.stringify(p, null, 2);
    // JSON을 TypeScript 객체 리터럴로 변환
    return json.replace(/"/g, "'").replace(/\'/g, '"');
  });

  // 파일의 마지막 포스트 뒤에 새로운 포스트 추가
  const lastArrayIndex = blogPostsContent.lastIndexOf('  },\n  {');
  const insertPosition = blogPostsContent.lastIndexOf('},\n];');

  if (insertPosition !== -1) {
    const newContent =
      blogPostsContent.slice(0, insertPosition) +
      '},\n  ' +
      newPosts.map(p => {
        // TypeScript 객체 리터럴 형식
        let obj = '{\n';
        obj += `    slug: '${p.slug}',\n`;
        obj += `    title: '${p.title.replace(/'/g, "\\'")}',\n`;
        obj += `    description: '${p.description.replace(/'/g, "\\'")}',\n`;
        obj += `    keywords: ${JSON.stringify(p.keywords)},\n`;
        obj += `    publishedAt: '${p.publishedAt}',\n`;
        obj += `    readingMinutes: ${p.readingMinutes},\n`;
        obj += `    paragraphs: [],\n`;
        obj += `    htmlBody: \`${p.htmlBody.replace(/`/g, '\\`')}\`,\n`;
        obj += `    faqs: ${JSON.stringify(p.faqs)}\n`;
        obj += '  }';
        return obj;
      }).join(',\n  ') +
      blogPostsContent.slice(insertPosition);

    fs.writeFileSync(blogPostsPath, newContent);
    console.log(`\n✅ ${totalGenerated}개 포스트가 추가되었습니다!`);
  }

  // 통계
  console.log('\n📊 생성 통계:');
  console.log('='.repeat(60));
  console.log(`총 생성된 포스트: ${totalGenerated}개`);
  console.log(`평균 읽기 시간: 8~13분`);
  console.log(`HTML 본문 크기: 약 3,000자 이상`);
  console.log(`주제 수: ${topics.length}개`);
  console.log(`지역 수: ${regions.length}개`);
  console.log(`조합 수: ${topics.length * 10 * regions.length} (일부 선택)`);

  console.log('\n✨ 블로그 자동 생성 완료!');
  console.log('📝 다음 단계:');
  console.log('   1. npm run dev - 개발 서버 시작');
  console.log('   2. http://localhost:3000/blog - 블로그 확인');
  console.log('   3. git commit - 변경사항 커밋');
}

main();
