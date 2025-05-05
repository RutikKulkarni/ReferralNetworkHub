import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import config from "./config";
import authRoutes from "./routes/auth.routes";
import internalRoutes from "./routes/internal.routes";
import { errorHandler } from "./middleware/error-handler";

const app = express();
const PORT = config.port;

// CORS configuration with credentials
const corsOptions = {
  origin: config.clientUrl,
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("combined"));

// Connect to MongoDB
mongoose
  .connect(config.mongodb.uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Public routes
app.use("/api/auth", authRoutes);

// Internal routes (service-to-service communication)
// These routes are protected by API key authentication
app.use("/internal", internalRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "auth-service" });
});

app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
  });
}

export default app;
