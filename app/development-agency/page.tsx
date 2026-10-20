import AgencyArticle from '@/components/development-agency/AgencyArticle';
import { agencyHub, agencyPages } from '@/lib/development-agency/catalog';
import { agencyMetadata } from '@/lib/development-agency/metadata';

export const dynamic = 'force-static';
export const metadata = agencyMetadata(agencyHub);

export default function DevelopmentAgencyHub() {
  return <AgencyArticle page={agencyHub} directory={agencyPages} />;
}
