import type { Request, Response, NextFunction } from "express";
import config from "../config";

/**
 * Middleware to authenticate internal service-to-service API calls
 * This ensures that only other microservices can access internal endpoints
 */
export const internalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== config.internalApiKey) {
    res.status(401).json({ message: "Unauthorized: Invalid API key" });
    return;
  }

  next();
};
