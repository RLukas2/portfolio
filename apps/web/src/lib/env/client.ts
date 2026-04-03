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
    // App title shown in the browser tab and meta tags.
    VITE_APP_TITLE: z.string().min(1).optional(),

    // URL of the admin dashboard app (shown in the avatar dropdown for admins).
    VITE_DASHBOARD_URL: z.url().optional(),

    // --- Error tracking (Sentry) ---
    // https://docs.sentry.io
    VITE_SENTRY_DSN: z.string().min(1).optional(),

    // --- Analytics (PostHog) ---
    // https://posthog.com/docs/libraries/js
    VITE_POSTHOG_KEY: z.string().min(1).optional(),
    VITE_POSTHOG_HOST: z.url().default('https://us.i.posthog.com'),
  },

  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === 'lint',
});
