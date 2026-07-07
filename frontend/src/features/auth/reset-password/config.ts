import type {
  FieldType,
  FieldConfig,
  SectionConfig,
} from "@/shared/types/forms";
import { strongPasswordSchema } from "@/shared/utils/forms";
import type { ResetPasswordData } from "./model";
import { z } from "zod";

export const fieldTypeMappings: Partial<
  Record<keyof ResetPasswordData, FieldType>
> = {
  newPassword: "password",
  confirmPassword: "password",
};

export const optionalFields: (keyof ResetPasswordData)[] = [];

export const createSchemaOverrides = () => ({
  newPassword: strongPasswordSchema(),
  confirmPassword: z.string(),
});

export const createFieldConfigurations = (): Partial<
  Record<keyof ResetPasswordData, FieldConfig>
> => ({
  newPassword: {
    label: "New Password",
    placeholder: "••••••••",
    type: "password",
  },
  confirmPassword: {
    label: "Confirm Password",
    placeholder: "••••••••",
    type: "password",
  },
});

export const createFormSections = (): SectionConfig<ResetPasswordData>[] => [
  {
    rows: [
      {
        fields: ["newPassword"],
      },
      {
        fields: ["confirmPassword"],
      },
    ],
  },
];
