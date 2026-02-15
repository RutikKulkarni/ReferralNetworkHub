import { User } from "../../auth/models/User";
import { Organization } from "../../../database/models/Organization";
import { Job } from "../../../database/models/Job";
import { Application } from "../../../database/models/Application";
import { Referral } from "../../../database/models/Referral";
import { AuditLog } from "../../../database/models/AuditLog";
import { Op } from "sequelize";
import { sequelize } from "../../../config/database";

export interface PlatformDashboard {
  totalUsers: number;
  totalOrganizations: number;
  totalJobs: number;
  totalApplications: number;
  totalReferrals: number;
  newUsersThisMonth: number;
  activeOrganizations: number;
  platformGrowth: {
    usersGrowth: number;
    organizationsGrowth: number;
  };
}

export interface PlatformAnalytics {
  userGrowth: Array<{ date: string; count: number }>;
  organizationActivity: Array<{ organizationId: string; name: string; activeJobs: number; applications: number }>;
  jobPostingTrends: Array<{ date: string; count: number }>;
  conversionRates: {
    applicationToInterview: number;
    referralToHire: number;
  };
}

export interface SystemHealth {
  database: {
    connected: boolean;
    responseTime: number;
  };
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

export interface AuditLogFilters {
  userId?: string;
  action?: string;
  entityType?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface OrganizationFilters {
  status?: string;
  industry?: string;
  minSize?: number;
  maxSize?: number;
}

export interface UserFilters {
  userType?: string;
  isActive?: boolean;
  isBlocked?: boolean;
  organizationId?: string;
  search?: string;
}

export class AdminService {
  /**
   * Get platform-wide dashboard statistics
   */
  async getPlatformDashboard(): Promise<PlatformDashboard> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Get total counts
    const [
      totalUsers,
      totalOrganizations,
      totalJobs,
      totalApplications,
      totalReferrals,
      newUsersThisMonth,
      newUsersLastMonth,
      activeOrganizations,
      organizationsLastMonth,
    ] = await Promise.all([
      User.count(),
      Organization.count(),
      Job.count(),
      Application.count(),
      Referral.count(),
      User.count({ where: { createdAt: { [Op.gte]: firstDayOfMonth } } }),
      User.count({
        where: {
          createdAt: {
            [Op.gte]: firstDayOfLastMonth,
            [Op.lt]: firstDayOfMonth,
          },
        },
      }),
      Organization.count({ where: { isActive: true } }),
      Organization.count({
        where: {
          isActive: true,
          createdAt: { [Op.lt]: firstDayOfMonth },
        },
      }),
    ]);

    // Calculate growth percentages
    const usersGrowth = newUsersLastMonth > 0
      ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100
      : 0;

    const organizationsGrowth = organizationsLastMonth > 0
      ? ((activeOrganizations - organizationsLastMonth) / organizationsLastMonth) * 100
      : 0;

    return {
      totalUsers,
      totalOrganizations,
      totalJobs,
      totalApplications,
      totalReferrals,
      newUsersThisMonth,
      activeOrganizations,
      platformGrowth: {
        usersGrowth: Math.round(usersGrowth * 100) / 100,
        organizationsGrowth: Math.round(organizationsGrowth * 100) / 100,
      },
    };
  }

