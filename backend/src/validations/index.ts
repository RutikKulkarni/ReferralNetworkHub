import { register, login } from "./auth.validation";
import { getUserDetails, updateUserDetails } from "./user.validations";

export const authValidation = { register, login };
export const userValidation = { getUserDetails, updateUserDetails };
