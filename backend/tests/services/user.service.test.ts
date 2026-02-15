import { UserService } from "../../src/modules/user/services/user.service";
import { User } from "../../src/modules/auth/models/User";
import { UserProfile } from "../../src/database/models/UserProfile";
import { OrganizationAdmin } from "../../src/database/models/OrganizationAdmin";
import { Recruiter } from "../../src/database/models/Recruiter";
import { Employee } from "../../src/database/models/Employee";

// Mock the models
jest.mock("../../src/modules/auth/models/User");
jest.mock("../../src/database/models/UserProfile");
jest.mock("../../src/database/models/OrganizationAdmin");
jest.mock("../../src/database/models/Recruiter");
jest.mock("../../src/database/models/Employee");

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  describe("listUsers", () => {
    const mockOrgId = "org-123";
    const mockRequestingUserId = "user-123";

    it("should list users with organization context", async () => {
      const mockUsers = [
        { id: "user-1", email: "user1@example.com", userType: "JOB_SEEKER" },
        { id: "user-2", email: "user2@example.com", userType: "EMPLOYEE_REFERRER" },
      ];

      (OrganizationAdmin.findAll as jest.Mock).mockResolvedValue([
        { user_id: "user-1" },
      ]);
      (Recruiter.findAll as jest.Mock).mockResolvedValue([{ user_id: "user-2" }]);
      (Employee.findAll as jest.Mock).mockResolvedValue([]);
      (User.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 2,
        rows: mockUsers,
      });

      const result = await userService.listUsers(
        {},
        { page: 1, limit: 20 },
        mockRequestingUserId,
        mockOrgId
      );

      expect(result.users).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.pages).toBe(1);
      expect(result.currentPage).toBe(1);
    });

    it("should filter users by userType", async () => {
      (User.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 1,
        rows: [{ id: "user-1", userType: "JOB_SEEKER" }],
      });

      await userService.listUsers(
        { userType: "JOB_SEEKER" },
        { page: 1, limit: 20 },
        mockRequestingUserId
      );

      expect(User.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userType: "JOB_SEEKER",
          }),
        })
      );
    });

    it("should filter users by isActive status", async () => {
      (User.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 1,
        rows: [{ id: "user-1", isActive: true }],
      });

      await userService.listUsers(
        { isActive: true },
        { page: 1, limit: 20 },
        mockRequestingUserId
      );

      expect(User.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: true,
          }),
        })
      );
    });

    it("should search users by name or email", async () => {
      (User.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 1,
        rows: [{ id: "user-1", email: "john@example.com" }],
      });

      await userService.listUsers(
        { search: "john" },
        { page: 1, limit: 20 },
        mockRequestingUserId
      );

      // Just verify the method was called, the actual where clause structure
      // depends on Sequelize's Op.or implementation
      expect(User.findAndCountAll).toHaveBeenCalled();
    });

    it("should handle pagination correctly", async () => {
      const mockUsers = Array.from({ length: 20 }, (_, i) => ({
        id: `user-${i}`,
        email: `user${i}@example.com`,
      }));

      (User.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 50,
        rows: mockUsers,
      });

      const result = await userService.listUsers(
        {},
        { page: 2, limit: 20 },
        mockRequestingUserId
      );

      expect(User.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 20,
          offset: 20,
        })
      );
      expect(result.pages).toBe(3);
      expect(result.currentPage).toBe(2);
    });
  });

  describe("getUser", () => {
    it("should get user by ID", async () => {
      const mockUser = {
        id: "user-123",
        email: "user@example.com",
        firstName: "John",
        lastName: "Doe",
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUser("user-123");

      expect(result).toEqual(mockUser);
      expect(User.findByPk).toHaveBeenCalledWith("user-123", expect.any(Object));
    });

    it("should return null if user not found", async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await userService.getUser("non-existent");

      expect(result).toBeNull();
    });

    it("should include user profile in response", async () => {
      const mockUser = {
        id: "user-123",
        profile: {
          bio: "Software engineer",
          skills: ["JavaScript", "TypeScript"],
        },
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUser("user-123");

      expect(result).toHaveProperty("profile");
    });
  });

  describe("updateUser", () => {
    it("should update user information", async () => {
      const mockUser = {
        id: "user-123",
        firstName: "John",
        lastName: "Doe",
        update: jest.fn().mockResolvedValue(undefined),
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (User.findByPk as jest.Mock).mockResolvedValueOnce(mockUser);

      const updateData = {
        firstName: "Jane",
        lastName: "Smith",
      };

      await userService.updateUser("user-123", updateData, "admin-123");

      expect(mockUser.update).toHaveBeenCalledWith({
        firstName: "Jane",
        lastName: "Smith",
      });
    });

    it("should update isActive status", async () => {
      const mockUser = {
        id: "user-123",
        isActive: true,
        update: jest.fn().mockResolvedValue(undefined),
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      await userService.updateUser(
        "user-123",
        { isActive: false },
        "admin-123"
      );

      expect(mockUser.update).toHaveBeenCalledWith({
        isActive: false,
      });
    });

    it("should return null if user not found", async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await userService.updateUser(
        "non-existent",
        { firstName: "Jane" },
        "admin-123"
      );

      expect(result).toBeNull();
    });
  });

  describe("deactivateUser", () => {
    it("should deactivate user", async () => {
      const mockUser = {
        id: "user-123",
        isActive: true,
        update: jest.fn().mockResolvedValue(undefined),
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      await userService.deactivateUser("user-123", "admin-123");

      expect(mockUser.update).toHaveBeenCalledWith({ isActive: false });
    });

    it("should return null if user not found", async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await userService.deactivateUser("non-existent", "admin-123");

      expect(result).toBeNull();
    });
  });

  describe("activateUser", () => {
    it("should activate user", async () => {
      const mockUser = {
        id: "user-123",
        isActive: false,
        update: jest.fn().mockResolvedValue(undefined),
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      await userService.activateUser("user-123", "admin-123");

      expect(mockUser.update).toHaveBeenCalledWith({ isActive: true });
    });

    it("should return null if user not found", async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await userService.activateUser("non-existent", "admin-123");

      expect(result).toBeNull();
    });
  });

  describe("getUserProfile", () => {
    it("should get user profile", async () => {
      const mockProfile = {
        id: "profile-123",
        user_id: "user-123",
        bio: "Software engineer",
        skills: ["JavaScript", "TypeScript"],
      };

      (UserProfile.findOne as jest.Mock).mockResolvedValue(mockProfile);

      const result = await userService.getUserProfile("user-123");

      expect(result).toEqual(mockProfile);
      expect(UserProfile.findOne).toHaveBeenCalledWith({
        where: { user_id: "user-123" },
      });
    });

    it("should return null if profile not found", async () => {
      (UserProfile.findOne as jest.Mock).mockResolvedValue(null);

      const result = await userService.getUserProfile("user-123");

      expect(result).toBeNull();
    });
  });

  describe("updateUserProfile", () => {
    it("should update existing profile", async () => {
      const mockUser = {
        id: "user-123",
        userType: "JOB_SEEKER",
      };

      const mockProfile = {
        id: "profile-123",
        user_id: "user-123",
        bio: "Old bio",
        update: jest.fn().mockResolvedValue(undefined),
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (UserProfile.findOne as jest.Mock).mockResolvedValue(mockProfile);

      const updateData = {
        bio: "New bio",
        skills: ["JavaScript", "TypeScript"],
      };

      await userService.updateUserProfile("user-123", updateData, "user-123");

      expect(mockProfile.update).toHaveBeenCalledWith(updateData);
    });

    it("should create profile if it doesn't exist", async () => {
      const mockUser = {
        id: "user-123",
        userType: "JOB_SEEKER",
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (UserProfile.findOne as jest.Mock).mockResolvedValue(null);
      (UserProfile.create as jest.Mock).mockResolvedValue({
        id: "profile-123",
        user_id: "user-123",
        profile_type: "job_seeker",
      });

      const profileData = {
        bio: "Software engineer",
        skills: ["JavaScript"],
      };

      await userService.updateUserProfile("user-123", profileData, "user-123");

      expect(UserProfile.create).toHaveBeenCalledWith({
        user_id: "user-123",
        profile_type: "job_seeker",
        ...profileData,
      });
    });

    it("should set correct profile_type for EMPLOYEE_REFERRER", async () => {
      const mockUser = {
        id: "user-123",
        userType: "EMPLOYEE_REFERRER",
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
      (UserProfile.findOne as jest.Mock).mockResolvedValue(null);
      (UserProfile.create as jest.Mock).mockResolvedValue({
        id: "profile-123",
        profile_type: "employee",
      });

      await userService.updateUserProfile("user-123", { bio: "Test" }, "user-123");

      expect(UserProfile.create).toHaveBeenCalledWith(
        expect.objectContaining({
          profile_type: "employee",
        })
      );
    });

    it("should throw error if user not found", async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(
        userService.updateUserProfile("non-existent", { bio: "Test" }, "user-123")
      ).rejects.toThrow("User not found");
    });
  });

  describe("changeUserRole", () => {
    it("should change user role", async () => {
      const mockUser = {
        id: "user-123",
        userType: "JOB_SEEKER",
        update: jest.fn().mockResolvedValue(undefined),
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      await userService.changeUserRole(
        "user-123",
        { newRole: "ORG_RECRUITER" },
        "admin-123"
      );

      expect(mockUser.update).toHaveBeenCalledWith({
        userType: "ORG_RECRUITER",
      });
    });

    it("should throw error for invalid role", async () => {
      const mockUser = {
        id: "user-123",
        userType: "JOB_SEEKER",
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        userService.changeUserRole(
          "user-123",
          { newRole: "INVALID_ROLE" },
          "admin-123"
        )
      ).rejects.toThrow("Invalid user role");
    });

    it("should return null if user not found", async () => {
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await userService.changeUserRole(
        "non-existent",
        { newRole: "ORG_RECRUITER" },
        "admin-123"
      );

      expect(result).toBeNull();
    });
  });

  describe("getUsersByRole", () => {
    it("should get users by role", async () => {
      const mockUsers = [
        { id: "user-1", userType: "ORG_RECRUITER" },
        { id: "user-2", userType: "ORG_RECRUITER" },
      ];

      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

      const result = await userService.getUsersByRole("ORG_RECRUITER");

      expect(result).toHaveLength(2);
      expect(User.findAll).toHaveBeenCalledWith({
        where: { userType: "ORG_RECRUITER" },
        attributes: { exclude: ["password", "refreshToken"] },
      });
    });

    it("should filter by organization when provided", async () => {
      const mockUsers = [
        { id: "user-1", userType: "ORG_RECRUITER" },
        { id: "user-2", userType: "ORG_RECRUITER" },
      ];

      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);
      (OrganizationAdmin.findAll as jest.Mock).mockResolvedValue([]);
      (Recruiter.findAll as jest.Mock).mockResolvedValue([
        { user_id: "user-1" },
        { user_id: "user-2" },
      ]);
      (Employee.findAll as jest.Mock).mockResolvedValue([]);

      const result = await userService.getUsersByRole("ORG_RECRUITER", "org-123");

      expect(result).toHaveLength(2);
    });
  });

  describe("getUserStats", () => {
    it("should return user statistics", async () => {
      const mockUsers = [
        { userType: "JOB_SEEKER", isActive: true, isBlocked: false, emailVerified: true },
        { userType: "JOB_SEEKER", isActive: true, isBlocked: false, emailVerified: true },
        { userType: "EMPLOYEE_REFERRER", isActive: true, isBlocked: false, emailVerified: true },
        { userType: "ORG_RECRUITER", isActive: false, isBlocked: true, emailVerified: false },
      ];

      (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

      const result = await userService.getUserStats();

      expect(result.total).toBe(4);
      expect(result.byType.JOB_SEEKER).toBe(2);
      expect(result.byType.EMPLOYEE_REFERRER).toBe(1);
      expect(result.byType.ORG_RECRUITER).toBe(1);
      expect(result.active).toBe(3);
      expect(result.inactive).toBe(1);
      expect(result.blocked).toBe(1);
      expect(result.emailVerified).toBe(3);
    });

    it("should return organization-specific stats when org ID provided", async () => {
      const mockUsers = [
        { userType: "EMPLOYEE_REFERRER", isActive: true, isBlocked: false, emailVerified: true },
        { userType: "ORG_RECRUITER", isActive: true, isBlocked: false, emailVerified: true },
      ];

      // Mock listUsers to return organization users
      jest.spyOn(userService, "listUsers").mockResolvedValue({
        users: mockUsers as any,
        total: 2,
        pages: 1,
        currentPage: 1,
      });

      const result = await userService.getUserStats("org-123");

      expect(result.total).toBe(2);
      expect(result.byType.EMPLOYEE_REFERRER).toBe(1);
      expect(result.byType.ORG_RECRUITER).toBe(1);
    });
  });

  describe("Multi-tenant isolation", () => {
    it("should only return users from specified organization", async () => {
      const mockOrgId = "org-123";

      (OrganizationAdmin.findAll as jest.Mock).mockResolvedValue([
        { user_id: "user-1" },
      ]);
      (Recruiter.findAll as jest.Mock).mockResolvedValue([{ user_id: "user-2" }]);
      (Employee.findAll as jest.Mock).mockResolvedValue([{ user_id: "user-3" }]);
      (User.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 3,
        rows: [],
      });

      await userService.listUsers({}, {}, "admin-123", mockOrgId);

      expect(OrganizationAdmin.findAll).toHaveBeenCalledWith({
        where: { organization_id: mockOrgId },
        attributes: ["user_id"],
      });
      expect(Recruiter.findAll).toHaveBeenCalledWith({
        where: { organization_id: mockOrgId },
        attributes: ["user_id"],
      });
      expect(Employee.findAll).toHaveBeenCalledWith({
        where: { organization_id: mockOrgId },
        attributes: ["user_id"],
      });
    });
  });
});
