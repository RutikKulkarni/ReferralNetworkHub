import Joi, { ObjectSchema } from "joi";
import objectId from "./custom.validations";

/**
 * Schema for validating user details object.
 *
 * @type {ObjectSchema}
 */
const getUserDetails: ObjectSchema = Joi.object().keys({
  userId: Joi.string().required().custom(objectId),
});

export { getUserDetails };
