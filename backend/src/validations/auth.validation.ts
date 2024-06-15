import Joi, { ObjectSchema } from "joi";

/**
 * Validation schema for registering user
 */
const register: ObjectSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

/**
 * Validation schema for login user
 */
const login: ObjectSchema = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

export { register, login };
