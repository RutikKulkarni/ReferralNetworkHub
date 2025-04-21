// import rateLimit from "express-rate-limit"

// // Rate limiter for password reset requests
// export const rateLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // limit each IP to 5 requests per windowMs
//   message: {
//     message: "Too many requests, please try again after 15 minutes",
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// })

import rateLimit from "express-rate-limit";

// General purpose rate limiter (register/login)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // allow more attempts
  message: {
    message: "Too many attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter for password reset
export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many password reset attempts. Try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
