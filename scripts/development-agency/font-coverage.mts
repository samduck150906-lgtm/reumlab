import fs from 'node:fs';
import path from 'node:path';

export function parseUnicodeRange(value: string): Set<number> {
  const result = new Set<number>();
  for (const part of value.split(',')) {
    const match = /^\s*U\+([0-9a-f]+)(?:-([0-9a-f]+))?\s*$/i.exec(part);
    if (!match) throw new Error(`Unsupported font range: ${part}`);
    const start = parseInt(match[1], 16), end = parseInt(match[2] || match[1], 16);
    if (end < start || end > 0x10ffff) throw new Error(`Invalid font range: ${part}`);
    for (let point = start; point <= end; point++) result.add(point);
  }
  return result;
}

// The existing site declares BOTH the compact subset and the complete font.
// A glyph outside the subset may load the larger font; it is not missing.
export function readAgencyFontCoverage(root = process.cwd()) {
  const directory = path.join(root, 'public/fonts');
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'subset.json'), 'utf8'));
  const css = fs.readFileSync(path.join(root, 'app/globals.css'), 'utf8');
  const faces = css.match(/@font-face\s*\{[^}]*\}/gs) || [];
  for (const [filename, range] of [
    [manifest.subset, manifest.unicode_range],
    [manifest.source, manifest.rest_unicode_range],
  ]) {
    if (typeof filename !== 'string' || typeof range !== 'string'
      || !fs.existsSync(path.join(directory, filename))
      || !faces.some(face => face.includes(`/fonts/${filename}`) && face.includes(`unicode-range: ${range};`))) {
      throw new Error('Existing font manifest must match a declared, present font file');
    }
  }
  const subset = parseUnicodeRange(manifest.unicode_range);
  const supported = new Set([...subset, ...parseUnicodeRange(manifest.rest_unicode_range)]);
  return {subset, supported};
}
