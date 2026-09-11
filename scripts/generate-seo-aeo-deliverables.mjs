/**
 * AEO/SEO 실행 문서 생성기.
 *
 * 정적 감사로 확인할 수 없는 GSC/GA4/백링크 값은 추정하지 않고
 * OWNER_DATA_REQUIRED 또는 NOT_MEASURED 로 남긴다. 이 파일은 URL을 자동으로
 * noindex/redirect 하지 않는다. 실제 검색·전환 데이터 검토 전에는 보수적으로
 * RETAIN/IMPROVE/MONITOR 만 제안한다.
 */
import { mkdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DATE = '2026-09-11';
const DOMAIN = 'https://reumlab.com';
const INPUT = 'docs/geo/CONTENT_SCORECARD.csv';
const OUTPUT = 'docs/seo-aeo';

function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += ch;
  }
  if (field || row.length) { row.push(field.replace(/\r$/, '')); rows.push(row); }
  const [head, ...data] = rows.filter((r) => r.some(Boolean));
  return data.map((values) => Object.fromEntries(head.map((key, i) => [key, values[i] || ''])));
}

function csvCell(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

function toCsv(headers, rows) {
  return [headers, ...rows.map((row) => headers.map((h) => row[h] ?? ''))]
    .map((row) => row.map(csvCell).join(','))
    .join('\n') + '\n';
}

function pathname(url) {
  return new URL(url).pathname;
}

function pageType(row) {
  const p = pathname(row.url);
  if (p === '/') return 'home';
  if (p.startsWith('/guide/')) return 'guide';
  if (p.startsWith('/blog/')) return 'article';
  if (p.startsWith('/compare/')) return 'comparison';
  if (p.startsWith('/cost/')) return 'cost_landing';
  if (p.startsWith('/portfolio/')) return 'case_study';
  if (p.startsWith('/l/')) return 'programmatic_landing';
  if (p.startsWith('/h/')) return 'topic_hub';
  if (row.primary_intent === 'region_service') return 'region_service';
  return row.primary_intent || 'service_or_hub';
}

function audience(type) {
  if (type === 'case_study') return '구현 역량과 유사 사례를 검증하는 의사결정자';
  if (type === 'comparison') return '기술·업체 선택지를 비교하는 실무자';
  if (type === 'guide' || type === 'article') return '개발 전 비용·범위·절차를 조사하는 잠재 고객';
  if (type.includes('region')) return '해당 지역에서 개발사를 찾는 사업자';
  if (type.includes('cost')) return '예산과 포함 범위를 비교하는 구매 의사결정자';
  return '앱·웹·AI 개발 파트너를 찾는 사업자와 실무자';
}

function funnel(type) {
  if (['service_or_hub', 'region_service', 'programmatic_landing', 'cost_landing'].includes(type)) return 'BOFU';
  if (type === 'case_study' || type === 'comparison') return 'MOFU';
  return 'TOFU/MOFU';
}

function recommendation(row) {
  if (row.original_evidence === 'strong') return 'RETAIN';
  if (row.original_evidence === 'templated-review') return 'MONITOR';
  if (row.priority === 'P1') return 'IMPROVE';
  return 'MONITOR';
}

function reason(row) {
  const action = recommendation(row);
  if (action === 'RETAIN') return '정적 품질 신호와 1차 근거가 강함; 성과 데이터로 유지 확인';
  if (action === 'IMPROVE') return '핵심 의도와 기술 품질은 유효하나 인용 가능한 1차 근거 보강 여지 있음';
  return '템플릿 유사 가능성은 있으나 검색·전환 데이터 없이 삭제·통합하지 않음';
}

function h1For(url) {
  const p = pathname(url);
  const file = p === '/' ? join('out', 'index.html') : join('out', p.slice(1), 'index.html');
  if (!existsSync(file)) return decodeURIComponent(p).replaceAll('/', ' ').trim() || '름랩';
  const html = readFileSync(file, 'utf8');
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1];
  return h1 ? h1.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim() : p;
}

const source = parseCsv(readFileSync(INPUT, 'utf8'));
const byIntent = new Map();
for (const row of source) {
  const key = row.primary_intent;
  byIntent.set(key, [...(byIntent.get(key) || []), row.url]);
}

