import express, { Application } from "express";
import cors from "cors";
import httpStatus from "http-status";
import router from "./routes";

const app: Application = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Middleware to enable cross-origin requests
app.use(
  cors({
    origin: "https://referral-network-hub.vercel.app/",
  })
);

// Mounting the router at the "/api" endpoint
app.use("/api", router);

// Default route handler for the root URL "/"
app.use("/", (req, res) =>
  res.status(httpStatus.OK).send("<h1>Server is running.</h1>")
);

export default app;
