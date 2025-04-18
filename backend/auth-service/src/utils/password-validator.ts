/**
 * Validates password against security requirements
 * @param password The password to validate
 * @returns Object with validation result and error message
 */
export const validatePassword = (
  password: string
): { isValid: boolean; message?: string } => {
  // Check length
  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long",
    };
  }

  if (password.length > 30) {
    return {
      isValid: false,
      message: "Password must be at most 30 characters long",
    };
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character",
    };
  }

  // Check for number
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }

  return { isValid: true };
};
