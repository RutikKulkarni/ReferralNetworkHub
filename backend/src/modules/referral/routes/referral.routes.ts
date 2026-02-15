import { Router } from "express";
import {
  submitReferral,
  listReferrals,
  getMyReferrals,
  getReferral,
  updateReferralStatus,
  approveReferral,
  rejectReferral,
  getReferralsByJob,
  getReferralStatsByJob,
  getReferralStats,
  processBonusPayment,
} from "../controllers/referral.controller";
import {
  validateSubmitReferral,
  validateUpdateStatus,
  validateApproveReferral,
  validateRejectReferral,
  validateBonusPayment,
  validateUUIDParam,
  validateJobIdParam,
  validateReferralFilters,
} from "../validators/referral.validator";
import { requireAuth } from "../../auth/middleware/auth.middleware";
import {
  extractTenantContext,
  requireTenantContext,
} from "../../../shared/middleware/tenant.middleware";
import {
  requireEmployeeAccess,
  requireRecruiterAccess,
  requireAdminAccess,
} from "../../../shared/middleware/permissions.middleware";

const router = Router();

/**
 * @route   POST /api/referrals
 * @desc    Submit a new referral
 * @access  Employee+
 */
router.post(
  "/",
  requireAuth,
  requireEmployeeAccess,
  validateSubmitReferral,
  submitReferral,
);

/**
 * @route   GET /api/referrals/my-referrals
 * @desc    Get own referrals (as referrer or candidate)
 * @access  Authenticated
 */
router.get(
  "/my-referrals",
  requireAuth,
  validateReferralFilters,
  getMyReferrals,
);

/**
 * @route   GET /api/referrals/stats
 * @desc    Get organization referral statistics
 * @access  Recruiter+
 */
router.get(
  "/stats",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  requireRecruiterAccess,
  getReferralStats,
);

/**
 * @route   GET /api/referrals/job/:jobId
 * @desc    Get referrals for a specific job
 * @access  Recruiter+
 */
router.get(
  "/job/:jobId",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  requireRecruiterAccess,
  validateJobIdParam,
  validateReferralFilters,
  getReferralsByJob,
);

/**
 * @route   GET /api/referrals/job/:jobId/stats
 * @desc    Get referral statistics for a job
 * @access  Recruiter+
 */
router.get(
  "/job/:jobId/stats",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  requireRecruiterAccess,
  validateJobIdParam,
  getReferralStatsByJob,
);

/**
 * @route   GET /api/referrals
 * @desc    List all referrals (organization scoped)
 * @access  Recruiter+
 */
router.get(
  "/",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  requireRecruiterAccess,
  validateReferralFilters,
  listReferrals,
);

/**
 * @route   GET /api/referrals/:id
 * @desc    Get a single referral
 * @access  Authenticated (own referrals) or Recruiter+ (org referrals)
 */
router.get(
  "/:id",
  requireAuth,
  extractTenantContext,
  validateUUIDParam,
  getReferral,
);

/**
 * @route   PUT /api/referrals/:id/status
 * @desc    Update referral status
 * @access  Recruiter+
 */
router.put(
  "/:id/status",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  requireRecruiterAccess,
  validateUpdateStatus,
  updateReferralStatus,
);

/**
 * @route   POST /api/referrals/:id/approve
 * @desc    Approve a referral
 * @access  Recruiter+
 */
router.post(
  "/:id/approve",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  requireRecruiterAccess,
  validateApproveReferral,
  approveReferral,
);

/**
 * @route   POST /api/referrals/:id/reject
 * @desc    Reject a referral
 * @access  Recruiter+
 */
router.post(
  "/:id/reject",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  requireRecruiterAccess,
  validateRejectReferral,
  rejectReferral,
);

/**
 * @route   POST /api/referrals/:id/pay-bonus
 * @desc    Process bonus payment for a referral
 * @access  Admin
 */
router.post(
  "/:id/pay-bonus",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  requireAdminAccess,
  validateBonusPayment,
  processBonusPayment,
);

export default router;
