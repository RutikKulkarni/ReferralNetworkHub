import rateLimit from "express-rate-limit";

/**
 * Rate limiting middleware configuration.
 *
 * Applies rate limiting to restrict the number of requests from an IP address within a specified time window.
 * - `windowMs`: Time window in milliseconds for which to count requests.
 * - `max`: Maximum number of requests allowed from a single IP within `windowMs` milliseconds.
 * - `message`: Message sent when the request limit is exceeded.
 *
 * @name Rate Limiter Middleware
 * @function
 * @memberof module:middlewares
 * @returns {Object} Express middleware instance configured for rate limiting.
 */

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100, 
  message: "Too many requests from this IP, please try again later.",
});

export default limiter;
