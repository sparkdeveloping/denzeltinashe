'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

/** -----------------------------
 *  Motion presets
 *  ----------------------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.65, ease: EASE } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
};

/** -----------------------------
 *  Hooks
 *  ----------------------------- */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(!!mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return reduced;
}

function useIsTouchDevice() {
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch =
      'ontouchstart' in window ||
      (navigator?.maxTouchPoints ?? 0) > 0 ||
      (navigator?.msMaxTouchPoints ?? 0) > 0;
    setTouch(!!isTouch);
  }, []);
  return touch;
}

/** -----------------------------
 *  Background: bokeh + subtle grain
 *  ----------------------------- */
function BokehBackground() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 2000], [0, 120]);
  const y2 = useTransform(scrollY, [0, 2000], [0, -90]);
  const y3 = useTransform(scrollY, [0, 2000], [0, 70]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#fafafa]" />
      <div className="absolute inset-0 opacity-[0.035] mix-blend-multiply [background-image:radial-gradient(rgba(0,0,0,0.35)_1px,transparent_1px)] [background-size:18px_18px]" />

      <motion.div style={{ y: y1 }} className="absolute -left-24 top-28 h-72 w-72 rounded-full bg-black/[0.06] blur-3xl" />
      <motion.div style={{ y: y2 }} className="absolute right-[-110px] top-10 h-80 w-80 rounded-full bg-black/[0.05] blur-3xl" />
      <motion.div style={{ y: y3 }} className="absolute left-[35%] top-[55%] h-96 w-96 rounded-full bg-black/[0.04] blur-3xl" />
      <div className="absolute left-[12%] top-[78%] h-64 w-64 rounded-full bg-black/[0.035] blur-3xl" />
      <div className="absolute right-[18%] top-[72%] h-56 w-56 rounded-full bg-black/[0.03] blur-3xl" />
    </div>
  );
}

/** -----------------------------
 *  UI atoms
 *  ----------------------------- */
function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs font-medium text-black/70 backdrop-blur">
      {children}
    </span>
  );
}

function GlassButton({ children, onClick, href, primary = false, className, ...rest }) {
  const base = primary
    ? 'bg-black text-white hover:bg-black/90'
    : 'border border-black/10 bg-white/70 text-black/80 backdrop-blur hover:bg-white';
  if (href) {
    return (
      <a
        href={href}
        className={cx('inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition', base, className)}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx('inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition', base, className)}
      {...rest}
    >
      {children}
    </button>
  );
}

/** -----------------------------
 *  Modal
 *  ----------------------------- */
