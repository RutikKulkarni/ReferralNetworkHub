import express, { Application } from "express";
import cors from "cors";
import httpStatus from "http-status";
import cookieParser from "cookie-parser";
import router from "./routes";
import { config } from "./config/config";
import limiter from "./utils/rateLimiter";

const app: Application = express();

// Enable trust proxy to use headers set by the proxy server
app.set("trust proxy", 1);

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to enable cross-origin requests
app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true
  })
);

// Mounting the router at the "/api/v1" endpoint
app.use("/api/v1", limiter, router);

// Default route handler for the root URL "/"
app.use("/", (req, res) =>
  res.status(httpStatus.OK).send("Server is running.")

// Implement Scalable Node app, By creating Worker Threads
  // res.status(httpStatus.OK).json({
  //   message: "ReferralNetworkHub's Server is running................",
  //   resolvedBy: `${process.pid} Worker Thread.`,
  // })
);

export default app;
