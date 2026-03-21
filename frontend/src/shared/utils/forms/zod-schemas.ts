import { z } from "zod";

export const emailSchema = () =>
  z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address");

export const passwordSchema = (minLength = 8) =>
  z
    .string()
    .min(minLength, `Password must be at least ${minLength} characters`)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number");

export const strongPasswordSchema = (minLength = 8) =>
  passwordSchema(minLength).regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

export const phoneSchema = () =>
  z
    .string()
    .min(1, "Phone number is required")
    .min(10, "Phone number must be at least 10 digits");

export const urlSchema = () => z.string().url("Please enter a valid URL");

export const positiveNumberSchema = () =>
  z.number().positive("Must be a positive number");

export const nonNegativeNumberSchema = () =>
  z.number().nonnegative("Must be zero or greater");

export const priceSchema = (options?: { min?: number; max?: number }) =>
  z
    .number()
    .nonnegative("Price must be zero or greater")
    .refine((val) => {
      const decimals = (val.toString().split(".")[1] || "").length;
      return decimals <= 2;
    }, "Price can have at most 2 decimal places")
    .refine(
      (val) => !options?.min || val >= options.min,
      `Price must be at least ${options?.min}`,
    )
    .refine(
      (val) => !options?.max || val <= options.max,
      `Price must be at most ${options?.max}`,
    );

export const integerSchema = () => z.number().int("Must be a whole number");

export const percentageSchema = () =>
  z
    .number()
    .min(0, "Percentage must be at least 0")
    .max(100, "Percentage must be at most 100");

export const dateRangeSchema = () =>
  z
    .object({
      startDate: z.date({ message: "Start date is required" }),
      endDate: z.date({ message: "End date is required" }),
    })
    .refine((data) => data.startDate <= data.endDate, {
      message: "End date must be after start date",
      path: ["endDate"],
    });

export const requiredStringSchema = (message = "This field is required") =>
  z.string().min(1, message);

export const optionalStringSchema = () =>
  z.string().optional().or(z.literal(""));

export const requiredArraySchema = <T extends z.ZodTypeAny>(
  itemSchema: T,
  message = "Please select at least one option",
) => z.array(itemSchema).min(1, message);

export const fileSchema = (options?: {
  maxSize?: number;
  allowedTypes?: string[];
}) =>
  z
    .instanceof(File)
    .refine(
      (file) => !options?.maxSize || file.size <= options.maxSize,
      `File size must be less than ${options?.maxSize ? Math.round(options.maxSize / 1024 / 1024) : "max"} MB`,
    )
    .refine(
      (file) =>
        !options?.allowedTypes || options.allowedTypes.includes(file.type),
      `File type must be one of: ${options?.allowedTypes?.join(", ")}`,
    );

export const confirmFieldSchema = <T extends z.ZodTypeAny>(
  schema: T,
  fieldName: string,
  confirmFieldName: string = `confirm${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`,
) =>
  z
    .object({
      [fieldName]: schema,
      [confirmFieldName]: schema,
    })
    .refine(
      (data) =>
        data[fieldName as keyof typeof data] ===
        data[confirmFieldName as keyof typeof data],
      {
        message: `${fieldName} and ${confirmFieldName} must match`,
        path: [confirmFieldName],
      },
    );
