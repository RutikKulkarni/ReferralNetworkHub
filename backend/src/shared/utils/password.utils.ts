import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export class PasswordUtil {
  /**
   * Hash password using bcrypt
   */
  public static async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch {
      throw new Error("Failed to hash password");
    }
  }

  /**
   * Compare password with hash
   */
  public static async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      return isMatch;
    } catch {
      throw new Error("Failed to compare password");
    }
  }

  /**
   * Validate password strength
   */
  public static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
    strength: "weak" | "medium" | "strong";
  } {
    const errors: string[] = [];
    let strength: "weak" | "medium" | "strong" = "weak";

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (password.length > 128) {
      errors.push("Password must not exceed 128 characters");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    if (/\s/.test(password)) {
      errors.push("Password must not contain whitespace");
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
      password,
    );
    const isLongEnough = password.length >= 12;

    const criteriaCount = [
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChars,
      isLongEnough,
    ].filter(Boolean).length;

    if (criteriaCount === 5) {
      strength = "strong";
    } else if (criteriaCount >= 3) {
      strength = "medium";
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength,
    };
  }

  /**
   * Check for common passwords
   */
  public static isCommonPassword(password: string): boolean {
    const commonPasswords = [
      "password",
      "password123",
      "12345678",
      "qwerty",
      "abc123",
      "monkey",
      "1234567",
      "letmein",
      "trustno1",
      "dragon",
      "baseball",
      "iloveyou",
      "master",
      "sunshine",
      "ashley",
      "123456789",
      "admin",
      "welcome",
      "login",
      "passw0rd",
    ];

    return commonPasswords.includes(password.toLowerCase());
  }

  /**
   * Check if password contains user info
   */
  public static containsUserInfo(
    password: string,
    userInfo: { email?: string; firstName?: string; lastName?: string },
  ): boolean {
    const passwordLower = password.toLowerCase();

    if (userInfo.email) {
      const emailLocal = userInfo.email.split("@")[0].toLowerCase();
      if (passwordLower.includes(emailLocal)) {
        return true;
      }
    }

    if (
      userInfo.firstName &&
      passwordLower.includes(userInfo.firstName.toLowerCase())
    ) {
      return true;
    }

    if (
      userInfo.lastName &&
      passwordLower.includes(userInfo.lastName.toLowerCase())
    ) {
      return true;
    }

    return false;
  }

  /**
   * Comprehensive password validation
   */
  public static validatePassword(
    password: string,
    userInfo?: { email?: string; firstName?: string; lastName?: string },
  ): {
    isValid: boolean;
    errors: string[];
    strength: "weak" | "medium" | "strong";
  } {
    const strengthCheck = this.validatePasswordStrength(password);
    const errors = [...strengthCheck.errors];

    if (this.isCommonPassword(password)) {
      errors.push(
        "Password is too common. Please choose a more unique password",
      );
    }

    if (userInfo && this.containsUserInfo(password, userInfo)) {
      errors.push("Password should not contain your personal information");
    }

    return {
      isValid: errors.length === 0,
      errors,
      strength: strengthCheck.strength,
    };
  }
}

export default PasswordUtil;
