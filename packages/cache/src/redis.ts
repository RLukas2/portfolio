/**
 * Redis cache implementation using Upstash
 * Environment-aware with in-memory fallback for dev/test
 */

import { Redis } from '@upstash/redis';

const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

// In-memory cache for dev/test environments
const devCache = new Map<string, { value: unknown; expires: number }>();

// Upstash Redis client (lazy initialization)
let redisClient: Redis | null = null;

/**
 * Initializes the Redis client
 * Only needed in production
 */
function getRedisClient(): Redis {
  if (!redisClient) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!(url && token)) {
      throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set in production');
    }

    redisClient = new Redis({
      url,
      token,
    });
  }

  return redisClient;
}

/**
 * Cache interface with environment-aware implementation
 */
export const cache = {
  /**
   * Gets a value from cache
   * Returns null if not found or expired
   *
   * @example
   * ```typescript
   * const articles = await cache.get<Article[]>('articles:public');
   * if (!articles) {
   *   articles = await db.query.articles.findMany();
   *   await cache.set('articles:public', articles, 300);
   * }
   * ```
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      // In dev/test: use in-memory cache
      if (isDev || isTest) {
        const cached = devCache.get(key);
        if (cached && cached.expires > Date.now()) {
          return cached.value as T;
        }
        devCache.delete(key);
        return null;
      }

      // In prod: use Redis
      const redis = getRedisClient();
      return await redis.get<T>(key);
    } catch (error) {
      console.error('[Cache] Get error:', error);
      return null;
    }
  },

  /**
   * Sets a value in cache with optional TTL
   * In dev/test: max TTL is 10 seconds to avoid stale data
   *
   * @example
   * ```typescript
   * await cache.set('articles:public', articles, 300); // 5 minutes
   * ```
   */
  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    try {
      // In dev/test: use in-memory cache with max 10 second TTL
      if (isDev || isTest) {
        const maxTtl = 10; // 10 seconds max in dev
        const ttl = ttlSeconds ? Math.min(ttlSeconds, maxTtl) : maxTtl;
        devCache.set(key, {
          value,
          expires: Date.now() + ttl * 1000,
        });
        return;
      }

      // In prod: use Redis
      const redis = getRedisClient();
      if (ttlSeconds) {
        await redis.set(key, value, { ex: ttlSeconds });
      } else {
        await redis.set(key, value);
      }
    } catch (error) {
      console.error('[Cache] Set error:', error);
    }
  },

  /**
   * Deletes a value from cache
   *
   * @example
   * ```typescript
   * await cache.del('articles:public');
   * ```
   */
  async del(key: string): Promise<void> {
    try {
      if (isDev || isTest) {
        devCache.delete(key);
        return;
      }

      const redis = getRedisClient();
      await redis.del(key);
    } catch (error) {
      console.error('[Cache] Delete error:', error);
    }
  },

  /**
   * Deletes multiple keys from cache
   *
   * @example
   * ```typescript
   * await cache.delMany(['articles:public', 'articles:slug:hello']);
   * ```
   */
  async delMany(keys: string[]): Promise<void> {
    try {
      if (isDev || isTest) {
        for (const key of keys) {
          devCache.delete(key);
        }
        return;
      }

      if (keys.length === 0) {
        return;
      }

      const redis = getRedisClient();
      await redis.del(...keys);
    } catch (error) {
      console.error('[Cache] Delete many error:', error);
    }
  },

  /**
   * Invalidates all keys matching a pattern
   * Uses SCAN in production for memory efficiency
   *
   * @example
   * ```typescript
   * await cache.invalidatePattern('articles:*');
   * ```
   */
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      if (isDev || isTest) {
        const keysToDelete: string[] = [];
        const regex = new RegExp(`^${pattern.replace(/\*/g, '.*').replace(/\?/g, '.')}$`);

        for (const key of devCache.keys()) {
          if (regex.test(key)) {
            keysToDelete.push(key);
          }
        }

        for (const key of keysToDelete) {
          devCache.delete(key);
        }
        return;
      }

      const redis = getRedisClient();
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('[Cache] Invalidate pattern error:', error);
    }
  },

  /**
   * Checks if a key exists in cache
   *
   * @example
   * ```typescript
   * if (await cache.exists('articles:public')) {
   *   // Key exists
   * }
   * ```
   */
  async exists(key: string): Promise<boolean> {
    try {
      if (isDev || isTest) {
        const cached = devCache.get(key);
        return cached !== undefined && cached.expires > Date.now();
      }

      const redis = getRedisClient();
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('[Cache] Exists error:', error);
      return false;
    }
  },

  /**
   * Gets the TTL (time to live) of a key in seconds
   * Returns -1 if key doesn't exist, -2 if no expiry
   *
   * @example
   * ```typescript
   * const ttl = await cache.ttl('articles:public');
   * console.log(`Key expires in ${ttl} seconds`);
   * ```
   */
  async ttl(key: string): Promise<number> {
    try {
      if (isDev || isTest) {
        const cached = devCache.get(key);
        if (!cached) {
          return -1;
        }
        const remaining = Math.floor((cached.expires - Date.now()) / 1000);
        return remaining > 0 ? remaining : -1;
      }

      const redis = getRedisClient();
      return await redis.ttl(key);
    } catch (error) {
      console.error('[Cache] TTL error:', error);
      return -1;
    }
  },

  /**
   * Clears all cache entries
   * ⚠️ Use with caution in production!
   *
   * @example
   * ```typescript
   * await cache.clear(); // Only in dev/test or with extreme caution
   * ```
   */
  async clear(): Promise<void> {
    try {
      if (isDev || isTest) {
        devCache.clear();
        return;
      }

      // In production, require explicit confirmation
      console.warn('[Cache] Clear all called in production!');
      const redis = getRedisClient();
      await redis.flushdb();
    } catch (error) {
      console.error('[Cache] Clear error:', error);
    }
  },

  /**
   * Gets cache statistics (dev/test only)
   */
  getStats(): { size: number; keys: string[] } | null {
    if (!(isDev || isTest)) {
      return null;
    }

    return {
      size: devCache.size,
      keys: Array.from(devCache.keys()),
    };
  },
};

/**
 * Cache wrapper with automatic serialization
 * Useful for caching function results
 *
 * @example
 * ```typescript
 * const getArticles = cached(
 *   'articles:public',
 *   async () => await db.query.articles.findMany(),
 *   300 // 5 minutes
 * );
 * ```
 */
export async function cached<T>(key: string, fn: () => Promise<T>, ttlSeconds?: number): Promise<T> {
  // Try to get from cache
  const cached = await cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Execute function and cache result
  const result = await fn();
  await cache.set(key, result, ttlSeconds);
  return result;
}
