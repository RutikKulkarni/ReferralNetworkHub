import { Request, Response, NextFunction } from "express";
import {
  createOrganization,
  listOrganizations,
  getOrganization,
  updateOrganization,
  deactivateOrganization,
  getOrganizationStats,
  verifyOrganization,
} from "../../src/modules/organization/controllers/organization.controller";
import { createMockOrganization } from "../factories";

// Mock OrganizationService with a factory that returns a consistent mock instance
const mockCreate = jest.fn();
const mockListOrgs = jest.fn();
const mockGetOrg = jest.fn();
const mockUpdateOrg = jest.fn();
const mockDeactivateOrg = jest.fn();
const mockGetOrgStats = jest.fn();
const mockVerifyOrg = jest.fn();
const mockIsNameAvailable = jest.fn();

jest.mock("../../src/modules/organization/services/organization.service", () => ({
  OrganizationService: jest.fn().mockImplementation(() => ({
    createOrganization: (...args: any[]) => mockCreate(...args),
    listOrganizations: (...args: any[]) => mockListOrgs(...args),
    getOrganization: (...args: any[]) => mockGetOrg(...args),
    updateOrganization: (...args: any[]) => mockUpdateOrg(...args),
    deactivateOrganization: (...args: any[]) => mockDeactivateOrg(...args),
    getOrganizationStats: (...args: any[]) => mockGetOrgStats(...args),
    verifyOrganization: (...args: any[]) => mockVerifyOrg(...args),
    isNameAvailable: (...args: any[]) => mockIsNameAvailable(...args),
  })),
}));

// Mock permissions utils
const mockHasPlatformAccess = jest.fn().mockReturnValue(true);
jest.mock("../../src/shared/utils/permissions.utils", () => ({
  hasPlatformAccess: (...args: any[]) => mockHasPlatformAccess(...args),
}));

const mockNext: NextFunction = jest.fn();

function makeReq(overrides: Partial<Request> = {}): Request {
  return {
    body: {},
    params: {},
    query: {},
    user: { id: "admin-123", userType: "platform_admin", organizationId: undefined },
    tenant: { organizationId: "org-123" },
    ...overrides,
  } as unknown as Request;
}

function makeRes(): Response {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res as unknown as Response;
}

