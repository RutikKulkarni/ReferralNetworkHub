import type {
  FieldType,
  FieldConfig,
  SectionConfig,
} from "@/shared/types/forms";
import { emailSchema } from "@/shared/utils/forms";
import type { SignupData } from "./model";
import { z } from "zod";

/**
 * Field type mappings - defines which component renders each field
 */
export const fieldTypeMappings: Partial<Record<keyof SignupData, FieldType>> = {
  firstName: "text",
  lastName: "text",
  email: "email",
  password: "password",
  confirmPassword: "password",
  acceptTerms: "checkbox",
  subscribeNewsletter: "checkbox",
};

/**
 * Optional fields - fields that are not required
 */
export const optionalFields: (keyof SignupData)[] = ["subscribeNewsletter"];

/**
 * Schema overrides - custom validation rules for specific fields
 */
export const createSchemaOverrides = () => ({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long"),
  email: emailSchema(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number",
    ),
  confirmPassword: z.string(),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
});

/**
 * Field configurations - UI settings for each field
 */
export const createFieldConfigurations = (): Partial<
  Record<keyof SignupData, FieldConfig>
> => ({
  firstName: {
    label: "First Name",
    placeholder: "Enter your first name",
    type: "text",
  },
  lastName: {
    label: "Last Name",
    placeholder: "Enter your last name",
    type: "text",
  },
  email: {
    label: "Email Address",
    placeholder: "Enter your email",
    type: "email",
  },
  password: {
    label: "Password",
    placeholder: "Create a password",
    type: "password",
  },
  confirmPassword: {
    label: "Confirm Password",
    placeholder: "Re-enter your password",
    type: "password",
  },
  acceptTerms: {
    type: "checkbox",
    label: "I accept the terms and conditions",
    description: "You must accept our terms to create an account",
  },
  subscribeNewsletter: {
    type: "checkbox",
    label: "Subscribe to newsletter",
    description: "Receive updates and news about our platform",
  },
});

/**
 * Form sections - layout structure
 */
export const createFormSections = (): SectionConfig<SignupData>[] => [
  {
    title: "Personal Information",
    description: "Tell us about yourself",
    rows: [
      {
        fields: ["firstName", "lastName"],
        columns: [1, 1],
      },
      {
        fields: ["email"],
      },
    ],
  },
  {
    title: "Security",
    description: "Choose a strong password",
    rows: [
      {
        fields: ["password"],
      },
      {
        fields: ["confirmPassword"],
      },
    ],
  },
  {
    title: "Preferences",
    rows: [
      {
        fields: ["acceptTerms"],
      },
      {
        fields: ["subscribeNewsletter"],
      },
    ],
  },
];
