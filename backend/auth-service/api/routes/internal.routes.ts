import { Router } from "express";
import { internalAuth } from "../middleware/internal-auth";
import { updateUserProfile } from "../controllers/internal.controller";

const router = Router();

// All routes in this file are protected by the internal API key
// Route to update user profile data in auth service
router.put("/users/:userId/profile", internalAuth, updateUserProfile);

export default router;
