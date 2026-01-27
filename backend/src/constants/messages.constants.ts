/**
 * Application Messages
 * Error and success messages used throughout the application
 */

// ==================== ERROR MESSAGES ====================

export const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_NOT_FOUND: "User not found",
  USER_INACTIVE: "User account is inactive",
  USER_BLOCKED: "User account has been blocked",
  EMAIL_NOT_VERIFIED: "Please verify your email address",
  INVALID_TOKEN: "Invalid or expired token",
  TOKEN_MISSING: "No authentication token provided",
  NO_TOKEN_PROVIDED: "No authentication token provided",
  TOKEN_EXPIRED: "Authentication token has expired",
  TOKEN_REVOKED: "Token has been revoked",
  TOKEN_VERSION_MISMATCH: "Token is no longer valid",
  TOKEN_REFRESH_FAILED: "Failed to refresh token",
  REFRESH_TOKEN_REQUIRED: "Refresh token is required",
  INVALID_REFRESH_TOKEN: "Invalid or expired refresh token",
  ACCOUNT_INACTIVE: "Account is inactive",
  AUTHENTICATION_FAILED: "Authentication failed",
  OAUTH_USER_PASSWORD_LOGIN:
    "This account uses OAuth login. Please sign in with your OAuth provider",

  // Registration
  EMAIL_ALREADY_EXISTS: "Email address is already registered",
  REGISTRATION_FAILED: "Registration failed",
  WEAK_PASSWORD: "Password does not meet security requirements",

  // Invites
  INVALID_INVITE_TOKEN: "Invalid or expired invite token",
  INVITE_ALREADY_USED: "This invite has already been used",
  INVITE_EXPIRED: "This invite has expired",
  INVITE_REVOKED: "This invite has been revoked",
  UNAUTHORIZED_TO_INVITE: "You are not authorized to send invites",
  INVALID_EMAIL_DOMAIN: "Email domain does not match organization",
  INVALID_INVITE_TYPE: "Invalid invite type",
  INVALID_USER_TYPE: "Invalid user type",
  INVITE_NOT_FOUND: "Invite not found",
  INVITE_ALREADY_SENT: "An invite has already been sent to this email",
  INVALID_EMAIL: "Invalid email address",

  // Authorization
  UNAUTHORIZED: "Unauthorized access",
  INSUFFICIENT_PERMISSIONS: "Insufficient permissions for this action",
  ORG_ACCESS_DENIED: "Access denied to this organization",

  // Organization
  ORG_NOT_FOUND: "Organization not found",
  ORG_BLOCKED: "Organization has been blocked",
  ORG_INACTIVE: "Organization is inactive",

  // Session
  INVALID_SESSION: "Invalid or expired session",
  SESSION_EXPIRED: "Session has expired",
  SESSION_NOT_FOUND: "Session not found",
  MAX_SESSIONS_REACHED: "Maximum number of active sessions reached",

  // Password
  PASSWORD_CHANGE_FAILED: "Failed to change password",
  PASSWORD_RESET_FAILED: "Failed to reset password",
  CURRENT_PASSWORD_INCORRECT: "Current password is incorrect",

  // Generic
  INTERNAL_SERVER_ERROR: "Internal server error",
  NOT_FOUND: "Resource not found",
  VALIDATION_ERROR: "Validation error",
  LOGIN_FAILED: "Login failed",
  LOGOUT_FAILED: "Logout failed",
} as const;

export type ErrorMessage = (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];

// ==================== SUCCESS MESSAGES ====================

export const SUCCESS_MESSAGES = {
  USER_REGISTERED: "User registered successfully",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
  TOKEN_REFRESHED: "Token refreshed successfully",
  PASSWORD_CHANGED: "Password changed successfully",
  PASSWORD_RESET_SUCCESS: "Password reset successful",
  EMAIL_VERIFIED: "Email verified successfully",
  INVITE_SENT: "Invite sent successfully",
  INVITE_ACCEPTED: "Invite accepted successfully",
  INVITE_REVOKED: "Invite revoked successfully",
  ORG_CREATED: "Organization created successfully",
  USER_CREATED: "User created successfully",
  USER_UPDATED: "User updated successfully",
  USER_DELETED: "User deleted successfully",
} as const;

export type SuccessMessage = (typeof SUCCESS_MESSAGES)[keyof typeof SUCCESS_MESSAGES];
