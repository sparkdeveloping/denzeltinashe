'use client';

import Image from 'next/image';
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

const ease = [0.22, 1, 0.36, 1];

const projects = [
  {
    id: 'mealrecap',
    name: 'MealRecap',
    kicker: 'AI nutrition product',
    year: '2026',
    href: 'https://mealrecap.vercel.app',
    description:
      'A calmer way to log food. Natural-language, voice, and photo-first input turn everyday meals into a useful daily nutrition recap.',
    role: 'Product strategy · UI/UX · Full-stack build',
    visual: 'meal',
    size: 'wide',
  },
  {
    id: 'beforeuscroll',
    name: 'BeforeUScroll',
    kicker: 'iOS product',
    year: '2026',
    href: 'https://beforeuscroll.vercel.app',
    description:
      'An intentional friction layer before distracting apps open—built around Scripture, prayer, and reclaiming attention.',
    role: 'Concept · Product design · Swift / iOS',
    visual: 'scroll',
    size: 'tall',
  },
  {
    id: 'kdym',
    name: 'KDYM',
    kicker: 'Digital platform',
    year: '2024–2026',
    href: 'https://www.kdym.org',
    description:
      'A living digital home for Kansas District Youth Ministries: events, registration, media, merch, and the 2026 Outpour campaign system.',
    role: 'Creative direction · Web design · Development',
    visual: 'kdym',
    size: 'standard',
  },
  {
    id: 'hacia',
    name: 'HACIA',
    kicker: 'Website redesign',
    year: '2024–2026',
    href: 'https://hacia.co.zw',
    description:
      'A responsive school platform rebuilt around clearer information architecture, stronger visual hierarchy, and a more premium admissions experience.',
    role: 'UX · UI system · Front-end delivery',
    image: '/work/hacia-1.webp',
    size: 'standard',
  },
  {
    id: 'aftershock',
    name: 'Aftershock',
    kicker: 'Campus ministry website',
    year: '2024–2025',
    href: 'https://www.aftershockministries.com',
    description:
      'A focused responsive site built to establish trust quickly and move university students from discovery into community.',
    role: 'UX · Web design · Development',
    image: '/work/aftershock-1.webp',
    size: 'standard',
  },
  {
    id: 'gocreate',
    name: 'GoCreate / WSU ITS',
    kicker: 'Systems + operations',
    year: '2024–2025',
    href: 'https://gocreate.com',
    description:
      'Digital workflow and operational systems work inside a live university-affiliated innovation environment.',
    role: 'Systems thinking · Digital operations · Support',
    image: '/work/gocreate-1.webp',
    size: 'standard',
  },
];

const services = [
  {
    number: '01',
    title: 'Mobile apps',
    summary: 'From product idea to an interface that feels native, intentional, and ready to ship.',
    detail: 'Product definition · UX flows · Swift / iOS · API integration · launch polish',
  },
  {
    number: '02',
    title: 'Web apps',
    summary: 'Fast, expressive products where design and engineering are treated as one system.',
    detail: 'Next.js · React · full-stack implementation · dashboards · auth · integrations',
  },
  {
    number: '03',
    title: 'Websites',
    summary: 'High-conviction marketing sites that make the offer clear and make the work feel valuable.',
    detail: 'Strategy · information architecture · responsive UI · motion · SEO · performance',
  },
];

const archive = [
  ['FPC Wichita', 'Creative direction + digital systems', 'https://www.fpcwichita.org'],
  ['Jesus Revealed Podcast', 'Media platform + production', 'https://www.youtube.com/@jesusrevealedpodcast'],
  ['PosCloud', 'Laravel + React full-stack work', 'https://github.com/sparkdeveloping'],
  ['Elixer', 'Swift project archive', 'https://github.com/sparkdeveloping/elixer'],
];

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true">{diagonal ? '↗' : '→'}</span>;
}

