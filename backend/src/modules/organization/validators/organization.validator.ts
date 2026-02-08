import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

/**
 * Validation rules for creating an organization
 */
export const validateCreateOrganization = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Organization name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Organization name must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),

  body("website")
    .optional()
    .trim()
    .isURL()
    .withMessage("Website must be a valid URL"),

  body("industry")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Industry must not exceed 100 characters"),

  body("size")
    .optional()
    .trim()
    .isIn(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"])
    .withMessage("Invalid organization size"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Location must not exceed 200 characters"),

  body("logo")
    .optional()
    .trim()
    .isURL()
    .withMessage("Logo must be a valid URL"),

  // Middleware to handle validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
];

/**
 * Validation rules for updating an organization
 */
export const validateUpdateOrganization = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Organization name must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),

  body("website")
    .optional()
    .trim()
    .isURL()
    .withMessage("Website must be a valid URL"),

  body("industry")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Industry must not exceed 100 characters"),

  body("size")
    .optional()
    .trim()
    .isIn(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"])
    .withMessage("Invalid organization size"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Location must not exceed 200 characters"),

  body("logo")
    .optional()
    .trim()
    .isURL()
    .withMessage("Logo must be a valid URL"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),

  body("isVerified")
    .optional()
    .isBoolean()
    .withMessage("isVerified must be a boolean"),

  // Middleware to handle validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
];
