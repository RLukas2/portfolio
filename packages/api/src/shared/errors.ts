// biome-ignore lint/performance/noNamespaceImport: Sentry SDK requires namespace import
import * as Sentry from '@sentry/node';

export function reportError(context: string, error: unknown): void {
  Sentry.captureException(error);
  console.error(`[${context}]`, error);
}
