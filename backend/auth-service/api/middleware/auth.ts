import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
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

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get token from cookie
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as DecodedToken;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  verifyToken(req, res, () => {
    if (req.user?.role !== "admin") {
      res.status(403).json({ message: "Access denied. Admin role required." });
      return;
    }
    next();
  });
};

export const isRecruiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  verifyToken(req, res, () => {
    if (req.user?.role !== "recruiter" && req.user?.role !== "admin") {
      res
        .status(403)
        .json({ message: "Access denied. Recruiter role required." });
      return;
    }
    next();
  });
};

export const isUser = (req: Request, res: Response, next: NextFunction) => {
  verifyToken(req, res, () => {
    if (req.user?.role !== "user" && req.user?.role !== "admin") {
      res.status(403).json({ message: "Access denied. User role required." });
      return;
    }
    next();
  });
};
