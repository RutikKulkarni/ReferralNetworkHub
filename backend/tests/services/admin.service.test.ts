// Mock sequelize and database config first
jest.mock("../../src/config/database", () => ({
  sequelize: {
    authenticate: jest.fn(),
    fn: jest.fn((fnName, col) => ({ fnName, col })),
    col: jest.fn((colName) => colName),
  },
}));

// Mock the models
jest.mock("../../src/modules/auth/models/User");
jest.mock("../../src/database/models/Organization");
jest.mock("../../src/database/models/Job");
jest.mock("../../src/database/models/Application");
jest.mock("../../src/database/models/Referral");
jest.mock("../../src/database/models/AuditLog");

import { AdminService } from "../../src/modules/admin/services/admin.service";
import { User } from "../../src/modules/auth/models/User";
import { Organization } from "../../src/database/models/Organization";
import { Job } from "../../src/database/models/Job";
import { Application } from "../../src/database/models/Application";
import { Referral } from "../../src/database/models/Referral";
import { AuditLog } from "../../src/database/models/AuditLog";
import { sequelize } from "../../src/config/database";

describe("AdminService", () => {
  let adminService: AdminService;

  beforeEach(() => {
    adminService = new AdminService();
    jest.clearAllMocks();
  });

  describe("getPlatformDashboard", () => {
    it("should return platform dashboard statistics", async () => {
      // Mock all count queries
      (User.count as jest.Mock).mockResolvedValue(1000);
      (Organization.count as jest.Mock)
        .mockResolvedValueOnce(50) // totalOrganizations
        .mockResolvedValueOnce(45); // activeOrganizations

      (Job.count as jest.Mock).mockResolvedValue(200);
      (Application.count as jest.Mock).mockResolvedValue(500);
      (Referral.count as jest.Mock).mockResolvedValue(150);

      const result = await adminService.getPlatformDashboard();

      expect(result).toHaveProperty("totalUsers", 1000);
      expect(result).toHaveProperty("totalOrganizations", 50);
      expect(result).toHaveProperty("totalJobs", 200);
      expect(result).toHaveProperty("totalApplications", 500);
      expect(result).toHaveProperty("totalReferrals", 150);
      expect(result).toHaveProperty("platformGrowth");
      expect(result.platformGrowth).toHaveProperty("usersGrowth");
      expect(result.platformGrowth).toHaveProperty("organizationsGrowth");
    });

    it("should calculate growth percentages correctly", async () => {
      (User.count as jest.Mock)
        .mockResolvedValueOnce(1000) // total
        .mockResolvedValueOnce(120) // this month
        .mockResolvedValueOnce(100); // last month

      (Organization.count as jest.Mock)
        .mockResolvedValueOnce(50) // total
        .mockResolvedValueOnce(45) // active
        .mockResolvedValueOnce(40); // last month

      (Job.count as jest.Mock).mockResolvedValue(200);
      (Application.count as jest.Mock).mockResolvedValue(500);
      (Referral.count as jest.Mock).mockResolvedValue(150);

      const result = await adminService.getPlatformDashboard();

      // (120 - 100) / 100 * 100 = 20%
      expect(result.platformGrowth.usersGrowth).toBe(20);
      // (45 - 40) / 40 * 100 = 12.5%
      expect(result.platformGrowth.organizationsGrowth).toBe(12.5);
    });

    it("should handle zero growth gracefully", async () => {
      (User.count as jest.Mock)
        .mockResolvedValueOnce(1000)
        .mockResolvedValueOnce(0) // this month
        .mockResolvedValueOnce(0); // last month

      (Organization.count as jest.Mock)
        .mockResolvedValueOnce(50)
        .mockResolvedValueOnce(45)
        .mockResolvedValueOnce(0);

      (Job.count as jest.Mock).mockResolvedValue(200);
      (Application.count as jest.Mock).mockResolvedValue(500);
      (Referral.count as jest.Mock).mockResolvedValue(150);

      const result = await adminService.getPlatformDashboard();

      expect(result.platformGrowth.usersGrowth).toBe(0);
      expect(result.platformGrowth.organizationsGrowth).toBe(0);
    });
  });

  describe("getPlatformAnalytics", () => {
    it("should return platform analytics for date range", async () => {
      const startDate = new Date("2024-01-01");
      const endDate = new Date("2024-01-31");

      const mockUserGrowth = [
        { date: "2024-01-15", count: "42" },
        { date: "2024-01-16", count: "38" },
      ];

      const mockOrgs = [
        { id: "org-1", name: "Tech Corp" },
        { id: "org-2", name: "Startup Inc" },
      ];

      const mockJobTrends = [
        { date: "2024-01-15", count: "8" },
        { date: "2024-01-16", count: "12" },
      ];

      (User.findAll as jest.Mock).mockResolvedValue(mockUserGrowth);
      (Organization.findAll as jest.Mock).mockResolvedValue(mockOrgs);
      (Job.findAll as jest.Mock).mockResolvedValue(mockJobTrends);
      (Job.count as jest.Mock).mockResolvedValue(15);
      (Application.count as jest.Mock)
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(25); // interviewed

      (Referral.count as jest.Mock)
        .mockResolvedValueOnce(50) // total
        .mockResolvedValueOnce(10); // hired

      const result = await adminService.getPlatformAnalytics(startDate, endDate);

      expect(result).toHaveProperty("userGrowth");
      expect(result).toHaveProperty("organizationActivity");
      expect(result).toHaveProperty("jobPostingTrends");
      expect(result).toHaveProperty("conversionRates");
      expect(result.userGrowth).toHaveLength(2);
      expect(result.userGrowth[0].count).toBe(42);
      expect(result.jobPostingTrends).toHaveLength(2);
    });

    it("should calculate conversion rates correctly", async () => {
      (User.findAll as jest.Mock).mockResolvedValue([]);
      (Organization.findAll as jest.Mock).mockResolvedValue([]);
      (Job.findAll as jest.Mock).mockResolvedValue([]);
      (Job.count as jest.Mock).mockResolvedValue(0);
      (Application.count as jest.Mock)
        .mockResolvedValueOnce(100) // total applications
        .mockResolvedValueOnce(25); // interviewed

      (Referral.count as jest.Mock)
        .mockResolvedValueOnce(50) // total referrals
        .mockResolvedValueOnce(10); // hired

      const result = await adminService.getPlatformAnalytics(
        new Date(),
        new Date()
      );

      // 25/100 * 100 = 25%
      expect(result.conversionRates.applicationToInterview).toBe(25);
      // 10/50 * 100 = 20%
      expect(result.conversionRates.referralToHire).toBe(20);
    });

    it("should handle zero conversions gracefully", async () => {
      (User.findAll as jest.Mock).mockResolvedValue([]);
      (Organization.findAll as jest.Mock).mockResolvedValue([]);
      (Job.findAll as jest.Mock).mockResolvedValue([]);
      (Job.count as jest.Mock).mockResolvedValue(0);
      (Application.count as jest.Mock)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);
      (Referral.count as jest.Mock)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const result = await adminService.getPlatformAnalytics(
        new Date(),
        new Date()
      );

      expect(result.conversionRates.applicationToInterview).toBe(0);
      expect(result.conversionRates.referralToHire).toBe(0);
    });
  });

  describe("getSystemHealth", () => {
    it("should return system health metrics", async () => {
      const mockAuthenticate = jest.fn().mockResolvedValue(undefined);
      (sequelize as any).authenticate = mockAuthenticate;

      // Mock process.uptime and process.memoryUsage
      jest.spyOn(process, "uptime").mockReturnValue(3600);
      jest.spyOn(process, "memoryUsage").mockReturnValue({
        rss: 536870912, // 512 MB
        heapTotal: 268435456,
        heapUsed: 134217728,
        external: 0,
        arrayBuffers: 0,
      });

      const result = await adminService.getSystemHealth();

      expect(result).toHaveProperty("database");
      expect(result.database.connected).toBe(true);
      expect(result.database.responseTime).toBeGreaterThanOrEqual(0);
      expect(result).toHaveProperty("uptime", 3600);
      expect(result).toHaveProperty("memory");
      // Memory is heapUsed / 1024 / 1024 = 134217728 / 1024 / 1024 = 128 MB
      expect(result.memory.used).toBe(128);
      expect(result.memory.percentage).toBeGreaterThan(0);
    });

    it("should handle database connection failure", async () => {
      const mockAuthenticate = jest
        .fn()
        .mockRejectedValue(new Error("Connection failed"));
      (sequelize as any).authenticate = mockAuthenticate;

      jest.spyOn(process, "uptime").mockReturnValue(3600);
      jest.spyOn(process, "memoryUsage").mockReturnValue({
        rss: 536870912,
        heapTotal: 268435456,
        heapUsed: 134217728,
        external: 0,
        arrayBuffers: 0,
      });

      const result = await adminService.getSystemHealth();

      expect(result.database.connected).toBe(false);
      // When connection fails, responseTime is 0 (not -1)
      expect(result.database.responseTime).toBe(0);
    });
  });

  describe("getAllOrganizations", () => {
    it("should list all organizations with pagination", async () => {
      const mockOrgs = [
        { id: "org-1", name: "Tech Corp", isActive: true },
        { id: "org-2", name: "Startup Inc", isActive: true },
      ];

      (Organization.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 2,
        rows: mockOrgs,
      });

      const result = await adminService.getAllOrganizations(
        {},
        { page: 1, limit: 20 }
      );

      expect(result.organizations).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.pages).toBe(1);
      expect(result.currentPage).toBe(1);
    });

    it("should filter organizations by status", async () => {
      (Organization.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 1,
        rows: [{ id: "org-1", isActive: true }],
      });

      await adminService.getAllOrganizations(
        { status: "active" },
        { page: 1, limit: 20 }
      );

      expect(Organization.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: true,
          }),
        })
      );
    });

    it("should filter organizations by industry", async () => {
      (Organization.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 1,
        rows: [{ id: "org-1", industry: "Technology" }],
      });

      await adminService.getAllOrganizations(
        { industry: "Technology" },
        { page: 1, limit: 20 }
      );

      expect(Organization.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            industry: "Technology",
          }),
        })
      );
    });

    it("should filter organizations by company size range", async () => {
      (Organization.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 1,
        rows: [{ id: "org-1", companySize: 150 }],
      });

      await adminService.getAllOrganizations(
        { minSize: 100, maxSize: 500 },
        { page: 1, limit: 20 }
      );

      expect(Organization.findAndCountAll).toHaveBeenCalled();
    });
  });

  describe("getAllUsers", () => {
    it("should list all users across organizations", async () => {
      const mockUsers = [
        { id: "user-1", email: "user1@example.com", userType: "JOB_SEEKER" },
        { id: "user-2", email: "user2@example.com", userType: "ORG_RECRUITER" },
      ];

      (User.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 2,
        rows: mockUsers,
      });

      const result = await adminService.getAllUsers({}, { page: 1, limit: 20 });

      expect(result.users).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.pages).toBe(1);
    });

    it("should filter users by userType", async () => {
      (User.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 1,
        rows: [{ id: "user-1", userType: "ORG_RECRUITER" }],
      });

      await adminService.getAllUsers(
        { userType: "ORG_RECRUITER" },
        { page: 1, limit: 20 }
      );

      expect(User.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userType: "ORG_RECRUITER",
          }),
        })
      );
    });

    it("should filter users by isActive status", async () => {
      (User.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 1,
        rows: [{ id: "user-1", isActive: true }],
      });

      await adminService.getAllUsers(
        { isActive: true },
        { page: 1, limit: 20 }
      );

      expect(User.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: true,
          }),
        })
      );
    });

    it("should filter users by isBlocked status", async () => {
      (User.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 1,
        rows: [{ id: "user-1", isBlocked: true }],
      });

      await adminService.getAllUsers(
        { isBlocked: true },
        { page: 1, limit: 20 }
      );

      expect(User.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isBlocked: true,
          }),
        })
      );
    });

    it("should search users by name or email", async () => {
      (User.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 1,
        rows: [{ id: "user-1", email: "john@example.com" }],
      });

      await adminService.getAllUsers(
        { search: "john" },
        { page: 1, limit: 20 }
      );

      expect(User.findAndCountAll).toHaveBeenCalled();
    });
  });

  describe("blockUser", () => {
    it("should block a user and create audit log", async () => {
      const mockUser = {
        id: "user-123",
        isBlocked: false,
        update: jest.fn().mockResolvedValue(undefined),
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (AuditLog.create as jest.Mock).mockResolvedValue({
        id: "audit-123",
      });

      const result = await adminService.blockUser(
        "user-123",
        "Violation of terms",
        "admin-123"
      );

      // Service implementation uses isActive: false and isBlocked: true
      expect(mockUser.update).toHaveBeenCalledWith({
        isBlocked: true,
        isActive: false,
      });

      expect(AuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "admin-123",
          action: "USER_BLOCKED",
          entityType: "User",
          entityId: "user-123",
        })
      );

      expect(result).toEqual(mockUser);
    });

    it("should return null if user not found", async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await adminService.blockUser(
        "non-existent",
        "Reason",
        "admin-123"
      );

      expect(result).toBeNull();
      expect(AuditLog.create).not.toHaveBeenCalled();
    });
  });

  describe("unblockUser", () => {
    it("should unblock a user and create audit log", async () => {
      const mockUser = {
        id: "user-123",
        isBlocked: true,
        update: jest.fn().mockResolvedValue(undefined),
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (AuditLog.create as jest.Mock).mockResolvedValue({
        id: "audit-123",
      });

      const result = await adminService.unblockUser("user-123", "admin-123");

      // Service implementation uses isActive: true and isBlocked: false
      expect(mockUser.update).toHaveBeenCalledWith({
        isBlocked: false,
        isActive: true,
      });

      expect(AuditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "admin-123",
          action: "USER_UNBLOCKED",
          entityType: "User",
          entityId: "user-123",
        })
      );

      expect(result).toEqual(mockUser);
    });

    it("should return null if user not found", async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await adminService.unblockUser("non-existent", "admin-123");

      expect(result).toBeNull();
      expect(AuditLog.create).not.toHaveBeenCalled();
    });
  });

  describe("getAuditLogs", () => {
    it("should retrieve audit logs with pagination", async () => {
      const mockLogs = [
        {
          id: "log-1",
          userId: "user-1",
          action: "user.block",
          entityType: "user",
        },
        {
          id: "log-2",
          userId: "user-2",
          action: "user.unblock",
          entityType: "user",
        },
      ];

      (AuditLog.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 2,
        rows: mockLogs,
      });

      const result = await adminService.getAuditLogs({}, { page: 1, limit: 50 });

      expect(result.logs).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.pages).toBe(1);
      expect(result.currentPage).toBe(1);
    });

    it("should filter audit logs by userId", async () => {
      (AuditLog.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 1,
        rows: [{ id: "log-1", userId: "user-123" }],
      });

      await adminService.getAuditLogs(
        { userId: "user-123" },
        { page: 1, limit: 50 }
      );

      expect(AuditLog.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: "user-123",
          }),
        })
      );
    });

    it("should filter audit logs by action", async () => {
      (AuditLog.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 1,
        rows: [{ id: "log-1", action: "user.block" }],
      });

      await adminService.getAuditLogs(
        { action: "user.block" },
        { page: 1, limit: 50 }
      );

      expect(AuditLog.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            action: "user.block",
          }),
        })
      );
    });

    it("should filter audit logs by date range", async () => {
      const startDate = new Date("2024-01-01");
      const endDate = new Date("2024-01-31");

      (AuditLog.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 1,
        rows: [{ id: "log-1" }],
      });

      await adminService.getAuditLogs(
        { startDate, endDate },
        { page: 1, limit: 50 }
      );

      expect(AuditLog.findAndCountAll).toHaveBeenCalled();
    });
  });
});
