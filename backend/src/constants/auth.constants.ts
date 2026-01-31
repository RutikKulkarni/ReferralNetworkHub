/**
 * Authentication & Authorization Constants
 * Session, tokens, invites, and OAuth-related constants
 */

// ==================== INVITE TYPES ====================

export const INVITE_TYPES = {
  PLATFORM_ADMIN: "PLATFORM_ADMIN",
  ORG_ADMIN: "ORG_ADMIN",
  ORG_RECRUITER: "ORG_RECRUITER",
  EMPLOYEE: "EMPLOYEE",
} as const;

export type InviteType = (typeof INVITE_TYPES)[keyof typeof INVITE_TYPES];

export const INVITE_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  EXPIRED: "EXPIRED",
  REVOKED: "REVOKED",
} as const;

export type InviteStatus = (typeof INVITE_STATUS)[keyof typeof INVITE_STATUS];

// ==================== SESSION STATUS ====================

export const SESSION_STATUS = {
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  LOGGED_OUT: "LOGGED_OUT",
  REVOKED: "REVOKED",
} as const;

export type SessionStatus =
  (typeof SESSION_STATUS)[keyof typeof SESSION_STATUS];

// ==================== EMAIL VERIFICATION STATUS ====================

export const EMAIL_VERIFICATION_STATUS = {
  PENDING: "PENDING",
  VERIFIED: "VERIFIED",
  EXPIRED: "EXPIRED",
} as const;

export type EmailVerificationStatus =
  (typeof EMAIL_VERIFICATION_STATUS)[keyof typeof EMAIL_VERIFICATION_STATUS];

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

// ==================== SESSION CONFIGURATION ====================

export const SESSION_CONFIG = {
  MAX_ACTIVE_SESSIONS_PER_USER: 5,
  SESSION_EXPIRY_SECONDS: 3600, // 1 hour
  REFRESH_TOKEN_ROTATION: true,
} as const;

// ==================== OAUTH PROVIDERS ====================

export const OAUTH_PROVIDERS = {
  GOOGLE: "GOOGLE",
  MICROSOFT: "MICROSOFT",
  LINKEDIN: "LINKEDIN",
} as const;

export type OAuthProvider =
  (typeof OAUTH_PROVIDERS)[keyof typeof OAUTH_PROVIDERS];
