import { Request, Response } from "express";
import {
  listUsers,
  getUser,
  updateUser,
  deactivateUser,
  activateUser,
  getUserProfile,
  updateUserProfile,
  changeUserRole,
  getUsersByRole,
  getUserStats,
} from "../../src/modules/user/controllers/user.controller";
import { userService } from "../../src/modules/user/services/user.service";
import { createMockUser } from "../factories";

// Mock the user service
jest.mock("../../src/modules/user/services/user.service", () => ({
  userService: {
    listUsers: jest.fn(),
    getUser: jest.fn(),
    updateUser: jest.fn(),
    deactivateUser: jest.fn(),
    activateUser: jest.fn(),
    getUserProfile: jest.fn(),
    updateUserProfile: jest.fn(),
    changeUserRole: jest.fn(),
    getUsersByRole: jest.fn(),
    getUserStats: jest.fn(),
  },
}));

// Mock express-validator
jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    isEmpty: () => true,
    array: () => [],
  })),
}));

function makeReq(overrides: Partial<Request> = {}): Request {
  return {
    body: {},
    params: {},
    query: {},
    user: { id: "user-123", userType: "platform_admin" },
    organizationId: "org-123",
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

describe("UserController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== listUsers ====================
  describe("listUsers", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined });
      const res = makeRes();
      await listUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should list users with filters", async () => {
      const mockResult = { users: [createMockUser()], total: 1, pages: 1, currentPage: 1 };
      (userService.listUsers as jest.Mock).mockResolvedValue(mockResult);
      const req = makeReq({ query: { userType: "job_seeker" } });
      const res = makeRes();
      await listUsers(req, res);
      expect(userService.listUsers).toHaveBeenCalledWith(
        expect.objectContaining({ userType: "job_seeker" }),
        expect.any(Object),
        "user-123",
        "org-123"
      );
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it("should return 500 on error", async () => {
      (userService.listUsers as jest.Mock).mockRejectedValue(new Error("DB error"));
      const req = makeReq({ query: {} });
      const res = makeRes();
      await listUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // ==================== getUser ====================
  describe("getUser", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { id: "user-456" } });
      const res = makeRes();
      await getUser(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 if user not found", async () => {
      (userService.getUser as jest.Mock).mockResolvedValue(null);
      const req = makeReq({ params: { id: "nonexistent" } });
      const res = makeRes();
      await getUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return user data on success", async () => {
      const mockUser = createMockUser();
      (userService.getUser as jest.Mock).mockResolvedValue(mockUser);
      const req = makeReq({ params: { id: "user-123" } });
      const res = makeRes();
      await getUser(req, res);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
  });

  // ==================== updateUser ====================
  describe("updateUser", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { id: "user-123" } });
      const res = makeRes();
      await updateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 if user not found", async () => {
      (userService.updateUser as jest.Mock).mockResolvedValue(null);
      const req = makeReq({ params: { id: "nonexistent" }, body: { firstName: "New" } });
      const res = makeRes();
      await updateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should update user and return updated data", async () => {
      const updatedUser = createMockUser({ firstName: "Updated" });
      (userService.updateUser as jest.Mock).mockResolvedValue(updatedUser);
      const req = makeReq({ params: { id: "user-123" }, body: { firstName: "Updated" } });
      const res = makeRes();
      await updateUser(req, res);
      expect(userService.updateUser).toHaveBeenCalledWith("user-123", { firstName: "Updated" }, "user-123");
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User updated successfully", user: updatedUser })
      );
    });
  });

  // ==================== deactivateUser ====================
  describe("deactivateUser", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { id: "user-123" } });
      const res = makeRes();
      await deactivateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 if user not found", async () => {
      (userService.deactivateUser as jest.Mock).mockResolvedValue(null);
      const req = makeReq({ params: { id: "nonexistent" } });
      const res = makeRes();
      await deactivateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should deactivate user successfully", async () => {
      const mockUser = createMockUser({ isActive: false });
      (userService.deactivateUser as jest.Mock).mockResolvedValue(mockUser);
      const req = makeReq({ params: { id: "user-123" } });
      const res = makeRes();
      await deactivateUser(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User deactivated successfully" })
      );
    });
  });

  // ==================== activateUser ====================
  describe("activateUser", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { id: "user-123" } });
      const res = makeRes();
      await activateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 if user not found", async () => {
      (userService.activateUser as jest.Mock).mockResolvedValue(null);
      const req = makeReq({ params: { id: "nonexistent" } });
      const res = makeRes();
      await activateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should activate user successfully", async () => {
      const mockUser = createMockUser({ isActive: true });
      (userService.activateUser as jest.Mock).mockResolvedValue(mockUser);
      const req = makeReq({ params: { id: "user-123" } });
      const res = makeRes();
      await activateUser(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User activated successfully" })
      );
    });
  });

  // ==================== getUserProfile ====================
  describe("getUserProfile", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { id: "user-123" } });
      const res = makeRes();
      await getUserProfile(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 if profile not found", async () => {
      (userService.getUserProfile as jest.Mock).mockResolvedValue(null);
      const req = makeReq({ params: { id: "nonexistent" } });
      const res = makeRes();
      await getUserProfile(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return profile on success", async () => {
      const profile = { id: "profile-123", userId: "user-123", bio: "Developer" };
      (userService.getUserProfile as jest.Mock).mockResolvedValue(profile);
      const req = makeReq({ params: { id: "user-123" } });
      const res = makeRes();
      await getUserProfile(req, res);
      expect(res.json).toHaveBeenCalledWith(profile);
    });
  });

  // ==================== updateUserProfile ====================
  describe("updateUserProfile", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { id: "user-123" } });
      const res = makeRes();
      await updateUserProfile(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 if profile not found", async () => {
      (userService.updateUserProfile as jest.Mock).mockResolvedValue(null);
      const req = makeReq({ params: { id: "nonexistent" }, body: { bio: "Dev" } });
      const res = makeRes();
      await updateUserProfile(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should update profile successfully", async () => {
      const profile = { id: "profile-123", bio: "Senior Dev" };
      (userService.updateUserProfile as jest.Mock).mockResolvedValue(profile);
      const req = makeReq({ params: { id: "user-123" }, body: { bio: "Senior Dev" } });
      const res = makeRes();
      await updateUserProfile(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Profile updated successfully" })
      );
    });
  });

  // ==================== changeUserRole ====================
  describe("changeUserRole", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { id: "user-123" } });
      const res = makeRes();
      await changeUserRole(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 if user not found", async () => {
      (userService.changeUserRole as jest.Mock).mockResolvedValue(null);
      const req = makeReq({ params: { id: "nonexistent" }, body: { userType: "org_admin" } });
      const res = makeRes();
      await changeUserRole(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should change role successfully", async () => {
      const mockUser = createMockUser({ userType: "org_admin" });
      (userService.changeUserRole as jest.Mock).mockResolvedValue(mockUser);
      const req = makeReq({ params: { id: "user-123" }, body: { userType: "org_admin" } });
      const res = makeRes();
      await changeUserRole(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User role changed successfully" })
      );
    });
  });

  // ==================== getUsersByRole ====================
  describe("getUsersByRole", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { role: "org_recruiter" } });
      const res = makeRes();
      await getUsersByRole(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return users for a given role", async () => {
      const users = [createMockUser({ userType: "org_recruiter" })];
      (userService.getUsersByRole as jest.Mock).mockResolvedValue(users);
      const req = makeReq({ params: { role: "org_recruiter" } });
      const res = makeRes();
      await getUsersByRole(req, res);
      expect(userService.getUsersByRole).toHaveBeenCalledWith("org_recruiter", "org-123");
      expect(res.json).toHaveBeenCalledWith({ users });
    });
  });

  // ==================== getUserStats ====================
  describe("getUserStats", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined });
      const res = makeRes();
      await getUserStats(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return user statistics", async () => {
      const stats = { totalUsers: 100, activeUsers: 85, jobSeekers: 60, recruiters: 40 };
      (userService.getUserStats as jest.Mock).mockResolvedValue(stats);
      const req = makeReq();
      const res = makeRes();
      await getUserStats(req, res);
      expect(userService.getUserStats).toHaveBeenCalledWith("org-123");
      expect(res.json).toHaveBeenCalledWith(stats);
    });
  });
});
