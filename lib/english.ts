import { PACKAGES, webFrom, appFrom } from './pricing';
import { SITE } from './seo';

export const ENGLISH_UPDATED = '2026-11-24';
export const englishUrl = (path: string) => `${SITE.domain}${path}`;
export const krw = (amount: number) => `KRW ${amount.toLocaleString('en-US')}`;
const PACKAGE_ENGLISH: Record<string,[string,string]> = {
  '웹 스타터':['Web Starter','An introduction and inquiry landing page'],
  '웹 + 강력 마케팅':['Web + Marketing','A website with search and campaign entry points'],
  '웹 비즈니스':['Web Business','A multi-page website and blog'],
  '웹 프리미엄':['Web Premium','A web app with administration and integrations'],
  '앱 라이트 MVP':['App Lite MVP','An app for testing a focused product idea'],
  '앱 스탠다드':['App Standard','An app with accounts, payments and administration'],
  '앱 AI':['App AI','An app with AI features or workflow automation'],
  '앱 프리미엄':['App Premium','A broader app with multiple functions and advanced AI'],
};
export const englishPackages = PACKAGES.map(p => {
  const translation=PACKAGE_ENGLISH[p.name];const days=p.duration.match(/\d+/)?.[0];
  if(!translation||!days)throw new Error('English package translation missing: '+p.name);
  return {...p,englishName:translation[0],englishDuration:`About ${days} days`,englishScope:translation[1]};
});

