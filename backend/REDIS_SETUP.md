# Redis Integration Guide

## Overview

This guide covers how to integrate Redis into the Referral Network Hub backend for caching, session management, rate limiting, and queue management.

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Use Cases](#use-cases)
4. [Implementation Examples](#implementation-examples)

---

## Installation

### 1. Install Redis Server

**Windows:**

```powershell
# Using Chocolatey
choco install redis-64

# Or download from: https://github.com/microsoftarchive/redis/releases

# Start Redis Server
redis-server
```

**macOS:**

```bash
brew install redis
brew services start redis
```

**Linux:**

```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

### 2. Install Node.js Redis Clients

```bash
cd backend
npm install redis ioredis
npm install --save-dev @types/redis
```

**Packages:**

- `ioredis` - Robust Redis client with cluster support (recommended)
- `redis` - Official Redis client
- `connect-redis` - Express session store (optional)
- `bull` - Queue management (optional)
- `rate-limit-redis` - Rate limiting store (optional)

### 3. Verify Redis Connection

```bash
# Test Redis is running
redis-cli ping
# Should return: PONG
```

---

## Configuration

### 1. Update `.env.local`

Add Redis configuration:

```env
# ==========================================
# REDIS CONFIGURATION
# ==========================================
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_KEY_PREFIX=rnh:

# Redis Connection Pool
REDIS_MAX_RETRIES=3
REDIS_RETRY_DELAY=500
REDIS_CONNECT_TIMEOUT=10000

# Cache TTL (in seconds)
CACHE_TTL_SHORT=300      # 5 minutes
CACHE_TTL_MEDIUM=1800    # 30 minutes
CACHE_TTL_LONG=3600      # 1 hour
CACHE_TTL_DAY=86400      # 24 hours
```

### 2. Update `src/config/index.ts`

Add Redis configuration:

```typescript
redis: {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  keyPrefix: process.env.REDIS_KEY_PREFIX || 'rnh:',
  maxRetries: parseInt(process.env.REDIS_MAX_RETRIES || '3', 10),
  retryDelay: parseInt(process.env.REDIS_RETRY_DELAY || '500', 10),
  connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT || '10000', 10),
},
cache: {
  ttl: {
    short: parseInt(process.env.CACHE_TTL_SHORT || '300', 10),
    medium: parseInt(process.env.CACHE_TTL_MEDIUM || '1800', 10),
    long: parseInt(process.env.CACHE_TTL_LONG || '3600', 10),
    day: parseInt(process.env.CACHE_TTL_DAY || '86400', 10),
  },
},
```

### 3. Create `src/config/redis.ts`

```typescript
import Redis from "ioredis";
import config from "./index";

// Create Redis client
const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  db: config.redis.db,
  keyPrefix: config.redis.keyPrefix,
  maxRetriesPerRequest: config.redis.maxRetries,
  retryStrategy(times) {
    const delay = Math.min(times * config.redis.retryDelay, 2000);
    return delay;
  },
  reconnectOnError(err) {
    const targetError = "READONLY";
    if (err.message.includes(targetError)) {
      return true; // Reconnect on readonly error
    }
    return false;
  },
});

// Connection event handlers
redisClient.on("connect", () => {
  console.log("🔴 Redis connecting...");
});

redisClient.on("ready", () => {
  console.log("✅ Redis connected and ready");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

redisClient.on("close", () => {
  console.log("🔴 Redis connection closed");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await redisClient.quit();
  console.log("✅ Redis connection closed gracefully");
});

export default redisClient;
```

---

## Use Cases

### 1. **Caching**

- User profile data
- Organization details
- Referral listings
- API responses
- Database query results

### 2. **Session Management**

- Store user sessions
- Manage active sessions
- Session expiry
- Multi-device sessions

### 3. **Rate Limiting**

- API endpoint throttling
- Login attempt limiting
- Signup rate limiting
- Email sending limits

### 4. **Queue Management**

- Email sending queue
- Notification queue
- Background job processing
- Scheduled tasks

### 5. **Real-time Features**

- Pub/Sub messaging
- WebSocket state
- Live notifications
- Online user tracking

### 6. **Token Management**

- Refresh token storage
- Email verification tokens
- Password reset tokens
- Invite tokens

---

## Implementation Examples

### Example 1: Cache Service

Create `src/shared/utils/cache.service.ts`:

```typescript
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
      console.error("Cache get error:", error);
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set(
    key: string,
    value: any,
    ttl: number = config.cache.ttl.medium,
  ): Promise<void> {
    try {
      await redisClient.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error("Cache set error:", error);
    }
  }

  /**
   * Delete key from cache
   */
  async del(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error("Cache delete error:", error);
    }
  }

  /**
   * Delete keys by pattern
   */
  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
    } catch (error) {
      console.error("Cache delete pattern error:", error);
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
      console.error("Cache exists error:", error);
      return false;
    }
  }

  /**
   * Get TTL of a key
   */
  async ttl(key: string): Promise<number> {
    try {
      return await redisClient.ttl(key);
    } catch (error) {
      console.error("Cache TTL error:", error);
      return -1;
    }
  }

  /**
   * Clear all cache (use with caution!)
   */
  async clear(): Promise<void> {
    try {
      await redisClient.flushdb();
    } catch (error) {
      console.error("Cache clear error:", error);
    }
  }

  /**
   * Increment counter
   */
  async incr(key: string, ttl?: number): Promise<number> {
    try {
      const value = await redisClient.incr(key);
      if (ttl) {
        await redisClient.expire(key, ttl);
      }
      return value;
    } catch (error) {
      console.error("Cache incr error:", error);
      return 0;
    }
  }
}

