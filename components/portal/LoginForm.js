'use client';

import { useState } from 'react';
import styles from './portal.module.css';

export default function LoginForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/portal/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to sign in.');
      window.location.href = data.redirect || '/';
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={styles.loginForm} onSubmit={submit}>
      <label>
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        <span>Password</span>
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      {error ? <p className={styles.formError}>{error}</p> : null}
      <button className={styles.loginButton} disabled={busy} type="submit">
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
