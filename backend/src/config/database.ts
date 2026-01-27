/**
 * Database Configuration
 * Sequelize ORM setup with PostgreSQL
 */

import { Sequelize } from "sequelize";
import config from "./index";

const sequelize = new Sequelize({
  dialect: "postgres",
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  username: config.database.user,
  password: config.database.password,
  pool: {
    max: config.database.pool.max,
    min: config.database.pool.min,
    acquire: config.database.pool.acquire,
    idle: config.database.pool.idle,
  },
  logging: config.env === "development" ? console.log : false,
  timezone: "+00:00", // UTC
  define: {
    underscored: true, // Use snake_case for column names
    timestamps: true, // Add createdAt and updatedAt
    freezeTableName: true, // Use singular table names
  },
  benchmark: config.env === "development",
});

/**
 * Test database connection
 */
export async function testConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    throw error;
  }
}

/**
 * Sync database (create tables)
 */
export async function syncDatabase(force = false): Promise<void> {
  try {
    if (force && config.env === "production") {
      throw new Error("Cannot force sync database in production!");
    }

    await sequelize.sync({ force, alter: config.env === "development" });
    console.log("✅ Database synchronized successfully");
  } catch (error) {
    console.error("❌ Database synchronization failed:", error);
    throw error;
  }
}

/**
 * Close database connection
 */
export async function closeConnection(): Promise<void> {
  try {
    await sequelize.close();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error closing database connection:", error);
    throw error;
  }
}

export default sequelize;
