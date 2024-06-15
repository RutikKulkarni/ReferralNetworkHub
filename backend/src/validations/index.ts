import { register, login } from "./auth.validation";
import { getUserDetails } from "./user.validations";

export const authValidation = { register, login };
export const userValidation = { getUserDetails };
