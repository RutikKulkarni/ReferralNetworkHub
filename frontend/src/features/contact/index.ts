/**
 * Contact Form Feature
 *
 * Contact form following the same pattern as auth forms:
 * - model.ts: TypeScript interfaces
 * - defaults.ts: Default values
 * - config.ts: Field configurations and validation
 * - ContactForm.tsx: React component using FormRendererBuilder
 */

export { ContactForm } from "./ContactForm";
export type { ContactFormProps } from "./ContactForm";
export type { ContactFormData } from "./model";
export { defaultContactFormData } from "./defaults";

export {
  fieldTypeMappings,
  optionalFields,
  createSchemaOverrides,
  createFieldConfigurations,
  createFormSections,
  SUBJECT_OPTIONS,
} from "./config";
