/**
 * Server-side Rate Limiting Utility
 *
 * Provides in-memory rate limiting based on IP addresses for API routes.
 * For production with multiple server instances, consider using Redis.
 */

interface RateLimitConfig {
  maxRequests: number; // Maximum requests per window
  windowMs: number; // Time window in milliseconds
}

interface RateLimitStore {
  lastCleanup: number;
  requests: number[];
}

class RateLimiter {
  private readonly store = new Map<string, RateLimitStore>();
  private readonly config: RateLimitConfig;
  private readonly cleanupInterval: number;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.cleanupInterval = config.windowMs * 2; // Cleanup every 2x window
    this.startCleanup();
  }

  /**
   * Check if a key (usually IP) has exceeded rate limit
   */
  isRateLimited(key: string): boolean {
    const now = Date.now();
    const store = this.store.get(key);

    if (!store) {
      // First request from this key
      this.store.set(key, {
        requests: [now],
        lastCleanup: now,
      });
      return false;
    }

    // Filter out old requests outside the time window
    const recentRequests = store.requests.filter((timestamp) => now - timestamp < this.config.windowMs);

    if (recentRequests.length >= this.config.maxRequests) {
      return true;
    }

    // Update store with new request
    recentRequests.push(now);
    this.store.set(key, {
      requests: recentRequests,
      lastCleanup: now,
    });

    return false;
  }

  /**
   * Get remaining requests for a key
   */
  getRemaining(key: string): number {
    const now = Date.now();
    const store = this.store.get(key);

    if (!store) {
      return this.config.maxRequests;
    }

    const recentRequests = store.requests.filter((timestamp) => now - timestamp < this.config.windowMs);

    return Math.max(0, this.config.maxRequests - recentRequests.length);
  }

  /**
   * Get time until rate limit resets (in milliseconds)
   */
  getResetTime(key: string): number {
    const store = this.store.get(key);
    if (!store || store.requests.length === 0) {
      return 0;
    }

    const oldestRequest = Math.min(...store.requests);
    const resetTime = oldestRequest + this.config.windowMs;
    return Math.max(0, resetTime - Date.now());
  }

  /**
   * Manually reset rate limit for a key
   */
  reset(key: string): void {
    this.store.delete(key);
  }

  /**
   * Periodic cleanup of old entries
   */
  private startCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, store] of this.store.entries()) {
        // Remove entries that haven't been accessed in 2x window
        if (now - store.lastCleanup > this.cleanupInterval) {
          this.store.delete(key);
        }
      }
    }, this.cleanupInterval);
  }

  /**
   * Get configuration (for headers)
   */
  getConfig(): RateLimitConfig {
    return this.config;
  }

  /**
   * Get current store size (for monitoring)
   */
  getStoreSize(): number {
    return this.store.size;
  }
}

/**
 * Extract client IP from request
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare

  return cfConnectingIp || forwarded?.split(',')[0].trim() || realIp || 'unknown';
}

/**
 * Create rate limit response with standard headers
 */
export function createRateLimitResponse(
  limiter: RateLimiter,
  key: string,
  message = 'Too many requests. Please try again later.',
): Response {
  const resetTime = limiter.getResetTime(key);
  const retryAfter = Math.ceil(resetTime / 1000); // Convert to seconds

  return new Response(
    JSON.stringify({
      error: message,
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Limit': limiter.getConfig().maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(Date.now() + resetTime).toISOString(),
      },
    },
  );
}

/**
 * Get rate limit headers for use with handleApiError
 */
export function getRateLimitHeaders(limiter: RateLimiter, key: string): Record<string, string> {
  const resetTime = limiter.getResetTime(key);
  const retryAfter = Math.ceil(resetTime / 1000);

  return {
    'Retry-After': retryAfter.toString(),
    'X-RateLimit-Limit': limiter.getConfig().maxRequests.toString(),
    'X-RateLimit-Remaining': '0',
    'X-RateLimit-Reset': new Date(Date.now() + resetTime).toISOString(),
  };
}

// Pre-configured rate limiters for different API endpoints
export const rateLimiters = {
  // Contact form: 3 requests per minute
  contact: new RateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 3,
  }),

  // AI Chat: 10 requests per minute
  chat: new RateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 10,
  }),

  // Strict: 5 requests per minute
  strict: new RateLimiter({
    windowMs: 60 * 1000,
    maxRequests: 5,
  }),
};

export default RateLimiter;
