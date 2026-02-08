import { USER_TYPES } from "../../src/constants";
import {
  canManageOrganization,
  canPostJobs,
  canManageApplications,
  canGiveReferrals,
  canApplyToJobs,
  canManageReferrals,
  canManageEmployees,
  canCreateRecruiters,
  hasPlatformAccess,
  isSuperAdmin,
  canDeleteOrganizations,
  canCreateOrganizations,
  canBlockUsers,
  getUserPermissions,
  hasPermission,
} from "../../src/shared/utils/permissions.utils";

describe("Permission Utilities", () => {
  describe("canManageOrganization", () => {
    it("should allow platform super admin to manage any organization", () => {
      expect(
        canManageOrganization(USER_TYPES.PLATFORM_SUPER_ADMIN, "org-123")
      ).toBe(true);
    });

    it("should allow platform admin to manage any organization", () => {
      expect(canManageOrganization(USER_TYPES.PLATFORM_ADMIN, "org-123")).toBe(
        true
      );
    });

    it("should allow org admin to manage their own organization", () => {
      expect(
        canManageOrganization(
          USER_TYPES.ORGANIZATION_ADMIN,
          "org-123",
          "org-123"
        )
      ).toBe(true);
    });

    it("should deny org admin to manage different organization", () => {
      expect(
        canManageOrganization(
          USER_TYPES.ORGANIZATION_ADMIN,
          "org-123",
          "org-456"
        )
      ).toBe(false);
    });

    it("should deny recruiters from managing organizations", () => {
      expect(
        canManageOrganization(USER_TYPES.ORG_RECRUITER, "org-123", "org-123")
      ).toBe(false);
    });

    it("should deny job seekers from managing organizations", () => {
      expect(canManageOrganization(USER_TYPES.JOB_SEEKER, "org-123")).toBe(
        false
      );
    });
  });

  describe("canPostJobs", () => {
    it("should allow platform admins to post jobs anywhere", () => {
      expect(canPostJobs(USER_TYPES.PLATFORM_SUPER_ADMIN, "org-123")).toBe(
        true
      );
      expect(canPostJobs(USER_TYPES.PLATFORM_ADMIN, "org-123")).toBe(true);
    });

    it("should allow org admin to post jobs in their organization", () => {
      expect(
        canPostJobs(USER_TYPES.ORGANIZATION_ADMIN, "org-123", "org-123")
      ).toBe(true);
    });

    it("should allow recruiter to post jobs in their organization", () => {
      expect(canPostJobs(USER_TYPES.ORG_RECRUITER, "org-123", "org-123")).toBe(
        true
      );
    });

    it("should deny org admin to post jobs in different organization", () => {
      expect(
        canPostJobs(USER_TYPES.ORGANIZATION_ADMIN, "org-123", "org-456")
      ).toBe(false);
    });

    it("should deny employees from posting jobs", () => {
      expect(
        canPostJobs(USER_TYPES.EMPLOYEE_REFERRER, "org-123", "org-123")
      ).toBe(false);
    });

    it("should deny job seekers from posting jobs", () => {
      expect(canPostJobs(USER_TYPES.JOB_SEEKER, "org-123")).toBe(false);
    });
  });

  describe("canManageApplications", () => {
    it("should allow platform admins to manage applications anywhere", () => {
      expect(
        canManageApplications(USER_TYPES.PLATFORM_SUPER_ADMIN, "org-123")
      ).toBe(true);
    });

    it("should allow org admin to manage applications in their organization", () => {
      expect(
        canManageApplications(USER_TYPES.ORGANIZATION_ADMIN, "org-123", "org-123")
      ).toBe(true);
    });

    it("should allow recruiter to manage applications in their organization", () => {
      expect(
        canManageApplications(USER_TYPES.ORG_RECRUITER, "org-123", "org-123")
      ).toBe(true);
    });

    it("should deny employees from managing applications", () => {
      expect(
        canManageApplications(USER_TYPES.EMPLOYEE_REFERRER, "org-123", "org-123")
      ).toBe(false);
    });
  });

  describe("canGiveReferrals", () => {
    it("should allow employees to give referrals", () => {
      expect(canGiveReferrals(USER_TYPES.EMPLOYEE_REFERRER)).toBe(true);
    });

    it("should allow referral providers to give referrals", () => {
      expect(canGiveReferrals(USER_TYPES.REFERRAL_PROVIDER)).toBe(true);
    });

    it("should allow recruiters to give referrals", () => {
      expect(canGiveReferrals(USER_TYPES.ORG_RECRUITER)).toBe(true);
    });

    it("should deny job seekers from giving referrals", () => {
      expect(canGiveReferrals(USER_TYPES.JOB_SEEKER)).toBe(false);
    });

    it("should deny platform admins from giving referrals", () => {
      expect(canGiveReferrals(USER_TYPES.PLATFORM_ADMIN)).toBe(false);
    });
  });

  describe("canApplyToJobs", () => {
    it("should allow job seekers to apply to jobs", () => {
      expect(canApplyToJobs(USER_TYPES.JOB_SEEKER)).toBe(true);
    });

    it("should allow employees to apply to jobs", () => {
      expect(canApplyToJobs(USER_TYPES.EMPLOYEE_REFERRER)).toBe(true);
    });

    it("should deny recruiters from applying to jobs", () => {
      expect(canApplyToJobs(USER_TYPES.ORG_RECRUITER)).toBe(false);
    });

    it("should deny org admins from applying to jobs", () => {
      expect(canApplyToJobs(USER_TYPES.ORGANIZATION_ADMIN)).toBe(false);
    });
  });

  describe("canManageReferrals", () => {
    it("should allow platform admins to manage referrals anywhere", () => {
      expect(
        canManageReferrals(USER_TYPES.PLATFORM_SUPER_ADMIN, "org-123")
      ).toBe(true);
    });

    it("should allow org admin to manage referrals in their organization", () => {
      expect(
        canManageReferrals(USER_TYPES.ORGANIZATION_ADMIN, "org-123", "org-123")
      ).toBe(true);
    });

    it("should allow recruiter to manage referrals in their organization", () => {
      expect(
        canManageReferrals(USER_TYPES.ORG_RECRUITER, "org-123", "org-123")
      ).toBe(true);
    });

    it("should deny employees from managing referrals", () => {
      expect(
        canManageReferrals(USER_TYPES.EMPLOYEE_REFERRER, "org-123", "org-123")
      ).toBe(false);
    });
  });

  describe("canManageEmployees", () => {
    it("should allow platform admins to manage employees anywhere", () => {
      expect(
        canManageEmployees(USER_TYPES.PLATFORM_SUPER_ADMIN, "org-123")
      ).toBe(true);
    });

    it("should allow org admin to manage employees in their organization", () => {
      expect(
        canManageEmployees(USER_TYPES.ORGANIZATION_ADMIN, "org-123", "org-123")
      ).toBe(true);
    });

    it("should deny recruiters from managing employees", () => {
      expect(
        canManageEmployees(USER_TYPES.ORG_RECRUITER, "org-123", "org-123")
      ).toBe(false);
    });
  });

  describe("canCreateRecruiters", () => {
    it("should allow platform admins to create recruiters anywhere", () => {
      expect(
        canCreateRecruiters(USER_TYPES.PLATFORM_SUPER_ADMIN, "org-123")
      ).toBe(true);
    });

    it("should allow org admin to create recruiters in their organization", () => {
      expect(
        canCreateRecruiters(USER_TYPES.ORGANIZATION_ADMIN, "org-123", "org-123")
      ).toBe(true);
    });

    it("should deny recruiters from creating other recruiters", () => {
      expect(
        canCreateRecruiters(USER_TYPES.ORG_RECRUITER, "org-123", "org-123")
      ).toBe(false);
    });
  });

  describe("hasPlatformAccess", () => {
    it("should return true for platform super admin", () => {
      expect(hasPlatformAccess(USER_TYPES.PLATFORM_SUPER_ADMIN)).toBe(true);
    });

    it("should return true for platform admin", () => {
      expect(hasPlatformAccess(USER_TYPES.PLATFORM_ADMIN)).toBe(true);
    });

    it("should return false for org admin", () => {
      expect(hasPlatformAccess(USER_TYPES.ORGANIZATION_ADMIN)).toBe(false);
    });

    it("should return false for recruiter", () => {
      expect(hasPlatformAccess(USER_TYPES.ORG_RECRUITER)).toBe(false);
    });
  });

  describe("isSuperAdmin", () => {
    it("should return true for platform super admin", () => {
      expect(isSuperAdmin(USER_TYPES.PLATFORM_SUPER_ADMIN)).toBe(true);
    });

    it("should return false for platform admin", () => {
      expect(isSuperAdmin(USER_TYPES.PLATFORM_ADMIN)).toBe(false);
    });

    it("should return false for org admin", () => {
      expect(isSuperAdmin(USER_TYPES.ORGANIZATION_ADMIN)).toBe(false);
    });
  });

  describe("canDeleteOrganizations", () => {
    it("should allow only super admin to delete organizations", () => {
      expect(canDeleteOrganizations(USER_TYPES.PLATFORM_SUPER_ADMIN)).toBe(
        true
      );
      expect(canDeleteOrganizations(USER_TYPES.PLATFORM_ADMIN)).toBe(false);
      expect(canDeleteOrganizations(USER_TYPES.ORGANIZATION_ADMIN)).toBe(false);
    });
  });

  describe("canCreateOrganizations", () => {
    it("should allow platform admins to create organizations", () => {
      expect(canCreateOrganizations(USER_TYPES.PLATFORM_SUPER_ADMIN)).toBe(
        true
      );
      expect(canCreateOrganizations(USER_TYPES.PLATFORM_ADMIN)).toBe(true);
    });

    it("should deny org admins from creating organizations", () => {
      expect(canCreateOrganizations(USER_TYPES.ORGANIZATION_ADMIN)).toBe(false);
    });
  });

  describe("canBlockUsers", () => {
    it("should allow platform admins to block users", () => {
      expect(canBlockUsers(USER_TYPES.PLATFORM_SUPER_ADMIN)).toBe(true);
      expect(canBlockUsers(USER_TYPES.PLATFORM_ADMIN)).toBe(true);
    });

    it("should deny org admins from blocking users", () => {
      expect(canBlockUsers(USER_TYPES.ORGANIZATION_ADMIN)).toBe(false);
    });
  });

  describe("getUserPermissions", () => {
    it("should return wildcard for platform super admin", () => {
      const permissions = getUserPermissions(USER_TYPES.PLATFORM_SUPER_ADMIN);
      expect(permissions).toEqual(["*"]);
    });

    it("should return correct permissions for platform admin", () => {
      const permissions = getUserPermissions(USER_TYPES.PLATFORM_ADMIN);
      expect(permissions).toContain("manage:organizations");
      expect(permissions).toContain("view:analytics");
      expect(permissions).toContain("create:org_admins");
      expect(permissions).toContain("block:users");
    });

    it("should return correct permissions for organization admin", () => {
      const permissions = getUserPermissions(USER_TYPES.ORGANIZATION_ADMIN);
      expect(permissions).toContain("manage:org");
      expect(permissions).toContain("manage:employees");
      expect(permissions).toContain("manage:recruiters");
      expect(permissions).toContain("view:applications");
      expect(permissions).toContain("view:referrals");
      expect(permissions).toContain("post:jobs");
    });

    it("should return correct permissions for org recruiter", () => {
      const permissions = getUserPermissions(USER_TYPES.ORG_RECRUITER);
      expect(permissions).toContain("post:jobs");
      expect(permissions).toContain("manage:applications");
      expect(permissions).toContain("manage:referrals");
      expect(permissions).toContain("give:referrals");
    });

    it("should return correct permissions for employee referrer", () => {
      const permissions = getUserPermissions(USER_TYPES.EMPLOYEE_REFERRER);
      expect(permissions).toContain("give:referrals");
      expect(permissions).toContain("apply:jobs");
      expect(permissions).toContain("view:own_referrals");
    });

    it("should return correct permissions for job seeker", () => {
      const permissions = getUserPermissions(USER_TYPES.JOB_SEEKER);
      expect(permissions).toContain("apply:jobs");
      expect(permissions).toContain("view:own_applications");
    });

    it("should return correct permissions for referral provider", () => {
      const permissions = getUserPermissions(USER_TYPES.REFERRAL_PROVIDER);
      expect(permissions).toContain("give:referrals");
      expect(permissions).toContain("view:own_referrals");
    });
  });

  describe("hasPermission", () => {
    it("should return true for super admin with any permission", () => {
      expect(
        hasPermission(USER_TYPES.PLATFORM_SUPER_ADMIN, "any:permission")
      ).toBe(true);
      expect(
        hasPermission(USER_TYPES.PLATFORM_SUPER_ADMIN, "manage:org")
      ).toBe(true);
    });

    it("should return true for user with specific permission", () => {
      expect(
        hasPermission(USER_TYPES.ORGANIZATION_ADMIN, "manage:org")
      ).toBe(true);
      expect(hasPermission(USER_TYPES.ORG_RECRUITER, "post:jobs")).toBe(true);
      expect(hasPermission(USER_TYPES.JOB_SEEKER, "apply:jobs")).toBe(true);
    });

    it("should return false for user without specific permission", () => {
      expect(
        hasPermission(USER_TYPES.JOB_SEEKER, "manage:org")
      ).toBe(false);
      expect(
        hasPermission(USER_TYPES.EMPLOYEE_REFERRER, "manage:applications")
      ).toBe(false);
      expect(
        hasPermission(USER_TYPES.ORG_RECRUITER, "manage:employees")
      ).toBe(false);
    });
  });
});
