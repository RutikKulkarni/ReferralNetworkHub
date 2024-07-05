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

/** -------------- Protected Private Routes --------------
 * Middleware for protecting additional routes.
 * Ensures that the following routes are accessible only to authenticated users:
 * - /explore
 * - /myAccount
 * - /editAccountInfo
 *
 * Each route is protected by the 'auth' middleware, which verifies the user's authentication status.
 */

/**
 * Route handler for accessing the explore page.
 *
 * @name GET /explore
 * @function
 * @memberof module:routes/userRoutes
 * @param {Function} middleware - Middleware function to authenticate the request.
 * @param {Function} handler - Request handler function for accessing the explore page.
 * @returns {void}
 */
router.get("/explore", auth, (req, res) => {
  res.send({ message: "Explore route" });
});
/**
 * Route handler for accessing the user's account page.
 *
 * @name GET /myAccount
 * @function
 * @memberof module:routes/userRoutes
 * @param {Function} middleware - Middleware function to authenticate the request.
 * @param {Function} handler - Request handler function for accessing the user's account page.
 * @returns {void}
 */
router.get("/myAccount", auth, (req, res) => {
  res.send({ message: "My Account route" });
});
/**
 * Route handler for accessing the edit account info page.
 *
 * @name GET /editAccountInfo
 * @function
 * @memberof module:routes/userRoutes
 * @param {Function} middleware - Middleware function to authenticate the request.
 * @param {Function} handler - Request handler function for accessing the edit account info page.
 * @returns {void}
 */
router.get("/editAccountInfo", auth, (req, res) => {
  res.send({ message: "Edit Account Info route" });
});

export default router;
