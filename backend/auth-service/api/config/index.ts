import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
// dotenv.config({ path: path.join(__dirname, "../.env") })

const config = {
  port: Number.parseInt(process.env.PORT || "3001", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/auth-service",
  jwt: {
    secret: process.env.JWT_SECRET || "jwt-secret-key",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "jwt-refresh-secret-key",
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1h",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  email: {
    host: process.env.EMAIL_HOST || "smtp.example.com",
    port: Number.parseInt(process.env.EMAIL_PORT || "587", 10),
    secure: process.env.EMAIL_SECURE === "true",
    user: process.env.EMAIL_USER || "user@example.com",
    password: process.env.EMAIL_PASSWORD || "password",
    from: process.env.EMAIL_FROM || "noreply@referralnetworkhub.com",
  },
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  serviceApiKey: process.env.SERVICE_API_KEY || "internal-service-api-key",
  services: {
    user: process.env.USER_SERVICE_URL || "http://localhost:3002",
    job: process.env.JOB_SERVICE_URL || "http://localhost:3004",
    referral: process.env.REFERRAL_SERVICE_URL || "http://localhost:3005",
    notification:
      process.env.NOTIFICATION_SERVICE_URL || "http://localhost:3007",
    chat: process.env.CHAT_SERVICE_URL || "http://localhost:3006",
    recruiter: process.env.RECRUITER_SERVICE_URL || "http://localhost:3003",
    admin: process.env.ADMIN_SERVICE_URL || "http://localhost:3008",
  },
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  },
};

export default config;
