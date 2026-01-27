/**
 * JWT Utility Functions
 * Handles JWT token generation, verification, and decoding
 */

import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { JWTPayload, RefreshTokenPayload, UserType } from "../types";

export class JWTUtil {
  /**
   * Generate access token
   */
  public static generateAccessToken(payload: JWTPayload): string {
    const options: SignOptions = {
      expiresIn: config.jwt.accessTokenExpiry as jwt.SignOptions["expiresIn"],
      issuer: config.jwt.issuer,
      audience: config.jwt.audience,
    };
    return jwt.sign(payload, config.jwt.accessTokenSecret, options);
  }

  /**
   * Generate refresh token
   */
  public static generateRefreshToken(payload: RefreshTokenPayload): string {
    const options: SignOptions = {
      expiresIn: config.jwt.refreshTokenExpiry as jwt.SignOptions["expiresIn"],
      issuer: config.jwt.issuer,
      audience: config.jwt.audience,
    };
    return jwt.sign(payload, config.jwt.refreshTokenSecret, options);
  }

  /**
   * Verify access token
   */
  public static verifyAccessToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, config.jwt.accessTokenSecret, {
        issuer: config.jwt.issuer,
        audience: config.jwt.audience,
      }) as JWTPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Access token has expired");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid access token");
      }
      throw new Error("Token verification failed");
    }
  }

  /**
   * Verify refresh token
   */
  public static verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      const decoded = jwt.verify(token, config.jwt.refreshTokenSecret, {
        issuer: config.jwt.issuer,
        audience: config.jwt.audience,
      }) as RefreshTokenPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Refresh token has expired");
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid refresh token");
      }
      throw new Error("Token verification failed");
    }
  }

  /**
   * Decode token without verification
   */
  public static decodeToken(
    token: string,
  ): JWTPayload | RefreshTokenPayload | null {
    try {
      const decoded = jwt.decode(token) as JWTPayload | RefreshTokenPayload;
      return decoded;
    } catch {
      return null;
    }
  }

  /**
   * Extract token from Authorization header
   */
  public static extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return null;
    }

    return parts[1];
  }

  /**
   * Generate token pair (access + refresh)
   */
  public static generateTokenPair(
    userId: string,
    userType: UserType,
    email: string,
    sessionId: string | undefined,
    tokenVersion: number,
    organizationId?: string,
  ): { accessToken: string; refreshToken: string; expiresIn: number } {
    const accessTokenPayload: JWTPayload = {
      userId,
      userType,
      email,
      sessionId,
      tokenVersion,
      organizationId,
    };

    const refreshTokenPayload: RefreshTokenPayload = {
      userId,
      sessionId,
      tokenVersion,
    };

    const accessToken = this.generateAccessToken(accessTokenPayload);
    const refreshToken = this.generateRefreshToken(refreshTokenPayload);
    const expiresIn = this.parseExpiry(config.jwt.accessTokenExpiry);

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  /**
   * Parse JWT expiry string to seconds
   */
  public static parseExpiry(expiry: string): number {
    const units: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };

    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 3600;
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    return value * (units[unit] || 1);
  }

  /**
   * Validate token version
   */
  public static isTokenVersionValid(
    tokenVersion: number,
    userTokenVersion: number,
  ): boolean {
    return tokenVersion === userTokenVersion;
  }
}

export default JWTUtil;
