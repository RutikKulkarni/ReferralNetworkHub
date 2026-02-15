import { Op } from "sequelize";
import { User } from "../../auth/models/User";
import { UserProfile } from "../../../database/models/UserProfile";
import { OrganizationAdmin } from "../../../database/models/OrganizationAdmin";
import { Recruiter } from "../../../database/models/Recruiter";
import { Employee } from "../../../database/models/Employee";
import { USER_TYPES } from "../../../constants";

export interface UserFilters {
  userType?: string;
  isActive?: boolean;
  isBlocked?: boolean;
  emailVerified?: boolean;
  organizationId?: string;
  search?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  isBlocked?: boolean;
}

export interface UpdateUserProfileDTO {
  phone?: string;
  bio?: string;
  location?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  skills?: string[];
  experience_years?: number;
  current_company?: string;
  current_position?: string;
}

export interface ChangeUserRoleDTO {
  newRole: string;
  organizationId?: string;
}

export class UserService {
  /**
   * List users with filters and pagination
   */
  async listUsers(
    filters: UserFilters = {},
    pagination: PaginationOptions = {},
    requestingUserId: string,
    organizationId?: string,
  ): Promise<{ users: User[]; total: number; pages: number; currentPage: number }> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;
    const offset = (page - 1) * limit;

    const whereClause: any = {};

    // Apply filters
    if (filters.userType) {
      whereClause.userType = filters.userType;
    }

    if (filters.isActive !== undefined) {
      whereClause.isActive = filters.isActive;
    }

    if (filters.isBlocked !== undefined) {
      whereClause.isBlocked = filters.isBlocked;
    }

    if (filters.emailVerified !== undefined) {
      whereClause.emailVerified = filters.emailVerified;
    }

    // Search by name or email
    if (filters.search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${filters.search}%` } },
        { lastName: { [Op.iLike]: `%${filters.search}%` } },
        { email: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    // If organization context, filter users by organization
    if (organizationId) {
      // Get users who are part of this organization
      const orgAdmins = await OrganizationAdmin.findAll({
        where: { organization_id: organizationId },
        attributes: ["user_id"],
      });

      const recruiters = await Recruiter.findAll({
        where: { organization_id: organizationId },
        attributes: ["user_id"],
      });

      const employees = await Employee.findAll({
        where: { organization_id: organizationId },
        attributes: ["user_id"],
      });

      const orgUserIds = [
        ...orgAdmins.map((a) => a.user_id),
        ...recruiters.map((r) => r.user_id),
        ...employees.map((e) => e.user_id),
      ];

      whereClause.id = { [Op.in]: orgUserIds };
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ["password", "refreshToken"] },
      include: [
        {
          model: UserProfile,
          as: "profile",
          required: false,
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      users: rows,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  /**
   * Get a single user by ID
   */
  async getUser(userId: string): Promise<User | null> {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password", "refreshToken"] },
      include: [
        {
          model: UserProfile,
          as: "profile",
          required: false,
        },
      ],
    });

    return user;
  }

  /**
   * Update user information
   */
  async updateUser(
    userId: string,
    data: UpdateUserDTO,
    _requestingUserId: string,
  ): Promise<User | null> {
    const user = await User.findByPk(userId);

    if (!user) {
      return null;
    }

    // Only allow updating specific fields
    const updateData: any = {};
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.isBlocked !== undefined) updateData.isBlocked = data.isBlocked;

    await user.update(updateData);

    // Reload to get updated data without sensitive fields
    return this.getUser(userId);
  }

  /**
   * Deactivate a user
   */
  async deactivateUser(userId: string, _requestingUserId: string): Promise<User | null> {
    const user = await User.findByPk(userId);

    if (!user) {
      return null;
    }

    await user.update({ isActive: false });

    return this.getUser(userId);
  }

  /**
   * Activate a user
   */
  async activateUser(userId: string, _requestingUserId: string): Promise<User | null> {
    const user = await User.findByPk(userId);

    if (!user) {
      return null;
    }

    await user.update({ isActive: true });

    return this.getUser(userId);
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const profile = await UserProfile.findOne({
      where: { user_id: userId },
    });

    return profile;
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    userId: string,
    data: UpdateUserProfileDTO,
    _requestingUserId: string,
  ): Promise<UserProfile | null> {
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Get or create profile
    let profile = await UserProfile.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      // Create new profile - determine profile_type based on user type
      let profileType: "job_seeker" | "referral_provider" | "employee" = "job_seeker";
      if (user.userType === "EMPLOYEE_REFERRER") {
        profileType = "employee";
      } else if (user.userType === "REFERRAL_PROVIDER") {
        profileType = "referral_provider";
      }

      profile = await UserProfile.create({
        user_id: userId,
        profile_type: profileType,
        ...data,
      });
    } else {
      // Update existing profile
      await profile.update(data);
    }

    return profile;
  }

  /**
   * Change user role
   */
  async changeUserRole(
    userId: string,
    data: ChangeUserRoleDTO,
    _requestingUserId: string,
  ): Promise<User | null> {
    const user = await User.findByPk(userId);

    if (!user) {
      return null;
    }

    // Validate role
    const validRoles = Object.values(USER_TYPES);
    if (!validRoles.includes(data.newRole as any)) {
      throw new Error("Invalid user role");
    }

    await user.update({ userType: data.newRole as any });

    return this.getUser(userId);
  }

  /**
   * Get users by role
   */
  async getUsersByRole(
    role: string,
    organizationId?: string,
  ): Promise<User[]> {
    const whereClause: any = { userType: role as any };

    let users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ["password", "refreshToken"] },
    });

    // If organization context, filter by organization membership
    if (organizationId) {
      const orgAdmins = await OrganizationAdmin.findAll({
        where: { organization_id: organizationId },
        attributes: ["user_id"],
      });

      const recruiters = await Recruiter.findAll({
        where: { organization_id: organizationId },
        attributes: ["user_id"],
      });

      const employees = await Employee.findAll({
        where: { organization_id: organizationId },
        attributes: ["user_id"],
      });

      const orgUserIds = [
        ...orgAdmins.map((a) => a.user_id),
        ...recruiters.map((r) => r.user_id),
        ...employees.map((e) => e.user_id),
      ];

      users = users.filter((u) => orgUserIds.includes(u.id));
    }

    return users;
  }

  /**
   * Get user statistics
   */
  async getUserStats(organizationId?: string): Promise<{
    total: number;
    byType: Record<string, number>;
    active: number;
    inactive: number;
    blocked: number;
    emailVerified: number;
  }> {
    let users: User[];

    if (organizationId) {
      // Get organization users
      const result = await this.listUsers({}, { limit: 10000 }, "", organizationId);
      users = result.users;
    } else {
      // Get all users
      users = await User.findAll({
        attributes: ["userType", "isActive", "isBlocked", "emailVerified"],
      });
    }

    const byType: Record<string, number> = {};
    let active = 0;
    let inactive = 0;
    let blocked = 0;
    let emailVerified = 0;

    users.forEach((user) => {
      // Count by type
      byType[user.userType] = (byType[user.userType] || 0) + 1;

      // Count status
      if (user.isActive) active++;
      else inactive++;

      if (user.isBlocked) blocked++;
      if (user.emailVerified) emailVerified++;
    });

    return {
      total: users.length,
      byType,
      active,
      inactive,
      blocked,
      emailVerified,
    };
  }
}

export const userService = new UserService();
