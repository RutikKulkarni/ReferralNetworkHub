
import { validateEmail } from "./ValidateEmail";

export const validateUserData = (userData) => {
 g
  if (!userData.email) {
    return "Email is required.";
  }
  if (!validateEmail(userData.email)) {
    return "Please enter a valid email address.";
  }
  if (!userData.password) {
    return "Password is required.";
  }
  if (userData.password.length < 6) {
    return "Password must be at least 6 characters.";
  }
  return true;
};
