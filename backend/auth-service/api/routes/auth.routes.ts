import { Router } from "express"
import {
  register,
  login,
  refreshToken,
  logout,
  validateToken,
  forgotPassword,
  resetPassword,
  updateUserProfile,
} from "../controllers/auth.controller"
import { rateLimiter } from "../middleware/rate-limiter"
import { verifyServiceToken } from "../middleware/auth"

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.post("/refresh-token", refreshToken)
router.post("/logout", logout)
router.post("/validate-token", validateToken)

// Password reset routes with rate limiting
router.post("/forgot-password", rateLimiter, forgotPassword)
router.post("/reset-password", rateLimiter, resetPassword)

// Internal API for updating user profile data
// This should be secured to only allow requests from other services
router.put("/users/:userId/profile", verifyServiceToken, updateUserProfile)

export default router;
