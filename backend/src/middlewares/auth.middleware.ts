import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { config } from "../config/config";

// Extend the Request interface to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware for authenticating JWT tokens.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 */
const auth = (req: Request, res: Response, next: NextFunction) => {
  let { authorization } = req.headers;
  let token = authorization && authorization.split(" ")[1];

  if (!token) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .send({ message: "Unauthorized access!" });
  }

  jwt.verify(token, config.SECRET_KEY, async (err, user) => {
    if (err) {
      return res
        .status(httpStatus.FORBIDDEN)
        .send({ message: "FORBIDDEN REQUEST!" });
    }

    req.user = user;
    next();
  });
};

// Cookies Logic
const cookieAuth = (req: Request, res: Response, next: NextFunction) => {
  // const { token } = req.cookies.authToken;
  const authTokenCookie = req.cookies.authToken;

  if (!authTokenCookie) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .send({ message: "Unauthorized Access!" });
  }

  const { token } = authTokenCookie;

  jwt.verify(token, config.SECRET_KEY, async (err: any, user: any) => {
    if (err) {
      return res
        .status(httpStatus.FORBIDDEN)
        .send({ message: "Forbidden Request!" });
    }

    req.user = user;
    next();
  });
};

export { auth, cookieAuth };
