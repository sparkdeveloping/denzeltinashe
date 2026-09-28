import Image from 'next/image';
import Link from 'next/link';
import PortfolioHeader from '@/components/portfolio/PortfolioHeader';
import Reveal from '@/components/portfolio/Reveal';
import {
  capabilities,
  experience,
  featuredProjects,
  featuredWebsites,
  processSteps,
  shippedNames,
  websiteArchive,
} from '@/data/portfolio';
import styles from './home.module.css';

function Arrow({ up = false }) {
  return <span aria-hidden="true">{up ? '↗' : '→'}</span>;
}

function HeroProof() {
  return (
    <div className={styles.heroProof} aria-label="Selected product evidence">
      <div className={styles.heroProofGlow} aria-hidden="true" />
      <div className={styles.heroSpotly}>
        <div className={styles.heroSpotlyTop}><strong>SPOTLY</strong><span>5 surfaces · 1 platform</span></div>
        <div className={styles.heroSpotlyGrid}>
          {['Customer', 'Business', 'Driver', 'Staff', 'Admin'].map((item) => <span key={item}>{item}</span>)}
        </div>
        <small>Shared identity · commerce · delivery · operations</small>
      </div>
      <div className={styles.heroPhone}>
        <span className={styles.heroPhoneIsland} />
        <img src="https://beforeuscroll.vercel.app/screens/home-flame.webp" alt="BeforeUScroll native iOS home screen" />
      </div>
      <div className={styles.heroMealCard}>
        <small>MEALRECAP</small>
        <strong>Type · speak · snap</strong>
        <p>Natural meal input → structured nutrition recap</p>
      </div>
      <div className={styles.heroProofCaption}><span>REAL PRODUCTS</span><span>2026</span></div>
    </div>
  );
}

function ProjectVisual({ project }) {
  if (project.tone === 'meal') {
    return (
      <div className={`${styles.projectVisual} ${styles.mealVisual}`}>
        <div className={styles.flowRail}>
          <span>TYPE</span><span>SPEAK</span><span>PHOTO</span>
        </div>
        <div className={styles.flowArrow}>→</div>
        <div className={styles.resolveCore}>
          <small>SERVER-SIDE RESOLUTION</small>
          <strong>Describe the meal first.</strong>
          <p>OpenAI + USDA + Open Food Facts</p>
        </div>
        <div className={styles.flowArrow}>→</div>
        <div className={styles.recapCard}>
          <small>DAILY RECAP</small>
          <strong>Calories</strong><strong>Protein</strong><strong>Macros</strong>
        </div>
        <span className={styles.visualTruth}>Product architecture — no invented traction metrics</span>
      </div>
    );
  }

  if (project.tone === 'spotly') {
    return (
      <div className={`${styles.projectVisual} ${styles.spotlyVisual}`}>
        <div className={styles.spotlyWord}>SPOTLY</div>
        <div className={styles.surfaceGrid}>
          {['Customer', 'Business', 'Driver', 'Staff', 'Admin'].map((item, index) => (
            <div key={item}><span>0{index + 1}</span><strong>{item}</strong><small>{item.toLowerCase() === 'customer' ? 'spotlyafrica.com' : `${item.toLowerCase()}.spotlyafrica.com`}</small></div>
          ))}
        </div>
        <div className={styles.sessionBridge}><i /><span>ONE VERIFIED SESSION BRIDGE</span><i /></div>
      </div>
    );
  }

  if (project.tone === 'insights') {
    return (
      <div className={`${styles.projectVisual} ${styles.insightsVisual}`}>
        <div className={styles.sourceStack}>
          <span>MEMBER EXPORT</span><span>APPLICATIONS</span><span>TRACKER</span><span>PAPER SIGN-INS</span>
        </div>
        <div className={styles.pipelineArrow}>→</div>
        <div className={styles.reconcileBlock}><small>RECONCILE</small><strong>Confidence, not guesses.</strong><span>review queue · source truth · privacy controls</span></div>
        <div className={styles.insightCounts}><b>2,383<small>member records</small></b><b>2,125<small>application rows</small></b><b>513<small>paper sign-ins</small></b></div>
      </div>
    );
  }

  return (
    <div className={`${styles.projectVisual} ${styles.scrollVisual}`}>
      <div className={styles.screenFan}>
        {project.screenshots.map((src, index) => (
          <div className={styles.screenPhone} key={src} style={{ '--screen-index': index }}>
            <span /><img src={src} alt={`BeforeUScroll product screen ${index + 1}`} loading="lazy" />
          </div>
        ))}
      </div>
      <div className={styles.screenSystemNote}><strong>System-level intervention</strong><span>FamilyControls · ManagedSettings · DeviceActivity</span></div>
    </div>
  );
}

