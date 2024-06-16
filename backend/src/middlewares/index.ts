import { validateBody, validateParams } from "./validate.middleware";

export const validate = { body: validateBody, params: validateParams };
