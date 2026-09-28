import Link from 'next/link';
import InquiryForm from '@/components/portfolio/InquiryForm';
import styles from './start.module.css';

export const metadata = {
  title: 'Start a Project',
  description: 'Tell Denzel Tinashe what you want to build: iOS app, web product, platform, or high-conviction website.',
  alternates: { canonical: '/start' },
};

export default function StartPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}><Link href="/" className={styles.brand}><span>DT</span><b>Denzel Tinashe</b></Link><Link href="/">Back to portfolio →</Link></header>
      <section className={styles.hero}>
        <div><span className={styles.kicker}>START A PROJECT</span><h1>Tell me what<br />should exist.</h1><p>A short brief is enough. I’m most useful when the project needs product thinking and implementation—not just a pair of hands for a predetermined screen.</p></div>
        <aside><div><small>GOOD FIT</small><p>Native iOS products</p><p>Web apps / platforms</p><p>Conversion-focused websites</p><p>Product rescue / redesign</p></div><div><small>BASED IN</small><p>Wichita, Kansas · working worldwide</p></div></aside>
      </section>
      <section className={styles.formSection}><InquiryForm /></section>
      <footer className={styles.footer}><span>© 2026 Denzel Tinashe</span><div><a href="/resume.pdf" target="_blank" rel="noreferrer">Résumé ↗</a><a href="https://github.com/sparkdeveloping" target="_blank" rel="noreferrer">GitHub ↗</a></div></footer>
    </main>
  );
}