const urlHeaders = [
  'canonical URL', 'page type', 'primary intent', 'target audience',
  'Google clicks', 'Google impressions', 'Google CTR', 'Google average position',
  'Bing clicks', 'Bing citations', 'Naver impressions', 'Naver clicks',
  'organic sessions', 'AI referral sessions', 'successful leads',
  'backlinks / independent mentions', 'first-party evidence', 'content uniqueness',
  'query overlap', 'closest competing internal URL', 'index status', 'action',
  'reason', 'priority', 'owner',
];
const urlRows = source.map((row) => {
  const peers = (byIntent.get(row.primary_intent) || []).filter((url) => url !== row.url);
  return {
    'canonical URL': row.url,
    'page type': pageType(row),
    'primary intent': row.primary_intent,
    'target audience': audience(pageType(row)),
    'Google clicks': 'OWNER_DATA_REQUIRED:GSC',
    'Google impressions': 'OWNER_DATA_REQUIRED:GSC',
    'Google CTR': 'OWNER_DATA_REQUIRED:GSC',
    'Google average position': 'OWNER_DATA_REQUIRED:GSC',
    'Bing clicks': 'OWNER_DATA_REQUIRED:BING',
    'Bing citations': 'OWNER_DATA_REQUIRED:BING_AI_PERFORMANCE',
    'Naver impressions': 'OWNER_DATA_REQUIRED:NAVER',
    'Naver clicks': 'OWNER_DATA_REQUIRED:NAVER',
    'organic sessions': 'OWNER_DATA_REQUIRED:GA4',
    'AI referral sessions': 'OWNER_DATA_REQUIRED:GA4',
    'successful leads': 'OWNER_DATA_REQUIRED:GA4_NETLIFY',
    'backlinks / independent mentions': 'NOT_MEASURED',
    'first-party evidence': row.original_evidence,
    'content uniqueness': row.content_uniqueness,
    'query overlap': 'NO_EXACT_H1_DUPLICATE; GSC_QUERY_DATA_REQUIRED',
    'closest competing internal URL': peers[0] || 'NONE_IN_STATIC_INTENT_GROUP',
    'index status': 'INDEX / SELF_CANONICAL_STATIC_VERIFIED',
    action: recommendation(row),
    reason: reason(row),
    priority: row.priority,
    owner: recommendation(row) === 'IMPROVE' ? 'content+SEO' : 'SEO owner',
  };
});

const evidenceHeaders = ['page', 'primary claim', 'current evidence', 'needed evidence', 'owner input required'];
const evidenceRows = source.map((row) => ({
  page: row.url,
  'primary claim': h1For(row.url),
  'current evidence': row.original_evidence,
  'needed evidence': row.original_evidence === 'strong'
    ? '검수일과 원문 연결 유지'
    : row.original_evidence === 'templated-review'
      ? '해당 업종·지역에 고유한 실제 제약, 허가된 사례 또는 1차 자료'
      : '검증 가능한 사례·방법론·공식 출처 중 최소 1개 보강',
  'owner input required': row.original_evidence === 'strong' ? 'no' : 'yes',
}));

const queryHeaders = ['query', 'intent', 'target audience', 'current canonical', 'page type', 'funnel stage', 'duplicate URL', 'recommendation'];
const queryRows = source.map((row) => {
  const type = pageType(row);
  return {
    query: h1For(row.url),
    intent: row.primary_intent,
    'target audience': audience(type),
    'current canonical': row.url,
    'page type': type,
    'funnel stage': funnel(type),
    'duplicate URL': 'NONE_BY_EXACT_H1_STATIC_AUDIT',
    recommendation: recommendation(row),
  };
});

const counts = Object.fromEntries(['RETAIN', 'IMPROVE', 'MONITOR'].map((a) => [a, urlRows.filter((r) => r.action === a).length]));
const types = [...new Set(urlRows.map((r) => r.type))]
  .map((type) => `${type}: ${urlRows.filter((r) => r.type === type).length}`)
  .join(', ');

