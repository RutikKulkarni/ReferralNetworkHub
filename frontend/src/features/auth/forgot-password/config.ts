import type {
  FieldType,
  FieldConfig,
  SectionConfig,
} from "@/shared/types/forms";
import { emailSchema } from "@/shared/utils/forms";
import type { ForgotPasswordData } from "./model";

export const fieldTypeMappings: Partial<
  Record<keyof ForgotPasswordData, FieldType>
> = {
  email: "email",
};

export const optionalFields: (keyof ForgotPasswordData)[] = [];

export const createSchemaOverrides = () => ({
  email: emailSchema(),
});

export const createFieldConfigurations = (): Partial<
  Record<keyof ForgotPasswordData, FieldConfig>
> => ({
  email: {
    label: "Email",
    placeholder: "name@gmail.com",
    type: "email",
  },
});

export const createFormSections = (): SectionConfig<ForgotPasswordData>[] => [
  {
    rows: [
      {
        fields: ["email"],
      },
    ],
  },
];
