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
import { useEffect, useMemo, useRef, useState } from 'react';

const ease = [0.22, 1, 0.36, 1];

const practices = [
  {
    number: '01',
    id: 'ministry',
    label: 'Ministry',
    title: 'Digital spaces that carry the message without diluting it.',
    body: 'Websites, Christian products, podcast systems, campaign visuals, and event experiences built to help ministries communicate clearly and move people toward action.',
    proof: ['BeforeUScroll', 'KDYM', 'FPC Wichita', 'Jesus Revealed'],
    accent: 'lime',
  },
  {
    number: '02',
    id: 'media',
    label: 'Media',
    title: 'Visual systems with energy, consistency, and purpose.',
    body: 'Creative direction, identity systems, motion, editing, campaign rollouts, and repeatable media workflows designed for real ministry calendars and real deadlines.',
    proof: ['Campaign systems', 'Motion + editing', 'Event creative', 'Social delivery'],
    accent: 'violet',
  },
  {
    number: '03',
    id: 'products',
    label: 'Web / Mobile Apps',
    title: 'Useful products, shaped into memorable experiences.',
    body: 'Product strategy, interface design, Next.js builds, iOS development, full-stack implementation, and polished launches from first idea to shipped experience.',
    proof: ['MealRecap', 'BeforeUScroll', 'Aftershock', 'Hacia'],
    accent: 'coral',
  },
];

const projects = [
  {
    id: 'mealrecap',
    name: 'MealRecap',
    year: '2026',
    type: 'Mobile product / AI nutrition',
    description: 'An AI-first food logger that turns natural language, voice, and meal photos into a calm daily nutrition recap.',
    href: 'https://mealrecap.vercel.app',
    tags: ['products'],
    art: 'meal',
    featured: true,
  },
  {
    id: 'beforeuscroll',
    name: 'BeforeUScroll',
    year: '2026',
    type: 'Christian iOS product',
    description: 'A Scripture-and-prayer app blocker that turns attention into an intentional spiritual rhythm before distracting apps open.',
    href: 'https://beforeuscroll.vercel.app',
    tags: ['ministry', 'products'],
    art: 'flame',
    featured: true,
  },
  {
    id: 'kdym',
    name: 'KDYM',
    year: '2024–2026',
    type: 'Ministry website / media system',
    description: 'A digital home for Kansas District Youth Ministries spanning events, registration, media, merch, and the 2026 Outpour identity.',
    href: 'https://www.kdym.org',
    tags: ['ministry', 'media', 'products'],
    art: 'outpour',
    featured: true,
  },
  {
    id: 'fpcwichita',
    name: 'FPC Wichita',
    year: '2024–2026',
    type: 'Church media / creative direction',
    description: 'Brand-consistent visuals, event media, livestream support, and digital communication for a growing local church.',
    href: 'https://www.fpcwichita.org',
    tags: ['ministry', 'media'],
    image: '/work/fpc-1.webp',
  },
  {
    id: 'jesusrevealed',
    name: 'Jesus Revealed Podcast',
    year: 'Ongoing',
    type: 'Podcast / production / editing',
    description: 'A ministry media platform hosted, produced, and edited to make conversations about Jesus clear, thoughtful, and accessible across channels.',
    href: 'https://www.youtube.com/@jesusrevealedpodcast',
    tags: ['ministry', 'media'],
    art: 'podcast',
  },
  {
    id: 'aftershock',
    name: 'Aftershock Ministries',
    year: '2024–2025',
    type: 'Ministry website / UX',
    description: 'A responsive ministry website focused on clear messaging, trust, discoverability, and a direct path to connection.',
    href: 'https://www.aftershockministries.com',
    tags: ['ministry', 'products'],
    image: '/work/aftershock-1.webp',
  },
  {
    id: 'gocreate',
    name: 'GoCreate / Wichita State ITS',
    year: '2024–2025',
    type: 'Systems / digital operations',
    description: 'Digitized workflows and supported operational systems used in a live university-affiliated innovation environment.',
    href: 'https://gocreate.com',
    tags: ['products'],
    image: '/work/gocreate-1.webp',
  },
  {
    id: 'hacia',
    name: 'Hacia',
    year: '2024–2025',
    type: 'Website / UI delivery',
    description: 'A modern, responsive web presence shaped around hierarchy, clarity, and a premium visual finish.',
    href: 'https://hacia.co.zw',
    tags: ['products'],
    image: '/work/hacia-1.webp',
  },
  {
    id: 'poscloud',
    name: 'PosCloud',
    year: '2022',
    type: 'Laravel / React full stack',
    description: 'Practical product functionality delivered across PHP/Laravel backend systems and React interfaces.',
    href: 'https://github.com/sparkdeveloping',
    tags: ['products'],
    art: 'code',
  },
];

