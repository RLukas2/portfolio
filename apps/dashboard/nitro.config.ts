import { defineNitroConfig } from 'nitro/config';

// ============================================================
// CSP Directive Builder
// Edit these arrays to manage allowed sources per directive.
// ============================================================

const isDev = process.env.NODE_ENV === 'development';

const CSP_SOURCES = {
  script: [
    // Sentry browser SDK
    'https://*.sentry.io',
  ],
  style: [] as string[],
  font: [] as string[],
  connect: [
    // Sentry error reporting
    'https://*.sentry.io',
    'https://*.ingest.sentry.io',
    // Vercel Blob storage (image uploads/reads)
    'https://*.vercel-storage.com',
    'https://blob.vercel-storage.com',
    // Better Auth (same origin, but explicit for clarity)
    "'self'",

    // Allow devtools WebSocket in development (TanStack Devtools, Vite HMR)
    ...(isDev ? ['ws://localhost:*', 'http://localhost:*'] : []),
  ],
  img: [
    // Vercel Blob CDN for uploaded images
    'https://*.vercel-storage.com',
    'https://blob.vercel-storage.com',
    // OAuth provider avatars
    'https://avatars.githubusercontent.com',
    'https://lh3.googleusercontent.com',
    'https://pbs.twimg.com',
    'https://platform-lookaside.fbsbx.com',
  ],
  frame: [] as string[],
};

function buildCsp(): string {
  const directives: string[] = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${CSP_SOURCES.script.join(' ')}`,
    `style-src 'self' 'unsafe-inline' ${CSP_SOURCES.style.join(' ')}`.trimEnd(),
    `img-src 'self' data: blob: ${CSP_SOURCES.img.join(' ')}`,
    `font-src 'self' data:`,
    `connect-src ${CSP_SOURCES.connect.join(' ')}`,
    `frame-src 'none'`,
    `worker-src 'self' blob:`,
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ];
  return directives.join('; ');
}

// ============================================================
// Security Headers
// ============================================================

const SECURITY_HEADERS = {
  'Content-Security-Policy': buildCsp(),
  // Prevent clickjacking (redundant with frame-ancestors but kept for older browsers)
  'X-Frame-Options': 'DENY',
  // Prevent MIME-type sniffing
  'X-Content-Type-Options': 'nosniff',
  // Disable legacy XSS auditor (can introduce vulnerabilities itself)
  'X-XSS-Protection': '0',
  // Limit referrer info sent to third parties
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Restrict browser feature access
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'fullscreen=(self)',
    'clipboard-read=(self)',
    'clipboard-write=(self)',
  ].join(', '),
  // Force HTTPS for 1 year (only applied by browsers over HTTPS)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  // Prevent this page from being opened in a popup by a cross-origin page
  'Cross-Origin-Opener-Policy': 'same-origin',
  // Prevent cross-origin reads of this page's resources
  'Cross-Origin-Resource-Policy': 'same-origin',
} as const;

// ============================================================
// Nitro Config
// ============================================================

export default defineNitroConfig({
  compatibilityDate: '2026-04-06',

  routeRules: {
    // Apply security headers to all routes
    '/**': {
      headers: SECURITY_HEADERS,
    },

    // Stricter CSP for API routes — no scripts, styles, or frames needed
    '/api/**': {
      headers: {
        'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '0',
        'Referrer-Policy': 'no-referrer',
      },
    },
  },
});