function FeaturedProject({ project }) {
  return (
    <article className={styles.project}>
      <div className={styles.projectMeta}><span>{project.index}</span><span>{project.label}</span><span>{project.status}</span></div>
      <div className={styles.projectTitleRow}>
        <Reveal><h3>{project.name}</h3></Reveal>
        <Reveal delay={80}><p>{project.statement}</p></Reveal>
      </div>
      <Reveal className={styles.projectVisualWrap} delay={40}>
        <Link href={`/work/${project.slug}`} aria-label={`Read ${project.name} case study`}><ProjectVisual project={project} /></Link>
      </Reveal>
      <div className={styles.projectEvidence}>
        <Reveal><p className={styles.projectSummary}>{project.summary}</p><div className={styles.projectLinks}><Link href={`/work/${project.slug}`}>Case study <Arrow /></Link>{project.live && <a href={project.live} target="_blank" rel="noreferrer">Live <Arrow up /></a>}<a href={project.github} target="_blank" rel="noreferrer">Source <Arrow up /></a></div></Reveal>
        <Reveal delay={70}><small>ROLE / OWNERSHIP</small><p>{project.role}</p><small className={styles.evidenceLabel}>TIMELINE</small><p>{project.timeline}</p></Reveal>
        <Reveal delay={120}><small>PROOF IN THE BUILD</small><ul>{project.proof.map((item) => <li key={item}>{item}</li>)}</ul></Reveal>
      </div>
    </article>
  );
}

function WebsiteCard({ site }) {
  const remote = site.image.startsWith('http');
  return (
    <article className={styles.websiteCard}>
      <a className={styles.websiteImageLink} href={site.href} target="_blank" rel="noreferrer" aria-label={`Open ${site.name}`}>
        <div className={styles.websiteImage}>
          {remote ? <img src={site.image} alt={`${site.name} project media`} loading="lazy" /> : <Image src={site.image} alt={`${site.name} website`} fill sizes="(max-width: 900px) 92vw, 33vw" />}
          <span className={styles.websiteIdentity}>{site.name}</span>
          <span className={styles.websiteLive}>LIVE ↗</span>
        </div>
      </a>
      <div className={styles.websiteCopy}>
        <span>{site.type}</span><h3>{site.name}</h3><p>{site.note}</p>
        <div><a href={site.href} target="_blank" rel="noreferrer">Visit site <Arrow up /></a><a href={site.repo} target="_blank" rel="noreferrer">Source <Arrow up /></a></div>
      </div>
    </article>
  );
}