  /**
   * Get platform analytics with date range filtering
   */
  async getPlatformAnalytics(
    startDate: Date,
    endDate: Date,
  ): Promise<PlatformAnalytics> {
    // User growth over time
    const userGrowth = await User.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "ASC"]],
      raw: true,
    }) as any[];

    // Organization activity
    const organizations = await Organization.findAll({
      attributes: ["id", "name"],
      where: { isActive: true },
    });

    const organizationActivity = await Promise.all(
      organizations.map(async (org) => {
        const [activeJobs, applications] = await Promise.all([
          Job.count({
            where: {
              organization_id: org.id,
              is_active: true,
            },
          }),
          Application.count({
            where: { organization_id: org.id },
          }),
        ]);

        return {
          organizationId: org.id,
          name: org.name,
          activeJobs,
          applications,
        };
      }),
    );

    // Job posting trends
    const jobPostingTrends = await Job.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("created_at")), "date"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      where: {
        created_at: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: [sequelize.fn("DATE", sequelize.col("created_at"))],
      order: [[sequelize.fn("DATE", sequelize.col("created_at")), "ASC"]],
      raw: true,
    }) as any[];

    // Conversion rates
    const totalApplications = await Application.count();
    const interviewedApplications = await Application.count({
      where: {
        application_status: {
          [Op.in]: ["interview", "offer", "hired"],
        },
      },
    });

    const totalReferrals = await Referral.count();
    const hiredReferrals = await Referral.count({
      where: { status: { [Op.in]: ["hired", "bonus_paid"] as any[] } },
    });

    return {
      userGrowth: userGrowth.map((item) => ({
        date: item.date,
        count: parseInt(item.count, 10),
      })),
      organizationActivity,
      jobPostingTrends: jobPostingTrends.map((item) => ({
        date: item.date,
        count: parseInt(item.count, 10),
      })),
      conversionRates: {
        applicationToInterview: totalApplications > 0
          ? Math.round((interviewedApplications / totalApplications) * 10000) / 100
          : 0,
        referralToHire: totalReferrals > 0
          ? Math.round((hiredReferrals / totalReferrals) * 10000) / 100
          : 0,
      },
    };
  }

  /**
   * Get audit logs with filtering and pagination
   */
  async getAuditLogs(
    filters: AuditLogFilters = {},
    pagination: PaginationOptions = {},
  ): Promise<{ logs: AuditLog[]; total: number; pages: number; currentPage: number }> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 50;
    const offset = (page - 1) * limit;

    const whereClause: any = {};

    if (filters.userId) {
      whereClause.userId = filters.userId;
    }

    if (filters.action) {
      whereClause.action = filters.action;
    }

    if (filters.entityType) {
      whereClause.entityType = filters.entityType;
    }

    if (filters.startDate && filters.endDate) {
      whereClause.createdAt = {
        [Op.between]: [filters.startDate, filters.endDate],
      };
    } else if (filters.startDate) {
      whereClause.createdAt = { [Op.gte]: filters.startDate };
    } else if (filters.endDate) {
      whereClause.createdAt = { [Op.lte]: filters.endDate };
    }

    const { count, rows } = await AuditLog.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email", "firstName", "lastName"],
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      logs: rows,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  /**
   * Get system health metrics
   */
  async getSystemHealth(): Promise<SystemHealth> {
    const startTime = Date.now();

    // Test database connection
    let dbConnected = false;
    let dbResponseTime = 0;

    try {
      await sequelize.authenticate();
      dbConnected = true;
      dbResponseTime = Date.now() - startTime;
    } catch {
      dbConnected = false;
    }

    // Get system metrics
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    return {
      database: {
        connected: dbConnected,
        responseTime: dbResponseTime,
      },
      uptime,
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 10000) / 100,
      },
    };
  }

  /**
   * Get all organizations with filtering and pagination
   */
  async getAllOrganizations(
    filters: OrganizationFilters = {},
    pagination: PaginationOptions = {},
  ): Promise<{ organizations: Organization[]; total: number; pages: number; currentPage: number }> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;
    const offset = (page - 1) * limit;

    const whereClause: any = {};

    if (filters.status !== undefined) {
      whereClause.isActive = filters.status === "active";
    }

    if (filters.industry) {
      whereClause.industry = filters.industry;
    }

    if (filters.minSize !== undefined) {
      whereClause.company_size = { [Op.gte]: filters.minSize };
    }

    if (filters.maxSize !== undefined) {
      whereClause.company_size = {
        ...whereClause.company_size,
        [Op.lte]: filters.maxSize,
      };
    }

    const { count, rows } = await Organization.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      organizations: rows,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  /**
   * Get all users with filtering and pagination (cross-organization)
   */
  async getAllUsers(
    filters: UserFilters = {},
    pagination: PaginationOptions = {},
  ): Promise<{ users: User[]; total: number; pages: number; currentPage: number }> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;
    const offset = (page - 1) * limit;

    const whereClause: any = {};

    if (filters.userType) {
      whereClause.userType = filters.userType;
    }

    if (filters.isActive !== undefined) {
      whereClause.isActive = filters.isActive;
    }

    if (filters.isBlocked !== undefined) {
      whereClause.isBlocked = filters.isBlocked;
    }

    if (filters.search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${filters.search}%` } },
        { lastName: { [Op.iLike]: `%${filters.search}%` } },
        { email: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ["password", "refreshToken"] },
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
   * Block a user platform-wide
   */
  async blockUser(
    userId: string,
    reason: string,
    adminId: string,
  ): Promise<User | null> {
    const user = await User.findByPk(userId);

    if (!user) {
      return null;
    }

    await user.update({
      isBlocked: true,
      isActive: false,
    });

    // Create audit log
    await AuditLog.create({
      userId: adminId,
      action: "USER_BLOCKED",
      entityType: "User",
      entityId: userId,
      changes: { reason },
      ipAddress: null,
    });

    return user;
  }

  /**
   * Unblock a previously blocked user
   */
  async unblockUser(userId: string, adminId: string): Promise<User | null> {
    const user = await User.findByPk(userId);

    if (!user) {
      return null;
    }

    await user.update({
      isBlocked: false,
      isActive: true,
    });

    // Create audit log
    await AuditLog.create({
      userId: adminId,
      action: "USER_UNBLOCKED",
      entityType: "User",
      entityId: userId,
      changes: {},
      ipAddress: null,
    });

    return user;
  }
}
