import jwt, { SignOptions } from "jsonwebtoken";
import config from "../config";
import RefreshToken from "../models/refresh-token.model";

/**
 * Generate JWT access token
 * @param payload Token payload
 * @returns Access token
 */
export const generateAccessToken = (payload: any): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiresIn,
  } as SignOptions);
};

/**
 * Generate JWT refresh token
 * @param payload Token payload
 * @returns Refresh token
 */
export const generateRefreshToken = (payload: any): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as SignOptions);
};

/**
 * Verify JWT token
 * @param token JWT token
 * @param secret Secret key
 * @returns Decoded token payload
 */
export const verifyToken = (token: string, secret: string): any => {
  return jwt.verify(token, secret);
};

/**
 * Save refresh token to database
 * @param token Refresh token
 * @param userId User ID
 * @returns Saved token document
 */
export const saveRefreshToken = async (
  token: string,
  userId: string
): Promise<any> => {
  const refreshToken = new RefreshToken({
    token,
    userId,
  });
  return await refreshToken.save();
};

/**
 * Delete refresh token from database
 * @param token Refresh token
 * @returns Deletion result
 */
export const deleteRefreshToken = async (token: string): Promise<any> => {
  return await RefreshToken.findOneAndDelete({ token });
};

/**
 * Delete all refresh tokens for a user
 * @param userId User ID
 * @returns Deletion result
 */
export const deleteAllUserRefreshTokens = async (
  userId: string
): Promise<any> => {
  return await RefreshToken.deleteMany({ userId });
};

/**
 * Find refresh token in database
 * @param token Refresh token
 * @returns Token document
 */
export const findRefreshToken = async (token: string): Promise<any> => {
  return await RefreshToken.findOne({ token });
};

/**
 * Clean up expired tokens from database
 * This can be run periodically as a cron job
 * @returns Cleanup result
 */
export const cleanupExpiredTokens = async (): Promise<any> => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() - 7); // 7 days ago
  return await RefreshToken.deleteMany({ createdAt: { $lt: expiryDate } });
};
