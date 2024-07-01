/**
 * IMPORTANT: Please avoid making direct changes to this file.
 * Use environment variables or configuration options to modify behavior.
 */

/**
 * Retrieves the React environment variable. Defaults to "development" if not set.
 *
 * @returns {string} The current React environment ("development", "deployment", etc.).
 */
export const getReactEnv = () => {
  const env = process.env.REACT_APP_ENV || "development";
  return env;
};

/**
 * Retrieves configuration based on the React environment.
 * Uses the environment to determine API endpoint URLs.
 *
 * @returns {Object} Configuration object containing endpoint URLs.
 */
export const getConfig = () => {
  const REACT_ENV = getReactEnv();

  return {
    endpoint:
      REACT_ENV === "development"
        ? "http://localhost:8082/api/v1/"
        : REACT_ENV === "deployment"
        ? "https://referralnetworkhub.onrender.com/api/v1/"
        : "",
  };
};
