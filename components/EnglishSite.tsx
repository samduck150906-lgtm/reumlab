import React from 'react';
import { SITE } from '../lib/seo';
import { websiteNode, organizationNode, businessNode } from '../lib/schema';
import { ENGLISH_PAGES, ENGLISH_SERVICES, ENGLISH_UPDATED, englishPackages, englishUrl, languageAlternates, krw, type EnglishPage } from '../lib/english';

const json = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');
const SourceLink = ({href,label,language}:{href:string;label:string;language?:string}) => <a href={href} hrefLang={language}>{label}{language === 'ko' ? ' (Korean)' : ''}</a>;

export function englishGraph(page: EnglishPage) {
  const url = englishUrl(page.path);
  const pageId = `${url}#webpage`;
  const parts = page.sections.map(s => ({ '@type':'WebPageElement', '@id':`${url}#${s.id}`, url:`${url}#${s.id}`, name:s.title, text:[...s.paragraphs,...(s.items??[])].join('\n'), inLanguage:'en', isPartOf:{'@id':pageId} }));
  const graph: Record<string,unknown>[] = [websiteNode(),organizationNode(),businessNode(),{
    '@type':page.kind === 'guide' ? 'Article' : 'WebPage', '@id':pageId, url,
    name:page.title, headline:page.h1, description:page.description, inLanguage:'en',
    abstract:page.answer, publisher:{'@id':`${SITE.domain}/#organization`},
    isPartOf:{'@id':`${SITE.domain}/#website`}, citation:page.sources.map(s => new URL(s.href,SITE.domain).href), hasPart:parts,
    ...(page.kind==='guide'?{author:{'@id':`${SITE.domain}/#organization`}, datePublished:ENGLISH_UPDATED,dateModified:ENGLISH_UPDATED}:{}),
  },{
    '@type':'BreadcrumbList','@id':`${url}#breadcrumb`, itemListElement:[
      {'@type':'ListItem',position:1,name:'REUMLAB English',item:englishUrl('/en/')},
      ...(page.path==='/en/'?[]:[{'@type':'ListItem',position:2,name:page.label,item:url}]),
    ],
  }];
  if(page.kind==='service') graph.push({'@type':'Service','@id':`${url}#service`,url,name:page.h1,description:page.answer,provider:{'@id':`${SITE.domain}/#organization`},areaServed:{'@type':'Country',name:'South Korea'}});
  if(page.faqs.length) graph.push({'@type':'FAQPage','@id':`${url}#faq`,inLanguage:'en',mainEntity:page.faqs.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))});
  return {'@context':'https://schema.org','@graph':graph};
}

function Pricing() {
  return <section className="en-section" aria-labelledby="package-prices"><div className="en-section-heading"><p className="en-eyebrow">Scope references</p><h2 id="package-prices">Website and app packages</h2></div>
    <p>All amounts are in South Korean won and include VAT. Approximate durations apply to the agreed package scope. External services and additional features are quoted separately.</p>
    <div className="en-table-wrap" role="region" aria-label="Package prices, scroll horizontally on small screens" tabIndex={0}><table><caption>Published REUMLAB packages, synchronized with the Korean price source</caption><thead><tr><th scope="col">Package</th><th scope="col">Price incl. VAT</th><th scope="col">Approx. duration</th><th scope="col">Starting scope</th></tr></thead>
      <tbody>{englishPackages.map(p=><tr key={p.name} data-package={p.name}><th scope="row">{p.englishName}</th><td>{krw(p.price)}</td><td>{p.englishDuration}</td><td>{p.englishScope}</td></tr>)}</tbody></table></div>
  </section>;
}

