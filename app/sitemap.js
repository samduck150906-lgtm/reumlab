import { getLandings, getClusters } from '../lib/data';

const BASE = 'https://reumlab.com';

export default function sitemap() {
  const now = new Date().toISOString().slice(0, 10);
  const urls = [
    { url: BASE + '/', lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: BASE + '/consultation/', lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: BASE + '/vvip/', lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    ...Object.keys(getClusters()).map((hubSlug) => ({
      url: `${BASE}/h/${hubSlug}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    ...getLandings().map((l) => ({
      url: `${BASE}/l/${l.slug}/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
  ];
  return urls;
}
