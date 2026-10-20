import { createHash } from 'node:crypto';
import { agencyHref, type AgencyPage } from '../../lib/development-agency/types';

export interface VerifiedRelease {
  sourceDigest: string;
  deploymentId: string;
  commit: string;
  verifiedAt: string;
  fingerprint: string;
  httpStatus: 200;
  searchSubmissionStatus?: string;
}

export function sourceDigest(page: AgencyPage, directory: readonly AgencyPage[]): string {
  return createHash('sha256').update(JSON.stringify({
    page,
    directory: page.slug === '' ? directory.map(item => ({
      href: agencyHref(item), primaryKeyword: item.primaryKeyword,
      description: item.description, serviceAxis: item.serviceAxis,
    })) : undefined,
  })).digest('hex');
}

export function releaseState(digest: string, release?: VerifiedRelease) {
  const verified = release?.httpStatus === 200
    && Boolean(release.deploymentId && release.commit && release.fingerprint)
    && Number.isFinite(Date.parse(release.verifiedAt));
  const sameVersion = verified && release?.sourceDigest === digest;
  return {
    deploymentStatus: sameVersion ? 'DEPLOYED_VERIFIED'
      : verified ? 'PREVIOUS_VERSION_DEPLOYED_SOURCE_CHANGED' : 'NOT_DEPLOYED',
    searchSubmissionStatus: sameVersion ? release?.searchSubmissionStatus || 'NOT_SUBMITTED'
      : verified ? 'CURRENT_SOURCE_NOT_SUBMITTED' : 'NOT_SUBMITTED',
    deployedAt: verified ? release?.verifiedAt : undefined,
    deploymentId: verified ? release?.deploymentId : undefined,
  };
}
