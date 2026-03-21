import type {
  FieldType,
  FieldConfig,
  SectionConfig,
} from "@/shared/types/forms";
import { emailSchema } from "@/shared/utils/forms";
import type { LoginCredentials } from "./model";
import { z } from "zod";

export const fieldTypeMappings: Partial<
  Record<keyof LoginCredentials, FieldType>
> = {
  email: "email",
  password: "password",
  rememberMe: "checkbox",
};

export const optionalFields: (keyof LoginCredentials)[] = ["rememberMe"];

export const createSchemaOverrides = () => ({
  email: emailSchema(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),
});

export const createFieldConfigurations = (): Partial<
  Record<keyof LoginCredentials, FieldConfig>
> => ({
  email: {
    label: "Email Address",
    placeholder: "Enter your email",
    type: "email",
  },
  password: {
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
  },
  rememberMe: {
    type: "checkbox",
    label: "Remember me",
    description: "Stay signed in for 30 days",
  },
});

export const createFormSections = (): SectionConfig<LoginCredentials>[] => [
  {
    title: "Sign In",
    description: "Enter your credentials to access your account",
    rows: [
      {
        fields: ["email"],
      },
      {
        fields: ["password"],
      },
      {
        fields: ["rememberMe"],
      },
    ],
  },
];
