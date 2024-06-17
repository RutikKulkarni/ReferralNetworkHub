import { generateSnackbar } from "./snackbarGenerator";

/**
 * Catches and handles errors from API requests, displaying an appropriate snackbar message.
 * 
 * @param {Object} err - The error object caught from the API request.
 */
const catchError = (err) => {
  const status = err.response?.status;
  const message =
    status === 500 || status === 400
      ? err.response?.data.message
      : err.response?.statusText;
  generateSnackbar(message, "error", 2000);
};

export { catchError };
