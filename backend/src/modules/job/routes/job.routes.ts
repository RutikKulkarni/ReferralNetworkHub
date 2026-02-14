import { Router } from "express";
import {
  createJob,
  listJobs,
  getJob,
  updateJob,
  deleteJob,
  closeJob,
  reopenJob,
  getJobStats,
} from "../controllers/job.controller";
import { requireAuth } from "../../auth/middleware/auth.middleware";
import {
  extractTenantContext,
  requireTenantContext,
} from "../../../shared/middleware/tenant.middleware";
import {
  requireOrganizationAccess,
  requireRecruiterAccess,
  requireOrganizationAdmin,
} from "../../../shared/middleware/permissions.middleware";
import {
  validateCreateJob,
  validateUpdateJob,
} from "../validators/job.validator";

const router = Router();

/**
 * Public Routes (no authentication required)
 * These routes only show active jobs
 */

// GET /api/jobs - List all active jobs (public)
router.get("/", listJobs);

// GET /api/jobs/:jobId - Get job details (public, active jobs only)
router.get("/:jobId", getJob);

/**
 * Protected Routes (authentication required)
 * These routes require organization context and proper permissions
 */

// POST /api/jobs - Create a new job
// Requires: Auth + Organization Access + Recruiter or Admin role
router.post(
  "/",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  requireOrganizationAccess,
  requireRecruiterAccess,
  validateCreateJob,
  createJob,
);

// PUT /api/jobs/:jobId - Update a job
// Requires: Auth + Organization Access + Recruiter or Admin role
router.put(
  "/:jobId",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  requireOrganizationAccess,
  requireRecruiterAccess,
  validateUpdateJob,
  updateJob,
);

// DELETE /api/jobs/:jobId - Delete a job
// Requires: Auth + Organization Access + Admin role only
router.delete(
  "/:jobId",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  requireOrganizationAccess,
  requireOrganizationAdmin,
  deleteJob,
);

// POST /api/jobs/:jobId/close - Close a job
// Requires: Auth + Organization Access + Recruiter or Admin role
router.post(
  "/:jobId/close",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  requireOrganizationAccess,
  requireRecruiterAccess,
  closeJob,
);

// POST /api/jobs/:jobId/reopen - Reopen a closed job
// Requires: Auth + Organization Access + Recruiter or Admin role
router.post(
  "/:jobId/reopen",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  requireOrganizationAccess,
  requireRecruiterAccess,
  reopenJob,
);

// GET /api/jobs/:jobId/stats - Get job statistics
// Requires: Auth + Organization Access
router.get(
  "/:jobId/stats",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  requireOrganizationAccess,
  getJobStats,
);

export default router;
