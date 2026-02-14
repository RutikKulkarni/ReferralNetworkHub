import { Request, Response, NextFunction } from "express";
import { AuthenticatedUser } from "../types";
import { USER_TYPES } from "../../constants";
import {
  OrganizationAdmin,
  Recruiter,
  Employee,
} from "../../database/models";

// Type guard to ensure user is authenticated
function isAuthenticated(req: Request): req is Request & { user: AuthenticatedUser } {
  return !!req.user;
}

export const requireOrganizationAccess = async (
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
    const organizationId = req.tenant?.organizationId;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization context required",
      });
    }

    // Platform admins have access to all organizations
    if (
      user.userType === USER_TYPES.PLATFORM_SUPER_ADMIN ||
      user.userType === USER_TYPES.PLATFORM_ADMIN
    ) {
      req.userOrgRole = "platform_admin";
      return next();
    }

    // Check if user is admin of this organization
    const isAdmin = await OrganizationAdmin.findOne({
      where: {
        user_id: user.id,
        organization_id: organizationId,
      },
    });

    if (isAdmin) {
      req.userOrgRole = "admin";
      return next();
    }

    // Check if user is recruiter for this organization
    const isRecruiter = await Recruiter.findOne({
      where: {
        user_id: user.id,
        organization_id: organizationId,
        is_active: true,
      },
    });

    if (isRecruiter) {
      req.userOrgRole = "recruiter";
      return next();
    }

    // Check if user is employee of this organization
    const isEmployee = await Employee.findOne({
      where: {
        user_id: user.id,
        organization_id: organizationId,
        is_currently_employed: true,
      },
    });

    if (isEmployee) {
      req.userOrgRole = "employee";
      return next();
    }

    // No access
    return res.status(403).json({
      success: false,
      message: "You do not have access to this organization",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Require organization admin access
 *
 * Ensures user is an admin of the organization in context
 */
export const requireOrganizationAdmin = async (
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
    const organizationId = req.tenant?.organizationId;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization context required",
      });
    }

    // Platform admins can manage any organization
    if (
      user.userType === USER_TYPES.PLATFORM_SUPER_ADMIN ||
      user.userType === USER_TYPES.PLATFORM_ADMIN
    ) {
      req.userOrgRole = "platform_admin";
      return next();
    }

    // Check if user is admin of this organization
    const isAdmin = await OrganizationAdmin.findOne({
      where: {
        user_id: user.id,
        organization_id: organizationId,
      },
    });

    if (isAdmin) {
      req.userOrgRole = "admin";
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Organization admin access required",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Require recruiter access
 *
 * Ensures user is a recruiter or admin of the organization in context
 */
export const requireRecruiterAccess = async (
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
    const organizationId = req.tenant?.organizationId;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization context required",
      });
    }

    // Platform admins can access any organization
    if (
      user.userType === USER_TYPES.PLATFORM_SUPER_ADMIN ||
      user.userType === USER_TYPES.PLATFORM_ADMIN
    ) {
      req.userOrgRole = "platform_admin";
      return next();
    }

    // Check if user is admin of this organization
    const isAdmin = await OrganizationAdmin.findOne({
      where: {
        user_id: user.id,
        organization_id: organizationId,
      },
    });

    if (isAdmin) {
      req.userOrgRole = "admin";
      return next();
    }

    // Check if user is recruiter for this organization
    const isRecruiter = await Recruiter.findOne({
      where: {
        user_id: user.id,
        organization_id: organizationId,
        is_active: true,
      },
    });

    if (isRecruiter) {
      req.userOrgRole = "recruiter";
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Recruiter or admin access required",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Require employee access
 *
 * Ensures user is an employee, recruiter, or admin of the organization in context
 */
export const requireEmployeeAccess = async (
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
    const organizationId = req.tenant?.organizationId;

    if (!organizationId) {
      return res.status(400).json({
        success: false,
        message: "Organization context required",
      });
    }

    // Platform admins can access any organization
    if (
      user.userType === USER_TYPES.PLATFORM_SUPER_ADMIN ||
      user.userType === USER_TYPES.PLATFORM_ADMIN
    ) {
      req.userOrgRole = "platform_admin";
      return next();
    }

    // Check if user is admin of this organization
    const isAdmin = await OrganizationAdmin.findOne({
      where: {
        user_id: user.id,
        organization_id: organizationId,
      },
    });

    if (isAdmin) {
      req.userOrgRole = "admin";
      return next();
    }

    // Check if user is recruiter for this organization
    const isRecruiter = await Recruiter.findOne({
      where: {
        user_id: user.id,
        organization_id: organizationId,
        is_active: true,
      },
    });

    if (isRecruiter) {
      req.userOrgRole = "recruiter";
      return next();
    }

    // Check if user is employee of this organization
    const isEmployee = await Employee.findOne({
      where: {
        user_id: user.id,
        organization_id: organizationId,
        is_currently_employed: true,
      },
    });

    if (isEmployee) {
      req.userOrgRole = "employee";
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Employee, recruiter, or admin access required",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Require admin access (organization admin or platform admin)
 *
 * Alias for requireOrganizationAdmin for consistency
 */
export const requireAdminAccess = requireOrganizationAdmin;
