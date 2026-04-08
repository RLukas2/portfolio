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
    // --- Email (Resend) ---
    // https://resend.com/docs/introduction
    RESEND_FROM_EMAIL: z.email().optional(),
    RESEND_API_KEY: z.string().min(1).optional(),

    // --- Error tracking (Sentry) ---
    // https://docs.sentry.io
    SENTRY_AUTH_TOKEN: z.string().optional(),
    SENTRY_ORG: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),

    // --- File storage (Vercel Blob) ---
    // https://vercel.com/docs/storage/vercel-blob
    BLOB_READ_WRITE_TOKEN: z.string().optional(),

    // --- GitHub integration ---
    // Used for fetching public stats and contribution graph.
    // GITHUB_ACCESS_TOKEN is optional but recommended to avoid rate limiting.
    GITHUB_USERNAME: z.string().min(1).default('rlukas2'),
    // Note: GITHUB_ACCESS_TOKEN is declared in authEnv() — no need to redeclare here.

    // --- Bookmarks (Raindrop.io) ---
    // https://developer.raindrop.io
    RAINDROP_ACCESS_TOKEN: z.string().min(1).optional(),

    // --- AI (OpenAI) ---
    // https://platform.openai.com/docs
    OPENAI_API_KEY: z.string().min(1).optional(),

    // --- Scheduling (Calendly) ---
    // Public URL to the Calendly booking page, used in contact/services sections.
    CALENDLY_URL: z.url().optional(),
  },

  // Client-side variables must be prefixed with VITE_ to be exposed by Vite.
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
