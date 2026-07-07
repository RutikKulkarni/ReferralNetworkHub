import { Request, Response, NextFunction } from "express";
import { ResponseUtil } from "../../../shared/utils";
import { ERROR_MESSAGES } from "../../../constants";

/**
 * Professional error handler with proper HTTP status codes
 * Returns user-friendly messages while maintaining security
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  console.error("Error:", error);

  const message = error.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

  // ==================== DATABASE ERRORS ====================
  if (error.name === "SequelizeUniqueConstraintError") {
    return ResponseUtil.conflict(res, ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
  }

  if (error.name === "SequelizeValidationError") {
    return ResponseUtil.validationError(res, [error.message]);
  }

  // ==================== AUTHENTICATION ERRORS (401) ====================
  // Token errors
  if (error.name === "TokenExpiredError") {
    return ResponseUtil.unauthorized(res, ERROR_MESSAGES.TOKEN_EXPIRED);
  }

  if (error.name === "JsonWebTokenError") {
    return ResponseUtil.unauthorized(res, ERROR_MESSAGES.INVALID_TOKEN);
  }

  // Authentication-related messages
  if (
    message.includes("Invalid email or password") ||
    message.includes("Invalid credentials") ||
    message === ERROR_MESSAGES.INVALID_CREDENTIALS ||
    message === ERROR_MESSAGES.USER_NOT_FOUND
  ) {
    return ResponseUtil.unauthorized(
      res,
      "Invalid email or password. Please check your credentials and try again.",
    );
  }

  // ==================== AUTHORIZATION/ACCESS ERRORS (403) ====================
  if (
    message.includes("Email verification required") ||
    message.includes("verify your email") ||
    message === ERROR_MESSAGES.EMAIL_NOT_VERIFIED
  ) {
    return ResponseUtil.forbidden(
      res,
      "Email verification required. Please check your email to verify your account before logging in.",
    );
  }

  if (
    message.includes("Account is inactive") ||
    message.includes("Account is blocked") ||
    message === ERROR_MESSAGES.USER_INACTIVE ||
    message === ERROR_MESSAGES.USER_BLOCKED ||
    message === ERROR_MESSAGES.ACCOUNT_INACTIVE
  ) {
    return ResponseUtil.forbidden(
      res,
      message.includes("blocked")
        ? "Your account has been blocked. Please contact support for assistance."
        : "Your account is currently inactive. Please contact support for assistance.",
    );
  }

  if (
    message.includes("Insufficient permissions") ||
    message.includes("not authorized") ||
    message === ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS ||
    message === ERROR_MESSAGES.UNAUTHORIZED
  ) {
    return ResponseUtil.forbidden(
      res,
      "You do not have permission to perform this action.",
    );
  }

  // ==================== VALIDATION ERRORS (400) ====================
  if (
    message.includes("Password") &&
    (message.includes("does not meet") ||
      message.includes("should not contain") ||
      message.includes("must be at least"))
  ) {
    return ResponseUtil.badRequest(res, message); // Pass password validation errors as-is
  }

  // ==================== NOT FOUND ERRORS (404) ====================
  if (
    message.includes("not found") ||
    message === ERROR_MESSAGES.USER_NOT_FOUND
  ) {
    return ResponseUtil.notFound(res, "The requested resource was not found.");
  }

  // ==================== CONFLICT ERRORS (409) ====================
  if (
    message.includes("already exists") ||
    message.includes("already registered") ||
    message === ERROR_MESSAGES.EMAIL_ALREADY_EXISTS
  ) {
    return ResponseUtil.conflict(
      res,
      "An account with this email address already exists. Please login or use a different email.",
    );
  }

  // ==================== INVITE/TOKEN ERRORS ====================
  if (
    message.includes("invite") ||
    message.includes("token") ||
    message.includes("expired")
  ) {
    if (message.includes("expired")) {
      return ResponseUtil.badRequest(
        res,
        "This link has expired. Please request a new one.",
      );
    }
    return ResponseUtil.badRequest(res, message); // Pass invite/token errors as-is
  }

  // ==================== CATCH-ALL FOR OTHER ERRORS ====================
  // If error message exists and doesn't match above patterns, it's likely a legitimate business logic error
  if (message && message !== ERROR_MESSAGES.INTERNAL_SERVER_ERROR) {
    return ResponseUtil.badRequest(res, message);
  }

  // ==================== INTERNAL SERVER ERROR (500) ====================
  // Only for genuine unexpected errors
  return ResponseUtil.serverError(
    res,
    "An unexpected error occurred. Please try again later.",
  );
};
