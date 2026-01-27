/**
 * Application Constants
 * Single source of truth for all constant values
 */

// ==================== USER TYPES ====================

export const USER_TYPES = {
  PLATFORM_SUPER_ADMIN: "PLATFORM_SUPER_ADMIN",
  PLATFORM_ADMIN: "PLATFORM_ADMIN",
  ORGANIZATION_ADMIN: "ORGANIZATION_ADMIN",
  ORG_RECRUITER: "ORG_RECRUITER",
  EMPLOYEE_REFERRER: "EMPLOYEE_REFERRER",
  JOB_SEEKER: "JOB_SEEKER",
  REFERRAL_PROVIDER: "REFERRAL_PROVIDER",
} as const;

export const SESSION_TRACKED_USER_TYPES = [
  USER_TYPES.PLATFORM_ADMIN,
  USER_TYPES.ORGANIZATION_ADMIN,
  USER_TYPES.ORG_RECRUITER,
  USER_TYPES.EMPLOYEE_REFERRER,
  USER_TYPES.JOB_SEEKER,
  USER_TYPES.REFERRAL_PROVIDER,
];

// ==================== ORGANIZATION ADMIN ROLES ====================

export const ORG_ADMIN_ROLES = {
  OWNER: "owner", // First admin, full control
  ADMIN: "admin", // Additional admins
  VIEWER: "viewer", // Read-only access
} as const;

// ==================== INVITE TYPES ====================

export const INVITE_TYPES = {
  PLATFORM_ADMIN: "PLATFORM_ADMIN",
  ORG_ADMIN: "ORG_ADMIN",
  ORG_RECRUITER: "ORG_RECRUITER",
  EMPLOYEE: "EMPLOYEE",
} as const;

export const INVITE_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  EXPIRED: "EXPIRED",
  REVOKED: "REVOKED",
} as const;

// ==================== SESSION STATUS ====================

export const SESSION_STATUS = {
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  LOGGED_OUT: "LOGGED_OUT",
  REVOKED: "REVOKED",
} as const;

// ==================== EMAIL VERIFICATION STATUS ====================

export const EMAIL_VERIFICATION_STATUS = {
  PENDING: "PENDING",
  VERIFIED: "VERIFIED",
  EXPIRED: "EXPIRED",
} as const;

// ==================== ACTIVITY TYPES ====================

export const ACTIVITY_TYPES = {
  // Authentication
  LOGIN: "LOGIN",
  LOGIN_FAILED: "LOGIN_FAILED",
  LOGOUT: "LOGOUT",
  TOKEN_REFRESHED: "TOKEN_REFRESHED",
  PASSWORD_CHANGED: "PASSWORD_CHANGED",
  PASSWORD_RESET: "PASSWORD_RESET",
  PASSWORD_RESET_REQUESTED: "PASSWORD_RESET_REQUESTED",
  EMAIL_VERIFIED: "EMAIL_VERIFIED",

  // User Management
  USER_CREATED: "USER_CREATED",
  USER_UPDATED: "USER_UPDATED",
  USER_DELETED: "USER_DELETED",
  USER_BLOCKED: "USER_BLOCKED",
  USER_UNBLOCKED: "USER_UNBLOCKED",
  ROLE_CHANGED: "ROLE_CHANGED",

  // Invite Management
  INVITE_SENT: "INVITE_SENT",
  INVITE_ACCEPTED: "INVITE_ACCEPTED",
  INVITE_REVOKED: "INVITE_REVOKED",

  // Organization Management
  ORG_CREATED: "ORG_CREATED",
  ORG_UPDATED: "ORG_UPDATED",
  ORG_DELETED: "ORG_DELETED",
  ORG_BLOCKED: "ORG_BLOCKED",
  ORG_UNBLOCKED: "ORG_UNBLOCKED",
  ORG_SETTINGS_CHANGED: "ORG_SETTINGS_CHANGED",

  // Employee Management
  EMPLOYEE_CREATED: "EMPLOYEE_CREATED",
  EMPLOYEE_UPDATED: "EMPLOYEE_UPDATED",
  EMPLOYEE_DELETED: "EMPLOYEE_DELETED",
  EMPLOYEE_INVITED: "EMPLOYEE_INVITED",
  EMPLOYEE_ACTIVATED: "EMPLOYEE_ACTIVATED",
  EMPLOYEE_DEACTIVATED: "EMPLOYEE_DEACTIVATED",

  // Recruiter Management
  RECRUITER_CREATED: "RECRUITER_CREATED",
  RECRUITER_UPDATED: "RECRUITER_UPDATED",
  RECRUITER_DELETED: "RECRUITER_DELETED",
  RECRUITER_ASSIGNED: "RECRUITER_ASSIGNED",
  RECRUITER_REMOVED: "RECRUITER_REMOVED",

  // Job Management
  JOB_CREATED: "JOB_CREATED",
  JOB_UPDATED: "JOB_UPDATED",
  JOB_DELETED: "JOB_DELETED",
  JOB_PUBLISHED: "JOB_PUBLISHED",
  JOB_CLOSED: "JOB_CLOSED",

  // Application Management
  APPLICATION_SUBMITTED: "APPLICATION_SUBMITTED",
  APPLICATION_VIEWED: "APPLICATION_VIEWED",
  APPLICATION_STATUS_CHANGED: "APPLICATION_STATUS_CHANGED",
  APPLICATION_NOTES_ADDED: "APPLICATION_NOTES_ADDED",

  // Referral Management
  REFERRAL_CREATED: "REFERRAL_CREATED",
  REFERRAL_SUBMITTED: "REFERRAL_SUBMITTED",
  REFERRAL_STATUS_CHANGED: "REFERRAL_STATUS_CHANGED",
  REFERRAL_REWARD_EARNED: "REFERRAL_REWARD_EARNED",

  // Session Management
  SESSION_CREATED: "SESSION_CREATED",
  SESSION_REVOKED: "SESSION_REVOKED",
} as const;

