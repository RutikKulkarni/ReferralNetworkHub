import { config } from "../config/config";
import Jwt from "jsonwebtoken";
import { UserDocument } from "../models/user.model";

/**
 * Generate jwt token
 * @param {ObjectId} userId - Mongo user id
 * @param {Number} expires - Token expiration time in seconds since unix epoch
 * @param {string} [secret] - Secret key to sign the token, defaults to config.SECRET_KEY
 * @returns {string}
 */
const generateToken = (
  userId: string,
  expires: number,
  secret: string = config.SECRET_KEY
): string => {
  let payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: expires,
  };

  let token = Jwt.sign(payload, secret);

  return token;
};

/**
 * Generate auth token
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthToken = async (user: UserDocument): Promise<object> => {
  let tokenExpires = Math.floor(Date.now() / 1000) + 300 * 60;
  let token = generateToken(user._id, tokenExpires);

  return {
    token,
    expires: new Date(tokenExpires * 1000).toLocaleString(),
  };
};

export { generateAuthToken };
