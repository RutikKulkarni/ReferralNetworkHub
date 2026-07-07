import type {
  FieldType,
  FieldConfig,
  SectionConfig,
} from "@/shared/types/forms";
import { emailSchema } from "@/shared/utils/forms";
import type { ContactFormData } from "./model";
import { z } from "zod";

export const fieldTypeMappings: Partial<
  Record<keyof ContactFormData, FieldType>
> = {
  firstName: "text",
  lastName: "text",
  email: "email",
  subject: "select",
  message: "textarea",
};

export const optionalFields: (keyof ContactFormData)[] = [];

export const createSchemaOverrides = () => ({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),
  email: emailSchema(),
  subject: z.string().min(1, "Please select a subject"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message is too long"),
});

export const SUBJECT_OPTIONS = [
  { label: "General Inquiry", value: "general" },
  { label: "Technical Support", value: "support" },
  { label: "Feedback", value: "feedback" },
  { label: "Partnership Opportunities", value: "partnership" },
  { label: "Other", value: "other" },
];

export const createFieldConfigurations = (): Partial<
  Record<keyof ContactFormData, FieldConfig>
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
    placeholder: "john@example.com",
    type: "email",
  },
  subject: {
    label: "Subject",
    placeholder: "Select a subject",
    type: "select",
    options: SUBJECT_OPTIONS,
  },
  message: {
    label: "Message",
    placeholder: "Tell us how we can help...",
    type: "textarea",
  },
});

export const createFormSections = (): SectionConfig<ContactFormData>[] => [
  {
    rows: [
      {
        fields: ["firstName", "lastName"],
      },
      {
        fields: ["email"],
      },
      {
        fields: ["subject"],
      },
      {
        fields: ["message"],
      },
    ],
  },
];