function MagneticLink({ href, children, className = '', target, onClick }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.28 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.28 });

  const move = (event) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.12);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.12);
  };

  return (
    <motion.a
      href={href}
      className={className}
      target={target}
      rel={target === '_blank' ? 'noreferrer' : undefined}
      onClick={onClick}
      onPointerMove={move}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.97 }}
      style={{ x: sx, y: sy }}
    >
      {children}
    </motion.a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Denzel Tinashe, back to top">
        <span className="brand-mark">DT</span>
        <span className="brand-name">Denzel Tinashe</span>
      </a>

      <nav className="desktop-nav" aria-label="Main navigation">
        <a href="#work">Work</a>
        <a href="#services">Services</a>
        <a href="#about">About</a>
      </nav>

      <MagneticLink className="header-cta" href="mailto:denzelnyatsanza@gmail.com?subject=New%20project%20inquiry">
        Start a project <Arrow diagonal />
      </MagneticLink>

      <button
        className="menu-button"
        type="button"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.28, ease }}
          >
            {['work', 'services', 'about', 'contact'].map((item) => (
              <a key={item} href={`#${item}`} onClick={() => setOpen(false)}>
                {item}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />;
}

function CursorGlow() {
  const reduced = useReducedMotion();
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 100, damping: 22 });
  const sy = useSpring(y, { stiffness: 100, damping: 22 });

  useEffect(() => {
    if (reduced) return undefined;
    const move = (event) => {
      x.set(event.clientX - 260);
      y.set(event.clientY - 260);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [reduced, x, y]);

  if (reduced) return null;
  return <motion.div className="cursor-glow" aria-hidden="true" style={{ x: sx, y: sy }} />;
}

function Hero() {
  const section = useRef(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.45]);

  return (
    <section className="hero" id="top" ref={section}>
      <motion.div className="hero-copy" style={{ y: copyY, opacity }}>
        <motion.p
          className="micro-label"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          Product designer + developer · Wichita, KS → worldwide
        </motion.p>

        <h1 aria-label="I design and build apps people want to use.">
          <motion.span
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.04, ease }}
          >
            I design & build
          </motion.span>
          <motion.span
            className="hero-emphasis"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease }}
          >
            apps people want
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
          >
            to use.
          </motion.span>
        </h1>

        <motion.div
          className="hero-bottom"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28, ease }}
        >
          <p>
            I take products from rough idea to polished launch—strategy, interface, motion, code, and the details that make software feel finished.
          </p>
          <div className="hero-actions">
            <MagneticLink className="pill pill-dark" href="#work">
              See selected work <Arrow />
            </MagneticLink>
            <a className="quiet-link" href="/resume.pdf">
              Resume <Arrow diagonal />
            </a>
          </div>
        </motion.div>
      </motion.div>

      <motion.div className="hero-portrait-wrap" style={{ y: photoY }}>
        <motion.div
          className="hero-portrait"
          initial={{ opacity: 0, scale: 0.94, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.14, ease }}
          whileHover={{ borderRadius: '38% 62% 49% 51% / 54% 39% 61% 46%' }}
        >
          <Image
            src="/portrait-2026.webp"
            alt="Denzel Tinashe"
            fill
            priority
            sizes="(max-width: 900px) 88vw, 36vw"
            className="hero-photo"
          />
          <div className="portrait-sheen" aria-hidden="true" />
        </motion.div>
        <motion.div
          className="floating-chip chip-one"
          animate={{ y: [0, -10, 0], rotate: [-2, 1, -2] }}
          transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          Next.js · React
        </motion.div>
        <motion.div
          className="floating-chip chip-two"
          animate={{ y: [0, 12, 0], rotate: [2, -1, 2] }}
          transition={{ duration: 6.3, repeat: Infinity, ease: 'easeInOut' }}
        >
          Swift · iOS
        </motion.div>
      </motion.div>

      <div className="hero-rail" aria-hidden="true">
        <span>Product</span><i />
        <span>Design</span><i />
        <span>Code</span><i />
        <span>Launch</span>
      </div>
    </section>
  );
}

function SignalStrip() {
  return (
    <section className="signal-strip" aria-label="Core capabilities">
      <div>
        <span>01</span>
        <strong>One person, design through build</strong>
      </div>
      <div>
        <span>02</span>
        <strong>Web, iOS, and full-stack products</strong>
      </div>
      <div>
        <span>03</span>
        <strong>Open-source work on GitHub</strong>
      </div>
      <div>
        <span>04</span>
        <strong>Built for clarity, speed, and polish</strong>
      </div>
    </section>
  );
}