const capabilities = [
  'Creative direction',
  'Ministry websites',
  'Mobile product design',
  'Next.js + React',
  'Swift / iOS',
  'Motion + editing',
  'Identity systems',
  'Full-stack delivery',
  'SEO + performance',
  'Launch strategy',
];

function Arrow({ diagonal = false }) {
  return <span aria-hidden>{diagonal ? '↗' : '→'}</span>;
}

function LogoMark() {
  return (
    <a className="logo-mark" href="#top" aria-label="Denzel Tinashe, back to top">
      <span>DT</span>
      <i />
    </a>
  );
}

function MagneticLink({ href, children, className = '', target, onClick }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.35 });

  const move = (event) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.15);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.15);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      target={target}
      rel={target === '_blank' ? 'noreferrer' : undefined}
      onClick={onClick}
      onPointerMove={move}
      onPointerLeave={reset}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

function CursorAura() {
  const reduced = useReducedMotion();
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 120, damping: 22, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 120, damping: 22, mass: 0.3 });

  useEffect(() => {
    if (reduced) return;
    const move = (event) => {
      x.set(event.clientX - 180);
      y.set(event.clientY - 180);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [reduced, x, y]);

  if (reduced) return null;
  return <motion.div className="cursor-aura" style={{ x: springX, y: springY }} aria-hidden />;
}

function AmbientCanvas() {
  const { scrollYProgress } = useScroll();
  const yA = useTransform(scrollYProgress, [0, 1], ['0%', '48%']);
  const yB = useTransform(scrollYProgress, [0, 1], ['0%', '-34%']);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 55]);

  return (
    <div className="ambient-canvas" aria-hidden>
      <motion.div className="ambient-orb ambient-orb-a" style={{ y: yA, rotate }} />
      <motion.div className="ambient-orb ambient-orb-b" style={{ y: yB }} />
      <div className="ambient-grid" />
      <div className="noise" />
    </div>
  );
}

