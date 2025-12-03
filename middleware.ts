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
    "/api/debug-auth",
    "/api/debug-admin",
    "/api/health",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/sso-callback(.*)",
    "/featured(.*)",
    "/cart(.*)",
  ],
  // Store the original URL to redirect back after sign-in
  signInUrl: "/sign-in",
  afterAuth(auth, req) {
    const pathname = req.nextUrl.pathname;

    // Log middleware execution for admin routes
    if (pathname.startsWith('/admin')) {
      console.log('[Middleware] Admin route accessed:', {
        pathname,
        userId: auth.userId,
        host: req.headers.get('host'),
        protocol: req.headers.get('x-forwarded-proto'),
        url: req.url,
        nextUrl: req.nextUrl.href,
      });
    }

    // Allow authenticated users to access admin routes
    // The actual admin check happens in the admin layout using the email whitelist
    if (auth.userId && pathname.startsWith('/admin')) {
      console.log('[Middleware] Authenticated user accessing admin, allowing through');
      return NextResponse.next();
    }

    // If user is not authenticated and trying to access admin, redirect to sign-in
    if (!auth.userId && pathname.startsWith('/admin')) {
      // Get the proper origin from headers or fallback to production domain
      const host = req.headers.get('host') || 'www.zeyrey.online';
      const protocol = req.headers.get('x-forwarded-proto') || 'https';
      const origin = `${protocol}://${host}`;

      const signInUrl = new URL('/sign-in', origin);
      const redirectUrl = `${origin}${pathname}`;
      signInUrl.searchParams.set('redirect_url', redirectUrl);

      console.log('[Middleware] Unauthenticated admin access, redirecting:', {
        from: req.url,
        to: signInUrl.href,
        redirectUrl,
      });

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
