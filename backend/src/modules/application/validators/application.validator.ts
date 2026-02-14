import { body } from "express-validator";

/**
 * Validation rules for submitting an application
 */
export const validateSubmitApplication = [
  body("job_id")
    .notEmpty()
    .withMessage("Job ID is required")
    .isUUID()
    .withMessage("Job ID must be a valid UUID"),

  body("cover_letter")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Cover letter must not exceed 2000 characters"),

  body("resume_url")
    .optional()
    .trim()
    .isURL()
    .withMessage("Resume URL must be a valid URL"),

  body("referral_id")
    .optional()
    .isUUID()
    .withMessage("Referral ID must be a valid UUID"),
];

/**
 * Validation rules for updating application status
 */
export const validateUpdateStatus = [
  body("application_status")
    .notEmpty()
    .withMessage("Application status is required")
    .isIn([
      "submitted",
      "screening",
      "interview",
      "offer",
      "hired",
      "rejected",
      "withdrawn",
    ])
    .withMessage("Invalid application status"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Notes must not exceed 1000 characters"),

  body("rejection_reason")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Rejection reason must not exceed 500 characters"),

  body("offer_details")
    .optional()
    .isObject()
    .withMessage("Offer details must be an object"),
];
