import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token";
import config from "../config";

interface DecodedToken {
  userId: string;
  role: string;
  firstName?: string;
  lastName?: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

/**
 * Verify JWT token middleware
 */
export const verifyTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token, config.jwt.secret);
    req.user = decoded as DecodedToken;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

/**
 * Check if user is admin
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  verifyTokenMiddleware(req, res, () => {
    if (req.user?.role !== "admin") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Access denied. Admin role required.",
        });
    }
    next();
  });
};

/**
 * Check if user is recruiter
 */
export const isRecruiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  verifyTokenMiddleware(req, res, () => {
    if (req.user?.role !== "recruiter" && req.user?.role !== "admin") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Access denied. Recruiter role required.",
        });
    }
    next();
  });
};

/**
 * Check if user is regular user
 */
export const isUser = (req: Request, res: Response, next: NextFunction) => {
  verifyTokenMiddleware(req, res, () => {
    if (req.user?.role !== "user" && req.user?.role !== "admin") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Access denied. User role required.",
        });
    }
    next();
  });
};

/**
 * Verify service-to-service communication
 */
export const verifyServiceToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const serviceApiKey = req.headers["x-service-api-key"];

  if (!serviceApiKey || serviceApiKey !== config.serviceApiKey) {
    res
      .status(401)
      .json({ success: false, message: "Unauthorized service request" });
    return;
  }

  next();
};
