export class ValidationUtil {
  /**
   * Validate email format
   */
  public static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate email domain
   */
  public static isValidEmailDomain(
    email: string,
    allowedDomains: string[],
  ): boolean {
    if (!this.isValidEmail(email)) {
      return false;
    }

    const domain = email.split("@")[1].toLowerCase();
    return allowedDomains.some((allowed) => domain === allowed.toLowerCase());
  }

  /**
   * Extract domain from email
   */
  public static extractDomain(email: string): string | null {
    if (!this.isValidEmail(email)) {
      return null;
    }

    return email.split("@")[1].toLowerCase();
  }

  /**
   * Validate phone number (basic international format)
   */
  public static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const cleanedPhone = phone.replace(/[\s\-()]/g, "");
    return phoneRegex.test(cleanedPhone);
  }

  /**
   * Normalize phone number
   */
  public static normalizePhone(phone: string): string {
    return phone.replace(/[\s\-()]/g, "");
  }

  /**
   * Validate URL format
   */
  public static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate UUID format
   */
  public static isValidUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Validate date format (YYYY-MM-DD)
   */
  public static isValidDate(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return false;
    }

    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }

  /**
   * Validate date is in the past
   */
  public static isDateInPast(date: string | Date): boolean {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.getTime() < Date.now();
  }

  /**
   * Validate date is in the future
   */
  public static isDateInFuture(date: string | Date): boolean {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.getTime() > Date.now();
  }

  /**
   * Sanitize string input
   */
  public static sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, "");
  }

  /**
   * Validate string length
   */
  public static isValidLength(
    input: string,
    min: number,
    max: number,
  ): { isValid: boolean; error?: string } {
    const length = input.trim().length;

    if (length < min) {
      return {
        isValid: false,
        error: `Must be at least ${min} characters long`,
      };
    }

    if (length > max) {
      return {
        isValid: false,
        error: `Must not exceed ${max} characters`,
      };
    }

    return { isValid: true };
  }

  /**
   * Validate array is not empty
   */
  public static isNonEmptyArray<T>(arr: T[]): boolean {
    return Array.isArray(arr) && arr.length > 0;
  }

  /**
   * Validate object has required keys
   */
  public static hasRequiredKeys<T extends Record<string, unknown>>(
    obj: T,
    keys: (keyof T)[],
  ): { isValid: boolean; missingKeys: (keyof T)[] } {
    const missingKeys = keys.filter(
      (key) => !(key in obj) || obj[key] === undefined,
    );

    return {
      isValid: missingKeys.length === 0,
      missingKeys,
    };
  }

  /**
   * Validate enum value
   */
  public static isValidEnumValue<T extends Record<string, string>>(
    value: string,
    enumObj: T,
  ): value is T[keyof T] {
    return Object.values(enumObj).includes(value);
  }

  /**
   * Validate pagination parameters
   */
  public static validatePagination(
    page?: number,
    limit?: number,
  ): { page: number; limit: number; offset: number } {
    const validPage = page && page > 0 ? page : 1;
    const validLimit = limit && limit > 0 && limit <= 100 ? limit : 10;
    const offset = (validPage - 1) * validLimit;

    return {
      page: validPage,
      limit: validLimit,
      offset,
    };
  }

  /**
   * Check if value is numeric
   */
  public static isNumeric(value: string): boolean {
    return !isNaN(Number(value)) && !isNaN(parseFloat(value));
  }

  /**
   * Validate alphanumeric string
   */
  public static isAlphanumeric(value: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(value);
  }

  /**
   * Validate boolean value
   */
  public static isBoolean(value: unknown): value is boolean {
    return typeof value === "boolean";
  }

  /**
   * Convert string to boolean
   */
  public static toBoolean(value: string): boolean {
    const lowerValue = value.toLowerCase();
    return lowerValue === "true" || lowerValue === "1" || lowerValue === "yes";
  }
}

export default ValidationUtil;
