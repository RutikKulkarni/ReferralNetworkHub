import axios from "axios";
import { validateUserData } from "../../utility/validateUserInput";
import { Config } from "../../App";
import { generateSnackbar } from "../../utility/snackbarGenerator";
import { catchError } from "../../utility/catchError";

/**
 * Registers a new user by validating the user data, sending a registration request to the API,
 * and handling the response.
 * 
 * @param {Object} userData - The user data containing name, email, and password.
 * @param {Function} setIsLoading - Function to set the loading state.
 * @param {Function} setUserData - Function to set the user data state.
 * @param {Function} navigate - Function to navigate to a different route.
 */
const registerUser = async (userData, setIsLoading, setUserData, navigate) => {
  try {
    const validationMessage = validateUserData(userData);
    if (validationMessage === true) {
      setIsLoading(true);
      const response = await axios.post(
        `${Config.endpoint}auth/register`,
        userData
      );

      if (response.status === 201) {
        generateSnackbar(response?.data?.message, "success", 2000);
        setUserData({ name: "", email: "", password: "" });
        navigate("/login");
      }
      setIsLoading(false);
    } else {
      generateSnackbar(validationMessage, "warning", 2000);
    }
  } catch (err) {
    catchError(err);
    setIsLoading(false);
  }
};

export { registerUser };
