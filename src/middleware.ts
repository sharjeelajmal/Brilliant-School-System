import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const role = request.cookies.get('role')?.value;
  const path = request.nextUrl.pathname;

  if (!token && path !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && path === '/login') {
    if (role === 'admin') return NextResponse.redirect(new URL('/dashboard', request.url));
    if (role === 'teacher') return NextResponse.redirect(new URL('/attendance', request.url));
  }

  // Teacher Access Rules
  if (role === 'teacher') {
    // Agar teacher dashboard par jaye to attendance par bhejo
    if (path.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/attendance', request.url));
    }
    // Teacher sirf in routes par ja sakta hai
    if (!path.startsWith('/attendance') && !path.startsWith('/test-report')) {
       // Optional: Redirect to a default teacher page
    }
  }

  return NextResponse.next();
}

export const config = {
  // Matcher mein '/test-report' add kiya
  matcher: ['/dashboard/:path*', '/attendance/:path*', '/test-report/:path*', '/login'],
};