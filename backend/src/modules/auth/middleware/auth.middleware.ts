/**
 * Authentication Middleware
 * Verifies JWT tokens and manages user authentication
 */

import { Request, Response, NextFunction } from "express";
import { JWTUtil, ResponseUtil } from "../../../shared/utils";
import { User, UserSession } from "../models";
import { ERROR_MESSAGES, USER_TYPES } from "../../../constants";
import {
  AuthenticatedUser,
  UserType,
  BrowserType,
  OSType,
  DeviceType,
} from "../../../shared/types";

/**
 * Verify JWT token and attach user to request
 */
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    // Extract token from header
    const token = JWTUtil.extractTokenFromHeader(
      req.get("Authorization") || "",
    );

    if (!token) {
      return ResponseUtil.unauthorized(res, ERROR_MESSAGES.TOKEN_MISSING);
    }

    // Verify token
    const payload = JWTUtil.verifyAccessToken(token);

    // Check if user exists
    const user = await User.findByPk(payload.userId);
    if (!user) {
      return ResponseUtil.unauthorized(res, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // Check if user is active
    const loginCheck = user.canLogin();
    if (!loginCheck.allowed) {
      return ResponseUtil.unauthorized(
        res,
        loginCheck.reason || ERROR_MESSAGES.ACCOUNT_INACTIVE,
      );
    }

    // Verify token version
    if (!JWTUtil.isTokenVersionValid(payload.tokenVersion, user.tokenVersion)) {
      return ResponseUtil.unauthorized(res, ERROR_MESSAGES.TOKEN_REVOKED);
    }

    // Verify session if user requires session tracking
    if (user.requiresSessionTracking() && payload.sessionId) {
      const session = await UserSession.findByPk(payload.sessionId);

      if (!session || !session.isActive()) {
        return ResponseUtil.unauthorized(res, ERROR_MESSAGES.SESSION_EXPIRED);
      }

      // Update session activity
      await session.updateActivity();

      // Attach session info to request
      req.sessionInfo = {
        id: session.id,
        deviceInfo: {
          browser: session.browser as BrowserType,
          os: session.os as OSType,
          deviceType: session.deviceType as DeviceType,
          userAgent: session.userAgent,
          browserVersion: session.browserVersion,
          osVersion: session.osVersion,
        },
        ipAddress: session.ipAddress,
      };
    }

    // Attach user to request
    req.user = {
      id: user.id,
      userId: user.id,
      email: user.email,
      userType: user.userType as UserType,
      firstName: user.firstName,
      lastName: user.lastName,
      organizationId: user.organizationId || undefined,
      isActive: user.isActive,
      isBlocked: user.isBlocked,
      emailVerified: user.emailVerified,
    };

    // Attach organizationId to request if present
    if (user.organizationId) {
      req.organizationId = user.organizationId;
    }

    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        return ResponseUtil.unauthorized(res, ERROR_MESSAGES.TOKEN_EXPIRED);
      } else if (error.name === "JsonWebTokenError") {
        return ResponseUtil.unauthorized(res, ERROR_MESSAGES.INVALID_TOKEN);
      }
    }
    return ResponseUtil.unauthorized(res, ERROR_MESSAGES.AUTHENTICATION_FAILED);
  }
};

/**
 * Require authentication (alias for verifyToken)
 */
export const requireAuth = verifyToken;

/**
 * Require specific user type
 */
export const requireUserType = (...allowedTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    if (!req.user) {
      return ResponseUtil.unauthorized(res, ERROR_MESSAGES.TOKEN_MISSING);
    }

    if (!allowedTypes.includes(req.user.userType)) {
      return ResponseUtil.forbidden(
        res,
        ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS,
      );
    }

    next();
  };
};

/**
 * Require platform super admin
 */
export const requirePlatformSuperAdmin = requireUserType(
  USER_TYPES.PLATFORM_SUPER_ADMIN,
);

/**
 * Require platform admin (super admin or platform admin)
 */
export const requirePlatformAdmin = requireUserType(
  USER_TYPES.PLATFORM_SUPER_ADMIN,
  USER_TYPES.PLATFORM_ADMIN,
);

/**
 * Require organization admin
 */
export const requireOrgAdmin = requireUserType(USER_TYPES.ORGANIZATION_ADMIN);

/**
 * Require organization access (org admin or recruiter)
 */
export const requireOrgAccess = requireUserType(
  USER_TYPES.ORGANIZATION_ADMIN,
  USER_TYPES.ORG_RECRUITER,
);

/**
 * Require email verification
 */
export const requireEmailVerified = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  if (!req.user) {
    return ResponseUtil.unauthorized(res, ERROR_MESSAGES.TOKEN_MISSING);
  }

  if (!req.user.emailVerified) {
    return ResponseUtil.forbidden(res, ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
  }

  next();
};

/**
 * Check organization ownership
 */
export const requireOrgOwnership = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void => {
  const organizationId = req.params.organizationId || req.body.organizationId;

  if (!req.user) {
    return ResponseUtil.unauthorized(res, ERROR_MESSAGES.TOKEN_MISSING);
  }

  // Platform admins can access any organization
  if (
    req.user.userType === USER_TYPES.PLATFORM_SUPER_ADMIN ||
    req.user.userType === USER_TYPES.PLATFORM_ADMIN
  ) {
    return next();
  }

  // Check if user belongs to organization
  if (req.user.organizationId !== organizationId) {
    return ResponseUtil.forbidden(res, ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS);
  }

  next();
};

/**
 * Optional authentication (doesn't fail if no token)
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = JWTUtil.extractTokenFromHeader(
      req.get("Authorization") || "",
    );

    if (token) {
      const payload = JWTUtil.verifyAccessToken(token);
      const user = await User.findByPk(payload.userId);

      if (user && user.canLogin().allowed) {
        req.user = {
          userId: user.id,
          email: user.email,
          userType: user.userType as UserType,
          firstName: user.firstName,
          lastName: user.lastName,
          organizationId: user.organizationId,
          isActive: user.isActive,
          emailVerified: user.emailVerified,
        } as AuthenticatedUser;
      }
    }
  } catch {
    // Ignore errors for optional auth
  }

  next();
};
