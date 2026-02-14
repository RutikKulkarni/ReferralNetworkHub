import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { userService } from "../services/user.service";

// Type guards
function isAuthenticated(req: Request): req is Request & { user: { id: string } } {
  return !!req.user;
}

function hasTenantContext(req: Request): req is Request & { organizationId: string } {
  return !!req.organizationId;
}

/**
 * List users with filters
 */
export const listUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const filters = {
      userType: req.query.userType as string,
      isActive: req.query.isActive === "true" ? true : req.query.isActive === "false" ? false : undefined,
      isBlocked: req.query.isBlocked === "true" ? true : req.query.isBlocked === "false" ? false : undefined,
      emailVerified: req.query.emailVerified === "true" ? true : req.query.emailVerified === "false" ? false : undefined,
      search: req.query.search as string,
    };

    const pagination = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    };

    const organizationId = hasTenantContext(req) ? req.organizationId : undefined;

    const result = await userService.listUsers(
      filters,
      pagination,
      req.user.id,
      organizationId,
    );

    res.json(result);
  } catch (error: any) {
    console.error("Error listing users:", error);
    res.status(500).json({ error: "Failed to list users" });
  }
};

/**
 * Get a single user
 */
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const userId = Array.isArray(id) ? id[0] : id;

    const user = await userService.getUser(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error: any) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
};

/**
 * Update user information
 */
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    if (!isAuthenticated(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const userId = Array.isArray(id) ? id[0] : id;

    const user = await userService.updateUser(userId, req.body, req.user.id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      message: "User updated successfully",
      user,
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message || "Failed to update user" });
  }
};

/**
 * Deactivate user
 */
export const deactivateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const userId = Array.isArray(id) ? id[0] : id;

    const user = await userService.deactivateUser(userId, req.user.id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      message: "User deactivated successfully",
      user,
    });
  } catch (error: any) {
    console.error("Error deactivating user:", error);
    res.status(500).json({ error: "Failed to deactivate user" });
  }
};

/**
 * Activate user
 */
export const activateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const userId = Array.isArray(id) ? id[0] : id;

    const user = await userService.activateUser(userId, req.user.id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      message: "User activated successfully",
      user,
    });
  } catch (error: any) {
    console.error("Error activating user:", error);
    res.status(500).json({ error: "Failed to activate user" });
  }
};

/**
 * Get user profile
 */
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const userId = Array.isArray(id) ? id[0] : id;

    const profile = await userService.getUserProfile(userId);

    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    res.json(profile);
  } catch (error: any) {
    console.error("Error getting user profile:", error);
    res.status(500).json({ error: "Failed to get user profile" });
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    if (!isAuthenticated(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const userId = Array.isArray(id) ? id[0] : id;

    const profile = await userService.updateUserProfile(userId, req.body, req.user.id);

    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    res.json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: error.message || "Failed to update profile" });
  }
};

/**
 * Change user role
 */
export const changeUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    if (!isAuthenticated(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    const userId = Array.isArray(id) ? id[0] : id;

    const user = await userService.changeUserRole(userId, req.body, req.user.id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      message: "User role changed successfully",
      user,
    });
  } catch (error: any) {
    console.error("Error changing user role:", error);
    res.status(500).json({ error: error.message || "Failed to change user role" });
  }
};

/**
 * Get users by role
 */
export const getUsersByRole = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { role } = req.params;
    const roleStr = Array.isArray(role) ? role[0] : role;
    const organizationId = hasTenantContext(req) ? req.organizationId : undefined;

    const users = await userService.getUsersByRole(roleStr, organizationId);

    res.json({ users });
  } catch (error: any) {
    console.error("Error getting users by role:", error);
    res.status(500).json({ error: "Failed to get users by role" });
  }
};

/**
 * Get user statistics
 */
export const getUserStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isAuthenticated(req)) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const organizationId = hasTenantContext(req) ? req.organizationId : undefined;

    const stats = await userService.getUserStats(organizationId);

    res.json(stats);
  } catch (error: any) {
    console.error("Error getting user stats:", error);
    res.status(500).json({ error: "Failed to get user statistics" });
  }
};
