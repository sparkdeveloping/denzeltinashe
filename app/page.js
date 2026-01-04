'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

/* -----------------------------
   Hooks
----------------------------- */
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

/* -----------------------------
   Motion presets
----------------------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.65, ease: EASE } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
};

const hoverLift = {
  rest: { y: 0, scale: 1 },
  hover: { y: -3, scale: 1.01, transition: { duration: 0.25, ease: EASE } },
  tap: { scale: 0.98, transition: { duration: 0.12, ease: EASE } },
};

/* -----------------------------
   Background
----------------------------- */
function BokehBackground() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 2200], [0, 120]);
  const y2 = useTransform(scrollY, [0, 2200], [0, -90]);
  const y3 = useTransform(scrollY, [0, 2200], [0, 70]);

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

/* -----------------------------
   UI atoms
----------------------------- */
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

  const common = cx(
    'relative inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition',
    base,
    'shadow-[0_1px_0_rgba(0,0,0,0.05)]',
    'hover:shadow-[0_16px_50px_rgba(0,0,0,0.12)]',
    'focus:outline-none focus:ring-2 focus:ring-black/20',
    className
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={common}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        variants={hoverLift}
        {...rest}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={common}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={hoverLift}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

/* -----------------------------
   Modal
----------------------------- */
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
            <motion.button
              type="button"
              onClick={onClose}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              variants={hoverLift}
              className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-medium text-black/70 backdrop-blur hover:bg-white"
            >
              Close
            </motion.button>
          </div>

          {item.cover ? (
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image src={item.cover} alt={`${item.title} cover`} fill className="object-cover" sizes="100vw" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/10" />
            </div>
          ) : (
            <div className="relative h-44 w-full overflow-hidden bg-black/[0.03]">
              <div className="absolute inset-0 bg-gradient-to-b from-black/[0.02] to-black/[0.06]" />
              <div className="absolute left-6 top-6">
                <Pill>No image</Pill>
              </div>
            </div>
          )}

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
                  <GlassButton key={l.href} href={l.href} target="_blank" rel="noreferrer">
                    {l.label} ↗
                  </GlassButton>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* -----------------------------
   Work card
----------------------------- */
function WorkCard({ item, onOpen }) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(item)}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={{
        rest: { y: 0, scale: 1 },
        hover: { y: -4, scale: 1.01, transition: { duration: 0.28, ease: EASE } },
        tap: { scale: 0.985, transition: { duration: 0.12, ease: EASE } },
      }}
      className={cx(
        'group relative flex w-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white/60 text-left backdrop-blur',
        'shadow-[0_1px_0_rgba(0,0,0,0.04)]',
        'hover:shadow-[0_24px_70px_rgba(0,0,0,0.14)] hover:border-black/15',
        'focus:outline-none focus:ring-2 focus:ring-black/20'
      )}
    >
      {item.cover ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <motion.div
            className="absolute inset-0"
            variants={{
              rest: { scale: 1 },
              hover: { scale: 1.045, transition: { duration: 0.6, ease: EASE } },
            }}
          >
            <Image src={item.cover} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </motion.div>

          <motion.div
            className="absolute inset-0"
            variants={{
              rest: { opacity: 0.6 },
              hover: { opacity: 0.85, transition: { duration: 0.35, ease: EASE } },
            }}
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.04) 65%, rgba(0,0,0,0.10) 100%)',
            }}
          />
        </div>
      ) : (
        <div className="relative h-40 w-full overflow-hidden bg-black/[0.03]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/[0.02] to-black/[0.06]" />
          <div className="absolute left-4 top-4">
            <Pill>No image</Pill>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Pill>{item.year}</Pill>
          <Pill>{item.category}</Pill>
        </div>

        <div>
          <h3 className="text-base font-semibold tracking-[-0.02em] text-black sm:text-lg">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-black/70">{item.summary}</p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs font-medium text-black/60">Open</span>
          <span className="text-xs font-medium text-black/60">↗</span>
        </div>
      </div>
    </motion.button>
  );
}

