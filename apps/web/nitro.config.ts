import { defineNitroConfig } from 'nitro/config';

/**
 * Nitro server configuration for apps/web
 *
 * Configures security headers, routing, and server behavior.
 * This runs on the server side and applies to all routes.
 */
export default defineNitroConfig({
  compatibilityDate: '2026-04-06',

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
          "connect-src 'self' https://api.github.com https://api.raindrop.io https://*.sentry.io https://us.i.posthog.com wss://vercel.live https://github-contributions-api.jogruber.de",
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

        // Enable browser XSS protection (modern recommendation is '0' to prevent abuse)
        'X-XSS-Protection': '0',

        // Control referrer information
        'Referrer-Policy': 'strict-origin-when-cross-origin',

        // Permissions Policy (formerly Feature Policy)
        'Permissions-Policy': ['camera=()', 'microphone=()', 'geolocation=()', 'payment=()', 'fullscreen=(self)'].join(
          ', ',
        ),

        // Force HTTPS and protect against downgrade attacks
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

        // Isolate browsing context to prevent cross-origin popups from accessing window (Safe out of the box usually)
        'Cross-Origin-Opener-Policy': 'same-origin',
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