export default function Home() {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Denzel Tinashe',
    alternateName: 'Denzel Nyatsanza',
    url: 'https://www.denzeltinashe.com',
    image: 'https://www.denzeltinashe.com/portrait-2026.webp',
    jobTitle: 'Product Designer & Engineer',
    homeLocation: { '@type': 'Place', name: 'Wichita, Kansas' },
    sameAs: ['https://github.com/sparkdeveloping', 'https://www.linkedin.com/in/denzelnyatsanza/'],
  };

  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <PortfolioHeader />

      <section className={styles.hero} id="top">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><i /> Product designer + engineer · iOS / web</p>
          <h1>
            <span className={styles.heroLine}>I turn ambitious ideas</span>
            <span className={styles.heroLine}>into products people</span>
            <span className={`${styles.heroLine} ${styles.heroOutline}`}>want to use.</span>
          </h1>
          <div className={styles.heroBottom}>
            <p>From product decisions and interaction design to native iOS, full-stack systems, and launch-quality websites.</p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} href="/start">Tell me what should exist <Arrow /></Link>
              <a className={styles.textLink} href="#work">See the evidence <Arrow /></a>
            </div>
          </div>
        </div>
        <HeroProof />
      </section>

      <section className={styles.proofStrip} aria-label="Portfolio evidence summary">
        <div><strong>4</strong><span>deep product case studies</span></div>
        <div><strong>8</strong><span>deployed website projects</span></div>
        <div><strong>iOS + web</strong><span>native through full-stack</span></div>
        <div><strong>Public source</strong><span>selected engineering on GitHub</span></div>
      </section>

      <section className={styles.shippedStrip} aria-label="Selected organizations and products shipped">
        <span>SELECTED SHIPPED WORK</span><div>{shippedNames.map((name) => <b key={name}>{name}</b>)}</div>
      </section>

      <section className={styles.work} id="work">
        <div className={styles.sectionIntro}>
          <Reveal><span className={styles.sectionIndex}>01 / PRODUCT WORK</span></Reveal>
          <Reveal delay={40}><h2>Proof before polish.</h2></Reveal>
          <Reveal delay={80}><p>Four projects selected for the decisions underneath the interface: native frameworks, platform architecture, operational data, security boundaries, and the tradeoffs required to ship.</p></Reveal>
        </div>
        <div className={styles.projects}>{featuredProjects.map((project) => <FeaturedProject key={project.slug} project={project} />)}</div>
      </section>

      <section className={styles.websites} id="web">
        <div className={styles.websiteIntro}>
          <span className={styles.sectionIndex}>02 / DEPLOYED WEB</span>
          <div><h2>Sites that have to work for real organizations.</h2><p>Not every project needs a platform architecture. These builds show conversion, art direction, responsive implementation, content systems, live media, forms, SEO, and production constraints.</p></div>
        </div>
        <div className={styles.featuredWebsiteGrid}>{featuredWebsites.map((site) => <WebsiteCard key={site.name} site={site} />)}</div>
        <div className={styles.webArchive}>
          <div className={styles.archiveHeading}><span>MORE SHIPPED WEBSITES</span><span>LIVE / SOURCE</span></div>
          {websiteArchive.map(([name, type, href, repo], index) => (
            <div className={styles.archiveRow} key={name}><span>{String(index + 4).padStart(2, '0')}</span><strong>{name}</strong><em>{type}</em><div><a href={href} target="_blank" rel="noreferrer">Live ↗</a>{repo && <a href={repo} target="_blank" rel="noreferrer">Source ↗</a>}</div></div>
          ))}
        </div>
      </section>

      <section className={styles.capabilities} id="capabilities">
        <div className={styles.capabilityHeading}><span className={styles.sectionIndex}>03 / CAPABILITIES</span><h2>One product mind across the whole build.</h2><p>Less translation between product, design, and engineering. More continuity from the original problem to the shipped behavior.</p></div>
        <div className={styles.capabilityList}>{capabilities.map(([title, body, deliverables], index) => <Reveal key={title} className={styles.capabilityItem}><span>0{index + 1}</span><div><h3>{title}</h3><p>{body}</p></div><small>{deliverables}</small></Reveal>)}</div>
      </section>

      <section className={styles.approach} id="approach">
        <div className={styles.approachSticky}><span className={styles.sectionIndex}>04 / APPROACH</span><h2>Make the right thing. Then make it excellent.</h2><p>Visual polish matters. It matters more after the product logic, constraints, states, architecture, and user path make sense.</p></div>
        <div className={styles.processList}>{processSteps.map(([number, title, body]) => <Reveal key={number} className={styles.processStep}><span>{number}</span><div><h3>{title}</h3><p>{body}</p></div></Reveal>)}</div>
      </section>

      <section className={styles.experience} id="experience">
        <div className={styles.experienceHead}><span className={styles.sectionIndex}>05 / EXPERIENCE</span><div><h2>Real work, real constraints.</h2><p>A concise professional timeline for hiring teams. The product case studies above show the craft; this shows where the operating experience comes from.</p><div className={styles.experienceLinks}><a href="/resume.pdf" target="_blank" rel="noreferrer">Résumé ↗</a><a href="https://www.linkedin.com/in/denzelnyatsanza/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/sparkdeveloping" target="_blank" rel="noreferrer">GitHub ↗</a></div></div></div>
        <div className={styles.timeline}>{experience.map(([date, org, role, body]) => <article key={`${org}-${role}`}><span>{date}</span><div><h3>{org}</h3><strong>{role}</strong><p>{body}</p></div></article>)}</div>
      </section>

      <section className={styles.about} id="about">
        <Reveal className={styles.aboutPortrait}><div className={styles.portraitFrame}><Image src="/portrait-2026.webp" alt="Portrait of Denzel Tinashe" fill sizes="(max-width: 800px) 92vw, 38vw" /></div><div><span>Denzel Tinashe</span><span>Wichita, Kansas → worldwide</span></div></Reveal>
        <div className={styles.aboutCopy}>
          <span className={styles.sectionIndex}>06 / ABOUT</span>
          <Reveal><h2>Design-minded engineer. Engineering-minded designer.</h2></Reveal>
          <Reveal delay={50}><p className={styles.aboutLead}>I like ambiguous projects where the hard part is figuring out what the product should be, not just implementing a predetermined screen.</p><p>I work best when I can move between product decisions, interface behavior, architecture, and implementation without losing the thread. I prototype early, surface tradeoffs explicitly, and care about the details users notice—and the infrastructure they should never have to notice.</p></Reveal>
          <div className={styles.aboutFacts}><div><small>PRIMARY STACK</small><span>SwiftUI · Next.js · React · Firebase · Vercel</span></div><div><small>EDUCATION</small><span>Computer Engineering · Wichita State University</span></div><div><small>PUBLIC CODE</small><a href="https://github.com/sparkdeveloping" target="_blank" rel="noreferrer">github.com/sparkdeveloping ↗</a></div></div>
          <div className={styles.otherWorlds}><a href="https://media.denzeltinashe.com">Media work <Arrow up /></a><a href="https://ministry.denzeltinashe.com">Ministry <Arrow up /></a></div>
        </div>
      </section>

      <section className={styles.contact} id="contact">
        <div className={styles.contactTop}><span>07 / START SOMETHING</span><span>APP · WEB APP · WEBSITE</span></div>
        <div className={styles.contactMain}><p>Have something complicated that should feel simple?</p><h2>Build it<br /><span>properly.</span></h2><Link className={styles.contactButton} href="/start">Start a project <Arrow /></Link></div>
        <div className={styles.contactBottom}><span>© 2026 Denzel Tinashe</span><div><a href="/resume.pdf" target="_blank" rel="noreferrer">Résumé</a><a href="https://www.linkedin.com/in/denzelnyatsanza/" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://github.com/sparkdeveloping" target="_blank" rel="noreferrer">GitHub</a></div></div>
      </section>
    </main>
  );
}
