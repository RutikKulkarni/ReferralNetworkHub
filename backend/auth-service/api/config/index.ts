import dotenv from "dotenv";
import path from "path";

dotenv.config();

interface Config {
  env: string;
  port: number;
  clientUrl: string;
  mongodb: {
    uri: string;
  };
  jwt: {
    secret: string;
    refreshSecret: string;
    accessExpiresIn: string;
    refreshExpiresIn: string;
  };
  cookie: {
    domain: string;
    secure: boolean;
    sameSite: "none" | "lax" | "strict";
  };
  email: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
    from: string;
  };
  services: {
    userService: string;
  };
  internalApiKey: string;
}

const config: Config = {
  env: process.env.NODE_ENV || "",
  port: Number.parseInt(process.env.AUTH_SERVICE_PORT || "", 10),
  clientUrl: process.env.CLIENT_URL || "",
  mongodb: {
    uri: process.env.MONGODB_URI || "",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "",
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRY || "",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRY || "",
  },
  cookie: {
    domain: process.env.COOKIE_DOMAIN || "",
    secure: process.env.COOKIE_SECURE === "",
    sameSite: (process.env.COOKIE_SAME_SITE as "none" | "lax" | "strict") || "",
  },
  email: {
    host: process.env.EMAIL_HOST || "",
    port: Number.parseInt(process.env.EMAIL_PORT || "", 10),
    secure: process.env.EMAIL_SECURE === "",
    auth: {
      user: process.env.EMAIL_USER || "",
      pass: process.env.EMAIL_PASSWORD || "",
    },
    from: process.env.EMAIL_FROM || "",
  },
  services: {
    userService: process.env.USER_SERVICE_URL || "",
  },
  internalApiKey: process.env.INTERNAL_API_KEY || "",
};

// console.log("Config loaded:", { config });

export default config;
