import { Op } from "sequelize";
import { Referral } from "../../../database/models/Referral";
import { Job } from "../../../database/models/Job";
import { User } from "../../auth/models/User";
import { Organization } from "../../../database/models/Organization";
import { Employee } from "../../../database/models/Employee";

export interface SubmitReferralDTO {
  job_id: string;
  candidate_id: string;
  referral_type?: "internal" | "external";
  referral_note?: string;
}

export interface UpdateReferralStatusDTO {
  status: "pending" | "accepted" | "rejected" | "application_submitted" | "hired" | "bonus_paid";
  notes?: string;
}

export interface ApproveReferralDTO {
  notes?: string;
}

export interface RejectReferralDTO {
  rejection_reason: string;
}

export interface ProcessBonusDTO {
  bonus_amount: number;
  payment_date?: Date;
}

export interface ReferralFilters {
  status?: string;
  job_id?: string;
  referrer_id?: string;
  candidate_id?: string;
  referral_type?: "internal" | "external";
  date_from?: Date;
  date_to?: Date;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export class ReferralService {
  /**
   * Submit a new referral
   */
  async submitReferral(
    data: SubmitReferralDTO,
    userId: string,
  ): Promise<Referral> {
    // Verify user is an employee
    const employee = await Employee.findOne({
      where: {
        user_id: userId,
        is_currently_employed: true,
      },
    });

    if (!employee) {
      throw new Error("Only current employees can submit referrals");
    }

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

    // Verify employee belongs to same organization as job
    if (employee.organization_id !== job.organization_id) {
      throw new Error("You can only submit referrals for jobs in your organization");
    }

    // Check if referral already exists for this job and candidate
    const existingReferral = await Referral.findOne({
      where: {
        job_id: data.job_id,
        candidate_id: data.candidate_id,
      },
    });

    if (existingReferral) {
      throw new Error("A referral already exists for this candidate and job");
    }

    // Verify candidate exists
    const candidate = await User.findByPk(data.candidate_id);
    if (!candidate) {
      throw new Error("Candidate not found");
    }

    // Create referral
    const referral = await Referral.create({
      job_id: data.job_id,
      referrer_id: userId,
      candidate_id: data.candidate_id,
      organization_id: job.organization_id,
      referral_type: data.referral_type || "external",
      referral_note: data.referral_note,
      status: "pending",
    });

    return referral;
  }

  /**
   * Get a single referral
   */
  async getReferral(
    referralId: string,
    userId: string,
    organizationId?: string,
  ): Promise<Referral | null> {
    const whereClause: any = { id: referralId };

    // If organization context, scope to organization
    if (organizationId) {
      whereClause.organization_id = organizationId;
    } else {
      // Otherwise, user can only see referrals they made or received
      whereClause[Op.or] = [
        { referrer_id: userId },
        { candidate_id: userId },
      ];
    }

    const referral = await Referral.findOne({
      where: whereClause,
      include: [
        {
          model: Job,
          as: "job",
          attributes: ["id", "title", "job_type", "location"],
        },
        {
          model: User,
          as: "referrer",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: User,
          as: "candidate",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: Organization,
          as: "organization",
          attributes: ["id", "name"],
        },
      ],
    });

    return referral;
  }

  /**
   * List referrals with filters
   */
  async listReferrals(
    filters: ReferralFilters = {},
    pagination: PaginationOptions = {},
    userId?: string,
    organizationId?: string,
  ): Promise<{ referrals: Referral[]; total: number; pages: number; currentPage: number }> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 20;
    const offset = (page - 1) * limit;

    const whereClause: any = {};

    // Organization scoping
    if (organizationId) {
      whereClause.organization_id = organizationId;
    } else if (userId) {
      // Non-org users can only see their own referrals (as referrer or candidate)
      whereClause[Op.or] = [
        { referrer_id: userId },
        { candidate_id: userId },
      ];
    }

    // Apply filters
    if (filters.status) {
      whereClause.status = filters.status;
    }

    if (filters.job_id) {
      whereClause.job_id = filters.job_id;
    }

    if (filters.referrer_id && organizationId) {
      whereClause.referrer_id = filters.referrer_id;
    }

    if (filters.candidate_id && organizationId) {
      whereClause.candidate_id = filters.candidate_id;
    }

    if (filters.referral_type) {
      whereClause.referral_type = filters.referral_type;
    }

    if (filters.date_from || filters.date_to) {
      whereClause.created_at = {};
      if (filters.date_from) {
        whereClause.created_at[Op.gte] = filters.date_from;
      }
      if (filters.date_to) {
        whereClause.created_at[Op.lte] = filters.date_to;
      }
    }

    const { count, rows } = await Referral.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Job,
          as: "job",
          attributes: ["id", "title", "job_type", "location"],
        },
        {
          model: User,
          as: "referrer",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: User,
          as: "candidate",
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    return {
      referrals: rows,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page,
    };
  }

  /**
   * Update referral status
   */
  async updateReferralStatus(
    referralId: string,
    data: UpdateReferralStatusDTO,
    userId: string,
    organizationId: string,
  ): Promise<Referral | null> {
    const referral = await Referral.findOne({
      where: {
        id: referralId,
        organization_id: organizationId,
      },
    });

    if (!referral) {
      return null;
    }

    await referral.update({
      status: data.status,
      recruiter_reviewed_by: userId,
      reviewed_at: new Date(),
    });

    return referral;
  }

  /**
   * Approve referral
   */
  async approveReferral(
    referralId: string,
    userId: string,
    organizationId: string,
  ): Promise<Referral | null> {
    const referral = await Referral.findOne({
      where: {
        id: referralId,
        organization_id: organizationId,
        status: "pending",
      },
    });

    if (!referral) {
      return null;
    }

    await referral.accept(userId);

    return referral;
  }

