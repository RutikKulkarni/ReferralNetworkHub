/**
 * Shared TypeScript Type Definitions
 */

import {
  USER_TYPES,
  SESSION_STATUS,
  ACTIVITY_TYPES,
  DEVICE_TYPES,
  BROWSER_TYPES,
  OS_TYPES,
  INVITE_TYPES,
  INVITE_STATUS,
  ORG_ADMIN_ROLES,
  EMAIL_VERIFICATION_STATUS,
  OAUTH_PROVIDERS,
} from "../../constants";

// ==================== USER TYPES ====================

export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];
export type SessionStatus =
  (typeof SESSION_STATUS)[keyof typeof SESSION_STATUS];
export type ActivityType = (typeof ACTIVITY_TYPES)[keyof typeof ACTIVITY_TYPES];
export type DeviceType = (typeof DEVICE_TYPES)[keyof typeof DEVICE_TYPES];
export type BrowserType = (typeof BROWSER_TYPES)[keyof typeof BROWSER_TYPES];
export type OSType = (typeof OS_TYPES)[keyof typeof OS_TYPES];
export type InviteType = (typeof INVITE_TYPES)[keyof typeof INVITE_TYPES];
export type InviteStatus = (typeof INVITE_STATUS)[keyof typeof INVITE_STATUS];
export type OrgAdminRole =
  (typeof ORG_ADMIN_ROLES)[keyof typeof ORG_ADMIN_ROLES];
export type EmailVerificationStatus =
  (typeof EMAIL_VERIFICATION_STATUS)[keyof typeof EMAIL_VERIFICATION_STATUS];
export type OAuthProvider =
  (typeof OAUTH_PROVIDERS)[keyof typeof OAUTH_PROVIDERS];

// ==================== JWT PAYLOAD ====================

export interface JWTPayload {
  userId: string;
  email: string;
  userType: UserType;
  sessionId?: string;
  organizationId?: string;
  tokenVersion: number;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: string;
  sessionId?: string;
  tokenVersion: number;
  iat?: number;
  exp?: number;
}

// ==================== DEVICE INFO ====================

export interface DeviceInfo {
  deviceType: DeviceType;
  browser: BrowserType;
  browserVersion: string;
  os: OSType;
  osVersion: string;
  userAgent: string;
  ip?: string;
}

// ==================== SESSION INFO ====================

export interface SessionInfo {
  sessionId: string;
  userId: number;
  status: SessionStatus;
  ipAddress: string;
  deviceInfo: DeviceInfo;
  loginAt: Date;
  lastActivityAt: Date;
  logoutAt?: Date;
  expiresAt: Date;
  duration?: number;
}

// ==================== ACTIVITY LOG ====================

export interface ActivityLogEntry {
  id: number;
  userId: number;
  sessionId?: string;
  activityType: ActivityType;
  description: string;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

// ==================== AUTHENTICATED USER ====================

export interface AuthenticatedUser {
  id: string;
  userId: string;
  email: string;
  userType: UserType;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isBlocked: boolean;
  emailVerified: boolean;
  sessionId?: string;
  organizationId?: string;
}

// ==================== API RESPONSE ====================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: unknown;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ==================== AUTH REQUEST/RESPONSE ====================

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: UserType;
  inviteToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    userType: UserType;
    firstName: string;
    lastName: string;
    emailVerified: boolean;
    organizationId?: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: string | number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface LogoutRequest {
  sessionId?: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface SendInviteRequest {
  email: string;
  inviteType: InviteType;
  organizationId?: string;
  role?: OrgAdminRole;
  metadata?: Record<string, unknown>;
}

export interface AcceptInviteRequest {
  token: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface OAuthCallbackRequest {
  code: string;
  state?: string;
  provider?: string;
  providerId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}

// ==================== DATABASE MODEL ATTRIBUTES ====================

export interface UserAttributes {
  id: string;
  email: string;
  password: string | null;
  userType: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  profilePicture: string | null;
  isActive: boolean;
  isBlocked: boolean;
  blockReason: string | null;
  blockedAt: Date | null;
  blockedBy: string | null;
  emailVerified: boolean;
  emailVerificationStatus: string;
  lastLoginAt: Date | null;
  tokenVersion: number;
  oauthProvider: string | null;
  oauthProviderId: string | null;
  organizationId: string | null;
  invitedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSessionAttributes {
  id: string;
  userId: string;
  sessionToken: string;
  status: string;
  ipAddress: string;
  deviceType: string;
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  userAgent: string;
  deviceId: string;
  loginAt: Date;
  lastActivityAt: Date;
  logoutAt: Date | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserActivityLogAttributes {
  id: number;
  userId: number;
  sessionId?: string;
  activityType: ActivityType;
  description: string;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface RefreshTokenAttributes {
  id: string;
  userId: string;
  sessionId: string;
  token: string;
  expiresAt: Date;
  isRevoked: boolean;
  revokedAt: Date | null;
  replacedByToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PasswordResetAttributes {
  id: string;
  userId: string;
  email: string;
  token: string;
  expiresAt: Date;
  isUsed: boolean;
  usedAt: Date | null;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InviteTokenAttributes {
  id: string;
  inviteType: string;
  email: string;
  token: string;
  organizationId: string | null;
  invitedBy: string;
  role: string | null;
  status: string;
  expiresAt: Date;
  acceptedAt: Date | null;
  acceptedBy: string | null;
  revokedAt: Date | null;
  revokedBy: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailVerificationAttributes {
  id: string;
  userId: string;
  email: string;
  token: string;
  status: string;
  expiresAt: Date;
  verifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationAttributes {
  id: number;
  name: string;
  slug: string;
  domain: string;
  logoUrl?: string;
  websiteUrl?: string;
  industry?: string;
  size?: string;
  description?: string;
  isActive: boolean;
  isBlocked: boolean;
  blockReason?: string;
  blockedAt?: Date;
  blockedBy?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationAdminAttributes {
  id: number;
  userId: number;
  organizationId: number;
  role: OrgAdminRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== EXPRESS REQUEST EXTENSIONS ====================

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      sessionInfo?: {
        id: string;
        deviceInfo: DeviceInfo;
        ipAddress: string;
      };
      organizationId?: string;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

// ==================== UTILITY TYPES ====================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