// ==================== DEVICE TYPES ====================

export const DEVICE_TYPES = {
  DESKTOP: "DESKTOP",
  MOBILE: "MOBILE",
  TABLET: "TABLET",
  UNKNOWN: "UNKNOWN",
} as const;

// ==================== BROWSER TYPES ====================

export const BROWSER_TYPES = {
  CHROME: "CHROME",
  FIREFOX: "FIREFOX",
  SAFARI: "SAFARI",
  EDGE: "EDGE",
  OPERA: "OPERA",
  IE: "IE",
  OTHER: "OTHER",
} as const;

// ==================== OS TYPES ====================

export const OS_TYPES = {
  WINDOWS: "WINDOWS",
  MAC_OS: "MAC_OS",
  LINUX: "LINUX",
  UBUNTU: "UBUNTU",
  CHROME_OS: "CHROME_OS",
  IOS: "IOS",
  ANDROID: "ANDROID",
  WINDOWS_PHONE: "WINDOWS_PHONE",
  OTHER: "OTHER",
} as const;

// ==================== HTTP STATUS CODES ====================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

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

// ==================== TOKEN EXPIRY ====================

export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: "1h",
  REFRESH_TOKEN: "7d",
  PASSWORD_RESET: "1h",
  EMAIL_VERIFICATION: "24h",
  INVITE: "48h",
  INVITE_TOKEN: "48h",
  ORG_ADMIN_INVITE: "72h",
} as const;

// ==================== SESSION LIMITS ====================

export const SESSION_LIMITS = {
  maxActiveSessionsPerUser: 5,
  sessionExpirySeconds: 3600, // 1 hour
  refreshTokenRotation: true,
} as const;

// ==================== RATE LIMITS ====================

export const RATE_LIMITS = {
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  },
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 login attempts per 15 minutes
  },
  invite: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 invites per hour
  },
} as const;

// ==================== EMAIL DOMAINS ====================

export const ALLOWED_ORG_EMAIL_DOMAINS = [
  // Add allowed domains for org admin verification
  // Example: 'company.com', 'organization.org'
] as const;

// ==================== OAUTH PROVIDERS ====================

export const OAUTH_PROVIDERS = {
  GOOGLE: "GOOGLE",
  MICROSOFT: "MICROSOFT",
  LINKEDIN: "LINKEDIN",
} as const;

export default {
  USER_TYPES,
  SESSION_TRACKED_USER_TYPES,
  ORG_ADMIN_ROLES,
  INVITE_TYPES,
  INVITE_STATUS,
  SESSION_STATUS,
  EMAIL_VERIFICATION_STATUS,
  ACTIVITY_TYPES,
  DEVICE_TYPES,
  BROWSER_TYPES,
  OS_TYPES,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  TOKEN_EXPIRY,
  SESSION_LIMITS,
  RATE_LIMITS,
  OAUTH_PROVIDERS,
};
