/**
 * HTTP Cache-Control header utilities
 * Environment-aware caching that respects dev/test/prod
 */

const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

/**
 * Predefined cache header configurations
 * - Development/Test: No caching (always fresh)
 * - Production: Aggressive caching with stale-while-revalidate
 */
export const CACHE_HEADERS = {
  /**
   * Static content (public articles, projects, etc.)
   * Dev: No cache
   * Prod: 1 hour CDN, 1 day stale-while-revalidate
   */
  static:
    isDev || isTest
      ? 'no-store, no-cache, must-revalidate, max-age=0'
      : 'public, s-maxage=3600, stale-while-revalidate=86400',

  /**
   * Dynamic content (frequently changing data)
   * Dev: No cache
   * Prod: 5 min CDN, 1 hour stale-while-revalidate
   */
  dynamic:
    isDev || isTest
      ? 'no-store, no-cache, must-revalidate, max-age=0'
      : 'public, s-maxage=300, stale-while-revalidate=3600',

  /**
   * Short-lived content (real-time data)
   * Dev: No cache
   * Prod: 1 min CDN, 5 min stale-while-revalidate
   */
  shortLived:
    isDev || isTest
      ? 'no-store, no-cache, must-revalidate, max-age=0'
      : 'public, s-maxage=60, stale-while-revalidate=300',

  /**
   * Private content (authenticated user data)
   * Dev: No cache
   * Prod: Browser cache only (1 min), no CDN cache
   */
  private:
    isDev || isTest
      ? 'private, no-store, no-cache, must-revalidate, max-age=0'
      : 'private, max-age=60, must-revalidate',

  /**
   * Never cache (auth endpoints, mutations)
   * Same in all environments
   */
  none: 'no-store, no-cache, must-revalidate, max-age=0',
} as const;

export type CacheHeaderType = keyof typeof CACHE_HEADERS;

/**
 * Options for creating custom cache headers
 */
export interface CacheHeaderOptions {
  /** Additional directives (optional) */
  directives?: string[];
  /** Max age in seconds for CDN/browser cache */
  maxAge: number;
  /** Stale-while-revalidate duration in seconds (optional) */
  swr?: number;
  /** Cache visibility: public (CDN) or private (browser only) */
  type: 'public' | 'private';
}

/**
 * Creates a custom Cache-Control header
 * Respects environment (no cache in dev/test)
 *
 * @example
 * ```typescript
 * const header = createCacheHeader({
 *   type: 'public',
 *   maxAge: 3600,
 *   swr: 86400,
 * });
 * // Production: "public, s-maxage=3600, stale-while-revalidate=86400"
 * // Development: "no-store, no-cache, must-revalidate, max-age=0"
 * ```
 */
export function createCacheHeader(options: CacheHeaderOptions): string {
  if (isDev || isTest) {
    return CACHE_HEADERS.none;
  }

  const { type, maxAge, swr, directives = [] } = options;
  const parts = [type, `s-maxage=${maxAge}`, ...directives];

  if (swr) {
    parts.push(`stale-while-revalidate=${swr}`);
  }

  return parts.join(', ');
}

/**
 * Adds cache headers to a Response object
 * Also adds Vary header for proper caching with different request headers
 *
 * @example
 * ```typescript
 * const response = new Response(JSON.stringify(data));
 * return withCacheHeaders(response, 'static');
 * ```
 */
export function withCacheHeaders(response: Response, cacheType: CacheHeaderType | string): Response {
  const headers = new Headers(response.headers);

  // Set Cache-Control header
  const cacheHeader = cacheType in CACHE_HEADERS ? CACHE_HEADERS[cacheType as CacheHeaderType] : cacheType;
  headers.set('Cache-Control', cacheHeader);

  // Add Vary header to ensure proper caching with different request headers
  if (!headers.has('Vary')) {
    headers.set('Vary', 'Accept-Encoding');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Creates a Response with cache headers
 * Convenience wrapper for JSON responses
 *
 * @example
 * ```typescript
 * return createCachedResponse(
 *   { data: articles },
 *   'static',
 *   200
 * );
 * ```
 */
export function createCachedResponse<T>(
  data: T,
  cacheType: CacheHeaderType,
  status = 200,
  additionalHeaders?: HeadersInit,
): Response {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Cache-Control': CACHE_HEADERS[cacheType],
    Vary: 'Accept-Encoding',
  });

  // Add any additional headers
  if (additionalHeaders) {
    const additional = new Headers(additionalHeaders);
    for (const [key, value] of additional.entries()) {
      headers.set(key, value);
    }
  }

  return new Response(JSON.stringify(data), { status, headers });
}

/**
 * Checks if caching is enabled in current environment
 */
export function isCachingEnabled(): boolean {
  return !(isDev || isTest);
}