/* -----------------------------
   Right Rail
----------------------------- */
function RightRail({ sections, activeId, onJump, modalOpen }) {
  const railRef = useRef(null);
  const [expanded, setExpanded] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [nudgeKey, setNudgeKey] = useState(0);

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

  const markInteract = () => setHasInteracted(true);

  useEffect(() => {
    const t = setTimeout(() => setExpanded(false), 2400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (hasInteracted || modalOpen) return;
    const interval = setInterval(() => {
      setExpanded(true);
      setNudgeKey((k) => k + 1);
      setTimeout(() => setExpanded(false), 2200);
    }, 8500);
    return () => clearInterval(interval);
  }, [hasInteracted, modalOpen]);

  return (
    <motion.aside
      ref={railRef}
      onMouseMove={onMove}
      onMouseEnter={() => {
        markInteract();
        setExpanded(true);
      }}
      onMouseLeave={() => {
        mvX.set(0);
        mvY.set(0);
        if (hasInteracted) setExpanded(false);
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

/* -----------------------------
   Mobile chapter bar
----------------------------- */
function MobileChapters({ sections, activeId, onJump }) {
  return (
    <div className="fixed bottom-4 left-1/2 z-[60] w-[min(92vw,520px)] -translate-x-1/2 sm:hidden">
      <div className="rounded-2xl border border-black/10 bg-white/60 px-3 py-2 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-black/70">
            {sections.find((s) => s.id === activeId)?.label ?? 'Chapter'}
          </span>
          <div className="flex items-center gap-1.5">
            {sections.map((s) => {
              const isActive = s.id === activeId;
              return (
                <button key={s.id} type="button" onClick={() => onJump(s.id)} className="p-1" aria-label={`Go to ${s.label}`}>
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

/* -----------------------------
   Action Dock
----------------------------- */
function ActionDock({ onWork, onEmail }) {
  return (
    <>
      {/* desktop */}
      <div className="fixed left-4 top-4 z-[60] hidden sm:block">
        <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white/60 p-2 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
          <GlassButton href="/resume.pdf" className="rounded-xl px-3 py-2">
            Resume ↗
          </GlassButton>
          <GlassButton onClick={onWork} className="rounded-xl px-3 py-2">
            Work
          </GlassButton>
          <GlassButton primary onClick={onEmail} className="rounded-xl px-3 py-2">
            Email
          </GlassButton>
        </div>
      </div>

      {/* mobile */}
      <div className="fixed bottom-[72px] left-4 z-[60] sm:hidden">
        <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white/60 p-2 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
          <GlassButton href="/resume.pdf" className="rounded-xl px-3 py-2 text-xs">
            Resume ↗
          </GlassButton>
          <GlassButton onClick={onWork} className="rounded-xl px-3 py-2 text-xs">
            Work
          </GlassButton>
          <GlassButton primary onClick={onEmail} className="rounded-xl px-3 py-2 text-xs">
            Email
          </GlassButton>
        </div>
      </div>
    </>
  );
}

/* -----------------------------
   Section wrapper (supports align)
----------------------------- */
function PageSection({ id, children, className, align = 'center' }) {
  return (
    <section
      id={id}
      className={cx(
        'snap-start min-h-[100svh] flex pt-24 pb-14',
        align === 'start' ? 'items-start' : 'items-center',
        className
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}

/* -----------------------------
   Helper: determine chapter by viewport center
----------------------------- */
function getSectionAtViewportCenter(sections) {
  const y = window.innerHeight * 0.5;
  let bestId = sections[0]?.id ?? 'intro';
  let bestDist = Infinity;

  for (const s of sections) {
    const el = document.getElementById(s.id);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    const center = r.top + r.height / 2;
    const dist = Math.abs(center - y);
    if (dist < bestDist) {
      bestDist = dist;
      bestId = s.id;
    }
  }
  return bestId;
}

/* -----------------------------
   Main Page
----------------------------- */
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
        cover: null, // intentionally no image
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

  // Active section by intersection (rail highlight)
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
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Modal
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

  // Progress bar
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 });
  const progressWidth = useTransform(progress, (v) => `${Math.max(0.02, v) * 100}%`);

  // Work carousel ref
  const workRailRef = useRef(null);

  // Desktop pagination + Work gating (single source of truth)
  const wheelLockRef = useRef(false);
  const lastWheelAtRef = useRef(0);

  useEffect(() => {
    if (prefersReduced || isTouch || modalOpen) return;

    const handler = (e) => {
      const dy = e.deltaY;
      if (Math.abs(dy) < 18) return;

      const current = getSectionAtViewportCenter(sections);

      // WORK GATE: always scroll carousel first (even if cursor is not over it)
      if (current === 'work' && workRailRef.current) {
        const el = workRailRef.current;
        const atStart = el.scrollLeft <= 2;
        const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;

        if ((dy > 0 && !atEnd) || (dy < 0 && !atStart)) {
          e.preventDefault();
          el.scrollLeft += dy * 1.25;
          return;
        }
        // If at boundary, allow pagination below.
      }

      // Throttle
      const now = Date.now();
      if (wheelLockRef.current && now - lastWheelAtRef.current < 700) {
        e.preventDefault();
        return;
      }
      wheelLockRef.current = true;
      lastWheelAtRef.current = now;

      const idx = sections.findIndex((s) => s.id === current);
      if (idx < 0) return;

      const dir = dy > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(sections.length - 1, idx + dir));
      if (next !== idx) {
        e.preventDefault();
        jumpTo(sections[next].id);
      }

      setTimeout(() => {
        wheelLockRef.current = false;
      }, 520);
    };

    window.addEventListener('wheel', handler, { passive: false });
    return () => window.removeEventListener('wheel', handler);
  }, [prefersReduced, isTouch, modalOpen, sections, jumpTo]);

  return (
    <div className="min-h-screen text-black">
      <BokehBackground />

      {/* progress */}
      <div className="fixed left-0 top-0 z-[70] h-[2px] w-full bg-black/5">
        <motion.div className="h-full bg-black/40" style={{ width: progressWidth }} />
      </div>

      <ActionDock onWork={() => jumpTo('work')} onEmail={() => jumpTo('contact')} />
      <RightRail sections={sections} activeId={activeSection} onJump={jumpTo} modalOpen={modalOpen} />
      <MobileChapters sections={sections} activeId={activeSection} onJump={jumpTo} />

      {/* snap tour */}
      <main className="pt-0">
        <div className="snap-y snap-mandatory scroll-smooth">
          {/* INTRO */}
          <PageSection id="intro">
            <motion.div variants={stagger} initial="hidden" animate="show">
              <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                {/* Left */}
                <div>
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
                    <GlassButton href="https://github.com/sparkdeveloping" target="_blank" rel="noreferrer">GitHub ↗</GlassButton>
                  </motion.div>

                  <motion.div variants={fadeUp} className="mt-10 max-w-[560px] rounded-2xl border border-black/10 bg-white/50 p-4 backdrop-blur sm:p-5">
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
                </div>

                {/* Right (portrait stage) */}
                <motion.div variants={fadeUp} className="relative">
                  <div className="relative overflow-hidden rounded-[44px] border border-black/10 bg-white/55 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.12)]">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white/60" />
                    <div className="relative aspect-[4/5] w-full">
                      <Image
                        src="/denzel.png"
                        alt="Denzel Tinashe"
                        fill
                        className="object-contain opacity-[0.96] mix-blend-multiply"
                        sizes="(max-width: 1024px) 90vw, 520px"
                        priority
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/80 to-white/0" />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
                    className="pointer-events-none absolute -left-6 top-10 hidden rounded-2xl border border-black/10 bg-white/60 px-4 py-3 text-xs font-semibold text-black/70 backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.12)] lg:block"
                  >
                    Product • Engineering • Creative Tech
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ delay: 0.48, duration: 0.6, ease: EASE }}
                    className="pointer-events-none absolute -right-6 bottom-12 hidden rounded-2xl border border-black/10 bg-white/60 px-4 py-3 text-xs font-semibold text-black/70 backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.12)] lg:block"
                  >
                    denzeltinashe.com
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </PageSection>

          {/* WORK (align start + padding so shadows don’t clip) */}
          <PageSection id="work" align="start">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}>
              <motion.p variants={fadeUp} className="text-xs font-medium tracking-[0.18em] text-black/60">
                SELECTED WORK
              </motion.p>
              <motion.h2 variants={fadeUp} className="mt-4 text-balance text-2xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Browse the work like a reel.
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-sm leading-6 text-black/70 sm:text-base">
                Desktop: scroll wheel moves the carousel (gated). It will not paginate away until you reach the end.
                Mobile: swipe horizontally.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-7">
                <div
                  ref={workRailRef}
                  className={cx(
                    'relative -mx-5 sm:-mx-8 px-5 sm:px-8',
                    'overflow-x-auto overflow-y-visible overscroll-x-contain',
                    'snap-x snap-mandatory scroll-smooth',
                    'py-10', // key: prevents hover shadows from clipping
                    '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
                  )}
                >
                  <div className="flex gap-4 pr-6 sm:gap-5 sm:pr-10">
                    {workItems.map((item) => (
                      <div key={item.id} className="min-w-[86%] snap-start sm:min-w-[420px] lg:min-w-[460px]">
                        <WorkCard item={item} onOpen={onOpen} />
                      </div>
                    ))}
                  </div>
                </div>

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
              <motion.p variants={fadeUp} className="text-xs font-medium tracking-[0.18em] text-black/60">FLAGSHIP</motion.p>
              <motion.h2 variants={fadeUp} className="mt-4 text-balance text-2xl font-semibold tracking-[-0.03em] sm:text-4xl">
                GoCreate / Wichita State ITS — Systems at scale.
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-sm leading-6 text-black/70 sm:text-base">
                Digitization, integration, operational reliability, and delivery in a live environment—built to work daily.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-7 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
                <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/60 backdrop-blur shadow-[0_18px_60px_rgba(0,0,0,0.10)]">
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

                <div className="rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur shadow-[0_18px_60px_rgba(0,0,0,0.10)] sm:p-7">
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
              <motion.p variants={fadeUp} className="text-xs font-medium tracking-[0.18em] text-black/60">CAPABILITIES</motion.p>
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
                  <motion.div
                    key={card.title}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    variants={hoverLift}
                    className="rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur shadow-[0_18px_60px_rgba(0,0,0,0.10)] sm:p-7"
                  >
                    <h3 className="text-lg font-semibold tracking-[-0.03em]">{card.title}</h3>
                    <div className="mt-4 grid gap-2 text-sm leading-6 text-black/70">
                      {card.bullets.map((b) => (
                        <div key={b} className="flex gap-2">
                          <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-black/30" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className="mt-6 rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur shadow-[0_18px_60px_rgba(0,0,0,0.10)] sm:p-7">
                <p className="text-xs font-medium tracking-[0.18em] text-black/60">STACK</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['Next.js', 'React', 'Framer Motion', 'Tailwind', 'Swift', 'Java', 'Python', 'PHP', 'Laravel', 'OOP', 'Frontend', 'Backend'].map((t) => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </PageSection>

          {/* PODCAST */}
          <PageSection id="podcast">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}>
              <motion.p variants={fadeUp} className="text-xs font-medium tracking-[0.18em] text-black/60">PODCAST</motion.p>
              <motion.h2 variants={fadeUp} className="mt-4 text-balance text-2xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Jesus Revealed Podcast
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-sm leading-6 text-black/70 sm:text-base">
                Host, producer, and editor. Available on Spotify, Apple Podcasts, and YouTube as <span className="font-semibold">jesusrevealedpodcast</span>.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-7 rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur shadow-[0_18px_60px_rgba(0,0,0,0.10)] sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold tracking-[-0.02em] text-black">Host • Producer • Editor</p>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-black/70">
                      This is part of my identity and story. Professionally, I’m execution-focused—reliable delivery, clear communication, and high standards.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <GlassButton primary href="https://www.youtube.com/@jesusrevealedpodcast" target="_blank" rel="noreferrer">
                      YouTube ↗
                    </GlassButton>
                    <GlassButton href="https://open.spotify.com/" target="_blank" rel="noreferrer">
                      Spotify ↗
                    </GlassButton>
                    <GlassButton href="https://podcasts.apple.com/" target="_blank" rel="noreferrer">
                      Apple Podcasts ↗
                    </GlassButton>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </PageSection>

          {/* ABOUT */}
          <PageSection id="about">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}>
              <motion.p variants={fadeUp} className="text-xs font-medium tracking-[0.18em] text-black/60">ABOUT</motion.p>
              <motion.h2 variants={fadeUp} className="mt-4 text-balance text-2xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Conviction, discipline, and delivery.
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-sm leading-6 text-black/70 sm:text-base">
                Faith first—then excellence. I show up, execute, and build systems and experiences that work in the real world.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-7 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur shadow-[0_18px_60px_rgba(0,0,0,0.10)] sm:p-7">
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

                <div className="rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur shadow-[0_18px_60px_rgba(0,0,0,0.10)] sm:p-7">
                  <p className="text-xs font-medium tracking-[0.18em] text-black/60">SOCIAL</p>
                  <p className="mt-3 text-sm leading-6 text-black/70 sm:text-base">
                    Instagram & Facebook: <span className="font-semibold">@denzeltinashe</span>
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <GlassButton href="https://instagram.com/denzeltinashe" target="_blank" rel="noreferrer">Instagram ↗</GlassButton>
                    <GlassButton href="https://facebook.com/denzeltinashe" target="_blank" rel="noreferrer">Facebook ↗</GlassButton>
                    <GlassButton href="https://www.linkedin.com/in/denzelnyatsanza/" target="_blank" rel="noreferrer">LinkedIn ↗</GlassButton>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </PageSection>

          {/* CONTACT */}
          <PageSection id="contact" className="pb-24">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}>
              <motion.p variants={fadeUp} className="text-xs font-medium tracking-[0.18em] text-black/60">CONTACT</motion.p>
              <motion.h2 variants={fadeUp} className="mt-4 text-balance text-2xl font-semibold tracking-[-0.03em] sm:text-4xl">
                Let’s build something clean, reliable, and high-impact.
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-sm leading-6 text-black/70 sm:text-base">
                Portfolio: <span className="font-semibold">denzeltinashe.com</span>. Email is best. Resume download is available.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-7 grid gap-5 lg:grid-cols-2">
                <div className="rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur shadow-[0_18px_60px_rgba(0,0,0,0.10)] sm:p-7">
                  <p className="text-sm font-semibold tracking-[-0.02em]">Primary</p>
                  {/* <p className="mt-2 text-sm leading-6 text-black/70">Replace the email below with your real email.</p> */}

                  <div className="mt-5 flex flex-wrap gap-2">
                    <GlassButton primary href="mailto:denzelnyatsanza@gmail.com?subject=Project%20Inquiry%20—%20Denzel%20">Email Me</GlassButton>
                    <GlassButton href="/resume.pdf">Download Resume ↗</GlassButton>
                  </div>
                </div>

                <div className="rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur shadow-[0_18px_60px_rgba(0,0,0,0.10)] sm:p-7">
                  <p className="text-sm font-semibold tracking-[-0.02em]">Quick Message</p>
                  {/* <p className="mt-2 text-sm leading-6 text-black/70">Wire to your backend or a form service later.</p> */}

                  <form className="mt-5 grid gap-3">
                    <input className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm text-black placeholder:text-black/40 outline-none backdrop-blur focus:ring-2 focus:ring-black/15" placeholder="Name" />
                    <input className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm text-black placeholder:text-black/40 outline-none backdrop-blur focus:ring-2 focus:ring-black/15" placeholder="Email" />
                    <textarea rows={4} className="w-full resize-none rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm text-black placeholder:text-black/40 outline-none backdrop-blur focus:ring-2 focus:ring-black/15" placeholder="Message" />
                    <motion.button
                      type="button"
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      variants={hoverLift}
                      className="rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.16)] hover:bg-black/90"
                    >
                      Send (connect later)
                    </motion.button>
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

      <Modal open={modalOpen} onClose={onClose} item={activeItem} />
    </div>
  );
}
