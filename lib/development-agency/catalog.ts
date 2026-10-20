import { cmsPage } from '@/content/development-agency/cms';
import { multilingualPage } from '@/content/development-agency/multilingual';
import { headlessWordPressPage } from '@/content/development-agency/headless-wordpress';
import { serverMigrationPage } from '@/content/development-agency/server-migration';
import { codeAuditPage } from '@/content/development-agency/code-audit';
import { agencyHub } from '@/content/development-agency/hub';
import { appIntegrationPages } from '@/content/development-agency/app-integrations';
import { businessSystemPages } from '@/content/development-agency/business-systems';
import { technicalOptionPages } from '@/content/development-agency/technical-options';
import { industryWorkflowPages } from '@/content/development-agency/industry-workflows';
import { franchiseRecruitmentPage } from '@/content/development-agency/franchise-recruitment';
import { b2bResponseAiPage } from '@/content/development-agency/b2b-response-ai';
import { marketplaceAiPage } from '@/content/development-agency/marketplace-ai';
import { marketplaceBackofficePage } from '@/content/development-agency/marketplace-backoffice';
import { expandedAgencyPages } from './expanded-catalog';
import { windWebsitePage } from '@/content/development-agency/expanded/root-wind/website';
import { windPortalPage } from '@/content/development-agency/expanded/root-wind/portal';
import { windManagementPage } from '@/content/development-agency/expanded/root-wind/management';
import { windFieldPage } from '@/content/development-agency/expanded/root-wind/field';
import { windAiPage } from '@/content/development-agency/expanded/root-wind/ai';
import { assertAgencyPages, type AgencyPage } from './types';

// This explicit registry contains completed manuscripts only. The build queue
// is a planning report, never a source of placeholder or indexable pages.
export const agencyPages: readonly AgencyPage[] = [
  cmsPage, multilingualPage, headlessWordPressPage,
  serverMigrationPage, codeAuditPage,
  ...appIntegrationPages, ...businessSystemPages,
  ...technicalOptionPages,
  ...industryWorkflowPages, franchiseRecruitmentPage,
  b2bResponseAiPage, marketplaceAiPage, marketplaceBackofficePage,
  windWebsitePage, windPortalPage, windManagementPage, windFieldPage, windAiPage,
  ...expandedAgencyPages,
];
export { agencyHub };
assertAgencyPages([agencyHub, ...agencyPages]);
