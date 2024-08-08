/**
 * Sets a cookie with the given name, value, and expiration days.
 *
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {number} days - The number of days until the cookie expires.
 */
const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/`;
};

/**
 * Gets the value of a cookie by name.
 *
 * @param {string} name - The name of the cookie.
 * @returns {string|null} - The value of the cookie, or null if not found.
 */
const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

/**
 * Deletes a cookie by name.
 *
 * @param {string} name - The name of the cookie.
 */
const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

/**
 * Persists user information in cookies.
 *
 * @param {string} userId - The user's unique identifier.
 * @param {string} token - The authentication token for the user.
 * @param {string} loginType - The type of login used (e.g., 'session').
 * @returns {void}
 */
const persistUser = (userId, token, loginType) => {
  setCookie("userId", userId, 30);
  setCookie("token", token, 30);
  setCookie("loginType", loginType, 30);
};

/**
 * Clears user data from cookies.
 */
const clearUserData = () => {
  deleteCookie("userId");
  deleteCookie("token");
  deleteCookie("loginType");
  deleteCookie("email");
  deleteCookie("password");
};

/**
 * Checks if the user is logged in by verifying the presence of a token cookie.
 *
 * @returns {boolean} - True if the user is logged in, false otherwise.
 */
const isLoggedIn = () => {
  return getCookie("token") !== null;
};

export { persistUser, clearUserData, isLoggedIn, getCookie };
