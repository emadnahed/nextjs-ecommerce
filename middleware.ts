import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: [
    "/",
    "/shop(.*)",
    "/product(.*)",
    "/api/product(.*)",
    "/api/images(.*)",
    "/api/webhook(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/featured(.*)",
    "/cart(.*)",
  ],
  afterAuth(auth, req) {
    // Allow authenticated users to access admin routes
    // The actual admin check happens in the admin layout using the email whitelist
    if (auth.userId && req.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.next();
    }

    // If user is not authenticated and trying to access admin, redirect to sign-in
    if (!auth.userId && req.nextUrl.pathname.startsWith('/admin')) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
  },
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
