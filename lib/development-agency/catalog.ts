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
import { hydrogenWebsitePage } from '@/content/development-agency/expanded/root-hydrogen/website';
import { hydrogenPortalPage } from '@/content/development-agency/expanded/root-hydrogen/portal';
import { hydrogenManagementPage } from '@/content/development-agency/expanded/root-hydrogen/management';
import { hydrogenFieldPage } from '@/content/development-agency/expanded/root-hydrogen/field';
import { hydrogenAiPage } from '@/content/development-agency/expanded/root-hydrogen/ai';
import { electricalWebsitePage } from '@/content/development-agency/expanded/root-electrical/website';
import { electricalPortalPage } from '@/content/development-agency/expanded/root-electrical/portal';
import { electricalManagementPage } from '@/content/development-agency/expanded/root-electrical/management';
import { electricalFieldPage } from '@/content/development-agency/expanded/root-electrical/field';
import { electricalAiPage } from '@/content/development-agency/expanded/root-electrical/ai';
import { storageWebsitePage } from '@/content/development-agency/expanded/root-storage/website';
import { storagePortalPage } from '@/content/development-agency/expanded/root-storage/portal';
import { storageManagementPage } from '@/content/development-agency/expanded/root-storage/management';
import { storageFieldPage } from '@/content/development-agency/expanded/root-storage/field';
import { storageAiPage } from '@/content/development-agency/expanded/root-storage/ai';
import { evBatteryWebsitePage } from '@/content/development-agency/expanded/root-ev-battery/website';
import { evBatteryPortalPage } from '@/content/development-agency/expanded/root-ev-battery/portal';
import { evBatteryManagementPage } from '@/content/development-agency/expanded/root-ev-battery/management';
import { evBatteryFieldPage } from '@/content/development-agency/expanded/root-ev-battery/field';
import { evBatteryAiPage } from '@/content/development-agency/expanded/root-ev-battery/ai';
import { semiconductorWebsitePage } from '@/content/development-agency/expanded/root-semiconductor/website';
import { semiconductorPortalPage } from '@/content/development-agency/expanded/root-semiconductor/portal';
import { semiconductorManagementPage } from '@/content/development-agency/expanded/root-semiconductor/management';
import { semiconductorFieldPage } from '@/content/development-agency/expanded/root-semiconductor/field';
import { semiconductorAiPage } from '@/content/development-agency/expanded/root-semiconductor/ai';
import { displayWebsitePage } from '@/content/development-agency/expanded/root-display/website';
import { displayPortalPage } from '@/content/development-agency/expanded/root-display/portal';
import { displayManagementPage } from '@/content/development-agency/expanded/root-display/management';
import { displayFieldPage } from '@/content/development-agency/expanded/root-display/field';
import { displayAiPage } from '@/content/development-agency/expanded/root-display/ai';
import { biotechWebsitePage } from '@/content/development-agency/expanded/root-biotech/website';
import { biotechPortalPage } from '@/content/development-agency/expanded/root-biotech/portal';
import { biotechManagementPage } from '@/content/development-agency/expanded/root-biotech/management';
import { biotechFieldPage } from '@/content/development-agency/expanded/root-biotech/field';
import { biotechAiPage } from '@/content/development-agency/expanded/root-biotech/ai';
import { drugDevelopmentWebsitePage } from '@/content/development-agency/expanded/root-drug-development/website';
import { drugDevelopmentPortalPage } from '@/content/development-agency/expanded/root-drug-development/portal';
import { drugDevelopmentManagementPage } from '@/content/development-agency/expanded/root-drug-development/management';
import { drugDevelopmentFieldPage } from '@/content/development-agency/expanded/root-drug-development/field';
import { drugDevelopmentAiPage } from '@/content/development-agency/expanded/root-drug-development/ai';
import { clinicalDataWebsitePage } from '@/content/development-agency/expanded/root-clinical-data/website';
import { clinicalDataPortalPage } from '@/content/development-agency/expanded/root-clinical-data/portal';
import { clinicalDataManagementPage } from '@/content/development-agency/expanded/root-clinical-data/management';
import { clinicalDataFieldPage } from '@/content/development-agency/expanded/root-clinical-data/field';
import { clinicalDataAiPage } from '@/content/development-agency/expanded/root-clinical-data/ai';
import { researchEquipmentWebsitePage } from '@/content/development-agency/expanded/root-research-equipment/website';
import { researchEquipmentPortalPage } from '@/content/development-agency/expanded/root-research-equipment/portal';
import { researchEquipmentManagementPage } from '@/content/development-agency/expanded/root-research-equipment/management';
import { researchEquipmentFieldPage } from '@/content/development-agency/expanded/root-research-equipment/field';
import { researchEquipmentAiPage } from '@/content/development-agency/expanded/root-research-equipment/ai';
import { laboratoryOperationsWebsitePage } from '@/content/development-agency/expanded/root-laboratory-operations/website';
import { laboratoryOperationsAiPage } from '@/content/development-agency/expanded/root-laboratory-operations/ai';
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
  hydrogenWebsitePage, hydrogenPortalPage, hydrogenManagementPage, hydrogenFieldPage, hydrogenAiPage,
  electricalWebsitePage,
  electricalPortalPage,
  electricalManagementPage,
  electricalFieldPage,
  electricalAiPage,
  storageWebsitePage,
  storagePortalPage,
  storageManagementPage,
  storageFieldPage,
  storageAiPage,
  evBatteryWebsitePage,
  evBatteryPortalPage,
  evBatteryManagementPage,
  evBatteryFieldPage,
  evBatteryAiPage,
  semiconductorWebsitePage,
  semiconductorPortalPage,
  semiconductorManagementPage,
  semiconductorFieldPage,
  semiconductorAiPage,
  displayWebsitePage,
  displayPortalPage,
  displayManagementPage,
  displayFieldPage,
  displayAiPage,
  biotechWebsitePage,
  biotechPortalPage,
  biotechManagementPage,
  biotechFieldPage,
  biotechAiPage,
  drugDevelopmentWebsitePage,
  drugDevelopmentPortalPage,
  drugDevelopmentManagementPage,
  drugDevelopmentFieldPage,
  drugDevelopmentAiPage,
  clinicalDataWebsitePage,
  clinicalDataPortalPage,
  clinicalDataManagementPage,
  clinicalDataFieldPage,
  clinicalDataAiPage,
  researchEquipmentWebsitePage,
  researchEquipmentPortalPage,
  researchEquipmentManagementPage,
  researchEquipmentFieldPage,
  researchEquipmentAiPage,
  laboratoryOperationsWebsitePage,
  laboratoryOperationsAiPage,
  ...expandedAgencyPages,
];
export { agencyHub };
assertAgencyPages([agencyHub, ...agencyPages]);
