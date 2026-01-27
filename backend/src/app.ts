/**
 * Application Entry Point
 * Initializes Express app with all configurations and middleware
 */

import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import config from "./config";
import sequelize, { testConnection, syncDatabase } from "./config/database";
import { initAuthModels } from "./modules/auth/models";
import { authRoutes } from "./modules/auth/routes";
import { errorHandler } from "./modules/auth/middleware";
import { ResponseUtil } from "./shared/utils";

const app: Application = express();

// ==================== MIDDLEWARE ====================

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  }),
);

// Body parsing middleware
app.use(express.json({ limit: config.upload.maxFileSize }));
app.use(
  express.urlencoded({ extended: true, limit: config.upload.maxFileSize }),
);

// Request logging in development
if (config.env === "development") {
  app.use((req: Request, res: Response, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ==================== ROUTES ====================

// Health check
app.get("/health", (req: Request, res: Response) => {
  return ResponseUtil.success(res, {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

// API routes
app.use("/api/auth", authRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  return ResponseUtil.notFound(res, "Route not found");
});

// ==================== ERROR HANDLER ====================

app.use(errorHandler);

// ==================== DATABASE & SERVER INITIALIZATION ====================

const startServer = async (): Promise<void> => {
  try {
    // Test database connection
    await testConnection();
    console.log("✓ Database connection established");

    // Initialize models
    initAuthModels(sequelize);
    console.log("✓ Models initialized");

    // Sync database (only in development)
    if (config.env === "development") {
      await syncDatabase(false);
      console.log("✓ Database synchronized");
    }

    // Start server
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${config.env}`);
      console.log(`✓ API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("✗ Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully...");
  process.exit(0);
});

// Start the server
if (require.main === module) {
  startServer();
}

export default app;
