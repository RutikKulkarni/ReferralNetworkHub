/**
 * IMPORTANT: Please avoid making direct changes to this file.
 * Use environment variables or configuration options to modify behavior.
 */

export const getReactEnv = () => {
  const env = process.env.REACT_APP_ENV || "development";
  return env;
};

export const getConfig = () => {
  const REACT_ENV = getReactEnv();

  return {
    endpoint:
      REACT_ENV === "development"
        ? "http://localhost:8082/api/"
        : REACT_ENV === "deployment"
        ? "https://referralnetworkhub.onrender.com/api/"
        : "",
  };
};
