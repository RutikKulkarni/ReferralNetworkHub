import {
  axios,
  generateSnackbar,
  catchError,
  validateUserData,
  persistUser,
  clearUserData,
} from "./imports";
import { Config } from "../../App";

/**
 * Fetches user details from the API.
 *
 * @param {string} userId - The ID of the user.
 * @returns {Object} - The user details if the request is successful.
 */
const fetchUserDetails = async (userId) => {
  try {
    let response = await axios.get(`${Config.endpoint}user/details/${userId}`, {
      withCredentials: true,
    });
    if (response.status === 200) {
      generateSnackbar(response.data.message, "success", 2000);
      return response.data;
    }
  } catch (err) {
    catchError(err);
  }
};

/**
 * Logs in a user by validating the user data, sending a login request to the API,
 * and handling the user session.
 *
 * @param {Object} userData - The user data containing email and password.
 * @param {Function} setIsLoading - Function to set the loading state.
 * @param {boolean} rememberMe - Flag indicating if the user wants to be remembered.
 * @param {Function} setUserData - Function to set the user data state.
 * @param {Function} navigate - Function to navigate to a different route.
 */
const loginUser = async (userData, setIsLoading, setUserData, navigate) => {
  try {
    const validationMessage = validateUserData(userData);
    if (validationMessage === true) {
      setIsLoading(true);
      const response = await axios.post(
        `${Config.endpoint}auth/login`,
        userData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        const fetchedUserData = await fetchUserDetails(response.data.user._id);
        generateSnackbar(response.data.message, "success", 2000);

        persistUser(response.data.user._id, response.data.token, "session");

        setUserData({ email: "", password: "" });

        if (!fetchedUserData?.userInfo?.userDetails) {
          navigate("/editAccountInfo");
        } else {
          navigate("/explore");
        }
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

export { loginUser };
