import express from "express";
import { authController } from "../controllers";
import { authValidation } from "../validations";
import { validate } from "../middlewares";

const router = express.Router();

/**
 * Route handler for registering a new user.
 *
 * @name POST /register
 * @function
 * @memberof module:routes/authRoutes
 * @param {string} path - The path for the registration endpoint.
 * @param {Function} middleware - Middleware function to validate the request body.
 * @param {Function} handler - Request handler function for registering a user.
 * @returns {void}
 */
router.post(
  "/register",
  validate.body(authValidation.register),
  (req, res, next) => authController.register(req, res, next)
);

export default router;
