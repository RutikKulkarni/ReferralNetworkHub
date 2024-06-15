import express from "express";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);

export default router;
