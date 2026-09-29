import { AUTOMATION_DOMAINS } from './automation-domains';

export interface AutomationHubItem {
  slug: string;
  name: string;
  category: string;
  priority: 'S' | 'A' | 'B';
  published: boolean;
  href: string | null;
  shortDescription: string;
  tools: string[];
}

/** 정적 허브로 내릴 공개 안전 projection. 긴 연구 키워드와 내부 rationale은 포함하지 않는다. */
export function automationHubDomains(): AutomationHubItem[] {
  return AUTOMATION_DOMAINS.map((domain) => ({
    slug: domain.slug,
    name: domain.name,
    category: domain.category,
    priority: domain.priority,
    published: domain.publishMode !== 'research-only',
    href: domain.publishMode === 'research-only' ? null : domain.targetPage,
    shortDescription: domain.shortDescription,
    tools: domain.tools.slice(0, 4),
  }));
}
