/**
 * AEO/SEO 실행 문서 생성기.
 *
 * 로컬 private 폴더에 콘솔 export가 있으면 실제 값으로 재분류하고, 없으면
 * OWNER_DATA_REQUIRED 또는 NOT_MEASURED 로 남긴다. 원본 검색·전환 수치는 사업
 * 텔레메트리이므로 git에 넣지 않고 공개 CSV에는 구간값만 기록한다. 이 파일은 URL을
 * 자동으로 noindex/redirect 하지 않으며 RETAIN/IMPROVE/MONITOR만 제안한다.
 */
import { mkdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DATE = '2026-09-11';
const DOMAIN = 'https://reumlab.com';
const INPUT = 'docs/geo/CONTENT_SCORECARD.csv';
const OUTPUT = 'docs/seo-aeo';
const PRIVATE = join(OUTPUT, 'private');
const GSC_PAGES = join(PRIVATE, `gsc-${DATE}`, 'Pages.csv');
const GSC_FILTERS = join(PRIVATE, `gsc-${DATE}`, 'Filters.csv');
const NAVER_PAGES = join(PRIVATE, `naver-${DATE}-90d.csv`);

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

function normalizeCanonical(raw) {
  try {
    const parsed = new URL(raw);
    let path = parsed.pathname.replace(/\/{2,}/g, '/');
    if (!path.endsWith('/') && !/\.[a-z0-9]{2,8}$/i.test(path)) path += '/';
    return `${DOMAIN}${path}`;
  } catch {
    return raw;
  }
}

function numberOf(value) {
  const number = Number(String(value ?? '').replaceAll(',', '').replace('%', '').trim());
  return Number.isFinite(number) ? number : 0;
}

function aggregateMetrics(rows, urlColumn) {
  const metrics = new Map();
  for (const row of rows) {
    const url = normalizeCanonical(row[urlColumn]);
    const current = metrics.get(url) || { clicks: 0, impressions: 0, weightedPosition: 0 };
    const impressions = numberOf(row.Impressions);
    current.clicks += numberOf(row.Clicks);
    current.impressions += impressions;
    current.weightedPosition += numberOf(row.Position) * impressions;
    metrics.set(url, current);
  }
  for (const value of metrics.values()) {
    value.ctr = value.impressions ? (value.clicks / value.impressions) * 100 : 0;
    value.position = value.impressions ? value.weightedPosition / value.impressions : 0;
  }
  return metrics;
}

const hasGsc = existsSync(GSC_PAGES);
const hasNaver = existsSync(NAVER_PAGES);
const gscByUrl = hasGsc
  ? aggregateMetrics(parseCsv(readFileSync(GSC_PAGES, 'utf8')), 'Top pages')
  : new Map();
const naverByUrl = hasNaver
  ? aggregateMetrics(parseCsv(readFileSync(NAVER_PAGES, 'utf8')), 'URL')
  : new Map();

function clickBand(metric, missing) {
  if (missing) return 'NO_URL_ROW';
  if (metric.clicks === 0) return '0';
  if (metric.clicks <= 2) return '1-2';
  if (metric.clicks <= 9) return '3-9';
  return '10+';
}

function impressionBand(metric, missing) {
  if (missing) return 'NO_URL_ROW';
  if (metric.impressions === 0) return '0';
  if (metric.impressions < 20) return '1-19';
  if (metric.impressions < 100) return '20-99';
  if (metric.impressions < 500) return '100-499';
  return '500+';
}

function ctrBand(metric, missing) {
  if (missing) return 'NO_URL_ROW';
  if (metric.ctr === 0) return '0%';
  if (metric.ctr < 1) return '<1%';
  if (metric.ctr < 3) return '1-2.9%';
  return '3%+';
}

function positionBand(metric, missing) {
  if (missing || !metric.position) return 'NO_URL_ROW';
  if (metric.position <= 3) return '1-3';
  if (metric.position <= 10) return '4-10';
  if (metric.position <= 20) return '11-20';
  if (metric.position <= 50) return '21-50';
  return '51+';
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

function previousRecommendation(row) {
  if (row.original_evidence === 'strong') return 'RETAIN';
  if (row.original_evidence === 'templated-review') return 'MONITOR';
  if (row.priority === 'P1') return 'IMPROVE';
  return 'MONITOR';
}

function recommendation(row, gsc, naver) {
  // CTR 개선 기회는 클릭이 있더라도 먼저 잡는다. 특히 네이버 TOP 30 또는
  // GSC 100회 이상 노출인데 CTR 2% 미만이면 제목·설명·답변 구조를 우선 개선한다.
  const gscOpportunity = gsc && (
    (gsc.impressions >= 100 && gsc.ctr < 2) ||
    (gsc.impressions >= 20 && gsc.position <= 20 && gsc.ctr < 2)
  );
  const naverOpportunity = naver && naver.impressions >= 100 && naver.ctr < 2;
  if (gscOpportunity || naverOpportunity) return 'IMPROVE';

  // 검증된 1차 근거 또는 실제 검색 클릭이 있으면 유지한다. 단, 위 CTR 기회가 있으면
  // RETAIN으로 덮지 않아 성과 개선 후보를 놓치지 않는다.
  if (row.original_evidence === 'strong') return 'RETAIN';
  if ((gsc?.clicks || 0) >= 1 || (naver?.clicks || 0) >= 1) return 'RETAIN';
  if (gsc && gsc.impressions >= 20 && gsc.position <= 10) return 'RETAIN';

  // 검색 수요는 확인됐지만 아직 클릭/근거가 약한 문서는 개선한다.
  if ((gsc?.impressions || 0) >= 20 || (naver?.impressions || 0) >= 20) return 'IMPROVE';
  if (row.priority === 'P1' && ((gsc?.impressions || 0) + (naver?.impressions || 0) > 0)) return 'IMPROVE';
  return 'MONITOR';
}

function reason(row, gsc, naver) {
  const action = recommendation(row, gsc, naver);
  if (action === 'RETAIN') {
    if ((gsc?.clicks || 0) + (naver?.clicks || 0) > 0) return '실제 검색 클릭 확인; 현재 canonical을 유지하고 근거 최신성만 점검';
    return '검증된 1차 근거가 있어 유지; 검색 수요 확대 여부를 계속 관찰';
  }
  if (action === 'IMPROVE') {
    const lowCtr = (gsc?.impressions || 0) >= 20 && (gsc?.ctr || 0) < 2
      || (naver?.impressions || 0) >= 100 && (naver?.ctr || 0) < 2;
    if (lowCtr) return '실제 노출 대비 CTR이 낮음; 제목·설명·직접 답변·사례 연결 우선 개선';
    return '실제 검색 노출은 확인됐으나 클릭/근거 신호가 약함; 의도 적합성과 고유 근거 보강';
  }
  if (hasGsc) return 'GSC URL 행이 없거나 신호가 20회 미만; 신규·저수요 가능성을 구분하기 위해 관찰 유지';
  return '검색·전환 데이터가 없어 삭제·통합하지 않고 관찰';
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
  'Google clicks band', 'Google impressions band', 'Google CTR band', 'Google average position band',
  'Bing clicks', 'Bing citations', 'Naver impressions band', 'Naver clicks band',
  'organic sessions', 'AI referral sessions', 'successful leads',
  'backlinks / independent mentions', 'first-party evidence', 'content uniqueness',
  'query overlap', 'closest competing internal URL', 'index status', 'action',
  'reason', 'priority', 'data coverage', 'owner',
];
const urlRows = source.map((row) => {
  const peers = (byIntent.get(row.primary_intent) || []).filter((url) => url !== row.url);
  const gsc = gscByUrl.get(normalizeCanonical(row.url));
  const naver = naverByUrl.get(normalizeCanonical(row.url));
  const action = recommendation(row, gsc, naver);
  const highSignal = (gsc?.impressions || 0) >= 100 || (naver?.impressions || 0) >= 100;
  return {
    'canonical URL': row.url,
    'page type': pageType(row),
    'primary intent': row.primary_intent,
    'target audience': audience(pageType(row)),
    'Google clicks band': hasGsc ? clickBand(gsc || {}, !gsc) : 'OWNER_DATA_REQUIRED:GSC',
    'Google impressions band': hasGsc ? impressionBand(gsc || {}, !gsc) : 'OWNER_DATA_REQUIRED:GSC',
    'Google CTR band': hasGsc ? ctrBand(gsc || {}, !gsc) : 'OWNER_DATA_REQUIRED:GSC',
    'Google average position band': hasGsc ? positionBand(gsc || {}, !gsc) : 'OWNER_DATA_REQUIRED:GSC',
    'Bing clicks': 'PROCESSING_NO_URL_ROWS:2026-09-11',
    'Bing citations': '0_SITE_TOTAL_90D:2026-09-11',
    'Naver impressions band': hasNaver ? (naver ? impressionBand(naver, false) : 'NOT_IN_TOP_30') : 'OWNER_DATA_REQUIRED:NAVER',
    'Naver clicks band': hasNaver ? (naver ? clickBand(naver, false) : 'NOT_IN_TOP_30') : 'OWNER_DATA_REQUIRED:NAVER',
    'organic sessions': 'GA4_PROPERTY_NOT_ACCESSIBLE:2026-09-11',
    'AI referral sessions': 'GA4_PROPERTY_NOT_ACCESSIBLE:2026-09-11',
    'successful leads': 'OWNER_DATA_REQUIRED:GA4_NETLIFY',
    'backlinks / independent mentions': 'NOT_MEASURED',
    'first-party evidence': row.original_evidence,
    'content uniqueness': row.content_uniqueness,
    'query overlap': hasGsc ? 'NO_EXACT_H1_DUPLICATE; PAGE_QUERY_EXPORT_REQUIRED' : 'NO_EXACT_H1_DUPLICATE; GSC_QUERY_DATA_REQUIRED',
    'closest competing internal URL': peers[0] || 'NONE_IN_STATIC_INTENT_GROUP',
    'index status': 'INDEX / SELF_CANONICAL_STATIC_VERIFIED',
    action,
    reason: reason(row, gsc, naver),
    priority: action === 'IMPROVE' ? (highSignal ? 'P1-data' : 'P2-data') : action === 'RETAIN' ? 'P2-keep' : 'P3-monitor',
    'data coverage': [
      hasGsc ? `GSC:${gsc ? 'URL_ROW' : 'NO_URL_ROW'}` : 'GSC:MISSING',
      hasNaver ? `NAVER:${naver ? 'TOP_30' : 'NOT_TOP_30'}` : 'NAVER:MISSING',
      'BING:PROCESSING',
      'GA4:NO_PROPERTY_ACCESS',
    ].join('; '),
    owner: action === 'IMPROVE' ? 'content+SEO' : 'SEO owner',
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
  const gsc = gscByUrl.get(normalizeCanonical(row.url));
  const naver = naverByUrl.get(normalizeCanonical(row.url));
  return {
    query: h1For(row.url),
    intent: row.primary_intent,
    'target audience': audience(type),
    'current canonical': row.url,
    'page type': type,
    'funnel stage': funnel(type),
    'duplicate URL': 'NONE_BY_EXACT_H1_STATIC_AUDIT',
    recommendation: recommendation(row, gsc, naver),
  };
});

const counts = Object.fromEntries(['RETAIN', 'IMPROVE', 'MONITOR'].map((a) => [a, urlRows.filter((r) => r.action === a).length]));
const gscMatched = source.filter((row) => gscByUrl.has(normalizeCanonical(row.url))).length;
const naverMatched = source.filter((row) => naverByUrl.has(normalizeCanonical(row.url))).length;
const transition = new Map();
for (const [index, row] of source.entries()) {
  const key = `${previousRecommendation(row)}→${urlRows[index].action}`;
  transition.set(key, (transition.get(key) || 0) + 1);
}
const changedImprove = ['RETAIN', 'MONITOR']
  .map((action) => `${action} ${transition.get(`IMPROVE→${action}`) || 0}`)
  .join(', ');
const changedMonitor = ['RETAIN', 'IMPROVE']
  .map((action) => `${action} ${transition.get(`MONITOR→${action}`) || 0}`)
  .join(', ');
const types = [...new Set(urlRows.map((r) => r['page type']))]
  .map((type) => `${type}: ${urlRows.filter((r) => r['page type'] === type).length}`)
  .join(', ');

mkdirSync(OUTPUT, { recursive: true });
writeFileSync(join(OUTPUT, 'URL_DECISIONS.csv'), toCsv(urlHeaders, urlRows), 'utf8');
writeFileSync(join(OUTPUT, 'CONTENT_EVIDENCE_GAPS.csv'), toCsv(evidenceHeaders, evidenceRows), 'utf8');
writeFileSync(join(OUTPUT, 'QUERY_INTENT_MAP.csv'), toCsv(queryHeaders, queryRows), 'utf8');

// 정확한 수치는 로컬 분석용으로만 쓴다. PRIVATE 경로는 .gitignore에 포함되어 있어
// 공개 저장소에는 구간값과 판정만 남고 원본 사업 텔레메트리는 전송되지 않는다.
if (hasGsc || hasNaver) {
  mkdirSync(PRIVATE, { recursive: true });
  const exactHeaders = [
    'canonical URL', 'GSC clicks', 'GSC impressions', 'GSC CTR', 'GSC average position',
    'Naver clicks', 'Naver impressions', 'Naver CTR', 'action', 'reason',
  ];
  const exactRows = source.map((row) => {
    const gsc = gscByUrl.get(normalizeCanonical(row.url));
    const naver = naverByUrl.get(normalizeCanonical(row.url));
    return {
      'canonical URL': row.url,
      'GSC clicks': gsc ? gsc.clicks : 'NO_URL_ROW',
      'GSC impressions': gsc ? gsc.impressions : 'NO_URL_ROW',
      'GSC CTR': gsc ? `${gsc.ctr.toFixed(2)}%` : 'NO_URL_ROW',
      'GSC average position': gsc ? gsc.position.toFixed(2) : 'NO_URL_ROW',
      'Naver clicks': naver ? naver.clicks : 'NOT_IN_TOP_30',
      'Naver impressions': naver ? naver.impressions : 'NOT_IN_TOP_30',
      'Naver CTR': naver ? `${naver.ctr.toFixed(2)}%` : 'NOT_IN_TOP_30',
      action: recommendation(row, gsc, naver),
      reason: reason(row, gsc, naver),
    };
  });
  writeFileSync(join(PRIVATE, `URL_METRICS_EXACT_${DATE}.csv`), toCsv(exactHeaders, exactRows), 'utf8');
}

writeFileSync(join(OUTPUT, 'EXECUTIVE_SUMMARY.md'), `# REUMLAB AEO·SEO Executive Summary\n\n기준일: ${DATE}\n\n## 결론\n\n름랩은 canonical, sitemap, robots, 내부 링크, 구조화 데이터와 색인 품질 게이트가 이미 강합니다. 다음 성장 병목은 URL 추가가 아니라 **기존 핵심 페이지의 CTR, 1차 근거, 사례 연결과 실제 검색·전환 데이터 기반 정리**입니다.\n\n이번 판정은 GSC 16개월 내보내기(${gscByUrl.size}개 URL 행, 현재 색인 목록과 ${gscMatched}개 일치)와 네이버 최근 90일 TOP 30(${naverMatched}개 일치)를 결합했습니다. Bing은 사이트 데이터 처리 중이라 URL 행이 없고 AI Performance 사이트 합계는 0이며, 현재 로그인된 GA4 계정에는 reumlab 속성이 없어 전환값은 판정에 사용하지 않았습니다. 원본 수치는 private 폴더에만 두고 공개 CSV에는 구간값만 기록했습니다.\n\n## 전체 URL 판정\n\n- 분석 URL: ${source.length}\n- RETAIN: ${counts.RETAIN}\n- IMPROVE: ${counts.IMPROVE}\n- MONITOR: ${counts.MONITOR}\n- 기존 IMPROVE 34개 재분류: ${changedImprove}; 나머지는 실제 수요에 따라 IMPROVE 유지\n- 기존 MONITOR 678개 재분류: ${changedMonitor}; 나머지는 MONITOR 유지\n- REDIRECT/NOINDEX/DELETE: 0 — GA4 전환과 페이지별 쿼리 중복 없이 파괴적 변경하지 않음\n- 유형: ${types}\n\n## 상위 10개 발견\n\n1. GSC에는 클릭 188회·노출 11,358회가 있으며 현재 목록과 일치한 URL은 ${gscMatched}개입니다.\n2. 네이버는 최근 90일 약 290클릭·2.2만 노출이며 TOP 30에 현재 목록 ${naverMatched}개가 포함됐습니다.\n3. Bing 검색 성과는 등록 직후 처리 중이고 AI 인용은 최근 90일 0건입니다.\n4. 현재 로그인된 GA4 계정에는 reumlab 속성이 없어 세션·리드 기반 판정은 아직 불가능합니다.\n5. 노출 100회 이상 또는 상위 20위권인데 CTR이 2% 미만인 URL을 최우선 IMPROVE로 올렸습니다.\n6. 실제 검색 클릭이 있거나 검증된 1차 근거가 있는 URL은 RETAIN으로 보존했습니다.\n7. GSC 행이 없거나 신호가 20회 미만인 템플릿형 URL은 신규·저수요를 구분할 수 없어 MONITOR로 유지했습니다.\n8. 공개된 CMS 데모 화면은 관련 서비스에서만 사용하고 고객 사례·성과로 오인되지 않게 출처 범위를 표시합니다.\n9. 정확히 같은 H1은 없지만 URL별 쿼리 중복 판정에는 페이지 필터가 적용된 GSC 쿼리 export가 추가로 필요합니다.\n10. AEO 효과는 Bing AI 인용과 GA4 AI referral·보조전환이 쌓인 뒤 함께 판단해야 합니다.\n\n## 우선순위\n\n- 0~30일: P1-data URL의 제목·설명·직접 답변·내부링크를 개선하고 페이지별 GSC 쿼리를 받습니다.\n- 31~60일: 공개 허가 문서가 도착한 사례에만 실제 화면·산출물·결과를 연결합니다.\n- 61~90일: GA4·Bing 데이터가 쌓이면 전환 없는 중복 URL만 통합 후보로 올리고 301/noindex는 개별 승인 후 적용합니다.\n\n상세 행 단위 근거는 URL_DECISIONS.csv, CONTENT_EVIDENCE_GAPS.csv, QUERY_INTENT_MAP.csv를 기준으로 합니다.\n`, 'utf8');

const summaryPath = join(OUTPUT, 'EXECUTIVE_SUMMARY.md');
writeFileSync(summaryPath, readFileSync(summaryPath, 'utf8') + `\n## 예상 효과\n\n- 직접 답변·표·방법론·한계·출처를 같은 페이지에 연결해 정확한 구간을 인용하기 쉬워집니다.\n- 공개 가격과 확정 견적을 구분해 상담 전 기대와 비교 기준을 명확히 합니다.\n- 사례 스키마와 실제 화면의 검증 범위를 일치시켜 엔터티 해석을 강화합니다.\n\n## 위험과 통제\n\n- GSC·네이버 검색 데이터는 반영했지만 GA4 전환, 페이지별 쿼리 중복과 Bing URL 데이터가 없어 통합·noindex 판단은 보류했습니다.\n- 익명 사례에는 고객명·날짜·성과를 만들지 않았고 공개 한계를 화면에 표시했습니다.\n- 개인 작성자 경력과 고유 OG 이미지는 소유자 확인 전 게시하지 않고 OWNER_INPUT_REQUIRED로 남겼습니다.\n`, 'utf8');

writeFileSync(join(OUTPUT, 'MEASUREMENT_PLAN.md'), `# AEO·SEO Measurement Plan\n\n기준일: ${DATE}\n\n## 측정 원칙\n\n정적 감사는 구현 품질을 확인할 뿐 검색 성과를 증명하지 않습니다. 이번 판정에는 GSC 16개월 URL 성과와 네이버 90일 TOP 30을 사용했습니다. 원본은 git 제외 private 폴더에 보관하고 공개 결과에는 수치 구간만 남깁니다. Bing·GA4 값이 준비되기 전에는 301/noindex/삭제를 자동 적용하지 않습니다.\n\n## 확보된 기준선\n\n- GSC URL 성과: 클릭·노출·CTR·평균 순위, 16개월 선택(실제 속성 데이터는 2026-02-22~2026-09-08)\n- GSC 사이트 합계: 클릭 188, 노출 11,358, 평균 CTR 1.7%, 평균 순위 24.6\n- 네이버 URL 성과: 최근 90일 TOP 30, 사이트 화면 합계 약 290클릭·2.2만 노출·CTR 1.3%\n- Bing: Search Performance URL 행 없음(처리 중), AI Performance 최근 90일 사이트 합계 0\n- GA4: 현재 로그인 계정에서 reumlab 속성을 찾지 못해 미사용\n\n## 0~30일: 빠른 개선\n\n- P1-data: GSC/네이버 100회 이상 노출 또는 상위 20위권·CTR 2% 미만 URL의 title, description, 직접 답변과 내부링크 개선\n- GSC 페이지 필터별 쿼리 export로 같은 쿼리를 나눠 받는 URL 쌍을 확인\n- GA4 reumlab 속성 접근권한을 연결하고 landing page + source/medium + page_context + cta_click + inquiry_form_start + generate_lead를 export\n- Netlify Forms: 최초 랜딩, referrer, source/medium, UTM, 제출 성공 시간을 GA4 서버 성공 리드와 대조\n\n## 31~60일: 개선 검증\n\n- 변경 URL의 클릭·노출·CTR·평균 순위를 28일 동기간으로 비교\n- AI referral(ChatGPT, Perplexity, Copilot, Gemini 등)은 별도 채널 그룹으로 보고 assisted conversion을 함께 확인\n- 지역·업종 템플릿 페이지는 노출은 있으나 클릭이 없는지, 같은 쿼리를 여러 URL이 나눠 받는지 확인\n- CWV는 모바일 75백분위 LCP ≤2.5초, INP ≤200ms, CLS ≤0.1을 목표로 URL 유형별 추적\n\n## 61~90일: 의사결정\n\n- 유지: 고유 쿼리·클릭·전환 또는 검증 가능한 1차 근거가 있는 URL\n- 개선: 노출은 있으나 CTR/전환이 낮고 검색 의도는 분명한 URL\n- 통합 후보: 같은 쿼리를 지속적으로 나눠 받고 독립 전환·근거가 없는 URL\n- noindex/삭제 후보: 90일 이상 유효 노출·전환·백링크가 없고 고유 가치도 입증할 수 없는 URL\n- 실제 301/noindex/삭제는 URL_DECISIONS.csv에 근거와 승인자를 기록한 뒤 개별 적용\n\n## 대시보드 최소 지표\n\n- 검색: organic clicks, impressions, CTR, non-brand/brand query, indexed pages\n- AI: AI referral sessions, engaged sessions, assisted leads, cited/mentioned pages(도구가 제공할 때만)\n- 전환: cta_click, inquiry_form_start, generate_lead, 제출 성공률, landing-to-lead rate\n- 품질: evidence verified/review/insufficient, stale review date, broken citation, CWV pass rate\n`, 'utf8');

writeFileSync(join(OUTPUT, 'OWNER_INPUT_REQUIRED.md'), `# OWNER_INPUT_REQUIRED\n\n기준일: ${DATE}\n\nGSC URL 성과와 네이버 TOP 30은 확보했습니다. 다음 항목은 현재 계정·저장소만으로 확인하거나 만들어낼 수 없으므로 소유자 입력이 필요합니다. 값이 오기 전까지 URL 삭제·대량 noindex·성과 주장에는 사용하지 않습니다.\n\n## 남은 검색·분석 원본\n\n- Google Search Console: IMPROVE URL별 페이지 필터 쿼리, URL Inspection의 Google 선택 canonical·색인 상태, Core Web Vitals export\n- Bing Webmaster Tools: 데이터 처리 완료 후 Search Performance URL export와 AI Performance URL export\n- GA4: reumlab 속성 접근권한 또는 landing page + source/medium + campaign + conversion export\n- Netlify Forms: landing/referrer/source/medium/UTM/서버 성공 시각 export\n- 백링크 도구 export가 있다면 연결 도메인·대상 URL·앵커 포함 파일\n\n## 1차 근거\n\n- 공개 허가를 받은 프로젝트별 실제 수행 기간, 납품일, 검증 가능한 결과 지표\n- 공개 가능한 실제 화면 캡처 또는 산출물 일부와 고객 공개 동의 범위\n- 작성·검수 책임자의 실명/경력/전문 분야를 공개할지 여부\n- 고객 리뷰를 인용할 경우 원문, 작성자 공개 범위, 사용 허가\n- 지역별 실제 방문·업무·사례가 있다면 확인 가능한 사실; 없다면 지역 고유 주장 금지\n\n현재 저장소에서 공개 범위를 확인할 수 있는 화면은 름랩 자체 CMS 데모 3장과 운영 가이드 예시뿐입니다. 이를 관련 웹·관리자 서비스에만 연결하며 고객 프로젝트 결과로 표시하지 않습니다.\n\n## 외부 프로필\n\n기준 NAP: 름랩 / REUMLAB · 경기도 화성시 동탄구 동탄첨단산업1로 58, 307호(영천동) · 010-8111-9370\n\n- 네이버 플레이스 최종 승인 화면과 공개 URL\n- Google Business Profile 최종 승인 화면과 공개 URL\n- 업종 카테고리·영업시간·서비스 지역의 실제 운영 값\n\n민감한 로그인 정보, 인증 코드, 개인 고객 데이터는 문서에 넣지 마세요.\n`, 'utf8');

const ownerPath = join(OUTPUT, 'OWNER_INPUT_REQUIRED.md');
writeFileSync(ownerPath, readFileSync(ownerPath, 'utf8') + `\n## 입력별 이유와 적용 범위\n\n| 입력 | 필요한 이유 | 적용 페이지 |\n|---|---|---|\n| GSC 페이지 필터 쿼리·선택 canonical·CWV | 실제 쿼리 중복과 Google canonical·현장 성능 판정 | IMPROVE URL과 핵심 템플릿 |\n| Bing 처리 완료 후 URL/AI export | Bing 검색 수요·Copilot 인용 여부 판정 | 색인 URL 전체 |\n| GA4·Netlify 성공 문의 export | organic/AI 유입과 서버 성공 리드 연결 | CTA 페이지 및 문의 폼 17개 |\n| 프로젝트별 기간·결과·공개 동의 | 허위 수치 없이 사례의 결과와 한계 보강 | /portfolio/ 및 사례 15개 |\n| 공개 가능한 작성·검수자 역할·경력 | 개인 저자 엔터티를 사실 기반으로 연결 | 가이드 45개, 블로그 10개 |\n| 실제 화면·산출물과 사용 허가 | 고유 시각 근거와 페이지별 OG 이미지 제작 | 핵심 8~12개 페이지, 사례 15개 |\n| 지역별 실제 업무·사례 | 템플릿 문구를 지역 고유 1차 근거로 대체 | 지역×서비스 페이지 |\n`, 'utf8');
writeFileSync('OWNER_INPUT_REQUIRED.md', readFileSync(ownerPath, 'utf8'), 'utf8');

writeFileSync(join(OUTPUT, 'DATA_SOURCES.md'), `# 콘솔 실데이터 출처와 범위\n\n기준일: ${DATE}\n\n## 사용한 데이터\n\n| 소스 | 속성·기간 | 확보 범위 | 판정 사용 |\n|---|---|---|---|\n| Google Search Console | URL-prefix \`https://reumlab.com/\`, 16개월 선택 | ${gscByUrl.size}개 URL 행; 현재 ${source.length}개 중 ${gscMatched}개 일치 | 클릭·노출·CTR·평균 순위 |\n| 네이버 Search Advisor | \`https://reumlab.com\`, 최근 90일, PC+Mobile | 검색 웹문서 TOP 30 중 현재 목록 ${naverMatched}개 일치 | 클릭·노출·CTR |\n| Bing Webmaster Tools | \`https://reumlab.com\`, 2026-09-11 확인 | Search Performance URL 행 없음(처리 중); AI Performance 최근 90일 0 citations | 상태만 기록, URL 판정 미사용 |\n| GA4 | 현재 로그인 계정 | reumlab 속성 없음 | 미사용 |\n\nGSC 화면 합계는 클릭 188, 노출 11,358, CTR 1.7%, 평균 순위 24.6입니다. 선택 기간은 16개월이지만 속성에 실제 표시된 날짜는 2026-02-22~2026-09-08입니다. 네이버 화면 합계는 약 290클릭, 2.2만 노출, CTR 1.3%입니다.\n\n## 공개 데이터 원칙\n\n원본 CSV와 정확한 URL별 수치는 사업 텔레메트리이므로 \`docs/seo-aeo/private/\`에만 저장하고 git에서 제외합니다. 공개 \`URL_DECISIONS.csv\`에는 0, 1-2, 3-9, 10+처럼 구간화한 값과 판정 근거만 기록합니다. 정확한 로컬 결과는 \`private/URL_METRICS_EXACT_${DATE}.csv\`에서 확인합니다.\n\n## 판정 한계\n\n- GSC export의 사이트 전체 Queries 시트는 URL별 쿼리 연결을 제공하지 않습니다. cannibalization 판단에는 페이지 필터를 건 쿼리 export가 필요합니다.\n- 네이버는 화면에서 TOP 30만 제공하므로 목록에 없는 URL을 0으로 간주하지 않습니다.\n- Bing은 데이터 처리 완료 전이며, 0 citations는 URL별 미노출을 확정하지 않습니다.\n- GA4 전환 데이터가 없어 RETAIN/IMPROVE/MONITOR까지만 제안하며 301/noindex/삭제는 적용하지 않습니다.\n`, 'utf8');

writeFileSync(join(OUTPUT, 'README.md'), `# SEO·AEO deliverables\n\n${DATE} 기준 정적 감사 및 검색 실데이터 기반 실행 문서입니다.\n\n- EXECUTIVE_SUMMARY.md — 우선순위와 핵심 결론\n- URL_DECISIONS.csv — ${source.length}개 색인 URL의 공개 가능한 수치 구간·판정\n- CONTENT_EVIDENCE_GAPS.csv — 페이지별 근거 공백\n- QUERY_INTENT_MAP.csv — 검색 의도·대상·퍼널 맵\n- MEASUREMENT_PLAN.md — 30/60/90일 측정 체계\n- DATA_SOURCES.md — 사용한 콘솔 범위와 남은 한계\n- OWNER_INPUT_REQUIRED.md — GA4·실제 사례 등 소유자만 제공할 수 있는 정보\n\n원본 GSC·네이버 수치와 정확한 URL별 결과는 git에서 제외된 \`docs/seo-aeo/private/\`에만 둡니다. 재생성: \`npm run seo:report:aeo\`\n`, 'utf8');

console.log(`SEO/AEO deliverables: ${source.length} URLs, RETAIN ${counts.RETAIN}, IMPROVE ${counts.IMPROVE}, MONITOR ${counts.MONITOR}`);
