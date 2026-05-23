import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('admin_session');

  if (pathname.startsWith('/api/auth')) return NextResponse.next();
  if (!session && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
