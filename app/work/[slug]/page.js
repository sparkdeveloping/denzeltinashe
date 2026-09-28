import Link from 'next/link';
import { notFound } from 'next/navigation';
import { featuredProjects, getProject } from '@/data/portfolio';
import styles from './work.module.css';

const caseDetails = {
  mealrecap: {
    problem: 'Nutrition apps often make logging feel like database work. MealRecap starts from a different premise: the fastest interface is the way people already describe food—in ordinary language, speech, or a photo.',
    challenge: 'The product has to turn imprecise human input into useful nutrition data while keeping sensitive service credentials out of the iOS client and preserving a calm, editorial interaction model.',
    decisions: [
      ['Input before taxonomy', 'Type, speak, or photograph the meal first. Structure happens after the user expresses what they ate.'],
      ['Server-side intelligence', 'OpenAI and USDA credentials live in Firebase Functions secrets rather than in the app binary.'],
      ['Multiple evidence sources', 'USDA FoodData Central and Open Food Facts provide nutrition data; HealthKit can contribute calories-out context.'],
      ['A real monetization path', 'StoreKit 2 subscriptions are part of the product architecture rather than an afterthought.'],
    ],
    stack: ['SwiftUI', 'HealthKit', 'Speech', 'Firebase', 'Cloud Functions', 'OpenAI', 'USDA FoodData Central', 'Open Food Facts', 'StoreKit 2'],
    outcome: 'The result is a production-oriented native app architecture where the interface can stay simple because the complexity—nutrition resolution, AI calls, secrets, subscriptions, and health integrations—is handled deliberately underneath.',
  },
  spotly: {
    problem: 'A marketplace becomes much harder when customers, businesses, drivers, staff, and platform operators each need a different product surface—but still have to behave like one system.',
    challenge: 'Spotly has five production origins and one underlying platform. Authentication, navigation, permissions, payments, notifications, delivery state, kiosk behavior, and operational data have to survive those boundaries without duplicating the product five times.',
    decisions: [
      ['One codebase, product-local URLs', 'Hostname-aware routing maps clean public URLs into shared internal route trees instead of maintaining five unrelated applications.'],
      ['Session continuity across subdomains', 'A verified Firebase ID token becomes a secure HttpOnly parent-domain session cookie; sibling products bootstrap their own Firebase session with a custom token.'],
      ['Server-mediated high-impact actions', 'Driver approval, delivery operations, payout-sensitive data, and kiosk credentials are kept behind server APIs and restrictive Firestore rules.'],
      ['Role-specific product language', 'Customer, Business, Driver, Staff, and Admin each get the information density and action model appropriate to that role.'],
    ],
    stack: ['Next.js', 'React', 'Firebase Auth', 'Firestore', 'Storage', 'Admin SDK', 'App Check', 'Cloud Messaging', 'Paynow', 'Resend', 'Vercel'],
    outcome: 'Spotly demonstrates product architecture at system scale: five user surfaces, shared identity, commerce and delivery workflows, security boundaries, and a deployment model that still behaves as one coherent product.',
  },
  'gocreate-insights': {
    problem: 'Operational data is rarely clean enough to deserve a polished dashboard immediately. GoCreate had master records, application workbooks, aggregate tracker data, and scanned paper sign-ins with different levels of precision.',
    challenge: 'The dangerous shortcut would be to merge everything into one apparently precise timeline. The product instead has to preserve source truth, expose uncertainty, protect private data, and still make the information useful to leadership.',
    decisions: [
      ['Source-aware by design', 'Tracker totals and manually reconciled attendance remain distinguishable, with conservative combined figures only where defensible.'],
      ['Uncertainty becomes UI', 'High-confidence matches can count; possible matches go to a review queue; unreadable rows remain unresolved instead of being guessed.'],
      ['Privacy before convenience', 'Bulk browser analytics exclude direct contact details, exact birthdates, medical-alert contents, emergency contacts, and raw assistance questionnaire text.'],
      ['Drill-down, not magic numbers', 'Meaningful aggregates connect back to records or source explanations so a decision-maker can inspect why a number exists.'],
    ],
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Python data pipelines', 'Recharts', 'OCR reconciliation workflow', 'Vercel'],
    outcome: 'The system turns messy operational evidence into useful reporting without disguising its limitations. That is a product decision as much as a data-engineering decision.',
  },
  beforeuscroll: {
    problem: 'Most attention tools report distraction after it happens. BeforeUScroll is designed around intentional friction before a selected app or domain gets the user’s attention.',
    challenge: 'That behavior lives partly outside the main SwiftUI app. The product needs Apple Screen Time authorization, shared state, Managed Settings shields, Device Activity monitoring, custom system shield UI, and predictable unlock/relock behavior.',
    decisions: [
      ['Use the system, not a fake overlay', 'FamilyControls and ManagedSettings protect selected apps, categories, and domains using Apple’s Screen Time architecture.'],
      ['Intentional time has an end', 'A temporary unlock persists an end date and uses DeviceActivity to reconcile the shield again when the interval finishes.'],
      ['The interruption is product UI', 'A custom ShieldConfiguration explains the pause and offers “Prepare Recharge” versus “Stay Locked.”'],
      ['Extensions share durable state', 'Selection, unlock state, and shield behavior are coordinated across the app and system extensions rather than held in one transient screen.'],
    ],
    stack: ['SwiftUI', 'FamilyControls', 'ManagedSettings', 'ManagedSettingsUI', 'DeviceActivity', 'UserNotifications', 'StoreKit'],
    outcome: 'BeforeUScroll is a useful example of interface design extending beyond the app window: product behavior is implemented across iOS system frameworks and extensions, not just rendered as screens.',
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
  };
}

