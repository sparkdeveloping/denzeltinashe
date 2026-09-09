'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './portal.module.css';

export function QuickAdd({ clientSlug, collection, fields, title = 'Add item', submitLabel = 'Add' }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const item = {};
    fields.forEach((field) => {
      item[field.name] = form.get(field.name) || field.defaultValue || '';
    });

    try {
      const response = await fetch('/api/portal/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientSlug, collection, item }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not save item.');
      formElement.reset();
      setOpen(false);
      router.refresh();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.quickAddWrap}>
      <button type="button" className={styles.primaryButton} onClick={() => setOpen((value) => !value)}>
        {open ? 'Close' : `+ ${title}`}
      </button>
      {open ? (
        <form className={styles.quickAddForm} onSubmit={submit}>
          <div className={styles.quickAddGrid}>
            {fields.map((field) => (
              <label key={field.name} className={field.full ? styles.fullField : undefined}>
                <span>{field.label}</span>
                {field.type === 'select' ? (
                  <select name={field.name} defaultValue={field.defaultValue || ''} required={field.required}>
                    {(field.options || []).map((option) => (
                      <option key={option.value ?? option} value={option.value ?? option}>
                        {option.label ?? option}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea name={field.name} rows={field.rows || 4} placeholder={field.placeholder} required={field.required} />
                ) : (
                  <input
                    name={field.name}
                    type={field.type || 'text'}
                    placeholder={field.placeholder}
                    defaultValue={field.defaultValue || ''}
                    required={field.required}
                  />
                )}
              </label>
            ))}
          </div>
          {message ? <p className={styles.formError}>{message}</p> : null}
          <button className={styles.darkButton} disabled={busy} type="submit">
            {busy ? 'Saving…' : submitLabel}
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function StatusSelect({ clientSlug, collection, id, value, options }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function update(nextValue) {
    setBusy(true);
    try {
      const response = await fetch('/api/portal/item', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientSlug, collection, id, patch: { status: nextValue } }),
      });
      if (response.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <select
      className={styles.inlineSelect}
      value={value}
      disabled={busy}
      onChange={(event) => update(event.target.value)}
      aria-label="Update status"
    >
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
}

export function DeleteButton({ clientSlug, collection, id }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!window.confirm('Delete this item?')) return;
    setBusy(true);
    try {
      const response = await fetch('/api/portal/item', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientSlug, collection, id }),
      });
      if (response.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" className={styles.textButton} disabled={busy} onClick={remove}>
      {busy ? 'Removing…' : 'Delete'}
    </button>
  );
}

export function AddClientForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch('/api/portal/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not create client.');
      setOpen(false);
      router.push(data.path);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.quickAddWrap}>
      <button className={styles.primaryButton} type="button" onClick={() => setOpen((value) => !value)}>
        {open ? 'Close' : '+ New client'}
      </button>
      {open ? (
        <form className={styles.quickAddForm} onSubmit={submit}>
          <div className={styles.quickAddGrid}>
            <label><span>Client name</span><input name="name" required placeholder="Client or organization" /></label>
            <label><span>Short code</span><input name="shortCode" required placeholder="e.g. acme" /></label>
            <label><span>Project</span><input name="projectName" required placeholder="Primary engagement" /></label>
            <label><span>Status</span><input name="status" defaultValue="Discovery" /></label>
            <label className={styles.fullField}><span>Summary</span><textarea name="summary" rows="3" placeholder="What are you helping them accomplish?" /></label>
          </div>
          {error ? <p className={styles.formError}>{error}</p> : null}
          <button className={styles.darkButton} disabled={busy}>{busy ? 'Creating…' : 'Create workspace'}</button>
        </form>
      ) : null}
    </div>
  );
}
