/**
 * Authentication Forms
 *
 * This module provides login and signup forms following the same pattern
 * as the fe project's building forms:
 * - model.ts: TypeScript interfaces
 * - defaults.ts: Default values
 * - config.ts: Field configurations and validation
 * - Form component: React component using FormRendererBuilder
 */

// Login exports
export { LoginForm } from "./login";
export type { LoginFormProps, LoginCredentials } from "./login";
export { defaultLoginCredentials } from "./login";

// Signup exports
export { SignupForm } from "./signup";
export type { SignupFormProps, SignupData } from "./signup";
export { defaultSignupData } from "./signup";

// Forgot Password exports
export { ForgotPasswordForm } from "./forgot-password";
export type { ForgotPasswordFormProps, ForgotPasswordData } from "./forgot-password";
export { defaultForgotPasswordData } from "./forgot-password";

// Reset Password exports
export { ResetPasswordForm } from "./reset-password";
export type { ResetPasswordFormProps, ResetPasswordData } from "./reset-password";
export { defaultResetPasswordData } from "./reset-password";

// Re-export config functions with namespaced names to avoid conflicts
export {
  fieldTypeMappings as loginFieldTypeMappings,
  optionalFields as loginOptionalFields,
  createSchemaOverrides as createLoginSchemaOverrides,
  createFieldConfigurations as createLoginFieldConfigurations,
  createFormSections as createLoginFormSections,
} from "./login";

export {
  fieldTypeMappings as signupFieldTypeMappings,
  optionalFields as signupOptionalFields,
  createSchemaOverrides as createSignupSchemaOverrides,
  createFieldConfigurations as createSignupFieldConfigurations,
  createFormSections as createSignupFormSections,
} from "./signup";

export {
  fieldTypeMappings as forgotPasswordFieldTypeMappings,
  optionalFields as forgotPasswordOptionalFields,
  createSchemaOverrides as createForgotPasswordSchemaOverrides,
  createFieldConfigurations as createForgotPasswordFieldConfigurations,
  createFormSections as createForgotPasswordFormSections,
} from "./forgot-password";

export {
  fieldTypeMappings as resetPasswordFieldTypeMappings,
  optionalFields as resetPasswordOptionalFields,
  createSchemaOverrides as createResetPasswordSchemaOverrides,
  createFieldConfigurations as createResetPasswordFieldConfigurations,
  createFormSections as createResetPasswordFormSections,
} from "./reset-password";
