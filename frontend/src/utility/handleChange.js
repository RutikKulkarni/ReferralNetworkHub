/**
 * Handles changes in input fields and updates the corresponding state.
 *
 * @param {Object} event - The event object from the input field change.
 * @param {Function} setState - Function to update the state.
 */
const handleChange = (event, setState) => {
  setState((prev) => ({
    ...prev,
    [event.target.name]: event.target.value,
  }));
};

export { handleChange };