function Arrow({ up = false }) {
  return <span aria-hidden="true">{up ? '↗' : '→'}</span>;
}

export default async function WorkPage({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  const detail = caseDetails[slug];
  if (!project || !detail) notFound();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}><span>DT</span><b>Denzel Tinashe</b></Link>
        <Link href="/#work" className={styles.back}>All work <Arrow /></Link>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroMeta}><span>{project.label}</span><span>{project.index} / 04</span></div>
        <h1>{project.name}</h1>
        <p>{project.statement}</p>
        <div className={styles.heroLinks}>
          {project.live && <a href={project.live} target="_blank" rel="noreferrer">Live product <Arrow up /></a>}
          <a href={project.github} target="_blank" rel="noreferrer">View source <Arrow up /></a>
        </div>
      </section>

      <section className={`${styles.art} ${styles[project.tone]}`}>
        {project.tone === 'spotly' ? (
          <div className={styles.fiveProducts}>{['Customer','Business','Driver','Staff','Admin'].map((name,index)=><div key={name}><span>0{index+1}</span><strong>{name}</strong><small>one operating network</small></div>)}</div>
        ) : project.tone === 'insights' ? (
          <div className={styles.analyticsArt}><div><small>RECONCILED RECORDS</small><strong>2,383</strong></div><div><small>APPLICATION ROWS</small><strong>2,125</strong></div><div><small>PAPER SIGN-INS</small><strong>513</strong></div><div className={styles.bars}>{[42,66,54,79,63,91,72,88,96,84].map((v,i)=><i key={i} style={{height:`${v}%`}} />)}</div></div>
        ) : project.tone === 'scroll' ? (
          <div className={styles.shieldArt}><span>◇</span><small>SCREEN TIME SHIELD</small><strong>Your Flame is out.</strong><p>Open BeforeUScroll to recharge before the scroll gets you.</p><span className={styles.shieldButton}>Prepare Recharge</span></div>
        ) : (
          <div className={styles.mealArt}><small>MEALRECAP / TODAY</small><strong>1,640</strong><span>CALORIES LOGGED</span><div className={styles.macro}><b>112g<small>protein</small></b><b>174g<small>carbs</small></b><b>58g<small>fat</small></b></div><div className={styles.input}>“rice, chicken and avocado” <i>↑</i></div></div>
        )}
      </section>

      <section className={styles.narrative}>
        <aside><span>THE PROBLEM</span></aside>
        <div><h2>{detail.problem}</h2></div>
      </section>

      <section className={styles.challenge}>
        <span>THE PRODUCT CHALLENGE</span>
        <p>{detail.challenge}</p>
      </section>

      <section className={styles.decisions}>
        <div className={styles.stickyTitle}><span>KEY DECISIONS</span><h2>The work behind the screen.</h2></div>
        <div className={styles.decisionList}>
          {detail.decisions.map(([title, body], index) => (
            <article key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{body}</p></div></article>
          ))}
        </div>
      </section>

      <section className={styles.stack}>
        <span>TECHNOLOGY / SYSTEMS</span>
        <div>{detail.stack.map((item) => <b key={item}>{item}</b>)}</div>
      </section>

      <section className={styles.outcome}>
        <span>WHY THIS WORK MATTERS</span>
        <p>{detail.outcome}</p>
      </section>

      <section className={styles.next}>
        <p>Have something complicated that needs to feel simple?</p>
        <h2>Build it right.</h2>
        <a href="mailto:denzelnyatsanza@gmail.com?subject=I%20want%20to%20build%20something">Start a project <Arrow /></a>
      </section>

      <footer className={styles.footer}>
        <Link href="/">Denzel Tinashe</Link>
        <a href="https://github.com/sparkdeveloping" target="_blank" rel="noreferrer">GitHub <Arrow up /></a>
      </footer>
    </main>
  );
}
