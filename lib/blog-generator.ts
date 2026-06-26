import { BlogPost, SITE } from '@/lib/seo';

// 블로그 자동 생성 엔진 (화이트햇 SEO)
export interface BlogTopicConfig {
  mainKeyword: string;
  subKeywords: string[];
  region?: string;
  minReadingTime?: number;
}

export function generateBlogPost(config: BlogTopicConfig, index: number): BlogPost {
  const { mainKeyword, subKeywords, region = '전국', minReadingTime = 5 } = config;
  const subKeyword = subKeywords[index % subKeywords.length];
  const title = `${mainKeyword} ${subKeyword}: 실무 가이드 & 비용·기간 정리`;
  const slug = slugify(`${mainKeyword}-${subKeyword}-${index}`);

  const publishDate = new Date();
  publishDate.setDate(publishDate.getDate() - index * 3);
  const dateStr = publishDate.toISOString().split('T')[0];

  return {
    slug,
    title,
    description: generateDescription(mainKeyword, subKeyword, region),
    keywords: generateKeywords(mainKeyword, subKeyword, region),
    publishedAt: dateStr,
    readingMinutes: minReadingTime + Math.floor(Math.random() * 3),
    paragraphs: [],
    htmlBody: generateHtmlBody(mainKeyword, subKeyword, region),
    faqs: generateFAQs(mainKeyword, subKeyword)
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 50);
}

