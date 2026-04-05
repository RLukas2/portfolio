/**
 * Sentry Server Instrumentation
 *
 * This file initializes Sentry for server-side error tracking.
 * It must be imported before any other code to ensure proper instrumentation.
 */

import { init as initSentry } from '@sentry/tanstackstart-react';
import { env } from './lib/env/server';

// Get DSN from environment
const dsn = env.VITE_SENTRY_DSN;

// Only initialize if DSN is provided
if (dsn) {
  try {
    initSentry({
      dsn,

      // Sample rates (lower in production to reduce costs)
      tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
      profileSessionSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,

      // Configuration
      profileLifecycle: 'trace',
      sendDefaultPii: true,
      environment: env.NODE_ENV,
      debug: env.NODE_ENV === 'development',

      // Trace propagation targets
      tracePropagationTargets: ['localhost', /^https:\/\/cms\.naurislinde\.dev\//, /^https:\/\/.*\.vercel\.app\//],
    });

    console.log('[Sentry] Server initialized successfully');
  } catch (error) {
    console.error('[Sentry] Failed to initialize:', error);
  }
} else {
  console.warn('[Sentry] DSN not configured, skipping initialization');
}
