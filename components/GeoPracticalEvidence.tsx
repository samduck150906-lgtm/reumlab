import React from 'react';
import { GEO_PRACTICAL_EVIDENCE } from '../lib/geo-practical-evidence';
import { evidenceAnchor } from '../lib/public-evidence';
import { SITE } from '../lib/seo';
import { JsonLdScript } from './JsonLd';

export default function GeoPracticalEvidence({ path }: { path: string }) {
  const record = GEO_PRACTICAL_EVIDENCE[path];
  if (!record) return null;
  const page = new URL(path, SITE.domain).href;
  const section = `${page}#${record.id}`;
  return <section className="geo-practical-evidence" aria-labelledby={record.id}>
    <JsonLdScript data={{
      '@context': 'https://schema.org', '@type': 'WebPageElement', '@id': section, url: section,
      name: record.title, text: record.answer, inLanguage: 'ko-KR',
      publisher: { '@id': `${SITE.domain}/#organization` },
      isPartOf: { '@type': 'WebPage', url: page },
      citation: record.sources.map(source => source.url),
      hasPart: record.rows.map(row => ({
        '@type': 'WebPageElement', '@id': `${page}#${record.id}-${evidenceAnchor(row[0])}`,
        name: row[0], text: row.slice(1).join('\n'), isPartOf: { '@id': section },
      })),
    }} />
    <h2 id={record.id}><a href={`#${record.id}`}>{record.title}</a></h2>
    <p>{record.answer}</p>
    <p className="geo-evidence-note">공개 문서를 바탕으로 작성한 설계·검수 예시입니다.</p>
    <div className="guide-table-wrap">
      <table className="guide-table">
        <caption>{record.title} — 설계·검수표</caption>
        <thead><tr><th scope="col">확인할 상황</th><th scope="col">검수 방법</th><th scope="col">남길 근거</th></tr></thead>
        <tbody>{record.rows.map(row => <tr id={`${record.id}-${evidenceAnchor(row[0])}`} key={row[0]}>
          <th scope="row">{row[0]}</th><td>{row[1]}</td><td>{row[2]}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <ul>{record.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul>
    <p className="geo-evidence-note"><time dateTime="2026-11-17">2026-11-17</time> 공개 문서 대조·검수 예시 추가 · 실제 적용 범위와 통과 기준은 프로젝트 조건에 맞춰 합의합니다.</p>
  </section>;
}
