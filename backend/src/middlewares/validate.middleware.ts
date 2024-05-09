import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { ObjectSchema } from "joi";

/**
 * Middleware to validate request body based on a Joi schema.
 * @param {ObjectSchema} schema - Joi schema for body validation.
 * @returns {Function} Express middleware function.
 */
const validateBody = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let { error } = schema.validate(req.body);

    if (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: error.message });
    }

    next();
  };
};

export { validateBody };
