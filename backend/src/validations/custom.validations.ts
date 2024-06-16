/**
 * Validate if a value is a valid MongoDB ObjectId.
 *
 * @param {string} value - The value to validate.
 * @param {any} helpers - Joi helpers object for custom validation.
 * @returns {string} The validated value if it's a valid ObjectId.
 */
const objectId = (value: string, helpers: any): string => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

export default objectId;
