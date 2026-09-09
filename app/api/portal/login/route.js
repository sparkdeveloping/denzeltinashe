import { NextResponse } from 'next/server';
import { authenticateUser, setPortalSession } from '../../../../lib/portal/auth';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const body = await request.json();
    const user = authenticateUser(body.email, body.password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    await setPortalSession(user);
    const host = (request.headers.get('x-forwarded-host') || request.headers.get('host') || '').toLowerCase();
    const onClientSubdomain = host.startsWith('clients.');
    const redirect = user.role === 'client' && user.clientSlug
      ? `${onClientSubdomain ? '' : '/clients'}/${user.clientSlug}`
      : onClientSubdomain ? '/' : '/clients';

    return NextResponse.json({ ok: true, redirect });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to sign in.' }, { status: 500 });
  }
}
