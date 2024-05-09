import dotenv from "dotenv";
import path from "path";
import Joi from "joi";

// Load environment variables from .env file -> outside src dir
dotenv.config({ path: path.join(__dirname, "../../.env") });

/**
 * Environment variables schema for configuration validation.
 * @type {import("joi").ObjectSchema}
 */
const envVarsSchema: import("joi").ObjectSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required()
      .description("Node environment"),
    PORT: Joi.number().default(3000).description("Port number"),
    MONGO_URI: Joi.string().required().description("Mongo DB URI"),
  })
  .unknown();

// Validate environment variables against the schema
const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error("Config validation error : " + error.message);
}

/**
 * Configuration object containing environment variables.
 * @typedef {Object} Config
 * @property {string | undefined} [NODE_ENV] - Server environment.
 * @property {string | undefined} [MONGO_URI] - MongoDB connection URI.
 * @property {string | undefined} [PORT] - Port number for the server.
 */
interface Config {
  NODE_ENV: string;
  MONGO_URI: string;
  PORT: number;
}

/**
 * Resolved configuration object with validated environment variables.
 * @type {Config}
 */
const config: Config = {
  NODE_ENV: envVars.NODE_ENV,
  PORT: envVars.PORT,
  MONGO_URI: envVars.MONGO_URI,
};

export { config };
