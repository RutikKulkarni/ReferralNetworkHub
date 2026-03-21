import * as z from "zod";

export const personalDomains = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "aol.com",
];

export const userTypeSchema = z.enum(["user", "recruiter"], {
  required_error: "Please select a user type.",
});

export const passwordSchema = z
  .string()
  .min(8, {
    message: "Password must be at least 8 characters.",
  })
  .max(30, {
    message: "Password must not exceed 30 characters.",
  })
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/,
    {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    }
  );

export const emailSchema = z
  .string()
  .email({
    message: "Please enter a valid email address.",
  })
  .superRefine((email, ctx) => {
    const parts = email.split("@");
    if (parts.length !== 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "Invalid email format.",
      });
      return;
    }
    const domain = parts[1];
    if (!domain) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "Invalid email format.",
      });
      return;
    }
    const lowerCaseDomain = domain.toLowerCase();
  });

export const companyNameSchema = z
  .string()
  .min(2, {
    message: "Company name must be at least 2 characters.",
  })
  .optional();

export const userTypeEmailRefinement = (
  data: { email: string; userType: "user" | "recruiter" },
  ctx: z.RefinementCtx
) => {
  // Skip validation if email is empty or undefined
  if (!data.email || data.email.trim() === "") return;

  const parts = data.email.split("@");
  if (parts.length !== 2) return;
  const domain = parts[1];
  if (!domain) return;
  const lowerCaseDomain = domain.toLowerCase();

  if (data.userType === "user" && !personalDomains.includes(lowerCaseDomain)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["email"],
      message: "Users must use a personal email address (e.g., Gmail, Yahoo).",
    });
  }

  if (
    data.userType === "recruiter" &&
    personalDomains.includes(lowerCaseDomain)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["email"],
      message: "Recruiters must use a company email address.",
    });
  }
};
