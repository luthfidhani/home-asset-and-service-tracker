import { defineMiddleware } from 'astro:middleware';
import { getSession } from './lib/auth';

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/api/auth/login'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return next();
  }

  // Allow static assets
  if (pathname.startsWith('/_astro') || pathname.includes('.')) {
    return next();
  }

  // Check authentication for protected routes
  const session = await getSession(context.cookies);

  if (!session) {
    // Redirect to login if not authenticated
    return context.redirect('/login');
  }

  // Add session to locals for use in pages
  context.locals.session = session;
  context.locals.user = session.user;

  return next();
});

