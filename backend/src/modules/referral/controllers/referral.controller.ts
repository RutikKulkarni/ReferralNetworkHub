import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { referralService } from "../services/referral.service";

// Type guard to check if user is authenticated
function isAuthenticated(req: Request): req is Request & { user: { id: string; userType: string } } {
  return !!req.user;
}

// Type guard to check if tenant context exists
function hasTenantContext(req: Request): req is Request & { organizationId: string } {
  return !!(req as any).organizationId;
}

/**
 * Submit a new referral
 */
export const submitReferral = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    if (!isAuthenticated(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const referral = await referralService.submitReferral(req.body, req.user.id);

    res.status(201).json({
      message: "Referral submitted successfully",
      referral,
    });
  } catch (error: any) {
    console.error("Error submitting referral:", error);
    res.status(400).json({ error: error.message || "Failed to submit referral" });
  }
};

/**
 * List all referrals (with filters)
 */
export const listReferrals = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!hasTenantContext(req)) {
      res.status(400).json({ error: "Organization context required" });
      return;
    }

    const filters = {
      status: req.query.status as string,
      job_id: req.query.job_id as string,
      referrer_id: req.query.referrer_id as string,
      candidate_id: req.query.candidate_id as string,
      referral_type: req.query.referral_type as "internal" | "external",
      date_from: req.query.date_from ? new Date(req.query.date_from as string) : undefined,
      date_to: req.query.date_to ? new Date(req.query.date_to as string) : undefined,
    };

    const pagination = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    };

    const result = await referralService.listReferrals(
      filters,
      pagination,
      undefined,
      req.organizationId,
    );

    res.json(result);
  } catch (error: any) {
    console.error("Error listing referrals:", error);
    res.status(500).json({ error: "Failed to list referrals" });
  }
};

/**
 * Get own referrals (as referrer or candidate)
 */
export const getMyReferrals = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const filters = {
      status: req.query.status as string,
      job_id: req.query.job_id as string,
    };

    const pagination = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    };

    const result = await referralService.listReferrals(
      filters,
      pagination,
      req.user.id,
    );

    res.json(result);
  } catch (error: any) {
    console.error("Error getting my referrals:", error);
    res.status(500).json({ error: "Failed to get referrals" });
  }
};

/**
 * Get a single referral
 */
export const getReferral = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const referralId = Array.isArray(id) ? id[0] : id;
    const organizationId = hasTenantContext(req) ? req.organizationId : undefined;

    const referral = await referralService.getReferral(referralId, req.user.id, organizationId);

    if (!referral) {
      res.status(404).json({ error: "Referral not found" });
      return;
    }

    res.json(referral);
  } catch (error: any) {
    console.error("Error getting referral:", error);
    res.status(500).json({ error: "Failed to get referral" });
  }
};

/**
 * Update referral status
 */
export const updateReferralStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    if (!isAuthenticated(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!hasTenantContext(req)) {
      res.status(400).json({ error: "Organization context required" });
      return;
    }

    const { id } = req.params;
    const referralId = Array.isArray(id) ? id[0] : id;

    const referral = await referralService.updateReferralStatus(
      referralId,
      req.body,
      req.user.id,
      req.organizationId,
    );

    if (!referral) {
      res.status(404).json({ error: "Referral not found" });
      return;
    }

    res.json({
      message: "Referral status updated successfully",
      referral,
    });
  } catch (error: any) {
    console.error("Error updating referral status:", error);
    res.status(500).json({ error: "Failed to update referral status" });
  }
};

/**
 * Approve referral
 */
export const approveReferral = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    if (!isAuthenticated(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!hasTenantContext(req)) {
      res.status(400).json({ error: "Organization context required" });
      return;
    }

    const { id } = req.params;
    const referralId = Array.isArray(id) ? id[0] : id;

    const referral = await referralService.approveReferral(
      referralId,
      req.user.id,
      req.organizationId,
    );

    if (!referral) {
      res.status(404).json({ error: "Referral not found or not pending" });
      return;
    }

    res.json({
      message: "Referral approved successfully",
      referral,
    });
  } catch (error: any) {
    console.error("Error approving referral:", error);
    res.status(500).json({ error: "Failed to approve referral" });
  }
};

/**
 * Reject referral
 */
export const rejectReferral = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    if (!isAuthenticated(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!hasTenantContext(req)) {
      res.status(400).json({ error: "Organization context required" });
      return;
    }

    const { id } = req.params;
    const referralId = Array.isArray(id) ? id[0] : id;

    const referral = await referralService.rejectReferral(
      referralId,
      req.body,
      req.user.id,
      req.organizationId,
    );

    if (!referral) {
      res.status(404).json({ error: "Referral not found or not pending" });
      return;
    }

    res.json({
      message: "Referral rejected successfully",
      referral,
    });
  } catch (error: any) {
    console.error("Error rejecting referral:", error);
    res.status(500).json({ error: "Failed to reject referral" });
  }
};

/**
 * Get referrals for a specific job
 */
export const getReferralsByJob = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!hasTenantContext(req)) {
      res.status(400).json({ error: "Organization context required" });
      return;
    }

    const { jobId } = req.params;
    const jobIdStr = Array.isArray(jobId) ? jobId[0] : jobId;

    const filters = {
      status: req.query.status as string,
    };

    const pagination = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    };

    const result = await referralService.getReferralsByJob(
      jobIdStr,
      filters,
      pagination,
      req.organizationId,
    );

    res.json(result);
  } catch (error: any) {
    console.error("Error getting referrals by job:", error);
    res.status(400).json({ error: error.message || "Failed to get referrals" });
  }
};

/**
 * Get referral statistics for a job
 */
export const getReferralStatsByJob = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!hasTenantContext(req)) {
      res.status(400).json({ error: "Organization context required" });
      return;
    }

    const { jobId } = req.params;
    const jobIdStr = Array.isArray(jobId) ? jobId[0] : jobId;

    const stats = await referralService.getReferralStatsByJob(
      jobIdStr,
      req.organizationId,
    );

    if (!stats) {
      res.status(404).json({ error: "Job not found" });
      return;
    }

    res.json(stats);
  } catch (error: any) {
    console.error("Error getting referral stats:", error);
    res.status(500).json({ error: "Failed to get referral statistics" });
  }
};

/**
 * Get organization referral statistics
 */
export const getReferralStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!hasTenantContext(req)) {
      res.status(400).json({ error: "Organization context required" });
      return;
    }

    const stats = await referralService.getReferralStats(req.organizationId);

    res.json(stats);
  } catch (error: any) {
    console.error("Error getting referral stats:", error);
    res.status(500).json({ error: "Failed to get referral statistics" });
  }
};

/**
 * Process bonus payment
 */
export const processBonusPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    if (!isAuthenticated(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!hasTenantContext(req)) {
      res.status(400).json({ error: "Organization context required" });
      return;
    }

    const { id } = req.params;
    const referralId = Array.isArray(id) ? id[0] : id;

    const referral = await referralService.processBonusPayment(
      referralId,
      req.body,
      req.user.id,
      req.organizationId,
    );

    if (!referral) {
      res.status(404).json({ error: "Referral not found or not eligible for bonus payment" });
      return;
    }

    res.json({
      message: "Bonus payment processed successfully",
      referral,
    });
  } catch (error: any) {
    console.error("Error processing bonus payment:", error);
    res.status(500).json({ error: "Failed to process bonus payment" });
  }
};
