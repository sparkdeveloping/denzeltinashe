export const featuredProjects = [
  {
    slug: 'mealrecap',
    name: 'MealRecap',
    label: 'Native iOS · AI nutrition',
    statement: 'Make food logging feel like telling a friend what you ate.',
    summary:
      'A SwiftUI food journal that turns natural language, voice, and meal photos into a structured daily nutrition recap without putting API secrets in the client.',
    ownership: ['Product direction', 'iOS UX', 'SwiftUI engineering', 'Backend architecture', 'Launch systems'],
    proof: [
      'SwiftUI + HealthKit + Speech',
      'OpenAI through Firebase Functions',
      'USDA + Open Food Facts nutrition',
      'StoreKit 2 subscriptions',
    ],
    github: 'https://github.com/sparkdeveloping/mealrecap',
    tone: 'meal',
    index: '01',
  },
  {
    slug: 'spotly',
    name: 'Spotly',
    label: 'Multi-surface product platform',
    statement: 'One operating network. Five distinct products. One coherent system.',
    summary:
      'A Next.js/Firebase platform spanning customer, business, driver, staff, and admin experiences with shared authentication, marketplace operations, delivery, payments, and protected workflows.',
    ownership: ['Product architecture', 'Full-stack engineering', 'Auth design', 'Operations UX', 'Production hardening'],
    proof: [
      '5 production product origins',
      'Cross-subdomain secure session bridge',
      'Marketplace + delivery + kiosk workflows',
      'Firebase + Paynow + Resend + Vercel',
    ],
    github: 'https://github.com/sparkdeveloping/spotlyweb',
    live: 'https://spotlyafrica.com',
    tone: 'spotly',
    index: '02',
  },
  {
    slug: 'gocreate-insights',
    name: 'GoCreate Insights',
    label: 'Operational intelligence',
    statement: 'Turn messy, unlike operational records into decisions you can actually trust.',
    summary:
      'A source-aware analytics system that reconciles membership exports, application data, tracker activity, and historical paper sign-ins without pretending each source has the same precision.',
    ownership: ['Data model', 'Reconciliation logic', 'Analytics UX', 'Privacy controls', 'Reporting'],
    proof: [
      '2,383 master member records',
      '2,125 application rows',
      '513 detected paper sign-in rows',
      'PII-safe browser analytics payloads',
    ],
    github: 'https://github.com/sparkdeveloping/gocreateinsights',
    tone: 'insights',
    index: '03',
  },
  {
    slug: 'beforeuscroll',
    name: 'BeforeUScroll',
    label: 'Native iOS · Screen Time',
    statement: 'Design friction on purpose—before distraction gets the first move.',
    summary:
      'An iOS attention product built with Apple Screen Time frameworks, app/web-domain shielding, Device Activity monitoring, custom shield actions, and intentional timed unlock/relock behavior.',
    ownership: ['Product concept', 'Interaction design', 'SwiftUI engineering', 'System extensions', 'StoreKit'],
    proof: [
      'FamilyControls + ManagedSettings',
      'DeviceActivity monitor extension',
      'Custom shield action + configuration',
      'Timed intentional unlock + relock',
    ],
    github: 'https://github.com/sparkdeveloping/beforeuscroll',
    tone: 'scroll',
    index: '04',
  },
];

export const websiteProjects = [
  {
    name: 'FPC Wichita',
    mark: 'FPC',
    type: 'Visitor conversion · live media · multi-route church platform',
    href: 'https://fpcwichita.vercel.app',
    repo: 'https://github.com/sparkdeveloping/fpcwichita',
    status: 'DEPLOYED',
  },
  {
    name: 'St. Mark Cathedral COGIC',
    mark: 'SMC',
    type: 'Production church platform · forms · live services · app-ready APIs',
    href: 'https://smccogic.vercel.app',
    repo: 'https://github.com/sparkdeveloping/smccogic',
    status: 'DEPLOYED',
  },
  {
    name: 'POM Church',
    mark: 'POM',
    type: 'Production Next.js site · contact delivery · SEO infrastructure',
    href: 'https://pomchurch.vercel.app',
    repo: 'https://github.com/sparkdeveloping/pomchurch',
    status: 'DEPLOYED',
  },
  {
    name: 'Oil City Church',
    mark: 'OIL',
    type: 'Motion-forward multi-page experience · visit · sermons · prayer',
    href: 'https://oilcitychurch.vercel.app',
    repo: 'https://github.com/sparkdeveloping/oilcitychurch',
    status: 'DEPLOYED',
  },
  {
    name: 'Calvary Apostolic Church',
    mark: 'CAC',
    type: 'Original church-site concept · responsive motion · reduced-motion support',
    href: 'https://calvaryapostolicchurch.vercel.app',
    repo: 'https://github.com/sparkdeveloping/calvaryapostolicchurch',
    status: 'DEPLOYED',
  },
  {
    name: 'KDYM',
    mark: 'OUTPOUR',
    type: 'Events · registration · media platform',
    href: 'https://www.kdym.org',
    repo: 'https://github.com/sparkdeveloping/kdym',
    status: 'DEPLOYED',
  },
  {
    name: 'HACIA',
    mark: 'HACIA',
    type: 'Education website redesign',
    href: 'https://hacia.co.zw',
    image: '/work/hacia-1.webp',
    status: 'LIVE',
  },
  {
    name: 'Aftershock',
    mark: 'AFTER',
    type: 'Campus ministry website · brand + conversion',
    href: 'https://www.aftershockministries.com',
    repo: 'https://github.com/sparkdeveloping/aftershock',
    image: '/work/aftershock-1.webp',
    status: 'LIVE',
  },
];

export const capabilities = [
  {
    title: 'Product definition',
    body: 'Clarify the audience, core problem, product shape, and smallest version worth shipping before implementation gets expensive.',
    deliverables: 'Flows · feature priorities · prototype direction · technical plan',
  },
  {
    title: 'Native iOS apps',
    body: 'Design and engineer SwiftUI products that feel native because system behavior, interaction, data, and launch constraints are considered together.',
    deliverables: 'SwiftUI · Apple frameworks · APIs · subscriptions · release polish',
  },
  {
    title: 'Web apps & platforms',
    body: 'Build operational products, dashboards, marketplaces, portals, and authenticated systems where interface quality and backend decisions stay connected.',
    deliverables: 'Next.js · React · Firebase · auth · payments · integrations',
  },
  {
    title: 'High-conviction websites',
    body: 'Create marketing sites that explain the offer fast, establish credibility, and give the product or organization an identity people remember.',
    deliverables: 'Strategy · art direction · responsive UI · motion · SEO · performance',
  },
];

export const processSteps = [
  ['01', 'Define', 'We get exact about the person, problem, desired action, constraints, and what “done” has to prove.'],
  ['02', 'Shape', 'I turn that into flows and a visual/technical direction before committing to the full build.'],
  ['03', 'Build', 'Design and engineering move together so the implementation does not become a diluted handoff.'],
  ['04', 'Validate', 'Real states, edge cases, responsive behavior, accessibility, performance, and failure paths get tested.'],
  ['05', 'Launch + iterate', 'Ship a real product, observe what matters, and keep improving from evidence instead of guesswork.'],
];

export function getProject(slug) {
  return featuredProjects.find((project) => project.slug === slug);
}
