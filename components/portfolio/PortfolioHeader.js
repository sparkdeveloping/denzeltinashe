'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '@/app/home.module.css';

const links = [
  ['Work', '/#work'],
  ['Web', '/#web'],
  ['Experience', '/#experience'],
  ['About', '/#about'],
];

export default function PortfolioHeader() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 110);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${compact ? styles.headerCompact : ''}`}>
      <Link className={styles.brand} href="/#top" aria-label="Denzel Tinashe, back to top">
        <span className={styles.brandMark}>DT</span>
        <span className={styles.brandText}>Denzel Tinashe</span>
      </Link>

      <nav className={styles.nav} aria-label="Main navigation">
        {links.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}
      </nav>

      <div className={styles.headerActions}>
        <a className={styles.resumeLink} href="/resume.pdf" target="_blank" rel="noreferrer">Résumé</a>
        <Link className={styles.headerCta} href="/start">Start a project <span aria-hidden="true">↗</span></Link>
      </div>

      <button
        type="button"
        className={styles.menuButton}
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span /><span />
      </button>

      {open && (
        <nav className={styles.mobileNav} aria-label="Mobile navigation">
          {links.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <a href="/resume.pdf" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Résumé <span>↗</span></a>
          <Link className={styles.mobileStart} href="/start" onClick={() => setOpen(false)}>Start a project <span>↗</span></Link>
        </nav>
      )}
    </header>
  );
}
