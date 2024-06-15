import { registerUser, loginUser } from "./auth.service";
import { generateAuthToken } from "./token.service";
import { getUserDetailsById } from "./user.service";

export const authService = { registerUser, loginUser };
export const tokenService = { generateAuthToken };
export const userService = { getUserDetailsById };