function MealVisual() {
  return (
    <div className="visual meal-visual" aria-hidden="true">
      <div className="meal-orbit orbit-a" />
      <div className="meal-orbit orbit-b" />
      <div className="device light-device">
        <div className="device-island" />
        <div className="meal-head"><b>MealRecap</b><span>Today</span></div>
        <div className="meal-score"><strong>1,722</strong><span>of 2,200 cal</span></div>
        <div className="macro-grid"><span><b>85g</b>Protein</span><span><b>137g</b>Carbs</span><span><b>77g</b>Fat</span></div>
        <div className="meal-entry"><div><b>Rice & chicken</b><small>Lunch · 12:44 PM</small></div><span>370</span></div>
        <div className="meal-prompt"><span>What did you eat?</span><b>✦</b></div>
      </div>
      <div className="visual-label">Natural language → structured nutrition</div>
    </div>
  );
}

function ScrollVisual() {
  return (
    <div className="visual scroll-visual" aria-hidden="true">
      <div className="halo-ring" />
      <div className="device dark-device">
        <div className="device-island" />
        <div className="scroll-head"><b>BeforeUScroll</b><span>12:41</span></div>
        <div className="flame-mark">✦</div>
        <strong className="time-left">42 min</strong>
        <span className="time-caption">intentional time remaining</span>
        <div className="verse-card">Set your affection on things above…<b>Colossians 3:2</b></div>
        <div className="unlock-row"><span>Pray</span><span>Read</span><span>Continue</span></div>
      </div>
    </div>
  );
}

function KdymVisual() {
  return (
    <div className="visual kdym-visual" aria-hidden="true">
      <div className="outpour-stack"><span>OUTPOUR</span><span>OUTPOUR</span><span>OUTPOUR</span><span>OUTPOUR</span></div>
      <div className="outpour-core"><small>2026 DISTRICT THEME</small><b>JOEL 2:28</b><p>I will pour out my spirit upon all flesh.</p></div>
    </div>
  );
}

function ProjectVisual({ project }) {
  if (project.visual === 'meal') return <MealVisual />;
  if (project.visual === 'scroll') return <ScrollVisual />;
  if (project.visual === 'kdym') return <KdymVisual />;

  return (
    <div className="visual screenshot-visual">
      <Image src={project.image} alt="" fill sizes="(max-width: 900px) 100vw, 48vw" className="project-screenshot" />
      <div className="screen-glass" aria-hidden="true" />
    </div>
  );
}

function ProjectCard({ project, index }) {
  return (
    <motion.a
      href={project.href}
      target="_blank"
      rel="noreferrer"
      className={`project-card project-${project.size}`}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, delay: Math.min(index * 0.06, 0.2), ease }}
      whileHover={{ y: -8 }}
    >
      <div className="project-visual-shell">
        <ProjectVisual project={project} />
        <motion.span className="project-arrow" whileHover={{ rotate: 45 }}>↗</motion.span>
      </div>
      <div className="project-meta">
        <div>
          <p>{project.kicker}</p>
          <h3>{project.name}</h3>
        </div>
        <span>{project.year}</span>
      </div>
      <p className="project-description">{project.description}</p>
      <div className="project-role">{project.role}</div>
    </motion.a>
  );
}

