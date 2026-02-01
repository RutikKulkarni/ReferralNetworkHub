import { Request, Response, NextFunction } from "express";
import cacheService from "../utils/cache.service";
import config from "../../config";

/**
 * Cache middleware for GET requests
 * Caches successful responses and serves them on subsequent requests
 *
 * @param ttl - Time to live in seconds (default: medium TTL)
 * @param keyGenerator - Optional custom key generator function
 */
export const cacheMiddleware = (
  ttl: number = config.cache.ttl.medium,
  keyGenerator?: (req: Request) => string,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    // Generate cache key
    const cacheKey = keyGenerator
      ? keyGenerator(req)
      : `api:${req.originalUrl || req.url}`;

    try {
      // Check cache
      const cachedData = await cacheService.get(cacheKey);

      if (cachedData) {
        // Serve from cache
        return res.json(cachedData);
      }

      // Store original res.json function
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = (body: unknown) => {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          cacheService.set(cacheKey, body, ttl).catch((err) => {
            console.error("Failed to cache response:", err);
          });
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error("Cache middleware error:", error);
      // Continue without caching on error
      next();
    }
  };
};

/**
 * Clear cache by pattern
 * Useful for invalidating related cache entries
 *
 * @param pattern - Redis key pattern (e.g., "api:users:*")
 */
export const clearCachePattern = async (pattern: string): Promise<number> => {
  return await cacheService.delPattern(pattern);
};

/**
 * Clear cache for specific keys
 *
 * @param keys - Array of cache keys to delete
 */
export const clearCache = async (keys: string[]): Promise<void> => {
  await cacheService.delMany(keys);
};

/**
 * Generate cache key for user-specific data
 */
export const userCacheKey = (userId: string, resource: string): string => {
  return `user:${userId}:${resource}`;
};

/**
 * Generate cache key for organization-specific data
 */
export const orgCacheKey = (orgId: string, resource: string): string => {
  return `org:${orgId}:${resource}`;
};
