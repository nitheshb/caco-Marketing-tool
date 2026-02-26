import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/sign-in', '/sign-up', '/api/inngest', '/api/auth/cross-app'];

function isPublicRoute(pathname: string) {
  return publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/') || pathname.startsWith(route + '?'));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Public routes don't need auth
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check for session cookie (set by AuthProvider on client)
  const session = request.cookies.get('__session')?.value;

  if (!session) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Token is present — actual verification happens in API routes via getAuthUser()
  // Edge middleware can't run Firebase Admin SDK, so we just check cookie existence
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
