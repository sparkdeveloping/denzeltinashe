export const featuredProjects = [
  {
    slug: 'mealrecap',
    index: '01',
    name: 'MealRecap',
    label: 'Native iOS · AI nutrition',
    statement: 'Make food logging feel like telling a friend what you ate.',
    summary: 'A SwiftUI food journal that accepts ordinary language, speech, and meal photos, then resolves them into a structured daily nutrition recap.',
    role: 'Product direction · iOS UX · SwiftUI engineering · backend architecture',
    status: 'Active product build',
    timeline: '2026',
    proof: ['SwiftUI + HealthKit + Speech', 'Server-side OpenAI through Firebase Functions', 'USDA + Open Food Facts nutrition sources', 'StoreKit 2 subscription architecture'],
    outcomes: ['Three input modes converge into one meal model', 'Service credentials stay out of the app binary', 'Nutrition resolution is separated from the calm logging interface'],
    tradeoff: 'The product intentionally avoids making a giant searchable food database the primary interaction. That creates backend resolution complexity, but preserves a much faster front-door experience.',
    github: 'https://github.com/sparkdeveloping/mealrecap',
    live: 'https://mealrecap.vercel.app',
    tone: 'meal',
  },
  {
    slug: 'spotly',
    index: '02',
    name: 'Spotly',
    label: 'Multi-surface commerce platform',
    statement: 'Five product surfaces. One operating network.',
    summary: 'A Next.js/Firebase platform spanning customer, business, driver, staff, and admin products with shared identity, marketplace operations, delivery, payments, kiosk workflows, and protected operations.',
    role: 'Product architecture · full-stack engineering · auth design · operations UX',
    status: 'Production platform',
    timeline: '2026',
    proof: ['5 production product origins', 'Secure cross-subdomain session bridge', 'Marketplace + delivery + kiosk workflows', 'Firebase + Paynow + Resend + Vercel'],
    outcomes: ['Five role-specific products share one platform rather than five duplicated apps', 'Sibling subdomains restore authenticated state through a server-issued session bridge', 'High-impact driver, payout, delivery, and kiosk actions are server mediated'],
    tradeoff: 'Keeping clean product-local URLs while sharing one codebase required hostname-aware routing and a deliberate authentication bridge instead of relying on origin-scoped browser persistence.',
    github: 'https://github.com/sparkdeveloping/spotlyweb',
    live: 'https://spotlyafrica.com',
    tone: 'spotly',
  },
  {
    slug: 'gocreate-insights',
    index: '03',
    name: 'GoCreate Insights',
    label: 'Operational intelligence',
    statement: 'Turn messy operational evidence into decisions you can trust.',
    summary: 'A source-aware analytics system that reconciles membership records, applications, tracker activity, and historical paper sign-ins without pretending every source has the same precision.',
    role: 'Data model · reconciliation logic · analytics UX · privacy controls',
    status: 'Operational analytics',
    timeline: '2026',
    proof: ['2,383 master member records', '2,125 application rows', '513 detected paper sign-in rows', 'PII-safe browser analytics payloads'],
    outcomes: ['Ambiguous records remain visible instead of being silently guessed', 'Leadership reporting preserves the difference between tracker data and reconciled manual evidence', 'Bulk analytics payloads omit sensitive contact, medical, and emergency data'],
    tradeoff: 'A single “perfect” attendance number would look cleaner but would be less truthful. The system keeps source differences and review queues explicit.',
    github: 'https://github.com/sparkdeveloping/gocreateinsights',
    tone: 'insights',
  },
  {
    slug: 'beforeuscroll',
    index: '04',
    name: 'BeforeUScroll',
    label: 'Native iOS · Screen Time',
    statement: 'Design friction on purpose—before distraction gets the first move.',
    summary: 'An iOS attention product built around Apple Screen Time frameworks, app and web-domain shielding, Device Activity monitoring, custom shield actions, and timed unlock/relock behavior.',
    role: 'Product concept · interaction design · SwiftUI engineering · system extensions',
    status: 'Active native iOS product',
    timeline: '2026',
    proof: ['FamilyControls + ManagedSettings', 'DeviceActivity monitor extension', 'Custom shield action + configuration', 'Timed intentional unlock + relock'],
    outcomes: ['Selected apps and domains are protected through Apple’s system frameworks, not a fake overlay', 'Temporary access has a persisted end state and automatic relock path', 'The interruption itself becomes a designed product surface through ShieldConfiguration'],
    tradeoff: 'The experience is distributed across the main app and multiple iOS extensions. That is more complex than an in-app timer, but it is what makes the intervention happen where distraction actually begins.',
    github: 'https://github.com/sparkdeveloping/beforeuscroll',
    live: 'https://beforeuscroll.vercel.app',
    tone: 'scroll',
    screenshots: [
      'https://beforeuscroll.vercel.app/screens/home-flame.webp',
      'https://beforeuscroll.vercel.app/screens/choose-focus.webp',
      'https://beforeuscroll.vercel.app/screens/scripture-question.webp',
    ],
  },
];

