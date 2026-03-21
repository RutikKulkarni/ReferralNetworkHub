import type {
  FieldType,
  FieldConfig,
  SectionConfig,
} from "@/shared/types/forms";
import { emailSchema } from "@/shared/utils/forms";
import type { SignupData } from "./model";
import { z } from "zod";

export const fieldTypeMappings: Partial<Record<keyof SignupData, FieldType>> = {
  firstName: "text",
  lastName: "text",
  email: "email",
  password: "password",
  confirmPassword: "password",
};

export const optionalFields: (keyof SignupData)[] = [];

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
    .max(100, "Password is too long"),
  confirmPassword: z.string(),
});

export const createFieldConfigurations = (): Partial<
  Record<keyof SignupData, FieldConfig>
> => ({
  firstName: {
    label: "First Name",
    placeholder: "Rutik",
    type: "text",
  },
  lastName: {
    label: "Last Name",
    placeholder: "Kulkarni",
    type: "text",
  },
  email: {
    label: "Email",
    placeholder: "name@gmail.com",
    type: "email",
  },
  password: {
    label: "Password",
    placeholder: "••••••••",
    type: "password",
  },
  confirmPassword: {
    label: "Confirm Password",
    placeholder: "••••••••",
    type: "password",
  },
});

export const createFormSections = (): SectionConfig<SignupData>[] => [
  {
    rows: [
      {
        fields: ["firstName", "lastName"],
        columns: [1, 1],
      },
      {
        fields: ["email"],
      },
      {
        fields: ["password"],
      },
      {
        fields: ["confirmPassword"],
      },
    ],
  },
];
