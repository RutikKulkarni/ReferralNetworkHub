import { USER_TYPES } from "../../constants";

/**
 * Check if user can manage organization
 */
export const canManageOrganization = (
  userType: string,
  targetOrganizationId: string,
  userOrganizationId?: string,
): boolean => {
  // Platform admins can manage any organization
  if (
    userType === USER_TYPES.PLATFORM_SUPER_ADMIN ||
    userType === USER_TYPES.PLATFORM_ADMIN
  ) {
    return true;
  }

  // Org admins can only manage their own organization
  if (userType === USER_TYPES.ORGANIZATION_ADMIN) {
    return userOrganizationId === targetOrganizationId;
  }

  return false;
};

/**
 * Check if user can post jobs
 */
export const canPostJobs = (
  userType: string,
  targetOrganizationId: string,
  userOrganizationId?: string,
): boolean => {
  // Platform admins can post anywhere
  if (
    userType === USER_TYPES.PLATFORM_SUPER_ADMIN ||
    userType === USER_TYPES.PLATFORM_ADMIN
  ) {
    return true;
  }

  // Org admins and recruiters can post for their organization
  if (
    (userType === USER_TYPES.ORGANIZATION_ADMIN ||
      userType === USER_TYPES.ORG_RECRUITER) &&
    userOrganizationId === targetOrganizationId
  ) {
    return true;
  }

  return false;
};

/**
 * Check if user can manage applications
 */
export const canManageApplications = (
  userType: string,
  targetOrganizationId: string,
  userOrganizationId?: string,
): boolean => {
  // Platform admins can manage any applications
  if (
    userType === USER_TYPES.PLATFORM_SUPER_ADMIN ||
    userType === USER_TYPES.PLATFORM_ADMIN
  ) {
    return true;
  }

  // Org admins and recruiters can manage for their organization
  if (
    (userType === USER_TYPES.ORGANIZATION_ADMIN ||
      userType === USER_TYPES.ORG_RECRUITER) &&
    userOrganizationId === targetOrganizationId
  ) {
    return true;
  }

  return false;
};

/**
 * Check if user can give referrals
 */
export const canGiveReferrals = (userType: string): boolean => {
  return (
    userType === USER_TYPES.EMPLOYEE_REFERRER ||
    userType === USER_TYPES.REFERRAL_PROVIDER ||
    userType === USER_TYPES.ORG_RECRUITER
  );
};

/**
 * Check if user can apply to jobs
 */
export const canApplyToJobs = (userType: string): boolean => {
  return (
    userType === USER_TYPES.JOB_SEEKER ||
    userType === USER_TYPES.EMPLOYEE_REFERRER
  );
};

/**
 * Check if user can manage referrals
 */
export const canManageReferrals = (
  userType: string,
  targetOrganizationId: string,
  userOrganizationId?: string,
): boolean => {
  // Platform admins can manage any referrals
  if (
    userType === USER_TYPES.PLATFORM_SUPER_ADMIN ||
    userType === USER_TYPES.PLATFORM_ADMIN
  ) {
    return true;
  }

  // Org admins and recruiters can manage for their organization
  if (
    (userType === USER_TYPES.ORGANIZATION_ADMIN ||
      userType === USER_TYPES.ORG_RECRUITER) &&
    userOrganizationId === targetOrganizationId
  ) {
    return true;
  }

  return false;
};

/**
 * Check if user can manage employees
 */
export const canManageEmployees = (
  userType: string,
  targetOrganizationId: string,
  userOrganizationId?: string,
): boolean => {
  // Platform admins can manage employees in any organization
  if (
    userType === USER_TYPES.PLATFORM_SUPER_ADMIN ||
    userType === USER_TYPES.PLATFORM_ADMIN
  ) {
    return true;
  }

  // Org admins can manage employees in their organization
  if (
    userType === USER_TYPES.ORGANIZATION_ADMIN &&
    userOrganizationId === targetOrganizationId
  ) {
    return true;
  }

  return false;
};

/**
 * Check if user can create recruiters
 */
export const canCreateRecruiters = (
  userType: string,
  targetOrganizationId: string,
  userOrganizationId?: string,
): boolean => {
  // Platform admins can create recruiters in any organization
  if (
    userType === USER_TYPES.PLATFORM_SUPER_ADMIN ||
    userType === USER_TYPES.PLATFORM_ADMIN
  ) {
    return true;
  }

  // Org admins can create recruiters in their organization
  if (
    userType === USER_TYPES.ORGANIZATION_ADMIN &&
    userOrganizationId === targetOrganizationId
  ) {
    return true;
  }

  return false;
};

/**
 * Check if user has platform-level access
 */
export const hasPlatformAccess = (userType: string): boolean => {
  return (
    userType === USER_TYPES.PLATFORM_SUPER_ADMIN ||
    userType === USER_TYPES.PLATFORM_ADMIN
  );
};

/**
 * Check if user is super admin
 */
export const isSuperAdmin = (userType: string): boolean => {
  return userType === USER_TYPES.PLATFORM_SUPER_ADMIN;
};

/**
 * Check if user can delete organizations
 */
export const canDeleteOrganizations = (userType: string): boolean => {
  // Only super admins can delete organizations
  return userType === USER_TYPES.PLATFORM_SUPER_ADMIN;
};

/**
 * Check if user can create organizations
 */
export const canCreateOrganizations = (userType: string): boolean => {
  return (
    userType === USER_TYPES.PLATFORM_SUPER_ADMIN ||
    userType === USER_TYPES.PLATFORM_ADMIN
  );
};

/**
 * Check if user can block other users
 */
export const canBlockUsers = (userType: string): boolean => {
  // Platform admins can block users globally
  return (
    userType === USER_TYPES.PLATFORM_SUPER_ADMIN ||
    userType === USER_TYPES.PLATFORM_ADMIN
  );
};

/**
 * Get user permissions based on user type
 */
export const getUserPermissions = (userType: string): string[] => {
  const permissions: string[] = [];

  switch (userType) {
    case USER_TYPES.PLATFORM_SUPER_ADMIN:
      permissions.push("*"); // All permissions
      break;

    case USER_TYPES.PLATFORM_ADMIN:
      permissions.push(
        "manage:organizations",
        "view:analytics",
        "create:org_admins",
        "block:users",
      );
      break;

    case USER_TYPES.ORGANIZATION_ADMIN:
      permissions.push(
        "manage:org",
        "manage:employees",
        "manage:recruiters",
        "view:applications",
        "view:referrals",
        "post:jobs",
      );
      break;

    case USER_TYPES.ORG_RECRUITER:
      permissions.push(
        "post:jobs",
        "manage:applications",
        "manage:referrals",
        "give:referrals",
      );
      break;

    case USER_TYPES.EMPLOYEE_REFERRER:
      permissions.push("give:referrals", "apply:jobs", "view:own_referrals");
      break;

    case USER_TYPES.JOB_SEEKER:
      permissions.push("apply:jobs", "view:own_applications");
      break;

    case USER_TYPES.REFERRAL_PROVIDER:
      permissions.push("give:referrals", "view:own_referrals");
      break;
  }

  return permissions;
};

/**
 * Check if user has specific permission
 */
export const hasPermission = (
  userType: string,
  permission: string,
): boolean => {
  const permissions = getUserPermissions(userType);

  // Super admin has all permissions
  if (permissions.includes("*")) {
    return true;
  }

  return permissions.includes(permission);
};