export type EnglishSection = { id: string; title: string; paragraphs: string[]; items?: string[] };
export type EnglishPage = {
  path: string; title: string; description: string; label: string; h1: string; answer: string;
  kind: 'home' | 'service' | 'guide' | 'information'; korean?: string;
  sections: EnglishSection[]; faqs: { q: string; a: string }[];
  sources: { href: string; label: string; language?: 'ko' | 'en' }[];
  widget?: 'pricing' | 'portfolio' | 'contact' | 'received'; noindex?: boolean;
};
const source = (href: string, label: string) => ({ href, label, language: 'ko' as const });
const section = (id: string, title: string, paragraphs: string[], items?: string[]): EnglishSection => ({ id, title, paragraphs, items });
export const ENGLISH_PAGES: EnglishPage[] = [
  {
    path: '/en/', label: 'Overview', title: 'Software Development in South Korea | REUMLAB',
    description: 'A software development studio in Dongtan, South Korea. Flutter apps, websites, MVPs, business systems and AI workflows with published KRW prices and source handover.',
    h1: 'Build your product with a development studio in Korea.', kind: 'home', korean: '/',
    answer: 'REUMLAB is a software development studio in Dongtan, Hwaseong, South Korea. We build Flutter apps, websites, MVPs, internal business systems and AI workflows, with deployment and source-code handover included in the agreed project scope.',
    sections: [
      section('who-we-help', 'A clear starting point for your project', ['Whether you are a founder in Korea or evaluating a Korean development partner from abroad, start with the users, the problem and the smallest useful release. You do not need a technical specification to describe your idea.', 'Use this English service overview to compare scope, published package prices and handover conditions. For a cross-border project, confirm the working language, meeting times, invoicing and payment arrangements before signing.']),
      section('ownership', 'Keep ownership after launch', ['A delivered product should be something your team can operate. We publish a source-code and account-handover policy, so the contract can identify repositories, domain and hosting accounts, database access and operating documentation.', 'Third-party services, API usage and maintenance must be identified separately. Package prices apply to the published scope; a custom quote is needed when features or integrations go beyond it.']),
      section('start-with-a-brief', 'Tell us what needs to work first', ['Send a short written brief with your users, essential tasks, reference products and target release date. Add an indicative budget in KRW if you have one. A useful first discussion separates required functions from later additions.'], ['An app or MVP: define the first complete user journey.', 'A business system: describe the records, user roles and approvals.', 'An AI workflow: identify the source data, expected answer and human approval points.']),
    ],
    faqs: [
      { q: 'Where is REUMLAB based?', a: 'REUMLAB is based in Dongtan, Hwaseong, Gyeonggi-do, South Korea. Its published services include remote project collaboration within Korea; international working arrangements should be confirmed in the project inquiry.' },
      { q: 'Can I submit a project inquiry in English?', a: 'Yes. You can use the English inquiry form or email a written brief to ceo@eternalsix.com. Confirm the working language and any live-meeting requirements before agreeing to a project.' },
      { q: 'What currency are the published prices in?', a: 'Prices are in South Korean won (KRW) and include VAT as published. They are not converted to USD or another currency, and cross-border invoicing and payment arrangements are confirmed separately.' },
    ], sources: [source('/', 'Korean studio overview and published conditions'), source('/source-handover/', 'Source-code and account handover policy'), source('/portfolio/', 'Published development examples')],
  },
  {
    path: '/en/app-development/', label: 'App development', kind: 'service', korean: '/app-development/',
    title: 'Flutter App Development in Korea | REUMLAB',
    description: 'Plan and build a Flutter app with a South Korea-based studio. Define user flows, payments, administration, release requirements and source-code handover.',
    h1: 'Flutter app development, from the first user flow to handover.',
    answer: `REUMLAB builds Flutter apps with the backend and administration needed for the agreed product scope. The published app package range starts at ${krw(appFrom)}, including VAT. Features, store submission requirements and external costs are confirmed before development.`,
    sections: [
      section('app-scope', 'Define the complete user journey', ['An app estimate should explain what a user can finish, rather than count screens alone. Registration, permissions, payment, notifications and administration each add operating responsibilities.', 'For an MVP, choose one useful journey that can be tested end to end. Document the exceptions too: a failed payment, an expired login, a cancelled reservation or a user without permission.'], ['User accounts and access roles', 'API and database connections', 'Payments, reservations or notifications when required', 'Operator screens and release documentation']),
      section('release-checks', 'Prepare for release early', ['Identify who owns the Apple and Google developer accounts, which devices must be supported and which privacy disclosures are required. Account verification and store review are external processes; a development schedule does not guarantee their approval dates.', 'Test the agreed journeys on the target devices and retain acceptance records. A published app package is a scope reference, not a promise that every possible feature fits the entry price.']),
      section('app-handover', 'Plan the operating handover', ['Agree how source code, build instructions, API configuration and account access will be transferred. The delivery checklist should name the person who can create a release after handover.', 'Usage-based services such as messaging, maps, hosting and AI APIs should be listed with their account owner and billing basis.']),
    ], faqs: [
      { q: 'Is a backend included in every Flutter app?', a: 'The required backend and administrator functions depend on the selected package and agreed scope. Identify integrations, data storage, authentication and operator tasks before the quote is finalized.' },
      { q: 'Does an app package guarantee App Store approval?', a: 'No. Store policies, account checks and review decisions are controlled by the platform. Release preparation and submission responsibilities must be agreed separately.' },
    ], sources: [source('/app-development/', 'App development scope'), source('/flutter/', 'Flutter development approach'), source('/#pricing', 'Published app package prices')],
  },
  {
    path: '/en/web-development/', label: 'Web development', kind: 'service', korean: '/web-development/',
    title: 'Website & Web App Development in Korea | REUMLAB',
    description: 'Websites and web applications by a South Korea-based studio. Compare a lead-generation website with a custom web app, public KRW packages and ownership terms.',
    h1: 'A website your customers can use and your team can run.',
    answer: `REUMLAB develops websites, landing pages and web applications. Published web packages start at ${krw(webFrom)}, including VAT. The right scope depends on the content, inquiry journey, administration and external integrations your business needs.`,
    sections: [
      section('website-or-app', 'Choose a website or a web application', ['A service website primarily helps a visitor understand your offer and make an inquiry. A web application also manages tasks such as accounts, reservations, payments, inventory or reporting.', 'Describe the customer action and operator task together. An online booking screen, for example, may also require availability rules, confirmation messages and a cancellation workflow.']),
      section('web-deliverables', 'Agree what a working website includes', ['A practical specification lists page purpose, required content, mobile behavior and the inquiry destination. For search visibility, useful text must be present in the delivered HTML, and page titles, canonical URLs and internal links must be consistent.'], ['Mobile-readable layouts and keyboard-accessible controls', 'Forms with required-field validation and a clear completion page', 'Page-specific titles, descriptions and canonical URLs', 'Domain, hosting and content-management responsibilities']),
      section('web-operations', 'Keep content and ownership manageable', ['Define which content you can edit, what requires developer support and which account holds the domain and deployment. Source delivery and operating documentation should be explicit contract items.', 'Hosting, paid plugins and other subscriptions are external operating costs. A bilingual website also needs its own English content and language mappings; changing the browser language alone does not translate a site.']),
    ], faqs: [
      { q: 'Can a website include an administrator dashboard?', a: 'Yes, when it is included in the agreed scope. The Web Premium package is a published starting point for a web app with administration and integrations; custom requirements need a separate scope review.' },
      { q: 'Can you improve an existing website?', a: 'Existing-service renewal and search-structure improvement are published services. Share the current URL, platform and the access you hold so the first review can establish what can be changed.' },
    ], sources: [source('/web-development/', 'Web development scope'), source('/service-renewal/', 'Existing-service renewal'), source('/#pricing', 'Published web package prices')],
  },
  {
    path: '/en/ai-development/', label: 'AI development', kind: 'service', korean: '/ai-development/',
    title: 'AI Chatbot & Workflow Development in Korea | REUMLAB',
    description: 'Scope a document-search chatbot or AI workflow with REUMLAB in South Korea. Define source data, permissions, evaluation, human approvals and API costs.',
    h1: 'Build AI around a real task and evidence you can check.',
    answer: 'REUMLAB develops AI chatbots, document-search systems and workflow automation. Start by separating an answer grounded in your documents from an action that changes a system. Each needs clear source access, evaluation and failure-handling rules.',
    sections: [
      section('choose-ai-scope', 'Choose the task before the model', ['Document search, drafting and workflow execution are different requirements. A knowledge assistant must retrieve an appropriate source; an automation must also know when it is permitted to act.', 'Collect representative questions and tasks from the intended users. Identify the approved source documents, systems to connect and information that must stay outside the service.']),
      section('evaluate-ai', 'Test retrieval, answers and permissions separately', ['For document-based answers, check whether the expected source was retrieved before judging the generated response. Open each citation and confirm that the quoted passage supports the answer.', 'Test a question with no source, an outdated document and an account without access. Agree when the service should withhold an answer, request clarification or route the question to a person.'], ['Expected source and answer for each test question', 'Role-specific permission and denial tests', 'Human approval before consequential external actions', 'Error logs and operating ownership']),
      section('ai-costs', 'Make operating costs visible', ['AI API usage, storage, document processing and hosting may be recurring costs. Record their account owner, usage basis and any agreed limits separately from the development fee.', 'A prototype demonstrates behavior on a defined test set. It does not establish that every future question will be answered correctly. Expand the scope only after evaluating the agreed tasks.']),
    ], faqs: [
      { q: 'Do I need RAG for a company chatbot?', a: 'RAG is useful when answers need to use your approved documents. It is not automatically required for every chatbot. First identify the questions, their source of truth and the permissions governing those sources.' },
      { q: 'Can AI automatically send messages or update records?', a: 'Such integrations can be scoped, but draft generation and actual execution should be separated. Define approval, rejection, retry and failure behavior before allowing consequential actions.' },
    ], sources: [source('/ai-development/', 'AI development services'), source('/guide/rag-development/', 'Published RAG implementation guide'), {href:'https://cloud.google.com/use-cases/retrieval-augmented-generation',label:'Google Cloud: retrieval-augmented generation',language:'en'}],
  },
  {
    path: '/en/business-systems/', label: 'ERP & business systems', kind: 'service', korean: '/erp/',
    title: 'Custom ERP & Business Systems in Korea | REUMLAB',
    description: 'Custom ERP, admin dashboards and business workflow software. Map records, permissions, approvals, migration and operating handover with a Korean development studio.',
    h1: 'Connect the records and decisions your team works with.',
    answer: 'REUMLAB builds administrator dashboards, ERP-style business systems and workflow software. A useful scope connects the data people enter, the decisions they approve and the records they need to retrieve later.',
    sections: [
      section('workflow-map', 'Map a workflow before listing features', ['Start with one recurring task: who starts it, which records are required, who approves it and what marks it as complete. Then identify exceptions and the reports the business actually uses.', 'A task called “customer management” may need contact history, role restrictions, duplicate handling and export permissions. Writing these rules down makes estimates and acceptance criteria more reliable.']),
      section('business-controls', 'Treat permissions and audit records as requirements', ['Confirm what each role can view, create, change, approve and export. UI restrictions alone are not enough; the same authorization rules must apply to the underlying requests.', 'For migration, agree a sample input, field mapping, duplicate policy and reconciliation report before importing production data. Keep access credentials and customer records out of the first inquiry.']),
      section('business-acceptance', 'Check the result with operating scenarios', ['Use a representative scenario that moves from entry to approval and reporting. Include a rejected request, a correction and a user who must be denied access.'], ['Required records and validation rules', 'Role and approval matrix', 'Migration and reconciliation method', 'Backup, recovery and post-handover responsibilities']),
    ], faqs: [
      { q: 'Can a custom system connect to existing tools?', a: 'An integration depends on the existing tool’s API, authentication, data model and usage terms. Share the names and intended workflows first; access can be arranged safely after the scope is agreed.' },
      { q: 'Is every ERP project a fixed-price package?', a: 'No. Custom business systems are scoped around workflows, roles, migration and integrations. Published packages are reference points; requirements beyond those packages receive a separate quote.' },
    ], sources: [source('/erp/', 'Business-system service scope'), source('/admin-page-development/', 'Administrator development'), source('/source-handover/', 'Operating handover')],
  },
  {
    path: '/en/mvp-development/', label: 'MVP development', kind: 'service', korean: '/mvp/',
    title: 'MVP App & SaaS Development in Korea | REUMLAB',
    description: 'Plan a focused MVP with REUMLAB in South Korea. Define the first user journey, acceptance tests, public app prices and a practical source-code handover.',
    h1: 'Launch the smallest version that can answer a real product question.',
    answer: `REUMLAB develops app, web-service and SaaS MVPs. The published App Lite MVP package is ${krw(appFrom)}, including VAT, for its defined scope. An MVP should test a complete useful journey, with enough administration to operate the trial.`,
    sections: [
      section('mvp-question', 'Write down what the first release must prove', ['Identify the intended user and the action they must complete. A feature belongs in the first release when it is necessary for that journey or for operating it safely.', 'Separate a presentation prototype from a working MVP. A prototype can communicate an idea; a working release also needs data handling, access control, error states and a way to operate the service.']),
      section('mvp-boundaries', 'Control scope with explicit exclusions', ['List which roles, platforms and integrations are included, and which are deferred. Payment, notifications, analytics, migrations and multilingual content should not be hidden assumptions.', 'Agree how change requests are evaluated after scope confirmation. Use the package’s published schedule as a planning reference, then confirm timing against the actual feature list and dependencies.']),
      section('mvp-acceptance', 'Review a journey, not just a set of screens', ['A useful acceptance test starts from a new user, completes the intended task and checks the operator’s resulting record. Include a cancellation, invalid input and failure response.', 'Define what will be handed over at release: repository, deployment instructions, account access and known limitations. This makes a later iteration or a different development partner easier to plan.']),
    ], faqs: [
      { q: 'Does the package schedule guarantee my complete idea will launch by then?', a: `No. The published App Lite MVP duration is ${englishPackages.find(p=>p.name==='앱 라이트 MVP')!.englishDuration.toLowerCase()} for the package scope. Final timing depends on requirements, content readiness, feedback, integrations and any external review.` },
      { q: 'Can an MVP later become a larger product?', a: 'A later phase can be planned, but its scope and cost should be reviewed separately. Document known limitations and prioritize the next change using what the trial actually shows.' },
    ], sources: [source('/mvp/', 'Published MVP scope'), source('/guide/mvp-priority/', 'MVP feature prioritization'), source('/#pricing', 'Package prices and durations')],
  },
  {
    path: '/en/seo-geo/', label: 'SEO & AI search', kind: 'service', korean: '/ai-search-optimization/',
    title: 'SEO & GEO Website Improvement in Korea | REUMLAB',
    description: 'Improve an existing website for search and AI answer discovery. Audit crawl access, indexability, useful answers, citations, structured data and inquiry paths.',
    h1: 'Make your website easier to find, understand and cite.',
    answer: 'REUMLAB offers search-structure improvements for existing websites. SEO and GEO work starts with crawl access, indexable URLs, clear page intent and useful answers backed by visible sources. Search inclusion and AI citations are measured outcomes, not guaranteed placements.',
    sections: [
      section('search-foundations', 'Resolve access and URL conflicts first', ['Inspect robots rules, HTTP responses, canonical URLs, sitemap inclusion and internal links. A page cannot reliably earn discovery when its signals point to different preferred URLs.', 'Preserve the intent of existing useful pages and their inquiry functions. A migration or redesign should also have a URL inventory and a verified redirect plan.']),
      section('citable-answers', 'Give each answer a checkable basis', ['Place a direct answer beside the supporting explanation, conditions and source links. Use stable section addresses so a reader can open the exact passage being cited.', 'Structured data should describe content that is actually visible. Do not add invented reviews, author credentials or customer results. An AI text index can summarize public facts, but it does not replace readable pages or technical SEO.']),
      section('measure-search', 'Keep implementation and results separate', ['A successful submission means a search engine received a request. An index check means that engine reported a URL state. An AI citation is a separate observation tied to a provider, query and date.', 'For an English site, publish useful English content on distinct URLs and connect actual language alternatives in both directions. Do not claim foreign offices or automatic worldwide service availability.']),
    ], faqs: [
      { q: 'Does GEO guarantee that ChatGPT or Google will recommend my company?', a: 'No. Crawl eligibility, helpful content and accurate structured data can be improved, but providers determine indexing, answer selection and citations. Record real observations rather than treating deployment as a ranking result.' },
      { q: 'Do AI search engines require a special schema or llms.txt file?', a: 'Google’s AI search guidance does not require special AI markup or a special text file. We prioritize crawlable, useful pages and structured data that matches visible content; supplementary text exports remain factual navigation aids.' },
    ], sources: [source('/ai-search-optimization/', 'Search-structure service and package scope'), {href:'https://developers.google.com/search/docs/appearance/ai-features',label:'Google Search Central: AI features and your website',language:'en'}, {href:'https://developers.google.com/search/docs/specialty/international/localized-versions',label:'Google Search Central: localized versions',language:'en'}],
  },
  {
    path: '/en/source-code-handover/', label: 'Source & account handover', kind: 'service', korean: '/source-handover/',
    title: 'Source Code & Account Handover | REUMLAB Korea',
    description: 'Review REUMLAB’s source-code and account-handover approach. Agree repository access, deployment instructions, domain ownership and third-party subscriptions.',
    h1: 'Know what you will own and how you will operate it.',
    answer: 'REUMLAB publishes source-code and operating-access handover as part of its delivery approach. The contract should identify the code, accounts, documentation and responsibilities included in your project, with third-party licenses and subscriptions handled separately.',
    sections: [
      section('handover-list', 'Create a delivery inventory', ['Name the repositories, applications, database configuration and deployment environments being delivered. Confirm where the source is stored and who has access before the project closes.'], ['Source repository and the agreed delivered version', 'Build, run and deployment instructions', 'Domain, hosting and database account ownership', 'Configuration variable names and secure access-transfer method', 'Operator documentation and remaining limitations']),
      section('verify-handover', 'Verify access with the receiving team', ['A folder of source files is not the same as an operable service. Have the receiving team check access, follow the run instructions and confirm which accounts generate recurring charges.', 'Transfer secrets through an agreed secure process. Do not paste passwords, API keys, verification codes or customer data into the initial inquiry form.']),
      section('support-boundary', 'Separate ownership from ongoing support', ['Document which defects are covered, which changes require a new quote and who operates backups, monitoring and upgrades after handover.', 'Third-party software and hosted services remain subject to their own licenses and account terms. Identify these dependencies so source delivery is not mistaken for ownership of every external service.']),
    ], faqs: [
      { q: 'Will I receive the source code?', a: 'Source-code handover is a published REUMLAB delivery condition. The contract and delivery inventory establish the exact project artifacts and the agreed handover procedure.' },
      { q: 'Does handover include free lifetime maintenance?', a: 'No such promise is made. Confirm warranty, maintenance, operating tasks and additional-development terms separately in the contract.' },
    ], sources: [source('/source-handover/', 'Published source and account handover policy'), source('/terms/', 'Published service terms')],
  },
  {
    path: '/en/pricing/', label: 'Pricing', kind: 'information', widget: 'pricing',
    title: 'App & Website Development Prices in KRW | REUMLAB',
    description: 'Compare eight published REUMLAB website and app packages in Korean won. VAT-inclusive prices, approximate durations, scope limits and external operating costs.',
    h1: 'Published prices. A scope you can agree on.',
    answer: `Published web packages start at ${krw(webFrom)} and app packages at ${krw(appFrom)}, including VAT. The table below uses the same price source as the Korean website. Final scope, external services and international payment arrangements must be confirmed in the quote.`,
    sections: [
      section('price-conditions', 'Read the package together with its scope', ['Each package is a reference for a defined type of deliverable, not an unlimited feature allowance. Confirm the page list, user roles, workflows, integrations and acceptance tests before treating a package as the project quote.', 'Approximate durations refer to the published package conditions. Content readiness, client feedback, integration access and external platform reviews can affect the actual schedule.']),
      section('external-costs', 'Separate development from operating costs', ['Hosting, domains, paid services, payment processing and usage-based APIs may be separate expenses. Record which account owns each service and how it is billed.', 'Prices are stated in KRW without a live currency conversion. Confirm invoicing, tax treatment, payment method and any transfer charges for your contracting circumstances before committing.']),
      section('quote-inputs', 'Make a quote easier to compare', ['Provide the essential user journey and identify the features you can defer. Share your reference products, required platforms and known integrations, then ask for inclusions and exclusions in writing.'], ['Required user and operator actions', 'Supported devices and content languages', 'Data migration and integration requirements', 'Delivery, account ownership and support boundaries']),
    ], faqs: [
      { q: 'Are these prices in US dollars?', a: 'No. Every price on this page is in South Korean won (KRW). The published prices include VAT and are not converted into another currency.' },
      { q: 'Are custom ERP or AI projects always covered by these packages?', a: 'No. Business workflows, document processing, integrations and custom AI evaluation can require a separate quote. Use a package only when its agreed scope matches your project.' },
    ], sources: [source('/#pricing', 'Original published Korean package table'), source('/source-handover/', 'Handover conditions')],
  },
  {
    path: '/en/process/', label: 'Project process', kind: 'information',
    title: 'Development Process & Remote Collaboration | REUMLAB',
    description: 'Understand the REUMLAB development process: inquiry, scope, design, build, acceptance, deployment and handover. Prepare a written brief and confirm collaboration terms.',
    h1: 'Know the decisions and deliverables at each stage.',
    answer: 'The published REUMLAB process moves from an initial inquiry to scope confirmation, design, development, testing, deployment and handover. Define what you will review at each stage and confirm the working language, meeting schedule and approval responsibilities for your project.',
    sections: [
      section('discovery-and-scope', 'Inquiry and scope confirmation', ['Describe the intended users, business problem, essential features and target schedule. Add reference products and an indicative budget if known. The first review establishes feasibility and a proposed scope.', 'Before development, confirm the included functions, exclusions, screens, integrations, schedule, payment milestones and acceptance method. Use the written scope to evaluate later change requests.']),
      section('design-and-build', 'Design and implementation', ['Review the screen flow and key interactions before relying on implementation details. Use staged previews to check the required journey, operator functions and error conditions.', 'For distributed collaboration, agree how decisions are recorded, who can approve a change and which meeting times are workable. Submitting an English inquiry does not by itself settle all live-meeting arrangements.']),
      section('accept-and-release', 'Acceptance, deployment and handover', ['Run the agreed scenarios on the target environment and retain the results. Confirm account ownership, external dependencies and platform-review responsibilities before launch.', 'At handover, check repository access, build instructions, deployment documentation and the operating accounts. Define any maintenance scope separately so the receiving team knows what it must manage.']),
    ], faqs: [
      { q: 'Do I need to prepare a technical specification?', a: 'A short brief is enough for an initial inquiry. Describe the users and required tasks in ordinary language; scope definition can then identify the needed screens, data and integrations.' },
      { q: 'Can we work across time zones?', a: 'Share your country, time zone and preferred collaboration method in the inquiry. Meeting times, language and response arrangements must be confirmed before the project is agreed.' },
    ], sources: [source('/#process', 'Published project process'), source('/source-handover/', 'Handover approach'), source('/terms/', 'Service terms')],
  },
  {
    path: '/en/portfolio/', label: 'Selected work', kind: 'information', korean: '/portfolio/', widget: 'portfolio',
    title: 'Selected App, ERP & AI Development Work | REUMLAB',
    description: 'English summaries of publicly described REUMLAB projects. Review the problem, implementation scope and original Korean case records without invented client results.',
    h1: 'Judge the work by the problem and the implementation.',
    answer: 'REUMLAB publishes anonymized development examples covering apps, business systems, web services and AI workflows. The summaries below translate the published problem and implementation scope. They do not identify undisclosed clients or claim unreported commercial results.',
    sections: [
      section('case-disclosure', 'What these examples show', ['The source portfolio explains that client names, live URLs and some screens are withheld. Published interface images use reconstructed example data; they should not be treated as permission to disclose a client’s production system.', 'Use the linked original records to distinguish implementation facts from suggested design considerations for a similar project. An example does not mean that the same scope, price or timeline applies to your service.']),
      section('compare-your-project', 'Compare the workflow with your own', ['Look for the same type of task or operating constraint: fragmented records, requests handled manually, permissions, matching or information retrieval.', 'In an inquiry, describe how your users and operator roles differ. Requirements such as migration, extra languages, external approval or payment settlement can change the solution even when the screens look similar.']),
    ], faqs: [
      { q: 'Can you share client names or private production screenshots?', a: 'The public portfolio withholds those details. This English overview uses the published material only and does not add undisclosed client identities or performance figures.' },
      { q: 'Does a similar example establish a fixed quote?', a: 'No. A quote must reflect your workflows, integrations, supported platforms, acceptance criteria and handover requirements.' },
    ], sources: [source('/portfolio/', 'Original anonymized portfolio and disclosure policy')],
  },
  {
    path: '/en/contact/', label: 'Discuss a project', kind: 'information', widget: 'contact',
    title: 'Contact REUMLAB | Software Project Inquiry in Korea',
    description: 'Send an English project brief to REUMLAB in South Korea. Describe your app, website, business system or AI workflow, budget, time zone and target launch.',
    h1: 'Tell us what you want to build.',
    answer: 'Use this English form to send a project inquiry, or email ceo@eternalsix.com. Start with the users, their main task and what must work at launch. Share your country or time zone when it affects collaboration, and confirm working-language and payment arrangements before a contract.',
    sections: [
      section('useful-brief', 'A useful brief is short and specific', ['Describe the business problem, the people who will use the service and the first journey they should complete. Add reference links, required platforms, integrations and a target date when available.', 'For an existing service, include its public URL and the kind of change you need. You can say which accounts you control without sending the credentials themselves.']),
      section('inquiry-data', 'Keep the first inquiry limited to project information', ['The form collects your name, email address and project brief so we can review and reply to the inquiry. Company, budget and target schedule are optional. See the linked privacy overview and the original published policy for handling, retention and rights.', 'Do not include passwords, verification codes, API keys, health information or customer records. Any access needed for a contracted project should be arranged through an appropriate invitation process.']),
    ], faqs: [
      { q: 'Can I inquire before choosing a package?', a: 'Yes. Explain the problem and the essential first release. A package is a scope reference, and a review can identify whether a custom quote is needed.' },
      { q: 'Where will the inquiry go?', a: 'The form uses this website’s existing Netlify form-processing infrastructure. You can alternatively send a written brief to the published business email, ceo@eternalsix.com.' },
    ], sources: [source('/#contact', 'Original project inquiry route'), source('/privacy/', 'Published privacy policy')],
  },
  {
    path: '/en/guides/hiring-a-developer-in-korea/', label: 'Hiring a developer in Korea', kind: 'guide',
    title: 'How to Hire a Software Development Studio in Korea | REUMLAB',
    description: 'A practical checklist for choosing a software studio in South Korea: scope, evidence, language, payments, permissions, acceptance tests and source ownership.',
    h1: 'How to evaluate a software development partner in Korea.',
    answer: 'Compare development partners using the same written scope and acceptance scenarios. Check the operating business identity, public work, account ownership, collaboration arrangements and handover terms. A similar-looking demo or a starting price alone is not enough to compare a project quote.',
    sections: [
      section('compare-scope', 'Ask every candidate to quote the same journey', ['Write down the intended users, essential tasks, operator role, supported platforms and external integrations. Ask each candidate to distinguish included work, exclusions, recurring costs and dependencies.', 'A brochure website and a transactional web app require different operating functions. A prototype and a production MVP also have different acceptance criteria. Resolve those differences before comparing totals.']),
      section('check-evidence', 'Separate public evidence from sales claims', ['Review examples for the actual problem, implementation scope and delivered artifacts. Ask what is public, anonymized or reconstructed. Do not assume that an example interface establishes a client name or a revenue outcome.', 'Check the business contact and ownership policy. The repository, domain, deployment and database may belong to different accounts; establish which ones you will receive and which third-party licenses remain in force.']),
      section('cross-border-checklist', 'Resolve cross-border details in writing', ['Confirm working language, meeting times, approval contacts, invoicing, currency and payment method. Discuss applicable contract terms and data-handling requirements with the relevant advisers where needed; a development quote does not settle every cross-border legal or tax issue.'], ['Who can approve scope changes and acceptance?', 'Which accounts must the client open or own?', 'How are external API and hosting charges handled?', 'Which delivery instructions and support terms are included?']),
      section('acceptance-example', 'Use a concrete acceptance scenario', ['For a reservation product, start with availability selection and payment, then check the operator record, cancellation and a failed-payment case. For a document assistant, check retrieval, a source citation, a missing answer and a denied-access case.', 'These are planning examples, not reports of a particular customer project. Write the expected outcome and the evidence to retain before implementation starts.']),
    ], faqs: [
      { q: 'Should I choose the lowest starting price?', a: 'Compare the same feature scope, external costs, ownership and acceptance responsibilities first. A lower starting price may cover a different deliverable and does not establish the total cost of your project.' },
      { q: 'What should be agreed before working internationally?', a: 'Confirm the working language, meeting times, scope approval, invoicing, currency, payment method, account ownership and data-access rules before signing.' },
    ], sources: [source('/guide/outsourcing-checklist/', 'Published outsourcing checklist'), source('/source-handover/', 'Published source ownership conditions')],
  },
  {
    path: '/en/guides/mvp-development-cost-in-korea/', label: 'MVP cost planning', kind: 'guide',
    title: 'MVP Development Cost in Korea: Scope Checklist | REUMLAB',
    description: 'Plan an MVP budget using REUMLAB’s published KRW package prices and a scope checklist. Understand platform, backend, integration and operating cost differences.',
    h1: 'What determines the cost of an MVP in Korea?',
    answer: `An MVP budget depends on the complete user journey, platforms, backend, operator functions and integrations. REUMLAB’s published App Lite MVP package starts at ${krw(appFrom)}, including VAT, for its defined scope. This is a studio package price, not a Korean market average.`,
    sections: [
      section('mvp-cost-drivers', 'Count workflows and responsibilities', ['A login screen can involve account recovery, roles and data retention. A payment button can involve cancellation, reconciliation and operator visibility. An estimate should describe those responsibilities instead of counting screens alone.', 'For AI features, define source preparation, retrieval, evaluation and human review. Recurring API usage belongs in the operating budget, with an identified account owner and usage basis.']),
      section('budget-scenarios', 'Compare approaches by the question you need to answer', ['A landing page can test whether people understand an offer and make an inquiry. A clickable prototype can test a flow. A working app MVP can test a complete transaction or repeated task. Choose the deliverable that answers the product question you actually have.', 'Use the English pricing table to see the published website and app options. Ask for a custom scope when migration, extensive roles, uncommon integrations or several languages are required.']),
      section('budget-checklist', 'Keep a separate operating-cost list', ['Plan hosting, domains, email or messaging, payment processing, storage and AI API usage where relevant. A development fee should not be confused with an unlimited allowance for those services.'], ['Development scope and exclusions', 'Content and design inputs', 'Third-party subscriptions and transaction fees', 'Review and release dependencies', 'Handover and maintenance responsibilities']),
      section('schedule-assumptions', 'Tie the schedule to the agreed scope', ['Published durations are approximate references for the packages. Confirm content readiness, feedback windows, account access and external review before committing to a launch date.', 'Record what changes the quote or schedule, and ask how those changes will be approved. This gives both sides a common basis for decisions during development.']),
    ], faqs: [
      { q: `Is ${krw(appFrom)} the average MVP cost in South Korea?`, a: 'No. It is REUMLAB’s published App Lite MVP package price for its stated scope, including VAT. It is not a market-wide statistic or a quote for every product idea.' },
      { q: 'Can I convert the package price to another currency?', a: 'You can estimate a conversion for your own planning, but this site quotes in KRW. Confirm the invoicing currency, exchange handling, payment method and transfer charges directly before contracting.' },
    ], sources: [source('/#pricing', 'Published package prices'), source('/guide/mvp-cost/', 'MVP scope and cost factors'), source('/guide/mvp-priority/', 'MVP prioritization')],
  },
  {
    path: '/en/privacy/', label: 'Privacy overview', kind: 'information',
    title: 'Project Inquiry Privacy Overview | REUMLAB',
    description: 'English overview of REUMLAB’s published privacy policy for project inquiries, contact details, retention, service providers, rights and cookies.',
    h1: 'Privacy information for your project inquiry.',
    answer: 'This English overview explains the existing published REUMLAB privacy policy for project inquiries. The original Korean policy has an effective date of April 11, 2026. This overview does not introduce a different retention promise or change the published policy.',
    sections: [
      section('data-and-purpose', 'Information and purpose', ['For inquiries through forms, email or messaging, the published policy covers a name or nickname, contact information, inquiry content and an optional company name. Project requirements, current URLs, budget and schedule may be provided to help review scope.', 'The English form requires a name, email and project brief; other project fields are optional. The purpose is to review and reply to the inquiry and discuss scope or a quote. Do not submit credentials, verification codes, API keys, health data or customer lists.']),
      section('retention', 'Retention', ['The policy states that information is destroyed without delay when its processing purpose has been achieved, except where a retention requirement or separately notified arrangement applies.', 'Its published retention table lists contract and payment records for five years, consumer complaints and dispute records for three years, and advertising records for six months; tax and accounting evidence follows the applicable required period. These are policy statements, not a newly assigned retention period for every inquiry.']),
      section('providers-and-rights', 'Service providers and your requests', ['The policy describes IT providers used for hosting, email and customer-response operations, and payment providers where relevant. The website’s English form uses Netlify form processing, as the existing Korean inquiry infrastructure does.', 'You can contact ceo@eternalsix.com to request access, correction, deletion or restriction of processing. The policy notes that legally required records may not be removable immediately.']),
      section('cookies-and-contact', 'Cookies, security and the full policy', ['The policy describes access restrictions, encrypted transmission and protective handling measures. It also covers automatically collected access information and cookies for convenience and analytics; browser settings can restrict cookies.', 'The full Korean policy contains the handling details, complaint contact and update procedure. Use the linked original policy for the complete published text and contact the business email with questions about your inquiry.']),
    ], faqs: [], sources: [source('/privacy/', 'Full original Korean privacy policy')],
  },
  {
    path: '/en/inquiry-received/', label: 'Inquiry received', kind: 'information', widget: 'received', noindex: true,
    title: 'Inquiry Submitted | REUMLAB', description: 'Your project inquiry has been submitted through the REUMLAB website. Keep a copy of your project brief and use the published email for any follow-up.',
    h1: 'Thank you for your project inquiry.', answer: 'Your form has been submitted. Keep a copy of your brief and use ceo@eternalsix.com if you need to add information or follow up. A submission is not a project acceptance, quote or commitment to a delivery date.',
    sections: [section('next-steps', 'What to prepare next', ['You can review the published packages, source-code handover approach and project process while the inquiry is reviewed. Confirm the scope, working language, payment arrangements and schedule before a contract.'])],
    faqs: [], sources: [],
  },
];

