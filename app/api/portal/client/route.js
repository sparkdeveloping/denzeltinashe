import { NextResponse } from 'next/server';
import { getPortalSession } from '../../../../lib/portal/auth';
import { createId, getPortalData, savePortalData } from '../../../../lib/portal/store';

export const runtime = 'nodejs';

function cleanSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export async function POST(request) {
  const session = await getPortalSession();
  if (session?.role !== 'owner') {
    return NextResponse.json({ error: 'Owner access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const shortCode = cleanSlug(body.shortCode || name);
    if (!name || !shortCode) return NextResponse.json({ error: 'Client name and short code are required.' }, { status: 400 });

    const data = await getPortalData();
    if (data.clients.some((client) => client.shortCode === shortCode || client.slug === shortCode)) {
      return NextResponse.json({ error: 'That client code is already in use.' }, { status: 409 });
    }

    const slug = cleanSlug(name);
    const client = {
      id: createId('client'),
      slug,
      shortCode,
      name,
      projectName: String(body.projectName || 'Client Project').trim(),
      projectType: 'Client Engagement',
      status: String(body.status || 'Discovery').trim(),
      stage: 'discovery',
      accent: 'lime',
      summary: String(body.summary || '').trim(),
      facts: { employees: '—', teams: '—', founded: '—', leadership: '—', currentProcess: '—' },
      objective: String(body.summary || 'Define the client problem, scope the work and deliver the agreed outcome.').trim(),
      principles: ['What is happening?', 'Who is responsible?', 'What happens next?', 'Is anything stuck?'],
      workflow: ['Discovery', 'Scope', 'Design', 'Build', 'Review', 'Delivery'],
      progress: [
        { label: 'Discovery', value: 10 },
        { label: 'Requirements', value: 0 },
        { label: 'Design', value: 0 },
        { label: 'Development', value: 0 }
      ],
      nextActions: ['Schedule discovery', 'Capture source material', 'Define first milestone'],
      originalMeeting: {
        title: 'Initial Discovery',
        image: '',
        transcription: [],
        confirmedStatements: [],
        interpretation: 'Add your interpretation after the first discovery session.',
        uncertainNotes: []
      },
      deepDiveQuestions: {},
      meetings: [],
      requirements: [],
      mvp: { included: [], deferred: [], timeline: [], target: 'Timeline not set.' },
      tasks: [],
      documents: [],
      financials: {
        visibility: 'internal',
        estimateStatus: 'Not estimated.',
        workingRange: 'Not estimated',
        maintenanceRange: 'Not estimated',
        notes: []
      },
      activity: [
        { id: createId('activity'), date: new Date().toISOString(), text: 'Client workspace created.', type: 'system', visibility: 'internal' }
      ]
    };

    data.clients.push(client);
    await savePortalData(data);

    const host = (request.headers.get('x-forwarded-host') || request.headers.get('host') || '').toLowerCase();
    const base = host.startsWith('clients.') ? '' : '/clients';
    return NextResponse.json({ ok: true, client, path: `${base}/${shortCode}` });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Could not create client.' }, { status: 500 });
  }
}
