import { Router } from "express";
import {
  listUsers,
  getUser,
  updateUser,
  deactivateUser,
  activateUser,
  getUserProfile,
  updateUserProfile,
  changeUserRole,
  getUsersByRole,
  getUserStats,
} from "../controllers/user.controller";
import {
  validateUpdateUser,
  validateUpdateProfile,
  validateChangeRole,
  validateUUIDParam,
  validateRoleParam,
  validateUserFilters,
} from "../validators/user.validator";
import { requireAuth } from "../../auth/middleware/auth.middleware";
import {
  extractTenantContext,
  requireTenantContext,
} from "../../../shared/middleware/tenant.middleware";
import {
  requireOrganizationAdmin,
  requireRecruiterAccess,
} from "../../../shared/middleware/permissions.middleware";

const router = Router();

/**
 * @route   GET /api/users
 * @desc    List all users (admins/recruiters only)
 * @access  Private (Admin/Recruiter)
 */
router.get(
  "/",
  requireAuth,
  extractTenantContext,
  validateUserFilters,
  listUsers,
);

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Private (Admin/Recruiter)
 */
router.get(
  "/stats",
  requireAuth,
  extractTenantContext,
  requireRecruiterAccess,
  getUserStats,
);

/**
 * @route   GET /api/users/role/:role
 * @desc    Get users by role
 * @access  Private (Admin/Recruiter)
 */
router.get(
  "/role/:role",
  requireAuth,
  extractTenantContext,
  validateRoleParam,
  requireRecruiterAccess,
  getUsersByRole,
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get(
  "/:id",
  requireAuth,
  validateUUIDParam,
  getUser,
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user information
 * @access  Private (Admin only)
 */
router.put(
  "/:id",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  validateUUIDParam,
  validateUpdateUser,
  requireOrganizationAdmin,
  updateUser,
);

/**
 * @route   POST /api/users/:id/deactivate
 * @desc    Deactivate user
 * @access  Private (Admin only)
 */
router.post(
  "/:id/deactivate",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  validateUUIDParam,
  requireOrganizationAdmin,
  deactivateUser,
);

/**
 * @route   POST /api/users/:id/activate
 * @desc    Activate user
 * @access  Private (Admin only)
 */
router.post(
  "/:id/activate",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  validateUUIDParam,
  requireOrganizationAdmin,
  activateUser,
);

/**
 * @route   GET /api/users/:id/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get(
  "/:id/profile",
  requireAuth,
  validateUUIDParam,
  getUserProfile,
);

/**
 * @route   PUT /api/users/:id/profile
 * @desc    Update user profile
 * @access  Private (Own profile or Admin)
 */
router.put(
  "/:id/profile",
  requireAuth,
  validateUUIDParam,
  validateUpdateProfile,
  updateUserProfile,
);

/**
 * @route   POST /api/users/:id/change-role
 * @desc    Change user role
 * @access  Private (Admin only)
 */
router.post(
  "/:id/change-role",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  validateUUIDParam,
  validateChangeRole,
  requireOrganizationAdmin,
  changeUserRole,
);

export default router;
