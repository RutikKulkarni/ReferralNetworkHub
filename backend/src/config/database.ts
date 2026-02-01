import { Sequelize } from "sequelize";
import config from "./index";
import { initModels } from "../database/models";

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
  logging: false, // Disable SQL query logging for cleaner console output
  timezone: "+00:00", // UTC
  define: {
    underscored: true, // Use snake_case for column names
    timestamps: true, // Add createdAt and updatedAt
    freezeTableName: true, // Use singular table names
  },
});

// Initialize all models
export const models = initModels(sequelize);

export async function testConnection(): Promise<void> {
  try {
    console.log("Connecting to database...");
    await sequelize.authenticate();
    console.log(
      `PostgreSQL connected: ${config.database.name}@${config.database.host}:${config.database.port}`,
    );
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

export async function syncDatabase(force = false): Promise<void> {
  try {
    if (force && config.env === "production") {
      throw new Error("Cannot force sync database in production!");
    }

    await sequelize.sync({ force, alter: config.env === "development" });
    console.log("Database synchronized successfully");
  } catch (error) {
    console.error("Database synchronization failed:", error);
    throw error;
  }
}

export async function closeConnection(): Promise<void> {
  try {
    await sequelize.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error closing database connection:", error);
    throw error;
  }
}

export { sequelize, models as DatabaseModels };
export default sequelize;
