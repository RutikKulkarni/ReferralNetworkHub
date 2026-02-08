import { Request, Response, NextFunction } from "express";
import { OrganizationService } from "../services/organization.service";
import { hasPlatformAccess } from "../../../shared/utils/permissions.utils";
import { AuthenticatedUser } from "../../../shared/types";

const organizationService = new OrganizationService();

// Type guard to ensure user is authenticated
function isAuthenticated(req: Request): req is Request & { user: AuthenticatedUser } {
  return !!req.user;
}

/**
 * Create a new organization
 * POST /api/organizations
 * Platform admins only
 */
export const createOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!isAuthenticated(req)) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    const { name, description, website, industry, size, location, logo } =
      req.body;

    // Validate platform access
    if (!hasPlatformAccess(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: "Only platform admins can create organizations",
      });
    }

    // Check if name is available
    const isAvailable = await organizationService.isNameAvailable(name);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Organization name already exists",
      });
    }

    const organization = await organizationService.createOrganization({
      name,
      description,
      website,
      industry,
      size,
      location,
      logo,
    });

    return res.status(201).json({
      success: true,
      message: "Organization created successfully",
      data: organization,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all organizations
 * GET /api/organizations
 * Platform admins only
 */
export const listOrganizations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!isAuthenticated(req)) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    // Validate platform access
    if (!hasPlatformAccess(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: "Only platform admins can list all organizations",
      });
    }

    const { page, limit, isActive, isVerified, industry, search } = req.query;

    const filters = {
      isActive:
        isActive === "true" ? true : isActive === "false" ? false : undefined,
      isVerified:
        isVerified === "true"
          ? true
          : isVerified === "false"
            ? false
            : undefined,
      industry: typeof industry === "string" ? industry : undefined,
      search: typeof search === "string" ? search : undefined,
    };

    const pagination = {
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 20,
    };

    const result = await organizationService.listOrganizations(
      filters,
      pagination
    );

    return res.status(200).json({
      success: true,
      data: result.organizations,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: result.total,
        pages: result.pages,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get organization by ID
 * GET /api/organizations/:organizationId
 */
export const getOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!isAuthenticated(req)) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    const { organizationId } = req.params;

    if (typeof organizationId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID",
      });
    }

    const organization = await organizationService.getOrganization(
      organizationId
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update organization
 * PUT /api/organizations/:organizationId
 */
export const updateOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!isAuthenticated(req)) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    const { organizationId } = req.params;
    const { name, description, website, industry, size, location, logo } =
      req.body;

    if (typeof organizationId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID",
      });
    }

    // Check if name is available (excluding current org)
    if (name) {
      const isAvailable = await organizationService.isNameAvailable(
        name,
        organizationId
      );
      if (!isAvailable) {
        return res.status(400).json({
          success: false,
          message: "Organization name already exists",
        });
      }
    }

    const organization = await organizationService.updateOrganization(
      organizationId,
      { name, description, website, industry, size, location, logo }
    );

    return res.status(200).json({
      success: true,
      message: "Organization updated successfully",
      data: organization,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Organization not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * Deactivate organization
 * DELETE /api/organizations/:organizationId
 */
export const deactivateOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!isAuthenticated(req)) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    const { organizationId } = req.params;

    if (typeof organizationId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID",
      });
    }

    // Validate platform access
    if (!hasPlatformAccess(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: "Only platform admins can deactivate organizations",
      });
    }

    const organization = await organizationService.deactivateOrganization(
      organizationId
    );

    return res.status(200).json({
      success: true,
      message: "Organization deactivated successfully",
      data: organization,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Organization not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * Get organization statistics
 * GET /api/organizations/:organizationId/stats
 */
export const getOrganizationStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!isAuthenticated(req)) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    const { organizationId } = req.params;

    if (typeof organizationId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID",
      });
    }

    const stats = await organizationService.getOrganizationStats(
      organizationId
    );

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Organization not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

/**
 * Verify organization
 * POST /api/organizations/:organizationId/verify
 * Platform admins only
 */
export const verifyOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!isAuthenticated(req)) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    const { organizationId } = req.params;

    if (typeof organizationId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid organization ID",
      });
    }

    // Validate platform access
    if (!hasPlatformAccess(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: "Only platform admins can verify organizations",
      });
    }

    const organization = await organizationService.verifyOrganization(
      organizationId
    );

    return res.status(200).json({
      success: true,
      message: "Organization verified successfully",
      data: organization,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Organization not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};
