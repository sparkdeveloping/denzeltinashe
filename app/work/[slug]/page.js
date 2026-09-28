import Link from 'next/link';
import { notFound } from 'next/navigation';
import { featuredProjects, getProject } from '@/data/portfolio';
import styles from './work.module.css';

const details = {
  mealrecap: {
    problem: 'Nutrition logging is usually organized around searching somebody else’s food database. That makes a simple behavior—saying what you ate—feel like clerical work.',
    challenge: 'Natural human input is imprecise. The product has to accept ordinary language, speech, and photos, resolve that into useful nutrition data, keep external-service credentials off the device, and still feel calm.',
    decisions: [
      ['Input before taxonomy', 'The user describes the meal first. Structuring, matching, and macro resolution happen after expression instead of making database search the front door.'],
      ['Keep intelligence behind the server boundary', 'OpenAI and nutrition-service credentials are called through Firebase Functions rather than being embedded in the iOS binary.'],
      ['Use multiple evidence sources', 'USDA FoodData Central and Open Food Facts can contribute nutrition resolution while HealthKit can provide optional health context.'],
      ['Treat monetization as product architecture', 'StoreKit 2 is part of the product model rather than something bolted on after the interface is finished.'],
    ],
    systems: ['SwiftUI', 'HealthKit', 'Speech', 'Firebase', 'Cloud Functions', 'OpenAI', 'USDA FoodData Central', 'Open Food Facts', 'StoreKit 2'],
    evidence: ['Natural language, voice, and photo capture are three paths into one meal model.', 'Secrets stay server-side instead of shipping inside the app.', 'The landing experience is live and the implementation is publicly inspectable on GitHub.'],
  },
  spotly: {
    problem: 'A marketplace stops being one interface as soon as customers, businesses, drivers, staff, and platform operators all need different information and authority.',
    challenge: 'Spotly has five public product origins but one underlying operating network. Identity, permissions, navigation, payments, delivery state, notifications, and kiosk behavior must survive domain boundaries without duplicating the product five times.',
    decisions: [
      ['One platform, product-local URLs', 'Hostname-aware routing maps clean public subdomain URLs into shared internal route trees instead of maintaining five separate applications.'],
      ['Session continuity across sibling domains', 'A verified Firebase ID token becomes a secure parent-domain HttpOnly session. Sibling products bootstrap their local Firebase session with a custom token.'],
      ['Keep high-impact operations behind server APIs', 'Driver approval, sensitive delivery actions, payout-related data, and kiosk credentials are not left to direct browser writes.'],
      ['Design each role as its own product', 'Customer, Business, Driver, Staff, and Admin use one platform, but the information density and action language are role-specific.'],
    ],
    systems: ['Next.js', 'React', 'Firebase Auth', 'Firestore', 'Storage', 'Admin SDK', 'App Check', 'Cloud Messaging', 'Paynow', 'Resend', 'Vercel'],
    evidence: ['Five production product origins are documented in the repository.', 'The cross-subdomain session bridge is part of the production architecture.', 'Marketplace, delivery, kiosk, finance, staff, driver, and admin operations share one platform.'],
  },
  'gocreate-insights': {
    problem: 'Operational reporting becomes dangerous when unlike data sources are flattened into one apparently precise dataset. GoCreate had master records, applications, tracker data, and historical paper sign-ins with different levels of certainty.',
    challenge: 'The system needs to make the information useful without hiding uncertainty, inventing matches, or exposing private data to every browser that needs aggregate reporting.',
    decisions: [
      ['Preserve source truth', 'Tracker totals and reconciled manual attendance stay distinguishable. Combined figures are conservative rather than cosmetically perfect.'],
      ['Turn uncertainty into a product state', 'High-confidence matches can count automatically; possible matches become review work; unreadable rows remain unresolved instead of guessed.'],
      ['Design privacy into the payload', 'Bulk browser analytics omit direct contact details, exact birthdates, medical-alert contents, emergency contacts, and raw assistance questionnaire text.'],
      ['Make numbers inspectable', 'Important aggregates are connected to records or source explanations so a decision-maker can understand why the number exists.'],
    ],
    systems: ['Next.js 16', 'React 19', 'TypeScript', 'Python data pipelines', 'Recharts', 'OCR reconciliation workflow', 'Vercel'],
    evidence: ['2,383 master member records represented in the documented build.', '2,125 application rows and 513 detected paper sign-in rows are reconciled as distinct evidence.', 'Browser analytics payloads are deliberately PII-safe.'],
  },
  beforeuscroll: {
    problem: 'Most attention tools explain distraction after the behavior has already happened. BeforeUScroll is designed to insert intentional friction before selected apps and domains get the first move.',
    challenge: 'That behavior cannot live only inside a SwiftUI screen. It depends on Apple Screen Time authorization, Managed Settings shields, Device Activity monitoring, shared state, extension processes, and predictable unlock/relock behavior.',
    decisions: [
      ['Use Apple’s system controls', 'FamilyControls and ManagedSettings protect selected apps, categories, and web domains at the system level instead of simulating blocking with an in-app overlay.'],
      ['Make temporary access actually temporary', 'An unlock stores an end date and DeviceActivity participates in reconciling the shield when the interval finishes.'],
      ['Treat the interruption as product UI', 'A custom ShieldConfiguration explains why access is blocked and gives a deliberate path to prepare a recharge or stay locked.'],
      ['Share durable state across extensions', 'Selection, unlock state, and shield behavior are coordinated across the main app and system extensions rather than existing only in transient view state.'],
    ],
    systems: ['SwiftUI', 'FamilyControls', 'ManagedSettings', 'ManagedSettingsUI', 'DeviceActivity', 'UserNotifications', 'StoreKit'],
    evidence: ['The live landing page includes real product screenshots from the native app.', 'The repository contains the DeviceActivity monitor, ShieldAction, and ShieldConfiguration extensions.', 'The implementation is inspectable publicly on GitHub.'],
  },
};

