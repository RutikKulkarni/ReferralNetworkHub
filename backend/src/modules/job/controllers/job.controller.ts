import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { jobService } from "../services/job.service";
import { AuthenticatedUser } from "../../../shared/types";

// Type guard to check if request has authenticated user
function isAuthenticated(req: Request): req is Request & { user: AuthenticatedUser } {
  return !!req.user;
}

/**
 * Create a new job posting
 */
export const createJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Check authentication
    if (!isAuthenticated(req)) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }

    // Get organization from tenant context
    const organizationId = req.tenant?.organizationId;
    if (!organizationId) {
      res.status(400).json({
        success: false,
        message: "Organization context is required",
      });
      return;
    }

    const job = await jobService.createJob(
      req.body,
      req.user.id,
      organizationId,
    );

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get list of jobs with filters and pagination
 */
export const listJobs = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const filters = {
      is_active: req.query.is_active === "true" ? true : req.query.is_active === "false" ? false : undefined,
      job_type: req.query.job_type as string,
      experience_level: req.query.experience_level as string,
      location: req.query.location as string,
      is_referral_eligible: req.query.is_referral_eligible === "true" ? true : undefined,
      salary_min: req.query.salary_min ? Number(req.query.salary_min) : undefined,
      salary_max: req.query.salary_max ? Number(req.query.salary_max) : undefined,
      search: req.query.search as string,
    };

    const pagination = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    };

    // Get organization from tenant context (if authenticated)
    const organizationId = req.tenant?.organizationId;

    const result = await jobService.listJobs(filters, pagination, organizationId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single job by ID
 */
export const getJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;

    // Get organization from tenant context (if authenticated)
    const organizationId = req.tenant?.organizationId;

    const job = await jobService.getJob(jobId, organizationId);

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a job
 */
export const updateJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Check authentication
    if (!isAuthenticated(req)) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }

    const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;
    const organizationId = req.tenant?.organizationId;

    if (!organizationId) {
      res.status(400).json({
        success: false,
        message: "Organization context is required",
      });
      return;
    }

    const job = await jobService.updateJob(
      jobId,
      req.body,
      req.user.id,
      organizationId,
    );

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a job (soft delete)
 */
export const deleteJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Check authentication
    if (!isAuthenticated(req)) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;
    const organizationId = req.tenant?.organizationId;

    if (!organizationId) {
      res.status(400).json({
        success: false,
        message: "Organization context is required",
      });
      return;
    }

    const deleted = await jobService.deleteJob(jobId, organizationId);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "Job not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Close a job posting
 */
export const closeJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Check authentication
    if (!isAuthenticated(req)) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;
    const { reason } = req.body;
    const organizationId = req.tenant?.organizationId;

    if (!organizationId) {
      res.status(400).json({
        success: false,
        message: "Organization context is required",
      });
      return;
    }

    const job = await jobService.closeJob(jobId, reason || "Closed by admin", organizationId);

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Job closed successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reopen a closed job
 */
export const reopenJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Check authentication
    if (!isAuthenticated(req)) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;
    const organizationId = req.tenant?.organizationId;

    if (!organizationId) {
      res.status(400).json({
        success: false,
        message: "Organization context is required",
      });
      return;
    }

    const job = await jobService.reopenJob(jobId, organizationId);

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Job reopened successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get job statistics
 */
export const getJobStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Check authentication
    if (!isAuthenticated(req)) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;
    const organizationId = req.tenant?.organizationId;

    if (!organizationId) {
      res.status(400).json({
        success: false,
        message: "Organization context is required",
      });
      return;
    }

    const stats = await jobService.getJobStats(jobId, organizationId);

    if (!stats) {
      res.status(404).json({
        success: false,
        message: "Job not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