export const featuredWebsites = [
  {
    name: 'FPC Wichita',
    type: 'Visitor conversion · live media · multi-route church platform',
    href: 'https://fpcwichita.vercel.app',
    repo: 'https://github.com/sparkdeveloping/fpcwichita',
    image: 'https://raw.githubusercontent.com/sparkdeveloping/fpcwichita/main/public/images/fpc-campus-social.jpg',
    note: 'A conversion-led church experience built around reducing first-visit uncertainty and exposing real service media.',
  },
  {
    name: 'St. Mark Cathedral COGIC',
    type: 'Production site · forms · live services · app-ready APIs',
    href: 'https://smccogic.vercel.app',
    repo: 'https://github.com/sparkdeveloping/smccogic',
    image: 'https://raw.githubusercontent.com/sparkdeveloping/smccogic/main/public/photos/hero.webp',
    note: 'A production-oriented church platform with live YouTube data, structured metadata, secure forms, and public endpoints designed for a future app.',
  },
  {
    name: 'POM Church',
    type: 'Production Next.js website · conversion · SEO infrastructure',
    href: 'https://pomchurch.vercel.app',
    repo: 'https://github.com/sparkdeveloping/pomchurch',
    image: 'https://raw.githubusercontent.com/sparkdeveloping/pomchurch/main/public/images/worship.jpg',
    note: 'A full information architecture and production rebuild with local photography, metadata, contact delivery, and launch infrastructure.',
  },
];

export const websiteArchive = [
  ['Oil City Church', 'Motion-forward multi-page church experience', 'https://oilcitychurch.vercel.app', 'https://github.com/sparkdeveloping/oilcitychurch'],
  ['Calvary Apostolic Church', 'Original responsive church-site concept', 'https://calvaryapostolicchurch.vercel.app', 'https://github.com/sparkdeveloping/calvaryapostolicchurch'],
  ['KDYM', 'Events · registration · media platform', 'https://www.kdym.org', 'https://github.com/sparkdeveloping/kdym'],
  ['HACIA', 'Education website redesign', 'https://hacia.co.zw', null],
  ['Aftershock', 'Campus ministry website · brand + conversion', 'https://www.aftershockministries.com', 'https://github.com/sparkdeveloping/aftershock'],
];

export const capabilities = [
  ['Product definition', 'Clarify the audience, core problem, product shape, constraints, and smallest version worth shipping before implementation gets expensive.', 'Flows · priorities · prototype direction · technical plan'],
  ['Native iOS', 'Design and engineer SwiftUI products where system behavior, interaction, backend constraints, and launch requirements are considered together.', 'SwiftUI · Apple frameworks · APIs · subscriptions'],
  ['Web apps & platforms', 'Build operational products, dashboards, marketplaces, portals, and authenticated systems without divorcing interface quality from backend decisions.', 'Next.js · React · Firebase · auth · payments'],
  ['High-conviction websites', 'Create websites that explain the offer quickly, establish credibility, and give an organization a distinct, responsive digital identity.', 'Strategy · art direction · motion · SEO · performance'],
];

export const processSteps = [
  ['01', 'Define', 'Get exact about the person, problem, desired action, constraints, and what “done” has to prove.'],
  ['02', 'Shape', 'Turn the problem into flows, interaction rules, visual direction, and a technical plan before committing to the full build.'],
  ['03', 'Build', 'Keep design and engineering connected so the implementation does not become a diluted handoff.'],
  ['04', 'Validate', 'Test real states, failure paths, responsiveness, accessibility, performance, and the assumptions most likely to break.'],
  ['05', 'Ship + learn', 'Release a real product, observe the evidence that matters, and improve from what actually happens.'],
];

export const experience = [
  ['2024–2025', 'Wichita State University / GoCreate', 'IT Technician (ITS)', 'Systems support, workflow digitization, operational integrations, and cross-functional delivery in a live high-usage environment.'],
  ['2024–2025', 'Kansas District Youth Ministry', 'Media & Branding', 'Brand systems, motion/video content, campaign execution, and digital platform work.'],
  ['2024–2025', 'FPC Wichita', 'Media Creatives & Branding', 'Visual/media systems and web-facing communication delivered under real event and ministry deadlines.'],
  ['2024–2025', 'Aftershock + HACIA', 'Website Design & Development', 'Responsive web experiences focused on hierarchy, maintainability, performance, and discoverability.'],
  ['2022', 'PosCloud', 'Full-Stack Developer', 'Laravel backend functionality and React frontend implementation using object-oriented patterns.'],
];

export const shippedNames = ['GoCreate / Wichita State', 'FPC Wichita', 'KDYM', 'St. Mark Cathedral', 'POM Church', 'Oil City Church', 'Aftershock', 'HACIA'];

export function getProject(slug) {
  return featuredProjects.find((project) => project.slug === slug);
}
