import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";

const adminService = new AdminService();

/**
 * Get platform dashboard statistics
 */
export const getDashboard = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const dashboard = await adminService.getPlatformDashboard();

    res.json({
      success: true,
      data: dashboard,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve platform dashboard",
      error: error.message,
    });
  }
};

/**
 * Get platform analytics
 */
export const getAnalytics = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
      return;
    }

    const analytics = await adminService.getPlatformAnalytics(
      new Date(startDate as string),
      new Date(endDate as string),
    );

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve platform analytics",
      error: error.message,
    });
  }
};

/**
 * Get audit logs
 */
export const getAuditLogs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId, action, entityType, startDate, endDate, page, limit } = req.query;

    const filters: any = {};
    if (userId) filters.userId = userId as string;
    if (action) filters.action = action as string;
    if (entityType) filters.entityType = entityType as string;
    if (startDate) filters.startDate = new Date(startDate as string);
    if (endDate) filters.endDate = new Date(endDate as string);

    const pagination = {
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 50,
    };

    const result = await adminService.getAuditLogs(filters, pagination);

    res.json({
      success: true,
      data: result.logs,
      pagination: {
        total: result.total,
        pages: result.pages,
        currentPage: result.currentPage,
        limit: pagination.limit,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve audit logs",
      error: error.message,
    });
  }
};

/**
 * Get system health status
 */
export const getSystemHealth = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const health = await adminService.getSystemHealth();

    res.json({
      success: true,
      data: health,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve system health",
      error: error.message,
    });
  }
};

/**
 * List all organizations
 */
export const listOrganizations = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { status, industry, minSize, maxSize, page, limit } = req.query;

    const filters: any = {};
    if (status) filters.status = status as string;
    if (industry) filters.industry = industry as string;
    if (minSize) filters.minSize = parseInt(minSize as string, 10);
    if (maxSize) filters.maxSize = parseInt(maxSize as string, 10);

    const pagination = {
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 20,
    };

    const result = await adminService.getAllOrganizations(filters, pagination);

    res.json({
      success: true,
      data: result.organizations,
      pagination: {
        total: result.total,
        pages: result.pages,
        currentPage: result.currentPage,
        limit: pagination.limit,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve organizations",
      error: error.message,
    });
  }
};

/**
 * List all users
 */
export const listUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userType, isActive, isBlocked, search, page, limit } = req.query;

    const filters: any = {};
    if (userType) filters.userType = userType as string;
    if (isActive !== undefined) filters.isActive = isActive === "true";
    if (isBlocked !== undefined) filters.isBlocked = isBlocked === "true";
    if (search) filters.search = search as string;

    const pagination = {
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 20,
    };

    const result = await adminService.getAllUsers(filters, pagination);

    res.json({
      success: true,
      data: result.users,
      pagination: {
        total: result.total,
        pages: result.pages,
        currentPage: result.currentPage,
        limit: pagination.limit,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
      error: error.message,
    });
  }
};

/**
 * Block a user
 */
export const blockUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      res.status(400).json({
        success: false,
        message: "Reason is required to block a user",
      });
      return;
    }

    const user = await adminService.blockUser(id as string, reason, (req as any).user.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "User blocked successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to block user",
      error: error.message,
    });
  }
};

/**
 * Unblock a user
 */
export const unblockUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await adminService.unblockUser(id as string, (req as any).user.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.json({
      success: true,
      message: "User unblocked successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to unblock user",
      error: error.message,
    });
  }
};
