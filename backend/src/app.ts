import express, { Application } from "express";
import cors from "cors";
import httpStatus from "http-status";
import cookieParser from "cookie-parser";
import router from "./routes";
import { config } from "./config/config";

const app: Application = express();

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
app.use("/api/v1", router);

// Default route handler for the root URL "/"
app.use("/", (req, res) =>
  res.status(httpStatus.OK).json({
    message: "ReferralNetworkHub's Server is running................",
    resolvedBy: `${process.pid} Worker Thread.`,
  })
);

export default app;