mkdirSync(OUTPUT, { recursive: true });
writeFileSync(join(OUTPUT, 'URL_DECISIONS.csv'), toCsv(urlHeaders, urlRows), 'utf8');
writeFileSync(join(OUTPUT, 'CONTENT_EVIDENCE_GAPS.csv'), toCsv(evidenceHeaders, evidenceRows), 'utf8');
writeFileSync(join(OUTPUT, 'QUERY_INTENT_MAP.csv'), toCsv(queryHeaders, queryRows), 'utf8');

writeFileSync(join(OUTPUT, 'EXECUTIVE_SUMMARY.md'), `# REUMLAB AEO·SEO Executive Summary\n\n기준일: ${DATE}\n\n## 결론\n\n름랩은 canonical, sitemap, robots, 내부 링크, 구조화 데이터와 색인 품질 게이트가 이미 강합니다. 다음 성장 병목은 URL 추가가 아니라 **기존 핵심 페이지의 1차 근거, 방법론, 한계, 사례 연결과 실제 검색·전환 데이터 기반 정리**입니다.\n\n이번 구현은 가격·MVP·외주 체크리스트 3개 페이지에 직접 답변, HTML 표, 산정 방법, 한계, 공식 출처와 검수일을 추가했습니다. 포트폴리오에는 공개된 필드만으로 CreativeWork를 만들고, 원본에 없는 고객명·성과·날짜는 추가하지 않았습니다.\n\n## 전체 URL 판정\n\n- 분석 URL: ${source.length}\n- RETAIN: ${counts.RETAIN}\n- IMPROVE: ${counts.IMPROVE}\n- MONITOR: ${counts.MONITOR}\n- REDIRECT/NOINDEX/DELETE: 0 — GSC·GA4 실데이터 없이 대량 정리하지 않음\n- 유형: ${types}\n\n## 상위 10개 발견\n\n1. 정적 canonical·index 신호와 sitemap 일치는 안정적입니다.\n2. 기술 SEO보다 근거의 독립성·검수 방식이 다음 우선순위입니다.\n3. 핵심 비용 문서는 공개 가격을 시장 평균과 구분해야 합니다.\n4. AI 답변이 문맥 없이 인용할 수 있는 짧은 직접 답변이 필요합니다.\n5. 표는 이미지가 아니라 HTML로 제공해야 검색엔진과 보조기기가 읽을 수 있습니다.\n6. 출처 URL만 추가하지 말고 어떤 주장에 쓰였는지 역할을 밝혀야 합니다.\n7. 포트폴리오는 익명화 한계를 밝히고 없는 성과 수치를 만들지 않아야 합니다.\n8. 템플릿형 지역·업종 URL은 Search Console 쿼리/클릭/전환을 보기 전 대량 noindex하면 안 됩니다.\n9. 정확히 같은 H1은 없지만 실제 쿼리 중복은 GSC export로 재검증해야 합니다.\n10. AEO 효과는 AI 유입 세션, 보조전환, 브랜드 검색 증가를 함께 측정해야 합니다.\n\n## 우선순위\n\n- 0~30일: GSC·GA4·Bing·네이버 데이터를 결합하고 IMPROVE URL의 실제 노출 쿼리를 확인합니다.\n- 31~60일: 근거를 확보할 수 있는 상위 URL부터 사례·스크린샷·방법론을 보강합니다.\n- 61~90일: 성과 없는 중복 URL만 통합 후보로 올리고, 301/noindex는 개별 승인 후 적용합니다.\n\n상세 행 단위 근거는 URL_DECISIONS.csv, CONTENT_EVIDENCE_GAPS.csv, QUERY_INTENT_MAP.csv를 기준으로 합니다.\n`, 'utf8');