const cases = [
  {id:'edu-erp',title:'Education operations ERP',problem:'Payments, attendance and consultation records were fragmented across channels and had to be combined manually.',scope:'Service architecture, administrator web application, database and deployment.'},
  {id:'edu-review',title:'Local education discovery app',problem:'Local education information was scattered, making it difficult to compare options against specific conditions.',scope:'App planning, Flutter development, recommendation logic and administrator integration.'},
  {id:'life-match',title:'Local-service matching platform',problem:'Quote requests and provider assignments were handled by phone and manually, leading to missing or duplicate records.',scope:'Platform architecture, web and app development, notifications and administration.'},
];
function Portfolio(){return <section className="en-section" aria-labelledby="selected-cases"><h2 id="selected-cases">Selected published examples</h2><div className="en-card-grid">{cases.map(c=><article className="en-card" key={c.id}><p className="en-eyebrow">Anonymized implementation</p><h3>{c.title}</h3><p>{c.problem}</p><p><strong>Published scope</strong><br/>{c.scope}</p><a href={`/portfolio/${c.id}/`} hrefLang="ko">Read the original case (Korean)</a></article>)}</div></section>}

function InquiryForm(){return <section className="en-section en-inquiry" aria-labelledby="project-inquiry"><div><p className="en-eyebrow">Project inquiry</p><h2 id="project-inquiry">Start with your brief.</h2><p>Email works too: <a href={`mailto:${SITE.email}`}>{SITE.email}</a></p><p>Based in Dongtan, South Korea.<br/>Confirm meeting times and working-language arrangements with your project contact.</p></div>
  <form name="en-project-inquiry" method="POST" action="/en/inquiry-received/" data-netlify="true" netlify-honeypot="bot-field" data-english-inquiry="true">
    <input type="hidden" name="form-name" value="en-project-inquiry"/>
    <input type="hidden" name="language" value="en"/><input type="hidden" name="source-page" value="/en/contact/"/>
    <p hidden><label>Leave this blank<input name="bot-field" tabIndex={-1} autoComplete="off"/></label></p>
    <div className="en-form-grid"><label>Your name<input name="name" autoComplete="name" required maxLength={120}/></label><label>Email address<input type="email" name="email" autoComplete="email" required maxLength={254}/></label></div>
    <label>Company <span>(optional)</span><input name="company" autoComplete="organization" maxLength={160}/></label>
    <label>What would you like to build?<select name="service" defaultValue="Not sure yet"><option>Not sure yet</option><option>App or MVP</option><option>Website or web application</option><option>ERP or business system</option><option>AI chatbot or workflow</option><option>SEO and AI search improvement</option><option>Existing-service renewal</option></select></label>
    <label>Project brief<textarea name="project-brief" required minLength={20} maxLength={8000} rows={6} aria-describedby="brief-help"/></label><p id="brief-help" className="en-small">Describe your users, essential tasks, reference links and any collaboration needs. Do not include credentials or private customer records.</p>
    <div className="en-form-grid"><label>Indicative budget in KRW <span>(optional)</span><input name="budget" maxLength={120} placeholder="For example, a range in KRW"/></label><label>Target date or time zone <span>(optional)</span><input name="schedule" maxLength={160}/></label></div>
    <label className="en-consent"><input type="checkbox" name="privacy-consent" value="agreed" required/><span>I agree to the collection and use of my name, email and project information to review and reply to this inquiry. <a href="/en/privacy/">Privacy overview</a> and <a href="/privacy/" hrefLang="ko">full policy (Korean)</a>.</span></label>
    <button className="en-button" type="submit">Send project inquiry</button><p className="en-small">Submitting a brief does not create a contract or confirm a quote or delivery date.</p>
  </form></section>}

