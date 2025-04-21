import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  validateToken,
  forgotPassword,
  resetPassword,
  getMe,
} from "../controllers/auth.controller";
import { authLimiter, passwordResetLimiter } from "../middleware/rate-limiter";

const router = Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/validate-token", validateToken);
router.get("/me", getMe);

// Password reset routes with rate limiting
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.post("/reset-password", passwordResetLimiter, resetPassword);

export default router;
