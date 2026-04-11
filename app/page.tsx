import ReumSalesLanding from '../components/ReumSalesLanding';
import { getSite } from '../lib/data';
import { ReumHomeGraphJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';

export default function Home() {
  const site = getSite();
  return (
    <>
      <ReumHomeGraphJsonLd />
      <BreadcrumbJsonLd slug="" />
      <ReumSalesLanding site={site} />
    </>
  );
}
