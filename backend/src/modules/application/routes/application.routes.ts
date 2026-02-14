import { Router } from "express";
import {
  submitApplication,
  listApplications,
  getApplication,
  updateApplicationStatus,
  withdrawApplication,
  getJobApplications,
  getMyApplications,
  getApplicationStats,
} from "../controllers/application.controller";
import { requireAuth } from "../../auth/middleware/auth.middleware";
import {
  extractTenantContext,
  requireTenantContext,
} from "../../../shared/middleware/tenant.middleware";
import {
  requireOrganizationAccess,
  requireRecruiterAccess,
} from "../../../shared/middleware/permissions.middleware";
import {
  validateSubmitApplication,
  validateUpdateStatus,
} from "../validators/application.validator";

const router = Router();

/**
 * Candidate Routes (authentication required)
 */

// POST /api/applications - Submit a new application
router.post(
  "/",
  requireAuth,
  validateSubmitApplication,
  submitApplication,
);

// GET /api/applications/my-applications - Get current user's applications
router.get(
  "/my-applications",
  requireAuth,
  getMyApplications,
);

// POST /api/applications/:applicationId/withdraw - Withdraw application
router.post(
  "/:applicationId/withdraw",
  requireAuth,
  withdrawApplication,
);

/**
 * Recruiter/Admin Routes (organization access required)
 */

// GET /api/applications - List all applications (org scoped)
router.get(
  "/",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  requireOrganizationAccess,
  requireRecruiterAccess,
  listApplications,
);

// GET /api/applications/job/:jobId - Get applications for a specific job
router.get(
  "/job/:jobId",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  requireOrganizationAccess,
  requireRecruiterAccess,
  getJobApplications,
);

// GET /api/applications/job/:jobId/stats - Get application statistics for a job
router.get(
  "/job/:jobId/stats",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  requireOrganizationAccess,
  requireRecruiterAccess,
  getApplicationStats,
);

// GET /api/applications/:applicationId - Get application details
router.get(
  "/:applicationId",
  requireAuth,
  extractTenantContext,
  getApplication,
);

// PUT /api/applications/:applicationId/status - Update application status
router.put(
  "/:applicationId/status",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  requireOrganizationAccess,
  requireRecruiterAccess,
  validateUpdateStatus,
  updateApplicationStatus,
);

export default router;
