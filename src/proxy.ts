// middleware.ts (Root of your project)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('__session')?.value;
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const isProjectsRoute = request.nextUrl.pathname.startsWith('/projects');

  if ((isDashboardRoute || isProjectsRoute) && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/projects/:path*'],
};