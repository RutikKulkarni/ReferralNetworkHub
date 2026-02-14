import { body, param, query } from "express-validator";

/**
 * Validation for submitting a referral
 */
export const validateSubmitReferral = [
  body("job_id")
    .trim()
    .notEmpty()
    .withMessage("Job ID is required")
    .isUUID()
    .withMessage("Job ID must be a valid UUID"),
  body("candidate_id")
    .trim()
    .notEmpty()
    .withMessage("Candidate ID is required")
    .isUUID()
    .withMessage("Candidate ID must be a valid UUID"),
  body("referral_type")
    .optional()
    .isIn(["internal", "external"])
    .withMessage("Referral type must be either 'internal' or 'external'"),
  body("referral_note")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Referral note must not exceed 1000 characters"),
];

/**
 * Validation for updating referral status
 */
export const validateUpdateStatus = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Referral ID is required")
    .isUUID()
    .withMessage("Referral ID must be a valid UUID"),
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "accepted", "rejected", "application_submitted", "hired", "bonus_paid"])
    .withMessage("Invalid status value"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must not exceed 500 characters"),
];

/**
 * Validation for approving a referral
 */
export const validateApproveReferral = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Referral ID is required")
    .isUUID()
    .withMessage("Referral ID must be a valid UUID"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must not exceed 500 characters"),
];

/**
 * Validation for rejecting a referral
 */
export const validateRejectReferral = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Referral ID is required")
    .isUUID()
    .withMessage("Referral ID must be a valid UUID"),
  body("rejection_reason")
    .trim()
    .notEmpty()
    .withMessage("Rejection reason is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Rejection reason must be between 10 and 500 characters"),
];

/**
 * Validation for processing bonus payment
 */
export const validateBonusPayment = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Referral ID is required")
    .isUUID()
    .withMessage("Referral ID must be a valid UUID"),
  body("bonus_amount")
    .notEmpty()
    .withMessage("Bonus amount is required")
    .isFloat({ min: 0 })
    .withMessage("Bonus amount must be a positive number"),
  body("payment_date")
    .optional()
    .isISO8601()
    .withMessage("Payment date must be a valid ISO 8601 date"),
];

/**
 * Validation for UUID parameter
 */
export const validateUUIDParam = [
  param("id")
    .trim()
    .notEmpty()
    .withMessage("ID is required")
    .isUUID()
    .withMessage("ID must be a valid UUID"),
];

/**
 * Validation for job ID parameter
 */
export const validateJobIdParam = [
  param("jobId")
    .trim()
    .notEmpty()
    .withMessage("Job ID is required")
    .isUUID()
    .withMessage("Job ID must be a valid UUID"),
];

/**
 * Validation for query filters
 */
export const validateReferralFilters = [
  query("status")
    .optional()
    .isIn(["pending", "accepted", "rejected", "application_submitted", "hired", "bonus_paid"])
    .withMessage("Invalid status value"),
  query("job_id")
    .optional()
    .isUUID()
    .withMessage("Job ID must be a valid UUID"),
  query("referrer_id")
    .optional()
    .isUUID()
    .withMessage("Referrer ID must be a valid UUID"),
  query("candidate_id")
    .optional()
    .isUUID()
    .withMessage("Candidate ID must be a valid UUID"),
  query("referral_type")
    .optional()
    .isIn(["internal", "external"])
    .withMessage("Referral type must be either 'internal' or 'external'"),
  query("date_from")
    .optional()
    .isISO8601()
    .withMessage("Date from must be a valid ISO 8601 date"),
  query("date_to")
    .optional()
    .isISO8601()
    .withMessage("Date to must be a valid ISO 8601 date"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];
