import { Request, Response, NextFunction } from "express";
import { extractTenantContext, requireTenantContext } from "../../src/shared/middleware/tenant.middleware";
import { AuthRequest } from "../../src/shared/types";
import { Organization } from "../../src/database/models";

// Mock the Organization model
jest.mock("../../src/database/models", () => ({
  Organization: {
    findOne: jest.fn(),
  },
}));

describe("Tenant Isolation Middleware", () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      params: {},
      body: {},
      user: undefined,
      tenant: undefined,
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("extractTenantContext", () => {
    const mockOrganization = {
      id: "org-123",
      name: "Test Organization",
      isActive: true,
      isVerified: true,
    };

    it("should extract organization from route params", async () => {
      mockRequest.params = { organizationId: "org-123" };
      mockRequest.user = { id: "user-123", email: "test@example.com" } as any;
      (Organization.findOne as jest.Mock).mockResolvedValue(mockOrganization);

      await extractTenantContext(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(Organization.findOne).toHaveBeenCalledWith({
        where: {
          id: "org-123",
          isActive: true,
        },
      });
      expect(mockRequest.tenant).toEqual({
        organizationId: "org-123",
        organization: mockOrganization,
      });
      expect(mockNext).toHaveBeenCalled();
    });

    it("should extract organization from request body", async () => {
      mockRequest.body = { organizationId: "org-456" };
      mockRequest.user = { id: "user-123", email: "test@example.com" } as any;
      (Organization.findOne as jest.Mock).mockResolvedValue(mockOrganization);

      await extractTenantContext(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(Organization.findOne).toHaveBeenCalledWith({
        where: {
          id: "org-456",
          isActive: true,
        },
      });
      expect(mockRequest.tenant).toBeDefined();
      expect(mockNext).toHaveBeenCalled();
    });

    it("should extract organization from user context", async () => {
      mockRequest.user = {
        id: "user-123",
        email: "test@example.com",
        userType: "org_admin",
        organizationId: "org-789",
      } as any;
      (Organization.findOne as jest.Mock).mockResolvedValue(mockOrganization);

      await extractTenantContext(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(Organization.findOne).toHaveBeenCalledWith({
        where: {
          id: "org-789",
          isActive: true,
        },
      });
      expect(mockRequest.tenant).toBeDefined();
      expect(mockNext).toHaveBeenCalled();
    });

    it("should prioritize route params over body", async () => {
      mockRequest.params = { organizationId: "org-params" };
      mockRequest.body = { organizationId: "org-body" };
      mockRequest.user = { id: "user-123", email: "test@example.com" } as any;
      (Organization.findOne as jest.Mock).mockResolvedValue(mockOrganization);

      await extractTenantContext(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(Organization.findOne).toHaveBeenCalledWith({
        where: {
          id: "org-params",
          isActive: true,
        },
      });
    });

    it("should return 404 if organization not found", async () => {
      mockRequest.params = { organizationId: "invalid-org" };
      mockRequest.user = { id: "user-123", email: "test@example.com" } as any;
      (Organization.findOne as jest.Mock).mockResolvedValue(null);

      await extractTenantContext(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Organization not found or inactive",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 404 if organization is inactive", async () => {
      mockRequest.params = { organizationId: "org-123" };
      mockRequest.user = { id: "user-123", email: "test@example.com" } as any;
      (Organization.findOne as jest.Mock).mockResolvedValue(null);

      await extractTenantContext(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should continue without tenant if no organizationId provided", async () => {
      mockRequest.user = { id: "user-123", email: "test@example.com" } as any;
      
      await extractTenantContext(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(Organization.findOne).not.toHaveBeenCalled();
      expect(mockRequest.tenant).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });

    it("should handle array organizationId from params", async () => {
      mockRequest.params = { organizationId: ["org-123", "org-456"] };
      mockRequest.user = { id: "user-123", email: "test@example.com" } as any;
      (Organization.findOne as jest.Mock).mockResolvedValue(mockOrganization);

      await extractTenantContext(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(Organization.findOne).toHaveBeenCalledWith({
        where: {
          id: "org-123",
          isActive: true,
        },
      });
    });

    it("should handle errors gracefully", async () => {
      mockRequest.params = { organizationId: "org-123" };
      mockRequest.user = { id: "user-123", email: "test@example.com" } as any;
      const error = new Error("Database error");
      (Organization.findOne as jest.Mock).mockRejectedValue(error);

      await extractTenantContext(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("requireTenantContext", () => {
    it("should pass if tenant context exists", () => {
      mockRequest.tenant = {
        organizationId: "org-123",
        organization: {} as any,
      };

      requireTenantContext(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("should return 400 if tenant context is missing", () => {
      requireTenantContext(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: "Organization context is required for this operation",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 400 if organizationId is missing", () => {
      mockRequest.tenant = {
        organizationId: "",
        organization: {} as any,
      };

      requireTenantContext(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
