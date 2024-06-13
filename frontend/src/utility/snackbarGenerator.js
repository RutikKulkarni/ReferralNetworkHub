import { enqueueSnackbar } from "notistack";

/**
 * Generates and displays a snackbar notification.
 *
 * @param {string} msg - The message to be displayed in the snackbar.
 * @param {string} variant - The variant of the snackbar. Possible values: 'default', 'error', 'success', 'warning', 'info'.
 * @param {number} duration - The duration for which the snackbar should be visible (in milliseconds).
 * @returns {void}
 */
const generateSnackbar = (msg, variant, duration) => {
  return enqueueSnackbar(msg, { variant: variant, autoHideDuration: duration });
};

export { generateSnackbar };
