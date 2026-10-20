import type { AgencySection, ContentField } from '../../../../lib/development-agency/types';
const groups: readonly (readonly [ContentField,...ContentField[]])[] = [
  ['audience'],['actualProblems'],['userRoles'],['workflows'],['coreFeatures'],['adminFeatures'],
  ['integrations','dataEntities'],['edgeCases'],['mvpScope','expansionScope'],
  ['costDrivers','timelineDrivers'],['complianceChecks'],['handover'],
];
export function sections(headings:readonly string[]):AgencySection[] {
  if(headings.length!==12) throw new Error('Twelve individually authored headings required');
  return headings.map((heading,index)=>({id:`scope-${index+1}`,heading,fields:groups[index]}));
}