export const ENGLISH_INDEXABLE = ENGLISH_PAGES.filter(p => !p.noindex);
export const LANGUAGE_PAIRS = ENGLISH_PAGES.filter((p): p is EnglishPage & {korean:string} => !!p.korean);
export const ENGLISH_SERVICES = ENGLISH_PAGES.filter(p => p.kind === 'service');
export function languageAlternates(page: EnglishPage) {
  return page.korean ? { ko: englishUrl(page.korean), en: englishUrl(page.path) } : {};
}

/** A navigation aid, not a ranking requirement. Only exports content visible on English pages. */
export function englishTextExport() {
  const lines=['# REUMLAB — English service information','',`Website: ${englishUrl('/en/')}`,'Prices are in KRW, including VAT. Confirm scope and international contracting arrangements before a project.',''];
  for(const page of ENGLISH_INDEXABLE){
    lines.push(`## ${page.h1}`,`URL: ${englishUrl(page.path)}`,'',page.answer,'');
    for(const s of page.sections)lines.push(`### ${s.title}`,`Section: ${englishUrl(page.path)}#${s.id}`,...s.paragraphs,...(s.items??[]).map(t=>`- ${t}`),'');
    if(page.widget==='pricing')for(const p of englishPackages)lines.push(`- ${p.englishName}: ${krw(p.price)}; ${p.englishDuration}; ${p.englishScope}`);
    for(const f of page.faqs)lines.push(`Q: ${f.q}`,`A: ${f.a}`,'');
    for(const s of page.sources)lines.push(`Source: ${new URL(s.href,SITE.domain).href} — ${s.label}${s.language==='ko'?' (Korean)':''}`);
    lines.push('');
  }
  return lines.join('\n');
}