function Work() {
  return (
    <section className="work section" id="work">
      <div className="section-heading work-heading">
        <div>
          <p className="micro-label">Selected work</p>
          <h2>Products should feel<br />inevitable.</h2>
        </div>
        <p>
          Not a gallery of mockups. These are products, websites, and systems made for real people, real organizations, and real constraints.
        </p>
      </div>

      <div className="project-grid">
        {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="services section" id="services">
      <div className="section-heading service-heading">
        <div>
          <p className="micro-label">What I build</p>
          <h2>One partner.<br />Fewer handoffs.</h2>
        </div>
        <p>
          The strongest projects do not separate product thinking, visual design, and implementation too early. I can carry the core experience across all three.
        </p>
      </div>

      <div className="service-list">
        {services.map((service) => (
          <motion.article
            key={service.number}
            className="service-card"
            whileHover={{ borderRadius: '58px 22px 58px 22px' }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          >
            <span className="service-number">{service.number}</span>
            <h3>{service.title}</h3>
            <p>{service.summary}</p>
            <div>{service.detail}</div>
          </motion.article>
        ))}
      </div>

      <div className="stack-line" aria-label="Technology stack">
        <span>Next.js</span><i />
        <span>React</span><i />
        <span>Swift</span><i />
        <span>iOS</span><i />
        <span>Node</span><i />
        <span>Laravel</span><i />
        <span>Framer Motion</span><i />
        <span>Vercel</span>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    ['01', 'Define', 'What are we making, who is it for, and what must the first version prove?'],
    ['02', 'Design', 'Flows, hierarchy, interface language, prototypes, and the details that make the product understandable.'],
    ['03', 'Build', 'Production implementation with responsive behavior, motion, integrations, and sensible technical decisions.'],
    ['04', 'Polish + launch', 'Performance, edge cases, accessibility, final QA, and the last 10% that makes the work feel expensive.'],
  ];

  return (
    <section className="process section">
      <div className="process-title">
        <p className="micro-label">The operating model</p>
        <h2>Think clearly.<br />Make deliberately.<br />Ship.</h2>
      </div>
      <div className="process-steps">
        {steps.map(([number, title, body]) => (
          <article key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Archive() {
  return (
    <section className="archive section">
      <div className="archive-head">
        <div>
          <p className="micro-label">More proof</p>
          <h2>There’s more<br />under the hood.</h2>
        </div>
        <p>
          The homepage stays selective. The broader body of work—older products, experiments, backend code, and public repositories—lives on GitHub and in the archive below.
        </p>
      </div>
      <div className="archive-table">
        {archive.map(([name, type, href], index) => (
          <a href={href} target="_blank" rel="noreferrer" key={name}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{name}</strong>
            <em>{type}</em>
            <b>↗</b>
          </a>
        ))}
      </div>
      <MagneticLink href="https://github.com/sparkdeveloping" target="_blank" className="github-card">
        <div>
          <span className="micro-label">github.com/sparkdeveloping</span>
          <strong>Explore the code archive</strong>
          <p>40+ public repositories spanning Swift, JavaScript, full-stack web work, and experiments.</p>
        </div>
        <Arrow diagonal />
      </MagneticLink>
    </section>
  );
}

function About() {
  return (
    <section className="about section" id="about">
      <div className="about-main">
        <p className="micro-label">About</p>
        <h2>
          Design-minded developer.<br />Developer-minded designer.
        </h2>
        <div className="about-copy">
          <p className="about-lead">
            I care about the part clients actually feel: whether the product is clear, fast, useful, memorable, and finished.
          </p>
          <p>
            I work across product strategy, interface design, front-end engineering, iOS, and full-stack implementation. That range lets me protect the idea from the first conversation through the final interaction instead of letting it disappear between handoffs.
          </p>
          <p className="faith-note">Jesus above all. Excellence in the work because the work should be worth doing well.</p>
        </div>
      </div>

      <div className="practice-links">
        <a href="https://media.denzeltinashe.com" target="_blank" rel="noreferrer">
          <div><span>Separate practice</span><strong>Media</strong><p>Photo, video, creative direction, and production live here.</p></div>
          <Arrow diagonal />
        </a>
        <a href="https://ministry.denzeltinashe.com" target="_blank" rel="noreferrer">
          <div><span>Separate practice</span><strong>Ministry</strong><p>Ministry-specific work, resources, and service live here.</p></div>
          <Arrow diagonal />
        </a>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <footer className="contact" id="contact">
      <div className="contact-orb" aria-hidden="true" />
      <p className="micro-label">Have an app or website in mind?</p>
      <h2>
        Let’s make it<br /><span>feel finished.</span>
      </h2>
      <MagneticLink
        className="contact-email"
        href="mailto:denzelnyatsanza@gmail.com?subject=New%20project%20inquiry%20—%20Denzel%20Tinashe"
      >
        denzelnyatsanza@gmail.com <Arrow diagonal />
      </MagneticLink>
      <div className="footer-meta">
        <span>© {new Date().getFullYear()} Denzel Tinashe</span>
        <div>
          <a href="https://www.linkedin.com/in/denzelnyatsanza/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com/sparkdeveloping" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://instagram.com/denzeltinashe" target="_blank" rel="noreferrer">Instagram</a>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <main>
        <ScrollProgress />
        <CursorGlow />
        <Header />
        <Hero />
        <SignalStrip />
        <Work />
        <Services />
        <Process />
        <Archive />
        <About />
        <Contact />
      </main>
    </MotionConfig>
  );
}
