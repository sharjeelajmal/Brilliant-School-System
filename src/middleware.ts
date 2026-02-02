import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('isLoggedIn');

  // Agar user dashboard par jana chahta hai aur cookie nahi hai -> Login par bhejo
  if (!isLoggedIn && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Agar user Login page par hai aur pehlay se Logged In hai -> Dashboard bhejo
  if (isLoggedIn && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Ye zaroori hai taake middleware sirf in paths par chalay (performance ke liye)
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};