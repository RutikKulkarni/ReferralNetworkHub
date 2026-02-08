import { Request, Response, NextFunction } from "express";
import { AuthenticatedUser } from "../types";
import { Organization } from "../../database/models";

// Type guard to ensure user is authenticated
function isAuthenticated(req: Request): req is Request & { user: AuthenticatedUser } {
  return !!req.user;
}

export const extractTenantContext = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!isAuthenticated(req)) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = req.user;
    let organizationId: string | null = null;

    // 1. Try route params
    if (req.params.organizationId) {
      organizationId = Array.isArray(req.params.organizationId)
        ? req.params.organizationId[0]
        : req.params.organizationId;
    }
    // 2. Try request body
    else if (req.body.organizationId) {
      organizationId = req.body.organizationId;
    }
    // 3. Use user's organization (for org-bound users)
    else if (user?.organizationId) {
      organizationId = user.organizationId;
    }

    // Validate organization exists and is active
    if (organizationId) {
      const org = await Organization.findOne({
        where: {
          id: organizationId,
          isActive: true,
        },
      });

      if (!org) {
        return res.status(404).json({
          success: false,
          message: "Organization not found or inactive",
        });
      }

      // Attach tenant context
      req.tenant = {
        organizationId: org.id,
        organization: {
          id: org.id,
          name: org.name,
          isActive: org.isActive,
          isVerified: org.isVerified,
        },
      };
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Require tenant context middleware
 *
 * Ensures that organization context exists in the request
 * Use this after extractTenantContext when organization is required
 */
export const requireTenantContext = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.tenant || !req.tenant.organizationId) {
    return res.status(400).json({
      success: false,
      message: "Organization context is required for this operation",
    });
  }

  next();
};
