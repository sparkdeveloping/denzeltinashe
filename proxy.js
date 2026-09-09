import { NextResponse } from 'next/server';

export function proxy(request) {
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0].toLowerCase();
  const { pathname } = request.nextUrl;

  if (!hostname.startsWith('clients.')) return NextResponse.next();

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/client/') ||
    pathname.startsWith('/work/') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/clients')
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? '/clients' : `/clients${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!.*\\.).*)', '/'],
};
