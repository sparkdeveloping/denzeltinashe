import crypto from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'dt_portal_session';
const SESSION_SECONDS = 60 * 60 * 24 * 7;

function base64url(value) {
  return Buffer.from(value).toString('base64url');
}

function fromBase64url(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function getSecret() {
  const secret = process.env.PORTAL_SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV !== 'production') return 'development-only-change-this-secret';
  throw new Error('PORTAL_SESSION_SECRET is required in production.');
}

function sign(payloadPart) {
  return crypto.createHmac('sha256', getSecret()).update(payloadPart).digest('base64url');
}

function safeEqual(a, b) {
  const first = Buffer.from(String(a));
  const second = Buffer.from(String(b));
  if (first.length !== second.length) return false;
  return crypto.timingSafeEqual(first, second);
}

export function getConfiguredUsers() {
  if (process.env.PORTAL_USERS_JSON) {
    try {
      const users = JSON.parse(process.env.PORTAL_USERS_JSON);
      if (!Array.isArray(users)) throw new Error('PORTAL_USERS_JSON must be an array.');
      return users;
    } catch (error) {
      throw new Error(`Invalid PORTAL_USERS_JSON: ${error.message}`);
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    return [
      {
        email: 'admin@local.dev',
        password: 'portal-dev-only',
        name: 'Denzel',
        role: 'owner',
      },
    ];
  }

  return [];
}

export function authenticateUser(email, password) {
  const normalized = String(email || '').trim().toLowerCase();
  const users = getConfiguredUsers();
  const user = users.find((item) => String(item.email || '').toLowerCase() === normalized);
  if (!user || !safeEqual(user.password || '', password || '')) return null;

  return {
    email: user.email,
    name: user.name || user.email,
    role: user.role === 'client' ? 'client' : 'owner',
    clientSlug: user.clientSlug || user.client || null,
  };
}

export function createSessionToken(user) {
  const payload = {
    ...user,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
  };
  const encoded = base64url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionToken(token) {
  if (!token || !token.includes('.')) return null;
  const [payloadPart, signature] = token.split('.');
  const expected = sign(payloadPart);
  if (!safeEqual(signature, expected)) return null;

  try {
    const payload = JSON.parse(fromBase64url(payloadPart));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getPortalSession() {
  const jar = await cookies();
  return verifySessionToken(jar.get(COOKIE_NAME)?.value);
}

export async function setPortalSession(user) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, createSessionToken(user), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_SECONDS,
  });
}

export async function clearPortalSession() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export async function portalBasePath() {
  const requestHeaders = await headers();
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host') || '';
  return host.toLowerCase().startsWith('clients.') ? '' : '/clients';
}

export async function requirePortalSession() {
  const session = await getPortalSession();
  if (!session) {
    const base = await portalBasePath();
    redirect(`${base}/login` || '/login');
  }
  return session;
}

export function isOwner(session) {
  return session?.role === 'owner';
}
