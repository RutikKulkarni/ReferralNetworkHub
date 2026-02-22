import { Request, Response } from "express";
import {
  getDashboard,
  getAnalytics,
  getAuditLogs,
  getSystemHealth,
  listOrganizations,
  listUsers,
  blockUser,
  unblockUser,
} from "../../src/modules/admin/controllers/admin.controller";

// Individual mock functions for AdminService methods
const mockGetPlatformDashboard = jest.fn();
const mockGetPlatformAnalytics = jest.fn();
const mockGetAuditLogs = jest.fn();
const mockGetSystemHealth = jest.fn();
const mockGetAllOrganizations = jest.fn();
const mockGetAllUsers = jest.fn();
const mockBlockUser = jest.fn();
const mockUnblockUser = jest.fn();

jest.mock("../../src/modules/admin/services/admin.service", () => ({
  AdminService: jest.fn().mockImplementation(() => ({
    getPlatformDashboard: (...args: any[]) => mockGetPlatformDashboard(...args),
    getPlatformAnalytics: (...args: any[]) => mockGetPlatformAnalytics(...args),
    getAuditLogs: (...args: any[]) => mockGetAuditLogs(...args),
    getSystemHealth: (...args: any[]) => mockGetSystemHealth(...args),
    getAllOrganizations: (...args: any[]) => mockGetAllOrganizations(...args),
    getAllUsers: (...args: any[]) => mockGetAllUsers(...args),
    blockUser: (...args: any[]) => mockBlockUser(...args),
    unblockUser: (...args: any[]) => mockUnblockUser(...args),
  })),
}));

