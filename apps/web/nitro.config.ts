import { defineNitroConfig } from 'nitro/config';

// ============================================================
// CSP Directive Builder
// Edit these arrays to manage allowed sources per directive.
// ============================================================

const CSP_SOURCES = {
  script: [
    'https://cdn.jsdelivr.net',
    'https://va.vercel-scripts.com',
    'https://vercel.live',
    'https://*.sentry.io',
    'https://us.i.posthog.com',
    'https://us-assets.i.posthog.com',
  ],
  style: ['https://cdn.jsdelivr.net'],
  font: ['https://cdn.jsdelivr.net'],
  connect: [
    'https://api.github.com',
    'https://api.raindrop.io',
    'https://*.sentry.io',
    'https://us.i.posthog.com',
    'https://us-assets.i.posthog.com',
    'https://github-contributions-api.jogruber.de',
    'wss://vercel.live',
  ],
  frame: ['https://vercel.live'],
  worker: ['https://us-assets.i.posthog.com'],
};

function buildCsp(): string {
  const directives: string[] = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${CSP_SOURCES.script.join(' ')}`,
    `style-src 'self' 'unsafe-inline' ${CSP_SOURCES.style.join(' ')}`,
    "img-src 'self' data: https: blob:",
    `font-src 'self' data: ${CSP_SOURCES.font.join(' ')}`,
    `connect-src 'self' ${CSP_SOURCES.connect.join(' ')}`,
    `frame-src 'self' ${CSP_SOURCES.frame.join(' ')}`,
    `worker-src 'self' ${CSP_SOURCES.worker.join(' ')}`,
    "media-src 'self' https:",
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
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '0',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': ['camera=()', 'microphone=()', 'geolocation=()', 'payment=()', 'fullscreen=(self)'].join(', '),
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
} as const;

// ============================================================
// Nitro Config
// ============================================================

export default defineNitroConfig({
  compatibilityDate: '2026-04-06',

  routeRules: {
    '/**': {
      headers: SECURITY_HEADERS,
    },

    // Stricter CSP for API routes — no scripts or styles needed
    '/api/**': {
      headers: {
        'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  },
});
