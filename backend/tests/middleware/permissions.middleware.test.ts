import { Response, NextFunction } from "express";
import {
  requireOrganizationAccess,
  requireOrganizationAdmin,
  requireRecruiterAccess,
} from "../../src/shared/middleware/permissions.middleware";
import { AuthRequest } from "../../src/shared/types";
import { USER_TYPES } from "../../src/constants";
import {
  OrganizationAdmin,
  Recruiter,
  Employee,
} from "../../src/database/models";

// Mock the models
jest.mock("../../src/database/models", () => ({
  OrganizationAdmin: {
    findOne: jest.fn(),
  },
  Recruiter: {
    findOne: jest.fn(),
  },
  Employee: {
    findOne: jest.fn(),
  },
}));

describe("Permission Middleware", () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      user: {
        id: "user-123",
        email: "test@example.com",
        userType: "job_seeker",
      } as any,
      tenant: {
        organizationId: "org-123",
        organization: {} as any,
      },
      userOrgRole: undefined,
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("requireOrganizationAccess", () => {
    it("should allow platform super admin access to any organization", async () => {
      mockRequest.user!.userType = USER_TYPES.PLATFORM_SUPER_ADMIN;

      await requireOrganizationAccess(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockRequest.userOrgRole).toBe("platform_admin");
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("should allow platform admin access to any organization", async () => {
      mockRequest.user!.userType = USER_TYPES.PLATFORM_ADMIN;

      await requireOrganizationAccess(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockRequest.userOrgRole).toBe("platform_admin");
      expect(mockNext).toHaveBeenCalled();
    });

    it("should allow organization admin access to their organization", async () => {
      mockRequest.user!.userType = USER_TYPES.ORGANIZATION_ADMIN;
      (OrganizationAdmin.findOne as jest.Mock).mockResolvedValue({
        id: "admin-123",
        user_id: "user-123",
        organization_id: "org-123",
      });

      await requireOrganizationAccess(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(OrganizationAdmin.findOne).toHaveBeenCalledWith({
        where: {
          user_id: "user-123",
          organization_id: "org-123",
        },
      });
      expect(mockRequest.userOrgRole).toBe("admin");
      expect(mockNext).toHaveBeenCalled();
    });

    it("should allow recruiter access to their organization", async () => {
      mockRequest.user!.userType = USER_TYPES.ORG_RECRUITER;
      (OrganizationAdmin.findOne as jest.Mock).mockResolvedValue(null);
      (Recruiter.findOne as jest.Mock).mockResolvedValue({
        id: "recruiter-123",
        user_id: "user-123",
        organization_id: "org-123",
        is_active: true,
      });

      await requireOrganizationAccess(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(Recruiter.findOne).toHaveBeenCalledWith({
        where: {
          user_id: "user-123",
          organization_id: "org-123",
          is_active: true,
        },
      });
      expect(mockRequest.userOrgRole).toBe("recruiter");
      expect(mockNext).toHaveBeenCalled();
    });

    it("should allow employee access to their organization", async () => {
      mockRequest.user!.userType = USER_TYPES.EMPLOYEE_REFERRER;
      (OrganizationAdmin.findOne as jest.Mock).mockResolvedValue(null);
      (Recruiter.findOne as jest.Mock).mockResolvedValue(null);
      (Employee.findOne as jest.Mock).mockResolvedValue({
        id: "employee-123",
        user_id: "user-123",
        organization_id: "org-123",
        is_currently_employed: true,
      });

      await requireOrganizationAccess(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(Employee.findOne).toHaveBeenCalledWith({
        where: {
          user_id: "user-123",
          organization_id: "org-123",
          is_currently_employed: true,
        },
      });
      expect(mockRequest.userOrgRole).toBe("employee");
      expect(mockNext).toHaveBeenCalled();
    });

    it("should deny access if user has no relationship with organization", async () => {
      mockRequest.user!.userType = USER_TYPES.JOB_SEEKER;
      (OrganizationAdmin.findOne as jest.Mock).mockResolvedValue(null);
      (Recruiter.findOne as jest.Mock).mockResolvedValue(null);
      (Employee.findOne as jest.Mock).mockResolvedValue(null);

      await requireOrganizationAccess(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "You do not have access to this organization",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 400 if organization context is missing", async () => {
      mockRequest.tenant = undefined;

      await requireOrganizationAccess(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Organization context required",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle errors gracefully", async () => {
      const error = new Error("Database error");
      (OrganizationAdmin.findOne as jest.Mock).mockRejectedValue(error);

      await requireOrganizationAccess(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("requireOrganizationAdmin", () => {
    it("should allow platform admins", async () => {
      mockRequest.user!.userType = USER_TYPES.PLATFORM_ADMIN;

      await requireOrganizationAdmin(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockRequest.userOrgRole).toBe("platform_admin");
      expect(mockNext).toHaveBeenCalled();
    });

    it("should allow organization admins for their organization", async () => {
      mockRequest.user!.userType = USER_TYPES.ORGANIZATION_ADMIN;
      (OrganizationAdmin.findOne as jest.Mock).mockResolvedValue({
        id: "admin-123",
      });

      await requireOrganizationAdmin(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockRequest.userOrgRole).toBe("admin");
      expect(mockNext).toHaveBeenCalled();
    });

    it("should deny access to recruiters", async () => {
      mockRequest.user!.userType = USER_TYPES.ORG_RECRUITER;
      (OrganizationAdmin.findOne as jest.Mock).mockResolvedValue(null);

      await requireOrganizationAdmin(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Organization admin access required",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should deny access to employees", async () => {
      mockRequest.user!.userType = USER_TYPES.EMPLOYEE_REFERRER;
      (OrganizationAdmin.findOne as jest.Mock).mockResolvedValue(null);

      await requireOrganizationAdmin(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 400 if organization context is missing", async () => {
      mockRequest.tenant = undefined;

      await requireOrganizationAdmin(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("requireRecruiterAccess", () => {
    it("should allow platform admins", async () => {
      mockRequest.user!.userType = USER_TYPES.PLATFORM_SUPER_ADMIN;

      await requireRecruiterAccess(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockRequest.userOrgRole).toBe("platform_admin");
      expect(mockNext).toHaveBeenCalled();
    });

    it("should allow organization admins", async () => {
      mockRequest.user!.userType = USER_TYPES.ORGANIZATION_ADMIN;
      (OrganizationAdmin.findOne as jest.Mock).mockResolvedValue({
        id: "admin-123",
      });

      await requireRecruiterAccess(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockRequest.userOrgRole).toBe("admin");
      expect(mockNext).toHaveBeenCalled();
    });

    it("should allow recruiters for their organization", async () => {
      mockRequest.user!.userType = USER_TYPES.ORG_RECRUITER;
      (OrganizationAdmin.findOne as jest.Mock).mockResolvedValue(null);
      (Recruiter.findOne as jest.Mock).mockResolvedValue({
        id: "recruiter-123",
        is_active: true,
      });

      await requireRecruiterAccess(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockRequest.userOrgRole).toBe("recruiter");
      expect(mockNext).toHaveBeenCalled();
    });

    it("should deny access to employees", async () => {
      mockRequest.user!.userType = USER_TYPES.EMPLOYEE_REFERRER;
      (OrganizationAdmin.findOne as jest.Mock).mockResolvedValue(null);
      (Recruiter.findOne as jest.Mock).mockResolvedValue(null);

      await requireRecruiterAccess(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Recruiter or admin access required",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should deny access to inactive recruiters", async () => {
      mockRequest.user!.userType = USER_TYPES.ORG_RECRUITER;
      (OrganizationAdmin.findOne as jest.Mock).mockResolvedValue(null);
      (Recruiter.findOne as jest.Mock).mockResolvedValue(null); // Inactive recruiter not found

      await requireRecruiterAccess(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 400 if organization context is missing", async () => {
      mockRequest.tenant = undefined;

      await requireRecruiterAccess(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