function makeReq(overrides: Partial<Request> = {}): Request {
  return {
    body: {},
    params: {},
    query: {},
    user: { id: "admin-123", userType: "platform_admin" },
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

describe("AdminController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== getDashboard ====================
  describe("getDashboard", () => {
    it("should return dashboard stats with success: true", async () => {
      const dashboard = {
        totalUsers: 1000,
        totalOrganizations: 50,
        totalJobs: 200,
        totalApplications: 500,
        totalReferrals: 150,
        activeOrganizations: 45,
        platformGrowth: { usersGrowth: 20, organizationsGrowth: 12.5 },
      };
      mockGetPlatformDashboard.mockResolvedValue(dashboard);

      const req = makeReq();
      const res = makeRes();
      await getDashboard(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: dashboard })
      );
    });

    it("should return 500 on service error", async () => {
      mockGetPlatformDashboard.mockRejectedValue(new Error("DB error"));

      const req = makeReq();
      const res = makeRes();
      await getDashboard(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  // ==================== getAnalytics ====================
  describe("getAnalytics", () => {
    it("should return 400 if startDate or endDate is missing", async () => {
      const req = makeReq({ query: { startDate: "2024-01-01" } });
      const res = makeRes();
      await getAnalytics(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, message: "Start date and end date are required" })
      );
    });

    it("should return analytics on success", async () => {
      const analytics = {
        userGrowth: [],
        organizationActivity: [],
        jobPostingTrends: [],
        conversionRates: { applicationToInterview: 25, referralToHire: 20 },
      };
      mockGetPlatformAnalytics.mockResolvedValue(analytics);

      const req = makeReq({
        query: { startDate: "2024-01-01", endDate: "2024-01-31" },
      });
      const res = makeRes();
      await getAnalytics(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: analytics })
      );
    });

    it("should return 500 on service error", async () => {
      mockGetPlatformAnalytics.mockRejectedValue(new Error("fail"));

      const req = makeReq({
        query: { startDate: "2024-01-01", endDate: "2024-01-31" },
      });
      const res = makeRes();
      await getAnalytics(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ==================== getAuditLogs ====================
  describe("getAuditLogs", () => {
    it("should return audit logs with pagination", async () => {
      const result = {
        logs: [{ id: "log-1", action: "USER_BLOCKED" }],
        total: 1,
        pages: 1,
        currentPage: 1,
      };
      mockGetAuditLogs.mockResolvedValue(result);

      const req = makeReq({ query: {} });
      const res = makeRes();
      await getAuditLogs(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: result.logs })
      );
    });

    it("should pass filters to service", async () => {
      const result = { logs: [], total: 0, pages: 0, currentPage: 1 };
      mockGetAuditLogs.mockResolvedValue(result);

      const req = makeReq({ query: { userId: "user-123", action: "USER_BLOCKED" } });
      const res = makeRes();
      await getAuditLogs(req, res);
      expect(mockGetAuditLogs).toHaveBeenCalledWith(
        expect.objectContaining({ userId: "user-123", action: "USER_BLOCKED" }),
        expect.any(Object)
      );
    });

    it("should return 500 on service error", async () => {
      mockGetAuditLogs.mockRejectedValue(new Error("fail"));

      const req = makeReq({ query: {} });
      const res = makeRes();
      await getAuditLogs(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ==================== getSystemHealth ====================
  describe("getSystemHealth", () => {
    it("should return system health data", async () => {
      const health = {
        database: { connected: true, responseTime: 5 },
        uptime: 3600,
        memory: { used: 128, total: 512, percentage: 25 },
      };
      mockGetSystemHealth.mockResolvedValue(health);

      const req = makeReq();
      const res = makeRes();
      await getSystemHealth(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: health })
      );
    });

    it("should return 500 on error", async () => {
      mockGetSystemHealth.mockRejectedValue(new Error("fail"));

      const req = makeReq();
      const res = makeRes();
      await getSystemHealth(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ==================== listOrganizations ====================
  describe("listOrganizations", () => {
    it("should list organizations with pagination meta", async () => {
      const result = {
        organizations: [{ id: "org-1", name: "Tech Corp" }],
        total: 1,
        pages: 1,
        currentPage: 1,
      };
      mockGetAllOrganizations.mockResolvedValue(result);

      const req = makeReq({ query: {} });
      const res = makeRes();
      await listOrganizations(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: result.organizations })
      );
    });

    it("should pass filters to service", async () => {
      const result = { organizations: [], total: 0, pages: 0, currentPage: 1 };
      mockGetAllOrganizations.mockResolvedValue(result);

      const req = makeReq({ query: { status: "active", industry: "Technology" } });
      const res = makeRes();
      await listOrganizations(req, res);
      expect(mockGetAllOrganizations).toHaveBeenCalledWith(
        expect.objectContaining({ status: "active", industry: "Technology" }),
        expect.any(Object)
      );
    });
  });

  // ==================== listUsers ====================
  describe("listUsers", () => {
    it("should list users with pagination meta", async () => {
      const result = {
        users: [{ id: "user-1", email: "test@example.com" }],
        total: 1,
        pages: 1,
        currentPage: 1,
      };
      mockGetAllUsers.mockResolvedValue(result);

      const req = makeReq({ query: {} });
      const res = makeRes();
      await listUsers(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: result.users })
      );
    });

    it("should filter users by userType", async () => {
      const result = { users: [], total: 0, pages: 0, currentPage: 1 };
      mockGetAllUsers.mockResolvedValue(result);

      const req = makeReq({ query: { userType: "org_recruiter" } });
      const res = makeRes();
      await listUsers(req, res);
      expect(mockGetAllUsers).toHaveBeenCalledWith(
        expect.objectContaining({ userType: "org_recruiter" }),
        expect.any(Object)
      );
    });
  });

  // ==================== blockUser ====================
  describe("blockUser", () => {
    it("should return 400 if reason is missing", async () => {
      const req = makeReq({ params: { id: "user-123" }, body: {} });
      const res = makeRes();
      await blockUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, message: "Reason is required to block a user" })
      );
    });

    it("should return 404 if user not found", async () => {
      mockBlockUser.mockResolvedValue(null);

      const req = makeReq({ params: { id: "nonexistent" }, body: { reason: "Violation" } });
      const res = makeRes();
      await blockUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should block user and return 200", async () => {
      const blockedUser = { id: "user-123", isBlocked: true, isActive: false };
      mockBlockUser.mockResolvedValue(blockedUser);

      const req = makeReq({ params: { id: "user-123" }, body: { reason: "Violation of terms" } });
      const res = makeRes();
      await blockUser(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, message: "User blocked successfully" })
      );
    });
  });

  // ==================== unblockUser ====================
  describe("unblockUser", () => {
    it("should return 404 if user not found", async () => {
      mockUnblockUser.mockResolvedValue(null);

      const req = makeReq({ params: { id: "nonexistent" } });
      const res = makeRes();
      await unblockUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should unblock user and return 200", async () => {
      const unblockedUser = { id: "user-123", isBlocked: false, isActive: true };
      mockUnblockUser.mockResolvedValue(unblockedUser);

      const req = makeReq({ params: { id: "user-123" } });
      const res = makeRes();
      await unblockUser(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, message: "User unblocked successfully" })
      );
    });

    it("should return 500 on service error", async () => {
      mockUnblockUser.mockRejectedValue(new Error("fail"));

      const req = makeReq({ params: { id: "user-123" } });
      const res = makeRes();
      await unblockUser(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
