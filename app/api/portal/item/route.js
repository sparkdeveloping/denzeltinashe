import { NextResponse } from 'next/server';
import { getPortalSession } from '../../../../lib/portal/auth';
import { createId, getPortalData, savePortalData } from '../../../../lib/portal/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const COLLECTIONS = new Set(['meetings', 'requirements', 'tasks', 'documents', 'activity']);

function unauthorized() {
  return NextResponse.json({ error: 'Owner access required.' }, { status: 403 });
}

function findClient(data, slug) {
  return data.clients.find((client) => client.slug === slug || client.shortCode === slug);
}

function prefixFor(collection) {
  return {
    meetings: 'meeting',
    requirements: 'REQ',
    tasks: 'task',
    documents: 'doc',
    activity: 'activity',
  }[collection] || 'item';
}

function nextRequirementId(client) {
  const numbers = (client.requirements || [])
    .map((item) => Number(String(item.id || '').match(/(\d+)$/)?.[1] || 0))
    .filter(Boolean);
  const next = Math.max(0, ...numbers) + 1;
  return `QA-REQ-${String(next).padStart(3, '0')}`;
}

function normalizeItem(collection, raw, client) {
  const item = { ...raw };
  if (collection === 'requirements') {
    item.id = nextRequirementId(client);
    item.status = item.status || 'proposed';
    item.priority = item.priority || 'high';
  } else {
    item.id = createId(prefixFor(collection));
  }
  item.visibility = item.visibility === 'internal' ? 'internal' : 'client';
  if (collection === 'activity') item.date = new Date().toISOString();
  if (collection === 'tasks') item.status = item.status || 'todo';
  return item;
}

async function ownerSession() {
  const session = await getPortalSession();
  return session?.role === 'owner' ? session : null;
}

export async function POST(request) {
  if (!(await ownerSession())) return unauthorized();
  try {
    const body = await request.json();
    if (!COLLECTIONS.has(body.collection)) {
      return NextResponse.json({ error: 'Unsupported collection.' }, { status: 400 });
    }
    const data = await getPortalData();
    const client = findClient(data, body.clientSlug);
    if (!client) return NextResponse.json({ error: 'Client not found.' }, { status: 404 });

    if (!Array.isArray(client[body.collection])) client[body.collection] = [];
    const item = normalizeItem(body.collection, body.item || {}, client);
    client[body.collection].push(item);
    await savePortalData(data);
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Could not save item.' }, { status: 500 });
  }
}

export async function PATCH(request) {
  if (!(await ownerSession())) return unauthorized();
  try {
    const body = await request.json();
    if (!COLLECTIONS.has(body.collection)) {
      return NextResponse.json({ error: 'Unsupported collection.' }, { status: 400 });
    }
    const data = await getPortalData();
    const client = findClient(data, body.clientSlug);
    if (!client) return NextResponse.json({ error: 'Client not found.' }, { status: 404 });
    const collection = client[body.collection] || [];
    const index = collection.findIndex((item) => item.id === body.id);
    if (index < 0) return NextResponse.json({ error: 'Item not found.' }, { status: 404 });

    const allowedPatch = { ...(body.patch || {}) };
    delete allowedPatch.id;
    collection[index] = { ...collection[index], ...allowedPatch };
    await savePortalData(data);
    return NextResponse.json({ ok: true, item: collection[index] });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Could not update item.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!(await ownerSession())) return unauthorized();
  try {
    const body = await request.json();
    if (!COLLECTIONS.has(body.collection)) {
      return NextResponse.json({ error: 'Unsupported collection.' }, { status: 400 });
    }
    const data = await getPortalData();
    const client = findClient(data, body.clientSlug);
    if (!client) return NextResponse.json({ error: 'Client not found.' }, { status: 404 });
    const collection = client[body.collection] || [];
    const nextCollection = collection.filter((item) => item.id !== body.id);
    if (nextCollection.length === collection.length) {
      return NextResponse.json({ error: 'Item not found.' }, { status: 404 });
    }
    client[body.collection] = nextCollection;
    await savePortalData(data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Could not delete item.' }, { status: 500 });
  }
}
