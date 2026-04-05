import { defineNitroConfig } from 'nitro/config';

/**
 * Nitro server configuration for apps/web
 *
 * Configures security headers, routing, and server behavior.
 * This runs on the server side and applies to all routes.
 */
export default defineNitroConfig({
  compatibilityDate: 'latest',

  // Security headers applied to all routes
  routeRules: {
    '/**': {
      headers: {
        // Content Security Policy - Prevents XSS attacks
        // Adjust these directives based on your actual needs
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://va.vercel-scripts.com https://vercel.live https://*.sentry.io https://us.i.posthog.com",
          "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
          "img-src 'self' data: https: blob:",
          "font-src 'self' data: https://cdn.jsdelivr.net",
          "connect-src 'self' https://api.github.com https://api.raindrop.io https://*.sentry.io https://us.i.posthog.com wss://vercel.live",
          "frame-src 'self' https://vercel.live",
          "media-src 'self' https:",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          'upgrade-insecure-requests',
        ].join('; '),

        // Prevent clickjacking attacks
        'X-Frame-Options': 'DENY',

        // Prevent MIME type sniffing
        'X-Content-Type-Options': 'nosniff',

        // Enable browser XSS protection
        'X-XSS-Protection': '1; mode=block',

        // Control referrer information
        'Referrer-Policy': 'strict-origin-when-cross-origin',

        // Permissions Policy (formerly Feature Policy)
        'Permissions-Policy': ['camera=()', 'microphone=()', 'geolocation=()', 'interest-cohort=()'].join(', '),
      },
    },

    // Stricter CSP for API routes (no inline scripts needed)
    '/api/**': {
      headers: {
        'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  },
});
