import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseCsv, toCsv } from './neo-lib.mjs';

const promptSet = JSON.parse(readFileSync('tools/geo/prompts-v1.json', 'utf8'));
const existing = parseCsv(readFileSync('docs/geo/query-map.csv', 'utf8'));
const byId = new Map(existing.map((row) => [row.prompt_id, row]));
const brandMappings = {
  B01: { primary_target_url: 'https://reumlab.com/', supporting_urls: 'https://reumlab.com/portfolio/|https://reumlab.com/guide/', missing_information: 'independent company profile evidence', available_evidence: 'SITE entity, public services, NAP and portfolio', content_change_needed: 'preserve factual brand answer; do not add unsupported awards or scale claims', priority: 'P1', status: 'CONTROL' },
  B02: { primary_target_url: 'https://reumlab.com/mvp/', supporting_urls: 'https://reumlab.com/cost/|https://reumlab.com/guide/mvp-cost/', missing_information: 'project-specific estimate inputs', available_evidence: 'VAT-included public package prices and scope', content_change_needed: 'keep package price and custom estimate clearly separated', priority: 'P1', status: 'CONTROL' },
  B03: { primary_target_url: 'https://reumlab.com/source-handover/', supporting_urls: 'https://reumlab.com/guide/dev-process/|https://reumlab.com/maintenance/', missing_information: 'contract-specific third-party licence exceptions', available_evidence: 'published transfer policy and limitations', content_change_needed: 'preserve qualified handover answer', priority: 'P1', status: 'CONTROL' },
  B04: { primary_target_url: 'https://reumlab.com/portfolio/', supporting_urls: 'https://reumlab.com/portfolio/edu-erp/|https://reumlab.com/portfolio/space-booking/', missing_information: 'named client permission and independently verifiable outcomes', available_evidence: 'anonymized implementation scope and deliverables', content_change_needed: 'do not invent client names, dates or performance', priority: 'P1', status: 'CONTROL' },
  B05: { primary_target_url: 'https://reumlab.com/geo-website/', supporting_urls: 'https://reumlab.com/website/|https://reumlab.com/guide/outsourcing-checklist/', missing_information: 'independent before/after search outcome evidence', available_evidence: 'published technical scope, limitations and measurement method', content_change_needed: 'preserve no-guarantee language and measure separately', priority: 'P1', status: 'CONTROL' },
};

function firstMatching(urls, fragment) {
  return urls.find((url) => url.includes(fragment)) ?? '';
}

const rows = promptSet.prompts.map((prompt) => {
  const source = byId.get(prompt.id) ?? brandMappings[prompt.id];
  if (!source) throw new Error(`docs/geo/query-map.csv에 ${prompt.id} 매핑이 없습니다.`);
  const supporting = source.supporting_urls.split('|').filter(Boolean);
  return {
    question_id: prompt.id,
    question: prompt.text,
    intent: prompt.group,
    naver_surface: 'WEB',
    canonical_answer_page: source.primary_target_url,
    supporting_guide: firstMatching(supporting, '/guide/'),
    supporting_case: firstMatching(supporting, '/portfolio/'),
    other_supporting_pages: supporting.filter((url) => !url.includes('/guide/') && !url.includes('/portfolio/')).join('|'),
    required_evidence: source.missing_information,
    current_evidence: source.available_evidence,
    current_gap: source.missing_information,
    action: source.content_change_needed,
    priority: source.priority,
    status: source.status,
  };
});

const headers = Object.keys(rows[0]);
mkdirSync('docs/neo', { recursive: true });
writeFileSync(join('docs/neo', 'query-map.csv'), toCsv(headers, rows), 'utf8');
const nonBrand = rows.filter((row) => row.question_id.startsWith('Q')).length;
const brandControl = rows.filter((row) => row.question_id.startsWith('B')).length;
writeFileSync(join('docs/neo', 'QUERY_MAP.md'), `# NEO 질문·의도 맵\n\n- 네이버 웹검색 비브랜드 질문: ${nonBrand}개\n- 브랜드 통제 질문: ${brandControl}개\n- 새 URL 생성: 0개\n- 원칙: 질문마다 페이지를 만들지 않고 기존 canonical 서비스·가이드·사례에 연결\n\n행 단위 근거와 보강 작업은 [query-map.csv](./query-map.csv)에 있습니다.\n`, 'utf8');
console.log(`NEO query map: ${rows.length} questions (${nonBrand} non-brand + ${brandControl} brand controls)`);
