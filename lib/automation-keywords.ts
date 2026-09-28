import { AUTOMATION_DOMAINS, type AutomationDomain } from './automation-domains';

export interface AutomationKeywordRow {
  domain: string;
  category: string;
  keyword: string;
  normalizedKeyword: string;
  language: 'ko';
  tool: string;
  task: string;
  buyer: string;
  intent: 'commercial' | 'transactional' | 'informational';
  funnel: 'TOFU' | 'MOFU' | 'BOFU';
  serviceType: string;
  clusterId: string;
  targetPage: string;
  priority: 'S' | 'A' | 'B';
  confidence: 'high' | 'medium';
  indexableCandidate: boolean;
  rationale: string;
}

export interface AutomationQuestionRow {
  domain: string;
  category: string;
  tool: string;
  task: string;
  question: string;
  targetPage: string;
  clusterId: string;
}

const KEYWORD_PATTERNS = [
  { suffix: '자동화', intent: 'informational', funnel: 'TOFU' },
  { suffix: '프로그램 개발', intent: 'commercial', funnel: 'MOFU' },
  { suffix: '개발 외주 업체', intent: 'transactional', funnel: 'BOFU' },
  { suffix: '시스템 구축 견적', intent: 'transactional', funnel: 'BOFU' },
  { suffix: 'AI 연동 개발', intent: 'commercial', funnel: 'MOFU' },
] as const;

const QUESTION_PATTERNS = [
  (tool: string, task: string) => `${tool}에서 ${task} 작업을 자동화할 수 있나요?`,
  (tool: string, task: string) => `${tool}의 ${task} 업무를 줄이는 프로그램은 어떻게 만드나요?`,
  (tool: string, task: string) => `${tool} API가 없어도 ${task} 자동화가 가능한가요?`,
  (tool: string, task: string) => `${task} 자동화에는 웹앱과 데스크톱 프로그램 중 무엇이 맞나요?`,
  (tool: string, task: string) => `${tool} ${task} 자동화 개발 비용은 무엇으로 정해지나요?`,
  (tool: string, task: string) => `${task} 결과를 사람이 검수하도록 만들 수 있나요?`,
];

const BUYER_BY_CATEGORY: Record<string, string> = {
  콘텐츠: '콘텐츠 제작팀·스튜디오·마케팅 담당자',
  설계: '설계사무소·건설사·제조 설계팀',
  사무: '운영팀·관리팀·기획팀',
  영업: '영업팀·고객지원팀·사업개발팀',
  인사: '인사팀·경영지원팀',
  재무: '회계팀·재무팀·구매팀',
  전문업무: '법무·특허·연구 담당자',
  커머스: '온라인 판매자·브랜드 운영팀',
  마케팅: '마케팅팀·광고 운영자',
  물류: '물류사·창고·무역 담당자',
  제조: '생산기술·품질·현장 담당자',
  산업: '산업별 운영자·관리자',
};

export function normalizeAutomationKeyword(value: string): string {
  return value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function targetFor(domain: AutomationDomain): string {
  return domain.publishMode === 'research-only' ? '/ai-automation/' : domain.targetPage;
}

export function generateAutomationKeywords(): AutomationKeywordRow[] {
  const rows: AutomationKeywordRow[] = [];
  const globalKeys = new Set<string>();

  for (const domain of AUTOMATION_DOMAINS) {
    const targetPage = targetFor(domain);
    for (const tool of domain.tools.slice(0, 5)) {
      for (const task of domain.tasks.slice(0, 5)) {
        for (const pattern of KEYWORD_PATTERNS) {
          let keyword = `${tool} ${task} ${pattern.suffix}`;
          let normalizedKeyword = normalizeAutomationKeyword(keyword);
          if (globalKeys.has(normalizedKeyword)) {
            keyword = `${domain.name} ${keyword}`;
            normalizedKeyword = normalizeAutomationKeyword(keyword);
          }
          if (globalKeys.has(normalizedKeyword)) continue;
          globalKeys.add(normalizedKeyword);
          rows.push({
            domain: domain.slug,
            category: domain.category,
            keyword,
            normalizedKeyword,
            language: 'ko',
            tool,
            task,
            buyer: BUYER_BY_CATEGORY[domain.category] ?? '반복 업무를 운영하는 기업 담당자',
            intent: pattern.intent,
            funnel: pattern.funnel,
            serviceType: domain.name,
            clusterId: `automation:${domain.slug}`,
            targetPage,
            priority: domain.priority,
            confidence: domain.priority === 'S' ? 'high' : 'medium',
            indexableCandidate: domain.publishMode !== 'research-only',
            rationale: '프로그램·실제 업무·개발 또는 구매 의도를 함께 포함한 검색 후보. 별도 URL이 아니라 동일 의도 cluster로 통합한다.',
          });
        }
      }
    }
  }
  return rows;
}

export function generateAutomationQuestions(): AutomationQuestionRow[] {
  const rows: AutomationQuestionRow[] = [];
  for (const domain of AUTOMATION_DOMAINS) {
    const targetPage = targetFor(domain);
    for (let index = 0; index < 5; index += 1) {
      const tool = domain.tools[index % domain.tools.length];
      const task = domain.tasks[index % domain.tasks.length];
      for (const makeQuestion of QUESTION_PATTERNS) {
        rows.push({
          domain: domain.slug,
          category: domain.category,
          tool,
          task,
          question: makeQuestion(tool, task),
          targetPage,
          clusterId: `automation:${domain.slug}`,
        });
      }
    }
  }
  return rows;
}
