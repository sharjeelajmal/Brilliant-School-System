import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const role = request.cookies.get('role')?.value;
  const path = request.nextUrl.pathname;

  // Pass the current path to the layout via headers
  const response = NextResponse.next();
  response.headers.set('x-pathname', path);

  if (!token && path !== '/login' && path !== '/sharyy326feesubmit') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && path === '/login') {
    if (role === 'admin') return NextResponse.redirect(new URL('/dashboard', request.url));
    if (role === 'teacher') return NextResponse.redirect(new URL('/attendance', request.url));
  }

  // Teacher Access Rules
  if (role === 'teacher') {
    if (path.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/attendance', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
