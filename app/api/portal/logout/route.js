import { NextResponse } from 'next/server';
import { clearPortalSession } from '../../../../lib/portal/auth';

export const runtime = 'nodejs';

export async function POST(request) {
  await clearPortalSession();
  const host = (request.headers.get('x-forwarded-host') || request.headers.get('host') || '').toLowerCase();
  const location = host.startsWith('clients.') ? '/login' : '/clients/login';
  return NextResponse.redirect(new URL(location, request.url), 303);
}
