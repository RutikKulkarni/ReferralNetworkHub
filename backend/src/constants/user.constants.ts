/**
 * User-related Constants
 * User types, roles, and user management constants
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

export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];

// User types that require session tracking
export const SESSION_TRACKED_USER_TYPES = [
  USER_TYPES.PLATFORM_ADMIN,
  USER_TYPES.ORGANIZATION_ADMIN,
  USER_TYPES.ORG_RECRUITER,
  USER_TYPES.EMPLOYEE_REFERRER,
  USER_TYPES.JOB_SEEKER,
  USER_TYPES.REFERRAL_PROVIDER,
] as const;

// ==================== ORGANIZATION ADMIN ROLES ====================

export const ORG_ADMIN_ROLES = {
  OWNER: "owner", // First admin, full control
  ADMIN: "admin", // Additional admins
  VIEWER: "viewer", // Read-only access
} as const;

export type OrgAdminRole =
  (typeof ORG_ADMIN_ROLES)[keyof typeof ORG_ADMIN_ROLES];
