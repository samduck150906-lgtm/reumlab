import ReumSalesLanding from '../components/ReumSalesLanding';
import { getSite } from '../lib/data';
import { OrganizationJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';

export default function Home() {
  const site = getSite();
  return (
    <>
      <OrganizationJsonLd />
      <BreadcrumbJsonLd slug="" />
      <ReumSalesLanding site={site} />
    </>
  );
}
