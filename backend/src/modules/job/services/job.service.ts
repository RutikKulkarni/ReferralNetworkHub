import { Op } from "sequelize";
import { Job } from "../../../database/models/Job";
import { Organization } from "../../../database/models/Organization";
import { User } from "../../auth/models/User";

export interface CreateJobDTO {
  title: string;
  description: string;
  requirements?: Record<string, unknown>;
  location?: string;
  job_type: "full_time" | "part_time" | "contract" | "internship";
  experience_level: "entry" | "mid" | "senior" | "lead";
  salary_range_min?: number;
  salary_range_max?: number;
  currency?: string;
  skills_required?: string[];
  benefits?: string[];
  is_referral_eligible?: boolean;
  referral_bonus?: number;
  application_deadline?: Date;
}

export interface UpdateJobDTO {
  title?: string;
  description?: string;
  requirements?: Record<string, unknown>;
  location?: string;
  job_type?: "full_time" | "part_time" | "contract" | "internship";
  experience_level?: "entry" | "mid" | "senior" | "lead";
  salary_range_min?: number;
  salary_range_max?: number;
  currency?: string;
  skills_required?: string[];
  benefits?: string[];
  is_referral_eligible?: boolean;
  referral_bonus?: number;
  application_deadline?: Date;
}

export interface JobFilters {
  is_active?: boolean;
  job_type?: string;
  experience_level?: string;
  location?: string;
  is_referral_eligible?: boolean;
  salary_min?: number;
  salary_max?: number;
  search?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export class JobService {
  /**
   * Create a new job posting
   */
  async createJob(
    data: CreateJobDTO,
    userId: string,
    organizationId: string,
  ): Promise<Job> {
    const job = await Job.create({
      ...data,
      organization_id: organizationId,
      posted_by: userId,
      posted_date: new Date(),
    });

    return job;
  }

  /**
   * Get a single job by ID
   */
  async getJob(jobId: string, organizationId?: string): Promise<Job | null> {
    const whereClause: any = { id: jobId };

    // If organizationId is provided, scope to that organization
    if (organizationId) {
      whereClause.organization_id = organizationId;
    } else {
      // Public access - only show active jobs
      whereClause.is_active = true;
    }

    const job = await Job.findOne({
      where: whereClause,
      include: [
        {
          model: Organization,
          as: "organization",
          attributes: ["id", "name", "logo", "location"],
        },
        {
          model: User,
          as: "recruiter",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
    });

    // Increment view count if job is found
    if (job && !organizationId) {
      await job.incrementViews();
    }

    return job;
  }

  /**
   * List jobs with filters and pagination
   */
  async listJobs(
    filters: JobFilters = {},
    pagination: PaginationOptions = {},
    organizationId?: string,
  ): Promise<{ jobs: Job[]; total: number; pages: number; currentPage: number }> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;
    const offset = (page - 1) * limit;

    const whereClause: any = {};

    // Organization scoping
    if (organizationId) {
      whereClause.organization_id = organizationId;
    } else {
      // Public access - only show active jobs
      whereClause.is_active = true;
    }

    // Apply filters
    if (filters.is_active !== undefined && organizationId) {
      whereClause.is_active = filters.is_active;
    }

    if (filters.job_type) {
      whereClause.job_type = filters.job_type;
    }

    if (filters.experience_level) {
      whereClause.experience_level = filters.experience_level;
    }

    if (filters.location) {
      whereClause.location = {
        [Op.iLike]: `%${filters.location}%`,
      };
    }

    if (filters.is_referral_eligible !== undefined) {
      whereClause.is_referral_eligible = filters.is_referral_eligible;
    }

    if (filters.salary_min !== undefined) {
      whereClause.salary_range_min = {
        [Op.gte]: filters.salary_min,
      };
    }

    if (filters.salary_max !== undefined) {
      whereClause.salary_range_max = {
        [Op.lte]: filters.salary_max,
      };
    }

    // Search across title and description
    if (filters.search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${filters.search}%` } },
        { description: { [Op.iLike]: `%${filters.search}%` } },
      ];
    }

    const { count, rows } = await Job.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Organization,
          as: "organization",
          attributes: ["id", "name", "logo", "location"],
        },
      ],
      limit,
      offset,
      order: [["posted_date", "DESC"]],
    });

    return {
      jobs: rows,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  /**
   * Update a job
   */
  async updateJob(
    jobId: string,
    data: UpdateJobDTO,
    userId: string,
    organizationId: string,
  ): Promise<Job | null> {
    const job = await Job.findOne({
      where: {
        id: jobId,
        organization_id: organizationId,
      },
    });

    if (!job) {
      return null;
    }

    await job.update(data);
    return job;
  }

  /**
   * Delete a job (soft delete by setting is_active to false)
   */
  async deleteJob(
    jobId: string,
    organizationId: string,
  ): Promise<boolean> {
    const job = await Job.findOne({
      where: {
        id: jobId,
        organization_id: organizationId,
      },
    });

    if (!job) {
      return false;
    }

    await job.update({ is_active: false });
    return true;
  }

  /**
   * Close a job posting
   */
  async closeJob(
    jobId: string,
    reason: string,
    organizationId: string,
  ): Promise<Job | null> {
    const job = await Job.findOne({
      where: {
        id: jobId,
        organization_id: organizationId,
      },
    });

    if (!job) {
      return null;
    }

    await job.close(reason);
    return job;
  }

  /**
   * Reopen a closed job
   */
  async reopenJob(
    jobId: string,
    organizationId: string,
  ): Promise<Job | null> {
    const job = await Job.findOne({
      where: {
        id: jobId,
        organization_id: organizationId,
      },
    });

    if (!job) {
      return null;
    }

    await job.reopen();
    return job;
  }

  /**
   * Get job statistics
   */
  async getJobStats(
    jobId: string,
    organizationId: string,
  ): Promise<{
    viewCount: number;
    applicationCount: number;
    referralCount: number;
  } | null> {
    const job = await Job.findOne({
      where: {
        id: jobId,
        organization_id: organizationId,
      },
    });

    if (!job) {
      return null;
    }

    // Get referral count from associations
    const referrals = await job.getReferrals();

    return {
      viewCount: job.view_count,
      applicationCount: job.application_count,
      referralCount: referrals.length,
    };
  }

  /**
   * Get jobs posted by a specific recruiter
   */
  async getJobsByRecruiter(
    recruiterId: string,
    organizationId: string,
  ): Promise<Job[]> {
    return Job.findAll({
      where: {
        posted_by: recruiterId,
        organization_id: organizationId,
      },
      order: [["posted_date", "DESC"]],
    });
  }
}

export const jobService = new JobService();
