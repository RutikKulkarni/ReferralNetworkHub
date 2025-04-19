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
import { rateLimiter } from "../middleware/rate-limiter";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.post("/validate-token", validateToken);
router.get("/me", getMe);

// Password reset routes with rate limiting
router.post("/forgot-password", rateLimiter, forgotPassword);
router.post("/reset-password", rateLimiter, resetPassword);

export default router;
