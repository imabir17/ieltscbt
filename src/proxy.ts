import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './lib/auth/session';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes
  if (
    pathname.startsWith('/login') || 
    pathname.startsWith('/signup') || 
    pathname === '/' || 
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next();
  }

  const session = await getSession();
  
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // RBAC
  if (pathname.startsWith('/superadmin') && session.role !== 'superadmin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname.startsWith('/center') && session.role !== 'center_staff') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname.startsWith('/student') && session.role !== 'student') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