describe("OrganizationController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHasPlatformAccess.mockReturnValue(true);
  });

  // ==================== createOrganization ====================
  describe("createOrganization", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined });
      const res = makeRes();
      await createOrganization(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 403 if not platform admin", async () => {
      mockHasPlatformAccess.mockReturnValue(false);
      const req = makeReq({ body: { name: "NewOrg" } });
      const res = makeRes();
      await createOrganization(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should return 400 if name already taken", async () => {
      mockIsNameAvailable.mockResolvedValue(false);
      const req = makeReq({ body: { name: "Existing Org" } });
      const res = makeRes();
      await createOrganization(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should create org and return 201", async () => {
      const mockOrg = createMockOrganization();
      mockIsNameAvailable.mockResolvedValue(true);
      mockCreate.mockResolvedValue(mockOrg);
      const req = makeReq({ body: { name: "TechCorp" } });
      const res = makeRes();
      await createOrganization(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: mockOrg })
      );
    });
  });

  // ==================== listOrganizations ====================
  describe("listOrganizations", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined });
      const res = makeRes();
      await listOrganizations(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 403 if not platform admin", async () => {
      mockHasPlatformAccess.mockReturnValue(false);
      const req = makeReq({ query: {} });
      const res = makeRes();
      await listOrganizations(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should list orgs and return 200", async () => {
      mockListOrgs.mockResolvedValue({
        organizations: [createMockOrganization()],
        total: 1,
        pages: 1,
        currentPage: 1,
      });
      const req = makeReq({ query: { page: "1", limit: "20" } });
      const res = makeRes();
      await listOrganizations(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // ==================== getOrganization ====================
  describe("getOrganization", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined });
      const res = makeRes();
      await getOrganization(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 if org not found", async () => {
      mockGetOrg.mockResolvedValue(null);
      const req = makeReq({ params: { organizationId: "nonexistent" } });
      const res = makeRes();
      await getOrganization(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return org data on success", async () => {
      const mockOrg = createMockOrganization();
      mockGetOrg.mockResolvedValue(mockOrg);
      const req = makeReq({ params: { organizationId: "org-123" } });
      const res = makeRes();
      await getOrganization(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: mockOrg })
      );
    });
  });

  // ==================== updateOrganization ====================
  describe("updateOrganization", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { organizationId: "org-123" } });
      const res = makeRes();
      await updateOrganization(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 if org not found", async () => {
      mockUpdateOrg.mockRejectedValue(new Error("Organization not found"));
      const req = makeReq({ params: { organizationId: "nonexistent" }, body: { name: "New" } });
      const res = makeRes();
      await updateOrganization(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 200 on successful update", async () => {
      const updatedOrg = createMockOrganization({ name: "Updated Org" });
      mockUpdateOrg.mockResolvedValue(updatedOrg);
      const req = makeReq({ params: { organizationId: "org-123" }, body: { name: "Updated Org" } });
      const res = makeRes();
      await updateOrganization(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: updatedOrg })
      );
    });
  });

  // ==================== deactivateOrganization ====================
  describe("deactivateOrganization", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined });
      const res = makeRes();
      await deactivateOrganization(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 403 if not platform admin", async () => {
      mockHasPlatformAccess.mockReturnValue(false);
      const req = makeReq({ params: { organizationId: "org-123" } });
      const res = makeRes();
      await deactivateOrganization(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should return 404 if org not found", async () => {
      mockDeactivateOrg.mockRejectedValue(new Error("Organization not found"));
      const req = makeReq({ params: { organizationId: "nonexistent" } });
      const res = makeRes();
      await deactivateOrganization(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should deactivate org and return 200", async () => {
      const org = createMockOrganization({ isActive: false });
      mockDeactivateOrg.mockResolvedValue(org);
      const req = makeReq({ params: { organizationId: "org-123" } });
      const res = makeRes();
      await deactivateOrganization(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, message: "Organization deactivated successfully" })
      );
    });
  });

  // ==================== verifyOrganization ====================
  describe("verifyOrganization", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined });
      const res = makeRes();
      await verifyOrganization(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 403 if not platform admin", async () => {
      mockHasPlatformAccess.mockReturnValue(false);
      const req = makeReq({ params: { organizationId: "org-123" } });
      const res = makeRes();
      await verifyOrganization(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should return 404 if org not found", async () => {
      mockVerifyOrg.mockRejectedValue(new Error("Organization not found"));
      const req = makeReq({ params: { organizationId: "nonexistent" } });
      const res = makeRes();
      await verifyOrganization(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should verify org and return 200", async () => {
      const org = createMockOrganization({ isVerified: true });
      mockVerifyOrg.mockResolvedValue(org);
      const req = makeReq({ params: { organizationId: "org-123" } });
      const res = makeRes();
      await verifyOrganization(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // ==================== getOrganizationStats ====================
  describe("getOrganizationStats", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined });
      const res = makeRes();
      await getOrganizationStats(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 if org not found", async () => {
      mockGetOrgStats.mockRejectedValue(new Error("Organization not found"));
      const req = makeReq({ params: { organizationId: "nonexistent" } });
      const res = makeRes();
      await getOrganizationStats(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return stats on success", async () => {
      const stats = { totalJobs: 10, activeJobs: 7, totalApplications: 50, totalReferrals: 20 };
      mockGetOrgStats.mockResolvedValue(stats);
      const req = makeReq({ params: { organizationId: "org-123" } });
      const res = makeRes();
      await getOrganizationStats(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: stats })
      );
    });
  });
});
