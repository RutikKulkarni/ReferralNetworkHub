import { body } from "express-validator";

/**
 * Validation rules for creating a job
 */
export const validateCreateJob = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 50, max: 5000 })
    .withMessage("Description must be between 50 and 5000 characters"),

  body("requirements")
    .optional()
    .isObject()
    .withMessage("Requirements must be an object"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Location must not exceed 255 characters"),

  body("job_type")
    .notEmpty()
    .withMessage("Job type is required")
    .isIn(["full_time", "part_time", "contract", "internship"])
    .withMessage("Invalid job type"),

  body("experience_level")
    .notEmpty()
    .withMessage("Experience level is required")
    .isIn(["entry", "mid", "senior", "lead"])
    .withMessage("Invalid experience level"),

  body("salary_range_min")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum salary must be a positive number"),

  body("salary_range_max")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum salary must be a positive number")
    .custom((value, { req }) => {
      if (req.body.salary_range_min && value < req.body.salary_range_min) {
        throw new Error("Maximum salary must be greater than minimum salary");
      }
      return true;
    }),

  body("currency")
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage("Currency must be a 3-letter code"),

  body("skills_required")
    .optional()
    .isArray()
    .withMessage("Skills required must be an array"),

  body("skills_required.*")
    .optional()
    .isString()
    .withMessage("Each skill must be a string"),

  body("benefits")
    .optional()
    .isArray()
    .withMessage("Benefits must be an array"),

  body("benefits.*")
    .optional()
    .isString()
    .withMessage("Each benefit must be a string"),

  body("is_referral_eligible")
    .optional()
    .isBoolean()
    .withMessage("Referral eligible must be a boolean"),

  body("referral_bonus")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Referral bonus must be a positive number"),

  body("application_deadline")
    .optional()
    .isISO8601()
    .withMessage("Application deadline must be a valid date")
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error("Application deadline must be in the future");
      }
      return true;
    }),
];

/**
 * Validation rules for updating a job
 */
export const validateUpdateJob = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 50, max: 5000 })
    .withMessage("Description must be between 50 and 5000 characters"),

  body("requirements")
    .optional()
    .isObject()
    .withMessage("Requirements must be an object"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Location must not exceed 255 characters"),

  body("job_type")
    .optional()
    .isIn(["full_time", "part_time", "contract", "internship"])
    .withMessage("Invalid job type"),

  body("experience_level")
    .optional()
    .isIn(["entry", "mid", "senior", "lead"])
    .withMessage("Invalid experience level"),

  body("salary_range_min")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum salary must be a positive number"),

  body("salary_range_max")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum salary must be a positive number")
    .custom((value, { req }) => {
      if (req.body.salary_range_min && value < req.body.salary_range_min) {
        throw new Error("Maximum salary must be greater than minimum salary");
      }
      return true;
    }),

  body("currency")
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage("Currency must be a 3-letter code"),

  body("skills_required")
    .optional()
    .isArray()
    .withMessage("Skills required must be an array"),

  body("skills_required.*")
    .optional()
    .isString()
    .withMessage("Each skill must be a string"),

  body("benefits")
    .optional()
    .isArray()
    .withMessage("Benefits must be an array"),

  body("benefits.*")
    .optional()
    .isString()
    .withMessage("Each benefit must be a string"),

  body("is_referral_eligible")
    .optional()
    .isBoolean()
    .withMessage("Referral eligible must be a boolean"),

  body("referral_bonus")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Referral bonus must be a positive number"),

  body("application_deadline")
    .optional()
    .isISO8601()
    .withMessage("Application deadline must be a valid date"),
];
