import express from "express";
import { userController } from "../controllers";
import { validate } from "../middlewares";
import { userValidation } from "../validations";
import { auth } from "../middlewares/auth.middleware";

const router = express.Router();

/**
 * Route handler for getting user details by user ID.
 *
 * @name GET /details/:userId
 * @function
 * @memberof module:routes/userRoutes
 * @param {string} userId.path.required - The ID of the user to fetch details for.
 * @param {Function} middleware - Middleware function to authenticate the request.
 * @param {Function} handler - Request handler function for getting user details.
 * @returns {void}
 */
router.get(
  "/details/:userId",
  auth,
  validate.params(userValidation.getUserDetails),
  (req, res, next) => userController.getUserDetails(req, res, next)
);

export default router;
