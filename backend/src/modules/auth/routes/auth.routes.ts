import { Router } from "express";
import { AuthController, InviteController } from "../controllers";
import {
  requireAuth,
  requirePlatformSuperAdmin,
  requirePlatformAdmin,
  requireOrgAdmin,
  requireOrgAccess,
  requireOrgOwnership,
} from "../middleware/auth.middleware";
import {
  validateRegistration,
  validateLogin,
  validateInvite,
  validateAcceptInvite,
  validateRefreshToken,
  validateOAuthCallback,
} from "../middleware/validation.middleware";
import {
  authRateLimiter,
  // sensitiveRateLimiter,
} from "../../../shared/middleware/rateLimiter.middleware";

const router = Router();

// ==================== PUBLIC ROUTES ====================

/**
 * @route   POST /api/auth/register
 * @desc    Register public user (Job Seeker or Referral Provider)
 * @access  Public
 */
router.post(
  "/register",
  authRateLimiter,
  validateRegistration,
  AuthController.registerPublic,
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", authRateLimiter, validateLogin, AuthController.login);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  "/refresh-token",
  validateRefreshToken,
  AuthController.refreshToken,
);

/**
 * @route   POST /api/auth/oauth/callback
 * @desc    OAuth callback (Google)
 * @access  Public
 */
router.post(
  "/oauth/callback",
  validateOAuthCallback,
  AuthController.oauthCallback,
);

/**
 * @route   GET /api/auth/invite/validate/:token
 * @desc    Validate invite token
 * @access  Public
 */
router.get("/invite/validate/:token", AuthController.validateInvite);

/**
 * @route   POST /api/auth/invite/accept
 * @desc    Accept invite and register
 * @access  Public
 */
router.post(
  "/invite/accept",
  validateAcceptInvite,
  AuthController.acceptInvite,
);

// ==================== PROTECTED ROUTES ====================

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post("/logout", requireAuth, AuthController.logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get("/me", requireAuth, AuthController.getCurrentUser);

// ==================== INVITE ROUTES ====================

/**
 * @route   POST /api/auth/invite/platform-admin
 * @desc    Create platform admin invite
 * @access  Private (Platform Super Admin only)
 */
router.post(
  "/invite/platform-admin",
  requireAuth,
  requirePlatformSuperAdmin,
  validateInvite,
  InviteController.createPlatformAdminInvite,
);

/**
 * @route   POST /api/auth/invite/org-admin
 * @desc    Create organization admin invite
 * @access  Private (Platform Admin)
 */
router.post(
  "/invite/org-admin",
  requireAuth,
  requirePlatformAdmin,
  validateInvite,
  InviteController.createOrgAdminInvite,
);

/**
 * @route   POST /api/auth/invite/recruiter
 * @desc    Create recruiter invite
 * @access  Private (Org Admin)
 */
router.post(
  "/invite/recruiter",
  requireAuth,
  requireOrgAdmin,
  validateInvite,
  InviteController.createRecruiterInvite,
);

/**
 * @route   POST /api/auth/invite/employee
 * @desc    Create employee invite
 * @access  Private (Org Admin or Recruiter)
 */
router.post(
  "/invite/employee",
  requireAuth,
  requireOrgAccess,
  validateInvite,
  InviteController.createEmployeeInvite,
);

/**
 * @route   GET /api/auth/invite/my-invites
 * @desc    Get invites sent by current user
 * @access  Private
 */
router.get("/invite/my-invites", requireAuth, InviteController.getMyInvites);

/**
 * @route   GET /api/auth/invite/organization/:organizationId
 * @desc    Get organization invites
 * @access  Private (Org Access)
 */
router.get(
  "/invite/organization/:organizationId",
  requireAuth,
  requireOrgAccess,
  requireOrgOwnership,
  InviteController.getOrganizationInvites,
);

/**
 * @route   POST /api/auth/invite/revoke/:inviteId
 * @desc    Revoke invite
 * @access  Private
 */
router.post(
  "/invite/revoke/:inviteId",
  requireAuth,
  InviteController.revokeInvite,
);

export default router;