export function EnglishSite({page}:{page:EnglishPage}) {
  const url=englishUrl(page.path); const alternates=languageAlternates(page);
  const ogImage=englishUrl('/english-og.png');
  const gtm=process.env.NEXT_PUBLIC_GTM_ID || 'GTM-WHLMP8ZD';
  if(!/^GTM-[A-Z0-9]+$/.test(gtm)) throw new Error('Invalid public GTM container ID');
  return <html lang="en"><head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>{page.title}</title><meta name="description" content={page.description}/><meta name="robots" content={page.noindex?'noindex,follow':'index,follow,max-image-preview:large'}/><link rel="canonical" href={url}/>
    {Object.entries(alternates).map(([lang,href])=><link key={lang} rel="alternate" hrefLang={lang} href={href}/>)}
    <meta property="og:type" content={page.kind==='guide'?'article':'website'}/><meta property="og:locale" content="en_US"/><meta property="og:site_name" content={SITE.name}/><meta property="og:url" content={url}/><meta property="og:title" content={page.title}/><meta property="og:description" content={page.description}/><meta property="og:image" content={ogImage}/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/>
    <meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content={page.title}/><meta name="twitter:description" content={page.description}/><meta name="twitter:image" content={ogImage}/><meta name="theme-color" content="#123b9b"/>
    <link rel="icon" href="/favicon.ico"/><link rel="stylesheet" href="/assets/english.css"/><script defer src="/assets/english.js" data-gtm={gtm}></script>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:json(englishGraph(page))}}/>
  </head><body><a className="en-skip" href="#main">Skip to content</a>
    <header className="en-header"><div className="en-wrap en-nav"><a className="en-logo" href="/en/" aria-label="REUMLAB English home"><img src="/logo.png" width="30" height="30" alt=""/>REUMLAB</a>
      <nav aria-label="Main navigation"><details className="en-services-menu"><summary>Services</summary><div>{ENGLISH_SERVICES.map(p=><a href={p.path} key={p.path}>{p.label}</a>)}</div></details><a href="/en/portfolio/">Work</a><a href="/en/pricing/">Pricing</a><a href="/en/process/">Process</a><a href={page.korean??'/'} lang="ko" hrefLang="ko" className="en-language">한국어</a></nav><a className="en-button en-nav-cta" href="/en/contact/" data-english-event="inquiry_open">Discuss a project</a>
    </div></header>
    <main id="main" className="en-wrap">
      {page.path!=='/en/'&&<nav className="en-breadcrumb" aria-label="Breadcrumb"><a href="/en/">REUMLAB English</a><span aria-hidden="true">/</span><span>{page.label}</span></nav>}
      <section className={`en-hero ${page.kind==='home'?'en-hero-home':''}`} aria-labelledby="page-title"><div><p className="en-eyebrow">{page.kind==='home'?'Software development · South Korea':page.kind==='guide'?'A practical development guide':page.label}</p><h1 id="page-title">{page.h1}</h1><p className="en-answer" id="short-answer">{page.answer}</p><div className="en-actions"><a className="en-button" href={page.widget==='contact'?'#project-inquiry':'/en/contact/'} data-english-event="inquiry_open">{page.widget==='contact'?'Write your brief':'Discuss your project'}</a><a className="en-text-link" href={page.widget==='pricing'?'/en/process/':'/en/pricing/'}>{page.widget==='pricing'?'See how we work':'View package prices'}</a></div></div>
        {page.kind==='home'&&<aside className="en-project-panel" aria-label="Project deliverables"><p className="en-eyebrow">From idea to operating product</p><h2>Your project,<br/>clearly defined.</h2><dl><div><dt>Scope</dt><dd>Users, workflows and exclusions</dd></div><div><dt>Review</dt><dd>Screens and staged test links</dd></div><div><dt>Release</dt><dd>Acceptance and deployment</dd></div><div><dt>Ownership</dt><dd>Source code and operating access</dd></div></dl><a href="/en/source-code-handover/">Explore the handover approach</a></aside>}
      </section>
      {page.kind==='home'&&<section className="en-section" aria-labelledby="services"><div className="en-section-heading"><p className="en-eyebrow">What do you need to build?</p><h2 id="services">Start with the right scope.</h2></div><div className="en-card-grid">{ENGLISH_SERVICES.slice(0,6).map(p=><article className="en-card" key={p.path}><h3><a href={p.path}>{p.label}</a></h3><p>{p.answer.split('. ').slice(0,2).join('. ').replace(/[.!?]$/,'')}.</p><a href={p.path}>Explore {p.label}</a></article>)}</div></section>}
      {page.widget==='pricing'&&<Pricing/>}{page.widget==='portfolio'&&<Portfolio/>}{page.widget==='contact'&&<InquiryForm/>}
      <div className="en-reading-layout"><aside className="en-on-page"><nav aria-label="On this page"><p className="en-eyebrow">On this page</p>{page.sections.map(s=><a href={`#${s.id}`} key={s.id}>{s.title}</a>)}{page.faqs.length>0&&<a href="#questions">Common questions</a>}<a href="#sources">Sources and scope</a></nav></aside><div className="en-reading">
        {page.sections.map(s=><section className="en-section" key={s.id} aria-labelledby={s.id}><h2 id={s.id}><a className="en-section-anchor" href={`#${s.id}`}>{s.title}</a></h2>{s.paragraphs.map(t=><p key={t}>{t}</p>)}{s.items&&<ul>{s.items.map(t=><li key={t}>{t}</li>)}</ul>}</section>)}
        {page.faqs.length>0&&<section className="en-section" aria-labelledby="questions"><h2 id="questions">Common questions</h2>{page.faqs.map(f=><details className="en-faq" key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</section>}
        <section className="en-section en-sources" aria-labelledby="sources"><h2 id="sources">Sources and scope</h2><p>This page is published by REUMLAB, operated by <span lang="ko">{SITE.legalName}</span>. Service conditions and project examples are based on the linked public records. General planning checklists are examples, not claims about an undisclosed client.</p><ul>{page.sources.map(s=><li key={s.href}><SourceLink {...s}/></li>)}</ul><p className="en-small">English content published <time dateTime={ENGLISH_UPDATED}>November 24, 2026</time>. Prices are drawn from the shared published price source. To request a correction, email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with the page URL.</p></section>
      </div></div>
      {page.widget!=='contact'&&page.widget!=='received'&&<section className="en-next"><div><p className="en-eyebrow">Make the next step concrete</p><h2>Start with your users and their main task.</h2><p>A short brief helps establish scope before choosing a package.</p></div><a href="/en/contact/" className="en-button" data-english-event="inquiry_open">Discuss your project</a></section>}
    </main>
    <footer className="en-footer"><div className="en-wrap"><div className="en-footer-grid"><div><a className="en-logo" href="/en/"><img src="/logo.png" alt="" width="28" height="28"/>REUMLAB</a><p>A software development studio<br/>in Dongtan, South Korea.</p><a href={`mailto:${SITE.email}`}>{SITE.email}</a><p><a href="tel:+821081119370">+82 10-8111-9370</a><br/><span className="en-small">Korea local: {SITE.phone}</span></p></div><nav aria-label="English resources">{ENGLISH_PAGES.filter(p=>!p.noindex&&p.path!=='/en/').map(p=><a href={p.path} key={p.path}>{p.label}</a>)}</nav></div>
      <div className="en-business"><p>Operating business: <span lang="ko">{SITE.legalName}</span> · Business registration: {SITE.bizNo}<br/>307, 58 Dongtancheomdansaneop 1-ro, Dongtan-gu, Hwaseong-si, Gyeonggi-do {SITE.postalCode}, South Korea<br/><span lang="ko">{SITE.address}</span></p><p><a href="/privacy/" hrefLang="ko">Full privacy policy (Korean)</a> · <a href="/terms/" hrefLang="ko">Service terms (Korean)</a> · <a href="/" lang="ko" hrefLang="ko">한국어 사이트</a></p><p>© 2026 REUMLAB. All rights reserved.</p></div>
    </div></footer>
  </body></html>;
}
