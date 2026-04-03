/**
 * Client-side rate limiting utility
 * Prevents users from spamming actions
 */

interface RateLimitConfig {
  maxAttempts: number;
  message?: string;
  windowMs: number;
}

interface RateLimitState {
  attempts: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitState>();

/**
 * Check if an action is rate limited
 * @param key - Unique identifier for the action (e.g., 'like-article', 'post-comment')
 * @param config - Rate limit configuration
 * @returns Object with isLimited flag and remaining time
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): { isLimited: boolean; remainingMs: number; message: string } {
  const now = Date.now();
  const state = rateLimitStore.get(key);

  // No previous attempts or window expired
  if (!state || now >= state.resetAt) {
    rateLimitStore.set(key, {
      attempts: 1,
      resetAt: now + config.windowMs,
    });
    return { isLimited: false, remainingMs: 0, message: '' };
  }

  // Increment attempts
  state.attempts += 1;

  // Check if limit exceeded
  if (state.attempts > config.maxAttempts) {
    const remainingMs = state.resetAt - now;
    const remainingSec = Math.ceil(remainingMs / 1000);
    const message =
      config.message || `Too many attempts. Please wait ${remainingSec} second${remainingSec > 1 ? 's' : ''}.`;

    return { isLimited: true, remainingMs, message };
  }

  rateLimitStore.set(key, state);
  return { isLimited: false, remainingMs: 0, message: '' };
}

/**
 * Reset rate limit for a specific key
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Clear all rate limits
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear();
}

/**
 * Common rate limit configurations
 */
export const RATE_LIMITS = {
  // Like/reaction actions: 5 per 10 seconds
  LIKE: { maxAttempts: 5, windowMs: 10_000 },

  // Comment posting: 3 per 30 seconds
  COMMENT: { maxAttempts: 3, windowMs: 30_000 },

  // Message posting: 2 per 20 seconds
  MESSAGE: { maxAttempts: 2, windowMs: 20_000 },

  // Search queries: 10 per 5 seconds
  SEARCH: { maxAttempts: 10, windowMs: 5000 },

  // Form submissions: 3 per minute
  FORM_SUBMIT: { maxAttempts: 3, windowMs: 60_000 },
} as const;
