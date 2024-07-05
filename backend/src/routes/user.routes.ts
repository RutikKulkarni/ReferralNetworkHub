import express from "express";
import { userController } from "../controllers";
import { validate } from "../middlewares";
import { userValidation } from "../validations";
import { auth, cookieAuth } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * Route handler for getting user details by user ID.
 *
 * @name GET /details/:userId
 * @function
 * @memberof module:routes/userRoutes
 * @param {string} userId.path.required - The ID of the user to fetch details for.
 * @param {Function} middleware - Middleware function to authenticate the request.
 * @param {Function} middleware - Middleware function to validate the request parameters.
 * @param {Function} handler - Request handler function for getting user details.
 * @returns {void}
 */
router.get(
  "/details/:userId",
  cookieAuth,
  validate.params(userValidation.getUserDetails),
  (req, res, next) => userController.getUserDetails(req, res, next)
);

/**
 * Route handler for updating user details by user ID.
 *
 * @name PUT /details/:userId
 * @function
 * @memberof module:routes/userRoutes
 * @param {string} userId.path.required - The ID of the user to update details for.
 * @param {Function} middleware - Middleware function to authenticate the request.
 * @param {Function} middleware - Middleware function to validate the request parameters.
 * @param {Function} middleware - Middleware function to validate the request body.
 * @param {Function} handler - Request handler function for updating user details.
 * @returns {void}
 */
router.patch(
  "/details/:userId",
  cookieAuth,
  validate.params(userValidation.getUserDetails),
  validate.body(userValidation.updateUserDetails),
  (req, res, next) => userController.postUserDetails(req, res, next)
);

export default router;
