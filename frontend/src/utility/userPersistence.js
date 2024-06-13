/**
 * Persists user information in local storage.
 *
 * @param {string} userId - The user's unique identifier.
 * @param {string} token - The authentication token for the user.
 * @param {string} loginType - The type of login used (e.g., 'email', 'social', etc.).
 * @returns {void}
 */
const persistUser = (userId, token, loginType) => {
  localStorage.setItem("userId", userId);
  localStorage.setItem("token", token);
  localStorage.setItem("loginType", loginType);
};

export { persistUser };