function generateDescription(main: string, sub: string, region: string): string {
  const descriptions = [
    `${region}에서 ${main}을 ${sub}할 때 알아야 할 모든 것. 비용, 기간, 체크리스트, 흔한 실수를 정리했습니다.`,
    `${main} 프로젝트에서 ${sub}하는 방법. ${region} 시장 기준의 실무 가이드와 정액 가격을 공개합니다.`,
    `${sub}는 ${main} 성공의 핵심입니다. 전문가가 정리한 가이드와 예상 비용·기간을 확인하세요.`,
    `${region} ${main} ${sub} 가이드. 비용 절감, 기간 단축, 품질 보증 방법을 알려드립니다.`
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function generateKeywords(main: string, sub: string, region: string): string[] {
  return [
    `${main} ${sub}`,
    `${region} ${main}`,
    `${main} ${sub} 비용`,
    `${main} ${sub} 기간`,
    `${region} ${main} ${sub}`,
    `${main} ${sub} 외주`,
    `${main} 견적`
  ];
}

function generateHtmlBody(main: string, sub: string, region: string): string {
  return `<p>많은 분이 "${main}을 ${sub}하는 데 얼마나 들까?"를 검색하다 이 글에 도착하셨을 겁니다. 답부터 드리면, <strong>${sub}의 범위와 복잡도에 따라 크게 달라집니다.</strong> 이 글은 시장 기준의 비용 구간, 기간, 그리고 ${region} 지역의 특수성을 정리합니다.</p>

<h2>${main} ${sub}의 기본 이해</h2>
<p>${sub}는 ${main} 프로젝트에서 중요한 단계입니다. 이 단계를 제대로 이해하고 준비하면, 다음 단계부터의 리스크가 크게 줄어듭니다.</p>

<h3>${sub}하기 전에 확인할 것</h3>
<ul>
<li>실제 필요한 기능이 무엇인지 명확히 하기</li>
<li>예상 비용과 기간을 현실적으로 파악하기</li>
<li>외주사 선정 기준을 미리 정하기</li>
<li>계약 전에 범위·일정·소유권을 명시하기</li>
</ul>

<h2>${region} 시장 기준 비용과 기간</h2>
<p>${region} 지역의 시장 상황을 반영한 기준입니다. 개발사 규모·경력에 따라 달라질 수 있으므로, 여러 업체에서 견적을 받아 비교하세요.</p>

<table>
<thead><tr><th>난이도</th><th>예상 범위</th><th>예상 기간</th><th>평균 비용</th></tr></thead>
<tbody>
<tr><td>초급</td><td>기본 구성 중심</td><td>1~2주</td><td>300만 원~500만 원</td></tr>
<tr><td>중급</td><td>추가 기능 포함</td><td>2~4주</td><td>500만 원~1,500만 원</td></tr>
<tr><td>고급</td><td>복잡한 요구사항</td><td>4주 이상</td><td>1,500만 원 이상</td></tr>
</tbody>
</table>

<h2>${sub}에서 흔한 실수와 해결법</h2>
<h3>1. 범위를 미리 정하지 않기</h3>
<p>"대략 이런 것"으로 계약하면, 개발 중간에 "이것도 포함인 줄 알았어"라는 요청이 계속 나옵니다. 화면별로 입력·출력·예외 처리를 문서화해서 계약서에 첨부하세요.</p>

<h3>2. 중간 검수 없이 최종 납품만 받기</h3>
<p>완성 직전까지 기다리면, 방향이 어긋났을 때 되돌리는 비용이 엄청납니다. 2주 단위로 데모를 받고 피드백하는 프로세스를 계약에 포함하세요.</p>

<h3>3. 소스코드·계정 소유권을 명시하지 않기</h3>
<p>납품물에 소스코드 전체와 스토어·서버 계정 권한이 포함되는지 명확히 하세요. 이게 없으면 나중에 수정이나 이전이 불가능합니다.</p>

<h2>${main} ${sub}의 최신 트렌드</h2>
<ul>
<li><strong>정액제 가격 공개</strong>: 협상 없이 패키지 가격을 먼저 공개하는 업체가 신뢰도 높음</li>
<li><strong>소스코드 이관</strong>: 납품 후 직접 운영하고 수정할 수 있게 인수인계하는 것이 표준</li>
<li><strong>원격 협업</strong>: 지역과 무관하게 온라인으로 진행 가능 (시간대 고려 필요)</li>
<li><strong>AI 보조 활용</strong>: 개발 후 유지보수 비용을 AI 도구로 줄이는 추세</li>
</ul>

<h2>자주 묻는 질문</h2>
<dl>
<dt>Q. ${main} ${sub}에 보통 얼마가 들나요?</dt>
<dd>${sub}의 범위와 기능에 따라 크게 다릅니다. 위 표를 기준으로 여러 업체에서 견적을 받아 비교하세요. 정액제를 제시하는 업체는 범위가 명확한 경우가 많습니다.</dd>
<dt>Q. 기간은 얼마나 걸리나요?</dt>
<dd>범위가 명확하게 정의된 경우 위 표의 기간이 기준입니다. 범위가 불분명하면 기간이 늘어날 가능성이 높으니 미리 문서화하세요.</dd>
<dt>Q. 어떤 업체를 고르는 게 좋을까요?</dt>
<dd>1) 가격을 먼저 공개하는지, 2) 소스코드·계정 소유권을 명시하는지, 3) 실제 스토어에 올라간 포트폴리오가 있는지를 확인하세요.</dd>
<dt>Q. 계약 후에 범위가 늘어나면 어떻게 하나요?</dt>
<dd>추가 기능은 별도 견적으로 처리하기로 미리 정해야 합니다. 범위 변경 요청이 올 때마다 문서화해서 기록하세요.</dd>
</dl>`;
}

function generateFAQs(main: string, sub: string) {
  return [
    {
      q: `${main} ${sub}에 얼마가 들나요?`,
      a: `${sub}의 범위와 복잡도에 따라 다릅니다. 보통 300만~1,500만 원 사이이지만, 정확한 비용은 상세 요구사항을 바탕으로 여러 업체에서 견적을 받아 비교해야 합니다.`
    },
    {
      q: `${sub} 기간은 얼마나 걸리나요?`,
      a: `범위가 명확할 때 1~4주 정도입니다. 범위가 불분명하거나 변경이 많으면 기간이 늘어날 수 있으니, 계약 전에 화면과 기능을 문서화해서 정확히 합의하세요.`
    },
    {
      q: `어떻게 업체를 고르나요?`,
      a: `가격을 먼저 공개하고, 소스코드·계정 소유권을 명시하며, 실제 스토어에 올라간 포트폴리오를 보여주는 업체를 추천합니다.`
    }
  ];
}
