import { Organization } from "../../../database/models";
import { Op, WhereOptions } from "sequelize";

interface CreateOrganizationData {
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
  logo?: string;
}

interface UpdateOrganizationData {
  name?: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
  logo?: string;
  isActive?: boolean;
  isVerified?: boolean;
}

interface OrganizationFilters {
  isActive?: boolean;
  isVerified?: boolean;
  industry?: string;
  search?: string;
}

interface PaginationOptions {
  page?: number;
  limit?: number;
}

export class OrganizationService {
  /**
   * Create a new organization
   * Platform admins only
   */
  async createOrganization(
    data: CreateOrganizationData
  ): Promise<Organization> {
    const organization = await Organization.create({
      ...data,
      isActive: true,
      isVerified: false,
    });

    return organization;
  }

  /**
   * Update organization details
   */
  async updateOrganization(
    organizationId: string,
    data: UpdateOrganizationData
  ): Promise<Organization> {
    const organization = await Organization.findByPk(organizationId);

    if (!organization) {
      throw new Error("Organization not found");
    }

    await organization.update(data);

    return organization;
  }

  /**
   * Get organization by ID with statistics
   */
  async getOrganization(organizationId: string): Promise<Organization | null> {
    const organization = await Organization.findOne({
      where: { id: organizationId },
      include: [
        {
          association: "admins",
          attributes: ["id", "userId"],
        },
        {
          association: "recruiters",
          where: { isActive: true },
          required: false,
          attributes: ["id", "userId"],
        },
        {
          association: "employees",
          where: { isCurrentlyEmployed: true },
          required: false,
          attributes: ["id", "userId"],
        },
      ],
    });

    return organization;
  }

  /**
   * List organizations with filters and pagination
   * Platform admins only
   */
  async listOrganizations(
    filters: OrganizationFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<{ organizations: Organization[]; total: number; pages: number }> {
    const { page = 1, limit = 20 } = pagination;
    const offset = (page - 1) * limit;

    const where: WhereOptions = {};

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.isVerified !== undefined) {
      where.isVerified = filters.isVerified;
    }

    if (filters.industry) {
      where.industry = filters.industry;
    }

    if (filters.search) {
      (where as any)[Op.or] = [
        { name: { [Op.iLike]: `%${filters.search}%` } },
        { description: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    const { rows: organizations, count: total } =
      await Organization.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

    const pages = Math.ceil(total / limit);

    return { organizations, total, pages };
  }

  /**
   * Deactivate organization (soft delete)
   */
  async deactivateOrganization(
    organizationId: string
  ): Promise<Organization> {
    const organization = await Organization.findByPk(organizationId);

    if (!organization) {
      throw new Error("Organization not found");
    }

    await organization.update({
      isActive: false,
    });

    return organization;
  }

  /**
   * Activate organization
   */
  async activateOrganization(
    organizationId: string
  ): Promise<Organization> {
    const organization = await Organization.findByPk(organizationId);

    if (!organization) {
      throw new Error("Organization not found");
    }

    await organization.update({
      isActive: true,
    });

    return organization;
  }

  /**
   * Verify organization
   * Platform admins only
   */
  async verifyOrganization(
    organizationId: string
  ): Promise<Organization> {
    const organization = await Organization.findByPk(organizationId);

    if (!organization) {
      throw new Error("Organization not found");
    }

    await organization.update({
      isVerified: true,
      verifiedAt: new Date(),
    });

    return organization;
  }

  /**
   * Get organization statistics
   */
  async getOrganizationStats(organizationId: string): Promise<{
    totalAdmins: number;
    totalRecruiters: number;
    totalEmployees: number;
    totalJobs: number;
    totalApplications: number;
    totalReferrals: number;
  }> {
    const organization = await Organization.findByPk(organizationId);

    if (!organization) {
      throw new Error("Organization not found");
    }

    // Get counts using associations
    const totalAdmins = await organization.countAdmins();
    const totalRecruiters = await organization.countRecruiters({
      where: { isActive: true },
    });
    const totalEmployees = await organization.countEmployees({
      where: { isCurrentlyEmployed: true },
    });
    const totalJobs = await organization.countJobs();
    const totalApplications = await organization.countApplications();
    const totalReferrals = await organization.countReferrals();

    return {
      totalAdmins,
      totalRecruiters,
      totalEmployees,
      totalJobs,
      totalApplications,
      totalReferrals,
    };
  }

  /**
   * Check if organization name is available
   */
  async isNameAvailable(name: string, excludeId?: string): Promise<boolean> {
    const where: any = {
      name: { [Op.iLike]: name },
    };

    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }

    const existing = await Organization.findOne({ where });
    return !existing;
  }
}
