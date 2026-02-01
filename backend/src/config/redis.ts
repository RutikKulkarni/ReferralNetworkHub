import Redis from "ioredis";
import config from "./index";

const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  db: config.redis.db,
  keyPrefix: config.redis.keyPrefix,
  maxRetriesPerRequest: config.redis.maxRetries,
  connectTimeout: config.redis.connectTimeout,
  retryStrategy(times) {
    const delay = Math.min(times * config.redis.retryDelay, 2000);
    return delay;
  },
  reconnectOnError(err) {
    const targetError = "READONLY";
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  },
  lazyConnect: true,
});

redisClient.on("connect", () => {
  if (config.env === "development") {
    console.log("Redis connecting...");
  }
});

redisClient.on("ready", () => {
  console.log(
    `Redis connected: ${config.redis.host}:${config.redis.port} (DB: ${config.redis.db})`,
  );
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err.message);
});

redisClient.on("close", () => {
  if (config.env === "development") {
    console.log("Redis connection closed");
  }
});

export async function testRedisConnection(): Promise<void> {
  try {
    if (redisClient.status === "ready") {
      console.log(
        `Redis already connected: ${config.redis.host}:${config.redis.port} (DB: ${config.redis.db})`,
      );
      return;
    }

    if (redisClient.status === "wait") {
      console.log("Connecting to Redis...");
      await redisClient.connect();
    }

    await redisClient.ping();
  } catch (error) {
    console.error("Redis connection failed:", error);
    throw error;
  }
}

export async function closeRedisConnection(): Promise<void> {
  try {
    await redisClient.quit();
    console.log("Redis connection closed gracefully");
  } catch (error) {
    console.error("Error closing Redis connection:", error);
    throw error;
  }
}

process.on("SIGINT", async () => {
  await closeRedisConnection();
});

process.on("SIGTERM", async () => {
  await closeRedisConnection();
});

export default redisClient;
