/**
 * Validates user data to ensure that the name, username, and password meet the minimum length requirement.
 *
 * @param {Object} data - The user data to be validated.
 * @param {string} data.name - The user's name.
 * @param {string} data.username - The user's username.
 * @param {string} data.password - The user's password.
 * @returns {string|boolean} - Returns an error message if validation fails, otherwise returns true.
 */
const validateUserData = (data) => {
  let { name, username, password } = data;
  let errMsg = "must be at least 6 characters!";

  if (name?.length < 5) {
    return "Name " + errMsg;
  } else if (username?.length < 5) {
    return "Username " + errMsg;
  } else if (password?.length < 5) {
    return "Password " + errMsg;
  } else {
    return true;
  }
};

export { validateUserData };