export default new CacheService();
```

### Example 2: Caching Middleware

Create `src/shared/middleware/cache.middleware.ts`:

```typescript
import { Request, Response, NextFunction } from "express";
import cacheService from "../utils/cache.service";
import config from "../../config";

/**
 * Cache middleware for GET requests
 */
export const cacheMiddleware = (ttl: number = config.cache.ttl.medium) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    const cacheKey = `api:${req.originalUrl}`;

    try {
      // Check cache
      const cachedData = await cacheService.get(cacheKey);

      if (cachedData) {
        return res.json(cachedData);
      }

      // Store original res.json
      const originalJson = res.json.bind(res);

      // Override res.json
      res.json = (body: any) => {
        // Cache the response
        cacheService.set(cacheKey, body, ttl);
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error("Cache middleware error:", error);
      next();
    }
  };
};

/**
 * Clear cache by pattern
 */
export const clearCachePattern = async (pattern: string): Promise<void> => {
  await cacheService.delPattern(pattern);
};
```

### Example 3: Rate Limiting with Redis

Update your rate limiting to use Redis store:

```bash
npm install rate-limit-redis
```

Create `src/shared/middleware/rateLimiter.middleware.ts`:

```typescript
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../../config/redis";

/**
 * Global rate limiter
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per windowMs
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    client: redisClient,
    prefix: "rl:global:",
  }),
});

/**
 * Auth rate limiter (stricter)
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Max 5 login attempts per 15 minutes
  message: "Too many login attempts, please try again later.",
  skipSuccessfulRequests: true,
  store: new RedisStore({
    client: redisClient,
    prefix: "rl:auth:",
  }),
});

/**
 * API rate limiter
 */
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Max 60 requests per minute
  message: "API rate limit exceeded.",
  store: new RedisStore({
    client: redisClient,
    prefix: "rl:api:",
  }),
});
```

### Example 4: Session Management with Redis

```bash
npm install express-session connect-redis
npm install --save-dev @types/express-session
```

Create session configuration:

```typescript
import session from "express-session";
import RedisStore from "connect-redis";
import redisClient from "../../config/redis";
import config from "../../config";

export const sessionConfig = session({
  store: new RedisStore({
    client: redisClient,
    prefix: "sess:",
    ttl: config.session.expirySeconds,
  }),
  secret: config.jwt.accessTokenSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.env === "production",
    httpOnly: true,
    maxAge: config.session.expirySeconds * 1000,
  },
});
```

### Example 5: Using Cache in Controllers

Update `src/modules/auth/controllers/auth.controller.ts`:

```typescript
import cacheService from "../../../shared/utils/cache.service";
import config from "../../../config";

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const cacheKey = `user:profile:${userId}`;

    // Check cache first
    let user = await cacheService.get(cacheKey);

    if (!user) {
      // Fetch from database
      user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Store in cache for 5 minutes
      await cacheService.set(cacheKey, user, config.cache.ttl.short);
    }

    res.json({ user });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    // Update in database
    await User.update(updates, { where: { id: userId } });

    // Invalidate cache
    await cacheService.del(`user:profile:${userId}`);

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
```

### Example 6: Queue Management with Bull

```bash
npm install bull
npm install --save-dev @types/bull
```

Create `src/shared/queues/email.queue.ts`:

```typescript
import Bull from "bull";
import config from "../../config";

