import { body, query, param } from "express-validator";

/**
 * Validation rules for analytics filters
 */
export const analyticsFilters = [
  query("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),
  query("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),
];

/**
 * Validation rules for audit log filters
 */
export const auditLogFilters = [
  query("userId").optional().isUUID().withMessage("User ID must be a valid UUID"),
  query("action").optional().isString().withMessage("Action must be a string"),
  query("entityType").optional().isString().withMessage("Entity type must be a string"),
  query("startDate").optional().isISO8601().withMessage("Start date must be a valid ISO 8601 date"),
  query("endDate").optional().isISO8601().withMessage("End date must be a valid ISO 8601 date"),
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
];

/**
 * Validation rules for blocking a user
 */
export const blockUserRules = [
  param("id").isUUID().withMessage("User ID must be a valid UUID"),
  body("reason")
    .notEmpty()
    .withMessage("Reason is required")
    .isString()
    .withMessage("Reason must be a string")
    .isLength({ min: 10, max: 500 })
    .withMessage("Reason must be between 10 and 500 characters"),
];

/**
 * Validation rules for unblocking a user
 */
export const unblockUserRules = [
  param("id").isUUID().withMessage("User ID must be a valid UUID"),
];

/**
 * Validation rules for pagination
 */
export const paginationRules = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
];

/**
 * Validation rules for organization filters
 */
export const organizationFilters = [
  query("status").optional().isIn(["active", "inactive"]).withMessage("Status must be 'active' or 'inactive'"),
  query("industry").optional().isString().withMessage("Industry must be a string"),
  query("minSize").optional().isInt({ min: 0 }).withMessage("Min size must be a non-negative integer"),
  query("maxSize").optional().isInt({ min: 0 }).withMessage("Max size must be a non-negative integer"),
  ...paginationRules,
];

/**
 * Validation rules for user filters
 */
export const userFilters = [
  query("userType").optional().isString().withMessage("User type must be a string"),
  query("isActive").optional().isBoolean().withMessage("isActive must be a boolean"),
  query("isBlocked").optional().isBoolean().withMessage("isBlocked must be a boolean"),
  query("search").optional().isString().withMessage("Search must be a string"),
  ...paginationRules,
];
