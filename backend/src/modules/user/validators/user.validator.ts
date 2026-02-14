import { body, param, query } from "express-validator";
import { USER_TYPES } from "../../../constants";

/**
 * Validation for updating user
 */
export const validateUpdateUser = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("First name must be between 1 and 100 characters"),
  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Last name must be between 1 and 100 characters"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
  body("isBlocked")
    .optional()
    .isBoolean()
    .withMessage("isBlocked must be a boolean"),
];

/**
 * Validation for updating user profile
 */
export const validateUpdateProfile = [
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Bio must not exceed 1000 characters"),
  body("skills")
    .optional()
    .isArray()
    .withMessage("Skills must be an array"),
  body("experience_years")
    .optional()
    .isInt({ min: 0, max: 70 })
    .withMessage("Experience years must be between 0 and 70"),
  body("current_location")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Location must not exceed 255 characters"),
  body("linkedin_url")
    .optional()
    .trim()
    .isURL()
    .withMessage("LinkedIn URL must be a valid URL"),
  body("github_url")
    .optional()
    .trim()
    .isURL()
    .withMessage("GitHub URL must be a valid URL"),
  body("portfolio_url")
    .optional()
    .trim()
    .isURL()
    .withMessage("Portfolio URL must be a valid URL"),
  body("current_company")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Company name must not exceed 255 characters"),
  body("current_position")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Position must not exceed 255 characters"),
];

/**
 * Validation for changing user role
 */
export const validateChangeRole = [
  body("newRole")
    .notEmpty()
    .withMessage("New role is required")
    .isIn(Object.values(USER_TYPES))
    .withMessage("Invalid user role"),
  body("organizationId")
    .optional()
    .isUUID()
    .withMessage("Organization ID must be a valid UUID"),
];

/**
 * Validation for UUID parameter
 */
export const validateUUIDParam = [
  param("id")
    .isUUID()
    .withMessage("Invalid user ID format"),
];

/**
 * Validation for role parameter
 */
export const validateRoleParam = [
  param("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(Object.values(USER_TYPES))
    .withMessage("Invalid user role"),
];

/**
 * Validation for user filters
 */
export const validateUserFilters = [
  query("userType")
    .optional()
    .isIn(Object.values(USER_TYPES))
    .withMessage("Invalid user type"),
  query("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
  query("isBlocked")
    .optional()
    .isBoolean()
    .withMessage("isBlocked must be a boolean"),
  query("emailVerified")
    .optional()
    .isBoolean()
    .withMessage("emailVerified must be a boolean"),
  query("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search query must be between 1 and 100 characters"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];