function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-nav">
      <LogoMark />
      <nav className="desktop-links" aria-label="Main navigation">
        <a href="#practice">Practice</a>
        <a href="#work">Work</a>
        <a href="#about">About</a>
      </nav>
      <MagneticLink className="nav-contact" href="mailto:denzelnyatsanza@gmail.com?subject=Project%20Inquiry">
        Start a project <Arrow diagonal />
      </MagneticLink>
      <button
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-label="Toggle menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>
      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-menu"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.3, ease }}
          >
            {['practice', 'work', 'about', 'contact'].map((item) => (
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

function HeroWord({ children, className = '' }) {
  return (
    <motion.span
      className={`hero-word ${className}`}
      whileHover={{ scaleX: 1.035, scaleY: 0.94, y: 3 }}
      transition={{ type: 'spring', stiffness: 260, damping: 14 }}
    >
      {children}
    </motion.span>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 125]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 58]);
  const opacity = useTransform(scrollYProgress, [0, 0.82], [1, 0.25]);

  return (
    <section className="hero" id="top" ref={ref}>
      <motion.div className="hero-copy" style={{ y: textY, opacity }}>
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          Denzel Tinashe — designer, developer, creative director
        </motion.p>
        <h1>
          <span className="hero-line"><HeroWord>Ministry.</HeroWord></span>
          <span className="hero-line hero-line-shift"><HeroWord className="outline-word">Media.</HeroWord></span>
          <span className="hero-line"><HeroWord>Web + mobile.</HeroWord></span>
        </h1>
        <motion.div
          className="hero-lower"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          <p>
            I build digital work that serves people, carries conviction, and feels impossible to ignore.
          </p>
          <div className="hero-actions">
            <MagneticLink href="#work" className="blob-button blob-button-light">
              Explore the work <Arrow />
            </MagneticLink>
            <a className="text-link" href="/resume.pdf">Resume <Arrow diagonal /></a>
          </div>
        </motion.div>
      </motion.div>

      <motion.div className="portrait-stage" style={{ y: imageY }}>
        <div className="portrait-blob">
          <div className="portrait-glow" />
          <Image
            src="/denzel.webp"
            alt="Denzel Tinashe"
            fill
            priority
            sizes="(max-width: 900px) 70vw, 36vw"
            className="portrait-image"
          />
        </div>
        <motion.div
          className="orbit-label orbit-label-one"
          animate={{ y: [0, -10, 0], rotate: [-4, 2, -4] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Jesus above all
        </motion.div>
        <motion.div
          className="orbit-label orbit-label-two"
          animate={{ y: [0, 12, 0], rotate: [4, -2, 4] }}
          transition={{ duration: 6.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          Wichita, Kansas · available worldwide
        </motion.div>
      </motion.div>

      <div className="hero-index" aria-hidden>
        <span>Scroll to enter</span>
        <i />
      </div>
    </section>
  );
}

function Marquee() {
  const content = 'MINISTRY  ✦  MEDIA  ✦  MOBILE APPS  ✦  WEB EXPERIENCES  ✦  CREATIVE DIRECTION  ✦  MOTION  ✦  ';
  return (
    <div className="marquee" aria-label="Selected capabilities">
      <motion.div
        className="marquee-track"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      >
        <span>{content}</span>
        <span>{content}</span>
      </motion.div>
    </div>
  );
}

function PracticeCard({ item, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [35, -35]);

  return (
    <motion.article
      ref={ref}
      className={`practice-card accent-${item.accent}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, delay: index * 0.08, ease }}
      whileHover={{ borderRadius: '82px 34px 82px 34px', scale: 1.008 }}
    >
      <div className="practice-topline">
        <span>{item.number}</span>
        <span>{item.label}</span>
      </div>
      <motion.div className="practice-symbol" style={{ y }} aria-hidden>
        {item.number}
      </motion.div>
      <div className="practice-copy">
        <h3>{item.title}</h3>
        <p>{item.body}</p>
      </div>
      <div className="practice-proof">
        {item.proof.map((proof) => <span key={proof}>{proof}</span>)}
      </div>
    </motion.article>
  );
}

function ProjectArtwork({ project }) {
  if (project.image) {
    return (
      <div className="project-image-wrap">
        <Image src={project.image} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" className="project-image" />
      </div>
    );
  }

  if (project.art === 'meal') {
    return (
      <div className="art art-meal" aria-hidden>
        <div className="meal-orbit meal-orbit-one" />
        <div className="meal-orbit meal-orbit-two" />
        <div className="phone phone-light">
          <div className="phone-bar"><b>MEAL RECAP</b><span>•••</span></div>
          <div className="meal-date">TODAY · JUN 12</div>
          <strong>1,722</strong>
          <small>of 2,200 calories</small>
          <div className="macro-row"><span>85 P</span><span>137 C</span><span>77 F</span></div>
          <div className="meal-card"><b>Rice and chicken</b><span>370 cal</span></div>
          <div className="meal-input">What did you eat? <i>✦</i></div>
        </div>
        <span className="art-caption">AI food logging without the busywork.</span>
      </div>
    );
  }

  if (project.art === 'flame') {
    return (
      <div className="art art-flame" aria-hidden>
        <div className="scripture-ring" />
        <div className="phone phone-dark">
          <div className="phone-bar"><b>BeforeUScroll</b><span>12:41</span></div>
          <div className="flame-shape"><span>✦</span></div>
          <strong>42 min</strong>
          <small>intentional time remaining</small>
          <div className="scripture-card">“Set your affection on things above...”<b>Colossians 3:2</b></div>
        </div>
        <span className="art-caption">Scripture before the scroll.</span>
      </div>
    );
  }

  if (project.art === 'podcast') {
    return (
      <div className="art art-podcast" aria-hidden>
        <div className="podcast-disc"><span>JR</span></div>
        <div className="podcast-wave">
          {Array.from({ length: 28 }, (_, index) => <i key={index} />)}
        </div>
        <div className="podcast-copy">
          <small>JESUS REVEALED</small>
          <b>Listen.<br />Remember.<br />Respond.</b>
        </div>
      </div>
    );
  }

  if (project.art === 'outpour') {
    return (
      <div className="art art-outpour" aria-hidden>
        <div className="outpour-lines">
          <span>OUTPOUR</span><span>OUTPOUR</span><span>OUTPOUR</span><span>OUTPOUR</span>
        </div>
        <div className="outpour-center">
          <small>2026 DISTRICT THEME</small>
          <b>JOEL 2:28</b>
          <p>I will pour out my spirit upon all flesh.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="art art-code" aria-hidden>
      <div className="code-window">
        <span className="window-dots">● ● ●</span>
        <pre>{`const build = async () => {\n  servePeople();\n  shipWithExcellence();\n  return impact;\n};`}</pre>
      </div>
      <div className="code-bubble">Laravel × React</div>
    </div>
  );
}

function ProjectCard({ project, index }) {
  return (
    <motion.a
      layout
      href={project.href}
      target="_blank"
      rel="noreferrer"
      className={`project-card project-${project.id} ${project.featured ? 'project-featured' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.2), ease }}
      whileHover={{ y: -8 }}
    >
      <div className="project-art-shell">
        <ProjectArtwork project={project} />
        <div className="project-open">↗</div>
      </div>
      <div className="project-meta">
        <div>
          <p>{project.type}</p>
          <h3>{project.name}</h3>
        </div>
        <span>{project.year}</span>
      </div>
      <p className="project-description">{project.description}</p>
    </motion.a>
  );
}

function WorkSection() {
  const [filter, setFilter] = useState('all');
  const filtered = useMemo(
    () => (filter === 'all' ? projects : projects.filter((project) => project.tags.includes(filter))),
    [filter]
  );

  return (
    <section className="work-section section-shell" id="work">
      <div className="section-heading">
        <p className="eyebrow">Selected work · built and shipped</p>
        <h2>Proof, not promises.</h2>
        <p className="section-intro">
          Products, ministry platforms, media systems, and operational tools—each built around a real audience and a real outcome.
        </p>
      </div>
      <div className="filters" role="group" aria-label="Filter projects">
        {[
          ['all', 'All work'],
          ['ministry', 'Ministry'],
          ['media', 'Media'],
          ['products', 'Web / mobile'],
        ].map(([value, label]) => (
          <button
            type="button"
            key={value}
            className={filter === value ? 'active' : ''}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <motion.div layout className="project-grid">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, index) => (
            <ProjectCard project={project} index={index} key={project.id} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="about-section section-shell" id="about">
      <div className="about-grid">
        <div className="about-sticky">
          <p className="eyebrow">How I work</p>
          <h2>Faith first. Then disciplined excellence.</h2>
          <MagneticLink
            href="mailto:denzelnyatsanza@gmail.com?subject=Project%20Inquiry"
            className="blob-button blob-button-dark"
          >
            Build with me <Arrow />
          </MagneticLink>
        </div>
        <div className="about-copy">
          <p className="about-lead">
            I am an ambassador of Christ, a designer, a developer, and a creative technologist. I care about the message, the people receiving it, and the quality of the system carrying it.
          </p>
          <p>
            My strongest work happens where ministry, communication, and technology overlap: a mobile product that protects attention, a youth ministry platform that feels alive, a church media system that stays consistent, or a product experience that makes a complex task feel simple.
          </p>
          <div className="capability-cloud">
            {capabilities.map((capability, index) => (
              <motion.span
                key={capability}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.035, type: 'spring', stiffness: 220, damping: 18 }}
                whileHover={{ scale: 1.08, rotate: index % 2 ? 2 : -2 }}
              >
                {capability}
              </motion.span>
            ))}
          </div>
          <div className="principles">
            <article><span>01</span><h3>Clarity before decoration</h3><p>The experience must explain itself, even when the visual language is unusual.</p></article>
            <article><span>02</span><h3>Motion with purpose</h3><p>Every animation should guide attention, reveal structure, or make interaction feel more human.</p></article>
            <article><span>03</span><h3>Systems over one-offs</h3><p>Designs are built to survive campaigns, content changes, and the next person who needs to use them.</p></article>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <footer className="contact-section" id="contact">
      <div className="contact-orb" aria-hidden />
      <p className="eyebrow">Have a ministry, media, web, or app project?</p>
      <h2>Let’s make it<br /><span>impossible to ignore.</span></h2>
      <MagneticLink
        href="mailto:denzelnyatsanza@gmail.com?subject=Project%20Inquiry%20—%20Denzel%20Tinashe"
        className="contact-email"
      >
        denzelnyatsanza@gmail.com <Arrow diagonal />
      </MagneticLink>
      <div className="footer-row">
        <span>© {new Date().getFullYear()} Denzel Tinashe</span>
        <div>
          <a href="https://instagram.com/denzeltinashe" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://www.linkedin.com/in/denzelnyatsanza/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com/sparkdeveloping" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.youtube.com/@jesusrevealedpodcast" target="_blank" rel="noreferrer">Podcast</a>
        </div>
      </div>
    </footer>
  );
}

export default function Page() {
  return (
    <MotionConfig reducedMotion="user">
      <main>
        <AmbientCanvas />
        <CursorAura />
        <Navigation />
        <Hero />
        <Marquee />
        <section className="practice-section section-shell" id="practice">
          <div className="section-heading practice-heading">
            <p className="eyebrow">Three focused practices</p>
            <h2>One standard of excellence.</h2>
          </div>
          <div className="practice-stack">
            {practices.map((item, index) => <PracticeCard item={item} index={index} key={item.id} />)}
          </div>
        </section>
        <WorkSection />
        <AboutSection />
        <ContactSection />
      </main>
    </MotionConfig>
  );
}
