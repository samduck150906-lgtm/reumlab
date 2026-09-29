import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { automationHubDomains } from '../lib/automation-hub.ts';

await mkdir(resolve('content'), { recursive: true });
const items = automationHubDomains();
await writeFile(resolve('content/automation-domains.json'), `${JSON.stringify(items, null, 2)}\n`, 'utf8');
console.log(`Generated automation-domains.json: ${items.length} domains, ${items.filter((item) => item.published).length} linked`);