function Modal({ open, onClose, item }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) setTimeout(() => panelRef.current?.focus(), 0);
  }, [open]);

  if (!open || !item) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[80] flex items-end justify-center px-4 py-6 sm:items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        aria-modal="true"
        role="dialog"
      >
        <button
          type="button"
          aria-label="Close modal"
          onClick={onClose}
          className="absolute inset-0 cursor-default bg-black/30 backdrop-blur-[6px]"
        />
        <motion.div
          ref={panelRef}
          tabIndex={-1}
          initial={{ y: 16, opacity: 0, scale: 0.985 }}
          animate={{ y: 0, opacity: 1, scale: 1, transition: { duration: 0.35, ease: EASE } }}
          exit={{ y: 10, opacity: 0, transition: { duration: 0.2, ease: EASE } }}
          className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/30 bg-white/70 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <Pill>{item.year}</Pill>
              <Pill>{item.category}</Pill>
              <Pill>{item.org}</Pill>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-medium text-black/70 backdrop-blur hover:bg-white"
            >
              Close
            </button>
          </div>

          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image src={item.cover} alt={`${item.title} cover`} fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/10" />
          </div>

          <div className="p-5 sm:p-7">
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-black sm:text-2xl">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-black/70 sm:text-base">{item.detail}</p>

            {!!item.impact?.length && (
              <div className="mt-6">
                <p className="mb-3 text-xs font-medium tracking-[0.18em] text-black/60">IMPACT</p>
                <ul className="grid gap-2 text-sm leading-6 text-black/70 sm:grid-cols-2">
                  {item.impact.map((x) => (
                    <li key={x} className="flex gap-2">
                      <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-black/30" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!!item.stack?.length && (
              <div className="mt-6">
                <p className="mb-3 text-xs font-medium tracking-[0.18em] text-black/60">STACK</p>
                <div className="flex flex-wrap gap-2">
                  {item.stack.map((s) => (
                    <Pill key={s}>{s}</Pill>
                  ))}
                </div>
              </div>
            )}

            {!!item.links?.length && (
              <div className="mt-7 flex flex-wrap gap-2">
                {item.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium text-black/80 backdrop-blur hover:bg-white"
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/** -----------------------------
 *  Work card
 *  ----------------------------- */
function WorkCard({ item, onOpen }) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(item)}
      initial={{ y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.25, ease: EASE } }}
      className={cx(
        'group relative flex w-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white/60 text-left backdrop-blur',
        'focus:outline-none focus:ring-2 focus:ring-black/20'
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={item.cover}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={item.priority}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/10" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Pill>{item.year}</Pill>
          <Pill>{item.category}</Pill>
        </div>
        <div>
          <h3 className="text-base font-semibold tracking-[-0.02em] text-black sm:text-lg">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-black/70">
            {item.summary}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs font-medium text-black/60">Open</span>
          <span className="text-xs font-medium text-black/60">↗</span>
        </div>
      </div>
    </motion.button>
  );
}

/** -----------------------------
 *  Right Rail (self-teaching)
 *  - Auto expands labels on load
 *  - If no interaction: nudges + expands again
 *  - Hover/focus expands; leaves collapses
 *  ----------------------------- */
function RightRail({ sections, activeId, onJump, modalOpen }) {
  const railRef = useRef(null);

  const [expanded, setExpanded] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [nudgeKey, setNudgeKey] = useState(0);

  // Magnetic micro-movement
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const x = useSpring(mvX, { stiffness: 260, damping: 22, mass: 0.2 });
  const y = useSpring(mvY, { stiffness: 260, damping: 22, mass: 0.2 });

  const onMove = (e) => {
    const el = railRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    mvX.set(Math.max(-10, Math.min(10, dx * 0.05)));
    mvY.set(Math.max(-10, Math.min(10, dy * 0.05)));
  };

  const onLeave = () => {
    mvX.set(0);
    mvY.set(0);
    if (hasInteracted) setExpanded(false);
  };

  // Teach on load: show labels briefly, then collapse
  useEffect(() => {
    const t = setTimeout(() => setExpanded(false), 2600);
    return () => clearTimeout(t);
  }, []);

  // If the user hasn't interacted with the rail, periodically nudge + expand
  useEffect(() => {
    if (hasInteracted || modalOpen) return;
    const interval = setInterval(() => {
      setExpanded(true);
      setNudgeKey((k) => k + 1);
      // collapse again
      setTimeout(() => setExpanded(false), 2200);
    }, 8500);
    return () => clearInterval(interval);
  }, [hasInteracted, modalOpen]);

  const markInteract = () => setHasInteracted(true);

  return (
    <motion.aside
      ref={railRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={() => {
        markInteract();
        setExpanded(true);
      }}
      style={{ x, y }}
      className="fixed right-4 top-1/2 z-[60] hidden -translate-y-1/2 sm:block"
      aria-label="Section navigation"
    >
      <motion.div
        key={nudgeKey}
        initial={{ x: 0 }}
        animate={!hasInteracted && !modalOpen ? { x: [0, -5, 5, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.65, ease: EASE }}
        className="rounded-2xl border border-black/10 bg-white/55 px-2 py-2 backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,0.05)]"
      >
        <div className="flex flex-col gap-1.5">
          {sections.map((s) => {
            const isActive = s.id === activeId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  markInteract();
                  setExpanded(false);
                  onJump(s.id);
                }}
                onFocus={() => {
                  markInteract();
                  setExpanded(true);
                }}
                className={cx(
                  'group relative flex items-center gap-3 rounded-xl px-2 py-2 transition',
                  'focus:outline-none focus:ring-2 focus:ring-black/20',
                  isActive ? 'bg-black/[0.04]' : 'hover:bg-black/[0.03]'
                )}
                aria-label={`Go to ${s.label}`}
              >
                <span
                  className={cx(
                    'h-2.5 w-2.5 rounded-full transition-all duration-300',
                    isActive ? 'bg-black/70 scale-110' : 'bg-black/20 group-hover:bg-black/35'
                  )}
                />
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -6, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -6, filter: 'blur(6px)' }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="whitespace-nowrap text-xs font-medium text-black/70"
                    >
                      {s.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.aside>
  );
}

/** -----------------------------
 *  Mobile chapter bar
 *  - Replaces right rail on small screens
 *  ----------------------------- */
function MobileChapters({ sections, activeId, onJump }) {
  return (
    <div className="fixed bottom-4 left-1/2 z-[60] w-[min(92vw,520px)] -translate-x-1/2 sm:hidden">
      <div className="rounded-2xl border border-black/10 bg-white/60 px-3 py-2 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-black/70">{sections.find((s) => s.id === activeId)?.label ?? 'Chapter'}</span>
          <div className="flex items-center gap-1.5">
            {sections.map((s) => {
              const isActive = s.id === activeId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onJump(s.id)}
                  className="p-1"
                  aria-label={`Go to ${s.label}`}
                >
                  <span className={cx('block h-2 w-2 rounded-full transition', isActive ? 'bg-black/70' : 'bg-black/20')} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/** -----------------------------
 *  Floating Action Dock (replaces header)
 *  - Resume / Work / Email
 *  ----------------------------- */
function ActionDock({ onWork, onEmail }) {
  return (
    <div className="fixed left-4 top-4 z-[60] sm:left-6 sm:top-6">
      <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white/60 p-2 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
        <a
          href="/resume.pdf"
          className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm font-semibold text-black/80 hover:bg-white"
        >
          Resume ↗
        </a>
        <button
          type="button"
          onClick={onWork}
          className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm font-semibold text-black/80 hover:bg-white"
        >
          Work
        </button>
        <button
          type="button"
          onClick={onEmail}
          className="rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-black/90"
        >
          Email
        </button>
      </div>
    </div>
  );
}

/** -----------------------------
 *  Fullscreen Section wrapper
 *  ----------------------------- */
function PageSection({ id, children, className }) {
  return (
    <section
      id={id}
      className={cx('snap-start min-h-[100svh] flex items-center pt-24 pb-14', className)}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}

/** -----------------------------
 *  Main Page
 *  ----------------------------- */
export default function Page() {
  const prefersReduced = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();

  const sections = useMemo(
    () => [
      { id: 'intro', label: 'Intro' },
      { id: 'work', label: 'Work' },
      { id: 'flagship', label: 'Flagship' },
      { id: 'capabilities', label: 'Capabilities' },
      { id: 'podcast', label: 'Podcast' },
      { id: 'about', label: 'About' },
      { id: 'contact', label: 'Contact' },
    ],
    []
  );

  const workItems = useMemo(
    () => [
      {
        id: 'gocreate',
        title: 'GoCreate / Wichita State ITS — Systems at Scale',
        org: 'GoCreate • Wichita State University',
        year: '2024–2025',
        category: 'Systems • Infrastructure',
        cover: '/work/gocreate-1.png',
        priority: true,
        summary:
          'Digitized workflows, supported infrastructure initiatives, and contributed to operational integrations for a university-affiliated innovation space.',
        detail:
          'I worked across infrastructure, operations, and delivery—modernizing workflows and supporting systems used daily in a live environment. The focus was reliability, maintainability, and execution under real constraints.',
        impact: [
          'Converted legacy workflows into centralized digital processes',
          'Supported membership/equipment operational integrations',
          'Improved reliability through infrastructure support and upkeep',
          'Reduced onboarding friction via clearer access and process flow',
          'Delivered web/media updates with performance and SEO discipline',
          'Operated cross-functionally across IT, operations, and users',
        ],
        stack: ['IT Ops', 'Systems Integration', 'Documentation', 'Web', 'Media', 'SEO'],
        links: [
          { label: 'GoCreate', href: 'https://gocreate.com/' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/in/denzelnyatsanza/' },
        ],
      },
      {
        id: 'kdym',
        title: 'KDYM — Branding & Media Systems',
        org: 'Kansas District Youth Ministry',
        year: '2024–2025',
        category: 'Brand • Media',
        cover: '/work/kdym-1.png',
        summary:
          'Brand-consistent creative delivery designed for clarity, repeatability, and marketing-aligned output across channels.',
        detail:
          'I built and delivered a repeatable visual system for fast content production while keeping messaging clean and immediately understood.',
        impact: [
          'Created repeatable creative patterns for fast turnaround',
          'Improved brand clarity and consistency across campaigns',
          'Optimized assets for platform-specific engagement',
          'Supported outreach through disciplined visual delivery',
        ],
        stack: ['Branding', 'Editing', 'Motion', 'Creative Ops'],
        links: [{ label: 'KDYM', href: 'https://kansasupci.org/programs/youth-ministry' }],
      },
      {
        id: 'aftershock',
        title: 'Aftershock Ministries — Website & UX',
        org: 'Aftershock Ministries',
        year: '2024–2025',
        category: 'Web • UX',
        cover: '/work/aftershock-1.png',
        summary: 'A clean web presence built for speed, clarity, and discoverability—structured for trust and conversion.',
        detail:
          'I delivered a modern site experience emphasizing readability, performance, and a clear information hierarchy.',
        impact: ['Improved content structure for scanning and clarity', 'SEO-aware implementation', 'Mobile-first UX and performance discipline'],
        stack: ['Next.js/React', 'SEO', 'Performance', 'UI Systems'],
        links: [{ label: 'Website', href: 'https://www.aftershockministries.com/' }],
      },
      {
        id: 'fpc',
        title: 'FPC Wichita — Creative Direction & Branding',
        org: 'FPC Wichita',
        year: '2024–2025',
        category: 'Media • Brand',
        cover: '/work/fpc-1.png',
        summary: 'Brand-consistent visuals and media deliverables supporting events, messaging, and communication.',
        detail:
          'I produced creative assets with a system-first approach—consistent output under real timelines without losing clarity.',
        impact: ['Strengthened consistency across outputs', 'Delivered event visuals under tight turnaround', 'Improved recognizability through disciplined execution'],
        stack: ['Branding', 'Motion', 'Editing'],
        links: [{ label: 'FPC Wichita', href: 'https://fpcwichita.org/' }],
      },
      {
        id: 'hacia',
        title: 'Hacia — Website Delivery',
        org: 'Hacia',
        year: '2024–2025',
        category: 'Web • UI',
        cover: '/work/hacia-1.png',
        summary: 'A modern web build emphasizing clean structure, responsiveness, and a premium visual finish.',
        detail:
          'I delivered a structured site designed to communicate value quickly—responsive layout, clean UI, and maintainable structure.',
        impact: ['Clear hierarchy and layout discipline', 'Responsive implementation', 'Polished details and micro-interactions'],
        stack: ['React/Next', 'UI', 'Performance'],
        links: [{ label: 'Website', href: 'https://hacia.co.zw/' }],
      },
      {
        id: 'poscloud',
        title: 'PosCloud — Full-Stack Delivery',
        org: 'PosCloud',
        year: '2022',
        category: 'Backend • Frontend',
        cover: '/work/poscloud-1.png',
        summary: 'Backend work in PHP/Laravel with frontend delivery in React—built for practical product functionality.',
        detail:
          'I contributed across backend and frontend surfaces, applying OOP principles to produce maintainable, reliable implementation.',
        impact: ['Delivered backend functionality in Laravel', 'Built frontend interfaces with React', 'Applied OOP patterns for maintainability'],
        stack: ['PHP', 'Laravel', 'React', 'OOP'],
        links: [],
      },
    ],
    []
  );

  const [activeSection, setActiveSection] = useState('intro');

  // Track active section by intersection
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (visible?.target?.id) setActiveSection(visible.target.id);
      },
      { threshold: [0.45, 0.6, 0.75] }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sections]);

  const jumpTo = useCallback((id) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Modal (work)
  const [modalOpen, setModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const onOpen = (item) => {
    setActiveItem(item);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const onClose = () => {
    setModalOpen(false);
    setActiveItem(null);
    document.body.style.overflow = '';
  };

  // Top progress bar
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 });
  const progressWidth = useTransform(progress, (v) => `${Math.max(0.02, v) * 100}%`);

  /** -----------------------------
   *  Desktop pagination scroll (one wheel = one section)
   *  - Disabled for touch + reduced motion + modal
   *  ----------------------------- */
  const wheelLockRef = useRef(false);
  const lastWheelAtRef = useRef(0);

  useEffect(() => {
    if (prefersReduced || isTouch || modalOpen) return;

    const handler = (e) => {
      // Don’t hijack if user is interacting with a horizontal scroller (Work carousel)
      const path = e.composedPath?.() ?? [];
      const inAllow = path.some((node) => node?.dataset?.allowWheel === 'true');
      if (inAllow) return;

      // Ignore small deltas (trackpad micro)
      const dy = e.deltaY;
      if (Math.abs(dy) < 18) return;

      // Throttle / lock
      const now = Date.now();
      if (wheelLockRef.current && now - lastWheelAtRef.current < 700) {
        e.preventDefault();
        return;
      }

      wheelLockRef.current = true;
      lastWheelAtRef.current = now;

      const idx = sections.findIndex((s) => s.id === activeSection);
      if (idx < 0) return;

      const dir = dy > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(sections.length - 1, idx + dir));
      if (next !== idx) {
        e.preventDefault();
        jumpTo(sections[next].id);
      }

      // unlock shortly after
      setTimeout(() => {
        wheelLockRef.current = false;
      }, 520);
    };

    window.addEventListener('wheel', handler, { passive: false });
    return () => window.removeEventListener('wheel', handler);
  }, [prefersReduced, isTouch, modalOpen, activeSection, sections, jumpTo]);

  /** -----------------------------
   *  Work carousel: wheel -> horizontal scroll
   *  ----------------------------- */
  const workRailRef = useRef(null);
  useEffect(() => {
    const el = workRailRef.current;
    if (!el) return;

    const onWheel = (e) => {
      // On desktop, convert vertical wheel into horizontal motion
      if (Math.abs(e.deltaY) < 2) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY * 1.2;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div className="min-h-screen text-black">
      <BokehBackground />

      {/* progress */}
      <div className="fixed left-0 top-0 z-[70] h-[2px] w-full bg-black/5">
        <motion.div className="h-full bg-black/40" style={{ width: progressWidth }} />
      </div>

      {/* action dock (replaces header) */}
      <ActionDock onWork={() => jumpTo('work')} onEmail={() => jumpTo('contact')} />

      {/* right rail (desktop) */}
      <RightRail sections={sections} activeId={activeSection} onJump={jumpTo} modalOpen={modalOpen} />

      {/* mobile chapters */}
      <MobileChapters sections={sections} activeId={activeSection} onJump={jumpTo} />

      {/* snap tour */}
      <main className="pt-0">
        <div className="snap-y snap-mandatory scroll-smooth">
          {/* INTRO */}
          <PageSection id="intro">
            <motion.div variants={stagger} initial="hidden" animate="show" className="relative">
              {/* hero headshot as premium element */}
              <div className="pointer-events-none absolute right-[-20px] top-[-10px] hidden h-[520px] w-[420px] sm:block">
                <div className="absolute inset-0 rounded-[48px] bg-white/50 backdrop-blur-2xl border border-black/10 shadow-[0_30px_80px_rgba(0,0,0,0.10)]" />
                <div className="absolute inset-0 overflow-hidden rounded-[48px]">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white/60" />
                  {/* Use /public/denzel.png (transparent background, B/W) */}
                  <Image
                    src="/denzel.png"
                    alt="Denzel Tinashe"
                    fill
                    className="object-contain opacity-[0.92] mix-blend-multiply"
                    sizes="420px"
                    priority
                  />
                </div>
              </div>

              <motion.p variants={fadeUp} className="text-xs font-medium tracking-[0.18em] text-black/60">
                FAITH FIRST • EXECUTION ALWAYS
              </motion.p>

              <motion.h1 variants={fadeUp} className="mt-4 text-balance text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
                Ambassador of Christ—building products, systems, and experiences with disciplined excellence.
              </motion.h1>

              <motion.p variants={fadeUp} className="mt-5 max-w-2xl text-pretty text-sm leading-6 text-black/70 sm:text-base">
                I’m Denzel Tinashe. I don’t hide my faith—yet I bring value through clarity, reliability, and outcomes. I design and
                engineer modern interfaces and operational systems across web, media, branding, and infrastructure-minded work.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-7 flex flex-wrap items-center gap-3">
                <GlassButton primary onClick={() => jumpTo('work')}>Start the tour ↓</GlassButton>
                <GlassButton href="/resume.pdf">Download resume ↗</GlassButton>
                <GlassButton href="https://github.com/sparkdeveloping" target="_blank" rel="noreferrer">
                  GitHub ↗
                </GlassButton>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-10 rounded-2xl border border-black/10 bg-white/50 p-4 backdrop-blur sm:p-5">
                <p className="text-xs font-medium tracking-[0.18em] text-black/60">CREDIBILITY</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Pill>GoCreate</Pill>
                  <Pill>Wichita State ITS</Pill>
                  <Pill>KDYM</Pill>
                  <Pill>FPC Wichita</Pill>
                  <Pill>Aftershock</Pill>
                  <Pill>Hacia</Pill>
                  <Pill>PosCloud</Pill>
                </div>
              </motion.div>
            </motion.div>
          </PageSection>

          {/* WORK */}
          <PageSection id="work">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}>
              <motion.p variants={fadeUp} className="text-xs font-medium tracking-[0.18em] text-black/60">
                SELECTED WORK
              </motion.p>

              <motion.h2 variants={fadeUp} className="mt-4 text-balance text-2xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Scroll to browse. Click to open.
              </motion.h2>

              <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-sm leading-6 text-black/70 sm:text-base">
                This chapter is intentionally interactive. On desktop: wheel scrolls the carousel. On mobile: swipe horizontally.
              </motion.p>

              {/* Horizontal carousel driven by wheel */}
              <motion.div variants={fadeUp} className="mt-7">
                <div
                  ref={workRailRef}
                  data-allow-wheel="true"
                  className={cx(
                    'relative -mx-5 sm:-mx-8 px-5 sm:px-8',
                    'overflow-x-auto overscroll-x-contain',
                    'scroll-smooth',
                    '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
                  )}
                >
                  <div className="flex gap-4 pr-6 sm:gap-5 sm:pr-10">
                    {workItems.map((item) => (
                      <div
                        key={item.id}
                        className={cx(
                          'min-w-[86%] sm:min-w-[420px] lg:min-w-[460px]',
                          'snap-start'
                        )}
                      >
                        <WorkCard item={item} onOpen={onOpen} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* subtle hinting affordance (visual, not texty) */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-black/50">←</span>
                  <span className="text-xs text-black/50">→</span>
                </div>
              </motion.div>
            </motion.div>
          </PageSection>

          {/* FLAGSHIP */}
          <PageSection id="flagship">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}>
              <motion.p variants={fadeUp} className="text-xs font-medium tracking-[0.18em] text-black/60">
                FLAGSHIP
              </motion.p>

              <motion.h2 variants={fadeUp} className="mt-4 text-balance text-2xl font-semibold tracking-[-0.03em] sm:text-4xl">
                GoCreate / Wichita State ITS — Systems at scale.
              </motion.h2>

              <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-sm leading-6 text-black/70 sm:text-base">
                Digitization, integration, operational reliability, and delivery in a live environment—built to work daily.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-7 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
                <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/60 backdrop-blur">
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image src="/work/gocreate-1.png" alt="GoCreate preview" fill className="object-cover" sizes="100vw" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/10" />
                  </div>
                  <div className="p-5 sm:p-7">
                    <p className="text-xs font-medium tracking-[0.18em] text-black/60">KEY OUTCOMES</p>

                    <div className="mt-4 grid gap-2 text-sm leading-6 text-black/70 sm:grid-cols-2">
                      {workItems[0].impact.map((x) => (
                        <div key={x} className="flex gap-2">
                          <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-black/30" />
                          <span>{x}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-7 flex flex-wrap gap-2">
                      <GlassButton primary onClick={() => onOpen(workItems[0])}>Open full case</GlassButton>
                      <GlassButton href="https://gocreate.com/" target="_blank" rel="noreferrer">Visit GoCreate ↗</GlassButton>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur sm:p-7">
                  <p className="text-xs font-medium tracking-[0.18em] text-black/60">EXECUTION POSTURE</p>
                  <p className="mt-4 text-sm leading-6 text-black/70 sm:text-base">
                    Faith shapes my character and discipline; execution defines my work. Calm under responsibility. Consistent in delivery.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <Pill>Systems Thinking</Pill>
                    <Pill>Reliability</Pill>
                    <Pill>Design + Engineering</Pill>
                    <Pill>Operational Discipline</Pill>
                  </div>

                  <div className="mt-8 rounded-2xl border border-black/10 bg-white/60 p-4 backdrop-blur">
                    <p className="text-xs font-medium tracking-[0.18em] text-black/60">EDUCATION</p>
                    <p className="mt-2 text-sm font-semibold tracking-[-0.02em]">Wichita State University</p>
                    <p className="mt-1 text-sm text-black/70">Computer Engineering • Since 2022</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </PageSection>

          {/* CAPABILITIES */}
          <PageSection id="capabilities">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}>
              <motion.p variants={fadeUp} className="text-xs font-medium tracking-[0.18em] text-black/60">
                CAPABILITIES
              </motion.p>
              <motion.h2 variants={fadeUp} className="mt-4 text-balance text-2xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Product clarity, engineering rigor, creative technology.
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-sm leading-6 text-black/70 sm:text-base">
                The overlap matters: I can design it, build it, and deliver it with operational discipline.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-7 grid gap-4 sm:grid-cols-3 sm:gap-5">
                {[
                  {
                    title: 'Product Design',
                    bullets: ['UI systems & design tokens', 'Interaction design with restraint', 'Hierarchy, clarity, trust', 'Prototyping & iteration'],
                  },
                  {
                    title: 'Design Engineering',
                    bullets: ['Next.js / React / Framer Motion', 'Performance discipline', 'Accessibility & structure', 'Maintainable component architecture'],
                  },
                  {
                    title: 'Creative Technology',
                    bullets: ['Editing, motion, logos, branding', 'Marketing-aligned creatives', 'SEO-aware delivery', 'Cross-platform consistency'],
                  },
                ].map((card) => (
                  <div key={card.title} className="rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur sm:p-7">
                    <h3 className="text-lg font-semibold tracking-[-0.03em]">{card.title}</h3>
                    <div className="mt-4 grid gap-2 text-sm leading-6 text-black/70">
                      {card.bullets.map((b) => (
                        <div key={b} className="flex gap-2">
                          <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-black/30" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className="mt-6 rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur sm:p-7">
                <p className="text-xs font-medium tracking-[0.18em] text-black/60">STACK</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['Next.js', 'React', 'Framer Motion', 'Swift', 'Java', 'Python', 'PHP', 'Laravel', 'OOP', 'Frontend', 'Backend', 'Systems'].map((t) => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </PageSection>

          {/* PODCAST */}
          <PageSection id="podcast">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}>
              <motion.p variants={fadeUp} className="text-xs font-medium tracking-[0.18em] text-black/60">
                OPTIONAL CONTEXT
              </motion.p>
              <motion.h2 variants={fadeUp} className="mt-4 text-balance text-2xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Jesus Revealed (Podcast)
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-sm leading-6 text-black/70 sm:text-base">
                Hosted, produced, and edited by me with co-host Tre—available on YouTube and all platforms.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-7 rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold tracking-[-0.02em] text-black">Host • Producer • Editor</p>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-black/70">
                      Intentionally subtle. Professionally, my work stands on execution and reliability; personally, I’m open about who I am.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* Replace with your real podcast links */}
                    <GlassButton primary href="https://www.youtube.com/" target="_blank" rel="noreferrer">YouTube ↗</GlassButton>
                    <GlassButton onClick={() => jumpTo('contact')}>Collaborate</GlassButton>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </PageSection>

          {/* ABOUT */}
          <PageSection id="about">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}>
              <motion.p variants={fadeUp} className="text-xs font-medium tracking-[0.18em] text-black/60">
                ABOUT
              </motion.p>
              <motion.h2 variants={fadeUp} className="mt-4 text-balance text-2xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Conviction, discipline, and delivery.
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-sm leading-6 text-black/70 sm:text-base">
                Faith first—then excellence. I show up, execute, and build systems and experiences that work in the real world.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-7 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur sm:p-7">
                  <p className="text-xs font-medium tracking-[0.18em] text-black/60">IDENTITY</p>
                  <p className="mt-3 text-sm leading-6 text-black/70 sm:text-base">
                    I’m an ambassador of Christ. That informs how I work: integrity, clarity, service, and disciplined excellence.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Pill>Integrity</Pill>
                    <Pill>Consistency</Pill>
                    <Pill>Excellence</Pill>
                    <Pill>Systems mindset</Pill>
                  </div>
                </div>

                <div className="rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur sm:p-7">
                  <p className="text-xs font-medium tracking-[0.18em] text-black/60">WHAT YOU GET</p>
                  <div className="mt-4 grid gap-3 text-sm leading-6 text-black/70 sm:grid-cols-2">
                    {[
                      'Design intent + implementation reality',
                      'Reliability in systems-critical environments',
                      'Marketing-aligned creative delivery',
                      'Clear stakeholder communication',
                    ].map((x) => (
                      <div key={x} className="flex gap-2">
                        <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-black/30" />
                        <span>{x}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-wrap gap-2">
                    <GlassButton href="https://github.com/sparkdeveloping" target="_blank" rel="noreferrer">GitHub ↗</GlassButton>
                    <GlassButton href="https://www.linkedin.com/in/denzelnyatsanza/" target="_blank" rel="noreferrer">LinkedIn ↗</GlassButton>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </PageSection>

          {/* CONTACT */}
          <PageSection id="contact" className="pb-24">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}>
              <motion.p variants={fadeUp} className="text-xs font-medium tracking-[0.18em] text-black/60">
                CONTACT
              </motion.p>
              <motion.h2 variants={fadeUp} className="mt-4 text-balance text-2xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Let’s build something clean, reliable, and high-impact.
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-sm leading-6 text-black/70 sm:text-base">
                Email is best. Resume download is available.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-7 grid gap-5 lg:grid-cols-2">
                <div className="rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur sm:p-7">
                  <p className="text-sm font-semibold tracking-[-0.02em]">Primary</p>
                  <p className="mt-2 text-sm leading-6 text-black/70">
                    Replace the email below with your real email.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <GlassButton
                      primary
                      href="mailto:denzel@example.com?subject=Project%20Inquiry%20—%20Denzel%20Tinashe"
                    >
                      Email Me
                    </GlassButton>
                    <GlassButton href="/resume.pdf">Download Resume ↗</GlassButton>
                  </div>
                </div>

                <div className="rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur sm:p-7">
                  <p className="text-sm font-semibold tracking-[-0.02em]">Quick Form (UI)</p>
                  <p className="mt-2 text-sm leading-6 text-black/70">
                    Wire to your backend or a form service later.
                  </p>
                  <form className="mt-5 grid gap-3">
                    <input
                      className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm text-black placeholder:text-black/40 outline-none backdrop-blur focus:ring-2 focus:ring-black/15"
                      placeholder="Name"
                    />
                    <input
                      className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm text-black placeholder:text-black/40 outline-none backdrop-blur focus:ring-2 focus:ring-black/15"
                      placeholder="Email"
                    />
                    <textarea
                      rows={4}
                      className="w-full resize-none rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm text-black placeholder:text-black/40 outline-none backdrop-blur focus:ring-2 focus:ring-black/15"
                      placeholder="Message"
                    />
                    <button
                      type="button"
                      className="rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-black/90"
                    >
                      Send (connect later)
                    </button>
                  </form>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-2 text-xs text-black/50 sm:flex-row sm:items-center sm:justify-between">
                <p>© {new Date().getFullYear()} Denzel Tinashe. All rights reserved.</p>
                <p className="flex flex-wrap gap-3">
                  {sections.map((s) => (
                    <button key={s.id} onClick={() => jumpTo(s.id)} className="hover:text-black">
                      {s.label}
                    </button>
                  ))}
                </p>
              </motion.div>
            </motion.div>
          </PageSection>
        </div>
      </main>

      {/* Modal */}
      <Modal open={modalOpen} onClose={onClose} item={activeItem} />
    </div>
  );
}
