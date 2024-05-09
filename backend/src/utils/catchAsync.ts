import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

/**
 * Wraps an asynchronous function and catches any errors that occur during its execution.
 * @param {Function} fn - Asynchronous function to be wrapped
 * @returns {Function} - Express middleware function
 */
const catchAsync =
  (fn: Function): Function =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      return res.status(err.statusCode || httpStatus.BAD_REQUEST).send({
        message: err.message,
        statusCode: err.statusCode || httpStatus.BAD_REQUEST,
      });
    });
  };

export { catchAsync };
