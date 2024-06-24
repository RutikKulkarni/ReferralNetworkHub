/**
 * Persists user information in local storage.
 *
 * @param {string} userId - The user's unique identifier.
 * @param {string} token - The authentication token for the user.
 * @param {string} loginType - The type of login used (e.g., 'email', 'social', etc.).
 * @param {string|null} email - The user's email, optional and only stored if 'rememberMe' is true.
 * @param {string|null} password - The user's password, optional and only stored if 'rememberMe' is true.
 * @returns {void}
 */

const persistUser = (userId, token, loginType, email = null, password = null) => {
  localStorage.setItem("userId", userId);
  localStorage.setItem("token", token);
  localStorage.setItem("loginType", loginType);
  if (loginType === "rememberMe") {
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);
  }
};

const clearUserData = (retainEmailPassword = false) => {
  localStorage.removeItem("userId");
  localStorage.removeItem("token");
  localStorage.removeItem("loginType");
  if (!retainEmailPassword) {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
  }
};

const isLoggedIn = () => {
  return localStorage.getItem("token") !== null;
};

export { persistUser, clearUserData, isLoggedIn };