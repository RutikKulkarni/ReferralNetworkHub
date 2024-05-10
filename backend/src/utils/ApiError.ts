/**
 * Custom error class for API errors.
 */
class ApiError extends Error {
  public statusCode: number;

  /**
   * Constructs an instance of ApiError.
   * @param {string} message - Error message.
   * @param {number} statusCode - HTTP status code.
   */
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { ApiError };
