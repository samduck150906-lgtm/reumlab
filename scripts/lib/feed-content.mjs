import { parse } from 'node-html-parser';
export const escapeXml = value => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
export const cdata = value => `<![CDATA[${value.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;
export function validContentDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`Invalid content date: ${value}`);
  const date = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value || date.getTime() > Date.now() + 86400000) throw new Error(`Invalid/future content date: ${value}`);
  return date;
}
export function articleForFeed(page, canonical) {
  const source = page.querySelector('main article');
  if (!source) throw new Error(`Missing rendered article: ${canonical}`);
  const article = parse(source.outerHTML);
  article.querySelectorAll('script,style').forEach(node => node.remove());
  article.querySelectorAll('*').forEach(node => {
    for (const attribute of ['href', 'src', 'poster']) {
      const value = node.getAttribute(attribute);
      if (!value) continue;
      const absolute = new URL(value, canonical);
      if (!['https:', 'http:', 'tel:', 'mailto:'].includes(absolute.protocol)) throw new Error(`Unsupported feed URL: ${value}`);
      node.setAttribute(attribute, escapeXml(absolute.href));
    }
    // Fail if future articles gain responsive images until conversion is implemented.
    if (node.getAttribute('srcset')) throw new Error(`RSS srcset needs explicit conversion: ${canonical}`);
    Object.keys(node.attributes).filter(name => /^on/i.test(name)).forEach(name => node.removeAttribute(name));
  });
  if (!article.querySelector('h1') || article.textContent.trim().length < 100) throw new Error(`Incomplete article: ${canonical}`);
  return article.toString();
}
