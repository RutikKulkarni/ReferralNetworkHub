import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { applicationService } from "../services/application.service";
import { AuthenticatedUser } from "../../../shared/types";

// Type guard to check if request has authenticated user
function isAuthenticated(req: Request): req is Request & { user: AuthenticatedUser } {
  return !!req.user;
}

/**
 * Submit a new application
 */
export const submitApplication = async (
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

    const application = await applicationService.submitApplication(
      req.body,
      req.user.id,
    );

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error: any) {
    if (error.message.includes("already applied") || error.message.includes("not found")) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }
    next(error);
  }
};

/**
 * Get list of applications
 */
export const listApplications = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const filters = {
      application_status: req.query.application_status as string,
      job_id: req.query.job_id as string,
      applicant_id: req.query.applicant_id as string,
      date_from: req.query.date_from ? new Date(req.query.date_from as string) : undefined,
      date_to: req.query.date_to ? new Date(req.query.date_to as string) : undefined,
    };

    const pagination = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    };

    // Get user and organization context
    const userId = req.user?.id;
    const organizationId = req.tenant?.organizationId;

    const result = await applicationService.listApplications(
      filters,
      pagination,
      userId,
      organizationId,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single application
 */
export const getApplication = async (
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

    const applicationId = Array.isArray(req.params.applicationId)
      ? req.params.applicationId[0]
      : req.params.applicationId;

    const organizationId = req.tenant?.organizationId;

    const application = await applicationService.getApplication(
      applicationId,
      req.user.id,
      organizationId,
    );

    if (!application) {
      res.status(404).json({
        success: false,
        message: "Application not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update application status
 */
export const updateApplicationStatus = async (
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

    const applicationId = Array.isArray(req.params.applicationId)
      ? req.params.applicationId[0]
      : req.params.applicationId;

    const organizationId = req.tenant?.organizationId;

    if (!organizationId) {
      res.status(400).json({
        success: false,
        message: "Organization context is required",
      });
      return;
    }

    const application = await applicationService.updateApplicationStatus(
      applicationId,
      req.body,
      req.user.id,
      organizationId,
    );

    if (!application) {
      res.status(404).json({
        success: false,
        message: "Application not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Withdraw application
 */
export const withdrawApplication = async (
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

    const applicationId = Array.isArray(req.params.applicationId)
      ? req.params.applicationId[0]
      : req.params.applicationId;

    const application = await applicationService.withdrawApplication(
      applicationId,
      req.user.id,
    );

    if (!application) {
      res.status(404).json({
        success: false,
        message: "Application not found or cannot be withdrawn",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Application withdrawn successfully",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get applications for a job
 */
export const getJobApplications = async (
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

    const filters = {
      application_status: req.query.application_status as string,
    };

    const pagination = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    };

    const result = await applicationService.getApplicationsByJob(
      jobId,
      filters,
      pagination,
      organizationId,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    if (error.message === "Job not found") {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }
    next(error);
  }
};

/**
 * Get current user's applications
 */
export const getMyApplications = async (
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

    const filters = {
      application_status: req.query.application_status as string,
    };

    const pagination = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    };

    const result = await applicationService.getApplicationsByCandidate(
      req.user.id,
      filters,
      pagination,
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get application statistics for a job
 */
export const getApplicationStats = async (
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

    const stats = await applicationService.getApplicationStats(jobId, organizationId);

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
