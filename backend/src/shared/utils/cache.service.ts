import redisClient from "../../config/redis";
import config from "../../config";

class CacheService {
  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error for key "%s":', key, error);
      return null;
    }
  }

  /**
   * Set value in cache with TTL
   */
  async set(
    key: string,
    value: unknown,
    ttl: number = config.cache.ttl.medium,
  ): Promise<void> {
    try {
      await redisClient.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error for key "%s":', key, error);
    }
  }

  /**
   * Set value without TTL (permanent until explicitly deleted)
   */
  async setPermanent(key: string, value: unknown): Promise<void> {
    try {
      await redisClient.set(key, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set permanent error for key "%s":', key, error);
    }
  }

  /**
   * Delete key from cache
   */
  async del(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error('Cache delete error for key "%s":', key, error);
    }
  }

  /**
   * Delete multiple keys
   */
  async delMany(keys: string[]): Promise<void> {
    try {
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
    } catch (error) {
      console.error(`Cache delete many error:`, error);
    }
  }

  /**
   * Delete keys by pattern (use with caution!)
   */
  async delPattern(pattern: string): Promise<number> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(...keys);
        return keys.length;
      }
      return 0;
    } catch (error) {
      console.error(`Cache delete pattern error for "${pattern}":`, error);
      return 0;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Cache exists error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Get TTL of a key (in seconds)
   */
  async ttl(key: string): Promise<number> {
    try {
      return await redisClient.ttl(key);
    } catch (error) {
      console.error(`Cache TTL error for key "${key}":`, error);
      return -1;
    }
  }

  /**
   * Set expiry on existing key
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const result = await redisClient.expire(key, seconds);
      return result === 1;
    } catch (error) {
      console.error(`Cache expire error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Increment counter (atomic operation)
   */
  async incr(key: string, ttl?: number): Promise<number> {
    try {
      const value = await redisClient.incr(key);
      if (ttl) {
        await redisClient.expire(key, ttl);
      }
      return value;
    } catch (error) {
      console.error(`Cache incr error for key "${key}":`, error);
      return 0;
    }
  }

  /**
   * Decrement counter (atomic operation)
   */
  async decr(key: string): Promise<number> {
    try {
      return await redisClient.decr(key);
    } catch (error) {
      console.error(`Cache decr error for key "${key}":`, error);
      return 0;
    }
  }

  /**
   * Add item to set
   */
  async sAdd(key: string, ...members: string[]): Promise<number> {
    try {
      return await redisClient.sadd(key, ...members);
    } catch (error) {
      console.error(`Cache sAdd error for key "${key}":`, error);
      return 0;
    }
  }

  /**
   * Remove item from set
   */
  async sRem(key: string, ...members: string[]): Promise<number> {
    try {
      return await redisClient.srem(key, ...members);
    } catch (error) {
      console.error(`Cache sRem error for key "${key}":`, error);
      return 0;
    }
  }

  /**
   * Check if item is in set
   */
  async sIsMember(key: string, member: string): Promise<boolean> {
    try {
      const result = await redisClient.sismember(key, member);
      return result === 1;
    } catch (error) {
      console.error(`Cache sIsMember error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Get all members of a set
   */
  async sMembers(key: string): Promise<string[]> {
    try {
      return await redisClient.smembers(key);
    } catch (error) {
      console.error(`Cache sMembers error for key "${key}":`, error);
      return [];
    }
  }

  /**
   * Get set cardinality (count)
   */
  async sCard(key: string): Promise<number> {
    try {
      return await redisClient.scard(key);
    } catch (error) {
      console.error(`Cache sCard error for key "${key}":`, error);
      return 0;
    }
  }

  /**
   * Clear all cache (use with EXTREME caution!)
   * Only available in development mode
   */
  async clearAll(): Promise<void> {
    if (config.env !== "production") {
      try {
        await redisClient.flushdb();
        console.log("🗑️  Redis cache cleared");
      } catch (error) {
        console.error("Cache clear all error:", error);
      }
    } else {
      console.warn("⚠️  Cannot clear cache in production mode");
    }
  }

  /**
   * Get Redis info
   */
  async getInfo(): Promise<string | null> {
    try {
      const info = await redisClient.info();
      return info;
    } catch (error) {
      console.error("Cache get info error:", error);
      return null;
    }
  }
}

export default new CacheService();