export function generateStaticParams() {
  return featuredProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.name} Case Study`,
    description: project.summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: { title: `${project.name} — Denzel Tinashe`, description: project.statement, images: [`/og/${slug}.png`] },
    twitter: { card: 'summary_large_image', title: `${project.name} — Denzel Tinashe`, description: project.statement, images: [`/og/${slug}.png`] },
  };
}

function Arrow({ up = false }) { return <span aria-hidden="true">{up ? '↗' : '→'}</span>; }

function Art({ project }) {
  if (project.tone === 'scroll') {
    return <div className={`${styles.art} ${styles.scrollArt}`}><div className={styles.screenRow}>{project.screenshots.map((src, i) => <div className={styles.phone} key={src} style={{ '--i': i }}><span /><img src={src} alt={`BeforeUScroll interface ${i + 1}`} /></div>)}</div><div className={styles.artCaption}>Real product screens from the live BeforeUScroll project</div></div>;
  }
  if (project.tone === 'spotly') {
    return <div className={`${styles.art} ${styles.spotlyArt}`}><div className={styles.wordmark}>SPOTLY</div><div className={styles.fiveProducts}>{['Customer','Business','Driver','Staff','Admin'].map((name,index)=><div key={name}><span>0{index+1}</span><strong>{name}</strong><small>{name === 'Customer' ? 'spotlyafrica.com' : `${name.toLowerCase()}.spotlyafrica.com`}</small></div>)}</div><div className={styles.bridge}><i /><span>ONE SECURE PARENT-DOMAIN SESSION BRIDGE</span><i /></div></div>;
  }
  if (project.tone === 'insights') {
    return <div className={`${styles.art} ${styles.insightsArt}`}><div className={styles.sources}><span>MEMBERS</span><span>APPLICATIONS</span><span>TRACKER</span><span>PAPER</span></div><b className={styles.bigArrow}>→</b><div className={styles.reconcile}><small>RECONCILIATION LAYER</small><strong>Confidence, not guesses.</strong><p>source-aware · reviewable · privacy-safe</p></div><div className={styles.counts}><b>2,383<small>member records</small></b><b>2,125<small>application rows</small></b><b>513<small>paper sign-ins</small></b></div></div>;
  }
  return <div className={`${styles.art} ${styles.mealArt}`}><div className={styles.inputs}><span>TYPE</span><span>SPEAK</span><span>PHOTO</span></div><b className={styles.bigArrow}>→</b><div className={styles.mealCore}><small>SERVER-SIDE RESOLUTION</small><strong>Say what you ate.</strong><p>OpenAI · USDA · Open Food Facts</p></div><b className={styles.bigArrow}>→</b><div className={styles.output}><small>DAILY RECAP</small><span>Calories</span><span>Protein</span><span>Macros</span></div></div>;
}

export default async function WorkPage({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  const detail = details[slug];
  if (!project || !detail) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    creator: { '@type': 'Person', name: 'Denzel Tinashe', url: 'https://www.denzeltinashe.com' },
    description: project.summary,
    url: `https://www.denzeltinashe.com/work/${slug}`,
    dateCreated: project.timeline,
  };

  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className={styles.header}><Link href="/" className={styles.brand}><span>DT</span><b>Denzel Tinashe</b></Link><div><Link href="/#work">All work <Arrow /></Link><Link href="/start" className={styles.start}>Start a project <Arrow up /></Link></div></header>

      <section className={styles.hero}>
        <div className={styles.kicker}><span>{project.label}</span><span>{project.index} / 04</span></div>
        <h1>{project.name}</h1>
        <p>{project.statement}</p>
        <div className={styles.links}>{project.live && <a href={project.live} target="_blank" rel="noreferrer">Live product <Arrow up /></a>}<a href={project.github} target="_blank" rel="noreferrer">View source <Arrow up /></a></div>
      </section>

      <Art project={project} />

      <section className={styles.atGlance}>
        <div><small>ROLE / OWNERSHIP</small><p>{project.role}</p></div><div><small>STATUS</small><p>{project.status}</p></div><div><small>TIMELINE</small><p>{project.timeline}</p></div>
      </section>

      <section className={styles.narrative}><aside>THE PROBLEM</aside><h2>{detail.problem}</h2></section>
      <section className={styles.challenge}><aside>THE PRODUCT CHALLENGE</aside><p>{detail.challenge}</p></section>

      <section className={styles.decisions}><div className={styles.stickyTitle}><span>KEY DECISIONS</span><h2>The work behind the screen.</h2></div><div className={styles.decisionList}>{detail.decisions.map(([title,body],index)=><article key={title}><span>0{index+1}</span><div><h3>{title}</h3><p>{body}</p></div></article>)}</div></section>

      <section className={styles.tradeoff}><span>TRADEOFF</span><p>{project.tradeoff}</p></section>

      <section className={styles.outcomes}><div><span>WHAT THE BUILD PROVES</span><h2>Evidence, not adjectives.</h2></div><ul>{project.outcomes.map((item) => <li key={item}>{item}</li>)}</ul></section>

      <section className={styles.stack}><span>TECHNOLOGY / SYSTEMS</span><div>{detail.systems.map((item)=><b key={item}>{item}</b>)}</div></section>

      <section className={styles.evidence}><div><span>VERIFIABLE EVIDENCE</span><h2>Inspect the work.</h2></div><div><ul>{detail.evidence.map((item)=><li key={item}>{item}</li>)}</ul><div className={styles.evidenceLinks}>{project.live && <a href={project.live} target="_blank" rel="noreferrer">Open live product <Arrow up /></a>}<a href={project.github} target="_blank" rel="noreferrer">Inspect source <Arrow up /></a></div></div></section>

      <section className={styles.next}><p>Have something complicated that needs to feel simple?</p><h2>Build it properly.</h2><Link href="/start">Start a project <Arrow /></Link></section>
      <footer className={styles.footer}><Link href="/">Denzel Tinashe</Link><div><a href="/resume.pdf" target="_blank" rel="noreferrer">Résumé ↗</a><a href="https://github.com/sparkdeveloping" target="_blank" rel="noreferrer">GitHub ↗</a></div></footer>
    </main>
  );
}
