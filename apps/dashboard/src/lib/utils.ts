/**
 * Default port for local development
 */
const DEFAULT_PORT = 3001 as const;

/**
 * Get Base URL
 *
 * Determines the base URL for the application based on the environment.
 * Priority order:
 * 1. VITE_DASHBOARD_URL environment variable (if set)
 * 2. Browser window.location.origin (client-side)
 * 3. Vercel URL (if deployed on Vercel)
 * 4. Localhost with configured port (fallback)
 *
 * @returns The base URL for the application
 *
 * @example
 * ```ts
 * const url = getBaseUrl();
 * // Production: "https://cms.xbrk.dev"
 * // Development: "http://localhost:3001"
 * ```
 */
export const getBaseUrl = () => {
  if (import.meta.env.VITE_DASHBOARD_URL) {
    return import.meta.env.VITE_DASHBOARD_URL as string;
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Server-side only: Vercel injects VERCEL_URL as a process.env variable
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return `http://localhost:${process.env.PORT ?? DEFAULT_PORT}`;
};
