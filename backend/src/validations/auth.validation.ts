import Joi, { ObjectSchema } from "joi";

/**
 * Validation schema for registering user
 */
const register: ObjectSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export { register };
