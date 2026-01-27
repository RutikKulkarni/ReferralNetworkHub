/**
 * Environment Configuration
 * Centralized configuration management with validation
 */

import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Validate required environment variables
 */
function validateEnv(): void {
  const required = [
    "NODE_ENV",
    "PORT",
    "DB_HOST",
    "DB_PORT",
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD",
    "JWT_ACCESS_TOKEN_SECRET",
    "JWT_REFRESH_TOKEN_SECRET",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }

  // Warn about default JWT secrets in production
  if (
    process.env.NODE_ENV === "production" &&
    (process.env.JWT_ACCESS_TOKEN_SECRET?.includes("your_") ||
      process.env.JWT_REFRESH_TOKEN_SECRET?.includes("your_"))
  ) {
    console.warn(
      "⚠️  WARNING: Using default JWT secrets in production! Please change them.",
    );
  }
}

// Validate on module load
validateEnv();

interface Config {
  env: string;
  port: number;
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    pool: {
      max: number;
      min: number;
      acquire: number;
      idle: number;
    };
  };
  jwt: {
    accessTokenSecret: string;
    refreshTokenSecret: string;
    accessTokenExpiry: string;
    refreshTokenExpiry: string;
    issuer: string;
    audience: string;
  };
  session: {
    expirySeconds: number;
    maxActiveSessionsPerUser: number;
  };
  invite: {
    expiryHours: number;
    orgAdminExpiryHours: number;
  };
  email: {
    host: string;
    port: number;
    user: string;
    password: string;
    from: string;
  };
  oauth: {
    google: {
      clientId: string;
      clientSecret: string;
      callbackURL: string;
    };
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
  upload: {
    maxFileSize: number;
  };
}

const config: Config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5000", 10),

  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    name: process.env.DB_NAME || "referral_network_hub",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || "20", 10),
      min: parseInt(process.env.DB_POOL_MIN || "5", 10),
      acquire: parseInt(process.env.DB_POOL_ACQUIRE || "30000", 10),
      idle: parseInt(process.env.DB_POOL_IDLE || "10000", 10),
    },
  },

  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || "",
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || "",
    accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || "1h",
    refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || "7d",
    issuer: process.env.JWT_ISSUER || "ReferralNetworkHub",
    audience: process.env.JWT_AUDIENCE || "ReferralNetworkHub-API",
  },

  session: {
    expirySeconds: parseInt(process.env.SESSION_EXPIRY_SECONDS || "3600", 10),
    maxActiveSessionsPerUser: parseInt(
      process.env.MAX_ACTIVE_SESSIONS_PER_USER || "5",
      10,
    ),
  },

  invite: {
    expiryHours: parseInt(process.env.INVITE_EXPIRY_HOURS || "48", 10),
    orgAdminExpiryHours: parseInt(
      process.env.ORG_ADMIN_INVITE_EXPIRY_HOURS || "72",
      10,
    ),
  },

  email: {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    user: process.env.EMAIL_USER || "",
    password: process.env.EMAIL_PASSWORD || "",
    from: process.env.EMAIL_FROM || "noreply@referralnetworkhub.com",
  },

  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:5000/api/auth/google/callback",
    },
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
  },

  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : "http://localhost:3000",
    credentials: process.env.CORS_CREDENTIALS === "true",
  },

  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760", 10), // 10MB
  },
};

export default config;
