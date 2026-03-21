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
};

export const optionalFields: (keyof LoginCredentials)[] = [];

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
    label: "Email",
    placeholder: "name@gmail.com",
    type: "email",
  },
  password: {
    label: "Password",
    placeholder: "••••••••",
    type: "password",
  },
});

export const createFormSections = (): SectionConfig<LoginCredentials>[] => [
  {
    rows: [
      {
        fields: ["email"],
      },
      {
        fields: ["password"],
      },
    ],
  },
];
