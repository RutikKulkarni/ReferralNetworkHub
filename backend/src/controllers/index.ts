import { register, login } from "./auth.controller";
import { getUserDetails } from "./user.controller";

export const authController = { register, login };
export const userController = { getUserDetails };