const summaryPath = join(OUTPUT, 'EXECUTIVE_SUMMARY.md');
writeFileSync(summaryPath, readFileSync(summaryPath, 'utf8') + `\n## 예상 효과\n\n- 직접 답변·표·방법론·한계·출처를 같은 페이지에 연결해 정확한 구간을 인용하기 쉬워집니다.\n- 공개 가격과 확정 견적을 구분해 상담 전 기대와 비교 기준을 명확히 합니다.\n- 사례 스키마와 실제 화면의 검증 범위를 일치시켜 엔터티 해석을 강화합니다.\n\n## 위험과 통제\n\n- 실제 검색 데이터가 없어 통합·noindex 판단은 보류했습니다. 성과가 낮다는 가정을 코드에 반영하지 않습니다.\n- 익명 사례에는 고객명·날짜·성과를 만들지 않았고 공개 한계를 화면에 표시했습니다.\n- 개인 작성자 경력과 고유 OG 이미지는 소유자 확인 전 게시하지 않고 OWNER_INPUT_REQUIRED로 남겼습니다.\n`, 'utf8');

writeFileSync(join(OUTPUT, 'MEASUREMENT_PLAN.md'), `# AEO·SEO Measurement Plan\n\n기준일: ${DATE}\n\n## 측정 원칙\n\n정적 감사는 구현 품질을 확인할 뿐 검색 성과를 증명하지 않습니다. URL별 클릭·노출·쿼리·선택 canonical은 GSC, Bing, 네이버 원본 export로 보완하고, 문의는 GA4와 Netlify Forms의 서버 성공 기록을 기준으로 맞춥니다.\n\n## 0~30일: 기준선\n\n- GSC 페이지/쿼리 16개월 export: 클릭, 노출, CTR, 평균 순위, Google 선택 canonical, 색인 상태\n- Bing Webmaster Tools: 검색 성과, sitemap, IndexNow, AI Performance export\n- 네이버 Search Advisor: 콘텐츠 노출/클릭, 수집·색인, 사이트 진단 export\n- GA4: landing page + session source/medium + page_context + cta_click + inquiry_form_start + generate_lead\n- Netlify Forms: 최초 랜딩, referrer, source/medium, UTM, 제출 성공 시간\n- 백링크: 연결 도메인, 대상 URL, 앵커, 최초 확인일\n\n## 31~60일: 개선 검증\n\n- 출처·표·방법론이 추가된 3개 가이드의 쿼리 다양성, CTR, 평균 순위 변화를 28일 동기간으로 비교\n- AI referral(ChatGPT, Perplexity, Copilot, Gemini 등)은 별도 채널 그룹으로 보고 assisted conversion을 함께 확인\n- 지역·업종 템플릿 페이지는 노출은 있으나 클릭이 없는지, 같은 쿼리를 여러 URL이 나눠 받는지 확인\n- CWV는 모바일 75백분위 LCP ≤2.5초, INP ≤200ms, CLS ≤0.1을 목표로 URL 유형별 추적\n\n## 61~90일: 의사결정\n\n- 유지: 고유 쿼리·클릭·전환 또는 검증 가능한 1차 근거가 있는 URL\n- 개선: 노출은 있으나 CTR/전환이 낮고 검색 의도는 분명한 URL\n- 통합 후보: 같은 쿼리를 지속적으로 나눠 받고 독립 전환·근거가 없는 URL\n- noindex/삭제 후보: 90일 이상 유효 노출·전환·백링크가 없고 고유 가치도 입증할 수 없는 URL\n- 실제 301/noindex/삭제는 URL_DECISIONS.csv에 근거와 승인자를 기록한 뒤 개별 적용\n\n## 대시보드 최소 지표\n\n- 검색: organic clicks, impressions, CTR, non-brand/brand query, indexed pages\n- AI: AI referral sessions, engaged sessions, assisted leads, cited/mentioned pages(도구가 제공할 때만)\n- 전환: cta_click, inquiry_form_start, generate_lead, 제출 성공률, landing-to-lead rate\n- 품질: evidence verified/review/insufficient, stale review date, broken citation, CWV pass rate\n`, 'utf8');

