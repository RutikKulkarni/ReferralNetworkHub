/**
 * Response Utility Functions
 * Standardized API response helpers
 */

import { Response } from "express";
import { ApiResponse } from "../types";
import { HTTP_STATUS } from "../../constants";

export class ResponseUtil {
  /**
   * Send success response
   */
  public static success<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = HTTP_STATUS.OK,
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message: message || "Request successful",
      data,
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send error response
   */
  public static error(
    res: Response,
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errors?: string[] | Record<string, string>,
  ): Response {
    const response: ApiResponse<null> = {
      success: false,
      message,
      data: null,
    };

    if (errors) {
      response.error = {
        code: "VALIDATION_ERROR",
        details: errors,
      };
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Send paginated response
   */
  public static paginated<T>(
    res: Response,
    data: T[],
    total: number,
    page: number,
    limit: number,
    message?: string,
  ): Response {
    const response = {
      success: true,
      message: message || "Request successful",
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    return res.status(HTTP_STATUS.OK).json(response);
  }

  /**
   * Send created response
   */
  public static created<T>(res: Response, data: T, message?: string): Response {
    return this.success(
      res,
      data,
      message || "Resource created successfully",
      HTTP_STATUS.CREATED,
    );
  }

  /**
   * Send no content response
   */
  public static noContent(res: Response): Response {
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  }

  /**
   * Send bad request response
   */
  public static badRequest(
    res: Response,
    message: string,
    errors?: string[] | Record<string, string>,
  ): Response {
    return this.error(res, message, HTTP_STATUS.BAD_REQUEST, errors);
  }

  /**
   * Send unauthorized response
   */
  public static unauthorized(res: Response, message?: string): Response {
    return this.error(res, message || "Unauthorized", HTTP_STATUS.UNAUTHORIZED);
  }

  /**
   * Send forbidden response
   */
  public static forbidden(res: Response, message?: string): Response {
    return this.error(res, message || "Forbidden", HTTP_STATUS.FORBIDDEN);
  }

  /**
   * Send not found response
   */
  public static notFound(res: Response, message?: string): Response {
    return this.error(
      res,
      message || "Resource not found",
      HTTP_STATUS.NOT_FOUND,
    );
  }

  /**
   * Send conflict response
   */
  public static conflict(res: Response, message: string): Response {
    return this.error(res, message, HTTP_STATUS.CONFLICT);
  }

  /**
   * Send validation error response
   */
  public static validationError(
    res: Response,
    errors: string[] | Record<string, string>,
  ): Response {
    return this.error(
      res,
      "Validation failed",
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errors,
    );
  }

  /**
   * Send rate limit exceeded response
   */
  public static rateLimitExceeded(res: Response, message?: string): Response {
    return this.error(
      res,
      message || "Too many requests",
      HTTP_STATUS.TOO_MANY_REQUESTS,
    );
  }

  /**
   * Send internal server error response
   */
  public static serverError(res: Response, message?: string): Response {
    return this.error(
      res,
      message || "Internal server error",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }
}

export default ResponseUtil;
