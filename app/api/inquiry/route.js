import { NextResponse } from 'next/server';

const allowedTypes = new Set(['Web app / platform','iOS app','Website','Product redesign','Not sure yet']);
const allowedStages = new Set(['Idea / early concept','Design exists','Existing product','Needs rescue / rebuild','Ready to ship']);

function clean(value, max = 4000) {
  return String(value || '').trim().slice(0, max);
}

export async function POST(request) {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > 20000) return NextResponse.json({ error: 'Request is too large.' }, { status: 413 });
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host) {
    try { if (new URL(origin).host !== host) return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 }); }
    catch { return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 }); }
  }

  let payload;
  try { payload = await request.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }

  if (clean(payload.website, 200)) return NextResponse.json({ ok: true });
  const startedAt = Number(payload.startedAt || 0);
  if (startedAt && Date.now() - startedAt < 1800) return NextResponse.json({ error: 'Please review the brief before sending.' }, { status: 429 });

  const name = clean(payload.name, 120);
  const email = clean(payload.email, 180);
  const company = clean(payload.company, 180);
  const type = clean(payload.type, 80);
  const stage = clean(payload.stage, 80);
  const timeline = clean(payload.timeline, 120);
  const budget = clean(payload.budget, 80);
  const message = clean(payload.message, 5000);

  if (!name || !email.includes('@') || !message || !allowedTypes.has(type) || !allowedStages.has(stage)) {
    return NextResponse.json({ error: 'Please complete the required fields.' }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.PROJECT_INQUIRY_TO || 'denzelnyatsanza@gmail.com';
  const from = process.env.PROJECT_INQUIRY_FROM || 'Portfolio <onboarding@resend.dev>';
  if (!key) return NextResponse.json({ error: 'Direct delivery is not configured on this deployment.' }, { status: 503 });

  const lines = [
    `Name: ${name}`, `Email: ${email}`, `Company: ${company || '—'}`, `Project: ${type}`, `Stage: ${stage}`,
    `Timeline: ${timeline || '—'}`, `Budget: ${budget || '—'}`, '', message,
  ];

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], reply_to: email, subject: `Portfolio inquiry — ${type} — ${name}`, text: lines.join('\n') }),
  });

  if (!response.ok) return NextResponse.json({ error: 'Direct delivery failed. Please use the email fallback.' }, { status: 502 });
  return NextResponse.json({ ok: true });
}