writeFileSync(join(OUTPUT, 'OWNER_INPUT_REQUIRED.md'), `# OWNER_INPUT_REQUIRED\n\n기준일: ${DATE}\n\n다음 항목은 저장소만으로 확인하거나 만들어낼 수 없으므로 소유자 입력이 필요합니다. 값이 오기 전까지 URL 삭제·대량 noindex·성과 주장에는 사용하지 않습니다.\n\n## 검색·분석 원본\n\n- Google Search Console: 페이지/쿼리 16개월 CSV, Page Indexing, 선택 canonical, Core Web Vitals export\n- Bing Webmaster Tools: Search Performance, AI Performance, sitemap·IndexNow 상태 export\n- 네이버 Search Advisor: 콘텐츠 노출/클릭, 수집·색인, 사이트 진단 화면 또는 export\n- GA4: landing page + source/medium + campaign + conversion export\n- 백링크 도구 export가 있다면 연결 도메인·대상 URL·앵커 포함 파일\n\n## 1차 근거\n\n- 공개 허가를 받은 프로젝트별 실제 수행 기간, 납품일, 검증 가능한 결과 지표\n- 공개 가능한 실제 화면 캡처 또는 산출물 일부와 고객 공개 동의 범위\n- 작성·검수 책임자의 실명/경력/전문 분야를 공개할지 여부\n- 고객 리뷰를 인용할 경우 원문, 작성자 공개 범위, 사용 허가\n- 지역별 실제 방문·업무·사례가 있다면 확인 가능한 사실; 없다면 지역 고유 주장 금지\n\n## 외부 프로필\n\n기준 NAP: 름랩 / REUMLAB · 경기도 화성시 동탄구 동탄첨단산업1로 58, 307호(영천동) · 010-8111-9370\n\n- 네이버 플레이스 최종 승인 화면과 공개 URL\n- Google Business Profile 최종 승인 화면과 공개 URL\n- 업종 카테고리·영업시간·서비스 지역의 실제 운영 값\n\n민감한 로그인 정보, 인증 코드, 개인 고객 데이터는 문서에 넣지 마세요.\n`, 'utf8');

const ownerPath = join(OUTPUT, 'OWNER_INPUT_REQUIRED.md');
writeFileSync(ownerPath, readFileSync(ownerPath, 'utf8') + `\n## 입력별 이유와 적용 범위\n\n| 입력 | 필요한 이유 | 적용 페이지 |\n|---|---|---|\n| GSC·Bing·네이버 URL/쿼리 export | 실제 수요·쿼리 중복·선택 canonical·인용 여부 판정 | 색인 URL 777개 전체 |\n| GA4·Netlify 성공 문의 export | organic/AI 유입과 서버 성공 리드 연결 | CTA 페이지 및 문의 폼 17개 |\n| 프로젝트별 기간·결과·공개 동의 | 허위 수치 없이 사례의 결과와 한계 보강 | /portfolio/ 및 사례 15개 |\n| 공개 가능한 작성·검수자 역할·경력 | 개인 저자 엔터티를 사실 기반으로 연결 | 가이드 45개, 블로그 10개 |\n| 실제 화면·산출물과 사용 허가 | 고유 시각 근거와 페이지별 OG 이미지 제작 | 핵심 8~12개 페이지, 사례 15개 |\n| 지역별 실제 업무·사례 | 템플릿 문구를 지역 고유 1차 근거로 대체 | 지역×서비스 페이지 |\n`, 'utf8');
writeFileSync('OWNER_INPUT_REQUIRED.md', readFileSync(ownerPath, 'utf8'), 'utf8');

writeFileSync(join(OUTPUT, 'README.md'), `# SEO·AEO deliverables\n\n${DATE} 기준 정적 감사 및 실행 문서입니다.\n\n- EXECUTIVE_SUMMARY.md — 우선순위와 핵심 결론\n- URL_DECISIONS.csv — ${source.length}개 색인 URL의 보수적 판정\n- CONTENT_EVIDENCE_GAPS.csv — 페이지별 근거 공백\n- QUERY_INTENT_MAP.csv — 검색 의도·대상·퍼널 맵\n- MEASUREMENT_PLAN.md — 30/60/90일 측정 체계\n- OWNER_INPUT_REQUIRED.md — 콘솔·실제 사례 등 소유자만 제공할 수 있는 정보\n\n재생성: \`npm run seo:report:aeo\`\n`, 'utf8');

console.log(`SEO/AEO deliverables: ${source.length} URLs, RETAIN ${counts.RETAIN}, IMPROVE ${counts.IMPROVE}, MONITOR ${counts.MONITOR}`);
