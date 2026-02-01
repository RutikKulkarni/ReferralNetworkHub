import redisClient from "../config/redis";
import cacheService from "../shared/utils/cache.service";

async function testRedis() {
  console.log("\n🧪 Testing Redis Connection and Operations...\n");

  try {
    console.log("Testing connection...");
    await redisClient.connect();
    const pong = await redisClient.ping();
    console.log(`PING: ${pong}`);

    console.log("\n Testing basic operations...");
    await cacheService.set("test:hello", "world", 60);
    const value = await cacheService.get<string>("test:hello");
    console.log(`SET/GET: ${value}`);

    console.log("\n Testing TTL...");
    const ttl = await cacheService.ttl("test:hello");
    console.log(`TTL: ${ttl} seconds remaining`);

    console.log("\n Testing increment...");
    await cacheService.incr("test:counter", 60);
    const counter = await cacheService.incr("test:counter", 60);
    console.log(`INCR: counter = ${counter}`);

    console.log("\n Testing set operations...");
    await cacheService.sAdd("test:users", "user1", "user2", "user3");
    const members = await cacheService.sMembers("test:users");
    const count = await cacheService.sCard("test:users");
    console.log(`SET: ${count} members - [${members.join(", ")}]`);

    console.log("\n Testing exists...");
    const exists = await cacheService.exists("test:hello");
    console.log(`EXISTS: ${exists}`);

    console.log("\n Testing pattern deletion...");
    const deleted = await cacheService.delPattern("test:*");
    console.log(`DELETED: ${deleted} keys`);

    console.log("\n Redis Server Info:");
    const info = await redisClient.info("server");
    const lines = info
      .split("\r\n")
      .filter((line) => line && !line.startsWith("#"));
    lines.slice(0, 5).forEach((line) => {
      console.log(`${line}`);
    });

    console.log("\n All Redis tests passed!\n");

    // Close connection
    await redisClient.quit();
    process.exit(0);
  } catch (error) {
    console.error("\n Redis test failed:", error);
    await redisClient.quit();
    process.exit(1);
  }
}

// Run tests
testRedis();
