// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import helmet from "helmet";
// import morgan from "morgan";
// import cookieParser from "cookie-parser";
// import authRoutes from "./routes/auth.routes";
// import { errorHandler } from "./middleware/error-handler";

// const app = express();
// const PORT = process.env.PORT || 3001;

// const corsOptions = {
//   origin: process.env.CLIENT_URL || "http://localhost:3000",
//   credentials: true,
// };

// // Middleware
// app.use(cors(corsOptions));
// app.use(helmet());
// app.use(express.json());
// app.use(cookieParser());
// app.use(morgan("combined"));

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/auth-service")
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Could not connect to MongoDB", err));

// // Routes - Added /api prefix to routes
// app.use("/api/auth", authRoutes);

// // Health check
// app.get("/health", (req, res) => {
//   res.status(200).json({ status: "ok" });
// });

// // Error handling
// app.use(errorHandler);

// app.listen(PORT, () => {
//   console.log(`Auth Service running on port ${PORT}`);
// });

// export default app;

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/error-handler";
import dotenv from "dotenv";
import https from "https";
import fs from "fs";

// Load environment variables
const envFile =
  process.env.NODE_ENV === "production" ? ".env" : ".env.development";
dotenv.config({ path: envFile });

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("combined"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/auth-service")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error handling
app.use(errorHandler);

// Start HTTPS server for development
if (process.env.NODE_ENV === "development") {
  const options = {
    key: fs.readFileSync("localhost-key.pem"),
    cert: fs.readFileSync("localhost.pem"),
  };
  https.createServer(options, app).listen(PORT, () => {
    console.log(`Auth Service running on https://localhost:${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
  });
}

export default app;
