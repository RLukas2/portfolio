/**
 * Sentry Client Instrumentation
 *
 * This file initializes Sentry for client-side error tracking and performance monitoring.
 * It should be called after the router is created on the client side.
 */

// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/tanstackstart-react';
import type { AnyRouter } from '@tanstack/react-router';
import { env } from './lib/env/client';

// Trace propagation target patterns (defined at top level for performance)
const TRACE_PROPAGATION_TARGETS = ['localhost'];

/**
 * Initializes Sentry on the client side with router integration
 * @param router - The TanStack Router instance
 */
export function initClientSentry(router: AnyRouter) {
  const dsn = env.VITE_SENTRY_DSN;

  // Only initialize if DSN is provided
  if (!dsn) {
    console.warn('[Sentry] Client DSN not configured, skipping initialization');
    return;
  }

  try {
    Sentry.init({
      dsn,

      // Router integration for performance monitoring
      integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router), Sentry.browserTracingIntegration()],

      // Sample rates (lower in production to reduce costs)
      tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
      profileSessionSampleRate: import.meta.env.PROD ? 0.1 : 1.0,

      // Configuration
      profileLifecycle: 'trace',
      sendDefaultPii: true,
      environment: import.meta.env.MODE,
      debug: import.meta.env.DEV,

      // Trace propagation targets
      tracePropagationTargets: TRACE_PROPAGATION_TARGETS,
    });

    console.log('[Sentry] Client initialized successfully');
  } catch (error) {
    console.error('[Sentry] Failed to initialize:', error);
  }
}
