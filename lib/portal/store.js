import { promises as fs } from 'node:fs';
import path from 'node:path';

const DATA_KEY = 'dt:client-portal:v1';
const DATA_FILE = process.env.PORTAL_DATA_PATH || path.join(process.cwd(), 'data', 'portal.json');

function hasUpstash() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function upstashCommand(command) {
  const response = await fetch(process.env.UPSTASH_REDIS_REST_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Persistent store error (${response.status}).`);
  }

  const payload = await response.json();
  if (payload.error) throw new Error(payload.error);
  return payload.result;
}

async function readFileStore() {
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

async function writeFileStore(data) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export async function getPortalData() {
  if (hasUpstash()) {
    const result = await upstashCommand(['GET', DATA_KEY]);
    if (result) return JSON.parse(result);

    const seed = await readFileStore();
    await upstashCommand(['SET', DATA_KEY, JSON.stringify(seed)]);
    return seed;
  }

  return readFileStore();
}

export async function savePortalData(data) {
  const next = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  if (hasUpstash()) {
    await upstashCommand(['SET', DATA_KEY, JSON.stringify(next)]);
    return next;
  }

  if (process.env.VERCEL && process.env.NODE_ENV === 'production') {
    throw new Error(
      'Persistent storage is not configured. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN before editing data in production.'
    );
  }

  await writeFileStore(next);
  return next;
}

export async function findClient(routeSlug) {
  const data = await getPortalData();
  const client = data.clients.find(
    (item) => item.slug === routeSlug || item.shortCode === routeSlug
  );
  return { data, client };
}

export function canAccessClient(session, client) {
  if (!session || !client) return false;
  if (session.role === 'owner') return true;
  return session.clientSlug === client.slug || session.clientSlug === client.shortCode;
}

export function clientVisibleItems(items = [], session) {
  if (session?.role === 'owner') return items;
  return items.filter((item) => item.visibility !== 'internal');
}

export function createId(prefix = 'item') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
