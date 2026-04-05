import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod/v4';

/**
 * Client-side environment variables.
 *
 * All variables here must be prefixed with VITE_ so Vite inlines them at build time.
 * These are safe to expose to the browser — do NOT put secrets here.
 *
 * Uses `import.meta.env` as the runtime source (Vite's client-side env object).
 */
export const env = createEnv({
  shared: {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  },
  server: {},
  clientPrefix: 'VITE_',
  client: {
    // Canonical app URL — used for OAuth redirect URIs and canonical links.
    VITE_APP_URL: z.url().optional(),

    // App title shown in the browser tab and meta tags.
    VITE_APP_TITLE: z.string().min(1).optional(),

    // Sentry DSN for client-side error reporting.
    VITE_SENTRY_DSN: z.string().min(1).optional(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === 'lint',
});
