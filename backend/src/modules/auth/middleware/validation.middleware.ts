/**
 * Validation Middleware
 * Request validation for auth endpoints
 */

import { Request, Response, NextFunction } from "express";
import { ValidationUtil, ResponseUtil } from "../../../shared/utils";
import { USER_TYPES, ERROR_MESSAGES } from "../../../constants";

/**
 * Validate registration data
 */
export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  const { email, password, firstName, lastName, userType } = req.body;
  const errors: string[] = [];

  if (!email || !ValidationUtil.isValidEmail(email)) {
    errors.push(ERROR_MESSAGES.INVALID_EMAIL);
  }

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!firstName || firstName.trim().length === 0) {
    errors.push("First name is required");
  }

  if (!lastName || lastName.trim().length === 0) {
    errors.push("Last name is required");
  }

  if (!userType) {
    errors.push("User type is required");
  } else if (
    userType !== USER_TYPES.JOB_SEEKER &&
    userType !== USER_TYPES.REFERRAL_PROVIDER
  ) {
    errors.push(ERROR_MESSAGES.INVALID_USER_TYPE);
  }

  if (errors.length > 0) {
    return ResponseUtil.validationError(res, errors);
  }

  next();
};

/**
 * Validate login data
 */
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  const { email, password } = req.body;
  const errors: string[] = [];

  if (!email || !ValidationUtil.isValidEmail(email)) {
    errors.push(ERROR_MESSAGES.INVALID_EMAIL);
  }

  if (!password || password.trim().length === 0) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return ResponseUtil.validationError(res, errors);
  }

  next();
};

/**
 * Validate invite data
 */
export const validateInvite = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  const { email } = req.body;
  const errors: string[] = [];

  if (!email || !ValidationUtil.isValidEmail(email)) {
    errors.push(ERROR_MESSAGES.INVALID_EMAIL);
  }

  if (errors.length > 0) {
    return ResponseUtil.validationError(res, errors);
  }

  next();
};

/**
 * Validate accept invite data
 */
export const validateAcceptInvite = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  const { token, password, firstName, lastName } = req.body;
  const errors: string[] = [];

  if (!token || token.trim().length === 0) {
    errors.push("Invite token is required");
  }

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!firstName || firstName.trim().length === 0) {
    errors.push("First name is required");
  }

  if (!lastName || lastName.trim().length === 0) {
    errors.push("Last name is required");
  }

  if (errors.length > 0) {
    return ResponseUtil.validationError(res, errors);
  }

  next();
};

/**
 * Validate refresh token request
 */
export const validateRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  const { refreshToken } = req.body;

  if (!refreshToken || refreshToken.trim().length === 0) {
    return ResponseUtil.badRequest(res, ERROR_MESSAGES.REFRESH_TOKEN_REQUIRED);
  }

  next();
};

/**
 * Validate OAuth callback data
 */
export const validateOAuthCallback = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  const { provider, providerId, email, firstName, lastName } = req.body;
  const errors: string[] = [];

  if (!provider || provider.trim().length === 0) {
    errors.push("OAuth provider is required");
  }

  if (!providerId || providerId.trim().length === 0) {
    errors.push("OAuth provider ID is required");
  }

  if (!email || !ValidationUtil.isValidEmail(email)) {
    errors.push(ERROR_MESSAGES.INVALID_EMAIL);
  }

  if (!firstName || firstName.trim().length === 0) {
    errors.push("First name is required");
  }

  if (!lastName || lastName.trim().length === 0) {
    errors.push("Last name is required");
  }

  if (errors.length > 0) {
    return ResponseUtil.validationError(res, errors);
  }

  next();
};
