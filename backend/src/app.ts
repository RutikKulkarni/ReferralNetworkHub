import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import config from "./config";
import { swaggerSpec } from "./config/swagger";
import sequelize, { testConnection, syncDatabase } from "./config/database";
import { testRedisConnection } from "./config/redis";
import { initAuthModels } from "./modules/auth/models";
import { authRoutes } from "./modules/auth/routes";
import organizationRoutes from "./modules/organization/routes/organization.routes";
import jobRoutes from "./modules/job/routes/job.routes";
import applicationRoutes from "./modules/application/routes/application.routes";
import { errorHandler } from "./modules/auth/middleware";
import { ResponseUtil } from "./shared/utils";
import { globalRateLimiter } from "./shared/middleware/rateLimiter.middleware";

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

// Rate limiting (global)
app.use(globalRateLimiter);

// Request logging in development
if (config.env === "development") {
  app.use((req: Request, res: Response, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ==================== ROUTES ====================

// API Documentation (Swagger)
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Referral Network Hub API Documentation",
  }),
);

// Swagger JSON endpoint
app.get("/api-docs.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

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
app.use("/api/organizations", organizationRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  return ResponseUtil.notFound(res, "Route not found");
});

// ==================== ERROR HANDLER ====================

app.use(errorHandler);

// ==================== DATABASE & SERVER INITIALIZATION ====================

const startServer = async (): Promise<void> => {
  try {
    console.log("\n Starting Referral Network Hub Backend...\n");

    // Test database connection
    await testConnection();

    // Test Redis connection
    await testRedisConnection();

    // Initialize models
    initAuthModels(sequelize);
    console.log(" Models initialized");

    // Sync database (only in development)
    if (config.env === "development") {
      await syncDatabase(false);
      console.log(" Database synchronized");
    }

    console.log(""); // Empty line for separation

    // Start server
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(" SERVER STARTED SUCCESSFULLY");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(` Port:        ${PORT}`);
      console.log(` Environment: ${config.env}`);
      console.log(` API URL:     http://localhost:${PORT}/api`);
      console.log(` API Docs:    http://localhost:${PORT}/api-docs`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    });
  } catch (error) {
    console.error("\n FAILED TO START SERVER:");
    console.error(error);
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

// Export the start function for use in server.ts
export { startServer };

export default app;
