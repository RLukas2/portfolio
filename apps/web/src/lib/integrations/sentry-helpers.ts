/**
 * Sentry Helper Functions
 *
 * Utility functions for working with Sentry error tracking
 */

// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/tanstackstart-react';

/**
 * Capture an exception with additional context
 *
 * @param error - The error to capture
 * @param context - Additional context information
 * @param level - Severity level (default: 'error')
 */
export function captureException(
  error: unknown,
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
    user?: { id?: string; email?: string; username?: string };
  },
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'error',
) {
  if (!isSentryEnabled()) {
    return;
  }

  Sentry.withScope((scope) => {
    // Set level
    scope.setLevel(level);

    // Add tags
    if (context?.tags) {
      for (const [key, value] of Object.entries(context.tags)) {
        scope.setTag(key, value);
      }
    }

    // Add extra context
    if (context?.extra) {
      for (const [key, value] of Object.entries(context.extra)) {
        scope.setExtra(key, value);
      }
    }

    // Set user context
    if (context?.user) {
      scope.setUser(context.user);
    }

    // Capture the exception
    Sentry.captureException(error);
  });
}

/**
 * Capture a message with additional context
 *
 * @param message - The message to capture
 * @param level - Severity level (default: 'info')
 * @param context - Additional context information
 */
export function captureMessage(
  message: string,
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info',
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
  },
) {
  if (!isSentryEnabled()) {
    return;
  }

  Sentry.withScope((scope) => {
    // Set level
    scope.setLevel(level);

    // Add tags
    if (context?.tags) {
      for (const [key, value] of Object.entries(context.tags)) {
        scope.setTag(key, value);
      }
    }

    // Add extra context
    if (context?.extra) {
      for (const [key, value] of Object.entries(context.extra)) {
        scope.setExtra(key, value);
      }
    }

    // Capture the message
    Sentry.captureMessage(message, level);
  });
}

/**
 * Check if Sentry is enabled
 */
export function isSentryEnabled(): boolean {
  return Boolean(process.env.VITE_SENTRY_DSN);
}

/**
 * Set user context for Sentry
 *
 * @param user - User information
 */
export function setUser(user: { id?: string; email?: string; username?: string } | null) {
  if (!isSentryEnabled()) {
    return;
  }

  Sentry.setUser(user);
}

/**
 * Add breadcrumb for debugging
 *
 * @param message - Breadcrumb message
 * @param category - Category (e.g., 'auth', 'navigation', 'http')
 * @param level - Severity level
 * @param data - Additional data
 */
export function addBreadcrumb(
  message: string,
  category?: string,
  level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info',
  data?: Record<string, unknown>,
) {
  if (!isSentryEnabled()) {
    return;
  }

  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
}
