import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/error-handler";
import config from "./config";
import { cleanupExpiredTokens } from "./utils/token";

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(helmet());
app.use(express.json());
app.use(morgan("combined"));

// Connect to MongoDB
mongoose
  .connect(config.mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "auth-service" });
});

// Error handling
app.use(errorHandler);

// Schedule token cleanup (every 24 hours)
if (config.nodeEnv === "production") {
  setInterval(async () => {
    try {
      const result = await cleanupExpiredTokens();
      console.log(`Cleaned up ${result.deletedCount} expired tokens`);
    } catch (error) {
      console.error("Token cleanup error:", error);
    }
  }, 24 * 60 * 60 * 1000);
}

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});

export default app;
