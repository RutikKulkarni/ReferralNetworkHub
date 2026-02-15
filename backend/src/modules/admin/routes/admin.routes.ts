import { Router } from "express";
import { requireAuth } from "../../auth/middleware/auth.middleware";
import { requireSuperAdmin } from "../../../shared/middleware/permissions.middleware";
import * as adminController from "../controllers/admin.controller";
import * as adminValidator from "../validators/admin.validator";

const router = Router();

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get platform dashboard statistics
 * @access  Super Admin
 */
router.get(
  "/dashboard",
  requireAuth,
  requireSuperAdmin,
  adminController.getDashboard,
);

/**
 * @route   GET /api/admin/analytics
 * @desc    Get platform analytics
 * @access  Super Admin
 */
router.get(
  "/analytics",
  requireAuth,
  requireSuperAdmin,
  adminController.getAnalytics,
);

/**
 * @route   GET /api/admin/audit-logs
 * @desc    Get audit logs
 * @access  Super Admin
 */
router.get(
  "/audit-logs",
  requireAuth,
  requireSuperAdmin,
  adminController.getAuditLogs,
);

/**
 * @route   GET /api/admin/system-health
 * @desc    Get system health status
 * @access  Super Admin
 */
router.get(
  "/system-health",
  requireAuth,
  requireSuperAdmin,
  adminController.getSystemHealth,
);

/**
 * @route   GET /api/admin/organizations
 * @desc    List all organizations
 * @access  Super Admin
 */
router.get(
  "/organizations",
  requireAuth,
  requireSuperAdmin,
  adminController.listOrganizations,
);

/**
 * @route   GET /api/admin/users
 * @desc    List all users
 * @access  Super Admin
 */
router.get(
  "/users",
  requireAuth,
  requireSuperAdmin,
  adminController.listUsers,
);

/**
 * @route   POST /api/admin/users/:id/block
 * @desc    Block a user
 * @access  Super Admin
 */
router.post(
  "/users/:id/block",
  requireAuth,
  requireSuperAdmin,
  adminController.blockUser,
);

/**
 * @route   POST /api/admin/users/:id/unblock
 * @desc    Unblock a user
 * @access  Super Admin
 */
router.post(
  "/users/:id/unblock",
  requireAuth,
  requireSuperAdmin,
  adminController.unblockUser,
);

export default router;
