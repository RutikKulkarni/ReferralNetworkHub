import { Router } from "express";
import { requireAuth } from "../../auth/middleware/auth.middleware";
import {
  extractTenantContext,
  requireTenantContext,
  requireOrganizationAdmin,
} from "../../../shared/middleware";
import {
  createOrganization,
  listOrganizations,
  getOrganization,
  updateOrganization,
  deactivateOrganization,
  getOrganizationStats,
  verifyOrganization,
} from "../controllers/organization.controller";
import {
  validateCreateOrganization,
  validateUpdateOrganization,
} from "../validators/organization.validator";

const router = Router();

// Public/Platform routes (no organization context needed)
router.post(
  "/",
  requireAuth,
  validateCreateOrganization,
  createOrganization
);

router.get("/", requireAuth, listOrganizations);

// Organization-specific routes
router.get(
  "/:organizationId",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  requireOrganizationAdmin,
  getOrganization
);

router.put(
  "/:organizationId",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  requireOrganizationAdmin,
  validateUpdateOrganization,
  updateOrganization
);

router.delete(
  "/:organizationId",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  deactivateOrganization
);

router.get(
  "/:organizationId/stats",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  requireOrganizationAdmin,
  getOrganizationStats
);

router.post(
  "/:organizationId/verify",
  requireAuth,
  extractTenantContext,
  requireTenantContext,
  verifyOrganization
);

export default router;
