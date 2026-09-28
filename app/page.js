'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  capabilities,
  featuredProjects,
  processSteps,
  websiteProjects,
} from '@/data/portfolio';
import styles from './home.module.css';

const ease = [0.22, 1, 0.36, 1];
const spring = { type: 'spring', stiffness: 220, damping: 24, mass: 0.75 };

function Arrow({ up = false }) {
  return <span aria-hidden="true">{up ? '↗' : '→'}</span>;
}

function Reveal({ children, className = '', delay = 0 }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.72, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function MagneticLink({ href, children, className = '', external = false }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const reduced = useReducedMotion();
  const sx = useSpring(x, { stiffness: 300, damping: 20, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 300, damping: 20, mass: 0.35 });

  function move(event) {
    if (reduced || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.11);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.11);
  }

  const shared = {
    className,
    onPointerMove: move,
    onPointerLeave: () => {
      x.set(0);
      y.set(0);
    },
    style: { x: sx, y: sy },
    whileTap: reduced ? undefined : { scale: 0.98 },
  };

  if (href.startsWith('/')) {
    return (
      <motion.span {...shared}>
        <Link href={href}>{children}</Link>
      </motion.span>
    );
  }

  return (
    <motion.a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      {...shared}
    >
      {children}
    </motion.a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    ['Work', '#work'],
    ['Capabilities', '#capabilities'],
    ['Approach', '#approach'],
    ['About', '#about'],
  ];

  return (
    <header className={styles.header}>
      <a className={styles.brand} href="#top" aria-label="Denzel Tinashe, back to top">
        <span className={styles.brandMark}>DT</span>
        <span className={styles.brandText}>Denzel Tinashe</span>
      </a>

      <nav className={styles.nav} aria-label="Main navigation">
        {links.map(([label, href]) => (
          <a key={label} href={href}>{label}</a>
        ))}
      </nav>

      <MagneticLink
        href="mailto:denzelnyatsanza@gmail.com?subject=I%20want%20to%20build%20something"
        className={styles.headerCta}
      >
        <span>Start a project</span><Arrow up />
      </MagneticLink>

      <button
        type="button"
        className={styles.menuButton}
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            className={styles.mobileNav}
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.985 }}
            transition={{ duration: 0.25, ease }}
          >
            {links.map(([label, href]) => (
              <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>
            ))}
            <a
              href="mailto:denzelnyatsanza@gmail.com?subject=I%20want%20to%20build%20something"
              onClick={() => setOpen(false)}
            >
              Start a project <Arrow up />
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function HeroStage() {
  const wrap = useRef(null);
  const reduced = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rx = useSpring(pointerY, { stiffness: 90, damping: 19, mass: 0.7 });
  const ry = useSpring(pointerX, { stiffness: 90, damping: 19, mass: 0.7 });

  function move(event) {
    if (reduced || window.matchMedia('(pointer: coarse)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(px * 7);
    pointerY.set(py * -6);
  }

  function reset() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <motion.div
      ref={wrap}
      className={styles.heroStage}
      onPointerMove={move}
      onPointerLeave={reset}
      style={{ rotateX: rx, rotateY: ry }}
      initial={reduced ? false : { opacity: 0, scale: 0.96, y: 20 }}
      animate={reduced ? undefined : { opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.95, delay: 0.12, ease }}
    >
      <div className={styles.stageLight} />
      <motion.div
        className={`${styles.productWindow} ${styles.spotlyWindow}`}
        animate={reduced ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 6.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className={styles.windowBar}>
          <div className={styles.windowDots}><i /><i /><i /></div>
          <span>spotly / operations</span>
          <em>live</em>
        </div>
        <div className={styles.spotlyDashboard}>
          <aside>
            <strong>S.</strong>
            <span>Today</span><span>Orders</span><span>Delivery</span><span>Finance</span>
          </aside>
          <div className={styles.dashBody}>
            <div className={styles.dashHeading}><span>Today</span><small>Business overview</small></div>
            <div className={styles.metrics}><b>128<small>orders</small></b><b>92%<small>fulfilled</small></b><b>14<small>drivers</small></b></div>
            <div className={styles.chartBars}>{[42,68,54,86,61,94,74,83].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className={`${styles.phoneShell} ${styles.mealPhone}`}
        animate={reduced ? undefined : { y: [0, 8, 0], rotate: [-5, -4.2, -5] }}
        transition={{ duration: 7.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className={styles.phoneTop}><span /></div>
        <div className={styles.mealUi}>
          <div className={styles.mealHead}><small>Monday</small><strong>MealRecap</strong></div>
          <div className={styles.ring}><span>1,640<small>of 2,100 kcal</small></span></div>
          <div className={styles.macroRow}><span><b>112g</b>protein</span><span><b>174g</b>carbs</span><span><b>58g</b>fat</span></div>
          <div className={styles.mealInput}>“rice, chicken and avocado” <i>↑</i></div>
        </div>
      </motion.div>

      <motion.div
        className={`${styles.phoneShell} ${styles.scrollPhone}`}
        animate={reduced ? undefined : { y: [0, -5, 0], rotate: [7, 6.3, 7] }}
        transition={{ duration: 6.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className={styles.phoneTop}><span /></div>
        <div className={styles.scrollUi}>
          <div className={styles.flame}>◇</div>
          <small>BEFOREUSCROLL</small>
          <strong>Your Flame is out.</strong>
          <p>Recharge before the scroll gets you.</p>
          <span className={styles.shieldAction}>Prepare Recharge</span>
          <span>Stay Locked</span>
        </div>
      </motion.div>

      <div className={styles.stageCaption}>
        <span>PRODUCT × DESIGN × ENGINEERING</span>
        <span>2026</span>
      </div>
    </motion.div>
  );
}

function Hero() {
  const section = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 80]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 125]);

  return (
    <section className={styles.hero} id="top" ref={section}>
      <motion.div className={styles.heroCopy} style={{ y }}>
        <motion.div
          className={styles.eyebrow}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <span className={styles.statusDot} />
          Product designer + engineer · iOS / web
        </motion.div>

        <h1>
          <motion.span initial={reduced ? false : { opacity: 0, y: 30 }} animate={reduced ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.78, ease }}>
            I turn ambitious ideas
          </motion.span>
          <motion.span initial={reduced ? false : { opacity: 0, y: 30 }} animate={reduced ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.78, delay: 0.06, ease }}>
            into products people
          </motion.span>
          <motion.span className={styles.heroOutline} initial={reduced ? false : { opacity: 0, y: 30 }} animate={reduced ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.78, delay: 0.12, ease }}>
            want to use.
          </motion.span>
        </h1>

        <motion.div className={styles.heroFoot} initial={reduced ? false : { opacity: 0 }} animate={reduced ? undefined : { opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }}>
          <p>
            Apps, web products, and high-conviction websites—from the first product decision to launch-quality code.
          </p>
          <div className={styles.heroActions}>
            <MagneticLink href="mailto:denzelnyatsanza@gmail.com?subject=I%20want%20to%20build%20something" className={styles.primaryButton}>
              <span>Tell me what should exist</span><Arrow />
            </MagneticLink>
            <a href="#work" className={styles.textLink}>See the work <Arrow /></a>
          </div>
        </motion.div>
      </motion.div>

      <motion.div className={styles.heroStageWrap} style={{ y: stageY }}>
        <HeroStage />
      </motion.div>

      <div className={styles.heroRail} aria-hidden="true">
        <span>01</span><i /><span>04</span>
      </div>
    </section>
  );
}

function ProofStrip() {
  const items = [
    ['Native iOS', 'SwiftUI + Apple frameworks'],
    ['Full-stack web', 'Next.js + production systems'],
    ['Product ownership', 'Definition through launch'],
    ['Public code', 'Selected source on GitHub'],
  ];
  return (
    <section className={styles.proofStrip} aria-label="Core capabilities">
      {items.map(([title, detail]) => (
        <div key={title}><strong>{title}</strong><span>{detail}</span></div>
      ))}
    </section>
  );
}

function ProjectVisual({ project }) {
  if (project.tone === 'meal') {
    return (
      <div className={`${styles.projectVisual} ${styles.visualMeal}`}>
        <div className={styles.bigPhone}>
          <div className={styles.bigPhoneTop}><span /></div>
          <div className={styles.bigMealUi}>
            <div><small>YOUR MONDAY</small><b>Good afternoon.</b></div>
            <div className={styles.bigRing}><span>1,640<small>CALORIES</small></span></div>
            <div className={styles.foodList}><span>Breakfast <b>420</b></span><span>Lunch <b>670</b></span><span>Dinner <b>550</b></span></div>
            <div className={styles.voicePill}>Type, speak, or snap <i>+</i></div>
          </div>
        </div>
        <div className={styles.visualNote}><span>01</span><p>Natural input. Structured nutrition. Server-side AI.</p></div>
      </div>
    );
  }

  if (project.tone === 'spotly') {
    return (
      <div className={`${styles.projectVisual} ${styles.visualSpotly}`}>
        <div className={styles.networkGrid}>
          {['Customer', 'Business', 'Driver', 'Staff', 'Admin'].map((label, index) => (
            <motion.div key={label} whileHover={{ y: -4 }} transition={spring}>
              <span>0{index + 1}</span><strong>{label}</strong><small>spotlyafrica.com</small>
            </motion.div>
          ))}
        </div>
        <div className={styles.networkLine}><i /><span>ONE SHARED SESSION BRIDGE</span><i /></div>
      </div>
    );
  }

  if (project.tone === 'insights') {
    return (
      <div className={`${styles.projectVisual} ${styles.visualInsights}`}>
        <div className={styles.insightPanel}>
          <div className={styles.insightTop}><span>GoCreate / Insights</span><small>DATA AS OF 09.11.26</small></div>
          <div className={styles.insightStats}><b>2,383<small>member records</small></b><b>2,125<small>applications</small></b><b>513<small>paper rows</small></b></div>
          <div className={styles.insightChart}>{[30,48,44,58,70,62,81,77,91,84,96,88].map((value, index) => <i key={index} style={{ height: `${value}%` }} />)}</div>
          <div className={styles.insightLegend}><span><i /> Tracker source</span><span><i /> Reconciled manual</span><span><i /> Review queue</span></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.projectVisual} ${styles.visualScroll}`}>
      <div className={styles.shieldFrame}>
        <span className={styles.shieldIcon}>◇</span>
        <small>SCREEN TIME SHIELD</small>
        <strong>Your Flame is out.</strong>
        <p>Open BeforeUScroll to recharge before the scroll gets you.</p>
        <span className={styles.shieldAction}>Prepare Recharge</span>
        <span>Stay Locked</span>
      </div>
      <div className={styles.systemTags}><span>FamilyControls</span><span>ManagedSettings</span><span>DeviceActivity</span></div>
    </div>
  );
}

function FeaturedProject({ project, index }) {
  return (
    <article className={styles.project}>
      <div className={styles.projectMeta}>
        <span>{project.index}</span>
        <span>{project.label}</span>
      </div>

      <Reveal className={styles.projectHeading}>
        <h3>{project.name}</h3>
        <p>{project.statement}</p>
      </Reveal>

      <Reveal className={styles.projectVisualWrap} delay={0.04}>
        <Link href={`/work/${project.slug}`} aria-label={`Read ${project.name} case study`}>
          <motion.div whileHover={{ scale: 0.992 }} transition={spring}>
            <ProjectVisual project={project} />
          </motion.div>
        </Link>
      </Reveal>

      <div className={styles.projectDetailGrid}>
        <Reveal>
          <p className={styles.projectSummary}>{project.summary}</p>
          <div className={styles.projectLinks}>
            <Link href={`/work/${project.slug}`}>Case study <Arrow /></Link>
            {project.live && <a href={project.live} target="_blank" rel="noreferrer">Live product <Arrow up /></a>}
            <a href={project.github} target="_blank" rel="noreferrer">Source <Arrow up /></a>
          </div>
        </Reveal>
        <Reveal className={styles.projectOwnership} delay={0.06}>
          <small>WHAT I OWNED</small>
          <div>{project.ownership.map((item) => <span key={item}>{item}</span>)}</div>
        </Reveal>
        <Reveal className={styles.projectProof} delay={0.1}>
          <small>PROOF IN THE BUILD</small>
          <ul>{project.proof.map((item) => <li key={item}>{item}</li>)}</ul>
        </Reveal>
      </div>

      {index < featuredProjects.length - 1 && <div className={styles.projectDivider} />}
    </article>
  );
}

function Work() {
  return (
    <section className={styles.work} id="work">
      <div className={styles.sectionIntro}>
        <Reveal><span className={styles.sectionIndex}>01 / SELECTED WORK</span></Reveal>
        <Reveal delay={0.04}><h2>Not mockups.<br />Working systems.</h2></Reveal>
        <Reveal delay={0.08}><p>Selected products where the interesting part is not just how the screen looks—it is the product decision, architecture, edge case, and implementation behind it.</p></Reveal>
      </div>
      <div className={styles.projects}>
        {featuredProjects.map((project, index) => <FeaturedProject key={project.slug} project={project} index={index} />)}
      </div>
    </section>
  );
}

function Websites() {
  return (
    <section className={styles.websites}>
      <div className={styles.websiteIntro}>
        <span>WEB / BRAND / CONVERSION</span>
        <div>
          <h2>A broader body of deployed website work.</h2>
          <p>Churches, events, education, and organizations—each treated as a real product with a specific audience, conversion path, content system, and production constraint.</p>
        </div>
      </div>
      <div className={styles.websiteGrid}>
        {websiteProjects.map((project, index) => (
          <motion.article
            key={project.name}
            className={styles.websiteCard}
            whileHover={{ y: -5 }}
            transition={spring}
          >
            <div className={styles.websiteCardTop}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <span>{project.status}</span>
            </div>
            <a href={project.href} target="_blank" rel="noreferrer" className={styles.websiteVisualLink} aria-label={`Open ${project.name}`}>
              {project.image ? (
                <div className={styles.websiteImage}><Image src={project.image} alt="" fill sizes="(max-width: 800px) 90vw, 25vw" /></div>
              ) : (
                <div className={styles.websiteWordmark}><strong>{project.mark}</strong><small>{project.name}</small></div>
              )}
            </a>
            <div className={styles.websiteCardBottom}>
              <strong>{project.name}</strong>
              <span>{project.type}</span>
              <div className={styles.websiteActions}>
                <a href={project.href} target="_blank" rel="noreferrer">Live <Arrow up /></a>
                {project.repo && <a href={project.repo} target="_blank" rel="noreferrer">Source <Arrow up /></a>}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <section className={styles.capabilities} id="capabilities">
      <div className={styles.capabilityHeading}>
        <span className={styles.sectionIndex}>02 / CAPABILITIES</span>
        <h2>One product mind across the whole build.</h2>
        <p>Less translation between strategy, design, and engineering. More continuity from what the product should do to how it actually behaves.</p>
      </div>
      <div className={styles.capabilityList}>
        {capabilities.map((item, index) => (
          <motion.article key={item.title} className={styles.capabilityItem} whileHover="hover">
            <span>0{index + 1}</span>
            <div><h3>{item.title}</h3><p>{item.body}</p></div>
            <small>{item.deliverables}</small>
            <motion.i variants={{ hover: { x: 5 } }} transition={spring}>→</motion.i>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Approach() {
  return (
    <section className={styles.approach} id="approach">
      <div className={styles.approachSticky}>
        <span className={styles.sectionIndex}>03 / APPROACH</span>
        <h2>Make the right thing.<br />Then make it excellent.</h2>
        <p>Visual polish matters. It matters more after the product logic, states, architecture, and user path make sense.</p>
      </div>
      <div className={styles.processList}>
        {processSteps.map(([number, title, body]) => (
          <Reveal key={number} className={styles.processStep}>
            <span>{number}</span><div><h3>{title}</h3><p>{body}</p></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className={styles.about} id="about">
      <Reveal className={styles.aboutPortrait}>
        <div className={styles.portraitFrame}>
          <Image
            src="/portrait-2026.webp"
            alt="Portrait of Denzel Tinashe"
            fill
            sizes="(max-width: 800px) 92vw, 40vw"
            priority={false}
          />
        </div>
        <div className={styles.portraitNote}><span>Denzel Tinashe</span><span>Product designer + engineer</span></div>
      </Reveal>

      <div className={styles.aboutCopy}>
        <span className={styles.sectionIndex}>04 / ABOUT</span>
        <Reveal><h2>I care about the parts people notice—and the parts they should never have to notice.</h2></Reveal>
        <Reveal delay={0.05}>
          <p>
            I design and build software across native iOS, full-stack web products, operational systems, and conversion-focused websites. My best work happens when I can understand the actual problem, make the product decisions, and carry that thinking all the way into the implementation.
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <div className={styles.aboutFacts}>
            <div><small>BASED IN</small><span>Wichita, Kansas · working worldwide</span></div>
            <div><small>PRIMARY STACK</small><span>SwiftUI · Next.js · React · Firebase · Vercel</span></div>
            <div><small>PUBLIC WORK</small><a href="https://github.com/sparkdeveloping" target="_blank" rel="noreferrer">github.com/sparkdeveloping <Arrow up /></a></div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className={styles.otherWorlds}>
            <a href="https://media.denzeltinashe.com"><span>Media work</span><Arrow up /></a>
            <a href="https://ministry.denzeltinashe.com"><span>Ministry</span><Arrow up /></a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className={styles.contact} id="contact">
      <div className={styles.contactNoise} aria-hidden="true" />
      <div className={styles.contactTop}>
        <span>05 / START SOMETHING</span>
        <span>APP · WEB APP · WEBSITE</span>
      </div>
      <Reveal className={styles.contactMain}>
        <p>Have a product in your head?</p>
        <h2>Tell me what<br />should exist.</h2>
        <MagneticLink href="mailto:denzelnyatsanza@gmail.com?subject=I%20want%20to%20build%20something" className={styles.contactButton}>
          <span>Start a project</span><Arrow />
        </MagneticLink>
      </Reveal>
      <div className={styles.contactBottom}>
        <span>© {new Date().getFullYear()} Denzel Tinashe</span>
        <div>
          <a href="https://github.com/sparkdeveloping" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://media.denzeltinashe.com">Media</a>
          <a href="https://ministry.denzeltinashe.com">Ministry</a>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useEffect(() => {
    document.documentElement.dataset.portfolio = 'v2';
    return () => { delete document.documentElement.dataset.portfolio; };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <main className={styles.page}>
        <Header />
        <Hero />
        <ProofStrip />
        <Work />
        <Websites />
        <Capabilities />
        <Approach />
        <About />
        <Contact />
      </main>
    </MotionConfig>
  );
}
