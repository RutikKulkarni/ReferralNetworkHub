/**
 * Sets the theme for the application.
 *
 * @param {string} theme - The theme to be set. Possible values: 'light', 'dark', etc.
 * @returns {void}
 */
const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
};

/**
 * Retrieves the current theme from local storage.
 *
 * @returns {string} - The currently set theme. Defaults to 'light' if no theme is set.
 */
const getTheme = () => {
  return localStorage.getItem("theme") || "light";
};

/**
 * Determines the theme preference based on the device's color scheme.
 *
 * @returns {string} - The device's preferred color scheme. Possible values: 'light' or 'dark'.
 */
const getDeviceTheme = () => {
  const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
  return darkThemeMq.matches ? "dark" : "light";
};

export { setTheme, getTheme, getDeviceTheme };
