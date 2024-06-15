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
      .valid("development", "deployment", "test")
      .required()
      .description("Node environment"),
    PORT: Joi.number().default(3000).description("Port number"),
    MONGO_URI: Joi.string().required().description("Mongo DB URI"),
    SECRET_KEY: Joi.string().required().description("Secret key"),
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
  MONGO_URI: string;
  PORT: number;
  SECRET_KEY: string;
  CLIENT_URL: string;
}

/**
 * Resolved configuration object with validated environment variables.
 * @type {Config}
 */
const config: Config = {
  PORT: envVars.PORT,
  MONGO_URI:
    envVars.NODE_ENV === "development"
      ? envVars.MONGO_URI
      : envVars.NODE_ENV === "deployment"
      ? envVars.REMOTE_MONGO_URI
      : "",
  SECRET_KEY: envVars.SECRET_KEY,
  CLIENT_URL:
    envVars.NODE_ENV === "development"
      ? envVars.CLIENT_URL
      : envVars.NODE_ENV === "deployment"
      ? envVars.REMOTE_CLIENT_URL
      : "",
};

export { config };