  /**
   * Reject referral
   */
  async rejectReferral(
    referralId: string,
    data: RejectReferralDTO,
    userId: string,
    organizationId: string,
  ): Promise<Referral | null> {
    const referral = await Referral.findOne({
      where: {
        id: referralId,
        organization_id: organizationId,
        status: "pending",
      },
    });

    if (!referral) {
      return null;
    }

    await referral.reject(userId, data.rejection_reason);

    return referral;
  }

  /**
   * Get referrals by employee (referrer)
   */
  async getReferralsByEmployee(
    employeeUserId: string,
    filters: ReferralFilters = {},
    pagination: PaginationOptions = {},
    organizationId: string,
  ): Promise<{ referrals: Referral[]; total: number; pages: number; currentPage: number }> {
    return this.listReferrals(
      { ...filters, referrer_id: employeeUserId },
      pagination,
      undefined,
      organizationId,
    );
  }

  /**
   * Get referrals for a specific job
   */
  async getReferralsByJob(
    jobId: string,
    filters: ReferralFilters = {},
    pagination: PaginationOptions = {},
    organizationId: string,
  ): Promise<{ referrals: Referral[]; total: number; pages: number; currentPage: number }> {
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

    return this.listReferrals(
      { ...filters, job_id: jobId },
      pagination,
      undefined,
      organizationId,
    );
  }

  /**
   * Get referrals by candidate
   */
  async getReferralsByCandidate(
    candidateUserId: string,
    filters: ReferralFilters = {},
    pagination: PaginationOptions = {},
  ): Promise<{ referrals: Referral[]; total: number; pages: number; currentPage: number }> {
    return this.listReferrals(
      { ...filters, candidate_id: candidateUserId },
      pagination,
      candidateUserId,
    );
  }

  /**
   * Get referral statistics for organization
   */
  async getReferralStats(
    organizationId: string,
  ): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    bonusPayable: number;
    totalBonusPaid: number;
  }> {
    const referrals = await Referral.findAll({
      where: { organization_id: organizationId },
      attributes: ["status", "referral_type", "bonus_amount", "bonus_paid_date"],
    });

    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = {};
    let bonusPayable = 0;
    let totalBonusPaid = 0;

    referrals.forEach((ref) => {
      // Count by status
      const status = ref.status;
      byStatus[status] = (byStatus[status] || 0) + 1;

      // Count by type
      const type = ref.referral_type;
      byType[type] = (byType[type] || 0) + 1;

      // Calculate bonus stats
      if (ref.isBonusPayable()) {
        bonusPayable += ref.bonus_amount || 0;
      }
      if (ref.bonus_paid_date && ref.bonus_amount) {
        totalBonusPaid += ref.bonus_amount;
      }
    });

    return {
      total: referrals.length,
      byStatus,
      byType,
      bonusPayable,
      totalBonusPaid,
    };
  }

  /**
   * Get referral statistics for a specific job
   */
  async getReferralStatsByJob(
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

    const referrals = await Referral.findAll({
      where: { job_id: jobId },
      attributes: ["status"],
    });

    const byStatus: Record<string, number> = {};
    referrals.forEach((ref) => {
      const status = ref.status;
      byStatus[status] = (byStatus[status] || 0) + 1;
    });

    return {
      total: referrals.length,
      byStatus,
    };
  }

  /**
   * Get referral statistics for an employee
   */
  async getReferralStatsByEmployee(
    employeeUserId: string,
    organizationId: string,
  ): Promise<{
    total: number;
    byStatus: Record<string, number>;
    bonusEarned: number;
  }> {
    const referrals = await Referral.findAll({
      where: {
        referrer_id: employeeUserId,
        organization_id: organizationId,
      },
      attributes: ["status", "bonus_amount", "bonus_paid_date"],
    });

    const byStatus: Record<string, number> = {};
    let bonusEarned = 0;

    referrals.forEach((ref) => {
      const status = ref.status;
      byStatus[status] = (byStatus[status] || 0) + 1;

      if (ref.bonus_paid_date && ref.bonus_amount) {
        bonusEarned += ref.bonus_amount;
      }
    });

    return {
      total: referrals.length,
      byStatus,
      bonusEarned,
    };
  }

  /**
   * Process bonus payment for a referral
   */
  async processBonusPayment(
    referralId: string,
    data: ProcessBonusDTO,
    userId: string,
    organizationId: string,
  ): Promise<Referral | null> {
    const referral = await Referral.findOne({
      where: {
        id: referralId,
        organization_id: organizationId,
        status: "hired",
      },
    });

    if (!referral) {
      return null;
    }

    await referral.update({
      bonus_amount: data.bonus_amount,
      bonus_paid_date: data.payment_date || new Date(),
      status: "bonus_paid",
    });

    return referral;
  }

  /**
   * Mark referral as application submitted
   */
  async markApplicationSubmitted(
    referralId: string,
    organizationId: string,
  ): Promise<Referral | null> {
    const referral = await Referral.findOne({
      where: {
        id: referralId,
        organization_id: organizationId,
        status: "accepted",
      },
    });

    if (!referral) {
      return null;
    }

    await referral.markApplicationSubmitted();

    return referral;
  }

  /**
   * Mark candidate as hired
   */
  async markHired(
    referralId: string,
    bonusAmount: number,
    organizationId: string,
  ): Promise<Referral | null> {
    const referral = await Referral.findOne({
      where: {
        id: referralId,
        organization_id: organizationId,
      },
    });

    if (!referral) {
      return null;
    }

    await referral.markHired(bonusAmount);

    return referral;
  }
}

export const referralService = new ReferralService();
