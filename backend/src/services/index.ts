import { registerUser, loginUser } from "./auth.service";
import { generateAuthToken } from "./token.service";
import { getDetailsById, postDetails } from "./user.service";

export const authService = { registerUser, loginUser };
export const tokenService = { generateAuthToken };
export const userService = { getDetailsById, postDetails };
