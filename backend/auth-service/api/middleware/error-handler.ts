import type { Request, Response, NextFunction } from "express";
import config from "../config";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Something went wrong!",
    error: err.message,
    stack: config.env === "development" ? err.stack : undefined,
    // error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