export const emailQueue = new Bull("email", {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
  },
  prefix: "queue:email:",
});

// Process email jobs
emailQueue.process(async (job) => {
  const { to, subject, html } = job.data;

  // Send email logic here
  console.log(`Sending email to ${to}`);

  return { sent: true };
});

// Queue event handlers
emailQueue.on("completed", (job) => {
  console.log(`Email job ${job.id} completed`);
});

emailQueue.on("failed", (job, err) => {
  console.error(`Email job ${job.id} failed:`, err);
});

// Add email to queue
export const sendEmailAsync = async (
  to: string,
  subject: string,
  html: string,
) => {
  await emailQueue.add(
    { to, subject, html },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
    },
  );
};
```

---

## Integration Steps

### Step 1: Update `src/app.ts`

```typescript
import redisClient from "./config/redis";

// Test Redis connection
async function connectRedis() {
  try {
    await redisClient.ping();
    console.log("✅ Redis health check passed");
  } catch (error) {
    console.error("❌ Redis health check failed:", error);
  }
}

// In startServer function
await connectRedis();
```

### Step 2: Apply Middleware

```typescript
import {
  globalRateLimiter,
  apiRateLimiter,
} from "./shared/middleware/rateLimiter.middleware";
import { cacheMiddleware } from "./shared/middleware/cache.middleware";

// Apply rate limiter globally
app.use(globalRateLimiter);

// Apply to API routes
app.use("/api", apiRateLimiter);

// Apply cache middleware to specific routes
app.get("/api/users/:id", cacheMiddleware(300), getUserController);
```

### Step 3: Update Environment Files

Add Redis config to `.env.example` and `.env.local`.

---

## Best Practices

1. **Key Naming Convention:**
   - Use prefixes: `rnh:user:123`, `rnh:session:abc`
   - Use colons for hierarchy: `rnh:cache:api:users:list`
   - Keep keys short but descriptive

2. **TTL Strategy:**
   - Short TTL (5 min): Frequently changing data
   - Medium TTL (30 min): Moderately stable data
   - Long TTL (1 hour): Stable data
   - Day TTL (24 hours): Very stable data

3. **Cache Invalidation:**
   - Invalidate on updates/deletes
   - Use pattern matching for bulk invalidation
   - Consider cache versioning

4. **Error Handling:**
   - Always handle Redis errors gracefully
   - Don't fail requests if cache fails
   - Log errors for monitoring

5. **Security:**
   - Use Redis password in production
   - Enable SSL/TLS for Redis connections
   - Restrict Redis access to backend only
   - Use different Redis DBs for different environments

6. **Monitoring:**
   - Monitor Redis memory usage
   - Track cache hit/miss rates
   - Monitor connection pool
   - Set up alerts for Redis failures

---

## Testing Redis

Create `src/scripts/test-redis.ts`:

```typescript
import redisClient from "../config/redis";

async function testRedis() {
  try {
    // Test connection
    const pong = await redisClient.ping();
    console.log("✅ Redis PING:", pong);

    // Test set/get
    await redisClient.set("test:key", "test value", "EX", 10);
    const value = await redisClient.get("test:key");
    console.log("✅ Redis GET:", value);

    // Test delete
    await redisClient.del("test:key");
    console.log("✅ Redis DEL: success");

    // Close connection
    await redisClient.quit();
    process.exit(0);
  } catch (error) {
    console.error("❌ Redis test failed:", error);
    process.exit(1);
  }
}

testRedis();
```

Run: `npx ts-node src/scripts/test-redis.ts`

---

## Production Considerations

1. **Redis Cluster:** For high availability
2. **Persistence:** Enable RDB/AOF persistence
3. **Memory Management:** Set maxmemory and eviction policy
4. **Monitoring:** Use Redis monitoring tools
5. **Backup:** Regular Redis backups
6. **Scaling:** Consider Redis Sentinel or Cluster

---

## Quick Start Commands

```bash
# Install dependencies
npm install ioredis redis connect-redis rate-limit-redis bull

# Start Redis
redis-server

# Test Redis
redis-cli ping

# Monitor Redis
redis-cli monitor
```

---

## Resources

- [Redis Documentation](https://redis.io/docs/)
- [ioredis Documentation](https://github.com/luin/ioredis)
- [Bull Queue Documentation](https://github.com/OptimalBits/bull)
- [Rate Limit Redis](https://github.com/wyattjoh/rate-limit-redis)
