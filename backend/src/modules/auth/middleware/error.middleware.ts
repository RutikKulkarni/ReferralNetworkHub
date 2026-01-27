/**
 * Error Handler Middleware
 * Global error handling for auth module
 */

import { Request, Response, NextFunction } from "express";
import { ResponseUtil } from "../../../shared/utils";
import { ERROR_MESSAGES } from "../../../constants";

/**
 * Global error handler
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  console.error("Error:", error);

  // Handle known errors
  if (error.message in ERROR_MESSAGES) {
    return ResponseUtil.badRequest(res, error.message);
  }

  // Handle specific error types
  if (error.name === "SequelizeUniqueConstraintError") {
    return ResponseUtil.conflict(res, ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
  }

  if (error.name === "SequelizeValidationError") {
    return ResponseUtil.validationError(res, [error.message]);
  }

  if (error.name === "TokenExpiredError") {
    return ResponseUtil.unauthorized(res, ERROR_MESSAGES.TOKEN_EXPIRED);
  }

  if (error.name === "JsonWebTokenError") {
    return ResponseUtil.unauthorized(res, ERROR_MESSAGES.INVALID_TOKEN);
  }

  // Default error response
  return ResponseUtil.serverError(res, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
};
