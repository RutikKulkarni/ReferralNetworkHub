import { Op } from "sequelize";
import { Application } from "../../../database/models/Application";
import { Job } from "../../../database/models/Job";
import { User } from "../../auth/models/User";
import { Organization } from "../../../database/models/Organization";

export interface SubmitApplicationDTO {
  job_id: string;
  cover_letter?: string;
  resume_url?: string;
  referral_id?: string;
}

export interface UpdateApplicationStatusDTO {
  application_status: "submitted" | "screening" | "interview" | "offer" | "hired" | "rejected" | "withdrawn";
  notes?: string;
  rejection_reason?: string;
  offer_details?: Record<string, unknown>;
}

export interface ApplicationFilters {
  application_status?: string;
  job_id?: string;
  applicant_id?: string;
  organization_id?: string;
  date_from?: Date;
  date_to?: Date;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export class ApplicationService {
  /**
   * Submit a new application
   */
  async submitApplication(
    data: SubmitApplicationDTO,
    userId: string,
  ): Promise<Application> {
    // Get job to verify it exists and is active
    const job = await Job.findOne({
      where: {
        id: data.job_id,
        is_active: true,
      },
    });

    if (!job) {
      throw new Error("Job not found or not accepting applications");
    }

    // Check if user already applied to this job
    const existingApplication = await Application.findOne({
      where: {
        job_id: data.job_id,
        applicant_id: userId,
        application_status: {
          [Op.notIn]: ["withdrawn", "rejected"],
        },
      },
    });

    if (existingApplication) {
      throw new Error("You have already applied to this job");
    }

    // Create application
    const application = await Application.create({
      ...data,
      applicant_id: userId,
      organization_id: job.organization_id,
      application_status: "submitted",
      applied_date: new Date(),
    });

    // Increment job application count
    await job.incrementApplications();

    return application;
  }

  /**
   * Get a single application
   */
  async getApplication(
    applicationId: string,
    userId: string,
    organizationId?: string,
  ): Promise<Application | null> {
    const whereClause: any = { id: applicationId };

    // If organization context, scope to organization
    if (organizationId) {
      whereClause.organization_id = organizationId;
    } else {
      // Otherwise, user can only see their own applications
      whereClause.applicant_id = userId;
    }

    const application = await Application.findOne({
      where: whereClause,
      include: [
        {
          model: Job,
          as: "job",
          attributes: ["id", "title", "job_type", "location"],
        },
        {
          model: User,
          as: "applicant",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: Organization,
          as: "organization",
          attributes: ["id", "name"],
        },
      ],
    });

    return application;
  }

  /**
   * List applications with filters
   */
  async listApplications(
    filters: ApplicationFilters = {},
    pagination: PaginationOptions = {},
    userId?: string,
    organizationId?: string,
  ): Promise<{ applications: Application[]; total: number; pages: number; currentPage: number }> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;
    const offset = (page - 1) * limit;

    const whereClause: any = {};

    // Organization scoping
    if (organizationId) {
      whereClause.organization_id = organizationId;
    } else if (userId) {
      // Non-org users can only see their own applications
      whereClause.applicant_id = userId;
    }

    // Apply filters
    if (filters.application_status) {
      whereClause.application_status = filters.application_status;
    }

    if (filters.job_id) {
      whereClause.job_id = filters.job_id;
    }

    if (filters.applicant_id && organizationId) {
      whereClause.applicant_id = filters.applicant_id;
    }

    if (filters.date_from || filters.date_to) {
      whereClause.applied_date = {};
      if (filters.date_from) {
        whereClause.applied_date[Op.gte] = filters.date_from;
      }
      if (filters.date_to) {
        whereClause.applied_date[Op.lte] = filters.date_to;
      }
    }

    const { count, rows } = await Application.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Job,
          as: "job",
          attributes: ["id", "title", "job_type", "location"],
        },
        {
          model: User,
          as: "applicant",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
      limit,
      offset,
      order: [["applied_date", "DESC"]],
    });

    return {
      applications: rows,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  /**
   * Update application status
   */
  async updateApplicationStatus(
    applicationId: string,
    data: UpdateApplicationStatusDTO,
    userId: string,
    organizationId: string,
  ): Promise<Application | null> {
    const application = await Application.findOne({
      where: {
        id: applicationId,
        organization_id: organizationId,
      },
    });

    if (!application) {
      return null;
    }

    await application.update({
      application_status: data.application_status,
      notes: data.notes || application.notes,
      rejection_reason: data.rejection_reason,
      offer_details: data.offer_details,
      last_updated_by: userId,
      reviewed_by: userId,
      hired_date: data.application_status === "hired" ? new Date() : application.hired_date,
    });

    return application;
  }

  /**
   * Withdraw application
   */
  async withdrawApplication(
    applicationId: string,
    userId: string,
  ): Promise<Application | null> {
    const application = await Application.findOne({
      where: {
        id: applicationId,
        applicant_id: userId,
        application_status: {
          [Op.notIn]: ["withdrawn", "hired"],
        },
      },
    });

    if (!application) {
      return null;
    }

    await application.update({
      application_status: "withdrawn",
      last_updated_by: userId,
    });

    return application;
  }

  /**
   * Get applications for a specific job
   */
  async getApplicationsByJob(
    jobId: string,
    filters: ApplicationFilters = {},
    pagination: PaginationOptions = {},
    organizationId: string,
  ): Promise<{ applications: Application[]; total: number; pages: number; currentPage: number }> {
    // Verify job belongs to organization
    const job = await Job.findOne({
      where: {
        id: jobId,
        organization_id: organizationId,
      },
    });

    if (!job) {
      throw new Error("Job not found");
    }

    return this.listApplications(
      { ...filters, job_id: jobId },
      pagination,
      undefined,
      organizationId,
    );
  }

  /**
   * Get applications by candidate
   */
  async getApplicationsByCandidate(
    userId: string,
    filters: ApplicationFilters = {},
    pagination: PaginationOptions = {},
  ): Promise<{ applications: Application[]; total: number; pages: number; currentPage: number }> {
    return this.listApplications(
      { ...filters, applicant_id: userId },
      pagination,
      userId,
    );
  }

  /**
   * Get application statistics for a job
   */
  async getApplicationStats(
    jobId: string,
    organizationId: string,
  ): Promise<{
    total: number;
    byStatus: Record<string, number>;
  } | null> {
    // Verify job belongs to organization
    const job = await Job.findOne({
      where: {
        id: jobId,
        organization_id: organizationId,
      },
    });

    if (!job) {
      return null;
    }

    const applications = await Application.findAll({
      where: { job_id: jobId },
      attributes: ["application_status"],
    });

    const byStatus: Record<string, number> = {};
    applications.forEach((app) => {
      const status = app.application_status;
      byStatus[status] = (byStatus[status] || 0) + 1;
    });

    return {
      total: applications.length,
      byStatus,
    };
  }
}

export const applicationService = new ApplicationService();
