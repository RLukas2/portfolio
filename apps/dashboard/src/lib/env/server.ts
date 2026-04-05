import { createEnv } from '@t3-oss/env-core';
import { vercel } from '@t3-oss/env-core/presets-zod';
import { apiEnv } from '@xbrk/api/env';
import { authEnv } from '@xbrk/auth/env';
import { dbEnv } from '@xbrk/db/env';
import { z } from 'zod/v4';

/**
 * Server-side environment variables.
 *
 * Extends shared envs from packages:
 *  - authEnv  → BETTER_AUTH_SECRET, BETTER_AUTH_URL, OAuth provider keys, GITHUB_ACCESS_TOKEN
 *  - dbEnv    → DATABASE_URL
 *  - apiEnv   → IP_ADDRESS_SALT
 *  - vercel() → VERCEL, VERCEL_URL, VERCEL_ENV, etc. (injected automatically on Vercel)
 *
 * Only accessible in server-side code (API routes, server functions, loaders).
 * Do NOT import this in client components.
 */
export const env = createEnv({
  extends: [authEnv(), dbEnv(), apiEnv(), vercel()],
  shared: {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  },
  server: {
    // --- Error tracking (Sentry) ---
    // https://docs.sentry.io
    SENTRY_AUTH_TOKEN: z.string().optional(),
    SENTRY_ORG: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),

    // --- File storage (Vercel Blob) ---
    // https://vercel.com/docs/storage/vercel-blob
    BLOB_READ_WRITE_TOKEN: z.string().optional(),

    // --- AI (OpenAI) ---
    // https://platform.openai.com/docs
    OPENAI_API_KEY: z.string().min(1).optional(),
  },
  clientPrefix: 'VITE_',
  client: {
    // Canonical app URL — used for OAuth redirect URIs and canonical links.
    VITE_APP_URL: z.url().optional(),

    // Sentry DSN for client-side error reporting.
    VITE_SENTRY_DSN: z.string().min(1).optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === 'lint',
});
