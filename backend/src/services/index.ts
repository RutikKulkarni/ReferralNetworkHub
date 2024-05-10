import { registerUser, loginUser } from "./auth.service";
import { generateAuthToken } from "./token.service";

export const authService = { registerUser, loginUser };
export const tokenService = {generateAuthToken}