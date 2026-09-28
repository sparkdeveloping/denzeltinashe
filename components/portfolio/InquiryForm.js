'use client';

import { useMemo, useState } from 'react';
import styles from '@/app/start/start.module.css';

const initial = {
  name: '', email: '', company: '', type: 'Web app / platform', stage: 'Idea / early concept',
  timeline: '', budget: '', message: '', website: '', startedAt: Date.now(),
};

export default function InquiryForm() {
  const [form, setForm] = useState(initial);
  const [state, setState] = useState({ status: 'idle', message: '' });

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(`Project inquiry — ${form.type}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company || '—'}\nProject: ${form.type}\nStage: ${form.stage}\nTimeline: ${form.timeline || '—'}\nBudget: ${form.budget || '—'}\n\n${form.message}`
    );
    return `mailto:denzelnyatsanza@gmail.com?subject=${subject}&body=${body}`;
  }, [form]);

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setState({ status: 'sending', message: 'Sending…' });
    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Message delivery is not configured yet.');
      setState({ status: 'sent', message: 'Received. I’ll reply by email.' });
      setForm({ ...initial, startedAt: Date.now() });
    } catch (error) {
      setState({ status: 'fallback', message: error.message });
    }
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <input className={styles.honeypot} tabIndex="-1" autoComplete="off" name="website" value={form.website} onChange={update} aria-hidden="true" />
      <div className={styles.twoCol}>
        <label>Name<input required name="name" value={form.name} onChange={update} autoComplete="name" /></label>
        <label>Email<input required type="email" name="email" value={form.email} onChange={update} autoComplete="email" /></label>
      </div>
      <label>Company / organization <span>optional</span><input name="company" value={form.company} onChange={update} autoComplete="organization" /></label>
      <div className={styles.twoCol}>
        <label>What are you building?
          <select name="type" value={form.type} onChange={update}>
            <option>Web app / platform</option><option>iOS app</option><option>Website</option><option>Product redesign</option><option>Not sure yet</option>
          </select>
        </label>
        <label>Current stage
          <select name="stage" value={form.stage} onChange={update}>
            <option>Idea / early concept</option><option>Design exists</option><option>Existing product</option><option>Needs rescue / rebuild</option><option>Ready to ship</option>
          </select>
        </label>
      </div>
      <div className={styles.twoCol}>
        <label>Target timeline <span>optional</span><input name="timeline" value={form.timeline} onChange={update} placeholder="e.g. 6–8 weeks" /></label>
        <label>Budget range <span>optional</span>
          <select name="budget" value={form.budget} onChange={update}>
            <option value="">Select a range</option><option>Under $5k</option><option>$5k–$15k</option><option>$15k–$30k</option><option>$30k+</option><option>Need help scoping</option>
          </select>
        </label>
      </div>
      <label>What should exist when we’re done?<textarea required name="message" value={form.message} onChange={update} rows="7" placeholder="The problem, who it’s for, what exists today, and anything already decided." /></label>
      <div className={styles.submitRow}>
        <button disabled={state.status === 'sending'} type="submit">{state.status === 'sending' ? 'Sending…' : 'Send project brief'} <span>→</span></button>
        <p>Prefer email? <a href={mailto}>Open a pre-filled email ↗</a></p>
      </div>
      {state.status !== 'idle' && <p className={styles.status} role="status">{state.message}{state.status === 'fallback' && <> <a href={mailto}>Send by email instead ↗</a></>}</p>}
    </form>
  );
}
