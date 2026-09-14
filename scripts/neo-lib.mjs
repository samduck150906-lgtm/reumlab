import { createHash } from 'node:crypto';

export const PRODUCTION_ORIGIN = 'https://reumlab.com';

export function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

export function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i'));
  return match?.[1] ?? '';
}

export function htmlSignals(html) {
  const canonicalTag = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0]
    ?? [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0])
      .find((tag) => attribute(tag, 'rel').toLowerCase() === 'canonical')
    ?? '';
  const robotsTag = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0])
    .find((tag) => attribute(tag, 'name').toLowerCase() === 'robots') ?? '';
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '';
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]
    ?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() ?? '';
  return {
    canonical: attribute(canonicalTag, 'href'),
    robots: attribute(robotsTag, 'content') || 'index,follow',
    title,
    h1,
  };
}

export function parseCsv(text) {
  const records = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') { field += '"'; index += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') { row.push(field); field = ''; }
    else if (char === '\n') {
      row.push(field.replace(/\r$/, ''));
      records.push(row);
      row = [];
      field = '';
    } else field += char;
  }
  if (field || row.length) {
    row.push(field.replace(/\r$/, ''));
    records.push(row);
  }
  const [headers = [], ...rows] = records.filter((record) => record.some(Boolean));
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));
}

export function toCsv(headers, rows) {
  const cell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  return [headers, ...rows.map((row) => headers.map((header) => row[header] ?? ''))]
    .map((row) => row.map(cell).join(','))
    .join('\n') + '\n';
}

export function validateRssXml(xml, { origin = PRODUCTION_ORIGIN, maxBytes = 10 * 1024 * 1024 } = {}) {
  const errors = [];
  const bytes = Buffer.byteLength(xml);
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((match) => match[1]);
  if (bytes > maxBytes) errors.push(`feed size ${bytes} exceeds ${maxBytes}`);
  if (items.length === 0) errors.push('feed contains no item');
  for (const [index, item] of items.entries()) {
    const values = {};
    for (const tag of ['title', 'link', 'description', 'guid', 'pubDate']) {
      values[tag] = item.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'))?.[1]?.trim() ?? '';
      if (!values[tag]) errors.push(`item ${index + 1} has empty ${tag}`);
    }
    if (values.link && values.guid && values.link !== values.guid) errors.push(`item ${index + 1} link/guid mismatch`);
    if (values.link) {
      try {
        if (new URL(values.link).origin !== origin) errors.push(`item ${index + 1} origin mismatch`);
      } catch { errors.push(`item ${index + 1} link is not absolute`); }
    }
  }
  return { bytes, itemCount: items.length, errors };
}
