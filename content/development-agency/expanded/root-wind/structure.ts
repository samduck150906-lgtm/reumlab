import type { AgencySection, ContentField } from '@/lib/development-agency/types';

const fields: readonly (readonly [ContentField, ...ContentField[]])[] = [
  ['audience'], ['actualProblems'], ['userRoles'], ['workflows'],
  ['coreFeatures'], ['adminFeatures'], ['dataEntities', 'integrations'],
  ['edgeCases'], ['mvpScope', 'expansionScope'], ['costDrivers', 'timelineDrivers'],
  ['complianceChecks'], ['handover'],
];

export function sections(headings: readonly string[]): readonly AgencySection[] {
  if (headings.length !== fields.length) throw new Error('Wind manuscript requires twelve complete sections');
  return headings.map((heading, index) => ({
    id: `scope-${index + 1}`, heading, fields: fields[index],
    format: index === 3 || index === 8 ? 'steps' : index === 2 ? 'cards' : 'prose',
  }));
}
